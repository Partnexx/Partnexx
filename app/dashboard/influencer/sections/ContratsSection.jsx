'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useState } from 'react'
import { Search, Calendar, DollarSign, FileText, Download, CreditCard, Brain, CheckCircle, Clock, AlertCircle, Eye, Shield, TrendingUp, Lock, Wallet, Send, BarChart3, Receipt } from 'lucide-react'
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

/* ============================================================
   ONGLET CONTRATS (inchangé)
   ============================================================ */
function ContratsTab({ contracts = [] }) {
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

/* ============================================================
   ONGLET PAIEMENTS — avec retrait Bronze + historique avancé Platine
   ============================================================ */
function PaiementsTab({ transactions = [], user }) {
  const { canAccess, score: userScore } = useLevel()

  const canWithdraw = canAccess('withdrawals')
  const canAccessAdvancedHistory = canAccess('advancedRevenueHistory')

  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [iban, setIban] = useState("")
  const [holderName, setHolderName] = useState("")
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [downloadingReceiptId, setDownloadingReceiptId] = useState(null)
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null)

  const filtered = transactions.filter(t => {
    const matchSearch = search === "" ||
      (t.description || "").toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalReceived = transactions.filter(t => t.status === 'released').reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)
  const totalPending = transactions.filter(t => t.status === 'in_escrow').reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)
  const totalAll = transactions.reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)

  const availableForWithdraw = totalReceived

  const last12Months = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleDateString('fr-FR', { month: 'short' })
    const total = transactions
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

  const handleDownloadAnnualReport = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Tu dois être connecté pour télécharger ton récap')
        return
      }
      const year = new Date().getFullYear()
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

  return (
    <div className="space-y-6">
      {/* ============ CARTE RETRAIT (Bronze) ============ */}
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

      {/* ============ DIALOG RETRAIT ============ */}
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
              <Button variant="outline" className="flex-1" onClick={() => setWithdrawDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                onClick={handleWithdraw}
                disabled={withdrawLoading}
              >
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

      {/* ============ STATS BASIQUES ============ */}
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
              <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">En escrow</Badge>
            </div>
            <p className="text-2xl font-bold text-orange-500">{totalPending.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">En attente de libération</p>
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

      {/* ============ HISTORIQUE AVANCÉ (Platine) ============ */}
      <Card className="relative overflow-hidden border-2">
        {!canAccessAdvancedHistory && (
          <div className="absolute inset-0 z-30 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-cyan-400 to-sky-500 text-white border-0 shadow-lg">
              💠 Niveau Platine requis
            </Badge>
            <div>
              <p className="text-lg font-bold mb-1">Historique avancé verrouillé</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Filtres dates, export CSV, graphique d&apos;évolution, stats détaillées des revenus
              </p>
              <p className="text-sm text-cyan-600 font-semibold mt-2">
                Plus que {Math.max(0, 1000 - userScore)} points pour débloquer
              </p>
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
                <p className="text-xl font-bold text-cyan-600">
                  {bestMonth && bestMonth.revenue > 0 ? `${bestMonth.revenue.toLocaleString()}€` : '—'}
                </p>
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

            <p className="text-xs text-muted-foreground text-center">
              📊 Évolution de tes revenus sur les 12 derniers mois
            </p>
          </CardContent>
        </div>
      </Card>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un paiement..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {["all", "released", "in_escrow", "pending"].map((s) => (
            <Button key={s} size="sm" variant={filterStatus === s ? "default" : "outline"} onClick={() => setFilterStatus(s)}>
              {s === "all" ? "Tous" : getPaymentStatusLabel(s)}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste paiements */}
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
          filtered.map((tx) => (
            <Card key={tx.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-full ${tx.status === "released" ? "bg-green-500/10" : "bg-orange-500/10"}`}>
                      <CreditCard className={`h-5 w-5 ${tx.status === "released" ? "text-green-600" : "text-orange-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold truncate">{tx.description || `Transaction #${tx.id.slice(0, 8)}`}</p>
                        <Badge variant="outline" className={getPaymentStatusColor(tx.status)}>
                          {getPaymentStatusLabel(tx.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>{tx.type || 'Paiement'}</span>
                        <span>•</span>
                        <span>{new Date(tx.created_at).toLocaleDateString('fr-FR')}</span>
                        {tx.stripe_payment_intent_id && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{tx.stripe_payment_intent_id.slice(0, 12)}...</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${tx.status === "released" ? "text-green-600" : "text-orange-500"}`}>
                        {tx.status === "released" ? "+" : ""}{parseFloat(tx.influencer_amount || 0).toLocaleString()}€
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.currency || 'EUR'}</p>
                    </div>
                    {(tx.status === "released" || tx.status === "in_escrow") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 whitespace-nowrap"
                        onClick={() => handleDownloadIssuedInvoice(tx.id)}
                        disabled={downloadingInvoiceId === tx.id}
                        title="Télécharger ma facture (envoyée à la marque)"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {downloadingInvoiceId === tx.id ? '...' : 'Facture'}
                      </Button>
                    )}
                    {tx.status === "released" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 whitespace-nowrap"
                        onClick={() => handleDownloadReceipt(tx.id)}
                        disabled={downloadingReceiptId === tx.id}
                        title="Télécharger le reçu de paiement"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        {downloadingReceiptId === tx.id ? '...' : 'Reçu'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ============ CARTE FISCALITÉ (récap annuel art. 242 bis) ============ */}
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-5 w-5 text-blue-600" />
            Fiscalité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Télécharge ton récapitulatif annuel de revenus pour ta déclaration d'impôts. PARTNEXX déclare également tes revenus à l'administration fiscale (DAC7).
          </p>
          <Button onClick={handleDownloadAnnualReport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger mon récap {new Date().getFullYear()}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

/* ============================================================
   COMPOSANT INTÉRIEUR
   ============================================================ */
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
          <ContratsTab contracts={contracts} />
        </TabsContent>
        <TabsContent value="paiements" className="mt-6">
          <PaiementsTab transactions={transactions} user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ============================================================
   EXPORT PRINCIPAL
   ============================================================ */
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
