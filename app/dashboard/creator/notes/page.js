'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const AVIS = [
  {
    id: 1,
    auteur: 'Marie Dubois',
    role: 'Premier',
    roleColor: '#7c3aed',
    entreprise: 'GreenBeauty',
    campagne: 'Campagne Skincare Naturelle',
    date: 'il y a 2 mois',
    note: 4.8,
    stars: 5,
    texte: "Collaboration exceptionnelle avec Sophie ! Très professionnelle, créative et respectueuse des délais. Le contenu produit était au-delà de nos attentes. Je recommande vivement !",
    categories: [
      { label: 'Communication', note: 5 },
      { label: 'Contenu', note: 5 },
      { label: 'Qualité', note: 5 },
      { label: 'Rapidité', note: 5 },
    ],
    likes: 3,
    dislikes: 0,
    reponse: null,
  },
  {
    id: 2,
    auteur: 'Thomas Martin',
    role: 'Récent',
    roleColor: '#22c55e',
    entreprise: 'TechFlow',
    campagne: 'Review produit Tech',
    date: 'il y a 1 mois',
    note: 4.5,
    stars: 4,
    texte: "Très bon travail sur la review de notre produit. Sophie a su mettre en avant les points forts tout en restant authentique. Quelques améliorations possibles sur les délais de livraison.",
    categories: [
      { label: 'Communication', note: 5 },
      { label: 'Contenu', note: 5 },
      { label: 'Qualité', note: 5 },
      { label: 'Rapidité', note: 3 },
    ],
    likes: 2,
    dislikes: 1,
    reponse: null,
  },
  {
    id: 3,
    auteur: 'Sarah Chen',
    role: 'Premier',
    roleColor: '#7c3aed',
    entreprise: 'SportLife',
    campagne: 'Collaboration Fitness',
    date: 'il y a 3 semaines',
    note: 5.0,
    stars: 5,
    texte: "Partenariat parfait ! Sophie a une excellente compréhension de notre marque et de notre public. Les visuels étaient magnifiques et l'engagement exceptionnel. À refaire !",
    categories: [
      { label: 'Communication', note: 5 },
      { label: 'Contenu', note: 5 },
      { label: 'Qualité', note: 5 },
      { label: 'Rapidité', note: 5 },
    ],
    likes: 5,
    dislikes: 0,
    reponse: null,
  },
]

const CATEGORIES_GLOBALES = [
  { label: 'Communication', note: 4.7, icon: '💬' },
  { label: 'Contenu', note: 5.0, icon: '🎨' },
  { label: 'Qualité', note: 4.3, icon: '⭐' },
  { label: 'Rapidité', note: 5.0, icon: '⚡' },
]

// ─── COMPOSANTS ───────────────────────────────────────────────────────────────

function Stars({ note, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(note) ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  )
}

