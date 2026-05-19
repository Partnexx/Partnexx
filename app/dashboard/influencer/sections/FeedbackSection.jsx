'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  Search, Calendar, Users, Star, TrendingUp,
  MessageCircle, MoreVertical, Brain, Award, X,
  ThumbsUp, Flag,
} from 'lucide-react'
import { toast } from 'sonner'

// MessageSquare non dispo dans lucide installé → on réutilise MessageCircle
const MessageSquare = MessageCircle
// Reply non dispo → on crée un alias simple
const Reply = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7" />
    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
)

const feedbacks = [
  {
    id: "1",
    from: { name: "Marie Dubois", company: "GreenBeauty", avatar: "MD", role: "brand" },
    collaboration: { title: "Campagne Skincare Naturelle", date: "Janvier 2024" },
    rating: 5,
    comment: "Collaboration exceptionnelle avec Sophie ! Très professionnelle, créative et respectueuse des délais. Le contenu produit était au-delà de nos attentes. Je recommande vivement !",
    date: "Il y a 2 jours",
    isPublic: true,
    categories: { communication: 5, creativity: 5, reliability: 5, quality: 5 },
    likes: 12,
    hasLiked: false,
  },
  {
    id: "2",
    from: { name: "Thomas Martin", company: "TechFlow", avatar: "TM", role: "brand" },
    collaboration: { title: "Review Tech Smartwatch", date: "Décembre 2023" },
    rating: 4,
    comment: "Très bon travail sur la review de notre produit. Sophie a su mettre en avant les points forts tout en restant authentique. Quelques améliorations possibles sur les délais de livraison.",
    date: "Il y a 1 semaine",
    isPublic: true,
    categories: { communication: 4, creativity: 5, reliability: 3, quality: 5 },
    likes: 8,
    hasLiked: true,
  },
  {
    id: "3",
    from: { name: "Sarah Chen", company: "SummerVibes", avatar: "SC", role: "brand" },
    collaboration: { title: "Collection Mode Été", date: "Novembre 2023" },
    rating: 5,
    comment: "Partenariat parfait ! Sophie a une excellente compréhension de notre marque et de notre public. Les visuels étaient magnifiques et l'engagement exceptionnel. À refaire !",
    date: "Il y a 2 semaines",
    isPublic: true,
    categories: { communication: 5, creativity: 5, reliability: 5, quality: 5 },
    likes: 15,
    hasLiked: false,
  },
]

const categoryMeta = [
  { key: "communication", label: "Communication", icon: MessageSquare },
  { key: "creativity",    label: "Créativité",    icon: Award },
  { key: "reliability",  label: "Fiabilité",      icon: Users },
  { key: "quality",      label: "Qualité",        icon: TrendingUp },
]

const categoryLabels = {
  communication: "Communication",
  creativity: "Créativité",
  reliability: "Fiabilité",
  quality: "Qualité",
}

const getRoleLabel = (role) => {
  switch (role) {
    case "brand": return "Marque"
    case "influencer": return "Influenceur"
    case "agency": return "Agence"
    default: return role
  }
}

