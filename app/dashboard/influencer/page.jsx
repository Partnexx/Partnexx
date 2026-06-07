'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useInfluencerData } from '@/lib/hook/useInfluencerData'
import { useNotifications } from '@/lib/hook/useNotifications'
import dynamic from 'next/dynamic'
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import LevelUpProvider from '@/components/LevelUpProvider'
import PartnexxIntro from '@/components/PartnexxIntro'

const AccueilSection = dynamic(() => import('./sections/AccueilSection'), { ssr: false })
const OpportunitesSection = dynamic(() => import('./sections/OpportunitesSection'), { ssr: false })
const CollaborationsSection = dynamic(() => import('./sections/CollaborationsSection'), { ssr: false })
const MessagerieSection = dynamic(() => import('./sections/MessagerieSection'), { ssr: false })
const UGCCreatorSection = dynamic(() => import('./sections/UGCCreatorSection'), { ssr: false })
const ContratsSection = dynamic(() => import('./sections/ContratsSection'), { ssr: false })
const RessourcesSection = dynamic(() => import('./sections/RessourcesSection'), { ssr: false })
const ProfilSection = dynamic(() => import('./sections/ProfilSection'), { ssr: false })
const FeedbackSection = dynamic(() => import('./sections/FeedbackSection'), { ssr: false })
const ParametresSection = dynamic(() => import('./sections/ParametresSection'), { ssr: false })
const PartnextScoreSection = dynamic(() => import('./sections/PartnextScoreSection'), { ssr: false })
const StatistiquesSection = dynamic(() => import('./sections/StatistiquesSection'), { ssr: false })

const menuItems = [
  { id: 'accueil', label: 'Accueil', icon: '🏠' },
  { id: 'opportunites', label: 'Opportunités', icon: '🔍' },
  { id: 'collaborations', label: 'Mes collaborations', icon: '🤝' },
  { id: 'messagerie', label: 'Messagerie', icon: '💬' },
  { id: 'ugc', label: 'Studio UGC', icon: '🎬' },
  { id: 'partnexx-score', label: 'Partnexx Score', icon: '⭐' },
  { id: 'statistiques', label: 'Analytics', icon: '📊' },
  { id: 'contrats', label: 'Contrats & Paiements', icon: '📋' },
  { id: 'feedback', label: 'Notes & Feedbacks', icon: '💬' },
  { id: 'ressources', label: 'Ressources & Templates', icon: '🔧' },
  { id: 'profil', label: 'Mon profil', icon: '👤' },
  { id: 'parametres', label: 'Paramètres', icon: '⚙️' },
]

export default function DashboardInfluencer() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('accueil')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return router.push('/login')
      }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
  }, [])

  const { collaborations, transactions, contracts, metrics, loading } = useInfluencerData(user?.id)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'toi'

  const renderSection = () => {
    const props = { user, profile, collaborations, transactions, contracts, metrics, notifications, unreadCount, markAsRead, markAllAsRead, loading }
    switch (activeSection) {
      case 'accueil': return <AccueilSection key="accueil" {...props} />
      case 'opportunites': return <OpportunitesSection key="opportunites" {...props} />
      case 'collaborations': return <CollaborationsSection key="collaborations" {...props} />
      case 'statistiques': return <StatistiquesSection key="statistiques" {...props} />
      case 'messagerie': return <MessagerieSection key="messagerie" {...props} />
      case 'ugc': return <UGCCreatorSection key="ugc" {...props} />
      case 'contrats': return <ContratsSection key="contrats" {...props} />
      case 'ressources': return <RessourcesSection key="ressources" {...props} />
      case 'profil': return <ProfilSection key="profil" {...props} />
      case 'feedback': return <FeedbackSection key="feedback" {...props} />
      case 'parametres': return <ParametresSection key="parametres" {...props} />
      case 'partnexx-score': return <PartnextScoreSection key="partnexx-score" {...props} />
      default: return <AccueilSection key="accueil" {...props} />
    }
  }

  return (
    <LevelUpProvider user={user}>
      <div className="min-h-screen bg-background flex w-screen">
        <PartnexxIntro ready={!loading && !!user} />
        {/* SIDEBAR */}
        <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col z-50 overflow-y-auto ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          {/* Header */}
          <div className={`p-3 border-b border-border flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Partnexx" className="w-9 h-9 object-contain shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">PARTNEXX</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">Where Partnerships Begin</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {firstName.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{profile?.full_name || firstName}</p>
                  <p className="text-xs text-muted-foreground truncate">@{profile?.username || 'influenceur'}</p>
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
    </LevelUpProvider>
  )
}
