'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Trophy, Star, Target, Clock, TrendingUp, Crown, Award, Flame,
  Brain, Eye, Users, Calendar, BarChart3, Zap, Lock, CheckCircle, Sparkle,
  Heart, MessageSquare, Share2, Video
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'
import { LEVELS } from '@/lib/hook/useUserLevel'
import { useLevel } from '@/lib/context/LevelContext'

const Sparkles = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M19 17v4M3 5h4M17 19h4"/></svg>
const Rocket = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const Diamond = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/></svg>
const Gem = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="6 3 18 3 22 9 12 22 2 9"/><path d="M11 3 8 9l4 13 4-13-3-6"/><line x1="2" x2="22" y1="9" y2="9"/></svg>
const Coins = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
const Compass = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
const Gamepad2 = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
const PlayCircle = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
const Lightbulb = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
const Gift = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
const ShoppingBag = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>

const LEVEL_VISUALS = {
  bronze: { gradient: 'from-orange-400 to-amber-600', bgGradient: 'from-orange-50 to-amber-100', borderColor: 'border-orange-300', textColor: 'text-orange-700', tagline: 'Débloque tes premières opportunités', perks: [{ icon: '🎯', label: 'Défis quotidiens débloqués' }, { icon: '✅', label: 'Profil créateur vérifié' }, { icon: '📊', label: 'Dashboard débloqué' }, { icon: '💸', label: 'Retraits activés' }] },
  argent: { gradient: 'from-slate-400 to-slate-600', bgGradient: 'from-slate-50 to-slate-100', borderColor: 'border-slate-300', textColor: 'text-slate-700', tagline: 'Progression accélérée', perks: [{ icon: '📊', label: 'Statistiques avancées' }, { icon: '🎨', label: 'Thèmes de profil exclusifs' }, { icon: '🎯', label: 'Multiplicateur x1.25' }] },
  or: { gradient: 'from-yellow-400 to-amber-500', bgGradient: 'from-yellow-50 to-amber-100', borderColor: 'border-yellow-400', textColor: 'text-yellow-700', tagline: 'Expert créateur', perks: [{ icon: '📊', label: 'Analytics complets' }, { icon: '🎨', label: 'Personnalisation avancée' }, { icon: '🎯', label: 'Multiplicateur x1.5' }, { icon: '📈', label: 'Suivi collaborations' }] },
  platine: { gradient: 'from-cyan-400 to-sky-500', bgGradient: 'from-cyan-50 to-sky-100', borderColor: 'border-cyan-400', textColor: 'text-cyan-700', tagline: 'Avantages premium', perks: [{ icon: '🛍️', label: 'Marketplace débloquée' }, { icon: '🤖', label: 'IA Partnexx' }, { icon: '📈', label: 'Revenus avancés' }, { icon: '🎧', label: 'Support prioritaire' }] },
  diamant: { gradient: 'from-teal-400 to-cyan-500', bgGradient: 'from-teal-50 to-cyan-100', borderColor: 'border-teal-400', textColor: 'text-teal-700', tagline: 'Élite numérique', perks: [{ icon: '✨', label: 'Opportunités exclusives' }, { icon: '🛍️', label: 'Marketplace Premium' }, { icon: '🚀', label: 'Accès anticipé' }, { icon: '💎', label: 'Récompenses x2' }] },
  elite: { gradient: 'from-fuchsia-500 to-pink-500', bgGradient: 'from-fuchsia-50 to-pink-100', borderColor: 'border-fuchsia-400', textColor: 'text-fuchsia-700', tagline: 'Cercle premium', perks: [{ icon: '🤝', label: 'Collabs premium' }, { icon: '📣', label: 'Mise en avant LinkedIn' }, { icon: '💼', label: 'Campagnes confidentielles' }, { icon: '👑', label: "Écosystème complet" }] },
  champion: { gradient: 'from-violet-500 to-purple-600', bgGradient: 'from-violet-50 to-purple-100', borderColor: 'border-violet-400', textColor: 'text-violet-700', tagline: 'Créateur reconnu', perks: [{ icon: '🌟', label: 'Mise en avant Instagram' }, { icon: '🤝', label: 'Opportunités premium' }, { icon: '🎁', label: 'Multiplicateur x3' }, { icon: '💎', label: 'Avantages marketplace' }] },
  legende: { gradient: 'from-pink-500 via-orange-500 to-yellow-500', bgGradient: 'from-pink-50 via-orange-50 to-yellow-100', borderColor: 'border-pink-400', textColor: 'text-pink-700', tagline: 'Top créateur', perks: [{ icon: '💰', label: 'Frais réduits -2%' }, { icon: '🏆', label: 'Statut Top Créateur' }, { icon: '✉️', label: 'Invitations privées' }, { icon: '🧠', label: 'Conseiller dédié' }] },
}

/* ============================================================
   ⭐ NOUVEAU SYSTÈME : 3 défis par niveau (Facile/Moyen/Difficile)
   ============================================================ */
