'use client'

import { useEffect, useState } from 'react'
import supabase from '../supabase'
import { PLANS, canAccess, canCreateCampaign } from '../plans'

export function usePlan() {
  const [plan, setPlan] = useState('trial')
  const [campaignsCount, setCampaignsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlan() {

      // Récupère l'user connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Récupère son plan dans la table brands
      const { data: brand } = await supabase
        .from('brands')
        .select('subscription_plan, campaigns_count')
        .eq('user_id', user.id)
        .single()

      if (brand) {
        setPlan(brand.subscription_plan ?? 'trial')
        setCampaignsCount(brand.campaigns_count ?? 0)
      }

      setLoading(false)
    }

    fetchPlan()
  }, [])

  return {
    plan,
    planConfig: PLANS[plan] ?? PLANS['trial'],
    loading,
    canAccess: (feature) => canAccess(plan, feature),
    canCreateCampaign: () => canCreateCampaign(plan, campaignsCount),
  }
}