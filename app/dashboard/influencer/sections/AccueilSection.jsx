'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Eye, Heart, DollarSign, Users, Target, Zap, Star, Bell, Trophy, Brain, Sparkles, ChevronRight, Clock, Globe, ArrowUp, Activity } from 'lucide-react'

const performanceData = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Fév', revenue: 1398 },
  { name: 'Mar', revenue: 9800 },
  { name: 'Avr', revenue: 3908 },
  { name: 'Mai', revenue: 4800 },
  { name: 'Jun', revenue: 3800 },
  { name: 'Jul', revenue: 4300 },
]

const platformData = [
  { name: 'TikTok', value: 35, color: '#000000', followers: '850K', growth: '+12%' },
  { name: 'Instagram', value: 28, color: '#E4405F', followers: '680K', growth: '+8%' },
  { name: 'YouTube', value: 22, color: '#FF0000', followers: '530K', growth: '+15%' },
  { name: 'LinkedIn', value: 15, color: '#0077B5', followers: '365K', growth: '+5%' },
]

const podiumData = [
  { rank: 2, name: 'TechPro', score: 820, followers: '1.8M' },
  { rank: 1, name: 'Emma Beauty', score: 950, followers: '2.1M' },
  { rank: 3, name: 'Fashion', score: 785, followers: '1.5M' },
]

const newsUpdates = [
  { title: 'Nouvelle fonctionnalité IA pour optimiser vos posts', category: 'IA', time: 'Il y a 1 jour' },
  { title: 'TikTok lance son nouveau programme créateur', category: 'Platform', time: 'Il y a 2 jours' },
  { title: 'Nouvelle intégration avec Shopify disponible', category: 'Ressource', time: 'Il y a 3 jours' },
  { title: 'Tendances influence Q1 2026 publiées', category: 'Formation', time: 'Il y a 4 jours' },
]

const recentActivity = [
  { user: 'BrandX', action: 'a approuvé votre proposition', time: 'il y a 2min', type: 'approval' },
  { user: 'TechGuru', action: 'a commencé à vous suivre', time: 'il y a 5min', type: 'follow' },
  { user: 'Emma_Beauty', action: 'a commenté votre post', time: 'il y a 15min', type: 'comment' },
  { user: 'Fashion_Pro', action: 'vous a mentionné dans une story', time: 'il y a 30min', type: 'mention' },
  { user: 'SportBrand', action: 'a envoyé une nouvelle offre', time: 'il y a 1h', type: 'offer' },
]

const aiInsights = [
  { title: 'Moment optimal de publication', description: "Publiez entre 14h-16h pour +32% d'engagement", confidence: 94, impact: 'high' },
  { title: 'Hashtags tendance', description: '#TechInnovation et #LifestyleGoals performent +156%', confidence: 87, impact: 'medium' },
  { title: 'Format vidéo recommandé', description: 'Les vidéos courtes (15-30s) génèrent plus d\'engagement', confidence: 91, impact: 'high' },
]

