'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Line, Legend, Cell, ComposedChart
} from 'recharts'
import {
  BarChart3, Target, TrendingUp, DollarSign, Users, Heart, Share2,
  Brain, Sparkles, ArrowUpRight, ArrowDownRight, Download, Globe,
  Lightbulb, Search, Award, Eye, Package
} from 'lucide-react'
import { toast } from 'sonner'

const getRevenueDataByPeriod = (period) => {
  const dataMap = {
    "1m": [
      { month: "Semaine 1", revenus: 78000, cout: 14500, roi: 437 },
      { month: "Semaine 2", revenus: 82000, cout: 15200, roi: 439 },
      { month: "Semaine 3", revenus: 75000, cout: 14000, roi: 435 },
      { month: "Semaine 4", revenus: 80000, cout: 14800, roi: 440 },
    ],
    "3m": [
      { month: "Avr", revenus: 234000, cout: 48000, roi: 387 },
      { month: "Mai", revenus: 278000, cout: 52000, roi: 434 },
      { month: "Juin", revenus: 315000, cout: 58000, roi: 443 },
    ],
    "6m": [
      { month: "Jan", revenus: 145000, cout: 35000, roi: 314 },
      { month: "Fév", revenus: 168000, cout: 42000, roi: 300 },
      { month: "Mar", revenus: 189000, cout: 38000, roi: 397 },
      { month: "Avr", revenus: 234000, cout: 48000, roi: 387 },
      { month: "Mai", revenus: 278000, cout: 52000, roi: 434 },
      { month: "Juin", revenus: 315000, cout: 58000, roi: 443 },
    ],
    "1y": [
      { month: "Juil", revenus: 125000, cout: 32000, roi: 290 },
      { month: "Août", revenus: 138000, cout: 36000, roi: 283 },
      { month: "Sept", revenus: 156000, cout: 38000, roi: 310 },
      { month: "Oct", revenus: 172000, cout: 40000, roi: 330 },
      { month: "Nov", revenus: 198000, cout: 44000, roi: 350 },
      { month: "Déc", revenus: 210000, cout: 46000, roi: 356 },
      { month: "Jan", revenus: 145000, cout: 35000, roi: 314 },
      { month: "Fév", revenus: 168000, cout: 42000, roi: 300 },
      { month: "Mar", revenus: 189000, cout: 38000, roi: 397 },
      { month: "Avr", revenus: 234000, cout: 48000, roi: 387 },
      { month: "Mai", revenus: 278000, cout: 52000, roi: 434 },
      { month: "Juin", revenus: 315000, cout: 58000, roi: 443 },
    ]
  }
  return dataMap[period] || dataMap["6m"]
}

const platformData = [
  { name: "Instagram", vues: 2800000, engagement: 7.2, conversions: 892, revenus: 125000, couleur: "#E4405F" },
  { name: "TikTok", vues: 1950000, engagement: 8.9, conversions: 567, revenus: 78000, couleur: "#000000" },
  { name: "YouTube", vues: 1420000, engagement: 5.4, conversions: 388, revenus: 42680, couleur: "#FF0000" },
]

// Performance par plateforme — onglet Placements (placements + ventes par canal)
const placementPlatformData = [
  { name: "Instagram", placements: 67, ventes: 1284, revenus: 147200, couleur: "#E4405F" },
  { name: "TikTok", placements: 52, ventes: 986, revenus: 112300, couleur: "#000000" },
  { name: "YouTube", placements: 37, ventes: 577, revenus: 68180, couleur: "#FF0000" },
]

// ROI par produit — onglet Placements
const productRoiData = [
  { nom: "Crème visage bio", ventes: 847, revenus: 84700, roi: 512 },
  { nom: "Sérum anti-âge", ventes: 623, revenus: 62300, roi: 445 },
  { nom: "Huile corps naturelle", ventes: 512, revenus: 51200, roi: 398 },
  { nom: "Masque purifiant", ventes: 445, revenus: 44500, roi: 367 },
  { nom: "Eau micellaire", ventes: 420, revenus: 42000, roi: 334 },
]

// Évolution de la notoriété — onglet Notoriété
const notorieteEvolution = {
  avant: 18,
  apres: 34,
  croissance: 89,
}

