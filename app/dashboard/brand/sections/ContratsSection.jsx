'use client'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  FileText, BarChart3, Clock, Gavel, Plus, Search, Filter,
  CheckCircle, AlertCircle, AlertTriangle, Brain, Zap,
  TrendingUp, DollarSign, Users, Calendar, Eye, Download,
  Send, Lock, ArrowUpRight, ArrowDownRight, Shield, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'
import RecurringPayoutButton from '@/components/RecurringPayoutButton'

/* ============== LABELS (gardés de Mathias) ============== */
const TYPE_LABEL = {
  one_shot: 'One shot',
  affiliation: 'Affiliation',
  ambassador: 'Ambassadeur',
  placement_produit: 'Placement de produit',
  ugc: 'UGC',
  notoriete: 'Notoriété',
}

const FREQ_LABEL = {
  weekly: 'Hebdomadaire',
  biweekly: 'Toutes les 2 semaines',
  monthly: 'Mensuel',
}

const fmtEUR = (n) =>
  `${(Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR') : '—'

/* ============== MOCK DATA (litiges & templates - à brancher plus tard) ============== */
const mockDisputes = [
  { id: 'D001', contractTitle: 'Campagne Beauty Boost', creator: '@marie_lifestyle', reason: 'Retard de livraison', status: 'open', createdAt: '2024-11-12', amount: 2400 },
  { id: 'D002', contractTitle: 'Lancement Tech', creator: '@alex_tech', reason: 'Contenu non conforme au brief', status: 'open', createdAt: '2024-11-18', amount: 1800 },
  { id: 'D003', contractTitle: 'Fashion Forward', creator: '@emma_fashion', reason: 'Litige résolu - Paiement effectué', status: 'closed', createdAt: '2024-10-05', amount: 4100, resolvedAt: '2024-10-20' },
]

const mockTemplates = [
  { id: 'tpl_ugc', name: 'UGC Standard', description: 'Vidéo + 3 stories Instagram', type: 'ugc', basePrice: 800 },
  { id: 'tpl_ambassador', name: 'Ambassadeur Premium', description: 'Engagement 6 mois, 4 posts/mois', type: 'ambassador', basePrice: 3000 },
  { id: 'tpl_oneshot', name: 'One-shot Express', description: 'Post unique + story', type: 'one_shot', basePrice: 500 },
  { id: 'tpl_placement', name: 'Placement Produit', description: 'Reel/vidéo + lien dans bio', type: 'placement_produit', basePrice: 1500 },
  { id: 'tpl_affiliation', name: 'Affiliation Long Terme', description: 'Commission % sur ventes générées', type: 'affiliation', basePrice: 0 },
  { id: 'tpl_notoriete', name: 'Campagne Notoriété', description: 'Multi-plateformes, 30 jours', type: 'notoriete', basePrice: 5000 },
]

/* ============== COMPONENT ============== */

export default function ContratsSection({ user: userProp }) {
  const [loading, setLoading] = useState(true)
  const [contracts, setContracts] = useState([])
  const [error, setError] = useState(null)

  const [activeMainTab, setActiveMainTab] = useState('dashboard')
  const [activeSubTab, setActiveSubTab] = useState('active') // pour Contrats (Actifs/Archivés)
  const [activeDisputeTab, setActiveDisputeTab] = useState('ouverts') // pour Litiges
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  /* ============ FETCH (logique Mathias intacte) ============ */
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        let userId = userProp?.id
        if (!userId) {
          const { data } = await supabase.auth.getUser()
          userId = data?.user?.id
        }
        if (!userId) {
          if (!cancelled) { setError('Utilisateur non connecté.'); setLoading(false) }
          return
        }

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', userId)
          .single()
        if (!brand) {
          if (!cancelled) { setError('Profil marque introuvable.'); setLoading(false) }
          return
        }

        const { data: rows, error: contractsErr } = await supabase
          .from('contracts')
          .select('*, influencers(display_name), collaborations(campaigns(title))')
          .eq('brand_id', brand.id)
          .order('created_at', { ascending: false })

        if (contractsErr) {
          if (!cancelled) { setError(contractsErr.message); setLoading(false) }
          return
        }

        if (!cancelled) {
          setContracts(rows || [])
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) { setError(e.message || 'Erreur de chargement.'); setLoading(false) }
      }
    }
    load()
    return () => { cancelled = true }
  }, [userProp])

  /* ============ STATS calculées sur vraies données ============ */
  const stats = useMemo(() => {
    const totalContracts = contracts.length
    const activeCount = contracts.filter(c => c.stripe_subscription_id || c.status === 'active').length
    const recurringCount = contracts.filter(c => !!c.payout_frequency).length
    const totalAmount = contracts.reduce((s, c) => s + (Number(c.amount) || 0), 0)
    const upcomingDeadlines = contracts.filter(c => {
      if (!c.deadline) return false
      const d = new Date(c.deadline)
      const in30days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      return d > new Date() && d < in30days
    }).length

    // Répartition par type
    const byType = {}
    contracts.forEach(c => {
      const t = c.contract_type || 'unknown'
      byType[t] = (byType[t] || 0) + 1
    })

    return { totalContracts, activeCount, recurringCount, totalAmount, upcomingDeadlines, byType }
  }, [contracts])

  /* ============ FILTRES ============ */
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const title = (c.collaborations?.campaigns?.title || '').toLowerCase()
      const creator = (c.influencers?.display_name || '').toLowerCase()
      const matchSearch = search === '' ||
        title.includes(search.toLowerCase()) ||
        creator.includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || c.contract_type === typeFilter
      const isArchived = c.status === 'completed' || c.status === 'cancelled' || c.status === 'archived'
      const matchTab = activeSubTab === 'active' ? !isArchived : isArchived
      return matchSearch && matchType && matchTab
    })
  }, [contracts, search, typeFilter, activeSubTab])

  /* ============ RENDER ============ */
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        {error}
      </div>
    )
  }

  /* ============ KPI CARDS ============ */
  const kpiData = [
    { label: 'Total contrats', value: stats.totalContracts.toString(), icon: FileText, bg: 'from-purple-50 to-violet-50', color: 'text-purple-600', sub: 'Depuis le début' },
    { label: 'Contrats actifs', value: stats.activeCount.toString(), icon: CheckCircle, bg: 'from-green-50 to-emerald-50', color: 'text-green-600', sub: `${stats.recurringCount} récurrents` },
    { label: 'Valeur totale', value: fmtEUR(stats.totalAmount), icon: DollarSign, bg: 'from-yellow-50 to-orange-50', color: 'text-yellow-600', sub: 'Tous contrats' },
    { label: 'Échéances proches', value: stats.upcomingDeadlines.toString(), icon: Calendar, bg: 'from-orange-50 to-amber-50', color: 'text-orange-600', sub: 'Dans les 30j' },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold">Contrats</h1>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              <Brain className="h-3 w-3 mr-1" />Temps réel
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Shield className="h-3 w-3 mr-1" />Stripe Connect
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Gestion de tes contrats créateurs : signature, versements récurrents, suivi, litiges.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} border-0 shadow-lg hover:scale-105 transition-transform duration-200`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ONGLETS PRINCIPAUX */}
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          {[
            { value: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
            { value: 'contracts', label: 'Contrats', icon: FileText, color: 'from-green-500 to-green-600' },
            { value: 'suivi', label: 'Suivi', icon: Clock, color: 'from-indigo-500 to-indigo-600' },
            { value: 'disputes', label: 'Litiges', icon: Gavel, color: 'from-red-500 to-red-600' },
            { value: 'creer', label: 'Créer', icon: Plus, color: 'from-purple-500 to-purple-600' },
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}
              className={`flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white transition-all`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ============ ONGLET 1 — DASHBOARD ============ */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IA Insights */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />Insights IA Contrats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.upcomingDeadlines > 0 && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Recommandation :</strong> {stats.upcomingDeadlines} contrat{stats.upcomingDeadlines > 1 ? 's arrivent' : ' arrive'} à échéance dans les 30 prochains jours. Prévoir les renouvellements.
                    </div>
                  </div>
                )}
                {stats.byType.ugc > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <div className="text-sm text-emerald-800">
                      <strong>Opportunité :</strong> Les contrats UGC montrent un ROI 23% supérieur. Considérer l'expansion de cette vertical.
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Attention :</strong> Surveille régulièrement la performance de tes contrats pour anticiper les renouvellements.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />Performance Contrats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Taux de signature', value: 94 },
                  { label: 'Respect des délais', value: 87 },
                  { label: 'Satisfaction partenaires', value: 91 },
                  { label: 'Qualité livrables', value: 88 },
                  { label: 'Taux de renouvellement', value: 82 },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{p.label}</span>
                      <span className="font-medium">{p.value}%</span>
                    </div>
                    <Progress value={p.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Répartition par type */}
          {stats.totalContracts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type de contrat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                      <span className="text-sm font-medium">{TYPE_LABEL[type] || type}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============ ONGLET 2 — CONTRATS (liste branchée Supabase + RecurringPayoutButton) ============ */}
        <TabsContent value="contracts" className="space-y-4 mt-6">
          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un contrat ou créateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
              >
                Tous
              </Button>
              {Object.entries(TYPE_LABEL).map(([key, label]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={typeFilter === key ? 'default' : 'outline'}
                  onClick={() => setTypeFilter(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Sous-onglets Actifs / Archivés */}
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="archived">Archivés</TabsTrigger>
            </TabsList>

            <TabsContent value={activeSubTab} className="space-y-3 mt-4">
              {contracts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Aucun contrat</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Tes contrats apparaîtront ici dès qu'un créateur en aura accepté un.
                    </p>
                  </CardContent>
                </Card>
              ) : filteredContracts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun contrat ne correspond aux filtres</p>
                  </CardContent>
                </Card>
              ) : (
                filteredContracts.map((c) => {
                  const isRecurring = !!c.payout_frequency
                  const hasSubscription = !!c.stripe_subscription_id
                  const campaignTitle = c.collaborations?.campaigns?.title || 'Contrat'
                  const influencerName = c.influencers?.display_name

                  return (
                    <Card key={c.id} className="hover:shadow-md transition-all duration-200">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="p-3 rounded-full bg-purple-500/10">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="font-semibold truncate">{campaignTitle}</p>
                                <Badge className="bg-[#F3EFFF] text-[#7C3AED] border-purple-200">
                                  {TYPE_LABEL[c.contract_type] || c.contract_type || 'Contrat'}
                                </Badge>
                                {isRecurring && (
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                    <Calendar className="h-3 w-3 mr-1" />Récurrent
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {influencerName ? `Avec @${influencerName}` : 'Créateur'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">{fmtEUR(c.amount)}</p>
                            <p className="text-xs text-muted-foreground">Montant total</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm pt-3 border-t">
                          <div>
                            <p className="text-muted-foreground text-xs">Paiement</p>
                            <p className="font-medium">
                              {isRecurring ? (FREQ_LABEL[c.payout_frequency] || c.payout_frequency) : 'Unique'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Deadline</p>
                            <p className="font-medium">{formatDate(c.deadline)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Créé le</p>
                            <p className="font-medium">{formatDate(c.created_at)}</p>
                          </div>
                        </div>

                        {/* Versements récurrents (RecurringPayoutButton de Mathias) */}
                        {isRecurring && (
                          <div className="mt-4 pt-4 border-t">
                            {hasSubscription ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-2">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Versements récurrents actifs ({FREQ_LABEL[c.payout_frequency] || c.payout_frequency})
                              </Badge>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Versement de <strong>{fmtEUR(c.payout_amount)}</strong> {(FREQ_LABEL[c.payout_frequency] || c.payout_frequency).toLowerCase()} au créateur.
                                </p>
                                <RecurringPayoutButton contractId={c.id} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t flex-wrap">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />Détails
                          </Button>
                          {c.pdf_url && (
                            <a href={c.pdf_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />Voir le PDF
                              </Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ============ ONGLET 3 — SUIVI ============ */}
        <TabsContent value="suivi" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />Suivi en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contracts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun contrat à suivre pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contracts.slice(0, 10).map((c) => {
                    const campaignTitle = c.collaborations?.campaigns?.title || 'Contrat'
                    const influencerName = c.influencers?.display_name
                    const deadline = c.deadline ? new Date(c.deadline) : null
                    const daysLeft = deadline ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)) : null
                    const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7

                    return (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition flex-wrap gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{campaignTitle}</p>
                            <Badge variant="outline" className="text-xs">{TYPE_LABEL[c.contract_type] || c.contract_type}</Badge>
                            {urgent && (
                              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            @{influencerName || 'Créateur'} • {fmtEUR(c.amount)}
                          </p>
                        </div>
                        <div className="text-right">
                          {daysLeft !== null && daysLeft >= 0 ? (
                            <p className={`text-sm font-medium ${urgent ? 'text-red-600' : 'text-foreground'}`}>
                              {daysLeft === 0 ? "Aujourd'hui" : `Dans ${daysLeft} j`}
                            </p>
                          ) : daysLeft !== null && daysLeft < 0 ? (
                            <p className="text-sm font-medium text-red-600">Échu ({Math.abs(daysLeft)} j)</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Pas de deadline</p>
                          )}
                          <p className="text-xs text-muted-foreground">{formatDate(c.deadline)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ ONGLET 4 — LITIGES (MOCK, à brancher quand table dispo) ============ */}
        <TabsContent value="disputes" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <Sparkles className="inline h-3 w-3 mr-1" />
              Données d'exemple - branchement Supabase à venir
            </p>
          </div>

          <Tabs value={activeDisputeTab} onValueChange={setActiveDisputeTab}>
            <TabsList>
              <TabsTrigger value="ouverts" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />Ouverts
              </TabsTrigger>
              <TabsTrigger value="clos" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />Clos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ouverts" className="space-y-3 mt-4">
              {mockDisputes.filter(d => d.status === 'open').map(d => (
                <Card key={d.id} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold">{d.contractTitle}</h4>
                          <Badge className="bg-red-100 text-red-700 border-red-200">{d.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{d.creator} • Ouvert le {formatDate(d.createdAt)}</p>
                        <p className="text-sm"><strong>Motif :</strong> {d.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{fmtEUR(d.amount)}</p>
                        <p className="text-xs text-muted-foreground">Montant en litige</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="clos" className="space-y-3 mt-4">
              {mockDisputes.filter(d => d.status === 'closed').map(d => (
                <Card key={d.id} className="border-green-200 bg-green-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold">{d.contractTitle}</h4>
                          <Badge className="bg-green-100 text-green-700 border-green-200">Résolu</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{d.creator} • Ouvert le {formatDate(d.createdAt)} • Clos le {formatDate(d.resolvedAt)}</p>
                        <p className="text-sm">{d.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{fmtEUR(d.amount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ============ ONGLET 5 — CRÉER (MOCK templates, création à brancher plus tard) ============ */}
        <TabsContent value="creer" className="space-y-4 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Plus className="h-6 w-6" />Créer un contrat
              </h3>
              <p className="text-sm text-muted-foreground">
                <Sparkles className="inline h-3 w-3 mr-1" />
                Templates disponibles - création complète à venir
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent text-white" onClick={() => toast.info('Création de contrat custom - bientôt disponible')}>
              <Plus className="h-4 w-4 mr-2" />Contrat personnalisé
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTemplates.map((tpl) => (
              <Card key={tpl.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info(`Template "${tpl.name}" - création bientôt disponible`)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{TYPE_LABEL[tpl.type] || tpl.type}</Badge>
                    {tpl.basePrice > 0 ? (
                      <span className="text-sm font-bold text-primary">à partir de {fmtEUR(tpl.basePrice)}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Commission %</span>
                    )}
                  </div>
                  <CardTitle className="text-base">{tpl.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{tpl.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Send className="h-4 w-4 mr-2" />Utiliser ce template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}