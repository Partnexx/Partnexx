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
import { Search, MapPin, Calendar, DollarSign, Users, Send, AlertCircle, CheckCircle, Brain, Percent, Globe, Lock, Flame, Star, Rocket, Target } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import supabase from '@/lib/supabase'
import { useUserLevel } from '@/lib/hook/useUserLevel'
import LevelGate from '@/components/LevelGate'

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
  { id: "4b47f5ff-4abe-475f-b75b-dfdb4d132537", title: "Placement Produit - Skincare Bio", company: "GreenGlow Beauty", logo: "GG", category: "Beauté", budget: { min: 2500, max: 4000, currency: "€" }, location: "Paris, France", timeline: "2 semaines", description: "Placement de nos produits skincare bio dans vos contenus quotidiens. Nous recherchons des influenceurs beauté pour intégrer naturellement nos produits.", requirements: ["25K+ followers sur Instagram", "Engagement rate > 4%", "Audience féminine 18-35 ans", "Contenu beauté régulier"], platforms: ["Instagram", "TikTok"], contentTypes: ["Placement produit"], deliverables: 8, followers: { min: 25000, platform: "Instagram" }, deadline: "2024-02-15", applicants: 47, tags: ["Bio", "Skincare", "Naturel"], featured: true, verified: true, type: "general" },
  { id: "5c55d390-cff2-41dd-9753-729986ad47fa", title: "Ambassadeur de Marque - Mode", company: "StyleHub", logo: "SH", category: "Mode", budget: { min: 3500, max: 6000, currency: "€" }, location: "Lyon, France", timeline: "6 mois", description: "Nous recherchons un ambassadeur de marque pour représenter StyleHub sur le long terme. Contrat de 6 mois renouvelable avec avantages exclusifs.", requirements: ["30K+ followers", "Style mode affirmé", "Engagement élevé", "Disponible pour événements"], platforms: ["Instagram", "TikTok"], contentTypes: ["Ambassadeur"], deliverables: 24, followers: { min: 30000, platform: "Instagram" }, deadline: "2024-02-20", applicants: 32, tags: ["Mode", "Ambassadeur", "Long terme"], verified: true, type: "general" },
  { id: "2da8f38a-dbc7-4104-b4a9-753e43959818", title: "Campagne de Notoriété - Lancement App", company: "TechNova", logo: "TN", category: "Tech", budget: { min: 4000, max: 7000, currency: "€" }, location: "À distance", timeline: "1 mois", description: "Campagne de notoriété pour le lancement de notre nouvelle application mobile. Objectif : générer du buzz et accroître la visibilité de la marque.", requirements: ["50K+ followers", "Audience tech-savvy", "Fort taux d'engagement", "Capacité de créer du viral"], platforms: ["YouTube", "Instagram", "TikTok"], contentTypes: ["Notoriété"], deliverables: 10, followers: { min: 50000, platform: "Instagram" }, deadline: "2024-03-01", applicants: 28, tags: ["Tech", "Lancement", "Notoriété"], featured: true, type: "general" },
  { id: "a380061d-5f06-486f-885a-441ae4a4d20d", title: "Collaboration One-Shot - Sneakers", company: "UrbanKicks", logo: "UK", category: "Mode", budget: { min: 1500, max: 2500, currency: "€" }, location: "Paris, France", timeline: "1 semaine", description: "Collaboration ponctuelle pour promouvoir notre nouvelle collection de sneakers limitée. Contrat one-shot avec livraison rapide.", requirements: ["20K+ followers", "Style streetwear", "Audience 16-30 ans"], platforms: ["Instagram", "TikTok"], contentTypes: ["One-shot"], deliverables: 3, followers: { min: 20000, platform: "Instagram" }, deadline: "2024-02-10", applicants: 65, tags: ["Sneakers", "Streetwear", "Limité"], urgent: true, verified: true, type: "general" },
  { id: "57b67733-310c-4a51-b6fe-fe9ad9472300", title: "Placement Produit - Compléments Alimentaires", company: "VitalBoost", logo: "VB", category: "Sport", budget: { min: 2000, max: 3500, currency: "€" }, location: "À distance", timeline: "3 semaines", description: "Intégration naturelle de nos compléments alimentaires dans vos routines fitness et nutrition.", requirements: ["15K+ followers", "Contenu sport/wellness", "Crédibilité santé"], platforms: ["Instagram", "YouTube"], contentTypes: ["Placement produit"], deliverables: 6, followers: { min: 15000, platform: "Instagram" }, deadline: "2024-02-25", applicants: 41, tags: ["Sport", "Nutrition", "Wellness"], verified: true, type: "general" },
  { id: "700785b7-5699-4b45-9330-f53ae74151c7", title: "One-Shot Événement - Festival Mode", company: "ParisStyleWeek", logo: "PSW", category: "Mode", budget: { min: 3000, max: 4500, currency: "€" }, location: "Paris, France", timeline: "3 jours", description: "Couverture one-shot de notre festival de mode. Présence sur place requise pour créer du contenu en temps réel.", requirements: ["40K+ followers", "Expérience événements", "Disponibilité 15-17 mars", "Basé à Paris ou mobilité"], platforms: ["Instagram", "TikTok"], contentTypes: ["One-shot"], deliverables: 15, followers: { min: 40000, platform: "Instagram" }, deadline: "2024-03-10", applicants: 22, tags: ["Événement", "Mode", "Festival"], featured: true, verified: true, type: "general" },
  { id: "cfbf99ce-3cae-4da1-a401-f0daaf91fec7", title: "Programme Affiliation - Fitness", company: "FitLife Pro", logo: "FL", category: "Sport", commission: 15, budget: { min: 0, max: 0, currency: "€" }, location: "En ligne", timeline: "Programme continu", description: "Rejoignez notre programme d'affiliation et gagnez 15% de commission sur chaque vente générée via votre code promo unique.", requirements: ["5K+ followers", "Contenu sport/fitness", "Engagement actif"], platforms: ["Instagram", "TikTok", "YouTube"], contentTypes: ["Post", "Story", "Video"], deliverables: 0, followers: { min: 5000, platform: "Instagram" }, deadline: "Programme permanent", applicants: 156, tags: ["Affiliation", "Fitness", "Commission"], type: "affiliation" },
  { id: "57f467f1-ad41-4047-8baa-5451cae15473", title: "Affiliation Beauté - Cosmétiques", company: "BeautyBox", logo: "BB", category: "Beauté", commission: 20, budget: { min: 0, max: 0, currency: "€" }, location: "En ligne", timeline: "Programme continu", description: "Programme d'affiliation beauté avec 20% de commission. Recevez des produits gratuits et générez des revenus passifs.", requirements: ["10K+ followers", "Contenu beauté", "Audience engagée"], platforms: ["Instagram", "TikTok"], contentTypes: ["Post", "Story", "Reel"], deliverables: 0, followers: { min: 10000, platform: "Instagram" }, deadline: "Programme permanent", applicants: 203, tags: ["Affiliation", "Beauté", "Cosmétiques"], type: "affiliation" },
  { id: "1223cf6e-7519-465f-831a-bcc24bb515a7", title: "Affiliation Mode - E-commerce", company: "TrendyWear", logo: "TW", category: "Mode", commission: 12, budget: { min: 0, max: 0, currency: "€" }, location: "En ligne", timeline: "Programme continu", description: "Gagnez 12% sur chaque vente + bonus mensuels selon vos performances. Code promo exclusif inclus.", requirements: ["8K+ followers", "Style mode", "Publications régulières"], platforms: ["Instagram", "TikTok"], contentTypes: ["Post", "Story"], deliverables: 0, followers: { min: 8000, platform: "Instagram" }, deadline: "Programme permanent", applicants: 178, tags: ["Affiliation", "Mode", "E-commerce"], type: "affiliation" },
  { id: "30b265f9-40e8-44ee-ab7e-b8f59b31e1f5", title: "Campagne Exclusive Luxe", company: "Prestige Parfums", logo: "PP", category: "Beauté", budget: { min: 5000, max: 8000, currency: "€" }, location: "Paris, France", timeline: "1 mois", description: "Campagne exclusive pour notre nouvelle ligne de parfums de luxe. Vous avez été sélectionné(e) en fonction de votre profil et de votre audience.", requirements: ["50K+ followers", "Audience premium", "Taux d'engagement > 5%", "Historique collaborations luxe"], platforms: ["Instagram"], contentTypes: ["Post", "Story", "Reel"], deliverables: 10, followers: { min: 50000, platform: "Instagram" }, deadline: "2024-02-25", applicants: 12, tags: ["Luxe", "Beauté", "Exclusif"], featured: true, urgent: true, verified: true, type: "targeted", matchScore: 96 },
  { id: "05cbffdd-726e-47df-b326-1368c9d971d8", title: "Ambassadeur Tech - Gaming", company: "GamersHub", logo: "GH", category: "Tech", budget: { min: 4000, max: 7000, currency: "€" }, location: "À distance", timeline: "6 mois", description: "Nous vous avons identifié comme ambassadeur potentiel pour notre marque gaming. Partenariat long terme avec avantages exclusifs.", requirements: ["30K+ followers", "Contenu gaming régulier", "Audience 16-30 ans", "Streaming actif"], platforms: ["YouTube", "Instagram", "Twitter"], contentTypes: ["Video", "Post", "Story"], deliverables: 15, followers: { min: 30000, platform: "YouTube" }, deadline: "2024-03-10", applicants: 8, tags: ["Gaming", "Tech", "Long terme"], verified: true, type: "targeted", matchScore: 92 },
  { id: "af66a54b-9c84-4510-a8b1-ea46cba4d211", title: "Campagne Lifestyle Premium", company: "LifeLux", logo: "LL", category: "Lifestyle", budget: { min: 3500, max: 6000, currency: "€" }, location: "Multiple", timeline: "2 mois", description: "Votre profil correspond parfaitement à notre recherche d'influenceur lifestyle premium. Campagne multi-plateforme avec voyages inclus.", requirements: ["40K+ followers", "Contenu lifestyle haut de gamme", "Audience internationale", "Disponibilité voyages"], platforms: ["Instagram", "YouTube"], contentTypes: ["Post", "Story", "Video"], deliverables: 12, followers: { min: 40000, platform: "Instagram" }, deadline: "2024-02-28", applicants: 15, tags: ["Lifestyle", "Premium", "Voyage"], featured: true, verified: true, type: "targeted", matchScore: 89 },

  // 🔥 EXCLUSIVE (Diamant)
  { id: "exc-001-hermes", title: "Lancement Sac Hermès Édition Limitée", company: "Hermès Paris", logo: "H", category: "Mode", budget: { min: 8000, max: 15000, currency: "€" }, location: "Paris, France", timeline: "3 semaines", description: "Hermès recherche un créateur d'élite pour le lancement de notre nouvelle édition limitée. Campagne réservée aux profils premium.", requirements: ["100K+ followers", "Audience luxe", "Engagement > 6%", "Image de marque haut de gamme"], platforms: ["Instagram"], contentTypes: ["Post", "Reel", "Story"], deliverables: 8, followers: { min: 100000, platform: "Instagram" }, deadline: "2026-06-15", applicants: 8, tags: ["Luxe", "Édition limitée", "Haute couture"], featured: true, verified: true, type: "exclusive" },
  { id: "exc-002-apple", title: "Campagne Apple Vision Pro - France", company: "Apple", logo: "A", category: "Tech", budget: { min: 12000, max: 25000, currency: "€" }, location: "Multiple", timeline: "2 mois", description: "Apple lance officiellement Vision Pro en France. Nous recherchons 3 créateurs tech d'exception pour porter le message.", requirements: ["80K+ followers tech", "Contenu tech qualitatif", "Audience adultes 25-45", "Anglais courant"], platforms: ["YouTube", "Instagram"], contentTypes: ["Video longue", "Reel"], deliverables: 6, followers: { min: 80000, platform: "YouTube" }, deadline: "2026-07-01", applicants: 14, tags: ["Apple", "Tech", "Lancement"], featured: true, verified: true, type: "exclusive" },
  { id: "exc-003-rolex", title: "Rolex - Campagne Submariner", company: "Rolex", logo: "R", category: "Lifestyle", budget: { min: 10000, max: 20000, currency: "€" }, location: "Suisse / France", timeline: "1 mois", description: "Rolex sélectionne 5 créateurs lifestyle premium pour la campagne de la nouvelle Submariner. Voyage en Suisse inclus.", requirements: ["70K+ followers", "Audience HNI (High Net Income)", "Contenu lifestyle premium", "Discrétion absolue"], platforms: ["Instagram"], contentTypes: ["Post", "Story", "Reel"], deliverables: 5, followers: { min: 70000, platform: "Instagram" }, deadline: "2026-06-20", applicants: 6, tags: ["Horlogerie", "Luxe", "Voyage"], featured: true, verified: true, type: "exclusive" },
  { id: "exc-004-chanel", title: "Chanel Beauty - Nouvelle Égérie", company: "Chanel", logo: "C", category: "Beauté", budget: { min: 15000, max: 30000, currency: "€" }, location: "Paris, France", timeline: "3 mois", description: "Chanel recherche sa nouvelle égérie digitale pour la ligne beauté 2026. Partenariat exclusif et contenu privilégié.", requirements: ["120K+ followers", "Image élégante", "Audience féminine premium", "Expérience luxe"], platforms: ["Instagram", "TikTok"], contentTypes: ["Post", "Reel", "Vidéo"], deliverables: 12, followers: { min: 120000, platform: "Instagram" }, deadline: "2026-07-15", applicants: 22, tags: ["Égérie", "Beauté", "Luxe"], featured: true, verified: true, type: "exclusive" },

  // ⭐ CONFIDENTIAL (Élite)
  { id: "conf-001-secret", title: "Lancement Sneaker Confidentiel - NDA", company: "Marque Premium", logo: "?", category: "Mode", budget: { min: 18000, max: 35000, currency: "€" }, location: "À distance", timeline: "2 mois", description: "🔒 Campagne sous NDA. Lancement d'un produit révolutionnaire dans l'univers sneakers. Détails communiqués après signature du NDA.", requirements: ["50K+ followers", "Audience streetwear", "Signature NDA obligatoire", "Discrétion totale"], platforms: ["Instagram", "TikTok"], contentTypes: ["Reveal exclusif"], deliverables: 4, followers: { min: 50000, platform: "Instagram" }, deadline: "2026-08-01", applicants: 3, tags: ["NDA", "Secret", "Reveal"], featured: true, verified: true, type: "confidential" },
  { id: "conf-002-tech", title: "Beta Test Confidentielle - Startup IA", company: "Stealth Mode Startup", logo: "🔒", category: "Tech", budget: { min: 25000, max: 50000, currency: "€" }, location: "Paris / À distance", timeline: "4 mois", description: "🔒 Startup confidentielle développant une IA révolutionnaire. Recherche 2 ambassadeurs pour beta-test et campagne de lancement.", requirements: ["100K+ followers tech", "NDA signé", "Disponibilité tests", "Accès anticipé"], platforms: ["YouTube", "Twitter"], contentTypes: ["Video", "Thread"], deliverables: 8, followers: { min: 100000, platform: "YouTube" }, deadline: "2026-09-01", applicants: 5, tags: ["IA", "Stealth", "Beta"], featured: true, verified: true, type: "confidential" },
  { id: "conf-003-luxury", title: "Yacht Privé - Campagne Voyage Premium", company: "Riviera Yachts", logo: "RY", category: "Lifestyle", budget: { min: 30000, max: 60000, currency: "€" }, location: "Côte d'Azur", timeline: "1 semaine", description: "🔒 Campagne ultra-confidentielle avec yacht privé sur la Côte d'Azur. 1 seule sélection.", requirements: ["80K+ followers", "Audience HNI internationale", "NDA strict", "Passport valide"], platforms: ["Instagram"], contentTypes: ["Story", "Reel"], deliverables: 10, followers: { min: 80000, platform: "Instagram" }, deadline: "2026-07-30", applicants: 2, tags: ["Yacht", "Voyage", "Premium"], featured: true, verified: true, type: "confidential" },

  // 🚀 PREMIUM (Champion)
  { id: "prem-001-louis", title: "Ambassadeur Global Louis Vuitton 12 mois", company: "Louis Vuitton", logo: "LV", category: "Mode", budget: { min: 50000, max: 150000, currency: "€" }, location: "International", timeline: "12 mois", description: "🚀 Devenir ambassadeur global Louis Vuitton pour 12 mois. Voyages internationaux, événements VIP, equity possible.", requirements: ["200K+ followers", "Audience internationale", "Image impeccable", "Disponibilité 365 jours"], platforms: ["Instagram", "TikTok", "YouTube"], contentTypes: ["Multi-plateforme"], deliverables: 50, followers: { min: 200000, platform: "Instagram" }, deadline: "2026-09-15", applicants: 4, tags: ["Ambassadeur", "Global", "Equity"], featured: true, verified: true, type: "premium" },
  { id: "prem-002-fashion", title: "Cover Vogue + Campagne Internationale", company: "Condé Nast", logo: "V", category: "Mode", budget: { min: 80000, max: 200000, currency: "€" }, location: "New York / Paris / Milan", timeline: "6 mois", description: "🚀 Devenir cover de Vogue + campagne internationale 6 mois. Réservé aux créateurs au sommet de leur art.", requirements: ["300K+ followers", "Multi-langue", "Couverture médiatique existante", "Expérience shoot pro"], platforms: ["Instagram", "TikTok"], contentTypes: ["Magazine", "Vidéo", "Post"], deliverables: 20, followers: { min: 300000, platform: "Instagram" }, deadline: "2026-10-01", applicants: 3, tags: ["Vogue", "Cover", "International"], featured: true, verified: true, type: "premium" },
]

