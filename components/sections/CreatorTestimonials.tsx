import { Star } from "lucide-react";

const testimonials = [
  {
    initial: "L",
    name: "Léa M.",
    handle: "TikTok",
    followers: "42k",
    bgColor: "from-fuchsia-500 to-rose-500",
    quote: "Franchement j'y croyais pas trop, mais j'ai signé mes 2 premières collabs sans passer par une agence. Payée à jour, après la livraison.",
    earnings: "+ 1 420 €",
    period: "Revenus 30 derniers jours",
    sparkline: [22, 28, 24, 36, 42, 38, 52, 48, 64, 58, 72, 68, 82, 78],
    rating: "100% Partnexx",
  },
  {
    initial: "K",
    name: "Karim T.",
    handle: "Instagram",
    followers: "76k",
    bgColor: "from-cyan-500 to-blue-500",
    quote: "Le contrat auto m'a fait gagner un temps fou. Plus besoin de perdre 2h par mission. Le suivi est clair et l'argent tombe.",
    earnings: "+ 2 850 €",
    period: "Revenus 30 derniers jours",
    sparkline: [30, 28, 38, 42, 48, 44, 56, 62, 68, 64, 78, 82, 88, 92],
    rating: "100% Partnexx",
  },
  {
    initial: "S",
    name: "Sofia R.",
    handle: "TikTok",
    followers: "23k",
    bgColor: "from-amber-400 to-orange-500",
    quote: "Première mission validée en 3 jours. Aucun stress sur le paiement, ça change vraiment quand tu débutes.",
    earnings: "+ 680 €",
    period: "Revenus 30 derniers jours",
    sparkline: [12, 18, 16, 22, 28, 26, 32, 30, 38, 36, 42, 48, 46, 54],
    rating: "100% Partnexx",
  },
];

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 240;
  const height = 50;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00B8E6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00B8E6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkfill)" />
      <polyline points={points} fill="none" stroke="#00B8E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function CreatorTestimonials() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] -top-20 -right-32 opacity-40" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[480px] h-[480px] bottom-0 -left-32 opacity-40" style={{ background: "#00B8E6" }} aria-hidden />

      <div className="container relative">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">Ils gagnent déjà</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Des créateurs gagnent déjà avec <span className="text-gradient-brand">Partnexx</span>.
          </h2>
          <p className="mt-5 text-base text-muted-foreground max-w-2xl mx-auto">
            Pas de promesses. Des chiffres, des revenus, des témoignages réels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="relative rounded-2xl bg-white border border-border shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.bgColor} flex items-center justify-center text-white font-bold text-base shadow-glow`}>
                  {t.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.handle} · {t.followers}</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">« {t.quote} »</p>

              <div className="rounded-xl bg-gradient-brand-soft border border-border p-4 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{t.period}</div>
                <div className="text-2xl font-bold text-gradient-brand tabular-nums mb-2">{t.earnings}</div>
                <div className="h-12 w-full">
                  <Sparkline data={t.sparkline} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t.rating}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Témoignages issus de créateurs Partnexx · revenus vérifiés sur la plateforme.
        </p>
      </div>
    </section>
  );
}