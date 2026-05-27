import { Check, X } from "lucide-react";

const competitors = [
  { key: "diy", label: "Sans rien", sub: "(Géré en interne)", isUs: false },
  { key: "agency", label: "Agence", sub: "(Classique)", isUs: false },
  { key: "favikon", label: "Favikon", sub: "(& autres)", isUs: false },
  { key: "partnexx", label: "Partnexx", sub: "(Notre solution)", isUs: true },
];

const rows = [
  {
    criterion: "Coûts cachés",
    diy: { value: "Élevés", desc: "Outils, RH, temps", good: false },
    agency: { value: "Très élevés", desc: "Frais, retainers, briefings", good: false },
    favikon: { value: "Modérés", desc: "Abonnement + frais cachés", good: false },
    partnexx: { value: "Zéro", desc: "Tout est inclus", good: true },
  },
  {
    criterion: "Commission",
    diy: { value: "0%", desc: "Mais beaucoup de temps perdu", good: false },
    agency: { value: "20–30%", desc: "Sur chaque collab", good: false },
    favikon: { value: "10–20%", desc: "Selon le plan", good: false },
    partnexx: { value: "5–18%", desc: "Dégressif selon ton plan", good: true },
  },
  {
    criterion: "Temps de lancement",
    diy: { value: "Très long", desc: "Plusieurs semaines", good: false },
    agency: { value: "6–8 semaines", desc: "Briefs et négos", good: false },
    favikon: { value: "2–4 semaines", desc: "Matching manuel", good: false },
    partnexx: { value: "< 24h", desc: "Automatique", good: true },
  },
  {
    criterion: "ROI",
    diy: { value: "Imprévisible", desc: "Trop d'inconnues", good: false },
    agency: { value: "Faible", desc: "Marges écrasées", good: false },
    favikon: { value: "Moyen", desc: "Outils basiques", good: false },
    partnexx: { value: "Mesurable", desc: "Performance trackée", good: true },
  },
  {
    criterion: "Reporting",
    diy: { value: "Manuel", desc: "Excel & captures", good: false },
    agency: { value: "Mensuel", desc: "PDF figés", good: false },
    favikon: { value: "Basique", desc: "Stats limitées", good: false },
    partnexx: { value: "Temps réel", desc: "Dashboard complet", good: true },
  },
];

export default function PricingComparison() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[480px] h-[480px] top-1/3 -left-32 opacity-30" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[480px] h-[480px] top-1/4 -right-32 opacity-30" style={{ background: "#00B8E6" }} aria-hidden />

      <div className="container max-w-6xl relative">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">La différence Partnexx</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Pourquoi <span className="text-gradient-brand">nous</span> et pas les autres ?
          </h2>
          <p className="mt-5 text-base text-muted-foreground max-w-2xl mx-auto">
            Compare Partnexx face aux solutions existantes sur les critères qui comptent vraiment.
          </p>
        </div>

        {/* TABLEAU DESKTOP */}
        <div className="hidden lg:block rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-5 border-b border-border">
            <div className="px-6 py-5 bg-secondary/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Critère</span>
            </div>
            {competitors.map((c) => (
              <div key={c.key} className={`px-4 py-5 text-center ${c.isUs ? "bg-gradient-brand" : "bg-secondary/40"}`}>
                <div className={`text-base font-bold ${c.isUs ? "text-white" : "text-foreground"}`}>{c.label}</div>
                <div className={`text-[11px] ${c.isUs ? "text-white/80" : "text-muted-foreground"}`}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Lignes */}
          {rows.map((row, i) => (
            <div key={row.criterion} className={`grid grid-cols-5 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>
              <div className="px-6 py-5 bg-secondary/20 flex items-center">
                <span className="text-sm font-bold text-foreground">{row.criterion}</span>
              </div>

              <div className="px-4 py-5 text-center">
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-sm font-semibold text-foreground">{row.diy.value}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{row.diy.desc}</div>
              </div>

              <div className="px-4 py-5 text-center">
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-sm font-semibold text-foreground">{row.agency.value}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{row.agency.desc}</div>
              </div>

              <div className="px-4 py-5 text-center">
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-sm font-semibold text-foreground">{row.favikon.value}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{row.favikon.desc}</div>
              </div>

              <div className="px-4 py-5 text-center bg-gradient-brand-soft">
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 rounded-full bg-gradient-brand flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-gradient-brand">{row.partnexx.value}</span>
                </div>
                <div className="text-[11px] text-foreground/80">{row.partnexx.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* VERSION MOBILE (cartes empilées) */}
        <div className="lg:hidden space-y-6">
          {rows.map((row) => (
            <div key={row.criterion} className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
              <div className="bg-secondary/40 px-5 py-3 border-b border-border">
                <span className="text-sm font-bold text-foreground">{row.criterion}</span>
              </div>
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-xs font-bold text-foreground">Sans rien</div>
                    <div className="text-[11px] text-muted-foreground">{row.diy.desc}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-sm font-semibold text-foreground">{row.diy.value}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-xs font-bold text-foreground">Agence</div>
                    <div className="text-[11px] text-muted-foreground">{row.agency.desc}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-sm font-semibold text-foreground">{row.agency.value}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-xs font-bold text-foreground">Favikon</div>
                    <div className="text-[11px] text-muted-foreground">{row.favikon.desc}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-sm font-semibold text-foreground">{row.favikon.value}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-brand-soft">
                  <div>
                    <div className="text-xs font-bold text-gradient-brand">Partnexx</div>
                    <div className="text-[11px] text-foreground/80">{row.partnexx.desc}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-brand flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-gradient-brand">{row.partnexx.value}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-base text-muted-foreground">
          <span className="font-bold text-foreground">Partnexx, c&apos;est l&apos;équivalent d&apos;une équipe complète</span>, pour une fraction du coût.
        </p>
      </div>
    </section>
  );
}