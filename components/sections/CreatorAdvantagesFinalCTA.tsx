import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CreatorAdvantagesFinalCTA() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="container max-w-5xl">
        <div className="relative rounded-3xl bg-gradient-brand p-10 sm:p-14 text-center shadow-glow overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 20%, white, transparent 50%)" }} aria-hidden />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Partnexx ne te donne pas juste des opportunités.
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 font-medium mb-8">
              Il transforme ton contenu en <span className="underline decoration-white/60 underline-offset-4">revenus récurrents</span>.
            </p>
            <Link
              href="/createurs"
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-pink-500 shadow-card hover:scale-[1.04] transition-transform"
            >
              Rejoindre gratuitement
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}