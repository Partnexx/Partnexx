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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Brain, Sparkles, Clock, BarChart3, Users, ChevronLeft, ChevronRight,
  Rocket, CheckCircle, X, Eye, Copy, FileText, DollarSign, Lock,
  Unlock, CircleDollarSign, Link2, Target, AlertTriangle, Play,
  TrendingUp, Heart, RefreshCw, Star, Archive, UserPlus, Bookmark,
  Search, Filter, Plus, Settings, Zap
} from 'lucide-react'
import { toast } from 'sonner'
import supabase from '@/lib/supabase'

const STEPS = ["Sélection de l'audience","Choix des catégories","Détails de la campagne","Dates","Budget et rémunération","Contenus attendus","Récapitulatif"]
const AUDIENCE_SIZES = ["0 à 10 000 abonnés","10 000 à 50 000","50 000 à 200 000","200 000 à 1 M","1 M+"]
const CATEGORIES = ["Mode","Beauté","Sport","Gaming","Tech","Lifestyle","Food","Finance","Développement personnel","Automobile","Autres"]
const CAMPAIGN_TYPES = [
  { value: "affiliation", label: "🧩 Affiliation", description: "basée sur la performance, rémunération à la vente ou au clic" },
  { value: "placement", label: "🎁 Placement de produit", description: "visibilité et contenu sponsorisé" },
  { value: "ambassadeur", label: "🤝 Ambassadeur de marque", description: "collaboration longue durée" },
  { value: "notoriete", label: "🚀 Campagne de notoriété", description: "lancement, buzz ou visibilité massive" }
]
const OBJECTIVES = ["Notoriété","Engagement","Ventes / Conversions"]
const CONTENT_TYPES = [
  { label: "Post Instagram", value: "post" },
  { label: "Story Instagram", value: "story" },
  { label: "Reel Instagram", value: "reel" },
  { label: "TikTok / Vidéo courte", value: "video" },
  { label: "Vidéo YouTube", value: "video" },
  { label: "Carrousel", value: "carousel" },
  { label: "Live", value: "live" },
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

// ─── WIZARD CRÉATION ─────────────────────────────────────────────────────────
function CreateCampaignWizard({ brandId, onCreated }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdName, setCreatedName] = useState("")

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }))
  const toggle = (field, value) => setForm(p => ({
    ...p, [field]: p[field].includes(value) ? p[field].filter(x => x !== value) : [...p[field], value]
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
    const budget = parseFloat(
      form.campaignType === 'affiliation' ? form.salesTarget :
      form.campaignType === 'placement' ? (parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)) :
      form.campaignType === 'ambassadeur' ? (parseFloat(form.monthlyAmount || 0) * parseFloat(form.collaborationDuration || 0)) :
      form.totalBudget || 0
    )
    const { data, error } = await supabase.from('campaigns').insert({
      brand_id: brandId,
      title: form.name,
      description: form.brief || null,
      brief: form.brief || null,
      budget_total: budget,
      budget_per_influencer_min: parseFloat(form.amountPerContent || 0) || null,
      budget_per_influencer_max: parseFloat(form.amountPerContent || 0) || null,
      commission_rate: parseFloat(form.commissionRate || 0) || null,
      campaign_type: form.campaignType || null,
      payout_amount:
        form.campaignType === 'ambassadeur' ? (parseFloat(form.monthlyAmount || 0) || null) :
        form.campaignType === 'placement' ? ((parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)) || null) :
        null,
      payout_frequency: form.campaignType === 'ambassadeur' ? 'monthly' : null,
      payout_duration_months: form.campaignType === 'ambassadeur' ? (parseInt(form.collaborationDuration) || null) : null,
      campaign_type: form.campaignType || null,
      payout_amount:
        form.campaignType === 'ambassadeur' ? (parseFloat(form.monthlyAmount || 0) || null) :
        form.campaignType === 'placement' ? ((parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)) || null) :
        null,
      payout_frequency: form.campaignType === 'ambassadeur' ? 'monthly' : null,
      payout_duration_months: form.campaignType === 'ambassadeur' ? (parseInt(form.collaborationDuration) || null) : null,
      campaign_type: form.campaignType || null,
      payout_amount:
        form.campaignType === 'ambassadeur' ? (parseFloat(form.monthlyAmount || 0) || null) :
        form.campaignType === 'placement' ? ((parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)) || null) :
        null,
      payout_frequency: form.campaignType === 'ambassadeur' ? 'monthly' : null,
      payout_duration_months: form.campaignType === 'ambassadeur' ? (parseInt(form.collaborationDuration) || null) : null,
      campaign_type: form.campaignType || null,
      payout_amount:
        form.campaignType === 'ambassadeur' ? (parseFloat(form.monthlyAmount || 0) || null) :
        form.campaignType === 'placement' ? ((parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)) || null) :
        null,
      payout_frequency: form.campaignType === 'ambassadeur' ? 'monthly' : null,
      payout_duration_months: form.campaignType === 'ambassadeur' ? (parseInt(form.collaborationDuration) || null) : null,
      campaign_type: form.campaignType || null,
      payout_amount:
        form.campaignType === 'ambassadeur' ? (parseFloat(form.monthlyAmount || 0) || null) :
        form.campaignType === 'placement' ? ((parseFloat(form.amountPerContent || 0) * parseFloat(form.numberOfContents || 0)) || null) :
        null,
      payout_frequency: form.campaignType === 'ambassadeur' ? 'monthly' : null,
      payout_duration_months: form.campaignType === 'ambassadeur' ? (parseInt(form.collaborationDuration) || null) : null,
      start_date: form.startDate || null,
      end_date: form.indefiniteDuration ? null : (form.endDate || null),
      application_deadline: form.submissionDeadline || null,
      content_types: form.contentTypes.length > 0 ? [...new Set(form.contentTypes.map(k => k.split(':')[0]))] : null,
      target_niches: form.categories.length > 0 ? form.categories : null,
      goals: form.objectives.length > 0 ? form.objectives : null,
      status: 'draft',
      is_public: true,
    }).select().single()

    if (error) { console.log('ERREUR DETAILS:', error); toast.error("Erreur: " + error.message); setSaving(false); return }
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🚀 Campagne créée avec succès !</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <p className="text-lg text-gray-700 mb-2">Votre campagne <span className="font-bold text-green-700">"{createdName}"</span> a été créée</p>
            <p className="text-gray-600">Elle est en mode brouillon. Activez-la pour recevoir des candidatures.</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setShowSuccess(false); setForm(EMPTY_FORM); setStep(0) }}>Créer une autre</Button>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Créer une nouvelle campagne</h2>
          <Badge variant="outline" className="text-sm px-3 py-1">Étape {step + 1} sur {STEPS.length}</Badge>
        </div>
        <Progress value={(step / (STEPS.length - 1)) * 100} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 font-medium">{STEPS[step]}</p>
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">Quelle taille d'audience recherchez-vous ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AUDIENCE_SIZES.map(size => (
                <Card key={size} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.audienceSize.includes(size) ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`} onClick={() => toggle('audienceSize', size)}>
                  <div className="flex items-center space-x-4">
                    <Checkbox checked={form.audienceSize.includes(size)} onCheckedChange={() => toggle('audienceSize', size)} className="w-6 h-6" />
                    <label className="text-lg font-medium cursor-pointer flex-1">{size}</label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">Dans quelles catégories opérez-vous ?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {CATEGORIES.map(cat => (
                <Card key={cat} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.categories.includes(cat) ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`} onClick={() => toggle('categories', cat)}>
                  <div className="flex items-center space-x-4">
                    <Checkbox checked={form.categories.includes(cat)} onCheckedChange={() => toggle('categories', cat)} className="w-6 h-6" />
                    <label className="text-lg font-medium cursor-pointer flex-1">{cat}</label>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                  <Card key={type.value} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.campaignType === type.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`} onClick={() => update('campaignType', type.value)}>
                    <div className="flex items-start space-x-4">
                      <Checkbox checked={form.campaignType === type.value} onCheckedChange={() => update('campaignType', type.value)} className="mt-1 w-6 h-6" />
                      <div className="flex-1">
                        <label className="text-lg font-bold cursor-pointer block mb-2">{type.label}</label>
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
                  <Card key={obj} className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${form.objectives.includes(obj) ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`} onClick={() => toggle('objectives', obj)}>
                    <div className="flex items-center space-x-4">
                      <Checkbox checked={form.objectives.includes(obj)} onCheckedChange={() => toggle('objectives', obj)} className="w-6 h-6" />
                      <label className="text-lg font-medium cursor-pointer flex-1">{obj}</label>
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

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Planification temporelle</h3>
            <div className="flex items-center gap-3 mb-6">
              <Checkbox checked={form.indefiniteDuration} onCheckedChange={v => { update('indefiniteDuration', v); if (v) update('endDate', '') }} />
              <label className="text-base font-semibold cursor-pointer">Durée indéterminée</label>
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

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Budget et rémunération</h3>
            {form.campaignType === "affiliation" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"><p className="text-sm font-medium text-blue-900">🧩 Affiliation - Rémunération à la performance</p></div>
                <div>
                  <label className="block text-sm font-semibold mb-3">Type d'accès *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{ value: "open", label: "🌍 Ouverte à tous", desc: "Tous les créateurs peuvent rejoindre" }, { value: "invite", label: "🔗 Sur invitation", desc: "Accès via lien d'invitation uniquement" }, { value: "targeted", label: "🎯 Ciblée", desc: "Visible si le profil matche avec les critères IA" }].map(opt => (
                      <Card key={opt.value} className={`p-4 cursor-pointer border-2 transition-all ${form.affiliationAccess === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onClick={() => update('affiliationAccess', opt.value)}>
                        <div className="flex items-start gap-3">
                          <Checkbox checked={form.affiliationAccess === opt.value} onCheckedChange={() => update('affiliationAccess', opt.value)} className="mt-1" />
                          <div><p className="font-semibold text-base">{opt.label}</p><p className="text-sm text-muted-foreground mt-1">{opt.desc}</p></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-2">Taux de commission (%) *</label><Input type="number" placeholder="15" value={form.commissionRate} onChange={e => update('commissionRate', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Objectif de vente (€) *</label><Input type="number" placeholder="10000" value={form.salesTarget} onChange={e => update('salesTarget', e.target.value)} /></div>
                </div>
                <div><label className="block text-sm font-semibold mb-2">Bonus palier (optionnel)</label><Input placeholder="Ex: +5% au-delà de 10 000€" value={form.bonusTier} onChange={e => update('bonusTier', e.target.value)} /></div>
              </div>
            )}
            {form.campaignType === "placement" && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200"><p className="text-sm font-medium text-purple-900">🎁 Placement de produit - Rémunération fixe par contenu</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-2">Montant par contenu (€) *</label><Input type="number" placeholder="300" value={form.amountPerContent} onChange={e => update('amountPerContent', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Nombre de contenus *</label><Input type="number" placeholder="5" value={form.numberOfContents} onChange={e => update('numberOfContents', e.target.value)} /></div>
                </div>
                {form.amountPerContent && form.numberOfContents && <Card className="p-4 bg-green-50 border-green-200"><p className="text-sm font-medium text-green-900">💰 Budget total: {(parseFloat(form.amountPerContent) * parseFloat(form.numberOfContents)).toLocaleString()}€</p></Card>}
              </div>
            )}
            {form.campaignType === "ambassadeur" && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200"><p className="text-sm font-medium text-green-900">🤝 Ambassadeur - Rémunération mensuelle</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-2">Montant mensuel (€) *</label><Input type="number" placeholder="500" value={form.monthlyAmount} onChange={e => update('monthlyAmount', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Durée (mois) *</label><Input type="number" placeholder="6" value={form.collaborationDuration} onChange={e => update('collaborationDuration', e.target.value)} /></div>
                </div>
                <div><label className="block text-sm font-semibold mb-2">Avantages en nature (optionnel)</label><Textarea placeholder="Produits offerts, codes promo..." value={form.benefitsInKind} onChange={e => update('benefitsInKind', e.target.value)} rows={3} /></div>
                {form.monthlyAmount && form.collaborationDuration && <Card className="p-4 bg-blue-50 border-blue-200"><p className="text-sm font-medium text-blue-900">💰 Budget total: {(parseFloat(form.monthlyAmount) * parseFloat(form.collaborationDuration)).toLocaleString()}€</p></Card>}
              </div>
            )}
            {form.campaignType === "notoriete" && (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200"><p className="text-sm font-medium text-orange-900">🚀 Campagne de notoriété - Budget global</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-2">Budget total (€) *</label><Input type="number" placeholder="2000" value={form.totalBudget} onChange={e => update('totalBudget', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Objectif de vues *</label><Input type="number" placeholder="100000" value={form.viewsTarget} onChange={e => update('viewsTarget', e.target.value)} /></div>
                </div>
                <div><label className="block text-sm font-semibold mb-2">Bonus d'engagement (%) (optionnel)</label><Input type="number" placeholder="10" value={form.engagementBonus} onChange={e => update('engagementBonus', e.target.value)} /></div>
              </div>
            )}
            {!form.campaignType && <div className="text-center py-8 text-muted-foreground">Veuillez sélectionner un type de campagne à l'étape précédente</div>}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contenus attendus</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Types de contenu souhaités *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CONTENT_TYPES.map((type, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox id={`ct-${i}`} checked={form.contentTypes.includes(type.value + ':' + type.label)}
                      onCheckedChange={() => {
                        const key = type.value + ':' + type.label
                        setForm(p => ({ ...p, contentTypes: p.contentTypes.includes(key) ? p.contentTypes.filter(k => k !== key) : [...p.contentTypes, key] }))
                      }} />
                    <label htmlFor={`ct-${i}`} className="text-sm cursor-pointer">{type.label}</label>
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
                  <div><span className="font-medium">Types:</span> {form.contentTypes.map(k => k.split(':')[1]).join(", ")}</div>
                  <div><span className="font-medium">Quantité:</span> {form.contentQuantity}</div>
                  {form.constraints && <div><span className="font-medium">Contraintes:</span> {form.constraints}</div>}
                </div>
              </Card>
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Brain className="w-4 h-4 text-primary" /></div>
                  <div>
                    <h4 className="font-medium text-primary">Recommandations IA</h4>
                    <p className="text-sm text-muted-foreground mt-1">Basé sur vos critères, nous estimons un ROI de 340% avec un taux d'engagement de 4.2%. Nous recommandons 12-15 influenceurs.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0} className="flex items-center gap-2">
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

  const handleAccept = async (appId) => {
    await supabase.from('applications').update({ status: 'accepted' }).eq('id', appId)
    toast.success("Candidature acceptée !"); onUpdate()
  }
  const handleReject = async (appId) => {
    await supabase.from('applications').update({ status: 'rejected' }).eq('id', appId)
    toast.info("Candidature refusée"); onUpdate()
  }

  const filteredCampaigns = campaigns.filter(c => filter === 'all' || c.id === filter)

  const totalPending = campaigns.reduce((sum, c) => sum + (c.applications || []).filter(a => a.status === 'pending').length, 0)
  const totalJuridique = campaigns.reduce((sum, c) => sum + (c.applications || []).filter(a => a.status === 'accepted').length, 0)

  return (
    <div className="space-y-4">
      {/* Filtre campagne */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="max-w-sm border-2 border-primary/30">
          <SelectValue placeholder="Toutes les campagnes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les campagnes</SelectItem>
          {campaigns.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
        </SelectContent>
      </Select>

      {campaigns.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <Clock className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold mb-2">Aucune campagne active</h3>
          <p className="text-muted-foreground">Créez et activez une campagne pour recevoir des candidatures</p>
        </Card>
      ) : (
        <Tabs value={collabTab} onValueChange={setCollabTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="candidatures" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <Users className="w-4 h-4" />Candidatures
              {totalPending > 0 && <Badge className="ml-1 bg-yellow-500 text-white text-xs px-1.5">{totalPending}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="juridique" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <FileText className="w-4 h-4" />Juridique
              {totalJuridique > 0 && <Badge className="ml-1 bg-blue-500 text-white text-xs px-1.5">{totalJuridique}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="escrow" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <CircleDollarSign className="w-4 h-4" />Paiements & Sécurisation
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <Link2 className="w-4 h-4" />Invitations
            </TabsTrigger>
          </TabsList>

          {/* CANDIDATURES */}
          <TabsContent value="candidatures" className="space-y-6">
            {filteredCampaigns.map(campaign => {
              const apps = campaign.applications || []
              const pending = apps.filter(a => a.status === 'pending')
              const accepted = apps.filter(a => a.status === 'accepted')
              const rejected = apps.filter(a => a.status === 'rejected')
              return (
                <Card key={campaign.id} className="overflow-hidden border border-border/50">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <Badge variant="outline" className="text-xs">{campaign.campaignType || 'Campagne'}</Badge>
                    </div>
                    <span className="font-bold text-lg">Budget {parseFloat(campaign.budget_total || 0).toLocaleString()}€</span>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[{ label: 'Total', value: apps.length, color: 'text-foreground' }, { label: 'En attente', value: pending.length, color: 'text-yellow-600' }, { label: 'Acceptées', value: accepted.length, color: 'text-green-600' }, { label: 'Refusées', value: rejected.length, color: 'text-red-600' }].map(({ label, value, color }) => (
                        <Card key={label}><CardContent className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
                      ))}
                    </div>
                    {apps.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed rounded-xl">
                        <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Aucune candidature pour l'instant</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {apps.map(app => (
                          <div key={app.id} className={`p-4 rounded-xl border-2 transition-all ${app.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' : app.status === 'accepted' ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30 opacity-60'}`}>
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                                {(app.influencer_id || 'IN').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold">Influenceur #{app.influencer_id?.slice(0, 8)}</h4>
                                    <p className="text-xs text-muted-foreground">Postulé le {new Date(app.applied_at).toLocaleDateString('fr-FR')}</p>
                                  </div>
                                  <Badge className={app.status === 'pending' ? 'bg-yellow-500 text-white' : app.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                    {app.status === 'pending' ? 'En attente' : app.status === 'accepted' ? '✓ Acceptée' : '✗ Refusée'}
                                  </Badge>
                                </div>
                                {app.cover_letter && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.cover_letter}</p>}
                                {app.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAccept(app.id)}>
                                      <CheckCircle className="h-4 w-4 mr-1" />Accepter la candidature
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleReject(app.id)}>
                                      <X className="h-4 w-4 mr-1" />Refuser
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => toast.info("Profil complet — disponible prochainement")}>
                                      <Eye className="h-4 w-4 mr-1" />Voir le profil complet
                                    </Button>
                                  </div>
                                )}
                                {app.status === 'accepted' && (
                                  <Button size="sm" variant="outline" onClick={() => toast.info("Profil complet — disponible prochainement")}>
                                    <Eye className="h-4 w-4 mr-1" />Voir le profil complet
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
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
            {filteredCampaigns.map(campaign => {
              const accepted = (campaign.applications || []).filter(a => a.status === 'accepted')
              if (accepted.length === 0) return null
              return (
                <Card key={campaign.id} className="overflow-hidden border border-border/50">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">🎁 {campaign.campaignType || 'Campagne'}</Badge>
                    </div>
                    <span className="font-bold">Budget {parseFloat(campaign.budget_total || 0).toLocaleString()}€</span>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[{ label: 'En attente', value: accepted.length, color: 'text-yellow-600', icon: Clock }, { label: 'Signés influenceur', value: 0, color: 'text-blue-600', icon: FileText }, { label: 'Complets', value: 0, color: 'text-green-600', icon: CheckCircle }, { label: 'Refusés', value: 0, color: 'text-red-600', icon: X }].map(({ label, value, color, icon: Icon }) => (
                        <Card key={label}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div><Icon className={`h-6 w-6 ${color}`} /></CardContent></Card>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="text-left p-3 text-muted-foreground">Créateur</th><th className="text-left p-3 text-muted-foreground">Montant</th><th className="text-left p-3 text-muted-foreground">Livrables</th><th className="text-left p-3 text-muted-foreground">Date</th><th className="text-left p-3 text-muted-foreground">Statut</th><th className="text-left p-3 text-muted-foreground">Actions</th></tr></thead>
                        <tbody>
                          {accepted.map(app => (
                            <tr key={app.id} className="border-b hover:bg-muted/30">
                              <td className="p-3 font-medium">#{app.influencer_id?.slice(0, 8)}</td>
                              <td className="p-3">-</td>
                              <td className="p-3 text-muted-foreground">En attente d'envoi</td>
                              <td className="p-3 text-muted-foreground">{new Date(app.applied_at).toLocaleDateString('fr-FR')}</td>
                              <td className="p-3"><Badge className="bg-gray-500 text-white"><Clock className="w-3 h-3 mr-1" />Contrat à envoyer</Badge></td>
                              <td className="p-3">
                                <Button size="sm" className="bg-primary" onClick={() => toast.info("Envoi de contrat — disponible prochainement")}>
                                  <FileText className="h-4 w-4 mr-2" />Envoyer un contrat
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )
            }).filter(Boolean)}
            {filteredCampaigns.every(c => (c.applications || []).filter(a => a.status === 'accepted').length === 0) && (
              <Card className="p-12 text-center border-2 border-dashed">
                <FileText className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold mb-2">Aucune candidature acceptée</h3>
                <p className="text-muted-foreground">Acceptez des candidatures pour pouvoir gérer les contrats</p>
              </Card>
            )}
          </TabsContent>

          {/* PAIEMENTS */}
          <TabsContent value="escrow" className="space-y-6">
            {filteredCampaigns.map(campaign => {
              const accepted = (campaign.applications || []).filter(a => a.status === 'accepted')
              if (accepted.length === 0) return null
              const isAffiliation = campaign.campaignType === 'affiliation'
              return (
                <Card key={campaign.id} className="overflow-hidden border border-border/50">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">🧩 {campaign.campaignType || 'Campagne'}</Badge>
                    </div>
                    <span className="font-bold">Budget {parseFloat(campaign.budget_total || 0).toLocaleString()}€</span>
                  </div>
                  <CardContent className="pt-4">
                    {accepted.length > 0 && (
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-100 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{isAffiliation ? 'Activer les commissions' : 'Activer et sécuriser les fonds'}</h3>
                          <p className="text-sm text-muted-foreground">{accepted.length} {isAffiliation ? 'affilié' : 'escrow'}{accepted.length > 1 ? 's' : ''} en attente d'activation</p>
                        </div>
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => toast.info("Activation — disponible prochainement")}>
                          <Lock className="w-4 h-4 mr-2" />{isAffiliation ? 'Activer les commissions' : 'Activer et bloquer les fonds'}
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[{ label: 'Non activés', value: accepted.length, icon: Unlock, color: 'text-gray-600' }, { label: isAffiliation ? 'Commissions activées' : 'Fonds bloqués', value: isAffiliation ? '0 affilié' : '0€', icon: Lock, color: 'text-orange-600' }, { label: isAffiliation ? 'Commissions versées' : 'Fonds libérés', value: isAffiliation ? '0 affilié' : '0€', icon: CheckCircle, color: 'text-green-600' }, { label: isAffiliation ? 'Affiliés actifs' : 'Escrows actifs', value: 0, icon: CircleDollarSign, color: 'text-blue-600' }].map(({ label, value, icon: Icon, color }) => (
                        <Card key={label}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div><Icon className={`h-8 w-8 ${color}`} /></CardContent></Card>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="text-left p-3 text-muted-foreground">Créateur</th><th className="text-left p-3 text-muted-foreground">Type de contrat</th><th className="text-left p-3 text-muted-foreground">{isAffiliation ? 'Commission' : 'Montant total'}</th><th className="text-left p-3 text-muted-foreground">Libéré</th><th className="text-left p-3 text-muted-foreground">Statut</th><th className="text-left p-3 text-muted-foreground">Actions</th></tr></thead>
                        <tbody>
                          {accepted.map(app => (
                            <tr key={app.id} className="border-b hover:bg-muted/30">
                              <td className="p-3 font-medium">#{app.influencer_id?.slice(0, 8)}</td>
                              <td className="p-3"><Badge variant="outline">{isAffiliation ? '🧩 Affiliation' : '🎁 Placement'}</Badge></td>
                              <td className="p-3">{isAffiliation ? '-' : '-'}</td>
                              <td className="p-3 text-muted-foreground">{isAffiliation ? '-' : '0€'}</td>
                              <td className="p-3"><Badge variant="outline" className="bg-gray-100"><Unlock className="w-3 h-3 mr-1" />Non activé</Badge></td>
                              <td className="p-3"><Button size="sm" variant="outline" onClick={() => toast.info("Voir dans Gestion Financière")}><Eye className="w-4 h-4 mr-2" />Voir dans Gestion Financière</Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )
            }).filter(Boolean)}
            {filteredCampaigns.every(c => (c.applications || []).filter(a => a.status === 'accepted').length === 0) && (
              <Card className="p-12 text-center border-2 border-dashed">
                <Lock className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold mb-2">Aucun escrow disponible</h3>
                <p className="text-muted-foreground">Les escrows seront disponibles une fois les contrats signés</p>
              </Card>
            )}
          </TabsContent>

          {/* INVITATIONS */}
          <TabsContent value="invitations" className="space-y-6">
            {filteredCampaigns.map(campaign => {
              const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campagne/join/${campaign.id}`
              const apps = campaign.applications || []
              return (
                <Card key={campaign.id} className="overflow-hidden border border-border/50">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">🧩 {campaign.campaignType || 'Campagne'}</Badge>
                    </div>
                    <span className="font-bold">Budget {parseFloat(campaign.budget_total || 0).toLocaleString()}€</span>
                  </div>
                  <CardContent className="pt-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><Link2 className="h-5 w-5" />Lien d'invitation</CardTitle>
                        <p className="text-sm text-muted-foreground">Partagez ce lien pour inviter des créateurs à postuler à votre campagne</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-4 py-3 bg-muted rounded-md text-sm font-mono break-all">{inviteUrl}</div>
                          <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(inviteUrl); toast.success("Lien copié !") }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={() => toast.info("QR Code — disponible prochainement")}>Afficher le QR Code</Button>
                          <Button variant="outline" className="flex-1" onClick={() => toast.info("Nouveau lien généré")}><RefreshCw className="h-4 w-4 mr-2" />Régénérer le lien</Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-5 w-5" />Statistiques du lien</CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2"><div className="flex items-center gap-2 text-muted-foreground"><Eye className="h-4 w-4" /><span className="text-sm">Vues</span></div><div className="text-3xl font-bold">0</div></div>
                          <div className="space-y-2"><div className="flex items-center gap-2 text-muted-foreground"><UserPlus className="h-4 w-4" /><span className="text-sm">Candidatures</span></div><div className="text-3xl font-bold">{apps.length}</div></div>
                          <div className="space-y-2"><div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /><span className="text-sm">Taux de conversion</span></div><div className="text-3xl font-bold">0%</div></div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// ─── ONGLET SUIVIS DES OPÉRATIONS ─────────────────────────────────────────────
function SuivisTab({ campaigns }) {
  const [selected, setSelected] = useState("all")
  const campaign = campaigns.find(c => c.id === selected)

  const pipeline = [
    { label: "Accepté", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Juridique", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Paiement", icon: CircleDollarSign, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Contenu", icon: Play, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Validé", icon: Star, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Terminé", icon: Archive, color: "text-gray-600", bg: "bg-gray-100" },
  ]

  return (
    <div className="space-y-6">
      {/* Cockpit */}
      <Card className="border border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cockpit de pilotage</h2>
              <p className="text-muted-foreground">Sélectionnez une campagne pour accéder au tableau de bord complet</p>
            </div>
          </div>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full bg-background h-12 text-base">
              <SelectValue placeholder="📊 Sélectionner une campagne à piloter" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map(c => (
                <SelectItem key={c.id} value={c.id} className="text-base py-3">
                  {c.title} • {parseFloat(c.budget_total || 0).toLocaleString()}€
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {campaign ? (
        <div className="space-y-6">
          {/* Pipeline */}
          <Card className="border border-purple-100 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Rocket className="w-5 h-5" />Pipeline de la campagne</h3>
              <div className="flex items-center justify-between gap-2">
                {pipeline.map((step, idx) => (
                  <div key={step.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-full ${step.bg} flex items-center justify-center mb-2`}>
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <span className="text-xs font-medium text-center">{step.label}</span>
                    </div>
                    {idx < pipeline.length - 1 && <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sous-onglets */}
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-7 h-auto bg-muted/50 p-1 rounded-xl">
              {["overview", "creators", "contracts", "payments", "content", "performance", "settings"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="py-2 text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                  {tab === "overview" ? "Vue d'ensemble" : tab === "creators" ? "Créateurs" : tab === "contracts" ? "Contrats" : tab === "payments" ? "Paiements" : tab === "content" ? "Contenus" : tab === "performance" ? "Performance" : "Paramètres"}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[{ label: 'Créateurs actifs', value: 0, icon: Users, color: 'text-primary' }, { label: 'Contenus validés', value: 0, icon: CheckCircle, color: 'text-green-600' }, { label: 'En attente', value: (campaign.applications || []).filter(a => a.status === 'pending').length, icon: AlertTriangle, color: 'text-orange-600' }, { label: 'Budget', value: `${parseFloat(campaign.budget_total || 0).toLocaleString()}€`, icon: Target, color: 'text-blue-600' }].map(({ label, value, icon: Icon, color }) => (
                  <Card key={label}><CardContent className="p-4 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div><Icon className={`h-8 w-8 ${color}`} /></CardContent></Card>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle>Informations de la campagne</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground mb-1">Titre</p><p className="font-semibold">{campaign.title}</p></div>
                  <div><p className="text-sm text-muted-foreground mb-1">Statut</p><Badge className={campaign.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>{campaign.status}</Badge></div>
                  <div><p className="text-sm text-muted-foreground mb-1">Début</p><p>{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('fr-FR') : 'Non défini'}</p></div>
                  <div><p className="text-sm text-muted-foreground mb-1">Fin</p><p>{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('fr-FR') : 'Indéterminée'}</p></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="creators" className="mt-6">
              <Card className="p-12 text-center border-2 border-dashed">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Aucun créateur actif</h3>
                <p className="text-muted-foreground">Les créateurs apparaîtront ici une fois acceptés et les contrats signés</p>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Gestion des contrats</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">Aucun contrat en cours pour cette campagne</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[{ label: 'Budget total', value: `${parseFloat(campaign.budget_total || 0).toLocaleString()}€`, color: 'text-blue-600' }, { label: 'Montant versé', value: '0€', color: 'text-green-600' }, { label: 'À venir', value: `${parseFloat(campaign.budget_total || 0).toLocaleString()}€`, color: 'text-orange-600' }, { label: 'Paiements actifs', value: 0, color: 'text-purple-600' }].map(({ label, value, color }) => (
                  <Card key={label}><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-2">{label}</p><p className={`text-3xl font-bold ${color}`}>{value}</p></CardContent></Card>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-600" />Paiements à venir</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-center py-8">Aucun paiement planifié</p></CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardHeader><CardTitle className="flex items-center gap-2 text-orange-900"><Clock className="w-5 h-5" />Contenus en attente de validation<Badge className="ml-2 bg-orange-500">0</Badge></CardTitle></CardHeader>
                <CardContent className="text-center py-8"><Clock className="w-12 h-12 text-orange-300 mx-auto mb-3" /><p className="text-sm text-muted-foreground">Aucun contenu en attente</p></CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[{ label: 'Performance globale', value: '0%', badge: '+0%', color: 'text-green-700', bg: 'from-green-50 to-emerald-50', icon: TrendingUp }, { label: 'Portée totale', value: '0', badge: 'Live', color: 'text-blue-700', bg: 'from-blue-50 to-indigo-50', icon: Eye }, { label: 'Engagement', value: '0%', badge: 'Top', color: 'text-purple-700', bg: 'from-purple-50 to-pink-50', icon: Heart }].map(({ label, value, badge, color, bg, icon: Icon }) => (
                  <Card key={label} className={`bg-gradient-to-br ${bg}`}><CardContent className="p-6"><div className="flex items-center justify-between mb-2"><Icon className={`h-8 w-8 ${color}`} /><Badge className="bg-green-600">{badge}</Badge></div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-3xl font-bold ${color}`}>{value}</p></CardContent></Card>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5" />IA Insights</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg"><p className="text-sm font-medium text-green-900">✅ Campagne en attente d'activation</p><p className="text-xs text-green-700 mt-1">Activez votre campagne pour commencer à recevoir des données de performance</p></div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg"><p className="text-sm font-medium text-blue-900">💡 Opportunité d'optimisation</p><p className="text-xs text-blue-700 mt-1">Augmentez le budget TikTok pour maximiser le ROI (+18% prévu)</p></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
                <CardHeader><CardTitle className="text-center text-2xl">Gestion de la campagne</CardTitle></CardHeader>
                <CardContent className="flex justify-center p-12">
                  <Button variant="destructive" className="h-32 px-16 text-xl flex-col gap-4"
                    onClick={() => { if (confirm(`Clôturer "${campaign.title}" ?`)) toast.success("Campagne clôturée") }}>
                    <Archive className="w-10 h-10" />
                    <div className="flex flex-col items-center"><span className="text-xl font-bold">Clôturer la campagne</span><span className="text-xs opacity-90 mt-1">Action définitive et irréversible</span></div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="p-12 text-center border-2 border-dashed">
          <BarChart3 className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold mb-2">Sélectionnez une campagne</h3>
          <p className="text-muted-foreground max-w-md mx-auto">Choisissez une campagne ci-dessus pour accéder au cockpit de pilotage complet</p>
        </Card>
      )}
    </div>
  )
}

// ─── ONGLET CRÉATEURS UGC ─────────────────────────────────────────────────────
function CreateursUGCTab() {
  const [ugcTab, setUgcTab] = useState("feed")
  const [aiForm, setAiForm] = useState({ audience: "", contentType: "", values: "", analysisType: "matching" })
  const [preselectioned, setPreselectioned] = useState([])

  const ugcStats = [
    { label: "Créateurs Actifs", value: "1,247", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Contenus ce mois", value: "12,341", icon: Play, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Engagement Moyen", value: "7.2%", icon: Heart, color: "text-green-600", bg: "bg-green-50" },
    { label: "ROI Moyen", value: "342%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  const mockCreators = [
    { id: "1", name: "Marie Dubois", handle: "@mariedubois", avatar: "MD", category: "Beauté", followers: "125K", engagement: "8.3%", views: "890K", likes: "72K" },
    { id: "2", name: "Sophie Chen", handle: "@sophiechen", avatar: "SC", category: "Lifestyle", followers: "85K", engagement: "5.2%", views: "450K", likes: "32K" },
    { id: "3", name: "Léa Martin", handle: "@leamartin", avatar: "LM", category: "Fitness", followers: "180K", engagement: "9.1%", views: "1.2M", likes: "108K" },
    { id: "4", name: "Thomas Legrand", handle: "@thomaslegrand", avatar: "TL", category: "Tech", followers: "320K", engagement: "6.4%", views: "2.1M", likes: "134K" },
    { id: "5", name: "Emma Rodriguez", handle: "@emmarodriguez", avatar: "ER", category: "Mode", followers: "240K", engagement: "7.8%", views: "1.8M", likes: "140K" },
    { id: "6", name: "Julie Fontaine", handle: "@juliefontaine", avatar: "JF", category: "Food", followers: "95K", engagement: "11.2%", views: "670K", likes: "75K" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {ugcStats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className={`${bg} border-0`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div>
              <Icon className={`h-8 w-8 ${color} opacity-60`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sous-onglets */}
      <Tabs value={ugcTab} onValueChange={setUgcTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-auto">
          <TabsTrigger value="feed" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow flex items-center gap-2">
            <Eye className="w-4 h-4" />Feed UGC
          </TabsTrigger>
          <TabsTrigger value="analyse" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow flex items-center gap-2">
            <Brain className="w-4 h-4" />Analyse IA
          </TabsTrigger>
          <TabsTrigger value="preselection" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow flex items-center gap-2">
            <Bookmark className="w-4 h-4" />Présélection
          </TabsTrigger>
        </TabsList>

        {/* FEED UGC */}
        <TabsContent value="feed" className="mt-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher des créateurs..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="Plateforme" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select defaultValue="engagement">
              <SelectTrigger className="w-44"><SelectValue placeholder="Trier par" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="followers">Abonnés</SelectItem>
                <SelectItem value="views">Vues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCreators.map(creator => (
              <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-40 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">{creator.avatar}</div>
                  <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0">{creator.category}</Badge>
                  <Button size="icon" className="absolute top-2 left-2 h-8 w-8 bg-white/20 hover:bg-white/40 border-0" onClick={() => { setPreselectioned(p => p.includes(creator.id) ? p.filter(id => id !== creator.id) : [...p, creator.id]); toast.success(preselectioned.includes(creator.id) ? "Retiré de la présélection" : "Ajouté à la présélection") }}>
                    <Bookmark className={`h-4 w-4 text-white ${preselectioned.includes(creator.id) ? 'fill-white' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">{creator.handle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3" />{creator.followers} abonnés</div>
                    <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{creator.engagement} engagement</div>
                    <div className="flex items-center gap-1"><Eye className="h-3 w-3" />{creator.views} vues</div>
                    <div className="flex items-center gap-1"><Heart className="h-3 w-3" />{creator.likes} likes</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info("Profil complet — disponible prochainement")}><Eye className="h-3 w-3 mr-1" />Profil</Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={() => toast.info("Contact — disponible prochainement")}>Contacter</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => toast.info("Chargement — disponible prochainement")}>Charger plus de créateurs</Button>
          </div>
        </TabsContent>

        {/* ANALYSE IA */}
        <TabsContent value="analyse" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-600" />Analyse IA</CardTitle>
              <p className="text-sm text-muted-foreground">Décrivez ce que vous recherchez et laissez notre IA trouver les créateurs UGC parfaits</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Décrivez vos besoins</label>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Audience cible</label>
                <Input placeholder="Ex: Femmes 25-35 ans, passionnées de mode, urbaines..." value={aiForm.audience} onChange={e => setAiForm(p => ({...p, audience: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Type de contenu souhaité</label>
                <Select value={aiForm.contentType} onValueChange={v => setAiForm(p => ({...p, contentType: v}))}>
                  <SelectTrigger><SelectValue placeholder="Choisir un type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Post Instagram</SelectItem>
                    <SelectItem value="reel">Reel / TikTok</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="video">Vidéo YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Valeurs de votre marque</label>
                <Textarea placeholder="Décrivez les valeurs importantes pour votre marque..." value={aiForm.values} onChange={e => setAiForm(p => ({...p, values: e.target.value}))} rows={4} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Type d'analyse</label>
                <Select value={aiForm.analysisType} onValueChange={v => setAiForm(p => ({...p, analysisType: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matching">Matching Parfait</SelectItem>
                    <SelectItem value="predictive">Analyse Prédictive</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center border-2 border-blue-200 bg-blue-50/50">
                  <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-900">Analyse Prédictive</p>
                  <p className="text-xs text-blue-700">ROI et performance estimés</p>
                </Card>
                <Card className="p-4 text-center border-2 border-purple-200 bg-purple-50/50">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-900">Matching Intelligent</p>
                  <p className="text-xs text-purple-700">Créateurs alignés avec vos besoins</p>
                </Card>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white h-12 text-base" onClick={() => toast.info("Analyse IA — disponible prochainement")}>
                <Brain className="w-5 h-5 mr-2" />Lancer l'Analyse IA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRÉSÉLECTION */}
        <TabsContent value="preselection" className="mt-6">
          {preselectioned.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed">
              <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Aucun créateur présélectionné</h3>
              <p className="text-muted-foreground mb-4">Explorez les créateurs et ajoutez vos favoris à votre présélection</p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={() => setUgcTab("feed")}>Découvrir des créateurs</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{preselectioned.length} créateur(s) présélectionné(s)</h3>
                <Button variant="outline" onClick={() => setPreselectioned([])}>Vider la présélection</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCreators.filter(c => preselectioned.includes(c.id)).map(creator => (
                  <Card key={creator.id} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center font-bold text-white">{creator.avatar}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{creator.name}</p>
                      <p className="text-sm text-muted-foreground">{creator.handle} • {creator.followers}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => setPreselectioned(p => p.filter(id => id !== creator.id))}><X className="h-4 w-4" /></Button>
                  </Card>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={() => toast.info("Invitation groupée — disponible prochainement")}>
                Inviter la présélection à postuler
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── SECTION PRINCIPALE ───────────────────────────────────────────────────────
export default function CampagnesSection({ user, profile }) {
  const [campaigns, setCampaigns] = useState([])
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
      supabase.from('applications').select('*').eq('brand_id', brand.id).order('applied_at', { ascending: false }),
    ])

    const camps = campRes.status === 'fulfilled' ? campRes.value.data || [] : []
    const apps = appRes.status === 'fulfilled' ? appRes.value.data || [] : []
    const campsWithApps = camps.map(c => ({ ...c, applications: apps.filter(a => a.campaign_id === c.id) }))
    setCampaigns(campsWithApps)
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Gestion des campagnes</h1>
          <Badge className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1">
            <Brain className="h-3 w-3 mr-1" />IA Activée
          </Badge>
        </div>
        <p className="text-muted-foreground">Créez et gérez vos campagnes marketing avec intelligence</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/30 rounded-xl">
          <TabsTrigger value="creer" className="flex items-center gap-2 py-3 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Sparkles className="w-4 h-4" />Créer une campagne
          </TabsTrigger>
          <TabsTrigger value="recrutement" className="flex items-center gap-2 py-3 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Clock className="w-4 h-4" />Recrutement
          </TabsTrigger>
          <TabsTrigger value="suivis" className="flex items-center gap-2 py-3 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <BarChart3 className="w-4 h-4" />Suivis des opérations
          </TabsTrigger>
          <TabsTrigger value="ugc" className="flex items-center gap-2 py-3 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Users className="w-4 h-4" />Créateurs UGC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creer" className="mt-6">
          <CreateCampaignWizard brandId={brandId} onCreated={(c) => setCampaigns(p => [{ ...c, applications: [] }, ...p])} />
        </TabsContent>

        <TabsContent value="recrutement" className="mt-6">
          <RecrutementTab campaigns={campaigns} brandId={brandId} onUpdate={fetchAll} />
        </TabsContent>

        <TabsContent value="suivis" className="mt-6">
          <SuivisTab campaigns={campaigns} />
        </TabsContent>

        <TabsContent value="ugc" className="mt-6">
          <CreateursUGCTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}