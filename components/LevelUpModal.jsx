'use client'
import { useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Sparkles, X } from 'lucide-react'

/* ============================================================
   LevelUpModal — Modal plein écran style "Level Up !"
   
   Props:
   - open: bool
   - onClose: function
   - newLevel: objet LEVEL (niveau atteint)
   - previousLevel: objet LEVEL ou null (niveau précédent, pour comparaisons)
   ============================================================ */

const LEVEL_VISUALS = {
  bronze:   { gradient: 'from-orange-400 to-amber-600',         glow: 'shadow-orange-500/50',   tagline: 'Profil Vérifié' },
  argent:   { gradient: 'from-slate-400 to-slate-600',          glow: 'shadow-slate-500/50',    tagline: 'Statisticien' },
  or:       { gradient: 'from-yellow-400 to-amber-500',         glow: 'shadow-yellow-500/50',   tagline: 'Expert Créateur' },
  platine:  { gradient: 'from-cyan-400 to-sky-500',             glow: 'shadow-cyan-500/50',     tagline: 'Premium' },
  diamant:  { gradient: 'from-teal-400 to-cyan-500',            glow: 'shadow-teal-500/50',     tagline: 'Élite Numérique' },
  elite:    { gradient: 'from-fuchsia-500 to-pink-500',         glow: 'shadow-fuchsia-500/50',  tagline: 'Influenceur Premium' },
  champion: { gradient: 'from-violet-500 to-purple-600',        glow: 'shadow-violet-500/50',   tagline: 'Créateur Reconnu' },
  legende:  { gradient: 'from-pink-500 via-orange-500 to-yellow-500', glow: 'shadow-pink-500/50', tagline: 'Top Créateur' },
}

const FEATURE_LABELS = {
  // Bronze
  dashboard: 'Accès au dashboard complet',
  dailyChallenges: 'Défis quotidiens',
  verifiedProfile: 'Badge profil vérifié',
  withdrawals: 'Retraits de gains débloqués',
  // Argent
  weeklyChallenges: 'Défis hebdomadaires',
  advancedStats: 'Statistiques avancées',
  exclusiveProfileThemes: 'Thèmes de profil exclusifs',
  // Or
  monthlyChallenges: 'Défis mensuels',
  completeAnalytics: 'Analytics complets',
  advancedProfileCustomization: 'Personnalisation avancée du profil',
  detailedCollabTracking: 'Suivi détaillé des collaborations',
  // Platine
  marketplace: 'Accès Marketplace',
  aiTools: 'Outils IA premium',
  advancedRevenueHistory: 'Historique financier avancé',
  prioritySupport: 'Support prioritaire',
  // Diamant
  exclusiveOpportunities: 'Opportunités exclusives 🔥',
  premiumMarketplace: 'Marketplace Premium',
  earlyAccess: 'Accès anticipé aux nouveautés',
  increasedRewards: 'Récompenses augmentées',
  // Élite
  premiumCollabs: 'Collaborations premium',
  confidentialCampaigns: 'Campagnes confidentielles ⭐',
  fullEcosystemAccess: 'Accès complet à l\'écosystème',
  // Champion
  premiumOpportunities: 'Opportunités premium 🚀',
  marketplaceBenefits: 'Avantages Marketplace',
  // Légende
  topCreatorStatus: 'Statut Top Créateur affiché aux marques',
  privateInvitations: 'Invitations privées exclusives',
}

/* ============================================================
   Helper : Calcule le pourcentage en plus par rapport au précédent
   Ex: 1 → 1.25 = "+25%", 1.25 → 1.5 = "+20%", 1 → 4 = "+300%"
   ============================================================ */
function getMultiplierIncreaseText(currentMultiplier, previousMultiplier) {
  if (!previousMultiplier || currentMultiplier === previousMultiplier) return null

  // Pourcentage relatif à 1 (base) — comme ça l'utilisateur voit le bonus total
  // x1.25 = "+25% sur les gains de points"
  // x4 = "+300% sur les gains de points"
  const percent = Math.round((currentMultiplier - 1) * 100)
  return `+${percent}% sur les gains de points`
}

export default function LevelUpModal({ open, onClose, newLevel, previousLevel }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!newLevel) return null

  const visual = LEVEL_VISUALS[newLevel.key] || LEVEL_VISUALS.bronze

  // Affichage du multiplicateur SEULEMENT s'il a changé
  const multiplierText = getMultiplierIncreaseText(newLevel.scoreMultiplier, previousLevel?.scoreMultiplier)

  // Affichage de la commission discount SEULEMENT si elle a changé (passage Légende)
  const commissionChanged = (newLevel.commissionDiscount || 0) > (previousLevel?.commissionDiscount || 0)
  const commissionText = commissionChanged ? `-${newLevel.commissionDiscount}% de commission Partnexx` : null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0 border-0 bg-transparent shadow-none [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={onClose}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Niveau supérieur ! {newLevel.name}</DialogTitle>
          <DialogDescription>Tu as atteint le niveau {newLevel.name}</DialogDescription>
        </VisuallyHidden.Root>

        <div className="relative overflow-hidden rounded-3xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-95`} />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/40 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${10 + Math.random() * 20}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative z-10 p-8 sm:p-12 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6 animate-bounce">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold tracking-widest uppercase">Niveau supérieur !</span>
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="relative mb-4">
              <div className={`inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 shadow-2xl ${visual.glow}`}>
                <span className="text-7xl sm:text-8xl animate-pulse" style={{ animationDuration: '2s' }}>
                  {newLevel.emoji}
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black mb-2 drop-shadow-lg">
              {newLevel.name}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-white/90 mb-6">
              {visual.tagline}
            </p>

            {/* Badge multiplicateur — affiché SEULEMENT s'il a changé */}
            {multiplierText && (
              <Badge className="mb-3 bg-white/20 backdrop-blur-md text-white border-white/40 px-4 py-2 text-sm">
                <Trophy className="h-4 w-4 mr-2" />
                {multiplierText}
              </Badge>
            )}

            {/* Badge commission discount — affiché SEULEMENT à Légende */}
            {commissionText && (
              <div className="mb-6">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/40 px-4 py-2 text-sm">
                  💰 {commissionText}
                </Badge>
              </div>
            )}

            {/* Espace si pas de badge */}
            {!multiplierText && !commissionText && <div className="mb-6" />}

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6 text-left max-w-md mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3 text-center">
                ✨ Nouvelles fonctionnalités débloquées
              </p>
              <ul className="space-y-2">
                {newLevel.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-white/80 mt-0.5">▸</span>
                    <span className="font-medium">{FEATURE_LABELS[feature] || feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={onClose}
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 rounded-full text-lg shadow-2xl hover:scale-105 transition-all"
            >
              Continuer mon aventure 🚀
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
