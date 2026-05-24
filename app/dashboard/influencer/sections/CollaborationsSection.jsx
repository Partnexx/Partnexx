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
  Search, Calendar, DollarSign, Eye, TrendingUp,
  Clock, Upload, FileText, Download, Zap, Brain, Award, BarChart3,
  AlertCircle, CheckCircle, Package, MessageSquare, Star,
} from 'lucide-react'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'

export default function CollaborationsSection() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [contracts, setContracts] = useState([])
  const [contentPosts, setContentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [influencerId, setInfluencerId] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: influencer } = await supabase
      .from('influencers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!influencer) return
    setInfluencerId(influencer.id)

    const [collabRes, appRes, contractRes, postsRes] = await Promise.allSettled([
      supabase
        .from('collaborations')
        .select('*, campaigns(id, title, description, cover_url), brands(id, company_name, logo_url)')
        .eq('influencer_id', influencer.id)
        .order('created_at', { ascending: false }),

      supabase
        .from('applications')
        .select('*, campaigns(title, description, budget_per_influencer_min, budget_per_influencer_max)')
        .eq('influencer_id', influencer.id)
        .order('applied_at', { ascending: false }),

      supabase
        .from('contracts')
        .select('*, brands(company_name)')
        .eq('influencer_id', influencer.id)
        .order('created_at', { ascending: false }),

      supabase
        .from('content_posts')
        .select('*')
        .eq('influencer_id', influencer.id),
    ])

    setCollaborations(collabRes.status === 'fulfilled' ? collabRes.value.data || [] : [])
    setApplications(appRes.status === 'fulfilled' ? appRes.value.data || [] : [])
    setContracts(contractRes.status === 'fulfilled' ? contractRes.value.data || [] : [])
    setContentPosts(postsRes.status === 'fulfilled' ? postsRes.value.data || [] : [])
    setLoading(false)
  }

  // Stats calculées depuis les vraies données
  const activeCollaborations = collaborations.filter(c => ['in_progress', 'accepted'].includes(c.status))
  const completedCollaborations = collaborations.filter(c => c.status === 'completed')

  const totalViews = contentPosts.reduce((sum, p) => sum + (p.views || 0), 0)
  const avgEngagement = contentPosts.length > 0
    ? (contentPosts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / contentPosts.length).toFixed(1)
    : '0.0'
  const totalContractValue = contracts.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)

  const filterCollaborations = (list) => list.filter(c =>
    (c.campaigns?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.brands?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'En cours'
      case 'accepted': return 'Acceptée'
      case 'completed': return 'Terminée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const getContractForCollab = (collab) => {
    return contracts.find(c => c.collaboration_id === collab.id)
  }

  const getPostsForCollab = (collab) => {
    return contentPosts.filter(p => p.collaboration_id === collab.id)
  }

  const handleDownloadPDF = (contract) => {
    if (contract?.pdf_url) {
      window.open(contract.pdf_url, '_blank')
    } else {
      toast.error('PDF non disponible pour ce contrat')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Non défini'
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des collaborations...</p>
        </div>
      </div>
    )
  }

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

      {/* Stats temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">Réel</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalContractValue.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">Valeur contrats</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10"><BarChart3 className="h-5 w-5 text-blue-600" /></div>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">Réel</Badge>
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
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Réel</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}K` : '0'}</p>
            <p className="text-sm text-muted-foreground">Vues totales</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10"><Award className="h-5 w-5 text-orange-600" /></div>
              <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">Réel</Badge>
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
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune collaboration en cours</h3>
                <p className="text-sm text-muted-foreground">Vos collaborations actives apparaîtront ici</p>
              </CardContent>
            </Card>
          ) : (
            filterCollaborations(activeCollaborations).map((collab) => {
              const contract = getContractForCollab(collab)
              const posts = getPostsForCollab(collab)
              const collabViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
              const collabEngagement = posts.length > 0
                ? (posts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / posts.length).toFixed(1)
                : '0.0'
              const deliverables = Array.isArray(collab.deliverables) ? collab.deliverables : []

              return (
                <Card key={collab.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 border-2 border-primary/30 shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
                            {collab.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{collab.campaigns?.title || 'Campagne'}</CardTitle>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />Vérifié
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{collab.brands?.company_name || 'Marque'}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 animate-pulse">
                        <Clock className="h-3 w-3 mr-1" />{getStatusLabel(collab.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Infos principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-dashed hover:border-solid transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Créée le</p>
                              <p className="text-sm font-semibold mt-1">{formatDate(collab.created_at)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed hover:border-solid transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Montant contrat</p>
                              <p className="text-sm font-semibold text-green-600 mt-1">
                                {contract ? `${parseFloat(contract.amount).toLocaleString()}€` : 'Non défini'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed hover:border-solid transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10"><Eye className="h-5 w-5 text-blue-600" /></div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Vues / Engagement</p>
                              <p className="text-sm font-semibold mt-1">
                                {collabViews > 0 ? `${(collabViews / 1000).toFixed(1)}K` : '0'} • {collabEngagement}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Livrables */}
                    {deliverables.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-primary" />Livrables ({deliverables.length})
                        </h4>
                        <div className="space-y-2">
                          {deliverables.map((deliverable, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <p className="text-sm font-medium">{deliverable}</p>
                              </div>
                              <Button size="sm" className="gap-1"><Upload className="h-3 w-3" />Envoyer</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Posts liés */}
                    {posts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <BarChart3 className="h-4 w-4 text-primary" />Contenus publiés ({posts.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {posts.map((post) => (
                            <div key={post.id} className="p-3 rounded-lg border bg-muted/30">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs capitalize">{post.platform}</Badge>
                                <Badge variant="outline" className="text-xs capitalize">{post.content_type}</Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-xs text-center">
                                <div><p className="font-bold">{(post.views || 0).toLocaleString()}</p><p className="text-muted-foreground">Vues</p></div>
                                <div><p className="font-bold text-pink-600">{parseFloat(post.engagement_rate || 0).toFixed(1)}%</p><p className="text-muted-foreground">Eng.</p></div>
                                <div><p className="font-bold text-green-600">{post.likes || 0}</p><p className="text-muted-foreground">Likes</p></div>
                              </div>
                              {post.post_url && (
                                <Button size="sm" variant="outline" className="w-full mt-2 text-xs" onClick={() => window.open(post.post_url, '_blank')}>
                                  Voir le post
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => { setSelectedCollab({ ...collab, contract }); setIsContractDialogOpen(true) }}
                      >
                        <FileText className="h-4 w-4" />Contrat
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" />Messagerie
                      </Button>
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => { setSelectedCollab({ ...collab, contract, posts }); setIsDetailsDialogOpen(true) }}
                      >
                        <Eye className="h-4 w-4" />Détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Tab : Historique */}
        <TabsContent value="history" className="space-y-4 mt-6">
          {filterCollaborations(completedCollaborations).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune collaboration terminée</h3>
                <p className="text-sm text-muted-foreground">Votre historique apparaîtra ici</p>
              </CardContent>
            </Card>
          ) : (
            filterCollaborations(completedCollaborations).map((collab) => {
              const contract = getContractForCollab(collab)
              const posts = getPostsForCollab(collab)
              const collabViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
              const collabEngagement = posts.length > 0
                ? (posts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / posts.length).toFixed(1)
                : '0.0'

              return (
                <Card key={collab.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 border-2 border-border shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-muted to-muted-foreground/20 font-bold text-lg">
                            {collab.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{collab.campaigns?.title || 'Campagne'}</h3>
                          <p className="text-sm text-muted-foreground">{collab.brands?.company_name || 'Marque'}</p>
                        </div>
                      </div>
                      <Badge className="bg-muted text-muted-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />Terminée
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Créée le</p>
                        <p className="text-sm font-medium">{formatDate(collab.created_at)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/5">
                        <p className="text-xs text-muted-foreground mb-1">Montant</p>
                        <p className="text-sm font-semibold text-green-600">
                          {contract ? `${parseFloat(contract.amount).toLocaleString()}€` : 'Non défini'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/5">
                        <p className="text-xs text-muted-foreground mb-1">Vues totales</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {collabViews > 0 ? `${(collabViews / 1000).toFixed(1)}K` : '0'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/5">
                        <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                        <p className="text-sm font-semibold text-purple-600">{collabEngagement}%</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => { setSelectedCollab({ ...collab, contract, posts }); setIsContractDialogOpen(true) }}
                      >
                        <FileText className="h-4 w-4" />Contrat
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => { setSelectedCollab({ ...collab, contract, posts }); setIsDetailsDialogOpen(true) }}
                      >
                        <Eye className="h-4 w-4" />Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Tab : Candidatures */}
        <TabsContent value="candidatures" className="space-y-4 mt-6">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Aucune candidature</h3>
                <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore postulé à des campagnes</p>
              </CardContent>
            </Card>
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
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />Postulé le {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                    </span>
                    {app.campaigns?.budget_per_influencer_min && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />{app.campaigns.budget_per_influencer_min} - {app.campaigns.budget_per_influencer_max}€
                      </span>
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
              {selectedCollab?.campaigns?.title || 'Collaboration'}
              <Badge className={selectedCollab?.status === "in_progress" ? "bg-green-500" : "bg-blue-500"}>
                {getStatusLabel(selectedCollab?.status)}
              </Badge>
            </DialogTitle>
            <DialogDescription>Collaboration avec {selectedCollab?.brands?.company_name}</DialogDescription>
          </DialogHeader>

          {selectedCollab && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4" />Montant</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedCollab.contract ? `${parseFloat(selectedCollab.contract.amount).toLocaleString()}€` : 'Non défini'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" />Date</CardTitle></CardHeader>
                  <CardContent><p className="font-medium">{formatDate(selectedCollab.created_at)}</p></CardContent>
                </Card>
              </div>

              {selectedCollab.posts && selectedCollab.posts.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Performance des contenus</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedCollab.posts.reduce((s, p) => s + (p.views || 0), 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Vues totales</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-pink-600">{selectedCollab.posts.reduce((s, p) => s + (p.likes || 0), 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Likes totaux</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {selectedCollab.posts.length > 0
                            ? (selectedCollab.posts.reduce((s, p) => s + parseFloat(p.engagement_rate || 0), 0) / selectedCollab.posts.length).toFixed(1)
                            : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground">Engagement moyen</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedCollab.posts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="capitalize">{post.platform}</Badge>
                            <Badge variant="outline" className="capitalize">{post.content_type}</Badge>
                            <span className="text-sm text-muted-foreground">{formatDate(post.published_at)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-blue-600">{(post.views || 0).toLocaleString()} vues</span>
                            <span className="text-pink-600">{post.likes || 0} likes</span>
                            {post.post_url && (
                              <Button size="sm" variant="outline" onClick={() => window.open(post.post_url, '_blank')}>Voir</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedCollab.contract && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleDownloadPDF(selectedCollab.contract)}
                  >
                    <Download className="h-4 w-4" />Télécharger PDF
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Contrat */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <FileText className="h-6 w-6" />Contrat de collaboration
            </DialogTitle>
            <DialogDescription>{selectedCollab?.campaigns?.title} - {selectedCollab?.brands?.company_name}</DialogDescription>
          </DialogHeader>

          {selectedCollab && (
            <div className="space-y-6 mt-4">
              <Card>
                <CardHeader><CardTitle>Informations contractuelles</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-muted-foreground mb-1">Marque</p><p className="font-semibold">{selectedCollab.brands?.company_name || 'Non défini'}</p></div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Montant</p>
                      <p className="font-semibold text-green-600">
                        {selectedCollab.contract ? `${parseFloat(selectedCollab.contract.amount).toLocaleString()}€` : 'Non défini'}
                      </p>
                    </div>
                    <div><p className="text-sm text-muted-foreground mb-1">Statut contrat</p><p className="font-semibold capitalize">{selectedCollab.contract?.status || 'Non disponible'}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Deadline</p><p className="font-semibold">{selectedCollab.contract?.deadline ? formatDate(selectedCollab.contract.deadline) : 'Non défini'}</p></div>
                  </div>

                  {selectedCollab.contract?.deliverables && Array.isArray(selectedCollab.contract.deliverables) && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Livrables</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollab.contract.deliverables.map((d, i) => (
                          <Badge key={i} variant="secondary">{d}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleDownloadPDF(selectedCollab.contract)}
                >
                  <Download className="h-4 w-4" />Télécharger PDF
                </Button>
                {selectedCollab.contract?.pdf_url && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => window.open(selectedCollab.contract.pdf_url, '_blank')}
                  >
                    <Eye className="h-4 w-4" />Voir le PDF
                  </Button>
                )}
              </div>

              {!selectedCollab.contract && (
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Aucun contrat associé à cette collaboration</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}