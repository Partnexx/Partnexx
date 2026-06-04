'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles, BookOpen, HelpCircle, FolderOpen, Search,
  Shield, Camera, TrendingUp, DollarSign, Eye, PenTool,
  Star, Download, Crown, Zap, ChevronDown, ChevronUp,
  FileText, Calculator, ListChecks, Video, Mic, Brain,
  Upload, Link as LinkIcon, FolderUp, Image as ImageIcon,
  Tag, ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'

/* ============== DATA OUTILS IA ============== */
const AI_TOOLS = [
  {
    id: 'fake-detection-ai',
    name: 'Détecteur de Faux Engagement IA',
    description: "Analysez et détectez les faux followers, likes, vues et commentaires pour garantir l'authenticité",
    icon: Shield, pricing: 'premium', difficulty: 'intermediate',
    features: ['Détection faux followers en temps réel', 'Analyse authenticité engagement', 'Score de crédibilité influenceur', 'Historique activité suspecte', 'Rapport détaillé qualité audience'],
    useCases: ['Audit qualité influenceurs', 'Vérification avant collaboration', 'Protection budget marketing'],
    accuracy: 97, speed: 94,
    integration: ['Instagram API', 'TikTok Analytics', 'YouTube API', 'Twitter API'],
  },
  {
    id: 'photo-generator-ai',
    name: 'Générateur de Photos IA',
    description: "Créez des visuels professionnels et lifestyle uniques pour vos campagnes d'influence",
    icon: Camera, pricing: 'freemium', difficulty: 'beginner',
    features: ['Génération photos produits lifestyle', 'Styles et ambiances personnalisables', 'Intégration marque automatique', 'Formats multi-plateformes', 'Retouche et optimisation IA'],
    useCases: ['Contenus UGC authentiques', 'Photos produits e-commerce', 'Visuels campagnes publicitaires'],
    accuracy: 92, speed: 98,
    integration: ['Photoshop API', 'Canva', 'Figma', 'Drive', 'Dropbox'],
  },
  {
    id: 'trend-predictor-ai',
    name: 'Prédicteur de Tendances IA',
    description: "Anticipez les tendances virales avant qu'elles explosent sur les réseaux sociaux",
    icon: TrendingUp, pricing: 'premium', difficulty: 'advanced',
    features: ['Prédiction tendances 7-30 jours', 'Analyse sentiment social global', 'Alertes opportunités temps réel', 'Score potentiel viral contenu'],
    useCases: ['Planification contenu proactif', 'Timing optimal lancement produits', 'Stratégie hashtags émergents'],
    accuracy: 89, speed: 91,
    integration: ['TikTok Trends', 'Google Trends', 'Instagram Insights', 'Twitter Trends'],
  },
  {
    id: 'invoice-generator-ai',
    name: 'Générateur de Factures IA',
    description: 'Automatisez la création de factures personnalisées avec calculs intelligents et conformité légale',
    icon: DollarSign, pricing: 'freemium', difficulty: 'beginner',
    features: ['Facturation automatique campagnes', 'Calculs TVA multi-pays', 'Templates personnalisables', 'Relances automatiques'],
    useCases: ['Facturation influenceurs', 'Gestion clients agencies', 'Suivi paiements automatisé'],
    accuracy: 99, speed: 96,
    integration: ['Stripe', 'PayPal', 'QuickBooks', 'Sage', 'Pennylane'],
  },
  {
    id: 'competitive-intelligence-ai',
    name: 'Veille Concurrentielle IA',
    description: 'Surveillez vos concurrents et identifiez les opportunités de marché en temps réel',
    icon: Eye, pricing: 'premium', difficulty: 'intermediate',
    features: ['Monitoring concurrents 24/7', 'Analyse stratégies content', 'Détection nouveaux partenariats', 'Benchmark performance campagnes'],
    useCases: ['Intelligence concurrentielle', 'Opportunités partenariats', 'Benchmarking performances'],
    accuracy: 93, speed: 87,
    integration: ['Social Media APIs', 'Web Scraping', 'News APIs', 'Patent DBs'],
  },
  {
    id: 'content-brief-ai',
    name: 'Générateur de Brief Contenu IA',
    description: 'Créez des briefs de contenu détaillés et personnalisés pour maximiser l\'engagement',
    icon: PenTool, pricing: 'freemium', difficulty: 'beginner',
    features: ['Briefs personnalisés par influenceur', 'Optimisation SEO automatique', 'Guidelines créatives adaptées', 'Suggestions hooks engageants'],
    useCases: ['Briefs campagnes influence', 'Guidelines contenu UGC', 'Directions créatives précises'],
    accuracy: 95, speed: 99,
    integration: ['Partnex CRM', 'Notion', 'Slack', 'Trello', 'Monday.com'],
  },
]

