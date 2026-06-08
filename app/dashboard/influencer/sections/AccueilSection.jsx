'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Eye, Heart, DollarSign, Users, Target, Zap, Bell, Trophy, Brain, Sparkles, ChevronRight, Clock, Globe, ArrowUp, Activity, Share2, MessageCircle, Briefcase, Rocket, Shield, Bookmark, Download, PlayCircle, Lightbulb, Crown, X } from 'lucide-react'
import supabase from '@/lib/supabase'

// ===== Helpers =====
const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

// Niveaux Partnexx (seuils + visuel) pour le médaillon du hero
const HERO_LEVELS = [
  { key: 'bronze', name: 'Bronze', emoji: '🥉', t: 0, grad: 'from-orange-400 to-amber-600' },
  { key: 'argent', name: 'Argent', emoji: '🥈', t: 750, grad: 'from-slate-300 to-slate-500' },
  { key: 'or', name: 'Or', emoji: '🥇', t: 2500, grad: 'from-yellow-400 to-amber-500' },
  { key: 'platine', name: 'Platine', emoji: '💠', t: 6000, grad: 'from-cyan-400 to-sky-500' },
  { key: 'diamant', name: 'Diamant', emoji: '🔥', t: 12500, grad: 'from-teal-400 to-cyan-500' },
  { key: 'elite', name: 'Élite', emoji: '⭐', t: 30000, grad: 'from-fuchsia-400 to-pink-500' },
  { key: 'champion', name: 'Champion', emoji: '🚀', t: 60000, grad: 'from-orange-400 to-red-500' },
  { key: 'legende', name: 'Légende', emoji: '🏆', t: 100000, grad: 'from-yellow-300 to-orange-500' },
]