const getRoleColor = (role) => {
  switch (role) {
    case "brand": return "bg-primary/10 text-primary"
    case "influencer": return "bg-secondary/50 text-foreground"
    case "agency": return "bg-accent/10 text-foreground"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function FeedbackSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [likedFeedbacks, setLikedFeedbacks] = useState(
    new Set(feedbacks.filter(f => f.hasLiked).map(f => f.id))
  )

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const q = searchQuery.toLowerCase()
    return (
      feedback.from.name.toLowerCase().includes(q) ||
      feedback.from.company.toLowerCase().includes(q) ||
      feedback.collaboration.title.toLowerCase().includes(q) ||
      feedback.comment.toLowerCase().includes(q)
    )
  })

  const averageRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length

  const handleLike = (feedbackId) => {
    setLikedFeedbacks(prev => {
      const next = new Set(prev)
      if (next.has(feedbackId)) {
        next.delete(feedbackId)
        toast.success("Like retiré")
      } else {
        next.add(feedbackId)
        toast.success("Avis liké !")
      }
      return next
    })
  }

  const handleReply = (feedbackId) => {
    if (replyingTo === feedbackId) {
      setReplyingTo(null)
      setReplyText("")
    } else {
      setReplyingTo(feedbackId)
      setReplyText("")
    }
  }

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      toast.success("Réponse publiée avec succès !")
      setReplyingTo(null)
      setReplyText("")
    }
  }

  const handleReport = () => {
    toast.success("Avis signalé à l'équipe de modération")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Notes & Feedbacks</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Avis Clients • Notes Détaillées • Réputation Publique</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par entreprise, campagne ou commentaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredFeedbacks.length} résultat(s) trouvé(s)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vue d'ensemble */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vue d&apos;ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Note moyenne</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">{feedbacks.length}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Avis reçus</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <ThumbsUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Recommandations</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2">{feedbacks.reduce((acc, f) => acc + f.likes, 0)}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <ThumbsUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Likes reçus</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Évaluations par catégorie */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Évaluations par catégorie</h2>
          <p className="text-sm text-muted-foreground mt-1">Détails des performances par critère</p>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categoryMeta.map(({ key, label, icon: Icon }) => {
                // CORRECTION : f.categories[key] au lieu de f.categories[category.key.categories]
                const avg = feedbacks.reduce((acc, f) => acc + (f.categories[key] || 0), 0) / feedbacks.length
                return (
                  <div key={key} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{avg.toFixed(1)}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avis détaillés */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Avis détaillés</h2>
            <p className="text-sm text-muted-foreground mt-1">Retours de vos collaborations</p>
          </div>
          <Badge variant="secondary">{filteredFeedbacks.length} avis</Badge>
        </div>

        <div className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun avis trouvé pour cette recherche</p>
              </CardContent>
            </Card>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <Card key={feedback.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-muted font-semibold">
                          {feedback.from.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feedback.from.name}</h3>
                          <Badge variant="secondary" className={getRoleColor(feedback.from.role)}>
                            {getRoleLabel(feedback.from.role)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feedback.from.company} • {feedback.collaboration.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{feedback.rating}/5</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{feedback.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {feedback.isPublic && <Badge variant="outline" className="text-xs">Public</Badge>}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={handleReport}>
                            <Flag className="h-4 w-4 mr-2" />
                            Signaler un problème
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{feedback.comment}</p>

                  {/* Notes détaillées par catégorie */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    {Object.entries(feedback.categories).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold mb-1">{value}</div>
                        <div className="flex justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{categoryLabels[key]}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(feedback.id)}
                        className={likedFeedbacks.has(feedback.id) ? "text-primary" : ""}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-2 ${likedFeedbacks.has(feedback.id) ? "fill-primary" : ""}`} />
                        {feedback.likes
                          + (likedFeedbacks.has(feedback.id) && !feedback.hasLiked ? 1 : 0)
                          - (feedback.hasLiked && !likedFeedbacks.has(feedback.id) ? 1 : 0)}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReply(feedback.id)}
                        className={replyingTo === feedback.id ? "text-primary" : ""}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        {replyingTo === feedback.id ? "Annuler" : "Répondre"}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{feedback.collaboration.date}</span>
                    </div>
                  </div>

                  {/* Formulaire de réponse */}
                  {replyingTo === feedback.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <p className="text-sm font-medium">Répondre à {feedback.from.name}</p>
                      <Textarea
                        placeholder="Écrivez votre réponse..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReply(feedback.id)}>
                          Annuler
                        </Button>
                        <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
                          Publier la réponse
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Répondre globalement */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Répondre aux avis</h2>
          <p className="text-sm text-muted-foreground mt-1">Engagez la conversation avec vos partenaires</p>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6">
            <Textarea placeholder="Rédigez une réponse publique à vos avis..." rows={3} className="mb-4" />
            <div className="flex justify-end">
              <Button>Publier ma réponse</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}