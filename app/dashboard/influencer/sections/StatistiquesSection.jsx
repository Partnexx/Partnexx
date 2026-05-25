'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Users, Heart, Eye, TrendingUp, Target, Brain, Award, BarChart3, Activity, Flame, Star, CheckCircle, Clock, Lock } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { useUserLevel } from '@/lib/hook/useUserLevel'

const YoutubeIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
const InstagramIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
const TikTokIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.28 8.28 0 0 0 4.84 1.55V7.05a4.85 4.85 0 0 1-1.07-.36z"/></svg>
const ArrowUpRight = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>

const getPlatformIcon = (platform) => {
  switch (platform) {
    case 'instagram': return InstagramIcon
    case 'tiktok': return TikTokIcon
    case 'youtube': return YoutubeIcon
    default: return InstagramIcon
  }
}

const getPlatformColor = (platform) => {
  switch (platform) {
    case 'instagram': return 'from-pink-500 to-purple-600'
    case 'tiktok': return 'from-slate-700 to-slate-900'
    case 'youtube': return 'from-red-600 to-red-700'
    default: return 'from-primary to-accent'
  }
}

const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }

/* ============================================================
   COMPOSANT : Overlay de blocage (flou + cadenas + CTA)
   ============================================================ */
function LockedOverlay({ levelName, levelEmoji, pointsRequired, currentScore, gradient }) {
  const pointsMissing = Math.max(0, pointsRequired - currentScore)
  return (
    <div className="absolute inset-0 z-30 backdrop-blur-md bg-background/50 flex flex-col items-center justify-center gap-4 p-6 text-center rounded-lg">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Lock className="h-8 w-8 text-white" />
      </div>
      <div>
        <p className="text-lg font-bold mb-1">{levelEmoji} Niveau {levelName} requis</p>
        <p className="text-sm text-muted-foreground">
          Plus que <span className="font-bold text-primary">{pointsMissing} points</span> pour débloquer
        </p>
      </div>
    </div>
  )
}

