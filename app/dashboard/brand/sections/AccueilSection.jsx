'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3, Users, Rocket, Plus, TrendingUp, Brain,
  Target, Clock, DollarSign, UserPlus, FileText, Award,
  Sparkles, AlertTriangle, Lightbulb, Shield,
  Globe, Heart, Download, PlayCircle, BookOpen, Bell
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'

const Atom = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>
const Orbit = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="1"/></svg>

const performanceData = [
  { name: "Lun", vues: 12000, engagement: 2400 },
  { name: "Mar", vues: 21000, engagement: 3200 },
  { name: "Mer", vues: 18000, engagement: 2800 },
  { name: "Jeu", vues: 26000, engagement: 3600 },
  { name: "Ven", vues: 30000, engagement: 4200 },
  { name: "Sam", vues: 28000, engagement: 3800 },
  { name: "Dim", vues: 20000, engagement: 3200 },
]

const aiInsights = [
  { id: 1, title: "Opportunité détectée", description: "Micro-influenceurs beauté : +67% d'engagement vs macro-influenceurs ce mois", priority: "high", action: "Ajuster stratégie", icon: Lightbulb, color: "emerald" },
  { id: 2, title: "Timing optimal identifié", description: "Publications TikTok : 18h-20h génèrent +89% d'engagement", priority: "medium", action: "Programmer contenus", icon: Clock, color: "blue" },
  { id: 3, title: "Tendance émergente", description: "Hashtag #EcoBeauty prédit +340% de croissance sous 15 jours", priority: "high", action: "Créer campagne", icon: TrendingUp, color: "purple" },
  { id: 4, title: "Surveillance concurrence", description: "Concurrent lance campagne similaire - impact potentiel -15%", priority: "medium", action: "Analyser", icon: Shield, color: "orange" },
]

const marketingNews = [
  { id: 1, title: "L'IA révolutionne le marketing d'influence", summary: "Les outils d'automatisation augmentent l'efficacité des campagnes de 67%", time: "Il y a 2h", category: "Innovation", image: "🤖", priority: "high" },
  { id: 2, title: "Micro-influenceurs : la tendance qui domine 2025", summary: "Les créateurs 10K-100K followers génèrent 3x plus d'engagement", time: "Il y a 4h", category: "Stratégie", image: "📈", priority: "medium" },
  { id: 3, title: "Nouvelles obligations RGPD pour l'influence marketing", summary: "Guide complet des nouvelles règles européennes pour les partenariats payés", time: "Il y a 1j", category: "Conformité", image: "⚖️", priority: "high" },
  { id: 4, title: "TikTok Shop explose : +340% de conversions", summary: "Les fonctionnalités e-commerce natives transforment l'influence marketing", time: "Il y a 2j", category: "E-commerce", image: "🛍️", priority: "medium" },
]

const platformData = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'TikTok', value: 30, color: '#666' },
  { name: 'YouTube', value: 15, color: '#FF0000' },
  { name: 'LinkedIn', value: 10, color: '#0077B5' },
]

const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }

