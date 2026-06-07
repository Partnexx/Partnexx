// Système d'abonnement et commissions PARTNEXX
// Grille B - Équilibrée (stade 2 : 50-500 users)

export const PLANS = {
  trial: {
    name: 'Trial',
    price: 0,
    commission: 18,
    campaigns_limit: 1,
    matching_optimise: false,
    acces_createurs_premium: false,
    notoriete_boost: false,
    automatisation: false,
    priorisation_campagnes: false,
    api_integrations: false,
    manager_dedie: false,
  },
  growth: {
    name: 'Growth',
    price: 119,
    commission: 11,
    campaigns_limit: Infinity,
    matching_optimise: true,
    acces_createurs_premium: false,
    notoriete_boost: true,
    automatisation: false,
    priorisation_campagnes: false,
    api_integrations: false,
    manager_dedie: false,
  },
  scale: {
    name: 'Scale',
    price: 299,
    commission: 7,
    campaigns_limit: Infinity,
    matching_optimise: true,
    acces_createurs_premium: true,
    notoriete_boost: true,
    automatisation: true,
    priorisation_campagnes: true,
    api_integrations: false,
    manager_dedie: false,
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    commission: 5,
    campaigns_limit: Infinity,
    matching_optimise: true,
    acces_createurs_premium: true,
    notoriete_boost: true,
    automatisation: true,
    priorisation_campagnes: true,
    api_integrations: true,
    manager_dedie: true,
  },
}

// Bonus créateur Légende : -3% de commission reversés au créateur
export const LEGEND_DISCOUNT = 3

// Niveaux créateur réservés aux marques Scale/Enterprise
export const PREMIUM_CREATOR_LEVELS = ['elite', 'champion', 'legende']

// Taux de TVA française appliqué sur la commission PARTNEXX
export const VAT_RATE = 20

// Fonction utilitaire : est-ce que ce plan a accès à cette feature ?
export function canAccess(plan, feature) {
  const planConfig = PLANS[plan] ?? PLANS['trial']
  return !!planConfig[feature]
}

// Fonction utilitaire : est-ce que la marque peut créer une nouvelle campagne ?
export function canCreateCampaign(plan, currentCount) {
  const planConfig = PLANS[plan] ?? PLANS['trial']
  return currentCount < planConfig.campaigns_limit
}

/**
 * Une marque a-t-elle le droit de contacter un créateur de ce niveau ?
 * Les niveaux Élite/Champion/Légende sont réservés aux marques Scale/Enterprise.
 */
export function canAccessCreator(plan, creatorLevel) {
  if (!PREMIUM_CREATOR_LEVELS.includes(creatorLevel?.toLowerCase())) {
    return true
  }
  return plan === 'scale' || plan === 'enterprise'
}

const round2 = (n) => Math.round(n * 100) / 100

/**
 * Calcule la répartition d'un paiement entre marque, PARTNEXX et créateur,
 * avec gestion de la TVA sur la commission (Option A : commission HT + TVA en plus).
 *
 * La marque paie TOUJOURS le % de commission de son plan (en HT) + la TVA dessus.
 * Si le créateur est Légende, PARTNEXX reverse 3% au créateur en bonus.
 *
 * @param {string} plan - Le plan de la marque ('trial', 'growth', 'scale', 'enterprise')
 * @param {boolean} isLegend - Le créateur est-il niveau Légende ?
 * @param {number} amount - Le montant brut de la collaboration (€)
 * @param {object} options - { vatExempt: bool } pour autoliquidation UE (marque étrangère avec n° TVA)
 * @returns {object} répartition complète
 *
 * Exemple : calculateCommission('growth', false, 1000)
 * → commissionHT: 110, vat: 22, commissionTTC: 132,
 *   partnexxCutHT: 110, creatorBonus: 0, creatorReceives: 890,
 *   brandTotal: 1022
 */
