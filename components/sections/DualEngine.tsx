import { DollarSign, Flame, Plus } from "lucide-react";

export default function DualEngine() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container relative">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#FF4FD8" }}>Le système</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Un système de croissance <br className="hidden sm:block" />
            en <span className="text-gradient-brand">2 moteurs</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
          <div className="relative rounded-2xl bg-white border border-border p-8 shadow-card overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 blur-3xl" style={{ background: "#00B8E6" }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6" style={{ color: "#00B8E6" }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "#00B8E6" }}>Moteur 1</p>
              <h3 className="text-3xl font-bold text-foreground mb-2">💰 Campagnes</h3>
              <p className="text-lg text-muted-foreground">Génèrent des <span className="font-semibold text-foreground">ventes</span>.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-glow animate-pulse-glow">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </div>
          </div>

          <div className="relative rounded-2xl bg-white border border-border p-8 shadow-card overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-30 blur-3xl" style={{ background: "#FF4FD8" }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center mb-5">
                <Flame className="w-6 h-6" style={{ color: "#FF4FD8" }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "#FF4FD8" }}>Moteur 2</p>
              <h3 className="text-3xl font-bold text-foreground mb-2">🔥 Notoriété Boost</h3>
              <p className="text-lg text-muted-foreground">Génère de la <span className="font-semibold text-foreground">visibilité</span>.</p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-2xl sm:text-3xl font-bold text-foreground">
          Plus de visibilité <span className="text-gradient-brand">=</span> plus de ventes.
        </p>
      </div>
    </section>
  );
}