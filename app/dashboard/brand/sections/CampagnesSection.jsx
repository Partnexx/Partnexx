'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Brain, Sparkles, Clock, BarChart3, Users, ChevronLeft, ChevronRight,
  Rocket, CheckCircle, X, Eye, Copy, FileText, DollarSign, Lock,
  Unlock, CircleDollarSign, Link2, Target, AlertTriangle, Play,
  TrendingUp, Heart, MessageCircle, Send, ThumbsDown, ThumbsUp,
  Plus, Trash2, RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

// ─── CONSTANTES (copie fidèle de Lovable) ────────────────────────────────────
const STEPS = [
  "Sélection de l'audience",
  "Choix des catégories",
  "Détails de la campagne",
  "Dates",
  "Budget et rémunération",
  "Contenus attendus",
  "Récapitulatif"
]

const AUDIENCE_SIZES = [
  "0 à 10 000 abonnés",
  "10 000 à 50 000",
  "50 000 à 200 000",
  "200 000 à 1 M",
  "1 M+"
]

const CATEGORIES = [
  "Mode", "Beauté", "Sport", "Gaming", "Tech",
  "Lifestyle", "Food", "Finance", "Développement personnel", "Automobile", "Autres"
]

const CAMPAIGN_TYPES = [
  { value: "affiliation", label: "🧩 Affiliation", description: "basée sur la performance, rémunération à la vente ou au clic" },
  { value: "placement", label: "🎁 Placement de produit", description: "visibilité et contenu sponsorisé" },
  { value: "ambassadeur", label: "🤝 Ambassadeur de marque", description: "collaboration longue durée" },
  { value: "notoriete", label: "🚀 Campagne de notoriété", description: "lancement, buzz ou visibilité massive" }
]

const OBJECTIVES = ["Notoriété", "Engagement", "Ventes / Conversions"]

const CONTENT_TYPES = [
  "Post Instagram", "Story Instagram", "Reel Instagram",
  "TikTok", "Vidéo YouTube", "Post LinkedIn", "Tweet"
]

const EMPTY_FORM = {
  audienceSize: [], categories: [], name: "", campaignType: "",
  objectives: [], brief: "", startDate: "", endDate: "",
  submissionDeadline: "", indefiniteDuration: false,
  commissionRate: "", salesTarget: "", bonusTier: "", affiliationAccess: "open",
  amountPerContent: "", numberOfContents: "",
  monthlyAmount: "", collaborationDuration: "", benefitsInKind: "",
  totalBudget: "", viewsTarget: "", engagementBonus: "",
  contentTypes: [], contentQuantity: "", constraints: ""
}

