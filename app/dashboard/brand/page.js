'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '@/lib/supabase'

export default function DashboardBrand() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [brand, setBrand] = useState(null)
  const [time, setTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: br } = await supabase.from('brands').select('*').eq('user_id', user.id).single()
      setBrand(br)
    }
    getUser()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Sophie'
  const hour = time.getHours()
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir'
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Accueil', href: null },
    { id: 'campaigns', icon: '📋', label: 'Gestion des campagnes', href: '/dashboard/campaigns' },
    { id: 'partners', icon: '🤝', label: 'Partenaires', href: null },
    { id: 'messages', icon: '💬', label: 'Messagerie', href: null },
    { id: 'analytics', icon: '📊', label: 'Analytics', href: null },
    { id: 'finance', icon: '💰', label: 'Gestion Financière', href: null },
    { id: 'contracts', icon: '📝', label: 'Contrats', href: null },
    { id: 'calendar', icon: '📅', label: 'Calendrier', href: null },
    { id: 'resources', icon: '📚', label: 'Ressources & Templates', href: null },
    { id: 'account', icon: '👤', label: 'Compte entreprise', href: null },
    { id: 'settings', icon: '⚙️', label: 'Paramètres', href: null },
  ]

  const tabs = [
    { id: 'overview', label: '🔄 Vue d\'ensemble' },
    { id: 'activity', label: '🚀 Campagnes & Activité' },
    { id: 'insights', label: '💡 Intelligence & Insights' },
    { id: 'news', label: '🌐 Actualités & Ressources' },
  ]

  const metrics = [
    { label: 'Chiffre d\'affaires', sub: 'Revenus totaux ce mois', value: '127,450€', delta: '+23.5%', icon: '💲', color: '#fef9c3' },
    { label: 'Campagnes actives', sub: 'Projets en cours', value: '12', delta: '+4', icon: '🚀', color: '#f0fdf4' },
    { label: 'Taux d\'engagement', sub: 'Moyenne toutes plateformes', value: '6.8%', delta: '+1.2%', icon: '❤️', color: '#fdf2f8' },
    { label: 'Impressions', sub: 'Portée ce mois', value: '3.2M', delta: '+18%', icon: '👁️', color: '#fef9c3' },
    { label: 'Partenaires', sub: 'Influenceurs actifs', value: '156', delta: '+12', icon: '👥', color: '#f0fdf4' },
    { label: 'ROI moyen', sub: 'Retour sur investissement', value: '287%', delta: '+45%', icon: '🎯', color: '#fdf2f8' },
  ]

  const campaigns = [
    { name: 'Beauty Summer', status: 'Actif', budget: '15 000€', spent: '12 400€', roi: '240%', progress: 83 },
    { name: 'Tech Launch', status: 'Actif', budget: '25 000€', spent: '24 800€', roi: '320%', progress: 99 },
    { name: 'Fashion Week', status: 'Terminé', budget: '8 000€', spent: '7 200€', roi: '180%', progress: 90 },
    { name: 'Fitness Goals', status: 'Actif', budget: '12 000€', spent: '9 800€', roi: '195%', progress: 82 },
  ]

  const activities = [
    { icon: '🚀', title: "Campagne 'Summer Beauty' lancée", desc: '15 influenceurs, budget 25K€, objectif 2M impressions', time: 'Il y a 2h', color: '#a855f7' },
    { icon: '💰', title: 'Paiement reçu - TechCorp', desc: 'Facturation campagne Q2 - 18,750€', time: 'Il y a 4h', color: '#22c55e' },
    { icon: '👥', title: 'Nouveau partenaire validé', desc: '@lifestyle_emma (250K followers) approuvée', time: 'Il y a 6h', color: '#3b82f6' },
    { icon: '📊', title: 'Rapport mensuel généré', desc: 'Performance +34% vs mois précédent', time: 'Hier', color: '#f59e0b' },
  ]

  const opportunities = [
    { priority: 'Priorité haute', title: 'Opportunité détectée', desc: 'Micro-influenceurs beauté : +67% d\'engagement vs macro-influenceurs ce mois', action: 'Ajuster stratégie', priorityColor: '#ef4444' },
    { priority: 'Priorité moyenne', title: 'Timing optimal identifié', desc: 'Publications TikTok : 18h-20h génèrent +89% d\'engagement', action: 'Programmer contenus', priorityColor: '#f59e0b' },
    { priority: 'Priorité haute', title: 'Tendance émergente', desc: 'Hashtag #EcoBeauty prédit +340% de croissance sous 15 jours', action: 'Créer campagne', priorityColor: '#ef4444' },
    { priority: 'Priorité moyenne', title: 'Surveillance concurrence', desc: 'Concurrent lance campagne similaire - impact potentiel -15%', action: 'Analyser', priorityColor: '#f59e0b' },
  ]

  const recommendations = [
    { icon: '⏰', title: 'Optimisation Timing', desc: 'Publier vos contenus entre 18h-20h pour +89% d\'engagement', action: 'Programmer automatiquement', actionColor: '#a855f7' },
    { icon: '📈', title: 'Tendance Émergente', desc: 'Hashtag #EcoBeauty en croissance de +340% - opportunité détectée', action: 'Créer campagne ciblée', actionColor: '#22c55e' },
    { icon: '⚠️', title: 'Alerte Concurrence', desc: 'Concurrent lance campagne similaire - impact potentiel -15%', action: 'Analyser et ajuster', actionColor: '#f59e0b' },
  ]

  const news = [
    { tag: 'Innovation', tagColor: '#a855f7', time: '2', title: "L'IA révolutionne le marketing d'influence", desc: "Les outils d'automatisation augmentent l'efficacité des campagnes de 37%." },
    { tag: 'Stratégie', tagColor: '#3b82f6', time: '5', title: 'Micro-influenceurs : la tendance qui domine 2025', desc: 'Les créateurs 10K-100K followers génèrent plus d\'engagement.' },
    { tag: 'Conformité', tagColor: '#ef4444', time: '7', title: 'Nouvelles obligations RGPD pour l\'influence marketing', desc: 'Guide complet des nouvelles règles européennes.' },
    { tag: 'E-commerce', tagColor: '#22c55e', time: '4', title: 'TikTok Shop explose : +240% de conversions', desc: 'Les fonctionnalités e-commerce natives transforment l\'influence marketing.' },
  ]

  const resources = [
    { icon: '📊', title: 'Guide Analytics 2025', desc: 'Template complet d\'analyse de performance', action: 'Télécharger', actionColor: '#a855f7' },
    { icon: '📋', title: 'Contrats Type', desc: 'Modèles juridiques pour influenceurs', action: 'Accéder', actionColor: '#3b82f6' },
    { icon: '🎓', title: 'Formation IA Marketing', desc: '5 modules pour maîtriser l\'IA', action: 'Commencer', actionColor: '#22c55e' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? '220px' : '60px', flexShrink: 0, background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', overflow: 'hidden', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#dg)"/>
              <defs><linearGradient id="dg" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
            </svg>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a202c' }}>Partnexx</div>
                <div style={{ fontSize: '0.62rem', color: '#a0aec0', fontWeight: 300, lineHeight: 1.2 }}>Des idées qui connectent, des partenariats qui transforment.</div>
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            item.href ? (
              <Link key={item.id} href={item.href} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.75rem', borderRadius: '10px', background: 'transparent', color: '#718096', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 400, marginBottom: '0.15rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; e.currentTarget.style.color = '#a855f7' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#718096' }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </Link>
            ) : (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.75rem', borderRadius: '10px', border: 'none', background: activeTab === item.id ? 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(236,72,153,0.08))' : 'transparent', color: activeTab === item.id ? '#a855f7' : '#718096', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: activeTab === item.id ? 600 : 400, marginBottom: '0.15rem', transition: 'all 0.2s', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </button>
            )
          ))}
        </nav>

        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.75rem', borderRadius: '10px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>
            <span>🚪</span>{sidebarOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Toggle sidebar */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'fixed', top: '1rem', left: sidebarOpen ? '228px' : '68px', zIndex: 101, width: '24px', height: '24px', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'left 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? '220px' : '60px', transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <div style={{ padding: '1.5rem' }}>

          {/* HERO BANNER */}
          <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
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
                    <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 500, backdropFilter: 'blur(5px)' }}>{tag}</span>
                  ))}
                </div>
                {/* BOUTONS LIÉS */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link href="/dashboard/campaigns" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(5px)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    + Nouvelle campagne
                  </Link>
                  <Link href="/dashboard/contracts" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(5px)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    📋 Gérer contrats
                  </Link>
                  <Link href="/dashboard/analytics" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(5px)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    📊 Voir rapports
                  </Link>
                </div>
              </div>
              <div style={{ textAlign: 'right', color: '#fff', flexShrink: 0, marginLeft: '1rem' }}>
                <div style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '0.2rem' }}>{dateStr}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{timeStr.slice(0,5)}</div>
                <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>
                  <span style={{ background: 'rgba(34,197,94,0.3)', color: '#86efac', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>● En ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '0', background: '#fff', borderRadius: '12px', padding: '0.35rem', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', width: 'fit-content' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: activeTab === tab.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* VUE D'ENSEMBLE */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {metrics.map((m, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#a0aec0', fontWeight: 500 }}>{m.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#cbd5e0' }}>{m.sub}</div>
                      </div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{m.icon}</div>
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.4rem' }}>{m.value}</div>
                    <span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>↗ {m.delta}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1.25rem' }}>📈 Analytics temps réel</div>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '6px', paddingBottom: '1.5rem' }}>
                    {[65, 78, 72, 85, 90, 88, 95].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '100%', height: `${h * 1.7}px`, background: 'linear-gradient(180deg,rgba(168,85,247,0.8),rgba(236,72,153,0.4))', borderRadius: '6px 6px 0 0' }} />
                        <div style={{ fontSize: '0.65rem', color: '#a0aec0' }}>{['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'][i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>🌐 Répartition plateformes</div>
                    <span style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 600 }}>● Live</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ec4899" strokeWidth="3.5" strokeDasharray="45 55" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#000" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="-45" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="15 85" strokeDashoffset="-75" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="10 90" strokeDashoffset="-90" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.62rem', color: '#a0aec0' }}>Total</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a202c' }}>284K</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[['Instagram', '45%', '#ec4899'], ['TikTok', '30%', '#000'], ['YouTube', '15%', '#ef4444'], ['LinkedIn', '10%', '#3b82f6']].map(([name, pct, color]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                          <div style={{ fontSize: '0.78rem', color: '#4a5568', fontWeight: 500 }}>{name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginLeft: 'auto' }}>{pct}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CAMPAGNES & ACTIVITÉ */}
          {activeTab === 'activity' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span>🚀</span><span style={{ fontWeight: 700, fontSize: '1rem' }}>Campagnes Live</span>
                </div>
                {campaigns.map((c, i) => (
                  <div key={i} style={{ padding: '1rem', border: '1px solid #f0f0f0', borderRadius: '12px', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                      <span style={{ background: c.status === 'Actif' ? 'rgba(168,85,247,0.1)' : 'rgba(107,114,128,0.1)', color: c.status === 'Actif' ? '#a855f7' : '#6b7280', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>{c.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#a0aec0', marginBottom: '0.2rem' }}>
                      <span>Budget: {c.budget}</span><span>Dépensé: {c.spent}</span>
                    </div>
                    <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', margin: '0.5rem 0' }}>
                      <div style={{ height: '100%', width: `${c.progress}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '2px' }} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, textAlign: 'right' }}>ROI: {c.roi}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <Link href="/dashboard/campaigns" style={{ flex: 1, padding: '0.7rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+ Nouvelle Campagne</Link>
                  <Link href="/dashboard/campaigns" style={{ flex: 1, padding: '0.7rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📊 Analytics</Link>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span>⚡</span><span style={{ fontWeight: 700, fontSize: '1rem' }}>Activité Récente</span>
                </div>
                {activities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem 0', borderBottom: i < activities.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a202c', marginBottom: '0.2rem' }}>{a.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{a.desc}</div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e0', marginTop: '0.2rem' }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSIGHTS */}
          {activeTab === 'insights' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}><span>💡</span><span style={{ fontWeight: 700, fontSize: '1rem' }}>Opportunités IA</span></div>
                {opportunities.map((o, i) => (
                  <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
                    <span style={{ background: `${o.priorityColor}15`, color: o.priorityColor, fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{o.priority}</span>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a202c', margin: '0.5rem 0 0.25rem' }}>{o.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.75rem' }}>{o.desc}</div>
                    <button style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{o.action} →</button>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}><span>💎</span><span style={{ fontWeight: 700, fontSize: '1rem' }}>Recommandations</span></div>
                {recommendations.map((r, i) => (
                  <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{r.icon}</span><span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.75rem' }}>{r.desc}</div>
                    <button style={{ width: '100%', padding: '0.6rem', background: r.actionColor, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{r.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTUALITÉS */}
          {activeTab === 'news' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}><span>📰</span><span style={{ fontWeight: 700, fontSize: '1rem' }}>Actualités Marketing</span></div>
                {news.map((n, i) => (
                  <div key={i} style={{ padding: '0.85rem 0', borderBottom: i < news.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ background: `${n.tagColor}15`, color: n.tagColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px' }}>{n.tag}</span>
                      <span style={{ fontSize: '0.7rem', color: '#a0aec0' }}>{n.time} min</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a202c', marginBottom: '0.25rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096', lineHeight: 1.5 }}>{n.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}><span>📚</span><span style={{ fontWeight: 700, fontSize: '1rem' }}>Ressources & Templates</span></div>
                  {resources.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: i < resources.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a202c' }}>{r.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{r.desc}</div>
                        </div>
                      </div>
                      <button style={{ padding: '0.4rem 0.9rem', background: r.actionColor, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{r.action}</button>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1rem' }}>✨ Nouveautés Partnexx</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[{ icon: '🤖', label: 'Nouveau', title: 'IA Matchmaking', color: '#a855f7' }, { icon: '💸', label: 'Auto', title: 'Paiements Intelligents', color: '#22c55e' }, { icon: '📊', label: 'Intelligence', title: 'Analytics Prédictifs', color: '#3b82f6' }, { icon: '📋', label: 'Juridique', title: 'Contrats Intelligents', color: '#f59e0b' }].map((item, i) => (
                      <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.85rem', border: '1px solid #f0f0f0' }}>
                        <span style={{ background: `${item.color}15`, color: item.color, fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{item.label}</span>
                        <div style={{ fontSize: '1.2rem', margin: '0.4rem 0 0.25rem' }}>{item.icon}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a202c' }}>{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}