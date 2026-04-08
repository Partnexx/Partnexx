'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep']

const FOLLOWERS_DATA = [228,235,241,248,255,262,270,278,287]
const ENGAGEMENT_DATA = [5.2,5.8,6.1,6.4,6.9,7.1,7.4,7.6,7.8]

const CONTENT_DATA = [
  { label: 'Reels',      value: 12.4, color: '#7c3aed' },
  { label: 'Carrousels', value: 8.7,  color: '#8b5cf6' },
  { label: 'Stories',    value: 6.2,  color: '#a78bfa' },
  { label: 'Posts',      value: 6.8,  color: '#7c3aed' },
  { label: 'Vidéos',     value: 15.1, color: '#6d28d9' },
]

const REVENUS_DATA     = [11200,12100,12800,13400,14200,14900,15800,16700,17900]
const PREV_REVENUS     = [10800,11500,12200,13000,13900,14700,15500,16300,17200]

const PLATFORMS = [
  { name: 'Instagram', icon: '📸', color: '#e1306c', followers: '165K', growth: '+8.2%', engagement: '7.4%', likes: '12.4K', posts: 145, score: 87, bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' },
  { name: 'TikTok',    icon: '🎵', color: '#000',    followers: '89K',  growth: '+15.6%',engagement: '12.8%',likes: '18.2K',posts: 67,  score: 92, bg: 'linear-gradient(135deg,#010101,#69c9d0)' },
  { name: 'YouTube',   icon: '▶️', color: '#ff0000', followers: '33K',  growth: '+5.1%', engagement: '4.2%', likes: '2.8K',  posts: 28,  score: 78, bg: 'linear-gradient(135deg,#ff0000,#cc0000)' },
]

// ─── SVG SPARKLINE ───────────────────────────────────────────────────────────
function Sparkline({ data, color, height = 40, width = 200 }) {
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 6) - 3
    return `${x},${y}`
  }).join(' ')
  const area = `0,${height} ${pts} ${width},${height}`
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── SVG LINE CHART ──────────────────────────────────────────────────────────
function LineChart({ datasets, labels, height = 280, isDark }) {
  const allVals = datasets.flatMap(d => d.data)
  const min = Math.floor(Math.min(...allVals) * 0.9)
  const max = Math.ceil(Math.max(...allVals) * 1.05)
  const range = max - min || 1
  const W = 700, H = height, padL = 50, padR = 20, padT = 20, padB = 30
  const cW = W - padL - padR, cH = H - padT - padB

  const toX = i => padL + (i / (labels.length - 1)) * cW
  const toY = v => padT + cH - ((v - min) / range) * cH

  const gridLines = 5
  const gridVals = Array.from({ length: gridLines + 1 }, (_, i) => min + (range / gridLines) * i)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      <defs>
        {datasets.map(d => (
          <linearGradient key={d.color} id={`lc-${d.color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={d.color} stopOpacity="0.02" />
          </linearGradient>
        ))}
      </defs>
      {/* grid */}
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={toY(v)} y2={toY(v)} stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="4,4" />
          <text x={padL - 6} y={toY(v) + 4} textAnchor="end" fontSize={10} fill={isDark ? '#6060a0' : '#9ca3af'}>
            {v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
          </text>
        </g>
      ))}
      {/* x labels */}
      {labels.map((l, i) => (
        <text key={l} x={toX(i)} y={H - 6} textAnchor="middle" fontSize={10} fill={isDark ? '#6060a0' : '#9ca3af'}>{l}</text>
      ))}
      {/* areas + lines */}
      {datasets.map(d => {
        const pts = d.data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
        const area = `${toX(0)},${toY(min)} ${pts} ${toX(d.data.length - 1)},${toY(min)}`
        return (
          <g key={d.color}>
            <polygon points={area} fill={`url(#lc-${d.color.replace('#','')})`} />
            <polyline points={pts} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )
      })}
    </svg>
  )
}