export default function AccueilSection({ user, profile, setActiveSection }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [brandData, setBrandData] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [applications, setApplications] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!user?.id) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (brand) setBrandData(brand)

    const [campRes, appRes, convRes] = await Promise.allSettled([
      supabase.from('campaigns').select('id, title, status, budget_total').eq('brand_id', brand?.id),
      supabase.from('applications').select('*').eq('brand_id', brand?.id).order('applied_at', { ascending: false }).limit(10),
      supabase.from('conversations').select('*').eq('brand_id', brand?.id).order('last_message_at', { ascending: false }).limit(5),
    ])

    setCampaigns(campRes.status === 'fulfilled' ? campRes.value.data || [] : [])
    setApplications(appRes.status === 'fulfilled' ? appRes.value.data || [] : [])
    setConversations(convRes.status === 'fulfilled' ? convRes.value.data || [] : [])
    setLoading(false)
  }

  const currentHour = currentTime.getHours()
  const greeting = currentHour < 12 ? "Bonjour" : currentHour < 18 ? "Bon après-midi" : "Bonsoir"
  const companyName = brandData?.company_name || profile?.full_name || 'vous'
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalBudget = campaigns.reduce((sum, c) => sum + parseFloat(c.budget_total || 0), 0)
  const pendingApplications = applications.filter(a => a.status === 'pending').length
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.brand_unread || 0), 0)

  const kpis = [
    { label: "Budget total", value: `${totalBudget.toLocaleString()}€`, icon: DollarSign, gradient: "from-yellow-50 to-orange-50", growth: "Réel", description: "Budget campagnes" },
    { label: "Campagnes actives", value: activeCampaigns, icon: Rocket, gradient: "from-purple-50 to-pink-50", growth: "Réel", description: "En cours" },
    { label: "Candidatures", value: applications.length, icon: Users, gradient: "from-emerald-50 to-teal-50", growth: `${pendingApplications} en attente`, description: "Total reçues" },
    { label: "Messages non lus", value: unreadMessages, icon: Heart, gradient: "from-amber-50 to-yellow-50", growth: "Réel", description: "À traiter" },
    { label: "Total campagnes", value: campaigns.length, icon: Target, gradient: "from-blue-50 to-indigo-50", growth: "Réel", description: "Toutes campagnes" },
    { label: "Conversations", value: conversations.length, icon: BarChart3, gradient: "from-violet-50 to-purple-50", growth: "Actives", description: "Avec influenceurs" },
  ]

  return (
    <div className="space-y-6">
      {/* HERO */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-accent to-primary/80 shadow-2xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <CardHeader className="pb-4 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-black text-white">{greeting}, {companyName} !</h1>
                <Atom className="h-6 w-6 text-white/80 animate-pulse" />
              </div>
              <p className="text-lg text-white/95 font-semibold">
                🚀 {activeCampaigns} campagne{activeCampaigns > 1 ? 's' : ''} active{activeCampaigns > 1 ? 's' : ''} • {applications.length} candidature{applications.length > 1 ? 's' : ''} reçue{applications.length > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 text-white/90">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">IA analysant 24/7 • {pendingApplications} candidature{pendingApplications > 1 ? 's' : ''} en attente</span>
              </div>
            </div>
            <div className="text-center lg:text-right space-y-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-white/90 font-medium mb-1">
                  {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-3xl font-black text-white">
                  {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white/80 font-medium">En ligne</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 relative space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Award className="h-4 w-4 mr-2" />{brandData?.subscription_plan || 'Gratuit'}
            </Badge>
            <Badge className="bg-emerald-500/20 text-white border-emerald-300/30 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />{brandData?.industry || 'Marque'}
            </Badge>
            {pendingApplications > 0 && (
              <Badge className="bg-orange-500/20 text-white border-orange-300/30 px-4 py-2">
                <Bell className="h-4 w-4 mr-2" />{pendingApplications} candidature{pendingApplications > 1 ? 's' : ''} à traiter
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Button className="bg-white/15 border-white/25 text-white hover:bg-white/25 border h-auto py-3 px-4 w-full" variant="outline" onClick={() => setActiveSection('campagnes')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle campagne
            </Button>
            <Button className="bg-white/15 border-white/25 text-white hover:bg-white/25 border h-auto py-3 px-4 w-full" variant="outline" onClick={() => setActiveSection('campagnes')}>
              <Users className="h-4 w-4 mr-2" />Voir candidatures
            </Button>
            <Button className="bg-white/15 border-white/25 text-white hover:bg-white/25 border h-auto py-3 px-4 w-full" variant="outline" onClick={() => setActiveSection('messagerie')}>
              <FileText className="h-4 w-4 mr-2" />Messagerie
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map(({ label, value, icon: Icon, gradient, growth, description }) => (
          <Card key={label} className={`relative overflow-hidden border-0 bg-gradient-to-br ${gradient} hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-foreground/80">{label}</CardTitle>
                <p className="text-xs text-foreground/60">{description}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/70 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Icon className="h-6 w-6 text-foreground/70" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-3">
              <div className="text-4xl font-black tracking-tight">{value}</div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />{growth}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />Performance de la semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="vuesGradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(262 80% 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(262 80% 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="engGradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142 76% 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(142 76% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="vues" stroke="hsl(262 80% 50%)" fill="url(#vuesGradB)" strokeWidth={2} name="Vues" />
                  <Area type="monotone" dataKey="engagement" stroke="hsl(142 76% 50%)" fill="url(#engGradB)" strokeWidth={2} name="Engagement" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />Répartition plateformes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {platformData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campagnes + Activités */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" />Mes campagnes</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setActiveSection('campagnes')}>Voir tout</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <Rocket className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">Aucune campagne pour l&apos;instant</p>
                <Button size="sm" onClick={() => setActiveSection('campagnes')}><Plus className="h-4 w-4 mr-2" />Créer une campagne</Button>
              </div>
            ) : (
              campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{campaign.title}</p>
                    <p className="text-xs text-muted-foreground">{parseFloat(campaign.budget_total || 0).toLocaleString()}€ • {campaign.status}</p>
                  </div>
                  <Badge className={
                    campaign.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    campaign.status === 'completed' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                    'bg-orange-500/10 text-orange-600 border-orange-500/20'
                  }>
                    {campaign.status === 'active' ? 'Active' : campaign.status === 'completed' ? 'Terminée' : campaign.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.length === 0 && campaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Aucune activité récente</div>
            ) : (
              <>
                {applications.slice(0, 2).map(a => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-lg flex-shrink-0 bg-purple-500/10">
                      <UserPlus className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Nouvelle candidature</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(a.applied_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                ))}
                {campaigns.slice(0, 2).map(c => (
                  <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-lg flex-shrink-0 bg-emerald-500/10">
                      <Rocket className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{parseFloat(c.budget_total || 0).toLocaleString()}€ • {c.status}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* IA Insights */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 rounded-lg"><Brain className="h-5 w-5 text-purple-600" /></div>
            Intelligence & Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight) => {
              const Icon = insight.icon
              return (
                <div key={insight.id} className={`p-4 rounded-xl border-2 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer ${
                  insight.color === 'emerald' ? 'bg-emerald-50/50 border-emerald-200' :
                  insight.color === 'blue' ? 'bg-blue-50/50 border-blue-200' :
                  insight.color === 'purple' ? 'bg-purple-50/50 border-purple-200' :
                  'bg-orange-50/50 border-orange-200'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      insight.color === 'emerald' ? 'bg-emerald-500/10' :
                      insight.color === 'blue' ? 'bg-blue-500/10' :
                      insight.color === 'purple' ? 'bg-purple-500/10' : 'bg-orange-500/10'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        insight.color === 'emerald' ? 'text-emerald-600' :
                        insight.color === 'blue' ? 'text-blue-600' :
                        insight.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <Badge variant="outline" className={`text-xs ${insight.priority === 'high' ? 'border-red-300 text-red-600' : 'border-orange-300 text-orange-600'}`}>
                          {insight.priority === 'high' ? 'Urgent' : 'Moyen'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" variant="outline" onClick={() => toast.info(insight.action)}>
                    {insight.action}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actualités + Ressources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-emerald-100 rounded-lg"><Globe className="h-5 w-5 text-emerald-600" /></div>
              Actualités Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketingNews.map((news) => (
              <article key={news.id} className="p-4 bg-muted/30 rounded-xl border hover:shadow-lg transition-all hover:bg-muted/50 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{news.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{news.category}</Badge>
                      {news.priority === 'high' && <Badge className="bg-red-100 text-red-600 border-red-200 text-xs">Urgent</Badge>}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2">{news.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                    <p className="text-xs text-muted-foreground mt-1">{news.time}</p>
                  </div>
                </div>
              </article>
            ))}
            <Button variant="outline" className="w-full" onClick={() => toast.info("Newsletter — disponible prochainement")}>
              <Bell className="h-4 w-4 mr-2" />S&apos;abonner à la newsletter
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg"><BookOpen className="h-5 w-5 text-blue-600" /></div>
              Ressources & Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: "📊", title: "Guide Analytics 2025", desc: "Template complet d'analyse de performance", color: "from-blue-500 to-blue-600", action: "Télécharger", icon2: Download },
              { icon: "🎯", title: "Contrats Type", desc: "Modèles juridiques pour influenceurs", color: "from-purple-500 to-purple-600", action: "Accéder", icon2: FileText },
              { icon: "🎓", title: "Formation IA Marketing", desc: "5 modules pour maîtriser l'IA", color: "from-emerald-500 to-emerald-600", action: "Commencer", icon2: PlayCircle },
            ].map((resource) => {
              const Icon2 = resource.icon2
              return (
                <div key={resource.title} className="p-4 bg-muted/30 rounded-xl border hover:shadow-lg transition-all cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{resource.icon}</div>
                    <div>
                      <h4 className="font-semibold text-sm">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground">{resource.desc}</p>
                    </div>
                  </div>
                  <Button size="sm" className={`w-full bg-gradient-to-r ${resource.color} text-white`} onClick={() => toast.info(`${resource.title} — disponible prochainement`)}>
                    <Icon2 className="h-3 w-3 mr-1" />{resource.action}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Nouveautés */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Nouveautés Partnexx</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Brain, gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", badge: "Nouveau", badgeColor: "bg-purple-100 text-purple-700", title: "IA Matchmaking", desc: "127+ critères analysés pour recommander les influenceurs parfaits", emoji: "🤖" },
            { icon: DollarSign, gradient: "from-emerald-500 to-teal-500", bg: "from-emerald-50 to-teal-50", badge: "Automatisation", badgeColor: "bg-emerald-100 text-emerald-700", title: "Paiements Intelligents", desc: "Escrow automatisé et gestion des litiges en temps réel", emoji: "💰" },
            { icon: Orbit, gradient: "from-blue-500 to-indigo-500", bg: "from-blue-50 to-indigo-50", badge: "Intelligence", badgeColor: "bg-blue-100 text-blue-700", title: "Analytics Prédictifs", desc: "Anticipez les tendances 30 jours à l'avance avec l'IA", emoji: "📈" },
            { icon: FileText, gradient: "from-orange-500 to-amber-500", bg: "from-orange-50 to-amber-50", badge: "Juridique", badgeColor: "bg-orange-100 text-orange-700", title: "Contrats Intelligents", desc: "Génération et signature automatique conformes RGPD", emoji: "📄" },
          ].map(({ icon: Icon, gradient, bg, badge, badgeColor, title, desc, emoji }) => (
            <Card key={title} className={`border-0 shadow-lg bg-gradient-to-br ${bg} hover:shadow-xl hover:scale-105 transition-all duration-300 group`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Badge className={`${badgeColor} mb-2`}>{badge}</Badge>
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <div className="text-3xl opacity-40 group-hover:opacity-60 transition-opacity">{emoji}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}