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
      const [usersRes, campaignsRes, txRes, disputesRes, ticketsRes, kycRes] = await Promise.all([
        supabase.from('profiles').select('id, role'),
        supabase.from('campaigns').select('id, status'),
        supabase.from('transactions').select('amount, commission, status'),
        supabase.from('disputes').select('id, status'),
        supabase.from('support_tickets').select('id, status'),
        supabase.from('kyc_verifications').select('id, status'),
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
        total_revenue: allTx.reduce((s, t) => s + (Number(t.commission) || 0), 0),
        escrow_amount: allTx.filter(t => t.status === 'in_escrow').reduce((s, t) => s + (Number(t.amount) || 0), 0),
        open_disputes: (disputesRes.data || []).filter(d => ['open', 'investigating'].includes(d.status)).length,
        open_tickets: (ticketsRes.data || []).filter(t => ['open', 'in_progress'].includes(t.status)).length,
        pending_kyc: (kycRes.data || []).filter(k => k.status === 'pending').length,
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
    if (data) setDisputes(data)
  }, [])

  const fetchTickets = useCallback(async () => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTickets(data)
  }, [])

  const fetchKyc = useCallback(async () => {
    const { data } = await supabase
      .from('kyc_verifications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setKyc(data)
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchCampaigns(),
        fetchTransactions(),
        fetchDisputes(),
        fetchTickets(),
        fetchKyc(),
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchStats, fetchUsers, fetchCampaigns, fetchTransactions, fetchDisputes, fetchTickets, fetchKyc])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const channels = []

    const tables = ['profiles', 'campaigns', 'transactions', 'disputes', 'support_tickets', 'kyc_verifications']
    const refetch = { profiles: fetchUsers, campaigns: fetchCampaigns, transactions: fetchTransactions, disputes: fetchDisputes, support_tickets: fetchTickets, kyc_verifications: fetchKyc }

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
  }, [fetchUsers, fetchCampaigns, fetchTransactions, fetchDisputes, fetchTickets, fetchKyc, fetchStats])

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
    await supabase.from('campaigns').update({ status: 'blocked', is_blocked: true, blocked_reason: reason }).eq('id', campaignId)
  }

  const unblockCampaign = async (campaignId) => {
    await supabase.from('campaigns').update({ status: 'active', is_blocked: false, blocked_reason: null }).eq('id', campaignId)
  }

  const releaseTransaction = async (transactionId) => {
    await supabase.from('transactions').update({ status: 'released', released_at: new Date().toISOString() }).eq('id', transactionId)
  }

  const freezeTransaction = async (transactionId) => {
    await supabase.from('transactions').update({ status: 'frozen' }).eq('id', transactionId)
  }

  const resolveDispute = async (disputeId, resolution) => {
    await supabase.from('disputes').update({ status: 'resolved', resolution, resolved_at: new Date().toISOString() }).eq('id', disputeId)
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
  }
}