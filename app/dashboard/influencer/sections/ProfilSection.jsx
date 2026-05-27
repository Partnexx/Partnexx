'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Calendar, Target, Star, TrendingUp, MessageCircle, Brain, Shield, Award, Camera, Edit, RefreshCw, CheckCircle, Save, Lock, Trophy, AlertCircle, Trash2, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'
import { LEVELS } from "@/lib/hook/useUserLevel"
import { useLevel } from "@/lib/context/LevelContext"
import LevelGate from '@/components/LevelGate'

const YoutubeIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
const InstagramIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
const TikTokIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.28 8.28 0 0 0 4.84 1.55V7.05a4.85 4.85 0 0 1-1.07-.36z"/></svg>

const getPlatformIcon = (platform) => {
  switch (platform) {
    case 'instagram': return InstagramIcon
    case 'youtube': return YoutubeIcon
    case 'tiktok': return TikTokIcon
    default: return InstagramIcon
  }
}

const getPlatformColor = (platform) => {
  switch (platform) {
    case 'instagram': return 'from-pink-500 to-purple-600'
    case 'youtube': return 'from-red-500 to-red-600'
    case 'tiktok': return 'from-slate-700 to-slate-900'
    default: return 'from-primary to-accent'
  }
}

const LEVEL_VISUALS = {
  bronze: { gradient: 'from-orange-400 to-amber-600', title: 'Profil Vérifié' },
  argent: { gradient: 'from-slate-400 to-slate-600', title: 'Statisticien' },
  or: { gradient: 'from-yellow-400 to-amber-500', title: 'Expert Créateur' },
  platine: { gradient: 'from-cyan-400 to-sky-500', title: 'Premium' },
  diamant: { gradient: 'from-teal-400 to-cyan-500', title: 'Élite Numérique' },
  elite: { gradient: 'from-fuchsia-500 to-pink-500', title: 'Influenceur Premium' },
  champion: { gradient: 'from-violet-500 to-purple-600', title: 'Créateur Reconnu' },
  legende: { gradient: 'from-pink-500 via-orange-500 to-yellow-500', title: 'Top Créateur' },
}

const NICHE_OPTIONS = [
  { value: 'mode', label: 'Mode', emoji: '👗' },
  { value: 'beaute', label: 'Beauté', emoji: '💄' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '✨' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'food', label: 'Food', emoji: '🍔' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'voyage', label: 'Voyage', emoji: '✈️' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'humour', label: 'Humour', emoji: '😂' },
  { value: 'musique', label: 'Musique', emoji: '🎵' },
  { value: 'education', label: 'Éducation', emoji: '📚' },
]

const CONTENT_TYPE_OPTIONS = [
  { value: 'post', label: 'Post', emoji: '📷' },
  { value: 'story', label: 'Story', emoji: '⏱️' },
  { value: 'reel', label: 'Reel', emoji: '🎬' },
  { value: 'video', label: 'Vidéo', emoji: '🎥' },
  { value: 'carousel', label: 'Carrousel', emoji: '🔄' },
  { value: 'live', label: 'Live', emoji: '🔴' },
]

const MAX_NICHES = 3
const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2 MB

