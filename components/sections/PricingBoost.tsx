const boostTiers = [
  {
    plan: "Growth",
    boostLabel: "BOOST ACTIVABLE",
    sub: "Lance un Boost pour augmenter ta visibilité",
    publications: "1",
    publicationsLabel: "publication par créateur",
    creators: "5–15",
    contents: "10–40",
    impact: "👉 Idéal pour tester et augmenter ta portée",
    titleClass: "text-cyan-500",
    cardClass: "bg-white border border-border shadow-soft hover:shadow-card",
    bigBoxClass: "bg-cyan-50 border border-cyan-200",
    bigNumberClass: "text-violet-500",
    bigLabelClass: "text-muted-foreground",
    smallNumberClass: "text-violet-500",
  },
  {
    plan: "Scale",
    boostLabel: "BOOST AMPLIFIÉ",
    sub: "Active une diffusion plus large et plus régulière",
    publications: "2",
    publicationsLabel: "publications par créateur",
    creators: "15–25",
    contents: "30–50",
    impact: "👉 Génère une vraie présence dans ta niche",
    titleClass: "text-cyan-500",
    cardClass: "border-gradient-brand shadow-card",
    bigBoxClass: "bg-gradient-brand shadow-glow",
    bigNumberClass: "text-white",
    bigLabelClass: "text-white/90",
    smallNumberClass: "text-pink-500",
  },
  {
    plan: "Enterprise",
    boostLabel: "BOOST AVANCÉ",
    sub: "Déploie une stratégie de visibilité massive",
    publications: "3",
    publicationsLabel: "publications par créateur",
    creators: "30+",
    contents: "90+",
    impact: "👉 Domine ta niche et maximise ton impact",
    titleClass: "text-violet-500",
    cardClass: "bg-white border border-border shadow-soft hover:shadow-card",
    bigBoxClass: "bg-violet-50 border border-violet-200",
    bigNumberClass: "text-violet-500",
    bigLabelClass: "text-muted-foreground",
    smallNumberClass: "text-violet-500",
  },
];

export default function PricingBoost() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[480px] h-[480px] top-0 -left-32 opacity-30" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[520px] h-[520px] bottom-0 -right-32 opacity-30" style={{ background: "#FF4FD8" }} aria-hidden />

      <div className="container max-w-6xl relative">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">Notoriété Boost</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight mb-4">
            Le Notoriété Boost <span className="text-gradient-brand">selon ton plan</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-3">
            Concrètement, voici l&apos;impact que tu obtiens à chaque niveau
          </p>
          <p className="mt-3 text-sm sm:text-base font-semibold text-foreground">
            Plus de publications par créateur = <span className="text-gradient-brand">plus de répétition</span> = <span className="text-gradient-brand">plus de conversions</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {boostTiers.map((tier) => (
            <div key={tier.plan} className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${tier.cardClass}`}>
              <div className="mb-2 flex items-baseline gap-2 flex-wrap">
                <h3 className={`text-2xl font-bold ${tier.titleClass}`}>{tier.plan}</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">· {tier.boostLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">{tier.sub}</p>

              <div className={`rounded-xl text-center py-5 px-4 mb-4 ${tier.bigBoxClass}`}>
                <div className={`text-4xl font-bold mb-1 tabular-nums ${tier.bigNumberClass}`}>{tier.publications}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${tier.bigLabelClass}`}>{tier.publicationsLabel}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-xl bg-secondary/60 border border-border/70 text-center py-3 px-2">
                  <div className={`text-base font-bold mb-0.5 ${tier.smallNumberClass}`}>{tier.creators}</div>
                  <div className="text-[10px] text-muted-foreground">créateurs</div>
                </div>
                <div className="rounded-xl bg-secondary/60 border border-border/70 text-center py-3 px-2">
                  <div className={`text-base font-bold mb-0.5 ${tier.smallNumberClass}`}>{tier.contents}</div>
                  <div className="text-[10px] text-muted-foreground">contenus</div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-brand-soft border border-border/70 px-3 py-2.5">
                <p className="text-xs text-foreground leading-snug">{tier.impact}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <span className="font-bold text-foreground">Partnexx </span> déclenche son réseau d&apos;ambassadeurs pour rendre visible votre marque.
        </p>
      </div>
    </section>
  );
}