'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useState } from 'react'
import {
  Search, Calendar, DollarSign, FileText, Download,
  CreditCard, Brain, CheckCircle, Clock, AlertCircle,
  Eye, Shield, TrendingUp, ArrowUpRight, Users, Target,
} from 'lucide-react'

// ─── Données mockées ───────────────────────────────────────────────────────────

const contratsData = [
  {
    id: "c1",
    title: "Campagne Skincare Naturelle",
    brand: { name: "GreenBeauty", logo: "GB", contact: "Marie Dubois" },
    status: "active",
    signedDate: "10 Janvier 2024",
    startDate: "15 Janvier 2024",
    endDate: "15 Février 2024",
    amount: 800,
    currency: "€",
    paymentType: "salary",
    deliverables: 4,
    deliveredCount: 2,
    exclusivity: "Beauté bio — 3 mois",
    rights: "12 mois, toutes plateformes digitales",
    conditions: ["30% à la signature", "40% à la livraison", "30% après validation"],
    contractUrl: "#",
    category: "beauty",
  },
  {
    id: "c2",
    title: "Partenariat Fitness Premium",
    brand: { name: "PowerGym", logo: "PG", contact: "Alex Johnson" },
    status: "active",
    signedDate: "5 Janvier 2024",
    startDate: "10 Janvier 2024",
    endDate: "10 Mars 2024",
    amount: 2500,
    currency: "€",
    paymentType: "salary",
    deliverables: 5,
    deliveredCount: 3,
    exclusivity: "Fitness — 6 mois",
    rights: "24 mois, supports digitaux et print",
    conditions: ["25% à la signature", "50% à mi-parcours", "25% à la fin"],
    contractUrl: "#",
    category: "fitness",
  },
  {
    id: "c3",
    title: "Collection Mode Été",
    brand: { name: "SummerVibes", logo: "SV", contact: "Sarah Chen" },
    status: "completed",
    signedDate: "25 Octobre 2023",
    startDate: "1 Novembre 2023",
    endDate: "30 Novembre 2023",
    amount: 1200,
    currency: "€",
    paymentType: "salary",
    deliverables: 3,
    deliveredCount: 3,
    exclusivity: "Mode été — 2 mois",
    rights: "12 mois, plateformes sociales",
    conditions: ["50% à la signature", "50% à la livraison"],
    contractUrl: "#",
    category: "fashion",
    rating: 5,
  },
  {
    id: "c4",
    title: "Campagne Restaurant Gastronomique",
    brand: { name: "Le Gourmet", logo: "LG", contact: "Jean Dupont" },
    status: "completed",
    signedDate: "10 Septembre 2023",
    startDate: "15 Septembre 2023",
    endDate: "30 Septembre 2023",
    amount: 1500,
    currency: "€",
    paymentType: "salary",
    deliverables: 4,
    deliveredCount: 4,
    exclusivity: "Restauration — 1 mois",
    rights: "6 mois, digitales uniquement",
    conditions: ["100% à la livraison validée"],
    contractUrl: "#",
    category: "food",
    rating: 5,
  },
  {
    id: "c5",
    title: "Review Tech Smartwatch",
    brand: { name: "TechFlow", logo: "TF", contact: "Thomas Martin" },
    status: "pending",
    signedDate: null,
    startDate: "À définir",
    endDate: "À définir",
    amount: 600,
    currency: "€",
    paymentType: "commission",
    deliverables: 3,
    deliveredCount: 0,
    exclusivity: "Aucune",
    rights: "Durée de la campagne",
    conditions: ["Paiement à la performance"],
    contractUrl: "#",
    category: "tech",
  },
]