const TABS = [
  { id: 'vue-ensemble', label: "Vue d'ensemble", icon: Activity, activeClass: 'bg-gradient-to-br from-purple-500 to-purple-700 text-white' },
  { id: 'campagnes', label: 'Campagnes & Activité', icon: Target, activeClass: 'bg-gradient-to-br from-pink-500 to-pink-700 text-white' },
  { id: 'insights', label: 'Intelligence & Insights', icon: Brain, activeClass: 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' },
  { id: 'actualites', label: 'Actualités & Ressources', icon: Globe, activeClass: 'bg-gradient-to-br from-green-500 to-green-700 text-white' },
]

export default function AccueilSection({ profile, metrics, collaborations, transactions, notifications, unreadCount, markAllAsRead }) {
  const [activeTab, setActiveTab] = useState('vue-ensemble')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [liveStats, setLiveStats] = useState({ views: 1247382, engagement: 8.7, revenue: 2450, campaigns: 3 })

  const firstName = profile?.full_name?.split(' ')[0] || 'toi'

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        views: prev.views + Math.floor(Math.random() * 50) + 10,
        engagement: Math.max(0, prev.engagement + (Math.random() - 0.5) * 0.2),
        revenue: prev.revenue + Math.floor(Math.random() * 5),
        campaigns: prev.campaigns
      }))
    }, 3000)
    return () => { clearInterval(timeInterval); clearInterval(statsInterval) }
  }, [])

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-xl p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">👋</div>
              <h1 className="text-3xl font-bold text-white">Bonjour {firstName} !</h1>
            </div>
            <p className="text-white/80 text-base mb-4">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">💎 Abonnement Premium</span>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">🏆 Score: 92</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button onClick={markAllAsRead} className="relative bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
              <Bell className="h-6 w-6 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </button>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-right">
                <div className="text-white font-bold text-lg">{liveStats.campaigns}</div>
                <div className="text-white/70 text-sm">Campagnes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-right">
                <div className="text-white font-bold text-lg">€{(liveStats.revenue / 1000).toFixed(1)}K</div>
                <div className="text-white/70 text-sm">Ce mois</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS MANUELS */}
      <div className="grid grid-cols-4 gap-3">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                isActive ? tab.activeClass + ' border-transparent shadow-lg' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* VUE D'ENSEMBLE */}
      {activeTab === 'vue-ensemble' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Podium */}
            <Card className="lg:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Créateurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {podiumData.sort((a, b) => a.rank - b.rank).map(creator => (
                  <div key={creator.rank} className={`relative rounded-2xl p-4 border-2 ${creator.rank === 1 ? 'border-yellow-400/40 bg-yellow-500/5' : creator.rank === 2 ? 'border-gray-400/30 bg-gray-400/5' : 'border-orange-400/30 bg-orange-400/5'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${creator.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : creator.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                        <span className="text-2xl font-bold text-white">{creator.rank}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{creator.name}</p>
                        <p className="text-sm text-gray-500">{creator.followers}</p>
                      </div>
                      <div className={`text-xl font-bold ${creator.rank === 1 ? 'text-yellow-500' : creator.rank === 2 ? 'text-gray-500' : 'text-orange-500'}`}>{creator.score}</div>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${creator.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : creator.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`} style={{ width: `${(creator.score / 1000) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats principales */}
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Statistiques Clés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Revenus ce mois', value: `${liveStats.revenue}€`, change: '+18.5%', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { label: 'Vues totales', value: `${(liveStats.views / 1000000).toFixed(1)}M`, change: '+12.3%', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { label: 'Engagement', value: `${liveStats.engagement.toFixed(1)}%`, change: '+0.8%', icon: Heart, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Nouveaux followers', value: '1.2K', change: '+5.2%', icon: Users, color: 'text-pink-500', bg: 'bg-pink-50' },
                  ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className={`${stat.bg} rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer`}>
                        <div className="flex items-center justify-between mb-3">
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                          <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />{stat.change}
                          </span>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Graphique */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={v => `${v}€`} />
                      <Tooltip />
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="revenue" fill="url(#purpleGrad)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Plateformes */}
                <div className="space-y-3 mt-4">
                  {platformData.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: p.color }}>{p.name[0]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-gray-500">{p.followers}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                        </div>
                      </div>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{p.growth}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* CAMPAGNES & ACTIVITÉ */}
      {activeTab === 'campagnes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-pink-500" />
                Campagnes en Cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!collaborations || collaborations.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Aucune collaboration active</div>
              ) : collaborations.slice(0, 3).map((c, i) => (
                <div key={i} className="rounded-2xl p-4 border-2 border-pink-200 bg-pink-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{c.campaigns?.title || 'Campagne'}</h4>
                      <p className="text-sm text-gray-500">{c.agreed_rate ? `${c.agreed_rate}€` : ''}</p>
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">En cours</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">65% complété</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-yellow-500" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 ${
                    activity.type === 'approval' ? 'bg-green-500' :
                    activity.type === 'follow' ? 'bg-purple-500' :
                    activity.type === 'comment' ? 'bg-pink-500' :
                    activity.type === 'mention' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    {activity.type === 'approval' ? '✓' : activity.type === 'follow' ? '👤' : activity.type === 'comment' ? '💬' : activity.type === 'mention' ? '@' : '📧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm"><span className="font-semibold">{activity.user}</span> {activity.action}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {activity.time}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* INTELLIGENCE & INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-yellow-500" />
                Insights IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div key={i} className={`rounded-2xl p-5 border-2 ${insight.impact === 'high' ? 'border-yellow-200 bg-yellow-50' : 'border-purple-200 bg-purple-50'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${insight.impact === 'high' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${insight.impact === 'high' ? 'bg-yellow-200 text-yellow-700' : 'bg-purple-200 text-purple-700'}`}>{insight.confidence}%</span>
                      </div>
                      <p className="text-sm text-gray-500">{insight.description}</p>
                    </div>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Timing Optimal', desc: "Publiez entre 14h-16h pour maximiser l'engagement", color: 'from-green-500 to-green-600', bg: 'bg-green-50 border-green-200', icon: Clock },
                { title: 'Contenu Tendance', desc: 'Focus sur les vidéos courtes et les tutoriels', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 border-purple-200', icon: TrendingUp },
                { title: 'Collaborations', desc: '3 nouvelles opportunités détectées dans votre niche', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50 border-pink-200', icon: Users },
                { title: 'Hashtags Optimaux', desc: '#TechReview #Innovation #Lifestyle pour augmenter la visibilité', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 border-yellow-200', icon: Target },
              ].map((rec, i) => {
                const Icon = rec.icon
                return (
                  <div key={i} className={`rounded-2xl p-4 border-2 ${rec.bg} hover:scale-[1.02] transition-transform cursor-pointer`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rec.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-500">{rec.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ACTUALITÉS */}
      {activeTab === 'actualites' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Actualités Partnexx
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {newsUpdates.map((news, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-green-200 bg-green-50 hover:scale-[1.01] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg flex-shrink-0">
                    {i === 0 ? '🤖' : i === 1 ? '🎵' : i === 2 ? '🛍️' : '📈'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{news.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-green-200 text-green-700 text-xs px-2 py-0.5 rounded-full">{news.category}</span>
                      <span className="text-xs text-gray-400">{news.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Nouveautés Partnexx
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Assistant IA V2.0', desc: "Nouvelles fonctionnalités d'optimisation automatique", badge: 'Nouveau', color: 'from-purple-500 to-purple-600' },
                { title: 'Sécurité Renforcée', desc: 'Protection avancée des données créateurs', badge: 'Mis à jour', color: 'from-green-500 to-emerald-600' },
                { title: 'Gaming Hub', desc: 'Nouvelle section dédiée aux créateurs gaming', badge: 'Bêta', color: 'from-yellow-500 to-orange-600' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50 hover:scale-[1.01] transition-transform cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <span className="bg-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                      </div>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}