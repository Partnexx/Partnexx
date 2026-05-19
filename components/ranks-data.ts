export type RankDetail = {
  name: string;
  emoji: string;
  color: string;
  accent: string;
  ring: string;
  reward: string;
  bonus: string;
  perks: { icon: string; text: string }[];
};

export const RANK_DETAILS: RankDetail[] = [
  {
    name: "Bronze",
    emoji: "🥉",
    color: "#b45309",
    accent: "#fbbf24",
    ring: "#f59e0b",
    reward: "Ton évolution commence ici",
    bonus: "Débloque tes premières opportunités",
    perks: [
      { icon: "🎯", text: "Défis quotidiens débloqués" },
      { icon: "✅", text: "Profil créateur vérifié" },
      { icon: "📊", text: "Dashboard débloqué" },
      { icon: "💸", text: "Flux financiers : retraits activés" },
    ],
  },
  {
    name: "Argent",
    emoji: "🥈",
    color: "#94a3b8",
    accent: "#f1f5f9",
    ring: "#cbd5e1",
    reward: "Plus d'opportunités",
    bonus: "Progression créateur accélérée",
    perks: [
      { icon: "✅", text: "Défis hebdomadaires débloqués" },
      { icon: "📊", text: "Statistiques avancées" },
      { icon: "🎨", text: "Thèmes de profil exclusifs" },
      { icon: "🎯", text: "Multiplicateur Partnexx Score x1,5" },
    ],
  },
  {
    name: "Or",
    emoji: "🥇",
    color: "#d97706",
    accent: "#fde68a",
    ring: "#fbbf24",
    reward: "Campagnes mieux payées",
    bonus: "Développe ton activité créateur",
    perks: [
      { icon: "✅", text: "Défis mensuels débloqués" },
      { icon: "📊", text: "Analytics créateurs complets" },
      { icon: "🎨", text: "Personnalisation avancée du profil" },
      { icon: "🎯", text: "Suivi détaillé des performances collaborations" },
    ],
  },
  {
    name: "Platine",
    emoji: "💎",
    color: "#22d3ee",
    accent: "#cffafe",
    ring: "#67e8f9",
    reward: "Priorité + visibilité",
    bonus: "Débloque les avantages premium",
    perks: [
      { icon: "🛍️", text: "Marketplace débloquée" },
      { icon: "🤖", text: "Accès aux IA Partnexx" },
      { icon: "📈", text: "Historique revenus avancé" },
      { icon: "🎧", text: "Support prioritaire" },
    ],
  },
  {
    name: "Diamant",
    emoji: "🔥",
    color: "#06b6d4",
    accent: "#a78bfa",
    ring: "#22d3ee",
    reward: "Campagnes exclusives",
    bonus: "Accès créateur avancé",
    perks: [
      { icon: "✨", text: "Opportunités exclusives débloquées" },
      { icon: "🛍️", text: "Marketplace Premium débloquée" },
      { icon: "🚀", text: "Accès anticipé aux nouveautés Partnexx" },
      { icon: "💎", text: "Récompenses créateur augmentées sur les invitations de marques" },
    ],
  },
  {
    name: "Élite",
    emoji: "👑",
    color: "#d946ef",
    accent: "#f472b6",
    ring: "#e879f9",
    reward: "Accès premium + mises en avant",
    bonus: "Cercle premium Partnexx",
    perks: [
      { icon: "🤝", text: "Collaborations premium négociées" },
      { icon: "📢", text: "Mise en avant sur le LinkedIn de Partnexx" },
      { icon: "💼", text: "Campagnes confidentielles" },
      { icon: "👑", text: "Accès complet à l'écosystème PARTNEXX" },
    ],
  },
  {
    name: "Champion",
    emoji: "🚀",
    color: "#8b5cf6",
    accent: "#e879f9",
    ring: "#a78bfa",
    reward: "Boost de visibilité",
    bonus: "Niveau créateur reconnu",
    perks: [
      { icon: "🌟", text: "Mise en avant sur le Instagram de PARTNEXX" },
      { icon: "🤝", text: "Opportunités premium débloquées" },
      { icon: "🎁", text: "Partnexx Score X2" },
      { icon: "💎", text: "Avantages marketplace" },
    ],
  },
  {
    name: "Légende",
    emoji: "🌟",
    color: "#ec4899",
    accent: "#fbbf24",
    ring: "#f472b6",
    reward: "Top créateurs + revenus max",
    bonus: "Niveau maximum Partnexx",
    perks: [
      { icon: "💰", text: "Frais Partnexx réduits de 2%" },
      { icon: "🏆", text: "Statut \"Top Créateur\"" },
      { icon: "🎫", text: "Invitations privées Partnexx" },
      { icon: "🧠", text: "Conseiller stratégique dédié" },
    ],
  },
];