/* ============== DATA TEMPLATES (avec content + variables) ============== */
const TEMPLATES = [
  {
    id: 'ugc-video',
    name: 'Template UGC Vidéo Lifestyle',
    description: 'Structure complète pour créer des UGC vidéos authentiques et engageantes',
    type: 'post', platform: ['Instagram', 'TikTok', 'YouTube Shorts'], category: 'UGC',
    content: `🎬 INTRO (3 sec)
- Hook : "[PRODUIT] a changé ma [ROUTINE]"
- Montrez le produit en action

📱 DÉVELOPPEMENT (7-12 sec)
- Problème avant : "Avant j'avais du mal avec [PROBLÈME]"
- Solution : "Depuis [PRODUIT]..."
- 3 bénéfices clés

✨ CONCLUSION (2-3 sec)
- Résultat final visible
- CTA : "Testez avec [CODE_PROMO]"`,
    variables: ['PRODUIT', 'ROUTINE', 'PROBLÈME', 'CODE_PROMO'],
    downloadCount: 1547, rating: 4.9, isPremium: false, estimatedTime: '30 min',
  },
  {
    id: 'brief-influenceur',
    name: 'Brief Influenceur Ultra-Complet',
    description: 'Template de brief professionnel avec toutes les clauses essentielles',
    type: 'brief', platform: ['Email', 'Partnex'], category: 'Communication',
    content: `# BRIEF CAMPAGNE [NOM_CAMPAGNE]

## 🎯 CONTEXTE & OBJECTIFS
Marque : [MARQUE]
Produit : [PRODUIT]
Objectif principal : [OBJECTIF_PRINCIPAL]
KPIs : [KPIS]

## 👥 AUDIENCE CIBLE
Démographie : [AGE], [GENRE], [LOCALISATION]
Intérêts : [INTERETS]`,
    variables: ['NOM_CAMPAGNE', 'MARQUE', 'PRODUIT', 'OBJECTIF_PRINCIPAL', 'KPIS', 'AGE', 'GENRE', 'LOCALISATION', 'INTERETS'],
    downloadCount: 2341, rating: 4.8, isPremium: true, estimatedTime: '45 min',
  },
  {
    id: 'contrat-2025',
    name: 'Contrat Influenceur 2025',
    description: 'Contrat légal complet avec clauses IA et protection RGPD',
    type: 'contract', platform: ['Juridique'], category: 'Légal',
    content: `CONTRAT DE PARTENARIAT INFLUENCEUR

Entre : [ENTREPRISE], société [FORME_JURIDIQUE]
Et : [INFLUENCEUR], statut [STATUT_JURIDIQUE]

Article 1 : Objet
Le présent contrat a pour objet la promotion de [PRODUIT/SERVICE]...`,
    variables: ['ENTREPRISE', 'FORME_JURIDIQUE', 'INFLUENCEUR', 'STATUT_JURIDIQUE', 'PRODUIT/SERVICE'],
    downloadCount: 982, rating: 4.9, isPremium: true, estimatedTime: '60 min',
  },
  {
    id: 'post-instagram-viral',
    name: 'Post Instagram Produit Viral',
    description: 'Template optimisé pour maximiser l\'engagement produit sur Instagram',
    type: 'post', platform: ['Instagram'], category: 'Conversion',
    content: `[HOOK_EMOTIONNEL] avec [PRODUIT] 🔥

[INTRO_PRODUIT] - Mes 3 raisons de l'adorer :

✅ [BENEFICE_1]
✅ [BENEFICE_2]
✅ [BENEFICE_3]

Code promo : [CODE_PROMO] (-[REDUCTION]%)
Lien en bio 👆`,
    variables: ['HOOK_EMOTIONNEL', 'PRODUIT', 'INTRO_PRODUIT', 'BENEFICE_1', 'BENEFICE_2', 'BENEFICE_3', 'CODE_PROMO', 'REDUCTION'],
    downloadCount: 1567, rating: 4.7, isPremium: false, estimatedTime: '20 min',
  },
  {
    id: 'rapport-campagne',
    name: "Rapport de Campagne d'Influence",
    description: 'Template de rapport détaillé pour présenter les résultats de campagne',
    type: 'rapport', platform: ['PowerPoint', 'Google Slides', 'Partnex'], category: 'Reporting',
    content: `# RAPPORT DE CAMPAGNE D'INFLUENCE [NOM_CAMPAGNE]

Période : [DATE_DEBUT] au [DATE_FIN]
Budget total : [BUDGET_TOTAL]€
ROI : [ROI]%

## Résultats clés
- Reach : [REACH] impressions
- Engagement : [ENGAGEMENT_RATE]%`,
    variables: ['NOM_CAMPAGNE', 'DATE_DEBUT', 'DATE_FIN', 'BUDGET_TOTAL', 'ROI', 'REACH', 'ENGAGEMENT_RATE'],
    downloadCount: 756, rating: 4.6, isPremium: true, estimatedTime: '90 min',
  },
]

