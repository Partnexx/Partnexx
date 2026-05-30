'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search, FileText, Download, CreditCard, CheckCircle, Clock,
  AlertCircle, TrendingUp, Wallet, Receipt, ArrowDownToLine,
} from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'released': return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'in_escrow': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'refunded': return 'bg-red-500/10 text-red-600 border-red-500/20'
    default: return 'bg-muted text-muted-foreground border-border'
  }
}

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case 'released': return 'Versé au créateur'
    case 'in_escrow': return 'En escrow'
    case 'pending': return 'En attente'
    case 'refunded': return 'Remboursé'
    default: return status
  }
}

export default function FinancesSection({ user }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null)

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return
      try {
        // Récupérer la brand
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single()
        if (!brand) {
          setLoading(false)
          return
        }
        // Récupérer les transactions
        const { data: txs, error } = await supabase
          .from('transactions')
          .select(`
            id, amount, platform_fee, influencer_amount, status, type, metadata,
            created_at, released_at, stripe_payment_intent_id,
            influencers (id, display_name),
            collaborations (id, campaigns (id, title))
          `)
          .eq('brand_id', brand.id)
          .order('created_at', { ascending: false })
        if (error) throw error
        setTransactions(txs || [])
      } catch (e) {
        console.error(e)
        toast.error('Erreur de chargement des transactions')
      } finally {
        setLoading(false)
      }
    }
    loadTransactions()
  }, [user])

  // Stats
  const totalSpent = transactions.reduce((sum, t) => {
    const meta = t.metadata || {}
    const brandTotal = Number(meta.brand_total) || (Number(t.amount) || 0) + (Number(meta.vat) || 0)
    return sum + brandTotal
  }, 0)
  const totalCommission = transactions.reduce((sum, t) => {
    const meta = t.metadata || {}
    return sum + (Number(meta.commission_ttc) || Number(t.platform_fee) || 0)
  }, 0)
  const inEscrow = transactions
    .filter(t => t.status === 'in_escrow')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  const releasedCount = transactions.filter(t => t.status === 'released').length

  // Filtrage
  const filtered = transactions.filter(t => {
    const search1 = (t.collaborations?.campaigns?.title || '').toLowerCase()
    const search2 = (t.influencers?.display_name || '').toLowerCase()
    const matchSearch = search === '' ||
      search1.includes(search.toLowerCase()) ||
      search2.includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleDownloadInvoice = async (transactionId) => {
    try {
      setDownloadingInvoiceId(transactionId)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Tu dois être connecté')
        return
      }
      const res = await fetch(`/api/brand/invoice?transactionId=${transactionId}`, {
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
      a.download = `facture-partnexx-${transactionId.slice(0, 8)}.pdf`
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

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* TITRE */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gestion Financière</h1>
        <p className="text-muted-foreground">
          Suivi de tes dépenses, transactions et téléchargement de tes factures PARTNEXX.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10"><Wallet className="h-5 w-5 text-purple-600" /></div>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Total</Badge>
            </div>
            <p className="text-2xl font-bold">{totalSpent.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €</p>
            <p className="text-sm text-muted-foreground">Total dépensé (TTC)</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10"><Clock className="h-5 w-5 text-orange-500" /></div>
              <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">Escrow</Badge>
            </div>
            <p className="text-2xl font-bold text-orange-500">{inEscrow.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €</p>
            <p className="text-sm text-muted-foreground">En attente de libération</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">Versés</Badge>
            </div>
            <p className="text-2xl font-bold text-green-600">{releasedCount}</p>
            <p className="text-sm text-muted-foreground">Paiements créateurs réussis</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10"><Receipt className="h-5 w-5 text-blue-600" /></div>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">Frais</Badge>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalCommission.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €</p>
            <p className="text-sm text-muted-foreground">Commissions PARTNEXX (TTC)</p>
          </CardContent>
        </Card>
      </div>

      {/* INFO FACTURES */}
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Tes factures de commission</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Pour chaque collaboration payée, télécharge la facture officielle PARTNEXX (commission de service).
                La prestation du créateur fait l&apos;objet d&apos;une facturation séparée.
              </p>
              <p className="text-xs text-muted-foreground">
                💡 Les factures de ton abonnement PARTNEXX (Growth/Scale) sont envoyées séparément par email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FILTRES */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'in_escrow', 'released', 'pending', 'refunded'].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filterStatus === s ? 'default' : 'outline'}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'Toutes' : getPaymentStatusLabel(s)}
            </Button>
          ))}
        </div>
      </div>

      {/* LISTE TRANSACTIONS */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucune transaction</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Tes transactions apparaîtront ici dès que tu auras lancé ta première campagne avec un créateur.
              </p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune transaction trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((tx) => {
            const meta = tx.metadata || {}
            const brandTotal = Number(meta.brand_total) || (Number(tx.amount) || 0) + (Number(meta.vat) || 0)
            const commissionTTC = Number(meta.commission_ttc) || Number(tx.platform_fee) || 0
            const creatorName = tx.influencers?.display_name || 'Créateur'
            const campaignTitle = tx.collaborations?.campaigns?.title || 'Collaboration'
            return (
              <Card key={tx.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-3 rounded-full ${
                        tx.status === 'released' ? 'bg-green-500/10' :
                        tx.status === 'in_escrow' ? 'bg-orange-500/10' :
                        tx.status === 'refunded' ? 'bg-red-500/10' :
                        'bg-muted'
                      }`}>
                        <CreditCard className={`h-5 w-5 ${
                          tx.status === 'released' ? 'text-green-600' :
                          tx.status === 'in_escrow' ? 'text-orange-500' :
                          tx.status === 'refunded' ? 'text-red-600' :
                          'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold truncate">{campaignTitle}</p>
                          <Badge variant="outline" className={getPaymentStatusColor(tx.status)}>
                            {getPaymentStatusLabel(tx.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span>@{creatorName}</span>
                          <span>•</span>
                          <span>{new Date(tx.created_at).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>Commission : <strong>{commissionTTC.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {brandTotal.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                        </p>
                        <p className="text-xs text-muted-foreground">Payé (TTC)</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 whitespace-nowrap"
                        onClick={() => handleDownloadInvoice(tx.id)}
                        disabled={downloadingInvoiceId === tx.id}
                        title="Télécharger la facture de commission"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                        {downloadingInvoiceId === tx.id ? '...' : 'Facture'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
