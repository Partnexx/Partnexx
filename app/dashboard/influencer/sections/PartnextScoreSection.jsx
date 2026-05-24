'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'
import { Brain, Trophy, Star, Crown, Award, Target, Eye, Heart, TrendingUp, Clock, Users, Flame, BarChart3, Zap, Calendar, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

const Sparkles = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/></svg>
const Rocket = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const Coffee = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
const Lightbulb = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
const Diamond = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/></svg>
const Gem = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="6 3 18 3 22 9 12 22 2 9"/><path d="M11 3 8 9l4 13 4-13-3-6"/><line x1="2" x2="22" y1="9" y2="9"/></svg>
const Coins = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
const Compass = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
const Gamepad2 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
const PlayCircle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
const BookOpen = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const Gift = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>

const dailyChallenges = [
  { id: 1, title: "Maître de l'Engagement", description: "Atteindre 95% de taux d'engagement sur une story", reward: "+15 pts + Badge Viral", timeLeft: "18h 42m", progress: 78, difficulty: "Facile", icon: Eye, color: "from-green-500 to-emerald-600", participants: 1247, completions: 432 },
  { id: 2, title: "Speed Creator", description: "Créer et publier 3 contenus en moins de 2h", reward: "+25 pts + Boost IA", timeLeft: "18h 42m", progress: 33, difficulty: "Moyen", icon: Rocket, color: "from-blue-500 to-cyan-600", participants: 892, completions: 156 },
  { id: 3, title: "Influenceur du Café", description: "Obtenir 50 commentaires sur un post avant midi", reward: "+35 pts + Consultation Pro", timeLeft: "6h 15m", progress: 64, difficulty: "Difficile", icon: Coffee, color: "from-orange-500 to-red-600", participants: 523, completions: 89 },
]
const weeklyChallenges = [
  { id: 10, title: "Empereur des Conversions", description: "Maintenir 90%+ de taux de conversion sur 7 jours", reward: "+150 pts + Accès VIP Premium", timeLeft: "4j 12h", progress: 71, difficulty: "Epic", icon: Crown, color: "from-purple-500 to-indigo-600", participants: 312, completions: 45 },
  { id: 11, title: "Architecte de Communauté", description: "Recruter 10 nouveaux followers qualifiés", reward: "+100 pts + Outils Analytics Pro", timeLeft: "4j 12h", progress: 60, difficulty: "Difficile", icon: Users, color: "from-pink-500 to-rose-600", participants: 756, completions: 189 },
  { id: 12, title: "Génie Créatif", description: "Innover avec 5 formats de contenu différents", reward: "+120 pts + Mentor Personnel", timeLeft: "4j 12h", progress: 40, difficulty: "Epic", icon: Lightbulb, color: "from-yellow-500 to-orange-600", participants: 445, completions: 67 },
]
const monthlyChallenges = [
  { id: 20, title: "Légende de Partnexx", description: "Dominer le classement pendant 30 jours", reward: "+500 pts + Statut Légende + Revenue Share", timeLeft: "18j 7h", progress: 45, difficulty: "Légendaire", icon: Trophy, color: "from-yellow-400 to-red-600", participants: 50, completions: 2 },
  { id: 21, title: "Empire Builder", description: "Générer 50k€+ de revenus via la plateforme", reward: "+300 pts + Consultant Dédié + Événement Exclusif", timeLeft: "18j 7h", progress: 72, difficulty: "Epic", icon: Zap, color: "from-indigo-500 to-purple-600", participants: 128, completions: 12 },
  { id: 22, title: "Mentor Suprême", description: "Former et accompagner 5 nouveaux créateurs au succès", reward: "+250 pts + Programme Ambassador", timeLeft: "18j 7h", progress: 20, difficulty: "Epic", icon: BookOpen, color: "from-green-500 to-teal-600", participants: 89, completions: 8 },
]
const achievements = [
  { title: "Première Victoire", desc: "Complétez votre premier défi", unlocked: true, rarity: "common", icon: Target },
  { title: "Série de Feu", desc: "7 défis consécutifs réussis", unlocked: true, rarity: "rare", icon: Flame },
  { title: "Perfectionniste", desc: "100% sur 10 défis difficiles", unlocked: true, rarity: "epic", icon: Diamond },
  { title: "Maître du Temps", desc: "30 défis daily en avance", unlocked: false, rarity: "legendary", icon: Clock },
  { title: "Influenceur Suprême", desc: "Top 1% pendant 3 mois", unlocked: false, rarity: "mythique", icon: Crown },
  { title: "Pionnier IA", desc: "Premier à tester 5 nouvelles features IA", unlocked: true, rarity: "rare", icon: Brain },
]
const exclusivePerks = [
  { title: "Consultation IA Personnalisée", description: "Session 1h avec notre IA expert pour optimiser vos campagnes", cost: 150, icon: Brain, available: true, popularity: 94 },
  { title: "Accès Early Beta Features", description: "Testez les nouvelles fonctionnalités avant tout le monde", cost: 200, icon: Rocket, available: true, popularity: 89 },
  { title: "Mentor Personnel 1 Mois", description: "Accompagnement dédié par un Top 1% Partnexx", cost: 500, icon: Crown, available: false, popularity: 97, waitlist: 23 },
  { title: "Event Privé Paris", description: "Soirée networking exclusive avec les élites", cost: 300, icon: Sparkles, available: true, popularity: 92, limited: "12 places" },
]
const rarityConfig = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
  mythique: "from-pink-400 via-purple-500 to-indigo-600",
}

