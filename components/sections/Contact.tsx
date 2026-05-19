"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, MessageCircle, Send, X, Minus, Calendar } from "lucide-react";

const QUICK_REPLIES_CREATORS = [
  "💸 Comment je suis payé ?",
  "🎬 Trouver une mission",
  "📊 Comprendre mon Partnexx Score",
  "🚀 Devenir Partner",
];

const QUICK_REPLIES_BRANDS = [
  "💰 Combien ça coûte ?",
  "🚀 Lancer ma 1ère campagne",
  "📊 Voir des résultats clients",
  "🎯 Comment fonctionne le matching ?",
];

const BOT_RESPONSES: Record<string, string> = {
  "💸 Comment je suis payé ?": "Les paiements sont versés sous 7 jours après validation de tes livrables. Aucun frais, virement SEPA direct sur ton compte. 💚",
  "🎬 Trouver une mission": "Connecte-toi à ton dashboard, va dans 'Missions' et postule en 1 clic. Tu peux filtrer par niche, budget et type de campagne. 🎯",
  "📊 Comprendre mon Partnexx Score": "Ton Partnexx Score se calcule sur la qualité des livrables, le respect des délais, la satisfaction des marques et ta régularité. Plus il monte, plus tu débloques d'avantages ! ✨",
  "🚀 Devenir Partner": "Pour devenir Partnexx Partner, atteins le niveau Or sur ton Partnexx Score. Tu débloques alors un lien personnalisé qui te rapporte 15% sur les abonnements marques. 💰",
  "💰 Combien ça coûte ?": "On a 4 formules : Free (15% commission), Growth (99€/mois, 10%), Scale (299€/mois, 7%) et Enterprise (sur mesure). Aucun engagement, résiliable à tout moment.",
  "🚀 Lancer ma 1ère campagne": "Crée ton compte gratuitement, publie ton brief en 5 min, on s'occupe du matching avec les créateurs. Tu valides, on gère le paiement et le suivi. 🚀",
  "📊 Voir des résultats clients": "Nos marques mesurent un ROI moyen x4 et génèrent +180% de visibilité grâce au Notoriété Boost. Veux-tu un cas d'usage détaillé ?",
  "🎯 Comment fonctionne le matching ?": "Notre IA analyse votre brief (audience cible, ton de marque, budget) et vous propose les créateurs les plus adaptés selon leurs performances passées. ⚡",
};

type ChatMessage = {
  id: string;
  from: "agent" | "user";
  text: string;
  time: string;
};

const getTime = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