/* ============== DATA FAQ ============== */
const FAQ_ITEMS = [
  { id: 'faq-1', question: "Comment fonctionne l'IA de Partnex pour optimiser mes campagnes ?", answer: "L'IA de Partnex analyse en temps réel plus de 50 métriques de performance et compare vos résultats à une base de données de 100M+ de campagnes similaires. Elle propose des optimisations automatiques et prédit le potentiel viral de vos contenus avec 94% de précision.", category: 'ai', popularity: 98, tags: ['IA', 'optimisation', 'algorithme'] },
  { id: 'faq-2', question: 'Quelle est la différence entre les templates gratuits et premium ?', answer: "Les templates premium offrent : personnalisation avancée avec 50+ variables, optimisation IA spécifique à votre industrie, templates juridiques validés par des avocats, analytics prédictifs, support prioritaire. Le ROI moyen des templates premium est 340% supérieur aux versions gratuites.", category: 'general', popularity: 89, tags: ['pricing', 'premium', 'ROI'] },
  { id: 'faq-3', question: "Comment puis-je mesurer le ROI de mes campagnes d'influence ?", answer: "Partnex calcule automatiquement 15 métriques ROI : ROAS, CPA, lifetime value influencé, brand awareness lift, sentiment brand, trafic généré, conversions attribuées. Nos algorithmes trackent le customer journey complet et attribuent les ventes jusqu'à 30 jours post-campagne.", category: 'technical', popularity: 92, tags: ['ROI', 'métriques', 'analytics'] },
  { id: 'faq-4', question: 'Les contrats générés sont-ils juridiquement valides ?', answer: "Oui. Nos templates sont créés par des avocats spécialisés en droit digital, validés par 3 cabinets, et mis à jour selon les dernières réglementations (RGPD, DSA, DMA). Plus de 10,000 contrats signés sans litige à ce jour.", category: 'legal', popularity: 85, tags: ['juridique', 'contrats', 'RGPD'] },
  { id: 'faq-5', question: 'Comment fonctionne la facturation des fonctionnalités IA ?', answer: 'Modèle transparent : Plan Gratuit (100 générations IA/mois), Plan Pro (1000 + analytics 29€/mois), Plan Agency (illimité + API 99€/mois). Pas de frais cachés. Crédits rollover jusqu\'à 6 mois.', category: 'billing', popularity: 78, tags: ['facturation', 'pricing', 'plans'] },
  { id: 'faq-6', question: 'Quelles plateformes sociales sont supportées ?', answer: 'Support complet : Instagram, TikTok, YouTube, LinkedIn, Twitter/X, Facebook, Snapchat, Pinterest, Twitch. APIs natives pour analytics temps réel. Templates spécialisés par plateforme.', category: 'technical', popularity: 88, tags: ['plateformes', 'API'] },
  { id: 'faq-7', question: 'Comment protéger ma propriété intellectuelle avec les contenus IA ?', answer: "Protection complète : watermarking invisible automatique, blockchain proof-of-creation, copyright automatique dans 180 pays, détection plagiat temps réel. Assurance protection juridique incluse jusqu'à 50K€.", category: 'legal', popularity: 71, tags: ['IP', 'IA', 'copyright'] },
  { id: 'faq-8', question: "Quelle est la précision des prédictions IA ?", answer: "Précision globale : 94.2% pour prédiction engagement, 91.7% pour reach estimation, 88.9% pour conversion rate, 96.1% pour optimal timing. Algorithmes entraînés sur 100M+ de posts.", category: 'ai', popularity: 82, tags: ['précision', 'prédictions'] },
  { id: 'faq-9', question: 'Comment collaborer avec mon équipe ?', answer: 'Collaboration native : espaces de travail illimités, permissions granulaires, commentaires temps réel, versions control, intégration Slack/Teams, notifications personnalisables.', category: 'general', popularity: 75, tags: ['collaboration', 'équipe'] },
  { id: 'faq-10', question: 'Vos outils fonctionnent-ils pour les micro-influenceurs (1K-10K) ?', answer: 'Absolument ! Spécialement optimisés : templates adaptés, calculs ROI précis, pricing proportionnel, analytics hyper-locales. 78% de nos utilisateurs sont des micro-influenceurs avec 2.3x meilleur engagement.', category: 'general', popularity: 86, tags: ['micro-influenceurs'] },
  { id: 'faq-11', question: 'Comment gérer les campagnes multi-langues ?', answer: 'Support 40+ langues : traduction IA native, adaptation culturelle automatique, templates localisés, compliance réglementaire locale, hashtags trending par région.', category: 'technical', popularity: 69, tags: ['international', 'multilingue'] },
  { id: 'faq-12', question: 'Que faire si une campagne ne performe pas comme prévu ?', answer: 'Système d\'alerte proactif : détection sous-performance temps réel, recommandations optimisation automatiques, A/B testing suggestions. Si échec total : guarantee 50% remboursement crédits IA + consulting gratuit.', category: 'campaign', popularity: 73, tags: ['support', 'garantie'] },
]

