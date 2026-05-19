import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  lastUpdate: string;
  version?: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
};

export default function LegalLayout({ eyebrow, title, lastUpdate, version, toc, children }: LegalLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[560px] h-[560px] top-1/4 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />

      <Navbar variant="landing" />

      <section className="relative z-10 container py-12 lg:py-20">
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour : <span className="font-semibold text-foreground">{lastUpdate}</span>
            {version && <> · Version <span className="font-semibold text-foreground">{version}</span></>}
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10 max-w-6xl mx-auto">
          {/* TOC (sommaire) sticky desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl bg-white border border-border shadow-soft p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Sommaire</div>
              <ul className="space-y-2">
                {toc.map((item, i) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="group flex gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                      <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                      <span className="group-hover:text-gradient-brand">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CONTENU */}
          <article className="rounded-2xl bg-white border border-border shadow-soft p-8 sm:p-12">
            <div className="legal-content max-w-none">
              {children}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}