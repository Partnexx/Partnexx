'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import {
  DollarSign, TrendingUp, Shield, Clock, Zap, Bot, AlertCircle,
  CheckCircle, XCircle, Download, Upload, Send, Eye,
  BarChart3, PieChart, Calendar, Globe, ArrowUpRight, ArrowDownRight,
  Lock, FileText, Settings, Users, Lightbulb, Activity, Star,
  CircleDollarSign, Brain, Award, Target
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import EscrowManagementPanel from '@/components/finance/EscrowManagementPanel'
import AffiliatePaymentDetailsDialog from '@/components/finance/AffiliatePaymentDetailsDialog'
import EscrowPaymentDetailsDialog from '@/components/finance/EscrowPaymentDetailsDialog'

/* ============== MOCK DATA (à brancher Supabase plus tard) ============== */

const cashFlowData = [
  { name: 'Jan', entrees: 12400, sorties: 8200, escrow: 3200, net: 4200 },
  { name: 'Fév', entrees: 15600, sorties: 9800, escrow: 4100, net: 5700 },
  { name: 'Mar', entrees: 18200, sorties: 11200, escrow: 5200, net: 7000 },
  { name: 'Avr', entrees: 22100, sorties: 13500, escrow: 6800, net: 8600 },
  { name: 'Mai', entrees: 19800, sorties: 12100, escrow: 5900, net: 7700 },
  { name: 'Jun', entrees: 26400, sorties: 15800, escrow: 7200, net: 10600 },
  { name: 'Jul', entrees: 31200, sorties: 18400, escrow: 8900, net: 12800 },
]

const caData = [
  { name: 'Fév', ca: 87200 },
  { name: 'Mar', ca: 96500 },
  { name: 'Avr', ca: 108300 },
  { name: 'Mai', ca: 109700 },
  { name: 'Jun', ca: 121400 },
  { name: 'Jul', ca: 134500 },
]

const escrowBreakdown = [
  { name: 'En cours', value: 45000, color: '#F59E0B' },
  { name: 'En validation', value: 22000, color: '#3B82F6' },
  { name: 'Bloqué', value: 8000, color: '#EF4444' },
  { name: 'Prêt à libérer', value: 15000, color: '#10B981' },
]

const monthlyTrends = [
  { month: 'Jan', predictions: 85000, actual: 87200 },
  { month: 'Fév', predictions: 92000, actual: 94800 },
  { month: 'Mar', predictions: 98000, actual: 96500 },
  { month: 'Avr', predictions: 105000, actual: 108300 },
  { month: 'Mai', predictions: 112000, actual: 109700 },
  { month: 'Jun', predictions: 118000, actual: 121400 },
  { month: 'Jul', predictions: 125000, actual: null },
]

const kpiData = [
  { label: "Chiffre d'affaires", value: '€1,247,890', growth: '+23.8%', icon: DollarSign, bg: 'from-yellow-50 to-orange-50', color: 'text-yellow-600', trend: 'up', description: 'Ce mois vs mois dernier' },
  { label: 'Escrow actif', value: '€90,000', growth: '+€12K', icon: Shield, bg: 'from-purple-50 to-violet-50', color: 'text-purple-600', trend: 'up', description: 'Fonds sécurisés en cours' },
  { label: 'Taux de libération', value: '94.2%', growth: '+2.1%', icon: CheckCircle, bg: 'from-green-50 to-emerald-50', color: 'text-green-600', trend: 'up', description: 'Paiements validés automatiquement' },
  { label: 'Temps moyen escrow', value: '3.2 jours', growth: '-0.8j', icon: Clock, bg: 'from-amber-50 to-yellow-50', color: 'text-amber-600', trend: 'down', description: 'De versement à libération' },
  { label: 'Économies IA', value: '€18,450', growth: '+€5.2K', icon: Bot, bg: 'from-green-50 to-emerald-50', color: 'text-green-600', trend: 'up', description: 'Optimisations automatiques' },
  { label: 'Score de risque', value: '2.1/10', growth: '-0.3', icon: Target, bg: 'from-purple-50 to-violet-50', color: 'text-purple-600', trend: 'down', description: 'Risque financier global' },
]

