'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

const STATS_HEADER = [
  { icon: '🎯', value: '92', label: 'Score Portfolio', color: '#7c3aed' },
  { icon: '👁️', value: '2.8M', label: 'Vues totales', color: '#06b6d4' },
  { icon: '💶', value: '€12 450', label: 'Revenus totaux', color: '#f59e0b' },
  { icon: '⭐', value: '4.9/5', label: 'Rating moyen', color: '#ef4444' },
]

const PORTFOLIO_ITEMS = [
  {
    id: 1, title: 'Unboxing Skincare Routine', tags: ['SkinCare Pro', 'Beauté'],
    type: 'vidéo', status: 'published', earnings: '€498',
    views: '1 240', engagement: '4.2%', likes: '245',
    ago: 'il y a 2 jours',
    bg: 'linear-gradient(135deg,#f9c784 0%,#f7a2a2 100%)',
    emoji: '💄',
  },
  {
    id: 2, title: 'Morning Coffee Lifestyle', tags: ['Coffee Culture', 'Lifestyle'],
    type: 'carousel', status: 'published', earnings: '€342',
    views: '892', engagement: '3.8%', likes: '189',
    ago: 'il y a 5 jours',
    bg: 'linear-gradient(135deg,#c9a96e 0%,#e8d5b7 100%)',
    emoji: '☕',
  },
  {
    id: 3, title: 'Tech Review - Draft', tags: [],
    type: 'vidéo', status: 'draft', earnings: null,
    views: '0', engagement: '0%', likes: '0',
    ago: 'il y a 1 heure',
    bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
    emoji: '📱',
  },
  {
    id: 4, title: 'Fitness Morning Routine', tags: ['Sport', 'Bien-être'],
    type: 'vidéo', status: 'published', earnings: '€210',
    views: '3 400', engagement: '5.1%', likes: '412',
    ago: 'il y a 1 semaine',
    bg: 'linear-gradient(135deg,#ff6b6b 0%,#feca57 100%)',
    emoji: '🏋️',
  },
  {
    id: 5, title: 'Street Style Look', tags: ['Mode', 'Urban'],
    type: 'carousel', status: 'published', earnings: '€180',
    views: '980', engagement: '3.2%', likes: '120',
    ago: 'il y a 2 semaines',
    bg: 'linear-gradient(135deg,#a8edea 0%,#fed6e3 100%)',
    emoji: '👟',
  },
  {
    id: 6, title: 'Recette Healthy Bowl', tags: ['Food', 'Healthy'],
    type: 'photo', status: 'review', earnings: null,
    views: '0', engagement: '—', likes: '0',
    ago: 'il y a 3 jours',
    bg: 'linear-gradient(135deg,#d4fc79 0%,#96e6a1 100%)',
    emoji: '🥗',
  },
]

const CAMPAIGNS = [
  { id: 1, brand: 'Nike', title: 'Nouvelle Collection Automne', cat: 'Mode & Sport', range: '€500 – €1200', candidates: 45, status: 'open', emoji: '👟' },
  { id: 2, brand: 'Samsung', title: 'Tech Review Challenge', cat: 'Technologie', range: '€800 – €2000', candidates: 23, status: 'selected', emoji: '📱' },
  { id: 3, brand: 'L\'Oréal', title: 'Beauty Routine Naturelle', cat: 'Beauté', range: '€300 – €800', candidates: 67, status: 'open', emoji: '💄' },
]

