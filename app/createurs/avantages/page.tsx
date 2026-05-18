"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CreatorAdvantagesCampaigns from "@/components/sections/CreatorAdvantagesCampaigns";
import CreatorAdvantagesPartner from "@/components/sections/CreatorAdvantagesPartner";
import CreatorAdvantagesRanks from "@/components/sections/CreatorAdvantagesRanks";
import CreatorAdvantagesFinalCTA from "@/components/sections/CreatorAdvantagesFinalCTA";

export default function CreateursAvantagesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
        <div className="glow-orb w-[560px] h-[560px] top-0 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />

        <Navbar variant="createurs" />

        <div className="container relative pt-12 lg:pt-20 pb-16 text-center max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-4">
            Avantages
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-foreground tracking-tight mb-6">
            Collabore. Monétise. <br /><span className="text-gradient-brand">Encaisse.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout au même endroit.
          </p>
        </div>
      </section>

      <CreatorAdvantagesCampaigns />
      <CreatorAdvantagesPartner />
      <CreatorAdvantagesRanks />
      <CreatorAdvantagesFinalCTA />

      <Footer />
    </main>
  );
}