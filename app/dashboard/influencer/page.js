'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useTheme } from '../ThemeContext'

export default function DashboardInfluencer() {
  const router = useRouter()
  const { isDark, colors } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifs, setNotifs] = useState([
    { id: 1, icon: '🤝', title: 'Nouvelle collaboration Nike', desc: 'Nike vous a envoyé une proposition de collaboration pour leur nouvelle campagne...', time: 'Il y a 5 minutes', unread: true, color: '#ec4899' },
    { id: 2, icon: '💰', title: 'Paiement reçu', desc: 'Vous avez reçu un paiement de 2 500€ pour la campagne Samsung Galaxy', time: 'Il y a 2 heures', unread: true, color: '#22c55e' },
    { id: 3, icon: '🏆', title: 'Nouveau palier atteint!', desc: 'Félicitations! Vous avez dépassé 1M de vues ce mois-ci 🎉', time: 'Il y a 4 heures', unread: true, color: '#f59e0b' },
    { id: 4, icon: '💬', title: 'Nouveau message', desc: 'TechGuru vous a envoyé un message concernant votre dernière vidéo', time: 'Hier', unread: false, color: '#3b82f6' },
    { id: 5, icon: '🤖', title: 'Insight IA disponible', desc: 'Une nouvelle opportunité de croissance a été détectée par notre IA', time: 'Hier', unread: false, color: '#a855f7' },
  ])

  const unreadCount = notifs.filter(n => n.unread).length

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Sophie'
  const hour = time.getHours()
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir'
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const tabs = [
    { id: 'overview',  label: '🔄 Vue d\'ensemble' },
    { id: 'activity',  label: '🚀 Campagnes & Activité' },
    { id: 'insights',  label: '💡 Intelligence & Insights' },
    { id: 'news',      label: '🌐 Actualités & Ressources' },
  ]

  const metrics = [
    { label: 'Chiffre d\'affaires', sub: 'Revenus totaux ce mois', value: '127,450€', delta: '+23.5%', icon: '💲', color: '#fef9c3' },
    { label: 'Campagnes actives',   sub: 'Projets en cours',        value: '12',       delta: '+4',     icon: '🚀', color: '#f0fdf4' },
    { label: 'Taux d\'engagement',  sub: 'Moyenne toutes plateformes', value: '6.8%',  delta: '+1.2%',  icon: '❤️', color: '#fdf2f8' },
    { label: 'Impressions',         sub: 'Portée ce mois',           value: '3.2M',    delta: '+18%',   icon: '👁️', color: '#fef9c3' },
    { label: 'Partenaires',         sub: 'Influenceurs actifs',       value: '156',     delta: '+12',    icon: '👥', color: '#f0fdf4' },
    { label: 'ROI moyen',           sub: 'Retour sur investissement', value: '287%',    delta: '+45%',   icon: '🎯', color: '#fdf2f8' },
  ]

  const campaigns = [
    { name: 'Beauty Summer', status: 'Actif',    budget: '15 000€', spent: '12 400€', roi: '240%', progress: 83 },
    { name: 'Tech Launch',   status: 'Actif',    budget: '25 000€', spent: '24 800€', roi: '320%', progress: 99 },
    { name: 'Fashion Week',  status: 'Terminé',  budget: '8 000€',  spent: '7 200€',  roi: '180%', progress: 90 },
    { name: 'Fitness Goals', status: 'Actif',    budget: '12 000€', spent: '9 800€',  roi: '195%', progress: 82 },
  ]

  const activities = [
    { icon: '🚀', title: "Campagne 'Summer Beauty' lancée",  desc: '15 influenceurs, budget 25K€, objectif 2M impressions', time: 'Il y a 2h',  color: '#a855f7', route: '/dashboard/campaigns' },
    { icon: '💰', title: 'Paiement reçu - TechCorp',         desc: 'Facturation campagne Q2 - 18,750€',                    time: 'Il y a 4h',  color: '#22c55e', route: '/dashboard/finance' },
    { icon: '👥', title: 'Nouveau partenaire validé',         desc: '@lifestyle_emma (250K followers) approuvée',           time: 'Il y a 6h',  color: '#3b82f6', route: '/dashboard/partenaires' },
    { icon: '📊', title: 'Rapport mensuel généré',            desc: 'Performance +34% vs mois précédent',                   time: 'Hier',       color: '#f59e0b', route: '/dashboard/analytics' },
  ]

  const opportunities = [
    { priority: 'Priorité haute',   title: 'Opportunité détectée',       desc: 'Micro-influenceurs beauté : +67% d\'engagement vs macro-influenceurs ce mois', action: 'Ajuster stratégie',  priorityColor: '#ef4444', route: '/dashboard/partenaires' },
    { priority: 'Priorité moyenne', title: 'Timing optimal identifié',   desc: 'Publications TikTok : 18h-20h génèrent +89% d\'engagement',                    action: 'Programmer contenus',priorityColor: '#f59e0b', route: '/dashboard/calendrier' },
    { priority: 'Priorité haute',   title: 'Tendance émergente',          desc: 'Hashtag #EcoBeauty prédit +340% de croissance sous 15 jours',                  action: 'Créer campagne',    priorityColor: '#ef4444', route: '/dashboard/campaigns' },
    { priority: 'Priorité moyenne', title: 'Surveillance concurrence',    desc: 'Concurrent lance campagne similaire - impact potentiel -15%',                   action: 'Analyser',          priorityColor: '#f59e0b', route: '/dashboard/analytics' },
  ]

  const recommendations = [
    { icon: '⏰', title: 'Optimisation Timing',  desc: 'Publier vos contenus entre 18h-20h pour +89% d\'engagement',           action: 'Programmer automatiquement', actionColor: '#a855f7', route: '/dashboard/calendrier' },
    { icon: '📈', title: 'Tendance Émergente',   desc: 'Hashtag #EcoBeauty en croissance de +340% - opportunité détectée',     action: 'Créer campagne ciblée',      actionColor: '#22c55e', route: '/dashboard/campaigns' },
    { icon: '⚠️', title: 'Alerte Concurrence',  desc: 'Concurrent lance campagne similaire - impact potentiel -15%',           action: 'Analyser et ajuster',        actionColor: '#f59e0b', route: '/dashboard/analytics' },
  ]

  const news = [
    { tag: 'Innovation', tagColor: '#a855f7', time: '2', title: "L'IA révolutionne le marketing d'influence",       desc: "Les outils d'automatisation augmentent l'efficacité des campagnes de 37% selon notre étude." },
    { tag: 'Stratégie',  tagColor: '#3b82f6', time: '5', title: 'Micro-influenceurs : la tendance qui domine 2025', desc: 'Les créateurs 10K-100K followers génèrent le plus d\'engagement que les macro-influenceurs.' },
    { tag: 'Conformité', tagColor: '#ef4444', time: '7', title: 'Nouvelles obligations RGPD pour l\'influence marketing', desc: 'Guide complet des nouvelles règles européennes pour les partenariats.' },
    { tag: 'E-commerce', tagColor: '#22c55e', time: '4', title: 'TikTok Shop explose : +240% de conversions',       desc: 'Les fonctionnalités e-commerce natives transforment l\'influence marketing en machine à vente.' },
  ]

  const resources = [
    { icon: '📊', title: 'Guide Analytics 2025', desc: 'Template complet d\'analyse de performance', action: 'Télécharger', actionColor: '#a855f7', route: '/dashboard/analytics' },
    { icon: '📋', title: 'Contrats Type',         desc: 'Modèles juridiques pour influenceurs',      action: 'Accéder',     actionColor: '#3b82f6', route: '/dashboard/contracts' },
    { icon: '🎓', title: 'Formation IA Marketing',desc: '5 modules pour maîtriser l\'IA',             action: 'Commencer',   actionColor: '#22c55e', route: '/dashboard/ressources' },
  ]

  const cardStyle = {
    background: colors.cardBg,
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: colors.shadow,
    border: `1px solid ${colors.cardBorder}`,
    transition: 'background 0.3s',
  }

  const btn = (label, route, style = {}) => (
    <button
      onClick={() => router.push(route)}
      style={{ padding: '0.6rem 1.1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .2s', ...style }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {label}
    </button>
  )

  return (
    <div style={{ padding: '1.5rem', background: colors.bg, minHeight: '100vh', transition: 'background 0.3s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>{greeting} {firstName} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', marginBottom: '0.3rem', fontWeight: 500 }}>
              🚀 Votre empire influence génère <strong>127,450€</strong> avec 12 campagnes actives
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginBottom: '1rem' }}>
              ⓘ IA analysant 24/7 · 3 opportunités détectées · ROI optimisé +45%
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {['⭐ Score Expert: 94/100', '🎯 Plan Enterprise Pro', '📈 Croissance +127%', '✅ Objectifs dépassés'].map((tag, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {btn('+ Nouvelle campagne', '/dashboard/campaigns', { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' })}
              {btn('📋 Gérer contrats',   '/dashboard/contracts',  { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' })}
              {btn('📊 Voir rapports',    '/dashboard/analytics',  { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' })}
            </div>
          </div>
          <div style={{ textAlign: 'right', color: '#fff', flexShrink: 0, marginLeft: '1rem', position: 'relative' }}>
            <div style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '0.2rem' }}>{dateStr}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{timeStr.slice(0,5)}</div>
            <div style={{ fontSize: '0.72rem', marginTop: '0.3rem', marginBottom: '0.5rem' }}>
              <span style={{ background: 'rgba(34,197,94,0.3)', color: '#86efac', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>● En ligne</span>
            </div>
            {/* Bouton cloche */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff', position: 'relative', backdropFilter: 'blur(4px)' }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: '#ef4444', borderRadius: '50%', fontSize: '0.65rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid transparent' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Panneau notifications */}
              {showNotifs && (
                <>
                  {/* Overlay pour fermer */}
                  <div onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                  <div style={{ position: 'fixed', right: 0, top: '48px', width: '340px', background: colors.cardBg, borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', border: `1px solid ${colors.border}`, zIndex: 999, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>Notifications</div>
                      {unreadCount > 0 && (
                        <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{unreadCount} nouvelles</span>
                      )}
                    </div>
                    {/* Liste */}
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
                    {/* Footer */}
                    <div style={{ padding: '0.75rem 1.25rem', borderTop: `1px solid ${colors.border}` }}>
                      <button onClick={markAllRead} style={{ width: '100%', padding: '0.65rem', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: colors.textSecondary, fontFamily: 'inherit' }}>
                        Tout marquer comme lu
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', background: colors.cardBg, borderRadius: '12px', padding: '0.35rem', marginBottom: '1.5rem', boxShadow: colors.shadow, width: 'fit-content', border: `1px solid ${colors.border}` }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: activeTab === tab.id ? '#fff' : colors.textSecondary, fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* VUE D'ENSEMBLE */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => router.push('/dashboard/analytics')}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(168,85,247,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = colors.shadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: colors.textSecondary, fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>{m.sub}</div>
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? m.color + '30' : m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{m.icon}</div>
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: colors.text, marginBottom: '0.4rem' }}>{m.value}</div>
                <span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>↗ {m.delta}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Graphique */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>📈 Analytics temps réel</div>
                <button onClick={() => router.push('/dashboard/analytics')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
              </div>
              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '6px', paddingBottom: '1.5rem' }}>
                {[65, 78, 72, 85, 90, 88, 95].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '100%', height: `${h * 1.7}px`, background: 'linear-gradient(180deg,rgba(168,85,247,0.8),rgba(236,72,153,0.4))', borderRadius: '6px 6px 0 0', cursor: 'pointer', transition: 'opacity .2s' }}
                      onMouseEnter={e => e.target.style.opacity = '0.7'}
                      onMouseLeave={e => e.target.style.opacity = '1'} />
                    <div style={{ fontSize: '0.65rem', color: colors.textMuted }}>{['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'][i]}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/dashboard/analytics')} style={{ width: '100%', padding: '0.6rem', background: 'rgba(168,85,247,0.08)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                📊 Voir le rapport complet
              </button>
            </div>

            {/* Plateformes */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>🌐 Répartition plateformes</div>
                <span style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 600 }}>● Live</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ec4899" strokeWidth="3.5" strokeDasharray="45 55" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? '#fff' : '#000'} strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="-45" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="15 85" strokeDashoffset="-75" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="10 90" strokeDashoffset="-90" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: colors.textMuted }}>Total</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: colors.text }}>284K</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[['Instagram','45%','#ec4899'],['TikTok','30%',isDark?'#aaa':'#000'],['YouTube','15%','#ef4444'],['LinkedIn','10%','#3b82f6']].map(([name,pct,color]) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <div style={{ fontSize: '0.78rem', color: colors.textSecondary, fontWeight: 500 }}>{name}</div>
                      <div style={{ fontSize: '0.78rem', color: colors.textMuted, marginLeft: 'auto' }}>{pct}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/partenaires')} style={{ width: '100%', padding: '0.6rem', background: 'rgba(168,85,247,0.08)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                👥 Gérer les partenaires
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMPAGNES & ACTIVITÉ */}
      {activeTab === 'activity' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🚀</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>Campagnes Live</span>
              </div>
              <button onClick={() => router.push('/dashboard/campaigns')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir toutes →</button>
            </div>
            {campaigns.map((c, i) => (
              <div key={i} style={{ padding: '1rem', border: `1px solid ${colors.border}`, borderRadius: '12px', marginBottom: '0.75rem', background: colors.inputBg, cursor: 'pointer', transition: 'border-color .2s' }}
                onClick={() => router.push('/dashboard/campaigns')}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#a855f7'}
                onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.text }}>{c.name}</span>
                  <span style={{ background: c.status === 'Actif' ? 'rgba(168,85,247,0.1)' : 'rgba(107,114,128,0.1)', color: c.status === 'Actif' ? '#a855f7' : '#6b7280', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>{c.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: colors.textMuted, marginBottom: '0.2rem' }}>
                  <span>Budget: {c.budget}</span><span>Dépensé: {c.spent}</span>
                </div>
                <div style={{ height: '4px', background: isDark ? '#2d2d4a' : '#f0f0f0', borderRadius: '2px', margin: '0.5rem 0' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, textAlign: 'right' }}>ROI: {c.roi}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => router.push('/dashboard/campaigns')} style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Nouvelle Campagne
              </button>
              <button onClick={() => router.push('/dashboard/analytics')} style={{ flex: 1, padding: '0.7rem', background: colors.surface, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                📊 Analytics
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>Activité Récente</span>
              </div>
            </div>
            {activities.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', transition: 'background .15s' }}
                onClick={() => router.push(a.route)}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(168,85,247,0.08)' : '#f5f3ff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text, marginBottom: '0.2rem' }}>{a.title}</div>
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>{a.desc}</div>
                  <div style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '0.2rem' }}>{a.time}</div>
                </div>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem', alignSelf: 'center' }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSIGHTS */}
      {activeTab === 'insights' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span>💡</span><span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>Opportunités IA</span>
            </div>
            {opportunities.map((o, i) => (
              <div key={i} style={{ border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', background: colors.inputBg }}>
                <span style={{ background: `${o.priorityColor}15`, color: o.priorityColor, fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{o.priority}</span>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.text, margin: '0.5rem 0 0.25rem' }}>{o.title}</div>
                <div style={{ fontSize: '0.78rem', color: colors.textSecondary, marginBottom: '0.75rem' }}>{o.desc}</div>
                <button onClick={() => router.push(o.route)} style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .2s' }}
                  onMouseEnter={e => e.target.style.opacity = '0.85'}
                  onMouseLeave={e => e.target.style.opacity = '1'}>
                  {o.action} →
                </button>
              </div>
            ))}
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span>💎</span><span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>Recommandations</span>
            </div>
            {recommendations.map((r, i) => (
              <div key={i} style={{ border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', background: colors.inputBg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.text }}>{r.title}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: colors.textSecondary, marginBottom: '0.75rem' }}>{r.desc}</div>
                <button onClick={() => router.push(r.route)} style={{ width: '100%', padding: '0.6rem', background: r.actionColor, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .2s' }}
                  onMouseEnter={e => e.target.style.opacity = '0.85'}
                  onMouseLeave={e => e.target.style.opacity = '1'}>
                  {r.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTUALITÉS */}
      {activeTab === 'news' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span>📰</span><span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>Actualités Marketing</span>
            </div>
            {news.map((n, i) => (
              <div key={i} style={{ padding: '0.85rem', borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: `${n.tagColor}15`, color: n.tagColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px' }}>{n.tag}</span>
                  <span style={{ fontSize: '0.7rem', color: colors.textMuted }}>{n.time} min</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text, marginBottom: '0.25rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.78rem', color: colors.textSecondary, lineHeight: 1.5 }}>{n.desc}</div>
              </div>
            ))}
            <button onClick={() => alert('Inscription à la newsletter confirmée !')} style={{ width: '100%', padding: '0.7rem', background: colors.surface, color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.5rem' }}>
              📧 S'abonner à la newsletter
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span>📚</span><span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>Ressources & Templates</span>
              </div>
              {resources.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: i < resources.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text }}>{r.title}</div>
                      <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>{r.desc}</div>
                    </div>
                  </div>
                  <button onClick={() => router.push(r.route)} style={{ padding: '0.4rem 0.9rem', background: r.actionColor, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    {r.action}
                  </button>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>✨ Nouveautés Partnexx</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { icon: '🤖', label: 'Nouveau',       title: 'IA Matchmaking',        desc: '127+ critères analysés', color: '#a855f7', route: '/dashboard/partenaires' },
                  { icon: '💸', label: 'Automatisation', title: 'Paiements Intelligents', desc: 'Escrow automatisé',       color: '#22c55e', route: '/dashboard/finance' },
                  { icon: '📊', label: 'Intelligence',   title: 'Analytics Prédictifs',  desc: 'Tendances 30 jours',      color: '#3b82f6', route: '/dashboard/analytics' },
                  { icon: '📋', label: 'Juridique',      title: 'Contrats Intelligents', desc: 'Signature automatique',    color: '#f59e0b', route: '/dashboard/contracts' },
                ].map((item, i) => (
                  <div key={i} onClick={() => router.push(item.route)} style={{ background: colors.inputBg, borderRadius: '10px', padding: '0.85rem', border: `1px solid ${colors.border}`, cursor: 'pointer', transition: 'border-color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = item.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}>
                    <span style={{ background: `${item.color}15`, color: item.color, fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{item.label}</span>
                    <div style={{ fontSize: '1.2rem', margin: '0.4rem 0 0.25rem' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}