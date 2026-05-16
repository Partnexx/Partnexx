'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useInfluencerData } from '@/lib/hook/useInfluencerData'
import { useNotifications } from '@/lib/hook/useNotifications'

export default function DashboardInfluencer() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('accueil')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
  }, [])

  const { collaborations, transactions, contracts, metrics, loading } = useInfluencerData(user?.id)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id)

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'toi'
  const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { id: 'accueil',     icon: '🏠', label: 'Accueil' },
    { id: 'opportunites', icon: '🔍', label: 'Opportunités' },
    { id: 'statistiques', icon: '📊', label: 'Statistiques' },
    { id: 'messagerie',  icon: '💬', label: 'Messagerie' },
    { id: 'profil',      icon: '👤', label: 'Profil' },
    { id: 'collaborations', icon: '🤝', label: 'Collaborations' },
    { id: 'notes',       icon: '📝', label: 'Notes & Feedback' },
    { id: 'contrats',    icon: '📋', label: 'Contrats & Paiements' },
    { id: 'ressources',  icon: '📚', label: 'Ressources & Templates' },
    { id: 'parametres',  icon: '⚙️', label: 'Paramètres' },
  ]

  const podium = [
    { rank: 1, name: 'Emma Beauty', followers: '2.1M', color: '#f59e0b', emoji: '👑' },
    { rank: 2, name: 'TechPro', followers: '1.8M', color: '#94a3b8', emoji: '🥈' },
    { rank: 3, name: 'Fashion', followers: '1.5M', color: '#cd7c3a', emoji: '🥉' },
    { rank: 4, name: 'HealthyLife', followers: '1.2M', engagement: '7.1%' },
    { rank: 5, name: profile?.full_name || 'Vous', followers: '430K', engagement: '6.8%', isMe: true },
  ]

  const news = [
    { title: 'Nouvelle fonctionnalité IA pour optimiser vos posts', time: 'Il y a 1 jour', color: '#a855f7' },
    { title: 'TikTok lance son nouveau programme créateur', time: 'Il y a 2 jours', color: '#ef4444' },
    { title: 'Nouvelle intégration avec Shopify disponible', time: 'Il y a 3 jours', color: '#22c55e' },
    { title: 'Tendances influence Q1 2026 publiées', time: 'Il y a 4 jours', color: '#3b82f6' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ color: '#a855f7', fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f7ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? '230px' : '64px', flexShrink: 0, background: '#fff', borderRight: '1px solid #ede9fe', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, transition: 'width 0.2s', overflow: 'hidden' }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #ede9fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>💜</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a2e' }}>Partexx</div>
                <div style={{ fontSize: '0.62rem', color: '#a0aec0', lineHeight: 1.3 }}>Connecter marques et influenceurs, rapidement, intelligemment.</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.75rem', borderRadius: '10px', border: 'none', background: activeNav === item.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: activeNav === item.id ? '#fff' : '#718096', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: activeNav === item.id ? 600 : 400, marginBottom: '0.1rem', textAlign: 'left', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid #ede9fe' }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {firstName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a2e' }}>{profile?.full_name || firstName}</div>
                <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>@{profile?.username || 'influenceur'}</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.75rem', borderRadius: '10px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>
            <span>🚪</span>{sidebarOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Toggle sidebar */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'fixed', top: '1rem', left: sidebarOpen ? '238px' : '72px', zIndex: 101, width: '24px', height: '24px', borderRadius: '50%', background: '#fff', border: '1px solid #ede9fe', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'left 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#718096' }}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? '230px' : '64px', transition: 'margin-left 0.2s', minHeight: '100vh', padding: '1.5rem' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.3rem' }}>Bonjour {firstName} ! 👋</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', margin: 0 }}>Trouve tes meilleurs partenaires dès maintenant</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* Partnexx Score */}
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem' }}>⭐</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Partnexx Score</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>92</div>
              </div>
              {/* Abonnement */}
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem' }}>💎</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Abonnement</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Partnexx Pro</div>
              </div>
              {/* Dernière connexion */}
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem' }}>🕐</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Dernière connexion</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Aujourd'hui</div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLEAU DE BORD */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #ede9fe', boxShadow: '0 2px 12px rgba(168,85,247,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📊</span>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Tableau de bord</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Argent généré', value: fmt(metrics?.totalGains), icon: '💲', color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Campagnes en cours', value: metrics?.collaborationsActives || 0, icon: '🎯', color: '#a855f7', bg: '#faf5ff' },
              { label: 'Réponses reçues', value: 12, icon: '💬', color: '#22c55e', bg: '#f0fdf4' },
              { label: 'Impressions de vues', value: '1.2M', icon: '👁', color: '#6b7280', bg: '#f9fafb' },
            ].map((m, i) => (
              <div key={i} style={{ background: m.bg, borderRadius: '14px', padding: '1.25rem', border: `1px solid ${m.color}20` }}>
                <div style={{ fontSize: '1.5rem', color: m.color, marginBottom: '0.5rem' }}>{m.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color, marginBottom: '0.2rem' }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setActiveNav('statistiques')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              📊 Voir mes statistiques
            </button>
          </div>
        </div>

        {/* GRID BAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Actualités */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ede9fe', boxShadow: '0 2px 12px rgba(168,85,247,0.06)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem' }}>🗞️ Actualités & Nouveautés Partnexx</h2>
            {news.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderBottom: i < news.length - 1 ? '1px solid #f3f0ff' : 'none', cursor: 'pointer' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {i === 0 ? '🤖' : i === 1 ? '🎵' : i === 2 ? '🛍️' : '📈'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Podium */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ede9fe', boxShadow: '0 2px 12px rgba(168,85,247,0.06)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>🏆 Podium des Influenceurs</h2>

            {/* Top 3 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* 2ème */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                <div style={{ background: '#94a3b8', color: '#fff', borderRadius: '10px', padding: '0.5rem 0.75rem', textAlign: 'center', width: '70px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700 }}>TechPro</div>
                  <div style={{ fontSize: '0.62rem', opacity: 0.9 }}>1.8M</div>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>🥈 2ème</div>
              </div>
              {/* 1er */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '3px solid #f59e0b' }}>👩</div>
                  <div style={{ position: 'absolute', top: '-8px', right: '-4px', fontSize: '1rem' }}>👑</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#fff', borderRadius: '10px', padding: '0.5rem 0.75rem', textAlign: 'center', width: '80px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Emma Beauty</div>
                  <div style={{ fontSize: '0.62rem', opacity: 0.9 }}>2.1M</div>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b' }}>🥇 1er</div>
              </div>
              {/* 3ème */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👗</div>
                <div style={{ background: '#cd7c3a', color: '#fff', borderRadius: '10px', padding: '0.5rem 0.75rem', textAlign: 'center', width: '70px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700 }}>Fashion</div>
                  <div style={{ fontSize: '0.62rem', opacity: 0.9 }}>1.5M</div>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#cd7c3a' }}>🥉 3ème</div>
              </div>
            </div>

            {/* Autres classements */}
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#a0aec0', marginBottom: '0.75rem' }}>Autres classements</div>
            {[
              { rank: 4, name: 'HealthyLife', followers: '1.2M', engagement: '7.1%' },
              { rank: 5, name: profile?.full_name || firstName, followers: '430K', engagement: '6.8%', isMe: true },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '10px', background: item.isMe ? 'rgba(168,85,247,0.06)' : '#f8f9ff', marginBottom: '0.5rem', border: item.isMe ? '1px solid rgba(168,85,247,0.2)' : '1px solid transparent' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: item.isMe ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: item.isMe ? '#fff' : '#718096', flexShrink: 0 }}>{item.rank}</div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: item.isMe ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e' }}>{item.name} {item.isMe && <span style={{ fontSize: '0.65rem', background: 'rgba(168,85,247,0.15)', color: '#a855f7', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.25rem' }}>C'est vous !</span>}</div>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{item.followers} · {item.engagement}</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#a0aec0', fontWeight: 500 }}>{item.rank}ème</div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}