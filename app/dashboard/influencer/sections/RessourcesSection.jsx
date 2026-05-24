'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { Search, DollarSign, Users, Target, Briefcase, Eye, TrendingUp, Globe, MessageCircle, Phone, FileText, Download, Brain, Crown, Award, Zap, AlertCircle, CheckCircle, Mail, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

const YoutubeIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
const Wand2 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 4-1 1"/><path d="m4 15 1-1"/><path d="m8.5 8.5-5 13 13-5-8-8Z"/><path d="m12 12 4.5 4.5"/></svg>
const Hash = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
const Lightbulb = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
const Layout = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
const HelpCircle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
const Play = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const ArrowRight = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
const Megaphone = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
const Film = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>
const ImageIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
const Smartphone = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
const Palette = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const Video = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>

// Template download links (à remplacer plus tard par de vrais liens)
const TEMPLATE_LINKS = {
  "Template Post Instagram": "https://partnexx.fr/templates/instagram-post.zip",
  "Stories Templates Pack": "https://partnexx.fr/templates/stories-pack.zip",
  "Kit Branding Complet": "https://partnexx.fr/templates/branding-kit.zip",
  "Templates Reels/TikTok": "https://partnexx.fr/templates/reels-tiktok.zip",
  "Media Kit Influenceur": "https://partnexx.fr/templates/media-kit.zip",
  "Calendrier Éditorial": "https://partnexx.fr/templates/calendrier-editorial.zip",
}

// Guide links (à remplacer plus tard)
const GUIDE_LINKS = {
  "Guide Complet Instagram 2024": "https://partnexx.fr/guides/instagram-2024",
  "Monétiser avec TikTok": "https://partnexx.fr/guides/monetiser-tiktok",
  "Négociation & Tarification": "https://partnexx.fr/guides/negociation-tarification",
  "Créer du Contenu UGC": "https://partnexx.fr/guides/ugc-content",
  "YouTube pour Créateurs": "https://partnexx.fr/guides/youtube-createurs",
  "LinkedIn pour Influenceurs": "https://partnexx.fr/guides/linkedin-influenceurs",
  "Photographier comme un Pro": "https://partnexx.fr/guides/photo-pro",
  "Community Management": "https://partnexx.fr/guides/community-management",
}

