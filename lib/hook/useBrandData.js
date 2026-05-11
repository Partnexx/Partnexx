import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

export function useBrandData(userId) {
  const [data, setData] = useState({
    brand: null,
    campaigns: [],
    collaborations: [],
    transactions: [],
    contracts: [],
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
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (brandError || !brand) {
        console.warn('Pas de profil brand trouvé pour', userId)
        setData(prev => ({ ...prev, loading: false }))
        return
      }

      const brandId = brand.id

      const [campaignRes, collabRes, txRes, contractRes] = await Promise.allSettled([
        supabase
          .from('campaigns')
          .select('*')
          .eq('brand_id', brandId)
          .order('created_at', { ascending: false }),

        supabase
          .from('collaborations')
          .select(`*, campaigns (id, title), influencers (id, display_name, user_id)`)
          .eq('brand_id', brandId)
          .order('created_at', { ascending: false }),

        supabase
          .from('transactions')
          .select('*')
          .eq('brand_id', brandId)
          .order('created_at', { ascending: false }),

        supabase
          .from('contracts')
          .select('*')
          .eq('brand_id', brandId)
          .order('created_at', { ascending: false }),
      ])

      const campaigns      = campaignRes.status === 'fulfilled'  ? campaignRes.value.data  || [] : []
      const collaborations = collabRes.status === 'fulfilled'    ? collabRes.value.data    || [] : []
      const transactions   = txRes.status === 'fulfilled'        ? txRes.value.data        || [] : []
      const contracts      = contractRes.status === 'fulfilled'  ? contractRes.value.data  || [] : []

      const totalDepense = transactions
        .filter(t => ['in_escrow', 'released'].includes(t.status))
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

      const enEscrow = transactions
        .filter(t => t.status === 'in_escrow')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

      const budgetTotal = campaigns
        .reduce((sum, c) => sum + parseFloat(c.budget_total || 0), 0)

      setData({
        brand,
        campaigns,
        collaborations,
        transactions,
        contracts,
        loading: false,
        error: null,
        metrics: {
          totalDepense,
          enEscrow,
          budgetTotal,
          campagnesActives: campaigns.filter(c => c.status === 'active').length,
          campagnesTotal: campaigns.length,
          collaborationsActives: collaborations.filter(c => ['in_progress', 'accepted'].includes(c.status)).length,
          collaborationsTotal: collaborations.length,
          contratsSignes: contracts.filter(c => c.status === 'signed').length,
        },
      })
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: err.message }))
    }
  }

  return data
}