const allInfluencers = [
  { id: 1, nom: "Sarah Fashion", plateforme: "Instagram", followers: "2.8M", engagement: 8.4, revenus: 45600, conversions: 234, roi: 456, specialite: "Mode" },
  { id: 2, nom: "Max Lifestyle", plateforme: "TikTok", followers: "1.2M", engagement: 9.1, revenus: 38900, conversions: 198, roi: 389, specialite: "Lifestyle" },
  { id: 3, nom: "Tech Nina", plateforme: "YouTube", followers: "890K", engagement: 6.7, revenus: 32400, conversions: 167, roi: 324, specialite: "Tech" },
  { id: 4, nom: "Emma Travel", plateforme: "Instagram", followers: "1.5M", engagement: 7.8, revenus: 28500, conversions: 145, roi: 285, specialite: "Voyage" },
  { id: 5, nom: "Julie Makeup", plateforme: "TikTok", followers: "950K", engagement: 8.2, revenus: 25300, conversions: 132, roi: 253, specialite: "Beauté" },
  { id: 6, nom: "Lea Fitness", plateforme: "Instagram", followers: "780K", engagement: 6.9, revenus: 22100, conversions: 118, roi: 221, specialite: "Sport" },
  { id: 7, nom: "Marie Skincare", plateforme: "YouTube", followers: "650K", engagement: 7.5, revenus: 21800, conversions: 124, roi: 218, specialite: "Beauté" },
  { id: 8, nom: "Thomas Tech", plateforme: "TikTok", followers: "1.1M", engagement: 8.7, revenus: 31200, conversions: 156, roi: 312, specialite: "Tech" },
  { id: 9, nom: "Sophie Lifestyle", plateforme: "Instagram", followers: "1.8M", engagement: 7.2, revenus: 35400, conversions: 178, roi: 354, specialite: "Lifestyle" },
  { id: 10, nom: "Antoine Food", plateforme: "TikTok", followers: "820K", engagement: 9.3, revenus: 19500, conversions: 98, roi: 195, specialite: "Food" },
  { id: 11, nom: "Camille Deco", plateforme: "Instagram", followers: "590K", engagement: 6.5, revenus: 18200, conversions: 91, roi: 182, specialite: "Déco" },
  { id: 12, nom: "Lucas Gaming", plateforme: "YouTube", followers: "2.1M", engagement: 8.9, revenus: 42300, conversions: 203, roi: 423, specialite: "Gaming" },
]

const affiliateData = [
  { programme: "Beauty Boost", commissions: 28500, ventes: 456, taux: 12.8, revenus: 142500, tauxCommission: 20, profit: 114000 },
  { programme: "Fashion Forward", commissions: 34200, ventes: 578, taux: 15.2, revenus: 228000, tauxCommission: 15, profit: 193800 },
  { programme: "Tech Trends", commissions: 19800, ventes: 298, taux: 8.9, revenus: 198000, tauxCommission: 10, profit: 178200 },
  { programme: "Lifestyle Plus", commissions: 42100, ventes: 687, taux: 18.4, revenus: 210500, tauxCommission: 20, profit: 168400 },
]

const campaignComparison = [
  { nom: "Lancement Q4", budget: 75000, revenus: 285000, roi: 380, conversions: 892, engagement: 7.2 },
  { nom: "Black Friday", budget: 120000, revenus: 450000, roi: 375, conversions: 1456, engagement: 8.9 },
  { nom: "Summer Vibes", budget: 85000, revenus: 315000, roi: 370, conversions: 1023, engagement: 6.8 },
  { nom: "Printemps Mode", budget: 65000, revenus: 240000, roi: 369, conversions: 756, engagement: 7.5 },
  { nom: "Soldes Hiver", budget: 95000, revenus: 380000, roi: 400, conversions: 1234, engagement: 8.1 },
]

