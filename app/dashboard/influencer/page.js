'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '@/lib/supabase'
import { useBrandData } from '@/lib/hook/useBrandData'

export default function DashboardBrand() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [time, setTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Campagnes state
  const [campMainTab, setCampMainTab] = useState('create')
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [recruitTab, setRecruitTab] = useState('candidatures')
  const [ugcTab, setUgcTab] = useState('feed')
  const [campLoading, setCampLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnalyzed, setIaAnalyzed] = useState(false)
  const [form, setForm] = useState({
    audience: '', categories: [], name: '', type: '', objectives: [],
    details: '', startDate: '', endDate: '', deadline: '', indefinite: false,
    accessType: 'open', commission: '15', salesTarget: '10000', bonus: '',
    contentTypes: [], quantity: '', constraints: '',
    iaAudience: '', iaContentType: '', iaValues: '', iaAnalysisType: 'matching',
  })

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'vous'
  const hour = time.getHours()
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir'
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const toggleArr = (key, val) => setForm(f => ({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }))

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

  const handleCreate = async () => {
    setCampLoading(true)
    try {
      const { data: brandData } = await supabase.from('brands').select('id').eq('user_id', profile?.id).single()
      if (brandData) {
        await supabase.from('campaigns').insert({
          brand_id: brandData.id,
          title: form.name || 'Ma campagne',
          target_niches: form.categories,
          goals: form.objectives,
          description: form.details,
          start_date: form.startDate || null,
          end_date: form.endDate || null,
          commission_rate: parseFloat(form.commission) || 0,
          budget_total: parseFloat(form.salesTarget) || 0,
          payment_mode: 'commission',
          status: 'active',
          is_public: form.accessType === 'open',
        })
      }
      setSuccess(true)
    } catch (e) { console.error(e) }
    setCampLoading(false)
  }

  const navItems = [
    { id: 'overview',       icon: '🏠', label: 'Accueil' },
    { id: 'campaigns',      icon: '📋', label: 'Gestion des campagnes' },
    { id: 'collaborations', icon: '🤝', label: 'Collaborations' },
    { id: 'messages',       icon: '💬', label: 'Messagerie' },
    { id: 'analytics',      icon: '📊', label: 'Analytics' },
    { id: 'finance',        icon: '💰', label: 'Gestion Financière' },
    { id: 'contracts',      icon: '📝', label: 'Contrats' },
    { id: 'settings',       icon: '⚙️', label: 'Paramètres' },
  ]

  const tabs = [
    { id: 'overview',       label: '🔄 Vue d\'ensemble' },
    { id: 'campaigns',      label: '📋 Campagnes' },
    { id: 'collaborations', label: '🤝 Collaborations' },
    { id: 'finance',        label: '💰 Finance' },
    { id: 'contracts',      label: '📋 Contrats' },
  ]

  const card = { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }
  const inp = { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  const lbl = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }
  const stepLabels = ['Audience', 'Catégories', 'Détails', 'Dates', 'Budget', 'Contenus', 'Récapitulatif']
  const progress = ((step - 1) / 6) * 100

  const ugcCreators = [
    { name: 'anna_content', followers: '12.4K', engagement: '6.2%', niche: 'Beauté', tags: ['Skincare', 'Wellness'], gradient: 'linear-gradient(135deg,#f9a8d4,#e879f9)', img: '👩' },
    { name: 'alex_chen', followers: '8.9K', engagement: '7.1%', niche: 'Mode', tags: ['Fashion', 'Makeup'], gradient: 'linear-gradient(135deg,#fed7aa,#fbbf24)', img: '🧑' },
    { name: 'olivia_studio', followers: '15.2K', engagement: '5.8%', niche: 'Lifestyle', tags: ['Lifestyle', 'Beauty'], gradient: 'linear-gradient(135deg,#bfdbfe,#93c5fd)', img: '👩‍🦰' },
    { name: 'leo_sports', followers: '9.3K', engagement: '8.4%', niche: 'Sport', tags: ['Sport', 'Wellness'], gradient: 'linear-gradient(135deg,#bbf7d0,#4ade80)', img: '🏋️' },
    { name: 'mia_beauty', followers: '22.1K', engagement: '4.9%', niche: 'Beauté', tags: ['Beauté', 'Makeup'], gradient: 'linear-gradient(135deg,#fde68a,#fb923c)', img: '💄' },
    { name: 'tech_creator', followers: '18.7K', engagement: '6.7%', niche: 'Tech', tags: ['Gaming', 'Tech'], gradient: 'linear-gradient(135deg,#c7d2fe,#818cf8)', img: '💻' },
  ]
  const campList = ['Programme Affiliation Beauty 2024', 'Collection Printemps 2024', 'Programme Ambassadeurs Tech 2024']
  const candidates = [
    { id: 1, name: 'skincare_addict', avatar: 'SA', followers: '45K', platform: 'Beauty', date: '12 jan. 2025', status: 'Accepté' },
    { id: 2, name: 'makeup_queen', avatar: 'MQ', followers: '38K', platform: 'Beauty', date: '12 jan. 2025', status: 'Accepté' },
    { id: 3, name: 'natural_glow', avatar: 'NG', followers: '22K', platform: 'Beauty', date: '19 jan. 2025', status: 'En attente' },
    { id: 4, name: 'glam_guru', avatar: 'GG', followers: '67K', platform: 'Fashion', date: '14 jan. 2025', status: 'En attente' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
      <div style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  )

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
            {sidebarOpen && <div><div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a202c' }}>Partnexx</div><div style={{ fontSize: '0.62rem', color: '#a0aec0', fontWeight: 300 }}>Des idées qui connectent.</div></div>}
          </div>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.75rem', borderRadius: '10px', border: 'none', background: activeTab === item.id ? 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(236,72,153,0.08))' : 'transparent', color: activeTab === item.id ? '#a855f7' : '#718096', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: activeTab === item.id ? 600 : 400, marginBottom: '0.15rem', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.75rem', borderRadius: '10px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>
            <span>🚪</span>{sidebarOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'fixed', top: '1rem', left: sidebarOpen ? '228px' : '68px', zIndex: 101, width: '24px', height: '24px', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'left 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? '220px' : '60px', transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        <div style={{ padding: '1.5rem' }}>

          {/* HERO */}
          <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  {greeting} {brand?.company_name || firstName} 👋
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
                  {metrics?.campagnesActives > 0
                    ? `🚀 ${metrics.campagnesActives} campagne${metrics.campagnesActives > 1 ? 's' : ''} active${metrics.campagnesActives > 1 ? 's' : ''} · ${fmt(metrics.totalDepense)} dépensés`
                    : '🚀 Bienvenue sur Partnexx — créez votre première campagne'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {[
                    { label: `💸 ${fmt(metrics?.totalDepense)} dépensés`, bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.4)' },
                    { label: `🔒 ${fmt(metrics?.enEscrow)} en escrow`, bg: 'rgba(59,130,246,0.2)', border: 'rgba(59,130,246,0.4)' },
                    { label: `📋 ${metrics?.campagnesTotal ?? 0} campagne${(metrics?.campagnesTotal ?? 0) > 1 ? 's' : ''}`, bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.3)' },
                  ].map((tag, i) => (
                    <span key={i} style={{ background: tag.bg, color: '#fff', fontSize: '0.78rem', padding: '0.35rem 0.85rem', borderRadius: '100px', fontWeight: 600, border: `1px solid ${tag.border}` }}>{tag.label}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveTab('campaigns')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    + Nouvelle campagne
                  </button>
                  <button onClick={() => setActiveTab('contracts')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    📋 Gérer contrats
                  </button>
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
          <div style={{ display: 'flex', background: '#fff', borderRadius: '12px', padding: '0.35rem', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', width: 'fit-content' }}>
            {tabs.map(tab => (
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
                  { label: 'Total dépensé', value: fmt(metrics?.totalDepense), sub: 'Escrow + libérés', icon: '💸', color: '#ef4444' },
                  { label: 'En escrow', value: fmt(metrics?.enEscrow), sub: 'En attente de validation', icon: '🔒', color: '#3b82f6' },
                  { label: 'Campagnes actives', value: metrics?.campagnesActives ?? 0, sub: `Sur ${metrics?.campagnesTotal ?? 0} au total`, icon: '🚀', color: '#a855f7' },
                  { label: 'Collaborations actives', value: metrics?.collaborationsActives ?? 0, sub: `Sur ${metrics?.collaborationsTotal ?? 0} au total`, icon: '🤝', color: '#22c55e' },
                ].map((m, i) => (
                  <div key={i} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div><div style={{ fontSize: '0.78rem', color: '#a0aec0', fontWeight: 500 }}>{m.label}</div><div style={{ fontSize: '0.7rem', color: '#cbd5e0' }}>{m.sub}</div></div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{m.icon}</div>
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c' }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>🚀 Mes campagnes</div>
                    <button onClick={() => setActiveTab('campaigns')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
                  </div>
                  {campaigns.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', padding: '2rem 0' }}>
                      Aucune campagne — <button onClick={() => setActiveTab('campaigns')} style={{ color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '0.85rem', padding: 0 }}>créez-en une</button>
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
                  <button onClick={() => setActiveTab('campaigns')} style={{ display: 'block', width: '100%', marginTop: '1rem', padding: '0.7rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    + Nouvelle campagne
                  </button>
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

          {/* CAMPAGNES */}
          {activeTab === 'campaigns' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Gestion des campagnes</h2>
                <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
              </div>

              {/* Sous-tabs campagnes */}
              <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', background: '#fff', borderRadius: '12px', padding: '0.4rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', width: 'fit-content' }}>
                {[
                  { id: 'create', icon: '✨', label: 'Créer une campagne', color: '#22c55e' },
                  { id: 'recruit', icon: '⏱', label: 'Recrutement', color: '#f97316' },
                  { id: 'suivi', icon: '📊', label: 'Suivi des opérations', color: '#3b82f6' },
                  { id: 'ugc', icon: '👥', label: 'Créateurs UGC', color: '#a855f7' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => { setCampMainTab(tab.id); setStep(1); setSuccess(false) }} style={{ padding: '0.65rem 1.4rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: campMainTab === tab.id ? 700 : 400, background: campMainTab === tab.id ? tab.color : 'transparent', color: campMainTab === tab.id ? '#fff' : '#718096', borderRadius: '8px', transition: 'all 0.2s' }}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* CRÉER CAMPAGNE */}
              {campMainTab === 'create' && !success && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', margin: 0 }}>Créer une nouvelle campagne</h3>
                    <span style={{ fontSize: '0.82rem', color: '#718096', background: '#f0f0f0', padding: '0.3rem 0.8rem', borderRadius: '100px' }}>Étape {step} sur 7</span>
                  </div>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '0.5rem' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '2px', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 600, marginBottom: '1.5rem' }}>{stepLabels[step - 1]}</div>

                  {step === 1 && (
                    <div style={card}>
                      <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Quelle taille d'audience recherchez-vous ?</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {['0 à 10 000 abonnés', '10 000 à 50 000', '50 000 à 200 000', '200 000 à 1 M', '1 M+'].map((opt, i) => (
                          <div key={opt} onClick={() => set('audience', opt)} style={{ padding: '1.25rem', border: `2px solid ${form.audience === opt ? '#a855f7' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', background: form.audience === opt ? 'rgba(168,85,247,0.04)' : '#fff', gridColumn: i === 4 ? '1' : 'auto' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.audience === opt ? '#a855f7' : '#cbd5e0'}`, background: form.audience === opt ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {form.audience === opt && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                            </div>
                            <span style={{ fontWeight: 500, color: '#1a202c' }}>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div style={card}>
                      <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Dans quelles catégories opérez-vous ?</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {['Mode', 'Beauté', 'Sport', 'Gaming', 'Tech', 'Lifestyle', 'Food', 'Finance', 'Développement personnel', 'Automobile', 'Autres'].map(cat => (
                          <div key={cat} onClick={() => toggleArr('categories', cat)} style={{ padding: '1rem', border: `2px solid ${form.categories.includes(cat) ? '#a855f7' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', background: form.categories.includes(cat) ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.categories.includes(cat) ? '#a855f7' : '#cbd5e0'}`, background: form.categories.includes(cat) ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {form.categories.includes(cat) && <span style={{ color: '#fff', fontSize: '0.65rem' }}>✓</span>}
                            </div>
                            <span style={{ fontWeight: 500, color: '#1a202c', fontSize: '0.875rem' }}>{cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div style={card}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' }}>Détails de votre campagne</h3>
                      <div style={{ marginBottom: '1.25rem' }}><label style={lbl}>Nom de la campagne *</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Lancement collection automne 2024" style={inp} /></div>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={lbl}>Type de campagne *</label>
                        {[{ id: 'affiliation', icon: '⭐', label: 'Affiliation', desc: 'basée sur la performance' }, { id: 'placement', icon: '🎁', label: 'Placement de produit', desc: 'visibilité et contenu sponsorisé' }, { id: 'ambassadeur', icon: '🤝', label: 'Ambassadeur de marque', desc: 'collaboration longue durée' }, { id: 'notoriete', icon: '📢', label: 'Campagne de notoriété', desc: 'lancement ou visibilité massive' }].map(t => (
                          <div key={t.id} onClick={() => set('type', t.id)} style={{ padding: '0.9rem 1.25rem', border: `1.5px solid ${form.type === t.id ? '#a855f7' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: form.type === t.id ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form.type === t.id ? '#a855f7' : '#cbd5e0'}`, background: form.type === t.id ? '#a855f7' : '#fff', flexShrink: 0 }} />
                            <div><span style={{ fontWeight: 600 }}>{t.icon} {t.label}</span><span style={{ color: '#718096', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{t.desc}</span></div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={lbl}>Objectifs *</label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          {['Notoriété', 'Engagement', 'Ventes / Conversions'].map(obj => (
                            <div key={obj} onClick={() => toggleArr('objectives', obj)} style={{ flex: 1, padding: '0.75rem', border: `1.5px solid ${form.objectives.includes(obj) ? '#a855f7' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: form.objectives.includes(obj) ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${form.objectives.includes(obj) ? '#a855f7' : '#cbd5e0'}`, background: form.objectives.includes(obj) ? '#a855f7' : '#fff', flexShrink: 0 }} />
                              <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div><label style={lbl}>Détails</label><textarea value={form.details} onChange={e => set('details', e.target.value)} placeholder="Décrivez les détails..." rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
                    </div>
                  )}

                  {step === 4 && (
                    <div style={card}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' }}>Planification temporelle</h3>
                      <div onClick={() => set('indefinite', !form.indefinite)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form.indefinite ? '#a855f7' : '#cbd5e0'}`, background: form.indefinite ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {form.indefinite && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>Durée indéterminée</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {[['Date de début *', 'startDate'], ['Date de fin *', 'endDate'], ['Deadline des contenus *', 'deadline']].map(([label, key]) => (
                          <div key={key}><label style={lbl}>{label}</label><input type="date" value={form[key]} onChange={e => set(key, e.target.value)} disabled={form.indefinite} style={{ ...inp, opacity: form.indefinite ? 0.5 : 1 }} /></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div style={card}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' }}>Budget et rémunération</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div><label style={lbl}>Taux de commission (%) *</label><input value={form.commission} onChange={e => set('commission', e.target.value)} placeholder="15" style={inp} /></div>
                        <div><label style={lbl}>Objectif de vente (€) *</label><input value={form.salesTarget} onChange={e => set('salesTarget', e.target.value)} placeholder="10000" style={inp} /></div>
                      </div>
                      <div><label style={lbl}>Bonus palier (optionnel)</label><input value={form.bonus} onChange={e => set('bonus', e.target.value)} placeholder="Ex: +5% au-delà de 10 000€" style={inp} /></div>
                    </div>
                  )}

                  {step === 6 && (
                    <div style={card}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Contenus attendus</h3>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={lbl}>Types de contenu *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                          {['Post Instagram', 'Story Instagram', 'Reel Instagram', 'TikTok', 'Vidéo YouTube', 'Post LinkedIn', 'Tweet'].map(ct => (
                            <div key={ct} onClick={() => toggleArr('contentTypes', ct)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form.contentTypes.includes(ct) ? '#a855f7' : '#cbd5e0'}`, background: form.contentTypes.includes(ct) ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {form.contentTypes.includes(ct) && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                              </div>
                              <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{ct}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div><label style={lbl}>Quantité par influenceur *</label>
                        <select value={form.quantity} onChange={e => set('quantity', e.target.value)} style={{ ...inp, background: '#fff' }}>
                          <option value="">Choisir</option>
                          {['1', '2-3', '4-5', '6-10', '10+'].map(q => <option key={q}>{q}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 7 && (
                    <div style={card}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Récapitulatif</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem' }}>
                          <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.75rem' }}>Informations générales</div>
                          {[['Nom', form.name || '—'], ['Type', form.type || '—'], ['Catégories', form.categories.join(', ') || '—'], ['Audience', form.audience || '—']].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                              <span style={{ fontWeight: 600, color: '#4a5568' }}>{k}:</span><span style={{ color: '#718096' }}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem' }}>
                          <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.75rem' }}>Budget</div>
                          {[['Commission', `${form.commission}%`], ['Objectif', `${form.salesTarget}€`], ['Bonus', form.bonus || '—']].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                              <span style={{ fontWeight: 600, color: '#4a5568' }}>{k}:</span><span style={{ color: '#718096' }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <button onClick={() => step > 1 && setStep(s => s - 1)} style={{ padding: '0.7rem 1.5rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', color: '#718096', fontWeight: 500 }}>← Précédent</button>
                    {step < 7
                      ? <button onClick={() => setStep(s => s + 1)} style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700 }}>Suivant →</button>
                      : <button onClick={handleCreate} disabled={campLoading} style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, opacity: campLoading ? 0.7 : 1 }}>{campLoading ? 'Création...' : '✨ Créer la campagne'}</button>
                    }
                  </div>
                </div>
              )}

              {campMainTab === 'create' && success && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                  <div style={{ ...card, maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✅</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginBottom: '1.5rem' }}>🚀 Campagne créée !</h2>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => { setSuccess(false); setStep(1) }} style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>Créer une autre</button>
                      <button onClick={() => setCampMainTab('recruit')} style={{ padding: '0.8rem 1.5rem', background: '#fff', color: '#718096', border: '1.5px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>Voir le recrutement</button>
                    </div>
                  </div>
                </div>
              )}

              {/* RECRUTEMENT */}
              {campMainTab === 'recruit' && (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#fff', padding: '0.4rem', borderRadius: '12px', width: 'fit-content', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                    {[{ id: 'candidatures', label: 'Candidatures', count: 7 }, { id: 'juridique', label: 'Juridique', count: 2 }, { id: 'paiements', label: 'Paiements', count: 2 }, { id: 'invitations', label: 'Invitations' }].map(tab => (
                      <button key={tab.id} onClick={() => setRecruitTab(tab.id)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: recruitTab === tab.id ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'transparent', color: recruitTab === tab.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: recruitTab === tab.id ? 600 : 400, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {tab.label}
                        {tab.count && <span style={{ background: '#f59e0b', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{tab.count}</span>}
                      </button>
                    ))}
                  </div>
                  {recruitTab === 'candidatures' && (
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                      {candidates.map((c, i) => (
                        <div key={c.id} style={{ padding: '1rem 1.5rem', borderBottom: i < candidates.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#1a202c' }}>@{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{c.followers} abonnés · {c.platform} · {c.date}</div>
                          </div>
                          <span style={{ background: c.status === 'Accepté' ? '#dcfce7' : '#fef9c3', color: c.status === 'Accepté' ? '#16a34a' : '#854d0e', fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>{c.status}</span>
                          {c.status === 'En attente' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button style={{ padding: '0.4rem 0.9rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Accepter</button>
                              <button style={{ padding: '0.4rem 0.9rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✕ Refuser</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {recruitTab === 'invitations' && (
                    <div style={card}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1rem' }}>🔗 Liens d'invitation</div>
                      {campList.map((camp, i) => (
                        <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{camp}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.9rem' }}>
                            <span style={{ flex: 1, fontSize: '0.78rem', color: '#718096' }}>https://partnexx.com/campagne/join/...</span>
                            <button style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem', color: '#718096' }}>📋 Copier</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUIVI */}
              {campMainTab === 'suivi' && (
                <div>
                  <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} style={{ ...inp, marginBottom: '1.5rem', border: '2px solid rgba(168,85,247,0.4)', borderRadius: '12px' }}>
                    <option value="">Sélectionner une campagne...</option>
                    {campList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {selectedCampaign && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                      {[['Influenceurs actifs', '12', '#a855f7'], ['Portée totale', '2.4M', '#22c55e'], ['Engagement', '6.8%', '#3b82f6'], ['ROI estimé', '287%', '#f59e0b']].map(([label, val, color]) => (
                        <div key={label} style={{ ...card, textAlign: 'center' }}>
                          <div style={{ fontSize: '1.7rem', fontWeight: 800, color, marginBottom: '0.4rem' }}>{val}</div>
                          <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* UGC */}
              {campMainTab === 'ugc' && (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#fff', padding: '0.4rem', borderRadius: '12px', width: 'fit-content' }}>
                    {[{ id: 'feed', label: '⊞ Feed UGC' }, { id: 'analyse', label: '⓪ Analyse IA' }].map(tab => (
                      <button key={tab.id} onClick={() => setUgcTab(tab.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: ugcTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: ugcTab === tab.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: ugcTab === tab.id ? 600 : 400, fontFamily: 'inherit' }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {ugcTab === 'feed' && (
                    <div style={{ columns: '3', columnGap: '1rem' }}>
                      {ugcCreators.map((creator, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', marginBottom: '1rem', breakInside: 'avoid' }}>
                          <div style={{ height: i % 3 === 0 ? '200px' : i % 3 === 1 ? '260px' : '180px', background: creator.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{creator.img}</div>
                          <div style={{ padding: '0.85rem' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c', marginBottom: '0.4rem' }}>@{creator.name}</div>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                              {creator.tags.map(tag => <span key={tag} style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{tag}</span>)}
                            </div>
                            <button style={{ width: '100%', padding: '0.35rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Inviter</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {ugcTab === 'analyse' && (
                    <div style={card}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>💡 Analyse IA</h3>
                      <div style={{ marginBottom: '1rem' }}><label style={lbl}>Audience cible</label><input value={form.iaAudience} onChange={e => set('iaAudience', e.target.value)} placeholder="Ex: Femmes 25-35 ans..." style={inp} /></div>
                      <div style={{ marginBottom: '1rem' }}><label style={lbl}>Type de contenu</label><select value={form.iaContentType} onChange={e => set('iaContentType', e.target.value)} style={{ ...inp, background: '#fff' }}><option value="">Choisir</option><option>Vidéo lifestyle</option><option>Photo produit</option><option>Tutoriel</option></select></div>
                      <button onClick={() => { setIaLoading(true); setTimeout(() => { setIaLoading(false); setIaAnalyzed(true) }, 2000) }} disabled={iaLoading} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: iaLoading ? 0.7 : 1 }}>
                        {iaLoading ? '⏳ Analyse en cours...' : '✨ Lancer l\'Analyse IA'}
                      </button>
                      {iaAnalyzed && (
                        <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
                          <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '0.75rem' }}>✨ Résultats</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            {[['Créateurs matchés', '47', '#a855f7'], ['ROI estimé', '340%', '#22c55e'], ['Engagement moyen', '6.8%', '#3b82f6']].map(([label, val, color]) => (
                              <div key={label} style={{ textAlign: 'center', padding: '0.75rem', background: '#fff', borderRadius: '10px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{val}</div>
                                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>{c.campaigns?.title || 'Campagne'} — {c.influencers?.display_name || 'Influenceur'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#a0aec0' }}>Démarrée le {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a202c' }}>{fmt(c.agreed_rate)}</span>
                        {badge(s.label, s.color)}
                      </div>
                    </div>
                    {c.status === 'in_progress' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✅ Valider le livrable</button>
                        <button style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>💬 Demander une révision</button>
                        <button onClick={() => openDispute(c)} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>⚠️ Ouvrir un litige</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* FINANCE */}
          {activeTab === 'finance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total dépensé', value: fmt(metrics?.totalDepense), color: '#ef4444', icon: '💸' },
                  { label: 'En escrow', value: fmt(metrics?.enEscrow), color: '#3b82f6', icon: '🔒' },
                  { label: 'Transactions', value: transactions.length, color: '#a855f7', icon: '📊' },
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
                          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
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
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1.25rem' }}>📋 Mes contrats</div>
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
                    {c.pdf_url && <a href={c.pdf_url} target="_blank" rel="noreferrer" style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>📄 Voir le PDF</a>}
                    {c.brand_signed_at === null && <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✍️ Signer</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}