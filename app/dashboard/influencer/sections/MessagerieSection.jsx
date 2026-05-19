'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  Search, MapPin, Users, Star, Eye, MessageCircle, Send,
  Paperclip, Phone, Video, MoreVertical, Check, CheckCheck,
  Plus, Bell, Brain, Archive, Trash2, Globe, ExternalLink,
  Mail, Building2,
} from 'lucide-react'

const conversations = [
  {
    id: "1",
    company: {
      name: "GreenBeauty",
      avatar: "GB",
      sector: "Cosmétiques & Beauté",
      size: "50-200 employés",
      location: "Paris, France",
      website: "www.greenbeauty.fr",
      email: "partenariats@greenbeauty.fr",
      description: "Marque de cosmétiques bio et naturels, spécialisée dans les soins du visage et du corps. Nous recherchons des créateurs de contenu authentiques pour promouvoir nos valeurs écologiques.",
      isOnline: true,
    },
    lastMessage: { content: "Perfect ! On finalise les détails de la campagne demain ?", time: "14:30", isOwn: false },
    messages: [
      { id: "m1", content: "Bonjour ! J'ai vu votre brief pour la campagne été. Je suis très intéressé par une collaboration.", time: "10:15", isOwn: true, isRead: true },
      { id: "m2", content: "Bonjour ! Merci pour votre intérêt. Votre profil correspond parfaitement à notre cible. Qu'en pensez-vous ?", time: "10:20", isOwn: false, isRead: true },
      { id: "m3", content: "C'est très intéressant ! Je peux vous proposer plusieurs formats : stories, reels, posts statiques. Quel format préférez-vous ?", time: "10:25", isOwn: true, isRead: true },
      { id: "m4", content: "Excellent ! Nous aimerions un mix de formats. Pouvez-vous nous envoyer quelques idées de contenus ?", time: "10:30", isOwn: false, isRead: true },
      { id: "m5", content: "Voici 3 concepts différents adaptés à votre marque : unboxing naturel, routine matinale, avant/après 30 jours", time: "11:45", isOwn: true, isRead: true },
      { id: "m6", content: "J'adore le concept avant/après ! On peut en discuter plus en détail ? Notre budget est de 2500€ pour cette campagne.", time: "14:20", isOwn: false, isRead: true },
      { id: "m7", content: "Perfect ! On finalise les détails de la campagne demain ?", time: "14:30", isOwn: false, isRead: false },
    ],
    unreadCount: 2,
    isImportant: true,
    isArchived: false,
  },
  {
    id: "2",
    company: {
      name: "TechFlow",
      avatar: "TF",
      sector: "Technologie & Gadgets",
      size: "200-500 employés",
      location: "Lyon, France",
      website: "www.techflow.com",
      email: "marketing@techflow.com",
      description: "Distributeur d'accessoires tech et gadgets innovants. Nous cherchons des influenceurs tech pour présenter nos derniers produits.",
      isOnline: false,
    },
    lastMessage: { content: "Merci pour les photos ! Elles sont parfaites 👍", time: "Hier", isOwn: true },
    messages: [
      { id: "m1", content: "Bonjour TechFlow ! La campagne pour vos écouteurs sans fil est terminée. Je vous envoie les contenus.", time: "Hier 09:00", isOwn: true, isRead: true },
      { id: "m2", content: "Super ! Pouvez-vous nous envoyer les visuels haute résolution ?", time: "Hier 09:15", isOwn: false, isRead: true },
      { id: "m3", content: "Bien sûr, je vous envoie tout ça par WeTransfer dans 5 minutes.", time: "Hier 09:20", isOwn: true, isRead: true },
      { id: "m4", content: "Merci pour les photos ! Elles sont parfaites 👍", time: "Hier 10:00", isOwn: true, isRead: true },
    ],
    unreadCount: 0,
    isImportant: false,
    isArchived: false,
  },
  {
    id: "3",
    company: {
      name: "SummerVibes",
      avatar: "SV",
      sector: "Mode & Lifestyle",
      size: "20-50 employés",
      location: "Nice, France",
      website: "www.summervibes.fr",
      email: "collab@summervibes.fr",
      description: "Marque de vêtements d'été et accessoires de plage. Nous collaborons avec des créateurs qui partagent notre amour du soleil et de la mer.",
      isOnline: true,
    },
    lastMessage: { content: "J'ai envoyé le brief détaillé par email", time: "Lun", isOwn: false },
    messages: [
      { id: "m1", content: "Hello SummerVibes ! Ça fait longtemps qu'on n'a pas travaillé ensemble 😊", time: "Lun 08:00", isOwn: true, isRead: true },
      { id: "m2", content: "Salut ! Oui carrément. On a une nouvelle collection qui devrait te plaire. Intéressé par une nouvelle collab ?", time: "Lun 08:30", isOwn: false, isRead: true },
      { id: "m3", content: "J'ai envoyé le brief détaillé par email avec les conditions et le budget.", time: "Lun 09:00", isOwn: false, isRead: false },
    ],
    unreadCount: 1,
    isImportant: false,
    isArchived: false,
  },
  {
    id: "4",
    company: {
      name: "FitnessPro",
      avatar: "FP",
      sector: "Sport & Nutrition",
      size: "100-200 employés",
      location: "Marseille, France",
      website: "www.fitnesspro.fr",
      email: "partnerships@fitnesspro.fr",
      description: "Marque de compléments alimentaires et équipements sportifs. Nous recherchons des influenceurs fitness pour des campagnes de transformation.",
      isOnline: false,
    },
    lastMessage: { content: "Budget approuvé ! Quand pouvez-vous commencer ?", time: "Mar", isOwn: false },
    messages: [
      { id: "m1", content: "Bonjour FitnessPro, voici ma proposition pour votre campagne transformation 90 jours.", time: "Mar 14:00", isOwn: true, isRead: true },
      { id: "m2", content: "Intéressant ! Quel est le budget estimé pour l'ensemble de la campagne ?", time: "Mar 14:30", isOwn: false, isRead: true },
      { id: "m3", content: "Entre 3000€ et 3500€ selon les livrables et la durée de la campagne.", time: "Mar 15:00", isOwn: true, isRead: true },
      { id: "m4", content: "Budget approuvé ! Quand pouvez-vous commencer ?", time: "Mar 16:00", isOwn: false, isRead: false },
    ],
    unreadCount: 3,
    isImportant: true,
    isArchived: false,
  },
]

