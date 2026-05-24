"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import supabase from '@/lib/supabase'

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  const email = e.target.email.value
  const password = e.target.password.value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    toast.error("Identifiants incorrects")
    setLoading(false)
    return
  }

  // Récupérer le rôle depuis profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  toast.success("Connexion réussie 🎉", { description: "Bienvenue sur Partnexx" })

  if (profile?.role === 'influencer') {
    window.location.href = '/dashboard/influencer'
  } else if (profile?.role === 'brand') {
    window.location.href = '/dashboard/brand'
  } else {
    window.location.href = '/'
  }
}

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
      <div className="glow-orb w-[560px] h-[560px] top-1/4 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />
      <div className="glow-orb w-[420px] h-[420px] bottom-0 left-1/3 opacity-40" style={{ background: "#8B5CF6" }} aria-hidden />

      <Navbar variant="landing" />

      <section className="relative z-10 container flex-1 flex items-center justify-center py-12 lg:py-20">
        <div className="w-full max-w-md">
          {/* TITRE */}
          <div className="text-center mb-8 animate-count-up">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
              Bon retour sur <span className="text-gradient-brand">Partnexx</span>
            </h1>
            <p className="text-muted-foreground">
              Connecte-toi à ton espace marque ou créateur.
            </p>
          </div>

          {/* CARTE FORMULAIRE */}
          <div className="rounded-3xl bg-white border border-border shadow-card p-7 lg:p-8">

            {/* Boutons sociaux */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => toast("Google bientôt disponible")}
                className="h-11 rounded-xl border border-border bg-white hover:bg-secondary/50 transition-colors inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1S8.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => toast("Apple bientôt disponible")}
                className="h-11 rounded-xl border border-border bg-white hover:bg-secondary/50 transition-colors inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.3.9-1.3 1.2-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.6zM14 5.4c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.3z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Séparateur OU */}
            <div className="relative my-5 flex items-center">
              <div className="flex-1 h-px bg-border" />
              <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="toi@exemple.com"
                    required
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => toast("Lien envoyé si le compte existe")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-9 pr-10 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Afficher le mot de passe"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bouton Se connecter */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-white shadow-soft hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? "Connexion…" : "Se connecter"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Lien créer un compte */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/" className="text-foreground font-medium hover:underline">
                Choisis ton espace
              </Link>
            </p>
          </div>

          {/* CGU */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            En continuant, tu acceptes nos{" "}
            <a href="#" className="underline hover:text-foreground">CGU</a> et notre{" "}
            <a href="#" className="underline hover:text-foreground">politique de confidentialité</a>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}