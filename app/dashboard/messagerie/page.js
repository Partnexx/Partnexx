'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useTheme } from '../ThemeContext'

export default function Messagerie() {
  const router = useRouter()
  const { isDark, colors } = useTheme()
  const [profile, setProfile] = useState(null)
  const [activeConv, setActiveConv] = useState('luna')
  const [message, setMessage] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('Toutes les conversations')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
  }, [])

  const [conversations, setConversations] = useState([
    {
      id: 'luna', name: 'Luna Studio', time: '10:12', preview: 'Parfait, on valide le brief.',
      tag: 'Urgent', status: 'active', score: 92, unread: 2, repondEn: '< 1h', phase: 'negotiation',
      messages: [
        { id: 1, from: 'them', text: 'Hello! Vous avez reçu le brief?', time: '10:02' },
        { id: 2, from: 'me', text: 'Oui, reçu. On ajuste les livrables.', time: '10:05' },
        { id: 3, from: 'them', text: 'Parfait, on valide le brief.', time: '10:12' },
      ]
    },
    {
      id: 'max', name: 'Max&Co', time: 'Hier', preview: 'Budget ok pour l\'UGC.',
      tag: 'pending', status: 'pending', score: 78, unread: 0, repondEn: '< 3h', phase: 'briefing',
      messages: [
        { id: 1, from: 'them', text: 'Bonjour, budget ok pour l\'UGC.', time: 'Hier' },
        { id: 2, from: 'me', text: 'Super, on prépare le contrat.', time: 'Hier' },
      ]
    },
    {
      id: 'nova', name: 'Nova Media', time: 'Lun', preview: 'On passe en phase 2.',
      tag: 'completed', status: 'completed', score: 85, unread: 0, repondEn: '< 24h', phase: 'closing',
      messages: [
        { id: 1, from: 'them', text: 'Campagne terminée avec succès !', time: 'Lun' },
        { id: 2, from: 'me', text: 'On passe en phase 2.', time: 'Lun' },
      ]
    },
  ])

  const activeConvData = conversations.find(c => c.id === activeConv)

  const handleSend = () => {
    if (!message.trim()) return
    setConversations(prev => prev.map(c => {
      if (c.id !== activeConv) return c
      return {
        ...c,
        preview: message,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        messages: [...c.messages, { id: Date.now(), from: 'me', text: message, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]
      }
    }))
    setMessage('')
  }

  const metrics = [
    { label: 'Messages non lus', value: '2', icon: '💬', bg: isDark ? '#2a1a00' : '#fff7ed' },
    { label: 'Conversations actives', value: '1', icon: '👥', bg: isDark ? '#0d2e1a' : '#f0fdf4' },
    { label: 'Temps de réponse', value: '< 2h', icon: '🕐', bg: isDark ? '#1a0a2e' : '#faf5ff' },
    { label: 'Score IA Global', value: '85', icon: '🎯', bg: isDark ? '#2a2200' : '#fef9c3' },
  ]

  const statusColors = {
    active: { bg: '#dcfce7', color: '#16a34a' },
    pending: { bg: '#fef3c7', color: '#d97706' },
    completed: { bg: isDark ? '#2d2d4a' : '#f3f4f6', color: isDark ? '#9090b0' : '#6b7280' },
  }

  return (
    <div style={{ padding: '2rem', background: colors.bg, minHeight: '100vh', transition: 'background 0.3s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: colors.text, margin: 0 }}>Messagerie</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: colors.textSecondary, margin: 0, fontSize: '0.875rem' }}>Communication centralisée • Réponses automatiques • Gestion intelligente</p>
      </div>

      {/* METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: m.bg, borderRadius: '14px', border: `1px solid ${colors.border}`, padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.3s' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.3rem' }}>{m.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: colors.text }}>{m.value}</div>
            </div>
            <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
          </div>
        ))}
      </div>

      {/* CHAT LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', height: 'calc(100vh - 260px)', minHeight: '500px' }}>

        {/* BOITE DE RECEPTION */}
        <div style={{ background: colors.cardBg, borderRadius: '16px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.3s' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
              💬 Boîte de réception
              <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '100px' }}>3</span>
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted, fontSize: '0.82rem' }}>🔍</span>
              <input type="text" placeholder="Rechercher..." style={{ width: '100%', paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: `1px solid ${colors.border}`, borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', color: colors.text, background: colors.inputBg, boxSizing: 'border-box', transition: 'background 0.3s' }} />
            </div>
          </div>

          {/* Filter */}
          <div style={{ padding: '0.5rem 1rem', borderBottom: `1px solid ${colors.border}`, position: 'relative' }}>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: colors.inputBg, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', color: colors.textSecondary }}>
              {filter} <span style={{ fontSize: '0.65rem', color: colors.textMuted }}>▼</span>
            </button>
            {filterOpen && (
              <div style={{ position: 'absolute', top: '110%', left: '1rem', right: '1rem', background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 10, overflow: 'hidden' }}>
                {['Toutes les conversations', 'Actives', 'En attente', 'Terminées'].map(f => (
                  <button key={f} onClick={() => { setFilter(f); setFilterOpen(false) }} style={{ width: '100%', padding: '0.6rem 1rem', background: filter === f ? 'rgba(168,85,247,0.1)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', color: filter === f ? '#a855f7' : colors.textSecondary, fontWeight: filter === f ? 600 : 400, textAlign: 'left', borderBottom: `1px solid ${colors.border}` }}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(conv => (
              <div key={conv.id} onClick={() => setActiveConv(conv.id)} style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer', background: activeConv === conv.id ? 'rgba(168,85,247,0.08)' : 'transparent', borderLeft: activeConv === conv.id ? '3px solid #a855f7' : '3px solid transparent', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: colors.text }}>{conv.name}</span>
                    {conv.tag === 'Urgent' && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Urgent</span>}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: colors.textMuted }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: colors.textSecondary, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.preview}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {conv.unread > 0 && <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.62rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{conv.unread}</span>}
                    <span style={{ background: statusColors[conv.status].bg, color: statusColors[conv.status].color, fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>{conv.status}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 600 }}>↗ {conv.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        {activeConvData && (
          <div style={{ background: colors.cardBg, borderRadius: '16px', border: `1px solid ${colors.border}`, boxShadow: colors.shadow, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.3s' }}>
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span>🌐</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>{activeConvData.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: colors.textSecondary }}>
                  <span>🕐 Répond en {activeConvData.repondEn}</span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span>{activeConvData.phase}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${colors.border}`, background: colors.inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📹</button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600 }}>👤+ Ajouter en partenaire</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeConvData.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '60%', background: msg.from === 'me' ? 'linear-gradient(135deg,#a855f7,#ec4899)' : colors.inputBg, color: msg.from === 'me' ? '#fff' : colors.text, padding: '0.75rem 1rem', borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', boxShadow: colors.shadow, border: msg.from !== 'me' ? `1px solid ${colors.border}` : 'none' }}>
                    <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{msg.text}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>{msg.time}</span>
                      {msg.from === 'me' && <span style={{ fontSize: '0.7rem' }}>✅</span>}
                      {msg.from !== 'me' && <span style={{ fontSize: '0.7rem' }}>😊</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1px solid ${colors.border}`, background: colors.inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>📎</button>
              <input type="text" placeholder="Écrire un message..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, padding: '0.65rem 1rem', border: `1px solid ${colors.border}`, borderRadius: '100px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: colors.text, background: colors.inputBg, transition: 'background 0.3s' }} />
              <button onClick={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                Envoyer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}