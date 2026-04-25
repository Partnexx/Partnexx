'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAdminData } from '@/lib/hook/useAdminData'

// ─── THEME ────────────────────────────────────────────────────────────────────
const themes = {
  light: {
    bg: '#f8f9fc',
    sidebar: '#ffffff',
    card: '#ffffff',
    cardBorder: '#e8ecf0',
    text: '#0f1624',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    accent: '#3b6ef6',
    accentLight: '#eff3ff',
    sidebarActive: '#eff3ff',
    sidebarActiveText: '#3b6ef6',
    sidebarHover: '#f3f4f6',
    tableBorder: '#f0f2f5',
    inputBg: '#f3f4f6',
    inputBorder: '#e5e7eb',
    tabBorder: '#e5e7eb',
    shadow: '0 1px 3px rgba(0,0,0,0.08)',
    shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
    overlay: 'rgba(0,0,0,0.3)',
    panelBg: '#ffffff',
    panelBorder: '#e8ecf0',
    greenLight: '#f0fdf4',
    redLight: '#fff1f2',
    orangeLight: '#fff7ed',
    blueLight: '#eff6ff',
    barBg: '#e9ecef',
  },
  dark: {
    bg: '#0d1117',
    sidebar: '#161b22',
    card: '#1c2230',
    cardBorder: '#2d3748',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    textMuted: '#6e7681',
    accent: '#4f80f7',
    accentLight: '#1a2540',
    sidebarActive: '#1a2540',
    sidebarActiveText: '#4f80f7',
    sidebarHover: '#21262d',
    tableBorder: '#21262d',
    inputBg: '#21262d',
    inputBorder: '#30363d',
    tabBorder: '#30363d',
    shadow: '0 1px 3px rgba(0,0,0,0.3)',
    shadowMd: '0 4px 12px rgba(0,0,0,0.3)',
    overlay: 'rgba(0,0,0,0.6)',
    panelBg: '#1c2230',
    panelBorder: '#2d3748',
    greenLight: '#0d2818',
    redLight: '#2d1518',
    orangeLight: '#2d1f0a',
    blueLight: '#0d1f40',
    barBg: '#2d3748',
  }
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    campaign: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    payment: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    dispute: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    support: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    analytics: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    score: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    marketing: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    moderation: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    chevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    trend: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    unlock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
    warning: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    pipeline: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    headphones: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    scale: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="12" y1="3" x2="12" y2="21"/><path d="M5 21h14"/><path d="M3 6l9-3 9 3"/><path d="M3 6c0 3 2 5 4 5s4-2 4-5"/><path d="M13 6c0 3 2 5 4 5s4-2 4-5"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  }
  return icons[name] || null
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ label, color = 'gray', t }) => {
  const colors = {
    green: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
    red: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
    orange: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
    blue: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
    purple: { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' },
    yellow: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    gray: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
    teal: { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' },
  }
  // dark mode adjustments
  const darkColors = {
    green: { bg: '#052e16', text: '#4ade80', border: '#14532d' },
    red: { bg: '#2d1515', text: '#f87171', border: '#7f1d1d' },
    orange: { bg: '#2d1a08', text: '#fb923c', border: '#7c2d12' },
    blue: { bg: '#0d1f40', text: '#60a5fa', border: '#1e3a5f' },
    purple: { bg: '#1e1040', text: '#a78bfa', border: '#3b0764' },
    yellow: { bg: '#2a1f05', text: '#facc15', border: '#713f12' },
    gray: { bg: '#1f2937', text: '#d1d5db', border: '#374151' },
    teal: { bg: '#042f2e', text: '#2dd4bf', border: '#134e4a' },
  }
  const c = t === 'dark' ? (darkColors[color] || darkColors.gray) : (colors[color] || colors.gray)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap'
    }}>{label}</span>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, iconBg, theme: t }) => {
  const th = themes[t]
  return (
    <div style={{
      background: th.card, border: `1px solid ${th.cardBorder}`,
      borderRadius: 12, padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: th.shadow, flex: 1, minWidth: 0
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        {icon && (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg || th.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: th.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, color = '#3b82f6', theme: t }) => {
  const th = themes[t]
  return (
    <div style={{ background: th.barBg, borderRadius: 4, height: 6, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.3s' }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const PageDashboard = ({ theme: t, dbStats = {}, dbLoading = false }) => {
  const th = themes[t]
  const stats = [
    { label: 'Total utilisateurs', value: dbLoading ? '...' : String(dbStats.total_users || 0), sub: '↗ +124 ce mois', icon: <Icon name="users" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
    { label: 'Créateurs actifs', value: dbLoading ? '...' : String(dbStats.total_creators || 0), sub: '↗ +67 cette semaine', icon: <Icon name="score" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
    { label: 'Marques actives', value: dbLoading ? '...' : String(dbStats.total_brands || 0), sub: '↗ +8 ce mois', icon: <Icon name="globe" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
    { label: 'Campagnes', value: dbLoading ? '...' : String(dbStats.active_campaigns || 0), icon: <Icon name="campaign" size={18} color="#8b5cf6" />, iconBg: t === 'dark' ? '#1e1040' : '#ede9fe' },
    { label: 'Collaborations', value: '0', sub: '', icon: <Icon name="users" size={18} color="#06b6d4" />, iconBg: t === 'dark' ? '#042f2e' : '#ccfbf1' },
    { label: 'Volume traité', value: dbLoading ? '...' : `${((dbStats.total_volume || 0) / 1000).toFixed(0)}K €`, sub: '↗ +18% ce mois', icon: <Icon name="dollar" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
    { label: 'Revenus Partnexx', value: dbLoading ? '...' : `${((dbStats.total_revenue || 0) / 1000).toFixed(0)}K €`, sub: '↗ +22% MoM', icon: <Icon name="trend" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
    { label: 'Litiges ouverts', value: dbLoading ? '...' : String(dbStats.open_disputes || 0), icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
  ]
  const recentActivity = [
    { type: 'Nouvelle inscription', detail: 'alex@email.com · Créateur', time: '2min', color: '#3b6ef6' },
    { type: 'Campagne créée', detail: 'Summer Glow — BeautyLab', time: '8min', color: '#10b981' },
    { type: 'Paiement bloqué', detail: 'Nike France → @alexstyle', time: '15min', color: '#ef4444' },
    { type: 'Litige ouvert', detail: 'Sephora vs @foodjulie', time: '1h', color: '#f59e0b' },
    { type: 'Nouveau litige', detail: 'Décathlon vs @fake_bot_23', time: '2h', color: '#ef4444' },
    { type: 'RTC validé', detail: 'Treaty 21 — signé et livré', time: '3h', color: '#10b981' },
  ]
  const topPerformers = [
    { name: 'Nike', handle: 'nikefrance', rev: '45 200 €', score: 98 },
    { name: 'LOreal', handle: 'lorealoffi', rev: '38 100 €', score: 97 },
    { name: 'Sephora', handle: 'sephora', rev: '32 800 €', score: 95 },
    { name: 'Decathlon', handle: 'decathlon', rev: '28 500 €', score: 91 },
    { name: 'EduPlus', handle: 'eduplus', rev: '18 200 €', score: 88 },
  ]
  const alerts = [
    { text: 'Compte suspendu en attente review', color: '#ef4444' },
    { text: 'Paiement bloqué > 7j sans réponse marque', color: '#f59e0b' },
    { text: 'Fraude détectée sur profil @fake_bot_23', color: '#ef4444' },
    { text: 'Score fiabilité < 50% — Thomas Leroy', color: '#f59e0b' },
  ]

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0 }}>Dashboard</h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Bienvenue sur Partnexx Admin · Données en temps réel · Août 2025</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <Badge label="↗ 12 847 utilisateurs" color="blue" t={t} />
            <Badge label="↗ 8 campagnes actives" color="green" t={t} />
            <Badge label="⚠ 4 litiges actifs" color="orange" t={t} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.card, color: th.text, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Télécharger</button>
          <button style={{ padding: '8px 16px', borderRadius: 8, background: th.accent, color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>↗ Rapport</button>
        </div>
      </div>

      {/* Stats grid 4x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} theme={t} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Revenue chart */}
        <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text }}>Revenue & KPIs</div>
              <div style={{ fontSize: 12, color: th.textMuted }}>Évolution mensuelle</div>
            </div>
            <button style={{ fontSize: 11, color: th.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Voir tout</button>
          </div>
          <svg viewBox="0 0 520 120" style={{ width: '100%', height: 120 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,90 C40,85 80,70 130,65 C180,60 220,72 270,60 C320,48 370,55 420,42 C460,34 490,38 520,30" stroke="#10b981" strokeWidth="2.5" fill="none" />
            <path d="M0,90 C40,85 80,70 130,65 C180,60 220,72 270,60 C320,48 370,55 420,42 C460,34 490,38 520,30 L520,120 L0,120 Z" fill="url(#revGrad)" />
            {[0, 87, 174, 261, 348, 435, 520].map((x, i) => (
              <text key={i} x={x} y={116} fontSize="9" fill={th.textMuted} textAnchor="middle">{['Jan','Fev','Mar','Avr','Mai','Jun','Jui'][i]}</text>
            ))}
          </svg>
        </div>

        {/* Campagnes donut */}
        <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: th.text }}>Campagnes</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" width="90" height="90">
              <circle cx="50" cy="50" r="35" fill="none" stroke={t === 'dark' ? '#2d3748' : '#e9ecef'} strokeWidth="12" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#3b6ef6" strokeWidth="12" strokeDasharray="88 132" strokeDashoffset="-33" strokeLinecap="round" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="44 176" strokeDashoffset="-121" strokeLinecap="round" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="22 198" strokeDashoffset="-165" strokeLinecap="round" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="22 198" strokeDashoffset="-187" strokeLinecap="round" />
              <text x="50" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill={th.text}>342</text>
              <text x="50" y="57" textAnchor="middle" fontSize="7" fill={th.textMuted}>campagnes</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['En cours', '#3b6ef6', '40%'], ['Terminées', '#10b981', '20%'], ['En attente', '#f59e0b', '10%'], ['Bloquées', '#ef4444', '10%']].map(([l, c, v]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: th.textSecondary, flex: 1 }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 3 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Recent Activity */}
        <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: th.shadow }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16 }}>Activité récente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < recentActivity.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{a.type}</div>
                  <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>{a.detail}</div>
                </div>
                <div style={{ fontSize: 10, color: th.textMuted, flexShrink: 0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: th.shadow }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16 }}>Top Performances</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {topPerformers.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < topPerformers.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{p.name.slice(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: th.textMuted }}>@{p.handle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{p.rev}</div>
                  <div style={{ fontSize: 10, color: '#10b981' }}>{p.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: th.shadow }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16 }}>Alertes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: a.color === '#ef4444' ? (t === 'dark' ? '#2d1515' : '#fff1f2') : (t === 'dark' ? '#2a1f05' : '#fff7ed'), border: `1px solid ${a.color}22` }}>
                <Icon name="warning" size={14} color={a.color} />
                <span style={{ fontSize: 12, color: th.text }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: UTILISATEURS
// ═══════════════════════════════════════════════════════════════════════════════
const PageUsers = ({ theme: t, dbUsers = [], dbLoading = false, onSuspend, onActivate }) => {
  const th = themes[t]
  const users = dbUsers.length > 0 ? dbUsers.map(u => ({
    initials: (u.full_name || u.email || 'UN').slice(0, 2).toUpperCase(),
    name: u.full_name || u.email || 'Inconnu',
    email: u.email || '—',
    type: u.role === 'influencer' ? 'Créateur' : u.role === 'brand' ? 'Marque' : u.role === 'admin' ? 'Admin' : 'Créateur',
    typeColor: u.role === 'influencer' ? 'blue' : u.role === 'brand' ? 'orange' : 'gray',
    status: u.status === 'active' ? 'Actif' : u.status === 'suspended' ? 'Suspendu' : 'En Attente',
    statusColor: u.status === 'active' ? 'green' : u.status === 'suspended' ? 'red' : 'yellow',
    country: u.country || 'France',
    collabs: u.collaborations_count || 0,
    revenue: `${(u.total_revenue || 0).toLocaleString()} €`,
    reliability: u.score_confiance || null,
    score: u.score_confiance || null,
    id: u.id,
  })) : [
  // ← garde ici les 8 users statiques existants comme fallback
  ]
  const stats = [
    { label: 'Total utilisateurs', value: dbLoading ? '...' : String(dbUsers.length || 0), },
    { label: 'Créateurs', value: dbLoading ? '...' : String(dbUsers.filter(u => u.role === 'influencer').length || 0), },
    { label: 'Marques', value: dbLoading ? '...' : String(dbUsers.filter(u => u.role === 'brand').length || 0), },
    { label: 'Fiabilité moyenne', value: '83%', sub: '↗ +2% vs mois dernier', icon: <Icon name="star" size={18} color="#8b5cf6" />, iconBg: t === 'dark' ? '#1e1040' : '#ede9fe' },
  ]
  const reliabilityColor = (v) => v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="users" size={24} color={th.accent} /> Utilisateurs
          </h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Gestion et suivi des 8 utilisateurs de la plateforme</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>● 4 en ligne</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.card, color: th.text, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            <Icon name="download" size={14} color={th.text} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} theme={t} />)}
      </div>

      {/* Search & filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="search" size={16} color={th.textMuted} />
          </div>
          <input placeholder="Rechercher par nom, email..." style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}>
          <option>Tous les types</option><option>Créateur</option><option>Marque</option><option>Admin</option>
        </select>
        <select style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}>
          <option>Tous les statuts</option><option>Actif</option><option>Suspendu</option><option>En attente</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${th.tableBorder}` }}>
              {['Utilisateur', 'Type', 'Statut', 'Pays', 'Collabs', 'Revenus', 'Fiabilité', 'Score', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: th.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} style={{ borderBottom: i < users.length - 1 ? `1px solid ${th.tableBorder}` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = th.sidebarHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{u.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><Badge label={u.type} color={u.typeColor} t={t} /></td>
                <td style={{ padding: '14px 16px' }}><Badge label={u.status} color={u.statusColor} t={t} /></td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: th.textSecondary }}>🌍 {u.country}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: th.text }}>{u.collabs}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: th.text }}>{u.revenue}</td>
                <td style={{ padding: '14px 16px', minWidth: 120 }}>
                  {u.reliability !== null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={u.reliability} color={reliabilityColor(u.reliability)} theme={t} /></div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: reliabilityColor(u.reliability) }}>{u.reliability}%</span>
                    </div>
                  ) : <span style={{ color: th.textMuted, fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {u.score !== null ? (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: reliabilityColor(u.score) + '22', border: `2px solid ${reliabilityColor(u.score)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: reliabilityColor(u.score) }}>{u.score}</div>
                  ) : <span style={{ color: th.textMuted, fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '14px 16px' }}><button style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.textMuted }}><Icon name="eye" size={16} color={th.textMuted} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: CAMPAGNES
// ═══════════════════════════════════════════════════════════════════════════════
const PageCampaigns = ({ theme: t, dbCampaigns = [], dbLoading = false, onBlock, onUnblock }) => {
  const th = themes[t]
  const [tab, setTab] = useState('dashboard')

  const campaigns = dbCampaigns.length > 0 ? dbCampaigns.map(c => ({
  initials: (c.name || 'CA').slice(0, 2).toUpperCase(),
  name: c.name || 'Sans nom',
  brand: c.brand_id || '—',
  type: c.type || 'UGC',
  typeColor: c.type === 'UGC' ? 'blue' : c.type === 'Influence' ? 'green' : c.type === 'Affiliation' ? 'orange' : 'purple',
  progress: c.progress || 0,
  budget: `${(c.budget || 0).toLocaleString()} €`,
  creators: c.max_creators || 0,
  roi: c.roi ? `${c.roi}x` : '—',
  response: c.response_rate ? `${c.response_rate}%` : '0%',
  status: c.status === 'active' ? 'En Cours' : c.status === 'blocked' ? 'Bloquée' : c.status === 'completed' ? 'Terminée' : c.status === 'paused' ? 'En Pause' : 'Brouillon',
  statusColor: c.status === 'active' ? 'blue' : c.status === 'blocked' ? 'red' : c.status === 'completed' ? 'teal' : c.status === 'paused' ? 'yellow' : 'gray',
  perf: 'Moyen',
  perfColor: 'yellow',
  id: c.id,
})) : []

  const blocked = [
    { name: 'Summer Glow Collection', brand: 'BeautyLab · UGC', status: 'En Cours', statusColor: 'blue', issues: ['Livrable en retard'], issueColors: ['orange'], budget: '8 500 €', creators: 6, progress: 65 },
    { name: 'Tech Review Automne', brand: 'NovaTech · Influence', status: 'Bloquée', statusColor: 'red', issues: ['Campagne bloquée', 'Aucun contrat signé', 'Taux de réponse faible'], issueColors: ['red', 'red', 'orange'], budget: '12 000 €', creators: 3, progress: 15 },
  ]

  const progressColor = (v) => v === 100 ? '#10b981' : v >= 60 ? '#3b6ef6' : v >= 30 ? '#f59e0b' : '#ef4444'

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'analytics' },
    { id: 'campagnes', label: 'Campagnes', icon: 'campaign' },
    { id: 'pipeline', label: 'Pipeline', icon: 'pipeline' },
    { id: 'blocages', label: 'Blocages', icon: 'warning', badge: 1 },
  ]

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="campaign" size={24} color={th.accent} /> Campagnes
          </h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>6 campagnes · 71 500 € budget total</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>● 2 actives</span>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>⚠ 1 bloquée</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${th.tabBorder}` }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === tb.id ? `2px solid ${th.accent}` : '2px solid transparent',
            color: tab === tb.id ? th.accent : th.textSecondary, fontSize: 13, fontWeight: tab === tb.id ? 600 : 500, cursor: 'pointer', marginBottom: -1, position: 'relative'
          }}>
            <Icon name={tb.icon} size={15} color={tab === tb.id ? th.accent : th.textSecondary} />
            {tb.label}
            {tb.badge && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tb.badge}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Dashboard */}
      {tab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Campagnes actives', value: '2', sub: '↗ +3 cette semaine', icon: <Icon name="campaign" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
              { label: 'Budget utilisé', value: '28 500 €', sub: 'sur 71 500 €', icon: <Icon name="dollar" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
              { label: 'Créateurs impliqués', value: '18', sub: '↗ +12 ce mois', icon: <Icon name="users" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
              { label: 'ROI moyen', value: '2.9x', sub: '↗ +0.3 vs mois dernier', icon: <Icon name="trend" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Taux réponse', value: '76%', icon: <Icon name="chat" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
              { label: 'Conversion contrat', value: '60%', icon: <Icon name="check" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
              { label: 'Bloquées', value: '1', sub: '→ Action requise', icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
              { label: 'Terminées', value: '1', icon: <Icon name="check" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Top campaigns */}
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="star" size={16} color="#f59e0b" /> Meilleures campagnes
              </div>
              {[
                { num: 1, initials: 'BL', name: 'Summer Glow Collection', brand: 'BeautyLab · ROI 2.4x', perf: 'Bon', perfColor: 'green' },
                { num: 2, initials: 'FM', name: 'Fitness Challenge Printemps', brand: 'FitMax · ROI 3.8x', perf: 'Excellent', perfColor: 'green' },
                { num: 3, initials: 'GB', name: 'Foodie Stories', brand: 'GourmetBox · ROI 4.2x', perf: 'Excellent', perfColor: 'green' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? `1px solid ${th.tableBorder}` : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: th.textMuted, width: 20 }}>{c.num}</span>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{c.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: th.textMuted }}>{c.brand}</div>
                  </div>
                  <Badge label={c.perf} color={c.perfColor} t={t} />
                </div>
              ))}
            </div>

            {/* At risk */}
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="warning" size={16} color="#ef4444" /> Campagnes à risque
              </div>
              {[
                { name: 'Tech Review Automne', brand: 'NovaTech', status: 'Bloquée', statusColor: 'red' },
                { name: 'Voyage Évasion', brand: 'TravelCo', status: 'Brouillon', statusColor: 'gray' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, background: t === 'dark' ? '#2d1515' : '#fff5f5', border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}`, marginBottom: i === 0 ? 10 : 0 }}>
                  <Icon name="warning" size={16} color="#ef4444" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: th.textMuted }}>{c.brand}</div>
                  </div>
                  <Badge label={c.status} color={c.statusColor} t={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Campagnes */}
      {tab === 'campagnes' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="search" size={16} color={th.textMuted} /></div>
              <input placeholder="Rechercher une campagne ou une marque..." style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <select style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}><option>Tous statuts</option></select>
            <select style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}><option>Tous types</option></select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {campaigns.map((c, i) => (
              <div key={i} style={{ background: th.card, border: `2px solid ${progressColor(c.progress)}30`, borderRadius: 14, padding: 20, boxShadow: th.shadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{c.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{c.brand}</div>
                    </div>
                  </div>
                  <Badge label={c.type} color={c.typeColor} t={t} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: th.textMuted }}>Progression</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: th.text }}>{c.progress}%</span>
                  </div>
                  <ProgressBar value={c.progress} color={progressColor(c.progress)} theme={t} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                  {[['Budget', c.budget], ['Créateurs', c.creators], ['ROI', c.roi], ['Réponse', c.response]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{v}</div>
                      <div style={{ fontSize: 10, color: th.textMuted }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Badge label={c.status} color={c.statusColor} t={t} />
                  <Badge label={c.perf} color={c.perfColor} t={t} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pipeline */}
      {tab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: th.shadow }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="pipeline" size={16} color={th.accent} /> Vue Pipeline
            </div>
            <div style={{ fontSize: 12, color: th.textMuted, marginBottom: 20 }}>Suivi du funnel de conversion pour chaque campagne active</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {[['Contactés', 12, '#374151'], ['Répondus', 11, '#3b6ef6'], ['Acceptés', 10, '#3b6ef6'], ['Signés', 8, '#f59e0b'], ['Livrés', 7, '#10b981'], ['Payés', 4, '#10b981']].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: th.text }}>{v}</div>
                  <div style={{ fontSize: 10, color: th.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {[
            { initials: 'BL', name: 'Summer Glow Collection', brand: 'BeautyLab · UGC · 8500 €', status: 'En Cours', perf: 'Bon', bars: [6, 5, 4, 3, 2, 1], prog: '65%', roi: '2.4x', delay: '3.2j', response: '83%' },
            { initials: 'FM', name: 'Fitness Challenge Printemps', brand: 'FitMax · Influence · 12000 €', status: 'En Cours', perf: 'Excellent', bars: [12, 12, 12, 12, 12, 12], prog: '80%', roi: '3.8x', delay: '2.1j', response: '100%' },
          ].map((c, ci) => (
            <div key={ci} style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 20, boxShadow: th.shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: th.text }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: th.textMuted }}>{c.brand}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Badge label={c.status} color="blue" t={t} />
                  <Badge label={c.perf} color="green" t={t} />
                </div>
              </div>
              {[['Contactés', '#374151'], ['Répondus', '#3b6ef6'], ['Acceptés', '#3b6ef6'], ['Signés', '#f59e0b'], ['Livrés', '#10b981'], ['Payés', '#10b981']].map(([l, col], bi) => (
                <div key={l} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 20px', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: th.textMuted }}>{l}</span>
                  <ProgressBar value={c.bars[bi] / 12 * 100} color={col} theme={t} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: th.text, textAlign: 'right' }}>{c.bars[bi]}</span>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${th.tableBorder}` }}>
                {[['Progression', c.prog], ['ROI', c.roi], ['Délai moy.', c.delay], ['Réponse', c.response]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{v}</div>
                    <div style={{ fontSize: 10, color: th.textMuted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Blocages */}
      {tab === 'blocages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: t === 'dark' ? '#2d1515' : '#fff5f5', border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="warning" size={20} color="#ef4444" /></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: th.text }}>Détection de blocages</div>
                <div style={{ fontSize: 12, color: th.textSecondary }}>Campagnes bloquées ou présentant des signaux de risque nécessitant une action</div>
              </div>
            </div>
            <Badge label="⚠ 2 alertes" color="red" t={t} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {blocked.map((c, i) => (
              <div key={i} style={{ background: th.card, border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="warning" size={18} color="#ef4444" /></div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: th.textMuted }}>{c.brand}</div>
                    </div>
                  </div>
                  <Badge label={c.status} color={c.statusColor} t={t} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  {c.issues.map((issue, ii) => (
                    <div key={ii} style={{ fontSize: 13, color: c.issueColors[ii] === 'red' ? '#ef4444' : '#f59e0b', fontWeight: 500, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.issueColors[ii] === 'red' ? '#ef4444' : '#f59e0b' }} /> {issue}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                  {[['Budget', c.budget], ['Créateurs', c.creators], ['Progression', c.progress + '%']].map(([l, v]) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: th.text }}>{v}</div>
                      <div style={{ fontSize: 10, color: th.textMuted }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button style={{ padding: '10px 0', borderRadius: 8, background: t === 'dark' ? '#2d1515' : '#fff1f2', color: '#ef4444', border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name="send" size={14} color="#ef4444" /> Relancer
                  </button>
                  <button style={{ padding: '10px 0', borderRadius: 8, background: th.inputBg, color: th.text, border: `1px solid ${th.cardBorder}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name="eye" size={14} color={th.text} /> Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PAIEMENTS
// ═══════════════════════════════════════════════════════════════════════════════
const PagePayments = ({ theme: t, dbTransactions = [], dbLoading = false, onRelease }) => {
  const th = themes[t]
  const [tab, setTab] = useState('overview')
  const [selectedTx, setSelectedTx] = useState(null)

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'escrow', label: 'Escrow' },
    { id: 'reversements', label: 'Reversements' },
    { id: 'remboursements', label: 'Remboursements' },
  ]

 const transactions = dbTransactions.length > 0 ? dbTransactions.map(tx => ({
  brand: tx.brand_id || 'Marque',
  creator: tx.creator_id || '—',
  type: tx.type === 'deposit' ? 'Dépôt campagne' : tx.type === 'payout' ? 'Reversement créateur' : tx.type === 'refund' ? 'Remboursement' : tx.type,
  status: tx.status === 'pending' ? 'En attente de validation' : tx.status === 'in_escrow' ? 'Bloqué en escrow' : tx.status === 'released' ? 'Libéré' : tx.status === 'frozen' ? 'Gelé' : tx.status === 'failed' ? 'Échoué' : tx.status,
  statusColor: tx.status === 'released' ? 'green' : tx.status === 'in_escrow' ? 'yellow' : tx.status === 'frozen' ? 'purple' : tx.status === 'failed' ? 'red' : 'blue',
  risk: tx.risk_level === 'low' ? 'Faible' : tx.risk_level === 'medium' ? 'Moyen' : tx.risk_level === 'high' ? 'Élevé' : 'Critique',
  riskColor: tx.risk_level === 'low' ? 'green' : tx.risk_level === 'medium' ? 'yellow' : 'red',
  campaign: tx.campaign_id || '—',
  amount: `${(tx.amount || 0).toLocaleString()} €`,
  commission: tx.commission ? `${tx.commission.toLocaleString()} €` : '—',
  id: tx.id,
})) : []

  const txPanel = selectedTx !== null ? transactions[selectedTx] : null

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="payment" size={24} color={th.accent} /> Paiements
          </h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Centre de contrôle financier Partnexx</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 12, color: th.text }}>● 10 transactions</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.card, color: th.text, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            <Icon name="download" size={14} color={th.text} /> Exporter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${th.tabBorder}` }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            padding: '10px 18px', background: 'none', border: 'none',
            borderBottom: tab === tb.id ? `2px solid ${th.accent}` : '2px solid transparent',
            color: tab === tb.id ? th.accent : th.textSecondary, fontSize: 13, fontWeight: tab === tb.id ? 600 : 500, cursor: 'pointer', marginBottom: -1
          }}>{tb.label}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Volume total traité', value: dbLoading ? '...' : `${(dbTransactions.reduce((s,t) => s+(Number(t.amount)||0),0)/1000).toFixed(0)}K €`, sub: '↗ +18% ce mois', icon: <Icon name="dollar" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
{ label: 'En escrow', value: dbLoading ? '...' : `${dbTransactions.filter(t=>t.status==='in_escrow').reduce((s,t)=>s+(Number(t.amount)||0),0).toLocaleString()} €`, sub: '5 contrats', icon: <Icon name="lock" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
{ label: 'Libéré ce mois', value: dbLoading ? '...' : `${(dbTransactions.filter(t=>t.status==='released').reduce((s,t)=>s+(Number(t.amount)||0),0)/1000).toFixed(0)}K €`, sub: '42 transactions', icon: <Icon name="unlock" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
{ label: 'Revenus Partnexx', value: dbLoading ? '...' : `${(dbTransactions.reduce((s,t)=>s+(Number(t.commission)||0),0)/1000).toFixed(0)}K €`, sub: '↗ +22% MoM', icon: <Icon name="trend" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Reversements en attente', value: dbLoading ? '...' : `${dbTransactions.filter(t=>t.status==='pending').reduce((s,t)=>s+(Number(t.amount)||0),0).toLocaleString()} €`, sub: '3 créateurs', icon: <Icon name="refresh" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
{ label: 'Remboursements', value: dbLoading ? '...' : `${dbTransactions.filter(t=>t.status==='refunded').reduce((s,t)=>s+(Number(t.amount)||0),0).toLocaleString()} €`, sub: '1 ce mois', icon: <Icon name="refresh" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
{ label: 'Paiements échoués', value: dbLoading ? '...' : String(dbTransactions.filter(t=>t.status==='failed').length), sub: '→ Carte expirée', icon: <Icon name="x" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
{ label: 'Litiges financiers', value: '0', sub: '→ 9 500 € gelés', icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>

          {/* Cashflow */}
          <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="trend" size={16} color={th.accent} /> Prévision Cashflow
              <span style={{ fontSize: 11, color: th.textMuted }}>Projection des flux financiers à venir</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[['7 PROCHAINS JOURS', [['À LIBÉRER', '10 600 €', th.accentLight, th.accent], ['À REVERSER', '9 471 €', t === 'dark' ? '#2a1f05' : '#fef3c7', '#f59e0b'], ['IMMOBILISÉ', '9 500 €', t === 'dark' ? '#2d1515' : '#fff1f2', '#ef4444']]], ['30 PROCHAINS JOURS', [['À LIBÉRER', '42 000 €', th.accentLight, th.accent], ['À REVERSER', '38 200 €', t === 'dark' ? '#2a1f05' : '#fef3c7', '#f59e0b'], ['IMMOBILISÉ', '9 500 €', t === 'dark' ? '#2d1515' : '#fff1f2', '#ef4444']]]].map(([period, items]) => (
                <div key={period}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, marginBottom: 12 }}>{period}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {items.map(([l, v, bg, c]) => (
                      <div key={l} style={{ background: bg, borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 10, color: c, fontWeight: 600, marginBottom: 4 }}>{l}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: th.text }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      {tab === 'transactions' && (
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="search" size={16} color={th.textMuted} /></div>
                <input placeholder="Rechercher par ID, marque, créateur..." style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {['Tous types', 'Tous statuts', 'Tous risques'].map(p => (
                <select key={p} style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}><option>{p}</option></select>
              ))}
            </div>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
              {transactions.map((tx, i) => (
                <div key={i} onClick={() => setSelectedTx(selectedTx === i ? null : i)} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: i < transactions.length - 1 ? `1px solid ${th.tableBorder}` : 'none', cursor: 'pointer', background: selectedTx === i ? th.accentLight : 'transparent', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (selectedTx !== i) e.currentTarget.style.background = th.sidebarHover }}
                  onMouseLeave={e => { if (selectedTx !== i) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: th.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                    <Icon name="payment" size={14} color={th.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{tx.brand} → {tx.creator}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: th.textMuted }}>{tx.type}</span>
                      <Badge label={tx.status} color={tx.statusColor} t={t} />
                      <span style={{ fontSize: 11, color: th.textMuted }}>{tx.campaign}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{tx.amount}</div>
                    <Badge label={tx.risk} color={tx.riskColor} t={t} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side panel */}
          {txPanel && (
            <div style={{ width: 380, flexShrink: 0, background: th.panelBg, border: `1px solid ${th.panelBorder}`, borderRadius: 12, padding: 24, marginLeft: 20, boxShadow: th.shadowMd, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: th.text }}>{txPanel.type}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <Badge label={txPanel.status} color={txPanel.statusColor} t={t} />
                    <Badge label="Attente créateur" color="blue" t={t} />
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: th.text }}>{txPanel.amount}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20, padding: '14px 0', borderTop: `1px solid ${th.tableBorder}`, borderBottom: `1px solid ${th.tableBorder}` }}>
                {[['COMMISSION', txPanel.commission], ['NET CRÉATEUR', '—'], ['RISQUE', txPanel.risk], ['REVENU PARTNEXX', txPanel.commission]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: th.textMuted, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions rapides</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {[
                  ['Rembourser', 'red', 'refresh'], ['Remb. partiel', 'orange', 'refresh'],
                  ['Bloquer', 'red', 'lock'], ['Débloquer', 'green', 'unlock'],
                  ['Suspendre', 'orange', 'warning'], ['Libérer', 'green', 'check'],
                  ['Ouvrir litige', 'red', 'dispute'], ['Forcer paiement', 'blue', 'dollar'],
                ].map(([l, c, ico]) => (
                  <button key={l} style={{ padding: '10px 8px', borderRadius: 8, background: t === 'dark' ? th.inputBg : (c === 'red' ? '#fff1f2' : c === 'orange' ? '#fff7ed' : c === 'green' ? '#f0fdf4' : '#eff3ff'), color: c === 'red' ? '#ef4444' : c === 'orange' ? '#f59e0b' : c === 'green' ? '#10b981' : '#3b6ef6', border: '1px solid transparent', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name={ico} size={13} color={c === 'red' ? '#ef4444' : c === 'orange' ? '#f59e0b' : c === 'green' ? '#10b981' : '#3b6ef6'} /> {l}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Parties liées</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[['Marque', txPanel.brand], ['Créateur', txPanel.creator]].map(([l, v]) => (
                  <div key={l} style={{ background: th.inputBg, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: th.textMuted, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Paiement initié', 'Tentative carte Visa ****4521', 'Paiement réussi — ' + txPanel.amount, 'Fonds mis en escrow'].map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b6ef6', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: th.textSecondary }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Escrow */}
      {tab === 'escrow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total immobilisé', value: '20 100 €', sub: '5 contrats', icon: <Icon name="lock" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
              { label: 'Durée moyenne blocage', value: '5.8 jours', sub: '↗ +1.2j vs mois dernier', icon: <Icon name="warning" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
              { label: 'En litige / Gelé', value: '9 500 €', sub: '→ 5 contrats', icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
            {[
              { brand: 'Nike France', creator: '@alexstyle', status: 'Normal', statusColor: 'green', amount: '8 500 €', reason: 'Livrable non soumis', date: '2025-04-22', duration: '1j' },
              { brand: 'Decathlon', creator: '@travelmax', status: 'Retard', statusColor: 'orange', amount: '2 100 €', reason: 'Validation en attente', date: '2025-04-12', duration: '5j' },
              { brand: 'Nike France', creator: '@alexstyle', status: 'Critique', statusColor: 'red', amount: '3 200 €', reason: 'Litige L-0087', date: '—', duration: '8j' },
              { brand: 'Sephora', creator: '@foodjulie', status: 'Critique', statusColor: 'red', amount: '5 500 €', reason: 'Litige L-0085 — Gelé', date: '—', duration: '7j' },
            ].map((e, i) => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: i < 3 ? `1px solid ${th.tableBorder}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: e.statusColor === 'red' ? '#fee2e2' : e.statusColor === 'orange' ? '#ffedd5' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="lock" size={14} color={e.statusColor === 'red' ? '#ef4444' : e.statusColor === 'orange' ? '#f59e0b' : '#10b981'} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{e.brand} → {e.creator}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>Durée: {e.duration} · Raison: {e.reason}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Badge label={e.status} color={e.statusColor} t={t} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: th.text }}>{e.amount}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: '6px 12px', borderRadius: 6, background: t === 'dark' ? '#052e16' : '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Libérer</button>
                  <button style={{ padding: '6px 12px', borderRadius: 6, background: t === 'dark' ? '#2d1515' : '#fff1f2', color: '#ef4444', border: '1px solid #fecaca', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Escalader</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reversements */}
      {tab === 'reversements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total déboursé', value: '71 195,50 €', sub: '↗ Ce trimestre', icon: <Icon name="dollar" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
              { label: 'En attente', value: '9 471 €', sub: '3 créateurs', icon: <Icon name="warning" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
              { label: 'Bloqués', value: '5 323,50 €', sub: '→ 3 créateurs — Litige', icon: <Icon name="x" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
            {['@mariefit', 'Marie Dupont', '@alexstyle', '@foodjulie', '@travelmax', '@fake_bot_23'].map((u, i) => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: i < 5 ? `1px solid ${th.tableBorder}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{u.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{u}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>influencer@email.com</div>
                    </div>
                  </div>
                  <Badge label={i === 0 ? 'IBAN' : i === 3 ? 'Bloqué' : i === 5 ? 'Bloqué' : 'Normal'} color={i === 3 || i === 5 ? 'red' : 'green'} t={t} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 10 }}>
                  {[['Total gagné', i % 2 === 0 ? '12 400 €' : '45 800 €'], ['En attente', i === 1 ? '0 €' : '7 182 €'], ['Total versé', i % 2 === 0 ? '12 400 €' : '38 617 €'], ['IBAN', 'Vérifié']].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{v}</div>
                      <div style={{ fontSize: 10, color: th.textMuted }}>{l}</div>
                    </div>
                  ))}
                </div>
                {i > 0 && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Payer manuellement', 'Programmer', ...(i === 1 || i === 4 ? ['Bloquer'] : ['Débloquer'])].map(a => (
                      <button key={a} style={{ padding: '5px 10px', borderRadius: 6, background: a === 'Bloquer' ? '#fff1f2' : th.inputBg, color: a === 'Bloquer' ? '#ef4444' : th.text, border: `1px solid ${a === 'Bloquer' ? '#fecaca' : th.cardBorder}`, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>{a}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remboursements */}
      {tab === 'remboursements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Remboursements ce mois', value: '4 200 €', sub: '1 transaction', icon: <Icon name="refresh" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
              { label: 'En attente d\'arbitrage', value: '8 700 €', sub: '→ 2 litiges', icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
              { label: 'Taux de remboursement', value: '1.2%', sub: 'Stable', icon: <Icon name="analytics" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
            {[
              { from: 'Nike France', to: '@alexstyle', id: 'P-5427', status: 'Litigieux', statusColor: 'red', litige: 'Litige L-0087', date: '2025-04-07', amount: '3 200 €' },
              { from: 'Adidas', to: '@alexstyle', id: 'P-5421', status: 'Remboursé totalement', statusColor: 'teal', litige: 'Litige L-0082', date: '2025-03-30', amount: '4 200 €' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '18px 20px', borderBottom: i === 0 ? `1px solid ${th.tableBorder}` : 'none', borderLeft: `3px solid ${r.statusColor === 'red' ? '#ef4444' : '#10b981'}` }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: r.statusColor === 'red' ? '#fee2e2' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Icon name="refresh" size={16} color={r.statusColor === 'red' ? '#ef4444' : '#10b981'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{r.from} → {r.to} <span style={{ color: th.textMuted, fontWeight: 400, fontSize: 11 }}>{r.id}</span></div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <Badge label={r.status} color={r.statusColor} t={t} />
                    <Badge label={r.litige} color="red" t={t} />
                    <span style={{ fontSize: 11, color: th.textMuted }}>{r.date}</span>
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: th.text }}>{r.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: LITIGES
// ═══════════════════════════════════════════════════════════════════════════════
const PageLitiges = ({ theme: t, dbDisputes = [], dbLoading = false, onResolve }) => {
  const th = themes[t]
  const [tab, setTab] = useState('dashboard')
  const [selectedLitige, setSelectedLitige] = useState(null)

  const litiges = dbDisputes.length > 0 ? dbDisputes.map(d => ({
  id: d.id,
  from: d.reporter_id || 'Marque',
  to: d.reported_id || 'Créateur',
  type: d.type || 'Litige',
  typeColor: d.category === 'Intégrité' ? 'red' : d.category === 'Paiement' ? 'orange' : 'gray',
  priority: d.priority === 'high' ? 'Haute' : d.priority === 'critical' ? 'Critique' : 'Moyenne',
  priorityColor: d.priority === 'critical' ? 'red' : d.priority === 'high' ? 'orange' : 'gray',
  status: d.status === 'open' ? 'Ouvert' : d.status === 'investigating' ? 'En Analyse' : d.status === 'resolved' ? 'Résolu' : 'Clos',
  statusColor: d.status === 'open' ? 'gray' : d.status === 'investigating' ? 'blue' : d.status === 'resolved' ? 'teal' : 'teal',
  amount: d.amount ? `${d.amount.toLocaleString()} €` : '—',
  desc: d.description || '',
  age: d.created_at ? `${Math.floor((Date.now() - new Date(d.created_at)) / 86400000)}j` : '—',
  messages: 0,
  pj: 0,
})) : []

  const typeIcon = (type) => type === 'Livrable non conforme' ? '📄' : type === 'Délai dépassé' ? '⏱' : type === 'Demande de remboursement' ? '🔄' : type === 'Accusation de fraude' ? '🚨' : type === 'Non-respect contrat' ? '📋' : '📊'
  const selected = selectedLitige !== null ? litiges[selectedLitige] : null

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="scale" size={24} color={th.accent} /> Litiges & Arbitrage
          </h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>6 litiges · 4 actifs</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>⚠ 2 critiques</span>
          <span style={{ fontSize: 12, color: th.accent, fontWeight: 600 }}>● 4 en cours</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.card, color: th.text, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            <Icon name="download" size={14} color={th.text} /> Exporter
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${th.tabBorder}` }}>
        {[{ id: 'dashboard', label: 'Dashboard', icon: 'analytics' }, { id: 'litiges', label: 'Litiges', icon: 'scale' }, { id: 'urgents', label: 'Urgents', icon: 'warning', badge: 2 }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === tb.id ? `2px solid ${th.accent}` : '2px solid transparent', color: tab === tb.id ? th.accent : th.textSecondary, fontSize: 13, fontWeight: tab === tb.id ? 600 : 500, cursor: 'pointer', marginBottom: -1 }}>
            <Icon name={tb.icon} size={15} color={tab === tb.id ? th.accent : th.textSecondary} />
            {tb.label}
            {tb.badge && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tb.badge}</span>}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Litiges ouverts', value: dbLoading ? '...' : String(dbDisputes.filter(d => ['open','investigating'].includes(d.status)).length), sub: '→ À traiter', icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
{ label: 'Fonds bloqués', value: dbLoading ? '...' : `${dbDisputes.reduce((s,d) => s+(Number(d.amount)||0),0).toLocaleString()} €`, sub: 'En escrow', icon: <Icon name="lock" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
{ label: 'Temps moyen résolution', value: '—', sub: '', icon: <Icon name="refresh" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
{ label: 'Arbitrage favorable', value: '—', sub: '', icon: <Icon name="scale" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
{ label: 'Décisions rendues', value: dbLoading ? '...' : String(dbDisputes.filter(d => d.status === 'resolved').length), icon: <Icon name="check" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
{ label: 'Litiges clos', value: dbLoading ? '...' : String(dbDisputes.filter(d => d.status === 'closed').length), sub: '→ Ce mois', icon: <Icon name="check" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
{ label: 'Fraudes détectées', value: '—', icon: <Icon name="warning" size={18} color="#ef4444" />, iconBg: t === 'dark' ? '#2d1515' : '#fee2e2' },
{ label: 'Remboursements', value: '—', sub: 'Suite à litiges', icon: <Icon name="refresh" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="warning" size={16} color="#ef4444" /> Litiges récents à traiter</div>
              {litiges.slice(0, 4).map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? `1px solid ${th.tableBorder}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.priorityColor === 'red' ? '#ef4444' : '#f59e0b' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{l.from} vs {l.to}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{l.type}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{l.amount}</span>
                    <Icon name="arrow" size={14} color={th.textMuted} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="analytics" size={16} color={th.accent} /> Répartition par type</div>
              {['Livrable non conforme', 'Délai dépassé', 'Demande de remboursement', 'Accusation de fraude', 'Non-respect contrat', 'Problème de tracking'].map((type, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: th.text }}>{type}</span>
                    <span style={{ fontSize: 11, color: th.textMuted }}>1 (17%)</span>
                  </div>
                  <ProgressBar value={17} color={th.accent} theme={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Litiges list */}
      {tab === 'litiges' && (
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="search" size={16} color={th.textMuted} /></div>
                <input placeholder="Rechercher par ID, marque, créateur..." style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <select style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12 }}><option>Tous types</option></select>
              <select style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12 }}><option>Tous statuts</option></select>
            </div>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
              {litiges.map((l, i) => (
                <div key={i} onClick={() => setSelectedLitige(selectedLitige === i ? null : i)} style={{ padding: '18px 20px', borderBottom: i < litiges.length - 1 ? `1px solid ${th.tableBorder}` : 'none', cursor: 'pointer', borderLeft: `3px solid ${l.priorityColor === 'red' ? '#ef4444' : l.priorityColor === 'orange' ? '#f59e0b' : th.tabBorder}`, background: selectedLitige === i ? th.accentLight : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{typeIcon(l.type)}</span>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{l.from} vs {l.to}</span>
                        <span style={{ fontSize: 12, color: th.textMuted, marginLeft: 8 }}>{l.id}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: th.text }}>{l.amount}</span>
                  </div>
                  <div style={{ fontSize: 12, color: th.textSecondary, marginBottom: 8 }}>{l.desc}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge label={l.type} color={l.typeColor} t={t} />
                    <Badge label={l.priority} color={l.priorityColor} t={t} />
                    <Badge label={l.status} color={l.statusColor} t={t} />
                    <span style={{ fontSize: 11, color: th.textMuted }}>💬 {l.messages}</span>
                    <span style={{ fontSize: 11, color: th.textMuted }}>📎 {l.pj}</span>
                    <span style={{ fontSize: 11, color: th.textMuted, marginLeft: 'auto' }}>⏱ {l.age}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ width: 360, flexShrink: 0, background: th.panelBg, border: `1px solid ${th.panelBorder}`, borderRadius: 12, padding: 20, boxShadow: th.shadowMd, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{selected.type}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: th.textMuted }}>{selected.id}</span>
                    <Badge label={selected.priority} color={selected.priorityColor} t={t} />
                    <Badge label={selected.status} color={selected.statusColor} t={t} />
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: th.text }}>{selected.amount}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16, padding: '12px 0', borderTop: `1px solid ${th.tableBorder}`, borderBottom: `1px solid ${th.tableBorder}` }}>
                {[['Date', '2025-04-07'], ['Durée', '3j'], ['Messages', selected.messages], ['Pièces jointes', selected.pj]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{v}</div>
                    <div style={{ fontSize: 9, color: th.textMuted }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Tabs inside panel */}
              <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${th.tabBorder}`, marginBottom: 16 }}>
                {['Détails', 'Messagerie', 'Actions'].map(tb => (
                  <button key={tb} style={{ padding: '8px 12px', background: 'none', border: 'none', borderBottom: tb === 'Détails' ? `2px solid ${th.accent}` : '2px solid transparent', color: tb === 'Détails' ? th.accent : th.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: -1 }}>{tb}</button>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 8 }}>PARTIES IMPLIQUÉES</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[['Marque', selected.from], ['Créateur', selected.to]].map(([l, v]) => (
                  <div key={l} style={{ background: th.inputBg, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: th.textMuted, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 8 }}>RÉSUMÉ DU LITIGE</div>
              <div style={{ fontSize: 12, color: th.textSecondary, marginBottom: 16, lineHeight: 1.6, padding: '12px', background: th.inputBg, borderRadius: 8 }}>{selected.desc}</div>

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 10 }}>POSITIONS DES PARTIES</div>
              {['Position de la marque', 'Position du créateur'].map((pos, pi) => (
                <div key={pi} style={{ marginBottom: 10, padding: '10px 12px', borderRadius: 8, background: pi === 0 ? (t === 'dark' ? '#1a2540' : '#eff6ff') : th.inputBg, border: `1px solid ${pi === 0 ? th.accent + '44' : th.cardBorder}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: pi === 0 ? th.accent : th.textMuted, marginBottom: 4 }}>{pos}</div>
                  <div style={{ fontSize: 11, color: th.textSecondary }}>{pi === 0 ? 'La vidéo ne respecte pas le brief : durée incorrecte, absence du CTA.' : 'J\'ai livré la vidéo dans les temps. Le brief n\'était pas clair.'}</div>
                </div>
              ))}

              <div style={{ fontSize: 12, fontWeight: 600, color: th.textMuted, marginBottom: 8, marginTop: 16 }}>DÉCISION D'ARBITRAGE</div>
              <textarea placeholder="Rédiger la décision motivée..." style={{ width: '100%', height: 80, padding: '10px 12px', borderRadius: 8, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}
        </div>
      )}

      {/* Urgents */}
      {tab === 'urgents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: t === 'dark' ? '#2d1515' : '#fff5f5', border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="warning" size={20} color="#ef4444" /></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: th.text }}>Litiges urgents</div>
                <div style={{ fontSize: 12, color: th.textSecondary }}>Litiges critiques et en haute urgence nécessitant une action immédiate</div>
              </div>
            </div>
            <Badge label="⚠ 4 urgents" color="red" t={t} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {litiges.slice(0, 4).map((l, i) => (
              <div key={i} style={{ background: th.card, border: `1px solid ${l.priorityColor === 'red' ? '#fecaca' : '#fed7aa'}`, borderRadius: 12, padding: 20, boxShadow: th.shadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{l.from} vs {l.to}</div>
                    <div style={{ fontSize: 12, color: th.textMuted }}>{l.type}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: th.text }}>{l.amount}</div>
                    <Badge label={l.priority} color={l.priorityColor} t={t} />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: th.textSecondary, margin: '0 0 12px', lineHeight: 1.5 }}>{l.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                  {[[l.age, 'Ouvert'], [l.messages, 'Messages'], [l.status, '']].map(([v, label], ii) => (
                    <div key={ii}>
                      {ii === 2 ? <Badge label={v} color={l.statusColor} t={t} /> : <><div style={{ fontSize: 14, fontWeight: 700, color: th.text }}>{v}</div><div style={{ fontSize: 10, color: th.textMuted }}>{label}</div></>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button style={{ padding: '10px 0', borderRadius: 8, background: t === 'dark' ? '#2d1515' : '#fff1f2', color: '#ef4444', border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name="warning" size={13} color="#ef4444" /> Escalader
                  </button>
                  <button style={{ padding: '10px 0', borderRadius: 8, background: th.inputBg, color: th.text, border: `1px solid ${th.cardBorder}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name="eye" size={13} color={th.text} /> Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SUPPORT
// ═══════════════════════════════════════════════════════════════════════════════
const PageSupport = ({ theme: t, dbTickets = [], dbLoading = false, onClose }) => {
  const th = themes[t]
  const [tab, setTab] = useState('dashboard')
  const [selectedTicket, setSelectedTicket] = useState(null)

  const tickets = [
    { title: 'Bug affichage campagne sur mobile iOS', user: 'Jean Martin', type: 'Marque', category: 'Bug produit', sub: 'Problème mobile', priority: 'Normale', priorityColor: 'gray', status: 'En Cours', statusColor: 'blue', pj: 1, msgs: 4, date: '2025-04-13' },
    { title: 'Impossible de télécharger mon contrat PDF', user: 'Alex Moreau', type: 'Créateur', category: 'Contrats', sub: 'PDF introuvable', priority: 'Haute', priorityColor: 'orange', status: 'En Attente d\'Escalade', statusColor: 'orange', pj: 0, msgs: 2, date: '2025-04-13' },
    { title: 'Comment fonctionne le système d\'affiliation ?', user: 'Emma Petit', type: 'Créateur', category: 'Onboarding', sub: 'Première action', priority: 'Faible', priorityColor: 'gray', status: 'Résolu', statusColor: 'teal', pj: 0, msgs: 3, date: '2025-04-12' },
    { title: 'Comment annuler mon abonnement Premium ?', user: 'Thomas Leroy', type: 'Marque', category: 'Abonnements', sub: 'Désabonnement', priority: 'Normale', priorityColor: 'gray', status: 'En Cours', statusColor: 'blue', pj: 0, msgs: 7, date: '2025-04-12' },
    { title: 'Besoin d\'aide pour configurer ma première campagne', user: 'Decathlon', type: 'Marque', category: 'Onboarding', sub: 'Lancer une campagne', priority: 'Normale', priorityColor: 'gray', status: 'Escaladé', statusColor: 'red', pj: 1, msgs: 11, date: '2025-04-12' },
    { title: 'Je n\'arrive pas à réinitialiser mon mot de passe', user: 'Lucas Bernard', type: 'Créateur', category: 'Compte & accès', sub: 'Mot de passe inaccessible', priority: 'Faible', priorityColor: 'gray', status: 'Résolu', statusColor: 'teal', pj: 0, msgs: 3, date: '2025-04-11' },
    { title: 'Facture de mars introuvable dans mon espace', user: 'Pierre Duval', type: 'Marque', category: 'Facturation', sub: 'Facture manquante', priority: 'Haute', priorityColor: 'orange', status: 'En Cours', statusColor: 'blue', pj: 4, msgs: 1, date: '2025-04-11' },
    { title: 'Mon code promo ne remonte aucune vente depuis 3 jours', user: 'Chloé Lambert', type: 'Créateur', category: 'Tracking & affiliation', sub: 'Code promo non remonte', priority: 'Haute', priorityColor: 'orange', status: 'Escaladé', statusColor: 'red', pj: 1, msgs: 14, date: '2025-04-10' },
    { title: 'Ma campagne Summer 2025 est bloquée en validation depuis 48h', user: 'Nike France', type: 'Marque', category: 'Campagnes', sub: 'Blocage en validation', priority: 'Urgente', priorityColor: 'red', status: 'Urgente', statusColor: 'red', pj: 1, msgs: 2, date: '2025-04-09' },
  ]

  const conv = [
    { sender: 'Jean Martin', role: 'user', msg: 'Bonjour, depuis la dernière mise à jour, l\'affichage de mes campagnes est complètement cassé sur iPhone. Les images se superposent et le bouton voir les candidatures disparaît.', time: '13:00' },
    { sender: 'Système', role: 'system', msg: 'Ticket créé automatiquement. Catégorie : Bugs produit → Problème mobile. Assignation : No → Tech', time: '13:01' },
    { sender: 'Marc (Tech)', role: 'support', msg: 'Reproductible sur iOS 17 Safari. Le fichier du composant CampaignCard ne gère pas la safe area. Ticket PROD-1032 créé.', time: '13:05' },
    { sender: 'Support', role: 'support', msg: 'Bonjour Jean, nous avons identifié le problème — il s\'agit d\'un bug d\'affichage spécifique à Safari iOS 17. Un correctif est en cours de déploiement, il sera effectif d\'ici 24h.', time: '13:30' },
    { sender: 'Jean Martin', role: 'user', msg: 'Merci pour la réactivité. J\'ai une campagne qui démarre demain, est-ce que je peux utiliser Chrome en attendant ?', time: '14:00' },
  ]

  const selected = selectedTicket !== null ? tickets[selectedTicket] : null

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="headphones" size={24} color={th.accent} /> Centre de Support
          </h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>12 tickets · 5 actifs</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>↗ 1 escaladé</span>
          <span style={{ fontSize: 12, color: th.accent, fontWeight: 600 }}>● 1 nouveau</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.card, color: th.text, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            <Icon name="download" size={14} color={th.text} /> Exporter
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${th.tabBorder}` }}>
        {[{ id: 'dashboard', label: 'Dashboard' }, { id: 'tickets', label: 'Tickets', badge: 5 }, { id: 'historique', label: 'Historique' }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === tb.id ? `2px solid ${th.accent}` : '2px solid transparent', color: tab === tb.id ? th.accent : th.textSecondary, fontSize: 13, fontWeight: tab === tb.id ? 600 : 500, cursor: 'pointer', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6 }}>
            {tb.label}{tb.badge && <span style={{ background: th.accent, color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{tb.badge}</span>}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Tickets actifs', value: dbLoading ? '...' : String(dbTickets.filter(t => ['open','in_progress'].includes(t.status)).length), sub: '1 nouveau', icon: <Icon name="headphones" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
{ label: 'Réponse moyenne', value: '12 min', sub: '→ Temps moyen', icon: <Icon name="refresh" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
{ label: 'Résolution moyenne', value: '6h 30min', sub: '↗ -1h vs semaine', icon: <Icon name="check" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
{ label: 'Taux résolution', value: '94%', sub: '↗ +2% ce mois', icon: <Icon name="check" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
{ label: 'Résolution 1er contact', value: '68%', sub: '↗ +5% ce mois', icon: <Icon name="check" size={18} color="#10b981" />, iconBg: t === 'dark' ? '#052e16' : '#dcfce7' },
{ label: 'Escaladés', value: dbLoading ? '...' : String(dbTickets.filter(t => t.status === 'escalated').length), sub: 'En attente', icon: <Icon name="warning" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
{ label: 'Satisfaction client', value: '4.6/5', sub: '↗ +0.2 vs mois dernier', icon: <Icon name="star" size={18} color="#f59e0b" />, iconBg: t === 'dark' ? '#2a1f05' : '#fef3c7' },
{ label: 'Tickets/jour', value: dbLoading ? '...' : String(dbTickets.length), sub: 'Total', icon: <Icon name="analytics" size={18} color="#3b6ef6" />, iconBg: th.accentLight },
            ].map((s, i) => <StatCard key={i} {...s} theme={t} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="warning" size={16} color="#ef4444" /> Tickets urgents à traiter</div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: t === 'dark' ? '#2d1515' : '#fff5f5', border: `1px solid ${t === 'dark' ? '#7f1d1d' : '#fecaca'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>Ma campagne Summer 2025 est bloquée en validation depuis 48h</div>
                    <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>Nike France · Campagnes</div>
                  </div>
                  <Badge label="Urgente" color="red" t={t} />
                </div>
              </div>
            </div>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: 24, boxShadow: th.shadow }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: th.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="analytics" size={16} color={th.accent} /> Répartition par catégorie</div>
              {['Bugs produit', 'Onboarding', 'Abonnements', 'Compte & accès', 'Contrats', 'Facturation', 'Tracking & affiliation', 'Campagnes'].map((cat, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: th.text }}>{cat}</span>
                    <span style={{ fontSize: 11, color: th.textMuted }}>{i < 4 ? '2 (17%)' : '1 (8%)'}</span>
                  </div>
                  <ProgressBar value={i < 4 ? 17 : 8} color={th.accent} theme={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tickets list */}
      {tab === 'tickets' && (
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="search" size={16} color={th.textMuted} /></div>
                <input placeholder="Rechercher par ID, sujet, utilisateur..." style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {['Toutes catégories', 'Toutes', 'Tous statuts'].map(p => (
                <select key={p} style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12 }}><option>{p}</option></select>
              ))}
            </div>
            <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
              {tickets.map((tk, i) => (
                <div key={i} onClick={() => setSelectedTicket(selectedTicket === i ? null : i)} style={{ padding: '14px 20px', borderBottom: i < tickets.length - 1 ? `1px solid ${th.tableBorder}` : 'none', cursor: 'pointer', borderLeft: `3px solid ${tk.priority === 'Urgente' ? '#ef4444' : tk.priority === 'Haute' ? '#f59e0b' : 'transparent'}`, background: selectedTicket === i ? th.accentLight : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: th.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name="chat" size={13} color={th.accent} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{tk.title}</div>
                        <div style={{ fontSize: 11, color: th.textMuted }}>{tk.user} · {tk.type} · {tk.category} — {tk.sub}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{tk.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginLeft: 36 }}>
                    <Badge label={tk.priority} color={tk.priorityColor} t={t} />
                    <Badge label={tk.status} color={tk.statusColor} t={t} />
                    {tk.msgs > 0 && <span style={{ fontSize: 11, color: th.textMuted }}>💬 {tk.msgs}</span>}
                    {tk.pj > 0 && <span style={{ fontSize: 11, color: th.textMuted }}>📎 {tk.pj}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          {selected && (
            <div style={{ width: 380, flexShrink: 0, background: th.panelBg, border: `1px solid ${th.panelBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadowMd, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${th.tabBorder}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: th.text, marginBottom: 4 }}>{selected.title}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge label={selected.priority} color={selected.priorityColor} t={t} />
                  <Badge label={selected.status} color={selected.statusColor} t={t} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${th.tabBorder}` }}>
                {['Conversation', 'Contacts 360°', 'Notes', 'Actions'].map(tb => (
                  <button key={tb} style={{ padding: '8px 12px', background: 'none', border: 'none', borderBottom: tb === 'Conversation' ? `2px solid ${th.accent}` : '2px solid transparent', color: tb === 'Conversation' ? th.accent : th.textSecondary, fontSize: 11, fontWeight: 600, cursor: 'pointer', marginBottom: -1, whiteSpace: 'nowrap' }}>{tb}</button>
                ))}
              </div>

              <div style={{ flex: 1, padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 400 }}>
                {conv.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                    {m.role !== 'system' && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? th.accent : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {m.sender.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div style={{ maxWidth: '75%' }}>
                      {m.role === 'system' ? (
                        <div style={{ fontSize: 10, color: th.textMuted, padding: '6px 10px', background: th.inputBg, borderRadius: 6, lineHeight: 1.4 }}>{m.msg}</div>
                      ) : (
                        <div style={{ padding: '8px 12px', borderRadius: 10, background: m.role === 'user' ? th.accent : th.inputBg, color: m.role === 'user' ? '#fff' : th.text, fontSize: 12, lineHeight: 1.5 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, opacity: 0.7 }}>{m.sender} · {m.time}</div>
                          {m.msg}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 16px', borderTop: `1px solid ${th.tabBorder}`, display: 'flex', gap: 8 }}>
                <input placeholder="Répondre..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 12, outline: 'none' }} />
                <button style={{ width: 36, height: 36, borderRadius: 8, background: th.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="send" size={16} color="#fff" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'historique' && (() => {
        const events = [
          { color: '#ef4444', text: 'Ticket T-2001 escaladé vers NS (Tech)', sub: 'Jean Client · Aujourd\'hui 9:15' },
          { color: '#10b981', text: 'Réponse envoyée sur T-2001 – Bug iOS confirmé, ticket PROD-892 créé', sub: 'Jean Client · Aujourd\'hui 8:12' },
          { color: '#3b6ef6', text: 'Note interne ajoutée sur T-2001', sub: 'Jean Client · Hier 17:22' },
          { color: '#10b981', text: 'Nouveau ticket T-2001 – Bug affichage campagne sur mobile iOS', sub: 'Jean Martin (Marque) · Aujourd\'hui 13:42' },
          { color: '#10b981', text: 'Ticket T-2009 résolu – Code promo corrigé', sub: 'Sophie Support · Hier 16:30' },
          { color: '#3b6ef6', text: 'Macro « Demande capture d\'écran » envoyée sur T-2004', sub: 'Sophie Support · Hier 15:45' },
          { color: '#3b6ef6', text: 'Nouveau ticket T-2002 – Impossible de télécharger contrat PDF', sub: 'Alex Moreau (Créateur) · Hier 14:28' },
          { color: '#f59e0b', text: 'Ticket T-2011 fusionné avec T-2003 (même sujet)', sub: 'Jean Support · Avant-hier 9:08' },
          { color: '#6b7280', text: 'Ticket T-2006 fermé – Sans réponse utilisateur (48h)', sub: 'Système · Avr 11 22' },
          { color: '#3b6ef6', text: 'Justificatif d\'identité demandé sur T-2010', sub: 'Lena SSO · Avr 11 20' },
          { color: '#10b981', text: 'Ticket T-2005 résolu – Essai converti en abonnement Pro', sub: 'Sophie Support · Avr 11 11' },
          { color: '#3b6ef6', text: 'Ticket T-2008 transféré à équipe Facturation (NS)', sub: 'Jean Support · Avr 11 9' },
          { color: '#3b6ef6', text: 'Nouveau ticket T-2012 – Bouton «Publier» ne répond plus', sub: 'NovaDale (Créateur) · Avr 11 9' },
          { color: '#f59e0b', text: 'Priorité de T-2003 changée de Normale → Urgente', sub: 'Jean Support · Avr 11 2' },
          { color: '#10b981', text: 'Ticket T-2007 résolu – Facture régénérée et envoyée', sub: 'Jean SSO · Avr 10 20' },
          { color: '#ef4444', text: 'Compte de Lucas Bernard signalé – Engagement artificiel suspecté', sub: 'moderation (No) · Avr 11 22' },
          { color: '#6b7280', text: 'Incident produit PROD-889 créé depuis T-2004', sub: 'Jean (Tech) · Avr 10 20' },
          { color: '#10b981', text: 'Ticket T-2006 réouvert par l\'utilisateur', sub: 'NovaDale (Créateur) · Avr 10 8' },
          { color: '#f59e0b', text: 'Satisfaction client : 5/5 ⭐ reçue sur T-2009', sub: 'Sophie/Jean (Créateur) · Avr 10 7' },
          { color: '#3b6ef6', text: 'Rapport hebdomadaire support généré – 87 tickets traités', sub: 'Système · Avr 10 0' },
        ]
        return (
          <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: th.shadow }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${th.tableBorder}`, fontSize: 13, fontWeight: 600, color: th.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="analytics" size={15} color={th.accent} /> Journal d'activité support
            </div>
            {events.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 20px', borderBottom: i < events.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: th.text }}>{e.text}</div>
                  <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>{e.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}



// ─── SUPPORT: update historique tab (already in PageSupport above) ─────────────

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ANALYTICS (7 onglets)
// ═══════════════════════════════════════════════════════════════════════════════
const PageAnalytics = ({ theme: t }) => {
  const th = themes[t]
  const [tab, setTab] = useState('overview')
  const tabs = [
    {id:'overview', label:"Vue d'ensemble"},
    {id:'revenus', label:'Revenus'},
    {id:'campagnes', label:'Campagnes'},
    {id:'createurs', label:'Créateurs'},
    {id:'marques', label:'Marques'},
    {id:'engagement', label:'Engagement'},
    {id:'funnel', label:'Funnel'},
  ]

  const pColor = v => v>=80?'#10b981':v>=60?'#f59e0b':'#ef4444'

  return (
    <div style={{padding:'32px 36px',display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:700,color:th.text,margin:0,display:'flex',alignItems:'center',gap:10}}>
            <Icon name="analytics" size={24} color={th.accent}/> Analytics
          </h1>
          <p style={{color:th.textSecondary,fontSize:13,margin:'4px 0 0'}}>Centre de pilotage business Partnexx</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <select style={{padding:'8px 14px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}>
            <option>30 jours</option><option>7 jours</option><option>90 jours</option>
          </select>
          <button style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,border:`1px solid ${th.cardBorder}`,background:th.card,color:th.text,fontSize:12,fontWeight:500,cursor:'pointer'}}>
            <Icon name="download" size={14} color={th.text}/> Exporter
          </button>
        </div>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${th.tabBorder}`}}>
        {tabs.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:'10px 16px',background:'none',border:'none',borderBottom:tab===tb.id?`2px solid ${th.accent}`:'2px solid transparent',color:tab===tb.id?th.accent:th.textSecondary,fontSize:13,fontWeight:tab===tb.id?600:500,cursor:'pointer',marginBottom:-1,whiteSpace:'nowrap'}}>{tb.label}</button>
        ))}
      </div>

      {/* ── VUE D'ENSEMBLE ── */}
      {tab==='overview'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'GMV',value:'542 000 €',sub:'↗ +12.6%',icon:<Icon name="dollar" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Revenus Partnexx',value:'81 300 €',sub:'↗ +8.1%',icon:<Icon name="trend" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'MRR',value:'24 500 €',sub:'↗ +2.3%',icon:<Icon name="refresh" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Campagnes actives',value:'23',sub:'→ 4 bloquées',icon:<Icon name="campaign" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
              {label:'Contrats signés',value:'67',sub:'Ce mois',icon:<Icon name="check" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Utilisateurs actifs',value:'412',sub:'↗ +19 cette semaine',icon:<Icon name="users" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Conversion globale',value:'34%',sub:'Inscription → contrat',icon:<Icon name="filter" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Score global',value:'62',sub:'↗ Score promoteurs',icon:<Icon name="star" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Revenue & GMV</div>
              <svg viewBox="0 0 520 120" style={{width:'100%',height:120}}>
                <defs>
                  <linearGradient id="agA" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3b6ef6" stopOpacity="0.25"/><stop offset="100%" stopColor="#3b6ef6" stopOpacity="0"/></linearGradient>
                </defs>
                <path d="M0,80 C80,72 160,58 240,50 C320,42 400,46 520,36" stroke="#3b6ef6" strokeWidth="2.5" fill="none"/>
                <path d="M0,80 C80,72 160,58 240,50 C320,42 400,46 520,36 L520,120 L0,120Z" fill="url(#agA)"/>
                <path d="M0,100 C80,97 160,93 240,90 C320,87 400,89 520,86" stroke="#10b981" strokeWidth="1.5" fill="none"/>
                {['Jan','Fev','Mar','Avr','Mai','Jun','Jui','Aoû'].map((m,i)=>(
                  <text key={m} x={i*74} y={118} fontSize="9" fill={th.textMuted}>{m}</text>
                ))}
              </svg>
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Utilisateurs & sessions</div>
              <svg viewBox="0 0 200 110" style={{width:'100%',height:110}}>
                {[40,55,48,70,62,80,67,90,75,85,70,95,82,100,86,108,91,100,95,105].map((h,i)=>(
                  <rect key={i} x={i*10} y={110-h} width="8" height={h} fill={t==='dark'?'#1a2540':'#bfdbfe'} rx="2"/>
                ))}
                <path d="M0,80 C40,70 80,60 120,55 C160,50 180,52 200,46" stroke="#10b981" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Évolution mensuelle du revenu</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:10,height:120}}>
                {[65,75,80,85,82,90].map((h,i)=>(
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                    <div style={{width:'100%',height:h*1.2,background:'#3b6ef6',borderRadius:'6px 6px 0 0'}}/>
                    <span style={{fontSize:10,color:th.textMuted}}>{'Oct Nov Déc Jan Fév Mar'.split(' ')[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Types d'utilisateurs</div>
              <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
                <svg viewBox="0 0 100 100" width="90" height="90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke={t==='dark'?'#2d3748':'#e9ecef'} strokeWidth="14"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#3b6ef6" strokeWidth="14" strokeDasharray="132 88" strokeDashoffset="-33"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="44 176" strokeDashoffset="-165"/>
                  <text x="50" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill={th.text}>412</text>
                  <text x="50" y="57" textAnchor="middle" fontSize="7" fill={th.textMuted}>actifs</text>
                </svg>
              </div>
              {[['Marques','#3b6ef6','168'],['Créateurs','#10b981','244']].map(([l,c,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/><span style={{fontSize:12,color:th.textSecondary}}>{l}</span></div>
                  <span style={{fontSize:12,fontWeight:600,color:th.text}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:12}}>Top campagnes</div>
              {[['Summer Glow','BeautyLab · UGC','ROI 4.2x','+19%'],['TechPulse Q1','ByteGear · Influence','ROI 3.8x','+14%'],['StreetWear Wave','UrbanFit · Influence','ROI 3.1x','+9%'],['EcoChef Recipes','GreenCook · UGC','ROI 2.9x','+5%'],['FitLife Summer','AthletX · Influence','ROI 2.4x','+3%']].map(([n,b,roi,tr],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<4?`1px solid ${th.tableBorder}`:'none'}}>
                  <span style={{fontSize:11,fontWeight:700,color:th.textMuted,width:16}}>#{i+1}</span>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:th.text}}>{n}</div><div style={{fontSize:10,color:th.textMuted}}>{b}</div></div>
                  <div style={{textAlign:'right'}}><div style={{fontSize:12,fontWeight:600,color:th.text}}>{roi}</div><div style={{fontSize:10,color:'#10b981'}}>{tr}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:12}}>Top créateurs</div>
              {[['Emma Laurent','Beauté','8 200 €'],['Lucas Martin','Tech','6 800 €'],['Chloé Durand','Lifestyle','5 900 €'],['Maxime Bernard','Sport','4 500 €'],['Sarah Petit','Food','4 200 €']].map(([n,niche,rev],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<4?`1px solid ${th.tableBorder}`:'none'}}>
                  <span style={{fontSize:11,fontWeight:700,color:th.textMuted,width:16}}>#{i+1}</span>
                  <div style={{width:26,height:26,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff',flexShrink:0}}>{n.slice(0,2).toUpperCase()}</div>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:th.text}}>{n}</div><div style={{fontSize:10,color:th.textMuted}}>{niche}</div></div>
                  <span style={{fontSize:12,fontWeight:600,color:th.text}}>{rev}</span>
                </div>
              ))}
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:12}}>Alertes</div>
              {[['Chute conversion -18%','Taux inscription → campagne -18%','orange'],['4 campagnes bloquées','Aucune action depuis 7+ jours','red'],['Hausse remboursements','Taux à 3.2% (+1.8%)','orange'],['12 créateurs inactifs','Aucune activité 30+ jours','gray'],['Record de GMV','GMV record hier : 28 410 €','green']].map(([t2,desc,color],i)=>(
                <div key={i} style={{padding:'8px 10px',borderRadius:8,background:color==='green'?(t==='dark'?'#052e16':'#f0fdf4'):color==='red'?(t==='dark'?'#2d1515':'#fff1f2'):(t==='dark'?'#2a1f05':'#fff7ed'),marginBottom:6,borderLeft:`3px solid ${color==='green'?'#10b981':color==='red'?'#ef4444':'#f59e0b'}`}}>
                  <div style={{fontSize:11,fontWeight:600,color:th.text}}>{t2}</div>
                  <div style={{fontSize:10,color:th.textMuted,marginTop:2}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REVENUS ── */}
      {tab==='revenus'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'GMV totale',value:'542 000 €',sub:'Période sélectionnée',icon:<Icon name="dollar" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Commissions',value:'81 300 €',sub:'15% du GMV',icon:<Icon name="trend" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Revenu net',value:'68 200 €',sub:'Après remboursements',icon:<Icon name="check" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Remboursements',value:'850 €',sub:'Par campagne',icon:<Icon name="refresh" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
              {label:'Rev. UGC',value:'32 400 €',sub:'42% du total',icon:<Icon name="analytics" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Rev. Influence',value:'28 900 €',sub:'35% du total',icon:<Icon name="users" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Taux remboursement',value:'3.2%',sub:'→ Au-dessus seuil',icon:<Icon name="warning" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
              {label:'Paiements échoués',value:'1.8%',sub:'↗ Normal',icon:<Icon name="x" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Revenus & Commissions</div>
              <svg viewBox="0 0 520 120" style={{width:'100%',height:120}}>
                <path d="M0,60 C80,55 160,50 240,45 C320,40 400,42 520,38" stroke="#3b6ef6" strokeWidth="2.5" fill="none"/>
                <path d="M0,90 C80,88 160,85 240,82 C320,78 400,80 520,76" stroke="#10b981" strokeWidth="2" fill="none"/>
                <path d="M0,110 C80,108 160,109 240,107 C320,106 400,107 520,106" stroke="#ef4444" strokeWidth="1.5" fill="none"/>
                {['Jan','Fev','Mar','Avr','Mai','Jun','Jui'].map((m,i)=><text key={m} x={i*87} y={118} fontSize="9" fill={th.textMuted}>{m}</text>)}
              </svg>
              <div style={{display:'flex',gap:16,marginTop:8}}>
                {[['Revenue total','#3b6ef6'],['Commissions','#10b981'],['Remboursements','#ef4444']].map(([l,c])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/><span style={{fontSize:11,color:th.textMuted}}>{l}</span></div>
                ))}
              </div>
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:12}}>Revenu par type</div>
              <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#3b6ef6" strokeWidth="14" strokeDasharray="90 136" strokeDashoffset="-34"/>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="79 147" strokeDashoffset="-124"/>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray="44 182" strokeDashoffset="-203"/>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="13 213" strokeDashoffset="-247"/>
                </svg>
              </div>
              {[['UGC','#3b6ef6','32 400 €'],['Influence','#10b981','28 900 €'],['Affiliation','#f59e0b','12 800 €'],['Ambassadeur','#8b5cf6','7 200 €']].map(([l,c,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/><span style={{fontSize:12,color:th.textSecondary}}>{l}</span></div>
                  <span style={{fontSize:12,fontWeight:600,color:th.text}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Revenu par niche</div>
            {[['Beauté',100],['Tech',88],['Sport',65],['Food',55],['Lifestyle',50],['Mode',40],['Gaming',35]].map(([niche,pct])=>(
              <div key={niche} style={{display:'grid',gridTemplateColumns:'80px 1fr 60px',gap:12,alignItems:'center',marginBottom:10}}>
                <span style={{fontSize:12,color:th.textSecondary}}>{niche}</span>
                <ProgressBar value={pct} color="#3b6ef6" theme={t}/>
                <span style={{fontSize:12,fontWeight:600,color:th.text,textAlign:'right'}}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CAMPAGNES ── */}
      {tab==='campagnes'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Campagnes créées',value:'45',sub:'Ce mois',icon:<Icon name="campaign" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Actives',value:'23',sub:'→ 4 bloquées',icon:<Icon name="check" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Taux réussite',value:'72%',sub:'Objectif 70%',icon:<Icon name="star" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'ROI moyen',value:'3.2x',sub:'↗ +0.3 vs M-1',icon:<Icon name="trend" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Créateur → contrat',value:'34%',sub:'Taux conversion',icon:<Icon name="users" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Durée moyenne',value:'18j',sub:'Création → clôture',icon:<Icon name="refresh" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
              {label:'Bloquées',value:'4',sub:'→ Requiert action',icon:<Icon name="warning" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
              {label:'Conversion globale',value:'34%',icon:<Icon name="filter" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Funnel campagne</div>
              {[['Campagne créée',45,100,'#3b6ef6',null],['Créateurs contactés',38,84,'#3b6ef6','84%'],['Réponses',28,74,'#3b6ef6','74%'],['Acceptations',19,68,'#10b981','68% ↑6%'],['Contrats signés',15,79,'#10b981','79%'],['Livrables reçus',12,80,'#f59e0b','80%'],['Validation',11,92,'#f59e0b','92%']].map(([l,v,pct,c,conv])=>(
                <div key={l} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:12,color:th.text}}>{l}</span>
                      {conv&&<span style={{fontSize:9,padding:'1px 5px',borderRadius:4,background:conv.includes('↑')?th.accentLight:(t==='dark'?'#2d1515':'#fff1f2'),color:conv.includes('↑')?th.accent:'#ef4444',fontWeight:600}}>{conv}</span>}
                    </div>
                    <span style={{fontSize:12,fontWeight:700,color:th.text}}>{v}</span>
                  </div>
                  <ProgressBar value={pct} color={c} theme={t}/>
                </div>
              ))}
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Campagnes & contrats par jour</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:4,height:170}}>
                {Array.from({length:20}).map((_,i)=>{
                  const h1=Math.floor(40+Math.abs(Math.sin(i*0.9))*60+10)
                  const h2=Math.floor(20+Math.abs(Math.cos(i*0.7))*35+5)
                  return(
                    <div key={i} style={{flex:1,display:'flex',gap:2,alignItems:'flex-end'}}>
                      <div style={{flex:1,height:h1,background:t==='dark'?'#1a2540':'#bfdbfe',borderRadius:'3px 3px 0 0'}}/>
                      <div style={{flex:1,height:h2,background:'#10b981',borderRadius:'3px 3px 0 0'}}/>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Top campagnes par performance</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{borderBottom:`1px solid ${th.tableBorder}`}}>
                {['#','Campagne','Marque','Type','ROI','Tendance'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:11,fontWeight:600,color:th.textMuted}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[['Summer Glow','BeautyLab','UGC','4.2x','+19%'],['TechPulse Q1','ByteGear','Influence','3.8x','+14%'],['StreetWear Wave','UrbanFit','Influence','3.1x','+9%'],['EcoChef Recipes','GreenCook','UGC','2.9x','+5%'],['FitLife Summer','AthletX','Influence','2.4x','+3%']].map(([n,b,tp,roi,tr],i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${th.tableBorder}`}}>
                    <td style={{padding:'12px',fontSize:12,fontWeight:700,color:th.textMuted}}>#{i+1}</td>
                    <td style={{padding:'12px',fontSize:13,fontWeight:600,color:th.text}}>{n}</td>
                    <td style={{padding:'12px',fontSize:12,color:th.textSecondary}}>{b}</td>
                    <td style={{padding:'12px'}}><Badge label={tp} color="blue" t={t}/></td>
                    <td style={{padding:'12px',fontSize:13,fontWeight:700,color:th.text}}>{roi}</td>
                    <td style={{padding:'12px',fontSize:12,color:'#10b981',fontWeight:600}}>{tr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CRÉATEURS ── */}
      {tab==='createurs'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Créateurs actifs',value:'7',sub:'Sur la plateforme',icon:<Icon name="users" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Revenu moyen',value:'3 800 €',sub:'Par créateur',icon:<Icon name="dollar" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Taux réponse moy.',value:'70%',sub:'Aux propositions',icon:<Icon name="chat" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Inactifs',value:'3',sub:'→ 30j+ sans activité',icon:<Icon name="warning" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,overflow:'hidden',boxShadow:th.shadow}}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${th.tableBorder}`,fontSize:14,fontWeight:600,color:th.text,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              Classement créateurs
              <button style={{padding:'6px 12px',borderRadius:8,border:`1px solid ${th.cardBorder}`,background:th.inputBg,color:th.text,fontSize:12,cursor:'pointer'}}>↓ Export</button>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:th.inputBg}}>
                {['#','Créateur','Niche','Revenu','Campagnes','Réponse','Accept.','Perf.','Statut'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:11,fontWeight:600,color:th.textMuted}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[['Emma Laurent','Beauté','8 200 €',6,'95%','83%',92,true],['Lucas Martin','Tech','6 800 €',5,'88%','75%',85,true],['Chloé Durand','Lifestyle','5 900 €',4,'92%','80%',88,true],['Maxime Bernard','Sport','4 500 €',3,'70%','60%',72,true],['Sarah Petit','Food','4 200 €',4,'85%','78%',80,true],['Thomas Roux','Gaming','3 100 €',2,'65%','50%',68,true],['Julie Moreau','Mode','2 800 €',3,'90%','72%',76,true],['Antoine Leroy','Tech','1 200 €',1,'45%','30%',42,false],['Léa Simon','Beauté','800 €',1,'40%','25%',38,false],['Hugo Fontaine','Sport','500 €',0,'30%','0%',20,false]].map(([name,niche,rev,camps,rep,acc,perf,active],i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${th.tableBorder}`}}>
                    <td style={{padding:'12px 16px',fontSize:12,fontWeight:700,color:th.textMuted}}>{i+1}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>{name.slice(0,2).toUpperCase()}</div>
                        <span style={{fontSize:13,fontWeight:600,color:th.text}}>{name}</span>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px',fontSize:12,color:th.textSecondary}}>{niche}</td>
                    <td style={{padding:'12px 16px',fontSize:13,fontWeight:600,color:th.text}}>{rev}</td>
                    <td style={{padding:'12px 16px',fontSize:12,color:th.text}}>{camps}</td>
                    <td style={{padding:'12px 16px',fontSize:12,fontWeight:600,color:pColor(parseFloat(rep))}}>{rep}</td>
                    <td style={{padding:'12px 16px',fontSize:12,fontWeight:600,color:pColor(parseFloat(acc))}}>{acc}</td>
                    <td style={{padding:'12px 16px',minWidth:100}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{flex:1}}><ProgressBar value={perf} color={pColor(perf)} theme={t}/></div>
                        <span style={{fontSize:11,fontWeight:600,color:pColor(perf)}}>{perf}%</span>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px'}}><Badge label={active?'Actif':'Inactif'} color={active?'green':'gray'} t={t}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MARQUES ── */}
      {tab==='marques'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Marques actives',value:'6',sub:'Sur la plateforme',icon:<Icon name="globe" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Budget moyen',value:'20 563 €',sub:'Par marque',icon:<Icon name="dollar" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'LTV moyenne',value:'52 625 €',sub:'Lifetime value',icon:<Icon name="trend" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Churn élevé',value:'3',sub:'→ À risque',icon:<Icon name="warning" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[
              {label:'Petite',count:4,total:'38 500 €',brands:[['GreenCook','22 000 €','Faible'],['LuxeMode','8 000 €','Élevé'],['TechNova','5 000 €','Élevé'],['FreshBio','3 500 €','Élevé']]},
              {label:'Scale',count:3,total:'111 000 €',brands:[['NaturaSkin','45 000 €','Faible'],['ByteGear','38 000 €','Faible'],['UrbanFit','28 000 €','Moyen']]},
              {label:'Enterprise',count:1,total:'15 000 €',brands:[['AthleteX','15 000 €','Moyen']]},
            ].map(seg=>(
              <div key={seg.label} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{fontSize:15,fontWeight:700,color:th.text,marginBottom:2}}>{seg.label}</div>
                <div style={{fontSize:11,color:th.textMuted,marginBottom:14}}>{seg.count} marques · {seg.total}</div>
                {seg.brands.map(([name,budget,churn])=>(
                  <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:24,height:24,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff'}}>{name.slice(0,2).toUpperCase()}</div>
                      <span style={{fontSize:12,color:th.text}}>{name}</span>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:12,fontWeight:600,color:th.text}}>{budget}</span>
                      <Badge label={churn} color={churn==='Faible'?'green':churn==='Moyen'?'orange':'red'} t={t}/>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,overflow:'hidden',boxShadow:th.shadow}}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${th.tableBorder}`,display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:14,fontWeight:600,color:th.text}}>Détail marques</span>
              <button style={{fontSize:12,color:th.accent,background:'none',border:'none',cursor:'pointer',fontWeight:600}}>↓ Export</button>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:th.inputBg}}>
                {['Marque','Segment','Budget','Campagnes','Conversion','LTV','Churn','Statut'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:11,fontWeight:600,color:th.textMuted}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[['NaturaSkin','Scale','45 000 €',12,'82%','125 000 €','Faible'],['ByteGear','Scale','38 000 €',8,'75%','98 000 €','Faible'],['UrbanFit','Scale','28 000 €',6,'68%','72 000 €','Moyen'],['GreenCook','Petite','22 000 €',5,'85%','55 000 €','Faible'],['AthleteX','Enterprise','15 000 €',4,'60%','40 000 €','Moyen'],['LuxeMode','Petite','8 000 €',2,'55%','18 000 €','Élevé'],['TechNova','Petite','5 000 €',1,'40%','8 000 €','Élevé'],['FreshBio','Petite','3 500 €',1,'35%','5 000 €','Élevé']].map(([n,seg,b,c,conv,ltv,churn],i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${th.tableBorder}`}}>
                    <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:28,height:28,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>{n.slice(0,2).toUpperCase()}</div><span style={{fontSize:13,fontWeight:600,color:th.text}}>{n}</span></div></td>
                    <td style={{padding:'12px 16px',fontSize:12,color:th.textSecondary}}>{seg}</td>
                    <td style={{padding:'12px 16px',fontSize:13,fontWeight:600,color:th.text}}>{b}</td>
                    <td style={{padding:'12px 16px',fontSize:12,color:th.text}}>{c}</td>
                    <td style={{padding:'12px 16px',fontSize:12,fontWeight:600,color:parseFloat(conv)>=70?'#10b981':parseFloat(conv)>=55?'#f59e0b':'#ef4444'}}>{conv}</td>
                    <td style={{padding:'12px 16px',fontSize:13,fontWeight:600,color:th.text}}>{ltv}</td>
                    <td style={{padding:'12px 16px'}}><Badge label={churn} color={churn==='Faible'?'green':churn==='Moyen'?'orange':'red'} t={t}/></td>
                    <td style={{padding:'12px 16px'}}><Badge label="Actif" color="green" t={t}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ENGAGEMENT ── */}
      {tab==='engagement'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Utilisateurs actifs',value:'182',sub:'Utilisateurs',icon:<Icon name="users" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Temps moyen session',value:'8.4 min',sub:'Par session',icon:<Icon name="refresh" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Actions totales',value:'1 287',sub:'Clics platform actifs',icon:<Icon name="trend" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Completions',value:'361',sub:'Campagnes complètes',icon:<Icon name="check" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>DAU/WAU/MAU (par type d'action)</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:6,height:100}}>
                {[50,65,55,70,60,75,65].map((h,i)=>(
                  <div key={i} style={{flex:1,display:'flex',gap:2,alignItems:'flex-end'}}>
                    <div style={{flex:1,height:h,background:t==='dark'?'#1a2540':'#bfdbfe',borderRadius:'3px 3px 0 0'}}/>
                    <div style={{flex:1,height:Math.round(h*0.6),background:'#f59e0b',borderRadius:'3px 3px 0 0'}}/>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Garde de session & actions</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:4,height:100}}>
                {[60,75,80,85,70,90,75,95,80,85,70,90].map((h,i)=>(
                  <div key={i} style={{flex:1,height:h,background:'#10b981',borderRadius:'3px 3px 0 0'}}/>
                ))}
              </div>
              <svg viewBox="0 0 280 30" style={{width:'100%',marginTop:4}}>
                <path d="M0,20 C40,18 80,15 120,13 C160,11 200,16 240,10 L280,8" stroke="#3b6ef6" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Acquisition par canaux</div>
            {[['Messagerie',100,'780','44%'],['Campagnes analytics',78,'609','34%'],['Contrats',55,'429','24%'],['Affiliation tracking',40,'312','17%'],['Support reporting',20,'156','9%'],['Jeu',15,'117','6%']].map(([l,pct,v,rate])=>(
              <div key={l} style={{display:'grid',gridTemplateColumns:'160px 1fr 60px 60px',gap:12,alignItems:'center',marginBottom:10}}>
                <span style={{fontSize:12,color:th.textSecondary}}>{l}</span>
                <ProgressBar value={pct} color={pct>60?'#10b981':'#3b6ef6'} theme={t}/>
                <span style={{fontSize:12,fontWeight:600,color:th.text,textAlign:'right'}}>{v}</span>
                <span style={{fontSize:11,color:th.textMuted,textAlign:'right'}}>{rate}</span>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Répartition géographique</div>
              {[['🇫🇷 France','23 861 €','44%'],['🇧🇪 Belgique','4 302 €','8%'],['🇨🇭 Suisse','3 782 €','7%'],['🇨🇦 Canada','2 791 €','5%'],['🇲🇦 Maroc','1 642 €','3%'],['🇨🇮 Côte d\'Ivoire','1 384 €','3%']].map(([country,rev,pct])=>(
                <div key={country} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                  <span style={{fontSize:12,color:th.text}}>{country}</span>
                  <div style={{display:'flex',gap:12}}><span style={{fontSize:12,fontWeight:600,color:th.text}}>{rev}</span><span style={{fontSize:12,color:th.textMuted}}>{pct}</span></div>
                </div>
              ))}
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Rétention par cohorte</div>
              <div style={{overflowX:'auto'}}>
                <table style={{borderCollapse:'collapse',fontSize:11,width:'100%'}}>
                  <thead><tr>
                    {['Cohorte','Taille','M+1','M+2','M+3','M+4','M+5'].map(h=><th key={h} style={{padding:'6px 8px',color:th.textMuted,fontWeight:600,textAlign:'left'}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[['Jan 2024','146','100%','74%','68%','62%','58%'],['Avr 2024','88','100%','70%','65%','59%','—'],['Jui 2024','104','100%','73%','68%','—','—'],['Oct 2024','75','100%','75%','—','—','—']].map((row,ri)=>(
                      <tr key={ri}>
                        {row.map((cell,ci)=>(
                          <td key={ci} style={{padding:'6px 8px',background:ci>1&&cell!=='—'?`rgba(59,110,246,${(parseFloat(cell)/100)*0.4})`:'transparent',color:ci>1&&cell!=='—'?th.accent:th.text,fontWeight:ci>1?600:400,borderRadius:4}}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:16}}>
                <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:12}}>Santé de la plateforme</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                  {[['Uptime','99.97%','green'],['Latence API','142ms','green'],['Taux erreur','0.3%','green'],['Chargement lent','4.8%','orange']].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:'center',padding:'10px',background:th.inputBg,borderRadius:8}}>
                      <div style={{fontSize:16,fontWeight:700,color:c==='green'?'#10b981':'#f59e0b'}}>{v}</div>
                      <div style={{fontSize:10,color:th.textMuted,marginTop:2}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FUNNEL ── */}
      {tab==='funnel'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:4}}>Funnel complet — Visite → Rétention</div>
              <div style={{marginBottom:16}}>
                {[['Visite site',12400,100,'#3b6ef6',null],['Inscription',1860,15,'#3b6ef6','-40%moy'],['Onboarding',1302,70,'#3b6ef6','70%'],['Création campagne',680,52,'#10b981','+16%moy'],['Contact créateurs',510,75,'#10b981','75%moy'],['Contrat signé',245,48,'#f59e0b','-52%moy'],['Paiement',215,88,'#f59e0b','38%moy'],['Livraison',185,86,'#ef4444','25%moy'],['Rétention',142,77,'#8b5cf6','13%moy']].map(([l,v,pct,c,badge])=>(
                  <div key={l} style={{marginBottom:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:12,color:th.text}}>{l}</span>
                        {badge&&<span style={{fontSize:9,padding:'1px 5px',borderRadius:4,background:badge.includes('-')?(t==='dark'?'#2d1515':'#fff1f2'):th.accentLight,color:badge.includes('-')?'#ef4444':th.accent,fontWeight:600}}>{badge}</span>}
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:th.text}}>{v.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={pct} color={c} theme={t}/>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Funnel campagne — Création → Validation</div>
              {[['Campagne créée',45,100,'#3b6ef6'],['Créateurs contactés',38,84,'#3b6ef6'],['Réponses',28,74,'#3b6ef6'],['Acceptations',19,68,'#10b981'],['Contrats signés',15,79,'#10b981'],['Livrables reçus',12,80,'#f59e0b'],['Validation',11,92,'#f59e0b']].map(([l,v,pct,c])=>(
                <div key={l} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,color:th.text}}>{l}</span><span style={{fontSize:12,fontWeight:700,color:th.text}}>{v}</span></div>
                  <ProgressBar value={pct} color={c} theme={t}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={16} color="#f59e0b"/> Points de friction détectés</div>
            {[['Visite site → Inscription','10 540 utilisateurs perdus · Taux de drop : 85%','85%'],['Inscription → Onboarding','558 utilisateurs perdus · Taux de drop : 30%','30%'],['Onboarding → Création campagne','622 utilisateurs perdus · Taux de drop : 48%','48%'],['Création campagne → Contact créateurs','170 utilisateurs perdus · Taux de drop : 25%','25%'],['Contact créateurs → Contrat signé','265 utilisateurs perdus · Taux de drop : 52%','52%']].map(([step,desc,pct])=>(
              <div key={step} style={{display:'flex',alignItems:'center',gap:16,padding:'12px 16px',borderRadius:10,background:t==='dark'?'#2a1f05':'#fffbeb',border:`1px solid ${t==='dark'?'#713f12':'#fed7aa'}`,marginBottom:8}}>
                <Icon name="warning" size={16} color="#f59e0b"/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:th.text}}>{step}</div><div style={{fontSize:11,color:th.textMuted}}>{desc}</div></div>
                <span style={{fontSize:14,fontWeight:700,color:'#ef4444'}}>{pct}</span>
              </div>
            ))}
          </div>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Temps moyen entre étapes</div>
            <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:0,rowGap:8}}>
              {['Inscription','Onboarding','Campagne','Contact','Contrat','Paiement','Livraison','Validation'].map((step,i,arr)=>(
                <div key={step} style={{display:'flex',alignItems:'center'}}>
                  <div style={{padding:'8px 12px',borderRadius:8,background:th.accentLight,border:`1px solid ${th.cardBorder}`,fontSize:11,fontWeight:600,color:th.accent,whiteSpace:'nowrap'}}>{step}</div>
                  {i<arr.length-1&&(
                    <div style={{display:'flex',alignItems:'center',gap:4,padding:'0 6px'}}>
                      <div style={{height:1,width:14,background:th.cardBorder}}/>
                      <span style={{fontSize:10,color:th.textMuted}}>{'2j 3j 1j 5j 2j 7j 1j'.split(' ')[i]}</span>
                      <div style={{height:1,width:14,background:th.cardBorder}}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PARTNEXX SCORE
// ═══════════════════════════════════════════════════════════════════════════════
const PageScore = ({ theme: t }) => {
  const th = themes[t]
  const [subPage, setSubPage] = useState('global')
  const sc = v => v>=80?'#10b981':v>=60?'#f59e0b':'#ef4444'

  return (
    <div style={{padding:'32px 36px',display:'flex',flexDirection:'column',gap:0}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:26,fontWeight:700,color:th.text,margin:0,display:'flex',alignItems:'center',gap:10}}>
          <Icon name="score" size={24} color={th.accent}/> Partnexx Score
        </h1>
        <p style={{color:th.textSecondary,fontSize:13,margin:'4px 0 0'}}>Réputation, gamification et performance de la plateforme</p>
      </div>
      <div style={{display:'flex',gap:24}}>
        {/* Sub-nav */}
        <div style={{width:180,flexShrink:0}}>
          {[['global','Vue globale','analytics'],['classement','Classement','score'],['detail','Détail score','star'],['defis','Défis & Récompenses','campaign'],['admin','Administration','settings']].map(([id,label,icon])=>(
            <button key={id} onClick={()=>setSubPage(id)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:8,background:subPage===id?th.sidebarActive:'transparent',color:subPage===id?th.sidebarActiveText:th.textSecondary,fontSize:13,fontWeight:subPage===id?600:500,border:'none',cursor:'pointer',marginBottom:2,textAlign:'left'}}>
              <Icon name={icon} size={15} color={subPage===id?th.sidebarActiveText:th.textSecondary}/>{label}
            </button>
          ))}
        </div>
        <div style={{flex:1,minWidth:0}}>

          {/* VUE GLOBALE */}
          {subPage==='global'&&(
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                <div style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:24,alignItems:'center'}}>
                  <div style={{display:'flex',justifyContent:'center'}}>
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke={t==='dark'?'#2d3748':'#e9ecef'} strokeWidth="10"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray={`${74/100*314} 314`} strokeDashoffset="78.5" strokeLinecap="round"/>
                      <text x="60" y="55" textAnchor="middle" fontSize="28" fontWeight="800" fill={th.text}>74</text>
                      <text x="60" y="70" textAnchor="middle" fontSize="11" fill={th.textMuted}>/100</text>
                    </svg>
                  </div>
                  <div>
                    <div style={{fontSize:18,fontWeight:700,color:th.text,marginBottom:4}}>Score moyen plateforme</div>
                    <div style={{fontSize:13,color:th.textMuted,marginBottom:16}}>Basé sur 1247 profils évalués</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                      {[['Créateurs','76','↗ +2 ce mois'],['Excellents','32%','score ≥ 80'],['À risque','8%','score < 50']].map(([l,v,sub])=>(
                        <div key={l} style={{padding:'12px',background:th.inputBg,borderRadius:10}}>
                          <div style={{fontSize:10,color:th.textMuted,marginBottom:4}}>{l}</div>
                          <div style={{fontSize:20,fontWeight:700,color:th.text}}>{v}</div>
                          <div style={{fontSize:10,color:'#10b981'}}>{sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
                {[['XP distribués','184.5k','#3b6ef6'],['Défis complétés','3 847','#f59e0b'],['Récompenses actives','8','#10b981'],['Anomalies','3','#ef4444']].map(([l,v,c])=>(
                  <div key={l} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:'16px 20px',boxShadow:th.shadow,borderTop:`3px solid ${c}`}}>
                    <div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div>
                    <div style={{fontSize:12,color:th.textMuted,marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
                <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                  <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Évolution du score moyen</div>
                  <svg viewBox="0 0 400 100" style={{width:'100%',height:100}}>
                    <defs><linearGradient id="sG" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3b6ef6" stopOpacity="0.2"/><stop offset="100%" stopColor="#3b6ef6" stopOpacity="0"/></linearGradient></defs>
                    <path d="M0,70 C60,68 120,65 180,62 C240,59 300,56 360,52 C380,50 390,48 400,47" stroke="#3b6ef6" strokeWidth="2" fill="none"/>
                    <path d="M0,70 C60,68 120,65 180,62 C240,59 300,56 360,52 C380,50 390,48 400,47 L400,100 L0,100Z" fill="url(#sG)"/>
                    {['Jan','Fev','Mar','Avr','Mai','Jun'].map((m,i)=><text key={m} x={i*80} y={96} fontSize="9" fill={th.textMuted}>{m}</text>)}
                    <text x="0" y="72" fontSize="9" fill={th.textMuted}>67</text>
                    <text x="0" y="54" fontSize="9" fill={th.textMuted}>74</text>
                    <text x="0" y="36" fontSize="9" fill={th.textMuted}>85</text>
                  </svg>
                  <div style={{textAlign:'center',marginTop:4}}>
                    <span style={{fontSize:12,color:th.accent,fontWeight:600,cursor:'pointer'}}>→ Plateforme</span>
                  </div>
                </div>
                <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                  <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Niveaux</div>
                  <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
                    <svg viewBox="0 0 100 100" width="90" height="90">
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="88 132" strokeDashoffset="-33"/>
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeDasharray="55 165" strokeDashoffset="-121"/>
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#94a3b8" strokeWidth="12" strokeDasharray="77 143" strokeDashoffset="-176"/>
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#b45309" strokeWidth="12" strokeDasharray="66 154" strokeDashoffset="-253"/>
                    </svg>
                  </div>
                  {[['Diamond','#60a5fa',45],['Platinum','#e2e8f0',120],['Gold','#f59e0b',340],['Silver','#94a3b8',480],['Bronze','#b45309',262]].map(([l,c,v])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/><span style={{fontSize:11,color:th.textSecondary}}>{l}</span></div>
                      <span style={{fontSize:11,fontWeight:600,color:th.text}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                  <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Distribution des scores</div>
                  <div style={{display:'flex',alignItems:'flex-end',gap:8,height:120}}>
                    {[['90-100',80,'#10b981'],['80-89',200,'#3b6ef6'],['70-79',320,'#3b6ef6'],['60-69',260,'#f59e0b'],['50-59',200,'#f59e0b'],['<50',120,'#ef4444']].map(([label,h,c])=>(
                      <div key={label} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                        <div style={{width:'100%',height:Math.round(h*0.37),background:c,borderRadius:'4px 4px 0 0'}}/>
                        <span style={{fontSize:9,color:th.textMuted,textAlign:'center'}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                    <span style={{fontSize:14,fontWeight:600,color:th.text}}>Top Performers</span>
                    <button style={{fontSize:12,color:th.accent,background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Voir tout →</button>
                  </div>
                  {[['Leo Studio','🏆',94,'+4'],['Emma_Create','🏆',89,'+5'],['Marie.Beauty','🏆',85,'-2'],['Tom_Travel','🥇',81,'+1'],['Julie_Cook','🥇',78,'-1']].map(([name,medal,score,trend],i)=>(
                    <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<4?`1px solid ${th.tableBorder}`:'none'}}>
                      <span style={{fontSize:16}}>{medal}</span>
                      <div style={{width:28,height:28,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>{name.slice(0,2).toUpperCase()}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:th.text}}>{name}</div></div>
                      <div style={{position:'relative',width:36,height:36}}>
                        <svg viewBox="0 0 36 36" width="36" height="36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke={t==='dark'?'#2d3748':'#e9ecef'} strokeWidth="3"/>
                          <circle cx="18" cy="18" r="14" fill="none" stroke={sc(score)} strokeWidth="3" strokeDasharray={`${score/100*88} 88`} strokeDashoffset="22" strokeLinecap="round"/>
                          <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill={th.text}>{score}</text>
                        </svg>
                      </div>
                      <span style={{fontSize:11,color:trend.includes('+')?'#10b981':'#ef4444',fontWeight:600}}>{trend}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CLASSEMENT */}
          {subPage==='classement'&&(
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}><Icon name="search" size={16} color={th.textMuted}/></div>
                <input placeholder="Rechercher..." style={{width:'100%',padding:'10px 12px 10px 38px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                {[['Emma_Create',89,'Platinum',2,'32 100 €',18],['Leo.Studio',94,'Platinum',1,'45 200 €',23],['Marie.Beauty',85,'Gold',3,'28 600 €',15]].map(([name,score,level,rank,rev,camps])=>(
                  <div key={name} style={{background:th.card,border:`2px solid ${rank===1?'#f59e0b':th.cardBorder}`,borderRadius:14,padding:20,textAlign:'center',boxShadow:rank===1?`0 4px 20px rgba(245,158,11,0.15)`:th.shadow,position:'relative'}}>
                    <div style={{position:'absolute',top:12,right:12,fontSize:20}}>{rank===1?'🏆':rank===2?'🥈':'🥉'}</div>
                    <div style={{width:48,height:48,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',margin:'0 auto 8px'}}>{name.slice(0,2).toUpperCase()}</div>
                    <div style={{fontSize:14,fontWeight:700,color:th.text}}>{name}</div>
                    <div style={{fontSize:11,color:'#f59e0b',fontWeight:600,marginBottom:8}}>🥇 {level}</div>
                    <div style={{position:'relative',width:70,height:70,margin:'0 auto 8px'}}>
                      <svg viewBox="0 0 70 70" width="70" height="70">
                        <circle cx="35" cy="35" r="28" fill="none" stroke={t==='dark'?'#2d3748':'#e9ecef'} strokeWidth="5"/>
                        <circle cx="35" cy="35" r="28" fill="none" stroke={sc(score)} strokeWidth="5" strokeDasharray={`${score/100*176} 176`} strokeDashoffset="44" strokeLinecap="round"/>
                        <text x="35" y="32" textAnchor="middle" fontSize="16" fontWeight="800" fill={th.text}>{score}</text>
                        <text x="35" y="44" textAnchor="middle" fontSize="9" fill={th.textMuted}>/100</text>
                      </svg>
                    </div>
                    <div style={{fontSize:12,color:th.textSecondary}}>{rev} · {camps} camps.</div>
                  </div>
                ))}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,overflow:'hidden',boxShadow:th.shadow}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr style={{background:th.inputBg}}>
                    {['#','Créateur','Score','Niveau','Perf.','Fiab.','Réact.','Streak','Revenu','Trend','Badge','Action'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:11,fontWeight:600,color:th.textMuted}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[['🏆','Leo.Studio',94,'Platinum',96,92,90,'14j','45 200€','+3','Top Performer','green'],['🏆','Emma_Create',89,'Platinum',91,88,85,'6j','32 100€','+5','Excellent','green'],['🏆','Marie.Beauty',85,'Gold',88,82,80,'6j','28 600€','-2','Excellent','green'],['4','Tom_Travel',81,'Gold',84,79,78,'5j','22 300€','+1','Excellent','green'],['5','Julie_Cook',78,'Silver',80,76,75,'—','18 900€','-1','À surveiller','yellow'],['6','Alex_Fit',65,'Silver',70,60,62,'—','12 400€','-8','À surveiller','yellow'],['7','Sam_Music',52,'Bronze',55,48,50,'—','5 200€','-12','Risque','red']].map(([medal,name,score,level,perf,fiab,react,streak,rev,trend,badge,bc],i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${th.tableBorder}`}}>
                        <td style={{padding:'12px',fontSize:14}}>{medal}</td>
                        <td style={{padding:'12px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:28,height:28,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>{name.slice(0,2).toUpperCase()}</div><span style={{fontSize:12,fontWeight:600,color:th.text}}>{name}</span></div></td>
                        <td style={{padding:'12px',fontSize:14,fontWeight:700,color:sc(score)}}>{score}</td>
                        <td style={{padding:'12px',fontSize:12,color:th.text}}>🥇 {level}</td>
                        <td style={{padding:'12px',fontSize:12,color:th.text}}>{perf}</td>
                        <td style={{padding:'12px',fontSize:12,color:th.text}}>{fiab}</td>
                        <td style={{padding:'12px',fontSize:12,color:th.text}}>{react}</td>
                        <td style={{padding:'12px',fontSize:12,color:th.textMuted}}>🔥 {streak}</td>
                        <td style={{padding:'12px',fontSize:12,fontWeight:600,color:th.text}}>{rev}</td>
                        <td style={{padding:'12px',fontSize:12,fontWeight:600,color:trend.includes('+')?'#10b981':'#ef4444'}}>{trend}</td>
                        <td style={{padding:'12px'}}><Badge label={badge} color={bc} t={t}/></td>
                        <td style={{padding:'12px'}}><button style={{fontSize:11,color:th.accent,background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Détail</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DÉTAIL SCORE */}
          {subPage==='detail'&&(
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:60,textAlign:'center',boxShadow:th.shadow}}>
              <div style={{width:80,height:80,borderRadius:'50%',background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><Icon name="score" size={36} color={th.accent}/></div>
              <div style={{fontSize:18,fontWeight:700,color:th.text,marginBottom:8}}>Sélectionne un profil</div>
              <div style={{fontSize:13,color:th.textSecondary,marginBottom:20}}>Choisis un créateur ou une marque depuis le classement pour explorer le détail de son score</div>
              <button onClick={()=>setSubPage('classement')} style={{padding:'10px 20px',borderRadius:10,background:'none',border:`1px solid ${th.cardBorder}`,color:th.text,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:8,margin:'0 auto'}}>
                <Icon name="score" size={16} color={th.text}/> Voir le classement
              </button>
            </div>
          )}

          {/* DÉFIS & RÉCOMPENSES */}
          {subPage==='defis'&&(
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
                {[['8','Défis actifs'],['3 020','XP distribués'],['8','Récompenses actives'],['1','Nouveautés']].map(([v,l])=>(
                  <div key={l} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:'16px 20px',textAlign:'center',boxShadow:th.shadow}}>
                    <div style={{fontSize:24,fontWeight:700,color:th.text}}>{v}</div>
                    <div style={{fontSize:11,color:th.textMuted,marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Défis actifs</div>
                {[['Déposer envoie','Partager','8 XP',true],['Délie validé','Créateur','8 XP',true],['Engagement ici','Partager','8 XP',true],['Lilines','Actif','8 XP',false],['Hanche à base','Partager','8 XP',true],['Grande créateur','Créateur','8 XP',true],['Revenue builder','Partager','8 XP',false],['Ambassadeur','Créateur','8 XP',true]].map(([name,type,xp,active],i)=>(
                  <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:th.text}}>{name}</div><div style={{fontSize:11,color:th.textMuted}}>{type} · {xp}</div></div>
                    <div style={{width:38,height:22,borderRadius:11,background:active?th.accent:th.barBg,position:'relative',cursor:'pointer'}}>
                      <div style={{position:'absolute',top:3,left:active?18:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Récompenses</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                  {[['Top Performer','1000 XP requis'],['Nouveau mois','1500 XP requis'],['Bonus 50k','3500 XP requis'],['Scout validé S','1500 XP requis'],['Bonus contrats 5','2500 XP requis'],['Perfect 100','1500 XP requis']].map(([name,xp],i)=>(
                    <div key={name} style={{padding:'12px',background:th.inputBg,borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div><div style={{fontSize:12,fontWeight:600,color:th.text}}>{name}</div><div style={{fontSize:10,color:th.textMuted}}>{xp}</div></div>
                      <div style={{width:38,height:22,borderRadius:11,background:i%2===0?th.accent:th.barBg,position:'relative'}}>
                        <div style={{position:'absolute',top:3,left:i%2===0?18:3,width:16,height:16,borderRadius:'50%',background:'#fff'}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMINISTRATION */}
          {subPage==='admin'&&(
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:4}}>Pondérations score créateur</div>
                <div style={{fontSize:12,color:th.textMuted,marginBottom:20}}>Total = 100%</div>
                {[['Performance — Ventes, engagement, ROI',40],['Fiabilité — Deadlines, livrables, litiges',25],['Réactivité — Temps de réponse',20],['Satisfaction — Notes, feedback',10],['Historique — Ancienneté, volume',25]].map(([l,v])=>(
                  <div key={l} style={{marginBottom:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:12,color:th.text}}>{l}</span><span style={{fontSize:12,fontWeight:700,color:th.accent}}>{v}%</span></div>
                    <input type="range" min="0" max="100" defaultValue={v} style={{width:'100%',accentColor:th.accent}}/>
                  </div>
                ))}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Configuration niveaux</div>
                {[['Bronze','🥉','0-449 XP'],['Silver','🥈','450-999 XP'],['Gold','🥇','1000-2999 XP'],['Platinum','🏆','3000-9999 XP'],['Diamond','💎','10000+ XP']].map(([l,icon,range])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:18}}>{icon}</span><span style={{fontSize:13,fontWeight:600,color:th.text}}>{l}</span></div>
                    <span style={{fontSize:12,color:th.textMuted}}>{range}</span>
                  </div>
                ))}
              </div>
              <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
                <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Actions admin</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
                  {['Recalculer tous les scores','Détecter anomalies','Sauvegarder pondérations','Réinitialiser défaut','Reset XP inactifs','Exporter les scores'].map(action=>(
                    <button key={action} style={{padding:'10px 14px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,fontWeight:500,cursor:'pointer',textAlign:'left'}}>{action}</button>
                  ))}
                </div>
                <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:12}}>Anomalies détectées</div>
                {[['Alex_Fit','Score en chute — 6 pts en 8j'],['QuickShop','Score passant ci-risque : 80/50'],['Sam_Music','Score — 50 depuis 3 mois, 3 streak']].map(([name,desc])=>(
                  <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:28,height:28,borderRadius:'50%',background:'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#ef4444'}}>{name.slice(0,2).toUpperCase()}</div>
                      <div><div style={{fontSize:12,fontWeight:600,color:th.text}}>{name}</div><div style={{fontSize:11,color:th.textMuted}}>{desc}</div></div>
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>↺</button>
                      <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:'#ef4444',border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>✕</button>
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

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: MARKETING
// ═══════════════════════════════════════════════════════════════════════════════
const PageMarketing = ({ theme: t, dbMarketing = [], dbLoading = false, onPublish, onUpdate, onDelete, onCreate }) => {
  const th = themes[t]
  const [tab, setTab] = useState('contrats')
  const [editPanel, setEditPanel] = useState(null)

  const tabDefs = [
    {id:'contrats',label:'Contrats'},
    {id:'nouveaute',label:'Nouveauté PARTNEXX'},
    {id:'notifications',label:'Notifications'},
    {id:'guides',label:'Guides'},
    {id:'templates',label:'Templates'},
    {id:'outils_ia',label:'Outils IA'},
    {id:'info',label:'Info Marketing'},
  ]

  return (
    <div style={{padding:'32px 36px',display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:700,color:th.text,margin:0,display:'flex',alignItems:'center',gap:10}}>
            <Icon name="trend" size={24} color={th.accent}/> Marketing
          </h1>
          <p style={{color:th.textSecondary,fontSize:13,margin:'4px 0 0'}}>Outils, contenus et veille pour piloter votre stratégie marketing</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <span style={{fontSize:12,color:th.textSecondary}}>📋 12 templates</span>
          <span style={{fontSize:12,color:th.textSecondary}}>📚 8 guides</span>
        </div>
      </div>

      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${th.tabBorder}`,overflowX:'auto'}}>
        {tabDefs.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:'10px 16px',background:'none',border:'none',borderBottom:tab===tb.id?`2px solid ${th.accent}`:'2px solid transparent',color:tab===tb.id?th.accent:th.textSecondary,fontSize:13,fontWeight:tab===tb.id?600:500,cursor:'pointer',marginBottom:-1,whiteSpace:'nowrap'}}>{tb.label}</button>
        ))}
      </div>

      {/* ── CONTRATS ── */}
      {tab==='contrats'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Templates actifs',value:'6',icon:<Icon name="check" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Utilisations totales',value:'1 514',icon:<Icon name="trend" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Taux signature moyen',value:'74%',icon:<Icon name="check" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Top template',value:'One-Shot',icon:<Icon name="star" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Utilisations par type</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:16,height:120}}>
                {[['Affiliation',40,'#3b6ef6'],['UGC',80,'#10b981'],['Ambassadeur',20,'#f59e0b'],['Placement produit',60,'#ef4444'],['One-shot',100,'#3b6ef6'],['Notoriété',55,'#10b981']].map(([l,h,c])=>(
                  <div key={l} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                    <div style={{width:'80%',height:h,background:c,borderRadius:'4px 4px 0 0'}}/>
                    <span style={{fontSize:9,color:th.textMuted,textAlign:'center'}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16}}>Top performer</div>
              <div style={{textAlign:'center',padding:'16px 0'}}>
                <div style={{width:48,height:48,borderRadius:10,background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><Icon name="check" size={24} color={th.accent}/></div>
                <div style={{fontSize:15,fontWeight:700,color:th.text}}>Contrat One-Shot</div>
                <div style={{fontSize:12,color:th.textMuted,marginBottom:16}}>One-shot</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[['423','Utilisations'],['69%','Signature']].map(([v,l])=>(
                    <div key={l} style={{background:th.inputBg,borderRadius:8,padding:'10px'}}>
                      <div style={{fontSize:18,fontWeight:700,color:th.text}}>{v}</div>
                      <div style={{fontSize:10,color:th.textMuted}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1,position:'relative'}}>
              <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}><Icon name="search" size={15} color={th.textMuted}/></div>
              <input placeholder="Rechercher un template..." style={{width:'100%',padding:'9px 12px 9px 36px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <select style={{padding:'9px 14px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Tous les types</option></select>
            <button style={{padding:'9px 16px',borderRadius:10,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>+ Créer</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
            {[['Contrat One-Shot','One-shot · 4 variables',423,'69%','7 jours','15%',88],['Contrat Affiliation','Affiliation · 6 variables',215,'65%','90 jours','20%',73],['Contrat UGC','UGC · 4 variables',342,'78%','30 jours','15%',85],['Contrat Placement Produit','Placement produit · 4 variables',267,'72%','14 jours','15%',76],['Contrat Notoriété','Notoriété · 5 variables',178,'74%','14 jours','15%',60],['Contrat Ambassadeur','Ambassadeur · 4 variables',89,'85%','6 mois','12%',45]].map(([name,desc,usages,sig,dur,com,pop])=>(
              <div key={name} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:36,height:36,borderRadius:8,background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={18} color={th.accent}/></div>
                    <div><div style={{fontSize:13,fontWeight:700,color:th.text}}>{name}</div><div style={{fontSize:11,color:th.textMuted}}>{desc}</div></div>
                  </div>
                  <Badge label="Actif" color="green" t={t}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:12}}>
                  {[[usages,'Usages'],[sig,'Signature'],[dur,'Durée'],[com,'Commission']].map(([v,l])=>(
                    <div key={l}><div style={{fontSize:14,fontWeight:700,color:th.text}}>{v}</div><div style={{fontSize:10,color:th.textMuted}}>{l}</div></div>
                  ))}
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:10,color:th.textMuted}}>Popularité</span><span style={{fontSize:10,color:th.textMuted}}>{pop}%</span></div>
                  <ProgressBar value={pop} color={th.accent} theme={t}/>
                </div>
                <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                  <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>✏️</button>
                  <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>📋</button>
                  <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:'#ef4444',border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NOUVEAUTÉ PARTNEXX ── */}
      {tab==='nouveaute'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20,position:'relative'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Nouveautés publiées', value: dbLoading ? '...' : String(dbMarketing.filter(m => m.status === 'published').length), icon:<Icon name="trend" size={18} color="#3b6ef6"/>, iconBg:th.accentLight},
{label:'Vues totales', value: dbLoading ? '...' : dbMarketing.reduce((s,m) => s+(m.views||0),0).toLocaleString(), icon:<Icon name="eye" size={18} color="#10b981"/>, iconBg:t==='dark'?'#052e16':'#dcfce7'},
{label:'Clics totaux', value: dbLoading ? '...' : dbMarketing.reduce((s,m) => s+(m.clicks||0),0).toLocaleString(), icon:<Icon name="analytics" size={18} color="#f59e0b"/>, iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
{label:'Taux clic moyen', value: dbLoading ? '...' : (() => { const totalViews = dbMarketing.reduce((s,m)=>s+(m.views||0),0); const totalClicks = dbMarketing.reduce((s,m)=>s+(m.clicks||0),0); return totalViews > 0 ? Math.round(totalClicks/totalViews*100)+'%' : '0%' })(), icon:<Icon name="filter" size={18} color="#8b5cf6"/>, iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <select style={{padding:'8px 14px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Tous</option></select>
            <button style={{padding:'9px 16px',borderRadius:10,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>+ Nouvelle annonce</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
            {[
              ...(dbMarketing.length > 0 ? dbMarketing.filter(m => m.type === 'nouveaute') : [
  {title:'Nouveauté PARTNEXX : Contrats automatiques V3',description:"Générez vos contrats en 1 clic grâce aux templates intelligents.",cta_label:'Découvrir',views:8200,clicks:2340,published_at:'2025-04-07',audience:'Tous',status:'published'},
  {title:'Nouveauté PARTNEXX : Escrow sécurisé',description:"Le séquestre Partnexx protège les créateurs.",cta_label:'En savoir plus',views:6100,clicks:1890,published_at:'2025-04-05',audience:'Tous',status:'published'},
  {title:'Nouveauté PARTNEXX : Matching IA créateurs',description:"Notre algorithme recommande les meilleurs créateurs.",cta_label:'Tester le matching',views:4500,clicks:1200,published_at:'2025-04-03',audience:'Tous',status:'published'},
  {title:'Nouveauté PARTNEXX : Dashboard Analytics',description:"Suivez vos KPIs en temps réel.",cta_label:'Voir le dashboard',views:0,clicks:0,published_at:'2025-04-10',audience:'Tous',status:'scheduled'},
  {title:'Nouveauté PARTNEXX : Messagerie Intégrée',description:"Communiquez directement avec vos partenaires.",cta_label:'Découvrir',views:0,clicks:0,published_at:'2025-04-10',audience:'Tous',status:'draft'},
  {title:'Nouveauté PARTNEXX : Score IA créateur',description:"Découvrez votre Partnexx Score.",cta_label:'Voir mon score',views:7800,clicks:3200,published_at:'2025-04-01',audience:'Créateurs',status:'published'},
])
            ].map((news,i)=>(
              <div key={i} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <Badge label="🚀 Nouveauté" color="blue" t={t}/>
                  <div style={{display:'flex',gap:6}}>
                    <Badge label={news.audience} color="gray" t={t}/>
                    <Badge label={news.status} color={news.status==='Publié'?'green':news.status==='Programmé'?'blue':'gray'} t={t}/>
                  </div>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:th.text,marginBottom:6}}>{news.title}</div>
                <div style={{fontSize:12,color:th.textSecondary,marginBottom:12,lineHeight:1.5}}>{news.description}</div>
                {news.cta_label&&<button style={{padding:'6px 12px',borderRadius:8,background:th.accentLight,color:th.accent,border:'none',fontSize:12,fontWeight:600,cursor:'pointer',marginBottom:12}}>{news.cta_label} →</button>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:8,borderTop:`1px solid ${th.tableBorder}`}}>
                  <div style={{display:'flex',gap:10}}>
                    <span style={{fontSize:11,color:th.textMuted}}>👁 {news.views.toLocaleString()}</span>
                    <span style={{fontSize:11,color:th.textMuted}}>↗ {news.clicks.toLocaleString()}</span>
                    <span style={{fontSize:11,color:th.accent,fontWeight:600}}>{news.ctr} CTR</span>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>setEditPanel(news)} style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>✏️</button>
                    <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:'#ef4444',border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Edit panel */}
          {editPanel&&(
            <div style={{position:'fixed',top:0,right:0,width:380,height:'100vh',background:th.panelBg,borderLeft:`1px solid ${th.panelBorder}`,padding:24,overflowY:'auto',zIndex:200,boxShadow:'-4px 0 20px rgba(0,0,0,0.15)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                <span style={{fontSize:15,fontWeight:700,color:th.text}}>Modifier l'annonce</span>
                <button onClick={()=>setEditPanel(null)} style={{background:'none',border:'none',cursor:'pointer'}}><Icon name="x" size={18} color={th.textMuted}/></button>
              </div>
              {[['Titre *',editPanel.title,'text'],['Contenu *',editPanel.desc,'textarea']].map(([l,v,type])=>(
                <div key={l} style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:600,color:th.text,display:'block',marginBottom:6}}>{l}</label>
                  {type==='textarea'
                    ?<textarea defaultValue={v} style={{width:'100%',height:80,padding:'8px 10px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12,resize:'none',outline:'none',boxSizing:'border-box'}}/>
                    :<input defaultValue={v} style={{width:'100%',padding:'8px 10px',borderRadius:8,border:`1px solid ${th.accent}`,background:th.inputBg,color:th.text,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
                  }
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                {[['Type',['Nouveauté','Mise à jour','Alerte']],['Audience',['Tous','Créateurs','Marques']]].map(([l,opts])=>(
                  <div key={l}>
                    <label style={{fontSize:12,fontWeight:600,color:th.text,display:'block',marginBottom:6}}>{l}</label>
                    <select style={{width:'100%',padding:'8px 10px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:12,fontWeight:600,color:th.text,display:'block',marginBottom:6}}>Statut</label>
                <select style={{width:'100%',padding:'8px 10px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}>
                  <option>Publié</option><option>Brouillon</option><option>Programmé</option>
                </select>
              </div>
              {[['Bouton CTA (optionnel)',editPanel.cta||''],['Lien CTA (optionnel)','https://...']].map(([l,v])=>(
                <div key={l} style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:600,color:th.text,display:'block',marginBottom:6}}>{l}</label>
                  <input defaultValue={v} style={{width:'100%',padding:'8px 10px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
                </div>
              ))}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:12,fontWeight:600,color:th.text,display:'block',marginBottom:6}}>Date de publication</label>
                <input type="date" defaultValue="2025-04-07" style={{width:'100%',padding:'8px 10px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10}}>
                <button style={{padding:'10px 0',borderRadius:8,background:th.accent,color:'#fff',border:'none',fontSize:13,fontWeight:600,cursor:'pointer'}}>💾 Sauvegarder</button>
                <button onClick={()=>setEditPanel(null)} style={{padding:'10px 14px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:13,cursor:'pointer'}}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {tab==='notifications'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:th.shadow}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="bell" size={20} color={th.accent}/></div>
              <div><div style={{fontSize:14,fontWeight:600,color:th.text}}>Notification rapide</div><div style={{fontSize:12,color:th.textMuted}}>Envoyer une notification aux utilisateurs</div></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              {['Créateurs','Marques','Tout le monde'].map((tgt,i)=><button key={tgt} style={{padding:'8px 14px',borderRadius:8,background:i===2?th.accent:th.inputBg,color:i===2?'#fff':th.text,border:`1px solid ${i===2?th.accent:th.cardBorder}`,fontSize:12,fontWeight:i===2?600:400,cursor:'pointer'}}>{tgt}</button>)}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Templates actifs',value:'6',icon:<Icon name="bell" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Envois totaux',value:'5 546',icon:<Icon name="send" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Meilleur taux réponse',value:'95%',icon:<Icon name="trend" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Message star',value:'Validation livrable',icon:<Icon name="star" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div style={{position:'relative',flex:1,maxWidth:400}}>
              <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}><Icon name="search" size={15} color={th.textMuted}/></div>
              <input placeholder="Rechercher..." style={{width:'100%',padding:'9px 12px 9px 36px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{display:'flex',gap:10}}>
              <select style={{padding:'9px 14px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Toutes</option></select>
              <button style={{padding:'9px 16px',borderRadius:10,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>+ Créer</button>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
            {[
              {name:'Premier contact créateur',desc:'Nouvelle opportunité de collaboration',tags:['Premier contact','Plateforme','email'],rate:'42%',sends:'892'},
              {name:'Relance douce',desc:'Re: Opportunité de collaboration',tags:['Relance','Plateforme','email','A/B · A'],rate:'28%',sends:'534'},
              {name:'Validation livrable',desc:'Livrable validé ✅',tags:['Validation','Plateforme','in-app'],rate:'95%',sends:'1 243'},
              {name:'Refus poli',desc:'Retour sur votre candidature',tags:['Refus','Plateforme','email'],rate:'12%',sends:'321'},
              {name:'Rappel deadline',desc:'🔔 Rappel · livrable à soumettre',tags:['Relance','Plateforme','in-app'],rate:'65%',sends:'456'},
              {name:'Bienvenue créateur',desc:'🎉 Bienvenue sur Partnexx !',tags:['Premier contact','Plateforme','email'],rate:'78%',sends:'2 100'},
            ].map((notif,i)=>(
              <div key={i} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:18,boxShadow:th.shadow}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:32,height:32,borderRadius:8,background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="bell" size={15} color={th.accent}/></div>
                    <div><div style={{fontSize:13,fontWeight:700,color:th.text}}>{notif.name}</div><div style={{fontSize:11,color:th.textMuted}}>{notif.desc}</div></div>
                  </div>
                  <Badge label="Actif" color="green" t={t}/>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  {notif.tags.map(tag=><span key={tag} style={{fontSize:10,padding:'2px 8px',borderRadius:4,background:th.inputBg,color:th.textSecondary,border:`1px solid ${th.cardBorder}`}}>{tag}</span>)}
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{display:'flex',gap:12}}>
                    <span style={{fontSize:12,color:'#10b981',fontWeight:600}}>↗ {notif.rate}</span>
                    <span style={{fontSize:12,color:th.textMuted}}>✉ {notif.sends}</span>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>👁</button>
                    <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>📋</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GUIDES ── */}
      {tab==='guides'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Guides publiés',value:'7',icon:<Icon name="check" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Vues totales',value:'30 270',icon:<Icon name="eye" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Recommandés',value:'5',icon:<Icon name="star" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Guide le + lu',value:'Fixer ses prix...',icon:<Icon name="score" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1,position:'relative'}}>
              <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}><Icon name="search" size={15} color={th.textMuted}/></div>
              <input placeholder="Rechercher..." style={{width:'100%',padding:'9px 12px 9px 36px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            {['Tous','Tous niveaux','Tous'].map(p=><select key={p} style={{padding:'9px 14px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>{p}</option></select>)}
            <button style={{padding:'9px 16px',borderRadius:10,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>+ Publier</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[
              {level:'débutant',title:'Comment lancer sa première campagne UGC',desc:'Guide complet pour créer et gérer une campagne UGC performante de A à Z.',tags:['Tous','UGC','Onboarding'],views:4520,time:'8 min',recommended:true,status:'Publié'},
              {level:'intermédiaire',title:'Choisir le bon créateur pour sa niche',desc:'Critères de sélection, red flags et bonnes pratiques pour trouver le créateur idéal.',tags:['Tous','Contenu','ROI'],views:3210,time:'12 min',recommended:true,status:'Publié'},
              {level:'débutant',title:'Comment fixer ses prix en tant que créateur',desc:'Méthodologie pour calculer vos tarifs en fonction de votre audience et niche.',tags:['Créateurs','Pricing','Négociation'],views:6780,time:'6 min',recommended:true,status:'Publié'},
              {level:'avancé',title:"Mesurer le ROI d'une campagne influence",desc:'Les métriques clés et comment calculer le retour sur investissement.',tags:['Tous','ROI','Ads'],views:2100,time:'15 min',recommended:false,status:'Publié'},
              {level:'débutant',title:'Gagner ses premiers deals sur Partnexx',desc:'Optimisez votre profil et décrochez vos premières collaborations rapidement.',tags:['Créateurs','Onboarding','Négociation'],views:5430,time:'10 min',recommended:true,status:'Publié'},
              {level:'avancé',title:'Créer du contenu qui convertit',desc:'Techniques avancées pour produire du contenu UGC à fort taux de conversion.',tags:['Créateurs','Contenu','UGC','Ads'],views:1890,time:'20 min',recommended:false,status:'Brouillon'},
            ].map((g,i)=>(
              <div key={i} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
                  <Badge label={g.level} color={g.level==='débutant'?'green':g.level==='intermédiaire'?'blue':'orange'} t={t}/>
                  {g.recommended&&<Badge label="⭐ Recommandé" color="yellow" t={t}/>}
                  <Badge label={g.status} color={g.status==='Publié'?'green':'gray'} t={t}/>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:th.text,marginBottom:6}}>{g.title}</div>
                <div style={{fontSize:12,color:th.textSecondary,marginBottom:10,lineHeight:1.5}}>{g.desc}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  {g.tags.map(tag=><span key={tag} style={{fontSize:10,padding:'2px 8px',borderRadius:4,background:th.inputBg,color:th.textSecondary,border:`1px solid ${th.cardBorder}`}}>{tag}</span>)}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:8,borderTop:`1px solid ${th.tableBorder}`}}>
                  <div style={{display:'flex',gap:10}}>
                    <span style={{fontSize:11,color:th.textMuted}}>👁 {g.views.toLocaleString()}</span>
                    <span style={{fontSize:11,color:th.textMuted}}>⏱ {g.time}</span>
                  </div>
                  <button style={{fontSize:12,color:th.accent,background:'none',border:'none',cursor:'pointer',fontWeight:600,display:'flex',alignItems:'center',gap:4}}>Voir <Icon name="arrow" size={12} color={th.accent}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TEMPLATES ── */}
      {tab==='templates'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Templates',value:'6',icon:<Icon name="check" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Utilisations totales',value:'372',icon:<Icon name="eye" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Le + utilisé',value:'Caption Insta',icon:<Icon name="star" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Dernière MAJ',value:'15 mars 2025',icon:<Icon name="refresh" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div style={{position:'relative',maxWidth:320}}>
              <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}><Icon name="search" size={15} color={th.textMuted}/></div>
              <input placeholder="Rechercher un template..." style={{width:'100%',padding:'9px 12px 9px 36px',borderRadius:10,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <button style={{padding:'9px 16px',borderRadius:10,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>+ Créer template</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[['Brief','PDF','Brief campagne standard',87,'2025-03-10'],['Rapport','Google Slides','Rapport de performance',64,'2025-03-08'],['Présentation','PPT','Deck de présentation marque',52,'2025-02-28'],['Fiche','PDF','Fiche créateur (média kit)',41,'2025-03-05'],['Checklist','Notion','Checklist onboarding créateur',33,'2025-03-12'],['Social','Texte','Template caption Instagram',95,'2025-03-15']].map(([type,format,title,usages,date])=>(
              <div key={title} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <Badge label={type} color="blue" t={t}/>
                  <span style={{fontSize:11,color:th.textMuted,fontWeight:600}}>{format}</span>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:th.text,marginBottom:14}}>{title}</div>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:14,fontSize:12,color:th.textMuted}}>
                  <span>👥 {usages} utilisations</span><span>📅 {date}</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
                  {[['👁 Voir'],['✏️ Éditer'],['📋']].map(([l])=>(
                    <button key={l} style={{padding:'6px 8px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>{l}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OUTILS IA ── */}
      {tab==='outils_ia'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Outils disponibles',value:'6',icon:<Icon name="score" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Actifs',value:'4',icon:<Icon name="check" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Utilisations totales',value:'964',icon:<Icon name="trend" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Le + populaire',value:'Captions',icon:<Icon name="star" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[
              {icon:'📄',title:'Générateur de brief',desc:'Crée automatiquement un brief campagne à partir de quelques paramètres.',usages:234,status:'Actif',sc:'green'},
              {icon:'👤',title:'Analyse de profil créateur',desc:'Scanne un profil créateur et génère un résumé avec scoring et recommandations.',usages:189,status:'Actif',sc:'green'},
              {icon:'💬',title:'Rédacteur de captions',desc:'Génère des captions optimisées pour Instagram, TikTok et YouTube.',usages:312,status:'Actif',sc:'green'},
              {icon:'📈',title:'Détecteur de tendances',desc:'Identifie les tendances émergentes sur les réseaux sociaux.',usages:45,status:'Bêta',sc:'yellow'},
              {icon:'🎯',title:'Simulateur de ROI',desc:"Estime le ROI potentiel d'une campagne selon le profil et le budget.",usages:156,status:'Actif',sc:'green'},
              {icon:'📝',title:'Assistant contrat',desc:'Aide à rédiger et personnaliser les clauses contractuelles.',usages:28,status:'Bêta',sc:'yellow'},
            ].map((tool,i)=>(
              <div key={i} style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{tool.icon}</div>
                  <Badge label={tool.status} color={tool.sc} t={t}/>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:th.text,marginBottom:6}}>{tool.title}</div>
                <div style={{fontSize:12,color:th.textSecondary,marginBottom:14,lineHeight:1.5}}>{tool.desc}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:th.textMuted}}>👥 {tool.usages} utilisations</span>
                  <button style={{padding:'8px 16px',borderRadius:8,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                    <Icon name="score" size={13} color="#fff"/> Lancer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INFO MARKETING ── */}
      {tab==='info'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[
              {label:'Publiés',value:'4',icon:<Icon name="trend" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Vues totales',value:'33 300',icon:<Icon name="eye" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Clics totaux',value:'10 600',icon:<Icon name="analytics" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'CTR moyen',value:'31%',icon:<Icon name="filter" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>

          {/* Filters + CTA */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <select style={{padding:'8px 14px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:13,cursor:'pointer'}}>
              <option>Tous les types</option>
              <option>Actu réseaux</option>
              <option>Opportunité</option>
              <option>Veille & Régulation</option>
            </select>
            <button style={{display:'flex',alignItems:'center',gap:8,padding:'9px 18px',borderRadius:10,background:th.accent,color:'#fff',border:'none',fontSize:13,fontWeight:600,cursor:'pointer'}}>
              + Créer contenu
            </button>
          </div>

          {/* Articles grid 2 cols */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {
                category:'Actu réseaux',catColor:'#3b6ef6',catBg:th.accentLight,
                emoji:'🚨',
                title:'Interdiction des réseaux sociaux pour les -15 ans',
                desc:"La loi sur la majorité numérique entre en vigueur : les plateformes devront vérifier l'âge des utilisateurs. Impact majeur sur les campagnes ciblant les jeunes audiences.",
                cta:'Lire l\'article',ctaArrow:true,
                views:12400,clicks:4200,ctr:'34% CTR',date:'2025-04-07',
                audience:'Tous',status:'Publié',statusColor:'green',
                borderColor:'#3b6ef6',
              },
              {
                category:'Opportunité',catColor:'#10b981',catBg:t==='dark'?'#052e16':'#dcfce7',
                emoji:'📱',
                title:'TikTok : nouvelles règles de monétisation 2025',
                desc:'TikTok modifie son programme de rémunération créateur. Seuil minimum relevé à 10K abonnés. Nouveaux bonus pour les vidéos longues (>1min).',
                cta:'Voir les détails',ctaArrow:true,
                views:8900,clicks:3100,ctr:'35% CTR',date:'2025-04-06',
                audience:'Créateurs',status:'Publié',statusColor:'green',
                borderColor:'#10b981',
              },
              {
                category:'Actu réseaux',catColor:'#3b6ef6',catBg:th.accentLight,
                emoji:'📊',
                title:"Instagram : l'algorithme Reels change en avril",
                desc:"Meta annonce un rééquilibrage de l'algo Reels : plus de poids aux contenus originaux, pénalité pour les reposts. Les créateurs UGC sont avantagés.",
                cta:'Adapter sa stratégie',ctaArrow:true,
                views:6800,clicks:1900,ctr:'28% CTR',date:'2025-04-05',
                audience:'Tous',status:'Publié',statusColor:'green',
                borderColor:'#3b6ef6',
              },
              {
                category:'Veille & Régulation',catColor:'#8b5cf6',catBg:t==='dark'?'#1e1040':'#ede9fe',
                emoji:'⚖️',
                title:'DSA : obligations de transparence pub renforcées',
                desc:'Le Digital Services Act impose de nouvelles mentions obligatoires sur les contenus sponsorisés. Toutes les collaborations doivent être clairement identifiées avec #pub ou #ad.',
                cta:'Guide conformité',ctaArrow:true,
                views:5200,clicks:1400,ctr:'27% CTR',date:'2025-04-03',
                audience:'Tous',status:'Publié',statusColor:'green',
                borderColor:'#8b5cf6',
              },
              {
                category:'Opportunité',catColor:'#10b981',catBg:t==='dark'?'#052e16':'#dcfce7',
                emoji:'🔥',
                title:'YouTube Shorts : monétisation ouverte à tous',
                desc:'YouTube ouvre la monétisation des Shorts à tous les créateurs avec 500+ abonnés. Revenue share de 45% sur les pubs entre les Shorts.',
                cta:'Activer',ctaArrow:true,
                views:0,clicks:0,ctr:null,date:'2025-04-12',
                audience:'Créateurs',status:'Programmé',statusColor:'blue',
                borderColor:'#10b981',
              },
              {
                category:'Veille & Régulation',catColor:'#8b5cf6',catBg:t==='dark'?'#1e1040':'#ede9fe',
                emoji:'📰',
                title:'Veille hebdo #14 — Tendances influence & régulation',
                desc:'Cette semaine : hausse de 30% des campagnes UGC food, nouvelle loi anti-dropshipping, et TikTok Shop arrive en France.',
                cta:null,ctaArrow:false,
                views:0,clicks:0,ctr:null,date:'2025-04-12',
                audience:'Tous',status:'Brouillon',statusColor:'gray',
                borderColor:t==='dark'?'#2d3748':'#e5e7eb',
              },
            ].map((article,i)=>(
              <div key={i} style={{
                background:th.card,
                border:`1px solid ${th.cardBorder}`,
                borderTop:`3px solid ${article.borderColor}`,
                borderRadius:12,padding:20,
                boxShadow:th.shadow,
                display:'flex',flexDirection:'column',gap:10,
              }}>
                {/* Category + badges */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:20,background:article.catBg}}>
                    <Icon name="trend" size={12} color={article.catColor}/>
                    <span style={{fontSize:11,fontWeight:600,color:article.catColor}}>{article.category}</span>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <Badge label={article.audience} color="gray" t={t}/>
                    <Badge label={article.status} color={article.statusColor} t={t}/>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:th.text,marginBottom:6,lineHeight:1.35}}>
                    {article.emoji} {article.title}
                  </div>
                  <div style={{fontSize:12,color:th.textSecondary,lineHeight:1.6}}>{article.desc}</div>
                </div>

                {/* CTA button */}
                {article.cta&&(
                  <button style={{alignSelf:'flex-start',display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,fontWeight:500,cursor:'pointer'}}>
                    {article.cta} {article.ctaArrow&&'→'}
                  </button>
                )}

                {/* Footer stats */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:8,borderTop:`1px solid ${th.tableBorder}`,marginTop:'auto'}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    {article.views>0&&<span style={{fontSize:11,color:th.textMuted}}>👁 {article.views.toLocaleString()}</span>}
                    {article.clicks>0&&<span style={{fontSize:11,color:th.textMuted}}>↗ {article.clicks.toLocaleString()}</span>}
                    {article.ctr&&<span style={{fontSize:11,fontWeight:600,color:article.catColor}}>{article.ctr}</span>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:11,color:th.textMuted}}>📅 {article.date}</span>
                    <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>✏️</button>
                    <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:'#ef4444',border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: MODÉRATION
// ═══════════════════════════════════════════════════════════════════════════════
const PageModeration = ({ theme: t, dbUsers = [], dbKyc = [], dbLoading = false, onApproveKyc, onRejectKyc, onSuspend }) => {
  const th = themes[t]
  const [tab, setTab] = useState('dashboard')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [selectedSignalement, setSelectedSignalement] = useState(null)

  const tabs = [
    {id:'dashboard', label:'Dashboard'},
    {id:'profils', label:'Profils', badge:8},
    {id:'signalements', label:'Signalements', badge:3},
    {id:'sanctions', label:'Sanctions'},
    {id:'kyc', label:'KYC', badge:4},
  ]

  const profiles = [
    {id:1,initials:'NB',name:'NovaBrand SAS',email:'novabrand.fr',type:'Marque',typeColor:'orange',status:'En attente',statusColor:'yellow',score:70,scoreLabel:'Normal',scoreColor:'blue',campaigns:0,signalements:0,pays:'France',date:'Il y a 4/h'},
    {id:2,initials:'EC',name:'Emma_Create',email:'emmacreate.creates',type:'Créateur',typeColor:'blue',status:'En attente',statusColor:'yellow',score:80,scoreLabel:'Normal',scoreColor:'blue',campaigns:3,signalements:0,pays:'France',date:'Il y a 4/h'},
    {id:3,initials:'FU',name:'FashionUp',email:'fashionup.com',type:'Marque',typeColor:'orange',status:'Susfiré',statusColor:'red',score:80,scoreLabel:'Risqué',scoreColor:'red',campaigns:1,signalements:1,pays:'Belgique',date:'Il y a 4/h'},
    {id:4,initials:'LS',name:'Leo.Studio',email:'leostudio.create.com',type:'Créateur',typeColor:'blue',status:'Valide',statusColor:'green',score:80,scoreLabel:'Faible',scoreColor:'green',campaigns:12,signalements:0,pays:'France',date:'Hier'},
    {id:5,initials:'QS',name:'QuickShop',email:'quickshop.market',type:'Marque',typeColor:'orange',status:'Nouveau',statusColor:'gray',score:50,scoreLabel:'Risqué',scoreColor:'red',campaigns:5,signalements:1,pays:'France',date:'Hier'},
    {id:6,initials:'FI',name:'FakeInfluencer',email:'fakeinfluencer.fr',type:'Créateur',typeColor:'blue',status:'Suspendu',statusColor:'red',score:15,scoreLabel:'Risqué',scoreColor:'red',campaigns:0,signalements:1,pays:'Pologne',date:'Il y a 5j'},
    {id:7,initials:'GV',name:'GreenVibe Co.',email:'greenvibe.co',type:'Marque',typeColor:'orange',status:'Valide',statusColor:'green',score:80,scoreLabel:'Normal',scoreColor:'blue',campaigns:7,signalements:0,pays:'Suisse',date:'Il y a 4j'},
    {id:8,initials:'JC',name:'Julie_Cook',email:'youtube.com/juliecook',type:'Créateur',typeColor:'blue',status:'En attente',statusColor:'yellow',score:47,scoreLabel:'Surveiller',scoreColor:'yellow',campaigns:2,signalements:1,pays:'France',date:'Il y a 4/h'},
  ]

  const signalements = [
    {id:'#1',signalePar:'NovaBrand SAS',user:'FakeInfluencer',type:'Fraude',category:'Intégrité',priority:'Haute',priorityColor:'red',status:'Ouvert',statusColor:'red',date:'Il y a 1h',desc:'Faux followers détectés, engagement 0.1%'},
    {id:'#2',signalePar:'Emma_Create',user:'QuickShop',type:'Non-paiement',category:'Paiement',priority:'Haute',priorityColor:'red',status:'Résolu',statusColor:'green',date:'Il y a 3h',desc:''},
    {id:'#3',signalePar:'Admin',user:'SpamBot_42',type:'Spam',category:'Sécurité',priority:'Critique',priorityColor:'red',status:'Investigation',statusColor:'orange',date:'Hier',desc:''},
    {id:'#4',signalePar:'Leo.Studio',user:'FashionUp',type:'Contenu non conforme',category:'Contenu',priority:'Moyenne',priorityColor:'yellow',status:'Résolu',statusColor:'green',date:'Il y a 5j',desc:''},
    {id:'#5',signalePar:'Marie.Beauty',user:'Alex_Fit',type:'Comportement abusif',category:'Comportement',priority:'Haute',priorityColor:'red',status:'Ouvert',statusColor:'red',date:'Il y a 2j',desc:''},
    {id:'#6',signalePar:'Julie_Cook',user:'QuickShop',type:'Non-paiement',category:'Paiement',priority:'Haute',priorityColor:'red',status:'Ouvert',statusColor:'red',date:'Il y a 3j',desc:''},
    {id:'#7',signalePar:'Système',user:'CryptoScam',type:'Arnaque',category:'Sécurité',priority:'Critique',priorityColor:'red',status:'Investigation',statusColor:'orange',date:'Il y a 5j',desc:''},
    {id:'#8',signalePar:'T',user:'GreenVibe Co.',type:'Contenu non conforme',category:'Contenu',priority:'Moyenne',priorityColor:'yellow',status:'Résolu',statusColor:'green',date:'Il y a 5j',desc:''},
  ]

  const sanctions = [
    {user:'FakeInfluencer',type:'Bannissement',typeColor:'red',reason:'Fraude, faux followers, faux engagement — Bluffing live',date:'Il y a 4j',by:'Admin'},
    {user:'SpamBot_42',type:'Bannissement',typeColor:'red',reason:'Spam massif — 12 messages en 1h — Texting bots, bannissement direct',date:'Il y a 2j',by:'Admin'},
    {user:'QuickShop',type:'Suspension',typeColor:'orange',reason:'Non-paiement répété (3 créateurs)',date:'Il y a 5j',by:'Finance'},
    {user:'FashionUp',type:'Suspension',typeColor:'orange',reason:'Campagne avec contenu trompeur — 1er avertissement',date:'Il y a 6j',by:'Admin'},
    {user:'CryptoScam',type:'Bannissement',typeColor:'red',reason:'Arnaque financière — faute grave, bannissement immédiat',date:'Il y a 7j',by:'User'},
  ]

  const kycDossiers = [
    {user:'Leo.Studio',initials:'LS',status:'En attente',type:'Majeur',doc:'Passport ****8857',date:'09/04/2026',iban:'FR76****9985'},
    {user:'Alex_Fit',initials:'AF',status:'En attente',type:'Majeur',doc:'CNI ****0703',date:'08/04/2026',iban:'FR76****4428'},
    {user:'Marie.Beauty',initials:'MB',status:'En attente',type:'Mineur',doc:'CNI ****0072',date:'01/04/2026',iban:'FR76****1177'},
    {user:'Tom_Travel',initials:'TT',status:'En attente',type:'Majeur',doc:'CNI ****0372',date:'Il y a 5j',iban:'FR76****7098'},
    {user:'Nina_Dance',initials:'ND',status:'Validé',type:'Majeur',doc:'CNI ****0641',date:'Il y a 6j',iban:'FR76****7098'},
  ]

  const pColor = (c) => c==='red'?'#ef4444':c==='orange'?'#f59e0b':c==='green'?'#10b981':c==='blue'?'#3b6ef6':c==='yellow'?'#f59e0b':'#6b7280'

  return (
    <div style={{padding:'32px 36px',display:'flex',flexDirection:'column',gap:24}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:700,color:th.text,margin:0,display:'flex',alignItems:'center',gap:10}}>
            <Icon name="moderation" size={24} color={th.accent}/> Modération
          </h1>
          <p style={{color:th.textSecondary,fontSize:13,margin:'4px 0 0'}}>Système immunitaire de Partnexx — détection, validation, sanctions</p>
        </div>
        <button style={{padding:'8px 16px',borderRadius:8,border:`1px solid ${th.cardBorder}`,background:th.card,color:th.text,fontSize:12,cursor:'pointer'}}>Historique</button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${th.tabBorder}`}}>
        {tabs.map(tb=>(
          <button key={tb.id} onClick={()=>{setTab(tb.id);setSelectedProfile(null);setSelectedSignalement(null);}} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 18px',background:'none',border:'none',borderBottom:tab===tb.id?`2px solid ${th.accent}`:'2px solid transparent',color:tab===tb.id?th.accent:th.textSecondary,fontSize:13,fontWeight:tab===tb.id?600:500,cursor:'pointer',marginBottom:-1,whiteSpace:'nowrap'}}>
            {tb.label}
            {tb.badge&&<span style={{background:tb.id==='signalements'?'#ef4444':th.accent,color:'#fff',borderRadius:10,padding:'1px 7px',fontSize:11,fontWeight:700}}>{tb.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab==='dashboard'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Etat plateforme */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:'14px 20px',boxShadow:th.shadow}}>
            <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:2}}>État de la plateforme</div>
            <div style={{fontSize:11,color:th.textMuted}}>Surveillance continue · détection, blocage, sanction</div>
          </div>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14}}>
            {[
              {label:'Signalements ouverts', value: dbLoading ? '...' : '0', icon:<Icon name="warning" size={18} color="#ef4444"/>, iconBg:t==='dark'?'#2d1515':'#fee2e2'},
{label:'Comptes à alerter', value: dbLoading ? '...' : String(dbUsers.filter(u => u.score_confiance && u.score_confiance < 50).length), icon:<Icon name="users" size={18} color="#f59e0b"/>, iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
{label:'Comptes actifs', value: dbLoading ? '...' : String(dbUsers.filter(u => u.status === 'active').length), icon:<Icon name="check" size={18} color="#10b981"/>, iconBg:t==='dark'?'#052e16':'#dcfce7'},
{label:'KYC à valider', value: dbLoading ? '...' : String(dbKyc.filter(k => k.status === 'pending').length), icon:<Icon name="lock" size={18} color="#f59e0b"/>, iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
{label:'Taux résolution', value:'92%', icon:<Icon name="trend" size={18} color="#3b6ef6"/>, iconBg:th.accentLight},
{label:'Actions récentes', value:'2', sub:'Il y a 7 min', icon:<Icon name="refresh" size={18} color="#8b5cf6"/>, iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
            {/* Signalements par type */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={15} color="#f59e0b"/> Signalements par type</div>
              {[['Fraude / faux followers','#ef4444',90],['Spam / arnaque','#f59e0b',60],['Contenu non conforme','#3b6ef6',45],['Non-paiement','#8b5cf6',30],['Comportement abusif','#10b981',20]].map(([l,c,v])=>(
                <div key={l} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color:th.textSecondary}}>{l}</span><span style={{fontSize:11,fontWeight:600,color:th.text,minWidth:24,textAlign:'right'}}>{Math.round(v/10)}</span></div>
                  <ProgressBar value={v} color={c} theme={t}/>
                </div>
              ))}
            </div>
            {/* Taux résolution */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Icon name="analytics" size={15} color="#10b981"/> Taux de résolution</div>
              {[['Fraude','#10b981',95],['Non-paiement','#10b981',88],['Contenu','#3b6ef6',85],['Spam','#f59e0b',70],['Comportement','#3b6ef6',55]].map(([l,c,v])=>(
                <div key={l} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color:th.textSecondary}}>{l}</span><span style={{fontSize:11,fontWeight:600,color:c}}>{v}%</span></div>
                  <ProgressBar value={v} color={c} theme={t}/>
                </div>
              ))}
            </div>
            {/* Répartition profils */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Icon name="users" size={15} color="#3b6ef6"/> Répartition profils</div>
              {[['Valides','#10b981',4],['En attente','#f59e0b',3],['Risqué','#ef4444',1],['Exclus','#6b7280',0],['Sous surveillance','#8b5cf6',0]].map(([l,c,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/><span style={{fontSize:12,color:th.textSecondary}}>{l}</span></div>
                  <span style={{fontSize:12,fontWeight:600,color:th.text}}>{v}</span>
                </div>
              ))}
              <div style={{paddingTop:10,marginTop:4}}>
                <div style={{fontSize:12,color:th.textMuted}}>Sous surveillance</div>
              </div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {/* Urgences */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={15} color="#ef4444"/> Urgences</div>
              {[['SpamBot_42 — spam massif détecté (200 messages)','red'],['@GirlFitness — non-paiement 3 créateurs','orange'],['Marie.Beauty — fraude follower confirmée','red'],['CryptoScam — arnaque financière en cours','red']].map(([l,c],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:i<3?`1px solid ${th.tableBorder}`:'none'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:pColor(c),flexShrink:0}}/>
                  <span style={{fontSize:12,color:th.text}}>{l}</span>
                </div>
              ))}
            </div>
            {/* Comptes à vérifier */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><Icon name="lock" size={15} color="#f59e0b"/> Comptes à vérifier</div>
              {[['QuickShop — comptabilité en relance/dpo','orange'],['Léo_Fit — non-paiement chronologique MKT','orange'],['Thomas_p — rapport comportemental loué','orange'],['TomTrail — rapport comportemental loué','orange']].map(([l,c],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:i<3?`1px solid ${th.tableBorder}`:'none'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:pColor(c),flexShrink:0}}/>
                  <span style={{fontSize:12,color:th.text}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {/* KYC en retard */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><Icon name="lock" size={15} color="#3b6ef6"/> KYC à traiter</div>
              {[['Mira.Beauty — 4 jours avant (délai)','orange'],['Bio_FI — 4 jours avant (délai)','orange'],['Bia_Dancer — limite dépassée','red'],['Biely_Premi — 4 jours avant (délai)','orange']].map(([l,c],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:i<3?`1px solid ${th.tableBorder}`:'none'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:pColor(c),flexShrink:0}}/>
                  <span style={{fontSize:12,color:th.text}}>{l}</span>
                </div>
              ))}
            </div>
            {/* Signalements récents */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={15} color="#ef4444"/> Signalements récents</div>
              {[['CryptoScam — faux concours détecté','red'],['Leo_Fit — faux followers — bannissement souhaité','orange'],['Tom_Travel — Sim_29 — comportement bancal','yellow'],['Marie.Beat — Bio_32 — comportement bancal','yellow']].map(([l,c],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:i<3?`1px solid ${th.tableBorder}`:'none'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:pColor(c),flexShrink:0}}/>
                  <span style={{fontSize:12,color:th.text}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Actions décidées */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:2,display:'flex',alignItems:'center',gap:8}}><Icon name="check" size={15} color="#10b981"/> Actions décidées <Badge label="Automatisées" color="green" t={t}/></div>
            <div style={{display:'flex',flexDirection:'column',gap:0}}>
              {[['Cryptoboom — escrow financier',null,'Actif','green'],['MinisTalent Premia Zara',null,'Actif','green'],['FintriTalent Premia Zaro',null,'Normal','blue'],['Signalement #2 crédit — Bio_23','bio23','Investigation','orange'],['Signalement #3 — SpamBot_42 en investigation','spam42','En Cours','orange'],['K13Lux.studio — en attente en validation','k13','En Attente','yellow'],['FintriCreate_Create — en astreinte','create','Urgence','red'],['OvalDhop.Suspects — non-paiement r1','ovals','Résolu','teal'],['QuinsiTaim suspects — action décidée','quintain','Résolu','teal']].map(([l,sub,status,sc],i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<8?`1px solid ${th.tableBorder}`:'none'}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:pColor(sc),flexShrink:0}}/>
                  <div style={{flex:1}}><div style={{fontSize:12,color:th.text}}>{l}</div>{sub&&<div style={{fontSize:10,color:th.textMuted}}>{sub}</div>}</div>
                  <Badge label={status} color={sc} t={t}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            {/* Santé plateforme chart */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:14}}>Santé plateforme</div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:11,color:th.textMuted,width:80}}>Signalements</span>
                <div style={{flex:1,height:12,background:th.barBg,borderRadius:6,overflow:'hidden'}}><div style={{width:'60%',height:'100%',background:'#3b6ef6',borderRadius:6}}/></div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:11,color:th.textMuted,width:80}}>Non-paiements</span>
                <div style={{flex:1,height:12,background:th.barBg,borderRadius:6,overflow:'hidden'}}><div style={{width:'35%',height:'100%',background:'#f59e0b',borderRadius:6}}/></div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:11,color:th.textMuted,width:80}}>KYC</span>
                <div style={{flex:1,height:12,background:th.barBg,borderRadius:6,overflow:'hidden'}}><div style={{width:'80%',height:'100%',background:'#10b981',borderRadius:6}}/></div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:11,color:th.textMuted,width:80}}>Sanctions</span>
                <div style={{flex:1,height:12,background:th.barBg,borderRadius:6,overflow:'hidden'}}><div style={{width:'25%',height:'100%',background:'#ef4444',borderRadius:6}}/></div>
              </div>
            </div>
            {/* KYC Niveaux */}
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:14}}>KYC Niveaux</div>
              {[['En cours','#3b6ef6'],['Acceptés','#10b981'],['Refusés','#ef4444'],['Urgents','#f59e0b']].map(([l,c],i)=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:8,height:8,borderRadius:'50%',background:c}}/><span style={{fontSize:12,color:th.textSecondary}}>{l}</span></div>
                  <span style={{fontSize:12,fontWeight:600,color:th.text}}>{[3,2,1,1][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROFILS ── */}
      {tab==='profils'&&(
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {[
              {label:'Total profils',value:'8',icon:<Icon name="users" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Marques',value:'4',icon:<Icon name="globe" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Créateurs',value:'4',icon:<Icon name="score" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
              {label:'Score moyen',value:'63',icon:<Icon name="star" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          {/* Filters */}
          <div style={{display:'flex',gap:10}}>
            <select style={{padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Tous les statuts</option></select>
            <select style={{padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Tous les types</option></select>
            <div style={{marginLeft:'auto',fontSize:12,color:th.textMuted,display:'flex',alignItems:'center'}}>8 profils</div>
          </div>
          {/* Table */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,overflow:'hidden',boxShadow:th.shadow}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:th.inputBg}}>
                {['Utilisateur','Type','Statut','Score confiance','Campagnes','Signalements','Pays','Date','Actions'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:th.textMuted}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {profiles.map((p,i)=>(
                  <>
                  <tr key={p.id} onClick={()=>setSelectedProfile(selectedProfile===p.id?null:p.id)} style={{borderBottom:`1px solid ${th.tableBorder}`,cursor:'pointer',background:selectedProfile===p.id?th.accentLight:'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(selectedProfile!==p.id)e.currentTarget.style.background=th.sidebarHover}}
                    onMouseLeave={e=>{if(selectedProfile!==p.id)e.currentTarget.style.background='transparent'}}>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>{p.initials}</div>
                        <div><div style={{fontSize:12,fontWeight:600,color:th.text}}>{p.name}</div><div style={{fontSize:10,color:th.textMuted}}>{p.email}</div></div>
                      </div>
                    </td>
                    <td style={{padding:'12px 14px'}}><Badge label={p.type} color={p.typeColor} t={t}/></td>
                    <td style={{padding:'12px 14px'}}><Badge label={p.status} color={p.statusColor} t={t}/></td>
                    <td style={{padding:'12px 14px'}}><Badge label={`${p.score} — ${p.scoreLabel}`} color={p.scoreColor} t={t}/></td>
                    <td style={{padding:'12px 14px',fontSize:12,color:th.text}}>{p.campaigns}</td>
                    <td style={{padding:'12px 14px',fontSize:12,color:p.signalements>0?'#ef4444':th.textMuted}}>
                      {p.signalements>0?<div style={{width:18,height:18,borderRadius:'50%',background:'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#ef4444'}}>{p.signalements}</div>:''}
                    </td>
                    <td style={{padding:'12px 14px',fontSize:12,color:th.textSecondary}}>{p.pays}</td>
                    <td style={{padding:'12px 14px',fontSize:11,color:th.textMuted}}>{p.date}</td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.accent,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>Valider</button>
                        <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.textMuted,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>Info</button>
                        <button style={{padding:'4px 8px',borderRadius:6,background:t==='dark'?'#2d1515':'#fff1f2',color:'#ef4444',border:`1px solid ${t==='dark'?'#7f1d1d':'#fecaca'}`,fontSize:11,cursor:'pointer'}}>Suspendre</button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded profile row */}
                  {selectedProfile===p.id&&(
                    <tr key={p.id+'_detail'} style={{background:t==='dark'?'#161b22':'#f8f9fc'}}>
                      <td colSpan={9} style={{padding:'0 20px 20px'}}>
                        <div style={{marginTop:16}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:th.text}}>Fiche — {p.name} <Badge label="En attente" color="yellow" t={t}/></div>
                              <div style={{fontSize:12,color:th.textMuted}}>{p.type} · {p.pays}</div>
                            </div>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
                            {[['Email',p.email],['Score confiance',`${p.score} — ${p.scoreLabel}`],['Campagnes actives',p.campaigns],['Inscrit le','07/04/2026']].map(([l,v])=>(
                              <div key={l}><div style={{fontSize:10,color:th.textMuted,marginBottom:3}}>{l}</div><div style={{fontSize:13,fontWeight:600,color:th.text}}>{v}</div></div>
                            ))}
                          </div>
                          <div style={{marginBottom:16}}>
                            <div style={{fontSize:12,fontWeight:600,color:th.textMuted,marginBottom:8}}>HISTORIQUE RAPIDE</div>
                            <div style={{display:'flex',flexDirection:'column',gap:4}}>
                              <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:6,height:6,borderRadius:'50%',background:'#3b6ef6'}}/><span style={{fontSize:12,color:th.textSecondary}}>Inscription le 07/04/2026</span></div>
                              <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:6,height:6,borderRadius:'50%',background:'#3b6ef6'}}/><span style={{fontSize:12,color:th.textSecondary}}>2 campagne(s) réalisée(s)</span></div>
                              <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:6,height:6,borderRadius:'50%',background:'#f59e0b'}}/><span style={{fontSize:12,color:th.textSecondary}}>1 signalement(s) reçu(s)</span></div>
                              <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:6,height:6,borderRadius:'50%',background:'#3b6ef6'}}/><span style={{fontSize:12,color:th.textSecondary}}>Score de confiance : 47/100</span></div>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:10,marginBottom:24}}>
                            <button style={{padding:'8px 16px',borderRadius:8,background:'#10b981',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>✓ Valider</button>
                            <button style={{padding:'8px 16px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,cursor:'pointer'}}>✉ Contacter</button>
                            <button style={{padding:'8px 16px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,cursor:'pointer'}}>🔗 Voir le site</button>
                            <button style={{marginLeft:'auto',padding:'8px 16px',borderRadius:8,background:'#ef4444',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>⊘ Suspendre</button>
                          </div>
                          {/* Score confiance legend */}
                          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:10,padding:16}}>
                            <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:10}}>Score de confiance</div>
                            <div style={{fontSize:11,color:th.textMuted,marginBottom:12}}>Basé sur l'historique, paiements, litiges, comportement, signalements</div>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                              {[['80-100 — Faible','#10b981','Créateur premium, partenaire fiable'],['70-80 — Normal','#3b6ef6','Profil standard, surveillance normale'],['50-69 — Surveiller','#f59e0b','Risque modéré, litiges fréquents'],['<50 — Risque','#ef4444','Exclure recommandations, vérifier']].map(([l,c,desc])=>(
                                <div key={l} style={{padding:'10px 12px',borderRadius:8,background:th.inputBg,borderLeft:`3px solid ${c}`}}>
                                  <div style={{fontSize:11,fontWeight:600,color:c,marginBottom:3}}>{l}</div>
                                  <div style={{fontSize:10,color:th.textMuted}}>{desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SIGNALEMENTS ── */}
      {tab==='signalements'&&(
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {[
              {label:'Total signalements',value:'8',icon:<Icon name="warning" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Urgents',value:'3',sub:'→ 14h Au plus',icon:<Icon name="warning" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
              {label:'Ouverts',value:'2',sub:'→ à urgent',icon:<Icon name="warning" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Résolus',value:'1',icon:<Icon name="check" size={18} color="#10b981"/>,iconBg:t==='dark'?'#052e16':'#dcfce7'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>
          {/* Critical banner */}
          <div style={{background:t==='dark'?'#2d1515':'#fff5f5',border:`1px solid ${t==='dark'?'#7f1d1d':'#fecaca'}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:13,fontWeight:600,color:'#ef4444',marginBottom:10,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={15} color="#ef4444"/> Signalements critiques — Action immédiate requise</div>
            {[['#3 — SpamBot_42','Messages en masse en boucle à 300 créateurs'],['#7 — CryptoScam','Promesses de gains irréalistes, liens de phishing']].map(([title,desc],i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',borderRadius:8,background:t==='dark'?'#3d1515':'#fff1f2',marginBottom:i===0?8:0}}>
                <div>
                  <span style={{fontSize:12,fontWeight:600,color:th.text}}>{title}</span>
                  <span style={{fontSize:11,color:th.textMuted,marginLeft:8}}>{desc}</span>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button style={{padding:'5px 10px',borderRadius:6,background:'#ef4444',color:'#fff',border:'none',fontSize:11,fontWeight:600,cursor:'pointer'}}>Sanctionner</button>
                  <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:'#ef4444',border:`1px solid #fecaca`,fontSize:11,cursor:'pointer'}}>Décline</button>
                </div>
              </div>
            ))}
          </div>
          {/* Filters */}
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <select style={{padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Tous les statuts</option></select>
            <select style={{padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}><option>Toutes...</option></select>
            <div style={{marginLeft:'auto',fontSize:12,color:th.textMuted}}>8 signalements</div>
          </div>
          {/* Table */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,overflow:'hidden',boxShadow:th.shadow}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:th.inputBg}}>
                {['#','Signalé par','Utilisateur','Type','Catégorie','Priorité','Statut','Date','Actions'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:th.textMuted}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {signalements.map((s,i)=>(
                  <>
                  <tr key={s.id} onClick={()=>setSelectedSignalement(selectedSignalement===i?null:i)} style={{borderBottom:`1px solid ${th.tableBorder}`,cursor:'pointer',background:selectedSignalement===i?th.accentLight:'transparent',borderLeft:s.priority==='Critique'?'3px solid #ef4444':s.priority==='Haute'?'3px solid #f59e0b':'3px solid transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(selectedSignalement!==i)e.currentTarget.style.background=th.sidebarHover}}
                    onMouseLeave={e=>{if(selectedSignalement!==i)e.currentTarget.style.background='transparent'}}>
                    <td style={{padding:'12px 14px',fontSize:12,fontWeight:700,color:th.textMuted}}>{s.id}</td>
                    <td style={{padding:'12px 14px',fontSize:12,color:th.textSecondary}}>{s.signalePar}</td>
                    <td style={{padding:'12px 14px'}}><div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:22,height:22,borderRadius:'50%',background:th.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff'}}>{s.user.slice(0,2).toUpperCase()}</div><span style={{fontSize:12,fontWeight:600,color:th.text}}>{s.user}</span></div></td>
                    <td style={{padding:'12px 14px'}}><Badge label={s.type} color={s.priorityColor==='red'?'red':s.priorityColor==='yellow'?'yellow':'gray'} t={t}/></td>
                    <td style={{padding:'12px 14px'}}><Badge label={s.category} color="gray" t={t}/></td>
                    <td style={{padding:'12px 14px'}}><Badge label={s.priority} color={s.priorityColor} t={t}/></td>
                    <td style={{padding:'12px 14px'}}><Badge label={s.status} color={s.statusColor} t={t}/></td>
                    <td style={{padding:'12px 14px',fontSize:11,color:th.textMuted}}>{s.date}</td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:th.textMuted,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>Voir</button>
                        {s.priority!=='Moyenne'&&<button style={{padding:'4px 8px',borderRadius:6,background:th.inputBg,color:'#3b6ef6',border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>Instruire</button>}
                        {s.status!=='Résolu'&&<button style={{padding:'4px 8px',borderRadius:6,background:t==='dark'?'#2d1515':'#fff1f2',color:'#ef4444',border:`1px solid ${t==='dark'?'#7f1d1d':'#fecaca'}`,fontSize:11,cursor:'pointer'}}>Sanctionner</button>}
                      </div>
                    </td>
                  </tr>
                  {selectedSignalement===i&&s.desc&&(
                    <tr key={s.id+'_detail'} style={{background:t==='dark'?'#161b22':'#f8f9fc'}}>
                      <td colSpan={9} style={{padding:'0 20px 20px'}}>
                        <div style={{marginTop:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:700,color:th.text,marginBottom:4}}>Signalement {s.id} — {s.user} <Badge label={s.priority} color={s.priorityColor} t={t}/> <Badge label={s.status} color={s.statusColor} t={t}/></div>
                            <div style={{fontSize:11,color:th.textMuted,marginBottom:12}}>Détails et chronologie</div>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginBottom:16}}>
                              {[['Type',s.type],['Catégorie',s.category],['Priorité',s.priority],['Signalé par',s.signalePar]].map(([l,v])=>(
                                <div key={l} style={{background:th.inputBg,borderRadius:8,padding:'10px 12px'}}>
                                  <div style={{fontSize:10,color:th.textMuted}}>{l}</div>
                                  <div style={{fontSize:12,fontWeight:600,color:th.text}}>{v}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{background:th.inputBg,borderRadius:8,padding:12,marginBottom:16}}>
                              <div style={{fontSize:11,fontWeight:600,color:th.textMuted,marginBottom:4}}>DESCRIPTION</div>
                              <div style={{fontSize:12,color:th.text}}>{s.desc||'Aucune description fournie.'}</div>
                            </div>
                            <div style={{marginBottom:16}}>
                              <div style={{fontSize:11,fontWeight:600,color:th.textMuted,marginBottom:8}}>CHRONOLOGIE</div>
                              <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:6,height:6,borderRadius:'50%',background:'#3b6ef6'}}/><span style={{fontSize:12,color:th.textSecondary}}>Signalement ouvert par {s.signalePar}</span></div>
                            </div>
                            <div style={{display:'flex',gap:8}}>
                              <button style={{padding:'8px 16px',borderRadius:8,background:'#ef4444',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>⊘ Sanctionner</button>
                              <button style={{padding:'8px 16px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,cursor:'pointer'}}>✕ Clôturer</button>
                              <button style={{padding:'8px 16px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,cursor:'pointer'}}>✉ Contacter</button>
                              <button style={{marginLeft:'auto',padding:'8px 16px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,cursor:'pointer'}}>Former</button>
                            </div>
                          </div>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:12}}>Répartition par catégorie</div>
                            {[['Intégrité',1],['Paiement',2],['Sécurité',2],['Contenu',2],['Comportement',1]].map(([cat,count])=>(
                              <div key={cat} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                                <span style={{fontSize:12,color:th.textSecondary}}>{cat}</span>
                                <span style={{fontSize:12,fontWeight:600,color:th.text}}>{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SANCTIONS ── */}
      {tab==='sanctions'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {[
              {label:'Sanctions actives',value:'5',icon:<Icon name="warning" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
              {label:'Avertissements',value:'1',icon:<Icon name="warning" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Suspensions',value:'1',icon:<Icon name="lock" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
              {label:'Bannissements',value:'3',icon:<Icon name="x" size={18} color="#ef4444"/>,iconBg:t==='dark'?'#2d1515':'#fee2e2'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>

          {/* Échelle sanctions */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:4,display:'flex',alignItems:'center',gap:8}}><Icon name="analytics" size={15} color={th.accent}/> Échelle de sanctions</div>
            <div style={{fontSize:11,color:th.textMuted,marginBottom:20}}>Approche graduelle · Chaque étape est documentée et traçable</div>
            <div style={{display:'flex',alignItems:'center',position:'relative',marginBottom:24}}>
              <div style={{position:'absolute',top:'50%',left:0,right:0,height:2,background:th.barBg,zIndex:0}}/>
              {[
                {num:'1',label:'Avertissement',sub:'Notification + logs auto',color:'#f59e0b'},
                {num:'2',label:'Suspension',sub:'Compte pausé temporaire',color:'#ef4444'},
                {num:'3',label:'Bannissement',sub:'Compte suspendu définitivement',color:'#7f1d1d'},
              ].map((step,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:1}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:step.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#fff',marginBottom:8,boxShadow:`0 0 0 4px ${step.color}33`}}>{step.num}</div>
                  <div style={{fontSize:12,fontWeight:700,color:th.text}}>{step.label}</div>
                  <div style={{fontSize:10,color:th.textMuted,textAlign:'center'}}>{step.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:'#ef4444',marginBottom:6}}>⚡ Fautes graves — Suspension ou bannissement immédiat</div>
                {['Fraude / faux followers','Contenu illégal'].map(l=><div key={l} style={{fontSize:11,color:th.textSecondary,padding:'2px 0'}}>• {l}</div>)}
              </div>
              <div>
                {['Arnaque financière','Harcèlement / menaces'].map(l=><div key={l} style={{fontSize:11,color:th.textSecondary,padding:'2px 0'}}>• {l}</div>)}
              </div>
              <div>
                {["Usurpation d'identité","Spam massif"].map(l=><div key={l} style={{fontSize:11,color:th.textSecondary,padding:'2px 0'}}>• {l}</div>)}
              </div>
            </div>
          </div>

          {/* Formulaire sanction */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:24,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:16,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={15} color={th.accent}/> Appliquer une nouvelle sanction</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:th.textMuted,display:'block',marginBottom:4}}>Utilisateur</label>
                <input placeholder="Nom de l'utilisateur..." style={{width:'100%',padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:th.textMuted,display:'block',marginBottom:4}}>Type de sanction</label>
                <select style={{width:'100%',padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12}}>
                  <option>Choisir...</option><option>Avertissement</option><option>Suspension</option><option>Bannissement</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:th.textMuted,display:'block',marginBottom:4}}>Raison</label>
                <input placeholder="Décrire la raison..." style={{width:'100%',padding:'8px 12px',borderRadius:8,border:`1px solid ${th.inputBorder}`,background:th.inputBg,color:th.text,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
              </div>
            </div>
            <button style={{padding:'9px 20px',borderRadius:8,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>⚡ Appliquer la sanction</button>
          </div>

          {/* Sanctions actives */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:4,display:'flex',alignItems:'center',gap:8}}><Icon name="warning" size={15} color="#ef4444"/> Sanctions actives <Badge label={`${sanctions.length}`} color="red" t={t}/></div>
            <div style={{fontSize:11,color:th.textMuted,marginBottom:16}}>5 sanctions en cours</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {sanctions.map((s,i)=>(
                <div key={i} style={{padding:'14px 16px',borderRadius:10,background:th.inputBg,border:`1px solid ${s.type==='Bannissement'?t==='dark'?'#7f1d1d':'#fecaca':t==='dark'?'#713f12':'#fed7aa'}`,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:s.type==='Bannissement'?'#fee2e2':'#ffedd5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <Icon name={s.type==='Bannissement'?'x':'warning'} size={16} color={s.type==='Bannissement'?'#ef4444':'#f59e0b'}/>
                    </div>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                        <span style={{fontSize:13,fontWeight:700,color:th.text}}>{s.user}</span>
                        <Badge label={s.type} color={s.type==='Bannissement'?'red':'orange'} t={t}/>
                        <span style={{fontSize:11,color:th.textMuted}}>···</span>
                      </div>
                      <div style={{fontSize:12,color:th.textSecondary,marginBottom:4}}>{s.reason}</div>
                      <div style={{display:'flex',gap:8,fontSize:11,color:th.textMuted}}>
                        <span>P: {s.by==='Admin'?'S.43':'Q.43'} · {s.date}</span>
                        <span>👤 {s.by}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sanctions expirées */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
            <div style={{fontSize:14,fontWeight:600,color:th.text,marginBottom:4}}>Sanctions expirées</div>
            <div style={{fontSize:11,color:th.textMuted,marginBottom:12}}>Historique des sanctions levées ou arrivées à terme</div>
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
              <Icon name="check" size={16} color="#10b981"/>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:13,fontWeight:600,color:th.text}}>Alex_Fit</span>
                  <Badge label="Avertissement" color="yellow" t={t}/>
                  <Badge label="Expiré" color="gray" t={t}/>
                </div>
                <div style={{fontSize:11,color:th.textMuted}}>Première infraction — remontée récente</div>
              </div>
              <button style={{padding:'5px 10px',borderRadius:6,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:11,cursor:'pointer'}}>↺</button>
            </div>
          </div>
        </div>
      )}

      {/* ── KYC ── */}
      {tab==='kyc'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Header KYC */}
          <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:th.shadow}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="lock" size={20} color={th.accent}/></div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:th.text}}>Vérification d'identité (KYC)</div>
                <div style={{fontSize:12,color:th.textMuted}}>Les dossiers arrivent complets — vous vérifiez et validez ou refusez</div>
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button style={{padding:'8px 14px',borderRadius:8,background:t==='dark'?'#2a1f05':'#fef3c7',color:'#f59e0b',border:`1px solid ${t==='dark'?'#713f12':'#fed7aa'}`,fontSize:12,fontWeight:600,cursor:'pointer'}}>⏳ 5 dossiers en attente</button>
              <button style={{padding:'8px 14px',borderRadius:8,background:th.accent,color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>↓ Exporter</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[
              {label:'Dossiers en attente',value:'5',icon:<Icon name="lock" size={18} color="#f59e0b"/>,iconBg:t==='dark'?'#2a1f05':'#fef3c7'},
              {label:'Majeurs',value:'3',icon:<Icon name="users" size={18} color="#3b6ef6"/>,iconBg:th.accentLight},
              {label:'Mineurs',value:'2',icon:<Icon name="warning" size={18} color="#8b5cf6"/>,iconBg:t==='dark'?'#1e1040':'#ede9fe'},
            ].map((s,i)=><StatCard key={i} {...s} theme={t}/>)}
          </div>

          {/* Filter tabs */}
          <div style={{display:'flex',gap:8}}>
            {['Tous','Majeurs','Mineurs'].map((f,i)=>(
              <button key={f} style={{padding:'6px 14px',borderRadius:20,background:i===0?th.accent:th.inputBg,color:i===0?'#fff':th.textSecondary,border:`1px solid ${i===0?th.accent:th.cardBorder}`,fontSize:12,fontWeight:i===0?600:400,cursor:'pointer'}}>{f}</button>
            ))}
            <span style={{marginLeft:'auto',fontSize:12,color:th.textMuted,display:'flex',alignItems:'center'}}>3 dossiers à vérifier</span>
          </div>

          {/* Dossiers list */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {kycDossiers.map((d,i)=>(
              <div key={i} style={{background:th.card,border:`1px solid ${d.status==='Validé'?t==='dark'?'#14532d':'#bbf7d0':th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:d.status!=='Validé'?12:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:d.status==='Validé'?'#dcfce7':th.accentLight,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:d.status==='Validé'?'#15803d':th.accent}}>{d.initials}</div>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:14,fontWeight:700,color:th.text}}>{d.user}</span>
                        <Badge label={d.status} color={d.status==='Validé'?'green':'yellow'} t={t}/>
                        <Badge label={d.type} color={d.type==='Mineur'?'purple':'gray'} t={t}/>
                      </div>
                      <div style={{display:'flex',gap:12,marginTop:2}}>
                        <span style={{fontSize:11,color:th.textMuted}}>📄 {d.doc}</span>
                        <span style={{fontSize:11,color:th.textMuted}}>📅 Reçu le {d.date}</span>
                        <span style={{fontSize:11,color:th.textMuted}}>🏦 {d.iban}</span>
                      </div>
                    </div>
                  </div>
                  {d.status==='Validé'&&<Badge label="Vérifié ✓" color="green" t={t}/>}
                </div>

                {/* Score bar pour profil en cours */}
                {d.user==='Nina_Dance'&&(
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:11,fontWeight:600,color:th.textMuted,marginBottom:4}}>Vérification de l'identité — Analyse en cours</div>
                    <div style={{background:'#dcfce7',border:'1px solid #bbf7d0',borderRadius:8,padding:'8px 12px',display:'flex',alignItems:'center',gap:8}}>
                      <div style={{fontSize:11,fontWeight:600,color:'#15803d'}}>Score : 98% <Badge label="Confié" color="green" t={t}/></div>
                      <div style={{flex:1,height:8,background:'#bbf7d0',borderRadius:4,overflow:'hidden'}}><div style={{width:'98%',height:'100%',background:'#10b981',borderRadius:4}}/></div>
                    </div>
                    <div style={{fontSize:11,color:th.textMuted,marginTop:8}}>3 Document(s)</div>
                  </div>
                )}

                {d.status!=='Validé'&&(
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <button style={{padding:'7px 14px',borderRadius:8,background:'#10b981',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>✓ Valider le dossier</button>
                    <button style={{padding:'7px 14px',borderRadius:8,background:th.inputBg,color:th.text,border:`1px solid ${th.cardBorder}`,fontSize:12,cursor:'pointer'}}>✉ Demander précision</button>
                    <button style={{marginLeft:'auto',padding:'7px 14px',borderRadius:8,background:t==='dark'?'#2d1515':'#fff1f2',color:'#ef4444',border:`1px solid ${t==='dark'?'#7f1d1d':'#fecaca'}`,fontSize:12,cursor:'pointer'}}>✕ Refuser</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Documents requis */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:4}}>Documents requis — Majeur</div>
              <div style={{fontSize:11,color:th.textMuted,marginBottom:14}}>Dossier complet obligatoire avant soumission</div>
              {[["Carte d'identité ou Passport","Recto/verso, en cours de validité",'📄'],["Selfie avec pièce d'identité","Photo en temps réel, image visible",'📸'],['IBAN / RIB',"Compte bancaire au nom du créateur",'🏦']].map(([name,desc,icon])=>(
                <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:18}}>{icon}</span>
                    <div><div style={{fontSize:13,fontWeight:600,color:th.text}}>{name}</div><div style={{fontSize:11,color:th.textMuted}}>{desc}</div></div>
                  </div>
                  <div style={{width:20,height:20,borderRadius:'50%',background:th.accentLight,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={12} color={th.accent}/></div>
                </div>
              ))}
            </div>
            <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:20,boxShadow:th.shadow}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:th.text}}>Documents requis — Mineur</div>
                  <div style={{fontSize:11,color:th.textMuted}}>Dossier complet obligatoire avant soumission</div>
                </div>
                <Badge label="Protection renforcée" color="purple" t={t}/>
              </div>
              {[['CNI du mineur',"Recto/verso, en cours de validité",'🪪'],['CNI du parent / tuteur légal',"Justificatif d'identité ou représentant",'🪪'],['Justificatif de lien familial',"Livret de famille, acte de naissance ou jugement",'📋'],['IBAN du parent / tuteur',"Compte au nom du parent",'🏦'],['Consentement parental signé',"Autorisation écrite et datée",'✍️'],['Selfie du mineur avec pièce',"Photo en temps réel, accompagné du parent",'📸'],['Selfie du mineur avec police',"Identification formelle",'🚔']].map(([name,desc,icon])=>(
                <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${th.tableBorder}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:16}}>{icon}</span>
                    <div><div style={{fontSize:12,fontWeight:600,color:th.text}}>{name}</div><div style={{fontSize:10,color:th.textMuted}}>{desc}</div></div>
                  </div>
                  <div style={{width:18,height:18,borderRadius:'50%',background:th.barBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon name="check" size={11} color={th.textMuted}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PARAMÈTRES
// ═══════════════════════════════════════════════════════════════════════════════
const PageSettings = ({ theme: t }) => {
  const th = themes[t]
  const [subPage, setSubPage] = useState('general')
  const [accentColor, setAccentColor] = useState('#3b6ef6')
  const [darkMode, setDarkMode] = useState(false)

  // Toggle component
  const Toggle = ({ on = true, onChange }) => (
    <div onClick={() => onChange && onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? accentColor : th.barBg, position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
    </div>
  )

  // Input component
  const Input = ({ value, placeholder, type = 'text', style: s = {} }) => (
    <input defaultValue={value} placeholder={placeholder} type={type} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', ...s }}/>
  )

  // Textarea component
  const Textarea = ({ value, placeholder, rows = 3 }) => (
    <textarea defaultValue={value} placeholder={placeholder} rows={rows} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}/>
  )

  // Select component
  const Select = ({ value, options, style: s = {} }) => (
    <select defaultValue={value} style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, cursor: 'pointer', ...s }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )

  // Setting row: label + description on left, control on right
  const SettingRow = ({ label, desc, children, noBorder = false }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: noBorder ? 'none' : `1px solid ${th.tableBorder}` }}>
      <div style={{ flex: 1, paddingRight: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: th.text }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )

  // Section card
  const Section = ({ icon, title, desc, children }) => (
    <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '20px 24px', boxShadow: th.shadow, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: desc ? 4 : 16, paddingBottom: desc ? 0 : 0 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: th.text }}>{title}</div>
          {desc && <div style={{ fontSize: 12, color: th.textMuted }}>{desc}</div>}
        </div>
      </div>
      {desc && <div style={{ borderTop: `1px solid ${th.tableBorder}`, marginTop: 12, paddingTop: 4 }}/>}
      {children}
    </div>
  )

  const subNav = [
    { section: 'GÉNÉRAL', items: [
      { id: 'general', label: 'Général', icon: '🌐' },
      { id: 'apparence', label: 'Apparence', icon: '🎨' },
    ]},
    { section: 'ÉQUIPE & ACCÈS', items: [
      { id: 'utilisateurs', label: 'Utilisateurs', icon: '👥' },
      { id: 'securite', label: 'Sécurité', icon: '🔒' },
    ]},
    { section: 'BUSINESS', items: [
      { id: 'paiements', label: 'Paiements', icon: '💳' },
      { id: 'abonnements', label: 'Abonnements', icon: '📋' },
      { id: 'campagnes', label: 'Campagnes', icon: '📣' },
    ]},
    { section: 'COMMUNICATION', items: [
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'integrations', label: 'Intégrations', icon: '🔗' },
    ]},
    { section: 'SYSTÈME', items: [
      { id: 'historique', label: 'Historique', icon: '📜' },
    ]},
  ]

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: th.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="settings" size={24} color={th.accent}/> Paramètres
          </h1>
          <p style={{ color: th.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Configuration de la plateforme Partnexx</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.card, color: th.text, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            ↺ Réinitialiser
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, background: accentColor, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            💾 Sauvegarder
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sub-nav */}
        <div style={{ width: 200, flexShrink: 0 }}>
          {subNav.map(group => (
            <div key={group.section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px 6px' }}>{group.section}</div>
              {group.items.map(item => (
                <button key={item.id} onClick={() => setSubPage(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 8, background: subPage === item.id ? accentColor : 'transparent', color: subPage === item.id ? '#fff' : th.textSecondary, fontSize: 13, fontWeight: subPage === item.id ? 600 : 500, border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 2 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── GÉNÉRAL ── */}
          {subPage === 'general' && (
            <div>
              {/* Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>🌐</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Général</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Identité et configuration globale de la plateforme</div>
                </div>
              </div>

              <Section icon="🏢" title="Identité de la plateforme">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Nom</label><Input value="Partnexx"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Email officiel</label><Input value="contact@partnexx.com" type="email"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Devise par défaut</label>
                    <Select value="EUR (€)" options={['EUR (€)', 'USD ($)', 'GBP (£)']} style={{ width: '100%' }}/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Fuseau horaire</label>
                    <Select value="Europe/Paris" options={['Europe/Paris', 'UTC', 'America/New_York']} style={{ width: '100%' }}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 8 }}>Langues disponibles</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {['Français', 'English', 'Español'].map(l => (
                      <span key={l} style={{ padding: '4px 12px', borderRadius: 20, background: th.inputBg, border: `1px solid ${th.cardBorder}`, fontSize: 12, color: th.text }}>{l}</span>
                    ))}
                    <button style={{ padding: '4px 12px', borderRadius: 20, background: 'none', border: `1px dashed ${th.cardBorder}`, fontSize: 12, color: th.textMuted, cursor: 'pointer' }}>+ Ajouter</button>
                  </div>
                </div>
              </Section>

              <Section icon="⚖️" title="Mentions légales">
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>CGU</label>
                  <Textarea value="https://partnexx.com/cgu" rows={2}/>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Politique de confidentialité</label>
                  <Textarea value="https://partnexx.com/privacy" rows={2}/>
                </div>
              </Section>

              <Section icon="⚡" title="Features" desc="Activer ou désactiver des fonctionnalités">
                {[
                  ['Matching IA créateurs', 'Suggestions automatiques basées sur le scoring', true],
                  ["Système d'escrow", 'Blocage des fonds avant validation', true],
                  ['Mode bêta', 'Activer les features en bêta pour les testeurs', false],
                  ['Page créateurs publique', 'Profils créateurs visibles sans connexion', true],
                  ['API externe', 'Accès API pour les partenaires', false],
                ].map(([label, desc, on], i, arr) => (
                  <SettingRow key={label} label={label} desc={desc} noBorder={i === arr.length - 1}>
                    <Toggle on={on}/>
                  </SettingRow>
                ))}
              </Section>
            </div>
          )}

          {/* ── APPARENCE ── */}
          {subPage === 'apparence' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>🎨</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Apparence</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Thème, couleurs et personnalisation de l'interface</div>
                </div>
              </div>

              <Section icon="🖌️" title="Thème" desc="Personnalisez l'apparence de l'interface">
                <SettingRow label="Mode sombre / clair" desc="Basculer entre le thème clair et sombre">
                  <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: `1px solid ${th.cardBorder}` }}>
                    {['Clair', 'Sombre'].map((mode, i) => (
                      <button key={mode} onClick={() => setDarkMode(i === 1)} style={{ padding: '7px 18px', background: darkMode === (i === 1) ? accentColor : th.inputBg, color: darkMode === (i === 1) ? '#fff' : th.text, border: 'none', fontSize: 13, fontWeight: darkMode === (i === 1) ? 600 : 400, cursor: 'pointer' }}>
                        {i === 0 ? '☀️' : '🌙'} {mode}
                      </button>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="Couleur d'accentuation" desc="Couleur principale de l'interface" noBorder>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['#3b6ef6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map(c => (
                      <div key={c} onClick={() => setAccentColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: accentColor === c ? `3px solid ${th.text}` : '3px solid transparent', boxSizing: 'border-box' }}/>
                    ))}
                  </div>
                </SettingRow>
              </Section>

              <Section icon="T" title="Typographie & densité" desc="Taille et espacement du texte">
                <SettingRow label="Taille de police" desc="Ajuster la taille du texte dans l'interface">
                  <Select value="Moyen" options={['Petit', 'Moyen', 'Grand']}/>
                </SettingRow>
                <SettingRow label="Densité de l'interface" desc="Espacement entre les éléments" noBorder>
                  <Select value="Confortable" options={['Compact', 'Confortable', 'Spacieux']}/>
                </SettingRow>
              </Section>

              <Section icon="☰" title="Navigation" desc="Comportement de la sidebar">
                <SettingRow label="Sidebar rétractée par défaut" desc="La sidebar démarre en mode icônes">
                  <Toggle on={false}/>
                </SettingRow>
                <SettingRow label="Animations" desc="Activer les transitions et animations" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>

              <Section icon="🌍" title="Langue de l'interface" desc="Langue d'affichage du back-office">
                <SettingRow label="Langue" desc="Changer la langue de l'interface admin" noBorder>
                  <Select value="🇫🇷 Français" options={['🇫🇷 Français', '🇬🇧 English', '🇪🇸 Español']}/>
                </SettingRow>
              </Section>
            </div>
          )}

          {/* ── UTILISATEURS ── */}
          {subPage === 'utilisateurs' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>👥</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Utilisateurs</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Rôles, permissions et gestion des administrateurs</div>
                </div>
              </div>

              <Section icon="🔑" title="Rôles & permissions" desc="Définissez les accès pour chaque rôle">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${th.tableBorder}` }}>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: th.textMuted }}>Action</th>
                        {['Super Admin', 'Admin', 'Support', 'Finance', 'Marketing'].map(r => (
                          <th key={r} style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: th.textMuted }}>{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Voir paiements',     ['Complet','Complet','Lecture','Complet','Lecture']],
                        ['Modifier paiements', ['Complet','Complet','Aucun','Complet','Aucun']],
                        ['Gérer litiges',      ['Complet','Complet','Complet','Aucun','Aucun']],
                        ['Modifier plans',     ['Complet','Complet','Aucun','Aucun','Aucun']],
                        ['Voir analytics',     ['Complet','Complet','Lecture','Complet','Complet']],
                        ['Gérer utilisateurs', ['Complet','Complet','Lecture','Aucun','Aucun']],
                        ['Paramètres',         ['Complet','Lecture','Aucun','Aucun','Aucun']],
                      ].map(([action, perms], i, arr) => (
                        <tr key={action} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: th.text }}>{action}</td>
                          {perms.map((p, pi) => {
                            const pColor = p === 'Complet' ? 'green' : p === 'Lecture' ? 'blue' : 'gray'
                            return <td key={pi} style={{ padding: '12px 16px', textAlign: 'center' }}><Badge label={p} color={pColor} t={t}/></td>
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'none', border: `1px dashed ${th.cardBorder}`, color: th.textSecondary, fontSize: 12, cursor: 'pointer', marginTop: 12 }}>
                  + Créer un rôle
                </button>
              </Section>

              <Section icon="👤" title="Admins actifs">
                {[
                  { initials: 'JD', name: 'Jean Dupont', email: 'jean@partnexx.com', role: 'Super Admin', status: 'Aujourd\'hui', roleColor: 'red' },
                  { initials: 'MM', name: 'Marie Martin', email: 'marie@partnexx.com', role: 'Admin', status: 'Hier', roleColor: 'blue' },
                  { initials: 'LS', name: 'Lucas Support', email: 'lucas@partnexx.com', role: 'Support', status: 'Il y a 5j', roleColor: 'green' },
                ].map((admin, i, arr) => (
                  <div key={admin.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{admin.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{admin.name}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{admin.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Badge label={admin.role} color={admin.roleColor} t={t}/>
                      <span style={{ fontSize: 11, color: th.textMuted }}>{admin.status}</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.textMuted }}>✏️</button>
                    </div>
                  </div>
                ))}
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'none', border: `1px dashed ${th.cardBorder}`, color: th.textSecondary, fontSize: 12, cursor: 'pointer', marginTop: 12 }}>
                  + Inviter un admin
                </button>
              </Section>
            </div>
          )}

          {/* ── SÉCURITÉ ── */}
          {subPage === 'securite' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Sécurité</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Authentification, sessions et conformité RGPD</div>
                </div>
              </div>

              <Section icon="🔐" title="Authentification" desc="Sécurité des comptes">
                <SettingRow label="Double authentification (2FA)" desc="Requise pour tous les admins">
                  <Toggle on={true}/>
                </SettingRow>
                <SettingRow label="Restriction IP" desc="Limiter l'accès admin à certaines IP">
                  <Toggle on={false}/>
                </SettingRow>
                <SettingRow label="IPs autorisées" noBorder>
                  <Input value="" placeholder="Ex: 192.168.1.0/24, 10.0.0.1" style={{ width: 280 }}/>
                </SettingRow>
              </Section>

              <Section icon="🖥️" title="Sessions">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Expiration session (heures)</label>
                    <Input value="24"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Max sessions simultanées</label>
                    <Input value="3"/>
                  </div>
                </div>
                <SettingRow label="Déconnexion auto inactivité" desc="Déconnecter après inactivité prolongée" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>

              <Section icon="🛡️" title="Données & RGPD" desc="Conformité et protection des données">
                <SettingRow label="Suppression de compte" desc="Permettre aux utilisateurs de supprimer leur compte">
                  <Toggle on={true}/>
                </SettingRow>
                <SettingRow label="Export données" desc="Permettre l'export des données personnelles">
                  <Toggle on={true}/>
                </SettingRow>
                <SettingRow label="Consentement cookies" desc="Bannière de consentement obligatoire" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>

              <Section icon="💳" title="Sécurité des transactions">
                <SettingRow label="KYC obligatoire" desc="Vérification identité avant tout paiement">
                  <Toggle on={true}/>
                </SettingRow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '12px 0' }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Limite transaction unique (€)</label>
                    <Input value="10000"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Limite journalière (€)</label>
                    <Input value="50000"/>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* ── PAIEMENTS ── */}
          {subPage === 'paiements' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>💳</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Paiements</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Commissions, escrow et sécurité des transactions</div>
                </div>
              </div>

              {/* Stripe Connect */}
              <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: th.shadow }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#635BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>S</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: th.text }}>Stripe Connect</span>
                      <Badge label="Connecté" color="green" t={t}/>
                    </div>
                    <div style={{ fontSize: 12, color: th.textMuted }}>Les paiements sont traités via Stripe · Mode live actif</div>
                  </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}>
                  🔗 Dashboard Stripe
                </button>
              </div>

              <Section icon="💰" title="Commissions" desc="Taux de commission Partnexx sur les transactions (via Stripe)">
                <SettingRow label="Commission · 15%" desc="Pourcentage prélevé sur chaque transaction">
                  <input type="range" min="5" max="30" defaultValue={15} style={{ width: 160, accentColor: accentColor }}/>
                </SettingRow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '12px 0' }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Frais fixes par transaction (€)</label><Input value="0.50"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Seuil paiement créateur (€)</label><Input value="30"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Délai validation (jours)</label><Input value="7"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Délai reversement (jours)</label><Input value="3"/></div>
                </div>
              </Section>

              <Section icon="🔒" title="Escrow" desc="Gestion du blocage de fonds">
                <SettingRow label="Escrow activé" desc="Bloquer les fonds jusqu'à validation">
                  <Toggle on={true}/>
                </SettingRow>
                <SettingRow label="Durée blocage · 7 jours" desc="Période avant libération auto">
                  <input type="range" min="1" max="30" defaultValue={7} style={{ width: 160, accentColor: accentColor }}/>
                </SettingRow>
                <SettingRow label="Libération automatique" desc="Libérer les fonds après la durée de blocage sans action" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>

              <Section icon="🚨" title="Fraude & sécurité" desc="Règles de détection de fraude">
                <SettingRow label="Blocage automatique transactions suspectes">
                  <Toggle on={true}/>
                </SettingRow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '12px 0' }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Seuil alerte montant (€)</label><Input value="5000"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Max transactions/jour</label><Input value="20"/></div>
                </div>
                <SettingRow label="Vérification identité obligatoire" desc="KYC requis avant tout paiement" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>
            </div>
          )}

          {/* ── ABONNEMENTS ── */}
          {subPage === 'abonnements' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>📋</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Abonnements</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Plans d'abonnement, essais et codes promo</div>
                </div>
              </div>

              {/* Stripe Billing */}
              <div style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 12, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: th.shadow }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#635BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>S</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: th.text }}>Stripe Billing</span>
                      <Badge label="Actif" color="green" t={t}/>
                    </div>
                    <div style={{ fontSize: 12, color: th.textMuted }}>Facturation récurrente gérée par Stripe Billing</div>
                  </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${th.cardBorder}`, background: th.inputBg, color: th.text, fontSize: 12, cursor: 'pointer' }}>
                  🔗 Stripe Billing
                </button>
              </div>

              <Section icon="📦" title="Plans d'abonnement" desc="Sync en temps réel avec Stripe Billing">
                {[
                  { icon: '⭐', name: 'Starter', desc: '5 campagnes · 10 créateurs · Support email', price: '39€', color: '#10b981', on: true },
                  { icon: '🚀', name: 'Pro', desc: '20 campagnes · 50 créateurs · Support prioritaire · Analytics', price: '99€', color: '#f59e0b', on: true },
                  { icon: '🏢', name: 'Enterprise', desc: 'Illimité · API · Account manager · Analytics avancés', price: '299€', color: '#8b5cf6', on: true },
                ].map((plan, i, arr) => (
                  <div key={plan.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                    <span style={{ fontSize: 18 }}>{plan.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{plan.name}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{plan.desc}</div>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: th.text, marginRight: 12 }}>{plan.price}<span style={{ fontSize: 11, color: th.textMuted }}>/mo</span></span>
                    <Toggle on={plan.on}/>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.textMuted, marginLeft: 4 }}>✏️</button>
                  </div>
                ))}
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'none', border: `1px dashed ${th.cardBorder}`, color: th.textSecondary, fontSize: 12, cursor: 'pointer', marginTop: 12 }}>
                  + Créer un plan
                </button>
              </Section>

              <Section icon="🎁" title="Essai gratuit">
                <SettingRow label="Durée essai · 14 jours" desc="Période d'essai gratuite">
                  <input type="range" min="7" max="30" defaultValue={14} style={{ width: 160, accentColor: accentColor }}/>
                </SettingRow>
                <SettingRow label="Accès complet pendant l'essai" desc="Toutes les features disponibles">
                  <Toggle on={true}/>
                </SettingRow>
                <SettingRow label="Conversion automatique" desc="Passer au plan payant après l'essai" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>

              <Section icon="♻️" title="Retry paiement" desc="Tentatives de relance automatique">
                <SettingRow label="Tentatives · 3" desc="Nombre de fois où l'on essaie avant suspension">
                  <input type="range" min="1" max="5" defaultValue={3} style={{ width: 160, accentColor: accentColor }}/>
                </SettingRow>
                <div style={{ padding: '12px 0' }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Délai entre tentatives (jours)</label>
                  <Input value="3" style={{ width: 120 }}/>
                </div>
              </Section>

              <Section icon="🎟️" title="Codes promo">
                {[
                  { code: 'LAUNCH50', desc: '50% — 3 mois', on: true },
                  { code: 'WELCOME30', desc: '20% — 1er mois', on: true },
                  { code: 'SUMMER30', desc: '30% — Permanent', on: false },
                ].map((c, i, arr) => (
                  <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: th.accent, background: th.accentLight, padding: '3px 10px', borderRadius: 6 }}>{c.code}</span>
                    <span style={{ fontSize: 12, color: th.textSecondary, flex: 1 }}>{c.desc}</span>
                    <Toggle on={c.on}/>
                  </div>
                ))}
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'none', border: `1px dashed ${th.cardBorder}`, color: th.textSecondary, fontSize: 12, cursor: 'pointer', marginTop: 12 }}>
                  + Ajouter un code
                </button>
              </Section>
            </div>
          )}

          {/* ── CAMPAGNES ── */}
          {subPage === 'campagnes' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>📣</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Campagnes</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Types de campagnes, matching et workflow</div>
                </div>
              </div>

              <Section icon="⚙️" title="Paramètres globaux">
                {[
                  ['UGC', 'Campagnes de contenu généré par utilisateurs', true],
                  ['Influence', 'Campagnes d\'influence marketing', true],
                  ['Affiliation', 'Campagnes d\'affiliation', true],
                  ['Ambassadeur', 'Programmes ambassadeur long-terme', true],
                ].map(([label, desc, on], i, arr) => (
                  <SettingRow key={label} label={label} desc={desc} noBorder={i === arr.length - 1}>
                    <Toggle on={on}/>
                  </SettingRow>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '12px 0 0' }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Budget minimum (€)</label><Input value="500"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Délai minimum (jours)</label><Input value="7"/></div>
                </div>
              </Section>

              <Section icon="🤖" title="Matching créateurs" desc="Configuration de l'algorithme de matching">
                <SettingRow label="Scoring IA automatique" desc="Score de pertinence basé sur niche, audience, historique">
                  <Toggle on={true}/>
                </SettingRow>
                <SettingRow label="Suggestions automatiques" desc="Proposer des créateurs à la création de campagne">
                  <Toggle on={true}/>
                </SettingRow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '12px 0 0' }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Nombre max de suggestions</label><Input value="10"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Score minimum (%)</label><Input value="60"/></div>
                </div>
              </Section>

              <Section icon="🔄" title="Workflow campagne">
                <SettingRow label="Validation admin obligatoire" desc="Les campagnes doivent être validées avant lancement">
                  <Toggle on={false}/>
                </SettingRow>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '12px 0' }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Max créateurs par campagne</label><Input value="50"/></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: th.textMuted, display: 'block', marginBottom: 6 }}>Délai relance auto (jours)</label><Input value="3"/></div>
                </div>
                <SettingRow label="Relances automatiques" desc="Relancer les créateurs qui n'ont pas répondu" noBorder>
                  <Toggle on={true}/>
                </SettingRow>
              </Section>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {subPage === 'notifications' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>🔔</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Notifications</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Canaux, événements et templates de notification</div>
                </div>
              </div>

              <Section icon="📡" title="Canaux de notification" desc="Activer/désactiver les canaux">
                {[
                  ['Email', 'Notification par email', true],
                  ['Push', 'Notification navigateur/mobile', true],
                  ['In-App', 'Notification dans l\'application', true],
                ].map(([label, desc, on], i, arr) => (
                  <SettingRow key={label} label={label} desc={desc} noBorder={i === arr.length - 1}>
                    <Toggle on={on}/>
                  </SettingRow>
                ))}
              </Section>

              <Section icon="⚡" title="Événements" desc="Configurer les notifications par événement">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${th.tableBorder}` }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: th.textMuted, width: '40%' }}>Événement</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: th.textMuted }}>📧</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: th.textMuted }}>🔔</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: th.textMuted }}>📱</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Nouveau message', true, true, true],
                        ['Placement reçu', true, false, true],
                        ['Campagne créée', true, false, true],
                        ['Livrable validé', true, true, true],
                        ['Contrat signé', true, false, true],
                        ['Litige ouvert', true, true, true],
                        ['Abonnement expiré', true, false, false],
                        ['Relance automatique', true, false, false],
                      ].map(([event, email, push, inapp], i, arr) => (
                        <tr key={event} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                          <td style={{ padding: '10px 12px', fontSize: 13, color: th.text }}>{event}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}><Toggle on={email}/></td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}><Toggle on={push}/></td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}><Toggle on={inapp}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section icon="📝" title="Templates" desc="Personnaliser les messages">
                {['Bienvenue', 'Placement reçu', 'Campagne créée', 'Relance créateur'].map((tpl, i, arr) => (
                  <div key={tpl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                    <span style={{ fontSize: 13, color: th.text }}>{tpl}</span>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 6, background: th.inputBg, color: th.accent, border: `1px solid ${th.cardBorder}`, fontSize: 12, cursor: 'pointer' }}>
                      ✏️ Modifier
                    </button>
                  </div>
                ))}
              </Section>
            </div>
          )}

          {/* ── INTÉGRATIONS ── */}
          {subPage === 'integrations' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>🔗</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Intégrations</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Services connectés et webhooks</div>
                </div>
              </div>

              <Section icon="🔌" title="Intégrations connectées" desc="Services liés à Partnexx">
                {[
                  { name: 'Stripe', desc: 'Paiement', status: 'connecté', statusColor: 'green', icon: '💳' },
                  { name: 'SendGrid', desc: 'Email', status: 'connecté', statusColor: 'green', icon: '📧' },
                  { name: 'Google Analytics', desc: 'Analytics', status: 'non connecté', statusColor: 'gray', icon: '📊' },
                  { name: 'Zapier', desc: 'Automatisation', status: 'non connecté', statusColor: 'gray', icon: '⚡' },
                  { name: 'Webhooks', desc: 'Développement', status: 'actif', statusColor: 'blue', icon: '🪝' },
                  { name: 'CRM', desc: 'Vente', status: 'non connecté', statusColor: 'gray', icon: '👥' },
                ].map((intg, i, arr) => (
                  <div key={intg.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: th.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{intg.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{intg.name}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{intg.desc}</div>
                    </div>
                    <Badge label={intg.status} color={intg.statusColor} t={t}/>
                    <button style={{ padding: '6px 14px', borderRadius: 8, background: intg.status !== 'non connecté' ? th.inputBg : accentColor, color: intg.status !== 'non connecté' ? th.text : '#fff', border: intg.status !== 'non connecté' ? `1px solid ${th.cardBorder}` : 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                      {intg.status !== 'non connecté' ? 'Configurer' : 'Connecter'}
                    </button>
                  </div>
                ))}
              </Section>

              <Section icon="🪝" title="Webhooks" desc="Envoyer des événements à des URLs externes">
                <div style={{ padding: '12px 16px', borderRadius: 10, background: th.inputBg, border: `1px solid ${th.cardBorder}`, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>https://hooks.example.com/partnexx</div>
                    <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>payment.completed, campaign.created</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge label="Actif" color="green" t={t}/>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.textMuted }}>✏️</button>
                  </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'none', border: `1px dashed ${th.cardBorder}`, color: th.textSecondary, fontSize: 12, cursor: 'pointer' }}>
                  + Ajouter un webhook
                </button>
              </Section>
            </div>
          )}

          {/* ── HISTORIQUE ── */}
          {subPage === 'historique' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>📜</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: th.text }}>Historique</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>Journal des modifications de paramètres</div>
                </div>
              </div>

              <Section icon="📋" title="Historique des modifications" desc="Chaque changement de paramètre est tracé">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${th.tableBorder}` }}>
                      {['Qui', 'Quand', 'Action'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: th.textMuted }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Admin", "Aujourd'hui 14:32", "Commission modifiée : 12% → 15%"],
                      ["Admin", "Hier 09:15", "Plan Enterprise créé"],
                      ["Support", "Il y a 2j", "Feature matching IA activée"],
                      ["Admin", "Il y a 3j", "Délai escrow modifié : 5j → 7j"],
                      ["Finance", "Il y a 5j", "Seuil paiement créateur : 50€ → 30€"],
                      ["Admin", "Il y a 7j", "Plan Starter prix modifié : 29€ → 39€"],
                    ].map(([who, when, action], i, arr) => (
                      <tr key={i} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${th.tableBorder}` : 'none' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <Badge label={who} color={who === 'Admin' ? 'blue' : who === 'Finance' ? 'green' : 'gray'} t={t}/>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: th.textSecondary }}>{when}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: th.text }}>{action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── PLACEHOLDER PAGES ────────────────────────────────────────────────────────
const PlaceholderPage = ({ name, icon, theme: t }) => {
  const th = themes[t]
  return (
    <div style={{padding:'32px 36px',display:'flex',flexDirection:'column',gap:24}}>
      <h1 style={{fontSize:26,fontWeight:700,color:th.text,margin:0,display:'flex',alignItems:'center',gap:10}}>
        <Icon name={icon} size={24} color={th.accent}/> {name}
      </h1>
      <div style={{background:th.card,border:`1px solid ${th.cardBorder}`,borderRadius:12,padding:'60px 40px',textAlign:'center',color:th.textMuted,boxShadow:th.shadow}}>
        <Icon name={icon} size={48} color={th.textMuted}/>
        <p style={{marginTop:16,fontSize:15,fontWeight:500}}>Page {name} — En cours de développement</p>
        <p style={{fontSize:13,marginTop:4}}>Envoie les screens pour qu'on la reproduise !</p>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════
const Sidebar = ({ activePage, setPage, theme: t, toggleTheme }) => {
  const th = themes[t]

  const sections = [
    {
      label: 'Principal',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'users', label: 'Utilisateurs', icon: 'users' },
      ]
    },
    {
      label: 'Opérations',
      items: [
        { id: 'campaigns', label: 'Campagnes', icon: 'campaign' },
        { id: 'payments', label: 'Paiements', icon: 'payment' },
        { id: 'litiges', label: 'Litiges', icon: 'dispute' },
      ]
    },
    {
      label: 'Plateforme',
      items: [
        { id: 'support', label: 'Support', icon: 'support' },
        { id: 'analytics', label: 'Analytics', icon: 'analytics' },
        { id: 'score', label: 'Partnexx Score', icon: 'score' },
        { id: 'marketing', label: 'Marketing', icon: 'marketing' },
        { id: 'moderation', label: 'Modération', icon: 'moderation' },
        { id: 'settings', label: 'Paramètres', icon: 'settings' },
      ]
    }
  ]

  return (
    <div style={{ width: 220, flexShrink: 0, background: th.sidebar, borderRight: `1px solid ${th.cardBorder}`, height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${th.cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: th.text, letterSpacing: '-0.02em' }}>Partnexx</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '12px 12px' }}>
        {sections.map(sec => (
          <div key={sec.label} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 6px' }}>{sec.label}</div>
            {sec.items.map(item => {
              const active = activePage === item.id
              return (
                <button key={item.id} onClick={() => setPage(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: active ? th.sidebarActive : 'transparent', color: active ? th.sidebarActiveText : th.textSecondary, fontSize: 13, fontWeight: active ? 600 : 500, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', marginBottom: 2 }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = th.sidebarHover }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  <Icon name={item.icon} size={16} color={active ? th.sidebarActiveText : th.textSecondary} />
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: `1px solid ${th.cardBorder}` }}>
        <button onClick={toggleTheme} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', color: th.textSecondary, fontSize: 13, border: 'none', cursor: 'pointer' }}>
          <Icon name={t === 'dark' ? 'sun' : 'moon'} size={16} color={th.textSecondary} />
          {t === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════════════════════
const Topbar = ({ theme: t }) => {
  const th = themes[t]
  return (
    <div style={{ height: 56, borderBottom: `1px solid ${th.cardBorder}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, background: th.sidebar, position: 'sticky', top: 0, zIndex: 10 }}>
      <button style={{ width: 32, height: 32, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="menu" size={18} color={th.textSecondary} />
      </button>
      <div style={{ flex: 1, position: 'relative', maxWidth: 360 }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Icon name="search" size={14} color={th.textMuted} /></div>
        <input placeholder="Rechercher..." style={{ width: '100%', padding: '7px 12px 7px 36px', borderRadius: 8, border: `1px solid ${th.inputBorder}`, background: th.inputBg, color: th.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="bell" size={20} color={th.textSecondary} />
          <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </button>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>AD</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [theme, setTheme] = useState('light')
  const [page, setPage] = useState('dashboard')
 
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const th = themes[theme]
 
  // ── Données Supabase temps réel ──────────────────────────────────────────
  const {
    loading,
    stats,
    users,
    campaigns,
    transactions,
    disputes,
    tickets,
    kyc,
    marketing,
    suspendUser,
    activateUser,
    blockCampaign,
    unblockCampaign,
    releaseTransaction,
    resolveDispute,
    approveKyc,
    rejectKyc,
    closeTicket,
    createMarketingContent,
    updateMarketingContent,
    deleteMarketingContent, 
    publishMarketingContent,
 } = useAdminData()
 
  const renderPage = () => {
    switch (page) {
      case 'dashboard': return (
        <PageDashboard
          theme={theme}
          dbStats={stats}
          dbLoading={loading}
        />
      )
      case 'users': return (
        <PageUsers
          theme={theme}
          dbUsers={users}
          dbLoading={loading}
          onSuspend={suspendUser}
          onActivate={activateUser}
        />
      )
      case 'campaigns': return (
        <PageCampaigns
          theme={theme}
          dbCampaigns={campaigns}
          dbLoading={loading}
          onBlock={blockCampaign}
          onUnblock={unblockCampaign}
        />
      )
      case 'payments': return (
        <PagePayments
          theme={theme}
          dbTransactions={transactions}
          dbLoading={loading}
          onRelease={releaseTransaction}
        />
      )
      case 'litiges': return (
        <PageLitiges
          theme={theme}
          dbDisputes={disputes}
          dbLoading={loading}
          onResolve={resolveDispute}
        />
      )
      case 'support': return (
        <PageSupport
          theme={theme}
          dbTickets={tickets}
          dbLoading={loading}
          onClose={closeTicket}
        />
      )
      case 'analytics':  return <PageAnalytics  theme={theme} />
      case 'score':      return <PageScore      theme={theme} />
      case 'marketing': return (
  <PageMarketing
    theme={theme}
    dbMarketing={marketing}
    dbLoading={loading}
    onPublish={publishMarketingContent}
    onUpdate={updateMarketingContent}
    onDelete={deleteMarketingContent}
    onCreate={createMarketingContent}
  />
  )
      case 'moderation': return (
        <PageModeration
          theme={theme}
          dbUsers={users}
          dbKyc={kyc}
          dbLoading={loading}
          onApproveKyc={approveKyc}
          onRejectKyc={rejectKyc}
          onSuspend={suspendUser}
        />
      )
      case 'settings': return <PageSettings theme={theme} />
      default: return <PageDashboard theme={theme} dbStats={stats} dbLoading={loading} />
    }
  }
 
  return (
    <div style={{ display: 'flex', background: th.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Sidebar activePage={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        <Topbar theme={theme} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}