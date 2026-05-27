'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserPlus, Brain, TrendingUp, Star, MessageCircle, Calendar, Filter, Sparkles, Search, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const seedPartners = [
  { id: "1", name: "Marie Dubois", handle: "@greenbeauty", niche: "Beauté", score: 92, status: "actif", messages: 2, updatedAt: "Aujourd'hui", followers: 45200, engagement: 4.2, avgLikes: 1890, location: "Paris, FR", languages: ["Français", "Anglais"], tags: ["skincare", "organic", "wellness"], collaborations: 12, aiCompatibility: 95, trending: true, verified: true, type: "ambassadeur", contractStartDate: "2024-01-15", recentCampaigns: ["Campagne Printemps 2024", "Lancement Sérum"] },
  { id: "7", name: "Julie Laurent", handle: "@juliebeauty", niche: "Beauté", score: 88, status: "actif", messages: 5, updatedAt: "Hier", followers: 62300, engagement: 5.1, avgLikes: 3180, location: "Lyon, FR", languages: ["Français"], tags: ["makeup", "beauty", "tutorials"], collaborations: 18, aiCompatibility: 92, trending: true, verified: true, type: "ambassadeur", contractStartDate: "2023-09-01", recentCampaigns: ["Collection Automne", "Makeup Master Class"] },
  { id: "8", name: "Alexandre Petit", handle: "@alexpetit_life", niche: "Lifestyle", score: 85, status: "actif", messages: 1, updatedAt: "Il y a 2j", followers: 51800, engagement: 4.8, avgLikes: 2486, location: "Bordeaux, FR", languages: ["Français", "Anglais"], tags: ["lifestyle", "travel", "fashion"], collaborations: 14, aiCompatibility: 89, trending: false, verified: true, type: "ambassadeur", contractStartDate: "2024-03-10", recentCampaigns: ["Style Été 2024"] },
  { id: "2", name: "Thomas Martin", handle: "@techflow", niche: "Tech", score: 80, status: "actif", messages: 0, updatedAt: "Hier", followers: 78500, engagement: 3.8, avgLikes: 2980, location: "Lyon, FR", languages: ["Français", "Anglais"], tags: ["gadgets", "reviews", "innovation"], collaborations: 8, aiCompatibility: 88, trending: false, verified: true, type: "affilie", affiliateCode: "TECHFLOW20", affiliateLink: "partnex.com/r/techflow", sales: 156, commission: 3420 },
  { id: "9", name: "Emma Rodriguez", handle: "@emmafit", niche: "Sport", score: 78, status: "actif", messages: 3, updatedAt: "Aujourd'hui", followers: 38900, engagement: 6.2, avgLikes: 2412, location: "Paris, FR", languages: ["Français", "Espagnol"], tags: ["fitness", "sport", "wellness"], collaborations: 11, aiCompatibility: 83, trending: true, verified: true, type: "affilie", affiliateCode: "EMMAFIT15", affiliateLink: "partnex.com/r/emmafit", sales: 89, commission: 1980 },
  { id: "3", name: "Camille Roy", handle: "@summerstyle", niche: "Mode", score: 77, status: "prospect", messages: 1, updatedAt: "Il y a 1j", followers: 125000, engagement: 2.9, avgLikes: 3625, location: "Paris, FR", languages: ["Français", "Anglais"], tags: ["fashion", "ootd", "style"], collaborations: 5, aiCompatibility: 82, trending: true, verified: false, type: "oneshot", deliveredContent: "3 posts Instagram + 5 stories", collabDate: "2024-02-20" },
  { id: "10", name: "Lucas Bernard", handle: "@lucasgaming", niche: "Gaming", score: 74, status: "actif", messages: 2, updatedAt: "Il y a 3j", followers: 92000, engagement: 7.1, avgLikes: 6532, location: "Lyon, FR", languages: ["Français"], tags: ["gaming", "esports", "streaming"], collaborations: 7, aiCompatibility: 79, trending: false, verified: true, type: "oneshot", deliveredContent: "1 vidéo YouTube + 2 streams", collabDate: "2024-01-15" },
  { id: "4", name: "Sophie Laurent", handle: "@sophie.wellness", niche: "Bien-être", score: 83, status: "actif", messages: 3, updatedAt: "Il y a 2j", followers: 89300, engagement: 5.4, avgLikes: 4822, location: "Nice, FR", languages: ["Français", "Anglais"], tags: ["wellness", "yoga", "nutrition"], collaborations: 15, aiCompatibility: 91, trending: true, verified: true, type: "placement", productName: "Coffret Wellness Premium", productValue: 250, sendDate: "2024-03-01" },
  { id: "11", name: "Manon Leclerc", handle: "@manonbeauty", niche: "Beauté", score: 81, status: "actif", messages: 0, updatedAt: "Hier", followers: 55400, engagement: 4.9, avgLikes: 2715, location: "Paris, FR", languages: ["Français"], tags: ["skincare", "makeup", "beauty"], collaborations: 10, aiCompatibility: 87, trending: false, verified: true, type: "placement", productName: "Sérum Anti-Âge", productValue: 180, sendDate: "2024-02-14" },
  { id: "13", name: "Antoine Moreau", handle: "@antoinechef", niche: "Food", score: 89, status: "actif", messages: 0, updatedAt: "Il y a 2j", followers: 67300, engagement: 4.4, avgLikes: 2960, location: "Bordeaux, FR", languages: ["Français"], tags: ["cuisine", "restaurants", "wine"], collaborations: 18, aiCompatibility: 91, trending: true, verified: true, type: "autorite", campaignName: "Campagne Gastronomie France", involvedBrands: ["ChefPro", "VinExcellence"], budget: 45000, results: "2.5M impressions, 125K engagements" },
  { id: "15", name: "Isabelle Rousseau", handle: "@isabelletravel", niche: "Voyage", score: 86, status: "actif", messages: 4, updatedAt: "Hier", followers: 73800, engagement: 5.7, avgLikes: 4207, location: "Paris, FR", languages: ["Français", "Anglais", "Espagnol"], tags: ["travel", "adventure", "photography"], collaborations: 21, aiCompatibility: 93, trending: true, verified: true, type: "autorite", campaignName: "Destinations Europe 2024", involvedBrands: ["AirVoyage", "HotelLuxe"], budget: 62000, results: "3.8M impressions, 187K engagements" },
  { id: "5", name: "Nina Keller", handle: "@eco.home", niche: "Maison", score: 71, status: "inactif", messages: 0, updatedAt: "Il y a 3j", followers: 29800, engagement: 3.9, avgLikes: 1160, location: "Toulouse, FR", languages: ["Français", "Allemand"], tags: ["decoration", "diy", "sustainable"], collaborations: 9, aiCompatibility: 79, trending: false, verified: false, type: "ugc", deliverables: 12, brandFeedback: "Excellent travail, très créatif", deliveryStatus: "valide" },
  { id: "16", name: "Maxime Blanc", handle: "@maxcontent", niche: "Marketing", score: 76, status: "actif", messages: 2, updatedAt: "Aujourd'hui", followers: 34500, engagement: 4.3, avgLikes: 1484, location: "Lille, FR", languages: ["Français", "Anglais"], tags: ["ugc", "content", "creator"], collaborations: 16, aiCompatibility: 84, trending: true, verified: true, type: "ugc", deliverables: 24, brandFeedback: "Très professionnel, délais respectés", deliveryStatus: "livre" },
  { id: "17", name: "Clara Dupont", handle: "@claracreative", niche: "Lifestyle", score: 79, status: "actif", messages: 1, updatedAt: "Il y a 1j", followers: 41200, engagement: 5.0, avgLikes: 2060, location: "Strasbourg, FR", languages: ["Français", "Allemand"], tags: ["content", "creative", "ugc"], collaborations: 19, aiCompatibility: 86, trending: true, verified: true, type: "ugc", deliverables: 18, brandFeedback: "Contenu de haute qualité", deliveryStatus: "en_attente" },
]

