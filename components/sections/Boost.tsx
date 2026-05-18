import { Network, Flame, Zap } from "lucide-react";

const items = [
  {
    icon: Network,
    title: "Réseau de créateurs partenaires",
    desc: "Des dizaines de créateurs activés en parallèle dans ta niche.",
  },
  {
    icon: Flame,
    title: "Contenu viral (trends, UGC)",
    desc: "On capitalise sur les formats qui performent maintenant.",
  },
  {
    icon: Zap,
    title: "Multiplication des vidéos",
    desc: "Plus de volume, plus de portée, plus de présence dans le feed.",
  },
];

export default function Boost() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2 opacity-50" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[500px] h-[500px] bottom-0 -left-32 opacity-40" style={{ background: "#8B5CF6" }} aria-hidden />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 mb-6">
            <span className="text-base">🔥</span>
            <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#FF4FD8" }}>Notoriété Boost</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight mb-6">
            On ne s'arrête pas <span className="text-gradient-pink">aux campagnes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Après 3 campagnes, Partnexx active automatiquement un <span className="font-semibold text-foreground">Notoriété Boost</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="relative rounded-2xl bg-white/80 backdrop-blur border border-border p-7 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand-soft border border-pink-100 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5" style={{ color: "#FF4FD8" }} />
              </div>
              <h3 className="text-lg font-semibold text-foreground leading-snug mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            On rend ta marque <span className="text-gradient-brand">visible partout</span>.
          </p>
        </div>
      </div>
    </section>
  );
}