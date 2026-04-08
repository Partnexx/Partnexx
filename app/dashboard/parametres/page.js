'use client'
import { useState } from 'react'
import { useTheme } from '../ThemeContext'

export default function Parametres() {
  const [tab, setTab] = useState('securite')
  const [saved, setSaved] = useState(null)

  // Sécurité
  const [fa2, setFa2] = useState(true)
  const [notifConnexion, setNotifConnexion] = useState(true)
  const [suiviAppareils, setSuiviAppareils] = useState(true)

  // Confidentialité
  const [suivi, setSuivi] = useState(true)
  const [cookies, setCookies] = useState(true)
  const [suppressionToggle, setSuppressionToggle] = useState(false)
  const [politiqueToggle, setPolitiqueToggle] = useState(false)

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(true)
  const [notifSms, setNotifSms] = useState(true)
  const [notifBureau, setNotifBureau] = useState(false)
  const [notifCampagnes, setNotifCampagnes] = useState(true)
  const [notifContrats, setNotifContrats] = useState(true)
  const [notifPaiements, setNotifPaiements] = useState(true)
  const [notifSecurite, setNotifSecurite] = useState(true)
  const [freqNotif, setFreqNotif] = useState('Quotidien')

  // Apparence
  const { theme, setTheme, isDark, colors } = useTheme()

  // Paiements
  const [auth3d, setAuth3d] = useState(false)
  const [notifPaiement, setNotifPaiement] = useState(true)
  const [plafond, setPlafond] = useState('50000')
  const [renouvAuto, setRenouvAuto] = useState(true)
  const [cartes, setCartes] = useState([
    { id: 1, type: 'Visa', last4: '4242', expire: '12/2025', principale: true, verifie: true, secure3d: true },
    { id: 2, type: 'Mastercard', last4: '8888', expire: '06/2026', principale: false, verifie: true, secure3d: false },
  ])
  const [showCardModal, setShowCardModal] = useState(false)

  // Intégrations
  const [integrations, setIntegrations] = useState({
    shopify: true, woocommerce: false, magento: false, prestashop: false,
    tiktok: false, instagram: false, linkedin: false, metaads: false,
  })

  // Abonnement
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }
  const inp = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: '#1a202c', boxSizing: 'border-box', background: '#fff' }

  const handleSave = (key) => {
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: '44px', height: '24px', borderRadius: '100px', background: value ? '#a855f7' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '2px', left: value ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  )

  const SaveBtn = ({ onClick, k, label = 'Sauvegarder' }) => (
    <button onClick={onClick} style={{ width: '100%', padding: '0.75rem', background: saved === k ? '#22c55e' : 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
      {saved === k ? '✓ Sauvegardé !' : `💾 ${label}`}
    </button>
  )

  const metrics = [
    { label: 'Plan actuel', value: 'Pro', sub: '📅 Renouvelle le 24/09/2024' },
    { label: 'Intégrations', value: '5/8', sub: '⚡ Services connectés' },
    { label: 'Sécurité', value: 'Sécurisé', sub: '🔒 3 sessions actives' },
    { label: 'IA Utilisée', value: '1247', sub: '⊙ /5000 ce mois' },
  ]

  const tabs = [
    { id: 'securite', icon: '🔒', label: 'Sécurité', activeColor: '#ef4444' },
    { id: 'confidentialite', icon: '🔐', label: 'Confidentialité', activeColor: '#3b82f6' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', activeColor: '#f59e0b' },
    { id: 'apparence', icon: '🎨', label: 'Apparence', activeColor: '#ec4899' },
    { id: 'paiements', icon: '💳', label: 'Moyens de paiements', activeColor: '#a855f7' },
    { id: 'integrations', icon: '⚡', label: 'Intégrations', activeColor: '#22c55e' },
    { id: 'abonnement', icon: '📋', label: 'Abonnement', activeColor: '#f97316' },
    { id: 'aide', icon: '❓', label: 'Aide', activeColor: '#06b6d4' },
  ]

  return (
    <div style={{ ...s, padding: '2rem', background: '#f8f9ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Paramètres</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Configuration intelligente • Préférences automatiques • Optimisation personnalisée</p>
      </div>

      {/* SUB HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Paramètres</div>
          <div style={{ fontSize: '0.78rem', color: '#718096' }}>Gérez votre compte, sécurité et préférences d'utilisation</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { const data = 'Données Partnexx exportées'; const blob = new Blob([data], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'partnexx_data.txt'; a.click() }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568' }}>
            ⬇ Exporter données
          </button>
          <button onClick={() => handleSave('sync')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: saved === 'sync' ? '#dcfce7' : '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: saved === 'sync' ? '#16a34a' : '#4a5568' }}>
            🔄 {saved === 'sync' ? 'Synchronisé !' : 'Synchroniser'}
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.3rem' }}>{m.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.2rem' }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.25rem', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: '1 1 auto', padding: '0.55rem 0.75rem', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: tab === t.id ? 700 : 400,
            background: tab === t.id ? t.activeColor : 'transparent',
            color: tab === t.id ? '#fff' : '#718096',
            borderRadius: '7px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== SÉCURITÉ ===== */}
      {tab === 'securite' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* 2FA */}
            <div style={{ ...card, borderTop: '3px solid #ef4444' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ef4444', marginBottom: '1.25rem' }}>Double authentification</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Authentification à deux facteurs (2FA)</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>Sécurisez votre compte avec un code SMS ou une app d'authentification</div>
                </div>
                <Toggle value={fa2} onChange={setFa2} />
              </div>
              {fa2 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#16a34a', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  ✓ ✦ L'authentification à deux facteurs est activée. Votre compte est sécurisé.
                </div>
              )}
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.75rem' }}>Méthodes d'authentification</div>
              {[['📱', 'Application d\'authentification', 'Google Authenticator, Authy'], ['📞', 'SMS', 'Code envoyé par SMS']].map(([icon, name, desc]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>{name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{desc}</div>
                    </div>
                  </div>
                  <button onClick={() => alert(`Configuration de : ${name}`)} style={{ padding: '0.35rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', color: '#4a5568' }}>Configurer</button>
                </div>
              ))}
              <div style={{ marginTop: '0.75rem' }}>
                <SaveBtn onClick={() => handleSave('2fa')} k="2fa" label="Sauvegarder" />
              </div>
            </div>

            {/* Sessions */}
            <div style={{ ...card, borderTop: '3px solid #3b82f6' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#3b82f6', marginBottom: '1rem' }}>Sessions actives</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Sessions actives</span>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '100px' }}>3</span>
              </div>
              {[
                { icon: '💻', name: 'Session actuelle', detail: 'Chrome • Paris, France • Maintenant', badge: 'Actuelle', badgeColor: '#22c55e', badgeBg: '#dcfce7', canDisconnect: false },
                { icon: '📱', name: 'Mobile', detail: 'Safari • Paris, France • Il y a 2h', badge: null, canDisconnect: true },
              ].map((sess, i) => (
                <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>{sess.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{sess.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{sess.detail}</div>
                    </div>
                  </div>
                  {sess.badge ? <span style={{ background: sess.badgeBg, color: sess.badgeColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{sess.badge}</span>
                    : <button onClick={() => alert('Session déconnectée')} style={{ padding: '0.35rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem' }}>Déconnecter</button>}
                </div>
              ))}
              <div style={{ marginTop: '0.75rem' }}>
                {[['Notifications de connexion', 'Être alerté des nouvelles connexions', notifConnexion, setNotifConnexion], ['Suivi des appareils', 'Surveiller les appareils inconnus', suiviAppareils, setSuiviAppareils]].map(([name, desc, val, setter]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>{name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{desc}</div>
                    </div>
                    <Toggle value={val} onChange={setter} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Récupération de compte */}
          <div style={{ ...card, borderLeft: '4px solid #a855f7' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7', marginBottom: '1.25rem' }}>Récupération de compte</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Email de récupération</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>✉</span>
                  <input style={{ ...inp, paddingLeft: '2.2rem' }} placeholder="backup@exemple.com" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>Téléphone de récupération</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>📞</span>
                  <input style={{ ...inp, paddingLeft: '2.2rem' }} placeholder="+33 6 12 34 56 78" />
                </div>
              </div>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#d97706', marginBottom: '0.25rem' }}>⚠ Codes de récupération</div>
              <div style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.5rem' }}>Générez des codes de sauvegarde uniques pour accéder à votre compte en cas de perte d'accès.</div>
              <button onClick={() => { const codes = Array.from({length: 8}, () => Math.random().toString(36).slice(2,8).toUpperCase()).join('\n'); alert('Vos codes de récupération :\n\n' + codes + '\n\nConservez-les en lieu sûr !') }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', color: '#4a5568' }}>
                ⬇ Générer les codes
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.25rem' }}>Dernière modification du mot de passe</div>
              <div style={{ fontSize: '0.82rem', color: '#718096', marginBottom: '0.5rem' }}>2024-07-15</div>
              <button onClick={() => { const np = prompt('Nouveau mot de passe :'); if (np) alert('Mot de passe modifié avec succès !') }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', color: '#4a5568' }}>
                🔒 Changer le mot de passe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONFIDENTIALITÉ ===== */}
      {tab === 'confidentialite' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🗄 Données et cookies</div>
            {[['Suivi analytique', 'Analyser l\'utilisation pour optimiser l\'expérience', suivi, setSuivi], ['Cookies fonctionnels', 'Nécessaires au bon fonctionnement', cookies, setCookies]].map(([name, desc, val, setter]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>{desc}</div>
                </div>
                <Toggle value={val} onChange={setter} />
              </div>
            ))}
          </div>

          <div style={{ ...card, borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ec4899', marginBottom: '1.25rem' }}>Gestion des données</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>Export de données</div>
                <div style={{ fontSize: '0.72rem', color: '#718096', marginBottom: '0.75rem' }}>Télécharger vos données personnelles</div>
                <button onClick={() => { const data = JSON.stringify({ user: 'Alex Dupont', email: 'alex@example.com', plan: 'Pro', exported: new Date().toISOString() }, null, 2); const blob = new Blob([data], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mes_donnees_partnexx.json'; a.click() }} style={{ width: '100%', padding: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  ⬇ Exporter mes données
                </button>
              </div>
              <div style={{ border: '1px solid #fee2e2', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>Suppression de compte</div>
                <div style={{ fontSize: '0.72rem', color: '#718096', marginBottom: '0.75rem' }}>Option de suppression définitive</div>
                <button onClick={() => { if (confirm('⚠️ Êtes-vous sûr de vouloir demander la suppression de votre compte ? Cette action est irréversible.')) alert('Demande envoyée. Votre compte sera supprimé dans 30 jours.') }} style={{ width: '100%', padding: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  🗑 Demander la suppression
                </button>
              </div>
              <div style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>Politique de confidentialité</div>
                <div style={{ fontSize: '0.72rem', color: '#718096', marginBottom: '0.75rem' }}>Consultez notre politique détaillée</div>
                <button onClick={() => window.open('https://partnexx.com/privacy', '_blank')} style={{ width: '100%', padding: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  ↗ Voir la politique
                </button>
              </div>
            </div>
            <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#92400e' }}>
              ⚠ ⚠ La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées après 30 jours.
            </div>
            <SaveBtn onClick={() => handleSave('confidentialite')} k="confidentialite" label="Sauvegarder les paramètres de confidentialité" />
          </div>
        </div>
      )}

      {/* ===== NOTIFICATIONS ===== */}
      {tab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔔 Canaux de notification</div>
            {[['✉', 'Email', 'Notifications par email', notifEmail, setNotifEmail], ['📱', 'Notifications push', 'Alertes sur vos appareils', notifPush, setNotifPush], ['📞', 'SMS', 'Messages par SMS', notifSms, setNotifSms], ['🖥', 'Bureau', 'Notifications desktop', notifBureau, setNotifBureau]].map(([icon, name, desc, val, setter]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{desc}</div>
                  </div>
                </div>
                <Toggle value={val} onChange={setter} />
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Fréquence des notifications</label>
              <select value={freqNotif} onChange={e => setFreqNotif(e.target.value)} style={inp}>
                {['Instantané', 'Toutes les heures', 'Quotidien', 'Hebdomadaire'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...card, borderTop: '3px solid #f59e0b' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f59e0b', marginBottom: '1.25rem' }}>Types d'alertes</div>
            {[['🎯', 'Campagnes', 'Nouvelles campagnes, validations, rappels', notifCampagnes, setNotifCampagnes], ['📋', 'Contrats', 'Signatures, échéances, amendements', notifContrats, setNotifContrats], ['💰', 'Paiements', 'Virements, factures, escrow', notifPaiements, setNotifPaiements], ['🔒', 'Sécurité', 'Connexions, tentatives suspectes', notifSecurite, setNotifSecurite]].map(([icon, name, desc, val, setter]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{desc}</div>
                  </div>
                </div>
                <Toggle value={val} onChange={setter} />
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <SaveBtn onClick={() => handleSave('notifications')} k="notifications" label="Sauvegarder les préférences" />
            </div>
          </div>
        </div>
      )}

      {/* ===== APPARENCE ===== */}
       /*
{tab === 'apparence' && (
  <div style={{ ...card, background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.text }}>
      🎨 Mode d'affichage
    </div>
    <div style={{ fontSize: '0.78rem', color: colors.textSecondary, marginBottom: '1.25rem' }}>
      Choisissez votre mode d'affichage
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
      {[
        ['clair', 'Clair', '☀', '#fff', '#1a202c'],
        ['sombre', 'Sombre', '🌙', '#1e1e32', '#f0f0ff'],
        ['systeme', 'Système', '🖥', colors.cardBg, colors.text],
      ].map(([id, name, icon, bg, textCol]) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          style={{
            padding: '2rem 1rem',
            border: theme === id ? '2px solid #a855f7' : `1px solid ${colors.border}`,
            borderRadius: '12px',
            background: theme === id ? (isDark ? '#2d1a4a' : '#faf5ff') : bg,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          <span style={{ fontWeight: theme === id ? 700 : 400, color: theme === id ? '#a855f7' : textCol, fontSize: '0.875rem' }}>
            {name}
          </span>
        </button>
      ))}
    </div>
    <button
      onClick={() => handleSave('apparence')}
      style={{
        width: '100%', padding: '0.75rem',
        background: saved === 'apparence' ? '#22c55e' : 'linear-gradient(135deg,#a855f7,#ec4899)',
        color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700,
      }}
    >
      {saved === 'apparence' ? '✓ Appliqué !' : '✦ Appliquer les changements'}
    </button>
  </div>
)}
*/
 

      {/* ===== MOYENS DE PAIEMENTS ===== */}
      {tab === 'paiements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ ...card, borderTop: '3px solid #a855f7' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7', marginBottom: '0.5rem' }}>Cartes bancaires</div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#1d4ed8' }}>
              ⓘ Vos cartes bancaires sont utilisées pour bloquer les fonds et activer les commissions d'affiliation. Elles sont stockées de manière sécurisée et cryptée.
            </div>
            {cartes.map((carte, i) => (
              <div key={carte.id} style={{ border: carte.principale ? '2px solid #a855f7' : '1px solid #f0f0f0', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', background: carte.principale ? '#faf5ff' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>💳</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{carte.type} •••• {carte.last4}</span>
                        {carte.principale && <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '100px' }}>Principale</span>}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Expire {carte.expire}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => alert(`Modifier la carte ${carte.type} •••• ${carte.last4}`)} style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>✏</button>
                    {!carte.principale && <button onClick={() => setCartes(prev => prev.filter(c => c.id !== carte.id))} style={{ width: '28px', height: '28px', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.75rem', color: '#ef4444' }}>🗑</button>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.68rem', color: '#22c55e' }}>
                  {carte.verifie && <span>✓ Vérifiée</span>}
                  {carte.secure3d && <span>🔒 3D Secure activé</span>}
                </div>
              </div>
            ))}
            <button onClick={() => setShowCardModal(true)} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600 }}>
              + Ajouter une carte bancaire
            </button>
          </div>

          <div style={{ ...card, borderTop: '3px solid #22c55e' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#22c55e', marginBottom: '1.25rem' }}>Sécurité des paiements</div>
            {[['Authentification forte (3D Secure)', 'Vérification par SMS ou application bancaire', auth3d, setAuth3d], ['Notifications de paiement', 'Email à chaque transaction', notifPaiement, setNotifPaiement]].map(([name, desc, val, setter]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{desc}</div>
                </div>
                <Toggle value={val} onChange={setter} />
              </div>
            ))}
            <div style={{ padding: '0.75rem 0' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Plafonds mensuels</div>
              <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginBottom: '0.5rem' }}>Limite de dépenses par mois</div>
              <div style={{ position: 'relative' }}>
                <input type="number" value={plafond} onChange={e => setPlafond(e.target.value)} style={{ ...inp, paddingRight: '2rem' }} />
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>€</span>
              </div>
            </div>
            <SaveBtn onClick={() => handleSave('paiements')} k="paiements" label="Sauvegarder les paramètres" />
          </div>
        </div>
      )}

      {/* ===== INTÉGRATIONS ===== */}
      {tab === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚡ Plateformes e-commerce</div>
            {[['🛍', 'Shopify', 'Synchronisation des produits et commandes', 'shopify'], ['🔌', 'WooCommerce', 'Intégration WordPress e-commerce', 'woocommerce'], ['🏪', 'Magento', 'Plateforme e-commerce avancée', 'magento'], ['🛒', 'PrestaShop', 'Solution e-commerce française', 'prestashop']].map(([icon, name, desc, key]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {integrations[key] && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>Connecté</span>}
                  <button onClick={() => { if (integrations[key]) alert(`Configurer ${name}`); else setIntegrations(prev => ({ ...prev, [key]: true })) }} style={{ padding: '0.35rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem' }}>
                    {integrations[key] ? 'Configurer' : 'Connecter'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...card, borderTop: '3px solid #3b82f6' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#3b82f6', marginBottom: '1.25rem' }}>Réseaux sociaux / Publicité</div>
            {[['🎵', 'TikTok', 'Publicités sur TikTok', 'tiktok'], ['📸', 'Instagram', 'Publicités Instagram', 'instagram'], ['💼', 'LinkedIn', 'Publicités LinkedIn', 'linkedin'], ['📘', 'Meta Ads', 'Facebook & Instagram Ads', 'metaads']].map(([icon, name, desc, key]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {integrations[key] && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>Connecté</span>}
                  <button onClick={() => setIntegrations(prev => ({ ...prev, [key]: !prev[key] }))} style={{ padding: '0.35rem 0.75rem', background: integrations[key] ? '#fee2e2' : '#fff', color: integrations[key] ? '#ef4444' : '#4a5568', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem' }}>
                    {integrations[key] ? 'Déconnecter' : 'Connecter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== ABONNEMENT ===== */}
      {tab === 'abonnement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ ...card, borderTop: '3px solid #f97316' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f97316', marginBottom: '1.25rem' }}>Plan actuel</div>
              <div style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>⓪ Pro</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a202c', margin: '0.5rem 0 0.2rem' }}>Pro</div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Plan actif</div>
                <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Renouvellement le 24/09/2024</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.6rem' }}>Fonctionnalités incluses</div>
                {['Templates IA illimités', 'Analytics avancées', 'Intégrations premium', 'Support prioritaire', 'API Access'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.78rem', color: '#4a5568', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => alert('Redirection vers la page d\'upgrade...')} style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600 }}>↗ Upgrade</button>
                <button onClick={() => { const data = 'FACTURE PARTNEXX\nPlan Pro - 49€\nDate: 24/09/2024'; const blob = new Blob([data], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'facture_partnexx.txt'; a.click() }} style={{ flex: 1, padding: '0.65rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568' }}>⬇ Factures</button>
              </div>
            </div>

            <div style={{ ...card, borderTop: '3px solid #a855f7' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7', marginBottom: '1.25rem' }}>📊 Utilisation</div>
              {[['Requêtes IA', 1247, 5000, '#a855f7'], ['Campagnes actives', 12, 50, '#3b82f6'], ['Stockage', 2.1, 10, '#22c55e']].map(([label, val, max, color]) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 500, color: '#4a5568' }}>{label}</span>
                    <span style={{ color: '#718096' }}>{typeof val === 'number' && val < 10 ? `${val}GB/${max}GB` : `${val}/${max}`}</span>
                  </div>
                  <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.65rem', fontSize: '0.72rem', color: '#1d4ed8' }}>
                ⓘ Votre utilisation sera réinitialisée le 24/09/2024
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>💳 Facturation</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.5rem' }}>Méthode de paiement</div>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>💳</span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.82rem' }}>•••• •••• •••• 4242</div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Expire 12/25</div>
                    </div>
                  </div>
                  <button onClick={() => alert('Modifier la méthode de paiement')} style={{ padding: '0.3rem 0.65rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem' }}>✏ Modifier</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.5rem' }}>Prochaine facture</div>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.82rem' }}>Plan Pro</span>
                    <span style={{ fontWeight: 700, color: '#a855f7' }}>€49</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Mensuel • Prélevé le 24/09/2024</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Renouvellement automatique</div>
                <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>Votre abonnement se renouvelle automatiquement</div>
              </div>
              <Toggle value={renouvAuto} onChange={setRenouvAuto} />
            </div>
            <button onClick={() => { const data = 'FACTURES PARTNEXX\n\nSep 2024 - Plan Pro - 49€\nAoût 2024 - Plan Pro - 49€\nJuil 2024 - Plan Pro - 49€'; const blob = new Blob([data], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'factures_partnexx.txt'; a.click() }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568', marginTop: '0.75rem' }}>
              ⬇ Télécharger les factures
            </button>
          </div>

          <div style={{ ...card, borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ec4899', marginBottom: '0.4rem' }}>Code promo</div>
            <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '1rem' }}>Vous avez un code promo ? Entrez-le ci-dessous pour bénéficier d'une réduction sur votre abonnement.</div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="ENTREZ VOTRE CODE PROMO" style={{ ...inp, flex: 1 }} />
              <button onClick={() => { if (promoCode === 'PROMO20' || promoCode === 'WELCOME') { setPromoApplied(true); alert('🎉 Code promo appliqué ! -20% sur votre prochain prélèvement.') } else alert('❌ Code promo invalide.') }} style={{ padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                ✦ Appliquer
              </button>
            </div>
            {promoApplied && <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>✓ Code appliqué avec succès !</div>}
            <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>⚠ Les codes promo sont valides une seule fois et ne peuvent pas être cumulés avec d'autres offres.</div>
          </div>
        </div>
      )}

      {/* ===== AIDE ===== */}
      {tab === 'aide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>❓ Centre d'aide</div>
              {[['🚀', 'Guide de démarrage', 'Premiers pas avec Partnex'], ['📚', 'Documentation API', 'Intégrations et développement'], ['🎥', 'Tutoriels vidéo', 'Formations pas à pas'], ['❓', 'FAQ', 'Questions fréquentes'], ['📋', 'Changelog', 'Nouveautés et mises à jour']].map(([icon, name, desc]) => (
                <button key={name} onClick={() => alert(`Ouverture de : ${name}`)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0.75rem', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '0.5rem', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem' }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c' }}>{name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{desc}</div>
                    </div>
                  </div>
                  <span style={{ color: '#a0aec0', fontSize: '0.7rem' }}>↗</span>
                </button>
              ))}
            </div>

            <div style={{ ...card, borderTop: '3px solid #06b6d4' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#06b6d4', marginBottom: '1.25rem' }}>Support & Contact</div>
              <button onClick={() => alert('Chat IA d\'assistance ouvert — Aide instantanée 24/7')} style={{ width: '100%', padding: '0.85rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>💬 Chat IA d'assistance</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Aide instantanée 24/7</div>
                </div>
              </button>
              {[['✉', 'Support par email', 'Réponse en 24h maximum'], ['📅', 'Rendez-vous support', 'Session personnalisée']].map(([icon, name, desc]) => (
                <button key={name} onClick={() => alert(`Ouverture de : ${name}`)} style={{ width: '100%', padding: '0.75rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c' }}>{name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{desc}</div>
                  </div>
                </button>
              ))}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.75rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ✓ Support prioritaire inclus dans votre plan Pro
              </div>
            </div>
          </div>

          <div style={{ ...card, borderLeft: '4px solid #a855f7' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7', marginBottom: '0.25rem' }}>✦ Propositions d'amélioration</div>
            <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '1.25rem' }}>Votre avis compte ! Aidez-nous à améliorer Partnexx en partageant vos suggestions et retours d'expérience.</div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Type de suggestion</label>
              <select style={inp}>
                {['Nouvelle fonctionnalité', 'Amélioration existante', 'Bug à corriger', 'Question', 'Autre'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Votre suggestion</label>
              <textarea style={{ ...inp, height: '100px', resize: 'vertical' }} placeholder="Décrivez votre idée d'amélioration, votre problème ou votre suggestion..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <input type="checkbox" id="anon" />
              <label htmlFor="anon" style={{ fontSize: '0.78rem', color: '#4a5568', cursor: 'pointer' }}>Suggestion anonyme</label>
            </div>
            <button onClick={() => { handleSave('suggestion'); alert('✦ Merci ! Votre suggestion a été envoyée.') }} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              ↗ Envoyer la suggestion
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              {[['🎯', '156', '#3b82f6', 'Suggestions reçues'], ['✓', '42', '#22c55e', 'Fonctionnalités ajoutées'], ['♡', '89%', '#ec4899', 'Satisfaction utilisateurs']].map(([icon, val, color, label]) => (
                <div key={label} style={{ background: color + '10', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: `1px solid ${color}30` }}>
                  <div style={{ fontSize: '1.2rem', color, marginBottom: '0.25rem' }}>{icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color, marginBottom: '0.15rem' }}>{val}</div>
                  <div style={{ fontSize: '0.68rem', color }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUTER CARTE */}
      {showCardModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCardModal(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>💳 Ajouter une carte</span>
              <button onClick={() => setShowCardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>✕</button>
            </div>
            {[['Numéro de carte', 'text', '**** **** **** ****'], ['Date d\'expiration', 'text', 'MM/AA'], ['CVV', 'password', '***']].map(([label, type, ph]) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input type={type} placeholder={ph} style={inp} />
              </div>
            ))}
            <button onClick={() => { setCartes(prev => [...prev, { id: Date.now(), type: 'Visa', last4: '0000', expire: '12/2027', principale: false, verifie: false, secure3d: false }]); setShowCardModal(false); alert('Carte ajoutée avec succès !') }} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700 }}>
              Ajouter la carte
            </button>
          </div>
        </div>
      )}
    </div>
  )
}