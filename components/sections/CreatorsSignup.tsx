"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Music2,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  Users,
  Link2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Niche =
  | "Mode" | "Beauté" | "Lifestyle" | "Tech" | "Gaming" | "Food"
  | "Fitness" | "Voyage" | "Business" | "Humour" | "Musique" | "Éducation";

const NICHES: Niche[] = [
  "Mode", "Beauté", "Lifestyle", "Tech", "Gaming", "Food",
  "Fitness", "Voyage", "Business", "Humour", "Musique", "Éducation",
];

const STEPS = ["Compte", "Onboarding"] as const;

type PlatformKey = "instagram" | "tiktok" | "youtube";
type ConnectedKey = "instagramConnected" | "tiktokConnected" | "youtubeConnected";

// SVG Instagram (lucide-react n'a pas Instagram dans cette version)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const PLATFORMS = [
  {
    key: "instagram" as const,
    label: "Instagram",
    Icon: InstagramIcon,
    color: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    provider: "Meta",
    benefit: "Ton profil est maintenant éligible aux campagnes Instagram.",
    permissions: [
      "Nom d'utilisateur",
      "Photo de profil",
      "Nombre d'abonnés",
      "Statistiques publiques",
    ],
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    Icon: Music2,
    color: "from-[#25F4EE] via-[#000000] to-[#FE2C55]",
    provider: "TikTok",
    benefit: "Les marques pourront te découvrir sur leurs campagnes TikTok.",
    permissions: [
      "Nom d'utilisateur",
      "Photo de profil",
      "Nombre d'abonnés",
      "Vues & engagements publics",
    ],
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    Icon: YoutubeIcon,
    color: "from-[#FF0000] to-[#CC0000]",
    provider: "Google",
    benefit: "Tu débloques les briefs vidéo et les campagnes long-format.",
    permissions: [
      "Nom de la chaîne",
      "Avatar de chaîne",
      "Nombre d'abonnés",
      "Vues publiques",
    ],
  },
];

const MOCK_PROFILES: Record<PlatformKey, { username: string; followers: string; avatarGradient: string }> = {
  instagram: { username: "@lea.martin", followers: "24.8K", avatarGradient: "from-[#F58529] to-[#DD2A7B]" },
  tiktok: { username: "@lea.creates", followers: "41.2K", avatarGradient: "from-[#25F4EE] to-[#FE2C55]" },
  youtube: { username: "Léa Martin", followers: "8.6K", avatarGradient: "from-[#FF0000] to-[#CC0000]" },
};