const aiTools = [
  { title: "Générateur de Captions IA", description: "Créez des légendes engageantes optimisées pour chaque plateforme", icon: Wand2, color: "from-purple-500 to-pink-500", features: ["Multilingue", "Émojis intelligents", "Hashtags suggérés"], isPremium: false, prompt: "Génère 3 captions Instagram engageantes pour un influenceur lifestyle. Inclus des émojis et 5 hashtags pertinents pour chaque caption. Format: Caption 1: [texte]\nHashtags: [hashtags]" },
  { title: "Recherche Hashtags Intelligente", description: "Trouvez les hashtags les plus performants selon votre niche", icon: Hash, color: "from-blue-500 to-cyan-500", features: ["Analyse tendances", "Score popularité", "Éviter shadowban"], isPremium: false, prompt: "Génère une liste de 20 hashtags performants pour un influenceur lifestyle/mode en France. Classe-les par catégorie: Populaires (1M+), Moyens (100K-1M), Niche (<100K). Explique pourquoi chaque groupe est utile." },
  { title: "Analyseur de Tendances", description: "Découvrez les sujets viraux en temps réel", icon: Target, color: "from-orange-500 to-red-500", features: ["Alertes temps réel", "Analyse prédictive", "Multi-plateformes"], isPremium: true, prompt: "Analyse les tendances actuelles sur Instagram et TikTok pour les influenceurs lifestyle en France. Donne 5 tendances avec: le sujet, pourquoi c'est viral, comment l'adapter, et le format idéal." },
  { title: "Générateur d'Idées Contenu", description: "Des suggestions personnalisées basées sur vos statistiques", icon: Lightbulb, color: "from-yellow-500 to-orange-500", features: ["Calendrier éditorial", "Formats variés", "Suggestions saison"], isPremium: false, prompt: "Génère 10 idées de contenu créatif pour un influenceur lifestyle sur Instagram et TikTok. Pour chaque idée: titre accrocheur, format recommandé (reel/post/story/carrousel), description courte, et pourquoi ça va performer." },
  { title: "Optimiseur d'Images IA", description: "Conseils pour améliorer vos visuels automatiquement", icon: ImageIcon, color: "from-green-500 to-emerald-500", features: ["Multi-formats", "Composition", "Filtres IA"], isPremium: false, prompt: "Donne 10 conseils professionnels pour optimiser les photos Instagram d'un influenceur lifestyle. Couvre: composition, lumière, couleurs, retouche, et cohérence du feed." },
  { title: "Générateur Scripts Vidéo", description: "Scripts personnalisés pour TikTok, Reels et Shorts", icon: Video, color: "from-pink-500 to-rose-500", features: ["Templates prêts", "Hooks accrocheurs", "CTA optimisés"], isPremium: true, prompt: "Écris un script complet pour une vidéo TikTok/Reel de 60 secondes sur le thème 'Ma routine matinale'. Structure: Hook (0-3s), Développement (3-50s), CTA (50-60s). Inclus les indications de timing et les transitions." },
  { title: "Assistant Planification Stories", description: "Planifiez et créez des stories captivantes avec IA", icon: Smartphone, color: "from-indigo-500 to-purple-500", features: ["Stickers suggérés", "Meilleur timing", "CTA intelligents"], isPremium: false, prompt: "Crée un plan de 7 stories Instagram pour une semaine pour un influenceur lifestyle. Pour chaque jour: heure optimale, type de story, contenu suggéré, stickers recommandés, et CTA." },
  { title: "Analyseur d'Audience", description: "Comprenez votre audience et adaptez votre contenu", icon: Users, color: "from-teal-500 to-cyan-500", features: ["Démographie", "Comportements", "Préférences contenu"], isPremium: true, prompt: "Analyse le profil type d'audience d'un influenceur lifestyle français avec 50K followers sur Instagram. Donne: démographie, centres d'intérêt, heures d'activité, types de contenu préférés, et recommandations." },
  { title: "Générateur de Bio Instagram", description: "Créez une bio percutante qui convertit", icon: FileText, color: "from-violet-500 to-fuchsia-500", features: ["Call-to-action", "Emojis optimisés", "Mots-clés SEO"], isPremium: false, prompt: "Génère 3 versions de bio Instagram pour un influenceur lifestyle/mode français. Chaque bio doit: faire max 150 caractères, inclure des emojis, un CTA clair, et les mots-clés importants. Explique le choix de chaque version." },
  { title: "Traducteur Multilingue", description: "Traduisez votre contenu pour toucher une audience internationale", icon: Globe, color: "from-sky-500 to-blue-500", features: ["30+ langues", "Ton adapté", "Contexte culturel"], isPremium: false, prompt: "Traduis ce message en anglais, espagnol et allemand en adaptant le ton pour chaque culture: 'Bonjour à tous ! Nouvelle vidéo disponible sur ma chaîne YouTube. N'oubliez pas de vous abonner et d'activer les notifications ! 🔔✨'" },
  { title: "Générateur de Réponses", description: "Répondez à vos commentaires avec l'aide de l'IA", icon: MessageCircle, color: "from-emerald-500 to-teal-500", features: ["Ton personnalisé", "Réponses rapides", "Engagement optimisé"], isPremium: false, prompt: "Génère 10 réponses types pour les commentaires les plus fréquents d'un influenceur lifestyle: commentaires positifs, questions sur les produits, demandes de collaboration, commentaires négatifs, et emojis. Ton: chaleureux et authentique." },
  { title: "Palette de Couleurs IA", description: "Trouvez la palette parfaite pour votre marque", icon: Palette, color: "from-rose-500 to-pink-500", features: ["Harmonies couleurs", "Accessibilité", "Export formats"], isPremium: true, prompt: "Propose 3 palettes de couleurs pour un influenceur lifestyle/mode sur Instagram. Pour chaque palette: 5 couleurs avec codes HEX, nom de la palette, mood/ambiance, et conseils d'utilisation pour les posts, stories et highlights." },
]