export function calculateCommission(plan, isLegend, amount, options = {}) {
  const { vatExempt = false } = options
  const planConfig = PLANS[plan] ?? PLANS['trial']
  const marqueRate = planConfig.commission ?? 0

  // Commission HT prélevée à la marque
  const commissionHT = (amount * marqueRate) / 100

  // TVA sur la commission (0 si autoliquidation UE)
  const vat = vatExempt ? 0 : (commissionHT * VAT_RATE) / 100

  // Commission TTC = ce que la marque paie réellement en commission
  const commissionTTC = commissionHT + vat

  // Bonus créateur Légende (3% du montant brut, déduit de la part PARTNEXX HT)
  const creatorBonus = isLegend ? (amount * LEGEND_DISCOUNT) / 100 : 0

  // Ce que PARTNEXX garde réellement (marge HT, après bonus reversé)
  const partnexxCutHT = commissionHT - creatorBonus

  // Ce que le créateur reçoit : montant brut - commission HT + bonus
  const creatorReceives = amount - commissionHT + creatorBonus

  // Ce que la marque débourse au total : montant créateur + commission TTC
  const brandTotal = amount + vat

  return {
    marqueRate,
    vatRate: vatExempt ? 0 : VAT_RATE,
    commissionHT: round2(commissionHT),
    vat: round2(vat),
    commissionTTC: round2(commissionTTC),
    partnexxCutHT: round2(partnexxCutHT),
    creatorBonus: round2(creatorBonus),
    creatorReceives: round2(creatorReceives),
    brandTotal: round2(brandTotal),
    // Compat : ancien champ totalCommission = commission HT
    totalCommission: round2(commissionHT),
    partnexxCut: round2(partnexxCutHT),
  }
}

// ============================================================
// PLAN EFFECTIF D'UNE MARQUE (lien Supabase/Stripe)
// Prend la ligne `brands` et renvoie la clé du plan réellement
// applicable : si l'abonnement est annulé/impayé/expiré -> 'trial'.
// ============================================================

export const PLAN_ORDER = ['trial', 'growth', 'scale', 'enterprise']

// Normalise la valeur stockée en base ('starter' historique -> 'trial')
export function normalizePlanKey(raw) {
  const k = String(raw || '').toLowerCase().trim()
  if (k === 'starter') return 'trial'
  return PLANS[k] ? k : 'trial'
}

// Le plan effectif d'une marque (objet `brands` de Supabase)
export function getBrandPlanKey(brand) {
  if (!brand) return 'trial'
  const key = normalizePlanKey(brand.subscription_plan)
  if (key === 'trial') return 'trial'

  // L'abonnement doit être actif ('past_due' toléré le temps de la relance Stripe)
  const status = String(brand.subscription_status || '').toLowerCase()
  if (!['active', 'trialing', 'past_due'].includes(status)) return 'trial'

  // Période expirée (avec 24h de grâce) -> retombe sur trial
  const end = brand.subscription_current_period_end ? new Date(brand.subscription_current_period_end) : null
  if (end && end.getTime() < Date.now() - 24 * 3600 * 1000) return 'trial'

  return key
}

// Raccourcis pratiques qui partent direct de la ligne `brands`
export function brandCanAccess(brand, feature) {
  return canAccess(getBrandPlanKey(brand), feature)
}
export function brandCanCreateCampaign(brand, currentCount) {
  return canCreateCampaign(getBrandPlanKey(brand), currentCount)
}
export function getBrandCommission(brand, isLegend, amount, options = {}) {
  return calculateCommission(getBrandPlanKey(brand), isLegend, amount, options)
}

// Prochain plan à proposer en upsell (null si déjà au max)
export function getUpsellPlan(brand) {
  const idx = PLAN_ORDER.indexOf(getBrandPlanKey(brand))
  const nextKey = PLAN_ORDER[idx + 1]
  return nextKey ? { key: nextKey, ...PLANS[nextKey] } : null
}