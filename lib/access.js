/**
 * lib/access.js
 * 
 * Gestion centralisée des règles d'accès marque → créateur selon le plan d'abonnement.
 * Utilisé à la fois côté client (UI cadenas) et côté serveur (sécurité API).
 */

/**
 * Niveaux créateur dans l'ordre de progression (importé depuis useUserLevel)
 * On les recopie ici pour pouvoir importer ce fichier côté serveur sans React
 */
export const CREATOR_LEVELS = [
  'bronze',
  'argent',
  'or',
  'platine',
  'diamant',
  'elite',
  'champion',
  'legende',
]

/**
 * Mapping des plans marque → niveaux créateurs accessibles.
 * 
 * Règle métier :
 * - Trial / Growth : créateurs jusqu'à Diamant (Bronze → Diamant)
 * - Scale / Enterprise : tous les créateurs (y compris Élite, Champion, Légende)
 */
export const BRAND_PLAN_ACCESS = {
  trial: ['bronze', 'argent', 'or', 'platine', 'diamant'],
  growth: ['bronze', 'argent', 'or', 'platine', 'diamant'],
  scale: ['bronze', 'argent', 'or', 'platine', 'diamant', 'elite', 'champion', 'legende'],
  enterprise: ['bronze', 'argent', 'or', 'platine', 'diamant', 'elite', 'champion', 'legende'],
}

/**
 * Niveaux considérés comme "Premium" (verrouillés pour Trial/Growth).
 */
export const PREMIUM_CREATOR_LEVELS = ['elite', 'champion', 'legende']

/**
 * Plans marque qui débloquent l'accès aux créateurs Premium.
 */
export const PREMIUM_UNLOCK_PLANS = ['scale', 'enterprise']

/**
 * Détermine le niveau d'un créateur à partir de son score AI.
 * Doit rester aligné avec les thresholds de LEVELS dans useUserLevel.js
 */
const LEVEL_THRESHOLDS = [
  { key: 'bronze', threshold: 0 },
  { key: 'argent', threshold: 750 },
  { key: 'or', threshold: 2500 },
  { key: 'platine', threshold: 6000 },
  { key: 'diamant', threshold: 12500 },
  { key: 'elite', threshold: 30000 },
  { key: 'champion', threshold: 60000 },
  { key: 'legende', threshold: 100000 },
]

export function getCreatorLevelFromScore(score) {
  let result = 'bronze'
  for (const lvl of LEVEL_THRESHOLDS) {
    if ((score || 0) >= lvl.threshold) result = lvl.key
    else break
  }
  return result
}

/**
 * Vérifie si une marque peut accéder à un créateur donné.
 * @param {string} brandPlan - 'trial' | 'growth' | 'scale' | 'enterprise'
 * @param {string} creatorLevelKey - 'bronze' | 'argent' | ... | 'legende'
 * @returns {boolean}
 */
export function canBrandAccessCreator(brandPlan, creatorLevelKey) {
  if (!brandPlan || !creatorLevelKey) return false
  const normalizedPlan = (brandPlan || '').toLowerCase()
  const allowedLevels = BRAND_PLAN_ACCESS[normalizedPlan]
  if (!allowedLevels) return false
  return allowedLevels.includes(creatorLevelKey)
}

/**
 * Vérifie si un créateur est Premium (Élite, Champion, Légende).
 */
export function isPremiumCreator(creatorLevelKey) {
  return PREMIUM_CREATOR_LEVELS.includes(creatorLevelKey)
}

/**
 * Vérifie si un plan marque débloque les créateurs Premium.
 */
export function planUnlocksPremium(brandPlan) {
  const normalizedPlan = (brandPlan || '').toLowerCase()
  return PREMIUM_UNLOCK_PLANS.includes(normalizedPlan)
}

/**
 * Retourne un message d'erreur explicite quand l'accès est refusé.
 */
export function getAccessDeniedMessage(brandPlan, creatorLevelKey) {
  if (isPremiumCreator(creatorLevelKey) && !planUnlocksPremium(brandPlan)) {
    return `Ce créateur est un profil Premium (niveau ${creatorLevelKey}). Passe en plan Scale pour le contacter.`
  }
  return 'Ton plan ne te permet pas d\'accéder à ce créateur.'
}

/**
 * Récupère le niveau minimum requis pour débloquer un créateur d'un niveau donné.
 * Utile pour afficher "Plan Scale requis" dans l'UI.
 */
export function getRequiredPlanFor(creatorLevelKey) {
  if (isPremiumCreator(creatorLevelKey)) return 'scale'
  return 'trial'
}