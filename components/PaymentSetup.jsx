'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Briefcase, Building2, ExternalLink, CheckCircle, AlertCircle, Loader2, Rocket, Info } from 'lucide-react'
import { toast } from 'sonner'

const LEGALPLACE_URL = 'https://www.legalplace.fr/' // TODO: remplacer par ton lien d'affilié
const SEUIL_PARTICULIER = 760 // seuil légal annuel pour le statut Particulier

const BUSINESS_TYPES = [
  {
    value: 'individual',
    icon: User,
    title: 'Particulier',
    subtitle: 'Pour démarrer',
    description: 'Idéal pour tes premiers partenariats. Limite légale : 760€/an.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    value: 'auto_entrepreneur',
    icon: Briefcase,
    title: 'Auto-entrepreneur',
    subtitle: 'Recommandé',
    description: "Le statut le plus simple et flexible. Jusqu'à 77 700€/an.",
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    recommended: true,
  },
  {
    value: 'company',
    icon: Building2,
    title: 'Société',
    subtitle: 'SASU, EURL, SARL...',
    description: 'Pour les créateurs avec une entreprise déjà établie.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
]

// Libellés du bouton "j'ai déjà mon statut" selon le type sélectionné
const ALREADY_LABELS = {
  individual: 'Continuer en Particulier',
  auto_entrepreneur: "J'ai déjà mon auto-entreprise",
  company: "J'ai déjà ma société",
}

// Libellés du bouton "je veux créer" selon le type sélectionné
const CREATE_LABELS = {
  individual: 'Je veux créer mon entreprise (LegalPlace)',
  auto_entrepreneur: 'Je veux créer mon auto-entreprise (LegalPlace)',
  company: 'Je veux créer ma société (LegalPlace)',
}

export default function PaymentSetup({ user }) {
  const [influencer, setInfluencer] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fiscalAccepted, setFiscalAccepted] = useState(false)
  const [ytdRevenue, setYtdRevenue] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    async function fetchInfluencer() {
      const { data, error } = await supabase
        .from('influencers')
        .select('id, stripe_account_id, business_type, fiscal_terms_accepted_at')
        .eq('user_id', user.id)
        .single()
      if (error) {
        console.error('Erreur fetch influencer:', error)
        setLoading(false)
        return
      }
      setInfluencer(data)
      if (data.business_type) setSelectedType(data.business_type)
      if (data.fiscal_terms_accepted_at) setFiscalAccepted(true)

      // Récupérer le cumul annuel pour la logique du seuil 760€
      const { data: revenue, error: revError } = await supabase
        .rpc('get_creator_ytd_revenue', { p_influencer_id: data.id })
      if (revError) {
        console.error('Erreur fetch ytd revenue:', revError)
      } else {
        setYtdRevenue(Number(revenue) || 0)
      }
      setLoading(false)
    }
    fetchInfluencer()
  }, [user?.id])

  const overLimit = ytdRevenue >= SEUIL_PARTICULIER
  const isParticulier = selectedType === 'individual'
  const particulierBlocked = isParticulier && overLimit

  const handleContinue = async () => {
    if (!selectedType) {
      toast.error('Choisis un statut juridique')
      return
    }
    if (!fiscalAccepted) {
      toast.error('Tu dois accepter les conditions fiscales')
      return
    }
    if (particulierBlocked) {
      toast.error('Tu as dépassé le seuil de 760€. Tu dois créer un statut pour continuer.')
      return
    }
    if (!influencer?.id) {
      toast.error('Profil créateur introuvable')
      return
    }
    setSubmitting(true)
    try {
      // Enregistrer l'acceptation des conditions fiscales (horodatée)
      await supabase
        .from('influencers')
        .update({ fiscal_terms_accepted_at: new Date().toISOString() })
        .eq('id', influencer.id)

      const res = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencerId: influencer.id,
          businessType: selectedType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      window.location.href = data.url
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Erreur lors de la configuration')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (influencer?.stripe_account_id) {
    return (
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Configuration des paiements</CardTitle>
              <CardDescription>
                Continue ou termine la configuration de tes paiements pour recevoir tes gains.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={handleContinue} disabled={submitting} className="w-full sm:w-auto">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
            Continuer la configuration
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Configurer mes paiements
        </CardTitle>
        <CardDescription>
          Pour recevoir tes gains sur ton compte bancaire, choisis ton statut juridique. La configuration prend ~5 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {BUSINESS_TYPES.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.value
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? `${type.borderColor} ${type.bgColor} shadow-sm`
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{type.title}</h4>
                    {type.recommended && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                        Recommandé
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{type.subtitle}</p>
                  <p className="text-sm text-foreground/80">{type.description}</p>
                </div>
                {isSelected && (
                  <div className={`w-5 h-5 rounded-full ${type.bgColor} border-2 ${type.borderColor} flex items-center justify-center flex-shrink-0`}>
                    <div className={`w-2 h-2 rounded-full ${type.color.replace('text-', 'bg-')}`} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Encadré fiscal DAC7 mis en valeur */}
        <div className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed">
            PARTNEXX transmet chaque année tes revenus à l'administration fiscale (obligation légale DAC7). Le statut Particulier convient pour démarrer ; dès que ton activité devient régulière (et au plus tard vers 760 €/an), un statut est obligatoire.
          </p>
        </div>

        {/* Alerte seuil dépassé (Particulier ≥ 760€) */}
        {particulierBlocked && (
          <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 leading-relaxed">
              Tu as dépassé le seuil de 760 €/an en tant que Particulier ({ytdRevenue.toLocaleString('fr-FR')} €). Pour continuer à recevoir tes gains, tu dois créer un statut (auto-entrepreneur le plus souvent). On t'accompagne ci-dessous.
            </p>
          </div>
        )}

        <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30 cursor-pointer">
          <input
            type="checkbox"
            checked={fiscalAccepted}
            onChange={(e) => setFiscalAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 flex-shrink-0 accent-primary cursor-pointer"
          />
          <span className="text-sm text-foreground/80 leading-relaxed">
            Je reconnais être seul responsable de mes obligations fiscales et sociales liées aux revenus perçus via PARTNEXX. Je comprends que PARTNEXX déclarera mes revenus à l'administration fiscale conformément à la réglementation (DAC7).
          </span>
        </label>

        {/* Boutons d'action : "j'ai déjà" (Stripe) + "je veux créer" (LegalPlace) */}
        {selectedType && (
          <div className="space-y-3">
            {/* Bouton "j'ai déjà mon statut" → Stripe. Caché si Particulier au-dessus du seuil. */}
            {!particulierBlocked && (
              <Button
                onClick={handleContinue}
                disabled={!fiscalAccepted || submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Redirection...
                  </>
                ) : (
                  <>
                    {ALREADY_LABELS[selectedType]}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}

            {/* Bouton "je veux créer" → LegalPlace. Pour les 3 statuts. */}
            <a href={LEGALPLACE_URL} target="_blank" rel="noopener noreferrer" className="block">
              <Button
                variant={particulierBlocked ? 'default' : 'outline'}
                className="w-full"
                size="lg"
              >
                <Rocket className="w-4 h-4 mr-2" />
                {CREATE_LABELS[selectedType]}
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
