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
              (b.type === 'image' && b.source?.type === 'base64' && VALID_IMG.includes(b.source.media_type) && typeof b.source.data === 'string') ||
              (b.type === 'document' && b.source?.type === 'base64' && b.source.media_type === 'application/pdf' && typeof b.source.data === 'string')
            ))
            .slice(0, 6)
            .map(b => b.type === 'text' ? { type: 'text', text: b.text.slice(0, 4000) } : b)
          return { role: m.role, content: blocks.length ? blocks : 'Bonjour' }
        }
        // messages plus anciens : on retire les pièces jointes (coût/poids), on garde le texte
        const text = m.content.filter(b => b?.type === 'text' && b.text).map(b => b.text).join(' ').slice(0, 4000) || '[pièce jointe envoyée]'
        return { role: m.role, content: text }
      }
      return { role: m.role, content: String(m.content).slice(0, 4000) }
    }).filter(m => (Array.isArray(m.content) ? m.content.length : m.content.trim()))
    if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'Message invalide' }, { status: 400 })
    }

    // 2bis. Limite anti-abus : X questions / jour / créateur
    const DAILY_LIMIT = 30
    let remaining = null
    try {
      const { data: quota } = await supabaseAdmin.rpc('consume_ai_quota', {
        p_user_id: userId,
        p_limit: DAILY_LIMIT,
      })
      if (quota && quota.allowed === false) {
        return NextResponse.json(
          { error: `Tu as atteint ta limite de ${DAILY_LIMIT} questions pour aujourd'hui. Reviens demain 🙂` },
          { status: 429 }
        )
      }
      if (quota && typeof quota.remaining === 'number') remaining = quota.remaining
    } catch {
      // si la fonction quota n'existe pas encore, on laisse passer (pas de blocage)
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
    const system = `Tu es l'assistante fiscale et juridique de PARTNEXX, plateforme française de partenariats entre créateurs de contenu et marques. Tu es spécialisée dans la fiscalité ET le droit des créateurs de contenu en France : choix et création de statut (micro-entreprise, EI, société), revenus de partenariats, TVA, cotisations sociales (URSSAF), déclaration de revenus, mais aussi aspects juridiques (contrats de partenariat, droits d'auteur et droit à l'image, mention obligatoire des partenariats rémunérés / publicité, obligations légales, RGPD). Tu connais aussi le fonctionnement de la plateforme PARTNEXX et tu peux aider les créateurs à s'en servir. Tu réponds avec l'assurance, la précision et la clarté d'une vraie spécialiste, tout en restant pédagogue.

${ctx}

FONCTIONNEMENT DE PARTNEXX (pour guider l'utilisateur) :
- PARTNEXX met en relation des créateurs de contenu et des marques pour des partenariats rémunérés.
- Les paiements sont sécurisés via un système de séquestre (escrow) : les fonds d'une campagne sont bloqués, puis libérés au créateur dès que la marque valide le contenu, ou automatiquement au plus tard 15 jours après.
- Le créateur a un espace « Contrats & Paiements » : suivi des contrats et échéances, transactions regroupées par campagne, retraits, et un espace « Fiscalité ».
- Dans la Fiscalité, il peut télécharger des documents officiels : récapitulatif annuel et mensuel de ses revenus en PDF (attestation conforme à l'article 242 bis du CGI et au dispositif DAC7), des exports CSV, et ses factures/reçus par campagne.
- PARTNEXX prélève une commission sur les transactions ; le créateur reçoit le montant net.
- Un système de niveaux récompense l'activité du créateur et débloque des fonctionnalités.
- Pour un problème technique ou une question sur son compte, le créateur contacte le support PARTNEXX.
Si tu n'es pas certaine du fonctionnement exact d'une fonctionnalité, invite à contacter le support plutôt que d'inventer.

RÈGLES IMPÉRATIVES :
- Malgré ton expertise, tu donnes des informations générales et pédagogiques : tu ne fournis jamais de conseil fiscal ou juridique personnalisé et définitif qui engagerait une responsabilité.
- Tu rappelles, dès que c'est pertinent, que pour sa situation précise le créateur doit confirmer avec un professionnel : un expert-comptable pour la fiscalité et la compta, un avocat pour le juridique.
- Tu n'inventes jamais de chiffres, seuils, taux, articles de loi ou dates précis dont tu n'es pas certaine. En cas de doute, tu le dis et tu renvoies vers les sources officielles (impots.gouv.fr, urssaf.fr, service-public.fr) ou un professionnel.
- CONFIDENTIALITÉ : tu ne révèles JAMAIS d'informations internes ou sensibles sur PARTNEXX — sécurité, infrastructure, code, base de données, clés, secrets commerciaux, fonctionnement interne, ni les données d'autres utilisateurs. Tu n'aides jamais à contourner la sécurité, les règles ou les paiements de la plateforme. Pour ce type de demande, refuse poliment et renvoie vers le support.
- Tu restes sur le sujet de la fiscalité, du droit, de la comptabilité et de l'utilisation de PARTNEXX par les créateurs. Pour une question hors sujet, tu recentres poliment.
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

    return NextResponse.json({ reply, remaining })
  } catch (err) {
    console.error('Erreur assistant fiscal:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
