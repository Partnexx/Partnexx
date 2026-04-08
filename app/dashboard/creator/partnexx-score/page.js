'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '../../ThemeContext'

// ─── DATA ────────────────────────────────────────────────────────────────────

const LEADERBOARD = [
  { rank: 1, name: 'Alexandra Digital', pts: 2847, week: '+127', emoji: '🚀', badge: 'TOP 3' },
  { rank: 2, name: 'Marcus Growth',     pts: 2691, week: '+89',  emoji: '💎', badge: 'TOP 3' },
  { rank: 3, name: 'Sofia Creator',     pts: 2534, week: '+156', emoji: '⭐', badge: 'TOP 3' },
  { rank: 4, name: 'David Innovation',  pts: 2401, week: '+203', emoji: '🎯', badge: null },
  { rank: 5, name: 'Emma Influence',    pts: 2298, week: '+95',  emoji: '⭐', badge: null },
  { rank: 6, name: 'Lucas Vision',      pts: 2187, week: '+178', emoji: '☀️', badge: null },
  { rank: 7, name: 'Vous',              pts: 850,  week: '+242', emoji: '🏆', badge: 'VOUS', isMe: true },
  { rank: 8, name: 'Nina Creative',     pts: 1954, week: '+134', emoji: '🎯', badge: null },
]

const DAILY_CHALLENGES = [
  { id: 1, icon: '👁️', title: "Maître de l'Engagement", desc: "Atteindre 95% de taux d'engagement sur une story", difficulty: 'Facile', diffColor: '#22c55e', pts: '+15 pts', bonus: 'Badge Viral', timer: '18h 42m', participants: 1247, completed: 432, accent: '#22c55e' },
  { id: 2, icon: '🚀', title: 'Speed Creator', desc: 'Créer et publier 3 contenus en moins de 2h', difficulty: 'Moyen', diffColor: '#f59e0b', pts: '+25 pts', bonus: 'Boost IA', timer: '18h 42m', participants: 892, completed: 156, accent: '#3b82f6' },
  { id: 3, icon: '☕', title: 'Influenceur du Café', desc: 'Obtenir 50 commentaires sur un post avant midi', difficulty: 'Difficile', diffColor: '#ef4444', pts: '+35 pts', bonus: 'Consultation Pro', timer: '6h 15m', participants: 523, completed: 89, accent: '#ef4444' },
]

