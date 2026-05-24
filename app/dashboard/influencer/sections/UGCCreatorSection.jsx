'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Upload, Camera, Video, Plus, Heart, MessageCircle,
  Bookmark, Share2, Play, Edit, Eye, TrendingUp,
  Users, Star, Filter, List, Clock, Flame, Award,
  Zap, Target, BarChart3, DollarSign, Crown,
  Palette, Bot, CheckCircle, Hash, Globe, Send,
  FileText, Layers, Settings, Download, ExternalLink,
  MonitorPlay, Sliders,
} from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

const Sparkles = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/></svg>
const Wand2 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 4-1 1"/><path d="m4 15 1-1"/><path d="m8.5 8.5-5 13 13-5-8-8Z"/><path d="m12 12 4.5 4.5"/></svg>
const Grid3X3 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
const PlusCircle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
const Rocket = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const ImageIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>

const Switch = ({ defaultChecked }) => {
  const [on, setOn] = useState(defaultChecked ?? false)
  return (
    <button onClick={() => setOn(!on)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

const communityContents = [
  { id: "3", title: "Unboxing iPhone 15 Pro Max", category: "Technologie", format: "video", thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=600&fit=crop", likes: 1567, comments: 234, saves: 423, views: 12890, shares: 89, engagementRate: 8.2, revenue: 1200, createdAt: "Il y a 2 heures", status: "published", brand: "Apple", creator: { name: "TechReviewer", avatar: "TR", followers: 45600, verified: true, rating: 4.8 }, tags: ["iphone", "tech", "unboxing"] },
  { id: "4", title: "Morning Skincare Routine", category: "Beauté", format: "video", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop", likes: 2134, comments: 89, saves: 567, views: 8934, shares: 156, engagementRate: 7.5, revenue: 890, createdAt: "Il y a 5 heures", status: "published", brand: "Sephora", creator: { name: "BeautyGuru", avatar: "BG", followers: 78200, verified: true, rating: 4.9 }, tags: ["skincare", "morning", "beauty"] },
  { id: "5", title: "Coffee Shop Aesthetic", category: "Lifestyle", format: "photo", thumbnail: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=700&fit=crop", likes: 892, comments: 45, saves: 234, views: 3456, shares: 67, engagementRate: 5.4, revenue: 340, createdAt: "Il y a 8 heures", status: "published", brand: "Starbucks", creator: { name: "CafeCulture", avatar: "CC", followers: 23400, verified: false, rating: 4.6 }, tags: ["coffee", "aesthetic", "lifestyle"] },
  { id: "6", title: "Workout GRWM", category: "Fitness", format: "carousel", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop", likes: 1245, comments: 67, saves: 345, views: 5678, shares: 78, engagementRate: 6.2, revenue: 560, createdAt: "Il y a 12 heures", status: "published", brand: "Nike", creator: { name: "FitLifestyle", avatar: "FL", followers: 34500, verified: true, rating: 4.7 }, tags: ["workout", "fitness", "nike"] },
  { id: "7", title: "Fashion Haul Printemps", category: "Mode", format: "video", thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop", likes: 1876, comments: 123, saves: 456, views: 9876, shares: 234, engagementRate: 7.8, revenue: 980, createdAt: "Il y a 1 jour", status: "published", brand: "Zara", creator: { name: "StyleIcon", avatar: "SI", followers: 56700, verified: true, rating: 4.9 }, tags: ["fashion", "haul", "spring"] },
  { id: "8", title: "Home Decor DIY", category: "Maison", format: "carousel", thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop", likes: 756, comments: 34, saves: 189, views: 2345, shares: 45, engagementRate: 4.9, revenue: 280, createdAt: "Il y a 1 jour", status: "published", brand: "IKEA", creator: { name: "HomeDesigner", avatar: "HD", followers: 19800, verified: false, rating: 4.5 }, tags: ["home", "diy", "decor"] },
]

const trendingCreators = [
  { id: "c1", name: "MakeupArtist", username: "@makeupbymia", avatar: "MA", followers: 125000, verified: true, category: "Beauté", avgEngagement: 9.2, isFollowing: false },
  { id: "c2", name: "ProGamer", username: "@progamerxl", avatar: "PG", followers: 89300, verified: true, category: "Gaming", avgEngagement: 8.5, isFollowing: true },
  { id: "c3", name: "BeautyGuru", username: "@beautyguru", avatar: "BG", followers: 78200, verified: true, category: "Beauté", avgEngagement: 7.5, isFollowing: false },
]

const trendingHashtags = [
  { tag: "beauty", count: 2450000, trend: "+12%" },
  { tag: "fashion", count: 1890000, trend: "+8%" },
  { tag: "lifestyle", count: 1560000, trend: "+15%" },
  { tag: "tech", count: 1340000, trend: "+22%" },
  { tag: "fitness", count: 890000, trend: "+5%" },
]

const activeCampaigns = [
  { id: "camp_1", title: "Nouvelle Collection Automne", brand: "Nike", brandLogo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", description: "Créez du contenu authentique pour la nouvelle collection automne Nike.", budget: { min: 500, max: 1200 }, deadline: "2024-01-15", category: "Mode & Sport", applicants: 45, selected: false },
  { id: "camp_2", title: "Tech Review Challenge", brand: "Samsung", brandLogo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop", description: "Testez et reviewez les nouveaux Galaxy S24 dans des situations réelles.", budget: { min: 800, max: 2000 }, deadline: "2024-01-20", category: "Technologie", applicants: 23, selected: true },
]

const getFormatIcon = (format) => {
  switch (format) {
    case 'video': return <Video className="h-4 w-4" />
    case 'photo': return <Camera className="h-4 w-4" />
    case 'carousel': return <ImageIcon className="h-4 w-4" />
    case 'reel': return <MonitorPlay className="h-4 w-4" />
    case 'story': return <Clock className="h-4 w-4" />
    default: return <Camera className="h-4 w-4" />
  }
}

const getPlatformColor = (platform) => {
  switch (platform) {
    case 'instagram': return 'from-pink-500 to-purple-600'
    case 'tiktok': return 'from-gray-800 to-gray-900'
    case 'youtube': return 'from-red-500 to-red-700'
    default: return 'from-primary to-accent'
  }
}

export default function UGCCreatorSection({ metrics, user }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false)
  const [newContentTitle, setNewContentTitle] = useState('')
  const [newContentDescription, setNewContentDescription] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('video')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [contentPosts, setContentPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return
    fetchContentPosts()
  }, [user])

  const fetchContentPosts = async () => {
    const { data: influencer } = await supabase
      .from('influencers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!influencer) return

    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .eq('influencer_id', influencer.id)
      .order('published_at', { ascending: false })

    if (!error && data) setContentPosts(data)
    setLoadingPosts(false)
  }

  const handleFileUpload = (files) => {
    if (!files) return
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + 10
      })
    }, 200)
  }

  const generateHashtags = () => {
    setIsGeneratingHashtags(true)
    setTimeout(() => setIsGeneratingHashtags(false), 2000)
  }

  // Stats calculées depuis les vrais posts
  const totalViews = contentPosts.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalLikes = contentPosts.reduce((sum, p) => sum + (p.likes || 0), 0)
  const avgEngagement = contentPosts.length > 0
    ? (contentPosts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / contentPosts.length).toFixed(1)
    : 0

  const filteredPosts = contentPosts.filter(p =>
    (p.caption || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.platform || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tabs = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'portfolio', icon: Grid3X3, label: 'Portfolio' },
    { id: 'create', icon: PlusCircle, label: 'Créer' },
    { id: 'community', icon: Users, label: 'Communauté' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 p-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-bl from-violet-400/30 to-pink-400/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-2xl shadow-violet-500/25">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Creator Studio Pro</h1>
                  <p className="text-lg text-muted-foreground mt-1">L&apos;outil ultime pour créateurs UGC professionnels</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Eye, value: totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}K` : '0', label: "Vues totales", color: "from-blue-400 to-indigo-500", textColor: "text-blue-600" },
                  { icon: Heart, value: totalLikes.toLocaleString(), label: "Likes totaux", color: "from-pink-400 to-rose-500", textColor: "text-pink-600" },
                  { icon: TrendingUp, value: `${avgEngagement}%`, label: "Engagement moyen", color: "from-emerald-400 to-teal-500", textColor: "text-emerald-600" },
                  { icon: DollarSign, value: `€${(metrics?.totalGains || 0).toFixed(0)}`, label: "Revenus totaux", color: "from-yellow-400 to-orange-500", textColor: "text-yellow-600" },
                ].map(({ icon: Icon, value, label, color, textColor }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}><Icon className="h-5 w-5 text-white" /></div>
                    <div><p className={`text-2xl font-bold ${textColor}`}>{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-xl shadow-violet-500/25" onClick={() => setActiveTab('create')}>
                <Plus className="h-5 w-5 mr-2" />Créer du Contenu
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-4 z-40 bg-background/80 backdrop-blur-md border rounded-2xl p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'ghost'} className={`flex items-center gap-2 transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg' : 'hover:bg-muted'}`} onClick={() => setActiveTab(tab.id)}>
                <tab.icon className="h-4 w-4" />{tab.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button size="sm" variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}><Grid3X3 className="h-4 w-4" /></Button>
            <Button size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* ─── DASHBOARD ─── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Revenus ce mois", value: `€${(metrics?.totalGains || 0).toFixed(0)}`, sub: "Données réelles", icon: DollarSign, bg: "from-violet-50 to-purple-50 border-violet-200", text: "text-violet-700", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
              { label: "Vues totales", value: totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}K` : '0', sub: `${contentPosts.length} contenus publiés`, icon: Eye, bg: "from-blue-50 to-indigo-50 border-blue-200", text: "text-blue-700", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
              { label: "Campagnes actives", value: String(metrics?.collaborationsActives || 0), sub: "En cours", icon: Target, bg: "from-emerald-50 to-teal-50 border-emerald-200", text: "text-emerald-700", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
              { label: "Engagement moyen", value: `${avgEngagement}%`, sub: "Sur vos contenus", icon: TrendingUp, bg: "from-orange-50 to-amber-50 border-orange-200", text: "text-orange-700", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
            ].map(({ label, value, sub, icon: Icon, bg, text, iconBg, iconColor }) => (
              <Card key={label} className={`p-6 bg-gradient-to-br ${bg} hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${iconColor}`}>{label}</p>
                    <p className={`text-3xl font-bold ${text}`}>{value}</p>
                    <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-emerald-500" /><span className="text-xs text-emerald-600">{sub}</span></div>
                  </div>
                  <div className={`p-3 rounded-full ${iconBg}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-violet-500" />Campagnes Recommandées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-xl border hover:shadow-md transition-all hover:border-violet-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <img src={campaign.brandLogo} alt={campaign.brand} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{campaign.title}</h3>
                            {campaign.selected && <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle className="h-3 w-3 mr-1" />Sélectionné</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{campaign.description}</p>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{campaign.category}</Badge>
                            <span className="text-sm font-medium text-emerald-600">€{campaign.budget.min} - €{campaign.budget.max}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className={campaign.selected ? "bg-emerald-500 hover:bg-emerald-600" : "bg-violet-500 hover:bg-violet-600"} disabled={campaign.selected}>
                        {campaign.selected ? "En cours" : "Postuler"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" />Performance Réelle</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Engagement moyen", value: `${avgEngagement}%`, progress: parseFloat(avgEngagement) * 10, color: "text-blue-600" },
                  { label: "Revenus reçus", value: `€${(metrics?.totalGains || 0).toFixed(0)}`, progress: 75, color: "text-emerald-600" },
                  { label: "En escrow", value: `€${(metrics?.enEscrow || 0).toFixed(0)}`, progress: 40, color: "text-orange-600" },
                ].map(({ label, value, progress, color }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className={`font-semibold ${color}`}>{value}</span></div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ─── PORTFOLIO ─── */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-yellow-500" />Mon Portfolio UGC</CardTitle>
                  <p className="text-sm text-muted-foreground">{contentPosts.length} contenus • {totalViews.toLocaleString()} vues totales</p>
                </div>
                <Input placeholder="Rechercher un contenu..." className="w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </CardHeader>
          </Card>

          {loadingPosts ? (
            <div className="text-center py-12 text-muted-foreground">Chargement des contenus...</div>
          ) : contentPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Aucun contenu</h3>
                <p className="text-sm text-muted-foreground mb-4">Créez votre premier contenu UGC</p>
                <Button onClick={() => setActiveTab('create')}><Plus className="h-4 w-4 mr-2" />Créer du contenu</Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      {post.thumbnail_url ? (
                        <img src={post.thumbnail_url} alt={post.caption || 'Contenu'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getPlatformColor(post.platform)} flex items-center justify-center`}>
                          <Camera className="h-16 w-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/50 text-white border-0 capitalize">{post.platform}</Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/50 text-white border-0 capitalize">{post.content_type}</Badge>
                      </div>
                      {post.post_url && (
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={() => window.open(post.post_url, '_blank')}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.caption || 'Aucune légende'}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center"><p className="text-lg font-bold">{(post.views || 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Vues</p></div>
                        <div className="text-center"><p className="text-lg font-bold text-pink-600">{parseFloat(post.engagement_rate || 0).toFixed(1)}%</p><p className="text-xs text-muted-foreground">Engagement</p></div>
                        <div className="text-center"><p className="text-lg font-bold text-emerald-600">{(post.likes || 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Likes</p></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.comments || 0}</div>
                        <div className="flex items-center gap-1"><Share2 className="h-3 w-3" />{post.shares || 0}</div>
                        <div className="flex items-center gap-1"><Bookmark className="h-3 w-3" />{post.saves || 0}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : 'Non publié'}</span>
                        {post.post_url && (
                          <Button size="sm" variant="outline" onClick={() => window.open(post.post_url, '_blank')}>
                            <ExternalLink className="h-3 w-3 mr-1" />Voir le post
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── CRÉER ─── */}
      {activeTab === 'create' && (
        <div className="space-y-8">
          <Card className="bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 border-violet-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600"><Wand2 className="h-5 w-5 text-white" /></div>
                Studio de Création IA
                <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">BETA</Badge>
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all border-2 border-dashed border-muted-foreground/25 hover:border-violet-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center"><Upload className="h-8 w-8 text-violet-600" /></div>
                <h3 className="font-semibold mb-2">Upload de Fichiers</h3>
                <p className="text-sm text-muted-foreground mb-4">Importez vos photos, vidéos ou carousels</p>
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />Choisir des fichiers
                </Button>
                <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center"><Bot className="h-8 w-8 text-white" /></div>
                <h3 className="font-semibold mb-2">Création IA</h3>
                <p className="text-sm text-muted-foreground mb-4">Générez du contenu avec l&apos;intelligence artificielle</p>
                <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600"><Sparkles className="h-4 w-4 mr-2" />Créer avec IA</Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all border-2 border-dashed border-muted-foreground/25 hover:border-violet-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center"><Layers className="h-8 w-8 text-blue-600" /></div>
                <h3 className="font-semibold mb-2">Templates Pro</h3>
                <p className="text-sm text-muted-foreground mb-4">Templates optimisés pour chaque plateforme</p>
                <Button variant="outline" className="w-full"><Palette className="h-4 w-4 mr-2" />Parcourir templates</Button>
              </CardContent>
            </Card>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Card><CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm font-medium">Upload en cours...</span><span className="text-sm text-muted-foreground">{uploadProgress}%</span></div>
              <Progress value={uploadProgress} />
            </CardContent></Card>
          )}

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Détails du Contenu</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Titre du contenu</label>
                    <Input placeholder="Ex: Unboxing iPhone 15 Pro..." value={newContentTitle} onChange={(e) => setNewContentTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Format</label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vidéo</SelectItem>
                        <SelectItem value="photo">Photo HD</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="story">Stories</SelectItem>
                        <SelectItem value="reel">Reel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technologie</SelectItem>
                        <SelectItem value="beauty">Beauté</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="fashion">Mode</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="travel">Voyage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description / Caption</label>
                    <Textarea placeholder="Décrivez votre contenu..." rows={4} value={newContentDescription} onChange={(e) => setNewContentDescription(e.target.value)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Hashtags</label>
                      <Button size="sm" variant="outline" onClick={generateHashtags} disabled={isGeneratingHashtags}>
                        {isGeneratingHashtags ? <><div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mr-1" />Génération...</> : <><Wand2 className="h-3 w-3 mr-1" />Générer avec IA</>}
                      </Button>
                    </div>
                    <Input placeholder="#beauty #skincare #routine..." />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Optimisation SEO automatique</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline"><FileText className="h-4 w-4 mr-2" />Enregistrer comme brouillon</Button>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600"><Send className="h-4 w-4 mr-2" />Publier le contenu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── COMMUNAUTÉ ─── */}
      {activeTab === 'community' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="h-4 w-4 text-orange-500" />Trending Maintenant</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {communityContents.slice(0, 4).map((content, i) => (
                      <Card key={content.id} className="group hover:shadow-lg transition-all">
                        <CardContent className="p-0">
                          <div className="relative aspect-video overflow-hidden rounded-t-lg">
                            <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"><Flame className="h-3 w-3 mr-1" />#{i + 1}</Badge>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <div className="flex items-center gap-2 p-1.5 bg-black/70 backdrop-blur rounded-full">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xs font-bold">{content.creator?.avatar}</div>
                                <span className="text-white text-xs font-medium">{content.creator?.name}</span>
                                {content.creator?.verified && <CheckCircle className="h-3 w-3 text-blue-400" />}
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">{content.title}</h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1"><Heart className="h-3 w-3 text-pink-500" /><span>{(content.likes / 1000).toFixed(1)}K</span></div>
                                <div className="flex items-center gap-1"><Eye className="h-3 w-3" /><span>{(content.views / 1000).toFixed(1)}K</span></div>
                              </div>
                              <span>{content.createdAt}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {communityContents.map((content) => (
                  <Card key={content.id} className="group hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-2 p-2 bg-black/50 backdrop-blur rounded-full">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-xs font-bold">{content.creator?.avatar}</div>
                            <span className="text-white text-sm font-medium">{content.creator?.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="text-xs mb-2">{content.category}</Badge>
                        <h4 className="font-semibold line-clamp-2 mb-3">{content.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><Heart className="h-3 w-3 text-pink-500" /><span>{content.likes.toLocaleString()}</span></div>
                          <div className="flex items-center gap-1"><Eye className="h-3 w-3" /><span>{content.views.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-4 w-4 text-yellow-500" />Créateurs Tendance</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {trendingCreators.map((creator, index) => (
                    <div key={creator.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">{creator.avatar}</div>
                        {creator.verified && <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-background rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{creator.name}</p>
                        <p className="text-xs text-muted-foreground">{(creator.followers / 1000).toFixed(0)}K followers</p>
                      </div>
                      <Button size="sm" variant={creator.isFollowing ? "secondary" : "default"} className="text-xs">
                        {creator.isFollowing ? "Suivi" : "Suivre"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Hash className="h-4 w-4 text-blue-500" />Hashtags Tendance</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {trendingHashtags.map((hashtag, index) => (
                    <div key={hashtag.tag} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">{index + 1}</Badge>
                        <div>
                          <p className="text-sm font-medium">#{hashtag.tag}</p>
                          <p className="text-xs text-muted-foreground">{(hashtag.count / 1000).toFixed(0)}K posts</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">{hashtag.trend}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}