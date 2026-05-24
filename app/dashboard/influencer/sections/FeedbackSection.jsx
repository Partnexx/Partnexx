'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { Search, Calendar, Star, MessageCircle, Brain, X, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

const Reply = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7" />
    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
)

export default function FeedbackSection({ user }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    fetchReviews()

    const channel = supabase
      .channel('reviews-realtime-feedback')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchReviews())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user?.id])

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, collaborations(id, campaigns(title))')
      .eq('reviewee_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) setReviews(data)
    setLoading(false)
  }

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase()
    return (
      (r.comment || '').toLowerCase().includes(q) ||
      (r.collaborations?.campaigns?.title || '').toLowerCase().includes(q)
    )
  })

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  const fiveStars = reviews.filter(r => r.rating === 5).length
  const recommendRate = reviews.length > 0 ? Math.round((fiveStars / reviews.length) * 100) : 0

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} jours`
    return date.toLocaleDateString('fr-FR')
  }

  const handleReply = (reviewId) => {
    setReplyingTo(prev => prev === reviewId ? null : reviewId)
    setReplyText("")
  }

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      toast.success("Réponse publiée !")
      setReplyingTo(null)
      setReplyText("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Notes & Feedbacks</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Avis Clients • Notes Détaillées • Réputation Publique • Temps Réel</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par campagne ou commentaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && <p className="text-sm text-muted-foreground mt-2">{filteredReviews.length} résultat(s)</p>}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{avgRating}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(parseFloat(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">Note moyenne</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold mb-2">{reviews.length}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Avis reçus</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{recommendRate}%</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">5 étoiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold mb-2">{fiveStars}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Avis parfaits</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution */}
      {reviews.length > 0 && (
        <Card className="border-2">
          <CardHeader><CardTitle className="text-lg">Distribution des notes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{star}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{count} avis</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Avis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Avis détaillés</h2>
            <p className="text-sm text-muted-foreground mt-1">Retours de vos collaborations • Temps réel</p>
          </div>
          <Badge variant="secondary">{filteredReviews.length} avis</Badge>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement des avis...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{searchQuery ? "Aucun avis trouvé" : "Aucun avis pour l'instant"}</h3>
              <p className="text-sm text-muted-foreground">Les avis apparaîtront ici en temps réel</p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        MA
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Marque partenaire</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Marque</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.collaborations?.campaigns?.title || 'Collaboration'}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.rating}/5</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  {review.is_public && <Badge variant="outline" className="text-xs">Public</Badge>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{review.comment || 'Aucun commentaire'}</p>

                <div className="flex items-center justify-between pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(review.id)}
                    className={replyingTo === review.id ? "text-primary" : ""}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    {replyingTo === review.id ? "Annuler" : "Répondre"}
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {replyingTo === review.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <p className="text-sm font-medium">Répondre à cet avis</p>
                    <Textarea
                      placeholder="Écrivez votre réponse..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleReply(review.id)}>Annuler</Button>
                      <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>Publier</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}