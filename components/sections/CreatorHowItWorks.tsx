import { Check, FileSignature, DollarSign } from "lucide-react";

const ETAPES = [
  {
    badge: { label: "Campagne publiée", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", dot: "bg-cyan-500" },
    title: "Une marque lance une mission",
    desc: "Découvre des dizaines de campagnes UGC chaque semaine, filtrées selon ta niche et ton audience.",
    visual: "mission",
    dotColor: "#00B8E6",
  },
  {
    badge: { label: "Tu postules", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", dot: "bg-pink-500" },
    title: "En 1 clic. Contrat auto.",
    desc: "Pas de mails à rallonge. Tu postules, le contrat est généré automatiquement, signé en ligne, et tu démarres.",
    visual: "contract",
    dotColor: "#FF4FD8",
  },
  {
    badge: { label: "Tu livres", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", dot: "bg-violet-500" },
    title: "Tu envoies. La marque valide.",
    desc: "Envoie ton contenu directement sur la plateforme. Validation suivie en temps réel, sans aller-retour interminable.",
    visual: "video",
    dotColor: "#8B5CF6",
  },
  {
    badge: { label: "Tu es payé", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", dot: "bg-emerald-500" },
    title: "Paiement sécurisé après validation du contenu",
    desc: "Plus de relances. Plus d'attente 90 jours. Argent garanti, virement automatique.",
    visual: "payment",
    dotColor: "#10b981",
  },
];

const Visual = ({ type }: { type: string }) => {
  if (type === "mission") {
    return (
      <div className="rounded-2xl bg-white border border-border shadow-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">N</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-foreground">Nuxe Paris</div>
            <div className="text-xs text-muted-foreground">5 missions cette semaine</div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">NEW</span>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3 mb-3 border border-border/70">
          <div className="text-xs text-muted-foreground mb-1">Mission UGC — Soin visage</div>
          <div className="text-sm font-semibold text-foreground">1 vidéo TikTok 30s + brief client</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg bg-white border border-border p-2"><div className="text-[9px] text-muted-foreground uppercase tracking-wider">Budget</div><div className="text-sm font-bold text-foreground">250 €</div></div>
          <div className="rounded-lg bg-white border border-border p-2"><div className="text-[9px] text-muted-foreground uppercase tracking-wider">Délai</div><div className="text-sm font-bold text-foreground">5 j</div></div>
          <div className="rounded-lg bg-white border border-border p-2"><div className="text-[9px] text-muted-foreground uppercase tracking-wider">Format</div><div className="text-sm font-bold text-foreground">📱</div></div>
        </div>
        <button className="w-full rounded-xl bg-gradient-brand text-white text-sm font-semibold py-3 shadow-glow">Postuler</button>
      </div>
    );
  }

  if (type === "contract") {
    return (
      <div className="rounded-2xl bg-white border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileSignature className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-bold text-foreground">Contrat généré</span>
          <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">AUTO</span>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 mb-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>
          <div>
            <div className="text-sm font-semibold text-foreground">Candidature acceptée</div>
            <div className="text-xs text-muted-foreground">Contrat signé électroniquement</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/60 p-2 text-center"><div className="text-[9px] text-muted-foreground uppercase tracking-wider">Protection</div><div className="text-xs font-bold text-foreground">Légale</div></div>
          <div className="rounded-lg bg-secondary/60 p-2 text-center"><div className="text-[9px] text-muted-foreground uppercase tracking-wider">Délai</div><div className="text-xs font-bold text-foreground">12 sec</div></div>
        </div>
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="rounded-2xl bg-white border border-border shadow-card p-5">
        <div className="rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-violet-500 to-pink-500 aspect-video flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-glow">
            <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">video-nuxe-final.mp4</span>
          <span className="text-xs font-bold text-emerald-600">100%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-3"><div className="h-full bg-gradient-brand w-full" /></div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-foreground">Contenu validé par Nuxe</span>
        </div>
      </div>
    );
  }

  // payment
  return (
    <div className="rounded-2xl bg-white border border-border shadow-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-bold text-foreground">Paiement reçu</span>
        <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">SÉCURISÉ</span>
      </div>
      <div className="text-center py-3">
        <div className="text-xs text-muted-foreground mb-1">Sur ton compte bancaire</div>
        <div className="text-3xl font-bold text-gradient-brand tabular-nums">+ 250,00 €</div>
      </div>
      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Mission de</span><span className="font-semibold text-foreground">Nuxe Paris</span></div>
        <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Délai</span><span className="font-semibold text-foreground">Sous 7 jours</span></div>
      </div>
    </div>
  );
};

export default function CreatorHowItWorks() {
  return (
    <section id="how" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[480px] h-[480px] -top-20 -left-20 opacity-40" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[520px] h-[520px] bottom-0 -right-32 opacity-40" style={{ background: "#FF4FD8" }} aria-hidden />

      <div className="container max-w-6xl relative">
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-4">Comment ça marche</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            De la candidature au <span className="text-gradient-brand">paiement sécurisé</span>.
          </h2>
          <p className="mt-5 text-base text-muted-foreground max-w-2xl mx-auto">
            Ton contenu devient un revenu en quelques étapes. Pas d&apos;agence. Pas d&apos;attente.
          </p>
        </div>

        {/* TIMELINE WRAPPER */}
        <div className="relative">
          {/* Ligne verticale centrale */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-pink-500 to-emerald-500 opacity-30 rounded-full" aria-hidden />

          <div className="space-y-24">
            {ETAPES.map((step, i) => {
              const reversed = i % 2 === 1;
              return (
                <div key={step.title} className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  {/* Dot sur la timeline */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-5 h-5 rounded-full border-4 border-white shadow-glow" style={{ background: step.dotColor }} />
                  </div>

                  <div className={reversed ? "lg:order-2" : ""}>
                    <span className={`inline-flex items-center gap-2 rounded-full ${step.badge.bg} border ${step.badge.border} px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider ${step.badge.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${step.badge.dot}`} /> {step.badge.label}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  <div className={reversed ? "lg:order-1" : ""}>
                    <Visual type={step.visual} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}