const CHALLENGES_BY_LEVEL = {
  bronze: [
    { id: 'bronze-easy', title: 'Premiers pas', description: 'Publier 2 contenus aujourd\'hui', basePoints: 10, difficulty: 'Facile', icon: Video, color: 'from-green-500 to-emerald-600' },
    { id: 'bronze-medium', title: 'Maître des likes', description: 'Atteindre 250 likes sur 1 post', basePoints: 25, difficulty: 'Moyen', icon: Heart, color: 'from-blue-500 to-cyan-600' },
    { id: 'bronze-hard', title: 'Première communauté', description: 'Gagner 25 nouveaux followers en 24h', basePoints: 50, difficulty: 'Difficile', icon: Users, color: 'from-orange-500 to-red-600' },
  ],
  argent: [
    { id: 'argent-easy', title: 'Rythme régulier', description: 'Publier 3 contenus dans la journée', basePoints: 20, difficulty: 'Facile', icon: Video, color: 'from-green-500 to-emerald-600' },
    { id: 'argent-medium', title: 'Engagement boost', description: 'Obtenir 50 commentaires sur 1 post', basePoints: 50, difficulty: 'Moyen', icon: MessageSquare, color: 'from-blue-500 to-cyan-600' },
    { id: 'argent-hard', title: 'Story virale', description: 'Atteindre 50% de taux de vues sur une story', basePoints: 100, difficulty: 'Difficile', icon: Eye, color: 'from-orange-500 to-red-600' },
  ],
  or: [
    { id: 'or-easy', title: 'Productivité', description: 'Publier 5 contenus en 24h', basePoints: 35, difficulty: 'Facile', icon: Rocket, color: 'from-green-500 to-emerald-600' },
    { id: 'or-medium', title: 'Conversation', description: 'Répondre à 100 commentaires dans la journée', basePoints: 80, difficulty: 'Moyen', icon: MessageSquare, color: 'from-blue-500 to-cyan-600' },
    { id: 'or-hard', title: 'Stratège', description: 'Tester 4 formats différents en 24h', basePoints: 175, difficulty: 'Difficile', icon: Lightbulb, color: 'from-orange-500 to-red-600' },
  ],
  platine: [
    { id: 'platine-easy', title: 'Discipline', description: 'Publier sur 2 plateformes le même jour avec 500+ vues chacune', basePoints: 60, difficulty: 'Facile', icon: Share2, color: 'from-green-500 to-emerald-600' },
    { id: 'platine-medium', title: 'Branding', description: 'Obtenir 5 000 vues cumulées en 24h', basePoints: 140, difficulty: 'Moyen', icon: Eye, color: 'from-blue-500 to-cyan-600' },
    { id: 'platine-hard', title: 'Croissance accélérée', description: 'Gagner 250 followers en 7 jours', basePoints: 300, difficulty: 'Difficile', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
  ],
  diamant: [
    { id: 'diamant-easy', title: 'Multicanal', description: 'Publier sur 3 plateformes différentes avec 2k+ vues chacune', basePoints: 100, difficulty: 'Facile', icon: Share2, color: 'from-green-500 to-emerald-600' },
    { id: 'diamant-medium', title: 'Influence', description: 'Faire 25 000 vues sur un contenu en 24h', basePoints: 240, difficulty: 'Moyen', icon: Eye, color: 'from-blue-500 to-cyan-600' },
    { id: 'diamant-hard', title: 'Monétisation', description: 'Signer 1 collaboration en 7 jours via Partnexx', basePoints: 500, difficulty: 'Difficile', icon: Gem, color: 'from-orange-500 to-red-600' },
  ],
  elite: [
    { id: 'elite-easy', title: 'Présence forte', description: 'Faire 10 stories cumulées dans la journée', basePoints: 175, difficulty: 'Facile', icon: Video, color: 'from-green-500 to-emerald-600' },
    { id: 'elite-medium', title: 'Reach massif', description: 'Atteindre 100 000 vues cumulées en 7 jours', basePoints: 400, difficulty: 'Moyen', icon: Eye, color: 'from-blue-500 to-cyan-600' },
    { id: 'elite-hard', title: 'Référent', description: 'Être mentionné par 5 autres créateurs Partnexx en 30j', basePoints: 850, difficulty: 'Difficile', icon: Star, color: 'from-orange-500 to-red-600' },
  ],
  champion: [
    { id: 'champion-easy', title: 'Pilier', description: 'Publier du contenu 15 jours d\'affilée', basePoints: 300, difficulty: 'Facile', icon: Flame, color: 'from-green-500 to-emerald-600' },
    { id: 'champion-medium', title: 'Top performer', description: 'Faire 500k vues cumulées en 30 jours', basePoints: 700, difficulty: 'Moyen', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
    { id: 'champion-hard', title: 'Empire', description: 'Signer 5 collaborations dans le mois via Partnexx', basePoints: 1500, difficulty: 'Difficile', icon: Crown, color: 'from-orange-500 to-red-600' },
  ],
  legende: [
    { id: 'legende-easy', title: 'Inspiration', description: 'Mentor : aider 2 créateurs Bronze à atteindre Argent', basePoints: 500, difficulty: 'Facile', icon: Star, color: 'from-green-500 to-emerald-600' },
    { id: 'legende-medium', title: 'Trendsetter', description: 'Lancer une tendance virale (250k+ vues partagées)', basePoints: 1200, difficulty: 'Moyen', icon: Flame, color: 'from-blue-500 to-cyan-600' },
    { id: 'legende-hard', title: 'Icône', description: 'Faire 3 millions de vues sur un contenu en 7 jours', basePoints: 2500, difficulty: 'Difficile', icon: Trophy, color: 'from-orange-500 to-red-600' },
  ],
}

const achievements = [
  { title: "Première Victoire", desc: "Complétez votre premier défi", unlocked: false, rarity: "common", icon: Target },
  { title: "Série de Feu", desc: "7 défis consécutifs réussis", unlocked: false, rarity: "rare", icon: Flame },
  { title: "Perfectionniste", desc: "100% sur 10 défis difficiles", unlocked: false, rarity: "epic", icon: Diamond },
  { title: "Maître du Temps", desc: "30 défis daily en avance", unlocked: false, rarity: "legendary", icon: Clock },
  { title: "Influenceur Suprême", desc: "Top 1% pendant 3 mois", unlocked: false, rarity: "mythique", icon: Crown },
  { title: "Pionnier IA", desc: "Premier à tester 5 nouvelles features IA", unlocked: false, rarity: "rare", icon: Brain },
]
const exclusivePerks = [
  { title: "Consultation IA Personnalisée", description: "Session 1h avec notre IA expert", cost: 150, icon: Brain, available: true, popularity: 94 },
  { title: "Accès Early Beta Features", description: "Testez les nouvelles fonctionnalités avant tout le monde", cost: 200, icon: Rocket, available: true, popularity: 89 },
  { title: "Mentor Personnel 1 Mois", description: "Accompagnement dédié par un Top 1% Partnexx", cost: 500, icon: Crown, available: false, popularity: 97, waitlist: 23 },
  { title: "Event Privé Paris", description: "Soirée networking exclusive", cost: 300, icon: Sparkles, available: true, popularity: 92, limited: "12 places" },
]
const premiumPerks = [
  { title: "🔥 Boost Algorithme Premium", description: "Multipliez votre visibilité pendant 7 jours", cost: 400, icon: Flame, available: true, popularity: 96, premium: true },
  { title: "🔥 Coaching Stratégique VIP", description: "3 sessions privées avec un consultant Senior", cost: 800, icon: Brain, available: true, popularity: 91, premium: true },
]
const aiInsights = [
  { title: "Prédiction de Croissance", value: "+347 points", timeframe: "30 prochains jours", confidence: 87, icon: TrendingUp },
  { title: "Optimal Posting Time", value: "14h-16h & 20h-22h", timeframe: "Votre audience", confidence: 94, icon: Clock },
  { title: "Contenu Suggéré", value: "Lifestyle + Tech", timeframe: "Tendance émergente", confidence: 91, icon: Lightbulb },
  { title: "Partenariat Optimal", value: "Fashion x Gaming", timeframe: "Q1 2025", confidence: 89, icon: Compass },
]

/* ============================================================
   Composant carte de défi
   ============================================================ */
function ChallengeCard({ challenge, accepted, status, onAccept, onComplete, scoreMultiplier, levelName, dailyLimitReached }) {
  const Icon = challenge.icon
  const completed = status?.status === 'completed'
  const showBonusPreview = scoreMultiplier > 1 && !completed
  const finalPoints = Math.round(challenge.basePoints * scoreMultiplier)

  const difficultyConfig = {
    'Facile': { color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    'Moyen': { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    'Difficile': { color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  }
  const diffStyle = difficultyConfig[challenge.difficulty] || difficultyConfig['Facile']

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-r ${challenge.color} opacity-5`} />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${challenge.color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant="outline" className={`${diffStyle.color} font-bold`}>
            {challenge.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl">{challenge.title}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <p className="text-muted-foreground">{challenge.description}</p>

        {accepted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{status?.progress ?? 0}%</span>
            </div>
            <Progress value={status?.progress ?? 0} className="h-2" />
          </div>
        )}

        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">+{challenge.basePoints} pts</span>
          </div>
          {showBonusPreview && (
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <Sparkle className="h-3 w-3" />
              Avec ton niveau {levelName} : +{finalPoints} pts ({challenge.basePoints} × {scoreMultiplier})
            </p>
          )}
        </div>

        <Button
          onClick={() => onAccept(challenge)}
          disabled={accepted || (dailyLimitReached && !accepted)}
          className={`w-full ${completed ? 'bg-green-600' : accepted ? 'bg-green-600/80' : `bg-gradient-to-r ${challenge.color}`} text-white font-bold`}
        >
          {completed ? <><CheckCircle className="h-4 w-4 mr-2" />Complété ✓</> : accepted ? <><Target className="h-4 w-4 mr-2" />En cours...</> : dailyLimitReached ? <><Lock className="h-4 w-4 mr-2" />Déjà fait aujourd'hui</> : <><PlayCircle className="h-4 w-4 mr-2" />Relever le Défi</>}
        </Button>

        {accepted && !completed && (
          <Button variant="outline" onClick={() => onComplete(challenge)} className="w-full border-green-500/50 text-green-600 hover:bg-green-500/10 font-bold">
            <CheckCircle className="h-4 w-4 mr-2" />
            ✅ Marquer comme complété (TEST)
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function PartnextScoreSection({ user }) {
  const router = useRouter()
  const {
    score, level, nextLevel, currentLevelIndex,
    progress: levelProgress, pointsToNextLevel,
    profileCompletion, isProfileComplete,
    canAccess, getRequiredLevel, loading: levelLoading,
    scoreMultiplier, awardPoints,
  } = useLevel()

  const [animatedScore, setAnimatedScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [leaderboard, setLeaderboard] = useState([])
  const [selectedLevelKey, setSelectedLevelKey] = useState(null)
  const [acceptedChallenges, setAcceptedChallenges] = useState(new Map())

  useEffect(() => {
    if (!selectedLevelKey) setSelectedLevelKey(level?.key || 'bronze')
  }, [level, selectedLevelKey])

  useEffect(() => {
    if (!user?.id) return
    const fetchUserChallenges = async () => {
      const { data, error } = await supabase.from('user_challenges').select('*').eq('user_id', user.id)
      if (error) { console.warn(error); return }
      const map = new Map()
      data?.forEach(c => map.set(c.challenge_id, c))
      setAcceptedChallenges(map)
    }
    fetchUserChallenges()

    const channelName = `user-challenges:${user.id}:${Math.random().toString(36).slice(2, 8)}`
    const channel = supabase.channel(channelName)
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'user_challenges', filter: `user_id=eq.${user.id}` }, (payload) => {
      setAcceptedChallenges(prev => {
        const next = new Map(prev)
        if (payload.eventType === 'DELETE') next.delete(payload.old.challenge_id)
        else next.set(payload.new.challenge_id, payload.new)
        return next
      })
    })
    channel.subscribe()
    return () => supabase.removeChannel(channel)
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    const fetchLeaderboard = async () => {
      const { data } = await supabase.from('influencers').select('id, display_name, ai_score, user_id').order('ai_score', { ascending: false }).limit(10)
      if (data) setLeaderboard(data)
    }
    fetchLeaderboard()
  }, [user?.id, score])

  useEffect(() => {
    if (score <= 0) { setAnimatedScore(0); return }
    const duration = 3000, steps = 100, increment = score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) { setAnimatedScore(score); clearInterval(timer); setShowCelebration(true); setTimeout(() => setShowCelebration(false), 4000) }
      else setAnimatedScore(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [score])

  const canAccessMarketplace = canAccess('marketplace')
  const canAccessPremiumMarketplace = canAccess('premiumMarketplace')
  const marketplaceRequiredLevel = getRequiredLevel('marketplace')
  const marketplaceProgress = marketplaceRequiredLevel ? Math.min((score / marketplaceRequiredLevel.threshold) * 100, 100) : 0
  const pointsToMarketplace = marketplaceRequiredLevel ? Math.max(0, marketplaceRequiredLevel.threshold - score) : 0

  /* ============ Défis du niveau actuel ============ */
  const currentLevelChallenges = level ? CHALLENGES_BY_LEVEL[level.key] || [] : []

  /* ============ Vérif limite 1 défi/difficulté par 24h ============ */
  const isDifficultyLockedToday = (difficulty) => {
    // On regarde si un défi de cette difficulté a été complété/accepté dans les 24 dernières heures
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    return currentLevelChallenges.some(c => {
      if (c.difficulty !== difficulty) return false
      const status = acceptedChallenges.get(c.id)
      if (!status) return false
      const acceptedAt = new Date(status.accepted_at).getTime()
      return acceptedAt > dayAgo && status.status === 'completed'
    })
  }

  const handleAcceptChallenge = async (challenge) => {
    if (!user?.id) return
    const optimistic = { challenge_id: challenge.id, challenge_type: challenge.difficulty.toLowerCase(), challenge_title: challenge.title, challenge_reward: `+${challenge.basePoints} pts`, status: 'in_progress', progress: 0, accepted_at: new Date().toISOString() }
    setAcceptedChallenges(prev => { const next = new Map(prev); next.set(challenge.id, optimistic); return next })

    const { error } = await supabase.from('user_challenges').insert({
      user_id: user.id, challenge_id: challenge.id, challenge_type: challenge.difficulty.toLowerCase(),
      challenge_title: challenge.title, challenge_reward: `+${challenge.basePoints} pts`,
      status: 'in_progress', progress: 0,
    })
    if (error) {
      setAcceptedChallenges(prev => { const next = new Map(prev); next.delete(challenge.id); return next })
      toast.error(error.code === '23505' ? 'Tu as déjà accepté ce défi' : "Erreur")
      return
    }
    toast.success(`Défi accepté : ${challenge.title} 🎯`)
  }

  const handleCompleteChallenge = async (challenge) => {
    if (!user?.id) return
    const { error: updateError } = await supabase.from('user_challenges')
      .update({ status: 'completed', progress: 100, completed_at: new Date().toISOString() })
      .eq('user_id', user.id).eq('challenge_id', challenge.id)
    if (updateError) { toast.error(`Erreur : ${updateError.message}`); return }

    await awardPoints(challenge.basePoints, 'challenge_completed', {
      challenge_id: challenge.id, challenge_title: challenge.title, difficulty: challenge.difficulty,
    })
  }

  const isAccepted = (id) => acceptedChallenges.has(id)
  const getChallengeStatus = (id) => acceptedChallenges.get(id)

  const userRankIndex = leaderboard.findIndex(l => l.user_id === user?.id)
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : '?'

  const top7 = leaderboard.slice(0, 7).map((l, i) => ({
    rank: i + 1, name: l.display_name || 'Influenceur', score: l.ai_score || 0,
    avatar: ['🚀', '💎', '⭐', '🎯', '💫', '🌟', '🎨'][i] || '🏆',
    trend: '+' + Math.floor(((i + 1) * 37) % 200 + 50),
    badge: ['👑', '🔥', '💫', '🚀', '⭐', '🔮', '🎯'][i] || '🎖️',
    isUser: l.user_id === user?.id,
  }))
  const userInTop7 = top7.some(u => u.isUser)
  const leaderboardWithUser = userInTop7 ? top7 : [...top7, { rank: top7.length + 1, name: 'Vous', score, avatar: '🏆', trend: '+0', badge: '🎖️', isUser: true }]

  const selectedLevel = LEVELS.find(l => l.key === selectedLevelKey) || LEVELS[0]
  const selectedVisual = LEVEL_VISUALS[selectedLevel.key]
  const selectedLevelIndex = LEVELS.findIndex(l => l.key === selectedLevel.key)
  const isSelectedLevelUnlocked = currentLevelIndex >= 0 && selectedLevelIndex <= currentLevelIndex

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10" />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute animate-pulse" style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.3) % 5}s`, animationDuration: `${3 + ((i * 0.2) % 4)}s` }}>
            <div className="w-2 h-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-sm" />
          </div>
        ))}
      </div>

      <div className="relative z-10 space-y-8 p-6">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Trophy className="h-16 w-16 text-primary animate-pulse" />
              {showCelebration && (
                <>
                  <div className="absolute inset-0 animate-ping"><Sparkles className="h-16 w-16 text-yellow-400" /></div>
                  <div className="absolute -top-2 -left-2 animate-bounce"><Crown className="h-8 w-8 text-yellow-500" /></div>
                </>
              )}
            </div>
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-primary via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">Partnexx Empire</h1>
              <p className="text-xl text-muted-foreground mt-2">🚀 <span className="font-bold text-primary">Niveau {level?.name || 'Verrouillé'}</span> • Rang #{userRank} • Multiplicateur x{scoreMultiplier}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl">
            <TabsList className="grid w-full grid-cols-6 bg-card/80 backdrop-blur-sm border-0 h-14 rounded-2xl shadow-2xl">
              <TabsTrigger value="dashboard" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500 data-[state=active]:text-white font-bold"><BarChart3 className="h-5 w-5 mr-2" />Dashboard</TabsTrigger>
              <TabsTrigger value="challenges" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold"><Gamepad2 className="h-5 w-5 mr-2" />Défis</TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-bold"><Trophy className="h-5 w-5 mr-2" />Classement</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-bold"><Award className="h-5 w-5 mr-2" />Succès</TabsTrigger>
              <TabsTrigger value="ai-insights" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white font-bold"><Brain className="h-5 w-5 mr-2" />IA Insights</TabsTrigger>
              <TabsTrigger value="marketplace" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-bold"><Gift className="h-5 w-5 mr-2" />Marketplace</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 border-primary/30 shadow-2xl backdrop-blur-sm">
                    <CardContent className="p-8 relative z-10">
                      <div className="text-center space-y-6">
                        <div className="relative inline-block">
                          <div className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse tabular-nums" style={{ whiteSpace: 'nowrap', lineHeight: 1.1 }}>{animatedScore.toLocaleString()}</div>
                          <div className="absolute -top-4 -right-4 flex gap-2"><Flame className="h-10 w-10 text-orange-500 animate-bounce" /><Crown className="h-10 w-10 text-yellow-500 animate-pulse" /></div>
                        </div>
                        <Badge className={`text-xl px-6 py-3 ${level ? `bg-gradient-to-r ${LEVEL_VISUALS[level.key].gradient}` : 'bg-gradient-to-r from-gray-400 to-gray-600'} text-white border-0 shadow-lg`}>{level ? `${level.emoji} ${level.name} Créateur • Rang #${userRank}` : '🔒 Profil incomplet'}</Badge>

                        <div className="mt-10 space-y-6">
                          {!isProfileComplete && !levelLoading && (
                            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 space-y-4">
                              <div className="flex items-center justify-center gap-3"><Lock className="h-6 w-6 text-orange-600" /><h3 className="text-xl font-bold text-orange-700">Complète ton profil pour débloquer Bronze</h3></div>
                              <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Profil complété</span><span className="text-orange-600">{profileCompletion}%</span></div><div className="relative h-3 bg-orange-500/10 rounded-full overflow-hidden"><div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-1000" style={{ width: `${profileCompletion}%` }} /></div></div>
                              <Button onClick={() => router.push('/dashboard/influencer?section=profil')} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold"><Target className="h-4 w-4 mr-2" />Compléter mon profil</Button>
                            </div>
                          )}

                          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-bold">Parcours de progression</h3>
                              {nextLevel && level && (<span className="text-sm text-muted-foreground"><span className="font-bold text-primary">{pointsToNextLevel.toLocaleString()} pts</span> vers <span className="font-semibold">{nextLevel.name}</span></span>)}
                            </div>
                            <div className="relative">
                              <div className="absolute top-6 left-[6%] right-[6%] h-1 bg-muted rounded-full" />
                              <div className="absolute top-6 left-[6%] h-1 bg-gradient-to-r from-orange-400 via-yellow-400 via-cyan-400 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-1000" style={{ width: currentLevelIndex >= 0 ? `${(currentLevelIndex / (LEVELS.length - 1)) * 88}%` : '0%' }} />
                              <div className="relative grid grid-cols-8 gap-1">
                                {LEVELS.map((lvl, idx) => {
                                  const visual = LEVEL_VISUALS[lvl.key]
                                  const isUnlocked = currentLevelIndex >= 0 && idx <= currentLevelIndex
                                  const isCurrent = level?.key === lvl.key
                                  const isSelected = selectedLevelKey === lvl.key
                                  return (
                                    <button key={lvl.key} onClick={() => setSelectedLevelKey(lvl.key)} className="flex flex-col items-center group cursor-pointer">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 relative z-10 ${isUnlocked ? `bg-gradient-to-br ${visual.gradient} shadow-lg group-hover:scale-110` : 'bg-muted text-muted-foreground grayscale opacity-60 group-hover:opacity-80'} ${isCurrent ? 'ring-4 ring-primary ring-offset-2 ring-offset-background animate-pulse scale-110' : ''} ${isSelected && !isCurrent ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : ''}`}>{isUnlocked ? lvl.emoji : <Lock className="h-5 w-5" />}</div>
                                      <div className={`mt-2 text-xs font-bold transition-colors ${isUnlocked ? visual.textColor : 'text-muted-foreground'} ${isCurrent ? 'text-primary' : ''}`}>{lvl.name}</div>
                                      <div className="text-[10px] text-muted-foreground">{lvl.threshold.toLocaleString()}</div>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>

                          <Card className={`relative overflow-hidden bg-gradient-to-br ${selectedVisual.bgGradient} ${selectedVisual.borderColor} border-2 shadow-xl text-left dark:from-muted/40 dark:via-muted/40 dark:to-muted/40 dark:border-border`}>
                            <CardContent className="p-6 space-y-5">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedVisual.gradient} flex items-center justify-center text-3xl shadow-lg ${!isSelectedLevelUnlocked && 'grayscale opacity-70'}`}>{isSelectedLevelUnlocked ? selectedLevel.emoji : <Lock className="h-7 w-7 text-white" />}</div>
                                  <div><div className="text-xs font-bold text-muted-foreground tracking-wider">NIVEAU</div><div className={`text-2xl font-black ${selectedVisual.textColor} dark:text-foreground`}>{selectedLevel.name}</div></div>
                                </div>
                                <Badge variant="outline" className={`${selectedVisual.borderColor} ${selectedVisual.textColor} bg-transparent font-bold dark:text-foreground`}>FOCUS NIVEAU</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{selectedVisual.perks.map((perk, i) => (<div key={i} className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 shadow-sm"><span className="text-xl">{perk.icon}</span><span className="text-sm font-medium text-foreground">{perk.label}</span></div>))}</div>
                              <div className="flex justify-start"><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedVisual.gradient} ${!isSelectedLevelUnlocked && 'grayscale opacity-70'}`}><BarChart3 className="h-4 w-4 text-white" /><span className="text-sm font-bold text-white">{selectedVisual.tagline}</span></div></div>
                              {!isSelectedLevelUnlocked && (<div className="bg-muted/50 rounded-lg p-3 text-center text-sm">🔒 <span className="font-semibold">{Math.max(0, selectedLevel.threshold - score).toLocaleString()} points</span> requis pour débloquer ce niveau</div>)}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-xl">
                    <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Analytics Live</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center"><span className="text-sm">Multiplicateur</span><span className="text-lg font-bold text-primary">x{scoreMultiplier}</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">Classement</span><span className="text-lg font-bold text-primary">#{userRank}/50k</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm">Points totaux</span><span className="text-lg font-bold text-purple-600">{score.toLocaleString()}</span></div>
                      <Separator />
                      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"><div className="text-xs text-muted-foreground">Niveau actuel</div><div className="text-sm font-semibold">{level ? `${level.emoji} ${level.name}` : '🔒 Profil incomplet'}</div></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ============ DÉFIS DU NIVEAU ACTUEL ============ */}
            <TabsContent value="challenges" className="space-y-8 mt-8">
              {!isProfileComplete && !levelLoading && (
                <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30">
                  <CardContent className="p-12 text-center space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center"><Lock className="h-10 w-10 text-white" /></div>
                    <div><h2 className="text-3xl font-bold text-orange-700 mb-2">Défis verrouillés</h2><p className="text-muted-foreground">Complète ton profil à 100% pour accéder aux défis Partnexx.</p></div>
                    <Button onClick={() => router.push('/dashboard/influencer?section=profil')} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold"><Target className="h-4 w-4 mr-2" />Compléter mon profil</Button>
                  </CardContent>
                </Card>
              )}

              {isProfileComplete && level && (
                <>
                  {/* Bannière niveau actuel */}
                  <Card className={`bg-gradient-to-r ${LEVEL_VISUALS[level.key].gradient} border-0 text-white`}>
                    <CardContent className="p-5 flex items-center justify-center gap-3 flex-wrap">
                      <span className="text-3xl">{level.emoji}</span>
                      <div className="text-center">
                        <p className="text-sm opacity-90">Défis du niveau</p>
                        <p className="text-xl font-black">{level.name}</p>
                      </div>
                      {scoreMultiplier > 1 && (
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1.5">
                          <Sparkle className="h-3 w-3 mr-1" />
                          Bonus x{scoreMultiplier}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>

                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Tes 3 défis du jour 🎯</h2>
                    <p className="text-muted-foreground mt-2 text-sm">1 défi de chaque difficulté par 24h • Adaptés à ton niveau actuel</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentLevelChallenges.map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        accepted={isAccepted(challenge.id)}
                        status={getChallengeStatus(challenge.id)}
                        onAccept={handleAcceptChallenge}
                        onComplete={handleCompleteChallenge}
                        scoreMultiplier={scoreMultiplier}
                        levelName={level.name}
                        dailyLimitReached={isDifficultyLockedToday(challenge.difficulty)}
                      />
                    ))}
                  </div>

                  {nextLevel && (
                    <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
                      <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{nextLevel.emoji}</div>
                          <div>
                            <p className="text-sm font-semibold">
                              Atteins <span className="text-primary">{nextLevel.name}</span> pour débloquer 3 nouveaux défis
                            </p>
                            <p className="text-xs text-muted-foreground">Plus que {pointsToNextLevel.toLocaleString()} points</p>
                          </div>
                        </div>
                        <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all" style={{ width: `${levelProgress}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-8 mt-8">
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                <CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Trophy className="h-8 w-8 text-yellow-600" />Classement Global Elite</CardTitle><p className="text-muted-foreground">🏆 Les légendes de Partnexx</p></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardWithUser.map((u) => (
                      <div key={u.rank} className={`flex items-center gap-6 p-4 rounded-xl border transition-all hover:scale-105 ${u.isUser ? 'border-primary bg-gradient-to-r from-primary/10 to-purple-500/10' : 'border-muted/30 bg-card/80 hover:bg-card'}`}>
                        <div className="flex items-center gap-4"><div className={`text-2xl font-black ${u.rank <= 3 ? 'text-yellow-600' : 'text-muted-foreground'}`}>#{u.rank}</div><div className="text-3xl">{u.avatar}</div></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1"><h4 className={`font-bold ${u.isUser ? 'text-primary text-lg' : ''}`}>{u.name}</h4><span className="text-2xl">{u.badge}</span>{u.rank <= 3 && <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">TOP 3</Badge>}{u.isUser && <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white animate-pulse">VOUS</Badge>}</div>
                          <div className="flex items-center gap-4"><span className="text-xl font-bold text-primary">{(u.score || 0).toLocaleString()} pts</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-8 mt-8">
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Award className="h-8 w-8 text-green-600" />Collection de Trophées</CardTitle><p className="text-muted-foreground">🏅 {achievements.filter(a => a.unlocked).length}/{achievements.length} débloqués</p></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((a, i) => {
                      const Icon = a.icon
                      const rarityConfig = { common: 'from-gray-400 to-gray-600', rare: 'from-blue-400 to-blue-600', epic: 'from-purple-400 to-purple-600', legendary: 'from-yellow-400 to-orange-500', mythique: 'from-pink-400 via-purple-500 to-indigo-600' }
                      const color = rarityConfig[a.rarity] || rarityConfig.common
                      return (
                        <Card key={i} className={`relative overflow-hidden transition-all hover:scale-105 ${a.unlocked ? 'border-2 shadow-xl' : 'border-muted/30 opacity-60 grayscale'}`}>
                          <CardContent className="p-6 text-center space-y-4">
                            <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}><Icon className="h-8 w-8 text-white" /></div>
                            <div><h4 className="font-bold text-lg mb-2">{a.title}</h4><p className="text-muted-foreground text-sm mb-4">{a.desc}</p><Badge variant="outline" className={`${a.unlocked ? `bg-gradient-to-r ${color} text-white border-0` : 'opacity-50'} font-bold text-xs`}>{a.rarity.toUpperCase()}</Badge></div>
                            <div className={`text-sm font-semibold ${a.unlocked ? 'text-green-600' : 'text-muted-foreground'}`}>{a.unlocked ? '✅ DÉBLOQUÉ' : '🔒 Verrouillé'}</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-8 mt-8">
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                <CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Brain className="h-8 w-8 text-cyan-600" />Insights IA</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiInsights.map((insight, i) => {
                      const Icon = insight.icon
                      return (
                        <Card key={i} className="hover:shadow-xl transition-all hover:scale-105">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg"><Icon className="h-6 w-6 text-white" /></div>
                              <div className="flex-1 space-y-3">
                                <h4 className="font-bold text-lg">{insight.title}</h4>
                                <div className="text-2xl font-black text-primary">{insight.value}</div>
                                <p className="text-muted-foreground text-sm">{insight.timeframe}</p>
                                <div className="flex items-center gap-2"><div className="flex-1 bg-secondary/20 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${insight.confidence}%` }} /></div><span className="text-sm font-medium text-cyan-600">{insight.confidence}%</span></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-8 mt-8">
              {!isProfileComplete && !levelLoading && (
                <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30">
                  <CardContent className="p-12 text-center space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center"><Lock className="h-10 w-10 text-white" /></div>
                    <div><h2 className="text-3xl font-bold text-orange-700 mb-2">Marketplace verrouillée</h2><p className="text-muted-foreground">Complète ton profil à 100%.</p></div>
                    <Button onClick={() => router.push('/dashboard/influencer?section=profil')} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold"><Target className="h-4 w-4 mr-2" />Compléter</Button>
                  </CardContent>
                </Card>
              )}
              {isProfileComplete && !canAccessMarketplace && (
                <Card className="bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border-cyan-500/30">
                  <CardContent className="p-12 text-center space-y-6">
                    <div className="relative inline-block"><div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-2xl"><ShoppingBag className="h-12 w-12 text-white" /></div><div className="absolute -bottom-2 -right-2 w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-400"><Lock className="h-5 w-5 text-cyan-600" /></div></div>
                    <div><h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent mb-2">Marketplace verrouillée</h2><p className="text-muted-foreground max-w-md mx-auto">Débloque la Marketplace au niveau Platine.</p></div>
                    <div className="inline-flex items-center gap-3 bg-card rounded-2xl px-6 py-4 border-2 border-cyan-300 shadow-lg"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center text-2xl">💠</div><div className="text-left"><div className="text-xs text-muted-foreground font-semibold">DÉBLOQUER À</div><div className="text-xl font-black text-cyan-700">Niveau Platine</div><div className="text-xs text-muted-foreground">{marketplaceRequiredLevel?.threshold.toLocaleString()} pts requis</div></div></div>
                    <div className="max-w-md mx-auto space-y-3"><div className="flex justify-between text-sm"><span className="font-semibold">Progression</span><span className="font-bold text-cyan-600">{score.toLocaleString()} / {marketplaceRequiredLevel?.threshold.toLocaleString()} pts</span></div><div className="relative h-4 bg-cyan-500/10 rounded-full overflow-hidden"><div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-1000" style={{ width: `${marketplaceProgress}%` }} /></div><p className="text-sm text-muted-foreground">Plus que <span className="font-bold text-cyan-600">{pointsToMarketplace.toLocaleString()} points</span></p></div>
                    <Button onClick={() => setActiveTab('challenges')} className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold"><Gamepad2 className="h-4 w-4 mr-2" />Faire des défis</Button>
                  </CardContent>
                </Card>
              )}
              {isProfileComplete && canAccessMarketplace && (
                <>
                  {canAccessPremiumMarketplace && (<Card className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-pink-500/10 border-teal-400/40"><CardContent className="p-4 flex items-center justify-center gap-3 flex-wrap"><Flame className="h-6 w-6 text-teal-600 animate-pulse" /><span className="font-bold bg-gradient-to-r from-teal-600 to-pink-600 bg-clip-text text-transparent text-lg">Marketplace Premium débloquée</span><Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0">DIAMANT</Badge></CardContent></Card>)}
                  <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30">
                    <CardHeader><CardTitle className="flex items-center gap-3 text-2xl"><Gift className="h-8 w-8 text-pink-600" />Marketplace Exclusif</CardTitle><p className="text-muted-foreground">💎 {score.toLocaleString()} points à dépenser</p></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {exclusivePerks.map((p, i) => {
                          const Icon = p.icon
                          const canAfford = score >= p.cost
                          return (
                            <Card key={i} className="hover:shadow-xl transition-all hover:scale-105">
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4"><div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl shadow-lg"><Icon className="h-6 w-6 text-white" /></div><div className="flex-1"><h4 className="font-bold text-lg mb-2">{p.title}</h4><p className="text-muted-foreground text-sm">{p.description}</p></div></div>
                                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Coins className="h-5 w-5 text-primary" /><span className={`text-xl font-bold ${canAfford ? 'text-primary' : 'text-red-500'}`}>{p.cost} points</span></div><Badge variant="secondary">{p.popularity}% populaire</Badge></div>
                                {!canAfford && <p className="text-xs text-red-500 mb-2">Il vous manque {p.cost - score} points</p>}
                                {p.limited && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-center mb-2"><span className="text-red-600 font-semibold text-sm">⏰ {p.limited}</span></div>}
                                {p.waitlist && <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 text-center mb-2"><span className="text-yellow-600 font-semibold text-sm">📋 {p.waitlist} en liste d&apos;attente</span></div>}
                                <Button className={`w-full font-bold ${p.available && canAfford ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-muted text-muted-foreground'}`} disabled={!p.available || !canAfford} onClick={() => toast.success(`${p.title} échangé ! 🎉`)}>
                                  {p.available && canAfford ? <><Gem className="h-4 w-4 mr-2" />Échanger</> : p.available ? <><Clock className="h-4 w-4 mr-2" />Points insuffisants</> : <><Clock className="h-4 w-4 mr-2" />Liste d&apos;attente</>}
                                </Button>
                              </CardContent>
                            </Card>
                          )
                        })}
                        {canAccessPremiumMarketplace && premiumPerks.map((p, i) => {
                          const Icon = p.icon
                          const canAfford = score >= p.cost
                          return (
                            <Card key={`premium-${i}`} className="hover:shadow-xl transition-all hover:scale-105 border-2 border-teal-400/50 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-500/10 dark:to-cyan-500/10">
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4"><div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-xl shadow-lg"><Icon className="h-6 w-6 text-white" /></div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-lg">{p.title}</h4><Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 text-[10px]">PREMIUM</Badge></div><p className="text-muted-foreground text-sm">{p.description}</p></div></div>
                                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Coins className="h-5 w-5 text-teal-600" /><span className={`text-xl font-bold ${canAfford ? 'text-teal-600' : 'text-red-500'}`}>{p.cost} points</span></div><Badge variant="secondary">{p.popularity}% populaire</Badge></div>
                                {!canAfford && <p className="text-xs text-red-500 mb-2">Il vous manque {p.cost - score} points</p>}
                                <Button className={`w-full font-bold ${canAfford ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : 'bg-muted text-muted-foreground'}`} disabled={!canAfford} onClick={() => toast.success(`${p.title} échangé ! 🔥`)}>{canAfford ? <><Gem className="h-4 w-4 mr-2" />Échanger</> : <><Clock className="h-4 w-4 mr-2" />Points insuffisants</>}</Button>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                      <Separator className="my-8" />
                      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20"><h3 className="text-xl font-bold mb-2">💰 Vos Points Disponibles</h3><div className="text-4xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{score.toLocaleString()} points</div><p className="text-muted-foreground mt-2">Gagnez plus de points en complétant des défis</p></div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
