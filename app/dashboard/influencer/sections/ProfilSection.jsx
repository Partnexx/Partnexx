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
import { MapPin, Calendar, Target, Star, TrendingUp, Filter, MessageCircle, Brain, Shield, Award, Camera, Edit, RefreshCw, CheckCircle } from 'lucide-react'

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)
const Link2 = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>
  </svg>
)
const Link2Off = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 17H7A5 5 0 0 1 7 7"/><path d="M15 7h2a5 5 0 0 1 4 8"/><line x1="8" x2="12" y1="12" y2="12"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
)
const LinkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)
const Package = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>
)
const Verified = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)
const MessageSquare = MessageCircle

const socialPlatforms = [
  { id: "instagram", name: "Instagram", icon: InstagramIcon, username: "@sophieinfluence", followers: "125K", connected: true, color: "from-purple-500 to-pink-500" },
  { id: "youtube", name: "YouTube", icon: YoutubeIcon, username: "Sophie Martin", followers: "85K", connected: true, color: "from-red-500 to-red-600" },
  { id: "tiktok", name: "TikTok", icon: Award, username: "@sophiestyle", followers: "220K", connected: true, color: "from-slate-700 to-slate-900" },
]

const collaborations = [
  { id: "1", type: "Collaboration", brand: "GreenBeauty", startDate: "Jan 2024", endDate: "Fév 2024", duration: "1 mois", objective: "Produit - Crème visage", status: "Terminée" },
  { id: "2", type: "Affiliation", brand: "TechFlow", startDate: "Déc 2023", endDate: "Jan 2024", duration: "2 mois", objective: "Code promo - 15% réduction", status: "Terminée" },
  { id: "3", type: "Collaboration", brand: "SummerVibes", startDate: "Nov 2023", endDate: "Nov 2023", duration: "2 semaines", objective: "Visibilité - Collection été", status: "Terminée" },
]

const brandReviews = [
  { id: "1", brand: "GreenBeauty", rating: 5, date: "Fév 2024", campaign: "Collaboration", comment: "Excellente collaboration ! Sophie est professionnelle, créative et ses contenus sont de très haute qualité. Nous recommandons vivement.", response: null },
  { id: "2", brand: "TechFlow", rating: 5, date: "Jan 2024", campaign: "Affiliation", comment: "Très bon retour sur investissement. Sophie a su mettre en valeur notre produit de manière authentique. Communication fluide.", response: "Merci beaucoup ! J'ai adoré travailler avec votre équipe." },
  { id: "3", brand: "SummerVibes", rating: 4, date: "Nov 2023", campaign: "Collaboration", comment: "Bonne collaboration dans l'ensemble. Le contenu était qualitatif mais les délais étaient un peu justes.", response: null },
]

