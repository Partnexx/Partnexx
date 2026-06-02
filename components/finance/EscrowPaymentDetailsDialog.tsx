'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Shield, Calendar, CheckCircle, Clock, AlertCircle,
  Send, Download, FileText, Lock, Award, Target,
} from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: any
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
  getStatusIcon: (status: string) => any
  onReleaseEscrow: (trancheId?: number) => void
  onValidateTranche?: (trancheId: number) => void
  onSuspendContract?: (id: string) => void
}

export default function EscrowPaymentDetailsDialog({
  open,
  onOpenChange,
  transaction,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  onReleaseEscrow,
  onValidateTranche,
  onSuspendContract,
}: Props) {
  const [internalNotes, setInternalNotes] = useState('')

  if (!transaction) return null

  const StatusIcon = getStatusIcon(transaction.status)

  const handleExportPDF = () =>
    toast.info('📄 Export PDF en cours', { description: 'Le document détaillé avec logo Partnexx sera prêt dans quelques secondes.' })

  const handleRelease = (trancheId?: number) => {
    onReleaseEscrow(trancheId)
    if (!trancheId) onOpenChange(false)
  }

  const handleValidate = (trancheId: number) => {
    if (onValidateTranche) onValidateTranche(trancheId)
  }

  const handleSuspend = () => {
    if (onSuspendContract) {
      onSuspendContract(transaction.id)
      onOpenChange(false)
    }
  }

  const getTrancheStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-700 border-green-200'
      case 'validated': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTrancheStatusLabel = (status: string) => {
    switch (status) {
      case 'released': return 'Libérée'
      case 'validated': return 'Validée'
      case 'pending': return 'En attente'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Détails du paiement Escrow
          </DialogTitle>
          <DialogDescription>Suivi complet de la transaction sécurisée {transaction.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête transaction */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-2xl">{transaction.campaign}</h3>
                    {transaction.isMultiPhase && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">Multi-phase</Badge>
                    )}
                    {transaction.requiresContentValidation ? (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Lock className="h-3 w-3 mr-1" />Validation contenu
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        <Calendar className="h-3 w-3 mr-1" />Paiement automatique
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mb-2">{transaction.influencer}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={getStatusColor(transaction.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {getStatusLabel(transaction.status)}
                    </Badge>
                    <Badge variant="outline">{transaction.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-primary">€{transaction.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Montant total</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-green-600 font-medium">✓ Libéré : €{transaction.releasedAmount.toLocaleString()}</p>
                    <p className="text-sm text-orange-600 font-medium">⏳ En attente : €{transaction.pendingAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progression globale</span>
                  <span className="text-sm font-bold">{transaction.completedPhases}/{transaction.phases} tranches</span>
                </div>
                <Progress value={(transaction.completedPhases / transaction.phases) * 100} className="h-3" />

                {transaction.requiresContentValidation && transaction.autoValidationDeadline && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 text-orange-700 font-medium mb-1">
                      <Clock className="h-4 w-4" />Validation automatique programmée
                    </div>
                    <p className="text-sm text-orange-600">
                      Le paiement sera libéré automatiquement dans {transaction.daysUntilAutoValidation} jours si aucune action n'est prise ({new Date(transaction.autoValidationDeadline).toLocaleDateString('fr-FR')})
                    </p>
                  </div>
                )}

                {!transaction.requiresContentValidation && transaction.nextRelease && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                      <Calendar className="h-4 w-4" />Prochain paiement automatique
                    </div>
                    <p className="text-sm text-blue-600">
                      Le prochain paiement sera libéré automatiquement le {new Date(transaction.nextRelease).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tranches */}
          {transaction.isMultiPhase && transaction.tranches && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Tranches de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tranche</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date prévue</TableHead>
                        <TableHead>Date validation</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transaction.tranches.map((tranche: any) => (
                        <TableRow key={tranche.id}>
                          <TableCell className="font-medium">#{tranche.id}</TableCell>
                          <TableCell className="font-bold">€{tranche.amount.toLocaleString()}</TableCell>
                          <TableCell>{new Date(tranche.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            {tranche.validated ? (
                              <span className="text-sm text-green-600">{new Date(tranche.validated).toLocaleDateString('fr-FR')}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTrancheStatusColor(tranche.status)}>
                              {getTrancheStatusLabel(tranche.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {tranche.status === 'pending' && (
                                <Button size="sm" variant="outline" onClick={() => handleValidate(tranche.id)}>
                                  <CheckCircle className="h-3 w-3 mr-1" />Valider
                                </Button>
                              )}
                              {tranche.status === 'validated' && (
                                <Button size="sm" onClick={() => handleRelease(tranche.id)}>
                                  <Send className="h-3 w-3 mr-1" />Libérer
                                </Button>
                              )}
                              {tranche.status === 'released' && (
                                <Badge variant="outline" className="bg-green-50">
                                  <CheckCircle className="h-3 w-3 mr-1" />Payée
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Infos contrat + financières */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Détails du contrat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID Transaction</p>
                  <p className="font-mono font-medium">{transaction.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                  <p className="font-medium">
                    {new Date(transaction.created).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type de collaboration</p>
                  <Badge variant="outline">{transaction.type}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre de tranches</p>
                  <p className="font-medium">{transaction.phases} {transaction.phases > 1 ? 'paiements' : 'paiement'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Informations financières</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 font-medium mb-1">
                    <Lock className="h-4 w-4" />Fonds sécurisés
                  </div>
                  <p className="text-xl font-bold text-purple-700">€{transaction.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Bloqués par Partnexx</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                    <Target className="h-4 w-4" />Commission Partnexx
                  </div>
                  <p className="text-xl font-bold text-blue-700">
                    {transaction.totalAmount <= 500 ? '7%' : '12%'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transaction.totalAmount <= 500 ? '€35' : `€${Math.round(transaction.totalAmount * 0.12)}`} de frais
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                    <Award className="h-4 w-4" />Montant net total
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    €{(transaction.totalAmount * (transaction.totalAmount <= 500 ? 0.93 : 0.88)).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Versé à l'influenceur</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes internes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Notes internes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ajoutez des notes de suivi pour ce contrat..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => toast.success('💾 Notes sauvegardées', { description: 'Vos notes ont été enregistrées avec succès' })}
              >
                Sauvegarder les notes
              </Button>
            </CardContent>
          </Card>

          {/* Alertes */}
          {transaction.status === 'suspended' && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700">Contrat suspendu</p>
                    <p className="text-sm text-red-600 mt-1">
                      Ce contrat a été suspendu. Aucun paiement ne sera libéré. Les fonds restent sécurisés par Partnexx.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.status === 'pending' && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-700">En attente de validation</p>
                    <p className="text-sm text-orange-600 mt-1">
                      Le contenu est en cours de révision. Validez les tranches pour permettre leur libération.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.status === 'active' && transaction.tranches?.some((t: any) => t.status === 'validated') && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-700 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700">Tranches prêtes à libérer</p>
                    <p className="text-sm text-green-600 mt-1">
                      Des tranches ont été validées et peuvent être libérées à l'influenceur.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-between flex-wrap">
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />Exporter en PDF
              </Button>
              {transaction.status === 'active' && onSuspendContract && (
                <Button variant="destructive" onClick={handleSuspend}>
                  <AlertCircle className="h-4 w-4 mr-2" />Suspendre le contrat
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
              {!transaction.isMultiPhase && transaction.status === 'pending' && (
                <Button className="bg-gradient-to-r from-primary to-accent text-white" onClick={() => handleRelease()}>
                  <Send className="h-4 w-4 mr-2" />Libérer le paiement
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}