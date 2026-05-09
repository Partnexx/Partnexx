import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('❌ Webhook signature invalide:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log(`✅ Webhook reçu: ${event.type}`)

  try {
    switch (event.type) {

      case 'payment_intent.succeeded': {
        const pi = event.data.object
        await handlePaymentSucceeded(pi)
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        await handlePaymentFailed(pi)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object
        await handleChargeRefunded(charge)
        break
      }

      case 'transfer.created': {
        const transfer = event.data.object
        await handleTransferCreated(transfer)
        break
      }

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`)
    }
  } catch (err) {
    console.error(`❌ Erreur traitement ${event.type}:`, err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSucceeded(pi) {
  console.log(`💰 PaymentIntent réussi: ${pi.id} — ${pi.amount / 100}€`)

  const { data, error } = await supabase
    .from('transactions')
    .update({
      status: 'in_escrow',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', pi.id)
    .select()

  if (error) {
    console.error('❌ Erreur update transaction:', error.message)
    throw error
  }

  const row = data?.[0]

  if (!row) {
    console.warn(`⚠️ Aucune transaction trouvée pour PaymentIntent: ${pi.id}`)
    return
  }

  console.log(`✅ Transaction ${row.id} → in_escrow`)

  if (row.collaboration_id) {
    const { error: collabError } = await supabase
      .from('collaborations')
      .update({
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.collaboration_id)
      .in('status', ['pending', 'accepted'])

    if (collabError) console.error('❌ Erreur update collaboration:', collabError.message)
    else console.log(`✅ Collaboration ${row.collaboration_id} → in_progress`)
  }
}

async function handlePaymentFailed(pi) {
  console.log(`❌ PaymentIntent échoué: ${pi.id}`)

  const { error } = await supabase
    .from('transactions')
    .update({
      status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', pi.id)

  if (error) {
    console.error('❌ Erreur update transaction (failed):', error.message)
    throw error
  }

  console.log(`✅ Transaction pour ${pi.id} → failed`)
}

async function handleChargeRefunded(charge) {
  console.log(`↩️ Remboursement pour PaymentIntent: ${charge.payment_intent}`)

  const { error } = await supabase
    .from('transactions')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', charge.payment_intent)

  if (error) {
    console.error('❌ Erreur update transaction (refunded):', error.message)
    throw error
  }

  console.log(`✅ Transaction pour ${charge.payment_intent} → refunded`)
}

async function handleTransferCreated(transfer) {
  console.log(`➡️ Virement créé: ${transfer.id}`)

  const transactionId = transfer.metadata?.transaction_id

  if (transactionId) {
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'released',
        stripe_transfer_id: transfer.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)

    if (error) {
      console.error('❌ Erreur update transaction (released):', error.message)
      throw error
    }

    console.log(`✅ Transaction ${transactionId} → released`)
  } else {
    console.warn(`⚠️ Pas de transaction_id dans metadata du transfer ${transfer.id}`)
  }
}