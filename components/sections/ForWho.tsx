import { ShoppingCart, Rocket, TrendingUp } from "lucide-react";

const items = [
  { icon: ShoppingCart, title: "E-commerce", desc: "DTC, Shopify, marques produits" },
  { icon: Rocket, title: "Startups", desc: "Lancement, traction, premiers utilisateurs" },
  { icon: TrendingUp, title: "Marques en croissance", desc: "Scale, expansion, nouveaux marchés" },
];

export default function ForWho() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#FF4FD8" }}>Pour qui</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
            Conçu pour les marques <br className="hidden sm:block" />qui veulent <span className="text-gradient-brand">scaler</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="rounded-2xl bg-white border border-border p-7 shadow-soft hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand-soft border border-cyan-100 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5" style={{ color: "#00B8E6" }} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}