/* ============== DATA RESSOURCES ============== */
const RESOURCES = [
  { id: 'r1', title: "Guide Complet du Marketing d'Influence 2025", description: 'Guide de 180 pages couvrant toutes les stratégies, tendances et outils', type: 'ebook', category: 'Stratégie', readTime: '3h 30min', author: 'Équipe Partnex', publishDate: '2025-08-15', tags: ['stratégie', 'tendances', 'guide complet', '2025', 'best practices'], downloadCount: 4567, rating: 4.9, isPremium: false, fileSize: '25 MB', format: 'pdf' },
  { id: 'r2', title: 'Calculateur ROI Influence Avancé', description: 'Outil interactif pour calculer précisément le ROI avec 50+ métriques et projections IA', type: 'calculator', category: 'Analytics', readTime: '15 min', author: 'Lead Data Scientist', publishDate: '2025-08-20', tags: ['ROI', 'calculateur', 'métriques', 'analytics', 'IA'], downloadCount: 2341, rating: 4.8, isPremium: true, format: 'interactive' },
  { id: 'r3', title: "Checklist de la Campagne d'Influence Parfaite", description: '127 points de contrôle pour garantir le succès de vos campagnes', type: 'checklist', category: 'Planification', readTime: '45 min', author: 'Campaign Manager Expert', publishDate: '2025-08-18', tags: ['checklist', 'campagne', 'planification', 'success', 'contrôle qualité'], downloadCount: 3456, rating: 4.7, isPremium: false, fileSize: '5 MB', format: 'pdf' },
  { id: 'r4', title: 'Masterclass : IA & Influence Marketing', description: 'Webinar 2h avec experts IA pour maîtriser l\'automation et l\'optimisation', type: 'webinar', category: 'Formation', readTime: '2h 15min', author: 'CTO Partnex & Invités', publishDate: '2025-08-22', tags: ['IA', 'formation', 'webinar', 'automation', 'experts'], downloadCount: 1876, rating: 4.9, isPremium: true, fileSize: '850 MB', format: 'video' },
  { id: 'r5', title: 'Rapport Tendances Réseaux Sociaux Q3 2025', description: 'Analyse exclusive des nouvelles tendances Instagram, TikTok, LinkedIn (10M+ posts)', type: 'guide', category: 'Tendances', readTime: '1h 20min', author: 'Social Media Research Team', publishDate: '2025-08-26', tags: ['tendances', 'Instagram', 'TikTok', 'LinkedIn', 'data'], downloadCount: 2987, rating: 4.6, isPremium: false, fileSize: '18 MB', format: 'pdf' },
  { id: 'r6', title: 'Podcast : Aspects Légaux de l\'Influence Marketing', description: 'Série 6 épisodes avec avocats sur contrats, RGPD, IA et protection créateurs', type: 'tutorial', category: 'Juridique', readTime: '4h 30min', author: 'Cabinet Juridique Digital+', publishDate: '2025-08-19', tags: ['juridique', 'podcast', 'RGPD', 'contrats', 'protection'], downloadCount: 1234, rating: 4.8, isPremium: true, fileSize: '320 MB', format: 'audio' },
  { id: 'r7', title: 'Templates de Reporting Client Professionnel', description: 'Pack 15 templates PPT/Slides pour présenter vos résultats clients avec impact', type: 'guide', category: 'Reporting', readTime: '2h 00min', author: 'Design Team', publishDate: '2025-08-17', tags: ['reporting', 'templates', 'client', 'présentation', 'design'], downloadCount: 1765, rating: 4.7, isPremium: true, fileSize: '95 MB', format: 'interactive' },
  { id: 'r8', title: 'Guide Micro-Influence : Stratégies Gagnantes', description: 'Pour influenceurs 1K-50K : growth hacking, monétisation, collaboration marques', type: 'ebook', category: 'Micro-Influence', readTime: '2h 45min', author: 'Micro-Influencer Success Team', publishDate: '2025-08-21', tags: ['micro-influence', 'growth', 'monétisation', 'stratégie', 'marques'], downloadCount: 2654, rating: 4.8, isPremium: false, fileSize: '22 MB', format: 'pdf' },
]

