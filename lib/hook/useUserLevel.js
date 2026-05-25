import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

/* ============================================================================
   NIVEAUX PARTNEXX (8 paliers)
   Chaque niveau définit :
   - threshold     : score minimum requis
   - features      : ce que ce niveau débloque (cumulatif avec les précédents)
   - scoreMultiplier : multiplicateur appliqué aux gains de points
   - commissionDiscount : réduction sur les frais Partnexx (en %)
   ============================================================================ */
export const LEVELS = [
  {
    key: 'bronze', name: 'Bronze', emoji: '🥉', threshold: 0,
    requiresProfile: true,
    scoreMultiplier: 1, commissionDiscount: 0,
    features: ['dashboard', 'dailyChallenges', 'verifiedProfile', 'withdrawals'],
  },
  {
    key: 'argent', name: 'Argent', emoji: '🥈', threshold: 200,
    scoreMultiplier: 1.5, commissionDiscount: 0,
    features: ['weeklyChallenges', 'advancedStats', 'exclusiveProfileThemes'],
  },
  {
    key: 'or', name: 'Or', emoji: '🥇', threshold: 500,
    scoreMultiplier: 1.5, commissionDiscount: 0,
    features: ['monthlyChallenges', 'completeAnalytics', 'advancedProfileCustomization', 'detailedCollabTracking'],
  },
  {
    key: 'platine', name: 'Platine', emoji: '💠', threshold: 1000,
    scoreMultiplier: 1.5, commissionDiscount: 0,
    features: ['marketplace', 'aiTools', 'advancedRevenueHistory', 'prioritySupport'],
  },
  {
    key: 'diamant', name: 'Diamant', emoji: '🔥', threshold: 2000,
    scoreMultiplier: 1.5, commissionDiscount: 0,
    features: ['exclusiveOpportunities', 'premiumMarketplace', 'earlyAccess', 'increasedRewards'],
  },
  {
    key: 'elite', name: 'Élite', emoji: '⭐', threshold: 3500,
    scoreMultiplier: 1.5, commissionDiscount: 0,
    features: ['premiumCollabs', 'confidentialCampaigns', 'fullEcosystemAccess'],
  },
  {
    key: 'champion', name: 'Champion', emoji: '🚀', threshold: 5000,
    scoreMultiplier: 2, commissionDiscount: 0,
    features: ['premiumOpportunities', 'marketplaceBenefits'],
  },
  {
    key: 'legende', name: 'Légende', emoji: '🏆', threshold: 10000,
    scoreMultiplier: 2, commissionDiscount: 2,
    features: ['topCreatorStatus', 'privateInvitations'],
  },
]

/* ============================================================================
   Helper : calcul de la complétion du profil (à remplacer par ta vraie fonction
   si tu en as une dédiée sur l'autre page)
   ============================================================================ */
export function calculateProfileCompletion(influencerData, profile) {
  if (!influencerData && !profile) return 0
  const checks = [
    !!profile?.full_name,
    !!profile?.username,
    !!profile?.avatar_url,
    !!influencerData?.bio,
    !!(influencerData?.niche && influencerData.niche.length > 0),
    !!(influencerData?.content_types && influencerData.content_types.length > 0),
    !!influencerData?.min_budget,
    !!influencerData?.max_budget,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}

/* ============================================================================
   useUserLevel — Hook central de gestion des niveaux
   ============================================================================
   USAGE :
     const { level, canAccess, scoreMultiplier, loading } = useUserLevel(userId)
     if (!canAccess('weeklyChallenges')) return <LockedFeature />
   ============================================================================ */
export function useUserLevel(userId) {
  const [score, setScore] = useState(0)
  const [profile, setProfile] = useState(null)
  const [influencerData, setInfluencerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchUserData()
    const unsub = subscribeToScoreChanges()
    return () => { if (unsub) unsub() }
  }, [userId])

  async function fetchUserData() {
    try {
      // Fetch en parallèle profile + influencer
      const [profileRes, influencerRes] = await Promise.allSettled([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('influencers').select('*').eq('user_id', userId).single(),
      ])

      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        setProfile(profileRes.value.data)
      }
      if (influencerRes.status === 'fulfilled' && influencerRes.value.data) {
        setInfluencerData(influencerRes.value.data)
        setScore(influencerRes.value.data.ai_score || 0)
      }
    } catch (err) {
      console.warn('useUserLevel fetch error', err)
    } finally {
      setLoading(false)
    }
  }

  function subscribeToScoreChanges() {
    const channel = supabase
      .channel(`user-level:${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'influencers',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (payload.new) {
          setInfluencerData(payload.new)
          setScore(payload.new.ai_score || 0)
        }
      })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  // ===== Calculs dérivés =====
  const profileCompletion = calculateProfileCompletion(influencerData, profile)
  const isProfileComplete = profileCompletion === 100

  // Détermine le niveau actuel
  let level = null
  if (isProfileComplete) {
    level = LEVELS[0]
    for (const lvl of LEVELS) {
      if (score >= lvl.threshold) level = lvl
      else break
    }
  }

  const currentLevelIndex = level ? LEVELS.findIndex(l => l.key === level.key) : -1
  const nextLevel = currentLevelIndex >= 0 && currentLevelIndex < LEVELS.length - 1
    ? LEVELS[currentLevelIndex + 1]
    : null

  // Features débloquées (cumul de tous les niveaux atteints)
  const unlockedFeatures = new Set()
  let scoreMultiplier = 1
  let commissionDiscount = 0
  if (level) {
    for (let i = 0; i <= currentLevelIndex; i++) {
      LEVELS[i].features.forEach(f => unlockedFeatures.add(f))
      scoreMultiplier = Math.max(scoreMultiplier, LEVELS[i].scoreMultiplier)
      commissionDiscount = Math.max(commissionDiscount, LEVELS[i].commissionDiscount)
    }
  }

  // Progression vers le prochain niveau (en %)
  const progress = nextLevel
    ? Math.min(((score - (level?.threshold || 0)) / (nextLevel.threshold - (level?.threshold || 0))) * 100, 100)
    : 100

  const pointsToNextLevel = nextLevel ? Math.max(0, nextLevel.threshold - score) : 0

  // ===== Helpers exposés =====
  function canAccess(featureName) {
    return unlockedFeatures.has(featureName)
  }

  function getRequiredLevel(featureName) {
    for (const lvl of LEVELS) {
      if (lvl.features.includes(featureName)) return lvl
    }
    return null
  }

  function applyScoreMultiplier(basePoints) {
    return Math.round(basePoints * scoreMultiplier)
  }

  function applyCommissionDiscount(baseRate = 10) {
    return Math.max(0, baseRate - commissionDiscount)
  }

  return {
    // Données
    score,
    profile,
    influencerData,
    loading,

    // État du niveau
    level,
    nextLevel,
    currentLevelIndex,
    unlockedFeatures,
    scoreMultiplier,
    commissionDiscount,
    progress,
    pointsToNextLevel,
    profileCompletion,
    isProfileComplete,
    allLevels: LEVELS,

    // Helpers
    canAccess,
    getRequiredLevel,
    applyScoreMultiplier,
    applyCommissionDiscount,
    refetch: fetchUserData,
  }
}