import { ShieldCheck, CheckCircle2, FileSignature, CreditCard, FileCheck2, Clock } from "lucide-react";

const benefits = [
  "Contrats automatisés",
  "Signature électronique",
  "Validation des livrables",
  "Paiements sécurisés",
  "Historique des collaborations",
  "Zéro paperasse",
];

const timeline = [
  { label: "Brief envoyé", time: "J-7" },
  { label: "Contrat signé", time: "J-6" },
  { label: "Livrable validé", time: "J-1" },
  { label: "Paiement libéré", time: "Auj." },
];

export default function MarquesAdvantagesContracts() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* COLONNE GAUCHE — Texte */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 mb-5">
              <span className="text-base">🛡️</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Bloc 3 · Contrats & Paiements</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
              Contrats, paiements et <br />
              <span className="text-gradient-brand">validations centralisés.</span>
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              Partnexx sécurise chaque collaboration avec contrats automatisés, validation des livrables et paiements protégés.
            </p>

            <ul className="space-y-3 mb-6">
              {benefits.map((t) => (
                <li key={t} className="flex items-center gap-3 text-base text-foreground">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs shrink-0">✔</span>
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm sm:text-base text-foreground italic pl-3 border-l-2 border-emerald-300">
              Chaque collaboration reste claire, <span className="text-gradient-brand font-semibold not-italic">cadrée et sécurisée</span>.
            </p>
          </div>

          {/* COLONNE DROITE — Dashboard contrats */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/20 blur-3xl rounded-[2.5rem] opacity-70 pointer-events-none" aria-hidden />

            <div className="relative rounded-3xl border border-border bg-white/85 backdrop-blur shadow-card p-5 sm:p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Collaboration · Sophie M.</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Campagne · Beauty Boost</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Sécurisée
                </span>
              </div>

              {/* Contract card */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-white to-emerald-50/40 p-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <FileSignature className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="text-[12px] font-bold text-foreground truncate">Contrat signé</div>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">✓ Validé</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">2 livrables · 14 jours · droits 6 mois</div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white border border-border px-1.5 py-0.5 font-semibold text-foreground">SM</span>
                      <span>Sophie M.</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white border border-border px-1.5 py-0.5 font-semibold text-foreground">BB</span>
                      <span>Beauty Boost</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment + Livrable */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-border bg-white p-3 transition-all duration-300 hover:border-violet-200 hover:shadow-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-violet-600" /> Paiement sécurisé
                  </div>
                  <div className="text-xl font-bold text-foreground tabular-nums leading-tight">2 400 €</div>
                  <div className="text-[10px] text-muted-foreground mb-2">Bloqué en séquestre</div>
                  <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px]">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-bold text-emerald-600">Protégé</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3 transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground mb-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> Livrable
                  </div>
                  <div className="text-[12px] font-semibold text-foreground leading-tight">Reel + Story</div>
                  <div className="text-[10px] text-muted-foreground mb-2">v2 · validée</div>
                  <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Acceptée
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" /> il y a 2h
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-50/60 to-violet-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Timeline collaboration
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">4/4 étapes</span>
                </div>
                <ol className="relative space-y-2.5 pl-4 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-px before:bg-emerald-200">
                  {timeline.map((s) => (
                    <li key={s.label} className="relative flex items-center gap-2 text-[11px]">
                      <span className="absolute -left-4 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" />
                      <span className="font-semibold text-foreground">{s.label}</span>
                      <span className="ml-auto text-muted-foreground tabular-nums">{s.time}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}