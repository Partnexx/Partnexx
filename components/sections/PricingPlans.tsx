import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0€",
    sub: "Sans engagement • Lance en 2 minutes",
    promise: "Pour tester sans risque",
    features: [
      "1 campagne gratuite",
      "Accès créateurs Bronze → Diamant",
      "18% de commission",
      "Suivi des résultats",
    ],
    cta: "Lancer gratuitement",
    highlight: false,
  },
  {
    name: "Growth",
    price: "119€",
    period: "/mois",
    sub: "ROI le plus rapide pour démarrer",
    promise: "Le plus choisi",
    features: [
      "Campagnes illimitées",
      "Matching optimisé",
      "Accès créateurs Bronze → Diamant",
      "Notoriété Boost activable",
      "11% de commission",
    ],
    cta: "Passer à Growth",
    highlight: true,
  },
  {
    name: "Scale",
    price: "299€",
    period: "/mois",
    sub: "Débloque les créateurs premium et réduis ta commission",
    promise: "Pour scaler fort",
    features: [
      "Automatisation complète",
      "Créateurs Élite, Champion & Légende débloqués",
      "Priorisation des campagnes",
      "Notoriété Boost amplifié",
      "7% de commission",
    ],
    cta: "Passer à Scale",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    sub: "Pour déployer une stratégie à grande échelle",
    promise: "Sur mesure",
    features: [
      "Accompagnement dédié",
      "Stratégie personnalisée",
      "API & intégrations",
      "5% de commission (négociable)",
      "Manager dédié",
    ],
    cta: "Nous contacter",
    highlight: false,
  },
];

export default function PricingPlans() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {plans.map((p) => {
            const cardClass = p.highlight ? "border-gradient-brand shadow-glow" : "bg-white border border-border shadow-soft hover:shadow-card";
            const titleClass = p.highlight ? "text-gradient-brand" : "text-foreground";
            const checkBg = p.highlight ? "bg-gradient-brand" : "bg-cyan-50 border border-cyan-200";
            const checkIcon = p.highlight ? "text-white" : "text-cyan-600";
            const ctaClass = p.highlight ? "bg-gradient-brand text-white shadow-glow hover:scale-[1.02]" : "bg-white border border-border text-foreground hover:bg-secondary/50";

            return (
              <div key={p.name} className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${cardClass}`}>
                {p.highlight ? (<span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-glow whitespace-nowrap"><Sparkles className="w-3 h-3" /> {p.promise}</span>) : null}

                <div className="mb-5">
                  {!p.highlight ? (<span className="inline-block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{p.promise}</span>) : null}
                  <h3 className={`text-xl font-bold mb-2 ${titleClass}`}>{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground tracking-tight">{p.price}</span>
                    {p.period ? <span className="text-sm text-muted-foreground">{p.period}</span> : null}
                  </div>
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

                <a href="#" className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${ctaClass}`}>
                  {p.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Tous les plans incluent l&apos;accès à la plateforme, le matching, et le paiement sécurisé.
        </p>
      </div>
    </section>
  );
}
