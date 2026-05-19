"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { RANK_DETAILS } from "@/components/ranks-data";

// Import dynamique pour éviter les erreurs SSR avec Three.js
const RanksOrbit3D = dynamic(() => import("@/components/RanksOrbit3D"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-border bg-secondary/30 h-[540px] flex items-center justify-center">
      <div className="text-sm text-muted-foreground animate-pulse">Chargement de la 3D...</div>
    </div>
  ),
});

export default function CreatorAdvantagesRanks() {
  const [activeRank, setActiveRank] = useState(0);
  const rank = RANK_DETAILS[activeRank];

  return (
    <section className="relative py-16 lg:py-24">
      <div className="container max-w-5xl">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 mb-5 shadow-soft">
            <span className="text-base">🏆</span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
              Bloc 3 · Niveaux & Récompenses
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Monte en niveau. <br />
            <span className="text-gradient-brand">Débloque plus à chaque étape.</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Un système qui débloque plus de revenus et d&apos;opportunités à mesure que tu progresses.
          </p>
        </div>

        {/* VISUALISATION 3D */}
        <div className="mb-10">
          <RanksOrbit3D active={activeRank} onChange={setActiveRank} />
        </div>

        {/* CARTE FOCUS — Niveau dynamique */}
        <div
          className="relative rounded-3xl border p-6 sm:p-8 mb-10 shadow-card overflow-hidden transition-colors"
          style={{
            borderColor: `${rank.color}66`,
            background: `linear-gradient(135deg, ${rank.color}1a, ${rank.accent}10, ${rank.ring}14)`,
          }}
        >
          <div
            className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-[0.18em] bg-white/70 backdrop-blur px-2.5 py-1 rounded-full border"
            style={{ color: rank.color, borderColor: `${rank.color}55` }}
          >
            Focus niveau
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-glow"
              style={{ background: `linear-gradient(135deg, ${rank.color}, ${rank.ring})` }}
            >
              {rank.emoji}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Niveau</div>
              <div className="text-2xl font-bold text-foreground">{rank.name}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {rank.perks.map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 rounded-xl bg-white/70 backdrop-blur border border-border px-3.5 py-2.5">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-semibold text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white text-sm font-bold shadow-soft"
            style={{ background: `linear-gradient(90deg, ${rank.color}, ${rank.ring})` }}
          >
            <span>📊</span> {rank.bonus}
          </div>
        </div>

        {/* MARKETPLACE */}
        <div className="rounded-2xl bg-gradient-brand-soft border border-border p-5 mb-6 text-center">
          <p className="text-base font-semibold text-foreground">
            🎁 Utilise tes points pour débloquer des avantages dans la <span className="text-gradient-brand">marketplace Partnexx</span>.
          </p>
        </div>

        {/* PHRASE FINALE */}
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Plus tu montes, <span className="text-gradient-brand">plus tu gagnes</span>.
          </p>
        </div>
      </div>
    </section>
  );
}