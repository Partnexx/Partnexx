'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain } from 'lucide-react'

export default function ContratsSection({ profile, metrics, collaborations, transactions, contracts, notifications }) {
  const title = 'ContratsSection'.replace('Section', '')
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <Badge className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Section en cours de développement</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          🚧 Cette section sera disponible prochainement
        </CardContent>
      </Card>
    </div>
  )
}