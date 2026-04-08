'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const RESEAUX = [
  { name: 'Instagram', handle: '@sophieinfluence', followers: '125K', icon: '📸', color: '#e1306c', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', connected: true },
  { name: 'YouTube',   handle: 'Sophie Martin',    followers: '85K',  icon: '▶️', color: '#ff0000', bg: 'linear-gradient(135deg,#ff0000,#cc0000)', connected: true },
  { name: 'TikTok',    handle: '@sophiestyle',      followers: '220K', icon: '🎵', color: '#000',    bg: 'linear-gradient(135deg,#010101,#69c9d0)', connected: true },
]

const PORTFOLIO_COLLABS = [
  { type: 'Collaboration', brand: 'GreenBeauty', status: 'Terminée', debut: 'Jan 2024', fin: 'Fév 2024', duree: '1 mois', objectif: 'Produit - Crème visage' },
  { type: 'Affiliation', brand: 'TechFlow', status: 'Terminée', debut: 'Déc 2023', fin: 'Jan 2024', duree: '2 mois', objectif: 'Code promo - 15% réduction' },
  { type: 'Collaboration', brand: 'SummerVibes', status: 'Terminée', debut: 'Nov 2023', fin: 'Nov 2023', duree: '2 semaines', objectif: 'Visibilité - Collection été' },
]

