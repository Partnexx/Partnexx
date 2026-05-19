'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Users, Heart, Eye, TrendingUp, Target, Brain, Award, BarChart3, Activity, Flame, Star, CheckCircle, Clock } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.28 8.28 0 0 0 4.84 1.55V7.05a4.85 4.85 0 0 1-1.07-.36z"/>
  </svg>
)
const ArrowUpRight = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
)

const stats = [
  { title: "Total Followers", value: "287K", change: "+12.4%", icon: Users, gradient: "from-green-500 to-green-600", sparklineData: [120,145,135,180,195,210,235,260,287], color: "hsl(142 76% 50%)" },
  { title: "Engagement", value: "7.8%", change: "+0.9%", icon: Heart, gradient: "from-pink-500 to-purple-600", sparklineData: [5.2,6.1,5.8,6.5,6.9,7.1,7.4,7.6,7.8], color: "hsl(315 100% 60%)" },
  { title: "Vues (30j)", value: "1.8M", change: "+28%", icon: Eye, gradient: "from-blue-500 to-blue-600", sparklineData: [0.8,1.0,1.1,1.3,1.4,1.5,1.6,1.7,1.8], color: "hsl(217 91% 60%)" },
  { title: "Revenus (30j)", value: "18 450€", change: "+34%", icon: DollarSign, gradient: "from-yellow-500 to-orange-500", sparklineData: [8000,10000,11500,13000,14200,15500,16800,17500,18450], color: "hsl(38 92% 60%)" },
]

const platformStats = [
  { platform: "Instagram", icon: InstagramIcon, followers: "165K", growth: "+8.2%", engagement: "7.4%", avgLikes: "12.4K", posts: 145, color: "from-pink-500 to-purple-600", score: 87 },
  { platform: "TikTok", icon: TikTokIcon, followers: "89K", growth: "+15.6%", engagement: "12.8%", avgLikes: "18.2K", posts: 67, color: "from-slate-700 to-slate-900", score: 92 },
  { platform: "YouTube", icon: YoutubeIcon, followers: "33K", growth: "+5.1%", engagement: "4.2%", avgLikes: "2.8K", posts: 28, color: "from-red-600 to-red-700", score: 78 },
]

const followersEvolution = [
  { month: "Jan", followers: 215, engagement: 6.2 },
  { month: "Fév", followers: 228, engagement: 6.5 },
  { month: "Mar", followers: 242, engagement: 6.8 },
  { month: "Avr", followers: 251, engagement: 7.1 },
  { month: "Mai", followers: 259, engagement: 7.2 },
  { month: "Jun", followers: 268, engagement: 7.5 },
  { month: "Jul", followers: 275, engagement: 7.6 },
  { month: "Aoû", followers: 280, engagement: 7.7 },
  { month: "Sep", followers: 287, engagement: 7.8 },
]

const contentPerformance = [
  { type: "Reels", avgEngagement: 12.4 },
  { type: "Carrousels", avgEngagement: 8.9 },
  { type: "Stories", avgEngagement: 6.2 },
  { type: "Posts", avgEngagement: 5.8 },
  { type: "Videos", avgEngagement: 15.2 },
]

const revenueData = [
  { month: "Jan", revenue: 12400, payments: 11200 },
  { month: "Fév", revenue: 13800, payments: 12900 },
  { month: "Mar", revenue: 15200, payments: 14100 },
  { month: "Avr", revenue: 14600, payments: 15000 },
  { month: "Mai", revenue: 16100, payments: 14800 },
  { month: "Jun", revenue: 17300, payments: 16500 },
  { month: "Jul", revenue: 16900, payments: 17100 },
  { month: "Aoû", revenue: 18100, payments: 16800 },
  { month: "Sep", revenue: 18450, payments: 17900 },
]

const topPosts = [
  { title: "Morning routine 🌅", platform: "Instagram", engagement: 16.7, reach: 180000, likes: 28500, type: "Reel" },
  { title: "POV: cette astuce", platform: "TikTok", engagement: 14.2, reach: 145000, likes: 24200, type: "Video" },
  { title: "5 tips productivité", platform: "Instagram", engagement: 12.8, reach: 89000, likes: 18900, type: "Carrousel" },
  { title: "GRWM realistic", platform: "TikTok", engagement: 11.5, reach: 76000, likes: 15600, type: "Video" },
]

const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }

