import { Medal, Sparkles, Zap, Target, Coins, Users, Link as LinkIcon, User, Building2 } from "lucide-react";

const benefits = [
  { icon: Medal, color: "#F59E0B", title: "Badge Partner sur ton profil", desc: "Plus de crédibilité auprès des marques" },
  { icon: Sparkles, color: "#FF4FD8", title: "Accès à des campagnes exclusives", desc: "Réservées aux créateurs actifs" },
  { icon: Zap, color: "#F59E0B", title: "Priorité sur les opportunités", desc: "Sois sélectionné avant les autres" },
  { icon: Target, color: "#00B8E6", title: "Boost du Partnexx Score", desc: "Monte plus vite dans le classement" },
  { icon: Coins, color: "#10B981", title: "Génère des revenus avec ton lien", desc: "15% sur les abonnements marques durant 3 mois" },
  { icon: Users, color: "#8B5CF6", title: "Fais grandir ton réseau", desc: "Créateurs invités = points + avantages" },
];

export default function CreatorAdvantagesPartner() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="glow-orb w-[420px] h-[420px] top-0 -left-20 opacity-40" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[420px] h-[420px] bottom-0 -right-20 opacity-40" style={{ background: "#FF4FD8" }} aria-hidden />

      <div className="container max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* COLONNE GAUCHE — Carte profil + bonus */}
          <div className="space-y-5">
            {/* Carte profil */}
            <div className="relative rounded-2xl bg-white border border-border shadow-card p-6 sm:p-8">
              {/* Badge "PARTNEXX PARTNER" */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-brand text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 shadow-glow whitespace-nowrap">
                <Sparkles className="w-3 h-3" /> Partnexx Partner
              </span>

              {/* Profil */}
              <div className="flex items-start justify-between mb-5 mt-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-xl font-bold shadow-soft">
                    L
                    <span className="absolute -bottom-1 -right-1 text-[8px] font-bold uppercase tracking-wider bg-white text-foreground rounded-full px-1.5 py-0.5 border border-border">Partner</span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-foreground">Léa M.</div>
                    <div className="text-xs text-muted-foreground">Créatrice lifestyle · 24k</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700">
                  🏆 Gold
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="rounded-xl bg-secondary/40 border border-border text-center py-3 px-2">
                  <div className="text-xl font-bold text-foreground">12</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Missions</div>
                </div>
                <div className="rounded-xl bg-secondary/40 border border-border text-center py-3 px-2">
                  <div className="text-xl font-bold text-foreground">2 480€</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenus</div>
                </div>
                <div className="rounded-xl bg-secondary/40 border border-border text-center py-3 px-2">
                  <div className="text-xl font-bold text-foreground">84</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="rounded-xl bg-gradient-brand-soft border border-pink-100 px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground">Progression vers Elite</span>
                  <span className="text-xs font-bold text-gradient-brand">72%</span>
                </div>
                <div className="h-2 rounded-full bg-white/60 overflow-hidden border border-pink-100">
                  <div className="h-full rounded-full bg-gradient-brand" style={{ width: "72%" }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Encore 3 missions pour débloquer le palier</p>
              </div>
            </div>

            {/* Encadré INVITE. GAGNE. SCALE. */}
            <div className="rounded-2xl bg-white border border-border shadow-soft p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">💡</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">Invite. Gagne. Scale.</span>
              </div>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <LinkIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>Partage ton lien Partnexx</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>Créateur inscrit → tu gagnes des <strong>points</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>Marque inscrite → <strong>jusqu&apos;à 15% de son abonnement</strong> versé pendant 3 mois</span>
                </li>
              </ul>
              <p className="text-sm mt-4 pt-3 border-t border-border">
                🚀 <strong>Chaque inscription</strong> <span className="text-gradient-brand font-semibold">peut te rapporter</span>.
              </p>
            </div>
          </div>

          {/* COLONNE DROITE — Texte + bénéfices */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-100 px-3 py-1.5 mb-6">
              <span className="text-sm">🎯</span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-500">Bloc 2 · Partnexx Partner</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
              Passe <span className="text-gradient-brand">Partner</span>.<br />
              Active tes <span className="text-gradient-brand">revenus passifs</span>.
            </h2>

            <p className="text-base text-muted-foreground mb-8 max-w-xl">
              Débloque des campagnes exclusives, gagne en visibilité et génère des revenus grâce à ton réseau.
            </p>

            <ul className="space-y-5">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.color}15` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: b.color }} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">{b.title}</div>
                      <div className="text-sm text-muted-foreground">{b.desc}</div>
                    </div>
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