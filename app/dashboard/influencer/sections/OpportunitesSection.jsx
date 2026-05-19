'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Search, MapPin, Calendar, DollarSign, Users, Send, AlertCircle, CheckCircle, Brain, Percent, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import supabase from '@/lib/supabase'

const Instagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)
const Youtube = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const Twitter = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.843L1.813 2.25h6.906l4.258 5.638 5.267-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const motivationSchema = z.object({
  motivation: z.string().trim()
    .min(50, { message: "Le message de motivation doit contenir au moins 50 caractères" })
    .max(1000, { message: "Le message de motivation ne peut pas dépasser 1000 caractères" })
})

const campaignsData = [
  { id: "g1", title: "Placement Produit - Skincare Bio", company: "GreenGlow Beauty", logo: "GG", category: "Beauté", budget: { min: 2500, max: 4000, currency: "€" }, location: "Paris, France", timeline: "2 semaines", description: "Placement de nos produits skincare bio dans vos contenus quotidiens. Nous recherchons des influenceurs beauté pour intégrer naturellement nos produits.", requirements: ["25K+ followers sur Instagram", "Engagement rate > 4%", "Audience féminine 18-35 ans", "Contenu beauté régulier"], platforms: ["Instagram", "TikTok"], contentTypes: ["Placement produit"], deliverables: 8, followers: { min: 25000, platform: "Instagram" }, deadline: "2024-02-15", applicants: 47, tags: ["Bio", "Skincare", "Naturel"], featured: true, verified: true, type: "general" },
  { id: "g2", title: "Ambassadeur de Marque - Mode", company: "StyleHub", logo: "SH", category: "Mode", budget: { min: 3500, max: 6000, currency: "€" }, location: "Lyon, France", timeline: "6 mois", description: "Nous recherchons un ambassadeur de marque pour représenter StyleHub sur le long terme. Contrat de 6 mois renouvelable avec avantages exclusifs.", requirements: ["30K+ followers", "Style mode affirmé", "Engagement élevé", "Disponible pour événements"], platforms: ["Instagram", "TikTok"], contentTypes: ["Ambassadeur"], deliverables: 24, followers: { min: 30000, platform: "Instagram" }, deadline: "2024-02-20", applicants: 32, tags: ["Mode", "Ambassadeur", "Long terme"], verified: true, type: "general" },
  { id: "g3", title: "Campagne de Notoriété - Lancement App", company: "TechNova", logo: "TN", category: "Tech", budget: { min: 4000, max: 7000, currency: "€" }, location: "À distance", timeline: "1 mois", description: "Campagne de notoriété pour le lancement de notre nouvelle application mobile. Objectif : générer du buzz et accroître la visibilité de la marque.", requirements: ["50K+ followers", "Audience tech-savvy", "Fort taux d'engagement", "Capacité de créer du viral"], platforms: ["YouTube", "Instagram", "TikTok"], contentTypes: ["Notoriété"], deliverables: 10, followers: { min: 50000, platform: "Instagram" }, deadline: "2024-03-01", applicants: 28, tags: ["Tech", "Lancement", "Notoriété"], featured: true, type: "general" },
  { id: "g4", title: "Collaboration One-Shot - Sneakers", company: "UrbanKicks", logo: "UK", category: "Mode", budget: { min: 1500, max: 2500, currency: "€" }, location: "Paris, France", timeline: "1 semaine", description: "Collaboration ponctuelle pour promouvoir notre nouvelle collection de sneakers limitée. Contrat one-shot avec livraison rapide.", requirements: ["20K+ followers", "Style streetwear", "Audience 16-30 ans"], platforms: ["Instagram", "TikTok"], contentTypes: ["One-shot"], deliverables: 3, followers: { min: 20000, platform: "Instagram" }, deadline: "2024-02-10", applicants: 65, tags: ["Sneakers", "Streetwear", "Limité"], urgent: true, verified: true, type: "general" },
  { id: "g5", title: "Placement Produit - Compléments Alimentaires", company: "VitalBoost", logo: "VB", category: "Sport", budget: { min: 2000, max: 3500, currency: "€" }, location: "À distance", timeline: "3 semaines", description: "Intégration naturelle de nos compléments alimentaires dans vos routines fitness et nutrition.", requirements: ["15K+ followers", "Contenu sport/wellness", "Crédibilité santé"], platforms: ["Instagram", "YouTube"], contentTypes: ["Placement produit"], deliverables: 6, followers: { min: 15000, platform: "Instagram" }, deadline: "2024-02-25", applicants: 41, tags: ["Sport", "Nutrition", "Wellness"], verified: true, type: "general" },
  { id: "g6", title: "One-Shot Événement - Festival Mode", company: "ParisStyleWeek", logo: "PSW", category: "Mode", budget: { min: 3000, max: 4500, currency: "€" }, location: "Paris, France", timeline: "3 jours", description: "Couverture one-shot de notre festival de mode. Présence sur place requise pour créer du contenu en temps réel.", requirements: ["40K+ followers", "Expérience événements", "Disponibilité 15-17 mars", "Basé à Paris ou mobilité"], platforms: ["Instagram", "TikTok"], contentTypes: ["One-shot"], deliverables: 15, followers: { min: 40000, platform: "Instagram" }, deadline: "2024-03-10", applicants: 22, tags: ["Événement", "Mode", "Festival"], featured: true, verified: true, type: "general" },
  { id: "a1", title: "Programme Affiliation - Fitness", company: "FitLife Pro", logo: "FL", category: "Sport", commission: 15, budget: { min: 0, max: 0, currency: "€" }, location: "En ligne", timeline: "Programme continu", description: "Rejoignez notre programme d'affiliation et gagnez 15% de commission sur chaque vente générée via votre code promo unique.", requirements: ["5K+ followers", "Contenu sport/fitness", "Engagement actif"], platforms: ["Instagram", "TikTok", "YouTube"], contentTypes: ["Post", "Story", "Video"], deliverables: 0, followers: { min: 5000, platform: "Instagram" }, deadline: "Programme permanent", applicants: 156, tags: ["Affiliation", "Fitness", "Commission"], type: "affiliation" },
  { id: "a2", title: "Affiliation Beauté - Cosmétiques", company: "BeautyBox", logo: "BB", category: "Beauté", commission: 20, budget: { min: 0, max: 0, currency: "€" }, location: "En ligne", timeline: "Programme continu", description: "Programme d'affiliation beauté avec 20% de commission. Recevez des produits gratuits et générez des revenus passifs.", requirements: ["10K+ followers", "Contenu beauté", "Audience engagée"], platforms: ["Instagram", "TikTok"], contentTypes: ["Post", "Story", "Reel"], deliverables: 0, followers: { min: 10000, platform: "Instagram" }, deadline: "Programme permanent", applicants: 203, tags: ["Affiliation", "Beauté", "Cosmétiques"], type: "affiliation" },
  { id: "a3", title: "Affiliation Mode - E-commerce", company: "TrendyWear", logo: "TW", category: "Mode", commission: 12, budget: { min: 0, max: 0, currency: "€" }, location: "En ligne", timeline: "Programme continu", description: "Gagnez 12% sur chaque vente + bonus mensuels selon vos performances. Code promo exclusif inclus.", requirements: ["8K+ followers", "Style mode", "Publications régulières"], platforms: ["Instagram", "TikTok"], contentTypes: ["Post", "Story"], deliverables: 0, followers: { min: 8000, platform: "Instagram" }, deadline: "Programme permanent", applicants: 178, tags: ["Affiliation", "Mode", "E-commerce"], type: "affiliation" },
  { id: "t1", title: "Campagne Exclusive Luxe", company: "Prestige Parfums", logo: "PP", category: "Beauté", budget: { min: 5000, max: 8000, currency: "€" }, location: "Paris, France", timeline: "1 mois", description: "Campagne exclusive pour notre nouvelle ligne de parfums de luxe. Vous avez été sélectionné(e) en fonction de votre profil et de votre audience.", requirements: ["50K+ followers", "Audience premium", "Taux d'engagement > 5%", "Historique collaborations luxe"], platforms: ["Instagram"], contentTypes: ["Post", "Story", "Reel"], deliverables: 10, followers: { min: 50000, platform: "Instagram" }, deadline: "2024-02-25", applicants: 12, tags: ["Luxe", "Beauté", "Exclusif"], featured: true, urgent: true, verified: true, type: "targeted", matchScore: 96 },
  { id: "t2", title: "Ambassadeur Tech - Gaming", company: "GamersHub", logo: "GH", category: "Tech", budget: { min: 4000, max: 7000, currency: "€" }, location: "À distance", timeline: "6 mois", description: "Nous vous avons identifié comme ambassadeur potentiel pour notre marque gaming. Partenariat long terme avec avantages exclusifs.", requirements: ["30K+ followers", "Contenu gaming régulier", "Audience 16-30 ans", "Streaming actif"], platforms: ["YouTube", "Instagram", "Twitter"], contentTypes: ["Video", "Post", "Story"], deliverables: 15, followers: { min: 30000, platform: "YouTube" }, deadline: "2024-03-10", applicants: 8, tags: ["Gaming", "Tech", "Long terme"], verified: true, type: "targeted", matchScore: 92 },
  { id: "t3", title: "Campagne Lifestyle Premium", company: "LifeLux", logo: "LL", category: "Lifestyle", budget: { min: 3500, max: 6000, currency: "€" }, location: "Multiple", timeline: "2 mois", description: "Votre profil correspond parfaitement à notre recherche d'influenceur lifestyle premium. Campagne multi-plateforme avec voyages inclus.", requirements: ["40K+ followers", "Contenu lifestyle haut de gamme", "Audience internationale", "Disponibilité voyages"], platforms: ["Instagram", "YouTube"], contentTypes: ["Post", "Story", "Video"], deliverables: 12, followers: { min: 40000, platform: "Instagram" }, deadline: "2024-02-28", applicants: 15, tags: ["Lifestyle", "Premium", "Voyage"], featured: true, verified: true, type: "targeted", matchScore: 89 },
]

