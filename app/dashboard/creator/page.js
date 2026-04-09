'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useTheme } from './../ThemeContext'

export default function CreatorHome() {
  const router = useRouter()
  const { isDark, colors } = useTheme()
  const [tab, setTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [time, setTime] = useState(new Date())
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifs, setNotifs] = useState([
    { id: 1, icon: '🤝', title: 'Nouvelle collaboration Nike',   desc: 'Nike vous a envoyé une proposition pour leur nouvelle campagne...', time: 'Il y a 5 minutes', unread: true,  color: '#ec4899' },
    { id: 2, icon: '💰', title: 'Paiement reçu',                 desc: 'Vous avez reçu un paiement de 2 500€ pour la campagne Samsung Galaxy', time: 'Il y a 2 heures', unread: true,  color: '#22c55e' },
    { id: 3, icon: '🏆', title: 'Nouveau palier atteint!',       desc: 'Félicitations! Vous avez dépassé 1M de vues ce mois-ci 🎉', time: 'Il y a 4 heures', unread: true,  color: '#f59e0b' },
    { id: 4, icon: '💬', title: 'Nouveau message',               desc: 'TechGuru vous a envoyé un message concernant votre dernière vidéo', time: 'Hier', unread: false, color: '#3b82f6' },
    { id: 5, icon: '🤖', title: 'Insight IA disponible',         desc: 'Une nouvelle opportunité de croissance détectée par notre IA', time: 'Hier', unread: false, color: '#a855f7' },
  ])

  const unreadCount = notifs.filter(n => n.unread).length
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Maxime'
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const tabs = [
    { id: 'overview',   label: "Vue d'ensemble",        icon: '📊', color: '#a855f7' },
    { id: 'campagnes',  label: 'Campagnes & Activité',   icon: '🎯', color: '#ec4899' },
    { id: 'insights',   label: 'Intelligence & Insights', icon: '💡', color: '#f59e0b' },
    { id: 'actualites', label: 'Actualités & Ressources', icon: '🌐', color: '#22c55e' },
  ]

  const topCreateurs = [
    { rank: 1, name: 'Emma Beauty', followers: '2.1M', points: 950, color: '#f59e0b', initial: 'E' },
    { rank: 2, name: 'TechPro',     followers: '1.8M', points: 820, color: '#6b7280', initial: 'T' },
    { rank: 3, name: 'Fashion',     followers: '1.5M', points: 785, color: '#f97316', initial: 'F' },
  ]

  const statsClés = [
    { label: 'Revenus ce mois',    value: '3447€',  delta: '+18.5%', color: '#f59e0b', bg: isDark ? '#2a2200' : '#fef9c3', icon: '💰' },
    { label: 'Vues totales',       value: '1.3M',   delta: '+12.3%', color: '#a855f7', bg: isDark ? '#1a0a2e' : '#faf5ff', icon: '👁' },
    { label: "Taux d'engagement",  value: '9.1%',   delta: '+0.8%',  color: '#22c55e', bg: isDark ? '#0d2e1a' : '#f0fdf4', icon: '❤️' },
    { label: 'Nouveaux followers', value: '1.2K',   delta: '+5.2%',  color: '#ec4899', bg: isDark ? '#2a0a1e' : '#fdf2f8', icon: '👥' },
    { label: 'Campagnes actives',  value: '3',      delta: 'Actif',  color: '#f59e0b', bg: isDark ? '#2a2200' : '#fef9c3', icon: '🎯' },
    { label: 'Portée mensuelle',   value: '3.8M',   delta: '+24.7%', color: '#a855f7', bg: isDark ? '#1a0a2e' : '#faf5ff', icon: '🌐' },
    { label: 'Commentaires',       value: '12.4K',  delta: '+15.2%', color: '#3b82f6', bg: isDark ? '#0d1a2e' : '#eff6ff', icon: '💬' },
    { label: 'Partages',           value: '8.9K',   delta: '+32.1%', color: '#ec4899', bg: isDark ? '#2a0a1e' : '#fdf2f8', icon: '↗️' },
  ]

  const platforms = [
    { name: 'TikTok',    followers: '850K abonnés', pct: 35, delta: '+12%', barColor: isDark ? '#fff' : '#1a202c' },
    { name: 'Instagram', followers: '880K abonnés', pct: 28, delta: '+8%',  barColor: '#ec4899' },
    { name: 'YouTube',   followers: '530K abonnés', pct: 22, delta: '+15%', barColor: '#ef4444' },
    { name: 'LinkedIn',  followers: '365K abonnés', pct: 15, delta: '+5%',  barColor: '#3b82f6' },
  ]

  const financialData = [
    { month: 'Jan', val: 2500 }, { month: 'Fév', val: 1800 },
    { month: 'Mar', val: 8000 }, { month: 'Avr', val: 3500 },
    { month: 'Mai', val: 5000 }, { month: 'Jun', val: 4500 },
    { month: 'Jul', val: 4200 },
  ]
  const maxVal = Math.max(...financialData.map(d => d.val))

  const campagnes = [
    { name: 'Nike Air Max Campaign', brand: 'Nike',    budget: '5000€', deadline: '15 Déc', progress: 75,  status: 'Actif',      statusColor: '#ec4899', color: '#ec4899' },
    { name: 'Samsung Galaxy Review', brand: 'Samsung', budget: '3500€', deadline: '20 Déc', progress: 30,  status: 'En attente', statusColor: '#f59e0b', color: '#f97316' },
    { name: 'Spotify Premium Promo', brand: 'Spotify', budget: '2000€', deadline: '10 Déc', progress: 100, status: 'Terminé',    statusColor: '#22c55e', color: '#22c55e' },
  ]

  const activites = [
    { name: 'BrandX',      action: 'a approuvé votre proposition',    time: 'il y a 2min',  color: '#22c55e', icon: '✓' },
    { name: 'TechGuru',    action: 'a commencé à vous suivre',        time: 'il y a 5min',  color: '#a855f7', icon: '👤' },
    { name: 'Emma_Beauty', action: 'a commenté votre post',           time: 'il y a 15min', color: '#ec4899', icon: '💬' },
    { name: 'Fashion_Pro', action: 'vous a mentionné dans une story', time: 'il y a 30min', color: '#f59e0b', icon: '📸' },
    { name: 'SportBrand',  action: 'a envoyé une nouvelle offre',     time: 'il y a 1h',    color: '#3b82f6', icon: '💼' },
  ]

  const insights = [
    { title: 'Moment optimal de publication', desc: "Publiez entre 14h-16h pour +32% d'engagement",          score: 94, impact: 'Impact élevé', color: '#f59e0b', icon: '🕐' },
    { title: 'Hashtags tendance',             desc: '#TechInnovation et #LifestyleGoals performent +156%',    score: 87, impact: 'Impact moyen', color: '#a855f7', icon: '💡' },
    { title: 'Format vidéo recommandé',       desc: "Les vidéos courtes (15-30s) génèrent plus d'engagement", score: 99, impact: 'Impact élevé', color: '#f59e0b', icon: '🎬' },
  ]

  const recommandations = [
    { title: 'Timing Optimal',    desc: "Publiez entre 14h-16h pour maximiser l'engagement de votre audience",    color: '#22c55e', bg: isDark ? '#0d2e1a' : '#f0fdf4', icon: '🕐' },
    { title: 'Contenu Tendance',  desc: 'Focus sur les vidéos courtes et les tutoriels pour maximiser la portée', color: '#a855f7', bg: isDark ? '#1a0a2e' : '#faf5ff', icon: '📈' },
    { title: 'Collaborations',    desc: '3 nouvelles opportunités de partenariat détectées dans votre niche',     color: '#ec4899', bg: isDark ? '#2a0a1e' : '#fdf2f8', icon: '🤝' },
    { title: 'Hashtags Optimaux', desc: '#TechReview #Innovation #Lifestyle pour augmenter la visibilité',        color: '#f59e0b', bg: isDark ? '#2a2200' : '#fef9c3', icon: '🏷️' },
  ]

  const actualites = [
    { tag: 'IA',       tagColor: '#a855f7', title: 'Nouvelle fonctionnalité IA pour optimiser vos posts', time: 'Il y a 1 jour',  bgGradient: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', emoji: '🤖' },
    { tag: 'Platform', tagColor: '#3b82f6', title: 'TikTok lance son nouveau programme créateur',         time: 'Il y a 2 jours', bgGradient: 'linear-gradient(135deg,#ff0000,#cc0000)',          emoji: '📱' },
  ]

  const ressources = [
    { type: 'Ressource', title: "Guide complet : Marketing d'influence 2024",  time: 'Il y a 3 jours', color: '#ec4899' },
    { type: 'Formation', title: "Webinar : Optimiser ses campagnes avec l'IA", time: 'Il y a 5 jours', color: '#ec4899' },
  ]

  const nouveautes = [
    { icon: '✦',  title: 'Assistant IA V2.0',   desc: "Nouvelles fonctionnalités d'optimisation automatique", badge: 'Nouveau',    color: '#a855f7', bg: isDark ? '#1a0a2e' : '#faf5ff' },
    { icon: '🛡️', title: 'Sécurité Renforcée', desc: 'Protection avancée des données créateurs',              badge: 'Mis à jour', color: '#22c55e', bg: isDark ? '#0d2e1a' : '#f0fdf4' },
    { icon: '🎮', title: 'Gaming Hub',          desc: 'Nouvelle section dédiée aux créateurs gaming',          badge: 'Bêta',       color: '#f59e0b', bg: isDark ? '#2a2200' : '#fef9c3' },
  ]

  const card = {
    background: colors.cardBg,
    borderRadius: '16px',
    border: '1px solid ' + colors.cardBorder,
    padding: '1.25rem',
    boxShadow: colors.shadow,
    transition: 'background 0.3s',
  }

  const fakeDownload = (name) => {
    const blob = new Blob([`Ressource Partnexx: ${name}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = name + '.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.3s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', padding: '1.5rem 2rem', position: 'relative', overflow: 'hidden', minHeight: '140px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 0.25rem' }}>👋 Bonjour {firstName}</h1>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.25rem' }}>{dateStr} • {timeStr}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', marginBottom: '0.75rem' }}>Prêt à créer du contenu exceptionnel aujourd'hui ? 🚀</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>⭐ Abonnement Premium</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>🏆 Score: 850</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>3</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Campagnes</div>
            </div>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>€3.5K</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Ce mois</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>

              {/* ── BOUTON NOTIFICATIONS ── */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#fff', position: 'relative' }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '17px', height: '17px', background: '#ef4444', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <>
                    <div onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                    <div style={{ position: 'fixed', right: '1.5rem', top: '120px', width: '340px', background: colors.cardBg, borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}`, zIndex: 999, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: `1px solid ${colors.border}` }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>Notifications</div>
                        {unreadCount > 0 && <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{unreadCount} nouvelles</span>}
                      </div>
                      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {notifs.map(n => (
                          <div key={n.id}
                            onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                            style={{ display: 'flex', gap: '0.75rem', padding: '0.9rem 1.25rem', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer', background: n.unread ? (isDark ? 'rgba(168,85,247,0.06)' : 'rgba(168,85,247,0.04)') : 'transparent', transition: 'background .15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = n.unread ? (isDark ? 'rgba(168,85,247,0.06)' : 'rgba(168,85,247,0.04)') : 'transparent'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: n.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{n.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: colors.text }}>{n.title}</div>
                                {n.unread && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: colors.textSecondary, lineHeight: 1.4, marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.desc}</div>
                              <div style={{ fontSize: '0.68rem', color: colors.textMuted, marginTop: '0.25rem' }}>🕐 {n.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '0.75rem 1.25rem', borderTop: `1px solid ${colors.border}` }}>
                        <button onClick={markAllRead} style={{ width: '100%', padding: '0.65rem', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: colors.textSecondary, fontFamily: 'inherit' }}>
                          Tout marquer comme lu
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button onClick={() => alert('Favoris')} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#fff' }}>❤️</button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: colors.cardBg, borderBottom: '1px solid ' + colors.border, transition: 'background 0.3s' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '0.9rem 1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? t.color : 'transparent', color: tab === t.id ? '#fff' : colors.textSecondary, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem 2rem' }}>

        {/* VUE D'ENSEMBLE */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>⭐ Top Créateurs</div>
                {topCreateurs.map((c) => (
                  <div key={c.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0', borderBottom: c.rank < 3 ? '1px solid ' + colors.border : 'none', cursor: 'pointer', transition: 'background .15s', borderRadius: '8px' }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(168,85,247,0.08)' : '#f5f3ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{c.rank}</div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.initial}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text }}>{c.name}</div>
                      <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>🚀 {c.followers}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: c.color }}>{c.points}</div>
                      <div style={{ fontSize: '0.65rem', color: colors.textMuted }}>points</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>📈 Statistiques Clés</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {statsClés.map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: '10px', padding: '0.75rem', border: '1px solid ' + s.color + '30', cursor: 'pointer', transition: 'transform .15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                        <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{s.delta}</span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.62rem', color: colors.textSecondary }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>💰 Performance Financière Mensuelle</div>
                  <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>↗ +4.344€/mois</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '150px', marginBottom: '0.5rem' }}>
                  {financialData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '100%', height: ((d.val / maxVal) * 130) + 'px', background: 'linear-gradient(180deg,#f59e0b,#f97316)', borderRadius: '4px 4px 0 0' }} />
                      <div style={{ fontSize: '0.6rem', color: colors.textMuted }}>{d.month}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {[['Revenu Total', '30 406€', 'Sur 7 mois', '#f59e0b'], ['Moyenne Mensuelle', '4 344€', 'Par mois', '#a855f7'], ['Meilleur Mois', '9 800€', 'Mars 2024', '#22c55e']].map(([label, val, sub, color]) => (
                    <div key={label} style={{ background: colors.inputBg, borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.6rem', color: colors.textSecondary, marginBottom: '0.15rem' }}>💰 {label}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.875rem', color }}>{val}</div>
                      <div style={{ fontSize: '0.58rem', color: colors.textMuted }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>
                  🌐 Répartition de l'audience par plateforme
                  <span style={{ fontSize: '0.72rem', color: colors.textMuted, fontWeight: 400 }}> (abonnés)</span>
                </div>
                {platforms.map((p, i) => (
                  <div key={i} style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: p.barColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', color: colors.text }}>{p.name}</div>
                          <div style={{ fontSize: '0.65rem', color: colors.textMuted }}>{p.followers}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: p.barColor, fontSize: '0.875rem' }}>{p.pct}%</div>
                        <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.6rem', fontWeight: 700, padding: '0.05rem 0.3rem', borderRadius: '4px' }}>{p.delta}</span>
                      </div>
                    </div>
                    <div style={{ height: '5px', background: colors.border, borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: (p.pct * 2) + '%', background: p.barColor, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', padding: '0.5rem 0', borderTop: '1px solid ' + colors.border }}>
                  <div style={{ fontSize: '0.78rem', color: colors.textSecondary, fontWeight: 500 }}>↗ Total d'abonnés</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: colors.text }}>2.4M</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMPAGNES & ACTIVITÉ */}
        {tab === 'campagnes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>🎯 Campagnes en Cours</div>
              {campagnes.map((c, i) => (
                <div key={i} style={{ border: '1px solid ' + colors.border, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', borderLeft: '4px solid ' + c.color, background: colors.inputBg, cursor: 'pointer', transition: 'transform .15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>🎯</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text }}>{c.name}</div>
                        <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>{c.brand}</div>
                      </div>
                    </div>
                    <span style={{ background: c.statusColor + '20', color: c.statusColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '100px' }}>{c.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                    <span>💰 Budget: {c.budget}</span>
                    <span>📅 Deadline: {c.deadline}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', color: colors.textSecondary }}>Progression</span>
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: c.color }}>{c.progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: colors.border, borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: c.progress + '%', background: c.color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>⚡ Activité Récente</div>
              {activites.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0.75rem', border: '1px solid ' + colors.border, borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', background: colors.inputBg, transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(168,85,247,0.1)' : '#f5f3ff'}
                  onMouseLeave={e => e.currentTarget.style.background = colors.inputBg}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: a.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: colors.text }}><strong>{a.name}</strong> {a.action}</div>
                      <div style={{ fontSize: '0.65rem', color: colors.textMuted }}>🕐 {a.time}</div>
                    </div>
                  </div>
                  <span style={{ color: colors.textMuted, fontSize: '0.8rem' }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTELLIGENCE & INSIGHTS */}
        {tab === 'insights' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>💡 Insights IA</div>
              {insights.map((ins, i) => (
                <div key={i} style={{ border: '1px solid ' + colors.border, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', background: colors.inputBg, cursor: 'pointer', transition: 'transform .15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: ins.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{ins.icon}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text }}>{ins.title}</div>
                        <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>{ins.desc}</div>
                      </div>
                    </div>
                    <span style={{ background: ins.color + '20', color: ins.color, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>{ins.score}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: colors.textMuted, marginBottom: '0.35rem' }}>
                    <span>Niveau de confiance</span>
                    <span style={{ color: ins.color, fontWeight: 600 }}>{ins.impact}</span>
                  </div>
                  <div style={{ height: '5px', background: colors.border, borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: ins.score + '%', background: ins.color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>💡 Recommandations</div>
              {recommandations.map((r, i) => (
                <div key={i} style={{ background: r.bg, border: '1px solid ' + r.color + '20', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer', transition: 'transform .15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: r.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: r.color, marginBottom: '0.25rem' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTUALITÉS & RESSOURCES */}
        {tab === 'actualites' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ ...card, marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>🌐 Actualités Marketing</div>
                {actualites.map((a, i) => (
                  <div key={i} style={{ border: '1px solid ' + colors.border, borderRadius: '12px', overflow: 'hidden', marginBottom: '0.75rem', cursor: 'pointer', transition: 'transform .15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    onClick={() => alert(`Lire : ${a.title}`)}>
                    <div style={{ background: a.bgGradient, height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: a.tagColor, color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{a.tag}</div>
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>{a.time}</div>
                      <span style={{ fontSize: '2.5rem' }}>{a.emoji}</span>
                    </div>
                    <div style={{ padding: '0.75rem', background: colors.cardBg }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text, marginBottom: '0.35rem' }}>{a.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600 }}>Lire plus ›</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>🆕 Nouveautés Partnexx</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
                  {nouveautes.map((n, i) => (
                    <div key={i} style={{ background: n.bg, border: '1px solid ' + n.color + '20', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer', transition: 'transform .15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                      onClick={() => alert(`Découvrir : ${n.title}`)}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: n.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{n.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: colors.text, marginBottom: '0.25rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.68rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>{n.desc}</div>
                      <span style={{ background: n.color + '20', color: n.color, fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{n.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>📚 Dernières Ressources</div>
              {ressources.map((r, i) => (
                <div key={i} style={{ border: '1px solid ' + colors.border, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', background: colors.inputBg, cursor: 'pointer', transition: 'transform .15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: r.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📄</div>
                      <span style={{ background: r.color + '20', color: r.color, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{r.type}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: colors.textMuted }}>{r.time}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text, marginBottom: '0.75rem' }}>{r.title}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => fakeDownload(r.title)} style={{ flex: 1, padding: '0.4rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>⬇ Télécharger</button>
                    <button onClick={() => alert(`Aperçu : ${r.title}`)} style={{ flex: 1, padding: '0.4rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>👁 Aperçu</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}