const aiMatches = [
  { partnerId: "1", score: 95, reasons: ["Audience similaire à vos campagnes beauté", "Taux d'engagement optimal", "Content de qualité constante"], opportunity: "Campagne skincare automne +30% ROI estimé" },
  { partnerId: "13", score: 91, reasons: ["Expertise culinaire reconnue", "Audience locale forte", "Partenariats de qualité"], opportunity: "Collaboration restaurant premium" },
  { partnerId: "2", score: 88, reasons: ["Leader tech emergent", "Reviews authentiques", "Communauté engagée"], opportunity: "Lancement produit tech Q4" },
]

const influencerDirectory = [
  { id: "inf_1", name: "Tibo InShape", handle: "@tiboinshape", niche: "Fitness & Lifestyle", followers: 8500000, engagement: 7.8, avgLikes: 425000, avgComments: 3200, platform: "Instagram", location: "Paris, France", verified: true, bio: "Fitness entrepreneur, fondateur de la marque Shapeshake.", languages: ["Français", "Anglais"] },
  { id: "inf_2", name: "Squeezie", handle: "@xsqueezie", niche: "Gaming & Divertissement", followers: 18200000, engagement: 9.2, avgLikes: 1200000, avgComments: 8500, platform: "YouTube", location: "Lyon, France", verified: true, bio: "Créateur de contenu gaming et divertissement.", languages: ["Français"] },
  { id: "inf_3", name: "Norman Thavaud", handle: "@norman", niche: "Comédie & Lifestyle", followers: 12300000, engagement: 8.5, avgLikes: 850000, avgComments: 5200, platform: "YouTube", location: "Paris, France", verified: true, bio: "Créateur de contenu comique et lifestyle.", languages: ["Français"] },
  { id: "inf_4", name: "Enjoy Phoenix", handle: "@enjoyphoenix", niche: "Beauté & Lifestyle", followers: 5800000, engagement: 6.3, avgLikes: 365000, avgComments: 2100, platform: "Instagram", location: "Paris, France", verified: true, bio: "Influenceuse beauté et lifestyle.", languages: ["Français", "Anglais"] },
  { id: "inf_5", name: "Léna Situations", handle: "@lenasituations", niche: "Mode & Lifestyle", followers: 6200000, engagement: 7.1, avgLikes: 440000, avgComments: 3800, platform: "Instagram", location: "Paris, France", verified: true, bio: "Créatrice de mode et lifestyle.", languages: ["Français", "Anglais"] },
  { id: "inf_6", name: "Hugo Décrypte", handle: "@hugodecrypte", niche: "Actualité & Info", followers: 4100000, engagement: 8.9, avgLikes: 365000, avgComments: 4200, platform: "TikTok", location: "Paris, France", verified: true, bio: "Journaliste et créateur de contenu d'actualité.", languages: ["Français"] },
  { id: "inf_7", name: "McFly & Carlito", handle: "@mcflyetcarlito", niche: "Comédie & Entertainment", followers: 9800000, engagement: 10.2, avgLikes: 998000, avgComments: 7600, platform: "YouTube", location: "Paris, France", verified: true, bio: "Duo comique et créateurs de challenges.", languages: ["Français"] },
  { id: "inf_8", name: "Inoxtag", handle: "@inoxtag", niche: "Gaming & Lifestyle", followers: 7300000, engagement: 11.5, avgLikes: 840000, avgComments: 5900, platform: "YouTube", location: "Paris, France", verified: true, bio: "Créateur de contenu gaming et lifestyle.", languages: ["Français"] },
]

