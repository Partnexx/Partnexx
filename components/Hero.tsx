"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-12 lg:pt-20 pb-20">
        <div className="animate-count-up">

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 mb-6 shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Campagnes créateurs · Lancement nouvelle saison</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] mb-6 text-foreground tracking-tight">
            Génère des <span style={{ color: "#00B8E6" }}>ventes</span>.<br />
            Deviens <span className="text-gradient-pink">visible partout</span>.<br />
            Automatiquement.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            Partnexx lance tes campagnes avec des créateurs et boost ta présence dans ta niche.
          </p>

          <div className="flex flex-col items-start gap-3">
            <Link href="/marques/inscription" className="group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-brand px-9 py-5 text-lg font-semibold text-white shadow-glow animate-pulse-glow transition-all duration-300 hover:scale-105">
              <span>Lancer ma première campagne gratuitement</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1.5" />
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1.5 shadow-sm">
              <span style={{ color: "#00B8E6" }} className="text-base leading-none">✓</span>
              <span className="text-sm font-semibold text-foreground">Sans carte bancaire</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-sm font-semibold text-foreground">Résultats mesurables</span>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-xl border-gradient-brand bg-white/80 backdrop-blur px-4 py-3 shadow-soft">
            <span className="text-base">🚀</span>
            <span className="text-sm text-foreground/90">
              Après 3 campagnes, on rend ta marque <span className="font-semibold text-gradient-brand">visible partout</span>
            </span>
          </div>

        </div>

        <div className="lg:pl-8">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}