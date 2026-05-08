import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const { transactionId } = await req.json()

    // 1. Récupérer la transaction
    const { data: tx } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (!tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })
    if (tx.status !== 'in_escrow' && tx.status !== 'released' && tx.status !== 'pending') {
  return NextResponse.json({ error: 'Transaction pas encore en escrow' }, { status: 400 })
}

    // 2. Récupérer le stripe_account_id de l'influenceur
    const { data: influencer } = await supabaseAdmin
      .from('influencers')
      .select('stripe_account_id, user_id')
      .eq('id', tx.influencer_id)
      .single()

    if (!influencer?.stripe_account_id) {
      return NextResponse.json({ error: 'Influenceur pas encore connecté à Stripe' }, { status: 400 })
    }

    // 3. Créer le transfer Stripe (85% du montant)
    const transferAmount = Math.round((tx.influencer_amount || tx.amount * 0.85) * 100)

const transfer = await stripe.transfers.create({
  amount: transferAmount,
  currency: 'eur',
  destination: influencer.stripe_account_id,
  description: `Virement Partnexx — Transaction ${tx.id}`,
})

    // 4. Mettre à jour la transaction
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'released',
        stripe_transfer_id: transfer.id,
        released_at: new Date().toISOString(),
      })
      .eq('id', transactionId)

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      amount: transferAmount / 100,
    })

  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}