const getLevelFromScore = (score) => {
  if (score >= 2000) return "Légende"
  if (score >= 1500) return "Maître"
  if (score >= 1000) return "Elite"
  if (score >= 500) return "Pro"
  return "Débutant"
}

const getNextLevelScore = (score) => {
  if (score < 500) return 500
  if (score < 1000) return 1000
  if (score < 1500) return 1500
  if (score < 2000) return 2000
  return 3000
}

function ChallengeCard({ challenge, accepted, onAccept }) {
  const Icon = challenge.icon
  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-r ${challenge.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${challenge.color} shadow-lg`}><Icon className="h-6 w-6 text-white" /></div>
          <Badge variant="secondary">{challenge.difficulty}</Badge>
        </div>
        <CardTitle className="text-lg">{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground">{challenge.description}</p>
        {accepted && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span>Progression</span><span>{challenge.progress}%</span></div>
            <Progress value={challenge.progress} className="h-2" />
          </div>
        )}
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /><span className="text-sm font-medium text-primary">{challenge.reward}</span></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>⏰ {challenge.timeLeft}</span><span>👥 {challenge.participants}</span><span>✅ {challenge.completions}</span>
        </div>
        <Button onClick={() => onAccept(challenge.id)} disabled={accepted} className={`w-full text-white font-bold ${accepted ? 'bg-green-600 hover:bg-green-600' : `bg-gradient-to-r ${challenge.color}`}`}>
          {accepted ? <><Target className="h-4 w-4 mr-2" />En cours...</> : <><PlayCircle className="h-4 w-4 mr-2" />Relever le Défi</>}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PartnextScoreSection({ metrics, user }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [liveUpdates, setLiveUpdates] = useState(0)
  const [acceptedChallenges, setAcceptedChallenges] = useState(new Set())
  const [selectedChallenge, setSelectedChallenge] = useState("daily")
  const [influencerData, setInfluencerData] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    fetchInfluencerData()
    fetchLeaderboard()
  }, [user])

  const fetchInfluencerData = async () => {
    const { data } = await supabase
      .from('influencers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) setInfluencerData(data)
    setLoading(false)
  }

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('influencers')
      .select('id, display_name, ai_score, avg_rating, collaborations_count, user_id')
      .order('ai_score', { ascending: false })
      .limit(10)

    if (data) setLeaderboard(data)
  }

  const targetScore = influencerData?.ai_score || 0
  const nextLevelScore = getNextLevelScore(targetScore)
  const currentLevel = getLevelFromScore(targetScore)
  const progress = Math.min(((targetScore) / nextLevelScore) * 100, 100)

  useEffect(() => {
    const interval = setInterval(() => setLiveUpdates(prev => prev + Math.floor(Math.random() * 3)), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!targetScore) return
    const steps = 80; let current = 0
    const timer = setInterval(() => {
      current += targetScore / steps
      if (current >= targetScore) { setAnimatedScore(targetScore); clearInterval(timer) }
      else setAnimatedScore(Math.floor(current))
    }, 2000 / steps)
    return () => clearInterval(timer)
  }, [targetScore])

  const handleAccept = (id) => {
    setAcceptedChallenges(prev => new Set(prev).add(id))
    toast.success("Défi accepté ! Bonne chance 🎯")
  }

  // Trouver le rang de l'utilisateur dans le classement
  const userRank = leaderboard.findIndex(l => l.user_id === user?.id) + 1 || '?'

  const leaderboardWithUser = leaderboard.map((l, i) => ({
    rank: i + 1,
    name: l.display_name || 'Influenceur',
    score: l.ai_score || 0,
    avatar: l.display_name?.slice(0, 2).toUpperCase() || '??',
    rating: l.avg_rating || 0,
    collabs: l.collaborations_count || 0,
    isUser: l.user_id === user?.id,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du score...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Trophy className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Partnexx Score</h1>
            <p className="text-lg text-muted-foreground mt-1">
              🚀 <span className="font-bold text-primary">Niveau {currentLevel}</span> • Rang #{userRank} • +{liveUpdates} pts aujourd&apos;hui
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-card border h-14 rounded-2xl shadow-xl">
          {[
            { value: "dashboard", label: "Dashboard", icon: BarChart3 },
            { value: "challenges", label: "Défis", icon: Gamepad2 },
            { value: "leaderboard", label: "Classement", icon: Trophy },
            { value: "achievements", label: "Succès", icon: Award },
            { value: "ai-insights", label: "IA Insights", icon: Brain },
            { value: "marketplace", label: "Marketplace", icon: Gift },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold text-sm">
              <Icon className="h-4 w-4 mr-1" />{label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 border-primary/30 shadow-2xl">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="text-8xl font-black bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {animatedScore.toLocaleString()}
                  </div>
                  <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    🏆 {currentLevel} • Rang #{userRank}
                  </Badge>

                  {/* Stats réelles */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-600">{parseFloat(influencerData?.total_earned || 0).toFixed(0)}€</div>
                      <div className="text-sm text-green-600/80">Revenus</div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600">{influencerData?.collaborations_count || 0}</div>
                      <div className="text-sm text-blue-600/80">Collabs</div>
                    </div>
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-yellow-600">{parseFloat(influencerData?.avg_rating || 0).toFixed(1)}/5</div>
                      <div className="text-sm text-yellow-600/80">Rating</div>
                    </div>
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-600">{parseFloat(metrics?.avgEngagement || 0)}%</div>
                      <div className="text-sm text-purple-600/80">Engagement</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Progression vers {getLevelFromScore(nextLevelScore)}</span>
                      <span className="text-xl font-bold text-primary">{targetScore}/{nextLevelScore}</span>
                    </div>
                    <Progress value={progress} className="h-4" />
                    <p className="text-sm text-muted-foreground">
                      Plus que <span className="font-bold text-primary">{Math.max(0, nextLevelScore - targetScore)} points</span> pour atteindre le niveau {getLevelFromScore(nextLevelScore)} !
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Statistiques Réelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "AI Score", value: `${targetScore} pts`, color: "text-primary" },
                  { label: "Revenus totaux", value: `${parseFloat(influencerData?.total_earned || 0).toFixed(0)}€`, color: "text-green-600" },
                  { label: "Collaborations", value: `${influencerData?.collaborations_count || 0}`, color: "text-blue-600" },
                  { label: "Rating moyen", value: `${parseFloat(influencerData?.avg_rating || 0).toFixed(1)}/5`, color: "text-yellow-600" },
                  { label: "Disponible", value: influencerData?.is_available ? "✅ Oui" : "❌ Non", color: "text-muted-foreground" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className={`text-lg font-bold ${color}`}>{value}</span>
                  </div>
                ))}
                <Separator />
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Points aujourd&apos;hui</div>
                  <div className="text-sm font-semibold text-primary">+{liveUpdates} pts</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Niche & infos */}
          {influencerData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">Niches</p>
                  <div className="flex flex-wrap gap-1">
                    {(influencerData.niche || []).map((n, i) => <Badge key={i} variant="secondary" className="text-xs capitalize">{n}</Badge>)}
                    {(!influencerData.niche || influencerData.niche.length === 0) && <span className="text-sm text-muted-foreground">Non défini</span>}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">Types de contenu</p>
                  <div className="flex flex-wrap gap-1">
                    {(influencerData.content_types || []).map((t, i) => <Badge key={i} variant="outline" className="text-xs capitalize">{t}</Badge>)}
                    {(!influencerData.content_types || influencerData.content_types.length === 0) && <span className="text-sm text-muted-foreground">Non défini</span>}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">Budget souhaité</p>
                  <p className="font-semibold text-green-600">
                    {influencerData.min_budget && influencerData.max_budget
                      ? `${parseFloat(influencerData.min_budget).toLocaleString()}€ - ${parseFloat(influencerData.max_budget).toLocaleString()}€`
                      : 'Non défini'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* DÉFIS */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-card border rounded-2xl p-2 shadow-xl flex gap-2 flex-wrap">
              {[
                { key: "daily", label: "Défis Quotidiens", icon: Calendar },
                { key: "weekly", label: "Défis Hebdomadaires", icon: Clock },
                { key: "monthly", label: "Défis Mensuels", icon: Trophy },
              ].map(({ key, label, icon: Icon }) => (
                <Button key={key} variant={selectedChallenge === key ? "default" : "ghost"} onClick={() => setSelectedChallenge(key)} className="rounded-xl">
                  <Icon className="h-4 w-4 mr-2" />{label}
                </Button>
              ))}
            </div>
          </div>

          {selectedChallenge === "daily" && (
            <div className="space-y-4">
              <div className="text-center"><h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Défis Quotidiens 🌅</h2><p className="text-muted-foreground mt-2">Rechargés chaque jour à minuit</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{dailyChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} accepted={acceptedChallenges.has(c.id)} onAccept={handleAccept} />)}</div>
            </div>
          )}
          {selectedChallenge === "weekly" && (
            <div className="space-y-4">
              <div className="text-center"><h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Défis Hebdomadaires 🔥</h2><p className="text-muted-foreground mt-2">Défis premium • Récompenses exclusives</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{weeklyChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} accepted={acceptedChallenges.has(c.id)} onAccept={handleAccept} />)}</div>
            </div>
          )}
          {selectedChallenge === "monthly" && (
            <div className="space-y-4">
              <div className="text-center"><h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Défis Légendaires 👑</h2><p className="text-muted-foreground mt-2">Défis d&apos;élite • Récompenses extraordinaires</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{monthlyChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} accepted={acceptedChallenges.has(c.id)} onAccept={handleAccept} />)}</div>
            </div>
          )}
        </TabsContent>

        {/* CLASSEMENT - Données réelles Supabase */}
        <TabsContent value="leaderboard">
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><Trophy className="h-8 w-8 text-yellow-600" />Classement Global</CardTitle>
              <p className="text-muted-foreground">🏆 Top influenceurs Partnexx • Données en temps réel</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboardWithUser.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Aucun classement disponible</div>
              ) : (
                leaderboardWithUser.map((u) => (
                  <div key={u.rank} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${u.isUser ? 'border-primary bg-primary/10 shadow-lg' : 'border-muted/30 bg-card hover:bg-muted/30'}`}>
                    <div className={`text-2xl font-black ${u.rank <= 3 ? 'text-yellow-600' : 'text-muted-foreground'}`}>#{u.rank}</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">{u.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold ${u.isUser ? 'text-primary text-lg' : ''}`}>{u.name}</h4>
                        {u.rank <= 3 && <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">TOP 3</Badge>}
                        {u.isUser && <Badge className="bg-primary text-white">VOUS</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="text-xl font-bold text-primary">{(u.score || 0).toLocaleString()} pts</span>
                        <span>{u.collabs} collabs</span>
                        <span>⭐ {parseFloat(u.rating || 0).toFixed(1)}/5</span>
                      </div>
                    </div>
                    {u.rank <= 3 && <Trophy className={`h-8 w-8 ${u.rank === 1 ? 'text-yellow-500' : u.rank === 2 ? 'text-gray-400' : 'text-orange-600'}`} />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUCCÈS */}
        <TabsContent value="achievements">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl"><Award className="h-8 w-8 text-green-600" />Collection de Trophées</CardTitle>
              <p className="text-muted-foreground">🏅 {achievements.filter(a => a.unlocked).length}/{achievements.length} débloqués</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  const color = rarityConfig[achievement.rarity] || rarityConfig.common
                  return (
                    <Card key={index} className={`relative overflow-hidden transition-all hover:scale-105 ${achievement.unlocked ? 'border-2 shadow-xl' : 'border-muted/30 opacity-60 grayscale'}`}>
                      <CardContent className="p-6 text-center space-y-4">
                        <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}><Icon className="h-8 w-8 text-white" /></div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{achievement.title}</h4>
                          <p className="text-muted-foreground text-sm mb-3">{achievement.desc}</p>
                          <Badge variant="outline" className={`${achievement.unlocked ? `bg-gradient-to-r ${color} text-white border-0` : 'opacity-50'} font-bold text-xs`}>{achievement.rarity.toUpperCase()}</Badge>
                        </div>
                        <div className={`text-sm font-semibold ${achievement.unlocked ? 'text-green-600' : 'text-muted-foreground'}`}>{achievement.unlocked ? '✅ DÉBLOQUÉ' : '🔒 Verrouillé'}</div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IA INSIGHTS */}
        <TabsContent value="ai-insights">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
            <CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Brain className="h-8 w-8 text-cyan-600" />Insights IA Avancés</CardTitle><p className="text-muted-foreground">🤖 Analyses basées sur vos vraies données</p></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Score actuel", value: `${targetScore} pts`, timeframe: "Votre AI Score Partnexx", confidence: Math.min((targetScore / nextLevelScore) * 100, 100), icon: TrendingUp },
                  { title: "Revenus générés", value: `${parseFloat(influencerData?.total_earned || 0).toFixed(0)}€`, timeframe: "Total sur Partnexx", confidence: 100, icon: DollarSign },
                  { title: "Rating moyen", value: `${parseFloat(influencerData?.avg_rating || 0).toFixed(1)}/5`, timeframe: "Note des marques", confidence: parseFloat(influencerData?.avg_rating || 0) * 20, icon: Star },
                  { title: "Prochaine milestone", value: `${Math.max(0, nextLevelScore - targetScore)} pts`, timeframe: `Pour atteindre ${getLevelFromScore(nextLevelScore)}`, confidence: progress, icon: Compass },
                ].map((insight, index) => {
                  const Icon = insight.icon
                  return (
                    <Card key={index} className="hover:shadow-xl transition-all hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg"><Icon className="h-6 w-6 text-white" /></div>
                          <div className="flex-1 space-y-3">
                            <h4 className="font-bold text-lg">{insight.title}</h4>
                            <div className="text-2xl font-black text-primary">{insight.value}</div>
                            <p className="text-muted-foreground text-sm">{insight.timeframe}</p>
                            <div className="flex items-center gap-2"><Progress value={insight.confidence} className="flex-1 h-2" /><span className="text-sm font-medium text-cyan-600">{Math.round(insight.confidence)}%</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <Separator />
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="h-6 w-6 text-cyan-600" />Recommandation IA Personnalisée</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-muted-foreground mb-4">Basé sur votre profil et vos performances :</p>
                    <ul className="space-y-2">
                      {[
                        `Augmenter votre score de ${Math.max(0, nextLevelScore - targetScore)} pts pour passer ${getLevelFromScore(nextLevelScore)}`,
                        "Compléter des défis quotidiens pour gagner des points",
                        "Publier plus de contenus pour améliorer l'engagement",
                      ].map((tip, i) => (
                        <li key={i} className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-500 rounded-full" /><span className="text-sm">{tip}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600 mb-2">+{Math.min(50, Math.max(0, nextLevelScore - targetScore))} pts</div>
                    <div className="text-sm text-muted-foreground mb-4">gain possible cette semaine</div>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold"><Brain className="h-4 w-4 mr-2" />Appliquer les Conseils</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MARKETPLACE */}
        <TabsContent value="marketplace">
          <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30">
            <CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Gift className="h-8 w-8 text-pink-600" />Marketplace Exclusif</CardTitle><p className="text-muted-foreground">💎 Échangez vos points contre des avantages premium</p></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exclusivePerks.map((perk, index) => {
                  const Icon = perk.icon
                  const canAfford = targetScore >= perk.cost
                  return (
                    <Card key={index} className="hover:shadow-xl transition-all hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl shadow-lg"><Icon className="h-6 w-6 text-white" /></div>
                          <div className="flex-1"><h4 className="font-bold text-lg mb-2">{perk.title}</h4><p className="text-muted-foreground text-sm">{perk.description}</p></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Coins className="h-5 w-5 text-primary" /><span className={`text-xl font-bold ${canAfford ? 'text-primary' : 'text-red-500'}`}>{perk.cost} points</span></div>
                            <Badge variant="secondary">{perk.popularity}% populaire</Badge>
                          </div>
                          {!canAfford && <p className="text-xs text-red-500">Il vous manque {perk.cost - targetScore} points</p>}
                          {perk.limited && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-center"><span className="text-red-600 font-semibold text-sm">⏰ {perk.limited}</span></div>}
                          {perk.waitlist && <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 text-center"><span className="text-yellow-600 font-semibold text-sm">📋 {perk.waitlist} en liste d&apos;attente</span></div>}
                          <Button
                            className={`w-full font-bold ${perk.available && canAfford ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "bg-muted text-muted-foreground"}`}
                            disabled={!perk.available || !canAfford}
                            onClick={() => toast.success(`${perk.title} échangé !`)}
                          >
                            {perk.available && canAfford ? <><Gem className="h-4 w-4 mr-2" />Échanger maintenant</> : perk.available ? <><Clock className="h-4 w-4 mr-2" />Points insuffisants</> : <><Clock className="h-4 w-4 mr-2" />Liste d&apos;attente</>}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <Separator />
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                <h3 className="text-xl font-bold mb-2">💰 Vos Points Disponibles</h3>
                <div className="text-4xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{targetScore} points</div>
                <p className="text-muted-foreground mt-2">Votre AI Score Partnexx réel • Gagnez plus en complétant des défis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}