export default function Contact({ variant = "creators" }: { variant?: "creators" | "brands" }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      from: "agent",
      text: variant === "creators"
        ? "Salut 👋 Je suis Léa de l'équipe Partnexx ! Comment puis-je t'aider aujourd'hui ?"
        : "Bonjour 👋 Je suis Léa de l'équipe Brand Partnexx ! Comment puis-je vous accompagner ?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = variant === "creators" ? QUICK_REPLIES_CREATORS : QUICK_REPLIES_BRANDS;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = BOT_RESPONSES[text] || (variant === "creators"
        ? "Merci pour ton message ! Notre équipe te répondra dans les plus brefs délais. 💬"
        : "Merci pour votre message ! Notre équipe vous répondra dans les plus brefs délais. 💬");
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        from: "agent",
        text: reply,
        time: getTime(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const config = variant === "creators"
    ? {
        eyebrow: "Espace créateurs · Contact",
        title: "Une question ?",
        titleGradient: "On te répond direct.",
        subtitle: "Missions, paiements, Partnexx Score, contenus — notre équipe support est là pour toi. Choisis ton canal préféré.",
        emailLabel: "Email",
        emailValue: "hello@partnexx.com",
        emailDesc: "Réponse sous 24h ouvrées",
        socialTitle: "Instagram",
        socialValue: "@partnexx",
        socialHref: "https://instagram.com/partnexx",
        socialDesc: "DM ouverts en permanence",
        socialIcon: "📸",
        socialColor: "from-pink-500 to-rose-500",
        bookingTitle: "Audit profil gratuit",
        bookingValue: "30 min en visio",
        bookingDesc: "On analyse ton profil et tes opportunités",
        floatingButtonLabel: "Parler au support",
      }
    : {
        eyebrow: "Espace entreprises · Contact",
        title: "Besoin d'un expert ?",
        titleGradient: "On vous répond direct.",
        subtitle: "Une question, une demande de démo, un devis ? Notre équipe Brand est là pour booster vos campagnes.",
        emailLabel: "Email",
        emailValue: "hello@partnexx.com",
        emailDesc: "Devis et démo sous 24h ouvrées",
        socialTitle: "LinkedIn",
        socialValue: "Partnexx",
        socialHref: "https://linkedin.com/company/partnexx",
        socialDesc: "Suis nos cas clients et études ROI",
        socialIcon: "in",
        socialColor: "from-blue-600 to-blue-500",
        bookingTitle: "Démo personnalisée",
        bookingValue: "30 min en visio",
        bookingDesc: "Découvre Partnexx en live avec un expert",
        floatingButtonLabel: "Parler à un expert",
      };

  return (
    <>
      <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
        <div className="container relative max-w-6xl">
          {/* HEADER */}
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-4">
              {config.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
              {config.title} <span className="text-gradient-brand">{config.titleGradient}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          </div>

          {/* 3 CARTES CHANNELS */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Carte Démo / Audit (NEW) */}
            <button onClick={() => setChatOpen(true)} className="text-left">
              <div className="relative rounded-2xl bg-white border border-border shadow-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card cursor-pointer h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-glow">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-bold text-foreground">{config.bookingTitle}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gratuit
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">{config.bookingValue}</div>
                <p className="text-xs text-muted-foreground">{config.bookingDesc}</p>
              </div>
            </button>

            {/* Carte Email */}
            <a href={`mailto:${config.emailValue}`} className="block">
              <div className="rounded-2xl bg-white border border-border shadow-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card cursor-pointer h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center text-white mb-4 shadow-glow">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">{config.emailLabel}</h3>
                <div className="text-sm font-semibold text-foreground mb-2">{config.emailValue}</div>
                <p className="text-xs text-muted-foreground">{config.emailDesc}</p>
              </div>
            </a>

            {/* Carte Social */}
            <a href={config.socialHref} target="_blank" rel="noopener noreferrer" className="block">
              <div className="rounded-2xl bg-white border border-border shadow-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.socialColor} flex items-center justify-center text-white font-bold text-xl mb-4 shadow-glow`}>
                  {config.socialIcon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">{config.socialTitle}</h3>
                <div className="text-sm font-semibold text-foreground mb-2">{config.socialValue}</div>
                <p className="text-xs text-muted-foreground">{config.socialDesc}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* BOUTON FLOTTANT BAS DROITE (REMONTÉ) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-24 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-glow hover:scale-[1.04] transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
          {config.floatingButtonLabel}
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </button>
      )}
      {/* CHAT LIVE FLOTTANT (REMONTÉ AUSSI) */}
      {chatOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-white border border-border shadow-2xl overflow-hidden transition-all ${chatMinimized ? "h-14" : "h-[520px]"}`}>
          {/* Header chat */}
          <div className="flex items-center justify-between bg-gradient-brand px-4 py-3 cursor-pointer" onClick={() => setChatMinimized(!chatMinimized)}>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                L
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Léa · {variant === "creators" ? "Support" : "Expert Brand"} Partnexx</div>
                <div className="text-[10px] text-white/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  En ligne · Répond en quelques minutes
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setChatMinimized(!chatMinimized); }}
                className="w-7 h-7 rounded-lg hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                aria-label="Minimiser"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setChatOpen(false); }}
                className="w-7 h-7 rounded-lg hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!chatMinimized && (
            <>
              {/* Messages */}
              <div className="overflow-y-auto p-4 space-y-3 bg-secondary/20" style={{ height: "calc(100% - 56px - 130px)" }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${msg.from === "user" ? "" : "flex gap-2 items-end"}`}>
                      {msg.from === "agent" && (
                        <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                          L
                        </div>
                      )}
                      <div>
                        <div className={`rounded-2xl px-3 py-2 text-sm ${msg.from === "user" ? "bg-gradient-brand text-white rounded-br-sm" : "bg-white border border-border text-foreground rounded-bl-sm"}`}>
                          {msg.text}
                        </div>
                        <div className={`text-[10px] text-muted-foreground mt-1 ${msg.from === "user" ? "text-right" : ""}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                        L
                      </div>
                      <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-3 py-2.5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 2 && !isTyping && (
                <div className="px-4 py-2 bg-white border-t border-border">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Suggestions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickReplies.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 font-medium hover:bg-cyan-100 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2 p-3 bg-white border-t border-border"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écris ton message..."
                  className="flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-300"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-soft disabled:opacity-40 hover:scale-[1.04] transition-all"
                  aria-label="Envoyer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}