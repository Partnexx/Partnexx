"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import PricingPlans from "@/components/sections/PricingPlans";
import PricingBoost from "@/components/sections/PricingBoost";
import PricingBoostIncluded from "@/components/sections/PricingBoostIncluded";
import CreditsInteractive from "@/components/sections/CreditsInteractive";
import PricingComparison from "@/components/sections/PricingComparison";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
        <div className="glow-orb w-[560px] h-[560px] top-0 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />

        <Navbar variant="marques" />

        <div className="container relative pt-12 lg:pt-20 pb-16 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">
            Pricing
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-foreground tracking-tight mb-6">
            Un pricing basé <br className="hidden sm:block" />sur tes <span className="text-gradient-brand">résultats</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Lance gratuitement. Paye seulement si ça marche. Scale quand tu vois les résultats.
          </p>
        </div>
      </section>

      <PricingPlans />
      <PricingBoost />
      <PricingBoostIncluded />
      <CreditsInteractive />
      <PricingComparison />
      <FAQ />
      <FinalCTA />

      <Footer />
    </main>
  );
}