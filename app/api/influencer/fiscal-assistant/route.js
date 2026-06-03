import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUSINESS_TYPE_LABEL = {
  individual: 'Particulier',
  auto_entrepreneur: 'Auto-entrepreneur / micro-entreprise',
  company: 'Société',
}

const fmtEUR = (n) => `${(Number(n) || 0).toLocaleString('fr-FR')} €`

export async function POST(req) {
  try {
    // 0. Clé API présente ?
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "L'assistant IA n'est pas encore configuré (clé API manquante)." },
        { status: 503 }
      )
    }

    // 1. Auth
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // 2. Messages du client (texte, ou texte + images)
    const body = await req.json().catch(() => ({}))
    const rawMessages = Array.isArray(body.messages) ? body.messages : []
    const VALID_IMG = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const cleaned = rawMessages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && (typeof m.content === 'string' || Array.isArray(m.content)))
      .slice(-12)
    const lastIdx = cleaned.length - 1
    const messages = cleaned.map((m, idx) => {
      if (Array.isArray(m.content)) {
        if (idx === lastIdx) {
          const blocks = m.content
            .filter(b => b && (
              (b.type === 'text' && typeof b.text === 'string') ||
              (b.type === 'image' && b.source?.type === 'base64' && VALID_IMG.includes(b.source.media_type) && typeof b.source.data === 'string')
            ))
            .slice(0, 6)
            .map(b => b.type === 'text' ? { type: 'text', text: b.text.slice(0, 4000) } : b)
          return { role: m.role, content: blocks.length ? blocks : 'Bonjour' }
        }
        // messages plus anciens : on retire les images (coût/poids), on garde le texte
        const text = m.content.filter(b => b?.type === 'text' && b.text).map(b => b.text).join(' ').slice(0, 4000) || '[image envoyée]'
        return { role: m.role, content: text }
      }
      return { role: m.role, content: String(m.content).slice(0, 4000) }
    }).filter(m => (Array.isArray(m.content) ? m.content.length : m.content.trim()))
    if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'Message invalide' }, { status: 400 })
    }

    // 3. Contexte fiscal réel du créateur (facultatif)
    let ctx = ''
    try {
      const { data: influencer } = await supabaseAdmin
        .from('influencers').select('id').eq('user_id', userId).single()
      if (influencer) {
        const year = new Date().getFullYear()
        const { data: report } = await supabaseAdmin.rpc('get_creator_annual_report', {
          p_influencer_id: influencer.id,
          p_year: year,
        })
        if (report) {
          ctx = `Contexte réel du créateur (compte PARTNEXX) :
- Nom : ${report.creator_name || 'Créateur'}
- Statut déclaré : ${BUSINESS_TYPE_LABEL[report.business_type] || 'non défini'}
- Pays : ${report.country || 'France'}
- Revenus nets reçus en ${year} : ${fmtEUR(report.total_recu_createur)}
- Nombre de transactions en ${year} : ${report.nb_transactions || 0}`
        }
      }
    } catch {
      // contexte facultatif, on continue sans
    }

    // 4. System prompt avec garde-fous
    const system = `Tu es l'assistante fiscale et juridique de PARTNEXX, plateforme française de partenariats entre créateurs de contenu et marques. Tu es spécialisée dans la fiscalité ET le droit des créateurs de contenu en France : choix et création de statut (micro-entreprise, EI, société), revenus de partenariats, TVA, cotisations sociales (URSSAF), déclaration de revenus, mais aussi aspects juridiques (contrats de partenariat, droits d'auteur et droit à l'image, mention obligatoire des partenariats rémunérés / publicité, obligations légales, RGPD). Tu réponds avec l'assurance, la précision et la clarté d'une vraie spécialiste, tout en restant pédagogue.

${ctx}

RÈGLES IMPÉRATIVES :
- Malgré ton expertise, tu donnes des informations générales et pédagogiques : tu ne fournis jamais de conseil fiscal ou juridique personnalisé et définitif qui engagerait une responsabilité.
- Tu rappelles, dès que c'est pertinent, que pour sa situation précise le créateur doit confirmer avec un professionnel : un expert-comptable pour la fiscalité et la compta, un avocat pour le juridique.
- Tu n'inventes jamais de chiffres, seuils, taux, articles de loi ou dates précis dont tu n'es pas certaine. En cas de doute, tu le dis et tu renvoies vers les sources officielles (impots.gouv.fr, urssaf.fr, service-public.fr) ou un professionnel.
- Tu restes sur le sujet de la fiscalité, de la comptabilité et du droit des créateurs de contenu en France. Pour une question hors sujet, tu recentres poliment.
- Réponds en français, de façon claire, structurée et bienveillante, pour un créateur non-expert. Évite les pavés ; utilise des listes quand c'est utile.`

    // 5. Appel à l'API Anthropic (Claude)
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // économique ; passe à 'claude-sonnet-4-6' pour des réponses plus poussées
        max_tokens: 1024,
        system,
        messages,
      }),
    })

    if (!aiRes.ok) {
      const errText = await aiRes.text()
      console.error('Erreur Anthropic:', aiRes.status, errText)
      return NextResponse.json({ error: "L'assistant n'a pas pu répondre pour le moment." }, { status: 502 })
    }

    const data = await aiRes.json()
    const reply = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim() || "Désolé, je n'ai pas de réponse à te donner."

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Erreur assistant fiscal:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
