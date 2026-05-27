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
 *
 * @param {string} plan - Le plan de la marque
 * @param {string} creatorLevel - Le niveau du créateur (bronze, argent, or, platine, diamant, elite, champion, legende)
 * @returns {boolean}
 */
export function canAccessCreator(plan, creatorLevel) {
  if (!PREMIUM_CREATOR_LEVELS.includes(creatorLevel?.toLowerCase())) {
    return true // niveaux Bronze→Diamant : accessibles à tous
  }
  // Élite, Champion, Légende : Scale ou Enterprise uniquement
  return plan === 'scale' || plan === 'enterprise'
}

/**
 * Calcule la répartition d'un paiement entre marque, PARTNEXX et créateur.
 *
 * La marque paie TOUJOURS le % de commission de son plan.
 * Si le créateur est Légende, PARTNEXX reverse 3% au créateur en bonus.
 *
 * @param {string} plan - Le plan de la marque ('trial', 'growth', 'scale', 'enterprise')
 * @param {boolean} isLegend - Le créateur est-il niveau Légende ?
 * @param {number} amount - Le montant brut de la collaboration (€)
 * @returns {object} { marqueRate, totalCommission, partnexxCut, creatorBonus, creatorReceives }
 *
 * Exemple : calculateCommission('scale', true, 1000)
 * → marqueRate: 7, totalCommission: 70, partnexxCut: 40, creatorBonus: 30, creatorReceives: 960
 */
export function calculateCommission(plan, isLegend, amount) {
  const planConfig = PLANS[plan] ?? PLANS['trial']
  const marqueRate = planConfig.commission ?? 0

  // Commission totale prélevée à la marque
  const totalCommission = (amount * marqueRate) / 100

  // Bonus créateur Légende (3% du montant brut, déduit de la part PARTNEXX)
  const creatorBonus = isLegend ? (amount * LEGEND_DISCOUNT) / 100 : 0

  // Ce que PARTNEXX garde réellement
  const partnexxCut = totalCommission - creatorBonus

  // Ce que le créateur reçoit au final
  const creatorReceives = amount - totalCommission + creatorBonus

  return {
    marqueRate,
    totalCommission: Math.round(totalCommission * 100) / 100,
    partnexxCut: Math.round(partnexxCut * 100) / 100,
    creatorBonus: Math.round(creatorBonus * 100) / 100,
    creatorReceives: Math.round(creatorReceives * 100) / 100,
  }
}