const WEEKLY_CHALLENGES = [
  { id: 1, icon: '👑', title: 'Empereur des Conversions', desc: 'Maintenir 90%+ de taux de conversion sur 7 jours', difficulty: 'Epic', diffColor: '#ef4444', pts: '+150 pts', bonus: 'Accès VIP Premium', timer: '4j 12h', participants: 312, completed: 45, accent: '#7c3aed', serie: 'Série 3', bg: 'linear-gradient(135deg,#f3e8ff,#ede9fe)' },
  { id: 2, icon: '👥', title: 'Architecte de Communauté', desc: 'Recruter 10 nouveaux followers qualifiés', difficulty: 'Difficile', diffColor: '#ec4899', pts: '+100 pts', bonus: 'Outils Analytics Pro', timer: '4j 12h', participants: 756, completed: 189, accent: '#ec4899', bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
  { id: 3, icon: '💡', title: 'Génie Créatif', desc: 'Innover avec 5 formats de contenu différents', difficulty: 'Epic', diffColor: '#f59e0b', pts: '+120 pts', bonus: 'Mentor Personnel', timer: '4j 12h', participants: 445, completed: 67, accent: '#f59e0b', bg: 'linear-gradient(135deg,#fef9c3,#fde68a)' },
]

const MONTHLY_CHALLENGES = [
  { id: 1, icon: '🏆', title: 'Légende de Partnexx', desc: 'Dominer le classement pendant 30 jours', difficulty: 'Légendaire', diffColor: '#f59e0b', pts: '+500 pts', bonus: 'Statut Légende + Revenue Share', timer: '18j 7h', participants: 50, completed: 2, accent: '#f59e0b', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', highlighted: true },
  { id: 2, icon: '🏗️', title: 'Empire Builder', desc: 'Générer 50k€+ de revenus via la plateforme', difficulty: 'Epic', diffColor: '#7c3aed', pts: '+300 pts', bonus: 'Consultant Dédié + Événement Exclusif', timer: '18j 7h', participants: 128, completed: 12, accent: '#7c3aed', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
  { id: 3, icon: '📖', title: 'Mentor Suprême', desc: 'Former et accompagner 5 nouveaux créateurs au succès', difficulty: 'Epic', diffColor: '#22c55e', pts: '+250 pts', bonus: 'Programme Ambassador + Equity', timer: '18j 7h', participants: 89, completed: 8, accent: '#22c55e', bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
]

const TROPHEES = [
  { id: 1, icon: '🎯', title: 'Première Victoire', desc: 'Complétez votre premier défi', rarity: 'COMMON', rarityColor: '#6b7280', unlocked: true, accent: '#9ca3af' },
  { id: 2, icon: '🔥', title: 'Série de Feu', desc: '7 défis consécutifs réussis', rarity: 'RARE', rarityColor: '#3b82f6', unlocked: true, accent: '#3b82f6' },
  { id: 3, icon: '💎', title: 'Perfectionniste', desc: '100% sur 10 défis difficiles', rarity: 'EPIC', rarityColor: '#7c3aed', unlocked: true, accent: '#7c3aed' },
  { id: 4, icon: '⏰', title: 'Maître du Temps', desc: '30 défis daily en avance', rarity: 'LEGENDARY', rarityColor: '#f59e0b', unlocked: false, accent: '#f59e0b' },
  { id: 5, icon: '👑', title: 'Influenceur Suprême', desc: 'Top 1% pendant 3 mois', rarity: 'MYTHIQUE', rarityColor: '#ec4899', unlocked: false, accent: '#ec4899' },
  { id: 6, icon: '🤖', title: 'Pionnier IA', desc: 'Premier à tester 5 nouvelles features IA', rarity: 'RARE', rarityColor: '#3b82f6', unlocked: true, accent: '#3b82f6' },
]

const MARKETPLACE_ITEMS = [
  { id: 1, icon: '🤖', title: 'Consultation IA Personnalisée', desc: "Session 1h avec notre IA expert pour optimiser vos campagnes", pts: 150, popularity: '94% populaire', status: 'available', accent: '#7c3aed' },
  { id: 2, icon: '🚀', title: 'Accès Early Beta Features', desc: 'Testez les nouvelles fonctionnalités avant tout le monde', pts: 200, popularity: '89% populaire', status: 'available', accent: '#3b82f6' },
  { id: 3, icon: '👑', title: 'Mentor Personnel 1 Mois', desc: 'Accompagnement dédié par un Top 1% Partnexx', pts: 500, popularity: '97% populaire', status: 'waitlist', waitlist: 23, accent: '#f59e0b' },
  { id: 4, icon: '✨', title: 'Event Privé Paris', desc: 'Soirée networking exclusive avec les élites', pts: 300, popularity: '92% populaire', status: 'limited', places: 12, accent: '#ec4899' },
]

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function PartnexxScorePage() {
  const { isDark, colors } = useTheme()
  const [tab, setTab] = useState('dashboard')
  const [defiSub, setDefiSub] = useState('quotidien')
  const [pts, setPts] = useState(850)
  const [liveBonus, setLiveBonus] = useState(0)

  // live pts ticker
  useEffect(() => {
    const id = setInterval(() => {
      const gain = Math.floor(Math.random() * 3) + 1
      setLiveBonus(p => p + gain)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)'

  const TABS = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'defis',     label: 'Défis',      icon: '🎯' },
    { key: 'classement',label: 'Classement', icon: '🏆' },
    { key: 'succes',    label: 'Succès',      icon: '🎖️' },
    { key: 'ia',        label: 'IA Insights', icon: '🤖' },
    { key: 'marketplace',label: 'Marketplace',icon: '🛍️' },
  ]

  const tabAccent = {
    dashboard: '#7c3aed', defis: '#f97316', classement: '#f59e0b',
    succes: '#22c55e', ia: '#06b6d4', marketplace: '#ec4899',
  }

  // ─── HEADER ────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 8 }}>
        <span style={{ fontSize: 40 }}>🏆</span>
        <div>
          <div style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            Partnexx Empire
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, color: colors.textSecondary }}>
        <span>🚀</span>
        <span style={{ fontWeight: 700, color: purple }}>Niveau Elite</span>
        <span>·</span>
        <span>Rang #7</span>
        <span>·</span>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>+{liveBonus} pts temps réel</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  )

  // ─── TAB BAR ───────────────────────────────────────────────────────────────
  const renderTabBar = () => (
    <div style={{ background: isDark ? colors.cardBg : '#fff', border: `1px solid ${colors.border}`, borderRadius: 16, padding: 6, display: 'flex', gap: 4, marginBottom: 28, boxShadow: colors.shadow, flexWrap: 'wrap' }}>
      {TABS.map(t => {
        const active = tab === t.key
        const accent = tabAccent[t.key]
        return (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, minWidth: 100, padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            background: active ? accent : 'transparent',
            color: active ? '#fff' : colors.textSecondary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all .2s',
            boxShadow: active ? `0 4px 14px ${accent}55` : 'none',
          }}>{t.icon} {t.label}</button>
        )
      })}
    </div>
  )

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
      {/* score card */}
      <div style={{
        background: isDark ? 'linear-gradient(135deg,#1e1e32,#2d1f4e)' : 'linear-gradient(135deg,#f5f3ff,#fdf4ff)',
        border: `1px solid ${isDark ? '#3d2d6e' : '#e9d5ff'}`,
        borderRadius: 20, padding: '36px 40px', textAlign: 'center', boxShadow: colors.shadow,
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔥 👑</div>
        <div style={{ fontSize: 96, fontWeight: 900, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 16 }}>
          {pts + liveBonus}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', padding: '10px 24px', borderRadius: 99, fontWeight: 800, fontSize: 15, marginBottom: 28, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
          🏆 Elite Créateur · Rang #7
        </div>

        {/* 4 metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Efficacité', value: '94.2%', bg: isDark ? 'rgba(34,197,94,0.15)' : '#dcfce7', color: '#16a34a' },
            { label: 'Influence',  value: '78.5%', bg: isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe', color: '#2563eb' },
            { label: 'IA Boost',   value: '87.3%', bg: isDark ? 'rgba(124,58,237,0.15)' : '#ede9fe', color: '#7c3aed' },
            { label: 'Impact',     value: '92.1%', bg: isDark ? 'rgba(251,146,60,0.15)' : '#ffedd5', color: '#ea580c' },
          ].map(m => (
            <div key={m.label} style={{ background: m.bg, borderRadius: 14, padding: '16px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 12, color: m.color, marginTop: 4, opacity: 0.8 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* progression */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>Progression vers Légende</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: purple }}>{pts + liveBonus}/1000</span>
          </div>
          <div style={{ height: 10, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((pts + liveBonus) / 1000) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#ec4899)', borderRadius: 99, transition: 'width .8s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
            Plus que <strong style={{ color: purple }}>{1000 - pts - liveBonus} points</strong> pour devenir une <strong style={{ color: purple }}>Légende Partnexx</strong> !
          </div>
        </div>
      </div>

      {/* Analytics Live */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '24px 22px', boxShadow: colors.shadow }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          📊 Analytics Live
        </div>
        {[
          { label: 'Croissance 7j', value: '+15.8%', color: '#22c55e' },
          { label: 'Classement',    value: '#7/50k',  color: purple },
          { label: 'Prédiction IA', value: '1 150 pts', color: purple },
        ].map(m => (
          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>{m.label}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 20, background: isDark ? 'rgba(124,58,237,0.12)' : '#f5f3ff', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Mise à jour</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: purple }}>En temps réel · +{liveBonus} pts</div>
        </div>
        <button onClick={() => setTab('defis')} style={{ width: '100%', marginTop: 14, padding: '12px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
          🎯 Relever un Défi
        </button>
      </div>
    </div>
  )

  // ─── DÉFIS ─────────────────────────────────────────────────────────────────
  const renderDefi = (challenge, btnLabel = 'Relever le Défi', btnColor = '#22c55e') => (
    <div key={challenge.id} style={{ background: isDark ? colors.cardBg : (challenge.bg || '#fff'), border: `1px solid ${colors.border}`, borderRadius: 18, padding: '24px', boxShadow: colors.shadow, position: 'relative', overflow: 'hidden' }}>
      {challenge.serie && (
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 10, background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{challenge.serie}</span>
          <span style={{ fontSize: 10, background: challenge.diffColor, color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{challenge.difficulty}</span>
        </div>
      )}
      {!challenge.serie && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <span style={{ fontSize: 11, background: challenge.diffColor, color: '#fff', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{challenge.difficulty}</span>
        </div>
      )}
      <div style={{ width: 48, height: 48, borderRadius: 14, background: challenge.accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>{challenge.icon}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: colors.text, marginBottom: 6, paddingRight: 80 }}>{challenge.title}</div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16, lineHeight: 1.5 }}>{challenge.desc}</div>
      <div style={{ background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>🎁</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: purple }}>{challenge.pts} + {challenge.bonus}</span>
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
        <span>⏱️ {challenge.timer}</span>
        <span>👥 {challenge.participants} participants</span>
        {challenge.completed && <span style={{ color: '#22c55e' }}>✅ {challenge.completed} complétés</span>}
        {challenge.completed === 0 && null}
      </div>
      <button style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${challenge.accent},${challenge.accent}cc)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 16px ${challenge.accent}44` }}>
        ▶ {btnLabel}
      </button>
    </div>
  )

  const renderDefis = () => {
    const subTabs = [
      { key: 'quotidien', label: '📅 Défis Quotidiens', accent: '#22c55e' },
      { key: 'hebdo',     label: '🔥 Défis Hebdomadaires', accent: '#f97316' },
      { key: 'mensuel',   label: '👑 Défis Mensuels', accent: '#7c3aed' },
    ]
    const map = { quotidien: DAILY_CHALLENGES, hebdo: WEEKLY_CHALLENGES, mensuel: MONTHLY_CHALLENGES }
    const btnLabels = { quotidien: 'Relever le Défi', hebdo: 'Conquérir le Défi', mensuel: 'Devenir Légende' }
    const headings = {
      quotidien: { title: '🟢 Défis Quotidiens', sub: 'Rechargés chaque jour à minuit · Bonus de série disponible', color: '#22c55e' },
      hebdo:     { title: '🔥 Défis Hebdomadaires', sub: 'Défis premium · Récompenses exclusives · Série de victoires', color: '#f97316' },
      mensuel:   { title: '👑 Défis Légendaires', sub: 'Défis d\'élite · Récompenses extraordinaires · Statut permanent', color: '#7c3aed' },
    }
    const h = headings[defiSub]
    return (
      <div>
        {/* sub tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {subTabs.map(s => (
            <button key={s.key} onClick={() => setDefiSub(s.key)} style={{
              padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              background: defiSub === s.key ? s.accent : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
              color: defiSub === s.key ? '#fff' : colors.textSecondary,
              boxShadow: defiSub === s.key ? `0 4px 14px ${s.accent}55` : 'none',
              transition: 'all .2s',
            }}>{s.label}</button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: h.color }}>{h.title}</div>
          <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{h.sub}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {map[defiSub].map(c => renderDefi(c, btnLabels[defiSub]))}
        </div>
      </div>
    )
  }

  // ─── CLASSEMENT ────────────────────────────────────────────────────────────
  const renderClassement = () => (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: colors.shadow }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏆</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>Classement Global Elite</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Les légendes de Partnexx · Mis à jour en temps réel</div>
          </div>
        </div>
        {LEADERBOARD.map((entry, i) => (
          <div key={entry.rank} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
            borderBottom: i < LEADERBOARD.length - 1 ? `1px solid ${colors.border}` : 'none',
            background: entry.isMe ? (isDark ? 'rgba(124,58,237,0.12)' : '#f5f3ff') : 'transparent',
            borderLeft: entry.isMe ? `3px solid ${purple}` : '3px solid transparent',
          }}>
            <div style={{ width: 32, textAlign: 'center', fontSize: entry.rank <= 3 ? 18 : 14, fontWeight: 900, color: entry.rank === 1 ? '#f59e0b' : entry.rank === 2 ? '#9ca3af' : entry.rank === 3 ? '#b45309' : colors.textSecondary }}>
              #{entry.rank}
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{entry.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{entry.name}</span>
                {entry.isMe && <span style={{ fontSize: 11, background: purple, color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>VOUS</span>}
                {entry.badge && !entry.isMe && <span style={{ fontSize: 10, background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{entry.badge}</span>}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                <strong style={{ color: entry.isMe ? purple : colors.text }}>{entry.pts.toLocaleString()} pts</strong>
                <span style={{ color: '#22c55e', marginLeft: 8 }}>{entry.week} cette semaine</span>
              </div>
            </div>
            {entry.rank <= 3 && <span style={{ fontSize: 22 }}>{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}</span>}
          </div>
        ))}
      </div>
    </div>
  )

  // ─── SUCCÈS ────────────────────────────────────────────────────────────────
  const renderSucces = () => (
    <div>
      <div style={{ background: isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4', border: `1px solid ${isDark ? 'rgba(34,197,94,0.2)' : '#bbf7d0'}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>🎖️</span>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>Collection de Trophées</div>
          <div style={{ fontSize: 13, color: colors.textSecondary }}>🏅 Vos exploits légendaires · 4/6 débloqués</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {TROPHEES.map(t => (
          <div key={t.id} style={{
            background: t.unlocked ? (isDark ? colors.cardBg : '#fff') : (isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb'),
            border: `1px solid ${t.unlocked ? t.accent + '44' : colors.border}`,
            borderRadius: 18, padding: '28px 20px', textAlign: 'center', boxShadow: colors.shadow,
            opacity: t.unlocked ? 1 : 0.6, position: 'relative', overflow: 'hidden',
          }}>
            {t.unlocked && (
              <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 36px 36px 0', borderColor: `transparent ${t.accent} transparent transparent` }} />
            )}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.unlocked ? t.accent + '22' : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px', filter: t.unlocked ? 'none' : 'grayscale(1)' }}>
              {t.unlocked ? t.icon : '🔒'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.unlocked ? colors.text : colors.textSecondary, marginBottom: 6 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 1.4 }}>{t.desc}</div>
            <div style={{ fontSize: 10, background: t.unlocked ? t.accent + '22' : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'), color: t.unlocked ? t.accent : colors.textMuted, padding: '4px 12px', borderRadius: 20, display: 'inline-block', fontWeight: 800, letterSpacing: 1 }}>{t.rarity}</div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: t.unlocked ? '#22c55e' : colors.textMuted }}>
              {t.unlocked ? '✅ DÉBLOQUÉ' : '🔒 Verrouillé'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── IA INSIGHTS ───────────────────────────────────────────────────────────
  const renderIA = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: isDark ? 'rgba(6,182,212,0.08)' : '#ecfeff', border: `1px solid ${isDark ? 'rgba(6,182,212,0.2)' : '#a5f3fc'}`, borderRadius: 16, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>🤖</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Insights IA Avancés</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>🧠 Analyses prédictives · Optimisations personnalisées · Mise à jour continue</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { icon: '📈', title: 'Prédiction de Croissance', value: '+347 points', sub: '30 prochains jours', pct: 87, color: '#7c3aed' },
          { icon: '⏰', title: 'Optimal Posting Time', value: '14h-16h & 20h-22h', sub: 'Votre audience', pct: 94, color: '#06b6d4' },
          { icon: '💡', title: 'Contenu Suggéré', value: 'Lifestyle + Tech', sub: 'Tendance émergente', pct: 91, color: '#7c3aed' },
          { icon: '🤝', title: 'Partenariat Optimal', value: 'Fashion x Gaming', sub: 'Q1 2025', pct: 89, color: '#7c3aed' },
        ].map(insight => (
          <div key={insight.title} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '22px', boxShadow: colors.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: insight.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{insight.icon}</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{insight.title}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: insight.color, marginBottom: 4 }}>{insight.value}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 14 }}>{insight.sub}</div>
            <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: insight.pct + '%', background: `linear-gradient(90deg,${insight.color},${insight.color}99)`, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, color: insight.color, fontWeight: 700, marginTop: 6, textAlign: 'right' }}>{insight.pct}% fiable</div>
          </div>
        ))}
      </div>

      {/* recommandation */}
      <div style={{ background: isDark ? 'rgba(6,182,212,0.06)' : '#f0fdff', border: `1px solid ${isDark ? 'rgba(6,182,212,0.2)' : '#a5f3fc'}`, borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>✨</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Recommandation IA Personnalisée</span>
          </div>
          <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>Basé sur votre profil et vos performances, notre IA recommande :</div>
          {['Augmenter la fréquence de posts de 23%', "Cibler l'audience 18-25 ans le soir", 'Intégrer plus de contenu vidéo court'].map(tip => (
            <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: colors.text }}>{tip}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#7c3aed' }}>+287 pts</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 14 }}>gain prévu sur 7 jours</div>
          <button style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#06b6d4', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(6,182,212,0.4)' }}>
            ▶ Appliquer les Conseils
          </button>
        </div>
      </div>
    </div>
  )

  // ─── MARKETPLACE ───────────────────────────────────────────────────────────
  const renderMarketplace = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {MARKETPLACE_ITEMS.map(item => (
          <div key={item.id} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 18, padding: '22px', boxShadow: colors.shadow }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: item.accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{item.icon}</div>
              <span style={{ fontSize: 11, color: item.accent, fontWeight: 700, background: item.accent + '15', padding: '3px 10px', borderRadius: 20 }}>{item.popularity}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 16 }}>{item.desc}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: item.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              💎 {item.pts} points
            </div>
            {item.status === 'waitlist' && (
              <>
                <div style={{ background: isDark ? 'rgba(245,158,11,0.1)' : '#fef9c3', borderRadius: 10, padding: '10px', textAlign: 'center', fontSize: 12, color: '#a16207', fontWeight: 700, marginBottom: 8 }}>
                  👥 {item.waitlist} en liste d'attente
                </div>
                <button style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSecondary, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>⏳ Rejoindre la liste d'attente</button>
              </>
            )}
            {item.status === 'limited' && (
              <>
                <div style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', borderRadius: 10, padding: '10px', textAlign: 'center', fontSize: 12, color: '#dc2626', fontWeight: 700, marginBottom: 8 }}>
                  🔥 {item.places} places restantes
                </div>
                <button style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${item.accent},${item.accent}cc)`, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 14px ${item.accent}44` }}>
                  🛍️ Échanger maintenant
                </button>
              </>
            )}
            {item.status === 'available' && (
              <button style={{ width: '100%', padding: '11px 0', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${item.accent},${item.accent}cc)`, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 14px ${item.accent}44` }}>
                🛍️ Échanger maintenant
              </button>
            )}
          </div>
        ))}
      </div>

      {/* solde */}
      <div style={{ background: isDark ? 'rgba(124,58,237,0.08)' : '#faf5ff', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : '#e9d5ff'}`, borderRadius: 16, padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 8 }}>💎 Vos Points Disponibles</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: purple }}>595 points</div>
        <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8 }}>Gagnez plus de points en complétant des défis et en performant</div>
        <button onClick={() => setTab('defis')} style={{ marginTop: 16, padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
          🎯 Gagner plus de points
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      {renderHeader()}
      {renderTabBar()}
      {tab === 'dashboard'   && renderDashboard()}
      {tab === 'defis'       && renderDefis()}
      {tab === 'classement'  && renderClassement()}
      {tab === 'succes'      && renderSucces()}
      {tab === 'ia'          && renderIA()}
      {tab === 'marketplace' && renderMarketplace()}
    </div>
  )
}