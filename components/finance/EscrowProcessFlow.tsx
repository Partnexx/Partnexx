import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText, ArrowRight, DollarSign, Package, CheckCircle, Clock, AlertTriangle, Unlock,
} from 'lucide-react'

const processSteps = [
  { id: 1, title: 'Contrat signé', description: "L'entreprise et l'influenceur valident la collaboration", icon: FileText, bg: 'bg-purple-100 text-purple-700' },
  { id: 2, title: 'Argent déposé', description: "L'entreprise dépose les fonds sur le compte séquestre", icon: DollarSign, bg: 'bg-yellow-100 text-yellow-700' },
  { id: 3, title: 'Livraison', description: "L'influenceur publie les posts et livre les éléments convenus", icon: Package, bg: 'bg-green-100 text-green-700' },
  { id: 4, title: 'Validation', description: "L'entreprise confirme la réception des livrables", icon: CheckCircle, bg: 'bg-amber-100 text-amber-700' },
  {
    id: 5,
    title: 'Délai de contestation',
    description: '4 jours pour contester ou validation automatique',
    icon: Clock,
    bg: 'bg-orange-100 text-orange-700',
    delay: '4 jours',
    branches: [
      { condition: 'Pas de contestation', result: 'Déblocage automatique', icon: CheckCircle, color: 'text-green-600' },
      { condition: 'Contestation', result: "Fonds bloqués jusqu'à résolution", icon: AlertTriangle, color: 'text-orange-600' },
    ],
  },
  { id: 6, title: 'Libération des fonds', description: "L'influenceur reçoit son paiement", icon: Unlock, bg: 'bg-emerald-100 text-emerald-700' },
] as const

type Step = (typeof processSteps)[number]

export default function EscrowProcessFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Processus de paiement escrow Partnexx
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {processSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center">
                <div className="relative group">
                  <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${step.bg} shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{step.id}</span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 z-10">
                    <div className="font-semibold mb-1">{step.title}</div>
                    <div className="text-muted-foreground">{step.description}</div>
                    {'delay' in step && step.delay && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 mt-1">
                        {step.delay}
                      </Badge>
                    )}
                    {'branches' in step && step.branches && (
                      <div className="mt-2 space-y-1">
                        {step.branches.map((branch, bi) => {
                          const BI = branch.icon
                          return (
                            <div key={bi} className="flex items-center gap-1 text-xs">
                              <BI className={`h-3 w-3 ${branch.color}`} />
                              <span className="font-medium">{branch.condition}:</span>
                              <span className="text-muted-foreground">{branch.result}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {index < processSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 mx-2" />
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Système automatisé sécurisé</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            94.2% des paiements sont libérés automatiquement sans intervention manuelle
          </p>
        </div>
      </CardContent>
    </Card>
  )
}