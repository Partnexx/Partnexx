'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '@/lib/supabase'
import { useBrandData } from '@/lib/hook/useBrandData'
import { useNotifications } from '@/lib/hook/useNotifications'

export default function DashboardBrand() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [time, setTime] = useState(new Date())
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
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { brand, campaigns, collaborations, transactions, contracts, metrics, loading } = useBrandData(user?.id)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0] || brand?.company_name || 'vous'
  const hour = time.getHours()
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir'
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0)

  const statusLabel = (s) => ({
    in_progress: { label: 'En cours',   color: '#a855f7' },
    accepted:    { label: 'Acceptée',   color: '#22c55e' },
    pending:     { label: 'En attente', color: '#f59e0b' },
    completed:   { label: 'Terminée',   color: '#6b7280' },
    cancelled:   { label: 'Annulée',    color: '#ef4444' },
    active:      { label: 'Active',     color: '#22c55e' },
    draft:       { label: 'Brouillon',  color: '#6b7280' },
  }[s] || { label: s, color: '#6b7280' })

  const txStatusLabel = (s) => ({
    pending:    { label: 'En attente', color: '#f59e0b' },
    in_escrow:  { label: 'En escrow',  color: '#3b82f6' },
    released:   { label: 'Libéré',     color: '#22c55e' },
    refunded:   { label: 'Remboursé',  color: '#ef4444' },
    failed:     { label: 'Échoué',     color: '#ef4444' },
  }[s] || { label: s, color: '#6b7280' })

  const badge = (label, color) => (
    <span style={{ background: `${color}18`, color, fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
      {label}
    </span>
  )

  const openDispute = async (collab) => {
    const reason = prompt('Raison du litige :')
    if (!reason) return
    const description = prompt('Description (optionnel) :')
    const res = await fetch('/api/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collaborationId: collab.id, openedBy: user.id, openedByRole: 'brand', reason, description }),
    })
    const data = await res.json()
    if (data.success) alert('✅ Litige ouvert avec succès')
    else alert('❌ Erreur : ' + data.error)
  }

  const navItems = [
    { id: 'overview',       icon: '🏠', label: 'Accueil',                 href: null },
    { id: 'campaigns',      icon: '📋', label: 'Gestion des campagnes',   href: '/dashboard/brand/campaigns' },
    { id: 'partners',       icon: '👤', label: 'Partenaires',             href: null },
    { id: 'messages',       icon: '💬', label: 'Messagerie',              href: null },
    { id: 'analytics',      icon: '📊', label: 'Analytics',               href: null },
    { id: 'finance',        icon: '💰', label: 'Gestion Financière',      href: null },
    { id: 'contracts',      icon: '📝', label: 'Contrats',                href: null },
    { id: 'calendar',       icon: '📅', label: 'Calendrier',              href: null },
    { id: 'resources',      icon: '📚', label: 'Ressources & Templates',  href: null },
    { id: 'account',        icon: '🏢', label: 'Compte entreprise',       href: null },
    { id: 'settings',       icon: '⚙️', label: 'Paramètres',              href: null },
  ]

  const card = { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
      <div style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? '240px' : '64px', flexShrink: 0, background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', overflow: 'hidden', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>P</span>
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a202c' }}>Partnexx</div>
                <div style={{ fontSize: '0.62rem', color: '#a0aec0' }}>Des idées qui connectent.</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            item.href ? (
              <Link key={item.id} href={item.href} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '10px', color: '#718096', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 400, marginBottom: '0.1rem', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </Link>
            ) : (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '10px', border: 'none', background: activeTab === item.id ? 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(236,72,153,0.08))' : 'transparent', color: activeTab === item.id ? '#a855f7' : '#718096', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: activeTab === item.id ? 600 : 400, marginBottom: '0.1rem', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </button>
            )
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid #f0f0f0' }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                {firstName.slice(0, 1).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a202c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brand?.company_name || profile?.full_name}</div>
                <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Marque</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '10px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>
            <span>🚪</span>{sidebarOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Toggle sidebar */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'fixed', top: '1.25rem', left: sidebarOpen ? '248px' : '72px', zIndex: 101, width: '24px', height: '24px', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'left 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? '240px' : '64px', transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <div style={{ padding: '1.5rem' }}>

          {/* HERO */}
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)', borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', color: '#fff' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{greeting} {brand?.company_name || firstName} 👋</h1>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    🚀 Votre empire influence génère <strong>{fmt(metrics?.totalDepense)}</strong> avec <strong>{metrics?.campagnesActives ?? 0} campagnes actives</strong>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                    🤖 IA analysant 24/7 · {metrics?.collaborationsActives ?? 0} collaborations actives · ROI optimisé
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>{dateStr}</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.1 }}>{timeStr}</div>
                  <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>
                    <span style={{ background: 'rgba(34,197,94,0.3)', color: '#86efac', padding: '0.15rem 0.6rem', borderRadius: '100px' }}>● En ligne</span>
                  </div>
                  {/* Notif bell */}
                  <button onClick={markAllAsRead} style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: '#fff', fontSize: '1rem', position: 'relative' }}>
                    🔔
                    {unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {[
                  { label: '🏆 Score Expert: 94/100', bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.25)' },
                  { label: '✨ Plan Enterprise Pro', bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.25)' },
                  { label: `📈 ${fmt(metrics?.totalDepense)} dépensés`, bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.4)' },
                  { label: `🔒 ${fmt(metrics?.enEscrow)} en escrow`, bg: 'rgba(59,130,246,0.2)', border: 'rgba(59,130,246,0.4)' },
                ].map((tag, i) => (
                  <span key={i} style={{ background: tag.bg, color: '#fff', fontSize: '0.78rem', padding: '0.35rem 0.85rem', borderRadius: '100px', fontWeight: 600, border: `1px solid ${tag.border}` }}>
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Boutons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/dashboard/brand/campaigns" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                  + Nouvelle campagne
                </Link>
                <button onClick={() => setActiveTab('contracts')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📝 Gérer contrats
                </button>
                <button onClick={() => setActiveTab('analytics')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📊 Voir rapports
                </button>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: '12px', padding: '0.35rem', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', gap: '0.25rem', overflowX: 'auto' }}>
            {[
              { id: 'overview',       label: 'Vue d\'ensemble' },
              { id: 'collaborations', label: 'Campagnes & Activité' },
              { id: 'analytics',      label: 'Intelligence & Insights' },
              { id: 'finance',        label: 'Actualités & Ressources' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: activeTab === tab.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* VUE D'ENSEMBLE */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Chiffre d\'affaires',    value: fmt(metrics?.totalDepense),          sub: 'Revenus totaux ce mois',       icon: '💰', color: '#a855f7' },
                  { label: 'Campagnes actives',       value: metrics?.campagnesActives ?? 0,      sub: 'Projets en cours',             icon: '🚀', color: '#22c55e' },
                  { label: 'Collaborations',          value: metrics?.collaborationsTotal ?? 0,   sub: 'Partenariats influenceurs',    icon: '🤝', color: '#3b82f6' },
                  { label: 'En escrow',               value: fmt(metrics?.enEscrow),              sub: 'En attente de validation',     icon: '🔒', color: '#f59e0b' },
                ].map((m, i) => (
                  <div key={i} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#a0aec0', fontWeight: 500 }}>{m.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#cbd5e0' }}>{m.sub}</div>
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{m.icon}</div>
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>🚀 Mes campagnes</div>
                    <Link href="/dashboard/brand/campaigns" style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</Link>
                  </div>
                  {campaigns.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', padding: '2rem 0' }}>
                      Aucune campagne — <Link href="/dashboard/brand/campaigns" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>créez-en une</Link>
                    </div>
                  ) : campaigns.slice(0, 4).map((c, i) => {
                    const s = statusLabel(c.status)
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a202c' }}>{c.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a202c' }}>{fmt(c.budget_total)}</span>
                          {badge(s.label, s.color)}
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/dashboard/brand/campaigns" style={{ display: 'block', marginTop: '1rem', padding: '0.7rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                    + Nouvelle campagne
                  </Link>
                </div>

                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>💰 Dernières transactions</div>
                    <button onClick={() => setActiveTab('finance')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
                  </div>
                  {transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', padding: '2rem 0' }}>Aucune transaction pour l'instant</div>
                  ) : transactions.slice(0, 5).map((t, i) => {
                    const s = txStatusLabel(t.status)
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a202c' }}>{t.description || 'Paiement campagne'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a202c' }}>{fmt(t.amount)}</span>
                          {badge(s.label, s.color)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* COLLABORATIONS */}
          {activeTab === 'collaborations' && (
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1.25rem' }}>🤝 Mes collaborations</div>
              {collaborations.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', padding: '3rem 0' }}>Aucune collaboration pour l'instant</div>
              ) : collaborations.map((c, i) => {
                const s = statusLabel(c.status)
                return (
                  <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
                          {c.campaigns?.title || 'Campagne'} — {c.influencers?.display_name || 'Influenceur'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>Démarrée le {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a202c' }}>{fmt(c.agreed_rate)}</span>
                        {badge(s.label, s.color)}
                      </div>
                    </div>
                    {c.status === 'in_progress' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ✅ Valider le livrable
                        </button>
                        <button style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          💬 Demander une révision
                        </button>
                        <button onClick={() => openDispute(c)} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ⚠️ Ouvrir un litige
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1.25rem' }}>📊 Analytics & Insights</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total dépensé', value: fmt(metrics?.totalDepense), color: '#a855f7', icon: '💸' },
                  { label: 'En escrow',     value: fmt(metrics?.enEscrow),     color: '#3b82f6', icon: '🔒' },
                  { label: 'Collaborations',value: metrics?.collaborationsTotal ?? 0, color: '#22c55e', icon: '🤝' },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '1.5rem', background: `${m.color}08`, borderRadius: '12px', border: `1px solid ${m.color}20` }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginTop: '0.25rem' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FINANCE */}
          {activeTab === 'finance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total dépensé', value: fmt(metrics?.totalDepense), color: '#ef4444', icon: '💸' },
                  { label: 'En escrow',     value: fmt(metrics?.enEscrow),     color: '#3b82f6', icon: '🔒' },
                  { label: 'Transactions',  value: transactions.length,         color: '#a855f7', icon: '📊' },
                ].map((m, i) => (
                  <div key={i} style={{ ...card, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color, marginBottom: '0.25rem' }}>{m.value}</div>
                    <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1.25rem' }}>💰 Historique des paiements</div>
                {transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', padding: '3rem 0' }}>Aucune transaction pour l'instant</div>
                ) : transactions.map((t, i) => {
                  const s = txStatusLabel(t.status)
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i < transactions.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                          {t.status === 'released' ? '✅' : t.status === 'in_escrow' ? '🔒' : t.status === 'refunded' ? '↩️' : '⏳'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a202c' }}>{t.description || 'Paiement campagne'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.25rem' }}>{fmt(t.amount)}</div>
                        {badge(s.label, s.color)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CONTRATS */}
          {activeTab === 'contracts' && (
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1.25rem' }}>📝 Mes contrats</div>
              {contracts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', padding: '3rem 0' }}>Aucun contrat pour l'instant</div>
              ) : contracts.map((c, i) => (
                <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>Contrat #{c.id.slice(0, 8)}</div>
                      <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>Créé le {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a202c' }}>{fmt(c.amount)}</span>
                      {badge(c.status === 'signed' ? '✅ Signé' : 'En attente', c.status === 'signed' ? '#22c55e' : '#f59e0b')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {c.pdf_url && (
                      <a href={c.pdf_url} target="_blank" rel="noreferrer" style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                        📄 Voir le PDF
                      </a>
                    )}
                    {c.brand_signed_at === null && (
                      <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        ✍️ Signer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sections placeholder */}
          {['partners', 'messages', 'calendar', 'resources', 'account', 'settings'].includes(activeTab) && (
            <div style={{ ...card, textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a202c', marginBottom: '0.5rem' }}>Section en développement</div>
              <div style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Cette section sera disponible prochainement</div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}