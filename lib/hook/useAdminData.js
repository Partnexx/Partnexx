import { useState, useEffect, useCallback } from 'react'
import supabase from '@/lib/supabase'

export function useAdminData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [stats, setStats] = useState({
    total_users: 0,
    total_creators: 0,
    total_brands: 0,
    active_campaigns: 0,
    total_campaigns: 0,
    total_volume: 0,
    total_revenue: 0,
    escrow_amount: 0,
    open_disputes: 0,
    open_tickets: 0,
    pending_kyc: 0,
  })

  const [users, setUsers] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [transactions, setTransactions] = useState([])
  const [disputes, setDisputes] = useState([])
  const [tickets, setTickets] = useState([])
  const [kyc, setKyc] = useState([])
  const [marketing, setMarketing] = useState([])

  const fetchStats = useCallback(async () => {
    try {
      const [usersRes, campaignsRes, txRes] = await Promise.all([
        supabase.from('profiles').select('id, role'),
        supabase.from('campaigns').select('id, status'),
        supabase.from('transactions').select('amount, platform_fee, status'), // ← platform_fee
      ])

      const allUsers = usersRes.data || []
      const allTx = txRes.data || []
      const allCampaigns = campaignsRes.data || []

      setStats({
        total_users: allUsers.length,
        total_creators: allUsers.filter(u => u.role === 'influencer').length,
        total_brands: allUsers.filter(u => u.role === 'brand').length,
        active_campaigns: allCampaigns.filter(c => c.status === 'active').length,
        total_campaigns: allCampaigns.length,
        total_volume: allTx.reduce((s, t) => s + (Number(t.amount) || 0), 0),
        total_revenue: allTx.reduce((s, t) => s + (Number(t.platform_fee) || 0), 0), // ← platform_fee
        escrow_amount: allTx.filter(t => t.status === 'in_escrow').reduce((s, t) => s + (Number(t.amount) || 0), 0),
        open_disputes: 0,
        open_tickets: 0,
        pending_kyc: 0,
      })
    } catch (err) {
      console.error('fetchStats error:', err)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setUsers(data)
  }, [])

  const fetchCampaigns = useCallback(async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setCampaigns(data)
  }, [])

  const fetchTransactions = useCallback(async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setTransactions(data)
  }, [])

  const fetchDisputes = useCallback(async () => {
  const { data } = await supabase
    .from('disputes')
    .select('*')
    .order('created_at', { ascending: false })
  if (data) {
    setDisputes(data)
    setStats(prev => ({ ...prev, open_disputes: data.filter(d => d.status === 'open').length }))
  }
}, [])

  const fetchTickets = useCallback(async () => {
    // Table support_tickets pas encore créée — on skip silencieusement
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTickets(data)
  }, [])

  const fetchKyc = useCallback(async () => {
    // Table kyc_verifications pas encore créée — on skip silencieusement
    const { data } = await supabase
      .from('kyc_verifications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setKyc(data)
  }, [])

  const fetchMarketing = useCallback(async () => {
    const { data } = await supabase
      .from('marketing_content')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setMarketing(data)
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      // On fetch en parallèle mais on ignore les erreurs des tables optionnelles
      await Promise.allSettled([
        fetchStats(),
        fetchUsers(),
        fetchCampaigns(),
        fetchTransactions(),
        fetchDisputes(),
        fetchTickets(),
        fetchKyc(),
        fetchMarketing(),
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchStats, fetchUsers, fetchCampaigns, fetchTransactions, fetchDisputes, fetchTickets, fetchKyc, fetchMarketing])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const channels = []
    const tables = ['profiles', 'campaigns', 'transactions']
    const refetch = {
      profiles: fetchUsers,
      campaigns: fetchCampaigns,
      transactions: fetchTransactions,
    }

    tables.forEach(table => {
      channels.push(
        supabase.channel(`${table}-changes`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
            refetch[table]()
            fetchStats()
          })
          .subscribe()
      )
    })

    return () => channels.forEach(ch => supabase.removeChannel(ch))
  }, [fetchUsers, fetchCampaigns, fetchTransactions, fetchStats])

  // ── Actions admin ─────────────────────────────────────────────────────────

  const suspendUser = async (userId) => {
    await supabase.from('profiles').update({ status: 'suspended' }).eq('id', userId)
  }

  const activateUser = async (userId) => {
    await supabase.from('profiles').update({ status: 'active' }).eq('id', userId)
  }

  const changeUserRole = async (userId, role) => {
    await supabase.from('profiles').update({ role }).eq('id', userId)
  }

  const blockCampaign = async (campaignId, reason) => {
    await supabase.from('campaigns').update({ status: 'blocked' }).eq('id', campaignId)
  }

  const unblockCampaign = async (campaignId) => {
    await supabase.from('campaigns').update({ status: 'active' }).eq('id', campaignId)
  }

  const releaseTransaction = async (transactionId) => {
    await supabase.from('transactions').update({ status: 'released', released_at: new Date().toISOString() }).eq('id', transactionId)
  }

  const freezeTransaction = async (transactionId) => {
    await supabase.from('transactions').update({ status: 'in_escrow' }).eq('id', transactionId)
  }

  const resolveDispute = async (disputeId, resolution, adminNote, resolvedBy) => {
  const res = await fetch('/api/disputes', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disputeId, resolution, adminNote, resolvedBy }),
  })
  const data = await res.json()
  if (data.success) fetchDisputes()
  return data
}

  const approveKyc = async (kycId) => {
    await supabase.from('kyc_verifications').update({ status: 'approved', verified_at: new Date().toISOString() }).eq('id', kycId)
  }

  const rejectKyc = async (kycId, reason) => {
    await supabase.from('kyc_verifications').update({ status: 'rejected', rejected_reason: reason }).eq('id', kycId)
  }

  const closeTicket = async (ticketId) => {
    await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', ticketId)
  }

  const createMarketingContent = async (data) => {
    await supabase.from('marketing_content').insert(data)
    fetchMarketing()
  }

  const updateMarketingContent = async (id, data) => {
    await supabase.from('marketing_content').update(data).eq('id', id)
    fetchMarketing()
  }

  const deleteMarketingContent = async (id) => {
    await supabase.from('marketing_content').delete().eq('id', id)
    fetchMarketing()
  }

  const publishMarketingContent = async (id) => {
    await supabase.from('marketing_content').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id)
    fetchMarketing()
  }

  return {
    loading,
    error,
    refetch: fetchAll,
    stats,
    users,
    campaigns,
    transactions,
    disputes,
    tickets,
    kyc,
    marketing,
    suspendUser,
    activateUser,
    changeUserRole,
    blockCampaign,
    unblockCampaign,
    releaseTransaction,
    freezeTransaction,
    resolveDispute,
    approveKyc,
    rejectKyc,
    closeTicket,
    createMarketingContent,
    updateMarketingContent,
    deleteMarketingContent,
    publishMarketingContent,
  }
}