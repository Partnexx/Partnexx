'use client'

import { useState } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'

type BillingPeriod = 'monthly' | 'yearly'

type Plan = {
  id: 'free' | 'growth' | 'scale' | 'enterprise'
  name: string
  // Prix selon période
  priceMonthly: string
  priceYearly?: string // total annuel HT (pas affiché par mois sur la carte)
  periodLabelMonthly?: string
  periodLabelYearly?: string
  sub: string
  promise: string
  features: string[]
  cta: string
  highlight: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: '0€',
    sub: 'Sans engagement • Lance en 2 minutes',
    promise: 'Pour tester sans risque',
    features: [
      '1 campagne gratuite',
      'Accès créateurs Bronze → Diamant',
      '18% de commission',
      'Suivi des résultats',
    ],
    cta: 'Lancer gratuitement',
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    priceMonthly: '119€',
    priceYearly: '1188€',
    periodLabelMonthly: '/mois',
    periodLabelYearly: '/an',
    sub: 'ROI le plus rapide pour démarrer',
    promise: 'Le plus choisi',
    features: [
      'Campagnes illimitées',
      'Matching optimisé',
      'Accès créateurs Bronze → Diamant',
      'Notoriété Boost activable',
      '11% de commission',
    ],
    cta: 'Passer à Growth',
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    priceMonthly: '299€',
    priceYearly: '2988€',
    periodLabelMonthly: '/mois',
    periodLabelYearly: '/an',
    sub: 'Débloque les créateurs premium et réduis ta commission',
    promise: 'Pour scaler fort',
    features: [
      'Automatisation complète',
      'Créateurs Élite, Champion & Légende débloqués',
      'Priorisation des campagnes',
      'Notoriété Boost amplifié',
      '7% de commission',
    ],
    cta: 'Passer à Scale',
    highlight: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 'Sur mesure',
    sub: 'Pour déployer une stratégie à grande échelle',
    promise: 'Sur mesure',
    features: [
      'Accompagnement dédié',
      'Stratégie personnalisée',
      'API & intégrations',
      '5% de commission (négociable)',
      'Manager dédié',
    ],
    cta: 'Nous contacter',
    highlight: false,
  },
]

export default function PricingPlans() {
  const router = useRouter()
  const [period, setPeriod] = useState<BillingPeriod>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleClick = async (plan: Plan) => {
    // Enterprise → mailto
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:contact@partnexx.com?subject=Plan Enterprise PARTNEXX'
      return
    }

    // Free → onboarding
    if (plan.id === 'free') {
      router.push('/onboarding')
      return
    }

    // Growth ou Scale → vérifier si l'utilisateur est connecté
    setLoadingPlan(plan.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      // Pas connecté → onboarding avec le plan présélectionné en query
      if (!session) {
        router.push(`/onboarding?plan=${plan.id}&period=${period}`)
        return
      }

      // Connecté → on lance le Stripe Checkout direct
      const res = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: plan.id, period }),
      })
      const data = await res.json()

      // Si pas de profil marque → rediriger vers l'onboarding
      if (res.status === 404) {
        router.push(`/onboarding?plan=${plan.id}&period=${period}`)
        return
      }
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Erreur lors de la création de l\'abonnement')
      }
      window.location.href = data.url
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Erreur')
      setLoadingPlan(null)
    }
  }

  return (
    <section className="relative py-16 lg:py-24">
      <div className="container">

        {/* Toggle Mensuel / Annuel */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-white border border-border rounded-full p-1 shadow-soft">
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                period === 'monthly'
                  ? 'bg-gradient-brand text-white shadow-glow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                period === 'yearly'
                  ? 'bg-gradient-brand text-white shadow-glow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annuel
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                period === 'yearly' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
              }`}>
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {plans.map((p) => {
            const cardClass = p.highlight ? 'border-gradient-brand shadow-glow' : 'bg-white border border-border shadow-soft hover:shadow-card'
            const titleClass = p.highlight ? 'text-gradient-brand' : 'text-foreground'
            const checkBg = p.highlight ? 'bg-gradient-brand' : 'bg-cyan-50 border border-cyan-200'
            const checkIcon = p.highlight ? 'text-white' : 'text-cyan-600'
            const ctaClass = p.highlight ? 'bg-gradient-brand text-white shadow-glow hover:scale-[1.02]' : 'bg-white border border-border text-foreground hover:bg-secondary/50'

            const displayPrice = period === 'yearly' && p.priceYearly ? p.priceYearly : p.priceMonthly
            const displayPeriodLabel = period === 'yearly' && p.priceYearly ? p.periodLabelYearly : p.periodLabelMonthly

            const isLoading = loadingPlan === p.id

            return (
              <div key={p.name} className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${cardClass}`}>
                {p.highlight ? (<span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-glow whitespace-nowrap"><Sparkles className="w-3 h-3" /> {p.promise}</span>) : null}

                <div className="mb-5">
                  {!p.highlight ? (<span className="inline-block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{p.promise}</span>) : null}
                  <h3 className={`text-xl font-bold mb-2 ${titleClass}`}>{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground tracking-tight">{displayPrice}</span>
                    {displayPeriodLabel ? <span className="text-sm text-muted-foreground">{displayPeriodLabel}</span> : null}
                  </div>
                  {/* Économies si annuel */}
                  {period === 'yearly' && p.priceYearly && (
                    <p className="text-[11px] font-semibold text-green-600 mb-1">
                      Économie de 17% • 2 mois offerts
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.sub}</p>
                </div>

                <div className="h-px bg-border mb-5" />

                <ul className="space-y-3 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${checkBg}`}>
                        <Check className={`w-3 h-3 ${checkIcon}`} />
                      </div>
                      <span className="text-sm text-foreground leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleClick(p)}
                  disabled={isLoading}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${ctaClass}`}
                >
                  {isLoading ? 'Chargement...' : p.cta}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Tous les plans incluent l&apos;accès à la plateforme, le matching, et le paiement sécurisé.
          <br />
          <span className="text-xs">Prix HT • TVA 20% en sus pour les clients français • 14 jours d&apos;essai gratuit sur Growth et Scale</span>
        </p>
      </div>
    </section>
  )
}
