'use client'
import { useState, useRef } from 'react'

export default function CompteEntreprise() {
  const [tab, setTab] = useState('general')
  const [logo, setLogo] = useState(null)
  const [sameAddress, setSameAddress] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [savedGeneral, setSavedGeneral] = useState(false)
  const [savedEntreprise, setSavedEntreprise] = useState(false)
  const [savedContact, setSavedContact] = useState(false)
  const [savedFacturation, setSavedFacturation] = useState(false)
  const logoInputRef = useRef(null)

  const [membres, setMembres] = useState([
    { initials: 'MD', color: '#a855f7', name: 'Marie Dubois', email: 'marie@techcorp.com', status: 'Actif', role: 'Manager' },
    { initials: 'PM', color: '#3b82f6', name: 'Pierre Martin', email: 'pierre@techcorp.com', status: 'Actif', role: 'Viewer' },
    { initials: 'SC', color: '#f59e0b', name: 'Sarah Cohen', email: 'sarah@techcorp.com', status: 'En attente', role: 'Viewer' },
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Viewer')

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }
  const input = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: '#1a202c', boxSizing: 'border-box', background: '#fff' }
  const label = { fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }

  const secteurs = ['Mode, Beauté & Cosmétique','Technologie & Électronique','Sport & Fitness','Alimentation & Boissons','Voyage & Tourisme','Maison & Décoration','Automobile & Mobilité','Santé & Bien-être','Finance & Assurance','Éducation & Formation','Divertissement & Médias','Gaming & E-sport','Immobilier','Luxe & Joaillerie','Environnement & Écologie','Commerce & Distribution','Services B2B et B2C','Autres']
  const tailles = ['1 à 10 employés','11 à 50 employés','51 à 200 employés','201 à 500 employés','500 employés et plus']
  const formes = ['SARL','SAS','SA','EURL','SASU','Auto-entrepreneur']
  const delais = ['15 jours','30 jours']
  const devises = ['EUR (€)','USD ($)','GBP (£)']
  const roles = ['Administrateur','Manager','Viewer']

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setLogo(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (setter) => {
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const initials = inviteEmail.slice(0, 2).toUpperCase()
    setMembres(prev => [...prev, { initials, color: '#22c55e', name: inviteEmail.split('@')[0], email: inviteEmail, status: 'En attente', role: inviteRole }])
    setInviteEmail('')
    setShowInviteModal(false)
  }

  const updateRole = (index, role) => {
    setMembres(prev => prev.map((m, i) => i === index ? { ...m, role } : m))
  }

  const deleteMembre = (index) => {
    setMembres(prev => prev.filter((_, i) => i !== index))
  }

  const SaveBtn = ({ onClick, saved, label = 'Enregistrer les modifications' }) => (
    <button onClick={onClick} style={{ width: '100%', padding: '0.75rem', background: saved ? '#22c55e' : 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
      {saved ? '✓ Enregistré !' : `✦ ${label}`}
    </button>
  )

  const membresActifs = membres.filter(m => m.status === 'Actif').length
  const membresEnAttente = membres.filter(m => m.status === 'En attente').length
  const admins = membres.filter(m => m.role === 'Administrateur').length

  return (
    <div style={{ ...s, padding: '2rem', background: '#f8f9ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Compte entreprise</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Gestion du profil • Optimisation automatique • Recommandations personnalisées</p>
      </div>

      {/* PROFIL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem', color: '#1a202c' }}>
            👤 Profil Entreprise
          </div>
          <div style={{ fontSize: '0.78rem', color: '#718096' }}>Gestion complète de votre profil et paramètres d'entreprise</div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568', fontWeight: 500 }}>
          👤 Plan Enterprise
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.75rem', border: '1px solid #e2e8f0' }}>
        {[
          { id: 'general', icon: '🌐', label: 'Général', activeColor: '#3b82f6' },
          { id: 'entreprise', icon: '🏢', label: 'Entreprise', activeColor: '#22c55e' },
          { id: 'equipe', icon: '👥', label: 'Équipe', activeColor: '#a855f7' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '0.65rem 1rem', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: tab === t.id ? 700 : 400,
            background: tab === t.id ? t.activeColor : 'transparent',
            color: tab === t.id ? '#fff' : '#718096',
            borderRadius: '8px', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== GÉNÉRAL ===== */}
      {tab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Identité */}
          <div style={{ ...card, borderTop: '3px solid #a855f7' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#a855f7', marginBottom: '1.5rem' }}>Identité de l'entreprise</div>

            {/* Logo */}
            <div style={{ marginBottom: '1.25rem' }}>
              <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml,image/jpeg" style={{ display: 'none' }} onChange={handleLogoChange} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '10px', border: '2px dashed #e2e8f0', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {logo ? <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.5rem' }}>🏢</span>}
                </div>
                <div>
                  <button onClick={() => logoInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568', fontWeight: 500, marginBottom: '0.25rem' }}>
                    ⬆ Changer le logo
                  </button>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>PNG, SVG recommandés. Max 5MB.</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Nom de l'entreprise</label>
              <input style={input} defaultValue="TechCorp Solutions" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Description de l'entreprise</label>
              <textarea style={{ ...input, height: '90px', resize: 'vertical' }} defaultValue="Je connecte des marques ambitieuses avec des créateurs pertinents pour maximiser leur impact digital." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={label}>Secteur d'activité</label>
                <select style={input}>
                  <option value="">Sélectionner...</option>
                  {secteurs.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Taille de l'entreprise</label>
                <select style={input}>
                  <option value="">Sélectionner...</option>
                  {tailles.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label}>Site web</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: '0.875rem' }}>🌐</span>
                <input style={{ ...input, paddingLeft: '2.2rem' }} defaultValue="https://techcorp.com" />
              </div>
            </div>

            <SaveBtn onClick={() => handleSave(setSavedGeneral)} saved={savedGeneral} />
          </div>

          {/* Contact principal */}
          <div style={{ ...card, borderTop: '3px solid #ec4899' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ec4899', marginBottom: '1.5rem' }}>Contact principal</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: '#fdf2f8', borderRadius: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>AD</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Alex Dupont</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>Responsable partenariats</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Nom du contact principal</label>
              <input style={input} defaultValue="Alex Dupont" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Fonction</label>
              <input style={input} defaultValue="Responsable partenariats" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Email professionnel</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>✉</span>
                <input style={{ ...input, paddingLeft: '2.2rem' }} defaultValue="alex.dupont@example.com" />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label}>Téléphone</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>📞</span>
                <input style={{ ...input, paddingLeft: '2.2rem' }} defaultValue="+33 6 12 34 56 78" />
              </div>
            </div>

            <button onClick={() => handleSave(setSavedContact)} style={{ width: '100%', padding: '0.75rem', background: savedContact ? '#22c55e' : '#fff', color: savedContact ? '#fff' : '#4a5568', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
              {savedContact ? '✓ Mis à jour !' : 'Mettre à jour le contact'}
            </button>
          </div>
        </div>
      )}

      {/* ===== ENTREPRISE ===== */}
      {tab === 'entreprise' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Informations légales */}
          <div style={{ ...card, borderTop: '3px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: '#1a202c', marginBottom: '1.5rem' }}>
              🏢 Informations légales
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={label}>Numéro SIRET</label>
                <input style={input} defaultValue="12345678901234" maxLength={14} />
              </div>
              <div>
                <label style={label}>Numéro de TVA</label>
                <input style={input} defaultValue="FR12345678901" />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Adresse du siège social</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#a0aec0' }}>📍</span>
                <textarea style={{ ...input, paddingLeft: '2.2rem', height: '80px', resize: 'vertical' }} defaultValue="Paris, France" />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label}>Forme juridique</label>
              <select style={input}>
                {formes.map(f => <option key={f} selected={f === 'SAS'}>{f}</option>)}
              </select>
            </div>

            <SaveBtn onClick={() => handleSave(setSavedEntreprise)} saved={savedEntreprise} label="Enregistrer" />
          </div>

          {/* Facturation */}
          <div style={{ ...card, borderTop: '3px solid #f97316' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f97316', marginBottom: '1.5rem' }}>Facturation</div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Adresse de facturation</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#a0aec0' }}>📍</span>
                <textarea style={{ ...input, paddingLeft: '2.2rem', height: '80px', resize: 'vertical' }} placeholder="Si différente de l'adresse du siège social..." disabled={sameAddress} />
              </div>
            </div>

            {/* Toggle identique */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div onClick={() => setSameAddress(!sameAddress)} style={{ width: '44px', height: '24px', borderRadius: '100px', background: sameAddress ? '#a855f7' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '2px', left: sameAddress ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4a5568' }}>Identique à l'adresse du siège social</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Email de facturation</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>✉</span>
                <input style={{ ...input, paddingLeft: '2.2rem' }} placeholder="comptabilite@votre-entreprise.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={label}>Délai de paiement</label>
                <select style={input}>
                  {delais.map(d => <option key={d} selected={d === '30 jours'}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Devise</label>
                <select style={input}>
                  {devises.map(d => <option key={d} selected={d === 'EUR (€)'}>{d}</option>)}
                </select>
              </div>
            </div>

            <button onClick={() => handleSave(setSavedFacturation)} style={{ width: '100%', padding: '0.75rem', background: savedFacturation ? '#22c55e' : '#fff', color: savedFacturation ? '#fff' : '#4a5568', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
              {savedFacturation ? '✓ Mis à jour !' : 'Mettre à jour la facturation'}
            </button>
          </div>
        </div>
      )}

      {/* ===== ÉQUIPE ===== */}
      {tab === 'equipe' && (
        <div style={{ ...card, borderTop: '3px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#a855f7' }}>Gestion de l'équipe</div>
            <button onClick={() => setShowInviteModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700 }}>
              + Inviter un membre
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '1rem', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>👥</span>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1d4ed8' }}>{membresActifs}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Membres actifs</div>
                </div>
              </div>
            </div>
            <div style={{ background: '#fefce8', borderRadius: '10px', padding: '1rem', border: '1px solid #fde047' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🕐</span>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{membresEnAttente}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>En attente</div>
                </div>
              </div>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '1rem', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>👑</span>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>{admins}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Administrateur</div>
                </div>
              </div>
            </div>
          </div>

          {/* Membres */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a202c', marginBottom: '1rem' }}>Membres de l'équipe</div>
            {membres.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 0', borderBottom: i < membres.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: m.color + '22', border: `2px solid ${m.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: m.color, flexShrink: 0 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{m.email}</div>
                </div>
                <span style={{ background: m.status === 'Actif' ? '#dcfce7' : '#fef3c7', color: m.status === 'Actif' ? '#16a34a' : '#d97706', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{m.status}</span>
                <select
                  value={m.role}
                  onChange={e => updateRole(i, e.target.value)}
                  style={{ padding: '0.35rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '0.75rem', color: '#4a5568', background: '#fff', cursor: 'pointer', outline: 'none' }}
                >
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
                <button onClick={() => deleteMembre(i)} style={{ width: '30px', height: '30px', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#ef4444' }}>🗑</button>
              </div>
            ))}
          </div>

          {/* Permissions par rôle */}
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a202c', marginBottom: '1rem' }}>Permissions par rôle</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              {[
                { role: 'Administrateur', icon: '👑', color: '#f59e0b', bg: '#fef3c7', perms: ['Accès complet à tous les paramètres', 'Gestion des membres et permissions', 'Facturation et abonnements'] },
                { role: 'Manager', icon: '👤', color: '#3b82f6', bg: '#dbeafe', perms: ['Gestion des campagnes et partenaires', 'Accès aux statistiques', 'Création de rapports'] },
                { role: 'Viewer', icon: '👁', color: '#6b7280', bg: '#f3f4f6', perms: ['Consultation en lecture seule', 'Accès aux tableaux de bord', 'Visualisation des campagnes'] },
              ].map(({ role, icon, color, bg, perms }) => (
                <div key={role} style={{ background: bg, borderRadius: '10px', padding: '1rem', border: `1px solid ${color}30` }}>
                  <div style={{ fontWeight: 700, color, fontSize: '0.875rem', marginBottom: '0.6rem' }}>{icon} {role}</div>
                  {perms.map(p => (
                    <div key={p} style={{ fontSize: '0.75rem', color: '#4a5568', marginBottom: '0.3rem', display: 'flex', gap: '0.3rem' }}>
                      <span>•</span> {p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL INVITER UN MEMBRE */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowInviteModal(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>+ Inviter un membre</span>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>✕</button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={label}>Email</label>
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="collaborateur@example.com" style={input} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label}>Rôle</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={input}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={handleInvite} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700 }}>
              Envoyer l'invitation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}