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
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Compte", "Marque"] as const;

const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13-4.7l-6-5.1c-2 1.4-4.4 2.3-7 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.1 16.2 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9l6 5.1c-.4.4 6.4-4.7 6.4-14 0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

export default function MarquesSignup() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [acceptCgv, setAcceptCgv] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    brandName: "",
  });

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validStep0 =
    form.firstName.trim().length > 1 &&
    form.lastName.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.password.length >= 8 &&
    acceptCgu &&
    acceptCgv;

  const handleGoogle = () => {
    if (!acceptCgu || !acceptCgv) {
      toast.error("Merci d'accepter les CGU et CGV avant de continuer");
      return;
    }
    toast.success("Connexion Google simulée");
    setStep(1);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validStep0) return;
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.brandName.trim().length < 2) return;
    setLoading(true);
    setTimeout(() => {
      toast.success(`Bienvenue ${form.brandName} 🎉`);
      router.push("/marques");
    }, 900);
  };

  return (
    <main className="relative overflow-hidden min-h-screen">
      <section className="relative py-16 lg:py-20">
        {/* Halos colorés en fond */}
        <div className="glow-orb w-[480px] h-[480px] -top-20 -left-32 opacity-30" style={{ background: "#00B8E6" }} aria-hidden />
        <div className="glow-orb w-[520px] h-[520px] bottom-0 -right-32 opacity-30" style={{ background: "#FF4FD8" }} aria-hidden />

        <div className="relative max-w-xl mx-auto px-4">
          {/* Retour */}
          <Link href="/marques" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#00B8E6] mb-3">
              Lancer une campagne
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              {step === 0 ? "Crée ton compte marque" : "Présente ta marque"}
            </h1>
            <p className="text-sm text-gray-500">
              {step === 0
                ? "Tout ce qu'il faut pour démarrer ta première campagne."
                : "Encore une étape et tu es prêt à lancer."}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
              <span>Étape {step + 1} / {STEPS.length}</span>
              <span>{STEPS[step]}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-gray-200 bg-white/85 backdrop-blur shadow-card p-6 sm:p-8">
            {step === 0 && (
              <form onSubmit={handleNext} className="space-y-5">
                {/* Bouton Google */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:shadow-md"
                >
                  <GoogleIcon /> Continuer avec Google
                </button>

                {/* Séparateur OU */}
                <div className="relative flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                  <span className="flex-1 h-px bg-gray-200" /> ou <span className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Prénom + Nom */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-xs font-semibold text-gray-900">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        id="firstName"
                        value={form.firstName}
                        onChange={setField("firstName")}
                        placeholder="Marie"
                        autoComplete="given-name"
                        className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-xs font-semibold text-gray-900">Nom</label>
                    <input
                      id="lastName"
                      value={form.lastName}
                      onChange={setField("lastName")}
                      placeholder="Dupont"
                      autoComplete="family-name"
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                  </div>
                </div>

                {/* Email pro */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-900">Email professionnel</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={setField("email")}
                      placeholder="marie@ta-marque.com"
                      autoComplete="email"
                      className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-900">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={setField("password")}
                      placeholder="8 caractères minimum"
                      autoComplete="new-password"
                      className="w-full h-11 pl-9 pr-10 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                      aria-label="Afficher le mot de passe"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {/* CGU + CGV */}
                <div className="space-y-2.5 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptCgu}
                      onChange={(e) => setAcceptCgu(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#00B8E6] cursor-pointer"
                    />
                    <span className="text-[12px] text-gray-500 leading-snug group-hover:text-gray-900 transition-colors">
                      J&apos;accepte les{" "}
                      <Link href="/cgu" target="_blank" rel="noreferrer" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#00B8E6]">
                        Conditions Générales d&apos;Utilisation
                      </Link>
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptCgv}
                      onChange={(e) => setAcceptCgv(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#00B8E6] cursor-pointer"
                    />
                    <span className="text-[12px] text-gray-500 leading-snug group-hover:text-gray-900 transition-colors">
                      J&apos;accepte les{" "}
                      <Link href="/cgu" target="_blank" rel="noreferrer" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#00B8E6]">
                        Conditions Générales de Vente
                      </Link>{" "}
                      et la{" "}
                      <Link href="/politique-confidentialite" target="_blank" rel="noreferrer" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#00B8E6]">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Bouton Continuer */}
                <button
                  type="submit"
                  disabled={!validStep0}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-brand text-white rounded-xl shadow-glow hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Mention sécurité */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Tes données sont sécurisées et ne seront jamais partagées.
                </div>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nom de la marque */}
                <div className="space-y-1.5">
                  <label htmlFor="brandName" className="text-xs font-semibold text-gray-900">Nom de la marque</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="brandName"
                      value={form.brandName}
                      onChange={setField("brandName")}
                      placeholder="Ex : Beauty Boost"
                      autoFocus
                      className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8E6]/30 focus:border-[#00B8E6]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 pl-1">C&apos;est le nom qui sera visible par les créateurs.</p>
                </div>

                {/* Carte verte "Compte prêt" */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-[12px] text-gray-900">
                    <div className="font-semibold mb-0.5">Compte prêt</div>
                    <div className="text-gray-500">Tu pourras compléter ton profil et lancer ta campagne juste après.</div>
                  </div>
                </div>

                {/* Boutons Retour + Lancer */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="h-11 px-4 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading || form.brandName.trim().length < 2}
                    className="flex-1 h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-brand text-white rounded-xl shadow-glow hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Création...
                      </>
                    ) : (
                      <>
                        Lancer ma campagne <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Lien Se connecter */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-gray-900 hover:text-[#00B8E6] transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}