const templates = [
  { title: "Template Post Instagram", description: "Designs professionnels pour vos posts Instagram", gradient: "from-pink-500 to-purple-500", icon: "📸", category: "Social Media", downloads: "2.4K" },
  { title: "Stories Templates Pack", description: "Collection de 50+ templates pour stories Instagram", gradient: "from-purple-500 to-blue-500", icon: "📱", category: "Stories", downloads: "3.1K" },
  { title: "Kit Branding Complet", description: "Logo, couleurs, typographies et guidelines", gradient: "from-blue-500 to-cyan-500", icon: "🎨", category: "Branding", downloads: "1.8K" },
  { title: "Templates Reels/TikTok", description: "Formats vidéo courts optimisés pour viralité", gradient: "from-orange-500 to-red-500", icon: "🎬", category: "Vidéo", downloads: "4.2K" },
  { title: "Media Kit Influenceur", description: "Présentez vos stats et tarifs de façon pro", gradient: "from-green-500 to-emerald-500", icon: "📊", category: "Business", downloads: "1.5K" },
  { title: "Calendrier Éditorial", description: "Planifiez votre contenu sur 3 mois", gradient: "from-yellow-500 to-orange-500", icon: "📅", category: "Planning", downloads: "2.9K" },
]

const guides = [
  { title: "Guide Complet Instagram 2024", description: "Stratégies complètes pour exploser sur Instagram", icon: Megaphone, duration: "45 min de lecture", topics: ["Algorithme", "Croissance", "Monétisation"], color: "from-pink-500 to-rose-500" },
  { title: "Monétiser avec TikTok", description: "Tous les moyens de gagner de l'argent sur TikTok", icon: Briefcase, duration: "30 min de lecture", topics: ["Creator Fund", "Partenariats", "Lives"], color: "from-purple-500 to-pink-500" },
  { title: "Négociation & Tarification", description: "Comment définir vos tarifs et négocier avec les marques", icon: TrendingUp, duration: "25 min de lecture", topics: ["Grille tarifaire", "Contrats", "Conditions"], color: "from-blue-500 to-cyan-500" },
  { title: "Créer du Contenu UGC", description: "Maîtrisez l'art du User Generated Content", icon: Film, duration: "35 min de lecture", topics: ["Types de UGC", "Équipement", "Techniques"], color: "from-orange-500 to-red-500" },
  { title: "YouTube pour Créateurs", description: "Démarrer et monétiser sa chaîne YouTube", icon: YoutubeIcon, duration: "50 min de lecture", topics: ["Optimisation SEO", "Monétisation", "Thumbnails"], color: "from-red-500 to-pink-500" },
  { title: "LinkedIn pour Influenceurs", description: "Développer votre présence professionnelle", icon: Briefcase, duration: "40 min de lecture", topics: ["Personal Branding", "Networking", "B2B Partnerships"], color: "from-blue-600 to-indigo-600" },
  { title: "Photographier comme un Pro", description: "Techniques photo pour créateurs de contenu", icon: ImageIcon, duration: "30 min de lecture", topics: ["Lumière", "Composition", "Édition mobile"], color: "from-emerald-500 to-teal-500" },
  { title: "Community Management", description: "Engager et fidéliser votre communauté", icon: Users, duration: "35 min de lecture", topics: ["Engagement", "Modération", "Croissance"], color: "from-violet-500 to-purple-500" },
]

const faqs = [
  { category: "Démarrage", questions: [
    { question: "Comment commencer sur Partnexx en tant que créateur ?", answer: "Pour démarrer sur Partnexx, créez votre profil en renseignant vos réseaux sociaux, vos statistiques et vos niches. Complétez ensuite votre portfolio avec vos meilleurs contenus. Une fois votre profil vérifié, vous pourrez postuler aux opportunités et être contacté par les marques." },
    { question: "Combien de temps faut-il pour être vérifié ?", answer: "La vérification de votre profil prend généralement entre 24 et 48 heures. Vous recevrez une notification dès que votre profil sera approuvé." },
    { question: "Quels sont les critères pour rejoindre la plateforme ?", answer: "Nous acceptons les créateurs de toutes tailles ! Les critères principaux sont : avoir au moins 1000 abonnés sur une plateforme, publier régulièrement du contenu de qualité, et respecter nos conditions d'utilisation." },
  ]},
  { category: "Collaborations", questions: [
    { question: "Comment fixer mes tarifs pour une collaboration ?", answer: "Vos tarifs dépendent de plusieurs facteurs : votre nombre d'abonnés, votre taux d'engagement, votre niche et le type de contenu demandé. En général, comptez 0.01€ à 0.10€ par abonné pour un post Instagram." },
    { question: "Puis-je refuser une collaboration ?", answer: "Absolument ! Vous avez le contrôle total sur les collaborations que vous acceptez. Cela n'affectera pas négativement votre profil." },
    { question: "Comment se passe le paiement ?", answer: "Une fois la collaboration terminée et validée par la marque, le paiement est effectué sous 7 à 14 jours ouvrés via virement bancaire ou PayPal." },
  ]},
  { category: "Outils & Premium", questions: [
    { question: "Quels outils IA sont gratuits sur Partnexx ?", answer: "La plupart des outils IA de base sont gratuits : générateur de captions, recherche de hashtags, générateur d'idées, optimiseur d'images. Les outils avancés sont réservés aux membres Premium." },
    { question: "Quelle est la différence entre gratuit et Premium ?", answer: "Le plan gratuit donne accès aux opportunités basiques et outils essentiels. Premium débloque : opportunités exclusives, outils IA avancés, statistiques détaillées, support prioritaire et badge vérifié." },
    { question: "Y a-t-il des réductions pour les étudiants ?", answer: "Oui ! Les étudiants bénéficient de 50% de réduction sur l'abonnement Premium. Contactez le support avec votre carte étudiante pour obtenir votre code promo." },
  ]},
]

