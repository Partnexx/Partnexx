/**
 * MOCK escrowStore — structure prête à brancher Supabase.
 *
 * Pour brancher Supabase plus tard, il suffira de :
 * 1. Créer les tables `escrows` + `escrow_tranches` dans Supabase
 * 2. Remplacer le contenu des fonctions `fetchEscrows`, `fetchEscrowTranches`,
 *    `validateTranche`, `releaseTranche` par des vrais appels Supabase.
 *
 * Schéma cible Supabase :
 *   escrows: id, contract_id, company_id, influencer_id, amount, frequency,
 *            payment_split, contract_type, validation_required, contract_duration,
 *            status, created_at, updated_at
 *   escrow_tranches: id, escrow_id, amount, release_date, status,
 *                    validated_at, released_at, auto_validation_date, payment_reference
 */

export type EscrowStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed'
export type TrancheStatus = 'pending' | 'validated' | 'released' | 'cancelled' | 'disputed'
export type ContractType = 'UGC' | 'Ambassadeur' | 'One-shot' | 'Placement de produit' | 'Notoriété' | 'Affiliation'
export type Frequency = 'unique' | 'hebdomadaire' | 'mensuel'
export type PaymentSplit = '100_avant' | '50_50' | '30_70' | '50_reception'

export interface EscrowTranche {
  id: string
  escrow_id: string
  amount: number
  release_date: string
  status: TrancheStatus
  validated_at?: string
  released_at?: string
  auto_validation_date?: string
  payment_reference?: string
}

export interface Escrow {
  id: string
  contract_id: string
  company_id: string
  influencer_id: string
  amount: number
  frequency: Frequency
  payment_split: PaymentSplit
  contract_type: ContractType
  validation_required: boolean
  contract_duration?: number
  status: EscrowStatus
  created_at: string
  updated_at: string
}

/* ============ MOCK DATA ============ */

const mockEscrows: Escrow[] = [
  {
    id: 'esc_001',
    contract_id: 'ctr_001',
    company_id: 'comp_1',
    influencer_id: 'Sophie Martin',
    amount: 3000,
    frequency: 'mensuel',
    payment_split: '50_50',
    contract_type: 'Ambassadeur',
    validation_required: false,
    contract_duration: 6,
    status: 'active',
    created_at: '2024-07-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: 'esc_002',
    contract_id: 'ctr_002',
    company_id: 'comp_1',
    influencer_id: 'Léa Rousseau',
    amount: 6000,
    frequency: 'mensuel',
    payment_split: '50_50',
    contract_type: 'Ambassadeur',
    validation_required: false,
    contract_duration: 12,
    status: 'active',
    created_at: '2024-06-15T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z',
  },
  {
    id: 'esc_003',
    contract_id: 'ctr_003',
    company_id: 'comp_1',
    influencer_id: 'Emma Dubois',
    amount: 800,
    frequency: 'unique',
    payment_split: '100_avant',
    contract_type: 'UGC',
    validation_required: true,
    status: 'active',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: 'esc_004',
    contract_id: 'ctr_004',
    company_id: 'comp_1',
    influencer_id: 'Thomas Leroy',
    amount: 600,
    frequency: 'unique',
    payment_split: '50_reception',
    contract_type: 'UGC',
    validation_required: true,
    status: 'completed',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-18T00:00:00Z',
  },
  {
    id: 'esc_005',
    contract_id: 'ctr_005',
    company_id: 'comp_1',
    influencer_id: 'Jules Martinez',
    amount: 1200,
    frequency: 'unique',
    payment_split: '50_50',
    contract_type: 'Placement de produit',
    validation_required: true,
    status: 'active',
    created_at: '2024-11-20T00:00:00Z',
    updated_at: '2024-12-08T00:00:00Z',
  },
  {
    id: 'esc_006',
    contract_id: 'ctr_006',
    company_id: 'comp_1',
    influencer_id: 'Marie Skincare',
    amount: 2500,
    frequency: 'unique',
    payment_split: '30_70',
    contract_type: 'One-shot',
    validation_required: true,
    status: 'active',
    created_at: '2024-12-05T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
  },
  {
    id: 'esc_007',
    contract_id: 'ctr_007',
    company_id: 'comp_1',
    influencer_id: 'Alex Tech',
    amount: 4500,
    frequency: 'unique',
    payment_split: '100_avant',
    contract_type: 'Notoriété',
    validation_required: false,
    status: 'completed',
    created_at: '2024-10-10T00:00:00Z',
    updated_at: '2024-10-25T00:00:00Z',
  },
]