function ProfilContent({ user, profile: initialProfile, metrics }) {
  const { level, currentLevelIndex, isProfileComplete, score, canAccess, profileCompletion, refetch } = useLevel()

  const [influencer, setInfluencer] = useState(null)
  const [profile, setProfile] = useState(initialProfile)
  const [socialAccounts, setSocialAccounts] = useState([])
  const [reviews, setReviews] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const fileInputRef = useRef(null)

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedNiches, setSelectedNiches] = useState([])
  const [selectedContentTypes, setSelectedContentTypes] = useState([])
  const [minBudget, setMinBudget] = useState('')

  useEffect(() => {
    if (!user?.id) return
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    const { data: inf } = await supabase.from('influencers').select('*').eq('user_id', user.id).single()
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    if (inf) {
      setInfluencer(inf)
      setDisplayName(inf.display_name || '')
      setCountry(inf.country || '')
      setSelectedNiches(inf.niche || [])
      setSelectedContentTypes(inf.content_types || [])
      setMinBudget(inf.min_budget || '')
    }
    if (prof) {
      setProfile(prof)
      setUsername(prof.username || '')
      setBio(prof.bio || '')
      setAvatarUrl(prof.avatar_url || '')
    }

    const [socialRes, reviewsRes, collabRes] = await Promise.allSettled([
      supabase.from('social_accounts').select('*').eq('influencer_id', inf?.id),
      supabase.from('reviews').select('*, collaborations(id, campaigns(title))').eq('reviewee_id', user.id).order('created_at', { ascending: false }),
      supabase.from('collaborations').select('*, campaigns(title), brands(company_name)').eq('influencer_id', inf?.id).order('created_at', { ascending: false }),
    ])
    setSocialAccounts(socialRes.status === 'fulfilled' ? socialRes.value.data || [] : [])
    setReviews(reviewsRes.status === 'fulfilled' ? reviewsRes.value.data || [] : [])
    setCollaborations(collabRes.status === 'fulfilled' ? collabRes.value.data || [] : [])
    setLoading(false)
  }

  // ===== UPLOAD AVATAR =====
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation taille
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Image trop volumineuse (max 2 MB)')
      e.target.value = ''
      return
    }

    // Validation type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilise JPEG, PNG, WebP ou GIF.')
      e.target.value = ''
      return
    }

    setUploadingAvatar(true)
    try {
      // Extension du fichier (jpg, png, etc.)
      const fileExt = file.name.split('.').pop().toLowerCase()
      // Chemin : {user_id}/avatar.{ext} → comme ça toujours un seul fichier par user
      const filePath = `${user.id}/avatar.${fileExt}`

      // Upload (upsert=true pour remplacer si déjà présent)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      // Récupère l'URL publique
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Cache-buster pour forcer le rafraîchissement de l'image dans le navigateur
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

      // Met à jour le profile en BDD direct (sans attendre le bouton Save)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (profileError) throw profileError

      setAvatarUrl(publicUrl)
      toast.success('Photo de profil mise à jour ! 📸')
      await refetch()
    } catch (err) {
      console.error('Avatar upload error', err)
      toast.error(`Erreur upload : ${err.message || 'inconnue'}`)
    } finally {
      setUploadingAvatar(false)
      e.target.value = '' // Reset l'input pour permettre de re-uploader le même fichier
    }
  }

  const handleAvatarDelete = async () => {
    if (!avatarUrl) return
    setUploadingAvatar(true)
    try {
      // On supprime tous les fichiers dans le dossier user (avatar.jpg, avatar.png, etc.)
      const { data: list } = await supabase.storage.from('avatars').list(user.id)
      if (list && list.length > 0) {
        const paths = list.map(f => `${user.id}/${f.name}`)
        await supabase.storage.from('avatars').remove(paths)
      }

      // Vide le champ avatar_url dans profiles
      await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      setAvatarUrl('')
      toast.success('Photo de profil supprimée')
      await refetch()
    } catch (err) {
      console.error('Avatar delete error', err)
      toast.error(`Erreur : ${err.message || 'suppression échouée'}`)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const toggleNiche = (value) => {
    if (selectedNiches.includes(value)) {
      setSelectedNiches(prev => prev.filter(v => v !== value))
    } else {
      if (selectedNiches.length >= MAX_NICHES) {
        toast.error(`Maximum ${MAX_NICHES} niches. Désélectionne-en une d'abord.`)
        return
      }
      setSelectedNiches(prev => [...prev, value])
    }
  }

  const toggleContentType = (value) => {
    setSelectedContentTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const minBudgetNum = minBudget === '' ? null : parseFloat(minBudget)
      if (minBudget !== '' && (isNaN(minBudgetNum) || minBudgetNum < 0)) {
        toast.error('Le tarif minimum doit être un nombre positif')
        setSaving(false)
        return
      }

      const { error: infError } = await supabase.from('influencers').update({
        display_name: displayName,
        country: country,
        niche: selectedNiches,
        content_types: selectedContentTypes,
        min_budget: minBudgetNum,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)

      if (infError) throw infError

      const { error: profError } = await supabase.from('profiles').update({
        username: username,
        full_name: displayName,
        bio: bio,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)

      if (profError) throw profError

      toast.success("Profil mis à jour ! ✨")
      await refetch()
    } catch (err) {
      console.error('Save error', err)
      toast.error(`Erreur : ${err.message || 'sauvegarde échouée'}`)
    }
    setSaving(false)
  }

  const totalFollowers = socialAccounts.reduce((sum, s) => sum + (s.followers_count || 0), 0)
  const avgEngagement = socialAccounts.length > 0
    ? (socialAccounts.reduce((sum, s) => sum + parseFloat(s.engagement_rate || 0), 0) / socialAccounts.length).toFixed(1)
    : '0.0'
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  const aiScore = influencer?.ai_score || 0
  const initials = displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'IN'

  const isVerified = canAccess('verifiedProfile')
  const isTopCreator = canAccess('topCreatorStatus')

  const missingFields = []
  if (!displayName) missingFields.push('nom')
  if (!username) missingFields.push('username')
  if (!avatarUrl) missingFields.push('photo de profil')
  if (!bio) missingFields.push('bio')
  if (!selectedNiches.length) missingFields.push('niches')
  if (!selectedContentTypes.length) missingFields.push('types de contenu')
  if (!minBudget) missingFields.push('tarif minimum')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Input file caché — déclenché par le bouton caméra */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Informations Personnelles • Réseaux Sociaux • Portfolio</p>
        </div>
      </div>

      {!isProfileComplete && (
        <Card className="border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-orange-700">Complète ton profil pour débloquer Bronze 🥉</p>
                  <p className="text-sm text-muted-foreground">
                    {missingFields.length > 0 && `Il manque : ${missingFields.join(', ')}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-orange-600">{profileCompletion}%</div>
                <p className="text-xs text-muted-foreground">complété</p>
              </div>
            </div>
            <div className="relative h-2 bg-orange-500/10 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <CardContent className="relative p-8 text-center">
            <div className="relative inline-block mb-6 group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-2 ring-primary/20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white">{initials}</AvatarFallback>
              </Avatar>

              {/* Overlay de loading pendant l'upload */}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}

              {/* Bouton caméra */}
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg"
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
              >
                <Camera className="h-4 w-4" />
              </Button>

              {/* Bouton supprimer (visible seulement si avatar existe) */}
              {avatarUrl && !uploadingAvatar && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleAvatarDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold">{displayName || 'Votre nom'}</h2>
              {isTopCreator && (
                <Badge className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white border-0 shadow-lg animate-pulse">
                  <Trophy className="h-3 w-3 mr-1" />Top Créateur
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-4 font-medium">@{username || 'username'}</p>

            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{country || 'Localisation non définie'}</span>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              {isVerified ? (
                <Badge className="px-4 py-2 gap-2 bg-green-500/15 text-green-700 border border-green-500/30 hover:bg-green-500/20">
                  <CheckCircle className="h-4 w-4" />Profil vérifié
                </Badge>
              ) : (
                <Badge className="px-4 py-2 gap-2 bg-muted text-muted-foreground border border-border">
                  <Lock className="h-3 w-3" />Non vérifié — Complète ton profil
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 p-5 bg-muted/50 rounded-2xl border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalFollowers > 0 ? `${(totalFollowers / 1000).toFixed(1)}K` : '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">Followers</p>
              </div>
              <div className="text-center border-x">
                <p className="text-2xl font-bold text-primary">{avgEngagement}%</p>
                <p className="text-xs text-muted-foreground mt-1">Engagement</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{avgRating}</p>
                <p className="text-xs text-muted-foreground mt-1">Note</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg"><Star className="h-5 w-5 text-white" /></div>
              Partnexx Score
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{aiScore}</div>
              <Badge className={`mt-4 px-4 py-1.5 ${level ? `bg-gradient-to-r ${LEVEL_VISUALS[level.key].gradient} text-white border-0` : ''}`}>
                {level ? `${level.emoji} Niveau ${level.name}` : 'Profil incomplet'}
              </Badge>
            </div>
            <Progress value={aiScore} className="h-3" />
            <div className="space-y-3">
              {[
                { label: "Revenus totaux", value: `${parseFloat(influencer?.total_earned || 0).toFixed(0)}€` },
                { label: "Collaborations", value: `${influencer?.collaborations_count || 0}` },
                { label: "Note moyenne", value: `${parseFloat(influencer?.avg_rating || 0).toFixed(1)}/5` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-3 bg-muted/50 rounded-xl border">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="font-bold text-primary">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-muted/50 border">
          {[
            { value: "general", label: "Général" },
            { value: "reseaux", label: "Réseaux" },
            { value: "portfolio", label: "Portfolio" },
            { value: "avis", label: "Avis" },
            { value: "verifications", label: "Vérifications" },
          ].map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-3 rounded-lg font-semibold transition-all">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Edit className="h-5 w-5 text-white" /></div>
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom d&apos;affichage <span className="text-red-500">*</span></label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Mathias Baudoin" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom d&apos;utilisateur <span className="text-red-500">*</span></label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="mathiasbaudoin" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={user?.email || ''} disabled className="bg-muted/50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pays</label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="France" />
              </div>

              {/* ===== Photo de profil — Upload ===== */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo de profil <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
                  <Avatar className="h-20 w-20 border-2 border-background shadow-md">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-accent text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                      >
                        {uploadingAvatar ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Upload...</>
                        ) : (
                          <><Camera className="h-4 w-4 mr-2" />{avatarUrl ? 'Changer la photo' : 'Choisir une photo'}</>
                        )}
                      </Button>
                      {avatarUrl && !uploadingAvatar && (
                        <Button variant="outline" size="sm" onClick={handleAvatarDelete} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />Supprimer
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP ou GIF • 2 MB max
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Bio <span className="text-red-500">*</span></span>
                  <span className="text-xs text-muted-foreground">{bio.length}/500</span>
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  placeholder="Présente-toi en quelques mots : ton univers, ton style, ce qui te rend unique..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-sm font-medium">
                    Mes niches principales <span className="text-red-500">*</span>
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {selectedNiches.length}/{MAX_NICHES} sélectionnées
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choisis jusqu&apos;à {MAX_NICHES} niches qui te représentent le mieux. C&apos;est ce que verront les marques.
                </p>
                <div className="flex flex-wrap gap-2">
                  {NICHE_OPTIONS.map(opt => {
                    const isSelected = selectedNiches.includes(opt.value)
                    const isDisabled = !isSelected && selectedNiches.length >= MAX_NICHES
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleNiche(opt.value)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-primary to-purple-500 text-white border-transparent shadow-lg scale-105'
                            : isDisabled
                            ? 'bg-muted/30 text-muted-foreground border-muted cursor-not-allowed opacity-50'
                            : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:scale-105'
                        }`}
                      >
                        <span className="mr-1.5">{opt.emoji}</span>
                        {opt.label}
                        {isSelected && <span className="ml-2 text-xs">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-sm font-medium">
                    Types de contenu que je crée <span className="text-red-500">*</span>
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {selectedContentTypes.length} sélectionné{selectedContentTypes.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Coche tous les formats que tu maîtrises. Aucune limite.
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPE_OPTIONS.map(opt => {
                    const isSelected = selectedContentTypes.includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleContentType(opt.value)}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent shadow-lg scale-105'
                            : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:scale-105'
                        }`}
                      >
                        <span className="mr-1.5">{opt.emoji}</span>
                        {opt.label}
                        {isSelected && <span className="ml-2 text-xs">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tarif minimum par collaboration (€) <span className="text-red-500">*</span>
                </label>
                <div className="relative max-w-xs">
                  <Input
                    type="number"
                    min="0"
                    step="50"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="500"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">€</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  C&apos;est ton prix de départ. Les marques verront ce tarif comme base pour proposer leurs collaborations.
                </p>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button onClick={handleSave} disabled={saving} size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white font-bold">
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Sauvegarde...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />Enregistrer mon profil</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reseaux">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><TrendingUp className="h-5 w-5 text-white" /></div>
                Plateformes connectées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><p>Aucun compte social connecté</p></div>
              ) : (
                socialAccounts.map((account) => {
                  const Icon = getPlatformIcon(account.platform)
                  const color = getPlatformColor(account.platform)
                  return (
                    <div key={account.id} className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}><Icon className="h-7 w-7 text-white" /></div>
                          <div>
                            <h3 className="font-semibold capitalize">{account.platform}</h3>
                            <p className="text-sm text-muted-foreground">{account.handle || 'Non renseigné'}</p>
                            <p className="text-xs text-muted-foreground">{(account.followers_count || 0).toLocaleString()} followers • {parseFloat(account.engagement_rate || 0).toFixed(1)}% engagement</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Connecté</Badge>
                          <Button variant="outline" size="sm" onClick={() => toast.info("Rafraîchissement disponible prochainement")}><RefreshCw className="h-4 w-4 mr-1" />Rafraîchir</Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Award className="h-5 w-5 text-white" /></div>
                Historique de collaborations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {collaborations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><p>Aucune collaboration pour l&apos;instant</p></div>
              ) : (
                collaborations.map((collab) => (
                  <div key={collab.id} className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold">{collab.campaigns?.title || 'Campagne'}</h3></div>
                        <p className="text-sm text-muted-foreground">{collab.brands?.company_name || 'Marque'}</p>
                        <Badge className={`mt-1 text-xs ${collab.status === 'completed' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                          {collab.status === 'completed' ? 'Terminée' : collab.status === 'in_progress' ? 'En cours' : collab.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /><span>{new Date(collab.created_at).toLocaleDateString('fr-FR')}</span></div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avis">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><MessageCircle className="h-5 w-5 text-white" /></div>
                Avis & Réputation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center p-8 bg-muted/50 rounded-2xl border">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">{avgRating}</div>
                  <div className="flex items-center gap-1 justify-center mb-1">
                    {[1,2,3,4,5].map((s) => (<Star key={s} className={`h-5 w-5 ${s <= Math.round(parseFloat(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />))}
                  </div>
                  <p className="text-sm text-muted-foreground">Basé sur {reviews.length} avis</p>
                </div>
              </div>
              <Separator />
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><p>Aucun avis pour l&apos;instant</p></div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{review.collaborations?.campaigns?.title || 'Collaboration'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((s) => (<Star key={s} className={`h-4 w-4 ${s <= (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />))}
                          </div>
                          <span className="text-sm font-medium">{review.rating}/5</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment || 'Aucun commentaire'}</p>
                    {review.is_public && <Badge variant="outline" className="text-xs">Public</Badge>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Shield className="h-5 w-5 text-white" /></div>
                Vérifications & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border p-5 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg"><Shield className="h-7 w-7 text-white" /></div>
                    <div>
                      <h3 className="font-semibold">Vérification d&apos;identité</h3>
                      <p className="text-sm text-muted-foreground">Compte Supabase authentifié</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Vérifié</Badge>
                </div>
              </div>
              <div className="rounded-2xl border p-5 bg-muted/30">
                <h3 className="font-semibold text-lg mb-4">Comptes sociaux connectés</h3>
                <div className="space-y-2">
                  {socialAccounts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun compte connecté</p>
                  ) : (
                    socialAccounts.map((account) => {
                      const Icon = getPlatformIcon(account.platform)
                      return (
                        <div key={account.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-muted-foreground" /><span className="text-sm capitalize">{account.platform}</span><span className="text-xs text-muted-foreground">{account.handle}</span></div>
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Validé</Badge>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              <div className="rounded-2xl border p-6 bg-muted/30">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h3 className="font-semibold text-lg">Vos badges Partnexx</h3>
                  <Badge variant="outline" className="text-xs">{currentLevelIndex >= 0 ? currentLevelIndex + 1 : 0}/{LEVELS.length} débloqués</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {LEVELS.map((lvl, idx) => {
                    const visual = LEVEL_VISUALS[lvl.key]
                    const isUnlocked = currentLevelIndex >= 0 && idx <= currentLevelIndex
                    const isCurrent = level?.key === lvl.key
                    return (
                      <div key={lvl.key} className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${isUnlocked ? 'bg-card border-primary/30 hover:shadow-xl hover:scale-105' : 'bg-muted/20 border-muted opacity-50'} ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg ${isUnlocked ? `bg-gradient-to-br ${visual.gradient}` : 'bg-muted grayscale'}`}>
                          {isUnlocked ? lvl.emoji : <Lock className="h-6 w-6 text-muted-foreground" />}
                        </div>
                        <div className="text-center min-h-[2.5rem]">
                          <p className="font-bold text-sm">{lvl.name}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{visual.title}</p>
                        </div>
                        {isUnlocked ? (
                          isCurrent ? (<Badge className="bg-gradient-to-r from-primary to-purple-500 text-white text-[10px] px-2 py-0">ACTUEL</Badge>) : (<Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] px-2 py-0">✓</Badge>)
                        ) : (<span className="text-[10px] text-muted-foreground">{lvl.threshold.toLocaleString()} pts</span>)}
                      </div>
                    )
                  })}
                </div>
                {!isProfileComplete && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
                    <p className="text-sm text-orange-700 font-medium">🔒 Complète ton profil à 100% pour débloquer ton premier badge Bronze</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ProfilSection({ user, profile, metrics }) {
  return (
    <LevelGate
      user={user}
      sectionTitle="Mon profil"
      sectionDescription="Informations Personnelles • Réseaux Sociaux • Portfolio"
      skipProfileCheck={true}
    >
      <ProfilContent user={user} profile={profile} metrics={metrics} />
    </LevelGate>
  )
}