export default function RessourcesSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTool, setActiveTool] = useState(null)
  const [toolInput, setToolInput] = useState("")
  const [toolResult, setToolResult] = useState("")
  const [toolLoading, setToolLoading] = useState(false)

  const filterBySearch = (items) => items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDownload = (title) => {
    const link = TEMPLATE_LINKS[title]
    if (link) {
      toast.info(`Téléchargement de "${title}" en cours... Le lien sera disponible prochainement.`)
    } else {
      toast.error("Lien non disponible pour l'instant")
    }
  }

  const handlePreview = (title) => {
    toast.info(`Aperçu de "${title}" — Disponible prochainement`)
  }

  const handleReadGuide = (title) => {
    const link = GUIDE_LINKS[title]
    if (link) {
      toast.info(`Guide "${title}" — Disponible prochainement`)
    }
  }

  const handleOpenTool = (tool) => {
    setActiveTool(tool)
    setToolInput("")
    setToolResult("")
  }

  const handleRunTool = async () => {
    if (!activeTool) return
    setToolLoading(true)
    setToolResult("")

    try {
      const userPrompt = toolInput.trim()
        ? `${activeTool.prompt}\n\nInformations supplémentaires de l'utilisateur: ${toolInput}`
        : activeTool.prompt

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: userPrompt }],
        }),
      })

      const data = await response.json()
      const text = data.content?.map(c => c.text || "").join("") || "Aucun résultat"
      setToolResult(text)
    } catch (err) {
      setToolResult("Erreur lors de la génération. Veuillez réessayer.")
    }
    setToolLoading(false)
  }

  const handleCopyResult = () => {
    if (toolResult) {
      navigator.clipboard.writeText(toolResult)
      toast.success("Copié dans le presse-papiers !")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Ressources & Templates</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground mb-4">Outils IA • Templates Pro • Guides Complets</p>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Zap className="h-4 w-4 text-purple-600" /><span className="font-semibold text-foreground">12</span> Outils IA</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Layout className="h-4 w-4 text-blue-600" /><span className="font-semibold text-foreground">6</span> Templates prêts</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><BookOpen className="h-4 w-4 text-pink-600" /><span className="font-semibold text-foreground">8</span> Guides</div>
        </div>
      </div>

      <Input placeholder="Rechercher un outil, template ou guide..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 text-base border-2 focus:border-primary" />

      <Tabs defaultValue="outils" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 gap-3 bg-transparent p-0 h-auto">
          {[
            { value: "outils", label: "Outils IA", icon: Zap },
            { value: "templates", label: "Templates", icon: Layout },
            { value: "guides", label: "Guides", icon: BookOpen },
            { value: "faq", label: "FAQ", icon: HelpCircle },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="rounded-2xl h-14 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg bg-card hover:bg-muted/50 transition-all duration-300 border-2 border-border/50">
              <div className="flex items-center gap-2"><Icon className="h-4 w-4" /><span className="font-semibold">{label}</span></div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* OUTILS IA */}
        <TabsContent value="outils" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterBySearch(aiTools).map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card key={index} className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg`}><Icon className="h-6 w-6 text-white" /></div>
                      {tool.isPremium && <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"><Crown className="h-3 w-3 mr-1" />Premium</Badge>}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <div className="space-y-2">
                      {tool.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-600 shrink-0" /><span>{feature}</span></div>
                      ))}
                    </div>
                    <Button className="w-full" onClick={() => handleOpenTool(tool)}>
                      <Play className="h-4 w-4 mr-2" />Essayer maintenant
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TEMPLATES */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterBySearch(templates).map((template, index) => (
              <Card key={index} className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <CardHeader className="relative">
                  <div className={`w-full h-40 rounded-xl overflow-hidden mb-4 shadow-lg group-hover:scale-105 transition-transform bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                    <span className="text-5xl">{template.icon}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground"><Download className="h-4 w-4" /><span>{template.downloads}</span></div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{template.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handlePreview(template.title)}>
                      <Eye className="h-4 w-4 mr-2" />Aperçu
                    </Button>
                    <Button className="flex-1" onClick={() => handleDownload(template.title)}>
                      <Download className="h-4 w-4 mr-2" />Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* GUIDES */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterBySearch(guides).map((guide, index) => {
              const Icon = guide.icon
              return (
                <Card key={index} className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${guide.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <CardHeader className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${guide.color} shadow-lg shrink-0`}><Icon className="h-8 w-8 text-white" /></div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><BookOpen className="h-4 w-4" /><span>{guide.duration}</span></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex flex-wrap gap-2 mb-4">{guide.topics.map((topic, i) => <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>)}</div>
                    <Button className="w-full group" onClick={() => handleReadGuide(guide.title)}>
                      Lire le guide<ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"><HelpCircle className="h-6 w-6 text-white" /></div>
                <div><CardTitle className="text-2xl">Questions Fréquentes</CardTitle><p className="text-sm text-muted-foreground mt-1">Toutes les réponses à vos questions sur Partnexx</p></div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary to-purple-600 rounded-full" />{category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left hover:text-primary transition-colors"><span className="font-semibold">{faq.question}</span></AccordionTrigger>
                        <AccordionContent><p className="text-muted-foreground leading-relaxed">{faq.answer}</p></AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="relative overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <CardContent className="relative p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2"><MessageCircle className="h-6 w-6 text-blue-500" />Vous ne trouvez pas votre réponse ?</h3>
                <p className="text-muted-foreground">Notre équipe support est là pour vous aider 7j/7.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Chat en Direct", sub: "Réponse immédiate", icon: MessageCircle, color: "from-blue-500 to-cyan-500", badge: "En ligne", onClick: () => toast.info("Chat disponible prochainement") },
                  { label: "Email", sub: "support@partnexx.fr", icon: Mail, color: "from-purple-500 to-pink-500", badge: "~ 2h", onClick: () => window.location.href = "mailto:support@partnexx.fr" },
                  { label: "Téléphone", sub: "+33 1 23 45 67 89", icon: Phone, color: "from-green-500 to-emerald-500", badge: "9h-18h", onClick: () => window.location.href = "tel:+33123456789" },
                  { label: "Centre d'Aide", sub: "Guides et tutoriels", icon: BookOpen, color: "from-orange-500 to-red-500", badge: "24/7", onClick: () => toast.info("Centre d'aide disponible prochainement") },
                ].map(({ label, sub, icon: Icon, color, badge, onClick }) => (
                  <Card key={label} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer" onClick={onClick}>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}><Icon className="h-6 w-6 text-white" /></div>
                      <div><h4 className="font-semibold mb-1">{label}</h4><p className="text-xs text-muted-foreground">{sub}</p></div>
                      <Badge variant="secondary">{badge}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Outil IA */}
      <Dialog open={!!activeTool} onOpenChange={(open) => { if (!open) setActiveTool(null) }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              {activeTool && (() => { const Icon = activeTool.icon; return <div className={`p-2 rounded-lg bg-gradient-to-br ${activeTool.color}`}><Icon className="h-5 w-5 text-white" /></div> })()}
              {activeTool?.title}
            </DialogTitle>
          </DialogHeader>

          {activeTool && (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">{activeTool.description}</p>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Personnaliser (optionnel)
                </label>
                <Textarea
                  placeholder="Ajoutez des informations spécifiques à votre profil, niche, ou ce que vous voulez générer..."
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button
                className={`w-full bg-gradient-to-r ${activeTool.color} text-white`}
                onClick={handleRunTool}
                disabled={toolLoading}
              >
                {toolLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Génération en cours...</>
                ) : (
                  <><Brain className="h-4 w-4 mr-2" />Générer avec l&apos;IA</>
                )}
              </Button>

              {toolResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Résultat</label>
                    <Button variant="outline" size="sm" onClick={handleCopyResult}>
                      Copier
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border whitespace-pre-wrap text-sm leading-relaxed max-h-64 overflow-y-auto">
                    {toolResult}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}