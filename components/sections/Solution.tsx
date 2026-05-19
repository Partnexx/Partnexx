import { Rocket, Users, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "1",
    icon: Rocket,
    title: "Lance ta campagne",
    desc: "Brief en 2 minutes. Tu décris ton produit, ton objectif, ton budget.",
  },
  {
    n: "2",
    icon: Users,
    title: "Partnexx sélectionne les créateurs",
    desc: "On matche ta marque avec les créateurs les plus performants de ta niche.",
  },
  {
    n: "3",
    icon: TrendingUp,
    title: "Tu génères ventes & visibilité",
    desc: "On suit les performances et on optimise. Tu vois les résultats en live.",
  },
];

export default function Solution() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[420px] h-[420px] -top-20 right-0 opacity-40" style={{ background: "#00B8E6" }} aria-hidden />

      <div className="container relative">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#00B8E6" }}>
            La solution
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Une seule plateforme. <span className="text-gradient-brand">Tous les résultats.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {steps.map(({ n, icon: Icon, title, desc }, i) => (
            <div key={i} className="relative group">
              <div className="relative h-full rounded-2xl bg-white border border-border p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 -left-2 w-12 h-12 rounded-2xl bg-gradient-brand text-white text-xl font-bold flex items-center justify-center shadow-glow">
                  {n}
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-5 ml-auto">
                  <Icon className="w-5 h-5" style={{ color: "#00B8E6" }} />
                </div>
                <h3 className="text-xl font-semibold text-foreground leading-snug mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 z-10" style={{ color: "#FF4FD8" }} />
              )}
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-2xl sm:text-3xl font-semibold text-foreground">
          Tu lances. <span className="text-gradient-brand">On s'occupe du reste.</span>
        </p>
      </div>
    </section>
  );
}