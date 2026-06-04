import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PLATFORM_LABEL = { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', x: 'X', twitter: 'X', linkedin: 'LinkedIn' }
const LEVELS = [
  { name: 'Bronze', t: 0 }, { name: 'Argent', t: 750 }, { name: 'Or', t: 2500 }, { name: 'Platine', t: 6000 },
  { name: 'Diamant', t: 12500 }, { name: 'Élite', t: 30000 }, { name: 'Champion', t: 60000 }, { name: 'Légende', t: 100000 },
]
const levelName = (s) => { let n = 'Bronze'; for (const l of LEVELS) { if ((s || 0) >= l.t) n = l.name; else break } return n }

// Lundi de la semaine courante (YYYY-MM-DD)
function weekStartISO(d = new Date()) {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = x.getUTCDay() || 7
  x.setUTCDate(x.getUTCDate() - (day - 1))
  return x.toISOString().slice(0, 10)
}

const isReceived = (t) => {
  const amt = Number(t?.influencer_amount ?? t?.amount ?? 0)
  if (t?.status !== 'released' || amt < 1) return false
  const desc = (t?.description || '').toLowerCase()
  if (t?.type === 'refund' || desc.includes('rembours') || desc.includes('refund')) return false
  return true
}

// Insights de secours, calculés directement depuis les données (si l'IA est indisponible)
function fallbackInsights(ctx) {
  const insights = []
  if (ctx.topPlatform) insights.push({ title: `${ctx.topPlatform} est ton réseau moteur`, description: `Concentre tes meilleurs contenus sur ${ctx.topPlatform}, où se trouve la majorité de ton audience.`, confidence: 80, impact: 'high' })
  if (ctx.revTrend !== 0) insights.push({ title: ctx.revTrend > 0 ? 'Tes revenus progressent' : 'Tes revenus ralentissent', description: ctx.revTrend > 0 ? 'Garde le rythme de publication, la dynamique est bonne.' : 'Relance des collaborations : ton activité a baissé récemment.', confidence: 75, impact: ctx.revTrend > 0 ? 'medium' : 'high' })
  insights.push({ title: 'Complète tes réseaux', description: ctx.platformCount < 3 ? 'Connecte plus de réseaux dans ton profil pour multiplier les opportunités.' : 'Tes réseaux sont bien renseignés, continue à les tenir à jour.', confidence: 70, impact: 'medium' })
  const recommendations = [
    { title: 'Régularité', desc: 'Publie au moins 3 fois par semaine pour rester visible.' },
    { title: 'Formats courts', desc: 'Privilégie les vidéos courtes (15-30s), plus performantes.' },
    { title: 'Candidatures', desc: `Postule aux missions qui matchent ton niveau ${ctx.level}.` },
    { title: 'Profil complet', desc: 'Un profil 100% complété améliore ton matching et ton score.' },
  ]
  return { insights: insights.slice(0, 3), recommendations }
}

async function generateWithAI(ctx) {
  if (!process.env.ANTHROPIC_API_KEY) return null
  const system = "Tu es un analyste growth pour créateurs de contenu sur la plateforme PARTNEXX. À partir des données RÉELLES du créateur, génère des conseils personnalisés, concrets et actionnables, en français. Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte autour ni balises Markdown. Format exact : {\"insights\":[{\"title\":\"...\",\"description\":\"...\",\"confidence\":85,\"impact\":\"high\"}],\"recommendations\":[{\"title\":\"...\",\"desc\":\"...\"}]}. Donne EXACTEMENT 3 insights (confidence entre 60 et 95, impact \"high\" ou \"medium\") et 4 recommendations. Titres courts (2-4 mots), descriptions d'une phrase. N'invente aucun chiffre non fourni."

  const prompt = `Données du créateur cette semaine :
- Niveau Partnexx : ${ctx.level} (score ${ctx.score})
- Total abonnés : ${ctx.totalFollowers}
- Réseaux : ${ctx.platformsText || 'aucun connecté'}
- Engagement moyen : ${ctx.avgEngagement}%
- Revenus reçus (90 derniers jours) : ${ctx.rev90}€ ${ctx.revTrend > 0 ? '(en hausse)' : ctx.revTrend < 0 ? '(en baisse)' : '(stable)'}
- Collaborations : ${ctx.activeCollabs} active(s) sur ${ctx.totalCollabs} au total

Génère 3 insights et 4 recommandations personnalisés et utiles à partir de ces données.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, system, messages: [{ role: 'user', content: prompt }] }),
    })
    if (!res.ok) return null
    const json = await res.json()
    let text = (json?.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim()
    text = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed.insights) || !Array.isArray(parsed.recommendations)) return null
    if (parsed.insights.length === 0) return null
    // Nettoyage / bornage
    parsed.insights = parsed.insights.slice(0, 3).map(i => ({
      title: String(i.title || '').slice(0, 60),
      description: String(i.description || '').slice(0, 200),
      confidence: Math.min(95, Math.max(60, parseInt(i.confidence) || 80)),
      impact: i.impact === 'high' ? 'high' : 'medium',
    }))
    parsed.recommendations = parsed.recommendations.slice(0, 4).map(r => ({
      title: String(r.title || '').slice(0, 40),
      desc: String(r.desc || r.description || '').slice(0, 160),
    }))
    return parsed
  } catch (e) {
    console.warn('Insights IA generation failed:', e.message)
    return null
  }
}

export async function GET(req) {
  try {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    const weekStart = weekStartISO()

    // Cache : si on a déjà généré pour la semaine en cours, on renvoie le cache
    const { data: cached } = await supabaseAdmin
      .from('ai_insights_cache')
      .select('week_start, insights, recommendations')
      .eq('user_id', userId)
      .maybeSingle()
    if (cached && cached.week_start === weekStart && Array.isArray(cached.insights) && cached.insights.length > 0) {
      console.log(`🧠 INSIGHTS DEBUG (CACHE) → insights=${cached.insights.length} reco=${(cached.recommendations || []).length} | semaine=${weekStart}`)
      return NextResponse.json({ insights: cached.insights, recommendations: cached.recommendations, weekStart, cached: true })
    }

    // ===== Récupération des données réelles =====
    const { data: inf } = await supabaseAdmin.from('influencers').select('id, ai_score').eq('user_id', userId).maybeSingle()
    const influencerId = inf?.id
    const score = inf?.ai_score || 0

    let social = [], txs = [], collabs = []
    if (influencerId) {
      const [s, t, c] = await Promise.all([
        supabaseAdmin.from('social_accounts').select('platform, followers_count, engagement_rate').eq('influencer_id', influencerId),
        supabaseAdmin.from('transactions').select('amount, influencer_amount, status, type, description, created_at, released_at').eq('influencer_id', influencerId),
        supabaseAdmin.from('collaborations').select('status').eq('influencer_id', influencerId),
      ])
      social = s.data || []; txs = t.data || []; collabs = c.data || []
    }

    const totalFollowers = social.reduce((a, x) => a + (x.followers_count || 0), 0)
    const sorted = social.slice().sort((a, b) => (b.followers_count || 0) - (a.followers_count || 0))
    const topPlatform = sorted[0] ? (PLATFORM_LABEL[sorted[0].platform] || sorted[0].platform) : null
    const platformsText = social.map(x => `${PLATFORM_LABEL[x.platform] || x.platform} ${(x.followers_count || 0)} abonnés`).join(', ')
    const avgEngagement = social.length ? (social.reduce((a, x) => a + parseFloat(x.engagement_rate || 0), 0) / social.length).toFixed(1) : 0

    const now = Date.now()
    const rev90 = Math.round(txs.filter(t => isReceived(t) && (now - new Date(t.released_at || t.created_at).getTime()) <= 90 * 864e5).reduce((a, t) => a + Number(t.influencer_amount ?? t.amount ?? 0), 0))
    const revPrev = Math.round(txs.filter(t => { if (!isReceived(t)) return false; const d = now - new Date(t.released_at || t.created_at).getTime(); return d > 90 * 864e5 && d <= 180 * 864e5 }).reduce((a, t) => a + Number(t.influencer_amount ?? t.amount ?? 0), 0))
    const revTrend = rev90 === revPrev ? 0 : (rev90 > revPrev ? 1 : -1)

    const activeCollabs = collabs.filter(c => !['completed', 'cancelled', 'terminee'].includes((c.status || '').toLowerCase())).length

    const ctx = {
      level: levelName(score), score, totalFollowers, topPlatform, platformsText,
      platformCount: social.length, avgEngagement, rev90, revTrend,
      activeCollabs, totalCollabs: collabs.length,
    }

    // IA si possible, sinon secours calculé depuis les données
    let result = await generateWithAI(ctx)
    const usedAI = !!(result && result.insights && result.insights.length)
    if (!result || !result.insights || result.insights.length === 0) result = fallbackInsights(ctx)

    console.log(`🧠 INSIGHTS DEBUG → influencerId=${influencerId || 'AUCUN'} | social=${social.length} tx=${txs.length} collabs=${collabs.length} | insights=${result.insights.length} reco=${result.recommendations.length} | source=${usedAI ? 'IA' : 'repli'} | clé Anthropic=${process.env.ANTHROPIC_API_KEY ? 'présente' : 'ABSENTE'}`)

    // Mise en cache pour la semaine
    await supabaseAdmin.from('ai_insights_cache').upsert({
      user_id: userId,
      week_start: weekStart,
      insights: result.insights,
      recommendations: result.recommendations,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    return NextResponse.json({ insights: result.insights, recommendations: result.recommendations, weekStart, cached: false })
  } catch (err) {
    console.error('Erreur insights:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
