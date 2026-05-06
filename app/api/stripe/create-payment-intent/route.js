import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ← service role, pas anon key
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount, campaignId, brandId, description } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Montant invalide (minimum 1€)' }, { status: 400 })
    }

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // en centimes
      currency: 'eur',
      metadata: {
        campaignId: campaignId || '',
        brandId: brandId || '',
        description: description || 'Dépôt campagne Partnexx',
      },
      description: description || 'Dépôt campagne Partnexx',
    })

    // Créer la transaction en base avec statut pending
const { error } = await supabaseAdmin.from('transactions').insert({
  brand_id: brandId || null,
  influencer_id: '182ff702-52c5-4e44-8a40-ab3ca26275d7', // Mathias — temp pour test
  type: 'payment',
  status: 'pending',
  amount: amount,
  platform_fee: Math.round(amount * 0.15 * 100) / 100,
  influencer_amount: Math.round(amount * 0.85 * 100) / 100,
  currency: 'EUR',
  stripe_payment_intent_id: paymentIntent.id,
})

    if (error) {
  console.error('Supabase insert error:', JSON.stringify(error))
  return NextResponse.json({ error: error.message }, { status: 500 })
}

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}