const paiementsData = [
  {
    id: "p1",
    contractTitle: "Partenariat Fitness Premium",
    brand: "PowerGym",
    amount: 625,
    currency: "€",
    status: "received",
    type: "Acompte (25%)",
    date: "10 Janvier 2024",
    method: "Virement bancaire",
    reference: "PAY-2024-001",
  },
  {
    id: "p2",
    contractTitle: "Campagne Skincare Naturelle",
    brand: "GreenBeauty",
    amount: 240,
    currency: "€",
    status: "received",
    type: "Acompte (30%)",
    date: "15 Janvier 2024",
    method: "Virement bancaire",
    reference: "PAY-2024-002",
  },
  {
    id: "p3",
    contractTitle: "Collection Mode Été",
    brand: "SummerVibes",
    amount: 1200,
    currency: "€",
    status: "received",
    type: "Paiement total",
    date: "5 Décembre 2023",
    method: "Virement bancaire",
    reference: "PAY-2023-018",
  },
  {
    id: "p4",
    contractTitle: "Campagne Restaurant Gastronomique",
    brand: "Le Gourmet",
    amount: 1500,
    currency: "€",
    status: "received",
    type: "Paiement total",
    date: "3 Octobre 2023",
    method: "Virement bancaire",
    reference: "PAY-2023-015",
  },
  {
    id: "p5",
    contractTitle: "Campagne Skincare Naturelle",
    brand: "GreenBeauty",
    amount: 320,
    currency: "€",
    status: "pending",
    type: "Solde (40%)",
    date: "Après livraison",
    method: "Virement bancaire",
    reference: "PAY-2024-003",
  },
  {
    id: "p6",
    contractTitle: "Partenariat Fitness Premium",
    brand: "PowerGym",
    amount: 1250,
    currency: "€",
    status: "pending",
    type: "Versement (50%)",
    date: "10 Février 2024",
    method: "Virement bancaire",
    reference: "PAY-2024-004",
  },
  {
    id: "p7",
    contractTitle: "Review Tech Smartwatch",
    brand: "TechFlow",
    amount: 600,
    currency: "€",
    status: "awaiting_contract",
    type: "Paiement performance",
    date: "À définir",
    method: "À définir",
    reference: "—",
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getStatusColor = (status) => {
  switch (status) {
    case "active": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "completed": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "pending": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case "active": return "En cours"
    case "completed": return "Terminé"
    case "pending": return "En attente"
    default: return status
  }
}

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "received": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "pending": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "awaiting_contract": return "bg-muted text-muted-foreground border-border"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case "received": return "Reçu"
    case "pending": return "En attente"
    case "awaiting_contract": return "Contrat en cours"
    default: return status
  }
}

// ─── Onglet Contrats ───────────────────────────────────────────────────────────

