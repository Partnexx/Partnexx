"use client";

import { useEffect, useState } from "react";
import { Eye, MousePointerClick, ShoppingBag } from "lucide-react";

const useCountUp = (target: number, duration = 1800) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
};

const Bars = () => {
  const heights = [30, 45, 38, 60, 52, 72, 65, 85, 92];
  return (
    <div className="flex items-end gap-2 h-24">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-brand opacity-80" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
};

type StatProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  prefix: string;
};

const StatCard = ({ icon: Icon, label, value, prefix }: StatProps) => {
  const v = useCountUp(value);
  return (
    <div className="rounded-2xl bg-white border border-border p-7 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <Icon className="w-4 h-4" /> {label}
      </div>
      <div className="text-5xl sm:text-6xl font-bold text-gradient-brand tabular-nums tracking-tight">
        {prefix}{v.toLocaleString("fr-FR")}
      </div>
    </div>
  );
};

const stats: StatProps[] = [
  { icon: Eye, label: "vues générées", value: 120000, prefix: "+" },
  { icon: MousePointerClick, label: "visites", value: 3200, prefix: "+" },
  { icon: ShoppingBag, label: "ventes attribuées", value: 184, prefix: "+" },
];

export default function Proof() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#00B8E6" }}>La preuve</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Des <span className="text-gradient-brand">résultats mesurables</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="rounded-2xl border-gradient-brand shadow-card p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Progression 90 jours</p>
              <p className="text-2xl font-bold text-foreground">+312% de portée organique</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-100 px-3 py-1 text-xs font-semibold" style={{ color: "#00B8E6" }}>↑ croissance composée</span>
          </div>
          <Bars />
        </div>
      </div>
    </section>
  );
}