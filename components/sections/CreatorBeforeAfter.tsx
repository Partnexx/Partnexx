import { X, Check, Trophy, ShieldCheck, BarChart3, Sparkles, Scale } from "lucide-react";

const before = [
  { title: "Passer par des agences", desc: "Commissions énormes, intermédiaires partout" },
  { title: "Briefs interminables", desc: "Mails, allers-retours, négociations" },
  { title: "Paiement sous 60–90 jours", desc: "Si tu es payé un jour..." },
  { title: "Aucun contrat clair", desc: "Risque juridique permanent" },
];

const after = [
  { icon: Trophy, title: "Partnexx Score", desc: "Ta réputation créateur, mesurée et reconnue par les marques" },
  { icon: ShieldCheck, title: "Paiement sécurisé", desc: "Argent garanti par Partnexx, versé sous 7 jours" },
  { icon: BarChart3, title: "Analytics", desc: "Performances, revenus et stats de chaque mission en temps réel" },
  { icon: Sparkles, title: "Opportunités", desc: "Des campagnes adaptées à ta niche, livrées chaque semaine" },
  { icon: Scale, title: "Protection juridique", desc: "Contrat conforme généré automatiquement à chaque collab" },
];

export default function CreatorBeforeAfter() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[480px] h-[480px] top-1/3 -left-32 opacity-30" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[480px] h-[480px] top-1/4 -right-32 opacity-30" style={{ background: "#00B8E6" }} aria-hidden />

      <div className="container max-w-6xl relative">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">La différence Partnexx</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Avant Partnexx <span className="text-muted-foreground">vs</span> <span className="text-gradient-brand">Après</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* AVANT — rouge */}
          <div className="relative rounded-2xl bg-white border border-rose-200 shadow-soft p-6 lg:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 mb-6 text-[11px] font-bold uppercase tracking-wider text-rose-600">
              <X className="w-3 h-3" /> Avant
            </span>
            <h3 className="text-2xl font-bold text-foreground mb-6">Le parcours classique</h3>

            <div className="space-y-4">
              {before.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-0.5">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* APRÈS — gradient */}
          <div className="relative rounded-2xl border-gradient-brand shadow-card p-6 lg:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-3 py-1 mb-6 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
              <Check className="w-3 h-3" /> Avec Partnexx
            </span>
            <h3 className="text-2xl font-bold text-foreground mb-6">La nouvelle façon</h3>

            <div className="space-y-4">
              {after.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-0.5">{title}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}