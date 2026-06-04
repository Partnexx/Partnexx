'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useState, useEffect, useRef } from 'react'
import { Search, Calendar, DollarSign, FileText, Download, CreditCard, Brain, CheckCircle, Clock, AlertCircle, Eye, Shield, TrendingUp, Lock, Wallet, Send, BarChart3, Receipt, History, ChevronRight, List, LayoutGrid, Euro, AlertTriangle, CheckCircle2, Target, Zap, ArrowUpRight, ArrowDownRight, LayoutDashboard, RefreshCw, Plus, ThumbsUp, ThumbsDown, ImagePlus, MessageSquare } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'
import { useLevel } from "@/lib/context/LevelContext"
import LevelGate from '@/components/LevelGate'
import PaymentSetup from '@/components/PaymentSetup'

const getStatusColor = (status) => {
  switch (status) {
    case "signed": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "completed": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "draft": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "sent": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    case "disputed": return "bg-red-500/10 text-red-600 border-red-500/20"
    case "cancelled": return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case "signed": return "Signé"
    case "completed": return "Terminé"
    case "draft": return "Brouillon"
    case "sent": return "Envoyé"
    case "disputed": return "Litige"
    case "cancelled": return "Annulé"
    default: return status
  }
}

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "released": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "in_escrow": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case "released": return "Reçu"
    case "in_escrow": return "En escrow"
    case "pending": return "En attente"
    default: return status
  }
}

const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }

// Helpers transactions partagés
const MIN_TX_AMOUNT = 1 // on ignore les micro-transactions de test (ex. 0,85 €)
const txAmount = (t) => parseFloat(t?.influencer_amount || t?.amount || 0)
const isMicroTx = (t) => txAmount(t) < MIN_TX_AMOUNT
const isRefundTx = (t) => {
  const d = (t?.description || '').toLowerCase()
  return t?.type === 'refund' || d.includes('rembours') || d.includes('refund')
}
const isRealTx = (t) => !isMicroTx(t) && !isRefundTx(t) // vraie transaction (ni test, ni remboursement)

/* ════════════════════════════════════════════════════════════
   SOUS-ONGLET : CONTRATS ACTUELS  (= ton ancien ContratsTab, VRAIES DONNÉES, inchangé)
   ════════════════════════════════════════════════════════════ */
