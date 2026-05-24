export const PLANS = {
  trial: {
    name: 'Trial',
    price: 0,
    commission: 15,
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
    price: 99,
    commission: 10,
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
    commission: null,
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