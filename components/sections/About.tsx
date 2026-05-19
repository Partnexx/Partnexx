import { Eye, Compass, Rocket, TrendingUp, Mail } from "lucide-react";

const partnexxValues = [
  {
    icon: Eye,
    title: "Transparence",
    creators: "Tu sais exactement ce que tu touches : commission affichée avant chaque transaction, aucun frais opaque.",
    brands: "Budgets, commissions et performances visibles clairement à chaque étape de la campagne.",
    color: "from-cyan-400 to-cyan-500",
  },
  {
    icon: Compass,
    title: "Opportunités",
    creators: "Du nano-créateur à la superstar, tout le monde accède aux missions. Pas de filtrage arbitraire : le talent prime.",
    brands: "Accède à des créateurs adaptés à chaque objectif, peu importe la taille de ton budget ou ta niche.",
    color: "from-violet-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "Innovation",
    creators: "Matching IA, Partnexx Score, dashboard temps réel — la tech au service de ta carrière de créateur.",
    brands: "IA de matching, automatisation et analytics pour piloter tes campagnes sans friction.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    creators: "Paiements rapides sous 7 jours et résultats valorisés. On récompense les créateurs qui performent.",
    brands: "Campagnes mesurables, ROI suivi en direct, taux de conversion trackés. Tu paies pour ce qui marche.",
    color: "from-emerald-400 to-emerald-600",
  },
];

const timeline = [
  {
    year: "2025",
    title: "L'étincelle",
    desc: "Mathias et Corentin Baudoin, frustrés par l'opacité des agences classiques et les délais de paiement à 60-90 jours infligés aux créateurs, imaginent une plateforme 100% transparente.",
    isVision: false,
  },
  {
    year: "2026",
    title: "Conception du produit",
    desc: "Avec Dylan au lead technique, l'équipe construit toute la structure : Partnexx Score, moteur de matching IA créateurs × marques, dashboard temps réel, paiements sécurisés Stripe. Aucun raccourci, aucun MVP : on lance fort.",
    isVision: false,
  },
  {
    year: "2027",
    title: "Acquisition stratégique",
    desc: "Onboarding des premières grandes marques (mode, beauté, food, tech) et signature des créateurs majeurs FR. Une grosse vague d'acquisition propulse la plateforme.",
    isVision: false,
  },
  {
    year: "2028",
    title: "Vision : leader international",
    desc: "Devenir LA référence du creator marketing sans frontières. Expansion sur les principaux marchés européens et internationaux dès le départ, avec un programme Partnexx Élite et des revenus passifs pour les créateurs les plus engagés.",
    isVision: true,
  },
];

const team = [
  { name: "Mathias Baudoin", role: "PDG", initials: "MB", color: "#00B8E6" },
  { name: "Corentin Baudoin", role: "Directeur Général", initials: "CB", color: "#8B5CF6" },
  { name: "Dylan", role: "Directeur Technique", initials: "D", color: "#FF4FD8" },
];

export default function About({ variant = "creators" }: { variant?: "creators" | "brands" }) {
  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[520px] h-[520px] -top-32 -left-40 opacity-50" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[520px] h-[520px] -bottom-32 -right-40 opacity-50" style={{ background: "#FF4FD8" }} aria-hidden />

      <div className="container relative max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">
            À propos · Notre histoire
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
            Bienvenue chez <span className="text-gradient-brand">Partnexx</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {variant === "creators"
              ? "Une plateforme pensée par des entrepreneurs, pour libérer le potentiel de chaque créateur."
              : "Une plateforme pensée pour rendre le creator marketing transparent, mesurable et performant."}
          </p>
        </div>

        {/* MISSION */}
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-border shadow-soft p-8 sm:p-12 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Notre mission</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
            {variant === "creators"
              ? "Donner aux créateurs les moyens de vivre de leur passion."
              : "Donner aux marques les moyens de scaler leur visibilité."}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {variant === "creators"
              ? "Partnexx est né d'une frustration simple : trop de créateurs talentueux attendent 60 à 90 jours pour être payés, signent des contrats opaques avec des agences qui prennent 30% de commission, et ne savent jamais vraiment quelles campagnes performent. On a décidé que ça allait changer."
              : "Le creator marketing est devenu indispensable, mais reste fragmenté, opaque et difficile à mesurer. Les marques perdent du temps à briefer, négocier, suivre, vérifier. Partnexx centralise tout : matching IA, contrats automatisés, paiements sécurisés et analytics en temps réel."}
          </p>
        </div>

        {/* VALEURS */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-3">
              Nos valeurs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Ce qui nous <span className="text-gradient-brand">guide</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {partnexxValues.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl bg-white border border-border shadow-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white mb-4 shadow-glow`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {variant === "creators" ? v.creators : v.brands}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-3">
              Notre histoire
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              D&apos;une étincelle à une <span className="text-gradient-brand">vision internationale</span>.
            </h2>
          </div>

          <ol className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-cyan-300 before:via-violet-300 before:to-pink-300">
            {timeline.map((step) => (
              <li key={step.year} className="relative">
                <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full ring-4 ring-white ${step.isVision ? "bg-gradient-brand shadow-glow" : "bg-foreground"}`} />
                <div className={`rounded-2xl p-5 sm:p-6 ${step.isVision ? "border-gradient-brand shadow-card bg-gradient-brand-soft" : "bg-white border border-border shadow-soft"}`}>
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className={`text-2xl font-bold tabular-nums ${step.isVision ? "text-gradient-brand" : "text-foreground"}`}>
                      {step.year}
                    </span>
                    <span className="text-base font-semibold text-foreground">{step.title}</span>
                    {step.isVision && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-brand text-white px-2 py-0.5 rounded-full">
                        Vision
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ÉQUIPE */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-3">
              L&apos;équipe fondatrice
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Les <span className="text-gradient-brand">visages</span> derrière Partnexx.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl bg-white border border-border shadow-soft p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-glow" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div className="text-base font-bold text-foreground">{m.name}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="rounded-3xl bg-gradient-brand p-10 sm:p-12 text-center shadow-glow">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Une question ? <span className="underline decoration-white/60 underline-offset-4">Parlons-en.</span>
          </h2>
          <p className="text-white/95 mb-6">
            On lit chaque message. Promis.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:hello@partnexx.com" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-pink-500 shadow-card hover:scale-[1.04] transition-transform">
              <Mail className="w-4 h-4" /> hello@partnexx.com
            </a>
            <a href="https://instagram.com/partnexx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/25 transition-colors">
              <span className="text-base">📸</span> @partnexx
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}