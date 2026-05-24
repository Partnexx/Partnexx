"use client";

import Link from "next/link";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Bell } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative h-screen overflow-hidden flex flex-col">
      <div
        className="glow-orb w-[520px] h-[520px] -top-40 -left-32"
        style={{ background: "#00B8E6" }}
        aria-hidden
      />
      <div
        className="glow-orb w-[560px] h-[560px] top-1/4 -right-40"
        style={{ background: "#FF4FD8" }}
        aria-hidden
      />
      <div
        className="glow-orb w-[820px] h-[820px] top-1/3 left-1/2 -translate-x-1/2 opacity-25 blur-[120px]"
        style={{ background: "#8B5CF6" }}
        aria-hidden
      />

      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
        aria-hidden
      />

      <Navbar variant="landing" />

      <section className="relative z-10 container flex-1 flex flex-col items-center justify-center py-6 lg:py-8 min-h-0">
        <div className="text-center max-w-3xl animate-count-up">
          <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] font-bold leading-[1.02] mb-5 text-foreground tracking-tight">
            Une plateforme. <br />
            <span className="text-gradient-brand">Deux expériences.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Deux expériences pensées pour les marques et les créateurs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-5xl lg:-mt-2">
          {/* Carte Marques */}
          <Link
            href="/marques"
            className="group relative rounded-3xl bg-white/90 backdrop-blur border border-border shadow-card p-6 lg:p-7 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(139,92,246,0.35)] hover:border-pink-brand/40 flex flex-col"
          >
            <div
              className="absolute -inset-px rounded-3xl bg-gradient-to-br from-pink-brand/0 via-violet-500/0 to-cyan-brand/0 group-hover:from-pink-brand/30 group-hover:via-violet-500/25 group-hover:to-cyan-brand/25 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none -z-10"
              aria-hidden
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-brand-soft opacity-0 group-hover:opacity-60 transition-opacity duration-500" aria-hidden />
            <div className="relative flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4 shadow-soft transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                <Megaphone className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 tracking-tight">
                Je suis une marque
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Lance des campagnes, trouve les bons créateurs et mesure tes performances.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Matching IA", "Analytics", "Paiements sécurisés"].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/95 backdrop-blur px-3 py-1 text-[12px] font-semibold text-foreground/80 shadow-sm"
                  >
                    <span className="text-emerald-500">✔</span>
                    {b}
                  </span>
                ))}
              </div>
              <span className="mt-auto self-start inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-base font-semibold text-white shadow-glow brightness-105 group-hover:brightness-110 group-hover:gap-3 transition-all">
                Lancer une campagne
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Carte Créateurs */}
          <Link
            href="/createurs"
            className="group relative rounded-3xl bg-white/90 backdrop-blur border border-border shadow-card p-6 lg:p-7 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(139,92,246,0.35)] hover:border-cyan-brand/40 flex flex-col"
          >
            <div
              className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-brand/0 via-violet-500/0 to-pink-brand/0 group-hover:from-cyan-brand/30 group-hover:via-violet-500/25 group-hover:to-pink-brand/25 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none -z-10"
              aria-hidden
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-brand-soft opacity-0 group-hover:opacity-60 transition-opacity duration-500" aria-hidden />
            <div className="relative flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4 shadow-soft transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 tracking-tight">
                Je suis un créateur
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Accède à des collaborations, développe ton audience et monétise ton contenu.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Contrats automatisés", "Campagnes rémunérées", "Partnexx Score"].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/95 backdrop-blur px-3 py-1 text-[12px] font-semibold text-foreground/80 shadow-sm"
                  >
                    <span className="text-emerald-500">✔</span>
                    {b}
                  </span>
                ))}
              </div>
              <span className="mt-auto self-start inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-base font-semibold text-white shadow-glow brightness-105 group-hover:brightness-110 group-hover:gap-3 transition-all">
                Rejoindre Partnexx
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}