export default function OpportunitesSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [motivationMessage, setMotivationMessage] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const filterCampaigns = (type) => campaignsData.filter(campaign => {
    const matchesType = campaign.type === type
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory
    return matchesType && matchesSearch && matchesCategory
  })

  const handleOpenSheet = (campaign) => {
    setSelectedCampaign(campaign)
    setMotivationMessage("")
    setIsSheetOpen(true)
  }

const handleApply = async () => {
  if (!selectedCampaign) return
  try {
    motivationSchema.parse({ motivation: motivationMessage })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error("Vous devez être connecté"); return }

    // Récupérer l'id influenceur depuis la table influencers
    const { data: influencer, error: infError } = await supabase
      .from('influencers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (infError || !influencer) {
      toast.error("Profil influenceur introuvable")
      return
    }

    const { error } = await supabase.from('applications').insert({
      influencer_id: influencer.id,
      campaign_id: 'fdcf0caa-1dfa-4461-a1d9-302df8cc5b00',
      brand_id: '46f965ec-479f-4777-af26-c8f23aca149e',
      cover_letter: `[${selectedCampaign.title}] ${motivationMessage}`,
      status: 'pending',
      applied_at: new Date().toISOString(),
    })

    if (error) {
  if (error.code === '23505') {
    toast.error("Vous avez déjà postulé à cette campagne !")
    setIsSheetOpen(false)
  } else {
    toast.error("Erreur lors de l'envoi")
    console.error(error)
  }
  return
}

    toast.success(`Candidature pour "${selectedCampaign.title}" envoyée !`)
    setMotivationMessage("")
    setSelectedCampaign(null)
    setIsSheetOpen(false)
  } catch (error) {
    if (error instanceof z.ZodError) toast.error(error.errors[0].message)
  }
}

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Instagram": return <Instagram className="h-4 w-4" />
      case "YouTube": return <Youtube className="h-4 w-4" />
      case "Twitter": return <Twitter className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const CampaignCard = ({ campaign }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                {campaign.logo}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{campaign.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{campaign.company}</p>
            </div>
          </div>
          {campaign.verified && (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />Vérifié
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            {campaign.type === "affiliation"
              ? <span className="font-semibold text-green-600">{campaign.commission}% commission</span>
              : <span>{campaign.budget.min.toLocaleString()} - {campaign.budget.max.toLocaleString()} {campaign.budget.currency}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{campaign.timeline}</span></div>
          <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{campaign.location}</span></div>
          <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /><span>{campaign.applicants} candidats</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {campaign.platforms.slice(0, 3).map((platform) => (
            <Badge key={platform} variant="outline" className="gap-1">{getPlatformIcon(platform)}{platform}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {campaign.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
        </div>
        {campaign.matchScore && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Compatibilité IA</p>
              <p className="text-xs text-muted-foreground">{campaign.matchScore}% de match</p>
            </div>
            <Badge className="bg-primary text-white">{campaign.matchScore}%</Badge>
          </div>
        )}
        <Separator />
        <Button className="w-full" onClick={() => handleOpenSheet(campaign)}>
          <Send className="h-4 w-4 mr-2" />Postuler à cette campagne
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Opportunités</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg hover:shadow-xl transition-shadow">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Campagnes Ciblées • Candidatures Rapides • Matching Intelligent</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une campagne..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <div className="w-full md:w-[200px]">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="all">Toutes catégories</option>
                <option value="Beauté">Beauté</option>
                <option value="Mode">Mode</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Sport">Sport</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="targeted" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-0 h-auto">
          <TabsTrigger value="targeted" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-orange-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20"><Brain className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Pour vous</span><span className="text-xs opacity-80">({filterCampaigns("targeted").length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="affiliation" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-green-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20"><Percent className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Affiliation</span><span className="text-xs opacity-80">({filterCampaigns("affiliation").length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-blue-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20"><Globe className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Public</span><span className="text-xs opacity-80">({filterCampaigns("general").length})</span></div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="targeted" className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-600" /><CardTitle>Campagnes Pour Vous</CardTitle></div>
              <CardDescription>Campagnes ciblées par les entreprises selon vos critères - Matching IA basé sur votre profil, audience et performances</CardDescription>
            </CardHeader>
          </Card>
          {filterCampaigns("targeted").length === 0 ? (
            <Card><CardContent className="py-12 text-center"><AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="font-semibold mb-2">Aucune campagne ciblée</h3><p className="text-sm text-muted-foreground">Complétez votre profil pour recevoir des campagnes personnalisées</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterCampaigns("targeted").map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-600" /><CardTitle>Campagnes Public</CardTitle></div>
              <CardDescription>Placements produits, ambassadeurs de marque, campagnes de notoriété et contrats one-shot ouverts à tous les influenceurs</CardDescription>
            </CardHeader>
          </Card>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 gap-2 bg-transparent p-0 h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-sky-400 data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl border-2 border-border/50 bg-card h-auto py-3 px-4">Toutes</TabsTrigger>
              <TabsTrigger value="placement" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-400 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl border-2 border-border/50 bg-card h-auto py-3 px-4">Placement produit</TabsTrigger>
              <TabsTrigger value="ambassadeur" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl border-2 border-border/50 bg-card h-auto py-3 px-4">Ambassadeur</TabsTrigger>
              <TabsTrigger value="notoriete" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl border-2 border-border/50 bg-card h-auto py-3 px-4">Notoriété</TabsTrigger>
              <TabsTrigger value="oneshot" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-800 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl border-2 border-border/50 bg-card h-auto py-3 px-4">One-shot</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}</div></TabsContent>
            <TabsContent value="placement" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("Placement produit")).map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}</div></TabsContent>
            <TabsContent value="ambassadeur" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("Ambassadeur")).map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}</div></TabsContent>
            <TabsContent value="notoriete" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("Notoriété")).map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}</div></TabsContent>
            <TabsContent value="oneshot" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("One-shot")).map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}</div></TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="affiliation" className="space-y-4">
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-2"><Percent className="h-5 w-5 text-green-600" /><CardTitle>Programmes d&apos;Affiliation</CardTitle></div>
              <CardDescription>Programmes d&apos;affiliation ouverts à tous les influenceurs - Postulez librement et générez des revenus passifs via vos codes promo</CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCampaigns("affiliation").map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          {selectedCampaign && (
            <>
              <SheetHeader>
                <SheetTitle>Candidature - {selectedCampaign.title}</SheetTitle>
                <SheetDescription>{selectedCampaign.company}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6 space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-2">Description de la campagne</h3>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Critères requis</h3>
                  <ul className="space-y-1">
                    {selectedCampaign.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Détails</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      {selectedCampaign.type === "affiliation"
                        ? <p className="font-semibold text-green-600">{selectedCampaign.commission}% commission</p>
                        : <p className="font-semibold">{selectedCampaign.budget.min.toLocaleString()} - {selectedCampaign.budget.max.toLocaleString()} {selectedCampaign.budget.currency}</p>}
                    </div>
                    <div><p className="text-muted-foreground">Livrables</p><p className="font-semibold">{selectedCampaign.deliverables || "Variable"} contenus</p></div>
                    <div><p className="text-muted-foreground">Deadline</p><p className="font-semibold">{selectedCampaign.deadline}</p></div>
                    <div><p className="text-muted-foreground">Localisation</p><p className="font-semibold">{selectedCampaign.location}</p></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Plateformes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="gap-1">{getPlatformIcon(platform)}{platform}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Types de contenu</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.contentTypes.map((type) => <Badge key={type} variant="secondary">{type}</Badge>)}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="motivation">Message de motivation *</Label>
                  <Textarea id="motivation" placeholder="Expliquez pourquoi vous êtes le/la meilleur(e) candidat(e) pour cette campagne (minimum 50 caractères)..." value={motivationMessage} onChange={(e) => setMotivationMessage(e.target.value)} rows={6} maxLength={1000} className="resize-none" />
                  <p className="text-xs text-muted-foreground">{motivationMessage.length} / 1000 caractères (minimum 50)</p>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleApply} disabled={motivationMessage.trim().length < 50 || motivationMessage.length > 1000}>
                    <Send className="h-4 w-4 mr-2" />Postuler
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}