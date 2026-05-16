'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Eye, Heart, DollarSign, Users, Target, Zap, Bell, Trophy, Brain, Sparkles, ChevronRight, Clock, Globe, ArrowUp, Activity, Share2, MessageCircle, Briefcase, Rocket, Shield, Bookmark, Download, PlayCircle, Lightbulb, Crown } from 'lucide-react'

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
  { rank: 2, name: 'TechPro', score: 820, followers: '1.8M', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' },
  { rank: 1, name: 'Emma Beauty', score: 950, followers: '2.1M', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face' },
  { rank: 3, name: 'Fashion', score: 785, followers: '1.5M', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=center' },
]

const campaigns = [
  { id: 1, title: 'Nike Air Max Campaign', brand: 'Nike', status: 'active', budget: '5000€', deadline: '15 Déc', progress: 75 },
  { id: 2, title: 'Samsung Galaxy Review', brand: 'Samsung', status: 'pending', budget: '3500€', deadline: '20 Déc', progress: 30 },
  { id: 3, title: 'Spotify Premium Promo', brand: 'Spotify', status: 'completed', budget: '2000€', deadline: '10 Déc', progress: 100 },
]

const recentActivity = [
  { user: 'BrandX', action: 'a approuvé votre proposition', time: 'il y a 2min', type: 'approval' },
  { user: 'TechGuru', action: 'a commencé à vous suivre', time: 'il y a 5min', type: 'follow' },
  { user: 'Emma_Beauty', action: 'a commenté votre post', time: 'il y a 15min', type: 'comment' },
  { user: 'Fashion_Pro', action: 'vous a mentionné dans une story', time: 'il y a 30min', type: 'mention' },
  { user: 'SportBrand', action: 'a envoyé une nouvelle offre', time: 'il y a 1h', type: 'offer' },
]

const aiInsights = [
  { title: 'Moment optimal de publication', description: "Publiez entre 14h-16h pour +32% d'engagement", confidence: 94, impact: 'high', type: 'timing' },
  { title: 'Hashtags tendance', description: '#TechInnovation et #LifestyleGoals performent +156%', confidence: 87, impact: 'medium', type: 'content' },
  { title: 'Format vidéo recommandé', description: 'Les vidéos courtes (15-30s) génèrent plus d\'engagement', confidence: 91, impact: 'high', type: 'format' },
]

const newsUpdates = [
  { title: 'Nouvelle fonctionnalité IA pour optimiser vos posts', category: 'IA', time: 'Il y a 1 jour', type: 'feature', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop' },
  { title: 'TikTok lance son nouveau programme créateur', category: 'Platform', time: 'Il y a 2 jours', type: 'news', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop' },
  { title: 'Guide complet : Marketing d\'influence 2024', category: 'Ressource', time: 'Il y a 3 jours', type: 'resource', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
  { title: 'Webinar : Optimiser ses campagnes avec l\'IA', category: 'Formation', time: 'Il y a 5 jours', type: 'training', image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=250&fit=crop' },
]

const TABS = [
  { id: 'vue-ensemble', label: "Vue d'ensemble", icon: Activity, color: 'from-purple-500 to-purple-700' },
  { id: 'campagnes', label: 'Campagnes & Activité', icon: Target, color: 'from-pink-500 to-pink-700' },
  { id: 'insights', label: 'Intelligence & Insights', icon: Brain, color: 'from-yellow-500 to-orange-500' },
  { id: 'actualites', label: 'Actualités & Ressources', icon: Globe, color: 'from-green-500 to-emerald-600' },
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

  const statCards = [
    { label: 'Revenus ce mois', value: `${liveStats.revenue}€`, change: '+18.5%', icon: DollarSign, color: '#f59e0b', bg: 'from-yellow-500/10 to-yellow-500/5', border: 'border-yellow-500/30' },
    { label: 'Vues totales', value: `${(liveStats.views / 1000000).toFixed(1)}M`, change: '+12.3%', icon: Eye, color: '#a855f7', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/30' },
    { label: "Taux d'engagement", value: `${liveStats.engagement.toFixed(1)}%`, change: '+0.8%', icon: Heart, color: '#22c55e', bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/30' },
    { label: 'Nouveaux followers', value: '1.2K', change: '+5.2%', icon: Users, color: '#ec4899', bg: 'from-pink-500/10 to-pink-500/5', border: 'border-pink-500/30' },
    { label: 'Campagnes actives', value: String(liveStats.campaigns), change: 'Actif', icon: Briefcase, color: '#6366f1', bg: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-500/30' },
    { label: 'Portée mensuelle', value: '3.8M', change: '+24.7%', icon: Globe, color: '#8b5cf6', bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/30' },
    { label: 'Commentaires', value: '12.4K', change: '+15.2%', icon: MessageCircle, color: '#3b82f6', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/30' },
    { label: 'Partages', value: '8.9K', change: '+32.1%', icon: Share2, color: '#f43f5e', bg: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-500/30' },
  ]

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-xl p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">👋</div>
              <h1 className="text-3xl font-bold">Bonjour {firstName} !</h1>
            </div>
            <p className="text-white/90 text-lg mb-2">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-white/80 text-base mb-4">Prêt à créer du contenu exceptionnel aujourd'hui ? 🚀</p>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">💎 Abonnement Premium</span>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">🏆 Score: 850</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button onClick={markAllAsRead} className="relative bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
              <Bell className="h-7 w-7 text-white" />
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
                isActive ? `bg-gradient-to-br ${tab.color} text-white border-transparent shadow-lg` : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
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
                  <div key={creator.rank} className={`relative rounded-2xl p-4 border-2 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${
                    creator.rank === 1 ? 'bg-gradient-to-br from-yellow-500/10 to-white border-yellow-400/40' :
                    creator.rank === 2 ? 'bg-gradient-to-br from-gray-400/10 to-white border-gray-400/30' :
                    'bg-gradient-to-br from-orange-400/10 to-white border-orange-400/30'
                  }`}>
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-6 translate-x-6 opacity-30" style={{ background: creator.rank === 1 ? '#fbbf24' : creator.rank === 2 ? '#9ca3af' : '#fb923c' }} />
                    <div className="relative flex items-center gap-3">
                      <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                        creator.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        creator.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        'bg-gradient-to-br from-orange-400 to-orange-600'
                      }`}>
                        {creator.rank === 1 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"><Crown className="h-3 w-3 text-yellow-500" /></div>}
                        <span className="text-2xl font-bold text-white">{creator.rank}</span>
                      </div>
                      <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{creator.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><Users className="h-3 w-3" />{creator.followers}</p>
                      </div>
                      <div className={`text-xl font-bold flex-shrink-0 ${creator.rank === 1 ? 'text-yellow-500' : creator.rank === 2 ? 'text-gray-500' : 'text-orange-500'}`}>{creator.score}</div>
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
                  {statCards.slice(0, 4).map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className={`bg-gradient-to-br ${stat.bg} border-2 ${stat.border} rounded-2xl p-5 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-6 translate-x-6 opacity-20" style={{ backgroundColor: stat.color }} />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: stat.color + '25' }}>
                              <Icon className="h-6 w-6" style={{ color: stat.color }} />
                            </div>
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />{stat.change}
                            </span>
                          </div>
                          <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: stat.color, opacity: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {statCards.slice(4, 8).map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className={`bg-gradient-to-br ${stat.bg} border-2 ${stat.border} rounded-2xl p-5 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-6 translate-x-6 opacity-20" style={{ backgroundColor: stat.color }} />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: stat.color + '25' }}>
                              <Icon className="h-6 w-6" style={{ color: stat.color }} />
                            </div>
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />{stat.change}
                            </span>
                          </div>
                          <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: stat.color, opacity: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Graphique */}
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={v => `${v}€`} />
                      <Tooltip formatter={(v) => [`${v}€`, 'Revenus']} />
                      <Bar dataKey="revenue" fill="url(#purpleGrad)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Plateformes */}
                <div className="space-y-3 mt-4">
                  {platformData.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer hover:scale-[1.01] transition-transform">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg" style={{ background: p.color }}>{p.name[0]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-gray-500">{p.followers} abonnés</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                          <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-bold text-lg" style={{ color: p.color }}>{p.value}%</span>
                        <div><span className="text-xs text-green-600 border border-green-200 px-1 rounded">{p.growth}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Total d'abonnés</span>
                  </div>
                  <p className="text-xl font-bold">2.4M</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique financier + Stats */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  Performance Financière Mensuelle
                </CardTitle>
                <span className="text-xs text-green-600 border border-green-200 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +{Math.round(performanceData.reduce((a, m) => a + m.revenue, 0) / performanceData.length).toLocaleString()}€/mois
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={v => `${v}€`} />
                    <Tooltip formatter={(v) => [`${v}€`, 'Revenus']} />
                    <Bar dataKey="revenue" fill="url(#revenueGrad)" radius={[8, 8, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Revenu Total', value: `${performanceData.reduce((a, m) => a + m.revenue, 0).toLocaleString()}€`, sub: 'Sur 7 mois', color: '#22c55e', icon: DollarSign },
                  { label: 'Moyenne Mensuelle', value: `${Math.round(performanceData.reduce((a, m) => a + m.revenue, 0) / performanceData.length).toLocaleString()}€`, sub: 'Par mois', color: '#a855f7', icon: TrendingUp },
                  { label: 'Meilleur Mois', value: `${Math.max(...performanceData.map(d => d.revenue)).toLocaleString()}€`, sub: 'Mars 2024', color: '#f59e0b', icon: Trophy },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="text-center p-4 rounded-xl border cursor-pointer hover:scale-[1.02] transition-transform" style={{ background: s.color + '10', borderColor: s.color + '30' }}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Icon className="h-4 w-4" style={{ color: s.color }} />
                        <p className="text-xs font-medium text-gray-500">{s.label}</p>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
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
              {campaigns.map(campaign => (
                <div key={campaign.id} className={`rounded-2xl p-5 border-2 cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden ${
                  campaign.status === 'active' ? 'bg-gradient-to-br from-pink-500/10 to-white border-pink-500/30' :
                  campaign.status === 'completed' ? 'bg-gradient-to-br from-green-500/10 to-white border-green-500/30' :
                  'bg-gradient-to-br from-orange-400/10 to-white border-orange-400/30'
                }`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-10 translate-x-10 opacity-20 ${campaign.status === 'active' ? 'bg-pink-500' : campaign.status === 'completed' ? 'bg-green-500' : 'bg-orange-400'}`} />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${campaign.status === 'active' ? 'bg-gradient-to-br from-pink-500 to-pink-600' : campaign.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{campaign.title}</h4>
                          <p className="text-sm text-gray-500">{campaign.brand}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${campaign.status === 'active' ? 'bg-pink-100 text-pink-600' : campaign.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {campaign.status === 'active' ? 'Actif' : campaign.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                        <div><p className="text-xs text-gray-400">Budget</p><p className="text-sm font-bold">{campaign.budget}</p></div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <div><p className="text-xs text-gray-400">Deadline</p><p className="text-sm font-bold">{campaign.deadline}</p></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progression</span><span className="font-bold">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-3" />
                    </div>
                  </div>
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
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl border hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden" style={{ background: activity.type === 'approval' ? '#22c55e0a' : activity.type === 'follow' ? '#a855f70a' : activity.type === 'comment' ? '#ec48990a' : activity.type === 'mention' ? '#f59e0b0a' : '#3b82f60a' }}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-lg ${
                    activity.type === 'approval' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    activity.type === 'follow' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    activity.type === 'comment' ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                    activity.type === 'mention' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                    'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {activity.type === 'approval' ? '✓' : activity.type === 'follow' ? '👤' : activity.type === 'comment' ? '💬' : activity.type === 'mention' ? '@' : '📧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm"><span className="font-semibold">{activity.user}</span> <span className="text-gray-500">{activity.action}</span></p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock className="h-3 w-3" />{activity.time}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
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
                <div key={i} className={`rounded-2xl p-5 border-2 cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden ${insight.impact === 'high' ? 'bg-gradient-to-br from-yellow-500/10 to-white border-yellow-500/30' : 'bg-gradient-to-br from-purple-500/10 to-white border-purple-500/30'}`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-8 translate-x-8 opacity-20 ${insight.impact === 'high' ? 'bg-yellow-500' : 'bg-purple-500'}`} />
                  <div className="relative flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${insight.impact === 'high' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${insight.impact === 'high' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>{insight.confidence}%</span>
                      </div>
                      <p className="text-sm text-gray-500">{insight.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Niveau de confiance</span>
                      <span>Impact {insight.impact === 'high' ? 'élevé' : 'moyen'}</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Timing Optimal', desc: "Publiez entre 14h-16h pour maximiser l'engagement", color: '#22c55e', icon: Clock },
                { title: 'Contenu Tendance', desc: 'Focus sur les vidéos courtes et les tutoriels', color: '#a855f7', icon: TrendingUp },
                { title: 'Collaborations', desc: '3 nouvelles opportunités de partenariat détectées', color: '#ec4899', icon: Users },
                { title: 'Hashtags Optimaux', desc: '#TechReview #Innovation #Lifestyle pour plus de visibilité', color: '#f59e0b', icon: Target },
              ].map((rec, i) => {
                const Icon = rec.icon
                return (
                  <div key={i} className="rounded-2xl p-5 border-2 cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden" style={{ background: rec.color + '0a', borderColor: rec.color + '40' }}>
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-8 translate-x-8 opacity-20" style={{ background: rec.color }} />
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${rec.color}, ${rec.color}99)` }}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: rec.color }}>{rec.title}</h4>
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

      {/* ACTUALITÉS & RESSOURCES */}
      {activeTab === 'actualites' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Actualités Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsUpdates.filter(n => n.type === 'news' || n.type === 'feature').map((news, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:scale-[1.01] transition-transform cursor-pointer">
                    <div className="relative h-40 overflow-hidden">
                      <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-3 left-3 text-xs bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full font-semibold">{news.category}</span>
                      <span className="absolute top-3 right-3 text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">{news.time}</span>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/5 to-white">
                      <h4 className="font-semibold mb-2">{news.title}</h4>
                      <button className="text-purple-500 text-sm font-medium flex items-center gap-1">
                        Lire plus <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-pink-500" />
                  Dernières Ressources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsUpdates.filter(n => n.type === 'resource' || n.type === 'training').map((resource, i) => (
                  <div key={i} className="rounded-2xl p-5 border-2 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-white hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -translate-y-8 translate-x-8" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg">
                            {resource.type === 'resource' ? <Download className="h-6 w-6 text-white" /> : <PlayCircle className="h-6 w-6 text-white" />}
                          </div>
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-semibold">{resource.category}</span>
                        </div>
                        <span className="text-xs text-gray-400">{resource.time}</span>
                      </div>
                      <h4 className="font-semibold mb-4">{resource.title}</h4>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="h-3 w-3" /> Télécharger
                        </button>
                        <button className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="h-3 w-3" /> Aperçu
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Rocket className="h-5 w-5 text-indigo-500" />
                Nouveautés Partnexx
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Assistant IA V2.0', desc: "Nouvelles fonctionnalités d'optimisation automatique", badge: 'Nouveau', color: '#a855f7', icon: Sparkles },
                  { title: 'Sécurité Renforcée', desc: 'Protection avancée des données créateurs', badge: 'Mis à jour', color: '#22c55e', icon: Shield },
                  { title: 'Gaming Hub', desc: 'Nouvelle section dédiée aux créateurs gaming', badge: 'Bêta', color: '#f59e0b', icon: Zap },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="rounded-2xl p-5 border-2 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden" style={{ background: item.color + '0a', borderColor: item.color + '30' }}>
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-8 translate-x-8 opacity-20" style={{ background: item.color }} />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg mb-4" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                        <span className="text-xs px-2 py-1 rounded-full border font-semibold" style={{ color: item.color, borderColor: item.color + '50', background: item.color + '15' }}>{item.badge}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}