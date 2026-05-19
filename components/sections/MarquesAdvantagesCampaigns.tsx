import { Heart, Video, Sparkles, Crown, Briefcase, ArrowRight } from "lucide-react";

const features = [
  { icon: "📝", title: "Brief intelligent", desc: "Ton besoin transformé en campagne claire." },
  { icon: "🤖", title: "Matching créateurs IA", desc: "Sélection selon ton audience et tes objectifs." },
  { icon: "📄", title: "Contrats automatisés", desc: "Droits, livrables et délais cadrés." },
  { icon: "🛡️", title: "Paiement sécurisé", desc: "Fonds bloqués, libérés après validation." },
  { icon: "📈", title: "Suivi des performances", desc: "Vues, clics, ventes et ROI centralisés." },
];

const campaignTypes = [
  { icon: Heart, label: "Affiliation", desc: "Rémunération à la performance", color: "#FF4FD8" },
  { icon: Video, label: "UGC", desc: "Contenus authentiques pour tes publicités", color: "#00B8E6" },
  { icon: Sparkles, label: "Placement produit", desc: "Mise en avant ciblée par créateurs", color: "#8B5CF6" },
  { icon: Crown, label: "Ambassadeur", desc: "Relation long terme avec des profils clés", color: "#F59E0B" },
  { icon: Briefcase, label: "One-shot", desc: "Activation rapide pour une campagne ponctuelle", color: "#10B981" },
];

export default function MarquesAdvantagesCampaigns() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* COLONNE GAUCHE */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 mb-5 shadow-soft">
              <span className="text-base">🚀</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Bloc 1 · Campagnes & Créateurs</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
              Trouve les créateurs <br />
              <span className="text-gradient-brand">qui performent vraiment.</span>
            </h2>

            <ul className="space-y-4 mb-6">
              {features.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="text-xl leading-7 shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-base font-semibold text-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mb-6">
              {["Contrats automatisés", "Paiements protégés", "Campagnes sécurisées"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
                  <span className="text-emerald-500">✔</span>
                  {t}
                </span>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground/70 italic pl-3 border-l-2 border-border/60">
              « Tu poses le brief. Partnexx orchestre la campagne. »
            </p>
          </div>

          {/* COLONNE DROITE */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-pink-500/20 blur-3xl rounded-[2.5rem] opacity-70 pointer-events-none" aria-hidden />

            <div className="relative rounded-3xl border border-border bg-white/80 backdrop-blur shadow-card p-6 sm:p-8">
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-5">
                Types de campagnes
              </div>
              <div className="divide-y divide-border/70">
                {campaignTypes.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0 px-3 -mx-3 rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:bg-secondary/40">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: `${c.color}15`, color: c.color }}>
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{c.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1.5 transition-all duration-300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}