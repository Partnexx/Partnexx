import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import supabase from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      // Paiement réussi → mettre en escrow
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        await supabase
          .from('transactions')
          .update({
            status: 'in_escrow',
            escrow_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
          })
          .eq('stripe_payment_intent_id', pi.id)
        console.log('✅ Paiement réussi, fonds en escrow:', pi.id)
        break
      }

      // Paiement échoué
      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        await supabase
          .from('transactions')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', pi.id)
        console.log('❌ Paiement échoué:', pi.id)
        break
      }

      // Remboursement
      case 'charge.refunded': {
        const charge = event.data.object
        if (charge.payment_intent) {
          await supabase
            .from('transactions')
            .update({ status: 'refunded' })
            .eq('stripe_payment_intent_id', charge.payment_intent)
        }
        console.log('🔄 Remboursement effectué:', charge.id)
        break
      }

      default:
        console.log('Événement non géré:', event.type)
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}