const fmtFollowers = (n) => {
  const v = Number(n) || 0
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`
  return String(v)
}

const timeAgo = (date) => {
  if (!date) return ''
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return "à l'instant"
  const m = Math.floor(s / 60); if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60); if (h < 24) return `il y a ${h} h`
  const d = Math.floor(h / 24); if (d < 7) return `il y a ${d} j`
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

// Transactions réellement perçues (released), hors tests (<1€) et remboursements
const isRealReceived = (t) => {
  const amt = Number(t?.influencer_amount ?? t?.amount ?? 0)
  if (t?.status !== 'released') return false
  if (amt < 1) return false
  const desc = (t?.description || '').toLowerCase()
  if (t?.type === 'refund' || desc.includes('rembours') || desc.includes('refund')) return false
  return true
}

// ⚠️ Données décoratives sans source réelle pour l'instant (à brancher plus tard)
const PLATFORM_META = {
  tiktok: { name: 'TikTok', color: '#000000' },
  instagram: { name: 'Instagram', color: '#E4405F' },
  youtube: { name: 'YouTube', color: '#FF0000' },
  x: { name: 'X (Twitter)', color: '#000000' },
  twitter: { name: 'X (Twitter)', color: '#000000' },
  linkedin: { name: 'LinkedIn', color: '#0077B5' },
}

const RECO_STYLE = [
  { color: '#22c55e', icon: Clock },
  { color: '#a855f7', icon: TrendingUp },
  { color: '#ec4899', icon: Users },
  { color: '#f59e0b', icon: Target },
]

// Met en gras les chiffres-clés (€, %, points, abonnés) et les mots forts (réseaux, niveaux)
const EMPH_RE = /(\d[\d.,\u202f\u00a0]*(?:\s?(?:€|%|pts|points|abonnés))?|Instagram|TikTok|YouTube|LinkedIn|Élite|Champion|Légende|Diamant|Platine|Argent|Bronze)/g
function emphasize(text) {
  const str = String(text || '')
  const out = []
  let last = 0, m, k = 0
  EMPH_RE.lastIndex = 0
  while ((m = EMPH_RE.exec(str)) !== null) {
    if (m.index > last) out.push(str.slice(last, m.index))
    out.push(<strong key={k++} className="font-bold text-gray-900">{m[0].trim()}</strong>)
    last = m.index + m[0].length
  }
  if (last < str.length) out.push(str.slice(last))
  return out
}

const newsUpdates = [
  { title: 'Nouvelle fonctionnalité IA pour optimiser vos posts', category: 'IA', time: 'Il y a 1 jour', type: 'feature', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop' },
  { title: 'TikTok lance son nouveau programme créateur', category: 'Platform', time: 'Il y a 2 jours', type: 'news', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop' },
  { title: "Guide complet : Marketing d'influence 2024", category: 'Ressource', time: 'Il y a 3 jours', type: 'resource', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
  { title: "Webinar : Optimiser ses campagnes avec l'IA", category: 'Formation', time: 'Il y a 5 jours', type: 'training', image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=250&fit=crop' },
]

const TABS = [
  { id: 'vue-ensemble', label: "Vue d'ensemble", icon: Activity, color: 'from-purple-500 to-purple-700' },
  { id: 'campagnes', label: 'Campagnes & Activité', icon: Target, color: 'from-pink-500 to-pink-700' },
  { id: 'insights', label: 'Intelligence & Insights', icon: Brain, color: 'from-yellow-500 to-orange-500' },
  { id: 'actualites', label: 'Actualités & Ressources', icon: Globe, color: 'from-green-500 to-emerald-600' },
]

export default function AccueilSection({ user, profile, metrics, collaborations, transactions, contracts, notifications, unreadCount, markAsRead, markAllAsRead }) {
  const [activeTab, setActiveTab] = useState('vue-ensemble')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [myScore, setMyScore] = useState(0)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const router = useRouter()
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [topCreators, setTopCreators] = useState([])
  const [topAvatarError, setTopAvatarError] = useState({})
  const [socialAccounts, setSocialAccounts] = useState([])
  const [aiData, setAiData] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const aiFetchedRef = useRef(false)

  // Insights IA — chargés à l'ouverture de l'onglet (une seule fois), cache serveur par semaine
  useEffect(() => {
    if (activeTab !== 'insights' || aiFetchedRef.current) return
    aiFetchedRef.current = true
    setAiLoading(true)
    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const tk = session?.access_token
        const res = await fetch('/api/influencer/insights', { headers: { Authorization: `Bearer ${tk}` } })
        const json = await res.json().catch(() => ({}))
        setAiData(res.ok ? json : { insights: [], recommendations: [], error: true })
      } catch {
        setAiData({ insights: [], recommendations: [], error: true })
      } finally {
        setAiLoading(false)
      }
    })()
  }, [activeTab])

  // Réseaux sociaux réels du créateur
  useEffect(() => {
    if (!user?.id) return
    let active = true
    ;(async () => {
      const { data: inf } = await supabase.from('influencers').select('id, ai_score').eq('user_id', user.id).maybeSingle()
      if (!inf?.id || !active) return
      setMyScore(inf.ai_score || 0)
      const { data } = await supabase.from('social_accounts').select('platform, followers_count, engagement_rate').eq('influencer_id', inf.id)
      if (active) setSocialAccounts(data || [])
    })()
    return () => { active = false }
  }, [user?.id])

  // Vrai classement des créateurs (par ai_score) + avatars
  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase
        .from('influencers')
        .select('id, display_name, ai_score, user_id')
        .order('ai_score', { ascending: false })
        .limit(3)
      if (!active || !data) return
      const ids = data.map((c) => c.user_id).filter(Boolean)
      let avatarById = {}
      if (ids.length) {
        const { data: profs } = await supabase.from('profiles').select('id, avatar_url').in('id', ids)
        avatarById = Object.fromEntries((profs || []).map((p) => [p.id, p.avatar_url]))
      }
      setTopCreators(data.map((c, i) => ({
        rank: i + 1,
        name: c.display_name || 'Créateur',
        score: c.ai_score || 0,
        avatar: avatarById[c.user_id] || null,
      })))
    })()
    return () => { active = false }
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'toi'
  const partnexxScore = metrics?.partnexxScore ?? metrics?.score ?? profile?.partnexx_score ?? profile?.score ?? null

  // Horloge live (le reste des compteurs "live" bidons a été retiré)
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timeInterval)
  }, [])

  // ===== Revenus réels par mois (7 derniers mois) depuis les transactions =====
  const performanceData = (() => {
    const now = new Date()
    const months = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, name: MONTHS_FR[d.getMonth()].replace('.', ''), label: `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`, revenue: 0 })
    }
    ;(transactions || []).forEach((t) => {
      if (!isRealReceived(t)) return
      const dt = new Date(t.released_at || t.created_at)
      const key = `${dt.getFullYear()}-${dt.getMonth()}`
      const m = months.find((x) => x.key === key)
      if (m) m.revenue += Number(t.influencer_amount ?? t.amount ?? 0)
    })
    return months.map((m) => ({ ...m, revenue: Math.round(m.revenue) }))
  })()

  // ===== Données du hero =====
  const hour = currentTime.getHours()
  const greeting = hour < 6 ? 'Bonne nuit' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  // Niveau réel d'après le score
  let heroLevelIdx = 0
  for (let i = 0; i < HERO_LEVELS.length; i++) { if (myScore >= HERO_LEVELS[i].t) heroLevelIdx = i; else break }
  const heroLevel = HERO_LEVELS[heroLevelIdx]
  const heroNextLevel = HERO_LEVELS[heroLevelIdx + 1] || null
  const levelProgress = heroNextLevel
    ? Math.min(100, Math.round(((myScore - heroLevel.t) / (heroNextLevel.t - heroLevel.t)) * 100))
    : 100
  const pointsToNext = heroNextLevel ? Math.max(0, heroNextLevel.t - myScore) : 0

  // Revenus du mois + tendance vs mois précédent
  const revThisMonth = performanceData.length ? performanceData[performanceData.length - 1].revenue : 0
  const revLastMonth = performanceData.length > 1 ? performanceData[performanceData.length - 2].revenue : 0
  const revTrendPct = revLastMonth > 0 ? Math.round(((revThisMonth - revLastMonth) / revLastMonth) * 100) : (revThisMonth > 0 ? 100 : 0)

  // ===== "À venir" : prochaines échéances (rendus de livrables, signatures) — vraies données =====
  const upcoming = (() => {
    const now = Date.now()
    const items = []
    ;(collaborations || []).forEach((c) => {
      const raw = (c.status || '').toLowerCase()
      const active = !['completed', 'terminee', 'cancelled', 'annulee'].includes(raw)
      if (active && c.deadline) {
        const days = Math.ceil((new Date(c.deadline).getTime() - now) / 86400000)
        if (days >= 0) items.push({ type: 'deliverable', label: c.campaigns?.title || c.brands?.company_name || 'Livrable', days, date: new Date(c.deadline) })
      }
    })
    ;(contracts || []).forEach((ct) => {
      const raw = (ct.status || '').toLowerCase()
      if (['draft', 'sent'].includes(raw)) items.push({ type: 'signature', label: ct.brands?.company_name || 'Contrat', days: null, date: null })
      if (ct.deadline && !['completed', 'cancelled'].includes(raw)) {
        const days = Math.ceil((new Date(ct.deadline).getTime() - now) / 86400000)
        if (days >= 0) items.push({ type: 'contract_deadline', label: ct.brands?.company_name || 'Contrat', days, date: new Date(ct.deadline) })
      }
    })
    items.sort((a, b) => (a.date && b.date) ? a.date - b.date : a.date ? -1 : b.date ? 1 : 0)
    return items.slice(0, 2)
  })()

  // Inclinaison 3D au survol de la souris
  const handleTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rx: +(-py * 6).toFixed(2), ry: +(px * 6).toFixed(2) })
  }
  const resetTilt = () => setTilt({ rx: 0, ry: 0 })
  const goTo = (section) => router.push(`/dashboard/influencer?section=${section}`)


  // ===== Campagnes réelles depuis les collaborations =====
  const campaigns = (collaborations || []).slice(0, 6).map((c, idx) => {
    const raw = (c.status || '').toLowerCase()
    const status = raw === 'completed' || raw === 'terminee' ? 'completed'
      : (raw === 'pending' || raw === 'proposed' || raw === 'draft' || raw === 'en_attente') ? 'pending'
      : 'active'
    const budget = Number(c.agreed_rate ?? c.amount ?? c.budget ?? 0)
    return {
      id: c.id || idx,
      title: c.campaigns?.title || c.campaign?.title || c.title || c.campaign_title || 'Collaboration',
      brand: c.brands?.company_name || c.brand?.company_name || c.brand_name || 'Marque',
      status,
      budget: budget ? `${budget.toLocaleString()}€` : '—',
      deadline: c.deadline ? new Date(c.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—',
      progress: status === 'completed' ? 100 : status === 'pending' ? 15 : 60,
    }
  })

  // ===== Activité récente réelle depuis les notifications =====
  const recentActivity = (notifications || []).slice(0, 6).map((n) => {
    const t = (n.title || '').toLowerCase()
    let type = 'offer'
    if (t.includes('paie') || t.includes('versement') || t.includes('reçu') || t.includes('validé')) type = 'approval'
    else if (t.includes('contrat') || t.includes('signature')) type = 'mention'
    else if (t.includes('litige') || t.includes('message') || t.includes('réponse')) type = 'comment'
    else if (t.includes('abonné') || t.includes('suit') || t.includes('follow')) type = 'follow'
    return { user: n.title || 'Partnexx', action: n.body || '', time: timeAgo(n.created_at), type }
  })

  // ===== Répartition par plateforme réelle =====
  const totalSocialFollowers = socialAccounts.reduce((s, a) => s + (a.followers_count || 0), 0)
  const platformData = socialAccounts
    .slice()
    .sort((a, b) => (b.followers_count || 0) - (a.followers_count || 0))
    .map((a) => {
      const meta = PLATFORM_META[a.platform] || { name: a.platform || 'Réseau', color: '#7C3AED' }
      const f = a.followers_count || 0
      return {
        name: meta.name,
        color: meta.color,
        value: totalSocialFollowers > 0 ? Math.round((f / totalSocialFollowers) * 100) : 0,
        followers: fmtFollowers(f),
      }
    })

  const statCards = [
  { label: 'Revenus ce mois', value: `${(metrics?.totalGains || 0).toFixed(0)}€`, change: '+18.5%', icon: DollarSign, color: '#f59e0b', bg: 'from-yellow-500/10 to-yellow-500/5', border: 'border-yellow-500/30' },
  { label: 'Vues totales', value: `${((metrics?.totalViews || 0) / 1000).toFixed(0)}K`, change: '+12.3%', icon: Eye, color: '#a855f7', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/30' },
  { label: "Taux d'engagement", value: `${metrics?.avgEngagement || 0}%`, change: '+0.8%', icon: Heart, color: '#22c55e', bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/30' },
  { label: 'Nouveaux followers', value: `${((metrics?.totalFollowers || 0) / 1000).toFixed(1)}K`, change: '+5.2%', icon: Users, color: '#ec4899', bg: 'from-pink-500/10 to-pink-500/5', border: 'border-pink-500/30' },
  { label: 'Campagnes actives', value: String(metrics?.collaborationsActives || 0), change: 'Actif', icon: Briefcase, color: '#6366f1', bg: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-500/30' },
  { label: 'En escrow', value: `${(metrics?.enEscrow || 0).toFixed(0)}€`, change: 'En attente', icon: Globe, color: '#8b5cf6', bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/30' },
  { label: 'Contrats signés', value: String(metrics?.contratsSignes || 0), change: 'Actif', icon: MessageCircle, color: '#3b82f6', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/30' },
  { label: 'Collaborations', value: String(metrics?.collaborationsTotal || 0), change: 'Total', icon: Share2, color: '#f43f5e', bg: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-500/30' },
]

  return (
    <div className="space-y-6">
      {/* HERO (statique) */}
      <div className="relative">
        <div className="relative rounded-2xl p-6 sm:p-8 text-white shadow-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
          {/* Décor statique léger (ne bouge pas) */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between gap-6">
            {/* GAUCHE */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">👋</div>
                <h1 className="text-3xl font-bold">{greeting} {firstName} !</h1>
              </div>
              <p className="text-white/90 text-base mb-1">
                {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-white/75 text-sm mb-4">Ton espace créateur, en un coup d&apos;œil ✨</p>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">{heroLevel.emoji} Niveau {heroLevel.name}</span>
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">✨ {(metrics?.collaborationsTotal || 0)} collaboration{(metrics?.collaborationsTotal || 0) > 1 ? 's' : ''}</span>
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">🏆 {myScore.toLocaleString('fr-FR')} pts</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => goTo('opportunites')} className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition shadow-lg">
                  <Rocket className="h-4 w-4" />Voir les opportunités
                </button>
                <button onClick={() => goTo('contrats')} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-full hover:bg-white/25 transition border border-white/30">
                  <Briefcase className="h-4 w-4" />Mes contrats
                </button>
              </div>
            </div>

            {/* DROITE */}
            <div className="flex flex-col items-start lg:items-end gap-5">
              {/* CLOCHE NOTIFICATIONS */}
              <div className="relative self-end">
                <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                  <Bell className="h-7 w-7 text-white" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadCount}</span>
                    </div>
                  )}
                </button>

                {/* PANEL NOTIFICATIONS */}
                {showNotifPanel && (
                  <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-left">
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        Notifications
                        {unreadCount > 0 && (<span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>)}
                      </h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (<button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Tout lu</button>)}
                        <button onClick={() => setShowNotifPanel(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {!notifications?.length ? (
                        <div className="text-center py-10">
                          <Bell className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">Aucune notification</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-gray-300'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* À VENIR */}
              <div className="flex items-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[210px] max-w-[280px]">
                  <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase mb-2">
                    <Clock className="h-3.5 w-3.5" />À venir
                  </div>
                  {upcoming.length === 0 ? (
                    <p className="text-white/85 text-sm">Rien de prévu pour l&apos;instant 🎉</p>
                  ) : (
                    <div className="space-y-2">
                      {upcoming.map((it, i) => {
                        const when = it.days == null ? 'à faire' : it.days <= 0 ? "aujourd'hui" : it.days === 1 ? 'demain' : `dans ${it.days} j`
                        const verb = it.type === 'signature' ? 'Signature' : it.type === 'contract_deadline' ? 'Échéance' : 'Rendu'
                        const urgent = it.days != null && it.days <= 1
                        return (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <p className="text-white text-sm font-semibold truncate">{verb} · {it.label}</p>
                            <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${urgent ? 'bg-red-400/30 text-red-50' : 'bg-white/20 text-white'}`}>{when}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-4 gap-3">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                isActive ? `bg-gradient-to-br ${tab.color} text-white border-transparent shadow-lg` : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* VUE D'ENSEMBLE */}
      {activeTab === 'vue-ensemble' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />Top Créateurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCreators.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Trophy className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">Classement bientôt disponible</p>
                  </div>
                ) : topCreators.map(creator => {
                  const maxScore = topCreators[0]?.score || 0
                  const pct = maxScore > 0 ? Math.min(100, Math.round((creator.score / maxScore) * 100)) : 0
                  const initials = creator.name.slice(0, 2).toUpperCase()
                  return (
                  <div key={creator.rank} className={`relative rounded-2xl p-4 border-2 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${creator.rank === 1 ? 'bg-gradient-to-br from-yellow-500/10 to-white border-yellow-400/40' : creator.rank === 2 ? 'bg-gradient-to-br from-gray-400/10 to-white border-gray-400/30' : 'bg-gradient-to-br from-orange-400/10 to-white border-orange-400/30'}`}>
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-6 translate-x-6 opacity-30" style={{ background: creator.rank === 1 ? '#fbbf24' : creator.rank === 2 ? '#9ca3af' : '#fb923c' }} />
                    <div className="relative flex items-center gap-3">
                      <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${creator.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : creator.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                        {creator.rank === 1 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"><Crown className="h-3 w-3 text-yellow-500" /></div>}
                        <span className="text-2xl font-bold text-white">{creator.rank}</span>
                      </div>
                      {creator.avatar && !topAvatarError[creator.rank] ? (
                        <img src={creator.avatar} alt={creator.name} onError={() => setTopAvatarError(prev => ({ ...prev, [creator.rank]: true }))} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">{initials}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{creator.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><Trophy className="h-3 w-3" />Partnexx Score</p>
                      </div>
                      <div className={`text-xl font-bold flex-shrink-0 ${creator.rank === 1 ? 'text-yellow-500' : creator.rank === 2 ? 'text-gray-500' : 'text-orange-500'}`}>{creator.score}</div>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${creator.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : creator.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />Statistiques Clés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {statCards.slice(0, 4).map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className={`bg-gradient-to-br ${stat.bg} border-2 ${stat.border} rounded-2xl p-5 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-6 translate-x-6 opacity-20" style={{ backgroundColor: stat.color }} />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: stat.color + '25' }}>
                              <Icon className="h-6 w-6" style={{ color: stat.color }} />
                            </div>
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />{stat.change}
                            </span>
                          </div>
                          <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: stat.color, opacity: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {statCards.slice(4, 8).map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className={`bg-gradient-to-br ${stat.bg} border-2 ${stat.border} rounded-2xl p-5 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-6 translate-x-6 opacity-20" style={{ backgroundColor: stat.color }} />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: stat.color + '25' }}>
                              <Icon className="h-6 w-6" style={{ color: stat.color }} />
                            </div>
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />{stat.change}
                            </span>
                          </div>
                          <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: stat.color, opacity: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={performanceData}>
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={v => `${v}€`} />
                      <Tooltip formatter={(v) => [`${v}€`, 'Revenus']} />
                      <Bar dataKey="revenue" fill="url(#purpleGrad)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {platformData.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 border border-dashed rounded-xl">
                      <Share2 className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                      <p className="text-sm">Aucun réseau connecté</p>
                      <p className="text-xs">Ajoute tes réseaux dans l&apos;onglet Profil</p>
                    </div>
                  ) : platformData.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer hover:scale-[1.01] transition-transform">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg" style={{ background: p.color }}>{p.name[0]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1"><span className="font-semibold">{p.name}</span><span className="text-gray-500">{p.followers} abonnés</span></div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} /></div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-bold text-lg" style={{ color: p.color }}>{p.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-500"><TrendingUp className="h-4 w-4" /><span className="text-sm">Total d&apos;abonnés</span></div>
                  <p className="text-xl font-bold">{fmtFollowers(totalSocialFollowers)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* CAMPAGNES & ACTIVITÉ */}
      {activeTab === 'campagnes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-pink-500" />Campagnes en Cours</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Target className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">Aucune campagne pour l&apos;instant</p>
                </div>
              ) : campaigns.map(campaign => (
                <div key={campaign.id} className={`rounded-2xl p-5 border-2 cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden ${campaign.status === 'active' ? 'bg-gradient-to-br from-pink-500/10 to-white border-pink-500/30' : campaign.status === 'completed' ? 'bg-gradient-to-br from-green-500/10 to-white border-green-500/30' : 'bg-gradient-to-br from-orange-400/10 to-white border-orange-400/30'}`}>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${campaign.status === 'active' ? 'bg-gradient-to-br from-pink-500 to-pink-600' : campaign.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div><h4 className="font-semibold">{campaign.title}</h4><p className="text-sm text-gray-500">{campaign.brand}</p></div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${campaign.status === 'active' ? 'bg-pink-100 text-pink-600' : campaign.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {campaign.status === 'active' ? 'Actif' : campaign.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"><DollarSign className="h-4 w-4 text-yellow-500" /><div><p className="text-xs text-gray-400">Budget</p><p className="text-sm font-bold">{campaign.budget}</p></div></div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"><Clock className="h-4 w-4 text-purple-500" /><div><p className="text-xs text-gray-400">Deadline</p><p className="text-sm font-bold">{campaign.deadline}</p></div></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500"><span>Progression</span><span className="font-bold">{campaign.progress}%</span></div>
                      <Progress value={campaign.progress} className="h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-yellow-500" />Activité Récente</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Activity className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">Aucune activité récente</p>
                </div>
              ) : recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl border hover:scale-[1.01] transition-transform cursor-pointer" style={{ background: activity.type === 'approval' ? '#22c55e0a' : activity.type === 'follow' ? '#a855f70a' : activity.type === 'comment' ? '#ec48990a' : activity.type === 'mention' ? '#f59e0b0a' : '#3b82f60a' }}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-lg ${activity.type === 'approval' ? 'bg-gradient-to-br from-green-500 to-green-600' : activity.type === 'follow' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : activity.type === 'comment' ? 'bg-gradient-to-br from-pink-500 to-pink-600' : activity.type === 'mention' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                    {activity.type === 'approval' ? '✓' : activity.type === 'follow' ? '👤' : activity.type === 'comment' ? '💬' : activity.type === 'mention' ? '@' : '📧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm"><span className="font-semibold">{activity.user}</span> {activity.action && <span className="text-gray-500">— {activity.action}</span>}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock className="h-3 w-3" />{activity.time}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* INTELLIGENCE & INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Brain className="h-5 w-5 text-yellow-500" />Insights IA</CardTitle>
              <p className="text-xs text-gray-400 mt-1">Personnalisé d&apos;après tes données · recalculé chaque semaine</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <Brain className="h-10 w-10 mx-auto mb-3 text-gray-200 animate-pulse" />
                  <p className="text-sm">Analyse de tes données en cours…</p>
                </div>
              ) : (aiData?.insights || []).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">{aiData?.error ? 'Insights indisponibles pour le moment, réessaie plus tard' : 'Pas encore assez de données pour générer des insights'}</p>
                </div>
              ) : aiData.insights.map((insight, i) => (
                <div key={i} className={`group rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden ${insight.impact === 'high' ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200' : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'}`}>
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 transition-transform group-hover:scale-110 ${insight.impact === 'high' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-gray-900 leading-snug">{insight.title}</h4>
                        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${insight.impact === 'high' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>{insight.confidence}%</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{emphasize(insight.description)}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Niveau de confiance</span>
                      <span className={`font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${insight.impact === 'high' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>{insight.impact === 'high' ? '⚡ Impact élevé' : '◆ Impact moyen'}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${insight.impact === 'high' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} style={{ width: `${insight.confidence}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500" />Recommandations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {aiLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <Lightbulb className="h-10 w-10 mx-auto mb-3 text-gray-200 animate-pulse" />
                  <p className="text-sm">Génération de tes recommandations…</p>
                </div>
              ) : (aiData?.recommendations || []).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Lightbulb className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">{aiData?.error ? 'Recommandations indisponibles pour le moment' : 'Recommandations bientôt disponibles'}</p>
                </div>
              ) : (aiData?.recommendations || []).map((rec, i) => {
                const st = RECO_STYLE[i % RECO_STYLE.length]
                const Icon = st.icon
                return (
                  <div key={i} className="group rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${st.color}0f, #ffffff)`, borderColor: st.color + '33' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${st.color}, ${st.color}aa)` }}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold mb-1" style={{ color: st.color }}>{rec.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{emphasize(rec.desc)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ACTUALITÉS & RESSOURCES */}
      {activeTab === 'actualites' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-purple-500" />Actualités Marketing</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {newsUpdates.filter(n => n.type === 'news' || n.type === 'feature').map((news, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:scale-[1.01] transition-transform cursor-pointer">
                    <div className="relative h-40 overflow-hidden">
                      <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-3 left-3 text-xs bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full font-semibold">{news.category}</span>
                      <span className="absolute top-3 right-3 text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">{news.time}</span>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/5 to-white">
                      <h4 className="font-semibold mb-2">{news.title}</h4>
                      <button className="text-purple-500 text-sm font-medium flex items-center gap-1">Lire plus <ChevronRight className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Bookmark className="h-5 w-5 text-pink-500" />Dernières Ressources</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {newsUpdates.filter(n => n.type === 'resource' || n.type === 'training').map((resource, i) => (
                  <div key={i} className="rounded-2xl p-5 border-2 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-white hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden">
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg">
                            {resource.type === 'resource' ? <Download className="h-6 w-6 text-white" /> : <PlayCircle className="h-6 w-6 text-white" />}
                          </div>
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-semibold">{resource.category}</span>
                        </div>
                        <span className="text-xs text-gray-400">{resource.time}</span>
                      </div>
                      <h4 className="font-semibold mb-4">{resource.title}</h4>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors"><Download className="h-3 w-3" /> Télécharger</button>
                        <button className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors"><Eye className="h-3 w-3" /> Aperçu</button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Rocket className="h-5 w-5 text-indigo-500" />Nouveautés Partnexx</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Assistant IA V2.0', desc: "Nouvelles fonctionnalités d'optimisation automatique", badge: 'Nouveau', color: '#a855f7', icon: Sparkles },
                  { title: 'Sécurité Renforcée', desc: 'Protection avancée des données créateurs', badge: 'Mis à jour', color: '#22c55e', icon: Shield },
                  { title: 'Gaming Hub', desc: 'Nouvelle section dédiée aux créateurs gaming', badge: 'Bêta', color: '#f59e0b', icon: Zap },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="rounded-2xl p-5 border-2 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden" style={{ background: item.color + '0a', borderColor: item.color + '30' }}>
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg mb-4" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                        <span className="text-xs px-2 py-1 rounded-full border font-semibold" style={{ color: item.color, borderColor: item.color + '50', background: item.color + '15' }}>{item.badge}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