const mockTranches: Record<string, EscrowTranche[]> = {
  esc_001: [
    { id: 't1', escrow_id: 'esc_001', amount: 500, release_date: '2024-08-01', status: 'released', released_at: '2024-08-01' },
    { id: 't2', escrow_id: 'esc_001', amount: 500, release_date: '2024-09-01', status: 'released', released_at: '2024-09-01' },
    { id: 't3', escrow_id: 'esc_001', amount: 500, release_date: '2024-10-01', status: 'released', released_at: '2024-10-01' },
    { id: 't4', escrow_id: 'esc_001', amount: 500, release_date: '2024-11-01', status: 'pending' },
    { id: 't5', escrow_id: 'esc_001', amount: 500, release_date: '2024-12-01', status: 'pending' },
    { id: 't6', escrow_id: 'esc_001', amount: 500, release_date: '2025-01-01', status: 'pending' },
  ],
  esc_003: [
    { id: 't7', escrow_id: 'esc_003', amount: 800, release_date: '2024-12-17', status: 'pending', auto_validation_date: '2024-12-17' },
  ],
  esc_005: [
    { id: 't8', escrow_id: 'esc_005', amount: 600, release_date: '2024-11-20', status: 'released', released_at: '2024-11-20' },
    { id: 't9', escrow_id: 'esc_005', amount: 600, release_date: '2024-12-15', status: 'validated', validated_at: '2024-12-08' },
  ],
}

/* ============ FONCTIONS (à brancher Supabase plus tard) ============ */

export async function fetchEscrows(): Promise<Escrow[]> {
  // À remplacer par: supabase.from('escrows').select('*').eq('company_id', brandId)
  await new Promise((r) => setTimeout(r, 300)) // simule latence réseau
  return [...mockEscrows]
}

export async function fetchEscrowTranches(escrowId: string): Promise<EscrowTranche[]> {
  // À remplacer par: supabase.from('escrow_tranches').select('*').eq('escrow_id', escrowId)
  await new Promise((r) => setTimeout(r, 200))
  return mockTranches[escrowId] || []
}

export async function validateTranche(trancheId: string): Promise<void> {
  // À remplacer par: supabase.from('escrow_tranches').update({ status: 'validated', validated_at: new Date() }).eq('id', trancheId)
  await new Promise((r) => setTimeout(r, 300))
  for (const list of Object.values(mockTranches)) {
    const t = list.find((x) => x.id === trancheId)
    if (t) {
      t.status = 'validated'
      t.validated_at = new Date().toISOString()
    }
  }
}

export async function releaseTranche(trancheId: string): Promise<void> {
  // À remplacer par: supabase.from('escrow_tranches').update({ status: 'released', released_at: new Date() }).eq('id', trancheId)
  await new Promise((r) => setTimeout(r, 300))
  for (const list of Object.values(mockTranches)) {
    const t = list.find((x) => x.id === trancheId)
    if (t) {
      t.status = 'released'
      t.released_at = new Date().toISOString()
    }
  }
}

export const calculateInitialPayment = (totalAmount: number, paymentSplit: PaymentSplit): number => {
  switch (paymentSplit) {
    case '100_avant': return totalAmount
    case '50_50':
    case '50_reception': return totalAmount * 0.5
    case '30_70': return totalAmount * 0.3
    default: return totalAmount
  }
}