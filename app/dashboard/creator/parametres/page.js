'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

function fakeDownload(name, content = '') {
  const blob = new Blob([content || `Document Partnexx: ${name}`], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}

function Toggle({ value, onChange, color = '#7c3aed' }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 99, background: value ? color : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

export default function ParametresPage() {
  const { isDark, theme, setTheme, colors } = useTheme()
  const [tab, setTab] = useState('securite')
  const [pendingTheme, setPendingTheme] = useState(theme)

  // ── Sécurité ──
  const [twoFA, setTwoFA] = useState(true)
  const [emailRecup] = useState('sophie.martin@email.com')
  const [telSecours] = useState('+33 6 12 34 56 78')
  const sessions = [
    { device: 'MacBook Pro', location: 'Paris, France', time: 'Maintenant', current: true },
    { device: 'iPhone 13',   location: 'Paris, France', time: 'il y a 2h',  current: false },
    { device: 'iPad Pro',    location: 'Lyon, France',  time: 'il y a 1 jour', current: false },
  ]

  // ── Confidentialité ──
  const [cookieEssentiels, setCookieEssentiels] = useState(true)
  const [cookieAnalytiques, setCookieAnalytiques] = useState(false)
  const [cookieMarketing, setCookieMarketing] = useState(false)

  // ── Notifications ──
  const [notifPush,  setNotifPush]  = useState(true)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSMS,   setNotifSMS]   = useState(false)
  const [nepasderanger, setNepasderanger] = useState(false)
  const [frequence, setFrequence] = useState('Quotidien')
  const notifTypes = [
    { key: 'oppo',   label: 'Nouvelle opportunité',  default: true },
    { key: 'msg',    label: 'Message reçu',           default: true },
    { key: 'collab', label: 'Collaboration acceptée', default: true },
    { key: 'paiement', label: 'Paiement reçu',        default: true },
    { key: 'score',  label: 'Mise à jour score',      default: false },
    { key: 'rappel', label: 'Rappels contrats',       default: true },
  ]
  const [notifStates, setNotifStates] = useState(
    Object.fromEntries(notifTypes.map(n => [n.key, n.default]))
  )
  const [notifFreqs, setNotifFreqs] = useState(
    Object.fromEntries(notifTypes.map(n => [n.key, 'Immédiat']))
  )

  // ── Paiement ──
  const [newCard, setNewCard] = useState(false)
  const [cardNum, setCardNum] = useState('')

  // ── Abonnement ──
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.07)'

  const TABS = [
    { key: 'securite',       label: 'Sécurité',       icon: '🛡️', color: '#ef4444' },
    { key: 'confidentialite',label: 'Confidentialité', icon: '🔒', color: '#7c3aed' },
    { key: 'notifications',  label: 'Notifications',   icon: '🔔', color: '#3b82f6' },
    { key: 'apparence',      label: 'Apparence',       icon: '🎨', color: '#f59e0b' },
    { key: 'paiement',       label: 'Paiement',        icon: '💳', color: '#22c55e' },
    { key: 'abonnement',     label: 'Abonnement',      icon: '👑', color: '#f59e0b' },
    { key: 'support',        label: 'Support',         icon: '💬', color: '#06b6d4' },
  ]

  const card = (children, extra = {}) => (
    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '24px', boxShadow: colors.shadow, ...extra }}>
      {children}
    </div>
  )

  const sectionTitle = (icon, title, badge) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: colors.text }}>{title}</span>
      </div>
      {badge && <span style={{ fontSize: 11, background: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: 20, fontWeight: 800 }}>{badge.label}</span>}
    </div>
  )

  const rowItem = (label, sub, right) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa', border: `1px solid ${colors.border}`, marginBottom: 10 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  )

  // ── SÉCURITÉ ───────────────────────────────────────────────────────────────
  const renderSecurite = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionTitle('🛡️', 'Centre de Sécurité', { label: '🔒 Compte Sécurisé', bg: '#fee2e2', color: '#dc2626' })}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {card(<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>🛡️ Double authentification (2FA)</div>
            <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Recommandé</span>
          </div>
          {rowItem('2FA activée', 'Protection renforcée',
            <Toggle value={twoFA} onChange={setTwoFA} color={purple} />
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
            <button onClick={() => alert('Configurer l\'application d\'authentification...')} style={{ padding: '10px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>📱 App</button>
            <button onClick={() => alert('Configurer les SMS d\'authentification...')} style={{ padding: '10px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>💬 SMS</button>
          </div>
        </>)}

        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>📧 Récupération de compte</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 6 }}>Email de récupération</div>
            <div style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, fontSize: 13, color: colors.text }}>{emailRecup}</div>
            <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>✓ Email vérifié</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 6 }}>Téléphone de secours</div>
            <div style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, fontSize: 13, color: colors.text }}>{telSecours}</div>
          </div>
          <button onClick={() => alert('Modification des infos de récupération...')} style={{ marginTop: 12, width: '100%', padding: '9px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: purple, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>✏️ Modifier</button>
        </>)}
      </div>

      {card(<>
        <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>💻 Sessions actives</div>
        {sessions.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, marginBottom: 10, background: s.current ? (isDark ? 'rgba(124,58,237,0.08)' : '#faf5ff') : (isDark ? 'rgba(255,255,255,0.02)' : '#fafafa') }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>💻</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{s.device}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>{s.location} · {s.time}</div>
              </div>
            </div>
            {s.current
              ? <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Session actuelle</span>
              : <button onClick={() => alert(`Déconnexion de ${s.device}...`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#ef4444' }}>→</button>
            }
          </div>
        ))}
        <button onClick={() => alert('Toutes les autres sessions ont été déconnectées.')} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 6 }}>
          🔌 Déconnecter toutes les autres sessions
        </button>
      </>)}
    </div>
  )

  // ── CONFIDENTIALITÉ ────────────────────────────────────────────────────────
  const renderConfidentialite = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionTitle('🔒', 'Confidentialité & Données', { label: '🛡️ Protégé', bg: purpleLight, color: purple })}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>🍪 Préférences Cookies</div>
          {[
            { label: 'Cookies essentiels', sub: 'Nécessaires au fonctionnement', value: cookieEssentiels, onChange: setCookieEssentiels, locked: true },
            { label: 'Cookies analytiques', sub: "Amélioration de l'expérience", value: cookieAnalytiques, onChange: setCookieAnalytiques },
            { label: 'Cookies marketing', sub: 'Publicité personnalisée', value: cookieMarketing, onChange: setCookieMarketing },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{c.label}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>{c.sub}</div>
              </div>
              <Toggle value={c.value} onChange={c.locked ? () => {} : c.onChange} color={purple} />
            </div>
          ))}
        </>)}

        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>📦 Gestion des données</div>
          {[
            { icon: '⬇️', label: 'Télécharger mes données', action: () => fakeDownload('mes_donnees_partnexx.json', JSON.stringify({ user: 'Sophie Martin', email: 'sophie.martin@email.com', exported: new Date().toISOString() }, null, 2)) },
            { icon: '📤', label: 'Exporter mon historique', action: () => fakeDownload('historique_partnexx.csv', 'date,action,details\n2024-01-15,Collaboration,GreenBeauty\n2024-02-20,Paiement,500€') },
            { icon: '⚙️', label: 'Gérer mes préférences', action: () => alert('Gestion des préférences de données...') },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 10, textAlign: 'left' }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </>)}
      </div>

      <div style={{ background: isDark ? 'rgba(239,68,68,0.08)' : '#fff5f5', border: '1px solid #fecaca', borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#dc2626' }}>Suppression du compte</span>
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 14 }}>Cette action est irréversible. Toutes vos données seront définitivement supprimées.</div>
        <button onClick={() => { if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) alert('Demande de suppression envoyée. Vous recevrez un email de confirmation.') }}
          style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🗑️ Supprimer définitivement mon compte
        </button>
      </div>
    </div>
  )

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  const renderNotifications = () => {
    const activeCount = Object.values(notifStates).filter(Boolean).length + (notifPush ? 1 : 0) + (notifEmail ? 1 : 0) + (notifSMS ? 1 : 0)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sectionTitle('🔔', 'Centre de Notifications', { label: `${activeCount} actives`, bg: '#dbeafe', color: '#2563eb' })}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {card(<>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>📡 Canaux de notification</div>
            {[
              { label: 'Notifications push', sub: 'Sur votre appareil', value: notifPush, onChange: setNotifPush },
              { label: 'Notifications email', sub: 'Par email', value: notifEmail, onChange: setNotifEmail },
              { label: 'Notifications SMS', sub: 'Par SMS', value: notifSMS, onChange: setNotifSMS },
            ].map(n => (
              <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{n.label}</div>
                  <div style={{ fontSize: 11, color: colors.textSecondary }}>{n.sub}</div>
                </div>
                <Toggle value={n.value} onChange={n.onChange} color={purple} />
              </div>
            ))}
          </>)}

          {card(<>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>⚙️ Préférences</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Ne pas déranger</div>
              <Toggle value={nepasderanger} onChange={setNepasderanger} color={purple} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, fontWeight: 600 }}>Fréquence des résumés</div>
              <select value={frequence} onChange={e => setFrequence(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                {['Immédiat', 'Quotidien', 'Hebdomadaire', 'Mensuel'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </>)}
        </div>

        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>🔔 Types de notifications</div>
          {notifTypes.map(n => (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{n.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <select value={notifFreqs[n.key]} onChange={e => setNotifFreqs(p => ({ ...p, [n.key]: e.target.value }))}
                  style={{ padding: '5px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 11, outline: 'none', cursor: 'pointer' }}>
                  {['Immédiat', 'Quotidien', 'Hebdomadaire'].map(f => <option key={f}>{f}</option>)}
                </select>
                <Toggle value={notifStates[n.key]} onChange={v => setNotifStates(p => ({ ...p, [n.key]: v }))} color={purple} />
              </div>
            </div>
          ))}
        </>)}
      </div>
    )
  }

  // ── APPARENCE — branchée sur useTheme ──────────────────────────────────────
  const renderApparence = () => {
    const hasChanged = pendingTheme !== theme

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sectionTitle('🎨', 'Personnalisation')}
        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 16 }}>🌗 Thème & Apparence</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { key: 'clair',   icon: '☀️', label: 'Clair',   sub: 'Interface lumineuse' },
              { key: 'sombre',  icon: '🌙', label: 'Sombre',  sub: 'Confort nocturne' },
              { key: 'systeme', icon: '💻', label: 'Auto',    sub: 'Adaptatif' },
            ].map(t => {
              const isSelected = pendingTheme === t.key
              const isActive = theme === t.key
              return (
                <button key={t.key} onClick={() => setPendingTheme(t.key)} style={{
                  padding: '20px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                  border: `2px solid ${isSelected ? purple : colors.border}`,
                  background: isSelected ? purpleLight : (isDark ? 'rgba(255,255,255,0.02)' : '#fafafa'),
                  transition: 'all .2s',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? purple : colors.text }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{t.sub}</div>
                  {isActive && <div style={{ marginTop: 8, fontSize: 10, color: '#22c55e', fontWeight: 700 }}>✓ Actuel</div>}
                  {isSelected && !isActive && <div style={{ marginTop: 8, fontSize: 10, color: purple, fontWeight: 700 }}>● Sélectionné</div>}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => { setTheme(pendingTheme); alert(`Thème "${pendingTheme}" appliqué !`) }}
            disabled={!hasChanged}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: hasChanged ? 'pointer' : 'not-allowed',
              background: hasChanged ? `linear-gradient(135deg,${purple},#a855f7)` : (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'),
              color: hasChanged ? '#fff' : colors.textSecondary,
              fontWeight: 800, fontSize: 14,
              transition: 'all .2s',
              boxShadow: hasChanged ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
            }}
          >
            {hasChanged ? '✓ Appliquer les changements' : 'Sélectionnez un thème pour appliquer'}
          </button>
        </>)}
      </div>
    )
  }

  // ── PAIEMENT ───────────────────────────────────────────────────────────────
  const renderPaiement = () => (
    <div>
      {sectionTitle('💳', 'Paiement & Facturation', { label: '🔒 Sécurisé', bg: '#dcfce7', color: '#15803d' })}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>💳 Moyens de paiement</div>
          <div style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${purple}`, background: purpleLight, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>💳</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>•••• 4242</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>Expire 12/2025</div>
              </div>
            </div>
            <span style={{ fontSize: 11, background: purple, color: '#fff', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>Principal</span>
          </div>
          {newCard ? (
            <div style={{ padding: '14px', borderRadius: 12, border: `1px solid ${colors.border}` }}>
              <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="1234 5678 9012 3456"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input placeholder="MM/AA" style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }} />
                <input placeholder="CVV" style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button onClick={() => { alert('Carte ajoutée avec succès !'); setNewCard(false); setCardNum('') }} style={{ padding: '10px', borderRadius: 10, border: 'none', background: purple, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>✓ Ajouter</button>
                <button onClick={() => setNewCard(false)} style={{ padding: '10px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setNewCard(true)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1px dashed ${colors.border}`, background: 'transparent', color: colors.textSecondary, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              + Ajouter une carte
            </button>
          )}
        </>)}

        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>📄 Dernières factures</div>
          {['Nov 2024', 'Oct 2024', 'Sep 2024'].map(month => (
            <div key={month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{month}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>29,99 €</div>
              </div>
              <button onClick={() => fakeDownload(`facture_partnexx_${month.replace(' ', '_')}.txt`, `FACTURE PARTNEXX\nPériode: ${month}\nMontant: 29,99€\nPlan: Pro`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: purple }}>⬇️</button>
            </div>
          ))}
          <button onClick={() => fakeDownload('toutes_les_factures.csv', 'mois,montant,plan\nNov 2024,29.99,Pro\nOct 2024,29.99,Pro\nSep 2024,29.99,Pro')}
            style={{ width: '100%', marginTop: 12, padding: '10px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: purple, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            ⬇️ Télécharger toutes les factures
          </button>
        </>)}
      </div>
    </div>
  )

  // ── ABONNEMENT ─────────────────────────────────────────────────────────────
  const renderAbonnement = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionTitle('👑', 'Mon Abonnement')}
      {card(<>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: colors.text }}>Plan Pro</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Accès complet à toutes les fonctionnalités</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: purple }}>29,99 €</div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>par mois</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {['Opportunités illimitées', 'Messagerie avancée', 'Statistiques détaillées', 'Support prioritaire', 'Badge vérifié'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.text }}>
              <span style={{ color: '#22c55e' }}>✓</span>{f}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button onClick={() => alert('Découvrez nos plans Enterprise et Legend !')}
            style={{ padding: '14px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            👑 Upgrade
          </button>
          <button onClick={() => { if (confirm('Êtes-vous sûr de vouloir annuler votre abonnement Pro ?')) alert('Abonnement annulé. Actif jusqu\'à la fin de la période.') }}
            style={{ padding: '14px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            Annuler l'abonnement
          </button>
        </div>
      </>)}

      {card(<>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🎁</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>Code Promo</span>
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 14 }}>Vous avez un code promo ? Entrez-le ci-dessous pour bénéficier de réductions sur votre abonnement.</div>
        {promoApplied ? (
          <div style={{ padding: '14px', borderRadius: 12, background: '#dcfce7', border: '1px solid #bbf7d0', textAlign: 'center', fontWeight: 700, color: '#15803d', fontSize: 13 }}>
            ✅ Code "{promoCode}" appliqué ! -20% sur votre prochain mois.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="ENTREZ VOTRE CODE PROMO"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={() => { if (promoCode.trim()) setPromoApplied(true); else alert('Entrez un code promo valide.') }}
              style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
              Appliquer
            </button>
          </div>
        )}
      </>)}
    </div>
  )

  // ── SUPPORT ────────────────────────────────────────────────────────────────
  const renderSupport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sectionTitle('💬', 'Aide & Support', { label: '24/7', bg: '#dbeafe', color: '#2563eb' })}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>❓ Centre d'aide</div>
          {[
            { icon: '📖', label: 'Documentation complète', action: () => alert('Ouverture de la documentation...') },
            { icon: '💬', label: 'Questions fréquentes', action: () => alert('Ouverture de la FAQ...') },
            { icon: '📹', label: 'Tutoriels vidéo', action: () => alert('Ouverture des tutoriels vidéo...') },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa', color: colors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 10, textAlign: 'left', transition: 'border-color .2s' }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </>)}

        {card(<>
          <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>📞 Contacter le support</div>
          <button onClick={() => alert('Ouverture du chat en direct avec le support...')}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            💬 Chat en direct
          </button>
          <button onClick={() => alert('Envoi d\'un email au support...')}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            📧 Envoyer un email
          </button>
          <div style={{ textAlign: 'center', fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Temps de réponse moyen: 2h</div>
        </>)}
      </div>

      {card(<>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>Votre avis compte</span>
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 14 }}>Aidez-nous à améliorer Partnexx en partageant votre expérience</div>
        <button onClick={() => alert('Merci de partager votre avis sur Partnexx !')}
          style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: purple, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          💬 Donner mon avis
        </button>
      </>)}
    </div>
  )

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: colors.text }}>Paramètres</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(124,58,237,0.2)' : '#ede9fe', padding: '4px 12px', borderRadius: 20 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: purple }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: purple }}>IA actif</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 24 }}>
        Configuration · Notifications · Sécurité & Confidentialité
      </div>

      {/* TABS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0, borderRadius: 14, overflow: 'hidden', border: `1px solid ${colors.border}`, marginBottom: 28 }}>
        {TABS.map((t, i) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '14px 8px', border: 'none',
            background: tab === t.key ? t.color : 'transparent',
            color: tab === t.key ? '#fff' : colors.textSecondary,
            fontWeight: 700, fontSize: 11, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            transition: 'all .2s',
            borderRight: i < 6 ? `1px solid ${colors.border}` : 'none',
          }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'securite'        && renderSecurite()}
      {tab === 'confidentialite' && renderConfidentialite()}
      {tab === 'notifications'   && renderNotifications()}
      {tab === 'apparence'       && renderApparence()}
      {tab === 'paiement'        && renderPaiement()}
      {tab === 'abonnement'      && renderAbonnement()}
      {tab === 'support'         && renderSupport()}
    </div>
  )
}