const PARTNER_TYPES = [
  { value: "tous", label: "Tous", icon: "📊" },
  { value: "ambassadeur", label: "Ambassadeurs", icon: "👑" },
  { value: "affilie", label: "Affiliés", icon: "💰" },
  { value: "oneshot", label: "One-Shot", icon: "⚡" },
  { value: "placement", label: "Placements", icon: "📦" },
  { value: "autorite", label: "Campagnes", icon: "🎯" },
  { value: "ugc", label: "UGC", icon: "🎬" },
]

const PartenairesSection = ({ setActiveSection }) => {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [viewMode, setViewMode] = useState("cards")
  const [partners, setPartners] = useState(seedPartners)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [activeTab, setActiveTab] = useState("tous")

  const data = useMemo(() => {
    return partners.filter((p) => {
      const matchQ = q ? p.name.toLowerCase().includes(q.toLowerCase()) || p.handle.toLowerCase().includes(q.toLowerCase()) || p.niche.toLowerCase().includes(q.toLowerCase()) : true
      const matchStatus = status === "all" ? true : p.status === status
      const matchType = activeTab === "tous" ? true : p.type === activeTab
      return matchQ && matchStatus && matchType
    })
  }, [q, status, partners, activeTab])

  const filteredInfluencers = useMemo(() => {
    if (!searchQuery.trim()) return influencerDirectory
    const query = searchQuery.toLowerCase()
    return influencerDirectory.filter(inf => inf.name.toLowerCase().includes(query) || inf.handle.toLowerCase().includes(query) || inf.niche.toLowerCase().includes(query))
  }, [searchQuery])

  const handleAddPartner = () => {
    if (!selectedInfluencer) { toast.error("Veuillez sélectionner un influenceur"); return }
    const partner = {
      id: Date.now().toString(), name: selectedInfluencer.name, handle: selectedInfluencer.handle, niche: selectedInfluencer.niche,
      score: Math.floor(Math.random() * 25) + 70, status: "prospect", messages: 0, updatedAt: "À l'instant",
      followers: selectedInfluencer.followers, engagement: selectedInfluencer.engagement, avgLikes: selectedInfluencer.avgLikes,
      location: selectedInfluencer.location, languages: selectedInfluencer.languages, tags: [selectedInfluencer.niche],
      collaborations: 0, aiCompatibility: Math.floor(Math.random() * 25) + 70, trending: false, verified: selectedInfluencer.verified, type: "ambassadeur"
    }
    setPartners([partner, ...partners])
    setShowAddDialog(false); setSearchQuery(""); setSelectedInfluencer(null)
    toast.success(`${selectedInfluencer.name} ajouté comme partenaire !`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "actif": return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Actif</Badge>
      case "prospect": return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">Prospect</Badge>
      case "inactif": return <Badge className="bg-gray-500/10 text-gray-700 border-gray-500/20">Inactif</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Partenaires</h1>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              <Brain className="h-3 w-3 mr-1" />IA Activée
            </Badge>
          </div>
          <p className="text-muted-foreground">Matching intelligent • Analytics avancées • Partenariats optimisés</p>
        </div>
      </header>

      {/* AI Suggestions */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />Suggestions IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiMatches.map((match) => {
              const partner = seedPartners.find(p => p.id === match.partnerId)
              if (!partner) return null
              return (
                <Card key={match.partnerId} className="border border-primary/30 hover:border-primary/50 transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {partner.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{partner.name}</div>
                        <div className="text-xs text-muted-foreground">{partner.handle}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{match.score}%</div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium text-primary mb-1">{match.opportunity}</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {match.reasons.slice(0, 2).map((reason, idx) => <li key={idx}>• {reason}</li>)}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent text-white" onClick={() => setActiveSection && setActiveSection('messagerie')}>
                        <MessageCircle className="h-3 w-3 mr-1" />Contacter
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">Détails</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher nom, @handle, niche..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 w-72" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="prospect">Prospects</SelectItem>
              <SelectItem value="actif">Actifs</SelectItem>
              <SelectItem value="inactif">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList>
              <TabsTrigger value="cards">Cartes</TabsTrigger>
              <TabsTrigger value="table">Tableau</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent text-white" onClick={() => setShowAddDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />Ajouter Partenaire
        </Button>
      </div>

      {/* Tabs par type */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-7 gap-1 h-auto p-1 bg-muted/50 rounded-xl">
          {PARTNER_TYPES.map(type => (
            <TabsTrigger key={type.value} value={type.value}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-muted">
              <span>{type.icon}</span>
              <span className="font-semibold text-xs">{type.label}</span>
              <span className="text-xs opacity-70">({type.value === "tous" ? partners.length : partners.filter(p => p.type === type.value).length})</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Liste partenaires */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((p) => (
            <Card key={p.id} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold">
                      {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{p.name}</h3>
                      {p.verified && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      {p.trending && <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">{p.handle}</div>
                    <div className="text-xs text-muted-foreground">{p.location}</div>
                  </div>
                  {getStatusBadge(p.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                    <div className="text-lg font-bold text-primary">{(p.followers / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-2.5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg">
                    <div className="text-lg font-bold text-accent">{p.engagement}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center p-2.5 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{p.score}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center p-2.5 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{p.collaborations}</div>
                    <div className="text-xs text-muted-foreground">Collabs</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">Compatibilité IA</span>
                    <span className="text-sm font-bold text-primary">{p.aiCompatibility}%</span>
                  </div>
                  <Progress value={p.aiCompatibility} className="h-2" />
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">{p.niche}</Badge>
                    {p.tags.slice(0, 2).map((tag, idx) => <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent text-white" onClick={() => setActiveSection && setActiveSection('messagerie')}>
                    <MessageCircle className="h-3 w-3 mr-1" />{p.messages > 0 ? `${p.messages} msg` : "Contacter"}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info("Détails partenaire — disponible prochainement")}>
                    <Calendar className="h-3 w-3 mr-1" />Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <TableHead>Partenaire</TableHead>
                  <TableHead>Niche</TableHead>
                  {activeTab === "ambassadeur" && <><TableHead>Début contrat</TableHead><TableHead>Campagnes</TableHead></>}
                  {activeTab === "affilie" && <><TableHead>Code/Lien</TableHead><TableHead>Ventes</TableHead><TableHead>Commission</TableHead></>}
                  {activeTab === "oneshot" && <><TableHead>Date collab</TableHead><TableHead>Contenu livré</TableHead></>}
                  {activeTab === "placement" && <><TableHead>Produit</TableHead><TableHead>Valeur</TableHead><TableHead>Date envoi</TableHead></>}
                  {activeTab === "autorite" && <><TableHead>Campagne</TableHead><TableHead>Budget</TableHead><TableHead>Résultats</TableHead></>}
                  {activeTab === "ugc" && <><TableHead>Livrables</TableHead><TableHead>Feedback</TableHead><TableHead>Statut</TableHead></>}
                  {activeTab === "tous" && <><TableHead>Type</TableHead><TableHead>Followers</TableHead><TableHead>Engagement</TableHead></>}
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground text-xs font-semibold">
                            {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {p.name}{p.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{p.handle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{p.niche}</Badge></TableCell>
                    {activeTab === "ambassadeur" && <><TableCell className="text-sm">{p.contractStartDate || "-"}</TableCell><TableCell className="text-xs">{p.recentCampaigns?.slice(0, 2).join(", ") || "-"}</TableCell></>}
                    {activeTab === "affilie" && <><TableCell className="text-xs font-mono">{p.affiliateCode || "-"}</TableCell><TableCell className="text-sm font-medium">{p.sales || 0}</TableCell><TableCell className="text-sm font-medium text-green-600">{p.commission ? `${p.commission}€` : "-"}</TableCell></>}
                    {activeTab === "oneshot" && <><TableCell className="text-sm">{p.collabDate || "-"}</TableCell><TableCell className="text-xs">{p.deliveredContent || "-"}</TableCell></>}
                    {activeTab === "placement" && <><TableCell className="text-sm">{p.productName || "-"}</TableCell><TableCell className="text-sm font-medium">{p.productValue ? `${p.productValue}€` : "-"}</TableCell><TableCell className="text-sm">{p.sendDate || "-"}</TableCell></>}
                    {activeTab === "autorite" && <><TableCell className="text-sm font-medium">{p.campaignName || "-"}</TableCell><TableCell className="text-sm font-medium">{p.budget ? `${p.budget}€` : "-"}</TableCell><TableCell className="text-xs">{p.results || "-"}</TableCell></>}
                    {activeTab === "ugc" && <><TableCell className="text-sm font-medium">{p.deliverables || 0}</TableCell><TableCell className="text-xs">{p.brandFeedback || "-"}</TableCell><TableCell>{p.deliveryStatus === "livre" ? <Badge className="bg-green-500 text-white">Livré</Badge> : p.deliveryStatus === "en_attente" ? <Badge variant="secondary">En attente</Badge> : p.deliveryStatus === "valide" ? <Badge className="bg-blue-500 text-white">Validé</Badge> : <Badge variant="outline">-</Badge>}</TableCell></>}
                    {activeTab === "tous" && <><TableCell><Badge variant="outline" className="text-xs capitalize">{p.type}</Badge></TableCell><TableCell className="text-sm">{(p.followers / 1000).toFixed(1)}K</TableCell><TableCell className="text-sm">{p.engagement}%</TableCell></>}
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white text-xs px-2" onClick={() => setActiveSection && setActiveSection('messagerie')}>
                          <MessageCircle className="h-3 w-3 mr-1" />Contacter
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs px-2" onClick={() => toast.info("Détails — disponible prochainement")}>
                          Détails
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {data.length === 0 && (
        <div className="text-center py-16">
          <UserPlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Aucun partenaire trouvé</h3>
          <p className="text-muted-foreground mb-4">Modifiez vos filtres ou ajoutez un nouveau partenaire</p>
          <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-primary to-accent text-white">
            <UserPlus className="h-4 w-4 mr-2" />Ajouter un partenaire
          </Button>
        </div>
      )}

      {/* Dialog Ajouter */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="w-6 h-6" />Ajouter un partenaire
            </DialogTitle>
            <DialogDescription>Recherchez un influenceur dans notre répertoire et ajoutez-le comme partenaire</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Rechercher un influenceur</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Tibo InShape, Squeezie, Enjoy Phoenix..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Influenceurs disponibles ({filteredInfluencers.length})</label>
              <div className="border rounded-lg max-h-72 overflow-y-auto divide-y">
                {filteredInfluencers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground"><Search className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Aucun influenceur trouvé</p></div>
                ) : filteredInfluencers.map((inf) => (
                  <div key={inf.id} onClick={() => setSelectedInfluencer(inf)}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedInfluencer?.id === inf.id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-semibold">
                          {inf.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{inf.name}</h4>
                          {inf.verified && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700"><CheckCircle className="w-3 h-3 mr-1" />Vérifié</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{inf.handle}</p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-xs">{inf.niche}</Badge>
                          <Badge variant="outline" className="text-xs">{inf.platform}</Badge>
                          <Badge variant="outline" className="text-xs">{(inf.followers / 1000000).toFixed(1)}M followers</Badge>
                          <Badge variant="outline" className="text-xs">{inf.engagement}% engagement</Badge>
                        </div>
                      </div>
                      {selectedInfluencer?.id === inf.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">💡 Cliquez pour sélectionner un influenceur</p>
            </div>

            {selectedInfluencer && (
              <div className="p-4 rounded-lg bg-primary/5 border-2 border-primary/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Influenceur sélectionné</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Nom:</span><p className="font-medium">{selectedInfluencer.name}</p></div>
                  <div><span className="text-muted-foreground">Plateforme:</span><p className="font-medium">{selectedInfluencer.platform}</p></div>
                  <div><span className="text-muted-foreground">Followers:</span><p className="font-medium">{(selectedInfluencer.followers / 1000000).toFixed(1)}M</p></div>
                  <div><span className="text-muted-foreground">Engagement:</span><p className="font-medium">{selectedInfluencer.engagement}%</p></div>
                  <div><span className="text-muted-foreground">Localisation:</span><p className="font-medium">{selectedInfluencer.location}</p></div>
                  <div><span className="text-muted-foreground">Niche:</span><p className="font-medium">{selectedInfluencer.niche}</p></div>
                </div>
                <div className="mt-3 pt-3 border-t"><p className="text-xs text-muted-foreground italic">{selectedInfluencer.bio}</p></div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); setSearchQuery(""); setSelectedInfluencer(null) }}>Annuler</Button>
            <Button onClick={handleAddPartner} disabled={!selectedInfluencer} className="bg-gradient-to-r from-primary to-accent text-white">
              <UserPlus className="h-4 w-4 mr-2" />Ajouter comme partenaire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PartenairesSection