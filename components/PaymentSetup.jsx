'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Briefcase, Building2, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const BUSINESS_TYPES = [
  {
    value: 'individual',
    icon: User,
    title: 'Particulier',
    subtitle: 'Pour débuter occasionnellement',
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

export default function PaymentSetup({ user }) {
  const [influencer, setInfluencer] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fiscalAccepted, setFiscalAccepted] = useState(false)

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
      } else {
        setInfluencer(data)
        if (data.business_type) setSelectedType(data.business_type)
        if (data.fiscal_terms_accepted_at) setFiscalAccepted(true)
      }
      setLoading(false)
    }
    fetchInfluencer()
  }, [user?.id])

  const handleContinue = async () => {
    if (!selectedType) {
      toast.error('Choisis un statut juridique')
      return
    }
    if (!fiscalAccepted) {
      toast.error('Tu dois accepter les conditions fiscales')
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

        <div className="text-xs text-muted-foreground border-t pt-3">
          💡 Pas encore Auto-entrepreneur ? Tu pourras le devenir en 24h via notre partenaire LegalPlace (bientôt disponible).
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedType || !fiscalAccepted || submitting}
          className="w-full"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redirection vers Stripe...
            </>
          ) : (
            <>
              Continuer vers Stripe
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}