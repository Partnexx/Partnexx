import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import supabase from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature invalide:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {

    case 'payment_intent.succeeded': {
      const pi = event.data.object
      await supabase
        .from('transactions')
        .update({
          status: 'in_escrow',
          stripe_payment_intent_id: pi.id,
        })
        .eq('stripe_payment_intent_id', pi.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object
      await supabase
        .from('transactions')
        .update({ status: 'refunded' })
        .eq('stripe_payment_intent_id', pi.id)
      break
    }

    case 'transfer.created': {
      const transfer = event.data.object
      await supabase
        .from('transactions')
        .update({
          status: 'released',
          stripe_transfer_id: transfer.id,
          released_at: new Date().toISOString(),
        })
        .eq('stripe_payment_intent_id', transfer.source_transaction)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object
      await supabase
        .from('transactions')
        .update({ status: 'refunded' })
        .eq('stripe_payment_intent_id', charge.payment_intent)
      break
    }

    default:
      console.log(`Event non géré: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}