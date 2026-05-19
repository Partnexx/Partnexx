"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Est-ce vraiment gratuit ?",
    a: "Oui. Tu lances ta première campagne sans carte bancaire. Tu ne payes qu'une commission sur les ventes générées.",
  },
  {
    q: "Comment sont choisis les créateurs ?",
    a: "On matche ta marque avec les créateurs les plus pertinents de ta niche, en fonction de leur audience, de leurs taux d'engagement et de leurs performances passées.",
  },
  {
    q: "Quels résultats puis-je attendre ?",
    a: "En moyenne, nos marques génèrent +120k vues et leurs premières ventes dès la première campagne. Le Notoriété Boost amplifie ces résultats à partir de la 3ème campagne.",
  },
  {
    q: "Combien de temps pour lancer ?",
    a: "Brief en 2 minutes, sélection des créateurs sous 48h, publication sous 7 jours.",
  },
  {
    q: "Sur quels réseaux ?",
    a: "TikTok, Instagram, YouTube Shorts. On choisit les meilleurs formats pour ta marque.",
  },
];

export default function FAQ() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container max-w-3xl">
        <div className="mb-12 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#00B8E6" }}>FAQ</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Tu as <span className="text-gradient-brand">des questions</span> ?
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl bg-white border border-border shadow-soft px-5 data-[state=open]:shadow-card transition-shadow">
              <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline py-5">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}