export default function ProfilSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Informations Personnelles • Réseaux Sociaux • Portfolio Visuel</p>
        </div>
        <Button className="flex items-center gap-2"><Edit className="h-4 w-4" />Modifier le profil</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          <CardContent className="relative p-8 text-center">
            <div className="relative inline-block mb-6">
              <Avatar className="relative h-32 w-32 border-4 border-background shadow-2xl ring-2 ring-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">SM</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg"><Camera className="h-4 w-4" /></Button>
            </div>
            <h2 className="text-2xl font-bold mb-1">Sophie Martin</h2>
            <p className="text-muted-foreground mb-4 font-medium">@sophieinfluence</p>
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <MapPin className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Paris, France</span>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <Badge className="px-4 py-2 gap-2"><Shield className="h-4 w-4" />Profil vérifié</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 p-5 bg-muted/50 rounded-2xl border">
              <div className="text-center"><p className="text-2xl font-bold text-primary">430K</p><p className="text-xs text-muted-foreground mt-1">Followers</p></div>
              <div className="text-center border-x"><p className="text-2xl font-bold text-primary">6.5%</p><p className="text-xs text-muted-foreground mt-1">Engagement</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-primary">4.9</p><p className="text-xs text-muted-foreground mt-1">Note</p></div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg"><Star className="h-5 w-5 text-primary-foreground" /></div>
              Partnex Score
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">92</div>
              <Badge className="mt-4 px-4 py-1.5">Excellent</Badge>
            </div>
            <Progress value={92} className="h-3" />
            <div className="space-y-3">
              {[{ label: "Taux de réponse", value: "95%" }, { label: "Respect des délais", value: "100%" }, { label: "Qualité du contenu", value: "4.8/5" }].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-3 bg-muted/50 rounded-xl border hover:border-primary/30 transition-all">
                  <span className="text-sm font-medium">{label}</span><span className="font-bold text-primary">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-muted/50 border">
          {["general", "reseaux", "portfolio", "avis", "verifications"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-3 rounded-lg font-semibold transition-all">
              {tab === "general" ? "Général" : tab === "reseaux" ? "Réseaux" : tab === "portfolio" ? "Portfolio" : tab === "avis" ? "Avis" : "Vérifications"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Card className="relative overflow-hidden shadow-xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Edit className="h-5 w-5 text-primary-foreground" /></div>
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Prénom</label><Input defaultValue="Sophie" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Nom d&apos;affichage</label><Input defaultValue="Sophie Martin" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Nom d&apos;utilisateur</label><Input defaultValue="@sophieinfluence" /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio courte</label>
                <Textarea defaultValue="Passionnée de beauté et lifestyle, je partage mes découvertes et conseils avec ma communauté. Collaborations authentiques uniquement ✨" rows={3} className="resize-none" />
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Adresse complète</label><Input defaultValue="12 Rue de la Paix" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4" />Ville</label><Input defaultValue="Paris" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Pays</label><Input defaultValue="France" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium flex items-center gap-2"><LinkIcon className="h-4 w-4" />Site web / Linktree</label><Input placeholder="https://linktr.ee/sophieinfluence" /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Langues parlées</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Français</Badge><Badge variant="secondary">Anglais</Badge><Badge variant="secondary">Espagnol</Badge>
                  <Button variant="outline" size="sm" className="h-7">+ Ajouter</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Spécialités</label>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">Beauté</Badge>
                  <Badge variant="secondary">Lifestyle</Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Mode</Badge>
                  <Badge variant="secondary">Wellness</Badge>
                  <Button variant="outline" size="sm" className="h-7">+ Ajouter</Button>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end"><Button>Enregistrer les modifications</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reseaux">
          <Card className="relative overflow-hidden shadow-xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Link2 className="h-5 w-5 text-primary-foreground" /></div>
                Plateformes connectées
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              {socialPlatforms.map((platform) => (
                <div key={platform.id} className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center shadow-lg`}>
                        <platform.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.username}</p>
                        <p className="text-xs text-muted-foreground">{platform.followers} followers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Connecté</Badge>
                      <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Rafraîchir</Button>
                      <Button variant="outline" size="sm" className="text-destructive"><Link2Off className="h-4 w-4 mr-1" />Déconnecter</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card className="relative overflow-hidden shadow-xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Package className="h-5 w-5 text-primary-foreground" /></div>
                Historique de collaborations
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              {collaborations.map((collab) => (
                <div key={collab.id} className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1"><Badge variant="outline" className="text-xs">{collab.type}</Badge><h3 className="font-semibold">{collab.brand}</h3></div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{collab.status}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><p className="text-muted-foreground text-xs mb-1">Début</p><div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /><span className="font-medium">{collab.startDate}</span></div></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Fin</p><div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /><span className="font-medium">{collab.endDate}</span></div></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Durée</p><span className="font-medium">{collab.duration}</span></div>
                    <div><p className="text-muted-foreground text-xs mb-1">Objectif</p><div className="flex items-center gap-1"><Target className="h-3 w-3 text-muted-foreground" /><span className="font-medium text-xs">{collab.objective}</span></div></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avis">
          <Card className="relative overflow-hidden shadow-xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><MessageSquare className="h-5 w-5 text-primary-foreground" /></div>
                  Avis & Réputation
                </CardTitle>
                <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="flex items-center justify-center p-8 bg-muted/50 rounded-2xl border">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">4.9</div>
                  <div className="flex items-center gap-1 justify-center mb-1">{[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-sm text-muted-foreground">Basé sur 23 avis</p>
                </div>
              </div>
              <Separator />
              {brandReviews.map((review) => (
                <div key={review.id} className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{review.brand}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">{[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />)}</div>
                        <Badge variant="outline" className="text-xs">{review.campaign}</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  {review.response ? (
                    <div className="pl-4 border-l-2 border-primary/30 bg-primary/5 p-3 rounded">
                      <p className="text-xs font-semibold text-primary mb-1">Votre réponse :</p>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2" />Répondre</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications">
          <Card className="relative overflow-hidden shadow-xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg"><Shield className="h-5 w-5 text-primary-foreground" /></div>
                Vérifications & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg"><Shield className="h-7 w-7 text-primary-foreground" /></div>
                    <div><h3 className="font-semibold">Vérification d&apos;identité (KYC)</h3><p className="text-sm text-muted-foreground">Votre identité a été vérifiée avec succès</p></div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Vérifié</Badge>
                </div>
              </div>
              <div className="rounded-2xl border p-5 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                <h3 className="font-semibold text-lg mb-4">Validation des comptes sociaux</h3>
                <div className="space-y-2">
                  {[{ icon: InstagramIcon, label: "Instagram" }, { icon: YoutubeIcon, label: "YouTube" }, { icon: Award, label: "TikTok" }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-muted-foreground" /><span className="text-sm">{label}</span></div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Validé</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border p-6 bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg">
                <h3 className="font-semibold text-lg mb-6">Vos badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[{ icon: Award, label: "Top Creator", sub: "Performance exceptionnelle" }, { icon: Star, label: "Premium", sub: "Abonnement actif" }, { icon: Verified, label: "Vérifié", sub: "Identité confirmée" }].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center gap-3 p-5 bg-primary/5 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl hover:scale-105">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-2xl"><Icon className="h-10 w-10 text-white" /></div>
                      <p className="font-bold text-center">{label}</p>
                      <p className="text-xs text-muted-foreground text-center">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}