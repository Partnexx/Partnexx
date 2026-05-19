import { ArrowRight, Check, BadgeCheck, FileSignature, Megaphone, Trophy } from "lucide-react";

export default function CreatorFinalCTA() {
  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-[20%] -translate-y-[40%] opacity-50" style={{ background: "#FF4FD8" }} aria-hidden />

      <div className="container relative">
        <div className="relative max-w-4xl mx-auto">

          {/* CARTES FLOTTANTES AUTOUR */}

          {/* Mission validée — TOP RIGHT */}
          <div className="hidden lg:flex absolute top-[4%] right-[-1%] items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-border shadow-card px-4 py-3 z-20">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,184,230,0.6)]">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-muted-foreground leading-none mb-0.5">Mission</div>
              <div className="text-sm font-bold text-foreground leading-none">Validée ✨</div>
            </div>
          </div>

          {/* Contrat signé — LEFT MIDDLE */}
          <div className="hidden lg:flex absolute top-[48%] left-[-3%] items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-border shadow-card px-3.5 py-2.5 z-20">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-muted-foreground leading-none mb-0.5">Contrat signé</div>
              <div className="text-sm font-bold text-foreground leading-none">Nike × Toi</div>
            </div>
          </div>

          {/* 3 nouvelles campagnes — RIGHT MIDDLE */}
          <div className="hidden lg:flex absolute top-[42%] right-[-4%] items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-border shadow-card px-4 py-3 z-20">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-muted-foreground leading-none mb-0.5">Nouveau</div>
              <div className="text-sm font-bold text-foreground leading-none">3 campagnes</div>
            </div>
          </div>

          {/* Partenaire Or — BOTTOM LEFT */}
          <div className="hidden lg:flex absolute bottom-[10%] left-[2%] items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-border shadow-card px-3.5 py-2.5 z-20">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-muted-foreground leading-none mb-0.5">Niveau</div>
              <div className="text-sm font-bold text-foreground leading-none whitespace-nowrap">Partenaire Or</div>
            </div>
          </div>

          {/* 2480 créateurs — BOTTOM RIGHT */}
          <div className="hidden lg:flex absolute bottom-[8%] right-[1%] items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-border shadow-card px-4 py-3 z-20">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 border-2 border-white" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-white" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-muted-foreground leading-none mb-0.5">En ligne</div>
              <div className="text-sm font-bold text-foreground leading-none">2 480 créateurs</div>
            </div>
          </div>

          {/* CENTRAL CTA CARD — GLASSMORPHIC */}
          <div className="relative z-10 w-full text-center rounded-[32px] p-10 sm:p-16 overflow-hidden">
            {/* Halos */}
            <div className="absolute -inset-12 rounded-[48px] bg-gradient-brand opacity-30 blur-3xl animate-pulse-glow pointer-events-none" aria-hidden />
            <div className="absolute -inset-4 rounded-[36px] bg-gradient-brand opacity-15 blur-2xl pointer-events-none" aria-hidden />

            {/* Glass surface */}
            <div className="absolute inset-0 rounded-[32px] backdrop-blur-2xl border border-white/40 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.45) 100%)", boxShadow: "0 20px 60px -15px rgba(255,79,216,0.25), 0 10px 40px -10px rgba(0,184,230,0.25), inset 0 1px 0 rgba(255,255,255,0.6)" }} aria-hidden />

            {/* Inner content */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-white/60 px-3 py-1 mb-6 shadow-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-foreground">Les campagnes tournent déjà</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-4">
                Ton prochain revenu
              </h2>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-8">
                commence <span className="text-gradient-brand">ici</span>.
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                Rejoins des milliers de créateurs qui monétisent déjà leur contenu avec Partnexx.
              </p>

              <a href="#" className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-brand px-10 py-6 text-lg font-semibold text-white shadow-glow animate-pulse-glow hover:scale-105 transition-transform">
                Commencer gratuitement
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1.5" />
              </a>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Opportunités disponibles</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 100% gratuit</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Communauté</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}