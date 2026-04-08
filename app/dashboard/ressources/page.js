'use client'
import { useState, useRef } from 'react'

export default function RessourcesTemplates() {
  const [tab, setTab] = useState('outils')
  const [search, setSearch] = useState('')
  const [faqOpen, setFaqOpen] = useState(null)
  const [faqFilter, setFaqFilter] = useState('Tout')
  const [copied, setCopied] = useState(null)
  const fileInputRef = useRef(null)
  const docInputRef = useRef(null)
  const mediaInputRef = useRef(null)

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }

  // ---- OUTILS IA ----
  const outils = [
    {
      name: 'Détecteur de Faux Engagement IA', tier: 'premium', tierColor: '#f59e0b',
      desc: 'Analysez et détectez les faux followers, likes, vues et commentaires pour garantir l\'authenticité',
      tags: ['intermediate', 'analysis'], precision: 97, vitesse: 94,
      fonctionnalites: ['Détection faux followers en temps réel', 'Analyse authenticité engagement', 'Score de crédibilité influenceur'],
      usages: ['Audit qualité influenceurs', 'Vérification avant collaboration', 'Protection budget marketing'],
      integrations: ['Instagram API', 'TikTok Analytics', 'YouTube API', 'Twitter API'],
    },
    {
      name: 'Générateur de Photos IA', tier: 'freemium', tierColor: '#22c55e',
      desc: 'Créez des visuels professionnels et lifestyle uniques pour vos campagnes d\'influence',
      tags: ['beginner', 'generation'], precision: 92, vitesse: 98,
      fonctionnalites: ['Génération photos produits lifestyle', 'Styles et ambiances personnalisables', 'Intégration marque automatique'],
      usages: ['Contenus UGC authentiques', 'Photos produits e-commerce', 'Visuels campagnes publicitaires'],
      integrations: ['Photoshop API', 'Canva', 'Figma', 'Drive'],
    },
    {
      name: 'Prédicteur de Tendances IA', tier: 'premium', tierColor: '#f59e0b',
      desc: 'Anticipez les tendances virales avant qu\'elles explosent sur les réseaux sociaux',
      tags: ['advanced', 'analysis'], precision: 89, vitesse: 91,
      fonctionnalites: ['Prédiction tendances +30 jours', 'Analyse sentiment social global', 'Alertes opportunités temps réel'],
      usages: ['Planification contenu proactif', 'Timing optimal lancement produits', 'Stratégie hashtag émergents'],
      integrations: ['TikTok Trends', 'Google Trends', 'Instagram Insights', 'Twitter Trends'],
    },
    {
      name: 'Générateur de Factures IA', tier: 'freemium', tierColor: '#22c55e',
      desc: 'Automatisez la création de factures personnalisées avec calculs intelligents et conformité légale',
      tags: ['beginner', 'automation'], precision: 99, vitesse: 96,
      fonctionnalites: ['Facturation automatique campagnes', 'Calculs TVA multi-pays', 'Templates personnalisables'],
      usages: ['Facturation influenceurs', 'Gestion clients agences', 'Suivi paiements automatisé'],
      integrations: ['Stripe', 'PayPal', 'QuickBooks', 'Sage'],
    },
    {
      name: 'Veille Concurrentielle IA', tier: 'premium', tierColor: '#f59e0b',
      desc: 'Surveillez vos concurrents et identifiez les opportunités de marché en temps réel',
      tags: ['intermediate', 'analysis'], precision: 93, vitesse: 87,
      fonctionnalites: ['Monitoring concurrents 24/7', 'Analyse stratégies contenu', 'Détection nouveaux partenariats'],
      usages: ['Intelligence concurrentielle', 'Opportunités partenariales', 'Benchmarking performances'],
      integrations: ['Social Media APIs', 'Web Scraping', 'News APIs', 'Patent DBs'],
    },
    {
      name: 'Générateur de Brief Contenu IA', tier: 'freemium', tierColor: '#22c55e',
      desc: 'Créez des briefs de contenu détaillés et personnalisés pour maximiser l\'engagement',
      tags: ['beginner', 'generation'], precision: 95, vitesse: 99,
      fonctionnalites: ['Briefs personnalisés par influenceur', 'Optimisation SEO automatique', 'Guidelines créatives adaptives'],
      usages: ['Briefs campagnes influence', 'Guidelines contenu UGC', 'Directions créatives précises'],
      integrations: ['Partnex CRM', 'Notion', 'Slack', 'Trello'],
    },
  ]

  // ---- TEMPLATES ----
  const templates = [
    {
      id: 1, name: 'Template UGC Vidéo Lifestyle', tier: 'IA', tierColor: '#a855f7', tierBg: '#f3e8ff',
      desc: 'Structure complète pour créer un UGC vidéo authentique et engageant',
      rating: 4.8, reviews: 1318, level: 'pro', time: '30 min',
      platforms: ['Instagram', 'TikTok', 'YouTube Shorts'],
      variables: ['PRODUIT', 'ROUTINE', 'PROBLÈME', 'CODE_PROMO'],
      apercu: 'INTRO (5 sec) : Hook authentique — "[PRODUIT] a changé ma [ROUTINE]". Transition To : "[PROBLÈME]" → Solution narrative...',
      downloads: 1527, copies: 4.9,
      content: `INTRO (5 sec) : Hook authentique — "[PRODUIT] a changé ma [ROUTINE]". Transition To : "[PROBLÈME]" → Solution narrative. DÉMO (15 sec) : Montrez le produit en action dans un contexte lifestyle réel. CTA FINAL : "Utilisez le code [CODE_PROMO] pour -20%". Musique tendance TikTok recommandée.`
    },
    {
      id: 2, name: 'Brief Influenceur Ultra-Complet', tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7',
      desc: 'Template de brief professionnel avec toutes les directives essentielles',
      rating: 4.9, reviews: 2341, level: 'lead', time: '45 min',
      platforms: ['Email', 'Partnex'],
      variables: ['NOM_CAMPAGNE', 'MARQUE', 'PRODUIT', 'OBJECTIF_PRINCIPAL', 'KPIs', 'AIR'],
      apercu: 'À BRIEF [NOM_CAMPAGNE] de [MARQUE]: "[Bonjour @[INFLUENCEUR], • [Budget] + [Delivrables] = [Reach] • Objectif prioritaire : [OBJECTIF_PRINCIPAL]..."',
      downloads: 2341, copies: 6.8,
      content: `BRIEF CAMPAGNE [NOM_CAMPAGNE] - [MARQUE]\n\nBonjour @[INFLUENCEUR],\n\nNous souhaitons collaborer avec vous pour la campagne [NOM_CAMPAGNE].\n\nPRODUIT : [PRODUIT]\nOBJECTIF : [OBJECTIF_PRINCIPAL]\nKPIs ATTENDUS : [KPIs]\nBUDGET : [BUDGET]\nDELIVRABLES : [DELIVRABLES]\nDATE LIMITE : [DATE_LIMITE]\n\nMerci de confirmer votre intérêt.`
    },
    {
      id: 3, name: 'Contrat Influenceur 2025', tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7',
      desc: 'Contrat légal complet avec clause IA et protection RGPD',
      rating: 4.8, reviews: 862, level: 'standard', time: '02 min',
      platforms: ['JuriSign'],
      variables: ['ENTREPRISE', 'NOM_JURIDIQUE', 'SIRET', 'INFLUENCEUR', 'STATUT_JURIDIQUE', 'PRODUIT_SERVICE'],
      apercu: 'CONTRAT D\'INFLUENCEUR Entre : [ENTREPRISE], [NOM_JURIDIQUE]... représenté par [SIRET] Et : [INFLUENCEUR] [STATUT_JURIDIQUE]...',
      downloads: 862, copies: 6.4,
      content: `CONTRAT D'INFLUENCEUR 2025\n\nEntre : [ENTREPRISE], société [NOM_JURIDIQUE], SIRET [SIRET]\nEt : [INFLUENCEUR], [STATUT_JURIDIQUE]\n\nArticle 1 - OBJET\nLe présent contrat définit les modalités de collaboration...\n\nArticle 2 - RÉMUNÉRATION\nMontant convenu : [REMUNERATION]\n\nArticle 3 - LIVRABLES\n[LIVRABLES]\n\nArticle 4 - RGPD & IA\nConformément au RGPD et à l'AI Act européen...`
    },
    {
      id: 4, name: 'Post Instagram Produit Viral', tier: 'IA', tierColor: '#a855f7', tierBg: '#f3e8ff',
      desc: 'Template optimisé pour maximiser l\'engagement produit sur Instagram',
      rating: 4.7, reviews: 1527, level: 'pro', time: '20 min',
      platforms: ['Instagram'],
      variables: ['HOOK_ACCROCHEUR', 'PRODUIT', 'EMOJI_TENDANCE', 'INTRO_PERSONNELLE', 'DETAIL_SPECIFIQUE'],
      apercu: '[HOOK_ACCROCHEUR] ✨ [PRODUIT] [EMOJI_TENDANCE] [INTRO_PERSONNELLE] → [DETAIL_SPECIFIQUE]...',
      downloads: 1527, copies: 4.7,
      content: `[HOOK_ACCROCHEUR] ✨\n\n[PRODUIT] [EMOJI_TENDANCE]\n\n[INTRO_PERSONNELLE] — voici pourquoi je ne peux plus m'en passer 👇\n\n✅ [DETAIL_SPECIFIQUE]\n✅ [BENEFICE_2]\n✅ [BENEFICE_3]\n\n🔗 Lien en bio pour commander\nCode promo : [CODE_PROMO]\n\n#[HASHTAG_1] #[HASHTAG_2] #[HASHTAG_3]`
    },
    {
      id: 5, name: 'Rapport de Campagne d\'Influence', tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7',
      desc: 'Template rapport détaillé pour présenter les résultats de campagne',
      rating: 4.8, reviews: 758, level: 'rapport', time: '90 min',
      platforms: ['PowerPoint', 'Google Slides', 'Partnex'],
      variables: ['NOM_CAMPAGNE', 'DATE_DEBUT', 'DATE_FIN', 'BUDGET_TOTAL', 'ROI', 'ROAS'],
      apercu: 'RAPPORT DE CAMPAGNE [NOM_CAMPAGNE] ↗ [DATE_DEBUT] → [DATE_FIN] • Budget: [BUDGET_TOTAL] • ROI: [ROI]...',
      downloads: 758, copies: 6.8,
      content: `RAPPORT DE CAMPAGNE D'INFLUENCE\n[NOM_CAMPAGNE] | [DATE_DEBUT] - [DATE_FIN]\n\n📊 RÉSUMÉ EXÉCUTIF\nBudget Total : [BUDGET_TOTAL]\nROI : [ROI]\nROAS : [ROAS]\n\n👥 INFLUENCEURS\nNombre total : [NB_INFLUENCEURS]\nPortée cumulée : [PORTEE_TOTALE]\n\n📈 PERFORMANCES\nImpressions : [IMPRESSIONS]\nEngagement : [ENGAGEMENT_RATE]\nConversions : [CONVERSIONS]`
    },
  ]

  // ---- FAQ ----
  const faqs = [
    { id: 1, cat: 'IA', popularite: 98, question: 'Comment fonctionne l\'IA de Partnex pour optimiser mes campagnes ?', reponse: 'L\'IA de Partnex analyse en temps réel plus de 50 métriques de performance (engagement, reach, sentiment, timing optimal) et compare vos résultats à une base de données de 100M+ de campagnes similaires. Elle propose des optimisations automatiques comme le meilleur moment pour publier, les hashtags les plus performants pour votre niche, et prédit le potentiel viral de vos contenus avec 94% de précision.', tags: ['IA', 'optimisation', 'algorithme', 'performance'], maj: '2025-08-25' },
    { id: 2, cat: 'Général', popularite: 89, question: 'Quelle est la différence entre les templates gratuits et premium ?', reponse: 'Les templates gratuits incluent les structures de base et sont parfaits pour débuter. Les templates premium offrent : personnalisation avancée avec 50+ variables, optimisation IA spécifique à votre industrie, templates juridiques validés par des avocats, analytics prédictifs, support prioritaire et mises à jour en temps réel basées sur les dernières tendances. Le ROI moyen des templates premium est 340% supérieur aux versions gratuites.', tags: ['pricing', 'premium', 'gratuit', 'ROI'], maj: '2025-08-24' },
    { id: 3, cat: 'Tech', popularite: 92, question: 'Comment puis-je mesurer le ROI de mes campagnes d\'influence ?', reponse: 'Partnex calcule automatiquement 15 métriques ROI : ROI financier direct, ROAS (Return on Ad Spend), coût par acquisition (CPA), lifetime value influencé, brand awareness lift, sentiment brand, trafic généré, conversions attribuées, engagement quality score. Nos algorithmes trackent le customer journey complet et attribuent les ventes jusqu\'à 30 jours post-campagne. Dashboard temps réel avec comparaisons industrie incluses.', tags: ['ROI', 'métriques', 'performance', 'analytics'], maj: '2025-08-26' },
    { id: 4, cat: 'Légal', popularite: 85, question: 'Les contrats générés sont-ils juridiquement valides ?', reponse: 'Oui, absolument. Nos templates de contrats sont créés par des avocats spécialisés en droit digital et propriété intellectuelle, validés par 3 cabinets différents et mis à jour selon les dernières réglementations (RGPD, DSA, DMA). Ils incluent les clauses IA obligatoires depuis 2024, protection influenceurs mineurs, et conformité internationale (US, EU, UK). Plus de 10.000 contrats signés sans litige à ce jour.', tags: ['juridique', 'contrats', 'RGPD', 'conformité'], maj: '2025-08-23' },
    { id: 5, cat: 'Prix', popularite: 78, question: 'Comment fonctionne la facturation des fonctionnalités IA ?', reponse: 'Modèle transparent : Plan Gratuit (100 générations IA/mois), Plan Pro (1000 générations + analytics avancées 29€/mois), Plan Agency (illimité + API + white-label 99€/mois). Pas de frais cachés. 1 génération = 1 template personnalisé OU 1 analyse campagne OU 1 optimisation contenu. Crédits rollover jusqu\'à 6 mois. Facturation uniquement sur usage réel, pause/reprise anytime.', tags: ['facturation', 'pricing', 'plans', 'IA'], maj: '2025-08-22' },
    { id: 6, cat: 'Tech', popularite: 88, question: 'Quelles plateformes sociales sont supportées par vos outils ?', reponse: 'Support complet : Instagram (Posts, Stories, Reels, IGTV), TikTok (Vidéos, Lives), YouTube (Shorts, Vidéos, Community), LinkedIn (Posts, Articles, Stories), Twitter/X, Facebook, Snapchat, Pinterest, Twitch. APIs natives pour analytics temps réel. Templates spécialisés par plateforme avec contraintes techniques automatiques (formats, durées, résolutions). Optimisation cross-platform intelligente selon votre audience.', tags: ['plateformes', 'réseaux sociaux', 'intégration', 'API'], maj: '2025-08-27' },
    { id: 7, cat: 'Légal', popularite: 71, question: 'Comment protéger ma propriété intellectuelle avec les contenus générés par IA ?', reponse: 'Protection complète : watermarking invisible automatique, blockchain proof-of-creation, copyright automatique dans 180 pays, détection plagiat en temps réel, templates de cession droits IA-human, clauses anti-deepfake. Votre contenu = vos droits, même avec assistance IA. Assurance protection juridique incluse jusqu\'à 50K€. Base légale européenne (IA Act compliant).', tags: ['propriété intellectuelle', 'IA', 'droits', 'copyright'], maj: '2025-08-21' },
    { id: 8, cat: 'IA', popularite: 82, question: 'Quelle est la précision des prédictions de performance de l\'IA ?', reponse: 'Précision globale : 94.2% pour prédiction engagement, 91.7% pour reach estimation, 88.9% pour conversion rate, 96.1% pour optimal timing. Algorithmes entraînés sur 100M+ de posts, 50K+ campagnes réelles. Machine learning continu = amélioration constante. Biais correction intégrée pour tous les types de contenus. Marge d\'erreur moyenne : ±5% sur métriques principales. Transparency report disponible.', tags: ['précision', 'prédictions', 'algorithme', 'fiabilité'], maj: '2025-08-25' },
    { id: 9, cat: 'Général', popularite: 75, question: 'Comment puis-je collaborer avec mon équipe sur les campagnes ?', reponse: 'Collaboration temps réel : espaces de travail partagés, rôles et permissions granulaires (Admin, Manager, Créateur, Lecteur), commentaires inline sur contenus, historique complet des modifications, notifications intelligentes, intégration Slack/Teams/Email. Jusqu\'à 50 membres en Plan Agency. Tableau de bord équipe avec métriques individuelles et collectives.', tags: ['collaboration', 'équipe', 'workspace', 'permissions'], maj: '2025-08-20' },
    { id: 10, cat: 'Général', popularite: 86, question: 'Vos outils fonctionnent-ils pour les micro-influenceurs (1K-10K followers) ?', reponse: 'Absolument ! Nos outils sont spécialement optimisés pour micro-influenceurs : templates adaptés aux petites audiences, calculs ROI précis même sur volumes faibles, pricing proportionnel, analytics hyper-locales, growth hacking spécialisé, communauté dédiée. 78% de nos utilisateurs sont des micro-influenceurs avec 2.3x meilleur engagement rate que macro-influenceurs. Outils de croissance inclus.', tags: ['micro-influenceurs', 'croissance', 'petite audience', 'engagement'], maj: '2025-08-26' },
    { id: 11, cat: 'Tech', popularite: 69, question: 'Comment gérer les campagnes internationales multi-langues ?', reponse: 'Support 40+ langues : traduction IA native, adaptation culturelle automatique, templates localisés par pays, compliance réglementaire locale, conversion monétaires temps réel, fuseaux horaires automatiques, hashtags trending par région. IA détecte nuances culturelles et adapte messaging. Analytics séparées par geo. Un dashboard = gestion mondiale.', tags: ['international', 'multilingue', 'localisation', 'global'], maj: '2025-08-23' },
    { id: 12, cat: 'Campagne', popularite: 73, question: 'Que faire si une campagne ne performe pas comme prévu ?', reponse: 'Système d\'alerte proactif : détection sous-performance en temps réel, recommandations optimisation automatiques, A/B testing suggestions, pivot stratégies, compensation intelligente, post-mortem analysis IA. Si échec total : garantie 50% remboursement crédits IA + consulting gratuit + new strategy. Success rate actuel : 96.8% des campagnes atteignent 80%+ des objectifs.', tags: ['sous-performance', 'optimisation', 'garantie', 'support'], maj: '2025-08-25' },
  ]

  // ---- RESSOURCES ----
  const ressources = [
    { id: 1, type: 'ebook', cat: 'stratégie', name: 'Guide Complet du Marketing d\'Influence 2025', desc: 'Le guide définitif de 100 pages couvrant toutes les stratégies, tendances et outils pour réussir en influence marketing', rating: 4.9, reviews: 1318, level: 'Équipe Partnex', time: '3h 30min', size: '25 MB', date: '2025-06-15', tags: ['stratégie', 'templates', 'guide complet', '2025'], downloads: 1527, tier: 'Gratuit', tierColor: '#22c55e', tierBg: '#dcfce7' },
    { id: 2, type: 'calculateur', cat: 'analytics', name: 'Calculateur ROI Influence Avancé', desc: 'Outil interactif pour calculer précisément le ROI de vos campagnes avec 50+ métriques et projections IA', rating: 4.8, reviews: 4.8, level: 'Lead Data Scientist', time: '15 min', size: '–', date: '2025-08-20', tags: ['calculateur', 'métriques', 'analytics', 'IA'], downloads: 2341, tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7' },
    { id: 3, type: 'checklist', cat: 'planification', name: 'Checklist de la Campagne d\'Influence Parfaite', desc: '127 points de contrôle pour garantir le succès de votre campagne, de la planification au reporting', rating: 4.7, reviews: 4.7, level: 'Campaign Manager Eu.', time: '45 min', size: '5 MB', date: '2025-06-01', tags: ['checklist', 'campagne', 'planification', 'succès', 'contrôle qualité'], downloads: 3452, tier: 'Gratuit', tierColor: '#22c55e', tierBg: '#dcfce7' },
    { id: 4, type: 'webinar', cat: 'formation', name: 'Masterclass : IA & Influence Marketing', desc: 'Webinar de 2h avec experts. A pour maîtriser l\'automatisation et l\'optimisation de vos campagnes', rating: 4.9, reviews: 1.5, level: 'CTO Business & réseaux', time: '2h 0min', size: '850 MB', date: '2025-08-22', tags: ['IA', 'formation', 'webinar', 'automatisation', 'experts'], downloads: 1875, tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7' },
    { id: 5, type: 'guide', cat: 'analytics', name: 'Rapport Tendances Réseaux Sociaux Q3 2025', desc: 'Analyse exclusive des nouvelles tendances Instagram, TikTok, LinkedIn avec données sur 50M+ de posts', rating: 4.8, reviews: 1.8, level: 'Social Media Research T.', time: '1h 10min', size: '10 MB', date: '2025-09-01', tags: ['tendances', 'instagram', 'TikTok', 'LinkedIn', 'data'], downloads: 2657, tier: 'Gratuit', tierColor: '#22c55e', tierBg: '#dcfce7' },
    { id: 6, type: 'tutorial', cat: 'juridique', name: 'Podcast : Aspects Légaux de l\'Influence Marketing', desc: 'Série 8 épisodes avec avocats spécialisés sur les contrats, RGPD, IA et protection des créateurs', rating: 4.6, reviews: 1.8, level: 'Cabinet Juridique Digit.', time: '4h 20min', size: '120 MB', date: '2025-05-15', tags: ['juridique', 'podcast', 'RGPD', 'contrats', 'protection'], downloads: 1354, tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7' },
    { id: 7, type: 'guide', cat: 'reporting', name: 'Templates de Reporting Client Professionnel', desc: 'Pack de 12 templates PowerPoint/Google Slides pour présenter vos résultats clients avec impact', rating: 4.7, reviews: 4.7, level: 'Design Team', time: '2h 15min', size: '95 MB', date: '2025-06-17', tags: ['reporting', 'templates', 'client', 'présentation', 'design'], downloads: 1763, tier: 'Premium', tierColor: '#f59e0b', tierBg: '#fef3c7' },
    { id: 8, type: 'ebook', cat: 'stratégie', name: 'Guide Micro-Influence : Stratégies Gagnantes', desc: 'Spécialisation pour influenceurs 1K-50k : growth hacking, monétisation, collaborations marques', rating: 4.8, reviews: 4.0, level: 'Micro-Influencer Succe.', time: '2h 0min', size: '22 MB', date: '2025-08-21', tags: ['micro-influenceurs', 'growth', 'monétisation', 'stratégie', 'marques'], downloads: 2134, tier: 'Gratuit', tierColor: '#22c55e', tierBg: '#dcfce7' },
  ]

  const tagColors = {
    intermediate: { bg: '#fef3c7', color: '#d97706' },
    beginner: { bg: '#dcfce7', color: '#16a34a' },
    advanced: { bg: '#fee2e2', color: '#dc2626' },
    analysis: { bg: '#e0e7ff', color: '#4338ca' },
    generation: { bg: '#fce7f3', color: '#be185d' },
    automation: { bg: '#d1fae5', color: '#065f46' },
  }

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = (name, content) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/\s+/g, '_')}.txt`
    a.click()
  }

  const filteredFaqs = faqFilter === 'Tout' ? faqs : faqs.filter(f => f.cat === faqFilter)

  return (
    <div style={{ ...s, padding: '2rem', background: '#f8f9ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Ressources & Templates</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Centre de ressources intelligent • Outils IA • Templates optimisés • Support expert</p>
      </div>

      {/* SEARCH */}
      <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>🔍</span>
        <input type="text" placeholder="Rechercher dans toutes les ressources..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.65rem', paddingBottom: '0.65rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '2rem', border: '1px solid #e2e8f0', maxWidth: '700px', margin: '0 auto 2rem' }}>
        {[
          { id: 'outils', icon: '🤖', label: 'Outils IA', activeColor: '#a855f7' },
          { id: 'templates', icon: '📋', label: 'Templates', activeColor: '#3b82f6' },
          { id: 'faq', icon: '❓', label: 'FAQ', activeColor: '#22c55e' },
          { id: 'ressources', icon: '📚', label: 'Ressources', activeColor: '#f97316' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '0.65rem 1rem', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: tab === t.id ? 700 : 400,
            background: tab === t.id ? t.activeColor : 'transparent',
            color: tab === t.id ? '#fff' : '#718096',
            borderRadius: '8px', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== OUTILS IA ===== */}
      {tab === 'outils' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>🤖 Suite d'Outils IA Partnex</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Découvrez notre écosystème d'intelligence artificielle pour automatiser, optimiser et amplifier<br />vos campagnes d'influence</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {outils.map((outil, i) => (
              <div key={i} style={{ ...card, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <span style={{ background: outil.tier === 'premium' ? '#fef3c7' : '#dcfce7', color: outil.tier === 'premium' ? '#d97706' : '#16a34a', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '100px' }}>{outil.tier}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7', marginBottom: '0.5rem', paddingRight: '4rem' }}>{outil.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.75rem', lineHeight: 1.5 }}>{outil.desc}</div>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {outil.tags.map(tag => (
                    <span key={tag} style={{ background: tagColors[tag]?.bg || '#f3f4f6', color: tagColors[tag]?.color || '#4a5568', fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{tag}</span>
                  ))}
                </div>
                {[['Précision', outil.precision], ['Vitesse', outil.vitesse]].map(([label, val]) => (
                  <div key={label} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#718096', marginBottom: '0.2rem' }}>
                      <span>{label}</span><span style={{ fontWeight: 600, color: '#1a202c' }}>{val}%</span>
                    </div>
                    <div style={{ height: '5px', background: '#f0f0f0', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${val}%`, background: 'linear-gradient(90deg,#a855f7,#6366f1)', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1a202c', marginTop: '0.75rem', marginBottom: '0.4rem' }}>Fonctionnalités clés :</div>
                {outil.fonctionnalites.map(f => (
                  <div key={f} style={{ fontSize: '0.72rem', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </div>
                ))}
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1a202c', marginTop: '0.6rem', marginBottom: '0.4rem' }}>Cas d'usage :</div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  {outil.usages.map(u => <span key={u} style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.62rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{u}</span>)}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1a202c', marginBottom: '0.4rem' }}>Intégrations :</div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                  {outil.integrations.map(int => <span key={int} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '0.62rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{int}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ flex: 1, padding: '0.55rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    ✦ Essayer
                  </button>
                  <button style={{ width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>↗</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TEMPLATES ===== */}
      {tab === 'templates' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>📋 Bibliothèque de Templates</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Templates professionnels optimisés par IA pour tous vos besoins : contenus, briefs, contrats, rapports.</div>
          </div>

          {/* Upload zone */}
          <div style={{ ...card, marginBottom: '1.5rem', border: '2px dashed #e2e8f0' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#a855f7', marginBottom: '1rem' }}>Importer vos templates</div>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: '#fafafa', marginBottom: '0.75rem' }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); alert(`Fichier reçu : ${e.dataTransfer.files[0]?.name}`) }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⬆</div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Glisser-déposer vos templates ici</div>
              <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>Supporté : PDF, Word, PowerPoint, Google Docs, Notion, Figma</div>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" multiple style={{ display: 'none' }} onChange={e => alert(`Fichier sélectionné : ${e.target.files[0]?.name}`)} />
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <button onClick={() => fileInputRef.current?.click()} style={{ flex: 1, padding: '0.55rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                📂 Parcourir les fichiers
              </button>
              <button onClick={() => { const url = prompt('Entrez l\'URL du template :'); if (url) alert(`Template depuis URL: ${url}`) }} style={{ flex: 1, padding: '0.55rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                🔗 Depuis une URL
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: '#a0aec0' }}>
              {['📄 Briefs', '📝 Contrats', '📊 Rapports', '✉ Emails'].map(tag => (
                <span key={tag} style={{ background: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Templates grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}>
            {templates.map(tpl => (
              <div key={tpl.id} style={{ ...card, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: tpl.tierBg, color: tpl.tierColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '100px' }}>{tpl.tier}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#a0aec0' }}>⏱ {tpl.time}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7', marginBottom: '0.35rem' }}>{tpl.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.75rem' }}>{tpl.desc}</div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{'★'.repeat(Math.floor(tpl.rating))}</span>
                  <span style={{ fontSize: '0.72rem', color: '#718096' }}>({tpl.reviews})</span>
                  <span style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.62rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{tpl.level}</span>
                </div>

                {/* Platforms */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0', fontWeight: 600, marginBottom: '0.25rem' }}>Plateformes :</div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {tpl.platforms.map(p => <span key={p} style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.62rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{p}</span>)}
                  </div>
                </div>

                {/* Variables */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0', fontWeight: 600, marginBottom: '0.25rem' }}>Variables personnalisables ({tpl.variables.length}) :</div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {tpl.variables.slice(0, 5).map(v => <span key={v} style={{ background: '#ede9fe', color: '#7c3aed', fontSize: '0.62rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>{v}</span>)}
                    {tpl.variables.length > 5 && <span style={{ fontSize: '0.62rem', color: '#a0aec0' }}>+{tpl.variables.length - 5} autres</span>}
                  </div>
                </div>

                {/* Aperçu */}
                <div style={{ background: '#f8f9fa', borderRadius: '6px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.68rem', color: '#718096', fontFamily: 'monospace', lineHeight: 1.5 }}>
                  {tpl.apercu.slice(0, 120)}...
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>
                    ⬇ {tpl.downloads} · ⭐ {tpl.copies}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleCopy(tpl.id, tpl.content)}
                      style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px', background: copied === tpl.id ? '#dcfce7' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}
                      title="Copier le template"
                    >
                      {copied === tpl.id ? '✓' : '📋'}
                    </button>
                    <button
                      onClick={() => handleDownload(tpl.name, tpl.content)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 600 }}
                      title="Télécharger le template"
                    >
                      👤 Utiliser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== FAQ ===== */}
      {tab === 'faq' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>❓ Foire Aux Questions</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Toutes les réponses à vos questions sur Partnex, l'IA, les campagnes et bien plus...</div>
          </div>

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
            {['Tout', 'Général', 'IA', 'Technique', 'Facturation', 'Juridique', 'Campagnes'].map(f => (
              <button key={f} onClick={() => setFaqFilter(f)} style={{
                padding: '0.4rem 1rem', borderRadius: '100px', border: faqFilter === f ? 'none' : '1px solid #e2e8f0',
                background: faqFilter === f ? '#a855f7' : '#fff',
                color: faqFilter === f ? '#fff' : '#718096',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: faqFilter === f ? 600 : 400,
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          {filteredFaqs.map((faq) => (
            <div key={faq.id} style={{ ...card, marginBottom: '0.75rem', cursor: 'pointer' }} onClick={() => setFaqOpen(faqOpen === faq.id ? null : faq.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <span style={{ background: faq.cat === 'IA' ? '#ede9fe' : faq.cat === 'Tech' ? '#dbeafe' : faq.cat === 'Légal' ? '#dcfce7' : faq.cat === 'Prix' ? '#fef3c7' : faq.cat === 'Campagne' ? '#fce7f3' : '#f3f4f6', color: faq.cat === 'IA' ? '#7c3aed' : faq.cat === 'Tech' ? '#1d4ed8' : faq.cat === 'Légal' ? '#15803d' : faq.cat === 'Prix' ? '#b45309' : faq.cat === 'Campagne' ? '#be185d' : '#4b5563', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', flexShrink: 0 }}>{faq.cat}</span>
                  <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, flexShrink: 0 }}>↗ {faq.popularite}% populaire</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a202c' }}>{faq.question}</span>
                </div>
                <span style={{ color: '#a0aec0', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{faqOpen === faq.id ? '▲' : '▼'}</span>
              </div>

              {faqOpen === faq.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '0.82rem', color: '#4a5568', lineHeight: 1.7, margin: '0 0 0.75rem' }}>{faq.reponse}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {faq.tags.map(tag => (
                      <span key={tag} style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Dernière mise à jour : {faq.maj}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} onClick={e => e.stopPropagation()}>👍</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} onClick={e => e.stopPropagation()}>↗</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== RESSOURCES ===== */}
      {tab === 'ressources' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>📚 Centre de Ressources</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>Guides experts, e-books, calculateurs, webinars et formations pour maîtriser l'influence marketing.</div>
          </div>

          {/* Import zone */}
          <div style={{ ...card, marginBottom: '1.5rem', border: '1.5px solid #e9d5ff', background: '#fdf9ff' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#a855f7', marginBottom: '1rem' }}>Importer vos ressources</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {[
                { icon: '📄', label: 'Documents', sub: 'PDF, Word, Excel', ref: docInputRef, accept: '.pdf,.doc,.docx,.xls,.xlsx' },
                { icon: '🖼', label: 'Médias', sub: 'Images, Vidéos', ref: mediaInputRef, accept: 'image/*,video/*' },
                { icon: '🔗', label: 'Liens', sub: 'URLs, Articles', ref: null, isUrl: true },
              ].map((item) => (
                <div key={item.label}>
                  <input ref={item.ref} type="file" accept={item.accept} multiple style={{ display: 'none' }} onChange={e => alert(`${item.label} sélectionné : ${e.target.files[0]?.name}`)} />
                  <button
                    onClick={() => item.isUrl ? (() => { const url = prompt('Entrez l\'URL :'); if (url) alert(`Lien ajouté : ${url}`) })() : item.ref?.current?.click()}
                    style={{ width: '100%', padding: '1rem', border: '1.5px dashed #e2e8f0', borderRadius: '10px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c' }}>{item.label}</div>
                    <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{item.sub}</div>
                    <div style={{ marginTop: '0.4rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>+ Ajouter</div>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ✦ Organisation automatique par IA — Catégorisation, tags et recherche intelligente
              <span style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.25rem 0.6rem', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', color: '#4a5568' }}>☁ Cloud</button>
                <button style={{ padding: '0.25rem 0.6rem', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', color: '#4a5568' }}>⬆ Importer</button>
              </span>
            </div>
          </div>

          {/* Ressources grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {ressources.map(res => (
              <div key={res.id} style={{ ...card, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <span style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.62rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{res.type}</span>
                    <span style={{ background: '#ede9fe', color: '#7c3aed', fontSize: '0.62rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{res.cat}</span>
                  </div>
                  <span style={{ background: res.tierBg, color: res.tierColor, fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '100px' }}>{res.tier}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#a855f7', marginBottom: '0.35rem' }}>{res.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.6rem', lineHeight: 1.5 }}>{res.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.72rem' }}>{'★'.repeat(Math.floor(res.rating))}</span>
                  <span style={{ fontSize: '0.68rem', color: '#718096' }}>({res.reviews})</span>
                  <span style={{ fontSize: '0.68rem', color: '#718096' }}>{res.level}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.68rem', color: '#a0aec0', marginBottom: '0.5rem' }}>
                  <span>⏱ {res.time}</span>
                  {res.size !== '–' && <span>📁 {res.size}</span>}
                  <span>📅 {res.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {res.tags.slice(0, 4).map(tag => <span key={tag} style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>{tag}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#a0aec0' }}>⬇ {res.downloads}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.7rem' }}>👁</button>
                    <button
                      onClick={() => {
                        if (res.tier === 'Premium') {
                          const code = prompt('Entrez votre code premium :')
                          if (code === 'PREMIUM2025' || code === 'premium') alert('✅ Accès accordé ! Téléchargement en cours...')
                          else if (code !== null) alert('❌ Code invalide. Vérifiez votre abonnement.')
                        } else {
                          alert(`⬇ Téléchargement de "${res.name}" en cours...`)
                        }
                      }}
                      style={{ padding: '0.35rem 0.75rem', background: res.tier === 'Premium' ? 'linear-gradient(135deg,#f59e0b,#f97316)' : 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      {res.tier === 'Premium' ? '🔒 Premium' : '⬇ Gratuit'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}