// ─── SVG BAR CHART ───────────────────────────────────────────────────────────
function BarChart({ data, isDark }) {
  const max = Math.max(...data.map(d => d.value))
  const W = 700, H = 260, padL = 40, padR = 20, padT = 20, padB = 40
  const cW = W - padL - padR, cH = H - padT - padB
  const barW = cW / data.length * 0.5
  const gap   = cW / data.length

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      {[0,0.25,0.5,0.75,1].map((f, i) => {
        const y = padT + cH - f * cH
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="4,4" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={10} fill={isDark ? '#6060a0' : '#9ca3af'}>{Math.round(f * max * 10) / 10}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const bH = (d.value / max) * cH
        const x = padL + i * gap + (gap - barW) / 2
        const y = padT + cH - bH
        return (
          <g key={d.label}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <rect x={x} y={y} width={barW} height={bH} fill={`url(#bar-${i})`} rx={6} />
            <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize={11} fill={isDark ? '#9090b0' : '#6b7280'}>{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── SCORE DONUT ─────────────────────────────────────────────────────────────
function Donut({ score, isDark }) {
  const r = 52, cx = 68, cy = 68, stroke = 10
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={136} height={136}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#donutG)" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <defs>
        <linearGradient id="donutG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={22} fontWeight={900} fill={isDark ? '#f0f0ff' : '#1a202c'}>{score}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={11} fill={isDark ? '#6060a0' : '#9ca3af'}>/ 100</text>
    </svg>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { isDark, colors } = useTheme()
  const [chartTab, setChartTab] = useState('evolution')
  const [platformView, setPlatformView] = useState('plateformes')

  const purple = '#7c3aed'
  const purpleLight = isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)'

  const KPI_CARDS = [
    { icon: '👥', label: 'Total Followers', value: '287K', growth: '+12.4%', color: '#22c55e', sparkData: FOLLOWERS_DATA, sparkColor: '#22c55e' },
    { icon: '💜', label: 'Engagement',      value: '7.8%', growth: '+0.9%',  color: '#ec4899', sparkData: ENGAGEMENT_DATA, sparkColor: '#ec4899' },
    { icon: '👁️', label: 'Vues (30j)',      value: '1.8M', growth: '+28%',   color: '#06b6d4', sparkData: [1.1,1.2,1.3,1.4,1.5,1.6,1.65,1.72,1.8], sparkColor: '#06b6d4' },
    { icon: '💶', label: 'Revenus (30j)',   value: '18,450€', growth: '+34%', color: '#f59e0b', sparkData: [11,12.5,13,14,15,16,17,17.8,18.45], sparkColor: '#f59e0b' },
  ]

  const CHART_TABS = [
    { key: 'evolution', label: 'Évolution',   icon: '📈', color: '#06b6d4' },
    { key: 'contenu',   label: 'Contenu',      icon: '📊', color: '#7c3aed' },
    { key: 'revenus',   label: 'Revenus',      icon: '💶', color: '#22c55e' },
    { key: 'plateformes',label: 'Plateformes', icon: '🌐', color: '#f97316' },
  ]

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans',sans-serif", background: colors.bg, minHeight: '100vh', color: colors.text }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: colors.text }}>Analytics</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(124,58,237,0.2)' : '#ede9fe', padding: '4px 12px', borderRadius: 20 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: purple }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: purple }}>IA actif</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 28 }}>
        Performances Détaillées · Graphiques Interactifs · Insights Avancés
      </div>

      {/* ── KPI CARDS ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {KPI_CARDS.map(k => (
          <div key={k.label} style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 20px 16px', boxShadow: colors.shadow, overflow: 'hidden', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: k.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{k.icon}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: k.color, background: k.color + '15', padding: '3px 8px', borderRadius: 20 }}>↑ {k.growth}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: colors.text, marginBottom: 12 }}>{k.value}</div>
            <Sparkline data={k.sparkData} color={k.sparkColor} width={160} height={36} />
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Score Global */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px', boxShadow: colors.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: colors.text }}>Score Global</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Donut score={86} isDark={isDark} />
              <div style={{ flex: 1 }}>
                {[
                  { label: 'Engagement', pct: 92, color: purple },
                  { label: 'Croissance',  pct: 85, color: purple },
                  { label: 'Contenu',     pct: 78, color: purple },
                ].map(m => (
                  <div key={m.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                      <span>{m.label}</span><span style={{ fontWeight: 700, color: colors.text }}>{m.pct}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: m.pct + '%', background: `linear-gradient(90deg,${m.color},#ec4899)`, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plateformes / Top Posts toggle */}
          <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px', boxShadow: colors.shadow }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['plateformes','topposts'].map(v => (
                <button key={v} onClick={() => setPlatformView(v)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: platformView === v ? purple : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                  color: platformView === v ? '#fff' : colors.textSecondary,
                  transition: 'all .2s',
                }}>
                  {v === 'plateformes' ? '⭐ Plateformes' : '🔥 Top Posts'}
                </button>
              ))}
            </div>

            {platformView === 'plateformes' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PLATFORMS.map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', border: `1px solid ${colors.border}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>{p.followers} followers</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>{p.growth}</div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>Score: {p.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { title: 'Unboxing Skincare', views: '124K', eng: '8.4%', emoji: '💄' },
                  { title: 'Morning Routine', views: '89K', eng: '6.1%', emoji: '☀️' },
                  { title: 'Tech Review S24', views: '210K', eng: '11.2%', emoji: '📱' },
                ].map((p, i) => (
                  <div key={p.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', border: `1px solid ${colors.border}` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{p.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>👁️ {p.views} · 💜 {p.eng}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: purple }}>#{i + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — CHART AREA */}
        <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 24px', boxShadow: colors.shadow }}>

          {/* chart tab bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {CHART_TABS.map(t => (
              <button key={t.key} onClick={() => setChartTab(t.key)} style={{
                padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                background: chartTab === t.key ? t.color : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                color: chartTab === t.key ? '#fff' : colors.textSecondary,
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s',
                boxShadow: chartTab === t.key ? `0 4px 14px ${t.color}55` : 'none',
              }}>{t.icon} {t.label}</button>
            ))}
          </div>

          {/* ÉVOLUTION */}
          {chartTab === 'evolution' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 16 }}>
                Évolution des Followers & Engagement
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {[{ color: '#7c3aed', label: 'Followers (K)' }, { color: '#ec4899', label: 'Engagement (%)' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 3, borderRadius: 99, background: l.color }} />
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>{l.label}</span>
                  </div>
                ))}
              </div>
              <LineChart
                datasets={[
                  { data: FOLLOWERS_DATA, color: '#7c3aed' },
                  { data: ENGAGEMENT_DATA.map(v => v * 30), color: '#ec4899' },
                ]}
                labels={MONTHS} isDark={isDark} height={280}
              />
            </div>
          )}

          {/* CONTENU */}
          {chartTab === 'contenu' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 16 }}>
                Performance par Type de Contenu
              </div>
              <BarChart data={CONTENT_DATA} isDark={isDark} />
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                {CONTENT_DATA.map(d => (
                  <div key={d.label} style={{ flex: 1, minWidth: 80, background: isDark ? 'rgba(124,58,237,0.1)' : '#f5f3ff', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: purple }}>{d.value}%</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVENUS */}
          {chartTab === 'revenus' && (
            <div>
              {/* 3 mini kpis */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Encaissé', value: '17,900€', sub: 'Sur 18,450€', color: '#22c55e', icon: '✅' },
                  { label: 'En attente', value: '550€', sub: '3 paiements', color: '#f59e0b', icon: '⏳' },
                  { label: 'Prévision mois', value: '22,100€', sub: '+19.8% vs actuel', color: '#06b6d4', icon: '📈' },
                ].map(k => (
                  <div key={k.label} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', border: `1px solid ${colors.border}`, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{k.icon}</span>
                      <span style={{ fontSize: 12, color: colors.textSecondary }}>{k.label}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 12 }}>Revenus & Paiements</div>
              <LineChart
                datasets={[
                  { data: REVENUS_DATA, color: '#22c55e' },
                  { data: PREV_REVENUS, color: '#f59e0b' },
                ]}
                labels={MONTHS} isDark={isDark} height={240}
              />
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                {[{ color: '#22c55e', label: 'Revenus réels' }, { color: '#f59e0b', label: 'Prévision IA' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 16, height: 3, borderRadius: 99, background: l.color }} />
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLATEFORMES */}
          {chartTab === 'plateformes' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 20 }}>
                Performance par Plateforme
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {PLATFORMS.map(p => (
                  <div key={p.name} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', border: `1px solid ${colors.border}`, borderRadius: 14, padding: '20px 18px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: p.color + '12', transform: 'translate(20px,-20px)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.icon}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', background: '#dcfce7', padding: '3px 10px', borderRadius: 20 }}>{p.growth}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: purple, marginBottom: 14 }}>{p.followers}</div>
                    {[
                      { label: 'Engagement', value: p.engagement },
                      { label: 'Likes moyens', value: p.likes },
                      { label: 'Posts', value: p.posts },
                    ].map(m => (
                      <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: colors.textSecondary }}>{m.label}</span>
                        <span style={{ fontWeight: 700, color: colors.text }}>{m.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: colors.textSecondary }}>Performance</span>
                        <span style={{ fontWeight: 700, color: purple }}>{p.score}/100</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: p.score + '%', background: `linear-gradient(90deg,${purple},#ec4899)`, borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}