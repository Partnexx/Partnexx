'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useTheme } from '../ThemeContext'
import { useInfluencerData } from '@/lib/hook/useInfluencerData'
import { useNotifications } from '@/lib/hook/useNotifications'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function DashboardInfluencer() {
  const router = useRouter()
  const { isDark, colors } = useTheme()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [time, setTime] = useState(new Date())
  const [showNotifs, setShowNotifs] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

  const { collaborations, transactions, contracts, metrics, loading } = useInfluencerData(user?.id)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id)

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'toi'
  const hour = time.getHours()
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir'
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0)

  const statusLabel = (s) => ({
    in_progress: { label: 'En cours',   color: '#a855f7' },
    accepted:    { label: 'Acceptée',   color: '#22c55e' },
    pending:     { label: 'En attente', color: '#f59e0b' },
    completed:   { label: 'Terminée',   color: '#6b7280' },
    cancelled:   { label: 'Annulée',    color: '#ef4444' },
  }[s] || { label: s, color: '#6b7280' })

  const txStatusLabel = (s) => ({
    pending:    { label: 'En attente', color: '#f59e0b' },
    in_escrow:  { label: 'En escrow',  color: '#3b82f6' },
    released:   { label: 'Reçu',       color: '#22c55e' },
    refunded:   { label: 'Remboursé',  color: '#ef4444' },
    failed:     { label: 'Échoué',     color: '#ef4444' },
  }[s] || { label: s, color: '#6b7280' })

  const tabs = [
    { id: 'overview',       label: isMobile ? '🔄' : '🔄 Vue d\'ensemble' },
    { id: 'collaborations', label: isMobile ? '🤝' : '🤝 Collaborations' },
    { id: 'gains',          label: isMobile ? '💰' : '💰 Gains' },
    { id: 'contracts',      label: isMobile ? '📋' : '📋 Contrats' },
  ]

  const cardStyle = {
    background: colors.cardBg,
    borderRadius: '16px',
    padding: isMobile ? '1rem' : '1.5rem',
    boxShadow: colors.shadow,
    border: `1px solid ${colors.cardBorder}`,
  }

  const badge = (label, color) => (
    <span style={{ background: `${color}18`, color, fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
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
      body: JSON.stringify({
        collaborationId: collab.id,
        openedBy: user.id,
        openedByRole: 'influencer',
        reason,
        description,
      }),
    })
    const data = await res.json()
    if (data.success) alert('✅ Litige ouvert avec succès')
    else alert('❌ Erreur : ' + data.error)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
      <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* TOPBAR MOBILE */}
      {isMobile && (
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: colors.cardBg, borderBottom: `1px solid ${colors.cardBorder}`, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: colors.text }}>Partnexx</div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Notif bell */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', position: 'relative' }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
              {firstName.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Panneau notifications */}
      {showNotifs && (
        <>
          <div onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          <div style={{ position: 'fixed', right: isMobile ? 8 : 20, top: isMobile ? '60px' : '80px', width: isMobile ? 'calc(100vw - 16px)' : '340px', background: colors.cardBg, borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)', border: `1px solid ${colors.cardBorder}`, zIndex: 999, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: `1px solid ${colors.cardBorder}` }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>Notifications</div>
              {unreadCount > 0 && (
                <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{unreadCount} nouvelles</span>
              )}
            </div>
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: colors.textSecondary, fontSize: '0.85rem' }}>Aucune notification</div>
              ) : notifications.map(n => (
                <div key={n.id} onClick={() => markAsRead(n.id)} style={{ display: 'flex', gap: '0.75rem', padding: '0.9rem 1.25rem', borderBottom: `1px solid ${colors.cardBorder}`, cursor: 'pointer', background: !n.is_read ? (isDark ? 'rgba(168,85,247,0.06)' : 'rgba(168,85,247,0.04)') : 'transparent' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                    {n.type === 'payment' ? '💰' : n.type === 'dispute' ? '⚠️' : n.type === 'welcome' ? '🎉' : '🔔'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: colors.text }}>{n.title}</div>
                      {!n.is_read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.15rem' }}>{n.body}</div>
                    <div style={{ fontSize: '0.68rem', color: colors.textSecondary, marginTop: '0.25rem' }}>{new Date(n.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '0.75rem 1.25rem', borderTop: `1px solid ${colors.cardBorder}` }}>
              <button onClick={markAllAsRead} style={{ width: '100%', padding: '0.65rem', background: 'transparent', border: `1px solid ${colors.cardBorder}`, borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: colors.textSecondary, fontFamily: 'inherit' }}>
                Tout marquer comme lu
              </button>
            </div>
          </div>
        </>
      )}

      <div style={{ padding: isMobile ? '1rem' : '1.5rem' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', borderRadius: '20px', padding: isMobile ? '1.25rem' : '1.75rem 2rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{greeting} {firstName} 👋</h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '0.78rem' : '0.875rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                  {metrics?.collaborationsActives > 0
                    ? `🚀 ${metrics.collaborationsActives} collab · ${fmt(metrics.totalGains)} reçus`
                    : '🚀 Vos collaborations apparaîtront ici'}
                </p>
              </div>
              {!isMobile && (
                <div style={{ textAlign: 'right', color: '#fff', flexShrink: 0, marginLeft: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '0.2rem' }}>{dateStr}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{timeStr.slice(0, 5)}</div>
                  <div style={{ fontSize: '0.72rem', marginTop: '0.3rem', marginBottom: '0.5rem' }}>
                    <span style={{ background: 'rgba(34,197,94,0.3)', color: '#86efac', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>● En ligne</span>
                  </div>
                  {/* Notif desktop */}
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button onClick={() => setShowNotifs(!showNotifs)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#fff', position: 'relative' }}>
                      🔔
                      {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: '#ef4444', borderRadius: '50%', fontSize: '0.65rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { label: `💰 ${fmt(metrics?.totalGains)}`, bg: 'rgba(34,197,94,0.2)', border: 'rgba(34,197,94,0.4)' },
                { label: `🔒 ${fmt(metrics?.enEscrow)}`, bg: 'rgba(59,130,246,0.2)', border: 'rgba(59,130,246,0.4)' },
                { label: `📋 ${metrics?.contratsSignes ?? 0} contrat${(metrics?.contratsSignes ?? 0) > 1 ? 's' : ''}`, bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.3)' },
              ].map((tag, i) => (
                <span key={i} style={{ background: tag.bg, color: '#fff', fontSize: isMobile ? '0.72rem' : '0.78rem', padding: '0.3rem 0.75rem', borderRadius: '100px', fontWeight: 600, border: `1px solid ${tag.border}` }}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0', background: colors.cardBg, borderRadius: '12px', padding: '0.3rem', marginBottom: '1rem', boxShadow: colors.shadow, border: `1px solid ${colors.cardBorder}`, width: isMobile ? '100%' : 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: isMobile ? 1 : 'none', padding: isMobile ? '0.6rem 0.5rem' : '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: activeTab === tab.id ? '#fff' : colors.textSecondary, fontSize: isMobile ? '1rem' : '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap', textAlign: 'center' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* VUE D'ENSEMBLE */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { label: 'Gains reçus',    value: fmt(metrics?.totalGains),            sub: 'Released', icon: '💰', color: '#22c55e' },
                { label: 'En escrow',      value: fmt(metrics?.enEscrow),              sub: 'Bloqués',  icon: '🔒', color: '#3b82f6' },
                { label: 'Collabs',        value: metrics?.collaborationsActives || 0, sub: `/ ${metrics?.collaborationsTotal || 0}`, icon: '🤝', color: '#a855f7' },
                { label: 'Contrats',       value: metrics?.contratsSignes || 0,        sub: `/ ${contracts.length}`, icon: '📋', color: '#f59e0b' },
              ].map((m, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: colors.textSecondary, fontWeight: 500 }}>{m.label}</div>
                      <div style={{ fontSize: '0.65rem', color: colors.textMuted }}>{m.sub}</div>
                    </div>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{m.icon}</div>
                  </div>
                  <div style={{ fontSize: isMobile ? '1.2rem' : '1.7rem', fontWeight: 800, color: colors.text }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>🤝 Collaborations</div>
                  <button onClick={() => setActiveTab('collaborations')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
                </div>
                {collaborations.length === 0 ? (
                  <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '1.5rem 0' }}>Aucune collaboration</div>
                ) : collaborations.slice(0, 3).map((c, i) => {
                  const s = statusLabel(c.status)
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < 2 ? `1px solid ${colors.cardBorder}` : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: '0.5rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.campaigns?.title || 'Campagne'}</div>
                        <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: colors.text }}>{fmt(c.agreed_rate)}</span>
                        {badge(s.label, s.color)}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>💰 Transactions</div>
                  <button onClick={() => setActiveTab('gains')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
                </div>
                {transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '1.5rem 0' }}>Aucune transaction</div>
                ) : transactions.slice(0, 4).map((t, i) => {
                  const s = txStatusLabel(t.status)
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < 3 ? `1px solid ${colors.cardBorder}` : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: '0.5rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: colors.text }}>{t.description || 'Paiement'}</div>
                        <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: t.status === 'released' ? '#22c55e' : colors.text }}>{fmt(t.influencer_amount)}</span>
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
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1rem' }}>🤝 Toutes mes collaborations</div>
            {collaborations.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '3rem 0' }}>Aucune collaboration pour l'instant</div>
            ) : collaborations.map((c, i) => {
              const s = statusLabel(c.status)
              return (
                <div key={i} style={{ border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', background: colors.inputBg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '0.5rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: colors.text, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.campaigns?.title || 'Campagne'}</div>
                      <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>Démarrée le {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: colors.text }}>{fmt(c.agreed_rate)}</span>
                      {badge(s.label, s.color)}
                    </div>
                  </div>
                  {c.deadline && (
                    <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                      📅 {new Date(c.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {c.status === 'in_progress' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button style={{ flex: 1, padding: '0.5rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        📤 Livrer
                      </button>
                      <button onClick={() => openDispute(c)} style={{ flex: 1, padding: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        ⚠️ Litige
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* GAINS */}
        {activeTab === 'gains' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Total reçu',      value: fmt(metrics?.totalGains), color: '#22c55e', icon: '✅' },
                { label: 'En escrow',       value: fmt(metrics?.enEscrow),   color: '#3b82f6', icon: '🔒' },
                { label: 'Transactions',    value: transactions.length,       color: '#a855f7', icon: '📊' },
              ].map((m, i) => (
                <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{m.icon}</div>
                  <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 800, color: m.color, marginBottom: '0.2rem' }}>{m.value}</div>
                  <div style={{ fontSize: '0.72rem', color: colors.textSecondary }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text, marginBottom: '1rem' }}>💰 Historique</div>
              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '2rem 0' }}>Aucune transaction</div>
              ) : transactions.map((t, i) => {
                const s = txStatusLabel(t.status)
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: i < transactions.length - 1 ? `1px solid ${colors.cardBorder}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                        {t.status === 'released' ? '✅' : t.status === 'in_escrow' ? '🔒' : t.status === 'refunded' ? '↩️' : '⏳'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: colors.text }}>{t.description || 'Paiement'}</div>
                        <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: t.status === 'released' ? '#22c55e' : colors.text, marginBottom: '0.2rem' }}>
                        {fmt(t.influencer_amount)}
                      </div>
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
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text, marginBottom: '1rem' }}>📋 Mes contrats</div>
            {contracts.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '3rem 0' }}>Aucun contrat pour l'instant</div>
            ) : contracts.map((c, i) => (
              <div key={i} style={{ border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', background: colors.inputBg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: colors.text, marginBottom: '0.2rem' }}>Contrat #{c.id.slice(0, 8)}</div>
                    <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: colors.text }}>{fmt(c.amount)}</span>
                    {badge(c.status === 'signed' ? '✅ Signé' : 'En attente', c.status === 'signed' ? '#22c55e' : '#f59e0b')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {c.pdf_url && (
                    <a href={c.pdf_url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '0.5rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                      📄 Voir PDF
                    </a>
                  )}
                  {c.status !== 'signed' && c.influencer_signed_at === null && (
                    <button style={{ flex: 1, padding: '0.5rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      ✍️ Signer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM NAV MOBILE */}
        {isMobile && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: colors.cardBg, borderTop: `1px solid ${colors.cardBorder}`, padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
            {[
              { id: 'overview', icon: '🏠', label: 'Accueil' },
              { id: 'collaborations', icon: '🤝', label: 'Collabs' },
              { id: 'gains', icon: '💰', label: 'Gains' },
              { id: 'contracts', icon: '📋', label: 'Contrats' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.75rem', borderRadius: '10px', background: activeTab === item.id ? 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.1))' : 'transparent' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 600, color: activeTab === item.id ? '#a855f7' : colors.textSecondary }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Padding bottom pour la bottom nav mobile */}
      {isMobile && <div style={{ height: '70px' }} />}
    </div>
  )
}