'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import supabase from '@/lib/supabase'
import { ThemeProvider, useTheme } from './ThemeContext'

function SidebarAndContent({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { isDark, colors } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ADMIN : on court-circuite tout le layout — pas de sidebar influencer/creator
  // La sidebar admin est gérée directement dans app/dashboard/admin/page.js
  // ─────────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard/admin')) {
    return <>{children}</>
  }

  // Sidebar influencer
  const influencerItems = [
    { icon: '🏠', label: 'Accueil',               route: '/dashboard/influencer' },
    { icon: '📋', label: 'Gestion des campagnes', route: '/dashboard/campaigns' },
    { icon: '🤝', label: 'Partenaires',            route: '/dashboard/partenaires' },
    { icon: '💬', label: 'Messagerie',             route: '/dashboard/messagerie' },
    { icon: '📊', label: 'Analytics',              route: '/dashboard/analytics' },
    { icon: '💰', label: 'Gestion Financière',     route: '/dashboard/finance' },
    { icon: '📝', label: 'Contrats',               route: '/dashboard/contracts' },
    { icon: '📅', label: 'Calendrier',             route: '/dashboard/calendrier' },
    { icon: '📚', label: 'Ressources & Templates', route: '/dashboard/ressources' },
    { icon: '👤', label: 'Compte entreprise',      route: '/dashboard/compte' },
    { icon: '⚙️', label: 'Paramètres',            route: '/dashboard/parametres' },
  ]

  // Sidebar creator
  const creatorItems = [
    { icon: '🏠', label: 'Accueil',               route: '/dashboard/creator' },
    { icon: '🔍', label: 'Opportunités',           route: '/dashboard/creator/opportunites' },
    { icon: '🤝', label: 'Mes collaborations',     route: '/dashboard/creator/collaborations' },
    { icon: '💬', label: 'Messagerie',             route: '/dashboard/creator/messagerie' },
    { icon: '🎬', label: 'Studio UGC',             route: '/dashboard/creator/studio-ugc' },
    { icon: '⭐', label: 'Partnexx Score',         route: '/dashboard/creator/partnexx-score' },
    { icon: '📊', label: 'Analytics',              route: '/dashboard/creator/analytics' },
    { icon: '📝', label: 'Contrats & Paiements',   route: '/dashboard/creator/contrats' },
    { icon: '💬', label: 'Notes & Feedbacks',      route: '/dashboard/creator/notes' },
    { icon: '📚', label: 'Ressources & Templates', route: '/dashboard/creator/ressources' },
    { icon: '👤', label: 'Mon profil',             route: '/dashboard/creator/profil' },
    { icon: '⚙️', label: 'Paramètres',            route: '/dashboard/creator/parametres' },
  ]

  const isCreator = pathname.startsWith('/dashboard/creator')
  const navItems = isCreator ? creatorItems : influencerItems

  const darkCSS = `
    main [style*="background: #f8f9ff"],
    main [style*="background:#f8f9ff"] { background: #0f0f1a !important; }
    main [style*="background: rgb(248, 249, 255)"] { background: #0f0f1a !important; }
    main [style*="background: #fff;"],
    main [style*="background: #fff }"],
    main [style*="background: #fff,"],
    main [style*="background:#fff"] { background: #1e1e32 !important; }
    main [style*="background: white"] { background: #1e1e32 !important; }
    main [style*="background: #f8f9fa"],
    main [style*="background:#f8f9fa"] { background: #16162a !important; }
    main [style*="background: #f3f4f6"],
    main [style*="background:#f3f4f6"] { background: #1e1e2e !important; }
    main [style*="background: #fafafa"],
    main [style*="background:#fafafa"] { background: #18182a !important; }
    main [style*="background: #f9fafb"],
    main [style*="background:#f9fafb"] { background: #18182a !important; }
    main [style*="background: #fef9c3"] { background: #2a2200 !important; }
    main [style*="background: #f0fdf4"] { background: #0d2e1a !important; }
    main [style*="background: #fdf2f8"] { background: #2a0a1e !important; }
    main [style*="background: #ede9fe"] { background: #1a0a2e !important; }
    main [style*="background: #dbeafe"] { background: #0d1a2e !important; }
    main [style*="background: #dcfce7"] { background: #0d2e1a !important; }
    main [style*="background: #fee2e2"] { background: #2e0d0d !important; }
    main [style*="background: #fef3c7"] { background: #2a2200 !important; }
    main [style*="background: #faf5ff"] { background: #1a0a2e !important; }
    main [style*="background: #eff6ff"] { background: #0d1a2e !important; }
    main [style*="background: #fefce8"] { background: #2a2200 !important; }
    main [style*="background: #fff7ed"] { background: #2a1a00 !important; }
    main [style*="background: #fdf4ff"] { background: #1a0a2e !important; }
    main [style*="background: #f0f9ff"] { background: #0d1a2e !important; }
    main [style*="color: #1a202c"] { color: #f0f0ff !important; }
    main [style*="color:#1a202c"] { color: #f0f0ff !important; }
    main [style*="color: #2d3748"] { color: #e0e0f0 !important; }
    main [style*="color:#2d3748"] { color: #e0e0f0 !important; }
    main [style*="color: #4a5568"] { color: #b0b0d0 !important; }
    main [style*="color:#4a5568"] { color: #b0b0d0 !important; }
    main [style*="color: #718096"] { color: #9090b0 !important; }
    main [style*="color:#718096"] { color: #9090b0 !important; }
    main [style*="color: #a0aec0"] { color: #7070a0 !important; }
    main [style*="color:#a0aec0"] { color: #7070a0 !important; }
    main [style*="color: #6b7280"] { color: #9090b0 !important; }
    main [style*="color:#6b7280"] { color: #9090b0 !important; }
    main [style*="border: 1px solid #f0f0f0"] { border-color: #2d2d4a !important; }
    main [style*="border:1px solid #f0f0f0"] { border-color: #2d2d4a !important; }
    main [style*="border: 1px solid #e2e8f0"] { border-color: #2d2d4a !important; }
    main [style*="border:1px solid #e2e8f0"] { border-color: #2d2d4a !important; }
    main [style*="border: 1.5px solid #e2e8f0"] { border-color: #2d2d4a !important; }
    main [style*="border-bottom: 1px solid #f0f0f0"] { border-bottom-color: #2d2d4a !important; }
    main [style*="border-top: 1px solid #f0f0f0"] { border-top-color: #2d2d4a !important; }
    main input:not([type="checkbox"]):not([type="radio"]) {
      background: #16162a !important; color: #f0f0ff !important; border-color: #2d2d4a !important;
    }
    main textarea { background: #16162a !important; color: #f0f0ff !important; border-color: #2d2d4a !important; }
    main select { background: #16162a !important; color: #f0f0ff !important; border-color: #2d2d4a !important; }
    main input::placeholder, main textarea::placeholder { color: #6060a0 !important; }
    main { background: #0f0f1a !important; }
  `

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#lg-load)"/>
            <defs><linearGradient id="lg-load" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
          </svg>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      transition: 'background 0.3s',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {isDark && <style dangerouslySetInnerHTML={{ __html: darkCSS }} />}

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? '220px' : '60px',
        flexShrink: 0,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.15s ease, background 0.3s',
        overflow: 'hidden',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#sgl-main)"/>
              <defs><linearGradient id="sgl-main" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
            </svg>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: colors.text }}>Partnexx</div>
                <div style={{ fontSize: '0.65rem', color: colors.textMuted, fontWeight: 300, lineHeight: 1.2 }}>
                  Des idées qui connectent,{'\n'}des partenariats qui transforment.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => {
            const isActive = item.route === '/dashboard/influencer' || item.route === '/dashboard/creator'
              ? pathname === item.route
              : pathname === item.route || pathname.startsWith(item.route + '/')
            return (
              <button
                key={item.route}
                onClick={() => router.push(item.route)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.1))'
                    : 'transparent',
                  color: isActive ? '#a855f7' : colors.textSecondary,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 400,
                  marginBottom: '0.15rem',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </button>
            )
          })}
        </nav>

        {/* Thème + Logout */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: `1px solid ${colors.border}` }}>
          {sidebarOpen && (
            <div style={{ fontSize: '0.72rem', color: colors.textMuted, padding: '0.3rem 0.75rem', marginBottom: '0.25rem' }}>
              {isDark ? '🌙 Mode sombre' : '☀️ Mode clair'}
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.65rem 0.75rem',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.82rem',
            fontWeight: 500,
            textAlign: 'left',
            whiteSpace: 'nowrap',
          }}>
            <span>🚪</span>{sidebarOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
        position: 'fixed',
        top: '1rem',
        left: sidebarOpen ? '228px' : '68px',
        zIndex: 101,
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem',
        transition: 'left 0.15s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: colors.textSecondary,
      }}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* MAIN */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '220px' : '60px',
        transition: 'margin-left 0.15s ease, background 0.3s',
        minHeight: '100vh',
        background: colors.bg,
      }}>
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider>
      <SidebarAndContent>{children}</SidebarAndContent>
    </ThemeProvider>
  )
}