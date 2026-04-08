'use client'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../ThemeContext'

export default function CreatorMessagerie() {
  const { isDark, colors } = useTheme()
  const [filterTab, setFilterTab] = useState('toutes')
  const [activeConv, setActiveConv] = useState('gb')
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)

  const [conversations, setConversations] = useState([
    {
      id: 'gb', initials: 'GB', color: '#a855f7', name: 'GreenBeauty', star: true,
      category: 'Cosmétiques & Beauté', online: true, time: '14:30',
      preview: 'Perfect ! On finalise les détails de la campagne demain ?', unread: 2,
      messages: [
        { id: 1, from: 'me', text: "Bonjour ! J'ai vu votre brief pour la campagne été. Je suis très intéressé par une collaboration.", time: '10:15' },
        { id: 2, from: 'them', text: 'Bonjour ! Merci pour votre intérêt. Votre profil correspond parfaitement à notre cible. Qu\'en pensez-vous ?', time: '10:20' },
        { id: 3, from: 'me', text: "C'est très intéressant ! Je peux vous proposer plusieurs formats : stories, reels, posts statiques. Quel format préférez-vous ?", time: '10:25' },
        { id: 4, from: 'them', text: "Excellent ! Nous aimerions un mix de formats. Pouvez-vous nous envoyer quelques idées de contenus ?", time: '10:30' },
        { id: 5, from: 'me', text: "Voici 3 concepts différents adaptés à votre marque : unboxing naturel, routine matinale, avant/après 30 jours", time: '11:45' },
        { id: 6, from: 'them', text: "J'adore le concept avant/après ! On peut en discuter plus en détail ? Notre budget est de 2500€ pour cette campagne.", time: '14:20' },
        { id: 7, from: 'them', text: "Perfect ! On finalise les détails de la campagne demain ?", time: '14:30' },
      ]
    },
    {
      id: 'tf', initials: 'TF', color: '#3b82f6', name: 'TechFlow', star: false,
      category: 'Technologie & Gadgets', online: false, time: 'Hier',
      preview: '✓ Merci pour les photos ! Elles sont parfaites 🔥', unread: 0,
      messages: [
        { id: 1, from: 'me', text: "Bonjour TechFlow ! La campagne pour vos écouteurs sans fil est terminée. Je vous envoie les contenus.", time: 'Hier 09:00' },
        { id: 2, from: 'them', text: "Super ! Pouvez-vous nous envoyer les visuels haute résolution ?", time: 'Hier 09:15' },
        { id: 3, from: 'me', text: "Bien sûr, je vous envoie tout ça par WeTransfer dans 5 minutes.", time: 'Hier 09:20' },
        { id: 4, from: 'me', text: "Merci pour les photos ! Elles sont parfaites 🔥", time: 'Hier 10:00' },
      ]
    },
    {
      id: 'sv', initials: 'SV', color: '#22c55e', name: 'SummerVibes', star: false,
      category: 'Mode & Lifestyle', online: true, time: 'Lun',
      preview: "J'ai envoyé le brief détaillé par email", unread: 1,
      messages: [
        { id: 1, from: 'them', text: "Bonjour ! Nous lançons une nouvelle collection été et nous cherchons des créateurs lifestyle.", time: 'Lun 10:00' },
        { id: 2, from: 'me', text: "Bonjour ! Votre collection a l'air super. Quels sont vos critères ?", time: 'Lun 10:30' },
        { id: 3, from: 'them', text: "J'ai envoyé le brief détaillé par email", time: 'Lun 11:00' },
      ]
    },
    {
      id: 'fp', initials: 'FP', color: '#f59e0b', name: 'FitnessPro', star: true,
      category: 'Sport & Nutrition', online: false, time: 'Mar',
      preview: 'Budget approuvé ! Quand pouvez-vous commencer ?', unread: 3,
      messages: [
        { id: 1, from: 'them', text: "Bonjour ! Nous avons approuvé votre proposition. Budget de 1800€ validé.", time: 'Mar 09:00' },
        { id: 2, from: 'them', text: "Quand pouvez-vous commencer ?", time: 'Mar 09:05' },
        { id: 3, from: 'them', text: "Budget approuvé ! Quand pouvez-vous commencer ?", time: 'Mar 09:10' },
      ]
    },
  ])

  const activeConvData = conversations.find(c => c.id === activeConv)

  const handleSend = () => {
    if (!message.trim()) return
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    setConversations(prev => prev.map(c => {
      if (c.id !== activeConv) return c
      return { ...c, preview: message, time: now, messages: [...c.messages, { id: Date.now(), from: 'me', text: message, time: now }] }
    }))
    setMessage('')
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const filteredConvs = conversations.filter(c => {
    if (filterTab === 'nonlues') return c.unread > 0
    if (filterTab === 'importantes') return c.star
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: colors.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.3s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ padding: '1.5rem 2rem 0', background: colors.bg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: colors.text, margin: 0 }}>Messagerie</h1>
            <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA activé</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: colors.textSecondary }}>
              <span>💬</span> 4 conversations
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: colors.textSecondary }}>
              <span>🔔</span> 6 non lus
            </div>
          </div>
        </div>
        <p style={{ color: colors.textSecondary, margin: '0 0 1rem', fontSize: '0.82rem' }}>Chat Direct • Notifications Push • Historique Organisé</p>

        {/* FILTER TABS */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'toutes', label: 'Toutes' },
            { id: 'nonlues', label: '🔔 Non lues' },
            { id: 'importantes', label: '⭐ Importantes' },
          ].map(t => (
            <button key={t.id} onClick={() => setFilterTab(t.id)} style={{
              padding: '0.5rem 1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: filterTab === t.id ? 700 : 400,
              background: filterTab === t.id ? 'linear-gradient(135deg,#a855f7,#6366f1)' : colors.cardBg,
              color: filterTab === t.id ? '#fff' : colors.textSecondary,
              border: filterTab === t.id ? 'none' : '1px solid ' + colors.border,
              transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: '1rem', flex: 1, padding: '1rem 2rem 1.5rem', overflow: 'hidden' }}>

        {/* LISTE CONVERSATIONS */}
        <div style={{ background: colors.cardBg, borderRadius: '16px', border: '1px solid ' + colors.border, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: colors.shadow }}>
          {/* Search + New */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid ' + colors.border, display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted, fontSize: '0.82rem' }}>🔍</span>
              <input type="text" placeholder="Rechercher..." style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', border: '1px solid ' + colors.border, borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', color: colors.text, background: colors.inputBg, boxSizing: 'border-box' }} />
            </div>
            <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#a855f7,#6366f1)', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
          </div>

          {/* Conversations list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConvs.map(conv => (
              <div key={conv.id} onClick={() => setActiveConv(conv.id)} style={{
                padding: '0.85rem 1rem', borderBottom: '1px solid ' + colors.border, cursor: 'pointer',
                background: activeConv === conv.id ? (isDark ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.06)') : 'transparent',
                borderLeft: activeConv === conv.id ? '3px solid #a855f7' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: conv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{conv.initials}</div>
                      {conv.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid ' + colors.cardBg }} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: colors.text }}>{conv.name}</span>
                        {conv.star && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>⭐</span>}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>{conv.category}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.68rem', color: colors.textMuted }}>{conv.time}</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: '0.9rem' }}>⋮</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{conv.preview}</div>
                  {conv.unread > 0 && (
                    <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.62rem', fontWeight: 700, minWidth: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.5rem', flexShrink: 0 }}>{conv.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        {activeConvData && (
          <div style={{ background: colors.cardBg, borderRadius: '16px', border: '1px solid ' + colors.border, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: colors.shadow }}>
            {/* Chat header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid ' + colors.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: activeConvData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>{activeConvData.initials}</div>
                  {activeConvData.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid ' + colors.cardBg }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.text }}>{activeConvData.name}</div>
                  <div style={{ fontSize: '0.72rem', color: colors.textSecondary }}>
                    {activeConvData.category} • <span style={{ color: activeConvData.online ? '#22c55e' : colors.textMuted }}>{activeConvData.online ? 'En ligne' : 'Hors ligne'}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['📞', '📹', '⋮'].map((icon, i) => (
                  <button key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.inputBg, border: '1px solid ' + colors.border, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: colors.textSecondary }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeConvData.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                  {msg.from === 'them' && (
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: activeConvData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0, marginRight: '0.5rem', alignSelf: 'flex-end' }}>
                      {activeConvData.initials}
                    </div>
                  )}
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.from === 'me' ? 'linear-gradient(135deg,#a855f7,#6366f1)' : (isDark ? '#2d2d4a' : '#f3f4f6'),
                      color: msg.from === 'me' ? '#fff' : colors.text,
                      fontSize: '0.875rem', lineHeight: 1.5,
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: colors.textMuted, marginTop: '0.2rem', textAlign: msg.from === 'me' ? 'right' : 'left', display: 'flex', alignItems: 'center', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', gap: '0.25rem' }}>
                      {msg.time} {msg.from === 'me' && <span style={{ color: '#a855f7' }}>✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid ' + colors.border, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.inputBg, border: '1px solid ' + colors.border, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: colors.textSecondary, flexShrink: 0 }}>📎</button>
              <input
                type="text"
                placeholder="Tapez votre message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, padding: '0.65rem 1rem', border: '1px solid ' + colors.border, borderRadius: '100px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: colors.text, background: colors.inputBg, transition: 'background 0.3s' }}
              />
              <button onClick={handleSend} style={{ width: '40px', height: '40px', borderRadius: '50%', background: message.trim() ? 'linear-gradient(135deg,#a855f7,#6366f1)' : colors.inputBg, border: 'none', cursor: message.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: message.trim() ? '#fff' : colors.textMuted, flexShrink: 0, transition: 'all 0.2s' }}>
                ✈
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}