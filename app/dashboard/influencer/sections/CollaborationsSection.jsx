'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import {
  Search, Calendar, DollarSign, Eye, TrendingUp,
  Clock, Upload, FileText, Download, Zap, Brain, Award, BarChart3,
  AlertCircle, CheckCircle, Package, MessageSquare, Star, Lock,
} from 'lucide-react'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'
import { useLevel } from "@/lib/context/LevelContext"
import LevelGate from '@/components/LevelGate'

/* ============================================================
   COMPOSANT INTÉRIEUR
   ============================================================ */
function CollaborationsContent({ user }) {
  const { canAccess, score: userScore } = useLevel()
  const canAccessDetailed = canAccess('detailedCollabTracking') // Or (500 pts)

  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [contracts, setContracts] = useState([])
  const [contentPosts, setContentPosts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    try {
      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!influencer) {
        setLoading(false)
        return
      }

      const [collabRes, appRes, contractRes, postsRes, txRes] = await Promise.allSettled([
        supabase
          .from('collaborations')
          .select('*, campaigns(id, title, description, cover_url), brands(id, company_name, logo_url)')
          .eq('influencer_id', influencer.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('applications')
          .select('*, campaigns(title, description, budget_per_influencer_min, budget_per_influencer_max)')
          .eq('influencer_id', influencer.id)
          .order('applied_at', { ascending: false }),

        supabase
          .from('contracts')
          .select('*, brands(company_name)')
          .eq('influencer_id', influencer.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('content_posts')
          .select('*')
          .eq('influencer_id', influencer.id),

        supabase
          .from('transactions')
          .select('*')
          .eq('influencer_id', influencer.id)
          .order('created_at', { ascending: false }),
      ])

      setCollaborations(collabRes.status === 'fulfilled' ? collabRes.value.data || [] : [])
      setApplications(appRes.status === 'fulfilled' ? appRes.value.data || [] : [])
      setContracts(contractRes.status === 'fulfilled' ? contractRes.value.data || [] : [])
      setContentPosts(postsRes.status === 'fulfilled' ? postsRes.value.data || [] : [])
      setTransactions(txRes.status === 'fulfilled' ? txRes.value.data || [] : [])
    } catch (err) {
      console.warn('CollaborationsSection fetch error', err)
    } finally {
      setLoading(false)
    }
  }

  const activeCollaborations = collaborations.filter(c => ['in_progress', 'accepted'].includes(c.status))
  const completedCollaborations = collaborations.filter(c => c.status === 'completed')

  const totalViews = contentPosts.reduce((sum, p) => sum + (p.views || 0), 0)
  const avgEngagement = contentPosts.length > 0
    ? (contentPosts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / contentPosts.length).toFixed(1)
    : '0.0'
  const totalContractValue = contracts.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)

  const filterCollaborations = (list) => list.filter(c =>
    (c.campaigns?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.brands?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'En cours'
      case 'accepted': return 'Acceptée'
      case 'completed': return 'Terminée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const getContractForCollab = (collab) => contracts.find(c => c.collaboration_id === collab.id)
  const contractStatusLabel = (s) => ({ signed: 'Signé', completed: 'Terminé', draft: 'Brouillon', sent: 'Envoyé', disputed: 'Litige', cancelled: 'Annulé' }[s] || s || '—')
  const getPostsForCollab = (collab) => contentPosts.filter(p => p.collaboration_id === collab.id)
  const getTransactionForCollab = (collab) => transactions.find(t => t.collaboration_id === collab?.id) || null

  // Statut de paiement -> libellé + style + icône
  const PAYMENT_STATUS = {
    released: { label: 'Versé', cls: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
    in_escrow: { label: 'Sous séquestre', cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Lock },
    pending: { label: 'En attente', cls: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
    disputed: { label: 'En litige', cls: 'bg-red-500/10 text-red-600 border-red-500/20', icon: AlertCircle },
    refunded: { label: 'Remboursé', cls: 'bg-muted text-muted-foreground border-border', icon: Package },
  }

  // Jours restants avant une échéance (négatif = dépassé)
  const daysUntil = (dateStr) => {
    if (!dateStr) return null
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  }

  const fmtMoney = (n) => `${Number(n || 0).toLocaleString('fr-FR')}€`

  // Normalise un livrable (string OU objet) -> { name, echeance, st{label,dot,badge,done} }
  const normalizeDeliverable = (d, i) => {
    const name = typeof d === 'string' ? d : (d?.name || d?.label || d?.title || `Livrable ${i + 1}`)
    const rawDate = (d && typeof d === 'object') ? (d.deadline || d.echeance || d.due_date || d.date || null) : null
    const echeance = rawDate ? new Date(rawDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : null
    const s = ((d && typeof d === 'object') ? (d.status || d.state || '') : '').toString().toLowerCase()
    let st
    if (['approved', 'approuve', 'approuvé', 'validated', 'valide', 'validé'].includes(s))
      st = { label: 'Approuvé', dot: 'bg-green-500', badge: 'bg-green-500/10 text-green-600 border-green-500/20', done: true }
    else if (['delivered', 'livre', 'livré', 'submitted', 'soumis', 'sent', 'envoye', 'envoyé'].includes(s))
      st = { label: 'Livré', dot: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20', done: true }
    else
      st = { label: 'En attente', dot: 'bg-gray-400', badge: 'bg-muted text-muted-foreground border-border', done: false }
    return { name, echeance, st }
  }

  const handleDownloadPDF = async (contract) => {
    if (!contract?.id) { toast.error('Aucun contrat à télécharger'); return }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) { toast.error('Session expirée, reconnecte-toi'); return }
      toast.loading('Génération du contrat…', { id: 'dl-contract' })
      const res = await fetch(`/api/influencer/contract-pdf?contractId=${contract.id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) { const e = await res.json().catch(() => ({})); toast.error(e.error || 'Impossible de générer le contrat', { id: 'dl-contract' }); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contrat-${(contract.brands?.company_name || 'partnexx').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
      toast.success('Contrat téléchargé', { id: 'dl-contract' })
    } catch {
      toast.error('Erreur réseau', { id: 'dl-contract' })
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Non défini'
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des collaborations...</p>
        </div>
      </div>
    )
  }

  /* ============================================================
     COMPOSANT : Card collab BASIQUE (Bronze) - simplifié
     ============================================================ */
  const CollabCardBasic = ({ collab, isCompleted = false }) => {
    const contract = getContractForCollab(collab)
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 border-2 border-border shrink-0">
                <AvatarFallback className={`font-bold ${isCompleted ? 'bg-gradient-to-br from-muted to-muted-foreground/20' : 'bg-gradient-to-br from-primary to-accent text-white'}`}>
                  {collab.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{collab.campaigns?.title || 'Campagne'}</h3>
                <p className="text-sm text-muted-foreground truncate">{collab.brands?.company_name || 'Marque'}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(collab.created_at)}</span>
                  {contract && <span className="flex items-center gap-1 text-green-600 font-semibold"><DollarSign className="h-3 w-3" />{parseFloat(contract.amount).toLocaleString()}€</span>}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={isCompleted ? 'bg-muted text-muted-foreground' : 'bg-green-500/10 text-green-600 border-green-500/20'}>
              {isCompleted ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
              {getStatusLabel(collab.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Mes collaborations</h1>
            <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
              <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Partenariats Actifs • Historique Complet • Performance Détaillée</p>
        </div>
      </div>

      {/* Stats — toujours visibles (Bronze) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">Réel</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalContractValue.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">Valeur contrats</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10"><BarChart3 className="h-5 w-5 text-blue-600" /></div>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">Réel</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgEngagement}%</p>
            <p className="text-sm text-muted-foreground">Engagement moyen</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10"><Eye className="h-5 w-5 text-purple-600" /></div>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Réel</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}K` : '0'}</p>
            <p className="text-sm text-muted-foreground">Vues totales</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10"><Award className="h-5 w-5 text-orange-600" /></div>
              <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">Réel</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{collaborations.length}</p>
            <p className="text-sm text-muted-foreground">Collaborations</p>
          </CardContent>
        </Card>
      </div>

      {/* Bandeau incitatif si pas Or */}
      {!canAccessDetailed && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30">
          <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-yellow-700">
                  Suivi détaillé verrouillé <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 ml-2">🥇 Or</Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                  Débloque les livrables, performance des contenus et analytics détaillés en passant Or
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Plus que <span className="text-yellow-600">{Math.max(0, 500 - userScore)} pts</span></p>
              <div className="w-32 h-2 bg-yellow-500/20 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${Math.min((userScore / 500) * 100, 100)}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher une campagne..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-0 h-auto">
          <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-green-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20"><Zap className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">En cours</span><span className="text-xs opacity-80">({activeCollaborations.length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-blue-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20"><Package className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Historique</span><span className="text-xs opacity-80">({completedCollaborations.length})</span></div>
          </TabsTrigger>
          <TabsTrigger value="candidatures" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl border-2 border-border/50 data-[state=active]:border-purple-400 bg-card h-auto py-4 px-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20"><FileText className="h-5 w-5" /></div>
            <div className="flex flex-col items-start"><span className="font-semibold">Candidatures</span><span className="text-xs opacity-80">({applications.length})</span></div>
          </TabsTrigger>
        </TabsList>

        {/* Tab : En cours */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {filterCollaborations(activeCollaborations).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune collaboration en cours</h3>
                <p className="text-sm text-muted-foreground">Vos collaborations actives apparaîtront ici</p>
              </CardContent>
            </Card>
          ) : !canAccessDetailed ? (
            /* === VUE BASIQUE (Bronze/Argent) === */
            <div className="space-y-3">
              {filterCollaborations(activeCollaborations).map((collab) => (
                <CollabCardBasic key={collab.id} collab={collab} />
              ))}
            </div>
          ) : (
            /* === VUE DÉTAILLÉE (Or+) === */
            filterCollaborations(activeCollaborations).map((collab) => {
              const contract = getContractForCollab(collab)
              const posts = getPostsForCollab(collab)
              const collabViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
              const collabEngagement = posts.length > 0
                ? (posts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / posts.length).toFixed(1)
                : '0.0'
              const deliverables = Array.isArray(collab.deliverables) ? collab.deliverables : []

              return (
                <Card key={collab.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 border-2 border-primary/30 shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
                            {collab.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{collab.campaigns?.title || 'Campagne'}</CardTitle>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />Vérifié
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{collab.brands?.company_name || 'Marque'}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 animate-pulse">
                        <Clock className="h-3 w-3 mr-1" />{getStatusLabel(collab.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-dashed hover:border-solid transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Créée le</p>
                              <p className="text-sm font-semibold mt-1">{formatDate(collab.created_at)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed hover:border-solid transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Montant contrat</p>
                              <p className="text-sm font-semibold text-green-600 mt-1">
                                {contract ? `${parseFloat(contract.amount).toLocaleString()}€` : 'Non défini'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed hover:border-solid transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10"><Eye className="h-5 w-5 text-blue-600" /></div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Vues / Engagement</p>
                              <p className="text-sm font-semibold mt-1">
                                {collabViews > 0 ? `${(collabViews / 1000).toFixed(1)}K` : '0'} • {collabEngagement}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {deliverables.length > 0 && (() => {
                      const items = deliverables.map(normalizeDeliverable)
                      const approved = items.filter((x) => x.st.label === 'Approuvé').length
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />Livrables ({items.length})
                            </h4>
                            <Badge variant="outline" className="text-xs">{approved} approuvé{approved > 1 ? 's' : ''}</Badge>
                          </div>
                          <div className="space-y-2">
                            {items.map((it, i) => (
                              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${it.st.dot}`} />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{it.name}</p>
                                    {it.echeance && (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" />Échéance : {it.echeance}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge variant="outline" className={`text-xs ${it.st.badge}`}>
                                    {it.st.label === 'Approuvé' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {it.st.label === 'Livré' && <Upload className="h-3 w-3 mr-1" />}
                                    {it.st.label === 'En attente' && <Clock className="h-3 w-3 mr-1" />}
                                    {it.st.label}
                                  </Badge>
                                  {!it.st.done && (
                                    <Button size="sm" className="gap-1" onClick={() => toast('Envoi de livrable bientôt disponible')}><Upload className="h-3 w-3" />Envoyer</Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}

                    {posts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <BarChart3 className="h-4 w-4 text-primary" />Contenus publiés ({posts.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {posts.map((post) => (
                            <div key={post.id} className="p-3 rounded-lg border bg-muted/30">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs capitalize">{post.platform}</Badge>
                                <Badge variant="outline" className="text-xs capitalize">{post.content_type}</Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-xs text-center">
                                <div><p className="font-bold">{(post.views || 0).toLocaleString()}</p><p className="text-muted-foreground">Vues</p></div>
                                <div><p className="font-bold text-pink-600">{parseFloat(post.engagement_rate || 0).toFixed(1)}%</p><p className="text-muted-foreground">Eng.</p></div>
                                <div><p className="font-bold text-green-600">{post.likes || 0}</p><p className="text-muted-foreground">Likes</p></div>
                              </div>
                              {post.post_url && (
                                <Button size="sm" variant="outline" className="w-full mt-2 text-xs" onClick={() => window.open(post.post_url, '_blank')}>
                                  Voir le post
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button
                        className="w-full gap-2 h-12 text-base"
                        onClick={() => { setSelectedCollab({ ...collab, contract, posts }); setIsDetailsDialogOpen(true) }}
                      >
                        <Eye className="h-5 w-5" />Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Tab : Historique */}
        <TabsContent value="history" className="space-y-4 mt-6">
          {filterCollaborations(completedCollaborations).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune collaboration terminée</h3>
                <p className="text-sm text-muted-foreground">Votre historique apparaîtra ici</p>
              </CardContent>
            </Card>
          ) : !canAccessDetailed ? (
            /* === VUE BASIQUE === */
            <div className="space-y-3">
              {filterCollaborations(completedCollaborations).map((collab) => (
                <CollabCardBasic key={collab.id} collab={collab} isCompleted />
              ))}
            </div>
          ) : (
            /* === VUE DÉTAILLÉE === */
            filterCollaborations(completedCollaborations).map((collab) => {
              const contract = getContractForCollab(collab)
              const posts = getPostsForCollab(collab)
              const collabViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
              const collabEngagement = posts.length > 0
                ? (posts.reduce((sum, p) => sum + parseFloat(p.engagement_rate || 0), 0) / posts.length).toFixed(1)
                : '0.0'

              return (
                <Card key={collab.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 border-2 border-border shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-muted to-muted-foreground/20 font-bold text-lg">
                            {collab.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{collab.campaigns?.title || 'Campagne'}</h3>
                          <p className="text-sm text-muted-foreground">{collab.brands?.company_name || 'Marque'}</p>
                        </div>
                      </div>
                      <Badge className="bg-muted text-muted-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />Terminée
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Créée le</p>
                        <p className="text-sm font-medium">{formatDate(collab.created_at)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/5">
                        <p className="text-xs text-muted-foreground mb-1">Montant</p>
                        <p className="text-sm font-semibold text-green-600">
                          {contract ? `${parseFloat(contract.amount).toLocaleString()}€` : 'Non défini'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-500/5">
                        <p className="text-xs text-muted-foreground mb-1">Vues totales</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {collabViews > 0 ? `${(collabViews / 1000).toFixed(1)}K` : '0'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/5">
                        <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                        <p className="text-sm font-semibold text-purple-600">{collabEngagement}%</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => { setSelectedCollab({ ...collab, contract, posts }); setIsContractDialogOpen(true) }}
                      >
                        <FileText className="h-4 w-4" />Contrat
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => { setSelectedCollab({ ...collab, contract, posts }); setIsDetailsDialogOpen(true) }}
                      >
                        <Eye className="h-4 w-4" />Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Tab : Candidatures (toujours accessible) */}
        <TabsContent value="candidatures" className="space-y-4 mt-6">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Aucune candidature</h3>
                <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore postulé à des campagnes</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {app.cover_letter?.match(/^\[(.+?)\]/)?.[1] || app.campaigns?.title || 'Campagne'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {app.cover_letter?.replace(/^\[.+?\]\s*/, '') || ''}
                      </p>
                    </div>
                    <Badge className={
                      app.status === 'accepted' ? 'bg-green-500/10 text-green-600 border-green-500/20 ml-4' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/20 ml-4' :
                      'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 ml-4'
                    }>
                      {app.status === 'accepted' ? <><CheckCircle className="h-3 w-3 mr-1" />Acceptée</> :
                       app.status === 'rejected' ? 'Refusée' :
                       <><Clock className="h-3 w-3 mr-1" />En attente</>}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />Postulé le {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                    </span>
                    {app.campaigns?.budget_per_influencer_min && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />{app.campaigns.budget_per_influencer_min} - {app.campaigns.budget_per_influencer_max}€
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Détails — vue complète */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto overflow-x-hidden p-0" style={{ width: '880px', maxWidth: '92vw' }}>
          {selectedCollab && (() => {
            const c = selectedCollab
            const contract = c.contract
            const posts = c.posts || []
            const tx = getTransactionForCollab(c)
            const gross = tx?.amount ?? contract?.amount ?? c.agreed_rate ?? null
            const pay = tx ? (PAYMENT_STATUS[tx.status] || PAYMENT_STATUS.pending) : null
            const PayIcon = pay?.icon || Clock
            const deadline = c.deadline || contract?.deadline || null
            const dLeft = daysUntil(deadline)
            const deliverables = Array.isArray(c.deliverables) ? c.deliverables
              : (Array.isArray(contract?.deliverables) ? contract.deliverables : [])
            const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0)
            const totalLikes = posts.reduce((s, p) => s + (p.likes || 0), 0)
            const avgEng = posts.length > 0
              ? (posts.reduce((s, p) => s + parseFloat(p.engagement_rate || 0), 0) / posts.length).toFixed(1)
              : '0.0'

            return (
              <>
                {/* En-tête avec bannière */}
                <DialogHeader className="p-0 space-y-0 text-left">
                  <div className="relative h-24 sm:h-28 bg-gradient-to-r from-primary via-accent to-secondary">
                    {c.campaigns?.cover_url && (
                      <img src={c.campaigns.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="px-6 pb-2">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 -mt-8 sm:-mt-10 border-4 border-background shadow-xl relative z-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-xl sm:text-2xl">
                        {c.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <DialogTitle className="text-lg sm:text-2xl font-bold leading-tight">{c.campaigns?.title || 'Collaboration'}</DialogTitle>
                        <DialogDescription className="mt-0.5">avec {c.brands?.company_name || 'Marque'}</DialogDescription>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Vérifié</Badge>
                        <Badge variant="outline" className={c.status === 'completed' ? 'bg-muted text-muted-foreground' : 'bg-green-500/10 text-green-600 border-green-500/20'}>
                          <Clock className="h-3 w-3 mr-1" />{getStatusLabel(c.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-6">
                  {/* Description campagne */}
                  {c.campaigns?.description && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />À propos de la campagne</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.campaigns.description}</p></CardContent>
                    </Card>
                  )}

                  {/* Infos clés */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl border bg-green-500/5">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="h-4 w-4 text-green-600" /><span className="text-xs">Montant</span></div>
                      <p className="text-lg font-bold text-green-600">{gross != null ? fmtMoney(gross) : 'Non défini'}</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-muted/40">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calendar className="h-4 w-4" /><span className="text-xs">Créée le</span></div>
                      <p className="text-sm font-semibold">{formatDate(c.created_at)}</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-muted/40">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1"><Clock className="h-4 w-4" /><span className="text-xs">Deadline</span></div>
                      <p className="text-sm font-semibold">{deadline ? formatDate(deadline) : 'Non défini'}</p>
                      {dLeft != null && (
                        <p className={`text-xs mt-0.5 ${dLeft < 0 ? 'text-red-600' : dLeft <= 7 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                          {dLeft < 0 ? `Dépassée de ${Math.abs(dLeft)} j` : dLeft === 0 ? "Aujourd'hui" : `Dans ${dLeft} j`}
                        </p>
                      )}
                    </div>
                    <div className="p-4 rounded-xl border bg-muted/40">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1"><PayIcon className="h-4 w-4" /><span className="text-xs">Paiement</span></div>
                      {pay ? (
                        <Badge variant="outline" className={pay.cls}>{pay.label}</Badge>
                      ) : (
                        <p className="text-sm font-semibold text-muted-foreground">Non initié</p>
                      )}
                    </div>
                  </div>

                  {/* Détail financier (si transaction) */}
                  {tx && (
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Détail du paiement</CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{fmtMoney(tx.amount)}</p>
                            <p className="text-xs text-muted-foreground">Montant brut</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold text-orange-600">- {fmtMoney(tx.platform_fee)}</p>
                            <p className="text-xs text-muted-foreground">Commission Partnexx</p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-500/10">
                            <p className="text-lg font-bold text-green-600">{fmtMoney(tx.influencer_amount)}</p>
                            <p className="text-xs text-muted-foreground">Net pour toi</p>
                          </div>
                        </div>
                        {tx.released_at && (
                          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-600" />Versé le {formatDate(tx.released_at)}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Contrat */}
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Contrat</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {contract ? (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div><p className="text-xs text-muted-foreground mb-1">N° de contrat</p><p className="text-sm font-semibold">#{contract.id.slice(0, 8)}</p></div>
                            <div><p className="text-xs text-muted-foreground mb-1">Statut</p><p className="text-sm font-semibold">{contractStatusLabel(contract.status)}</p></div>
                            <div><p className="text-xs text-muted-foreground mb-1">Deadline</p><p className="text-sm font-semibold">{contract.deadline ? formatDate(contract.deadline) : 'Non défini'}</p></div>
                          </div>
                          <Button variant="outline" className="w-full gap-2" onClick={() => handleDownloadPDF(contract)}><Download className="h-4 w-4" />Télécharger le PDF</Button>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun contrat associé pour le moment.</p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Livrables */}
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Package className="h-4 w-4 text-primary" />Livrables{deliverables.length > 0 ? ` (${deliverables.length})` : ''}</CardTitle></CardHeader>
                    <CardContent>
                      {deliverables.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun livrable défini pour cette collaboration.</p>
                      ) : (
                        <div className="space-y-2">
                          {deliverables.map((d, i) => {
                            const label = typeof d === 'string' ? d : (d?.label || d?.name || `Livrable ${i + 1}`)
                            return (
                              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="h-4 w-4 text-primary" /></div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{label}</p>
                                    <Badge variant="outline" className="mt-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[10px]">À livrer</Badge>
                                  </div>
                                </div>
                                <Button size="sm" className="gap-1 shrink-0" onClick={() => toast('Envoi de livrable bientôt disponible')}><Upload className="h-3 w-3" />Envoyer</Button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Performance des contenus */}
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Performance des contenus</CardTitle></CardHeader>
                    <CardContent>
                      {posts.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <Eye className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">Aucun contenu publié pour cette collaboration</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                            <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xl font-bold text-blue-600">{totalViews.toLocaleString()}</p><p className="text-xs text-muted-foreground">Vues</p></div>
                            <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xl font-bold text-pink-600">{totalLikes.toLocaleString()}</p><p className="text-xs text-muted-foreground">Likes</p></div>
                            <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xl font-bold text-green-600">{avgEng}%</p><p className="text-xs text-muted-foreground">Engagement</p></div>
                          </div>
                          <div className="space-y-2">
                            {posts.map((post) => (
                              <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="capitalize">{post.platform}</Badge>
                                  <Badge variant="outline" className="capitalize">{post.content_type}</Badge>
                                  {post.published_at && <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>}
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-blue-600">{(post.views || 0).toLocaleString()} vues</span>
                                  <span className="text-pink-600">{post.likes || 0} likes</span>
                                  {post.post_url && (<Button size="sm" variant="outline" onClick={() => window.open(post.post_url, '_blank')}>Voir</Button>)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog Contrat (Or only) */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <FileText className="h-6 w-6" />Contrat de collaboration
            </DialogTitle>
            <DialogDescription>{selectedCollab?.campaigns?.title} - {selectedCollab?.brands?.company_name}</DialogDescription>
          </DialogHeader>

          {selectedCollab && (
            <div className="space-y-6 mt-4">
              <Card>
                <CardHeader><CardTitle>Informations contractuelles</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-muted-foreground mb-1">Marque</p><p className="font-semibold">{selectedCollab.brands?.company_name || 'Non défini'}</p></div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Montant</p>
                      <p className="font-semibold text-green-600">
                        {selectedCollab.contract ? `${parseFloat(selectedCollab.contract.amount).toLocaleString()}€` : 'Non défini'}
                      </p>
                    </div>
                    <div><p className="text-sm text-muted-foreground mb-1">Statut contrat</p><p className="font-semibold capitalize">{selectedCollab.contract?.status || 'Non disponible'}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Deadline</p><p className="font-semibold">{selectedCollab.contract?.deadline ? formatDate(selectedCollab.contract.deadline) : 'Non défini'}</p></div>
                  </div>

                  {selectedCollab.contract?.deliverables && Array.isArray(selectedCollab.contract.deliverables) && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Livrables</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollab.contract.deliverables.map((d, i) => (
                          <Badge key={i} variant="secondary">{d}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleDownloadPDF(selectedCollab.contract)}
                >
                  <Download className="h-4 w-4" />Télécharger PDF
                </Button>
                {selectedCollab.contract?.pdf_url && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => window.open(selectedCollab.contract.pdf_url, '_blank')}
                  >
                    <Eye className="h-4 w-4" />Voir le PDF
                  </Button>
                )}
              </div>

              {!selectedCollab.contract && (
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Aucun contrat associé à cette collaboration</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ============================================================
   EXPORT PRINCIPAL : wrappé par LevelGate
   ============================================================ */
export default function CollaborationsSection({ user }) {
  return (
    <LevelGate
      user={user}
      sectionTitle="Mes collaborations"
      sectionDescription="Partenariats Actifs • Historique Complet • Performance Détaillée"
    >
      <CollaborationsContent user={user} />
    </LevelGate>
  )
}