function NoteBar({ label, note, isDark }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <div style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>{note}</div>
      <Stars note={note} size={11} />
      <div style={{ fontSize: 11, color: isDark ? '#9090b0' : '#9ca3af', marginTop: 3 }}>{label}</div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function NotesFeedbacksPage() {
  const { isDark, colors } = useTheme()
  const [avis, setAvis] = useState(AVIS)
  const [reponseOuverte, setReponseOuverte] = useState(null)
  const [reponseTexte, setReponseTexte] = useState({})
  const [reponseGlobale, setReponseGlobale] = useState('')
  const [filtre, setFiltre] = useState('all')
  const [likeState, setLikeState] = useState({})
  const [search, setSearch] = useState('')

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.07)'

  const filteredAvis = avis.filter(a => {
    if (filtre === '5') return a.stars === 5
    if (filtre === '4') return a.stars === 4
    if (filtre === '3') return a.stars <= 3
    if (search) return a.auteur.toLowerCase().includes(search.toLowerCase()) || a.campagne.toLowerCase().includes(search.toLowerCase())
    return true
  })

  const handleLike = (id, type) => {
    setLikeState(prev => {
      const cur = prev[id] || null
      return { ...prev, [id]: cur === type ? null : type }
    })
  }

  const handleRepondre = (id) => {
    const txt = reponseTexte[id]?.trim()
    if (!txt) return
    setAvis(prev => prev.map(a => a.id === id ? { ...a, reponse: txt } : a))
    setReponseOuverte(null)
    setReponseTexte(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: colors.text }}>Notes & Feedbacks</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(124,58,237,0.2)' : '#ede9fe', padding: '4px 12px', borderRadius: 20 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: purple }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: purple }}>Public</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 24 }}>
        Avis Clients · Notes Détaillées · Réputation Publique
      </div>

      {/* ── SEARCH + FILTRES ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par catégorie, entreprise ou commentaire..."
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary, fontSize: 14 }}>🔍</span>
        </div>
        {[
          { key: 'all', label: 'Tous' },
          { key: '5', label: '⭐ 5 étoiles' },
          { key: '4', label: '⭐ 4 étoiles' },
          { key: '3', label: '⭐ ≤ 3 étoiles' },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltre(f.key)} style={{
            padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            background: filtre === f.key ? purple : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
            color: filtre === f.key ? '#fff' : colors.textSecondary,
            transition: 'all .2s',
          }}>{f.label}</button>
        ))}
      </div>

      {/* ── VUE D'ENSEMBLE ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 6, fontSize: 13, fontWeight: 700, color: colors.textSecondary }}>Vue d'ensemble</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 24, boxShadow: colors.shadow }}>
        {[
          { label: 'Note moyenne', value: '4.7', stars: true, color: '#f59e0b' },
          { label: 'Avis reçus', value: '3', color: '#06b6d4' },
          { label: 'Recommandation', value: '100%', color: '#22c55e' },
          { label: 'Idées reçues', value: '35', color: purple },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '22px 20px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            {s.stars && <div style={{ marginBottom: 4 }}><Stars note={4.7} size={14} /></div>}
            <div style={{ fontSize: 12, color: colors.textSecondary }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── ÉVALUATIONS PAR CATÉGORIE ──────────────────────────────────── */}
      <div style={{ marginBottom: 6, fontSize: 13, fontWeight: 700, color: colors.textSecondary }}>Évaluations par catégorie</div>
      <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 10 }}>Notes de performance par idée</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 28, boxShadow: colors.shadow }}>
        {CATEGORIES_GLOBALES.map((c, i) => (
          <div key={c.label} style={{ padding: '20px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', marginBottom: 4 }}>{c.note.toFixed(1)}</div>
            <Stars note={c.note} size={12} />
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── AVIS DÉTAILLÉS ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: colors.text }}>Avis détaillés</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Retours de vos collaborateurs</div>
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary }}>{filteredAvis.length} avis</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {filteredAvis.map(a => (
          <div key={a.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 24px', boxShadow: colors.shadow }}>

            {/* auteur */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg,${purple},#ec4899)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {a.auteur[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{a.auteur}</span>
                    <span style={{ fontSize: 10, background: a.roleColor + '22', color: a.roleColor, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{a.role}</span>
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                    {a.entreprise} · Campagne {a.campagne}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Stars note={a.stars} size={13} />
                    <span style={{ fontSize: 11, color: colors.textSecondary }}>{a.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReponseOuverte(reponseOuverte === a.id ? null : a.id)}
                style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSecondary, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Noter
              </button>
            </div>

            {/* texte */}
            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.7, marginBottom: 16, padding: '12px 14px', background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa', borderRadius: 10, borderLeft: `3px solid ${purpleLight}` }}>
              "{a.texte}"
            </div>

            {/* sous-notes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, padding: '12px 0', borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, marginBottom: 12 }}>
              {a.categories.map(c => (
                <NoteBar key={c.label} label={c.label} note={c.note} isDark={isDark} />
              ))}
            </div>

            {/* réponse existante */}
            {a.reponse && (
              <div style={{ background: isDark ? 'rgba(124,58,237,0.08)' : '#f5f3ff', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : '#e9d5ff'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: purple, marginBottom: 4 }}>✉️ Votre réponse :</div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>{a.reponse}</div>
              </div>
            )}

            {/* actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => handleLike(a.id, 'like')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: likeState[a.id] === 'like' ? '#22c55e' : colors.textSecondary, fontWeight: likeState[a.id] === 'like' ? 700 : 400 }}
              >
                👍 {a.likes + (likeState[a.id] === 'like' ? 1 : 0)}
              </button>
              <button
                onClick={() => handleLike(a.id, 'dislike')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: likeState[a.id] === 'dislike' ? '#ef4444' : colors.textSecondary }}
              >
                👎 {a.dislikes + (likeState[a.id] === 'dislike' ? 1 : 0)}
              </button>
              <button
                onClick={() => setReponseOuverte(reponseOuverte === a.id ? null : a.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: colors.textSecondary, fontWeight: 600 }}
              >
                ↩ Répondre
              </button>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: colors.textMuted }}>il y a {a.date.replace('il y a ', '')}</span>
            </div>

            {/* zone réponse */}
            {reponseOuverte === a.id && (
              <div style={{ marginTop: 14, padding: '14px', background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: 12, border: `1px solid ${colors.border}` }}>
                <textarea
                  value={reponseTexte[a.id] || ''}
                  onChange={e => setReponseTexte(prev => ({ ...prev, [a.id]: e.target.value }))}
                  placeholder="Rédigez une réponse publique à cet avis..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button
                    onClick={() => handleRepondre(a.id)}
                    style={{ padding: '9px 22px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
                  >
                    ✉️ Publier ma réponse
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredAvis.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: colors.textSecondary, background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 600 }}>Aucun avis trouvé</div>
          </div>
        )}
      </div>

      {/* ── RÉPONDRE AUX AVIS (GLOBAL) ─────────────────────────────────── */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '22px 24px', boxShadow: colors.shadow }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 4 }}>✉️ Répondre aux avis</div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 14 }}>Engagez la conversation avec vos partenaires</div>
        <textarea
          value={reponseGlobale}
          onChange={e => setReponseGlobale(e.target.value)}
          placeholder="Rédigez une réponse publique à cet avis..."
          rows={3}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            onClick={() => { if (reponseGlobale.trim()) { alert('Réponse publiée !'); setReponseGlobale('') } }}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${purple},#a855f7)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
          >
            ✉️ Publier ma réponse
          </button>
        </div>
      </div>
    </div>
  )
}