// ─── FORMULAIRE 7 ÉTAPES ─────────────────────────────────────────────────────
function CreateCampaignWizard({ brandId, onCreated, onBack }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdName, setCreatedName] = useState("")

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }))
  const toggle = (field, value) => setForm(p => ({
    ...p,
    [field]: p[field].includes(value) ? p[field].filter(x => x !== value) : [...p[field], value]
  }))

  const canContinue = () => {
    switch (step) {
      case 0: return form.audienceSize.length > 0
      case 1: return form.categories.length > 0
      case 2: return form.name && form.campaignType && form.objectives.length > 0
      case 3: return form.startDate && (form.indefiniteDuration || form.endDate) && form.submissionDeadline
      case 4:
        if (form.campaignType === "affiliation") return !!form.commissionRate && !!form.salesTarget
        if (form.campaignType === "placement") return !!form.amountPerContent && !!form.numberOfContents
        if (form.campaignType === "ambassadeur") return !!form.monthlyAmount && !!form.collaborationDuration
        if (form.campaignType === "notoriete") return !!form.totalBudget && !!form.viewsTarget
        return false
      case 5: return form.contentTypes.length > 0 && !!form.contentQuantity
      default: return true
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    const budget = parseFloat(form.totalBudget || form.amountPerContent || form.monthlyAmount || 0)
    const { data, error } = await supabase.from('campaigns').insert({
      brand_id: brandId,
      title: form.name,
      description: form.brief,
      budget_per_influencer_min: parseFloat(form.amountPerContent || 0),
      budget_per_influencer_max: parseFloat(form.amountPerContent || 0),
      total_budget: budget,
      start_date: form.startDate || null,
      end_date: form.indefiniteDuration ? null : (form.endDate || null),
      platforms: [],
      content_types: form.contentTypes,
      requirements: form.constraints,
      status: 'draft',
    }).select().single()

    if (error) { toast.error("Erreur lors de la création"); setSaving(false); return }
    setCreatedName(form.name)
    setShowSuccess(true)
    setSaving(false)
    onCreated(data)
  }

  if (showSuccess) return (
    <div className="min-h-[500px] flex items-center justify-center">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🚀 Campagne créée avec succès !
          </h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <p className="text-lg text-gray-700 mb-2">Votre campagne <span className="font-bold text-green-700">"{createdName}"</span> a été créée</p>
            <p className="text-gray-600">Elle est maintenant en mode brouillon, activez-la pour recevoir des candidatures.</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setShowSuccess(false); setForm(EMPTY_FORM); setStep(0) }}>Créer une autre campagne</Button>
            <Button variant="outline" onClick={onBack}>Voir mes campagnes</Button>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Créer une nouvelle campagne</h2>
          <Badge variant="outline" className="text-sm px-3 py-1">Étape {step + 1} sur {STEPS.length}</Badge>
        </div>
        <Progress value={(step / (STEPS.length - 1)) * 100} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 font-medium">{STEPS[step]}</p>
      </div>

      <Card className="p-6">
        {/* ÉTAPE 1 — Audience */}
        {step === 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">Quelle taille d'audience recherchez-vous ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AUDIENCE_SIZES.map(size => (
                <Card key={size} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.audienceSize.includes(size) ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`}
                  onClick={() => toggle('audienceSize', size)}>
                  <div className="flex items-center space-x-4">
                    <Checkbox id={size} checked={form.audienceSize.includes(size)} onCheckedChange={() => toggle('audienceSize', size)} className="w-6 h-6" />
                    <label htmlFor={size} className="text-lg font-medium cursor-pointer flex-1">{size}</label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — Catégories */}
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">Dans quelles catégories opérez-vous ?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {CATEGORIES.map(cat => (
                <Card key={cat} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.categories.includes(cat) ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`}
                  onClick={() => toggle('categories', cat)}>
                  <div className="flex items-center space-x-4">
                    <Checkbox id={cat} checked={form.categories.includes(cat)} onCheckedChange={() => toggle('categories', cat)} className="w-6 h-6" />
                    <label htmlFor={cat} className="text-lg font-medium cursor-pointer flex-1">{cat}</label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Détails */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Détails de votre campagne</h3>
            <div>
              <label className="block text-base font-semibold mb-3">Nom de la campagne *</label>
              <Input placeholder="Ex: Lancement collection automne 2025" value={form.name} onChange={e => update('name', e.target.value)} className="h-10 text-base" />
            </div>
            <div>
              <label className="block text-xl font-bold mb-6">Type de campagne *</label>
              <div className="grid grid-cols-1 gap-6">
                {CAMPAIGN_TYPES.map(type => (
                  <Card key={type.value} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.campaignType === type.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`}
                    onClick={() => update('campaignType', type.value)}>
                    <div className="flex items-start space-x-4">
                      <Checkbox id={type.value} checked={form.campaignType === type.value} onCheckedChange={() => update('campaignType', type.value)} className="mt-1 w-6 h-6" />
                      <div className="flex-1">
                        <label htmlFor={type.value} className="text-lg font-bold cursor-pointer block mb-2">{type.label}</label>
                        <p className="text-base text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xl font-bold mb-6">Objectifs principaux *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {OBJECTIVES.map(obj => (
                  <Card key={obj} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.objectives.includes(obj) ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`}
                    onClick={() => toggle('objectives', obj)}>
                    <div className="flex items-center space-x-4">
                      <Checkbox id={obj} checked={form.objectives.includes(obj)} onCheckedChange={() => toggle('objectives', obj)} className="w-6 h-6" />
                      <label htmlFor={obj} className="text-lg font-medium cursor-pointer flex-1">{obj}</label>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold mb-2">Détails de la collaboration</label>
              <Textarea placeholder="Format souhaité, ton du message, hashtags, call-to-action..." value={form.brief} onChange={e => update('brief', e.target.value)} rows={4} />
            </div>
          </div>
        )}

        {/* ÉTAPE 4 — Dates */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Planification temporelle</h3>
            <div className="flex items-center gap-3 mb-6">
              <Checkbox id="indefinite" checked={form.indefiniteDuration} onCheckedChange={v => { update('indefiniteDuration', v); if (v) update('endDate', '') }} />
              <label htmlFor="indefinite" className="text-base font-semibold cursor-pointer">Durée indéterminée</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-base font-semibold mb-3">Date de début *</label>
                <Input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
              </div>
              <div>
                <label className="block text-base font-semibold mb-3">Date de fin {form.indefiniteDuration ? '' : '*'}</label>
                <Input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} disabled={form.indefiniteDuration} />
              </div>
              <div>
                <label className="block text-base font-semibold mb-3">Deadline des contenus *</label>
                <Input type="date" value={form.submissionDeadline} onChange={e => update('submissionDeadline', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 — Budget */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Budget et rémunération</h3>

            {form.campaignType === "affiliation" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">🧩 Affiliation - Rémunération à la performance</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3">Type d'accès *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: "open", label: "🌍 Ouverte à tous", desc: "Tous les créateurs peuvent rejoindre" },
                      { value: "invite", label: "🔗 Sur invitation", desc: "Accès via lien d'invitation uniquement" },
                      { value: "targeted", label: "🎯 Ciblée", desc: "Visible si le profil matche avec les critères IA" },
                    ].map(opt => (
                      <Card key={opt.value} className={`p-4 cursor-pointer border-2 transition-all ${form.affiliationAccess === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        onClick={() => update('affiliationAccess', opt.value)}>
                        <div className="flex items-start gap-3">
                          <Checkbox checked={form.affiliationAccess === opt.value} onCheckedChange={() => update('affiliationAccess', opt.value)} className="mt-1" />
                          <div>
                            <p className="font-semibold text-base">{opt.label}</p>
                            <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Taux de commission (%) *</label>
                    <Input type="number" placeholder="15" value={form.commissionRate} onChange={e => update('commissionRate', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Objectif de vente (€) *</label>
                    <Input type="number" placeholder="10000" value={form.salesTarget} onChange={e => update('salesTarget', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Bonus palier (optionnel)</label>
                  <Input placeholder="Ex: +5% au-delà de 10 000€" value={form.bonusTier} onChange={e => update('bonusTier', e.target.value)} />
                </div>
              </div>
            )}

            {form.campaignType === "placement" && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900">🎁 Placement de produit - Rémunération fixe par contenu</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Montant par contenu (€) *</label>
                    <Input type="number" placeholder="300" value={form.amountPerContent} onChange={e => update('amountPerContent', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre de contenus *</label>
                    <Input type="number" placeholder="5" value={form.numberOfContents} onChange={e => update('numberOfContents', e.target.value)} />
                  </div>
                </div>
                {form.amountPerContent && form.numberOfContents && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm font-medium text-green-900">💰 Budget total calculé: {(parseFloat(form.amountPerContent) * parseFloat(form.numberOfContents)).toLocaleString('fr-FR')}€</p>
                  </Card>
                )}
              </div>
            )}

            {form.campaignType === "ambassadeur" && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900">🤝 Ambassadeur - Rémunération mensuelle</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Montant mensuel (€) *</label>
                    <Input type="number" placeholder="500" value={form.monthlyAmount} onChange={e => update('monthlyAmount', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Durée (mois) *</label>
                    <Input type="number" placeholder="6" value={form.collaborationDuration} onChange={e => update('collaborationDuration', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Avantages en nature (optionnel)</label>
                  <Textarea placeholder="Produits offerts, codes promo, invitations événements..." value={form.benefitsInKind} onChange={e => update('benefitsInKind', e.target.value)} rows={3} />
                </div>
                {form.monthlyAmount && form.collaborationDuration && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <p className="text-sm font-medium text-blue-900">💰 Budget total: {(parseFloat(form.monthlyAmount) * parseFloat(form.collaborationDuration)).toLocaleString('fr-FR')}€</p>
                  </Card>
                )}
              </div>
            )}

            {form.campaignType === "notoriete" && (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900">🚀 Campagne de notoriété - Budget global</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Budget total (€) *</label>
                    <Input type="number" placeholder="2000" value={form.totalBudget} onChange={e => update('totalBudget', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Objectif de vues *</label>
                    <Input type="number" placeholder="100000" value={form.viewsTarget} onChange={e => update('viewsTarget', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Bonus d'engagement (%) (optionnel)</label>
                  <Input type="number" placeholder="10" value={form.engagementBonus} onChange={e => update('engagementBonus', e.target.value)} />
                </div>
              </div>
            )}

            {!form.campaignType && (
              <div className="text-center py-8 text-muted-foreground">Veuillez d'abord sélectionner un type de campagne à l'étape précédente</div>
            )}
          </div>
        )}

        {/* ÉTAPE 6 — Contenus */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contenus attendus</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Types de contenu souhaités *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CONTENT_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} checked={form.contentTypes.includes(type)} onCheckedChange={() => toggle('contentTypes', type)} />
                    <label htmlFor={type} className="text-sm cursor-pointer">{type}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantité par influenceur *</label>
              <Select value={form.contentQuantity} onValueChange={v => update('contentQuantity', v)}>
                <SelectTrigger><SelectValue placeholder="Choisir une quantité" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 contenu</SelectItem>
                  <SelectItem value="2-3">2-3 contenus</SelectItem>
                  <SelectItem value="4-5">4-5 contenus</SelectItem>
                  <SelectItem value="6+">6+ contenus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contraintes et exigences</label>
              <Textarea placeholder="Hashtags obligatoires, mentions, éviter certains sujets..." value={form.constraints} onChange={e => update('constraints', e.target.value)} rows={3} />
            </div>
          </div>
        )}

        {/* ÉTAPE 7 — Récap */}
        {step === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Récapitulatif de votre campagne</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Informations générales</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Nom:</span> {form.name}</div>
                  <div><span className="font-medium">Type:</span> {CAMPAIGN_TYPES.find(t => t.value === form.campaignType)?.label}</div>
                  <div><span className="font-medium">Objectifs:</span> {form.objectives.join(", ")}</div>
                  <div><span className="font-medium">Catégories:</span> {form.categories.join(", ")}</div>
                  <div><span className="font-medium">Audience:</span> {form.audienceSize.join(", ")}</div>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-3">Budget & Rémunération</h4>
                <div className="space-y-2 text-sm">
                  {form.campaignType === "affiliation" && <><div><span className="font-medium">Commission:</span> {form.commissionRate}%</div><div><span className="font-medium">Objectif ventes:</span> {form.salesTarget}€</div></>}
                  {form.campaignType === "placement" && <><div><span className="font-medium">Par contenu:</span> {form.amountPerContent}€</div><div><span className="font-medium">Nombre:</span> {form.numberOfContents}</div><div className="font-bold">Total: {(parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)).toLocaleString()}€</div></>}
                  {form.campaignType === "ambassadeur" && <><div><span className="font-medium">Mensuel:</span> {form.monthlyAmount}€</div><div><span className="font-medium">Durée:</span> {form.collaborationDuration} mois</div><div className="font-bold">Total: {(parseFloat(form.monthlyAmount || 0) * parseFloat(form.collaborationDuration || 0)).toLocaleString()}€</div></>}
                  {form.campaignType === "notoriete" && <><div><span className="font-medium">Budget:</span> {form.totalBudget}€</div><div><span className="font-medium">Objectif vues:</span> {parseFloat(form.viewsTarget || 0).toLocaleString()}</div></>}
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-3">Contenus attendus</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Types:</span> {form.contentTypes.join(", ")}</div>
                  <div><span className="font-medium">Quantité:</span> {form.contentQuantity}</div>
                  {form.constraints && <div><span className="font-medium">Contraintes:</span> {form.constraints}</div>}
                </div>
              </Card>
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Brain className="w-4 h-4 text-primary" /></div>
                  <div>
                    <h4 className="font-medium text-primary">Recommandations IA</h4>
                    <p className="text-sm text-muted-foreground mt-1">Basé sur vos critères, nous estimons un ROI de 340% avec un taux d'engagement moyen de 4.2%. Nous recommandons 12-15 influenceurs.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => step === 0 ? null : setStep(s => s - 1)} disabled={step === 0} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />Précédent
          </Button>
          {step === STEPS.length - 1 ? (
            <Button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Création...</> : <><Rocket className="w-4 h-4" />Créer la campagne</>}
            </Button>
          ) : (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canContinue()} className="flex items-center gap-2">
              Suivant<ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── ONGLET RECRUTEMENT ───────────────────────────────────────────────────────
function RecrutementTab({ campaigns, brandId, onUpdate }) {
  const [filter, setFilter] = useState("all")
  const [collabTab, setCollabTab] = useState("candidatures")

  const collabCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'draft')

  const handleAccept = async (campaignId, appId) => {
    const { error } = await supabase.from('applications').update({ status: 'accepted' }).eq('id', appId)
    if (!error) { toast.success("Candidature acceptée !"); onUpdate() }
  }

  const handleReject = async (campaignId, appId) => {
    const { error } = await supabase.from('applications').update({ status: 'rejected' }).eq('id', appId)
    if (!error) { toast.info("Candidature refusée"); onUpdate() }
  }

  if (collabCampaigns.length === 0) return (
    <Card className="p-12 text-center border-2 border-dashed">
      <Clock className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-2xl font-bold mb-2">Aucune campagne active</h3>
      <p className="text-muted-foreground">Créez et activez une campagne pour recevoir des candidatures</p>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Filtre campagne */}
      <div className="flex gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="max-w-xs"><SelectValue placeholder="Filtrer par campagne" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les campagnes</SelectItem>
            {collabCampaigns.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={collabTab} onValueChange={setCollabTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="candidatures" className="flex items-center gap-2"><Users className="w-4 h-4" />Candidatures</TabsTrigger>
          <TabsTrigger value="juridique" className="flex items-center gap-2"><FileText className="w-4 h-4" />Juridique</TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2"><CircleDollarSign className="w-4 h-4" />Paiements</TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2"><Link2 className="w-4 h-4" />Invitations</TabsTrigger>
        </TabsList>

        {/* CANDIDATURES */}
        <TabsContent value="candidatures" className="space-y-6">
          {collabCampaigns.filter(c => filter === 'all' || c.id === filter).map(campaign => {
            const apps = campaign.applications || []
            const pending = apps.filter(a => a.status === 'pending')
            const accepted = apps.filter(a => a.status === 'accepted')
            const rejected = apps.filter(a => a.status === 'rejected')

            return (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <span className="font-bold text-lg">{parseFloat(campaign.total_budget || 0).toLocaleString()}€</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total', value: apps.length, color: 'text-foreground' },
                      { label: 'En attente', value: pending.length, color: 'text-yellow-600' },
                      { label: 'Acceptées', value: accepted.length, color: 'text-green-600' },
                      { label: 'Refusées', value: rejected.length, color: 'text-red-600' },
                    ].map(({ label, value, color }) => (
                      <Card key={label}><CardContent className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
                    ))}
                  </div>

                  {apps.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">Aucune candidature pour l'instant</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {apps.map(app => (
                        <Card key={app.id} className={`p-4 border-2 ${app.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' : app.status === 'accepted' ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30 opacity-60'}`}>
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center font-bold text-white text-xl flex-shrink-0">
                              {(app.influencers?.display_name || 'IN').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{app.influencers?.display_name || 'Influenceur'}</h4>
                                  <p className="text-xs text-muted-foreground">Postulé le {new Date(app.applied_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <Badge className={app.status === 'pending' ? 'bg-yellow-500 text-white' : app.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                  {app.status === 'pending' ? 'En attente' : app.status === 'accepted' ? '✓ Acceptée' : '✗ Refusée'}
                                </Badge>
                              </div>
                              {app.cover_letter && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.cover_letter}</p>}
                              {app.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAccept(campaign.id, app.id)}>
                                    <CheckCircle className="h-4 w-4 mr-1" />Accepter
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleReject(campaign.id, app.id)}>
                                    <X className="h-4 w-4 mr-1" />Refuser
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => toast.info("Profil — disponible prochainement")}>
                                    <Eye className="h-4 w-4 mr-1" />Voir le profil
                                  </Button>
                                </div>
                              )}
                              {app.status === 'accepted' && (
                                <Button size="sm" variant="outline" onClick={() => toast.info("Profil — disponible prochainement")}>
                                  <Eye className="h-4 w-4 mr-1" />Voir le profil
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* JURIDIQUE */}
        <TabsContent value="juridique" className="space-y-6">
          {collabCampaigns.filter(c => filter === 'all' || c.id === filter).map(campaign => {
            const accepted = (campaign.applications || []).filter(a => a.status === 'accepted')
            if (accepted.length === 0) return null
            return (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <span className="font-bold text-lg">{parseFloat(campaign.total_budget || 0).toLocaleString()}€</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'À envoyer', value: accepted.length, color: 'text-gray-600', icon: Clock },
                      { label: 'En attente signature', value: 0, color: 'text-yellow-600', icon: Clock },
                      { label: 'Signés', value: 0, color: 'text-green-600', icon: CheckCircle },
                      { label: 'Refusés', value: 0, color: 'text-red-600', icon: X },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <Card key={label}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div><Icon className={`h-6 w-6 ${color}`} /></CardContent></Card>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {accepted.map(app => (
                      <Card key={app.id} className="p-4 border-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{app.influencers?.display_name || 'Influenceur'}</p>
                            <Badge className="bg-gray-500 text-white mt-1"><Clock className="w-3 h-3 mr-1" />Contrat à envoyer</Badge>
                          </div>
                          <Button size="sm" className="bg-primary" onClick={() => toast.info("Envoi de contrat — disponible prochainement")}>
                            <FileText className="h-4 w-4 mr-2" />Envoyer un contrat
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          }).filter(Boolean)}
          {collabCampaigns.filter(c => filter === 'all' || c.id === filter).every(c => (c.applications || []).filter(a => a.status === 'accepted').length === 0) && (
            <Card className="p-12 text-center border-2 border-dashed">
              <FileText className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Aucune candidature acceptée</h3>
              <p className="text-muted-foreground">Acceptez des candidatures pour gérer les contrats</p>
            </Card>
          )}
        </TabsContent>

        {/* ESCROW */}
        <TabsContent value="escrow" className="space-y-6">
          {collabCampaigns.filter(c => filter === 'all' || c.id === filter).map(campaign => {
            const accepted = (campaign.applications || []).filter(a => a.status === 'accepted')
            if (accepted.length === 0) return null
            return (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2 border-orange-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <span className="font-bold">{parseFloat(campaign.total_budget || 0).toLocaleString()}€</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Non activés', value: accepted.length, icon: Unlock, color: 'text-gray-600' },
                      { label: 'Fonds bloqués', value: '0€', icon: Lock, color: 'text-orange-600' },
                      { label: 'Fonds libérés', value: '0€', icon: CheckCircle, color: 'text-green-600' },
                      { label: 'Escrows actifs', value: 0, icon: CircleDollarSign, color: 'text-blue-600' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <Card key={label}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div><Icon className={`h-8 w-8 ${color}`} /></CardContent></Card>
                    ))}
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Activer et sécuriser les fonds</h3>
                      <p className="text-sm text-muted-foreground">{accepted.length} contrat(s) en attente d'activation</p>
                    </div>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => toast.info("Activation escrow — disponible prochainement")}>
                      <Lock className="h-4 w-4 mr-2" />Activer et bloquer les fonds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          }).filter(Boolean)}
          {collabCampaigns.filter(c => filter === 'all' || c.id === filter).every(c => (c.applications || []).filter(a => a.status === 'accepted').length === 0) && (
            <Card className="p-12 text-center border-2 border-dashed">
              <Lock className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Aucun escrow disponible</h3>
              <p className="text-muted-foreground">Les escrows seront disponibles une fois les contrats signés</p>
            </Card>
          )}
        </TabsContent>

        {/* INVITATIONS */}
        <TabsContent value="invitations" className="space-y-6">
          {collabCampaigns.filter(c => filter === 'all' || c.id === filter).map(campaign => {
            const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campagne/join/${campaign.id}`
            return (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <span className="font-bold">{parseFloat(campaign.total_budget || 0).toLocaleString()}€</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2"><Link2 className="h-5 w-5" />Lien d'invitation</h4>
                    <p className="text-sm text-muted-foreground mb-3">Partagez ce lien pour inviter des créateurs à postuler</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-3 bg-muted rounded-md text-sm font-mono break-all">{inviteUrl}</div>
                      <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(inviteUrl); toast.success("Lien copié !") }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div><p className="text-sm text-muted-foreground">Vues</p><p className="text-3xl font-bold">0</p></div>
                    <div><p className="text-sm text-muted-foreground">Candidatures</p><p className="text-3xl font-bold">{(campaign.applications || []).length}</p></div>
                    <div><p className="text-sm text-muted-foreground">Taux conversion</p><p className="text-3xl font-bold">0%</p></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => toast.info("QR Code — disponible prochainement")}>
                      QR Code
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => toast.info("Nouveau lien généré")}>
                      <RefreshCw className="h-4 w-4 mr-2" />Régénérer le lien
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── ONGLET SUIVI DES OPÉRATIONS ──────────────────────────────────────────────
function SuivisTab({ campaigns }) {
  const [selected, setSelected] = useState("all")
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'draft')
  const campaign = activeCampaigns.find(c => c.id === selected)

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cockpit de pilotage</h2>
            <p className="text-muted-foreground">Sélectionnez une campagne pour accéder au tableau de bord</p>
          </div>
        </div>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-full bg-background h-12 text-lg">
            <SelectValue placeholder="📊 Sélectionner une campagne à piloter" />
          </SelectTrigger>
          <SelectContent>
            {activeCampaigns.map(c => (
              <SelectItem key={c.id} value={c.id} className="text-base py-3">{c.title} • {parseFloat(c.total_budget || 0).toLocaleString()}€</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {campaign ? (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Budget', value: `${parseFloat(campaign.total_budget || 0).toLocaleString()}€`, icon: Target, color: 'text-blue-600' },
              { label: 'Candidatures', value: (campaign.applications || []).length, icon: Users, color: 'text-purple-600' },
              { label: 'Acceptées', value: (campaign.applications || []).filter(a => a.status === 'accepted').length, icon: CheckCircle, color: 'text-green-600' },
              { label: 'En attente', value: (campaign.applications || []).filter(a => a.status === 'pending').length, icon: AlertTriangle, color: 'text-orange-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div><Icon className={`h-8 w-8 ${color}`} /></CardContent></Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>Informations de la campagne</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div><p className="text-sm font-medium text-muted-foreground mb-1">Titre</p><p className="font-semibold">{campaign.title}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground mb-1">Statut</p><Badge>{campaign.status}</Badge></div>
              <div><p className="text-sm font-medium text-muted-foreground mb-1">Début</p><p>{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('fr-FR') : 'Non défini'}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground mb-1">Fin</p><p>{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('fr-FR') : 'Indéterminée'}</p></div>
              {campaign.platforms?.length > 0 && <div><p className="text-sm font-medium text-muted-foreground mb-1">Plateformes</p><div className="flex flex-wrap gap-1">{campaign.platforms.map(p => <Badge key={p} variant="secondary" className="capitalize">{p}</Badge>)}</div></div>}
              {campaign.content_types?.length > 0 && <div><p className="text-sm font-medium text-muted-foreground mb-1">Contenus</p><div className="flex flex-wrap gap-1">{campaign.content_types.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div></div>}
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader><CardTitle className="text-center text-2xl">Gestion de la campagne</CardTitle></CardHeader>
            <CardContent className="flex justify-center p-12">
              <Button variant="destructive" className="h-24 px-12 text-lg flex-col gap-3"
                onClick={() => { if (confirm('Clôturer cette campagne ?')) toast.success("Campagne clôturée") }}>
                <BarChart3 className="w-8 h-8" />
                Clôturer la campagne
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center border-2 border-dashed">
          <BarChart3 className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold mb-2">Sélectionnez une campagne</h3>
          <p className="text-muted-foreground">Choisissez une campagne ci-dessus pour accéder au cockpit</p>
        </Card>
      )}
    </div>
  )
}

// ─── SECTION PRINCIPALE ───────────────────────────────────────────────────────
export default function CampagnesSection({ user, profile }) {
  const [campaigns, setCampaigns] = useState([])
  const [applications, setApplications] = useState([])
  const [brandId, setBrandId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("creer")

  useEffect(() => {
    if (!user?.id) return
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    const { data: brand } = await supabase.from('brands').select('id').eq('user_id', user.id).single()
    if (!brand) { setLoading(false); return }
    setBrandId(brand.id)

    const [campRes, appRes] = await Promise.allSettled([
      supabase.from('campaigns').select('*').eq('brand_id', brand.id).order('created_at', { ascending: false }),
      supabase.from('applications').select('*, influencers(display_name, ai_score)').eq('brand_id', brand.id).order('applied_at', { ascending: false }),
    ])

    const camps = campRes.status === 'fulfilled' ? campRes.value.data || [] : []
    const apps = appRes.status === 'fulfilled' ? appRes.value.data || [] : []

    // Attacher les applications à chaque campagne
    const campsWithApps = camps.map(c => ({
      ...c,
      applications: apps.filter(a => a.campaign_id === c.id)
    }))

    setCampaigns(campsWithApps)
    setApplications(apps)
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement des campagnes...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Gestion des campagnes</h1>
          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
            <Brain className="h-3 w-3 mr-1" />IA Activée
          </Badge>
        </div>
        <p className="text-muted-foreground">Créez et gérez vos campagnes marketing avec intelligence</p>
      </header>

      {/* 4 onglets principaux — fidèles à Lovable */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="creer" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white py-3 transition-all">
            <Sparkles className="w-4 h-4" />Créer une campagne
          </TabsTrigger>
          <TabsTrigger value="recrutement" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white py-3 transition-all">
            <Clock className="w-4 h-4" />Recrutement
          </TabsTrigger>
          <TabsTrigger value="suivis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 transition-all">
            <BarChart3 className="w-4 h-4" />Suivis des opérations
          </TabsTrigger>
          <TabsTrigger value="ugc" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 transition-all">
            <Users className="w-4 h-4" />Créateurs UGC
          </TabsTrigger>
        </TabsList>

        {/* CRÉER UNE CAMPAGNE */}
        <TabsContent value="creer" className="space-y-6 mt-6">
          <CreateCampaignWizard
            brandId={brandId}
            onCreated={(newCamp) => { setCampaigns(prev => [{ ...newCamp, applications: [] }, ...prev]); }}
            onBack={() => setActiveTab("recrutement")}
          />
        </TabsContent>

        {/* RECRUTEMENT */}
        <TabsContent value="recrutement" className="space-y-6 mt-6">
          <RecrutementTab campaigns={campaigns} brandId={brandId} onUpdate={fetchAll} />
        </TabsContent>

        {/* SUIVIS DES OPÉRATIONS */}
        <TabsContent value="suivis" className="space-y-6 mt-6">
          <SuivisTab campaigns={campaigns} />
        </TabsContent>

        {/* CRÉATEURS UGC */}
        <TabsContent value="ugc" className="space-y-6 mt-6">
          <Card className="p-12 text-center border-2 border-dashed">
            <Users className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Créateurs UGC</h3>
            <p className="text-muted-foreground">Découvrez les contenus créés par vos influenceurs partenaires</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}