const affiliatePayments = [
  { id: 'AFF001', campaign: 'Summer Collection 2024', influencer: '@marie_lifestyle', amount: 2400, status: 'pending', commissionRate: 8, affiliateLink: 'partnexx.io/ref/marie', salesGenerated: 12, revenueGenerated: 30000, nextReleaseDate: '2024-02-01', canReleaseEarly: true, joinedDate: '2024-01-15' },
  { id: 'AFF002', campaign: 'Summer Collection 2024', influencer: '@alex_tech', amount: 1800, status: 'ready', commissionRate: 6, affiliateLink: 'partnexx.io/ref/alex', salesGenerated: 8, revenueGenerated: 22500, nextReleaseDate: '2024-02-01', canReleaseEarly: true, joinedDate: '2024-01-10' },
  { id: 'AFF003', campaign: 'Summer Collection 2024', influencer: '@sarah_beauty', amount: 3200, status: 'pending', commissionRate: 10, affiliateLink: 'partnexx.io/ref/sarah', salesGenerated: 16, revenueGenerated: 40000, nextReleaseDate: '2024-02-01', canReleaseEarly: false, joinedDate: '2024-01-08' },
  { id: 'AFF004', campaign: 'Summer Collection 2024', influencer: '@emma_fashion', amount: 4100, status: 'ready', commissionRate: 12, affiliateLink: 'partnexx.io/ref/emma', salesGenerated: 22, revenueGenerated: 55000, nextReleaseDate: '2024-02-01', canReleaseEarly: true, joinedDate: '2024-01-05' },
  { id: 'AFF005', campaign: 'Summer Collection 2024', influencer: '@coach_pierre', amount: 1650, status: 'paid', commissionRate: 5, affiliateLink: 'partnexx.io/ref/pierre', salesGenerated: 6, revenueGenerated: 16500, nextReleaseDate: '2024-01-01', canReleaseEarly: false, joinedDate: '2024-01-12' },
  { id: 'AFF006', campaign: 'Tech Launch Event', influencer: '@gaming_pro', amount: 1950, status: 'pending', commissionRate: 7, affiliateLink: 'partnexx.io/ref/gaming', salesGenerated: 10, revenueGenerated: 27800, nextReleaseDate: '2024-02-01', canReleaseEarly: true, joinedDate: '2024-01-20' },
  { id: 'AFF007', campaign: 'Beauty Brand Collab', influencer: '@skincare_guru', amount: 2850, status: 'ready', commissionRate: 9, affiliateLink: 'partnexx.io/ref/skincare', salesGenerated: 14, revenueGenerated: 31700, nextReleaseDate: '2024-02-01', canReleaseEarly: true, joinedDate: '2024-01-16' },
  { id: 'AFF008', campaign: 'Fashion Week Paris', influencer: '@style_blogger', amount: 3400, status: 'pending', commissionRate: 11, affiliateLink: 'partnexx.io/ref/style', salesGenerated: 18, revenueGenerated: 45200, nextReleaseDate: '2024-02-01', canReleaseEarly: false, joinedDate: '2024-01-12' },
  { id: 'AFF009', campaign: 'Fashion Week Paris', influencer: '@deco_sophie', amount: 2200, status: 'ready', commissionRate: 8, affiliateLink: 'partnexx.io/ref/sophie', salesGenerated: 12, revenueGenerated: 29000, nextReleaseDate: '2024-02-01', canReleaseEarly: true, joinedDate: '2024-01-22' },
]

const campaignBorderColors = {
  'Summer Collection 2024': 'border-l-blue-500',
  'Tech Launch Event': 'border-l-purple-500',
  'Beauty Brand Collab': 'border-l-pink-500',
  'Fashion Week Paris': 'border-l-amber-500',
}

const groupedAffiliates = affiliatePayments.reduce((acc, payment) => {
  if (!acc[payment.campaign]) acc[payment.campaign] = []
  acc[payment.campaign].push(payment)
  return acc
}, {})

const campaignAffiliateTotals = Object.entries(groupedAffiliates).map(([campaign, payments]) => ({
  campaign,
  totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
  paymentCount: payments.length,
  totalRevenue: payments.reduce((sum, p) => sum + p.revenueGenerated, 0),
  totalSales: payments.reduce((sum, p) => sum + p.salesGenerated, 0),
  statuses: [...new Set(payments.map(p => p.status))],
  payments,
}))

const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }

/* ============== COMPONENT ============== */

