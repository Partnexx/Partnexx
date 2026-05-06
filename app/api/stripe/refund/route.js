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
    const { transactionId, amount, reason } = await req.json()

    // 1. Récupérer la transaction dans Supabase
    const { data: tx, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (txError || !tx) {
      return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })
    }

    if (!tx.stripe_payment_intent_id) {
      return NextResponse.json({ error: 'Pas de Payment Intent Stripe associé' }, { status: 400 })
    }

    // 2. Créer le remboursement sur Stripe
    const refundParams = {
      payment_intent: tx.stripe_payment_intent_id,
      reason: reason || 'requested_by_customer',
    }

    // Si montant partiel spécifié
    if (amount && amount < tx.amount) {
      refundParams.amount = Math.round(amount * 100) // en centimes
    }

    const refund = await stripe.refunds.create(refundParams)

    // 3. Mettre à jour la transaction dans Supabase
    const isPartial = amount && amount < tx.amount
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'refunded',
        description: `Remboursé le ${new Date().toLocaleDateString('fr-FR')} — ${isPartial ? 'Partiel' : 'Total'} — Stripe refund: ${refund.id}`,
      })
      .eq('id', transactionId)

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    })

  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}