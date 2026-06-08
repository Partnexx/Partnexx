import { useState, useEffect, useRef } from 'react'
import supabase from '@/lib/supabase'
import { toast } from 'sonner'

/* ============================================================================
   NIVEAUX PARTNEXX (8 paliers) — Seuils rééquilibrés
   ============================================================================ */
export const LEVELS = [
  {
    key: 'bronze', name: 'Bronze', emoji: '🥉', threshold: 0,
    requiresProfile: true,
    scoreMultiplier: 1, commissionDiscount: 0,
    features: ['dashboard', 'dailyChallenges', 'verifiedProfile', 'withdrawals'],
  },
  {
    key: 'argent', name: 'Argent', emoji: '🥈', threshold: 750,
    scoreMultiplier: 1.25, commissionDiscount: 0,
    features: ['weeklyChallenges', 'advancedStats', 'exclusiveProfileThemes'],
  },
  {
    key: 'or', name: 'Or', emoji: '🥇', threshold: 2500,
    scoreMultiplier: 1.5, commissionDiscount: 0,
    features: ['monthlyChallenges', 'completeAnalytics', 'advancedProfileCustomization', 'detailedCollabTracking'],
  },
  {
    key: 'platine', name: 'Platine', emoji: '💠', threshold: 6000,
    scoreMultiplier: 1.75, commissionDiscount: 0,
    features: ['marketplace', 'aiTools', 'advancedRevenueHistory', 'prioritySupport'],
  },
  {
    key: 'diamant', name: 'Diamant', emoji: '🔥', threshold: 12500,
    scoreMultiplier: 2, commissionDiscount: 0,
    features: ['exclusiveOpportunities', 'premiumMarketplace', 'earlyAccess', 'increasedRewards'],
  },
  {
    key: 'elite', name: 'Élite', emoji: '⭐', threshold: 30000,
    scoreMultiplier: 2.5, commissionDiscount: 0,
    features: ['premiumCollabs', 'confidentialCampaigns', 'fullEcosystemAccess'],
  },
  {
    key: 'champion', name: 'Champion', emoji: '🚀', threshold: 60000,
    scoreMultiplier: 3, commissionDiscount: 0,
    features: ['premiumOpportunities', 'marketplaceBenefits'],
  },
  {
    key: 'legende', name: 'Légende', emoji: '🏆', threshold: 100000,
    scoreMultiplier: 4, commissionDiscount: 3,
    features: ['topCreatorStatus', 'privateInvitations'],
  },
]

/* ============================================================================
   Helper : calcul de la complétion du profil (7 checks)
   ============================================================================ */
