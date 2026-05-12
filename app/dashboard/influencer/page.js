'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useTheme } from '../ThemeContext'
import { useInfluencerData } from '@/lib/hook/useInfluencerData'

export default function DashboardInfluencer() {
  const router = useRouter()
  const { isDark, colors } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [time, setTime] = useState(new Date())
  const [showNotifs, setShowNotifs] = useState(false)

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
    { id: 'overview',       label: '🔄 Vue d\'ensemble' },
    { id: 'collaborations', label: '🤝 Collaborations' },
    { id: 'gains',          label: '💰 Gains' },
    { id: 'contracts',      label: '📋 Contrats' },
  ]

  const cardStyle = {
    background: colors.cardBg,
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: colors.shadow,
    border: `1px solid ${colors.cardBorder}`,
  }

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
    body: JSON.stringify({
      collaborationId: collab.id,
      openedBy: user.id,
      openedByRole: 'influencer',
      reason,
      description,
    }),
  })

  const data = await res.json()
  if (data.success) {
    alert('✅ Litige ouvert avec succès')
  } else {
    alert('❌ Erreur : ' + data.error)
  }
}

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
      <div style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ padding: '1.5rem', background: colors.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#667eea,#a855f7,#ec4899)', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>{greeting} {firstName} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
              {metrics?.collaborationsActives > 0
                ? `🚀 ${metrics.collaborationsActives} collaboration${metrics.collaborationsActives > 1 ? 's' : ''} active${metrics.collaborationsActives > 1 ? 's' : ''} · ${fmt(metrics.totalGains)} reçus`
                : '🚀 Bienvenue sur Partnexx — vos collaborations apparaîtront ici'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: `💰 ${fmt(metrics?.totalGains)} reçus`,     bg: 'rgba(34,197,94,0.2)',   border: 'rgba(34,197,94,0.4)' },
                { label: `🔒 ${fmt(metrics?.enEscrow)} en escrow`,  bg: 'rgba(59,130,246,0.2)',  border: 'rgba(59,130,246,0.4)' },
                { label: `📋 ${metrics?.contratsSignes ?? 0} contrat${(metrics?.contratsSignes ?? 0) > 1 ? 's' : ''} signé${(metrics?.contratsSignes ?? 0) > 1 ? 's' : ''}`, bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.3)' },
              ].map((tag, i) => (
                <span key={i} style={{ background: tag.bg, color: '#fff', fontSize: '0.78rem', padding: '0.35rem 0.85rem', borderRadius: '100px', fontWeight: 600, border: `1px solid ${tag.border}` }}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right', color: '#fff', flexShrink: 0, marginLeft: '1rem' }}>
            <div style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '0.2rem' }}>{dateStr}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{timeStr.slice(0, 5)}</div>
            <div style={{ fontSize: '0.72rem', marginTop: '0.3rem' }}>
              <span style={{ background: 'rgba(34,197,94,0.3)', color: '#86efac', padding: '0.15rem 0.5rem', borderRadius: '100px' }}>● En ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', background: colors.cardBg, borderRadius: '12px', padding: '0.35rem', marginBottom: '1.5rem', boxShadow: colors.shadow, width: 'fit-content', border: `1px solid ${colors.cardBorder}` }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: activeTab === tab.id ? '#fff' : colors.textSecondary, fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* VUE D'ENSEMBLE */}
      {activeTab === 'overview' && (
        <div>
          {/* Métriques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Gains reçus',           value: fmt(metrics?.totalGains),             sub: 'Transactions released',      icon: '💰', color: '#22c55e' },
              { label: 'En escrow',              value: fmt(metrics?.enEscrow),               sub: 'En attente de libération',   icon: '🔒', color: '#3b82f6' },
              { label: 'Collaborations actives', value: metrics?.collaborationsActives || 0,  sub: `Sur ${metrics?.collaborationsTotal || 0} au total`, icon: '🤝', color: '#a855f7' },
              { label: 'Contrats signés',        value: metrics?.contratsSignes || 0,         sub: `Sur ${contracts.length} au total`, icon: '📋', color: '#f59e0b' },
            ].map((m, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: colors.textSecondary, fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>{m.sub}</div>
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{m.icon}</div>
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: colors.text }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Dernières collaborations + transactions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>🤝 Collaborations récentes</div>
                <button onClick={() => setActiveTab('collaborations')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
              </div>
              {collaborations.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '2rem 0' }}>Aucune collaboration pour l'instant</div>
              ) : collaborations.slice(0, 4).map((c, i) => {
                const s = statusLabel(c.status)
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < 3 ? `1px solid ${colors.cardBorder}` : 'none' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text }}>{c.campaigns?.title || 'Campagne'}</div>
                      <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: colors.text }}>{fmt(c.agreed_rate)}</span>
                      {badge(s.label, s.color)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>💰 Dernières transactions</div>
                <button onClick={() => setActiveTab('gains')} style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
              </div>
              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '2rem 0' }}>Aucune transaction pour l'instant</div>
              ) : transactions.slice(0, 5).map((t, i) => {
                const s = txStatusLabel(t.status)
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < 4 ? `1px solid ${colors.cardBorder}` : 'none' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text }}>{t.description || 'Paiement'}</div>
                      <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: t.status === 'released' ? '#22c55e' : colors.text }}>{fmt(t.influencer_amount)}</span>
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
          <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1.25rem' }}>🤝 Toutes mes collaborations</div>
          {collaborations.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '3rem 0' }}>Aucune collaboration pour l'instant</div>
          ) : collaborations.map((c, i) => {
            const s = statusLabel(c.status)
            return (
              <div key={i} style={{ border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem', background: colors.inputBg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: colors.text, marginBottom: '0.25rem' }}>{c.campaigns?.title || 'Campagne'}</div>
                    <div style={{ fontSize: '0.78rem', color: colors.textMuted }}>Démarrée le {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: colors.text }}>{fmt(c.agreed_rate)}</span>
                    {badge(s.label, s.color)}
                  </div>
                </div>
{c.deadline && (
                  <div style={{ fontSize: '0.78rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                    📅 Deadline : {new Date(c.deadline).toLocaleDateString('fr-FR')}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {c.status === 'in_progress' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        📤 Livrer le contenu
                      </button>
                      <button
                        onClick={() => openDispute(c)}
                        style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        ⚠️ Ouvrir un litige
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* GAINS */}
      {activeTab === 'gains' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Résumé */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {[
              { label: 'Total reçu',    value: fmt(metrics?.totalGains), color: '#22c55e', icon: '✅' },
              { label: 'En escrow',     value: fmt(metrics?.enEscrow),   color: '#3b82f6', icon: '🔒' },
              { label: 'Nb transactions', value: transactions.length,   color: '#a855f7', icon: '📊' },
            ].map((m, i) => (
              <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color, marginBottom: '0.25rem' }}>{m.value}</div>
                <div style={{ fontSize: '0.78rem', color: colors.textSecondary }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Liste transactions */}
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1.25rem' }}>💰 Historique des paiements</div>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '3rem 0' }}>Aucune transaction pour l'instant</div>
            ) : transactions.map((t, i) => {
              const s = txStatusLabel(t.status)
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i < transactions.length - 1 ? `1px solid ${colors.cardBorder}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      {t.status === 'released' ? '✅' : t.status === 'in_escrow' ? '🔒' : t.status === 'refunded' ? '↩️' : '⏳'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: colors.text }}>{t.description || 'Paiement campagne'}</div>
                      <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>{new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: t.status === 'released' ? '#22c55e' : colors.text, marginBottom: '0.25rem' }}>
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
          <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text, marginBottom: '1.25rem' }}>📋 Mes contrats</div>
          {contracts.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.85rem', padding: '3rem 0' }}>Aucun contrat pour l'instant</div>
          ) : contracts.map((c, i) => (
            <div key={i} style={{ border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem', background: colors.inputBg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: colors.text, marginBottom: '0.25rem' }}>Contrat #{c.id.slice(0, 8)}</div>
                  <div style={{ fontSize: '0.78rem', color: colors.textMuted }}>Créé le {new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: colors.text }}>{fmt(c.amount)}</span>
                  {badge(
                    c.status === 'signed' ? '✅ Signé' : c.status === 'pending' ? 'En attente' : c.status,
                    c.status === 'signed' ? '#22c55e' : '#f59e0b'
                  )}
                </div>
              </div>
              {c.deadline && (
                <div style={{ fontSize: '0.78rem', color: colors.textSecondary, marginBottom: '0.75rem' }}>
                  📅 Deadline : {new Date(c.deadline).toLocaleDateString('fr-FR')}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {c.pdf_url && (
                  <a href={c.pdf_url} target="_blank" rel="noreferrer" style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                    📄 Voir le PDF
                  </a>
                )}
                {c.status !== 'signed' && c.influencer_signed_at === null && (
                  <button style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ✍️ Signer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}