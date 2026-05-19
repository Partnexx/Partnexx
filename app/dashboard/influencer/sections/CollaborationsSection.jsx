'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import {
  Search, Calendar, DollarSign, Users, Target,
  Star, Eye, TrendingUp, TrendingDown,
  Clock, MessageCircle, Upload, FileText, Download,
  Zap, Brain, Award, BarChart3,
  AlertCircle, CheckCircle, Package, MessageSquare, ArrowUpRight,
} from 'lucide-react'
import supabase from '@/lib/supabase'

const collaborations = [
  { id: "1", title: "Campagne Skincare Naturelle", category: "beauty", brand: { name: "GreenBeauty", logo: "GB", contact: "Marie Dubois", verified: true }, status: "active", priority: "high", startDate: "15 Janvier 2024", endDate: "15 Février 2024", payment: { type: "salary", amount: "800€", numericValue: 800 }, progress: 65, deliverables: [{ id: "1", title: "Post Instagram", status: "approved", dueDate: "20 Jan" }, { id: "2", title: "Stories (3)", status: "delivered", dueDate: "25 Jan" }, { id: "3", title: "Reel", status: "pending", dueDate: "30 Jan" }, { id: "4", title: "Carrousel éducatif", status: "pending", dueDate: "5 Fév" }], performance: { financial: { earned: "520€", expected: "800€" }, reach: { views: "78K", engagement: "6.8%", audience: "45K" } }, contractUrl: "#", tags: ["Skincare", "Bio", "Wellbeing"] },
  { id: "2", title: "Review Tech Smartwatch", category: "tech", brand: { name: "TechFlow", logo: "TF", contact: "Thomas Martin", verified: true }, status: "active", priority: "medium", startDate: "indéterminé", endDate: "indéterminé", payment: { type: "commission", amount: "15% par vente", numericValue: 245 }, progress: 40, deliverables: [{ id: "1", title: "Unboxing vidéo", status: "approved", dueDate: "À venir" }, { id: "2", title: "Review détaillée", status: "pending", dueDate: "À définir" }, { id: "3", title: "Tutoriel d'utilisation", status: "pending", dueDate: "À définir" }], performance: { financial: { earned: "245€", expected: "Variable" }, reach: { views: "45K", engagement: "4.2%", audience: "38K" } }, contractUrl: "#", tags: ["Tech", "Wearables", "Review"] },
  { id: "3", title: "Partenariat Fitness Premium", category: "fitness", brand: { name: "PowerGym", logo: "PG", contact: "Alex Johnson", verified: true }, status: "active", priority: "high", startDate: "10 Janvier 2024", endDate: "10 Mars 2024", payment: { type: "salary", amount: "2500€", numericValue: 2500 }, progress: 85, deliverables: [{ id: "1", title: "Programme d'entraînement", status: "approved", dueDate: "15 Jan" }, { id: "2", title: "Série de stories (14 jours)", status: "approved", dueDate: "20 Jan" }, { id: "3", title: "Live Q&A", status: "delivered", dueDate: "25 Jan" }, { id: "4", title: "Post récapitulatif", status: "pending", dueDate: "10 Fév" }, { id: "5", title: "Témoignage vidéo", status: "pending", dueDate: "1 Mar" }], performance: { financial: { earned: "2100€", expected: "2500€" }, reach: { views: "125K", engagement: "9.2%", audience: "68K" } }, contractUrl: "#", tags: ["Fitness", "Workout", "Lifestyle"] },
  { id: "4", title: "Collaboration Bijoux Artisanaux", category: "fashion", brand: { name: "LuxeCraft", logo: "LC", contact: "Emma Laurent", verified: false }, status: "active", priority: "low", startDate: "1 Février 2024", endDate: "15 Février 2024", payment: { type: "product", amount: "Produits (~350€)", numericValue: 350 }, progress: 20, deliverables: [{ id: "1", title: "Post de lancement", status: "pending", dueDate: "5 Fév" }, { id: "2", title: "Stories unboxing", status: "pending", dueDate: "8 Fév" }, { id: "3", title: "Code promo exclusif", status: "pending", dueDate: "10 Fév" }], performance: { financial: { earned: "0€", expected: "350€" }, reach: { views: "0", engagement: "0%", audience: "0" } }, contractUrl: "#", tags: ["Bijoux", "Artisanat", "Mode"] },
  { id: "5", title: "Collection Mode Été", category: "fashion", brand: { name: "SummerVibes", logo: "SV", contact: "Sarah Chen", verified: true }, status: "completed", priority: "high", startDate: "1 Novembre 2023", endDate: "30 Novembre 2023", payment: { type: "salary", amount: "1200€", numericValue: 1200 }, progress: 100, deliverables: [{ id: "1", title: "Shooting photos", status: "approved", dueDate: "10 Nov" }, { id: "2", title: "Posts Instagram (3)", status: "approved", dueDate: "20 Nov" }, { id: "3", title: "Story highlights", status: "approved", dueDate: "30 Nov" }], performance: { financial: { earned: "1200€", expected: "1200€" }, reach: { views: "92K", engagement: "8.1%", audience: "52K" } }, rating: 5, notes: "Collaboration exceptionnelle ! Très professionnelle et créative.", completedDate: "30 Novembre 2023", contractUrl: "#", tags: ["Mode", "Été", "Lifestyle"] },
  { id: "6", title: "Lancement Produit Fitness", category: "fitness", brand: { name: "FitLife", logo: "FL", contact: "Pierre Lambert", verified: true }, status: "completed", priority: "medium", startDate: "1 Octobre 2023", endDate: "31 Octobre 2023", payment: { type: "salary", amount: "950€", numericValue: 950 }, progress: 100, deliverables: [{ id: "1", title: "Stories quotidiennes", status: "approved", dueDate: "Oct" }, { id: "2", title: "Post dédié", status: "approved", dueDate: "15 Oct" }], performance: { financial: { earned: "950€", expected: "950€" }, reach: { views: "65K", engagement: "5.9%", audience: "41K" } }, rating: 4, notes: "Bonne collaboration, quelques retards de paiement.", completedDate: "31 Octobre 2023", contractUrl: "#", tags: ["Fitness", "Nutrition"] },
]

