import { Search, TrendingDown, EyeOff } from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Tu passes du temps à chercher des créateurs",
    desc: "DM, négociations, relances… des heures perdues chaque semaine.",
  },
  {
    icon: TrendingDown,
    title: "Tes campagnes ne sont pas rentables",
    desc: "Pas de suivi, pas d'optimisation, pas de ROI clair.",
  },
  {
    icon: EyeOff,
    title: "Ta marque reste invisible",
    desc: "Pas assez de contenu, pas assez de volume, pas d'impact.",
  },
];

export default function Problem() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#FF4FD8" }}>
            Le vrai problème
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Pourquoi la plupart des marques <span className="text-gradient-pink">échouent</span> avec l'influence
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {problems.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="group relative rounded-2xl bg-white border border-border p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5" style={{ color: "#FF4FD8" }} />
              </div>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xl leading-none">❌</span>
                <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed pl-7">{desc}</p>
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="border-gradient-brand shadow-card p-8 rounded-2xl">
            <p className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              Le problème n'est pas l'influence.
              <br />
              C'est <span className="text-gradient-brand">son exécution</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}