/* ============================================================
   COMPOSANT INTÉRIEUR (la vraie page une fois validée par LevelGate)
   ============================================================ */
function OpportunitesContent({ user }) {
  const { canAccess, score: userScore } = useUserLevel(user?.id)

  const canAccessExclusive = canAccess('exclusiveOpportunities')
  const canAccessConfidential = canAccess('confidentialCampaigns')
  const canAccessPremium = canAccess('premiumOpportunities')

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

      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!influencer) { toast.error("Profil influenceur introuvable"); return }

      const { error } = await supabase.from('applications').insert({
        influencer_id: influencer.id,
        campaign_id: selectedCampaign.id,
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

  const CampaignCard = ({ campaign, locked = false, lockLevelName, lockLevelEmoji, lockLevelGradient, lockPointsRequired }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {locked && (
        <div className="absolute inset-0 z-30 backdrop-blur-md bg-background/50 flex flex-col items-center justify-center gap-3 p-6 text-center rounded-lg">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${lockLevelGradient} flex items-center justify-center shadow-lg`}>
            <Lock className="h-8 w-8 text-white" />
          </div>
          <Badge className={`bg-gradient-to-r ${lockLevelGradient} text-white border-0 shadow-lg text-sm`}>
            {lockLevelEmoji} {lockLevelName}
          </Badge>
          <p className="text-sm font-semibold">Opportunité réservée niveau {lockLevelName}</p>
          <p className="text-xs text-muted-foreground">
            Plus que <span className="font-bold text-primary">{Math.max(0, lockPointsRequired - userScore)} pts</span> à gagner
          </p>
        </div>
      )}

      <div className={locked ? 'opacity-40' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">{campaign.logo}</AvatarFallback>
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
              <div className="flex-1"><p className="text-sm font-medium">Compatibilité IA</p><p className="text-xs text-muted-foreground">{campaign.matchScore}% de match</p></div>
              <Badge className="bg-primary text-white">{campaign.matchScore}%</Badge>
            </div>
          )}
          <Separator />
          <Button className="w-full" onClick={() => !locked && handleOpenSheet(campaign)} disabled={locked}>
            <Send className="h-4 w-4 mr-2" />Postuler à cette campagne
          </Button>
        </CardContent>
      </div>
    </Card>
  )

  const visibleTabsCount = 3 + 1 + (canAccessConfidential ? 1 : 0) + (canAccessPremium ? 1 : 0)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Opportunités</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
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
        <TabsList className={`grid w-full gap-3 bg-transparent p-0 h-auto`} style={{ gridTemplateColumns: `repeat(${visibleTabsCount}, minmax(0, 1fr))` }}>
          <TabsTrigger value="targeted" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-orange-400 bg-card h-auto py-3 px-3 flex items-center justify-center gap-2">
            <Brain className="h-5 w-5" />
            <div className="flex flex-col items-start"><span className="font-semibold text-sm">Pour vous</span><span className="text-xs opacity-80">({filterCampaigns("targeted").length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="affiliation" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-green-400 bg-card h-auto py-3 px-3 flex items-center justify-center gap-2">
            <Percent className="h-5 w-5" />
            <div className="flex flex-col items-start"><span className="font-semibold text-sm">Affiliation</span><span className="text-xs opacity-80">({filterCampaigns("affiliation").length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-blue-400 bg-card h-auto py-3 px-3 flex items-center justify-center gap-2">
            <Globe className="h-5 w-5" />
            <div className="flex flex-col items-start"><span className="font-semibold text-sm">Public</span><span className="text-xs opacity-80">({filterCampaigns("general").length})</span></div>
          </TabsTrigger>

          <TabsTrigger value="exclusive" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-teal-400 bg-card h-auto py-3 px-3 flex items-center justify-center gap-2 relative">
            <Flame className="h-5 w-5" />
            <div className="flex flex-col items-start"><span className="font-semibold text-sm">Exclusif</span><span className="text-xs opacity-80">({filterCampaigns("exclusive").length})</span></div>
            {!canAccessExclusive && <Lock className="absolute top-1 right-2 h-3 w-3 text-muted-foreground" />}
          </TabsTrigger>

          {canAccessConfidential && (
            <TabsTrigger value="confidential" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-fuchsia-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-fuchsia-400 bg-card h-auto py-3 px-3 flex items-center justify-center gap-2">
              <Star className="h-5 w-5" />
              <div className="flex flex-col items-start"><span className="font-semibold text-sm">Confidentiel</span><span className="text-xs opacity-80">({filterCampaigns("confidential").length})</span></div>
            </TabsTrigger>
          )}

          {canAccessPremium && (
            <TabsTrigger value="premium" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-violet-400 bg-card h-auto py-3 px-3 flex items-center justify-center gap-2">
              <Rocket className="h-5 w-5" />
              <div className="flex flex-col items-start"><span className="font-semibold text-sm">Premium</span><span className="text-xs opacity-80">({filterCampaigns("premium").length})</span></div>
            </TabsTrigger>
          )}
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
            <TabsContent value="all"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").map((c) => <CampaignCard key={c.id} campaign={c} />)}</div></TabsContent>
            <TabsContent value="placement"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("Placement produit")).map((c) => <CampaignCard key={c.id} campaign={c} />)}</div></TabsContent>
            <TabsContent value="ambassadeur"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("Ambassadeur")).map((c) => <CampaignCard key={c.id} campaign={c} />)}</div></TabsContent>
            <TabsContent value="notoriete"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("Notoriété")).map((c) => <CampaignCard key={c.id} campaign={c} />)}</div></TabsContent>
            <TabsContent value="oneshot"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filterCampaigns("general").filter(c => c.contentTypes.includes("One-shot")).map((c) => <CampaignCard key={c.id} campaign={c} />)}</div></TabsContent>
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
            {filterCampaigns("affiliation").map((c) => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        </TabsContent>

        <TabsContent value="exclusive" className="space-y-4">
          <Card className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-teal-600" />
                <CardTitle>Opportunités Exclusives</CardTitle>
                <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0">🔥 Diamant</Badge>
              </div>
              <CardDescription>
                Campagnes premium avec des marques de luxe (Hermès, Apple, Rolex...). Postulables uniquement à partir du niveau Diamant.
                {!canAccessExclusive && (
                  <span className="block mt-2 text-teal-600 font-semibold">
                    🔒 Plus que {Math.max(0, 2000 - userScore)} points pour débloquer
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCampaigns("exclusive").map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                locked={!canAccessExclusive}
                lockLevelName="Diamant"
                lockLevelEmoji="🔥"
                lockLevelGradient="from-teal-400 to-cyan-500"
                lockPointsRequired={2000}
              />
            ))}
          </div>
        </TabsContent>

        {canAccessConfidential && (
          <TabsContent value="confidential" className="space-y-4">
            <Card className="bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-fuchsia-600" />
                  <CardTitle>Campagnes Confidentielles</CardTitle>
                  <Badge className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white border-0">⭐ Élite</Badge>
                </div>
                <CardDescription>
                  Campagnes sous NDA. Lancements de produits avant l&apos;annonce officielle, partenariats avec startups en stealth mode...
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterCampaigns("confidential").map((c) => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </TabsContent>
        )}

        {canAccessPremium && (
          <TabsContent value="premium" className="space-y-4">
            <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-violet-600" />
                  <CardTitle>Opportunités Premium</CardTitle>
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0">🚀 Champion</Badge>
                </div>
                <CardDescription>
                  Le top du top. Ambassadeur global 12 mois, cover Vogue, equity dans les sociétés. Réservé aux créateurs au sommet.
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterCampaigns("premium").map((c) => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </TabsContent>
        )}
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
                <div><h3 className="font-semibold mb-2">Description de la campagne</h3><p className="text-sm text-muted-foreground">{selectedCampaign.description}</p></div>
                <div>
                  <h3 className="font-semibold mb-2">Critères requis</h3>
                  <ul className="space-y-1">
                    {selectedCampaign.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{req}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Détails</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Budget</p>{selectedCampaign.type === "affiliation" ? <p className="font-semibold text-green-600">{selectedCampaign.commission}% commission</p> : <p className="font-semibold">{selectedCampaign.budget.min.toLocaleString()} - {selectedCampaign.budget.max.toLocaleString()} {selectedCampaign.budget.currency}</p>}</div>
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
                  <div className="flex flex-wrap gap-2">{selectedCampaign.contentTypes.map((type) => <Badge key={type} variant="secondary">{type}</Badge>)}</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="motivation">Message de motivation *</Label>
                  <Textarea id="motivation" placeholder="Expliquez pourquoi vous êtes le/la meilleur(e) candidat(e) pour cette campagne (minimum 50 caractères)..." value={motivationMessage} onChange={(e) => setMotivationMessage(e.target.value)} rows={6} maxLength={1000} className="resize-none" />
                  <p className="text-xs text-muted-foreground">{motivationMessage.length} / 1000 caractères (minimum 50)</p>
                </div>
                <Button className="w-full" onClick={handleApply} disabled={motivationMessage.trim().length < 50 || motivationMessage.length > 1000}>
                  <Send className="h-4 w-4 mr-2" />Postuler
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

/* ============================================================
   EXPORT PRINCIPAL : wrappé par LevelGate
   ============================================================ */
export default function OpportunitesSection({ user }) {
  return (
    <LevelGate user={user} sectionTitle="Opportunités" sectionDescription="Campagnes Ciblées • Candidatures Rapides • Matching Intelligent">
      <OpportunitesContent user={user} />
    </LevelGate>
  )
}