const getDeliverableStatusColor = (status) => {
  switch (status) {
    case "approved": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "delivered": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "revision": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case "beauty": return "bg-pink-500/10 text-pink-600 border-pink-500/20"
    case "tech": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "fashion": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
    case "fitness": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "food": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "lifestyle": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "high": return <TrendingUp className="h-3 w-3 text-red-500" />
    case "medium": return <Target className="h-3 w-3 text-orange-500" />
    case "low": return <TrendingDown className="h-3 w-3 text-blue-500" />
    default: return null
  }
}

export default function CollaborationsSection() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!influencer) return

      const { data } = await supabase
        .from('applications')
        .select('*, campaigns(title, description, budget_per_influencer_min, budget_per_influencer_max)')
        .eq('influencer_id', influencer.id)
        .order('applied_at', { ascending: false })

      setApplications(data || [])
      setLoadingApps(false)
    }
    fetchApplications()
  }, [])

  const activeCollaborations = collaborations.filter(c => c.status === "active")
  const completedCollaborations = collaborations.filter(c => c.status === "completed")
  const totalEarned = collaborations.reduce((sum, c) => sum + (c.payment.numericValue || 0), 0)
  const engagementCollabs = collaborations.filter(c => c.performance.reach.engagement !== "0%")
  const avgEngagement = engagementCollabs.length > 0
    ? (engagementCollabs.reduce((sum, c) => sum + parseFloat(c.performance.reach.engagement), 0) / engagementCollabs.length).toFixed(1)
    : "0.0"
  const totalViews = collaborations.reduce((sum, c) => {
    const views = c.performance.reach.views.replace('K', '000').replace(/[^0-9]/g, '')
    return sum + parseInt(views || '0')
  }, 0)

  const filterCollaborations = (collabList) => collabList.filter(collab =>
    collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collab.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openDetailsDialog = (collab) => { setSelectedCollab(collab); setIsDetailsDialogOpen(true) }
  const openContractDialog = (collab) => { setSelectedCollab(collab); setIsContractDialogOpen(true) }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Mes collaborations</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Partenariats Actifs • Historique Complet • Performance Détaillée</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">+12%</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalEarned}€</p>
            <p className="text-sm text-muted-foreground">Revenus totaux</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10"><BarChart3 className="h-5 w-5 text-blue-600" /></div>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">Excellent</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgEngagement}%</p>
            <p className="text-sm text-muted-foreground">Engagement moyen</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10"><Eye className="h-5 w-5 text-purple-600" /></div>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Viral</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{(totalViews / 1000).toFixed(0)}K</p>
            <p className="text-sm text-muted-foreground">Vues totales</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10"><Award className="h-5 w-5 text-orange-600" /></div>
              <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">Active</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{collaborations.length}</p>
            <p className="text-sm text-muted-foreground">Collaborations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher une campagne..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-0 h-auto">
          <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-green-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20"><Zap className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">En cours</span><span className="text-xs opacity-80">({activeCollaborations.length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-blue-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20"><Package className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Historique</span><span className="text-xs opacity-80">({completedCollaborations.length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="candidatures" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-purple-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20"><FileText className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Candidatures</span><span className="text-xs opacity-80">({applications.length})</span></div>
          </TabsTrigger>
        </TabsList>

        {/* Tab : En cours */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {filterCollaborations(activeCollaborations).length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-12"><AlertCircle className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground text-center">Aucune collaboration trouvée</p></CardContent></Card>
          ) : (
            filterCollaborations(activeCollaborations).map((collab) => (
              <Card key={collab.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 border-2 border-primary/30 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">{collab.brand.logo}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{collab.title}</CardTitle>
                          {collab.brand.verified && <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 gap-1"><CheckCircle className="h-3 w-3" />Vérifié</Badge>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{collab.brand.name}</p>
                          <span className="text-muted-foreground">•</span>
                          <Badge variant="outline" className={getCategoryColor(collab.category)}>{collab.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(collab.priority)}
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 animate-pulse"><Clock className="h-3 w-3 mr-1" />En cours</Badge>
                    </div>
                  </div>
                  {collab.tags && <div className="flex gap-2 mt-3 flex-wrap">{collab.tags.map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>)}</div>}
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-dashed hover:border-solid transition-all hover:shadow-md"><CardContent className="p-4"><div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div><div><p className="text-sm font-medium text-muted-foreground">Période</p><p className="text-sm font-semibold text-foreground mt-1">{collab.startDate}</p><p className="text-xs text-muted-foreground">au {collab.endDate}</p></div></div></CardContent></Card>
                    <Card className="border-dashed hover:border-solid transition-all hover:shadow-md"><CardContent className="p-4"><div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm font-medium text-muted-foreground">{collab.payment.type === "salary" ? "Salaire fixe" : collab.payment.type === "commission" ? "Commission" : "Échange produit"}</p><p className="text-sm font-semibold text-green-600 mt-1">{collab.payment.amount}</p></div></div></CardContent></Card>
                    <Card className="border-dashed hover:border-solid transition-all hover:shadow-md"><CardContent className="p-4"><div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-blue-500/10"><Target className="h-5 w-5 text-blue-600" /></div><div className="flex-1"><p className="text-sm font-medium text-muted-foreground mb-2">Progression</p><Progress value={collab.progress} className="h-2 mb-1" /><p className="text-xs text-muted-foreground">{collab.progress}% complété</p></div></div></CardContent></Card>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Livrables ({collab.deliverables.length})</h4>
                      <Badge variant="outline" className="text-xs">{collab.deliverables.filter(d => d.status === "approved").length} approuvés</Badge>
                    </div>
                    <div className="space-y-2">
                      {collab.deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all hover:shadow-sm group">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-2 h-2 rounded-full ${deliverable.status === "approved" ? "bg-green-500" : deliverable.status === "delivered" ? "bg-blue-500" : deliverable.status === "revision" ? "bg-orange-500" : "bg-gray-400"}`} />
                            <div className="flex-1"><p className="text-sm font-medium">{deliverable.title}</p><p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" />Échéance: {deliverable.dueDate}</p></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getDeliverableStatusColor(deliverable.status)}>
                              {deliverable.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {deliverable.status === "delivered" && <Upload className="h-3 w-3 mr-1" />}
                              {deliverable.status === "approved" ? "Approuvé" : deliverable.status === "delivered" ? "Livré" : deliverable.status === "revision" ? "Révision" : "En attente"}
                            </Badge>
                            {deliverable.status === "pending" && <Button size="sm" className="gap-1"><Upload className="h-3 w-3" />Envoyer</Button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    {collab.contractUrl && <Button variant="outline" className="flex-1 gap-2" onClick={() => openContractDialog(collab)}><FileText className="h-4 w-4" />Contrat</Button>}
                    <Button variant="outline" className="flex-1 gap-2"><MessageSquare className="h-4 w-4" />Messagerie</Button>
                    <Button className="flex-1 gap-2" onClick={() => openDetailsDialog(collab)}><Eye className="h-4 w-4" />Détails</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab : Historique */}
        <TabsContent value="history" className="space-y-4 mt-6">
          {filterCollaborations(completedCollaborations).length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-12"><Package className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground text-center">Aucune collaboration terminée trouvée</p></CardContent></Card>
          ) : (
            filterCollaborations(completedCollaborations).map((collab) => (
              <Card key={collab.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 border-2 border-border shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-muted to-muted-foreground/20 font-bold text-lg">{collab.brand.logo}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{collab.title}</h3>
                          {collab.rating && (
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < collab.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{collab.brand.name}</p>
                          <span className="text-muted-foreground">•</span>
                          <Badge variant="outline" className={getCategoryColor(collab.category)}>{collab.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-muted text-muted-foreground"><CheckCircle className="h-3 w-3 mr-1" />Terminée</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Date de fin</p><p className="text-sm font-medium">{collab.completedDate}</p></div>
                    <div className="p-3 rounded-lg bg-green-500/5"><p className="text-xs text-muted-foreground mb-1">Montant</p><p className="text-sm font-semibold text-green-600">{collab.payment.amount}</p></div>
                    <div className="p-3 rounded-lg bg-blue-500/5"><p className="text-xs text-muted-foreground mb-1">Portée totale</p><p className="text-sm font-semibold text-blue-600">{collab.performance.reach.views}</p></div>
                    <div className="p-3 rounded-lg bg-purple-500/5"><p className="text-xs text-muted-foreground mb-1">Engagement</p><p className="text-sm font-semibold text-purple-600">{collab.performance.reach.engagement}</p></div>
                  </div>
                  {collab.notes && <div className="p-4 rounded-lg bg-accent/50 mb-4 border-l-4 border-primary"><p className="text-sm italic flex items-start gap-2"><MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />&ldquo;{collab.notes}&rdquo;</p></div>}
                  <Button variant="outline" className="w-full gap-2" onClick={() => openDetailsDialog(collab)}><Eye className="h-4 w-4" />Voir les détails</Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab : Candidatures */}
        <TabsContent value="candidatures" className="space-y-4 mt-6">
          {loadingApps ? (
            <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Chargement des candidatures...</p></CardContent></Card>
          ) : applications.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-2">Aucune candidature</h3><p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore postulé à des campagnes</p></CardContent></Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
  {app.cover_letter?.match(/^\[(.+?)\]/)?.[1] || app.campaigns?.title || 'Campagne'}
</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
  {app.cover_letter?.replace(/^\[.+?\]\s*/, '') || ''}
</p>
                    </div>
                    <Badge className={
                      app.status === 'accepted' ? 'bg-green-500/10 text-green-600 border-green-500/20 ml-4' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/20 ml-4' :
                      'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 ml-4'
                    }>
                      {app.status === 'accepted' ? <><CheckCircle className="h-3 w-3 mr-1" />Acceptée</> :
                       app.status === 'rejected' ? 'Refusée' :
                       <><Clock className="h-3 w-3 mr-1" />En attente</>}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Postulé le {new Date(app.applied_at).toLocaleDateString('fr-FR')}</span>
                    {app.campaigns?.budget_per_influencer_min && (
                      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{app.campaigns.budget_per_influencer_min} - {app.campaigns.budget_per_influencer_max}€</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Détails */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {selectedCollab?.title}
              <Badge className={selectedCollab?.status === "active" ? "bg-green-500" : "bg-blue-500"}>{selectedCollab?.status === "active" ? "En cours" : "Terminé"}</Badge>
            </DialogTitle>
            <DialogDescription>Collaboration avec {selectedCollab?.brand.name}</DialogDescription>
          </DialogHeader>
          {selectedCollab && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4" />Catégorie</CardTitle></CardHeader><CardContent><Badge className={getCategoryColor(selectedCollab.category)}>{selectedCollab.category}</Badge></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4" />Rémunération</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{selectedCollab.payment.amount}</p></CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Livrables</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCollab.deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{deliverable.title}</h4>
                            <Badge className={getDeliverableStatusColor(deliverable.status)}>
                              {deliverable.status === "pending" ? "En attente" : deliverable.status === "delivered" ? "Livré" : deliverable.status === "approved" ? "Approuvé" : "Révision"}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{deliverable.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {selectedCollab.status === "completed" && selectedCollab.rating && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" />Évaluation</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < selectedCollab.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}</div>
                      <span className="font-bold text-lg">{selectedCollab.rating}/5</span>
                    </div>
                    {selectedCollab.notes && <p className="text-muted-foreground italic">&ldquo;{selectedCollab.notes}&rdquo;</p>}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Contrat */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3"><FileText className="h-6 w-6" />Contrat de collaboration</DialogTitle>
            <DialogDescription>{selectedCollab?.title} - {selectedCollab?.brand.name}</DialogDescription>
          </DialogHeader>
          {selectedCollab && (
            <div className="space-y-6 mt-4">
              <Card>
                <CardHeader><CardTitle>Informations contractuelles</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-muted-foreground mb-1">Marque</p><p className="font-semibold">{selectedCollab.brand.name}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Rémunération</p><p className="font-semibold text-green-600">{selectedCollab.payment.amount}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Date de début</p><p className="font-semibold">{selectedCollab.startDate}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Date de fin</p><p className="font-semibold">{selectedCollab.endDate}</p></div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2"><Download className="h-4 w-4" />Télécharger le PDF</Button>
                <Button variant="outline" className="flex-1 gap-2"><FileText className="h-4 w-4" />Voir le contrat complet</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}