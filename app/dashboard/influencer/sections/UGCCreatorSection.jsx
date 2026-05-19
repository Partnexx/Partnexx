'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Upload, Camera, Video, Plus, Heart, MessageCircle,
  Bookmark, Share2, Play, Edit, Trash2, Eye, TrendingUp,
  Users, Star, Search, Filter, List, Clock, Flame, Award,
  Zap, Calendar, Target, BarChart3, DollarSign, Crown,
  Palette, Bot, CheckCircle, Hash, Globe, Send,
  FileText, Layers, Settings, Download, ExternalLink,
  MonitorPlay, Mic, Sliders, PieChart, Copy,
} from 'lucide-react'
import { toast } from 'sonner'

// Icônes SVG inline manquantes dans lucide v1.16
const Sparkles = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/></svg>
const Wand2 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 4-1 1"/><path d="m4 15 1-1"/><path d="m8.5 8.5-5 13 13-5-8-8Z"/><path d="m12 12 4.5 4.5"/></svg>
const Grid3X3 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
const PlusCircle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
const Rocket = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const Clock4 = Clock
const Image = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
const Lightbulb = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
const MousePointer2 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>
const Shuffle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>

// Toggle simple (remplace shadcn Switch)
const Switch = ({ defaultChecked }) => {
  const [on, setOn] = useState(defaultChecked ?? false)
  return (
    <button onClick={() => setOn(!on)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

// ─── Données ───────────────────────────────────────────────────────────────────

const creatorStats = {
  totalViews: 2847329,
  totalRevenue: 12450,
  avgEngagement: 4.8,
  totalFollowers: 45600,
  rating: 4.9,
  completedCampaigns: 23,
  activeCollaborations: 5,
  portfolioScore: 92,
}

const myContents = [
  { id: "1", title: "Unboxing Skincare Routine", category: "Beauté", format: "video", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop", likes: 245, comments: 18, saves: 67, views: 1240, shares: 23, engagementRate: 4.2, revenue: 450, createdAt: "Il y a 2 jours", isOwn: true, status: "published", brand: "SkinCare Pro", analytics: { impressions: 2400, reach: 1890, ctr: 5.2, avgWatchTime: 45 }, tags: ["skincare", "routine", "beauty"] },
  { id: "2", title: "Morning Coffee Lifestyle", category: "Lifestyle", format: "carousel", thumbnail: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=700&fit=crop", likes: 189, comments: 12, saves: 43, views: 892, shares: 15, engagementRate: 3.8, revenue: 320, createdAt: "Il y a 5 jours", isOwn: true, status: "published", brand: "Coffee Culture", tags: ["coffee", "morning", "lifestyle"] },
  { id: "new_draft", title: "Tech Review - Draft", category: "Technologie", format: "video", thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=600&fit=crop", likes: 0, comments: 0, saves: 0, views: 0, shares: 0, engagementRate: 0, createdAt: "Il y a 1 heure", isOwn: true, status: "draft", tags: ["tech", "review"] },
]

const communityContents = [
  { id: "3", title: "Unboxing iPhone 15 Pro Max", category: "Technologie", format: "video", thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=600&fit=crop", likes: 1567, comments: 234, saves: 423, views: 12890, shares: 89, engagementRate: 8.2, revenue: 1200, createdAt: "Il y a 2 heures", status: "published", brand: "Apple", creator: { name: "TechReviewer", avatar: "TR", followers: 45600, verified: true, rating: 4.8 }, tags: ["iphone", "tech", "unboxing"] },
  { id: "4", title: "Morning Skincare Routine", category: "Beauté", format: "video", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop", likes: 2134, comments: 89, saves: 567, views: 8934, shares: 156, engagementRate: 7.5, revenue: 890, createdAt: "Il y a 5 heures", status: "published", brand: "Sephora", creator: { name: "BeautyGuru", avatar: "BG", followers: 78200, verified: true, rating: 4.9 }, tags: ["skincare", "morning", "beauty"] },
  { id: "5", title: "Coffee Shop Aesthetic", category: "Lifestyle", format: "photo", thumbnail: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=700&fit=crop", likes: 892, comments: 45, saves: 234, views: 3456, shares: 67, engagementRate: 5.4, revenue: 340, createdAt: "Il y a 8 heures", status: "published", brand: "Starbucks", creator: { name: "CafeCulture", avatar: "CC", followers: 23400, verified: false, rating: 4.6 }, tags: ["coffee", "aesthetic", "lifestyle"] },
  { id: "6", title: "Workout GRWM", category: "Fitness", format: "carousel", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop", likes: 1245, comments: 67, saves: 345, views: 5678, shares: 78, engagementRate: 6.2, revenue: 560, createdAt: "Il y a 12 heures", status: "published", brand: "Nike", creator: { name: "FitLifestyle", avatar: "FL", followers: 34500, verified: true, rating: 4.7 }, tags: ["workout", "fitness", "nike"] },
  { id: "7", title: "Fashion Haul Printemps", category: "Mode", format: "video", thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop", likes: 1876, comments: 123, saves: 456, views: 9876, shares: 234, engagementRate: 7.8, revenue: 980, createdAt: "Il y a 1 jour", status: "published", brand: "Zara", creator: { name: "StyleIcon", avatar: "SI", followers: 56700, verified: true, rating: 4.9 }, tags: ["fashion", "haul", "spring"] },
  { id: "8", title: "Home Decor DIY", category: "Maison", format: "carousel", thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop", likes: 756, comments: 34, saves: 189, views: 2345, shares: 45, engagementRate: 4.9, revenue: 280, createdAt: "Il y a 1 jour", status: "published", brand: "IKEA", creator: { name: "HomeDesigner", avatar: "HD", followers: 19800, verified: false, rating: 4.5 }, tags: ["home", "diy", "decor"] },
  { id: "9", title: "Healthy Recipe Tutorial", category: "Food", format: "video", thumbnail: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop", likes: 1456, comments: 78, saves: 312, views: 6789, shares: 89, engagementRate: 6.8, revenue: 450, createdAt: "Il y a 2 jours", status: "published", brand: "Healthy Choice", creator: { name: "HealthyChef", avatar: "HC", followers: 41200, verified: true, rating: 4.8 }, tags: ["healthy", "recipe", "food"] },
  { id: "10", title: "Gaming Setup Tour", category: "Gaming", format: "photo", thumbnail: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=500&fit=crop", likes: 2345, comments: 156, saves: 678, views: 15634, shares: 203, engagementRate: 8.5, revenue: 750, createdAt: "Il y a 3 jours", status: "published", brand: "Razer", creator: { name: "ProGamer", avatar: "PG", followers: 89300, verified: true, rating: 4.9 }, tags: ["gaming", "setup", "tech"] },
  { id: "11", title: "Makeup Transformation", category: "Beauté", format: "reel", thumbnail: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=600&fit=crop", likes: 3456, comments: 245, saves: 892, views: 23400, shares: 456, engagementRate: 9.2, revenue: 1200, createdAt: "Il y a 4 heures", status: "published", brand: "Urban Decay", creator: { name: "MakeupArtist", avatar: "MA", followers: 125000, verified: true, rating: 4.9 }, tags: ["makeup", "transformation", "beauty"] },
  { id: "12", title: "Travel Vlog Paris", category: "Voyage", format: "video", thumbnail: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop", likes: 1890, comments: 134, saves: 567, views: 12450, shares: 189, engagementRate: 7.3, revenue: 680, createdAt: "Il y a 6 heures", status: "published", brand: "Airbnb", creator: { name: "TravelBlogger", avatar: "TB", followers: 67800, verified: true, rating: 4.7 }, tags: ["travel", "paris", "vlog"] },
  { id: "13", title: "Streetwear Outfit Ideas", category: "Mode", format: "carousel", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop", likes: 2156, comments: 89, saves: 723, views: 8900, shares: 145, engagementRate: 8.1, revenue: 520, createdAt: "Il y a 8 heures", status: "published", brand: "Supreme", creator: { name: "StreetStyle", avatar: "SS", followers: 54300, verified: false, rating: 4.6 }, tags: ["streetwear", "fashion", "style"] },
  { id: "14", title: "Plant Care Tips", category: "Lifestyle", format: "story", thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=700&fit=crop", likes: 678, comments: 45, saves: 234, views: 3400, shares: 67, engagementRate: 5.9, revenue: 180, createdAt: "Il y a 10 heures", status: "published", brand: "Plant Parent Co", creator: { name: "PlantMom", avatar: "PM", followers: 28900, verified: false, rating: 4.4 }, tags: ["plants", "care", "lifestyle"] },
  { id: "15", title: "Productivity Hacks 2024", category: "Lifestyle", format: "video", thumbnail: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=600&fit=crop", likes: 1234, comments: 78, saves: 456, views: 7890, shares: 123, engagementRate: 6.4, revenue: 380, createdAt: "Il y a 12 heures", status: "published", brand: "Notion", creator: { name: "ProductivityGuru", avatar: "PG", followers: 45600, verified: true, rating: 4.8 }, tags: ["productivity", "hacks", "tips"] },
]

const trendingCreators = [
  { id: "c1", name: "MakeupArtist", username: "@makeupbymia", avatar: "MA", followers: 125000, verified: true, category: "Beauté", avgEngagement: 9.2, isFollowing: false },
  { id: "c2", name: "ProGamer", username: "@progamerxl", avatar: "PG", followers: 89300, verified: true, category: "Gaming", avgEngagement: 8.5, isFollowing: true },
  { id: "c3", name: "BeautyGuru", username: "@beautyguru", avatar: "BG", followers: 78200, verified: true, category: "Beauté", avgEngagement: 7.5, isFollowing: false },
  { id: "c4", name: "TravelBlogger", username: "@wanderlust", avatar: "TB", followers: 67800, verified: true, category: "Voyage", avgEngagement: 7.3, isFollowing: true },
  { id: "c5", name: "StyleIcon", username: "@styleicon", avatar: "SI", followers: 56700, verified: true, category: "Mode", avgEngagement: 7.8, isFollowing: false },
]

const trendingHashtags = [
  { tag: "beauty", count: 2450000, trend: "+12%" },
  { tag: "fashion", count: 1890000, trend: "+8%" },
  { tag: "lifestyle", count: 1560000, trend: "+15%" },
  { tag: "tech", count: 1340000, trend: "+22%" },
  { tag: "fitness", count: 890000, trend: "+5%" },
  { tag: "food", count: 720000, trend: "+18%" },
  { tag: "travel", count: 650000, trend: "+25%" },
  { tag: "gaming", count: 580000, trend: "+30%" },
]

const activeCampaigns = [
  { id: "camp_1", title: "Nouvelle Collection Automne", brand: "Nike", brandLogo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", description: "Créez du contenu authentique pour la nouvelle collection automne Nike. Montrez comment porter les pièces dans votre quotidien.", requirements: ["Minimum 10K followers", "Contenu lifestyle authentique", "Stories + post principal", "Mention obligatoire @nike"], budget: { min: 500, max: 1200 }, deadline: "2024-01-15", category: "Mode & Sport", status: "active", applicants: 45, selected: false },
  { id: "camp_2", title: "Tech Review Challenge", brand: "Samsung", brandLogo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop", description: "Testez et reviewez les nouveaux Galaxy S24 dans des situations réelles d'utilisation.", requirements: ["Expertise tech requise", "Vidéo longue format (3-5min)", "Tests approfondis", "Comparaisons objectives"], budget: { min: 800, max: 2000 }, deadline: "2024-01-20", category: "Technologie", status: "active", applicants: 23, selected: true },
  { id: "camp_3", title: "Beauty Routine Naturelle", brand: "The Ordinary", brandLogo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop", description: "Partagez votre routine skincare avec nos produits et expliquez les bénéfices de chaque étape.", requirements: ["Peau sensible/problématique", "Routine détaillée", "Before/After recommandé", "Tutoriel step-by-step"], budget: { min: 300, max: 800 }, deadline: "2024-01-25", category: "Beauté", status: "active", applicants: 67, selected: false },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getFormatIcon = (format) => {
  switch (format) {
    case 'video': return <Video className="h-4 w-4" />
    case 'photo': return <Camera className="h-4 w-4" />
    case 'carousel': return <Image className="h-4 w-4" />
    case 'reel': return <MonitorPlay className="h-4 w-4" />
    case 'story': return <Clock className="h-4 w-4" />
    default: return <Camera className="h-4 w-4" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'published': return 'text-green-600 bg-green-50 border-green-200'
    case 'draft': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'pending': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function UGCCreatorSection() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false)
  const [newContentTitle, setNewContentTitle] = useState('')
  const [newContentDescription, setNewContentDescription] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('video')
  const [selectedCategory, setSelectedCategory] = useState('')
  const fileInputRef = useRef(null)

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

  const filteredContent = myContents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                  { icon: Award, value: creatorStats.portfolioScore, label: "Score Portfolio", color: "from-emerald-400 to-teal-500", textColor: "text-emerald-600" },
                  { icon: Eye, value: `${(creatorStats.totalViews / 1000000).toFixed(1)}M`, label: "Vues totales", color: "from-blue-400 to-indigo-500", textColor: "text-blue-600" },
                  { icon: DollarSign, value: `€${creatorStats.totalRevenue.toLocaleString()}`, label: "Revenus totaux", color: "from-yellow-400 to-orange-500", textColor: "text-yellow-600" },
                  { icon: Star, value: `${creatorStats.rating}/5`, label: "Rating moyen", color: "from-pink-400 to-rose-500", textColor: "text-pink-600" },
                ].map(({ icon: Icon, value, label, color, textColor }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}><Icon className="h-5 w-5 text-white" /></div>
                    <div><p className={`text-2xl font-bold ${textColor}`}>{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="backdrop-blur border-white/20"><BarChart3 className="h-4 w-4 mr-2" />Analytics</Button>
                <Button variant="outline" className="backdrop-blur border-white/20"><Globe className="h-4 w-4 mr-2" />Profil Public</Button>
              </div>
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button size="sm" variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')}><Grid3X3 className="h-4 w-4" /></Button>
              <Button size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
            </div>
            <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* ─── DASHBOARD ─── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Revenus ce mois", value: "€2,450", sub: "+12% vs mois dernier", icon: DollarSign, bg: "from-violet-50 to-purple-50 border-violet-200", text: "text-violet-700", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
              { label: "Vues totales", value: "847K", sub: "+24% cette semaine", icon: Eye, bg: "from-blue-50 to-indigo-50 border-blue-200", text: "text-blue-700", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
              { label: "Campagnes actives", value: creatorStats.activeCollaborations, sub: "2 nouvelles cette semaine", icon: Target, bg: "from-emerald-50 to-teal-50 border-emerald-200", text: "text-emerald-700", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
              { label: "Score Portfolio", value: `${creatorStats.portfolioScore}/100`, sub: "Excellent niveau", icon: Award, bg: "from-orange-50 to-amber-50 border-orange-200", text: "text-orange-700", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
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
                <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-violet-500" />Campagnes Recommandées Pour Vous</CardTitle>
                <p className="text-sm text-muted-foreground">Basées sur votre profil et historique</p>
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
                            {campaign.selected && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1" />Sélectionné</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{campaign.description}</p>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{campaign.category}</Badge>
                            <span className="text-sm font-medium text-emerald-600">€{campaign.budget.min} - €{campaign.budget.max}</span>
                            <span className="text-xs text-muted-foreground">{campaign.applicants} candidats</span>
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
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" />Performance 7 jours</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Engagement moyen", value: `${creatorStats.avgEngagement}%`, color: "text-blue-600", progress: creatorStats.avgEngagement * 20 },
                  { label: "Revenus cette semaine", value: "€840", color: "text-emerald-600", progress: 75 },
                  { label: "Nouveaux followers", value: "+234", color: "text-violet-600", progress: 60 },
                ].map(({ label, value, color, progress }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className={`font-semibold ${color}`}>{value}</span></div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4"><BarChart3 className="h-4 w-4 mr-2" />Rapport détaillé</Button>
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
                  <p className="text-sm text-muted-foreground">{myContents.length} contenus • Score portfolio: {creatorStats.portfolioScore}/100</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input placeholder="Rechercher un contenu..." className="w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="revenue">Revenus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredContent.map((content) => (
              <Card key={content.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getStatusColor(content.status)} border`} variant="outline">
                        {content.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {content.status === 'draft' && <Clock className="h-3 w-3 mr-1" />}
                        {content.status}
                      </Badge>
                    </div>
                    {content.revenue && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-500 text-white border-0"><DollarSign className="h-3 w-3 mr-1" />€{content.revenue}</Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="flex items-center gap-1">{getFormatIcon(content.format)}{content.format}</Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0"><ExternalLink className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold line-clamp-2 mb-3">{content.title}</h3>
                    {content.brand && (
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">{content.brand}</Badge>
                        <Badge variant="outline" className="text-xs">{content.category}</Badge>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center"><p className="text-lg font-bold">{content.views.toLocaleString()}</p><p className="text-xs text-muted-foreground">Vues</p></div>
                      <div className="text-center"><p className="text-lg font-bold text-pink-600">{content.engagementRate}%</p><p className="text-xs text-muted-foreground">Engagement</p></div>
                      <div className="text-center"><p className="text-lg font-bold text-emerald-600">{content.likes}</p><p className="text-xs text-muted-foreground">Likes</p></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{content.createdAt}</span>
                      <Button size="sm" variant="outline">Voir Analytics</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <p className="text-muted-foreground">Créez du contenu UGC professionnel avec l&apos;aide de l&apos;IA et des outils avancés</p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all border-2 border-dashed border-muted-foreground/25 hover:border-violet-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center"><Upload className="h-8 w-8 text-violet-600" /></div>
                <h3 className="font-semibold mb-2">Upload de Fichiers</h3>
                <p className="text-sm text-muted-foreground mb-4">Importez vos photos, vidéos ou carousels existants</p>
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
                <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />Créer avec IA
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-2 border-dashed border-muted-foreground/25 hover:border-violet-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center"><Layers className="h-8 w-8 text-blue-600" /></div>
                <h3 className="font-semibold mb-2">Templates Pro</h3>
                <p className="text-sm text-muted-foreground mb-4">Utilisez nos templates optimisés pour chaque plateforme</p>
                <Button variant="outline" className="w-full"><Palette className="h-4 w-4 mr-2" />Parcourir templates</Button>
              </CardContent>
            </Card>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm font-medium">Upload en cours...</span><span className="text-sm text-muted-foreground">{uploadProgress}%</span></div>
                <Progress value={uploadProgress} />
              </CardContent>
            </Card>
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
                        <SelectItem value="video"><div className="flex items-center gap-2"><Video className="h-4 w-4" />Vidéo (Feed/Reels)</div></SelectItem>
                        <SelectItem value="photo"><div className="flex items-center gap-2"><Camera className="h-4 w-4" />Photo HD</div></SelectItem>
                        <SelectItem value="carousel"><div className="flex items-center gap-2"><Image className="h-4 w-4" />Carousel</div></SelectItem>
                        <SelectItem value="story"><div className="flex items-center gap-2"><Clock className="h-4 w-4" />Stories</div></SelectItem>
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
                        <SelectItem value="food">Food & Boisson</SelectItem>
                        <SelectItem value="travel">Voyage</SelectItem>
                        <SelectItem value="home">Maison & Déco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea placeholder="Décrivez votre contenu..." rows={4} value={newContentDescription} onChange={(e) => setNewContentDescription(e.target.value)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Hashtags</label>
                      <Button size="sm" variant="outline" onClick={generateHashtags} disabled={isGeneratingHashtags}>
                        {isGeneratingHashtags ? (
                          <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />Génération IA...</div>
                        ) : (
                          <><Wand2 className="h-3 w-3 mr-1" />Générer avec IA</>
                        )}
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
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                  <Send className="h-4 w-4 mr-2" />Publier le contenu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── COMMUNAUTÉ ─── */}
      {activeTab === 'community' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-purple-500" />Feed Communauté UGC</CardTitle>
                    <p className="text-sm text-muted-foreground">Découvrez les meilleures créations de {communityContents.length}+ créateurs</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input placeholder="Rechercher créateurs, hashtags..." className="w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Select>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="beauty">Beauté</SelectItem>
                        <SelectItem value="tech">Technologie</SelectItem>
                        <SelectItem value="fashion">Mode</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="travel">Voyage</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtres</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">Trending</p>
                <p className="text-sm text-muted-foreground">Contenus populaires</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Trending Now */}
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
                            {content.format === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-2 bg-black/50 backdrop-blur rounded-full"><Play className="h-6 w-6 text-white" /></div>
                              </div>
                            )}
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

              {/* Tous les contenus */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tous les contenus</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm"><Clock className="h-4 w-4 mr-1" />Plus récents</Button>
                      <Button variant="outline" size="sm"><TrendingUp className="h-4 w-4 mr-1" />Plus populaires</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                                {content.creator?.verified && <CheckCircle className="h-3 w-3 text-blue-400" />}
                              </div>
                            </div>
                            {content.revenue && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-emerald-500 text-white">€{content.revenue}</Badge>
                              </div>
                            )}
                            <div className="absolute bottom-3 left-3">
                              <Badge variant="secondary" className="flex items-center gap-1 text-xs">{getFormatIcon(content.format)}{content.format}</Badge>
                            </div>
                            {(content.format === 'video' || content.format === 'reel') && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-3 bg-black/50 backdrop-blur rounded-full"><Play className="h-8 w-8 text-white" /></div>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">{content.category}</Badge>
                              <div className="flex items-center gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < Math.floor(content.creator?.rating || 0) ? 'fill-current' : ''}`} />)}
                                <span className="text-xs text-muted-foreground ml-1">{content.creator?.rating}</span>
                              </div>
                            </div>
                            <h4 className="font-semibold line-clamp-2 mb-3">{content.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1"><Heart className="h-3 w-3 text-pink-500" /><span>{content.likes.toLocaleString()}</span></div>
                              <div className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /><span>{content.comments}</span></div>
                              <div className="flex items-center gap-1"><Eye className="h-3 w-3" /><span>{content.views.toLocaleString()}</span></div>
                            </div>
                            {content.tags && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {content.tags.slice(0, 3).map((tag, i) => <Badge key={i} variant="secondary" className="text-xs">#{tag}</Badge>)}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="p-2"><Heart className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" className="p-2"><MessageCircle className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" className="p-2"><Share2 className="h-4 w-4" /></Button>
                              </div>
                              <Button size="sm" variant="outline">Voir détails</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{creator.name}</p>
                          <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{creator.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{(creator.followers / 1000).toFixed(0)}K followers</span>
                          <Badge variant="outline" className="text-xs">{creator.category}</Badge>
                        </div>
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
                      <Badge variant="outline" className={`text-xs ${hashtag.trend.startsWith('+') ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}>{hashtag.trend}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-purple-500" />Stats Communauté</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center"><p className="text-2xl font-bold text-purple-600">2.5M+</p><p className="text-sm text-muted-foreground">Contenus UGC</p></div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div><p className="text-lg font-bold text-blue-600">45K+</p><p className="text-xs text-muted-foreground">Créateurs actifs</p></div>
                    <div><p className="text-lg font-bold text-emerald-600">890K+</p><p className="text-xs text-muted-foreground">Likes/jour</p></div>
                  </div>
                  <div className="text-center pt-2 border-t"><p className="text-lg font-bold text-orange-600">156</p><p className="text-xs text-muted-foreground">Pays représentés</p></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}