const businessKpis = [
  { label: "Revenus Totaux", value: "€245,680", subtitle: "Ce mois", change: "+15.2%", trend: "up", icon: DollarSign, bg: "from-yellow-50 to-orange-50", color: "text-yellow-600" },
  { label: "ROI Moyen", value: "420%", subtitle: "Toutes campagnes", change: "+8.7%", trend: "up", icon: TrendingUp, bg: "from-green-50 to-emerald-50", color: "text-green-600" },
  { label: "Conversions", value: "1,847", subtitle: "30 derniers jours", change: "-2.1%", trend: "down", icon: Target, bg: "from-purple-50 to-violet-50", color: "text-purple-600" },
  { label: "Taux d'Engagement", value: "6.8%", subtitle: "Moyenne secteur: 4.2%", change: "+12.4%", trend: "up", icon: Heart, bg: "from-pink-50 to-rose-50", color: "text-pink-600" },
]

const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }

const formatCurrency = (value) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", notation: value > 999999 ? "compact" : "standard" }).format(value)
const formatNumber = (value) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(value)

const AnalyticsSection = () => {
  const [periode, setPeriode] = useState("6m")
  const [searchInfluencer, setSearchInfluencer] = useState("")

  const revenueData = getRevenueDataByPeriod(periode)

  const filteredInfluencers = useMemo(() => {
    if (!searchInfluencer.trim()) return allInfluencers
    const search = searchInfluencer.toLowerCase().trim()
    return allInfluencers.filter(inf =>
      inf.nom.toLowerCase().includes(search) ||
      inf.plateforme.toLowerCase().includes(search) ||
      inf.specialite.toLowerCase().includes(search)
    )
  }, [searchInfluencer])

  const channels = [
    { name: "Instagram", count: 142, color: "#E4405F" },
    { name: "TikTok", count: 98, color: "#000000" },
    { name: "YouTube", count: 67, color: "#FF0000" },
    { name: "X / Twitter", count: 34, color: "#1DA1F2" },
  ]
  const total = channels.reduce((sum, ch) => sum + ch.count, 0)

  const maxProductRevenue = Math.max(...affiliateData.map(a => a.revenus))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              <Brain className="h-3 w-3 mr-1" />IA Activée
            </Badge>
          </div>
          <p className="text-muted-foreground">Analytics avancées • Insights intelligents • Rapports automatisés</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Analytics Business</h2>
            <p className="text-sm text-muted-foreground">ROI, performances et revenus en temps réel</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Mois</SelectItem>
                <SelectItem value="3m">3 Mois</SelectItem>
                <SelectItem value="6m">6 Mois</SelectItem>
                <SelectItem value="1y">1 Année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.info("Export disponible prochainement")}>
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessKpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} border-0 shadow-lg`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                  <div className="p-2 rounded-lg bg-white/60">
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{kpi.subtitle}</span>
                    <Badge variant="outline" className={`text-xs ${kpi.trend === "up" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                      {kpi.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {kpi.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue="revenus" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
            {[
              { value: "revenus", label: "Revenus", icon: DollarSign, color: "from-blue-500 to-blue-600" },
              { value: "activations", label: "Activations", icon: Globe, color: "from-green-500 to-green-600" },
              { value: "influenceurs", label: "Top Performers", icon: Users, color: "from-purple-500 to-purple-600" },
              { value: "affiliation", label: "Affiliation", icon: Share2, color: "from-orange-500 to-orange-600" },
              { value: "comparaison", label: "Comparaison", icon: BarChart3, color: "from-pink-500 to-pink-600" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className={`flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white transition-all`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* REVENUS */}
          <TabsContent value="revenus" className="space-y-6 mt-6">
            {/* IA Insights */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10"><Lightbulb className="w-5 h-5 text-primary" /></div>
                  Innovation - Insights Revenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-100"><TrendingUp className="w-4 h-4 text-green-600" /></div>
                      <div>
                        <h4 className="font-medium text-green-700">Croissance Exceptionnelle</h4>
                        <p className="text-sm text-green-600 mt-1">+43% de revenus vs trimestre précédent. Instagram drive 51% des conversions.</p>
                        <div className="mt-2 pt-2 border-t border-green-200">
                          <p className="text-xs text-green-700 font-medium">Détails par canal:</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-green-600"><span>Instagram +18%</span><span>•</span><span>TikTok +12%</span><span>•</span><span>YouTube +8%</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100"><Target className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <h4 className="font-medium text-blue-700">Optimisation Suggérée</h4>
                        <p className="text-sm text-blue-600 mt-1">Augmenter le budget TikTok de 25% pourrait générer +€48K de revenus supplémentaires.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-100"><Brain className="w-4 h-4 text-purple-600" /></div>
                      <div>
                        <h4 className="font-medium text-purple-700">Prédiction IA</h4>
                        <p className="text-sm text-purple-600 mt-1">Avec les tendances actuelles, objectif +€125K atteignable d'ici fin de trimestre.</p>
                        <div className="mt-2 pt-2 border-t border-purple-200">
                          <div className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-600" /><span className="text-xs text-purple-700 font-medium">Confiance: 87%</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Graphique revenus */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Performance Revenus & ROI</CardTitle>
                    <Badge variant="outline" className="bg-primary/10"><TrendingUp className="w-3 h-3 mr-1" />Double Axe</Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueData}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="left" stroke="hsl(var(--primary))" fontSize={12} tickFormatter={(v) => `${v/1000}K`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={12} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [name === "roi" ? `${value}%` : formatCurrency(value), name === "revenus" ? "Revenus" : name === "cout" ? "Coûts" : "ROI"]} />
                      <Legend formatter={(v) => v === "revenus" ? "Revenus" : v === "cout" ? "Coûts" : "ROI"} />
                      <Bar yAxisId="left" dataKey="revenus" fill="url(#barGrad)" radius={[8,8,0,0]} name="revenus" />
                      <Bar yAxisId="left" dataKey="cout" fill="url(#costGrad)" radius={[8,8,0,0]} name="cout" />
                      <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 5 }} name="roi" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Répartition par plateforme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Répartition par Plateforme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-4">
                  {channels.map((channel) => {
                    const pct = Math.round(channel.count / total * 100)
                    return (
                      <div key={channel.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${channel.color}20` }}>
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: channel.color }} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{channel.name}</p>
                              <p className="text-xs text-muted-foreground">{channel.count} créateurs</p>
                            </div>
                          </div>
                          <p className="font-bold text-lg" style={{ color: channel.color }}>{pct}%</p>
                        </div>
                        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${channel.color}dd, ${channel.color})` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ACTIVATIONS */}
          <TabsContent value="activations" className="space-y-6 mt-6">
            <Tabs defaultValue="ambassadeurs">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1">
                {[
                  { value: "ambassadeurs", label: "Ambassadeur de marque", icon: Award, color: "from-amber-500 to-orange-600" },
                  { value: "notoriete", label: "Campagnes de notoriété", icon: Eye, color: "from-sky-500 to-blue-600" },
                  { value: "placements", label: "Placements de produits", icon: Package, color: "from-violet-500 to-purple-600" },
                ].map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}
                    className={`flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white`}>
                    <tab.icon className="w-4 h-4" />{tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="ambassadeurs" className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[{ label: "Ambassadeurs actifs", value: "47", sub: "Sur 58 inscrits" }, { label: "Revenus générés", value: "€184,500", sub: "+23% ce mois", color: "text-green-600" }, { label: "Moyenne ventes/ambassadeur", value: "€3,926", sub: "Par mois" }, { label: "Taux d'activité", value: "81%", sub: "47/58 actifs" }].map(item => (
                    <Card key={item.label}><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle></CardHeader><CardContent><div className={`text-2xl font-bold ${item.color || ''}`}>{item.value}</div><p className="text-xs text-muted-foreground mt-1">{item.sub}</p></CardContent></Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Statistiques détaillées</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {[{ label: "Durée moyenne de collaboration", value: "8.4 mois" }, { label: "Taux d'engagement moyen", value: "7.2%" }, { label: "ROI moyen campagnes", value: "385%", color: "text-green-600" }, { label: "Posts publiés (30j)", value: "234" }].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className={`font-semibold ${item.color || ''}`}>{item.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Top 5 Ambassadeurs</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[{ name: "Sophie Martin", revenus: "€12,400", posts: 18 }, { name: "Emma Dubois", revenus: "€10,800", posts: 15 }, { name: "Julie Laurent", revenus: "€9,600", posts: 14 }, { name: "Léa Bernard", revenus: "€8,900", posts: 12 }, { name: "Marie Petit", revenus: "€8,200", posts: 11 }].map((amb, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                              <div><p className="font-medium text-sm">{amb.name}</p><p className="text-xs text-muted-foreground">{amb.posts} posts</p></div>
                            </div>
                            <span className="font-semibold text-green-600">{amb.revenus}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notoriete" className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[{ label: "Impressions totales", value: "28.4M", sub: "+18% ce mois" }, { label: "Portée unique", value: "12.7M", sub: "Utilisateurs touchés" }, { label: "Taux mémorisation", value: "34%", sub: "+5.2% vs benchmark" }, { label: "Coût pour 1K vues", value: "€2.8", sub: "-12% vs objectif" }].map(item => (
                    <Card key={item.label}><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{item.value}</div><p className="text-xs text-muted-foreground mt-1">{item.sub}</p></CardContent></Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Performance par Plateforme</CardTitle></CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}K`} />
                          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatNumber(v), "Vues"]} />
                          <Bar dataKey="vues" radius={[8,8,0,0]} name="Vues">
                            {platformData.map((entry, i) => <Cell key={i} fill={entry.couleur} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  {/* Évolution de la notoriété */}
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Évolution de la notoriété</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                        <div className="flex items-center gap-2 text-green-700"><TrendingUp className="w-4 h-4" /><span className="text-sm font-medium">Avant campagne</span></div>
                        <div className="text-2xl font-bold text-green-700 mt-1">{notorieteEvolution.avant}%</div>
                        <p className="text-xs text-green-600">Notoriété de marque</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700"><Sparkles className="w-4 h-4" /><span className="text-sm font-medium">Après campagne</span></div>
                        <div className="text-2xl font-bold text-blue-700 mt-1">{notorieteEvolution.apres}%</div>
                        <p className="text-xs text-blue-600">Notoriété de marque</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                        <div className="flex items-center gap-2 text-purple-700"><ArrowUpRight className="w-4 h-4" /><span className="text-sm font-medium">Croissance</span></div>
                        <div className="text-2xl font-bold text-purple-700 mt-1">+{notorieteEvolution.croissance}%</div>
                        <p className="text-xs text-purple-600">Augmentation relative</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="placements" className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[{ label: "Produits placés", value: "234", sub: "Ce trimestre" }, { label: "Valeur totale", value: "€58,500", sub: "Produits envoyés" }, { label: "Taux de mention", value: "92%", sub: "Contenus publiés" }, { label: "Retour média", value: "€175,000", sub: "Valeur estimée" }].map(item => (
                    <Card key={item.label}><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-violet-600">{item.value}</div><p className="text-xs text-muted-foreground mt-1">{item.sub}</p></CardContent></Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ROI par produit */}
                  <Card>
                    <CardHeader><CardTitle>ROI par produit</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {productRoiData.map((prod) => (
                        <div key={prod.nom} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{prod.nom}</p>
                              <p className="text-xs text-muted-foreground">{prod.ventes} ventes</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">ROI {prod.roi}%</Badge>
                              <p className="text-sm font-semibold text-muted-foreground mt-1">€{prod.revenus.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" style={{ width: `${Math.round(prod.revenus / maxProductRevenue * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  {/* Performance par plateforme (placements) */}
                  <Card>
                    <CardHeader><CardTitle>Performance par plateforme</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {placementPlatformData.map((p) => (
                        <div key={p.name} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.couleur }} />
                              <span className="font-semibold text-sm">{p.name}</span>
                            </div>
                            <span className="font-semibold text-sm">€{p.revenus.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Placements: {p.placements}</span>
                            <span>Ventes: {p.ventes}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* TOP PERFORMERS */}
          <TabsContent value="influenceurs" className="space-y-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher un influenceur..." value={searchInfluencer} onChange={(e) => setSearchInfluencer(e.target.value)} className="pl-9" />
              </div>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" />Top Performers</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-primary/5 to-accent/5">
                        <TableHead>#</TableHead>
                        <TableHead>Influenceur</TableHead>
                        <TableHead>Plateforme</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Revenus générés</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Spécialité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInfluencers.map((inf, idx) => (
                        <TableRow key={inf.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-bold text-muted-foreground">{idx + 1}</TableCell>
                          <TableCell className="font-semibold">{inf.nom}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{inf.plateforme}</Badge></TableCell>
                          <TableCell className="font-medium">{inf.followers}</TableCell>
                          <TableCell><Badge className={`text-xs ${inf.engagement >= 8 ? 'bg-green-500' : inf.engagement >= 6 ? 'bg-blue-500' : 'bg-orange-500'} text-white`}>{inf.engagement}%</Badge></TableCell>
                          <TableCell className="font-semibold text-green-600">€{inf.revenus.toLocaleString()}</TableCell>
                          <TableCell>{inf.conversions}</TableCell>
                          <TableCell><Badge className="bg-primary/10 text-primary border-primary/20">{inf.roi}%</Badge></TableCell>
                          <TableCell><Badge variant="secondary" className="text-xs">{inf.specialite}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AFFILIATION — cartes programme avec barres de progression (fidèle Lovable) */}
          <TabsContent value="affiliation" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[{ label: "Total commissions", value: "€124,600", color: "text-orange-600" }, { label: "Ventes générées", value: "2,019", color: "text-blue-600" }, { label: "Revenus affiliation", value: "€779,000", color: "text-green-600" }, { label: "Taux moyen", value: "13.8%", color: "text-purple-600" }].map(item => (
                <Card key={item.label}><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle></CardHeader><CardContent><div className={`text-2xl font-bold ${item.color}`}>{item.value}</div></CardContent></Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {affiliateData.map((aff) => {
                const pct = Math.round(aff.profit / aff.revenus * 100)
                return (
                  <Card key={aff.programme}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base"><Share2 className="w-4 h-4 text-orange-500" />{aff.programme}</CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground">Commission {aff.tauxCommission}%</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                        <span className="text-sm text-muted-foreground">Revenus totaux</span>
                        <span className="font-bold text-green-700">€{aff.revenus.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                        <span className="text-sm text-muted-foreground">Commissions à payer</span>
                        <span className="font-bold text-orange-700">€{aff.commissions.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Nombre de ventes</span><span className="font-semibold">{aff.ventes}</span></div>
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Taux de conversion</span><span className="font-semibold">{aff.taux}%</span></div>
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Profit net</span><span className="font-semibold text-primary">€{aff.profit.toLocaleString()}</span></div>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-violet-600" style={{ width: `${pct}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* COMPARAISON — ComposedChart vertical 3 séries (Revenus/Budget/ROI%) double axe */}
          <TabsContent value="comparaison" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Comparaison des Campagnes</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={campaignComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="nom" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v/1000}K`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} tickFormatter={(v) => `${v}`} domain={[0, 400]} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [name === "roi" ? `${v}%` : `€${v.toLocaleString()}`, name === "budget" ? "Budget" : name === "revenus" ? "Revenus" : "ROI %"]} />
                    <Legend formatter={(v) => v === "revenus" ? "Revenus" : v === "budget" ? "Budget" : "ROI %"} />
                    <Bar yAxisId="left" dataKey="revenus" fill="#10b981" radius={[4,4,0,0]} name="revenus" />
                    <Bar yAxisId="left" dataKey="budget" fill="#ef4444" radius={[4,4,0,0]} name="budget" />
                    <Bar yAxisId="right" dataKey="roi" fill="#f59e0b" radius={[4,4,0,0]} name="roi" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Détail par campagne</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-pink-50 to-rose-50">
                        <TableHead>Campagne</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Revenus</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>Engagement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignComparison.map((camp) => (
                        <TableRow key={camp.nom} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-semibold">{camp.nom}</TableCell>
                          <TableCell>€{camp.budget.toLocaleString()}</TableCell>
                          <TableCell className="text-green-600 font-semibold">€{camp.revenus.toLocaleString()}</TableCell>
                          <TableCell><Badge className="bg-primary/10 text-primary border-primary/20">{camp.roi}%</Badge></TableCell>
                          <TableCell>{camp.conversions.toLocaleString()}</TableCell>
                          <TableCell><Badge className={`text-white text-xs ${camp.engagement >= 8 ? 'bg-green-500' : 'bg-blue-500'}`}>{camp.engagement}%</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AnalyticsSection