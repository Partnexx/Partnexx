'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, CheckCircle, XCircle, Clock, Shield, AlertTriangle } from 'lucide-react'
import {
  fetchEscrowTranches, validateTranche, releaseTranche,
  type Escrow, type EscrowTranche,
} from '@/components/finance/escrowStore'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  escrow: Escrow | null
  onRefresh: () => void
}

const EscrowDetailsDialog = ({ open, onOpenChange, escrow, onRefresh }: Props) => {
  const [tranches, setTranches] = useState<EscrowTranche[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (escrow && open) loadTranches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrow, open])

  const loadTranches = async () => {
    if (!escrow) return
    setLoading(true)
    const data = await fetchEscrowTranches(escrow.id)
    setTranches(data)
    setLoading(false)
  }

  const handleValidate = async (trancheId: string) => {
    try {
      await validateTranche(trancheId)
      toast.success('Tranche validée avec succès')
      await loadTranches()
      onRefresh()
    } catch {
      toast.error('Erreur lors de la validation')
    }
  }

  const handleRelease = async (trancheId: string) => {
    try {
      await releaseTranche(trancheId)
      toast.success('Paiement libéré avec succès')
      await loadTranches()
      onRefresh()
    } catch {
      toast.error('Erreur lors de la libération')
    }
  }

  const handleOpenDispute = () => {
    // Dispute pas encore portée — placeholder
    toast.info('Ouverture de litige : fonctionnalité bientôt disponible')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>
      case 'validated': return <Badge className="gap-1 bg-blue-500"><CheckCircle className="h-3 w-3" />Validé</Badge>
      case 'released': return <Badge className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Libéré</Badge>
      case 'cancelled': return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Annulé</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  if (!escrow) return null

  const totalReleased = tranches.filter((t) => t.status === 'released').reduce((s, t) => s + t.amount, 0)
  const totalPending = tranches.filter((t) => t.status !== 'released' && t.status !== 'cancelled').reduce((s, t) => s + t.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Détails de l'Escrow
          </DialogTitle>
          <DialogDescription>Contrat #{escrow.contract_id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Montant total</div>
              <div className="text-2xl font-bold">{escrow.amount.toFixed(2)} €</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Libéré</div>
              <div className="text-2xl font-bold text-green-600">{totalReleased.toFixed(2)} €</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600">En attente</div>
              <div className="text-2xl font-bold text-orange-600">{totalPending.toFixed(2)} €</div>
            </div>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Type de contrat:</span><span className="ml-2 font-medium">{escrow.contract_type}</span></div>
            <div><span className="text-muted-foreground">Fréquence:</span><span className="ml-2 font-medium">{escrow.frequency}</span></div>
            <div><span className="text-muted-foreground">Répartition:</span><span className="ml-2 font-medium">{escrow.payment_split}</span></div>
            <div><span className="text-muted-foreground">Validation requise:</span><span className="ml-2 font-medium">{escrow.validation_required ? 'Oui' : 'Non'}</span></div>
          </div>

          {/* Tranches */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Plan de paiement ({tranches.length} tranches)
            </h3>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date de libération</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tranches.map((tranche) => (
                      <TableRow key={tranche.id}>
                        <TableCell className="font-medium">{tranche.amount.toFixed(2)} €</TableCell>
                        <TableCell>{formatDate(tranche.release_date)}</TableCell>
                        <TableCell>{getStatusBadge(tranche.status)}</TableCell>
                        <TableCell className="text-right">
                          {tranche.status === 'pending' && escrow.validation_required && (
                            <Button size="sm" variant="outline" onClick={() => handleValidate(tranche.id)}>Valider</Button>
                          )}
                          {tranche.status === 'validated' && (
                            <Button size="sm" onClick={() => handleRelease(tranche.id)}>Libérer</Button>
                          )}
                          {tranche.status === 'released' && (
                            <span className="text-sm text-green-600">
                              Libéré le {tranche.released_at && formatDate(tranche.released_at)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">Un problème avec ce paiement Escrow ?</p>
            <Button
              variant="destructive"
              onClick={handleOpenDispute}
              disabled={escrow.status === 'disputed' || escrow.status === 'cancelled'}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />Ouvrir un litige
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EscrowDetailsDialog