function ContratsActuels({ contracts = [] }) {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedContrat, setSelectedContrat] = useState(null)

  const filtered = contracts.filter(c => {
    const matchSearch = search === "" ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.brands?.company_name || "").toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalActive = contracts.filter(c => c.status === 'signed').length
  const totalCompleted = contracts.filter(c => c.status === 'completed').length
  const totalValue = contracts.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Non défini'
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  const handleDownload = (contrat) => {
    if (contrat.pdf_url) {
      window.open(contrat.pdf_url, '_blank')
    } else {
      toast.error('PDF non disponible pour ce contrat')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10"><FileText className="h-5 w-5 text-blue-600" /></div>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">Actifs</Badge>
            </div>
            <p className="text-2xl font-bold">{totalActive}</p>
            <p className="text-sm text-muted-foreground">Contrats signés</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">Terminés</Badge>
            </div>
            <p className="text-2xl font-bold">{totalCompleted}</p>
            <p className="text-sm text-muted-foreground">Contrats complétés</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10"><DollarSign className="h-5 w-5 text-purple-600" /></div>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Total</Badge>
            </div>
            <p className="text-2xl font-bold">{totalValue.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">Valeur contractuelle</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un contrat..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "draft", "sent", "signed", "completed", "cancelled"].map((s) => (
            <Button key={s} size="sm" variant={filterStatus === s ? "default" : "outline"} onClick={() => setFilterStatus(s)}>
              {s === "all" ? "Tous" : getStatusLabel(s)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {contracts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucun contrat</h3>
              <p className="text-sm text-muted-foreground">Vos contrats apparaîtront ici</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun contrat trouvé</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((contrat) => (
            <Card key={contrat.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-border">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                        {contrat.brands?.company_name?.slice(0, 2).toUpperCase() || 'MA'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{contrat.brands?.company_name || 'Marque'}</h3>
                      <p className="text-sm text-muted-foreground">Contrat #{contrat.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(contrat.status)}>
                    {contrat.status === "signed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {contrat.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {contrat.status === "draft" && <Clock className="h-3 w-3 mr-1" />}
                    {getStatusLabel(contrat.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Montant</p>
                    <p className="text-sm font-semibold text-green-600">{parseFloat(contrat.amount || 0).toLocaleString()}€</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                    <p className="text-sm font-medium">{formatDate(contrat.deadline)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Signé le</p>
                    <p className="text-sm font-medium">{contrat.influencer_signed_at ? formatDate(contrat.influencer_signed_at) : 'Non signé'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Livrables</p>
                    <p className="text-sm font-medium">{Array.isArray(contrat.deliverables) ? contrat.deliverables.length : 0} contenus</p>
                  </div>
                </div>

                {contrat.deliverables && Array.isArray(contrat.deliverables) && contrat.deliverables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Livrables :</p>
                    <div className="flex flex-wrap gap-1">
                      {contrat.deliverables.map((d, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setSelectedContrat(contrat)}>
                    <Eye className="h-4 w-4" />Voir le contrat
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => handleDownload(contrat)}>
                    <Download className="h-4 w-4" />Télécharger PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedContrat} onOpenChange={() => setSelectedContrat(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <FileText className="h-5 w-5" />
              Contrat — {selectedContrat?.brands?.company_name || 'Marque'}
            </DialogTitle>
            <DialogDescription>#{selectedContrat?.id?.slice(0, 8)}</DialogDescription>
          </DialogHeader>

          {selectedContrat && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Montant total</p>
                    <p className="text-2xl font-bold text-green-600">{parseFloat(selectedContrat.amount || 0).toLocaleString()}€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Statut</p>
                    <Badge variant="outline" className={getStatusColor(selectedContrat.status)}>
                      {getStatusLabel(selectedContrat.status)}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" />Dates</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Créé le</p><p className="font-medium">{new Date(selectedContrat.created_at).toLocaleDateString('fr-FR')}</p></div>
                  <div><p className="text-muted-foreground">Deadline</p><p className="font-medium">{selectedContrat.deadline ? new Date(selectedContrat.deadline).toLocaleDateString('fr-FR') : 'Non défini'}</p></div>
                  <div><p className="text-muted-foreground">Signé influenceur</p><p className="font-medium">{selectedContrat.influencer_signed_at ? new Date(selectedContrat.influencer_signed_at).toLocaleDateString('fr-FR') : 'Non signé'}</p></div>
                  <div><p className="text-muted-foreground">Signé marque</p><p className="font-medium">{selectedContrat.brand_signed_at ? new Date(selectedContrat.brand_signed_at).toLocaleDateString('fr-FR') : 'Non signé'}</p></div>
                </CardContent>
              </Card>

              {selectedContrat.deliverables && Array.isArray(selectedContrat.deliverables) && (
                <Card>
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" />Livrables</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedContrat.deliverables.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {selectedContrat.special_clauses && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Clauses spéciales</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{selectedContrat.special_clauses}</p></CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => handleDownload(selectedContrat)}>
                  <Download className="h-4 w-4" />Télécharger PDF
                </Button>
                {selectedContrat.pdf_url && (
                  <Button className="flex-1 gap-2" onClick={() => window.open(selectedContrat.pdf_url, '_blank')}>
                    <Eye className="h-4 w-4" />Voir le PDF
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   SOUS-ONGLET : DASHBOARD (vraies données)
   ════════════════════════════════════════════════════════════ */
function ContratsDashboard({ contracts = [], transactions = [] }) {
  const now = new Date()

  const activeCount = contracts.filter(c => c.status === 'signed').length
  const completedCount = contracts.filter(c => c.status === 'completed').length
  const pendingCount = contracts.filter(c => ['draft', 'sent'].includes(c.status)).length
  const totalCount = contracts.length
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0
  const signatureRate = totalCount ? Math.round(((activeCount + completedCount) / totalCount) * 100) : 0
  const revenueReceived = transactions.filter(t => t.status === 'released' && isRealTx(t)).reduce((s, t) => s + parseFloat(t.influencer_amount || 0), 0)

  // Taux d'encaissement = part des gains déjà reçus sur le total facturé (reçu + escrow + en attente)
  const billedTotal = transactions
    .filter(t => isRealTx(t) && ['released', 'in_escrow', 'pending'].includes(t.status))
    .reduce((s, t) => s + parseFloat(t.influencer_amount || 0), 0)
  const cashedRate = billedTotal > 0 ? Math.round((revenueReceived / billedTotal) * 100) : 0

  // Taux de fiabilité = contrats sans annulation ni litige
  const cancelledCount = contracts.filter(c => c.status === 'cancelled').length
  const disputedCount = contracts.filter(c => c.status === 'disputed').length
  const reliabilityRate = totalCount ? Math.round(((totalCount - cancelledCount - disputedCount) / totalCount) * 100) : 0

  const stats = [
    { title: "Contrats actifs", value: activeCount, sub: "signés en cours", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Revenus reçus", value: `${revenueReceived.toLocaleString()}€`, sub: "paiements libérés", icon: Euro, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "En attente", value: pendingCount, sub: "à signer / envoyés", icon: Clock, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { title: "Taux de complétion", value: `${completionRate}%`, sub: `sur ${totalCount} contrat${totalCount > 1 ? 's' : ''}`, icon: CheckCircle2, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ]

  const perf = [
    { category: "Taux de signature", value: signatureRate },
    { category: "Taux de complétion", value: completionRate },
    { category: "Taux d'encaissement", value: cashedRate },
    { category: "Taux de fiabilité", value: reliabilityRate },
  ]

  const recent = [...contracts]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 4)

  const deadlines = contracts
    .filter(c => c.deadline && new Date(c.deadline) >= now && !['completed', 'cancelled'].includes(c.status))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4)
    .map(c => {
      const days = Math.ceil((new Date(c.deadline) - now) / 86400000)
      return {
        id: c.id,
        title: c.brands?.company_name || `Contrat #${c.id.slice(0, 8)}`,
        date: new Date(c.deadline).toLocaleDateString('fr-FR'),
        days,
        priority: days <= 7 ? 'urgent' : days <= 14 ? 'soon' : 'normal',
      }
    })

  const priorityConfig = (p) => ({
    urgent: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", label: "Urgent" },
    soon: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Bientôt" },
    normal: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Normal" },
  }[p] || { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Normal" })

  if (totalCount === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
          Aucun contrat pour l'instant — ton tableau de bord se remplira ici dès tes premières collaborations.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-500" />Indicateurs de performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {perf.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <Badge variant="secondary">{item.value}%</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-orange-500" />Activité récente</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune activité récente</p>
              ) : recent.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.brands?.company_name || `Contrat #${c.id.slice(0, 8)}`}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : ''}</p>
                      <Badge className={getStatusColor(c.status)} variant="outline">{getStatusLabel(c.status)}</Badge>
                    </div>
                  </div>
                  <p className="font-bold whitespace-nowrap">{parseFloat(c.amount || 0).toLocaleString()}€</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" />Échéances à venir</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune échéance à venir</p>
              ) : deadlines.map((d) => {
                const pc = priorityConfig(d.priority)
                return (
                  <div key={d.id} className={`p-3 rounded-lg border ${pc.border} ${pc.bg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{d.title}</p>
                        <p className={`text-xs ${pc.color} font-semibold mt-1`}>{d.days} jour{d.days > 1 ? 's' : ''} restant{d.days > 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{d.date}</p>
                        <Badge variant="outline" className={`${pc.bg} ${pc.color} text-xs mt-1`}>{pc.label}</Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   SOUS-ONGLET : LITIGES (local, non persisté — à brancher sur la table disputes)
   ════════════════════════════════════════════════════════════ */
function ContratsLitiges({ user, transactions = [], contracts = [] }) {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ linkType: 'none', subjectKey: '', brandId: '', reason: '', description: '' })
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMsg, setLoadingMsg] = useState(false)
  const [msgText, setMsgText] = useState('')
  const [sending, setSending] = useState(false)
  const [acting, setActing] = useState(false)
  const convEndRef = useRef(null)

  const CATEGORIES = ['Paiement', 'Contrat', 'Entreprise / marque', 'Contenu', 'Livraison / délais', 'Autre']
  const STATUS = {
    open: { label: 'Ouvert', cls: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    under_review: { label: 'En médiation', cls: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    resolved_influencer: { label: 'Résolu en ta faveur', cls: 'bg-green-500/10 text-green-600 border-green-500/20' },
    resolved_brand: { label: 'Résolu (faveur marque)', cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    auto_resolved: { label: 'Clôturé', cls: 'bg-green-500/10 text-green-600 border-green-500/20' },
  }
  const isResolved = (s) => s !== 'open' && s !== 'under_review'

  const contractsById = {}
  contracts.forEach(c => { if (c?.id) contractsById[c.id] = c })
  const subjects = (() => {
    const map = {}
    transactions.filter(isRealTx).forEach(t => {
      const key = t.collaboration_id || t.contract_id || `tx-${t.id}`
      if (map[key]) return
      const company = contractsById[t.contract_id]?.brands?.company_name
      const label = company || t.description || (t.collaboration_id || t.contract_id ? `Campagne #${(t.collaboration_id || t.contract_id).slice(0, 8)}` : `Campagne du ${new Date(t.created_at).toLocaleDateString('fr-FR')}`)
      map[key] = { key, label, collaborationId: t.collaboration_id || null, transactionId: t.id }
    })
    return Object.values(map)
  })()
  const selectedSubject = subjects.find(s => s.key === form.subjectKey)

  // Liste des entreprises (marques) avec lesquelles le créateur a bossé
  const brands = (() => {
    const map = {}
    contracts.forEach(c => {
      const id = c?.brand_id || c?.brands?.id
      const name = c?.brands?.company_name
      if (id && name && !map[id]) map[id] = { id, name }
    })
    return Object.values(map)
  })()

  const load = async () => {
    if (!user?.id) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/disputes?userId=${user.id}`)
      const data = await res.json()
      setDisputes(Array.isArray(data.disputes) ? data.disputes : [])
    } catch { setDisputes([]) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [user?.id])
  useEffect(() => { convEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loadingMsg, expandedId])

  const loadMessages = async (id) => {
    setLoadingMsg(true); setMessages([])
    try {
      const res = await fetch(`/api/disputes/messages?disputeId=${id}`)
      const d = await res.json()
      setMessages(Array.isArray(d.messages) ? d.messages : [])
    } catch { setMessages([]) } finally { setLoadingMsg(false) }
  }
  const toggleExpand = (id) => {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id); setMsgText(''); loadMessages(id)
  }
  const sendMessage = async (id) => {
    if (!msgText.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/disputes/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ disputeId: id, senderId: user?.id, senderRole: 'influencer', content: msgText.trim() }) })
      if (!res.ok) { const e = await res.json().catch(() => ({})); toast.error(e.error || 'Erreur'); return }
      setMsgText(''); loadMessages(id)
    } catch { toast.error('Erreur réseau') } finally { setSending(false) }
  }
  const requestIntervention = async (id) => {
    setActing(true)
    try {
      const res = await fetch('/api/disputes/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ disputeId: id, senderId: user?.id, senderRole: 'influencer', content: "🛟 Demande d'intervention de l'équipe Partnexx.", setStatus: 'under_review' }) })
      if (!res.ok) { toast.error('Erreur'); return }
      toast.success("L'équipe Partnexx a été sollicitée")
      loadMessages(id); load()
    } catch { toast.error('Erreur réseau') } finally { setActing(false) }
  }
  const markResolved = async (id) => {
    setActing(true)
    try {
      const res = await fetch('/api/disputes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ disputeId: id, resolution: 'auto_resolved', resolvedBy: user?.id, adminNote: 'Clôturé par le créateur' }) })
      if (!res.ok) { const e = await res.json().catch(() => ({})); toast.error(e.error || 'Erreur'); return }
      toast.success('Litige clôturé'); setExpandedId(null); load()
    } catch { toast.error('Erreur réseau') } finally { setActing(false) }
  }

  const handleAddFiles = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    const ok = picked.filter(f => f.size <= 10 * 1024 * 1024)
    if (ok.length < picked.length) toast.error('Certains fichiers dépassent 10 Mo et ont été ignorés')
    setFiles(prev => [...prev, ...ok].slice(0, 5))
  }

  const uploadAttachments = async () => {
    if (files.length === 0) return []
    const out = []
    for (const f of files) {
      const path = `${user?.id || 'anon'}/${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
      const { error } = await supabase.storage.from('dispute-attachments').upload(path, f)
      if (error) throw new Error('Upload échoué : ' + error.message)
      const { data } = supabase.storage.from('dispute-attachments').getPublicUrl(path)
      out.push({ url: data.publicUrl, name: f.name, type: f.type })
    }
    return out
  }

  const resetForm = () => { setForm({ linkType: 'none', subjectKey: '', brandId: '', reason: '', description: '' }); setFiles([]) }

  const handleCreate = async () => {
    if (!form.reason) { toast.error('Choisis un motif'); return }
    if (form.linkType === 'campaign' && !selectedSubject) { toast.error('Sélectionne la campagne'); return }
    if (form.linkType === 'brand' && !form.brandId) { toast.error('Sélectionne l\'entreprise'); return }
    setCreating(true)
    try {
      let attachments = []
      if (files.length > 0) { setUploading(true); attachments = await uploadAttachments(); setUploading(false) }
      const linkCampaign = form.linkType === 'campaign' ? selectedSubject : null
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collaborationId: linkCampaign?.collaborationId || null,
          transactionId: linkCampaign && !linkCampaign.collaborationId ? linkCampaign.transactionId : null,
          brandId: form.linkType === 'brand' ? form.brandId : null,
          attachments,
          openedBy: user?.id,
          openedByRole: 'influencer',
          reason: form.reason,
          description: form.description || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Impossible d'ouvrir le litige"); return }
      toast.success("Litige ouvert — l'équipe Partnexx a été notifiée")
      setShowNew(false); resetForm(); load()
    } catch (e) { toast.error(e.message || 'Erreur réseau') } finally { setCreating(false); setUploading(false) }
  }

  const openCount = disputes.filter(d => !isResolved(d.status)).length
  const resolvedCount = disputes.filter(d => isResolved(d.status)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          <Card className="px-4 py-3"><p className="text-2xl font-bold text-orange-500">{openCount}</p><p className="text-xs text-muted-foreground">en cours</p></Card>
          <Card className="px-4 py-3"><p className="text-2xl font-bold text-green-600">{resolvedCount}</p><p className="text-xs text-muted-foreground">résolus</p></Card>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"><Plus className="h-4 w-4" />Nouveau litige</Button>
      </div>

      {loading ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Chargement…</CardContent></Card>
      ) : disputes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <p className="font-medium">Aucun litige</p>
            <p className="text-sm text-muted-foreground">Tout se passe bien avec tes collaborations 🎉</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => {
            const st = STATUS[d.status] || { label: d.status, cls: 'bg-muted text-muted-foreground' }
            const open = expandedId === d.id
            const amount = d.transactions?.amount
            const resolved = isResolved(d.status)
            const daysLeft = d.auto_resolve_at ? Math.ceil((new Date(d.auto_resolve_at) - new Date()) / 86400000) : null
            const priority = resolved ? null : (daysLeft != null && daysLeft <= 2 ? { label: 'Urgent', cls: 'bg-red-500/10 text-red-600 border-red-500/20' } : null)
            const accent = resolved ? 'border-l-green-500' : d.status === 'under_review' ? 'border-l-purple-500' : 'border-l-orange-500'
            const StIcon = resolved ? CheckCircle2 : d.status === 'under_review' ? Shield : AlertTriangle
            const stIconCls = resolved ? 'text-green-600 bg-green-500/10' : d.status === 'under_review' ? 'text-purple-600 bg-purple-500/10' : 'text-orange-600 bg-orange-500/10'
            const step = resolved ? 2 : d.status === 'under_review' ? 1 : 0
            return (
              <Card key={d.id} className={`overflow-hidden border-l-4 ${accent}`}>
                <button onClick={() => toggleExpand(d.id)} className="w-full text-left p-5 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${stIconCls}`}><StIcon className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{d.reason}</p>
                          <Badge variant="outline" className={st.cls}>{st.label}</Badge>
                          {priority && <Badge variant="outline" className={priority.cls}>{priority.label}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Ouvert le {new Date(d.created_at).toLocaleDateString('fr-FR')}{amount ? ` · ${parseFloat(amount).toLocaleString()}€` : ''}</p>
                        {d.description && <p className="text-sm text-muted-foreground mt-1 truncate">{d.description}</p>}
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {open && (
                  <div className="border-t p-5 space-y-4">
                    <div className="flex items-center gap-1">
                      {['Ouvert', 'Médiation', 'Résolu'].map((s, i, arr) => (
                        <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                          <div className={`flex items-center gap-1.5 ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i < step ? '✓' : i + 1}</div>
                            <span className="text-xs font-medium whitespace-nowrap">{s}</span>
                          </div>
                          {i < arr.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-green-500' : 'bg-muted'}`} />}
                        </div>
                      ))}
                    </div>
                    {d.description && <p className="text-sm">{d.description}</p>}
                    {!resolved && d.auto_resolve_at && (
                      <p className="text-xs text-orange-600 flex items-center gap-1"><Clock className="h-3 w-3" />Résolution automatique le {new Date(d.auto_resolve_at).toLocaleDateString('fr-FR')} sans réponse</p>
                    )}
                    {Array.isArray(d.attachments) && d.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {d.attachments.map((a, i) => (
                          (a.type || '').startsWith('image/')
                            ? <a key={i} href={a.url} target="_blank" rel="noreferrer" className="block"><img src={a.url} alt={a.name || ''} className="h-20 w-20 object-cover rounded-md border hover:opacity-90" /></a>
                            : <a key={i} href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted/50"><FileText className="h-3.5 w-3.5" /><span className="truncate max-w-[160px]">{a.name || 'Pièce jointe'}</span></a>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Conversation</h4>
                      <div className="h-[300px] overflow-y-auto p-4 border rounded-lg space-y-3 bg-muted/20">
                        {loadingMsg ? (
                          <p className="text-sm text-muted-foreground text-center py-8">Chargement…</p>
                        ) : messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center"><MessageSquare className="h-6 w-6" /></div>
                            <p className="text-sm font-medium">Aucun message pour l'instant</p>
                            <p className="text-xs max-w-[260px]">Explique la situation à la marque, ou demande l'intervention de l'équipe Partnexx.</p>
                          </div>
                        ) : messages.map((m) => {
                          if (m.sender_role === 'system') {
                            return (
                              <div key={m.id} className="flex justify-center my-1">
                                <div className="flex items-center gap-2 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/20 px-3 py-1.5 text-xs font-medium max-w-[90%]">
                                  <img src="/logo.png" className="h-4 w-4 object-contain flex-shrink-0" alt="Partnexx" />
                                  <span>{m.content}</span>
                                </div>
                              </div>
                            )
                          }
                          const mine = m.sender_role === 'influencer'
                          const isPx = m.sender_role === 'partnexx'
                          return (
                            <div key={m.id} className={`flex gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                              {!mine && <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">{isPx ? <img src="/logo.png" className="h-5 w-5 object-contain" alt="Partnexx" /> : <span className="text-xs font-semibold text-blue-600">M</span>}</div>}
                              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border rounded-bl-sm'}`}>
                                {!mine && <p className="text-[10px] font-semibold mb-0.5 opacity-70">{isPx ? 'Équipe Partnexx' : 'La marque'}</p>}
                                <p className="whitespace-pre-wrap">{m.content}</p>
                                <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={convEndRef} />
                      </div>
                      {!resolved && (
                        <div className="flex gap-2 mt-2">
                          <Input value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(d.id) } }} placeholder="Écris un message…" />
                          <Button size="icon" onClick={() => sendMessage(d.id)} disabled={sending}>{sending ? <span className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> : <Send className="h-4 w-4" />}</Button>
                        </div>
                      )}
                    </div>

                    {!resolved ? (
                      <>
                        {d.status === 'under_review' ? (
                          <div className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4">
                            <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0"><img src="/logo.png" className="h-6 w-6 object-contain" alt="Partnexx" /></div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm flex items-center gap-1.5"><Zap className="h-4 w-4 text-purple-600" />Partnexx est sur le coup</p>
                              <p className="text-xs text-muted-foreground">Notre équipe étudie ce litige. Le paiement reste gelé jusqu'à la résolution.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-blue-500/5 p-4 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0"><img src="/logo.png" className="h-6 w-6 object-contain" alt="Partnexx" /></div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm">Besoin d'un arbitre neutre ?</p>
                                <p className="text-xs text-muted-foreground">Fais intervenir l'équipe Partnexx : on analyse les échanges, on tranche et on débloque le paiement vers la bonne personne.</p>
                              </div>
                            </div>
                            <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" onClick={() => requestIntervention(d.id)} disabled={acting}><Zap className="h-4 w-4" />Faire intervenir Partnexx</Button>
                          </div>
                        )}
                        <Button variant="outline" className="w-full gap-2" onClick={() => markResolved(d.id)} disabled={acting}><CheckCircle2 className="h-4 w-4" />Marquer comme résolu</Button>
                      </>
                    ) : d.admin_note ? (
                      <div className="rounded-lg bg-muted/40 p-3 text-sm">
                        <p className="font-medium flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-600" />Litige résolu{d.resolved_at ? ` le ${new Date(d.resolved_at).toLocaleDateString('fr-FR')}` : ''}</p>
                        <p className="text-muted-foreground mt-1">{d.admin_note}</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-5 flex gap-3">
          <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Comment ça marche</p>
            <span className="font-medium">1.</span> Tu ouvres un litige et tu discutes avec la marque. <span className="font-medium">2.</span> Si pas d'accord, tu fais intervenir Partnexx (médiation). <span className="font-medium">3.</span> Sans réponse, le litige se résout automatiquement au bout de 7 jours.
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-orange-500" />Ouvrir un litige</DialogTitle>
            <DialogDescription>Indique le type de problème puis, si besoin, la campagne concernée. L'équipe Partnexx arbitrera.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Motif *</Label>
              <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">— Choisis un motif —</option>
                {CATEGORIES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Lié à <span className="text-muted-foreground font-normal">(facultatif)</span></Label>
              <div className="flex gap-2">
                {[{ v: 'none', l: 'Rien' }, { v: 'campaign', l: 'Une campagne' }, { v: 'brand', l: 'Une entreprise' }].map(o => (
                  <button key={o.v} type="button" onClick={() => setForm({ ...form, linkType: o.v, subjectKey: '', brandId: '' })} className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${form.linkType === o.v ? 'border-orange-500 bg-orange-500/10 text-orange-700 font-medium' : 'hover:bg-muted/50'}`}>{o.l}</button>
                ))}
              </div>
              {form.linkType === 'campaign' && (
                <select value={form.subjectKey} onChange={(e) => setForm({ ...form, subjectKey: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2">
                  <option value="">— Choisis une campagne —</option>
                  {subjects.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              )}
              {form.linkType === 'brand' && (
                <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2">
                  <option value="">— Choisis une entreprise —</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Description du problème</Label>
              <textarea rows={4} placeholder="Explique le problème, les faits, les dates et tes attentes…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" />
            </div>
            <div className="space-y-1.5">
              <Label>Pièces jointes <span className="text-muted-foreground font-normal">(captures, factures, contrats… max 5, 10 Mo)</span></Label>
              <label className="flex items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm cursor-pointer hover:bg-muted/40">
                <ImagePlus className="h-4 w-4" /> Ajouter un fichier
                <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleAddFiles} />
              </label>
              {files.length > 0 && (
                <div className="space-y-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs rounded-md border px-3 py-2">
                      <FileText className="h-4 w-4 flex-shrink-0" /><span className="truncate flex-1">{f.name}</span>
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowNew(false)}>Annuler</Button>
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreate} disabled={creating}>{uploading ? 'Envoi des fichiers…' : creating ? 'Ouverture…' : 'Ouvrir le litige'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   SOUS-ONGLET : SUIVIS (vraies données)
   ════════════════════════════════════════════════════════════ */
function ContratsSuivis({ contracts = [] }) {
  const now = new Date()
  const horizon = new Date(now.getTime() + 90 * 86400000)
  const upcoming = contracts
    .filter(c => c.deadline && new Date(c.deadline) >= now && new Date(c.deadline) <= horizon && !['completed', 'cancelled'].includes(c.status))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Contrats arrivant à échéance</h2>
        <p className="text-sm text-muted-foreground">Dans les 90 prochains jours</p>
      </div>

      {upcoming.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500" />
            Aucun contrat n'arrive à échéance dans les 90 prochains jours 🎉
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {upcoming.map((c) => {
            const days = Math.ceil((new Date(c.deadline) - now) / 86400000)
            const deliverables = Array.isArray(c.deliverables) ? c.deliverables : []
            return (
              <Card key={c.id}>
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{c.brands?.company_name || 'Contrat'}</h3>
                      <p className="text-sm text-muted-foreground">Contrat #{c.id.slice(0, 8)}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(c.status)}>{getStatusLabel(c.status)}</Badge>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-900 dark:text-orange-100">
                      <span className="font-semibold">Rappel :</span> Ce contrat arrive à échéance le {new Date(c.deadline).toLocaleDateString('fr-FR')} ({days} jour{days > 1 ? 's' : ''})
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div><p className="text-xs text-muted-foreground mb-1">Montant</p><p className="text-lg font-bold">{parseFloat(c.amount || 0).toLocaleString()}€</p></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Signé le</p><p className="text-sm">{c.influencer_signed_at ? new Date(c.influencer_signed_at).toLocaleDateString('fr-FR') : 'Non signé'}</p></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Livrables</p><p className="text-sm font-medium">{deliverables.length} contenu{deliverables.length > 1 ? 's' : ''}</p></div>
                  </div>

                  {deliverables.length > 0 && (
                    <Card className="border-2">
                      <CardHeader className="pb-3"><h4 className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4" />Livrables ({deliverables.length})</h4></CardHeader>
                      <CardContent className="space-y-2">
                        {deliverables.map((d, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-sm">{typeof d === 'string' ? d : (d?.name || 'Livrable')}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => c.pdf_url ? window.open(c.pdf_url, '_blank') : toast.error('PDF non disponible pour ce contrat')}>
                      <Download className="h-3 w-3" />Télécharger le contrat
                    </Button>
                    <Button size="sm" className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success('Demande de renouvellement envoyée')}>
                      <RefreshCw className="h-3 w-3" />Relancer pour renouvellement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   CÔTÉ CONTRATS : 4 sous-onglets
   ════════════════════════════════════════════════════════════ */
function ContratsCote({ contracts = [], transactions = [], user }) {
  const subTabs = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { value: "actuels", label: "Contrats actuels", icon: FileText },
    { value: "litiges", label: "Litiges", icon: AlertTriangle },
    { value: "suivis", label: "Suivis", icon: TrendingUp },
  ]
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-0 h-auto mb-6">
        {subTabs.map((t) => {
          const Icon = t.icon
          return (
            <TabsTrigger key={t.value} value={t.value} className="rounded-xl h-10 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500/30 bg-card hover:bg-muted/50 transition-all border border-border/50">
              <span className="flex items-center gap-2 font-medium text-[13px]"><Icon className="h-3.5 w-3.5" />{t.label}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>
      <TabsContent value="dashboard" className="mt-2"><ContratsDashboard contracts={contracts} transactions={transactions} /></TabsContent>
      <TabsContent value="actuels" className="mt-2"><ContratsActuels contracts={contracts} /></TabsContent>
      <TabsContent value="litiges" className="mt-2"><ContratsLitiges user={user} transactions={transactions} contracts={contracts} /></TabsContent>
      <TabsContent value="suivis" className="mt-2"><ContratsSuivis contracts={contracts} /></TabsContent>
    </Tabs>
  )
}

/* ════════════════════════════════════════════════════════════
   ONGLET PAIEMENTS — refonte 5 sous-onglets (vraies données + gating conservés)
   ════════════════════════════════════════════════════════════ */
function PaiementsTab({ transactions = [], contracts = [], user }) {
  const { canAccess, score: userScore } = useLevel()

  const canWithdraw = canAccess('withdrawals')
  const canAccessAdvancedHistory = canAccess('advancedRevenueHistory')

  const [paySubTab, setPaySubTab] = useState('dashboard')
  const [enAttenteOpen, setEnAttenteOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [iban, setIban] = useState("")
  const [holderName, setHolderName] = useState("")
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [downloadingReceiptId, setDownloadingReceiptId] = useState(null)
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null)
  const [monthlyOpen, setMonthlyOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [expandedCampaign, setExpandedCampaign] = useState(null)
  const [expandedDocCampaign, setExpandedDocCampaign] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)
  const [chatRemaining, setChatRemaining] = useState(null)
  const [brandsById, setBrandsById] = useState({})

  // Lien transaction → campagne (via contract_id, en s'appuyant sur les contrats déjà chargés)
  const contractsById = {}
  contracts.forEach(c => { if (c?.id) contractsById[c.id] = c })

  // Résolution du nom de l'entreprise via brand_id (utile pour les transactions sans contract_id)
  useEffect(() => {
    const ids = [...new Set(transactions.map(t => t.brand_id).filter(Boolean))]
    if (ids.length === 0) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase.from('brands').select('id, company_name').in('id', ids)
      if (!cancelled && data) {
        const map = {}
        data.forEach(b => { if (b?.id) map[b.id] = b })
        setBrandsById(map)
      }
    })()
    return () => { cancelled = true }
  }, [transactions])

  const getBrandName = (tx) => {
    const c = contractsById[tx.contract_id]
    if (c?.brands?.company_name) return c.brands.company_name
    if (tx.brand_id && brandsById[tx.brand_id]?.company_name) return brandsById[tx.brand_id].company_name
    return null
  }

  const getCampaignLabel = (tx) => {
    const name = getBrandName(tx)
    if (name) return name
    if (tx.description) return tx.description
    if (tx.contract_id) return `Campagne #${tx.contract_id.slice(0, 8)}`
    if (tx.collaboration_id) return `Campagne #${tx.collaboration_id.slice(0, 8)}`
    return `Paiement #${tx.id.slice(0, 8)}`
  }

  // Escrow : libération auto = escrow_held_at + 15 jours (ou validation marque avant)
  const ESCROW_AUTO_DAYS = 15
  const getEscrowRelease = (tx) => {
    if (!tx.escrow_held_at) return null
    const due = new Date(new Date(tx.escrow_held_at).getTime() + ESCROW_AUTO_DAYS * 86400000)
    const days = Math.ceil((due - new Date()) / 86400000)
    return { due, days }
  }

  const filtered = transactions.filter(t => {
    if (!isRealTx(t)) return false // ni micro-transaction de test (<1€), ni remboursement
    if (t.status === 'in_escrow' || t.status === 'pending') return false // affichés dans le bandeau "en attente"
    if (search === "") return true
    const q = search.toLowerCase()
    return (t.description || "").toLowerCase().includes(q) || getCampaignLabel(t).toLowerCase().includes(q)
  })

  // Vraies transactions, base de tous les calculs de revenus (hors test/remboursement)
  const realTransactions = transactions.filter(isRealTx)

  // Regroupement par campagne (onglet Transactions)
  const campaignGroups = (() => {
    const map = {}
    filtered.forEach(tx => {
      const key = tx.contract_id || tx.collaboration_id || `tx-${tx.id}`
      if (!map[key]) map[key] = { key, label: getCampaignLabel(tx), txs: [], total: 0, received: 0, escrow: 0, lastDate: 0 }
      map[key].txs.push(tx)
      map[key].total += parseFloat(tx.influencer_amount || 0)
      if (tx.status === 'released') map[key].received += parseFloat(tx.influencer_amount || 0)
      if (tx.status === 'in_escrow') map[key].escrow += parseFloat(tx.influencer_amount || 0)
      const d = new Date(tx.created_at).getTime()
      if (d > map[key].lastDate) map[key].lastDate = d
    })
    return Object.values(map).sort((a, b) => b.lastDate - a.lastDate)
  })()

  // Fonds en attente : escrow + pending (hors micro-transactions de test)
  const enAttenteItems = transactions
    .filter(t => (t.status === 'in_escrow' || t.status === 'pending') && isRealTx(t))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const enAttenteTotal = enAttenteItems.reduce((s, t) => s + parseFloat(t.influencer_amount || 0), 0)
  const docCampaignGroups = (() => {
    const map = {}
    transactions.filter(tx => !isRefundTx(tx) && !isMicroTx(tx) && (tx.status === 'released' || tx.status === 'in_escrow')).forEach(tx => {
      const key = tx.contract_id || tx.collaboration_id || `tx-${tx.id}`
      const company = getBrandName(tx)
      const label = company || tx.description || (tx.contract_id || tx.collaboration_id ? `Campagne #${(tx.contract_id || tx.collaboration_id).slice(0, 8)}` : `Paiement #${tx.id.slice(0, 8)}`)
      if (!map[key]) map[key] = { key, label, company, txs: [], years: new Set(), lastDate: 0 }
      map[key].txs.push(tx)
      map[key].years.add(new Date(tx.created_at).getFullYear())
      const d = new Date(tx.created_at).getTime()
      if (d > map[key].lastDate) map[key].lastDate = d
    })
    return Object.values(map)
      .map(g => ({ ...g, yearsLabel: Array.from(g.years).sort().join(', ') }))
      .sort((a, b) => b.lastDate - a.lastDate)
  })()

  // ===== Assistant fiscal IA =====
  const presetQuestions = [
    "Je suis auto-entrepreneur (micro-entreprise) : quelles sont mes obligations fiscales pour mes revenus de créateur ?",
    "Je n'ai pas de statut : comment déclarer mes revenus de créateur ?",
    "J'ai une société (SASU/EURL) : comment sont imposés mes revenus de créateur ?",
  ]

  const buildPayload = (msgs) => msgs.map(m => {
    if (m.images && m.images.length) {
      const blocks = m.images.map(f => f.kind === 'pdf'
        ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: f.data } }
        : { type: 'image', source: { type: 'base64', media_type: f.mediaType, data: f.data } })
      blocks.push({ type: 'text', text: m.content || 'Peux-tu analyser ce document ?' })
      return { role: m.role, content: blocks }
    }
    return { role: m.role, content: m.content }
  })

  const sendChat = async (text) => {
    const content = (typeof text === 'string' ? text : chatInput).trim()
    if ((!content && !pendingImage) || chatLoading) return
    const userMsg = { role: 'user', content, images: pendingImage ? [pendingImage] : undefined }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    setPendingImage(null)
    setChatLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { toast.error('Tu dois être connecté'); setChatLoading(false); return }
      const res = await fetch('/api/influencer/fiscal-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages: buildPayload(newMessages) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setChatMessages([...newMessages, { role: 'assistant', content: data.error || "Désolé, une erreur est survenue. Réessaie." }])
        return
      }
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply }])
      if (typeof data.remaining === 'number') setChatRemaining(data.remaining)
    } catch (e) {
      setChatMessages([...newMessages, { role: 'assistant', content: `Désolé, je n'ai pas pu répondre (${e.message || 'erreur'}). Réessaie.` }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleAttachImage = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const isPdf = file.type === 'application/pdf'
    const isImg = file.type.startsWith('image/')
    if (!isImg && !isPdf) { toast.error('Image ou PDF uniquement'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Fichier trop lourd (max 5 Mo)'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      setPendingImage({ url: dataUrl, mediaType: file.type, data: dataUrl.split(',')[1], kind: isPdf ? 'pdf' : 'image', name: file.name })
    }
    reader.readAsDataURL(file)
  }

  const openChat = (starter) => {
    setChatOpen(true)
    if (starter && chatMessages.length === 0) setTimeout(() => sendChat(starter), 120)
  }

  const resetChat = () => { setChatMessages([]); setPendingImage(null); setChatInput('') }

  // Auto-scroll vers le bas
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatLoading])

  // Mise en forme légère du markdown (gras + listes), sans dépendance
  const formatInline = (text) => String(text).split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
  const renderMarkdown = (text) => {
    const lines = String(text).split('\n')
    const blocks = []
    let list = null
    const flush = () => { if (list) { blocks.push(list); list = null } }
    lines.forEach((raw) => {
      const line = raw.trimEnd()
      const bullet = line.match(/^\s*[-*•]\s+(.*)/)
      const numbered = line.match(/^\s*\d+\.\s+(.*)/)
      if (bullet) {
        if (!list || list.ordered) { flush(); list = { type: 'list', ordered: false, items: [] } }
        list.items.push(bullet[1])
      } else if (numbered) {
        if (!list || !list.ordered) { flush(); list = { type: 'list', ordered: true, items: [] } }
        list.items.push(numbered[1])
      } else {
        flush()
        blocks.push(line.trim() === '' ? { type: 'space' } : { type: 'p', text: line })
      }
    })
    flush()
    return blocks.map((b, i) => {
      if (b.type === 'list') {
        const Tag = b.ordered ? 'ol' : 'ul'
        return <Tag key={i} className={`${b.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 my-1.5`}>{b.items.map((it, j) => <li key={j}>{formatInline(it)}</li>)}</Tag>
      }
      if (b.type === 'space') return <div key={i} className="h-2" />
      return <p key={i} className="my-1">{formatInline(b.text)}</p>
    })
  }

  const totalReceived = realTransactions.filter(t => t.status === 'released').reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)
  const totalAll = realTransactions.reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)

  const availableForWithdraw = totalReceived

  const last12Months = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleDateString('fr-FR', { month: 'short' })
    const total = realTransactions
      .filter(t => {
        const txDate = new Date(t.created_at)
        return txDate.getFullYear() === d.getFullYear() && txDate.getMonth() === d.getMonth() && t.status === 'released'
      })
      .reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)
    last12Months.push({ month: monthLabel, revenue: total, key: monthKey })
  }

  const monthsWithRevenue = last12Months.filter(m => m.revenue > 0)
  const avgMonthly = monthsWithRevenue.length > 0
    ? monthsWithRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthsWithRevenue.length
    : 0
  const bestMonth = last12Months.reduce((best, m) => m.revenue > (best?.revenue || 0) ? m : best, null)
  const totalLast12 = last12Months.reduce((sum, m) => sum + m.revenue, 0)

  const byYear = {}
  realTransactions.filter(t => t.status === 'released').forEach(t => {
    const y = new Date(t.created_at).getFullYear()
    if (!byYear[y]) byYear[y] = { revenue: 0, count: 0 }
    byYear[y].revenue += parseFloat(t.influencer_amount || 0)
    byYear[y].count += 1
  })
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)
  const currentYear = new Date().getFullYear()

  const monthsList = Array.from({ length: 12 }, (_, i) => {
    const tx = realTransactions.filter(t => { const d = new Date(t.created_at); return d.getFullYear() === currentYear && d.getMonth() === i })
    const total = tx.filter(t => t.status === 'released').reduce((s, t) => s + parseFloat(t.influencer_amount || 0), 0)
    return { i, label: new Date(currentYear, i, 1).toLocaleDateString('fr-FR', { month: 'long' }), total, count: tx.length }
  })

  const handleWithdraw = async () => {
    if (!iban.trim() || !holderName.trim()) {
      toast.error("Renseigne ton IBAN et le titulaire du compte")
      return
    }
    setWithdrawLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(`Demande de retrait de ${availableForWithdraw.toLocaleString()}€ envoyée ! Tu recevras les fonds sous 3-5 jours ouvrés.`)
    setWithdrawDialogOpen(false)
    setIban("")
    setHolderName("")
    setWithdrawLoading(false)
  }

  const handleExportCSV = () => {
    const rows = [['Date', 'Description', 'Montant', 'Statut']]
    transactions.forEach(t => {
      rows.push([
        new Date(t.created_at).toLocaleDateString('fr-FR'),
        t.description || `Transaction ${t.id.slice(0, 8)}`,
        parseFloat(t.influencer_amount || 0).toFixed(2),
        getPaymentStatusLabel(t.status),
      ])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `partnexx-historique-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export CSV téléchargé')
  }

  const handleDownloadMonth = (year, monthIndex, label) => {
    const rows = [['Date', 'Description', 'Montant', 'Statut']]
    transactions
      .filter(t => { const d = new Date(t.created_at); return d.getFullYear() === year && d.getMonth() === monthIndex })
      .forEach(t => rows.push([
        new Date(t.created_at).toLocaleDateString('fr-FR'),
        t.description || `Transaction ${t.id.slice(0, 8)}`,
        parseFloat(t.influencer_amount || 0).toFixed(2),
        getPaymentStatusLabel(t.status),
      ]))
    if (rows.length === 1) { toast.info(`Aucune transaction en ${label} ${year}`); return }
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `partnexx-${year}-${String(monthIndex + 1).padStart(2, '0')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Récap ${label} téléchargé`)
  }

  const handleDownloadAnnualReport = async (year = new Date().getFullYear()) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Tu dois être connecté pour télécharger ton récap')
        return
      }
      const res = await fetch(`/api/influencer/annual-report?year=${year}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur lors du téléchargement')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recap-partnexx-${year}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Récap annuel téléchargé !')
    } catch (e) {
      console.error(e)
      toast.error(e.message || 'Erreur lors du téléchargement')
    }
  }

  const handleDownloadMonthPdf = async (year, month, label) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Tu dois être connecté pour télécharger ton récap')
        return
      }
      const res = await fetch(`/api/influencer/monthly-report?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur lors du téléchargement')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recap-partnexx-${year}-${String(month).padStart(2, '0')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Récap ${label} téléchargé !`)
    } catch (e) {
      console.error(e)
      toast.error(e.message || 'Erreur lors du téléchargement')
    }
  }

  const handleDownloadReceipt = async (transactionId) => {
    try {
      setDownloadingReceiptId(transactionId)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Tu dois être connecté pour télécharger ton reçu')
        return
      }
      const res = await fetch(`/api/influencer/receipt?transactionId=${transactionId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur lors du téléchargement')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recu-partnexx-${transactionId.slice(0, 8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Reçu téléchargé !')
    } catch (e) {
      console.error(e)
      toast.error(e.message || 'Erreur lors du téléchargement')
    } finally {
      setDownloadingReceiptId(null)
    }
  }

  const handleDownloadIssuedInvoice = async (transactionId) => {
    try {
      setDownloadingInvoiceId(transactionId)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Tu dois être connecté')
        return
      }
      const res = await fetch(`/api/influencer/issued-invoice?transactionId=${transactionId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur lors du téléchargement')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `facture-${transactionId.slice(0, 8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Facture téléchargée !')
    } catch (e) {
      console.error(e)
      toast.error(e.message || 'Erreur')
    } finally {
      setDownloadingInvoiceId(null)
    }
  }

  // Ligne paiement compacte (dans une campagne dépliée)
  const renderPaymentRow = (tx) => {
    const esc = tx.status === 'in_escrow' ? getEscrowRelease(tx) : null
    return (
      <div key={tx.id} className="flex items-center justify-between gap-3 px-5 py-3 border-t">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{tx.status === 'released' ? '+' : ''}{parseFloat(tx.influencer_amount || 0).toLocaleString()}€</span>
            <Badge variant="outline" className={getPaymentStatusColor(tx.status)}>{getPaymentStatusLabel(tx.status)}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{tx.type || 'Paiement'} • {new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
          {tx.status === 'in_escrow' && (
            <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              {esc ? <>Libéré auto le {esc.due.toLocaleDateString('fr-FR')}{esc.days > 0 ? ` (${esc.days} j)` : ' (imminent)'} · ou dès validation marque</> : <>En attente de validation marque (sous {ESCROW_AUTO_DAYS} j)</>}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {tx.status === 'released' && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleDownloadReceipt(tx.id)} disabled={downloadingReceiptId === tx.id}><Receipt className="h-3.5 w-3.5" />{downloadingReceiptId === tx.id ? '...' : 'Reçu'}</Button>
          )}
        </div>
      </div>
    )
  }

  const paySubTabs = [
    { value: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { value: 'transactions', label: 'Transactions', icon: Receipt },
    { value: 'retraits', label: 'Retraits', icon: Wallet },
    { value: 'fiscalite', label: 'Fiscalité', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* ============ DIALOG RETRAIT (niveau racine, accessible partout) ============ */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              Demande de retrait
            </DialogTitle>
            <DialogDescription>
              Renseigne tes informations bancaires pour recevoir {availableForWithdraw.toLocaleString()}€
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm font-medium">Montant à retirer</span>
              <span className="text-xl font-bold text-green-600">{availableForWithdraw.toLocaleString()}€</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="holder">Titulaire du compte *</Label>
              <Input id="holder" placeholder="Nom Prénom" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN *</Label>
              <Input id="iban" placeholder="FR76 1234 5678 9012 3456 7890 123" value={iban} onChange={(e) => setIban(e.target.value.toUpperCase())} />
              <p className="text-xs text-muted-foreground">Les fonds arriveront sur ce compte sous 3-5 jours ouvrés.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setWithdrawDialogOpen(false)}>Annuler</Button>
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white" onClick={handleWithdraw} disabled={withdrawLoading}>
                {withdrawLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Envoi...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" />Confirmer</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ MODAL RÉCAP MENSUEL ============ */}
      <Dialog open={monthlyOpen} onOpenChange={setMonthlyOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-blue-500" />Récapitulatif mensuel {currentYear}</DialogTitle>
            <DialogDescription>Télécharge le PDF officiel d'un mois, ou le récap annuel.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Button className="w-full gap-2" onClick={() => handleDownloadAnnualReport(currentYear)}><Download className="h-4 w-4" />Récap annuel {currentYear} (PDF)</Button>
            <div className="space-y-1.5">
              {monthsList.map(m => (
                <div key={m.i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.count} transaction{m.count > 1 ? 's' : ''} • {m.total.toLocaleString()}€</p>
                  </div>
                  <Button variant="outline" size="sm" disabled={m.count === 0} onClick={() => handleDownloadMonthPdf(currentYear, m.i + 1, `${m.label} ${currentYear}`)}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ MODAL FACTURES & REÇUS ============ */}
      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-purple-500" />Mes factures</DialogTitle>
            <DialogDescription>Clique sur une campagne pour télécharger ses factures (émises par PARTNEXX pour ton compte).</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {docCampaignGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune facture pour l'instant.</p>
            ) : docCampaignGroups.map(g => {
              const open = expandedDocCampaign === g.key
              return (
                <div key={g.key} className="border rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedDocCampaign(open ? null : g.key)} className="w-full flex items-center justify-between gap-3 p-3 hover:bg-muted/40 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0"><FileText className="h-4 w-4 text-purple-500" /></div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{g.label}</p>
                        <p className="text-xs text-muted-foreground">{g.yearsLabel} · {g.txs.length} paiement{g.txs.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
                  </button>
                  {open && (
                    <div className="border-t divide-y">
                      {g.txs.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between gap-3 p-3 bg-muted/20">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{parseFloat(tx.influencer_amount || tx.amount || 0).toLocaleString()}€</p>
                              <Badge variant="outline" className={getPaymentStatusColor(tx.status)}>{getPaymentStatusLabel(tx.status)}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <Button variant="outline" size="sm" className="shrink-0" onClick={() => handleDownloadIssuedInvoice(tx.id)} disabled={downloadingInvoiceId === tx.id}><FileText className="h-3.5 w-3.5 mr-1" />{downloadingInvoiceId === tx.id ? '...' : 'Facture'}</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ MODAL FONDS EN ATTENTE (escrow + pending) ============ */}
      <Dialog open={enAttenteOpen} onOpenChange={setEnAttenteOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-orange-500" />Fonds en attente</DialogTitle>
            <DialogDescription>Montants pas encore reçus — libérés à la validation de la marque (ou automatiquement sous 15 j).</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 mb-3">
            <p className="text-sm text-muted-foreground">Total en attente</p>
            <p className="text-2xl font-bold text-orange-600">{enAttenteTotal.toLocaleString()}€</p>
          </div>
          <div className="space-y-2">
            {enAttenteItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Aucun fonds en attente 🎉</p>
            ) : enAttenteItems.map(tx => {
              const esc = tx.status === 'in_escrow' ? getEscrowRelease(tx) : null
              return (
                <div key={tx.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{getCampaignLabel(tx)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{parseFloat(tx.influencer_amount || 0).toLocaleString()}€</p>
                      <Badge variant="outline" className={getPaymentStatusColor(tx.status)}>{getPaymentStatusLabel(tx.status)}</Badge>
                    </div>
                  </div>
                  {esc && (
                    <p className="text-xs text-orange-600 mt-2 flex items-center gap-1"><Clock className="h-3 w-3 flex-shrink-0" />Libéré auto le {esc.due.toLocaleDateString('fr-FR')}{esc.days > 0 ? ` (${esc.days} j)` : ' (imminent)'} · ou dès validation marque</p>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 mt-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">Les fonds sont sécurisés et libérés dès que la marque valide ton contenu, ou automatiquement au plus tard 15 jours après. Tu es protégé contre les impayés.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ CHAT ASSISTANT FISCAL IA ============ */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogTitle className="sr-only">Assistant fiscal IA</DialogTitle>
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b bg-gradient-to-r from-primary/10 to-purple-500/5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow"><Shield className="h-5 w-5 text-white" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-tight">Assistant fiscal IA</p>
              <p className="text-xs text-muted-foreground">Spécialiste fiscalité &amp; droit des créateurs · infos générales</p>
            </div>
            {chatMessages.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground mr-7" onClick={resetChat}><RefreshCw className="h-3.5 w-3.5" />Nouvelle</Button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {chatMessages.length === 0 && !chatLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-5 py-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center"><Shield className="h-7 w-7 text-primary" /></div>
                <div>
                  <p className="font-semibold">Bonjour 👋</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">Pose-moi tes questions de fiscalité <strong>ou de droit</strong> de créateur. Tu peux aussi joindre une <strong>photo ou un PDF</strong> (avis d'imposition, contrat, formulaire…).</p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {presetQuestions.map((q, i) => (
                    <button key={i} onClick={() => sendChat(q)} className="text-left text-sm px-4 py-2.5 rounded-xl border hover:bg-muted/60 transition-colors">{q}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (<div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5"><Shield className="h-4 w-4 text-primary" /></div>)}
                    <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm whitespace-pre-wrap' : 'bg-muted rounded-bl-sm'}`}>
                      {m.images && m.images.map((f, j) => f.kind === 'pdf'
                        ? (<div key={j} className="flex items-center gap-2 mb-2 rounded-lg border bg-background/40 px-3 py-2 text-xs"><FileText className="h-4 w-4 flex-shrink-0" /><span className="truncate">{f.name || 'Document.pdf'}</span></div>)
                        : (<img key={j} src={f.url} alt="" className="rounded-lg mb-2 max-h-48 w-auto" />))}
                      {m.role === 'assistant' ? renderMarkdown(m.content) : m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Shield className="h-4 w-4 text-primary" /></div>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3 space-y-2">
            {pendingImage && (
              <div className="flex items-center gap-2 text-xs">
                {pendingImage.kind === 'pdf'
                  ? (<div className="flex items-center gap-2 rounded-lg border px-3 py-2 max-w-[60%]"><FileText className="h-4 w-4 flex-shrink-0" /><span className="truncate">{pendingImage.name || 'Document.pdf'}</span></div>)
                  : (<img src={pendingImage.url} alt="" className="h-12 w-12 rounded-lg object-cover" />)}
                <span className="text-muted-foreground">{pendingImage.kind === 'pdf' ? 'PDF joint' : 'Image jointe'}</span>
                <button onClick={() => setPendingImage(null)} className="text-muted-foreground hover:text-foreground ml-auto">✕ Retirer</button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <label className="h-10 w-10 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-muted/60 flex-shrink-0" title="Joindre une photo ou un PDF">
                <ImagePlus className="h-4 w-4" />
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleAttachImage} />
              </label>
              <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }} placeholder="Écris ta question..." disabled={chatLoading} className="flex-1" />
              <Button onClick={() => sendChat()} disabled={chatLoading || (!chatInput.trim() && !pendingImage)} className="flex-shrink-0"><Send className="h-4 w-4" /></Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              ⚠️ Réponses IA à titre informatif. Confirme avec ton expert-comptable ou ton avocat.
              {chatRemaining !== null && <> · Il te reste {chatRemaining} question{chatRemaining > 1 ? 's' : ''} aujourd'hui</>}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ SOUS-ONGLETS PAIEMENTS ============ */}
      <Tabs value={paySubTab} onValueChange={setPaySubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-0 h-auto mb-6">
          {paySubTabs.map((t) => {
            const Icon = t.icon
            return (
              <TabsTrigger key={t.value} value={t.value} className="rounded-xl h-10 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 data-[state=active]:border-green-500/30 bg-card hover:bg-muted/50 transition-all border border-border/50">
                <span className="flex items-center gap-2 font-medium text-[13px]"><Icon className="h-3.5 w-3.5" />{t.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* ─────────── DASHBOARD ─────────── */}
        <TabsContent value="dashboard" className="mt-2 space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><Wallet className="h-7 w-7" /></div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Solde disponible</p>
                  <h2 className="text-5xl font-bold">{availableForWithdraw.toLocaleString()}€</h2>
                </div>
              </div>
              <Button
                onClick={() => canWithdraw ? setWithdrawDialogOpen(true) : setPaySubTab('retraits')}
                className="bg-white text-green-700 hover:bg-white/90 gap-2"
              >
                {canWithdraw ? <><Send className="h-4 w-4" />Retirer mes gains</> : <><Lock className="h-4 w-4" />Débloquer les retraits</>}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-600" /></div>
                  <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">Reçu</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">{totalReceived.toLocaleString()}€</p>
                <p className="text-sm text-muted-foreground">Paiements reçus</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-orange-500/10"><Clock className="h-5 w-5 text-orange-500" /></div>
                  <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">En attente</Badge>
                </div>
                <p className="text-2xl font-bold text-orange-500">{enAttenteTotal.toLocaleString()}€</p>
                <p className="text-sm text-muted-foreground">Escrow + en attente de libération</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
                  <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Total</Badge>
                </div>
                <p className="text-2xl font-bold">{totalAll.toLocaleString()}€</p>
                <p className="text-sm text-muted-foreground">Volume total</p>
              </CardContent>
            </Card>
          </div>

          {totalAll > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Taux de recouvrement</p>
                  <p className="text-sm font-bold text-green-600">{Math.round((totalReceived / totalAll) * 100)}%</p>
                </div>
                <Progress value={(totalReceived / totalAll) * 100} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{totalReceived.toLocaleString()}€ reçus</span>
                  <span>{totalAll.toLocaleString()}€ total</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─────────── TRANSACTIONS ─────────── */}
        <TabsContent value="transactions" className="mt-2 space-y-6">
          {enAttenteTotal > 0 && (
            <button onClick={() => setEnAttenteOpen(true)} className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0"><Lock className="h-5 w-5 text-orange-600" /></div>
                <div>
                  <p className="font-semibold text-orange-700">{enAttenteTotal.toLocaleString()}€ en attente</p>
                  <p className="text-xs text-muted-foreground">Pas encore reçu — clique pour voir le détail</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-orange-600 flex-shrink-0" />
            </button>
          )}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un paiement..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Aucun paiement</h3>
                  <p className="text-sm text-muted-foreground">Vos paiements apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun paiement trouvé</p>
                </CardContent>
              </Card>
            ) : (
              campaignGroups.map((camp) => {
                const open = expandedCampaign === camp.key
                return (
                  <Card key={camp.key} className="overflow-hidden">
                    <button onClick={() => setExpandedCampaign(open ? null : camp.key)} className="w-full text-left hover:bg-muted/40 transition-colors">
                      <div className="p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="p-3 rounded-full bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{camp.label}</p>
                            <p className="text-xs text-muted-foreground">{camp.txs.length} paiement{camp.txs.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {camp.received > 0 ? (
                              <>
                                <p className="text-lg font-bold text-green-600">+{camp.received.toLocaleString()}€</p>
                                <p className="text-xs text-muted-foreground">reçu</p>
                              </>
                            ) : camp.escrow > 0 ? (
                              <>
                                <p className="text-lg font-bold text-orange-600">{camp.escrow.toLocaleString()}€</p>
                                <p className="text-xs text-muted-foreground">en escrow</p>
                              </>
                            ) : (
                              <>
                                <p className="text-lg font-bold text-muted-foreground">{camp.total.toLocaleString()}€</p>
                                <p className="text-xs text-muted-foreground">en attente</p>
                              </>
                            )}
                          </div>
                          <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </button>
                    {open && <div>{camp.txs.map(renderPaymentRow)}</div>}
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* ─────────── RETRAITS ─────────── */}
        <TabsContent value="retraits" className="mt-2 space-y-6">
          <Card className={`relative overflow-hidden border-2 ${canWithdraw ? 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5' : 'border-muted'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${canWithdraw ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-muted'}`}>
                    {canWithdraw ? <Wallet className="h-7 w-7 text-white" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Disponible pour retrait</p>
                    <p className={`text-3xl font-bold ${canWithdraw ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {availableForWithdraw.toLocaleString()}€
                    </p>
                    {!canWithdraw && (
                      <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Complète ton profil à 100% pour débloquer les retraits
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => setWithdrawDialogOpen(true)}
                  disabled={!canWithdraw || availableForWithdraw <= 0}
                  size="lg"
                  className={`gap-2 ${canWithdraw && availableForWithdraw > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white' : ''}`}
                >
                  {!canWithdraw ? (
                    <><Lock className="h-4 w-4" />Verrouillé</>
                  ) : availableForWithdraw <= 0 ? (
                    <>Aucun gain disponible</>
                  ) : (
                    <><Send className="h-4 w-4" />Retirer mes gains</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="opacity-70">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold">Méthodes de retrait</h4>
                  <Badge variant="outline">Bientôt</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Enregistre tes IBAN / PayPal pour des retraits en un clic.</p>
              </CardContent>
            </Card>
            <Card className="opacity-70">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold">Historique des retraits</h4>
                  <Badge variant="outline">Bientôt</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Retrouve tous tes virements passés et leur statut.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─────────── FISCALITÉ ─────────── */}
        <TabsContent value="fiscalite" className="mt-2 space-y-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center"><FileText className="h-6 w-6 text-primary" /></div>
              <div>
                <h3 className="text-2xl font-bold">Espace Fiscalité</h3>
                <p className="text-sm text-muted-foreground">Tous tes documents comptables en un seul endroit</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background/50 backdrop-blur rounded-lg p-4 border">
                <p className="text-sm text-muted-foreground mb-1">Revenus reçus {currentYear}</p>
                <p className="text-2xl font-bold">{(byYear[currentYear]?.revenue || 0).toLocaleString()}€</p>
              </div>
              <div className="bg-background/50 backdrop-blur rounded-lg p-4 border">
                <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </div>

          {/* Historique avancé (Platine) — conservé */}
          <Card className="relative overflow-hidden border-2">
            {!canAccessAdvancedHistory && (
              <div className="absolute inset-0 z-30 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-gradient-to-r from-cyan-400 to-sky-500 text-white border-0 shadow-lg">💠 Niveau Platine requis</Badge>
                <div>
                  <p className="text-lg font-bold mb-1">Historique avancé verrouillé</p>
                  <p className="text-sm text-muted-foreground max-w-md">Filtres dates, export CSV, graphique d&apos;évolution, stats détaillées des revenus</p>
                  <p className="text-sm text-cyan-600 font-semibold mt-2">Plus que {Math.max(0, 1000 - userScore)} points pour débloquer</p>
                </div>
              </div>
            )}
            <div className={!canAccessAdvancedHistory ? 'opacity-30' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-600" />
                    Historique Avancé
                    <Badge className="bg-gradient-to-r from-cyan-400 to-sky-500 text-white border-0">💠 Platine</Badge>
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={!canAccessAdvancedHistory}>
                    <Download className="h-4 w-4 mr-2" />Exporter CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <p className="text-xs text-muted-foreground mb-1">Revenu moyen / mois</p>
                    <p className="text-xl font-bold text-cyan-600">{Math.round(avgMonthly).toLocaleString()}€</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <p className="text-xs text-muted-foreground mb-1">Meilleur mois</p>
                    <p className="text-xl font-bold text-cyan-600">{bestMonth && bestMonth.revenue > 0 ? `${bestMonth.revenue.toLocaleString()}€` : '—'}</p>
                    {bestMonth && bestMonth.revenue > 0 && <p className="text-xs text-muted-foreground capitalize">{bestMonth.month}</p>}
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <p className="text-xs text-muted-foreground mb-1">Total 12 derniers mois</p>
                    <p className="text-xl font-bold text-cyan-600">{totalLast12.toLocaleString()}€</p>
                  </div>
                </div>
                <div className="h-[300px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={last12Months}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(195 80% 50%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(195 80% 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${v}€`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toLocaleString()}€`, 'Revenus']} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(195 80% 50%)" fill="url(#revenueGrad)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center">📊 Évolution de tes revenus sur les 12 derniers mois</p>
              </CardContent>
            </div>
          </Card>

          {/* Récapitulatif par année (vraies données) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Récapitulatif par année</h4>
              <Button variant="outline" size="sm" onClick={() => handleDownloadAnnualReport()}>
                <Download className="h-4 w-4 mr-2" />Tout télécharger
              </Button>
            </div>

            {years.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-muted-foreground">Aucun revenu enregistré pour l'instant — tes récaps annuels apparaîtront ici.</CardContent></Card>
            ) : years.map((y) => (
              <Card key={y} className={y === currentYear ? "border-primary/30 shadow-lg" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold">{y}</h3>
                      {y === currentYear
                        ? <Badge className="bg-green-500/10 text-green-500">Année en cours</Badge>
                        : <Badge variant="outline">Année complète</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total revenus</p>
                      <p className="text-3xl font-bold text-primary">{byYear[y].revenue.toLocaleString()}€</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg text-sm mb-4">
                    <span className="text-muted-foreground">Transactions</span>
                    <span className="font-bold">{byYear[y].count}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadAnnualReport(y)}><FileText className="h-4 w-4 mr-2" />Attestation {y}</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadAnnualReport(y)}><Download className="h-4 w-4 mr-2" />Export détaillé</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Exports personnalisés */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Download className="h-5 w-5" /><CardTitle>Exports personnalisés</CardTitle></div>
              <CardDescription>Télécharge tes données dans différents formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                <Button variant="outline" className="h-auto flex-col items-start p-4 hover:border-primary" onClick={() => toast.info("Export Excel bientôt disponible")}>
                  <FileText className="h-6 w-6 mb-2 text-green-600" /><span className="font-semibold">Excel (.xlsx)</span><span className="text-xs text-muted-foreground mt-1">Tableau complet</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 hover:border-primary" onClick={handleExportCSV}>
                  <FileText className="h-6 w-6 mb-2 text-blue-600" /><span className="font-semibold">CSV</span><span className="text-xs text-muted-foreground mt-1">Format universel</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 hover:border-primary" onClick={() => handleDownloadAnnualReport()}>
                  <FileText className="h-6 w-6 mb-2 text-red-600" /><span className="font-semibold">PDF</span><span className="text-xs text-muted-foreground mt-1">Récap officiel</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents officiels */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /><CardTitle>Documents officiels</CardTitle></div>
              <CardDescription>Justificatifs conformes aux normes fiscales françaises</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button onClick={() => handleDownloadAnnualReport()} className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded bg-green-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-500" /></div><div><p className="font-medium">Attestation de revenus {currentYear}</p><p className="text-sm text-muted-foreground">Document certifié conforme</p></div></div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => setMonthlyOpen(true)} className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center"><Receipt className="h-5 w-5 text-blue-500" /></div><div><p className="font-medium">Récapitulatif mensuel {currentYear}</p><p className="text-sm text-muted-foreground">Détail mois par mois</p></div></div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => setDocsOpen(true)} className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded bg-purple-500/10 flex items-center justify-center"><FileText className="h-5 w-5 text-purple-500" /></div><div><p className="font-medium">Mes factures</p><p className="text-sm text-muted-foreground">Une facture par campagne</p></div></div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          {/* Assistant IA + Rappels */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2"><div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center"><Shield className="h-5 w-5 text-primary" /></div><CardTitle className="text-xl">Assistant fiscal IA</CardTitle></div>
                <CardDescription>Fiscalité &amp; droit des créateurs — pose tes questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Statut, TVA, déclaration, contrats, droits d'auteur… L'assistant connaît tes chiffres, et tu peux même lui envoyer la photo d'un document.</p>
                <Button className="w-full gap-2" onClick={() => openChat()}><Shield className="h-4 w-4" />Discuter avec l'assistant</Button>
              </CardContent>
            </Card>

            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2"><div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center"><AlertCircle className="h-5 w-5 text-orange-500" /></div><CardTitle className="text-xl">Rappels importants</CardTitle></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 p-3 bg-orange-500/5 rounded-lg border border-orange-500/20"><Calendar className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" /><div><p className="font-medium text-sm">Déclaration annuelle</p><p className="text-xs text-muted-foreground">Généralement au printemps (avril-juin)</p></div></div>
                <div className="flex gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20"><CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" /><div><p className="font-medium text-sm">Cotisations sociales</p><p className="text-xs text-muted-foreground">Selon ton statut (URSSAF)</p></div></div>
                <div className="flex gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20"><FileText className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" /><div><p className="font-medium text-sm">TVA</p><p className="text-xs text-muted-foreground">Franchise en base selon les seuils en vigueur</p></div></div>
              </CardContent>
            </Card>
          </div>

          {/* Guide */}
          <Card className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/20">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><FileText className="h-6 w-6 text-green-500" /></div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Guide : comment déclarer tes revenus d'influenceur ?</h4>
                <p className="text-sm text-muted-foreground mb-4">Un guide complet pour comprendre tes obligations fiscales, les démarches à suivre et les erreurs à éviter.</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => toast.info("Guide PDF bientôt disponible")}><Download className="h-4 w-4 mr-2" />Télécharger le guide PDF</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   COMPOSANT INTÉRIEUR
   ════════════════════════════════════════════════════════════ */
function ContratsContent({ contracts = [], transactions = [], user }) {
  const [activeTab, setActiveTab] = useState("contrats")

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Contrats & Paiements</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" /><span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Gestion Contractuelle • Suivi des Paiements • Historique Complet</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0 h-auto">
          <TabsTrigger value="contrats" className="rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-card hover:bg-muted/50 transition-all duration-300 border-2 data-[state=active]:border-blue-500/50 border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><FileText className="h-4 w-4" /></div>
              <span className="font-semibold">Contrats ({contracts.length})</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="paiements" className="rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-card hover:bg-muted/50 transition-all duration-300 border-2 data-[state=active]:border-green-500/50 border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><CreditCard className="h-4 w-4" /></div>
              <span className="font-semibold">Paiements ({transactions.length})</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contrats" className="mt-6">
          <ContratsCote contracts={contracts} transactions={transactions} user={user} />
        </TabsContent>
        <TabsContent value="paiements" className="mt-6">
          <PaiementsTab transactions={transactions} contracts={contracts} user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL — INCHANGÉ
   ════════════════════════════════════════════════════════════ */
export default function ContratsSection({ contracts = [], transactions = [], user }) {
  return (
    <LevelGate
      user={user}
      sectionTitle="Contrats & Paiements"
      sectionDescription="Gestion Contractuelle • Suivi des Paiements • Historique Complet"
    >
      <div className="mb-6">
        <PaymentSetup user={user} />
      </div>
      <ContratsContent contracts={contracts} transactions={transactions} user={user} />
    </LevelGate>
  )
}