export default function StatistiquesSection() {
  const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Performances Détaillées • Graphiques Interactifs • Insights Avancés</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="group relative overflow-hidden border-2 hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="default" className="gap-1 bg-green-500/10 text-green-600 border-green-500/20">
                    <ArrowUpRight className="w-3 h-3" />{stat.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className="mt-4 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.sparklineData.map((v) => ({ value: v }))}>
                      <defs>
                        <linearGradient id={`sg-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={stat.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={stat.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke={stat.color} fill={`url(#sg-${index})`} strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-2 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg"><Award className="w-5 h-5 text-primary" />Score Global</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6 pb-4">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="url(#scoreGrad)" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.86)}`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(142 76% 50%)" />
                      <stop offset="50%" stopColor="hsl(315 100% 60%)" />
                      <stop offset="100%" stopColor="hsl(38 92% 60%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-primary">86</p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[{ label: "Engagement", value: 92 }, { label: "Croissance", value: 85 }, { label: "Contenu", value: 78 }].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <Tabs defaultValue="platforms" className="w-full">
              <CardHeader className="pb-2">
                <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent p-0 h-auto">
                  <TabsTrigger value="platforms" className="rounded-2xl h-12 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-card border-2 border-transparent data-[state=active]:border-purple-500/50 transition-all">
                    <div className="flex items-center gap-2"><Star className="w-4 h-4" /><span className="text-sm font-semibold">Plateformes</span></div>
                  </TabsTrigger>
                  <TabsTrigger value="posts" className="rounded-2xl h-12 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-card border-2 border-transparent data-[state=active]:border-orange-500/50 transition-all">
                    <div className="flex items-center gap-2"><Flame className="w-4 h-4" /><span className="text-sm font-semibold">Top Posts</span></div>
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <TabsContent value="platforms" className="mt-0">
                <CardContent className="space-y-2 pb-4">
                  {platformStats.map((platform, index) => {
                    const Icon = platform.icon
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${platform.color} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{platform.platform}</p>
                          <p className="text-xs text-muted-foreground">{platform.followers} followers</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">{platform.growth}</Badge>
                          <p className="text-xs text-muted-foreground mt-0.5">Score: {platform.score}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </TabsContent>
              <TabsContent value="posts" className="mt-0">
                <CardContent className="pb-4 space-y-2">
                  {topPosts.map((post, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all cursor-pointer group">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">#{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs truncate group-hover:text-primary transition-colors">{post.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{post.platform}</Badge>
                            <span className="text-xs text-muted-foreground">{post.type}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><Heart className="w-3 h-3" />{(post.likes/1000).toFixed(1)}K</div>
                            <div className="flex items-center gap-1"><Eye className="w-3 h-3" />{(post.reach/1000).toFixed(0)}K</div>
                            <div className="flex items-center gap-1 text-green-600"><TrendingUp className="w-3 h-3" />{post.engagement}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="evolution" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent p-0 h-auto">
              {[
                { value: "evolution", label: "Évolution", icon: Activity, color: "from-blue-500 to-blue-600" },
                { value: "content", label: "Contenu", icon: BarChart3, color: "from-purple-500 to-purple-600" },
                { value: "revenue", label: "Revenus", icon: DollarSign, color: "from-green-500 to-green-600" },
                { value: "platforms", label: "Plateformes", icon: Target, color: "from-orange-500 to-orange-600" },
              ].map(({ value, label, icon: Icon, color }) => (
                <TabsTrigger key={value} value={value} className={`rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:${color} data-[state=active]:text-white data-[state=active]:shadow-lg bg-card border-2 border-border/50 transition-all`}>
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="font-semibold">{label}</span></div>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="evolution">
              <Card className="border-2">
                <CardHeader><CardTitle>Évolution des Followers & Engagement</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={followersEvolution}>
                        <defs>
                          <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(142 76% 50%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(142 76% 50%)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(315 100% 60%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(315 100% 60%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area yAxisId="left" type="monotone" dataKey="followers" stroke="hsl(142 76% 50%)" fill="url(#fGrad)" strokeWidth={3} />
                        <Area yAxisId="right" type="monotone" dataKey="engagement" stroke="hsl(315 100% 60%)" fill="url(#eGrad)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card className="border-2">
                <CardHeader><CardTitle>Performance par Type de Contenu</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contentPerformance}>
                        <defs>
                          <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(262 80% 50%)" /><stop offset="100%" stopColor="hsl(315 100% 60%)" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="avgEngagement" fill="url(#bGrad)" radius={[8,8,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: CheckCircle, label: "Encaissé", value: "17 900€", sub: "Sur 18 450€", color: "green" },
                  { icon: Clock, label: "En attente", value: "550€", sub: "3 paiements", color: "orange" },
                  { icon: TrendingUp, label: "Prévision mois", value: "22 100€", sub: "+19.8% vs actuel", color: "blue" },
                ].map(({ icon: Icon, label, value, sub, color }) => (
                  <Card key={label} className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-${color}-500/20`}><Icon className={`w-5 h-5 text-${color}-600`} /></div>
                        <span className="text-sm text-muted-foreground">{label}</span>
                      </div>
                      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="border-2">
                <CardHeader><CardTitle>Revenus & Paiements</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(38 92% 60%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(38 92% 60%)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(142 76% 50%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(142 76% 50%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(38 92% 60%)" fill="url(#rGrad)" strokeWidth={3} />
                        <Area type="monotone" dataKey="payments" stroke="hsl(142 76% 50%)" fill="url(#pGrad)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {platformStats.map((platform, index) => {
                  const Icon = platform.icon
                  return (
                    <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${platform.color} shadow-lg group-hover:scale-110 transition-transform`}><Icon className="w-6 h-6 text-white" /></div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{platform.growth}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-2xl font-bold">{platform.platform}</p>
                          <p className="text-3xl font-bold text-primary mt-1">{platform.followers}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          {[{ label: "Engagement", value: platform.engagement }, { label: "Likes moyens", value: platform.avgLikes }, { label: "Posts", value: platform.posts }].map(({ label, value }) => (
                            <div key={label} className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>
                          ))}
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Performance</span><span className="text-sm font-semibold">{platform.score}/100</span></div>
                          <Progress value={platform.score} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}