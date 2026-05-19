"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import MarquesAdvantagesCampaigns from "@/components/sections/MarquesAdvantagesCampaigns";
import MarquesAdvantagesAnalytics from "@/components/sections/MarquesAdvantagesAnalytics";
import MarquesAdvantagesContracts from "@/components/sections/MarquesAdvantagesContracts";
import MarquesAdvantagesFinalCTA from "@/components/sections/MarquesAdvantagesFinalCTA";

export default function MarquesAvantagesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="glow-orb w-[500px] h-[500px] top-0 -left-32 opacity-40" style={{ background: "#00B8E6" }} aria-hidden />
        <div className="glow-orb w-[520px] h-[520px] bottom-0 -right-32 opacity-40" style={{ background: "#FF4FD8" }} aria-hidden />

        <Navbar variant="marques" />

        <div className="container relative pt-12 lg:pt-20 pb-16 text-center max-w-4xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-4">
            Avantages
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-foreground tracking-tight mb-6">
            Lance. Active. <span className="text-gradient-brand">Performe.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lance tes campagnes, trouve les bons créateurs et mesure tes résultats.
          </p>
        </div>
      </section>

      <MarquesAdvantagesCampaigns />
      <MarquesAdvantagesAnalytics />
      <MarquesAdvantagesContracts />
      <MarquesAdvantagesFinalCTA />
      
      <Footer />
    </main>
  );
}