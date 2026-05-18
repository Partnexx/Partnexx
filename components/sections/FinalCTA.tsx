import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-[20%] -translate-y-[40%] opacity-50" style={{ background: "#FF4FD8" }} aria-hidden />

      <div className="container relative">
        <div className="relative mx-auto max-w-4xl text-center border-gradient-brand shadow-card p-10 sm:p-16">
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
              Lance ta première campagne <span className="text-gradient-brand">aujourd'hui</span>.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Brief en 2 minutes. Premiers résultats en quelques jours. Sans carte bancaire.
            </p>
            <a href="#" className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-brand px-9 py-5 text-lg font-semibold text-white shadow-glow animate-pulse-glow hover:scale-105 transition-transform">
              Lancer gratuitement
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1.5" />
            </a>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-200 px-3 py-1.5">
              <span className="text-base">🔥</span>
              <span className="text-xs font-semibold text-foreground">
                Lancement gratuit limité aux <span style={{ color: "#FF4FD8" }}>100 premières marques</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}