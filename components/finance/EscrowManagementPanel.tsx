'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Shield, TrendingUp, Clock, Eye } from 'lucide-react'
import { fetchEscrows, type Escrow } from '@/components/finance/escrowStore'
import EscrowDetailsDialog from '@/components/finance/EscrowDetailsDialog'

const CONTRACT_TYPES = ['Placement de produit', 'Ambassadeur', 'One-shot', 'Notoriété', 'UGC'] as const

const EscrowManagementPanel = () => {
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const loadEscrows = async () => {
    setLoading(true)
    const data = await fetchEscrows()
    // tri par ordre des types
    const sorted = [...data].sort((a, b) =>
      CONTRACT_TYPES.indexOf(a.contract_type as any) - CONTRACT_TYPES.indexOf(b.contract_type as any)
    )
    setEscrows(sorted)
    setLoading(false)
  }

  useEffect(() => {
    loadEscrows()
  }, [])

  const handleViewDetails = (escrow: Escrow) => {
    setSelectedEscrow(escrow)
    setShowDetails(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>
      case 'active': return <Badge className="bg-green-500">Actif</Badge>
      case 'completed': return <Badge className="bg-blue-500">Terminé</Badge>
      case 'cancelled': return <Badge variant="destructive">Annulé</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const formatNextPayment = (frequency: string) => {
    const days = frequency === 'mensuel' ? 30 : frequency === 'hebdomadaire' ? 7 : 3
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  const totalBlocked = escrows.filter((e) => e.status === 'active').reduce((s, e) => s + e.amount, 0)
  const totalReleased = escrows.filter((e) => e.status === 'completed').reduce((s, e) => s + e.amount, 0)
  const pendingCount = escrows.filter((e) => e.status === 'active').length

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total bloqué</p>
                <p className="text-2xl font-bold">{totalBlocked.toFixed(2)} €</p>
              </div>
              <Shield className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total libéré</p>
                <p className="text-2xl font-bold text-green-600">{totalReleased.toFixed(2)} €</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paiements en attente</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table par type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />Paiements par Escrow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : escrows.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun escrow trouvé</p>
              <p className="text-sm text-muted-foreground mt-2">
                Les escrows seront créés automatiquement lors de l'activation des contrats
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {CONTRACT_TYPES.map((type) => {
                const typeEscrows = escrows.filter((e) => e.contract_type === type)
                if (typeEscrows.length === 0) return null
                return (
                  <div key={type}>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      {type}<Badge variant="outline">{typeEscrows.length}</Badge>
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Influenceur</TableHead>
                            <TableHead>Montant total</TableHead>
                            <TableHead>Prochain paiement</TableHead>
                            <TableHead>Fréquence</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typeEscrows.map((escrow) => (
                            <TableRow key={escrow.id}>
                              <TableCell>
                                <div className="font-medium">{escrow.influencer_id}</div>
                                <div className="text-xs text-muted-foreground">Contrat #{escrow.contract_id}</div>
                              </TableCell>
                              <TableCell className="font-medium">{escrow.amount.toFixed(2)} €</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{formatNextPayment(escrow.frequency)}</span>
                                </div>
                              </TableCell>
                              <TableCell><Badge variant="outline">{escrow.frequency}</Badge></TableCell>
                              <TableCell>{getStatusBadge(escrow.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(escrow)} className="gap-2">
                                  <Eye className="h-4 w-4" />Détails
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <EscrowDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        escrow={selectedEscrow}
        onRefresh={loadEscrows}
      />
    </div>
  )
}

export default EscrowManagementPanel