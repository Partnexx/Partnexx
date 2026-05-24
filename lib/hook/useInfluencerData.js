import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

export function useInfluencerData(userId) {
  const [data, setData] = useState({
    collaborations: [],
    transactions: [],
    contracts: [],
    socialAccounts: [],
    metrics: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!userId) return
    fetchAll(userId)
  }, [userId])

  async function fetchAll(userId) {
    try {
      // 1. Récupère l'ID dans la table influencers via user_id
      const { data: influencer, error: infError } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (infError || !influencer) {
        console.warn('Pas de profil influenceur trouvé pour', userId)
        setData(prev => ({ ...prev, loading: false }))
        return
      }

      const influencerId = influencer.id

      // 2. Fetch tout en parallèle
      const [collabRes, txRes, contractRes, socialRes] = await Promise.allSettled([
        supabase
          .from('collaborations')
          .select(`
            *,
            campaigns (id, title, description, cover_url, start_date, end_date, status, brand_id),
            brands (id, company_name, logo_url)
          `)
          .eq('influencer_id', influencerId)
          .order('created_at', { ascending: false }),

        supabase
          .from('transactions')
          .select('*')
          .eq('influencer_id', influencerId)
          .order('created_at', { ascending: false }),

        supabase
          .from('contracts')
          .select('*')
          .eq('influencer_id', influencerId)
          .order('created_at', { ascending: false }),

        supabase
          .from('social_accounts')
          .select('*')
          .eq('influencer_id', influencerId),
      ])

      const collaborations = collabRes.status === 'fulfilled' ? collabRes.value.data || [] : []
      const transactions   = txRes.status === 'fulfilled'    ? txRes.value.data    || [] : []
      const contracts      = contractRes.status === 'fulfilled' ? contractRes.value.data || [] : []
      const socialAccounts = socialRes.status === 'fulfilled' ? socialRes.value.data || [] : []

      // Calcul métriques financières
      const totalGains = transactions
        .filter(t => t.status === 'released')
        .reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)

      const enEscrow = transactions
        .filter(t => t.status === 'in_escrow')
        .reduce((sum, t) => sum + parseFloat(t.influencer_amount || 0), 0)

      // Calcul métriques sociales
      const totalFollowers = socialAccounts.reduce((sum, s) => sum + (s.followers_count || 0), 0)
      const avgEngagement = socialAccounts.length > 0
        ? (socialAccounts.reduce((sum, s) => sum + parseFloat(s.engagement_rate || 0), 0) / socialAccounts.length).toFixed(1)
        : 0
      const totalViews = socialAccounts.reduce((sum, s) => sum + (s.avg_views || 0), 0)

      setData({
        collaborations,
        transactions,
        contracts,
        socialAccounts,
        loading: false,
        error: null,
        metrics: {
          totalGains,
          enEscrow,
          collaborationsActives: collaborations.filter(c => ['in_progress', 'accepted'].includes(c.status)).length,
          collaborationsTotal: collaborations.length,
          contratsSignes: contracts.filter(c => c.status === 'signed').length,
          totalFollowers,
          avgEngagement,
          totalViews,
          socialAccounts,
        },
      })
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: err.message }))
    }
  }

  return data
}