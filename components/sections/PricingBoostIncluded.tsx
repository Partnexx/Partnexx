const numbers = [
  { value: "10–15", label: "créateurs activés" },
  { value: "1", label: "publication par créateur" },
  { value: "7%", label: "de commission seulement" },
];

const results = ["Visibilité répétée", "Trafic", "Ventes"];

export default function PricingBoostIncluded() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[420px] h-[420px] bottom-0 -right-20 opacity-40" style={{ background: "#8B5CF6" }} aria-hidden />

      <div className="container relative">
        <div className="border-gradient-brand shadow-card p-8 sm:p-12 max-w-5xl mx-auto">
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 mb-6">
              <span className="text-base">🔥</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
                Inclus dans Partnexx · Notoriété Boost
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
              On transforme ta marque en <span className="text-gradient-pink">omniprésence</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Après 3 campagnes, Partnexx déclenche automatiquement une phase de domination. On orchestre toutes les publications sur tous les réseaux. Tu n&apos;as rien à gérer, <span className="font-semibold text-foreground">seulement à encaisser</span>.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
              {numbers.map((n, i) => (
                <div key={i} className="rounded-2xl bg-white/80 backdrop-blur border border-border p-4 sm:p-5 text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gradient-brand tracking-tight">{n.value}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{n.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {results.map((r) => (
                <span key={r} className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-100 px-3 py-1.5 text-xs font-semibold text-cyan-500">
                  ✓ {r}
                </span>
              ))}
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Ta marque devient <span className="text-gradient-brand">visible partout</span>, sans rien à gérer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}