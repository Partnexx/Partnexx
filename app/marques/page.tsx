"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Boost from "@/components/sections/Boost";
import Proof from "@/components/sections/Proof";
import DualEngine from "@/components/sections/DualEngine";
import ForWho from "@/components/sections/ForWho";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function MarquesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[560px] h-[560px] top-1/4 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[420px] h-[420px] bottom-0 left-1/3 opacity-40" style={{ background: "#8B5CF6" }} aria-hidden />

      <Navbar variant="marques" />
      <Hero />
      <Problem />
      <Solution />
      <Boost />
      <Proof />
      <DualEngine />
      <ForWho />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}