export function calculateProfileCompletion(influencerData, profile) {
  if (!influencerData && !profile) return 0
  const checks = [
    !!profile?.full_name,
    !!profile?.username,
    !!profile?.avatar_url,
    !!profile?.bio,
    !!(influencerData?.niche && influencerData.niche.length > 0),
    !!(influencerData?.content_types && influencerData.content_types.length > 0),
    !!influencerData?.min_budget,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}

function getLevelFromScore(score) {
  let result = LEVELS[0]
  for (const lvl of LEVELS) {
    if (score >= lvl.threshold) result = lvl
    else break
  }
  return result
}

/* ============================================================================
   useUserLevel — Hook central
   ============================================================================ */
export function useUserLevel(userId) {
  const [score, setScore] = useState(0)
  const [profile, setProfile] = useState(null)
  const [influencerData, setInfluencerData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false)
  const [levelUpNewLevel, setLevelUpNewLevel] = useState(null)
  const [levelUpPreviousLevel, setLevelUpPreviousLevel] = useState(null)
  const previousLevelIndexRef = useRef(null)
  const hasInitializedLevelRef = useRef(false)
  // Évite deux insertions simultanées de la même notif de niveau (course awardPoints / useEffect)
  const notifyingLevelRef = useRef(null)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetchUserData()
    const unsub = subscribeToScoreChanges()
    return () => { if (unsub) unsub() }
  }, [userId])

  async function fetchUserData() {
    try {
      const [profileRes, influencerRes] = await Promise.allSettled([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('influencers').select('*').eq('user_id', userId).single(),
      ])
      if (profileRes.status === 'fulfilled' && profileRes.value.data) setProfile(profileRes.value.data)
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
    const channelName = `user-level:${userId}:${Math.random().toString(36).slice(2, 8)}`
    const channel = supabase.channel(channelName)
    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'influencers', filter: `user_id=eq.${userId}` }, (payload) => {
      if (payload.new) { setInfluencerData(payload.new); setScore(payload.new.ai_score || 0) }
    })
    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, (payload) => {
      if (payload.new) setProfile(payload.new)
    })
    channel.subscribe()
    return () => supabase.removeChannel(channel)
  }

  const profileCompletion = calculateProfileCompletion(influencerData, profile)
  const isProfileComplete = profileCompletion === 100

  let level = null
  if (isProfileComplete) level = getLevelFromScore(score)

  const currentLevelIndex = level ? LEVELS.findIndex(l => l.key === level.key) : -1
  const nextLevel = currentLevelIndex >= 0 && currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null

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

  const progress = nextLevel ? Math.min(((score - (level?.threshold || 0)) / (nextLevel.threshold - (level?.threshold || 0))) * 100, 100) : 100
  const pointsToNextLevel = nextLevel ? Math.max(0, nextLevel.threshold - score) : 0

  useEffect(() => {
    if (loading || !userId) return
    const storageKey = `partnexx-last-level:${userId}`
    const lastSeenIndex = parseInt(localStorage.getItem(storageKey) ?? '-2', 10)
    if (!hasInitializedLevelRef.current) {
      hasInitializedLevelRef.current = true
      if (isNaN(lastSeenIndex) || lastSeenIndex === -2) localStorage.setItem(storageKey, String(currentLevelIndex))
      previousLevelIndexRef.current = currentLevelIndex
      return
    }
    if (currentLevelIndex > lastSeenIndex && currentLevelIndex > previousLevelIndexRef.current && level) {
      const previousLevel = lastSeenIndex >= 0 ? LEVELS[lastSeenIndex] : null
      console.log(`🎉 Level up (useEffect) ! ${lastSeenIndex} → ${currentLevelIndex} (${level.name})`)
      // On bloque tout de suite pour éviter un doublon
      localStorage.setItem(storageKey, String(currentLevelIndex))
      previousLevelIndexRef.current = currentLevelIndex
      triggerLevelUp(level, previousLevel)
      return
    }
    previousLevelIndexRef.current = currentLevelIndex
  }, [currentLevelIndex, loading, level, userId, score])

  async function triggerLevelUp(newLevel, previousLevel) {
    setLevelUpNewLevel(newLevel)
    setLevelUpPreviousLevel(previousLevel)
    setLevelUpModalOpen(true)
    toast.success(`🎉 Niveau supérieur ! Tu es maintenant ${newLevel.name} ${newLevel.emoji}`, { duration: 5000 })

    // Garde-fou anti-doublon (mémoire) : on n'insère pas deux fois le même niveau en même temps
    if (notifyingLevelRef.current === newLevel.key) return
    notifyingLevelRef.current = newLevel.key

    try {
      // Idempotence : si une notif "niveau X" existe déjà en base pour cet utilisateur, on ne la recrée pas
      const { data: existing, error: checkErr } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'level_up')
        .eq('data->>level_key', newLevel.key)
        .limit(1)

      if (!checkErr && existing && existing.length > 0) {
        console.log(`ℹ️ Notif niveau "${newLevel.key}" déjà existante — pas de doublon créé.`)
        return
      }

      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'level_up',
        title: `🎉 Nouveau niveau : ${newLevel.name} ${newLevel.emoji}`,
        body: `Félicitations ! Tu as atteint le niveau ${newLevel.name}. ${newLevel.features.length} nouvelles fonctionnalités sont débloquées.`,
        data: {
          level_key: newLevel.key, level_name: newLevel.name, level_emoji: newLevel.emoji,
          threshold: newLevel.threshold, score_multiplier: newLevel.scoreMultiplier,
          commission_discount: newLevel.commissionDiscount, features_unlocked: newLevel.features,
        },
        is_read: false,
      })
    } catch (err) {
      console.warn('Notification level_up insert failed', err)
    } finally {
      // On relâche le verrou un peu plus tard pour absorber les re-rendus rapprochés
      setTimeout(() => { if (notifyingLevelRef.current === newLevel.key) notifyingLevelRef.current = null }, 2000)
    }
  }

  function closeLevelUpModal() {
    setLevelUpModalOpen(false)
    setLevelUpNewLevel(null)
    setLevelUpPreviousLevel(null)
  }

  async function awardPoints(basePoints, reason, metadata = {}) {
    if (!userId) return { success: false, error: 'No user' }
    if (!basePoints || basePoints <= 0) return { success: false, error: 'Invalid points' }
    const multiplier = scoreMultiplier
    const awardedPoints = Math.round(basePoints * multiplier)
    const newScore = score + awardedPoints
    try {
      const { error: updateError } = await supabase.from('influencers').update({ ai_score: newScore, updated_at: new Date().toISOString() }).eq('user_id', userId)
      if (updateError) throw updateError

      setScore(newScore)
      setInfluencerData(prev => prev ? { ...prev, ai_score: newScore } : prev)

      if (level) {
        const newLevel = getLevelFromScore(newScore)
        const newLevelIndex = LEVELS.findIndex(l => l.key === newLevel.key)
        if (newLevelIndex > currentLevelIndex) {
          const storageKey = `partnexx-last-level:${userId}`
          const lastSeenIndex = parseInt(localStorage.getItem(storageKey) ?? '-2', 10)
          if (newLevelIndex > lastSeenIndex) {
            console.log(`🎉 Level up À CHAUD ! ${currentLevelIndex} → ${newLevelIndex} (${newLevel.name})`)
            // On verrouille TOUT DE SUITE (synchrone) pour que le useEffect ne crée pas un doublon
            localStorage.setItem(storageKey, String(newLevelIndex))
            previousLevelIndexRef.current = newLevelIndex
            setTimeout(() => { triggerLevelUp(newLevel, level) }, 800)
          }
        }
      }

      const { error: historyError } = await supabase.from('partnexx_score_history').insert({
        user_id: userId, base_points: basePoints, multiplier: multiplier,
        awarded_points: awardedPoints, reason: reason, metadata: metadata,
      })
      if (historyError) console.warn('Score history log failed', historyError)

      if (multiplier > 1) {
        toast.success(`+${awardedPoints} points ! 🎯`, {
          description: `${basePoints} pts × ${multiplier} (bonus niveau ${level?.name}) = ${awardedPoints} pts`,
          duration: 4000,
        })
      } else {
        toast.success(`+${awardedPoints} points ! 🎯`, { duration: 3000 })
      }

      return { success: true, awardedPoints, multiplier, newScore }
    } catch (err) {
      console.error('awardPoints failed', err)
      toast.error(`Erreur attribution des points : ${err.message}`)
      return { success: false, error: err.message }
    }
  }

  function canAccess(featureName) { return unlockedFeatures.has(featureName) }
  function getRequiredLevel(featureName) {
    for (const lvl of LEVELS) if (lvl.features.includes(featureName)) return lvl
    return null
  }
  function applyScoreMultiplier(basePoints) { return Math.round(basePoints * scoreMultiplier) }
  function applyCommissionDiscount(baseRate = 10) { return Math.max(0, baseRate - commissionDiscount) }

  return {
    score, profile, influencerData, loading,
    level, nextLevel, currentLevelIndex, unlockedFeatures,
    scoreMultiplier, commissionDiscount, progress, pointsToNextLevel,
    profileCompletion, isProfileComplete, allLevels: LEVELS,
    canAccess, getRequiredLevel, applyScoreMultiplier, applyCommissionDiscount,
    refetch: fetchUserData, awardPoints,
    levelUpModalOpen, levelUpNewLevel, levelUpPreviousLevel, closeLevelUpModal,
  }
}
