import { Sparkles, FileText, Banknote, BarChart3, Heart, Video, Wand2, Crown, Briefcase, ArrowRight } from "lucide-react";

const benefits = [
  { emoji: "🎯", title: "Des campagnes faites pour toi", desc: "Grâce à un matching intelligent" },
  { emoji: "📝", title: "Zéro paperasse", desc: "Contrats automatisés et sécurisés" },
  { emoji: "💸", title: "Tu es payé, quoi qu'il arrive", desc: "Paiements protégés" },
  { emoji: "📊", title: "Tu sais ce qui marche", desc: "Analytics en temps réel" },
];

const campaignTypes = [
  { icon: Heart, label: "Affiliation", desc: "Commissions sur ventes", color: "#FF4FD8" },
  { icon: Video, label: "UGC", desc: "Contenu pour marques", color: "#00B8E6" },
  { icon: Wand2, label: "Placement produit", desc: "Mise en avant rémunérée", color: "#8B5CF6" },
  { icon: Crown, label: "Ambassadeur", desc: "Partenariat long terme", color: "#F59E0B" },
  { icon: Briefcase, label: "One-shot", desc: "Missions ponctuelles", color: "#10B981" },
];

export default function CreatorAdvantagesCampaigns() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* COLONNE GAUCHE */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-100 px-3 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">Bloc 1 · Campagnes & Revenus</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-8">
              Choisis tes campagnes.<br />
              <span className="text-gradient-brand">On s&apos;occupe du reste.</span>
            </h2>

            <ul className="space-y-5 mb-8">
              {benefits.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{b.emoji}</span>
                  <div>
                    <div className="text-base font-bold text-foreground">{b.title}</div>
                    <div className="text-sm text-muted-foreground">{b.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-xl bg-gradient-brand-soft border border-pink-100 px-5 py-4">
              <p className="text-base italic text-foreground">
                &quot;Tu crées. <span className="text-gradient-brand not-italic font-semibold">Partnexx te fait gagner de l&apos;argent.</span>&quot;
              </p>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="rounded-2xl bg-white border border-border shadow-card p-6 sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-5">
              Types de campagnes
            </div>
            <ul className="space-y-3">
              {campaignTypes.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.label} className="group flex items-center gap-4 rounded-xl border border-border bg-secondary/30 px-4 py-3 transition-all hover:bg-secondary/60 hover:border-foreground/10 cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: c.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">{c.label}</div>
                      <div className="text-xs text-muted-foreground">{c.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}