export default function StatistiquesSection({ metrics, transactions, user }) {
  const router = useRouter()

  // ===== HOOK GAMIFICATION =====
  const { canAccess, isProfileComplete, profileCompletion, score: userScore, loading: levelLoading } = useUserLevel(user?.id)

  const canAccessAdvancedStats = canAccess('advancedStats')      // Argent (200 pts)
  const canAccessCompleteAnalytics = canAccess('completeAnalytics') // Or (500 pts)

  const [mounted, setMounted] = useState(false)
  const [socialAccounts, setSocialAccounts] = useState([])
  const [contentPosts, setContentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!user?.id) return
    fetchData()

    const channel = supabase
      .channel('analytics-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_accounts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_posts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  const fetchData = async () => {
    try {
      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      // BUG FIX : si pas d'influencer, on ne reste plus bloqué sur loading
      if (!influencer) {
        setSocialAccounts([])
        setContentPosts([])
        setLoading(false)
        return
      }

      const [socialRes, postsRes] = await Promise.allSettled([
        supabase.from('social_accounts').select('*').eq('influencer_id', influencer.id),
        supabase.from('content_posts').select('*').eq('influencer_id', influencer.id).order('published_at', { ascending: false }),
      ])

      setSocialAccounts(socialRes.status === 'fulfilled' ? socialRes.value.data || [] : [])
      setContentPosts(postsRes.status === 'fulfilled' ? postsRes.value.data || [] : [])
    } catch (err) {
      console.warn('StatistiquesSection fetch error', err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Stats calculées
  const totalFollowers = socialAccounts.reduce((sum, s) => sum + (s.followers_count || 0), 0)
  const avgEngagement = socialAccounts.length > 0
    ? (socialAccounts.reduce((sum, s) => sum + parseFloat(s.engagement_rate || 0), 0) / socialAccounts.length).toFixed(1)
    : '0.0'
  const totalViews = contentPosts.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalLikes = contentPosts.reduce((sum, p) => sum + (p.likes || 0), 0)
  const totalEarned = (metrics?.totalGains || 0)
  const totalEscrow = (metrics?.enEscrow || 0)

  const topPosts = [...contentPosts]
    .sort((a, b) => parseFloat(b.engagement_rate || 0) - parseFloat(a.engagement_rate || 0))
    .slice(0, 5)

  const contentByType = contentPosts.reduce((acc, p) => {
    const type = p.content_type || 'other'
    if (!acc[type]) acc[type] = { type, totalEng: 0, count: 0 }
    acc[type].totalEng += parseFloat(p.engagement_rate || 0)
    acc[type].count++
    return acc
  }, {})
  const contentPerformance = Object.values(contentByType).map(c => ({
    type: c.type.charAt(0).toUpperCase() + c.type.slice(1),
    avgEngagement: c.count > 0 ? parseFloat((c.totalEng / c.count).toFixed(1)) : 0,
  }))

  const revenueByMonth = transactions?.reduce((acc, t) => {
    const month = new Date(t.created_at).toLocaleDateString('fr-FR', { month: 'short' })
    if (!acc[month]) acc[month] = { month, revenue: 0, payments: 0 }
    if (t.status === 'released') {
      acc[month].payments += parseFloat(t.influencer_amount || 0)
      acc[month].revenue += parseFloat(t.influencer_amount || 0)
    } else if (t.status === 'in_escrow') {
      acc[month].revenue += parseFloat(t.influencer_amount || 0)
    }
    return acc
  }, {}) || {}
  const revenueData = Object.values(revenueByMonth)

  const statsCards = [
    { title: "Total Followers", value: totalFollowers > 0 ? `${(totalFollowers / 1000).toFixed(1)}K` : '0', change: '+Réel', icon: Users, gradient: "from-green-500 to-green-600", sparklineData: socialAccounts.map(s => s.followers_count || 0).concat([totalFollowers]), color: "hsl(142 76% 50%)" },
    { title: "Engagement moyen", value: `${avgEngagement}%`, change: '+Réel', icon: Heart, gradient: "from-pink-500 to-purple-600", sparklineData: socialAccounts.map(s => parseFloat(s.engagement_rate || 0)).concat([parseFloat(avgEngagement)]), color: "hsl(315 100% 60%)" },
    { title: "Vues totales", value: totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}K` : '0', change: '+Réel', icon: Eye, gradient: "from-blue-500 to-blue-600", sparklineData: contentPosts.slice(0, 9).map(p => p.views || 0), color: "hsl(217 91% 60%)" },
    { title: "Revenus totaux", value: `${totalEarned.toFixed(0)}€`, change: '+Réel', icon: DollarSign, gradient: "from-yellow-500 to-orange-500", sparklineData: transactions?.slice(0, 9).map(t => parseFloat(t.influencer_amount || 0)) || [0], color: "hsl(38 92% 60%)" },
  ]

  const engScore = Math.min(parseFloat(avgEngagement) * 10, 100)
  const followScore = Math.min((totalFollowers / 1000), 100)
  const contentScore = Math.min(contentPosts.length * 10, 100)
  const globalScore = Math.round((engScore + followScore + contentScore) / 3)

  // ===== CAS 1 : Profil incomplet → écran de blocage complet =====
  if (!levelLoading && !isProfileComplete) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Performances Détaillées • Données Réelles Supabase • Insights Avancés</p>
        </div>

        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-700 mb-2">Analytics verrouillés</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complète ton profil à 100% pour accéder à tes statistiques et débloquer ton niveau Bronze.
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>Profil complété</span>
                <span className="text-orange-600">{profileCompletion}%</span>
              </div>
              <div className="relative h-3 bg-orange-500/10 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-1000" style={{ width: `${profileCompletion}%` }} />
              </div>
              <Button onClick={() => router.push('/dashboard/influencer?section=profil')} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold">
                <Target className="h-4 w-4 mr-2" />Compléter mon profil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Performances Détaillées • Données Réelles Supabase • Insights Avancés</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement des analytics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* ============ HERO STATS (Bronze - accessible) ============ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              const sparkData = stat.sparklineData.length > 0 ? stat.sparklineData : [0, 0]
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
                    <div className="mt-4 h-12 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={sparkData.map((v) => ({ value: v }))}>
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

          {/* Bandeau incitatif si pas encore Or */}
          {!canAccessCompleteAnalytics && (
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
              <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">
                      {!canAccessAdvancedStats
                        ? <>Débloque les <span className="text-primary">statistiques avancées</span> en passant Argent</>
                        : <>Débloque les <span className="text-primary">analytics complets</span> en passant Or</>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {!canAccessAdvancedStats
                        ? `Plus que ${Math.max(0, 200 - userScore)} points pour Argent`
                        : `Plus que ${Math.max(0, 500 - userScore)} points pour Or`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Colonne gauche */}
            <div className="lg:col-span-4 space-y-4">
              {/* Score Global - Bronze accessible */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg"><Award className="w-5 h-5 text-primary" />Score Global</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6 pb-4">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                      <circle cx="64" cy="64" r="56" stroke="url(#scoreGrad)" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - globalScore / 100)}`}
                        strokeLinecap="round" />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(142 76% 50%)" />
                          <stop offset="50%" stopColor="hsl(315 100% 60%)" />
                          <stop offset="100%" stopColor="hsl(38 92% 60%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-bold text-primary">{globalScore}</p>
                      <p className="text-xs text-muted-foreground">/ 100</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: "Engagement", value: Math.round(engScore) },
                      { label: "Followers", value: Math.round(followScore) },
                      { label: "Contenus", value: Math.round(contentScore) }
                    ].map(({ label, value }) => (
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

              {/* ====== Plateformes & Top Posts (Argent + Or) ====== */}
              <Card className="border-2 relative">
                {/* Lock overlay si pas Argent (pour les plateformes) */}
                {!canAccessAdvancedStats && (
                  <LockedOverlay
                    levelName="Argent"
                    levelEmoji="🥈"
                    pointsRequired={200}
                    currentScore={userScore}
                    gradient="from-slate-400 to-slate-600"
                  />
                )}
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
                      {socialAccounts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Aucun compte social connecté</p>
                      ) : (
                        socialAccounts.map((account, index) => {
                          const Icon = getPlatformIcon(account.platform)
                          const color = getPlatformColor(account.platform)
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm capitalize">{account.platform}</p>
                                <p className="text-xs text-muted-foreground">{(account.followers_count || 0).toLocaleString()} followers</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                                  {parseFloat(account.engagement_rate || 0).toFixed(1)}%
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-0.5">{account.handle || ''}</p>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="posts" className="mt-0">
                    <CardContent className="pb-4 space-y-2">
                      {topPosts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Aucun contenu publié</p>
                      ) : (
                        topPosts.map((post, index) => (
                          <div key={post.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all cursor-pointer group">
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">#{index + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs truncate group-hover:text-primary transition-colors">
                                  {post.caption?.slice(0, 40) || 'Sans titre'}...
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs px-1.5 py-0 capitalize">{post.platform}</Badge>
                                  <span className="text-xs text-muted-foreground capitalize">{post.content_type}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1"><Heart className="w-3 h-3" />{(post.likes || 0).toLocaleString()}</div>
                                  <div className="flex items-center gap-1"><Eye className="w-3 h-3" />{(post.views || 0).toLocaleString()}</div>
                                  <div className="flex items-center gap-1 text-green-600"><TrendingUp className="w-3 h-3" />{parseFloat(post.engagement_rate || 0).toFixed(1)}%</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Colonne droite : onglets Contenu / Revenus / Plateformes (Or) */}
            <div className="lg:col-span-8 relative">
              {/* Lock overlay si pas Or (pour les onglets analytics complets) */}
              {!canAccessCompleteAnalytics && (
                <LockedOverlay
                  levelName="Or"
                  levelEmoji="🥇"
                  pointsRequired={500}
                  currentScore={userScore}
                  gradient="from-yellow-400 to-amber-500"
                />
              )}

              <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0 h-auto">
                  {[
                    { value: "content", label: "Contenu", icon: BarChart3, color: "from-purple-500 to-purple-600" },
                    { value: "revenue", label: "Revenus", icon: DollarSign, color: "from-green-500 to-green-600" },
                    { value: "platforms", label: "Plateformes", icon: Target, color: "from-orange-500 to-orange-600" },
                  ].map(({ value, label, icon: Icon, color }) => (
                    <TabsTrigger key={value} value={value} className={`rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:${color} data-[state=active]:text-white data-[state=active]:shadow-lg bg-card border-2 border-border/50 transition-all`}>
                      <div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="font-semibold">{label}</span></div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Contenu */}
                <TabsContent value="content">
                  <Card className="border-2">
                    <CardHeader><CardTitle>Performance par Type de Contenu</CardTitle></CardHeader>
                    <CardContent>
                      {contentPerformance.length === 0 ? (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                          Aucun contenu publié pour l&apos;instant
                        </div>
                      ) : (
                        <div className="h-[400px] min-w-0">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={contentPerformance}>
                              <defs>
                                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="hsl(262 80% 50%)" /><stop offset="100%" stopColor="hsl(315 100% 60%)" />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${v}%`} />
                              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Engagement']} />
                              <Bar dataKey="avgEngagement" fill="url(#bGrad)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {contentPosts.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{contentPosts.length}</p>
                            <p className="text-xs text-muted-foreground">Posts publiés</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-pink-600">{totalLikes.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Likes totaux</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{avgEngagement}%</p>
                            <p className="text-xs text-muted-foreground">Engagement moyen</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Revenus */}
                <TabsContent value="revenue" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: CheckCircle, label: "Encaissé", value: `${totalEarned.toFixed(0)}€`, sub: "Revenus libérés", color: "green" },
                      { icon: Clock, label: "En escrow", value: `${totalEscrow.toFixed(0)}€`, sub: "En attente", color: "orange" },
                      { icon: TrendingUp, label: "Total contrats", value: `${(totalEarned + totalEscrow).toFixed(0)}€`, sub: "Valeur totale", color: "blue" },
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
                      {revenueData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          Aucune transaction pour l&apos;instant
                        </div>
                      ) : (
                        <div className="h-[300px] min-w-0">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${v}€`} />
                              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}€`]} />
                              <Area type="monotone" dataKey="revenue" stroke="hsl(38 92% 60%)" fill="url(#rGrad)" strokeWidth={3} name="Revenus" />
                              <Area type="monotone" dataKey="payments" stroke="hsl(142 76% 50%)" fill="url(#pGrad)" strokeWidth={3} name="Encaissé" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Plateformes */}
                <TabsContent value="platforms">
                  {socialAccounts.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Aucun compte social</h3>
                        <p className="text-sm text-muted-foreground">Connectez vos comptes sociaux pour voir vos stats</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {socialAccounts.map((account, index) => {
                        const Icon = getPlatformIcon(account.platform)
                        const color = getPlatformColor(account.platform)
                        const perfScore = Math.min(Math.round(parseFloat(account.engagement_rate || 0) * 10), 100)
                        return (
                          <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 group">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div className={`p-4 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                  {parseFloat(account.engagement_rate || 0).toFixed(1)}% eng.
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <p className="text-2xl font-bold capitalize">{account.platform}</p>
                                <p className="text-3xl font-bold text-primary mt-1">
                                  {(account.followers_count || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">followers</p>
                              </div>
                              <div className="space-y-2 text-sm">
                                {[
                                  { label: "Engagement", value: `${parseFloat(account.engagement_rate || 0).toFixed(1)}%` },
                                  { label: "Vues moyennes", value: (account.avg_views || 0).toLocaleString() },
                                  { label: "Likes moyens", value: (account.avg_likes || 0).toLocaleString() },
                                  { label: "Commentaires moy.", value: (account.avg_comments || 0).toLocaleString() },
                                ].map(({ label, value }) => (
                                  <div key={label} className="flex justify-between">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-semibold">{value}</span>
                                  </div>
                                ))}
                              </div>
                              {account.handle && (
                                <div className="pt-2 border-t">
                                  <p className="text-xs text-muted-foreground">Handle</p>
                                  <p className="text-sm font-medium">{account.handle}</p>
                                </div>
                              )}
                              <div className="pt-2 border-t">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Performance</span>
                                  <span className="text-sm font-semibold">{perfScore}/100</span>
                                </div>
                                <Progress value={perfScore} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
