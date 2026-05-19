import { BarChart3, TrendingUp, Target, Eye, MousePointerClick, LineChart, Users } from "lucide-react";

const kpis = [
  { icon: Target, label: "ROI moyen", value: "x4,2", color: "#8B5CF6" },
  { icon: Eye, label: "Vues générées", value: "1,2M", color: "#00B8E6" },
  { icon: MousePointerClick, label: "Taux de clic", value: "6,8%", color: "#FF4FD8" },
];

const topCreators = [
  { rank: "1", name: "Sophie M.", val: "12,4k €" },
  { rank: "2", name: "Emma D.", val: "10,8k €" },
  { rank: "3", name: "Julie L.", val: "9,6k €" },
];

const benefits = [
  "ROI en temps réel",
  "Suivi des conversions",
  "Top créateurs performants",
  "Rapports exportables",
  "Comparaison des campagnes",
  "Données centralisées",
];

export default function MarquesAdvantagesAnalytics() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* COLONNE GAUCHE — Dashboard */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-6 bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-pink-500/20 blur-3xl rounded-[2.5rem] opacity-70 pointer-events-none" aria-hidden />

            <div className="relative rounded-3xl border border-border bg-white/85 backdrop-blur shadow-card p-5 sm:p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-brand-soft flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Performance · Beauty Boost</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Live · 30 derniers jours</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  <TrendingUp className="w-3 h-3" /> +18%
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-2.5">
                {kpis.map((k) => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="rounded-xl border border-border bg-white p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5" style={{ background: `${k.color}15`, color: k.color }}>
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </div>
                      <div className="text-base font-bold text-foreground tabular-nums">{k.value}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{k.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Chart évolution — COURBES SVG */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-violet-50/60 to-pink-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <LineChart className="w-3.5 h-3.5 text-violet-600" />
                    Évolution campagne
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-medium">
                    <span className="inline-flex items-center gap-1 text-blue-600"><span className="w-2 h-2 rounded-sm bg-blue-500" />Revenus</span>
                    <span className="inline-flex items-center gap-1 text-rose-500"><span className="w-2 h-2 rounded-sm bg-rose-500" />Coûts</span>
                  </div>
                </div>
                <div className="relative h-20 w-full">
                  <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Aire sous courbe Revenus (bleue) */}
                    <path d="M 10 65 Q 40 55, 70 50 T 130 30 T 200 18 T 290 5 L 290 100 L 10 100 Z" fill="url(#revenueGradient)" />
                    {/* Aire sous courbe Coûts (rouge) */}
                    <path d="M 10 85 Q 40 80, 70 82 T 130 76 T 200 72 T 290 70 L 290 100 L 10 100 Z" fill="url(#costGradient)" />
                    {/* Courbe Revenus */}
                    <path d="M 10 65 Q 40 55, 70 50 T 130 30 T 200 18 T 290 5" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Courbe Coûts */}
                    <path d="M 10 85 Q 40 80, 70 82 T 130 76 T 200 72 T 290 70" stroke="#f43f5e" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Points sur la courbe Revenus */}
                    <circle cx="10" cy="65" r="2.5" fill="#3b82f6" />
                    <circle cx="70" cy="50" r="2.5" fill="#3b82f6" />
                    <circle cx="130" cy="30" r="2.5" fill="#3b82f6" />
                    <circle cx="200" cy="18" r="2.5" fill="#3b82f6" />
                    <circle cx="290" cy="5" r="2.5" fill="#3b82f6" />
                    {/* Points sur la courbe Coûts */}
                    <circle cx="10" cy="85" r="2.5" fill="#f43f5e" />
                    <circle cx="70" cy="82" r="2.5" fill="#f43f5e" />
                    <circle cx="130" cy="76" r="2.5" fill="#f43f5e" />
                    <circle cx="200" cy="72" r="2.5" fill="#f43f5e" />
                    <circle cx="290" cy="70" r="2.5" fill="#f43f5e" />
                  </svg>
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] text-muted-foreground font-medium">
                  {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"].map((m) => <span key={m}>{m}</span>)}
                </div>
              </div>

              {/* Top performers + conversions */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-border bg-white p-3 transition-all duration-300 hover:border-amber-200 hover:shadow-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground mb-2">
                    <Users className="w-3.5 h-3.5 text-amber-500" /> Top créateurs
                  </div>
                  <ul className="space-y-1.5">
                    {topCreators.map((p) => (
                      <li key={p.rank} className="flex items-center gap-2 text-[11px]">
                        <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-[9px]">{p.rank}</span>
                        <span className="font-semibold text-foreground">{p.name}</span>
                        <span className="ml-auto font-bold text-emerald-600 tabular-nums">{p.val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3 transition-all duration-300 hover:border-violet-200 hover:shadow-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Conversions
                  </div>
                  <div className="text-2xl font-bold text-foreground tabular-nums leading-tight">2 487</div>
                  <div className="text-[10px] text-muted-foreground mb-2">ventes attribuées</div>
                  <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-brand rounded-full" style={{ width: "72%" }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px]">
                    <span className="text-muted-foreground">Objectif</span>
                    <span className="font-bold text-violet-600">72%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE — Texte */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 mb-5">
              <span className="text-base">📊</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Bloc 2 · Analytics & Performance</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
              Analyse tes campagnes <br />
              <span className="text-gradient-brand">en temps réel.</span>
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              Suis les vues, conversions et performances créateurs depuis un seul dashboard.
            </p>

            <ul className="space-y-3 mb-6">
              {benefits.map((t) => (
                <li key={t} className="flex items-center gap-3 text-base text-foreground">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs shrink-0">✔</span>
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm sm:text-base text-foreground italic pl-3 border-l-2 border-violet-300">
              Chaque campagne devient <span className="text-gradient-brand font-semibold not-italic">mesurable</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}