"use client";

import { useEffect, useRef, useState } from "react";
import { Coins, Zap, Check, Info } from "lucide-react";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const useSmooth = (target: number, speed = 0.18) => {
  const [val, setVal] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      ref.current = lerp(ref.current, target, speed);
      if (Math.abs(ref.current - target) < 0.5) {
        ref.current = target;
        setVal(target);
        return;
      }
      setVal(ref.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);
  return val;
};

const MIN = 50;
const MAX = 2000;

const computeMetrics = (credits: number) => {
  const t = (credits - MIN) / (MAX - MIN);
  const views = Math.round(lerp(10000, 600000, t));
  return {
    price: Math.round(lerp(30, 1100, t)),
    creators: Math.round(lerp(5, 80, t)),
    contents: Math.round(lerp(10, 240, t)),
    views,
    visits: Math.round(views * 0.012),
    sales: Math.round(views * 0.012 * 0.025),
  };
};

const tiers = [
  { key: "starter", label: "Starter", range: [50, 300] as [number, number], color: "#10B981", emoji: "🟢" },
  { key: "growth", label: "Growth", range: [300, 800] as [number, number], color: "#00B8E6", emoji: "🔵" },
  { key: "scale", label: "Scale", range: [800, 2000] as [number, number], color: "#8B5CF6", emoji: "🟣" },
];

const getTier = (c: number) => {
  if (c < 300) return "starter";
  if (c < 800) return "growth";
  return "scale";
};

const getDynamicLine = (c: number) => {
  if (c <= 250) return "Idéal pour tester ta première campagne.";
  if (c <= 500) return "Lance une campagne solide avec un bon volume de contenu.";
  if (c <= 900) return "Génère un volume solide de contenu et de visibilité.";
  if (c <= 1500) return "Active une vraie présence et maximise ton impact.";
  return "Domine ta niche avec une visibilité massive.";
};

const formatNumber = (n: number) => {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return n.toLocaleString("fr-FR");
};

const presets = [50, 500, 2000];
const pctOf = (c: number) => ((c - MIN) / (MAX - MIN)) * 100;