const COMMUNITY_POSTS = [
  { id: 1, title: 'Unboxing iPhone 15 Pro Max', author: 'TechMaster', authorScore: 94, type: 'vidéo', views: '12K', likes: '847', hot: true, bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', emoji: '📱' },
  { id: 2, title: 'Morning Skincare Routine', author: 'BeautyGlow', authorScore: 88, type: 'carousel', views: '8.4K', likes: '634', hot: true, bg: 'linear-gradient(135deg,#f9c784,#f7a2a2)', emoji: '✨' },
  { id: 3, title: 'Coffee Shop Aesthetic', author: 'LifeStyle_Jo', authorScore: 76, type: 'photo', views: '5.1K', likes: '312', hot: false, bg: 'linear-gradient(135deg,#c9a96e,#e8d5b7)', emoji: '☕' },
  { id: 4, title: 'Workout GRWM', author: 'FitnessPro', authorScore: 81, type: 'vidéo', views: '9.2K', likes: '520', hot: true, bg: 'linear-gradient(135deg,#ff6b6b,#feca57)', emoji: '💪' },
]

const TRENDING_CREATORS = [
  { name: 'VideoKing54', score: 97, cat: 'Technologie · Beauté', followers: '124K' },
  { name: 'MiaUser', score: 92, cat: 'Lifestyle · Sport', followers: '89K' },
  { name: 'BeautyBee', score: 89, cat: 'Beauté · Mode', followers: '210K' },
  { name: 'TravelBlogger', score: 85, cat: 'Voyage · Lifestyle', followers: '67K' },
  { name: 'Djblinon', score: 80, cat: 'Musique · Culture', followers: '44K' },
]

const TRENDING_HASHTAGS = [
  { tag: '#beauty', posts: '2.4M' }, { tag: '#fashion', posts: '1.8M' },
  { tag: '#lifestyle', posts: '3.1M' }, { tag: '#tech', posts: '980K' },
  { tag: '#fitness', posts: '2.2M' }, { tag: '#travel', posts: '4.5M' },
  { tag: '#food', posts: '5.1M' }, { tag: '#gaming', posts: '1.1M' },
]

export default function StudioUGCPage() {
  const { isDark, colors } = useTheme()
  const [tab, setTab] = useState('dashboard')
  const [portfolioView, setPortfolioView] = useState('grid')
  const [uploadFile, setUploadFile] = useState(null)
  const [contentTitle, setContentTitle] = useState('')
  const [contentDesc, setContentDesc] = useState('')
  const [contentFormat, setContentFormat] = useState('video')
  const [contentCat, setContentCat] = useState('')
  const [hashtags, setHashtags] = useState('#beauty #skincare #routine...')
  const [seoAuto, setSeoAuto] = useState(true)
  const [followedCreators, setFollowedCreators] = useState({})

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)'

  const statusStyle = (s) => {
    if (s === 'published') return { bg: '#dcfce7', text: '#15803d', label: 'Publié' }
    if (s === 'draft') return { bg: isDark ? '#2d2d4a' : '#f1f5f9', text: isDark ? '#9090b0' : '#64748b', label: 'Brouillon' }
    if (s === 'review') return { bg: '#fef9c3', text: '#a16207', label: 'En révision' }
    return {}
  }

  const tabs = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'portfolio', icon: '🗂️', label: 'Portfolio' },
    { key: 'creer', icon: '✨', label: 'Créer' },
    { key: 'communaute', icon: '🌐', label: 'Communauté' },
  ]

  // ─── HEADER BANNER ───────────────────────────────────────────────────────────
  const renderHeader = () => (
    <div style={{
      background: isDark
        ? 'linear-gradient(135deg,#1e1e32 0%,#2a1f4e 60%,#1e1e32 100%)'
        : 'linear-gradient(135deg,#f3f0ff 0%,#ede9fe 60%,#f0f9ff 100%)',
      borderRadius: 20,
      padding: '28px 32px',
      marginBottom: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* bg decor */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(6,182,212,0.06)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}>🎬</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: purple, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Creator Studio Pro</div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>L'outil ultime pour créateurs UGC professionnels</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.cardBg, color: colors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            📊 Analytics
          </button>
          <button style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.cardBg, color: colors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            🌐 Profil Public
          </button>
          <button onClick={() => setTab('creer')} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
            + Créer du Contenu
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
        {STATS_HEADER.map(s => (
          <div key={s.label} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(8px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)'}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── TAB BAR ─────────────────────────────────────────────────────────────────
  const renderTabBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', gap: 4, background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            background: tab === t.key ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'transparent',
            color: tab === t.key ? '#fff' : colors.textSecondary,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all .2s',
            boxShadow: tab === t.key ? '0 2px 8px rgba(124,58,237,0.3)' : 'none',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>
      {(tab === 'portfolio' || tab === 'communaute') && (
        <div style={{ display: 'flex', gap: 6 }}>
          {['grid', 'list'].map(v => (
            <button key={v} onClick={() => setPortfolioView(v)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${colors.border}`, background: portfolioView === v ? purple : colors.cardBg, color: portfolioView === v ? '#fff' : colors.textSecondary, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {v === 'grid' ? '⊞' : '≡'}
            </button>
          ))}
          <button style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.cardBg, color: colors.textSecondary, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</button>
        </div>
      )}
    </div>
  )

  // ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Revenus ce mois', value: '€2 450', sub: '+12% vs mois dernier', subColor: '#22c55e', icon: '💵', accent: '#f59e0b' },
          { label: 'Vues totales', value: '847K', sub: '+24% cette semaine', subColor: '#22c55e', icon: '👁️', accent: '#06b6d4' },
          { label: 'Campagnes actives', value: '5', sub: '2 nouvelles cette semaine', subColor: '#8b5cf6', icon: '🎯', accent: '#7c3aed' },
          { label: 'Score Portfolio', value: '92/100', sub: 'Excellent niveau', subColor: '#f59e0b', icon: '🏆', accent: '#f59e0b' },
        ].map(k => (
          <div key={k.label} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 22px', boxShadow: colors.shadow, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -12, right: -12, width: 64, height: 64, borderRadius: '50%', background: k.accent + '18' }} />
            <div style={{ fontSize: 24, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.accent, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.subColor, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              ↑ {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Campagnes recommandées */}
        <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: colors.shadow }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.text, marginBottom: 4 }}>🚀 Campagnes Recommandées Pour Vous</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 20 }}>Basées sur votre profil et historique</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CAMPAIGNS.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, border: `1px solid ${colors.border}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{c.title}</div>
                    {c.status === 'selected' && <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>✓ Sélectionné</span>}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>{c.cat} · {c.range} · {c.candidates} candidats</div>
                </div>
                <button style={{
                  padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, flexShrink: 0,
                  background: c.status === 'selected' ? '#f59e0b' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                  color: '#fff',
                  boxShadow: c.status === 'selected' ? '0 2px 8px rgba(245,158,11,0.3)' : '0 2px 8px rgba(124,58,237,0.3)',
                }}>
                  {c.status === 'selected' ? 'En cours' : 'Postuler'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Performance 7 jours */}
        <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: colors.shadow }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.text, marginBottom: 20 }}>📈 Performance 7 jours</div>
          {[
            { label: 'Engagement moyen', value: '4.8%', pct: 78, color: '#7c3aed' },
            { label: 'Revenus cette semaine', value: '€840', pct: 62, color: '#7c3aed' },
            { label: 'Nouveaux followers', value: '+234', pct: 45, color: '#7c3aed' },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: m.pct + '%', background: `linear-gradient(90deg,${m.color},#a855f7)`, borderRadius: 99, transition: 'width .6s ease' }} />
              </div>
            </div>
          ))}
          <button style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 6 }}>
            📊 Rapport détaillé
          </button>
        </div>
      </div>
    </div>
  )

  // ─── PORTFOLIO TAB ───────────────────────────────────────────────────────────
  const renderPortfolio = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>🗂️ Mon Portfolio UGC</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{PORTFOLIO_ITEMS.length} contenus · Score portfolio : 92/100</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input placeholder="Rechercher un contenu..." style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', width: 200 }} />
          <select style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option>Plus récent</option>
            <option>Plus de vues</option>
            <option>Meilleur engagement</option>
          </select>
        </div>
      </div>

      <div style={{ display: portfolioView === 'grid' ? 'grid' : 'flex', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', flexDirection: 'column', gap: 16 }}>
        {PORTFOLIO_ITEMS.map(item => {
          const st = statusStyle(item.status)
          return portfolioView === 'grid' ? (
            <div key={item.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: colors.shadow, transition: 'transform .2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              {/* thumbnail */}
              <div style={{ height: 200, background: item.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                {item.emoji}
                <div style={{ position: 'absolute', top: 10, left: 10, background: st.bg, color: st.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{st.label}</div>
                {item.earnings && <div style={{ position: 'absolute', top: 10, right: 10, background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{item.earnings}</div>}
                <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 8 }}>📹 {item.type}</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{item.title}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {item.tags.map(t => <span key={t} style={{ fontSize: 11, background: purpleLight, color: purple, padding: '2px 8px', borderRadius: 20 }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.textSecondary, borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
                  <span>👁️ {item.views}</span>
                  <span>💜 {item.engagement}</span>
                  <span>❤️ {item.likes}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: colors.textMuted }}>{item.ago}</span>
                  <button style={{ fontSize: 12, color: purple, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Voir Analytics →</button>
                </div>
              </div>
            </div>
          ) : (
            <div key={item.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '14px 18px', boxShadow: colors.shadow, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{item.title}</div>
                  <span style={{ fontSize: 11, background: st.bg, color: st.text, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{st.label}</span>
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>📹 {item.type} · {item.ago}</div>
              </div>
              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: colors.textSecondary, flexShrink: 0 }}>
                <span>👁️ {item.views}</span>
                <span>💜 {item.engagement}</span>
                <span>❤️ {item.likes}</span>
                {item.earnings && <span style={{ color: '#7c3aed', fontWeight: 700 }}>{item.earnings}</span>}
              </div>
              <button style={{ fontSize: 12, color: purple, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Analytics →</button>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ─── CRÉER TAB ───────────────────────────────────────────────────────────────
  const renderCreer = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Studio header */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 24px', boxShadow: colors.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>Studio de Création IA</div>
          <span style={{ fontSize: 11, background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>BETA</span>
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>Créez du contenu UGC professionnel avec l'aide de l'IA et des outils avancés</div>
      </div>

      {/* 3 tools */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { icon: '📤', title: 'Upload de Fichiers', desc: 'Importez vos photos, vidéos ou carousels existants', action: 'Choisir des fichiers', type: 'secondary', key: 'upload' },
          { icon: '🤖', title: 'Création IA', desc: 'Générez du contenu avec l\'intelligence artificielle', action: '✨ Créer avec IA', type: 'primary', key: 'ai' },
          { icon: '📋', title: 'Templates Pro', desc: 'Utilisez nos templates optimisés pour chaque plateforme', action: '📋 Parcourir templates', type: 'secondary', key: 'tpl' },
        ].map(tool => (
          <div key={tool.key} style={{ background: colors.cardBg, border: `1px dashed ${colors.border}`, borderRadius: 16, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', boxShadow: colors.shadow }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{tool.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{tool.title}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5 }}>{tool.desc}</div>
            <button style={{
              width: '100%', padding: '10px 0', borderRadius: 10, border: tool.type === 'primary' ? 'none' : `1px solid ${colors.border}`,
              background: tool.type === 'primary' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'transparent',
              color: tool.type === 'primary' ? '#fff' : colors.text,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: tool.type === 'primary' ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
            }}>
              {tool.action}
            </button>
          </div>
        ))}
      </div>

      {/* Détails du contenu */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '24px 28px', boxShadow: colors.shadow }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 20 }}>📝 Détails du Contenu</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Titre du contenu</label>
              <input value={contentTitle} onChange={e => setContentTitle(e.target.value)} placeholder="Ex: Unboxing iPhone 15 Pro..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Format</label>
              <select value={contentFormat} onChange={e => setContentFormat(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                <option value="video">📹 Vidéo (Feed/Reels)</option>
                <option value="carousel">🖼️ Carousel</option>
                <option value="photo">📷 Photo</option>
                <option value="story">⏱️ Story</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Catégorie</label>
              <select value={contentCat} onChange={e => setContentCat(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                <option value="">Sélectionner une catégorie</option>
                <option>Beauté</option><option>Mode</option><option>Technologie</option>
                <option>Sport</option><option>Food</option><option>Lifestyle</option>
              </select>
            </div>
          </div>
          {/* right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600, display: 'block', marginBottom: 6 }}>Description</label>
              <textarea value={contentDesc} onChange={e => setContentDesc(e.target.value)} placeholder="Décrivez votre contenu..." rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600 }}>Hashtags</label>
                <button style={{ fontSize: 11, color: purple, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✨ Générer avec IA</button>
              </div>
              <input value={hashtags} onChange={e => setHashtags(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Optimisation SEO automatique</div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>L'IA optimise votre contenu pour chaque plateforme</div>
              </div>
              <div onClick={() => setSeoAuto(p => !p)} style={{ width: 44, height: 24, borderRadius: 99, background: seoAuto ? purple : (isDark ? '#3a3a5a' : '#d1d5db'), cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: seoAuto ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${colors.border}` }}>
          <button style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            💾 Enregistrer comme brouillon
          </button>
          <button style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
            🚀 Publier le contenu
          </button>
        </div>
      </div>
    </div>
  )

  // ─── COMMUNAUTÉ TAB ──────────────────────────────────────────────────────────
  const renderCommunaute = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>🌐 Feed Communauté UGC</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Découvrez les contenus créateurs de la plateforme</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input placeholder="Rechercher contenu, hashtag..." style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', width: 220 }} />
          <select style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option>Catégorie</option><option>Beauté</option><option>Tech</option><option>Sport</option>
          </select>
          <button style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.cardBg, color: colors.text, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>🔽 Plus de filtres</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>Trending Maintenant</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {COMMUNITY_POSTS.map(p => (
              <div key={p.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: colors.shadow, cursor: 'pointer', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ height: 200, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative' }}>
                  {p.emoji}
                  {p.hot && <div style={{ position: 'absolute', top: 10, left: 10, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>🔥 HOT</div>}
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 8 }}>📹 {p.type}</div>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👤</div>
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>{p.author}</span>
                    <span style={{ fontSize: 10, background: '#7c3aed', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{p.authorScore}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.textSecondary }}>
                    <span>👁️ {p.views}</span>
                    <span>❤️ {p.likes}</span>
                    <span style={{ color: purple, fontWeight: 700, cursor: 'pointer' }}>Voir →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar communauté */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Trending */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '18px 20px', boxShadow: colors.shadow }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>🔥 Créateurs Tendance</div>
            {TRENDING_CREATORS.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: i < TRENDING_CREATORS.length - 1 ? 12 : 0, marginBottom: i < TRENDING_CREATORS.length - 1 ? 12 : 0, borderBottom: i < TRENDING_CREATORS.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: purple, flexShrink: 0 }}>{c.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{c.name} <span style={{ fontSize: 10, background: '#7c3aed', color: '#fff', padding: '1px 5px', borderRadius: 8 }}>{c.score}</span></div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.cat}</div>
                </div>
                <button onClick={() => setFollowedCreators(p => ({ ...p, [c.name]: !p[c.name] }))} style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                  background: followedCreators[c.name] ? '#22c55e' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                  color: '#fff',
                }}>{followedCreators[c.name] ? '✓ Suivi' : 'Suivre'}</button>
              </div>
            ))}
          </div>

          {/* Hashtags */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '18px 20px', boxShadow: colors.shadow }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>🏷️ Hashtags Tendance</div>
            {TRENDING_HASHTAGS.map((h, i) => (
              <div key={h.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < TRENDING_HASHTAGS.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <span style={{ fontSize: 13, color: purple, fontWeight: 600, cursor: 'pointer' }}>{h.tag}</span>
                <span style={{ fontSize: 11, color: colors.textSecondary }}>{h.posts}</span>
              </div>
            ))}
          </div>

          {/* Stats communauté */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '18px 20px', boxShadow: colors.shadow }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginBottom: 14 }}>📊 Stats Communauté</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Créateurs actifs', value: '2.5M+', color: purple },
                { label: 'Contenus publiés', value: '45K', color: '#06b6d4' },
                { label: 'Vues totales', value: '890M', color: '#f59e0b' },
                { label: 'Marques partenaires', value: '730', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>
      {renderHeader()}
      {renderTabBar()}
      {tab === 'dashboard' && renderDashboard()}
      {tab === 'portfolio' && renderPortfolio()}
      {tab === 'creer' && renderCreer()}
      {tab === 'communaute' && renderCommunaute()}
    </div>
  )
}