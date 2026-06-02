'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  CircleDollarSign, Globe, TrendingUp, Award, Target, Receipt,
  Send, Zap, Copy, Download,
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: any
  getPaymentStatusColor: (status: string) => string
  getPaymentStatusLabel: (status: string) => string
  onReleasePayment: (id: string) => void
}

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
}

export default function AffiliatePaymentDetailsDialog({
  open,
  onOpenChange,
  payment,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  onReleasePayment,
}: Props) {
  if (!payment) return null

  const salesTrendData = [
    { date: 'Sem 1', ventes: 2, revenus: 5000 },
    { date: 'Sem 2', ventes: 3, revenus: 7500 },
    { date: 'Sem 3', ventes: 4, revenus: 10000 },
    { date: 'Sem 4', ventes: 3, revenus: 8000 },
  ]

  const handleExportPDF = () =>
    toast.info('📄 Export PDF en cours', { description: 'Le document avec logo Partnexx sera prêt dans quelques secondes.' })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(payment.affiliateLink)
    toast.success('Copié !', { description: 'Lien copié dans le presse-papier' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CircleDollarSign className="h-6 w-6 text-primary" />
            Détails du paiement affilié
          </DialogTitle>
          <DialogDescription>Informations complètes sur la commission et les performances</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête paiement */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{payment.influencer}</h3>
                  <p className="text-sm text-muted-foreground">{payment.campaign}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">€{payment.amount.toLocaleString()}</p>
                  <Badge className={`mt-1 ${getPaymentStatusColor(payment.status)}`}>
                    {getPaymentStatusLabel(payment.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infos affiliation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Informations d'affiliation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lien d'affiliation</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-3 py-2 rounded flex-1">{payment.affiliateLink}</code>
                    <Button size="sm" variant="outline" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Taux de commission</p>
                  <p className="text-2xl font-bold text-primary">{payment.commissionRate}%</p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date d'adhésion</p>
                  <p className="font-medium">
                    {new Date(payment.joinedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prochaine libération</p>
                  <p className="font-medium">
                    {new Date(payment.nextReleaseDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                    <Award className="h-5 w-5" />Ventes générées
                  </div>
                  <p className="text-3xl font-bold text-green-700">{payment.salesGenerated}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total de ventes</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                    <CircleDollarSign className="h-5 w-5" />Revenus générés
                  </div>
                  <p className="text-3xl font-bold text-blue-700">€{payment.revenueGenerated.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Chiffre d'affaires total</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 font-medium mb-2">
                    <Target className="h-5 w-5" />ROI
                  </div>
                  <p className="text-3xl font-bold text-purple-700">
                    {Math.round((payment.revenueGenerated / payment.amount) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Retour sur investissement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Évolution des performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-64">
                  <p className="text-sm font-medium mb-3 text-center">Ventes par semaine</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesTrendData}>
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="ventes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-64">
                  <p className="text-sm font-medium mb-3 text-center">Revenus par semaine</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesTrendData}>
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => `€${(v as number).toLocaleString()}`} />
                      <Line type="monotone" dataKey="revenus" stroke="hsl(var(--primary))" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facturation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Informations de facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground mb-1">ID Transaction</p><p className="font-mono font-medium">{payment.id}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Influenceur</p><p className="font-medium">{payment.influencer}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Campagne</p><p className="font-medium">{payment.campaign}</p></div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de facturation</p>
                  <p className="font-medium">
                    {new Date(payment.nextReleaseDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détail commission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Détail de la commission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Revenus générés</span>
                <span className="font-medium">€{payment.revenueGenerated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taux de commission</span>
                <span className="font-medium">{payment.commissionRate}%</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Commission totale</span>
                <span className="font-bold text-primary">€{payment.amount.toLocaleString()}</span>
              </div>
              {payment.canReleaseEarly && payment.status === 'ready' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">Libération anticipée possible</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-between flex-wrap">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />Exporter en PDF
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
              {payment.status === 'ready' && payment.canReleaseEarly && (
                <Button
                  className="bg-gradient-to-r from-primary to-accent text-white"
                  onClick={() => { onReleasePayment(payment.id); onOpenChange(false) }}
                >
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