const FinancesSection = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [affiliateFilter, setAffiliateFilter] = useState('all')
  const [selectedAffiliatePayment, setSelectedAffiliatePayment] = useState(null)
  const [showAffiliateDetails, setShowAffiliateDetails] = useState(false)
  const [selectedEscrowTransaction, setSelectedEscrowTransaction] = useState(null)
  const [showEscrowDetails, setShowEscrowDetails] = useState(false)

  const filteredAffiliateCampaigns = campaignAffiliateTotals.filter(campaign => {
    if (affiliateFilter === 'all') return true
    return campaign.payments.some(p => p.status === affiliateFilter)
  })

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'blocked': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'ready': return '🟢 Prêt à libérer'
      case 'pending': return '🟠 En attente'
      case 'paid': return '💰 Payé'
      case 'blocked': return '🔴 Bloqué'
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'blocked': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'validated': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'blocked': return 'Bloqué'
      case 'validated': return 'Validé'
      case 'completed': return 'Libéré'
      case 'suspended': return 'Suspendu'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return Activity
      case 'blocked': return Lock
      case 'validated': return CheckCircle
      case 'completed': return CheckCircle
      case 'suspended': return AlertCircle
      case 'cancelled': return XCircle
      default: return Activity
    }
  }

  const releasePayment = (id) => toast.success(`💰 Paiement ${id} libéré avec succès.`)
  const releaseAllCampaignPayments = (name, amount, count) =>
    toast.success(`💰 ${count} paiement${count > 1 ? 's' : ''} de "${name}" libéré${count > 1 ? 's' : ''} (€${amount.toLocaleString()}).`)
  const generateReport = () => toast.info('📊 Rapport en génération...')
  const optimizeEscrow = () => toast.info("🤖 L'IA analyse vos escrows...")
  const releaseEscrow = (trancheId) => toast.success(trancheId ? `💰 Tranche #${trancheId} libérée.` : '💰 Escrow libéré.')
  const validateTranche = (id) => toast.success(`✅ Tranche #${id} validée.`)
  const suspendContract = () => toast.warning('⏸️ Contrat suspendu.')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Gestion Financière</h1>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
              <Brain className="h-3 w-3 mr-1" />IA Activée
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Shield className="h-3 w-3 mr-1" />Escrow Sécurisé
            </Badge>
          </div>
          <p className="text-muted-foreground">Gestion financière • Prévisions automatiques • Optimisation des coûts</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} border-0 shadow-lg hover:scale-105 transition-transform duration-200`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  <Badge variant="outline" className={`text-xs ${kpi.trend === 'up' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {kpi.growth}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          {[
            { value: 'overview', label: "Vue d'ensemble", icon: BarChart3, color: 'from-blue-500 to-blue-600' },
            { value: 'cashflow', label: 'Flux de trésorerie', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
            { value: 'affiliate', label: 'Paiements Influenceurs', icon: Users, color: 'from-green-500 to-green-600' },
            { value: 'predictions', label: 'Prédictions IA', icon: Bot, color: 'from-orange-500 to-orange-600' },
            { value: 'reports', label: 'Rapports', icon: FileText, color: 'from-gray-500 to-gray-600' },
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}
              className={`flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white transition-all`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* VUE D'ENSEMBLE */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Chiffre d'affaires (6 derniers mois)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caData}>
                    <defs>
                      <linearGradient id="caBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => `€${v.toLocaleString()}`} />
                    <Bar dataKey="ca" fill="url(#caBarGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Répartition Escrow (€90,000)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={escrowBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                          {escrowBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `€${v.toLocaleString()}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {escrowBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold">€{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={generateReport} className="bg-gradient-to-r from-primary to-accent text-white">
              <FileText className="h-4 w-4 mr-2" />Générer un rapport complet
            </Button>
            <Button onClick={optimizeEscrow} variant="secondary">
              <Bot className="h-4 w-4 mr-2" />Optimiser avec l'IA
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />Exporter les données
            </Button>
          </div>
        </TabsContent>

        {/* PAIEMENTS INFLUENCEURS */}
        <TabsContent value="affiliate" className="space-y-6 mt-6">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />Paiements Influenceurs
            </h3>
            <p className="text-muted-foreground">Gestion des paiements par affiliation et par escrow</p>
          </div>

          <Tabs defaultValue="affilies" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full h-auto p-1 bg-muted/50">
              <TabsTrigger value="affilies" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-medium px-6 py-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />Paiements Affiliés
              </TabsTrigger>
              <TabsTrigger value="escrow" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-6 py-3 flex items-center gap-2">
                Paiements par Escrow<Shield className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="affilies" className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Suivi par campagne • Libération automatique le 1er du mois</p>
                <Select value={affiliateFilter} onValueChange={setAffiliateFilter}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">🟠 En attente</SelectItem>
                    <SelectItem value="ready">🟢 Prêt à libérer</SelectItem>
                    <SelectItem value="paid">💰 Payé</SelectItem>
                    <SelectItem value="blocked">🔴 Bloqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bannière libération auto */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Calendar className="h-5 w-5" />Libération automatique programmée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <Clock className="h-4 w-4" />Prochaine libération
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">1er février 2024 - 8 paiements (€18,950)</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 font-medium">
                        <CircleDollarSign className="h-4 w-4" />Transparence totale / commission Partnexx
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">≤ 500€ : 7% • &gt; 500€ : 12%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance du mois */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <TrendingUp className="h-5 w-5" />Performance du mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-4">
                    {[
                      { color: 'green', icon: Award, label: 'Total généré', value: '€325,700', sub: "Chiffre d'affaires total" },
                      { color: 'orange', icon: Users, label: 'Ventes totales', value: '122', sub: "Via liens d'affiliation" },
                      { color: 'purple', icon: Target, label: 'Commission totale', value: '€24,150', sub: 'À verser aux influenceurs' },
                      { color: 'blue', icon: Star, label: 'Top performer', value: '@emma_fashion', sub: '€4,100 ce mois' },
                    ].map((s, i) => {
                      const I = s.icon
                      return (
                        <div key={i} className={`bg-white/60 rounded-lg p-3 border border-${s.color}-200`}>
                          <div className={`flex items-center gap-2 text-${s.color}-700 font-medium`}>
                            <I className="h-4 w-4" />{s.label}
                          </div>
                          <p className={`text-lg font-bold text-${s.color}-700 mt-1`}>{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.sub}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Regroupement par campagne */}
              <div className="space-y-6">
                {filteredAffiliateCampaigns.map((campaign) => (
                  <Card key={campaign.campaign}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3">
                            {campaign.campaign}
                            <Badge variant="outline" className="text-xs">
                              {campaign.paymentCount} influenceur{campaign.paymentCount > 1 ? 's' : ''}
                            </Badge>
                          </CardTitle>
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                            <p>Commissions: <span className="font-bold text-foreground">€{campaign.totalAmount.toLocaleString()}</span></p>
                            <p>Revenus générés: <span className="font-bold text-foreground">€{campaign.totalRevenue.toLocaleString()}</span></p>
                            <p>Ventes: <span className="font-bold text-foreground">{campaign.totalSales}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex gap-1 flex-wrap">
                            {campaign.statuses.map(status => (
                              <Badge key={status} className={`text-xs ${getPaymentStatusColor(status)}`}>
                                {getPaymentStatusLabel(status)}
                              </Badge>
                            ))}
                          </div>
                          <Button onClick={() => releaseAllCampaignPayments(campaign.campaign, campaign.totalAmount, campaign.paymentCount)} className="bg-gradient-to-r from-primary to-accent text-white">
                            <Send className="h-4 w-4 mr-2" />Libérer tous
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {campaign.payments.map((payment) => (
                        <Card key={payment.id} className={`border-l-4 ${campaignBorderColors[campaign.campaign] || 'border-l-gray-500'} hover:shadow-md transition-shadow`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h5 className="font-medium">{payment.influencer}</h5>
                                  <Badge className={`text-xs ${getPaymentStatusColor(payment.status)}`}>#{payment.id}</Badge>
                                  <Badge variant="outline" className="text-xs">{payment.commissionRate}% commission</Badge>
                                  {payment.status === 'ready' && payment.canReleaseEarly && (
                                    <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                                      <Zap className="h-3 w-3 mr-1" />Libération anticipée possible
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                  <span>Rejoint le: {new Date(payment.joinedDate).toLocaleDateString('fr-FR')}</span>
                                  <span>•</span>
                                  <span>{payment.salesGenerated} ventes</span>
                                  <span>•</span>
                                  <span>€{payment.revenueGenerated.toLocaleString()} générés</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">€{payment.amount.toLocaleString()}</div>
                                <Badge className={`text-xs ${getPaymentStatusColor(payment.status)}`}>
                                  {getPaymentStatusLabel(payment.status)}
                                </Badge>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Lien d'affiliation:</span>
                                  <code className="text-xs bg-white px-2 py-1 rounded border">{payment.affiliateLink}</code>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>ROI: {Math.round((payment.revenueGenerated / payment.amount) * 100)}%</span>
                                  <span>Prochaine: {new Date(payment.nextReleaseDate).toLocaleDateString('fr-FR')}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 flex-wrap gap-2">
                              <div className="flex gap-2">
                                {payment.status === 'ready' && payment.canReleaseEarly && (
                                  <Button size="sm" onClick={() => releasePayment(payment.id)} className="bg-gradient-to-r from-primary to-accent text-white">
                                    <Send className="h-3 w-3 mr-1" />Libérer maintenant
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" onClick={() => { setSelectedAffiliatePayment(payment); setShowAffiliateDetails(true) }}>
                                  <Eye className="h-3 w-3 mr-1" />Détails
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {payment.status === 'pending' && <span>Libération automatique le {new Date(payment.nextReleaseDate).toLocaleDateString('fr-FR')}</span>}
                                {payment.status === 'ready' && !payment.canReleaseEarly && <span>Libération prévue le {new Date(payment.nextReleaseDate).toLocaleDateString('fr-FR')}</span>}
                                {payment.status === 'paid' && <span>Payé le {new Date(payment.nextReleaseDate).toLocaleDateString('fr-FR')}</span>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="escrow" className="space-y-6">
              <EscrowManagementPanel />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* FLUX DE TRÉSORERIE */}
        <TabsContent value="cashflow" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Analyse détaillée des flux de trésorerie
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `€${v.toLocaleString()}`} />
                  <Bar dataKey="entrees" fill="#10B981" name="Entrées" />
                  <Bar dataKey="sorties" fill="#EF4444" name="Sorties" />
                  <Bar dataKey="escrow" fill="#F59E0B" name="Escrow" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Entrées moyennes', value: '€20,814', sub: 'Par mois', bg: 'from-green-50 to-emerald-50', color: 'text-green-600' },
              { label: 'Sorties moyennes', value: '€12,714', sub: 'Par mois', bg: 'from-amber-50 to-yellow-50', color: 'text-amber-600' },
              { label: 'Escrow moyen', value: '€5,914', sub: 'En attente', bg: 'from-yellow-50 to-orange-50', color: 'text-yellow-600' },
              { label: 'Marge nette', value: '€8,100', sub: 'Bénéfice mensuel', bg: 'from-purple-50 to-violet-50', color: 'text-purple-600' },
            ].map((item) => (
              <Card key={item.label} className={`bg-gradient-to-br ${item.bg} border-0`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PRÉDICTIONS IA */}
        <TabsContent value="predictions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Prédictions vs Réalité - Performance IA
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => v ? `€${v.toLocaleString()}` : '—'} />
                  <Line type="monotone" dataKey="predictions" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 5" name="Prédictions IA" />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} name="Réalité" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Précision IA', value: '94.2%', sub: 'Derniers 6 mois', bg: 'from-green-50 to-emerald-50', color: 'text-green-600' },
              { label: 'Prédiction Juillet', value: '€125,000', sub: 'Confiance: 89%', bg: 'from-purple-50 to-violet-50', color: 'text-purple-600' },
              { label: 'Écart moyen', value: '±€2,800', sub: "Marge d'erreur", bg: 'from-yellow-50 to-orange-50', color: 'text-yellow-600' },
            ].map((item) => (
              <Card key={item.label} className={`bg-gradient-to-br ${item.bg} border-0`}>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle></CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* RAPPORTS */}
        <TabsContent value="reports" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Rapports automatiques</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Rapport mensuel complet', description: "Vue d'ensemble financière", status: 'Disponible' },
                  { name: 'Analyse Escrow', description: "Performance du système d'escrow", status: 'En génération' },
                  { name: 'Prédictions trimestrielles', description: 'Projections IA 3 mois', status: 'Disponible' },
                  { name: 'Audit de conformité', description: 'Vérification réglementaire', status: 'Planifié' },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'Disponible' ? 'default' : 'secondary'}>{report.status}</Badge>
                      {report.status === 'Disponible' && (
                        <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Actions rapides</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent text-white">
                  <FileText className="h-4 w-4 mr-3" />Générer rapport personnalisé
                </Button>
                <Button className="w-full justify-start" variant="secondary">
                  <Bot className="h-4 w-4 mr-3" />Analyse IA approfondie
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-3" />Importer données externes
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/brand?section=calendrier">
                    <Calendar className="h-4 w-4 mr-3" />Programmer rapport automatique
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/brand?section=parametres">
                    <Settings className="h-4 w-4 mr-3" />Configurer alertes financières
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOGS */}
      <AffiliatePaymentDetailsDialog
        open={showAffiliateDetails}
        onOpenChange={setShowAffiliateDetails}
        payment={selectedAffiliatePayment}
        getPaymentStatusColor={getPaymentStatusColor}
        getPaymentStatusLabel={getPaymentStatusLabel}
        onReleasePayment={releasePayment}
      />
      <EscrowPaymentDetailsDialog
        open={showEscrowDetails}
        onOpenChange={setShowEscrowDetails}
        transaction={selectedEscrowTransaction}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        getStatusIcon={getStatusIcon}
        onReleaseEscrow={releaseEscrow}
        onValidateTranche={validateTranche}
        onSuspendContract={suspendContract}
      />
    </div>
  )
}

export default FinancesSection