function ContratsTab() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedContrat, setSelectedContrat] = useState(null)

  const filtered = contratsData.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalActive = contratsData.filter(c => c.status === "active").length
  const totalCompleted = contratsData.filter(c => c.status === "completed").length
  const totalValue = contratsData.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">
                Actifs
              </Badge>
            </div>
            <p className="text-2xl font-bold">{totalActive}</p>
            <p className="text-sm text-muted-foreground">Contrats en cours</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20">
                Terminés
              </Badge>
            </div>
            <p className="text-2xl font-bold">{totalCompleted}</p>
            <p className="text-sm text-muted-foreground">Contrats complétés</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">
                Total
              </Badge>
            </div>
            <p className="text-2xl font-bold">{totalValue.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">Valeur contractuelle</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contrat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "completed", "pending"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "Tous" : getStatusLabel(s)}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
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
                        {contrat.brand.logo}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{contrat.title}</h3>
                      <p className="text-sm text-muted-foreground">{contrat.brand.name} • {contrat.brand.contact}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(contrat.status)}>
                    {contrat.status === "active" && <Clock className="h-3 w-3 mr-1" />}
                    {contrat.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {contrat.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {getStatusLabel(contrat.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Montant</p>
                    <p className="text-sm font-semibold text-green-600">{contrat.amount.toLocaleString()}{contrat.currency}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Début</p>
                    <p className="text-sm font-medium">{contrat.startDate}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Fin</p>
                    <p className="text-sm font-medium">{contrat.endDate}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Livrables</p>
                    <p className="text-sm font-medium">{contrat.deliveredCount}/{contrat.deliverables}</p>
                  </div>
                </div>

                {contrat.status === "active" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progression livrables</span>
                      <span>{Math.round((contrat.deliveredCount / contrat.deliverables) * 100)}%</span>
                    </div>
                    <Progress value={(contrat.deliveredCount / contrat.deliverables) * 100} className="h-2" />
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setSelectedContrat(contrat)}>
                    <Eye className="h-4 w-4" />
                    Voir le contrat
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog détail contrat */}
      <Dialog open={!!selectedContrat} onOpenChange={() => setSelectedContrat(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <FileText className="h-5 w-5" />
              {selectedContrat?.title}
            </DialogTitle>
            <DialogDescription>{selectedContrat?.brand.name}</DialogDescription>
          </DialogHeader>

          {selectedContrat && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Montant total</p>
                    <p className="text-2xl font-bold text-green-600">{selectedContrat.amount.toLocaleString()}{selectedContrat.currency}</p>
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
                  <div><p className="text-muted-foreground">Signé le</p><p className="font-medium">{selectedContrat.signedDate || "Non signé"}</p></div>
                  <div><p className="text-muted-foreground">Début</p><p className="font-medium">{selectedContrat.startDate}</p></div>
                  <div><p className="text-muted-foreground">Fin</p><p className="font-medium">{selectedContrat.endDate}</p></div>
                  <div><p className="text-muted-foreground">Livrables</p><p className="font-medium">{selectedContrat.deliveredCount}/{selectedContrat.deliverables} livrés</p></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" />Termes juridiques</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><p className="text-muted-foreground mb-1">Exclusivité</p><p className="font-medium">{selectedContrat.exclusivity}</p></div>
                  <Separator />
                  <div><p className="text-muted-foreground mb-1">Droits d&apos;utilisation</p><p className="font-medium">{selectedContrat.rights}</p></div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-2">Conditions de paiement</p>
                    <ul className="space-y-1">
                      {selectedContrat.conditions.map((c, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />Télécharger PDF
                </Button>
                <Button className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />Contrat complet
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Onglet Paiements ──────────────────────────────────────────────────────────

function PaiementsTab() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filtered = paiementsData.filter(p => {
    const matchSearch =
      p.contractTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalReceived = paiementsData.filter(p => p.status === "received").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = paiementsData.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const totalAll = paiementsData.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
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
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">En attente</Badge>
            </div>
            <p className="text-2xl font-bold text-orange-500">{totalPending.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">À recevoir</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="bg-purple-500/5 text-purple-600 border-purple-500/20">Total</Badge>
            </div>
            <p className="text-2xl font-bold">{totalAll.toLocaleString()}€</p>
            <p className="text-sm text-muted-foreground">Volume total</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression globale */}
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

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un paiement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["all", "received", "pending"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "Tous" : getPaymentStatusLabel(s)}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste paiements */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun paiement trouvé</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((paiement) => (
            <Card key={paiement.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-full ${paiement.status === "received" ? "bg-green-500/10" : "bg-orange-500/10"}`}>
                      <CreditCard className={`h-5 w-5 ${paiement.status === "received" ? "text-green-600" : "text-orange-500"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{paiement.contractTitle}</p>
                        <Badge variant="outline" className={getPaymentStatusColor(paiement.status)}>
                          {getPaymentStatusLabel(paiement.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{paiement.brand}</span>
                        <span>•</span>
                        <span>{paiement.type}</span>
                        <span>•</span>
                        <span>{paiement.date}</span>
                        <span>•</span>
                        <span className="font-mono">{paiement.reference}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${paiement.status === "received" ? "text-green-600" : "text-orange-500"}`}>
                      {paiement.status === "received" ? "+" : ""}{paiement.amount.toLocaleString()}{paiement.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">{paiement.method}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function ContratsSection() {
  const [activeTab, setActiveTab] = useState("contrats")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Contrats & Paiements</h1>
          <Badge variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg">
            <Brain className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold">IA activé</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Gestion Contractuelle • Suivi des Paiements • Historique Complet</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0 h-auto">
          <TabsTrigger
            value="contrats"
            className="rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-card hover:bg-muted/50 transition-all duration-300 border-2 data-[state=active]:border-blue-500/50 border-border/50"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-semibold">Contrats</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="paiements"
            className="rounded-2xl h-14 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg bg-card hover:bg-muted/50 transition-all duration-300 border-2 data-[state=active]:border-green-500/50 border-border/50"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-semibold">Paiements</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contrats" className="mt-6">
          <ContratsTab />
        </TabsContent>

        <TabsContent value="paiements" className="mt-6">
          <PaiementsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}