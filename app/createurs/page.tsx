"use client";

import {
  ArrowRight, DollarSign, Check, Mail, Eye,
  TrendingUp, FileSignature,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CreatorHowItWorks from "@/components/sections/CreatorHowItWorks";
import CreatorTestimonials from "@/components/sections/CreatorTestimonials";
import CreatorBeforeAfter from "@/components/sections/CreatorBeforeAfter";
import CreatorFinalCTA from "@/components/sections/CreatorFinalCTA";

const PartnexxMachine = () => {
  const inputs = [
    { label: "TikTok", img: "/logo-tiktok.png", metric: "12k", color: "from-neutral-900 to-neutral-800", x: "8%" },
    { label: "Instagram", img: "/logo-instagram.png", metric: "8.4k", color: "from-fuchsia-500 via-rose-500 to-amber-400", x: "44%" },
    { label: "YouTube", img: "/logo-youtube.png", metric: "23k", color: "from-red-600 to-red-500", x: "78%" },
  ];

  const outputs = [
    { label: "+120 €", color: "bg-emerald-500", glow: "rgba(16,185,129,0.6)", x: "8%", icon: DollarSign },
    { label: "Mission", color: "bg-cyan-500", glow: "rgba(0,184,230,0.6)", x: "34%", icon: Mail },
    { label: "+250 €", color: "bg-emerald-500", glow: "rgba(16,185,129,0.6)", x: "60%", icon: DollarSign },
    { label: "Collab", color: "bg-gradient-brand", glow: "rgba(255,79,216,0.6)", x: "82%", icon: Check },
  ];

  return (
    <div className="relative w-full h-[600px]">
      <div className="absolute inset-0 rounded-[40px] bg-gradient-brand opacity-20 blur-3xl" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-50 blur-3xl animate-core-pulse" style={{ background: "radial-gradient(circle, #FF4FD8 0%, #00B8E6 60%, transparent 80%)" }} aria-hidden />

      {/* CARTES RÉSEAUX */}
      {inputs.map((c) => (
        <div key={c.label} className="absolute top-0 w-[72px] h-24" style={{ left: c.x }}>
          <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${c.color} flex flex-col items-center justify-center text-white overflow-hidden`} style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.45), 0 0 25px rgba(255,79,216,0.35)" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <img src={c.img} alt={c.label} className="w-10 h-10 mb-1 relative object-contain drop-shadow" />
            <span className="text-[9px] font-bold uppercase tracking-wider relative">{c.label}</span>
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between">
              <Eye className="w-2.5 h-2.5 opacity-80" />
              <span className="text-[9px] font-semibold opacity-90">{c.metric}</span>
            </div>
          </div>
        </div>
      ))}

      {/* BEAMS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="beamUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00B8E6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF4FD8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="beamDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4FD8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
          </linearGradient>
          <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[40, 140, 240, 340].map((x) => <path key={`hu-${x}`} d={`M${x},100 Q${(x + 200) / 2},220 200,300`} stroke="url(#beamUp)" strokeWidth="12" fill="none" opacity="0.35" filter="url(#beamGlow)" />)}
        {[40, 140, 240, 340].map((x) => <path key={`hd-${x}`} d={`M200,340 Q${(x + 200) / 2},440 ${x},540`} stroke="url(#beamDown)" strokeWidth="12" fill="none" opacity="0.35" filter="url(#beamGlow)" />)}
        {[40, 140, 240, 340].map((x) => <path key={`su-${x}`} d={`M${x},100 Q${(x + 200) / 2},220 200,300`} stroke="url(#beamUp)" strokeWidth="3" fill="none" opacity="0.85" />)}
        {[40, 140, 240, 340].map((x) => <path key={`sd-${x}`} d={`M200,340 Q${(x + 200) / 2},440 ${x},540`} stroke="url(#beamDown)" strokeWidth="3" fill="none" opacity="0.85" />)}
      </svg>

      {/* CORE LOGO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="absolute inset-0 -m-[120px] animate-spin-slow" style={{ animationDuration: "55s" }}>
          <div className="w-[440px] h-[440px] rounded-full" style={{ border: "2px solid rgba(255,79,216,0.7)", boxShadow: "0 0 30px rgba(255,79,216,0.5)" }} />
        </div>
        <div className="absolute inset-0 -m-20 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "40s" }}>
          <div className="rounded-full" style={{ width: "368px", height: "368px", border: "2.5px dashed rgba(0,184,230,0.85)" }} />
        </div>
        <div className="absolute inset-0 -m-10 animate-spin-slow" style={{ animationDuration: "30s" }}>
          <div className="rounded-full" style={{ width: "288px", height: "288px", border: "2.5px dotted rgba(139,92,246,0.85)" }} />
        </div>
        <div className="absolute inset-0 -m-32 rounded-full blur-3xl animate-core-pulse" style={{ background: "radial-gradient(circle, rgba(255,79,216,0.55) 0%, rgba(0,184,230,0.35) 50%, transparent 75%)" }} />
        <div className="relative w-72 h-72 flex items-center justify-center">
          <img src="/logo.png" alt="Partnexx" className="w-72 h-72 object-contain relative z-10 animate-hub-pulse" style={{ filter: "drop-shadow(0 0 30px rgba(0,184,230,0.95)) drop-shadow(0 0 55px rgba(255,79,216,0.75))" }} />
        </div>
      </div>

      {/* TOKENS BAS */}
      {outputs.map((o) => (
        <div key={o.label} className="absolute bottom-2" style={{ left: o.x }}>
          <div className={`flex items-center gap-2 rounded-full ${o.color} text-white px-3 py-2`} style={{ boxShadow: `0 20px 40px -10px rgba(0,0,0,0.35), 0 0 30px ${o.glow}` }}>
            <o.icon className="w-4 h-4" />
            <span className="text-xs font-bold whitespace-nowrap">{o.label}</span>
          </div>
        </div>
      ))}

      {/* CARTES FLOTTANTES */}
      <div className="absolute top-32 -left-12 rounded-2xl p-3 flex items-center gap-3 z-30" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 25px 50px -12px rgba(16,185,129,0.4)" }}>
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div>
        <div>
          <div className="text-xs font-bold text-foreground">+120 € reçu</div>
          <div className="text-[10px] text-muted-foreground">Il y a 2 min</div>
        </div>
      </div>

      <div className="absolute top-32 -right-12 rounded-2xl p-3 flex items-center gap-3 z-30" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 25px 50px -12px rgba(255,79,216,0.4)" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>
        <div>
          <div className="text-xs font-bold text-foreground">Collab validée</div>
          <div className="text-[10px] text-muted-foreground">Nuxe</div>
        </div>
      </div>

      <div className="absolute top-[50%] -left-6 rounded-full px-3 py-1.5 flex items-center gap-2 z-30" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 15px 30px -8px rgba(139,92,246,0.4)" }}>
        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"><FileSignature className="w-3 h-3 text-white" /></div>
        <span className="text-[10px] font-bold text-foreground">Contrat signé</span>
      </div>

      <div className="absolute top-[50%] -right-6 rounded-2xl px-3 py-2 z-30" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 20px 40px -10px rgba(255,79,216,0.3)" }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
          <div>
            <div className="text-[9px] text-muted-foreground leading-tight">Vues semaine</div>
            <div className="text-xs font-bold text-foreground leading-tight">+ 184 K</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 -right-12 rounded-2xl p-3 w-[180px] z-30" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 25px 50px -12px rgba(0,184,230,0.35)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold">N</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-foreground truncate">Nuxe Paris</div>
            <div className="text-[9px] text-muted-foreground">Mission UGC</div>
          </div>
          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-1.5 py-0.5">NEW</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Budget</span>
          <span className="text-sm font-bold text-foreground">250 €</span>
        </div>
      </div>
    </div>
  );
};

export default function CreateursPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative">
        <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
        <div className="glow-orb w-[560px] h-[560px] top-1/4 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />
        <div className="glow-orb w-[420px] h-[420px] bottom-0 left-1/3 opacity-40" style={{ background: "#8B5CF6" }} aria-hidden />

        <Navbar variant="createurs" />

        <div className="relative z-10 container grid lg:grid-cols-2 gap-12 items-center pt-4 lg:pt-8 pb-12">
          <div className="animate-count-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 mb-6 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Programme créateurs · Inscription gratuite</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] mb-6 text-foreground tracking-tight">
              Tu crées du contenu.<br />
              Partnexx le <span className="text-gradient-brand">monétise</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed">
              Le creator marketing — sans agence, sans attente, sans paperasse.
            </p>

            <a href="#cta" className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-brand px-9 py-5 text-lg font-semibold text-white shadow-glow animate-pulse-glow hover:scale-105 transition-transform">
              Rejoindre gratuitement
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1.5" />
            </a>
            <p className="text-xs text-muted-foreground mt-3">100% gratuit · aucune obligation · tu choisis tes campagnes</p>
          </div>

          <div className="relative">
            <PartnexxMachine />
          </div>
        </div>
      </section>

      <CreatorHowItWorks />
      <CreatorTestimonials />
      <CreatorBeforeAfter />
      <CreatorFinalCTA />

      <Footer />
    </main>
  );
}