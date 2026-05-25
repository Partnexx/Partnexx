'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import dynamic from 'next/dynamic'

const AccueilSection = dynamic(() => import('./sections/AccueilSection'), { ssr: false })
const CampagnesSection = dynamic(() => import('./sections/CampagnesSection'), { ssr: false })
const PartenairesSection = dynamic(() => import('./sections/PartenairesSection'), { ssr: false })
const MessagerieSection = dynamic(() => import('./sections/MessagerieSection'), { ssr: false })
const AnalyticsSection = dynamic(() => import('./sections/AnalyticsSection'), { ssr: false })
const FinancesSection = dynamic(() => import('./sections/FinancesSection'), { ssr: false })
const ContratsSection = dynamic(() => import('./sections/ContratsSection'), { ssr: false })
const CalendrierSection = dynamic(() => import('./sections/CalendrierSection'), { ssr: false })
const RessourcesSection = dynamic(() => import('./sections/RessourcesSection'), { ssr: false })
const CompteSection = dynamic(() => import('./sections/CompteSection'), { ssr: false })
const ParametresSection = dynamic(() => import('./sections/ParametresSection'), { ssr: false })

const menuItems = [
  { id: 'accueil', label: 'Accueil', icon: '🏠' },
  { id: 'campagnes', label: 'Gestion des campagnes', icon: '🚀' },
  { id: 'partenaires', label: 'Partenaires', icon: '🤝' },
  { id: 'messagerie', label: 'Messagerie', icon: '💬' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'finances', label: 'Gestion Financière', icon: '💰' },
  { id: 'contrats', label: 'Contrats', icon: '📄' },
  { id: 'calendrier', label: 'Calendrier', icon: '📅' },
  { id: 'ressources', label: 'Ressources & Templates', icon: '📚' },
  { id: 'compte', label: 'Compte entreprise', icon: '🏢' },
  { id: 'parametres', label: 'Paramètres', icon: '⚙️' },
]

export default function DashboardBrand() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('accueil')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      if (prof?.role && prof.role !== 'brand') {
        router.push('/dashboard/influencer')
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Marque'

  const renderSection = () => {
    const props = { user, profile, setActiveSection }
    switch (activeSection) {
      case 'accueil': return <AccueilSection key="accueil" {...props} />
      case 'campagnes': return <CampagnesSection key="campagnes" {...props} />
      case 'partenaires': return <PartenairesSection key="partenaires" {...props} />
      case 'messagerie': return <MessagerieSection key="messagerie" {...props} />
      case 'analytics': return <AnalyticsSection key="analytics" {...props} />
      case 'finances': return <FinancesSection key="finances" {...props} />
      case 'contrats': return <ContratsSection key="contrats" {...props} />
      case 'calendrier': return <CalendrierSection key="calendrier" {...props} />
      case 'ressources': return <RessourcesSection key="ressources" {...props} />
      case 'compte': return <CompteSection key="compte" {...props} />
      case 'parametres': return <ParametresSection key="parametres" {...props} />
      default: return <AccueilSection key="accueil" {...props} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex w-screen">
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col z-50 overflow-y-auto ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">P</div>
              <div className="flex flex-col">
                <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Partnexx</span>
                <span className="text-[10px] text-muted-foreground leading-tight">Des idées qui connectent</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-sm"
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-2 border-t border-border space-y-1">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{profile?.full_name || firstName}</p>
                <p className="text-xs text-muted-foreground truncate">Marque</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <span>🚪</span>
            {!sidebarCollapsed && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`flex-1 transition-all duration-300 min-h-screen min-w-0 overflow-hidden ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 max-w-full overflow-hidden">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}