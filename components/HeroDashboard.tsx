"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Eye, ShoppingBag, Sparkles } from "lucide-react";

const useCountUp = (target: number, duration = 1600, tick = true) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    let reached = target;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * reached));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    let interval: ReturnType<typeof setInterval> | undefined;
    if (tick) {
      interval = setInterval(() => {
        const bump = Math.max(1, Math.floor(target * 0.0008));
        reached += bump;
        setVal((v) => v + bump);
      }, 1800);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (interval) clearInterval(interval);
    };
  }, [target, duration, tick]);
  return val;
};

const Sparkline = () => {
  const points = [8, 14, 11, 22, 19, 30, 27, 42, 48, 56, 52, 68, 78];
  const max = Math.max(...points);
  const w = 280;
  const h = 80;
  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF4FD8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00B8E6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sparkStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00B8E6" />
          <stop offset="100%" stopColor="#FF4FD8" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path d={path} fill="none" stroke="url(#sparkStroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function HeroDashboard() {
  const revenue = useCountUp(12480);
  const views = useCountUp(120300);
  const sales = useCountUp(184);

  return (
    <div className="relative animate-float-slow">
      <div className="absolute -inset-8 bg-gradient-brand opacity-25 blur-3xl rounded-[2.5rem]" aria-hidden />

      <div className="relative border-gradient-brand shadow-card p-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-pink-brand" />
              <span className="text-xs font-medium text-foreground">Notoriété Boost activé</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-2.5 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-brand" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-brand">Live</span>
            </span>
          </div>

          <div className="mb-5">
            <p className="text-xs text-muted-foreground mb-1">Revenus générés</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-gradient-brand tabular-nums tracking-tight">
                +{revenue.toLocaleString("fr-FR")}€
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold pb-2">
                <TrendingUp className="w-3 h-3" /> +28%
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-secondary/60 p-3 mb-5 border border-border/70">
            <Sparkline />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-3 border border-border shadow-soft">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-1">
                <Eye className="w-3 h-3" /> Vues
              </div>
              <p className="text-lg font-semibold text-gradient-brand tabular-nums">
                +{views.toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-border shadow-soft">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-1">
                <ShoppingBag className="w-3 h-3" /> Ventes
              </div>
              <p className="text-lg font-semibold text-gradient-brand tabular-nums">+{sales}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-gradient-brand-soft px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-brand animate-pulse" />
              <span className="text-sm font-medium text-foreground">Campagne #04 en cours</span>
            </div>
            <span className="text-xs text-muted-foreground">3 créateurs</span>
          </div>
        </div>
      </div>
    </div>
  );
}