export default function CreatorsSignup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<PlatformKey | null>(null);
  const [analyzing, setAnalyzing] = useState<PlatformKey | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cgu: false,
    ageGroup: "" as "" | "minor" | "adult",
    instagram: "",
    instagramFollowers: "",
    instagramConnected: false,
    tiktok: "",
    tiktokFollowers: "",
    tiktokConnected: false,
    youtube: "",
    youtubeFollowers: "",
    youtubeConnected: false,
    niches: [] as Niche[],
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleNiche = (n: Niche) => {
    setForm((f) => {
      if (f.niches.includes(n)) return { ...f, niches: f.niches.filter((x) => x !== n) };
      if (f.niches.length >= 3) {
        toast("3 niches max", { description: "Désélectionne-en une pour en choisir une autre." });
        return f;
      }
      return { ...f, niches: [...f.niches, n] };
    });
  };

  const canNext = () => {
    if (step === 0)
      return (
        form.firstName.trim().length > 1 &&
        form.lastName.trim().length > 1 &&
        form.email.includes("@") &&
        form.password.length >= 6 &&
        form.cgu &&
        form.ageGroup !== ""
      );
    if (step === 1)
      return (
        (form.instagramConnected || form.tiktokConnected || form.youtubeConnected) &&
        form.niches.length > 0
      );
    return false;
  };

  const next = () => {
    if (!canNext()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success("Bienvenue dans Partnexx 🎉", {
          description: "Ton compte créateur est prêt. On t'envoie déjà des matchs !",
        });
        router.push("/createurs");
      }, 900);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const openConnection = (platform: PlatformKey) => {
    setConnecting(platform);
  };

  const closeConnection = () => {
    setConnecting(null);
  };

  const completeConnection = (platformKey: PlatformKey) => {
    setConnecting(null);
    setAnalyzing(platformKey);
    setAnalyzeProgress(8);
    setTimeout(() => setAnalyzeProgress(45), 400);
    setTimeout(() => setAnalyzeProgress(78), 1100);
    setTimeout(() => {
      setAnalyzeProgress(100);
      const followersKey = `${platformKey}Followers` as "instagramFollowers" | "tiktokFollowers" | "youtubeFollowers";
      const connectedKey = `${platformKey}Connected` as ConnectedKey;
      const profile = MOCK_PROFILES[platformKey];
      update(platformKey, profile.username);
      update(followersKey, profile.followers);
      update(connectedKey, true);
      setAnalyzing(null);
      setAnalyzeProgress(0);
      toast.success(`${PLATFORMS.find((p) => p.key === platformKey)?.label} connecté`, { description: profile.username });
    }, 1900);
  };
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Halos colorés en fond */}
      <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[560px] h-[560px] top-1/4 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[420px] h-[420px] bottom-0 left-1/3 opacity-40" style={{ background: "#8B5CF6" }} aria-hidden />

      <section className="relative z-10 container mx-auto px-4 flex-1 flex items-center justify-center py-10 lg:py-16">
        <div className="w-full max-w-xl">
          {/* Retour */}
          <Link href="/createurs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-gray-200 text-xs font-medium text-gray-600 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#00B8E6]" />
              Inscription gratuite — 2 minutes
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Rejoins <span className="text-gradient-brand">Partnexx</span>
            </h1>
            <p className="text-gray-500">
              Crée ton profil créateur et reçois tes premiers matchs marques.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-6 px-1">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                    i < step
                      ? "bg-gradient-brand text-white"
                      : i === step
                      ? "bg-gray-900 text-white ring-4 ring-gray-900/10"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      i < step ? "bg-gradient-brand" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white border border-gray-200 shadow-card p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Étape {step + 1} / {STEPS.length}
              </p>
              <h2 className="text-xl font-semibold text-gray-900">{STEPS[step]}</h2>
            </div>

            {/* Step 0 — Compte */}
            {step === 0 && (
              <div className="space-y-4">
                {/* Boutons sociaux */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toast("Google bientôt disponible")}
                    className="h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1S8.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => toast("Apple bientôt disponible")}
                    className="h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.3.9-1.3 1.2-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.6zM14 5.4c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.3z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Séparateur OU */}
                <div className="relative my-2 flex items-center">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="px-3 text-xs text-gray-500 uppercase tracking-wider">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Prénom + Nom */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-900">Prénom</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        id="firstName"
                        placeholder="Léa"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-900">Nom</label>
                    <input
                      id="lastName"
                      placeholder="Martin"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-900">Adresse mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      placeholder="toi@exemple.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-900">Mot de passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="6 caractères minimum"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      className="w-full h-11 pl-9 pr-10 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* CGU + Âge */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="cgu"
                      checked={form.cgu}
                      onChange={(e) => update("cgu", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#00B8E6] focus:ring-[#00B8E6]"
                    />
                    <span className="text-sm text-gray-500 leading-snug">
                      J&apos;accepte les{" "}
                      <Link href="/cgu" className="text-gray-900 font-medium hover:underline">
                        Conditions Générales d&apos;Utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/politique-confidentialite" className="text-gray-900 font-medium hover:underline">
                        Politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 leading-snug">
                      Quel âge as-tu ? <span className="text-gray-900 font-medium">(15 ans minimum)</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "minor", label: "15 – 17 ans", sub: "Mineur" },
                        { id: "adult", label: "18 ans et +", sub: "Majeur" },
                      ].map((opt) => {
                        const active = form.ageGroup === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => update("ageGroup", opt.id as "minor" | "adult")}
                            className={`relative flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                              active
                                ? "border-transparent bg-gradient-brand text-white shadow-soft"
                                : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
                            }`}
                          >
                            <span className="text-sm font-semibold">{opt.label}</span>
                            <span className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
                              {opt.sub}
                            </span>
                            {active && (
                              <Check className="absolute top-2 right-2 w-4 h-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 1 — Onboarding */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Quelques infos pour personnaliser tes matchs marques.
                </p>

                {/* Connecte tes réseaux */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900">Connecte tes réseaux</label>
                    <span className="text-xs text-gray-500">Au moins 1 plateforme</span>
                  </div>

                  {PLATFORMS.map(({ key, label, Icon, color, provider, benefit }) => {
                    const handleKey = key as PlatformKey;
                    const followersKey = `${handleKey}Followers` as "instagramFollowers" | "tiktokFollowers" | "youtubeFollowers";
                    const connectedKey = `${handleKey}Connected` as ConnectedKey;
                    const isConnected = form[connectedKey];
                    const isAnalyzing = analyzing === key;
                    const profile = MOCK_PROFILES[key];
                    const username = (form[handleKey] as string) || profile.username;
                    const followers = (form[followersKey] as string) || profile.followers;

                    return (
                      <div
                        key={key}
                        className={`relative rounded-2xl bg-white p-3 transition-all overflow-hidden ${
                          isConnected
                            ? "border border-transparent shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_8px_30px_-12px_rgba(16,185,129,0.35)]"
                            : "border border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="relative flex items-center gap-3">
                          {isConnected ? (
                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${profile.avatarGradient} flex items-center justify-center text-white shrink-0 ring-2 ring-white shadow-soft`}>
                              <Icon className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shrink-0`}>
                              <Icon className="w-5 h-5" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {isConnected ? (
                              <>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{username}</p>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                                    <Check className="w-2.5 h-2.5" />
                                    Connecté
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {followers} abonnés
                                </p>
                              </>
                            ) : isAnalyzing ? (
                              <>
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{label}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Analyse du profil…
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{label}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  Connexion sécurisée via {provider}
                                </p>
                              </>
                            )}
                          </div>

                          {isConnected ? (
                            <button
                              type="button"
                              onClick={() => {
                                update(connectedKey, false);
                                update(handleKey, "");
                                update(followersKey, "");
                              }}
                              className="rounded-lg h-9 px-3 text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            >
                              Déconnecter
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isAnalyzing}
                              onClick={() => openConnection(key)}
                              className="group relative inline-flex items-center gap-1.5 rounded-lg h-9 px-4 text-xs font-semibold text-white bg-gradient-brand shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                              {isAnalyzing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Link2 className="w-3.5 h-3.5" />
                              )}
                              {isAnalyzing ? "Connexion…" : "Connecter"}
                            </button>
                          )}
                        </div>

                        {isAnalyzing && (
                          <div className="relative mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-brand transition-all duration-300"
                              style={{ width: `${analyzeProgress}%` }}
                            />
                          </div>
                        )}

                        {isConnected && (
                          <div className="relative mt-2.5 flex items-start gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/70 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                            <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                            <span className="leading-snug">{benefit}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Niches */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900">Tes 3 niches principales</label>
                    <span className="text-xs text-gray-500">{form.niches.length}/3</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map((n) => {
                      const active = form.niches.includes(n);
                      const disabled = !active && form.niches.length >= 3;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => toggleNiche(n)}
                          disabled={disabled}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                            active
                              ? "bg-gradient-brand text-white border-transparent shadow-soft"
                              : disabled
                              ? "bg-gray-100 text-gray-400 border-gray-200 opacity-50 cursor-not-allowed"
                              : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {active && <Check className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>

              <button
                type="button"
                onClick={next}
                disabled={!canNext() || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading
                  ? "Création…"
                  : step === STEPS.length - 1
                  ? "Créer mon compte"
                  : "Continuer"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Tu as déjà un compte ?{" "}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </section>

      {/* Modal OAuth simulé */}
      {connecting && (() => {
        const p = PLATFORMS.find((x) => x.key === connecting)!;
        const Icon = p.Icon;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeConnection}
          >
            <div
              className="w-full max-w-[440px] rounded-2xl bg-white overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header coloré */}
              <div className={`relative bg-gradient-to-br ${p.color} px-6 pt-6 pb-8`}>
                <div className="flex items-center gap-2 text-white/90 text-[11px] font-medium mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Connexion sécurisée via {p.provider}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-white ring-1 ring-white/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-lg font-semibold leading-tight">
                      Connexion sécurisée {p.label}
                    </h3>
                    <p className="text-xs text-white/85 mt-0.5">Partnexx · {p.provider} OAuth</p>
                  </div>
                </div>
              </div>

              {/* Corps */}
              <div className="px-6 pt-5 pb-5 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Continue vers une page de connexion {p.label} simulée pour autoriser Partnexx à accéder à certaines données publiques de ton profil.
                </p>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Permissions demandées
                  </p>
                  <ul className="space-y-1.5">
                    {p.permissions.map((perm) => (
                      <li key={perm} className="flex items-center gap-2 text-sm text-gray-900">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </span>
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-gray-500 flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  Flux de démonstration intégré : aucune vraie connexion externe n&apos;est effectuée.
                </p>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeConnection}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => completeConnection(connecting)}
                    className="rounded-xl bg-gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:brightness-110 transition-all inline-flex items-center gap-2"
                  >
                    Continuer avec {p.label}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}