export default function CreditsInteractive() {
  const [credits, setCredits] = useState(500);
  const target = computeMetrics(credits);

  const creators = Math.round(useSmooth(target.creators));
  const contents = Math.round(useSmooth(target.contents));
  const views = Math.round(useSmooth(target.views));
  const visits = Math.round(useSmooth(target.visits));
  const sales = Math.round(useSmooth(target.sales));

  const progress = useSmooth(pctOf(credits), 0.28);
  const intensity = clamp(progress / 100, 0.2, 1);
  const tier = getTier(credits);
  const tierMeta = tiers.find((t) => t.key === tier)!;

  const stats = [
    { emoji: "👥", label: "Créateurs activés", value: creators, format: false, suffix: "" },
    { emoji: "🎥", label: "Contenus estimés", value: contents, format: false, suffix: "" },
    { emoji: "🔗", label: "Trafic estimé", value: visits, format: true, suffix: " visites" },
  ];

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] top-1/3 -left-32" style={{ background: "#00B8E6", opacity: 0.3 + intensity * 0.25 }} aria-hidden />
      <div className="glow-orb w-[500px] h-[500px] bottom-0 -right-20" style={{ background: "#FF4FD8", opacity: 0.3 + intensity * 0.3 }} aria-hidden />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch">
          {/* LEFT */}
          <div className="rounded-2xl bg-white border border-border shadow-soft p-8 sm:p-10 flex flex-col">
            <span className="inline-block w-fit text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-4">
              Optionnel · Simulateur
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
              Une machine à <span className="text-gradient-brand">produire du contenu</span>, de la <span className="text-gradient-pink">visibilité</span> et des <span className="text-gradient-brand">ventes</span>.
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Les crédits te permettent d&apos;augmenter la visibilité de tes campagnes en activant plus de créateurs et en diffusant plus de contenu.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {["Plus de créateurs activés", "Plus de contenu diffusé", "Plus de visibilité", "Résultats plus rapides"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-gradient-brand-soft border border-pink-100 px-5 py-4">
              <p className="text-sm sm:text-base font-semibold text-foreground">
                Tu peux lancer <span className="text-gradient-brand">gratuitement</span>. Tu utilises des crédits pour <span className="text-gradient-brand">aller plus vite</span>.
              </p>
            </div>
          </div>

          {/* RIGHT (interactive) */}
          <div className="relative rounded-2xl border-gradient-brand p-8 sm:p-10 transition-shadow duration-500" style={{ boxShadow: `0 ${20 + intensity * 30}px ${50 + intensity * 40}px -20px rgba(0,184,230,${0.25 + intensity * 0.4}), 0 ${20 + intensity * 30}px ${50 + intensity * 40}px -20px rgba(255,79,216,${0.2 + intensity * 0.45})` }}>
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand-soft border border-pink-100 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Crédits</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{credits.toLocaleString("fr-FR")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Potentiel de ventes</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gradient-brand tabular-nums tracking-tight">~{sales.toLocaleString("fr-FR")}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">ventes estimées</p>
                </div>
              </div>

              {/* Tier badge */}
              <div className="flex items-center gap-2 mb-5 mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-soft" style={{ background: tierMeta.color }}>
                  {tierMeta.emoji} Niveau {tierMeta.label}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  · Impact {tier === "starter" ? "modéré" : tier === "growth" ? "avancé" : "élevé"}
                </span>
              </div>

              <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <Info className="w-4 h-4 text-pink-500" />
                Simule l&apos;impact de ta campagne
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Ajuste les crédits pour voir ce que ta marque peut atteindre.
              </p>

              {/* Slider */}
              <div className="mb-2">
                <div className="relative mb-1.5 h-4 hidden sm:block">
                  {tiers.map((t) => {
                    const left = pctOf(t.range[0]);
                    const width = pctOf(t.range[1]) - left;
                    const active = tier === t.key;
                    return (
                      <div key={t.key} className="absolute top-0 flex justify-center transition-all" style={{ left: `${left}%`, width: `${width}%` }}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-all ${active ? "" : "opacity-40"}`} style={{ color: t.color }}>{t.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="relative">
                  <div className="relative h-3 rounded-full bg-secondary border border-border overflow-hidden flex">
                    {tiers.map((t, i) => {
                      const segWidth = pctOf(t.range[1]) - pctOf(t.range[0]);
                      return (
                        <div key={t.key} className="h-full" style={{ width: `${segWidth}%`, background: `${t.color}14`, borderRight: i < tiers.length - 1 ? `1px dashed ${t.color}55` : "none" }} />
                      );
                    })}
                  </div>
                  <div className="absolute inset-y-0 left-0 h-3 rounded-full pointer-events-none" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #00B8E6, #8B5CF6, #FF4FD8)", boxShadow: `0 0 ${10 + intensity * 30}px rgba(255,79,216,${0.4 + intensity * 0.4})`, transition: "box-shadow 200ms ease-out" }} />
                  <input type="range" min={MIN} max={MAX} step={1} value={credits} onChange={(e) => setCredits(Number(e.target.value))} className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer" aria-label="Nombre de crédits" />
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ left: `${progress}%` }}>
                    <div className="w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderImage: "linear-gradient(90deg, #00B8E6, #FF4FD8) 1", boxShadow: `0 0 ${8 + intensity * 25}px rgba(255,79,216,${0.5 + intensity * 0.4}), 0 4px 12px rgba(17,24,39,0.15)` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, #00B8E6, #FF4FD8)" }} />
                    </div>
                  </div>
                </div>

                {/* Presets */}
                <div className="flex justify-between mt-4 text-xs">
                  {presets.map((p) => (
                    <button key={p} onClick={() => setCredits(p)} className={credits === p ? "px-3 py-1 rounded-full bg-gradient-brand text-white font-bold shadow-soft transition-all" : "px-3 py-1 rounded-full bg-secondary text-muted-foreground font-medium hover:text-foreground transition-colors"}>
                      {p.toLocaleString("fr-FR")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic line */}
              <div key={tier} className="mt-5 rounded-xl border bg-white/80 backdrop-blur px-4 py-3" style={{ borderColor: `${tierMeta.color}55` }}>
                <p className="text-sm font-semibold text-foreground">
                  <span style={{ color: tierMeta.color }}>→ </span>
                  {getDynamicLine(credits)}
                </p>
              </div>

              {/* Impact stats */}
              <div className="mt-6 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-pink-500" /> Impact estimé
                </p>
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-white/80 backdrop-blur border border-border px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{s.emoji}</span>
                      <span className="text-sm text-foreground/90 font-medium">{s.label}</span>
                    </div>
                    <span className="text-base font-bold text-gradient-brand tabular-nums">
                      {s.format ? formatNumber(s.value) : s.value.toLocaleString("fr-FR")}
                      {s.suffix}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 mt-2 border-gradient-brand" style={{ boxShadow: `0 10px 30px -10px rgba(0,184,230,${0.25 + intensity * 0.35})` }}>
                  <div className="relative flex items-center gap-2.5">
                    <span className="text-base">📡</span>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground block leading-none mb-1">Potentiel de diffusion</span>
                      <span className="text-xs text-muted-foreground">vues générées</span>
                    </div>
                  </div>
                  <div className="relative text-right">
                    <span className="text-2xl font-bold text-gradient-brand tabular-nums tracking-tight">Jusqu&apos;à {formatNumber(views)}+</span>
                    <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">vues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-2xl sm:text-3xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
          Plus tu actives de crédits, plus ta marque est <span className="text-gradient-brand">visible</span>.
          <br />
          Et plus elle est visible, plus elle génère de <span className="text-gradient-pink">ventes</span>.
        </p>
      </div>
    </section>
  );
}