const AVIS_DATA = [
  { brand: 'GreenBeauty', type: 'Collaboration', note: 5, date: 'Fév 2024', texte: "Excellente collaboration ! Sophie est professionnelle, créative et ses contenus sont de très haute qualité. Nous recommandons vivement.", reponse: null },
  { brand: 'TechFlow', type: 'Affiliation', note: 4, date: 'Jan 2024', texte: "Très bon retour sur investissement. Sophie a su mettre en valeur notre produit de manière authentique. Communication fluide.", reponse: 'Merci beaucoup ! J\'ai adoré travailler avec votre équipe.' },
  { brand: 'SummerVibes', type: 'Collaboration', note: 3, date: 'Nov 2023', texte: "Bonne collaboration dans l'ensemble. Le contenu était qualitatif mais les délais étaient un peu justes.", reponse: null },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Stars({ note, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= note ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function MonProfilPage() {
  const { isDark, colors } = useTheme()
  const [tab, setTab] = useState('general')
  const [editMode, setEditMode] = useState(false)

  // champs éditables
  const [prenom, setPrenom] = useState('Sophie')
  const [displayName, setDisplayName] = useState('Sophie Martin')
  const [username, setUsername] = useState('@sophieinfluence')
  const [bio, setBio] = useState('Passionnée de beauté et lifestyle, je partage mes découvertes et conseils avec ma communauté. Collaborations authentiques uniquement ✨')
  const [adresse, setAdresse] = useState('12 Rue de la Paix')
  const [ville, setVille] = useState('Paris')
  const [pays, setPays] = useState('France')
  const [site, setSite] = useState('https://linktr.ee/sophieinfluence')
  const [langues] = useState(['Français', 'Anglais', 'Espagnol'])
  const [specialites] = useState(['Beauté', 'Lifestyle', 'Mode', 'Wellness'])

  // avis réponses
  const [reponses, setReponses] = useState(AVIS_DATA.map(a => a.reponse || ''))
  const [repondreOpen, setRepondreOpen] = useState(null)
  const [reponseInput, setReponseInput] = useState('')
  const [savedReponses, setSavedReponses] = useState(AVIS_DATA.map(a => a.reponse))

  // réseaux
  const [reseaux, setReseaux] = useState(RESEAUX)

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.07)'

  const inputStyle = (editable = true) => ({
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid ${editMode && editable ? purple : colors.border}`,
    background: editMode && editable ? (isDark ? '#16162a' : '#faf5ff') : colors.inputBg,
    color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border-color .2s',
  })

  const TABS = [
    { key: 'general', label: 'Général' },
    { key: 'reseaux', label: 'Réseaux' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'avis', label: 'Avis' },
    { key: 'verifications', label: 'Vérifications' },
  ]

  // ── CARTE PROFIL ───────────────────────────────────────────────────────────
  const renderProfileCard = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 24 }}>
      {/* gauche */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '32px', textAlign: 'center', boxShadow: colors.shadow }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto', border: `3px solid ${purple}`, boxShadow: `0 0 0 3px ${isDark?'#1e1e32':'#fff'}` }}>
            🧑‍💼
          </div>
          {editMode && (
            <button style={{ position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: '50%', background: purple, border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
          )}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: colors.text }}>{displayName}</div>
        <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>{username}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>📍 {ville}, {pays}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: purpleLight, color: purple, padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
          ✅ Profil vérifié
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
          {[
            { val: '430K', label: 'Followers' },
            { val: '6.5%', label: 'Engagement' },
            { val: '4.9', label: 'Note' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', borderRight: i < 2 ? `1px solid ${colors.border}` : 'none', padding: '4px' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: purple }}>{s.val}</div>
              <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* droite — Partnexx Score */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '28px', boxShadow: colors.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: colors.text }}>Partnexx Score</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: purple, lineHeight: 1 }}>92</div>
          <span style={{ fontSize: 11, background: purpleLight, color: purple, padding: '4px 10px', borderRadius: 20, fontWeight: 800 }}>Excellent</span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: '100%', width: '92%', background: `linear-gradient(90deg,${purple},#ec4899)`, borderRadius: 99 }} />
        </div>
        {[
          { label: 'Taux de réponse', val: '95%', color: purple },
          { label: 'Respect des délais', val: '100%', color: purple },
          { label: 'Qualité du contenu', val: '4.8/5', color: purple },
        ].map(m => (
          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>{m.label}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.val}</span>
          </div>
        ))}
      </div>
    </div>
  )

  // ── ONGLET GÉNÉRAL ─────────────────────────────────────────────────────────
  const renderGeneral = () => (
    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '28px', boxShadow: colors.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: 18 }}>📝</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Informations <span style={{ color: purple }}>générales</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Prénom</label>
          <input value={prenom} onChange={e => setPrenom(e.target.value)} disabled={!editMode} style={inputStyle()} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom d'affichage</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} disabled={!editMode} style={inputStyle()} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom d'utilisateur</label>
        <input value={username} onChange={e => setUsername(e.target.value)} disabled={!editMode} style={inputStyle()} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600 }}>Bio courte</label>
          <span style={{ fontSize: 11, color: colors.textMuted }}>{bio.length}/280</span>
        </div>
        <textarea value={bio} onChange={e => setBio(e.target.value)} disabled={!editMode} rows={3}
          style={{ ...inputStyle(), resize: 'vertical' }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Adresse complète</label>
        <input value={adresse} onChange={e => setAdresse(e.target.value)} disabled={!editMode} style={inputStyle()} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>📍 Ville de résidence</label>
          <input value={ville} onChange={e => setVille(e.target.value)} disabled={!editMode} style={inputStyle()} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Pays</label>
          <input value={pays} onChange={e => setPays(e.target.value)} disabled={!editMode} style={inputStyle()} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>🔗 Site web / Linktree</label>
        <input value={site} onChange={e => setSite(e.target.value)} disabled={!editMode} style={inputStyle()} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 8 }}>Langues parlées</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {langues.map(l => (
            <span key={l} style={{ fontSize: 12, background: purpleLight, color: purple, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>{l}</span>
          ))}
          {editMode && (
            <button onClick={() => alert('Ajouter une langue...')} style={{ fontSize: 12, background: 'none', border: `1px dashed ${colors.border}`, color: colors.textSecondary, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>+ Ajouter</button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 8 }}>Spécialités</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {specialites.map(s => (
            <span key={s} style={{ fontSize: 12, background: purpleLight, color: purple, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>{s}</span>
          ))}
          {editMode && (
            <button onClick={() => alert('Ajouter une spécialité...')} style={{ fontSize: 12, background: 'none', border: `1px dashed ${colors.border}`, color: colors.textSecondary, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>+ Ajouter</button>
          )}
        </div>
      </div>

      {editMode && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { setEditMode(false); alert('Modifications enregistrées !') }}
            style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
          >
            💾 Enregistrer les modifications
          </button>
        </div>
      )}
    </div>
  )

  // ── ONGLET RÉSEAUX ─────────────────────────────────────────────────────────
  const renderReseaux = () => (
    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '28px', boxShadow: colors.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: 18 }}>🔗</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Plateformes <span style={{ color: purple }}>connectées</span></span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {reseaux.map((r, i) => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 14, border: `1px solid ${colors.border}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, color: '#fff' }}>
              {r.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{r.name}</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>{r.handle}</div>
              <div style={{ fontSize: 12, color: purple, fontWeight: 700, marginTop: 2 }}>{r.followers} followers</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>✓ Connecté</span>
              <button onClick={() => alert(`Rafraîchissement des données ${r.name}...`)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSecondary, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                🔄 Rafraîchir
              </button>
              <button onClick={() => { const updated = [...reseaux]; updated[i] = { ...updated[i], connected: false }; setReseaux(updated); alert(`${r.name} déconnecté.`) }} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                🔌 Déconnecter
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => alert('Connexion d\'un nouveau réseau social...')} style={{ padding: '14px', borderRadius: 14, border: `2px dashed ${colors.border}`, background: 'transparent', color: colors.textSecondary, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          + Connecter un nouveau réseau
        </button>
      </div>
    </div>
  )

  // ── ONGLET PORTFOLIO ───────────────────────────────────────────────────────
  const renderPortfolio = () => (
    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '28px', boxShadow: colors.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: 18 }}>📂</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Historique de <span style={{ color: purple }}>collaborations</span></span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PORTFOLIO_COLLABS.map((c, i) => (
          <div key={i} style={{ border: `1px solid ${colors.border}`, borderRadius: 14, padding: '18px 20px', background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 11, background: purpleLight, color: purple, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{c.type}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: colors.text }}>{c.brand}</span>
              <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontWeight: 700, marginLeft: 'auto' }}>{c.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[
                { label: 'Date de début', val: `📅 ${c.debut}` },
                { label: 'Date de fin', val: `📅 ${c.fin}` },
                { label: 'Durée', val: c.duree },
                { label: 'Objectif', val: `🎯 ${c.objectif}` },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── ONGLET AVIS ────────────────────────────────────────────────────────────
  const renderAvis = () => (
    <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '28px', boxShadow: colors.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Avis & <span style={{ color: purple }}>Réputation</span></span>
        </div>
        <button onClick={() => alert('Filtrer les avis...')} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSecondary, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          🔽 Filtrer
        </button>
      </div>

      {/* note globale */}
      <div style={{ background: purpleLight, borderRadius: 14, padding: '20px', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: purple, lineHeight: 1 }}>4.9</div>
        <div style={{ marginTop: 6 }}><Stars note={5} size={20} /></div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>Basé sur 24 avis</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {AVIS_DATA.map((a, i) => (
          <div key={i} style={{ border: `1px solid ${colors.border}`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{a.brand}</span>
                  <span style={{ fontSize: 11, background: purpleLight, color: purple, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{a.type}</span>
                </div>
                <Stars note={a.note} size={14} />
              </div>
              <span style={{ fontSize: 11, color: colors.textSecondary }}>{a.date}</span>
            </div>

            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
              {a.texte}
            </div>

            {/* réponse existante */}
            {savedReponses[i] && (
              <div style={{ background: purpleLight, border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : '#e9d5ff'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: purple, marginBottom: 4 }}>✉️ Votre réponse :</div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>{savedReponses[i]}</div>
              </div>
            )}

            {/* bouton répondre */}
            {!savedReponses[i] && (
              <>
                <button onClick={() => { setRepondreOpen(repondreOpen === i ? null : i); setReponseInput('') }}
                  style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: purple, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  ↩ Répondre
                </button>
                {repondreOpen === i && (
                  <div style={{ marginTop: 12 }}>
                    <textarea value={reponseInput} onChange={e => setReponseInput(e.target.value)} rows={2} placeholder="Rédigez votre réponse..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <button onClick={() => { if (reponseInput.trim()) { const r = [...savedReponses]; r[i] = reponseInput.trim(); setSavedReponses(r); setRepondreOpen(null); setReponseInput('') }}}
                        style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        ✉️ Publier
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  // ── ONGLET VÉRIFICATIONS ───────────────────────────────────────────────────
  const renderVerifications = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '28px', boxShadow: colors.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <span style={{ fontSize: 18 }}>🛡️</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Vérifications & <span style={{ color: purple }}>Certifications</span></span>
        </div>

        {/* KYC */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 12, background: isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4', border: `1px solid ${isDark ? 'rgba(34,197,94,0.2)' : '#bbf7d0'}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔒</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>Vérification d'identité (KYC)</div>
              <div style={{ fontSize: 12, color: '#15803d' }}>Votre identité a été vérifiée avec succès</div>
            </div>
          </div>
          <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: 20, fontWeight: 800 }}>✓ Vérifié</span>
        </div>

        {/* Réseaux validés */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Validation des comptes sociaux</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Instagram', icon: '📸', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' },
              { name: 'YouTube',   icon: '▶️', bg: 'linear-gradient(135deg,#ff0000,#cc0000)' },
              { name: 'TikTok',    icon: '🎵', bg: 'linear-gradient(135deg,#010101,#69c9d0)' },
            ].map(r => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{r.icon}</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{r.name}</span>
                </div>
                <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>✓ Vérifié</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Vos badges</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { icon: '🏆', label: 'Top Creator', sub: 'Performance exceptionnelle', color: '#7c3aed' },
              { icon: '⭐', label: 'Premium', sub: 'Abonnement actif', color: '#f59e0b' },
              { icon: '✅', label: 'Vérifié', sub: 'Identité confirmée', color: '#22c55e' },
            ].map(b => (
              <div key={b.label} style={{ background: isDark ? 'rgba(124,58,237,0.08)' : '#faf5ff', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : '#e9d5ff'}`, borderRadius: 16, padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: b.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 12px' }}>{b.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 4 }}>{b.label}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: colors.text }}>Mon profil</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(124,58,237,0.2)' : '#ede9fe', padding: '4px 12px', borderRadius: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: purple }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: purple }}>IA actif</span>
          </div>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{ padding: '10px 22px', borderRadius: 12, border: 'none', background: editMode ? '#ef4444' : `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 14px ${editMode ? '#ef444444' : purple + '44'}` }}
        >
          {editMode ? '✕ Annuler' : '✏️ Modifier le profil'}
        </button>
      </div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 24 }}>
        Informations Personnelles · Réseaux Sociaux · Portfolio Visuel
      </div>

      {renderProfileCard()}

      {/* TABS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderRadius: 14, overflow: 'hidden', border: `1px solid ${colors.border}`, marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '12px', border: 'none',
            background: tab === t.key ? `linear-gradient(135deg,${purple},#a855f7)` : 'transparent',
            color: tab === t.key ? '#fff' : colors.textSecondary,
            fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .2s',
            borderRight: i < 4 ? `1px solid ${colors.border}` : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'general'       && renderGeneral()}
      {tab === 'reseaux'       && renderReseaux()}
      {tab === 'portfolio'     && renderPortfolio()}
      {tab === 'avis'          && renderAvis()}
      {tab === 'verifications' && renderVerifications()}
    </div>
  )
}