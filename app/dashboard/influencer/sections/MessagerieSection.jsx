'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState, useEffect, useRef } from 'react'
import {
  Search, MessageCircle, Send, Paperclip, Phone, Video,
  MoreVertical, Check, CheckCheck, Plus, Bell, Brain,
  Archive, Trash2, Star,
} from 'lucide-react'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'

export default function MessagerieSection() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState(null)
  const [influencerId, setInfluencerId] = useState(null)
  const messagesEndRef = useRef(null)

  // Charger user + conversations
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      // Récupérer l'id influenceur
      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (influencer) {
        setInfluencerId(influencer.id)
        fetchConversations(influencer.id)
      }
      setLoading(false)
    }
    init()
  }, [])

  // Scroll auto vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime messages
  useEffect(() => {
    if (!activeConversation) return

    const channel = supabase
      .channel(`messages:${activeConversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConversation.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [activeConversation])

  const fetchConversations = async (infId) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, brands(id, company_name, logo_url)')
      .eq('influencer_id', infId)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false })

    if (!error && data) setConversations(data)
  }

  const fetchMessages = async (conversationId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('inserted_at', { ascending: true })

    if (!error && data) setMessages(data)
  }

  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv)
    await fetchMessages(conv.id)

    // Marquer comme lu
    if (conv.influencer_unread > 0) {
      await supabase
        .from('conversations')
        .update({ influencer_unread: 0 })
        .eq('id', conv.id)

      setConversations(prev => prev.map(c =>
        c.id === conv.id ? { ...c, influencer_unread: 0 } : c
      ))
    }
  }

  const handleSend = async () => {
    if (!message.trim() || !activeConversation || !userId) return
    setSending(true)

    const { error } = await supabase.from('messages').insert({
  conversation_id: activeConversation.id,
  sender_id: userId,
  content: message.trim(),
  type: 'text',
  is_deleted: false,
})

    if (error) {
      toast.error("Erreur lors de l'envoi du message")
      console.error(error)
    } else {
      // Mettre à jour last_message de la conversation
      await supabase
        .from('conversations')
        .update({
          last_message: message.trim(),
          last_message_at: new Date().toISOString(),
          brand_unread: (activeConversation.brand_unread || 0) + 1,
        })
        .eq('id', activeConversation.id)

      setMessage("")
    }
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.brands?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = conversations.reduce((sum, c) => sum + (c.influencer_unread || 0), 0)

  const getBrandInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / 86400000)
    if (days === 0) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    if (days === 1) return 'Hier'
    if (days < 7) return date.toLocaleDateString('fr-FR', { weekday: 'short' })
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Messagerie</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Chat Direct • Temps Réel • Historique Organisé</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />{conversations.length} conversations
          </Badge>
          {totalUnread > 0 && (
            <Badge className="flex items-center gap-2 bg-primary">
              <Bell className="h-4 w-4" />{totalUnread} non lus
            </Badge>
          )}
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-320px)]">

        {/* Liste conversations */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Chargement...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">Aucune conversation</p>
                <p className="text-xs text-muted-foreground mt-1">Les marques peuvent vous contacter ici</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${activeConversation?.id === conv.id ? "bg-muted" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getBrandInitials(conv.brands?.company_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">{conv.brands?.company_name || 'Marque'}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(conv.last_message_at)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">{conv.last_message || 'Aucun message'}</p>
                        {conv.influencer_unread > 0 && (
                          <Badge className="h-5 min-w-5 flex items-center justify-center text-xs px-1.5">{conv.influencer_unread}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </Card>

        {/* Fenêtre de chat */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {activeConversation ? (
            <>
              {/* Header chat */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getBrandInitials(activeConversation.brands?.company_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeConversation.brands?.company_name || 'Marque'}</h3>
                    <p className="text-sm text-muted-foreground">{messages.length} messages</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline"><Phone className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline"><Video className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">Aucun message pour l&apos;instant</p>
                      <p className="text-xs text-muted-foreground mt-1">Envoyez le premier message !</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender_id === userId
                      return (
                        <div key={msg.id} className={`flex gap-3 ${isOwn ? 'justify-end' : ''}`}>
                          {!isOwn && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getBrandInitials(activeConversation.brands?.company_name)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`flex flex-col ${isOwn ? 'items-end' : ''}`}>
                            <div className={`${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 max-w-[80%]`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <p className="text-xs text-muted-foreground">{formatTime(msg.inserted_at)}</p>
                              {isOwn && (
                                msg.is_read
                                  ? <CheckCheck className="h-3 w-3 text-primary" />
                                  : <Check className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-3">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tapez votre message... (Entrée pour envoyer)"
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline"><Paperclip className="h-4 w-4" /></Button>
                    <Button size="icon" onClick={handleSend} disabled={sending || !message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Sélectionnez une conversation</h3>
                <p className="text-sm text-muted-foreground">Choisissez une conversation dans la liste pour commencer à chatter</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}