/* ============== HELPERS ============== */
const PRICING_COLOR = {
  gratuit: 'bg-green-100 text-green-700 border-green-200',
  freemium: 'bg-blue-100 text-blue-700 border-blue-200',
  premium: 'bg-purple-100 text-purple-700 border-purple-200',
}
const DIFFICULTY_COLOR = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
}
const FAQ_CATEGORY_LABEL = {
  general: 'Général', technical: 'Technique', billing: 'Facturation',
  legal: 'Juridique', ai: 'Intelligence Artificielle', campaign: 'Campagnes',
}
const RESOURCE_TYPE_ICONS = {
  ebook: BookOpen, guide: FileText, checklist: ListChecks, calculator: Calculator,
  tutorial: Mic, webinar: Video,
}

/* ============== COMPONENT ============== */
export default function RessourcesSection() {
  const [activeTab, setActiveTab] = useState('outils-ia')
  const [search, setSearch] = useState('')
  const [openFaqId, setOpenFaqId] = useState(null)
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('all')

  const filteredTools = useMemo(() => {
    const q = search.toLowerCase()
    return AI_TOOLS.filter(t => !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }, [search])

  const filteredTemplates = useMemo(() => {
    const q = search.toLowerCase()
    return TEMPLATES.filter(t => !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }, [search])

  const filteredFaqs = useMemo(() => {
    const q = search.toLowerCase()
    return FAQ_ITEMS.filter(f => {
      const matchSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      const matchCat = faqCategoryFilter === 'all' || f.category === faqCategoryFilter
      return matchSearch && matchCat
    }).sort((a, b) => b.popularity - a.popularity)
  }, [search, faqCategoryFilter])

  const filteredResources = useMemo(() => {
    const q = search.toLowerCase()
    return RESOURCES.filter(r => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)))
  }, [search])

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-2">
      {/* HEADER centré comme Lovable */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">Ressources &amp; Templates</h1>
          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
            <Brain className="h-3 w-3 mr-1" />IA Activée
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Centre de ressources intelligent • Outils IA • Templates optimisés • Support expert
        </p>
      </div>

      {/* RECHERCHE centré */}
      <div className="max-w-2xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans toutes les ressources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-full"
        />
      </div>

      {/* ONGLETS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {[
            { value: 'outils-ia', label: 'Outils IA', icon: Sparkles, color: 'from-blue-500 to-blue-600' },
            { value: 'templates', label: 'Templates', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
            { value: 'faq', label: 'FAQ', icon: HelpCircle, color: 'from-emerald-500 to-emerald-600' },
            { value: 'ressources', label: 'Ressources', icon: FolderOpen, color: 'from-orange-500 to-orange-600' },
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}
              className={`flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white transition-all`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ============ OUTILS IA ============ */}
        <TabsContent value="outils-ia" className="space-y-6 mt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />Suite d'Outils IA Partnex
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Découvrez notre écosystème d'intelligence artificielle pour automatiser, optimiser et amplifier vos campagnes d'influence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => {
              const Icon = tool.icon
              return (
                <Card key={tool.id} className="card-elevated profile-section-blue">
                  <CardHeader>
                    <div className="flex justify-end mb-2">
                      <Badge className={PRICING_COLOR[tool.pricing]}>{tool.pricing}</Badge>
                    </div>
                    <CardTitle className="text-gradient-blue text-lg">{tool.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="outline" className={DIFFICULTY_COLOR[tool.difficulty]}>{tool.difficulty}</Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">analysis</Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Précision</span>
                          <span className="font-bold text-blue-700">{tool.accuracy}%</span>
                        </div>
                        <Progress value={tool.accuracy} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Vitesse</span>
                          <span className="font-bold text-blue-700">{tool.speed}%</span>
                        </div>
                        <Progress value={tool.speed} className="h-1.5" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-2">Fonctionnalités clés :</p>
                      <ul className="space-y-1">
                        {tool.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span><span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-2">Cas d'usage :</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.useCases.slice(0, 4).map((u, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-white">{u}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-2">Intégrations :</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.integration.slice(0, 4).map((i, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-white">{i}</Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md" onClick={() => toast.info(`🤖 ${tool.name} - bientôt disponible`)}>
                      <Zap className="h-4 w-4 mr-2" />Essayer <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ============ TEMPLATES ============ */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-600" />Bibliothèque de Templates
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Templates professionnels optimisés par IA pour tous vos besoins : contenus, briefs, contrats, rapports
            </p>
          </div>

          {/* IMPORTER VOS TEMPLATES */}
          <Card className="card-elevated profile-section-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gradient-purple">
                <Upload className="h-5 w-5" />Importer vos templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-white/50">
                <Upload className="h-10 w-10 mx-auto text-purple-400 mb-3" />
                <p className="font-semibold mb-1">Glissez-déposez vos templates ici</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supporté : PDF, Word, PowerPoint, Google Docs, Notion, Figma
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Sélection fichier - bientôt')}>
                    <FolderUp className="h-4 w-4 mr-2" />Parcourir les fichiers
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info('Import URL - bientôt')}>
                    <LinkIcon className="h-4 w-4 mr-2" />Depuis une URL
                  </Button>
                </div>
                <div className="flex justify-center gap-3 mt-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />Briefs</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />Contrats</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />Rapports</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />Créatifs</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />Analyse IA automatique et catégorisation intelligente
                </span>
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />Stockage sécurisé
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* GRILLE TEMPLATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTemplates.map(tpl => (
              <Card key={tpl.id} className="card-elevated profile-section-purple">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-gradient-purple text-lg">{tpl.name}</CardTitle>
                    </div>
                    {tpl.isPremium ? (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs">
                        <Crown className="h-3 w-3 mr-1" />Premium
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />IA
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tpl.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{tpl.rating} ({tpl.downloadCount})
                    </span>
                    <Badge variant="outline" className="text-xs capitalize">{tpl.type}</Badge>
                    <span className="text-xs">⏱ {tpl.estimatedTime}</span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-1">Plateformes :</p>
                    <div className="flex flex-wrap gap-1">
                      {tpl.platform.map((p, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-white">{p}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-1">Variables personnalisables ({tpl.variables.length}) :</p>
                    <div className="flex flex-wrap gap-1">
                      {tpl.variables.slice(0, 8).map((v, i) => (
                        <Badge key={i} className="text-[10px] bg-purple-100 text-purple-700 border-purple-200 font-mono">{v}</Badge>
                      ))}
                      {tpl.variables.length > 8 && (
                        <Badge variant="outline" className="text-[10px]">+{tpl.variables.length - 8} autres</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-1">Aperçu du template :</p>
                    <pre className="bg-muted/50 border rounded p-2 text-[10px] font-mono leading-relaxed whitespace-pre-wrap max-h-32 overflow-hidden">
                      {tpl.content.slice(0, 240)}{tpl.content.length > 240 && '...'}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info('Aperçu complet - bientôt')}>
                      <Eye className="h-4 w-4 mr-1" />Aperçu
                    </Button>
                    <Button size="sm" className={`flex-1 ${tpl.isPremium ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white`} onClick={() => toast.info(`📝 ${tpl.name} - bientôt`)}>
                      <Download className="h-4 w-4 mr-1" />Utiliser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============ FAQ ============ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-emerald-600" />Foire Aux Questions
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {filteredFaqs.length} question{filteredFaqs.length > 1 ? 's' : ''} triée{filteredFaqs.length > 1 ? 's' : ''} par popularité
            </p>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            <Button size="sm" variant={faqCategoryFilter === 'all' ? 'default' : 'outline'} onClick={() => setFaqCategoryFilter('all')}>
              Toutes
            </Button>
            {Object.entries(FAQ_CATEGORY_LABEL).map(([k, v]) => (
              <Button key={k} size="sm" variant={faqCategoryFilter === k ? 'default' : 'outline'} onClick={() => setFaqCategoryFilter(k)}>
                {v}
              </Button>
            ))}
          </div>

          <div className="space-y-2 max-w-4xl mx-auto">
            {filteredFaqs.map(faq => (
              <Card key={faq.id} className="card-elevated profile-section-emerald">
                <button onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)} className="w-full text-left">
                  <CardHeader className="hover:bg-emerald-50/50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs bg-white">{FAQ_CATEGORY_LABEL[faq.category]}</Badge>
                          <span className="text-xs text-muted-foreground">{faq.popularity}% trouvent ça utile</span>
                        </div>
                        <CardTitle className="text-base text-gradient-emerald">{faq.question}</CardTitle>
                      </div>
                      {openFaqId === faq.id ?
                        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" /> :
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />}
                    </div>
                  </CardHeader>
                </button>
                {openFaqId === faq.id && (
                  <CardContent className="pt-0 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {faq.tags.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-white">
                          <Tag className="h-2.5 w-2.5 mr-1" />{t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============ RESSOURCES ============ */}
        <TabsContent value="ressources" className="space-y-6 mt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <FolderOpen className="h-6 w-6 text-orange-600" />Centre de Ressources
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Guides experts, e-books, calculateurs, webinars et formations pour maîtriser l'influence marketing
            </p>
          </div>

          {/* IMPORTER VOS RESSOURCES — 3 colonnes (Documents / Médias / Liens) */}
          <Card className="card-elevated profile-section-emerald">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gradient-emerald">
                <Upload className="h-5 w-5" />Importer vos ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: FileText, label: 'Documents', desc: 'PDF, Word, Excel', color: 'emerald' },
                  { icon: ImageIcon, label: 'Médias', desc: 'Images, Vidéos', color: 'teal' },
                  { icon: LinkIcon, label: 'Liens', desc: 'URLs, Articles', color: 'cyan' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="bg-white border rounded-xl p-5 text-center hover:border-emerald-400 transition cursor-pointer" onClick={() => toast.info(`Import ${item.label} - bientôt`)}>
                      <div className="inline-flex p-3 rounded-full bg-emerald-100 mb-2">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        + Ajouter
                      </Button>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />Organisation automatique par IA
                </span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">☁ Cloud</Badge>
                  <Badge variant="outline" className="text-xs"><Shield className="h-3 w-3 mr-1" />Sécurisé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GRILLE RESSOURCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map(r => {
              const TypeIcon = RESOURCE_TYPE_ICONS[r.type] || FileText
              return (
                <Card key={r.id} className="card-elevated profile-section-orange">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs bg-white">
                        <TypeIcon className="h-3 w-3 mr-1" />{r.type}
                      </Badge>
                      {r.isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs">
                          <Crown className="h-3 w-3 mr-1" />Premium
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-gradient-orange text-base">{r.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {r.rating} ({r.downloadCount})
                      </span>
                      <Badge variant="outline" className="text-xs bg-white">{r.category}</Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>⏱ {r.readTime}</p>
                      <p>👤 {r.author}</p>
                      {r.fileSize && <p>📦 {r.fileSize}</p>}
                      <p>📅 {r.publishDate}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-1">Tags :</p>
                      <div className="flex flex-wrap gap-1">
                        {r.tags.slice(0, 5).map((t, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] bg-white">{t}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs bg-white">{r.format}</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info('Aperçu - bientôt')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className={r.isPremium ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'} onClick={() => toast.info(`📚 ${r.title} - bientôt`)}>
                          <Download className="h-4 w-4 mr-1" />{r.isPremium ? 'Premium' : 'Gratuit'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}