export default function MessagerieSection() {
  const [activeConversation, setActiveConversation] = useState("1")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState(null)

  const activeConv = conversations.find(c => c.id === activeConversation)

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch =
      conv.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.company.sector.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "all" ? true :
      filterType === "unread" ? conv.unreadCount > 0 :
      filterType === "important" ? conv.isImportant : true
    return matchesSearch && matchesFilter && !conv.isArchived
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Messagerie</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Chat Direct • Notifications Push • Historique Organisé</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {conversations.length} conversations
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} non lus
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
          Toutes
        </Button>
        <Button variant={filterType === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilterType("unread")}>
          <Bell className="h-4 w-4 mr-1" />Non lues
        </Button>
        <Button variant={filterType === "important" ? "default" : "outline"} size="sm" onClick={() => setFilterType("important")}>
          <Star className="h-4 w-4 mr-1" />Importantes
        </Button>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-320px)]">
        {/* Liste conversations */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  activeConversation === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="relative cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setSelectedCompany(conv.company) }}
                  >
                    <Avatar className="h-12 w-12 hover:ring-2 hover:ring-primary transition-all">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {conv.company.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conv.company.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-semibold text-sm truncate cursor-pointer hover:text-primary transition-colors"
                          onClick={(e) => { e.stopPropagation(); setSelectedCompany(conv.company) }}
                        >
                          {conv.company.name}
                        </h3>
                        {conv.isImportant && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.lastMessage.time}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              {conv.isImportant ? "Retirer" : "Marquer importante"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archiver
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{conv.company.sector}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conv.lastMessage.isOwn && (
                          <CheckCheck className="inline h-3 w-3 mr-1 text-primary" />
                        )}
                        {conv.lastMessage.content}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center text-xs px-1.5">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>

        {/* Fenêtre de chat */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => setSelectedCompany(activeConv.company)}
                  >
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {activeConv.company.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3
                      className="font-semibold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setSelectedCompany(activeConv.company)}
                    >
                      {activeConv.company.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeConv.company.sector} • {activeConv.company.isOnline ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline"><Phone className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline"><Video className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeConv.messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'justify-end' : ''}`}>
                      {!msg.isOwn && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {activeConv.company.avatar}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${msg.isOwn ? 'items-end' : ''}`}>
                        <div className={`${msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 max-w-[80%]`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{msg.time}</p>
                          {msg.isOwn && (
                            msg.isRead
                              ? <CheckCheck className="h-3 w-3 text-primary" />
                              : <Check className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-end gap-3">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline"><Paperclip className="h-4 w-4" /></Button>
                    <Button size="icon"><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modal Profil Entreprise */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {selectedCompany?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{selectedCompany?.name}</h2>
                <p className="text-sm text-muted-foreground font-normal">{selectedCompany?.sector}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                À propos
              </h3>
              <p className="text-sm text-muted-foreground">{selectedCompany?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Taille:</span>
                  <span className="font-medium">{selectedCompany?.size}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Localisation:</span>
                  <span className="font-medium">{selectedCompany?.location}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://${selectedCompany?.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedCompany?.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedCompany?.email}`} className="text-primary hover:underline">
                    {selectedCompany?.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1" variant="outline">
                <Phone className="h-4 w-4 mr-2" />Appeler
              </Button>
              <Button className="flex-1" variant="outline">
                <Video className="h-4 w-4 mr-2" />Visio
              </Button>
              <Button className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}