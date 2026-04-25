import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import supabase from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount, campaignId, brandId, description } = await req.json()

    if (!amount || amount < 100) {
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
    const commission = Math.round(amount * 0.15 * 100) / 100 // 15%
    const { error } = await supabase.from('transactions').insert({
      brand_id: brandId || null,
      campaign_id: campaignId || null,
      type: 'deposit',
      status: 'pending',
      amount: amount,
      commission: commission,
      net_amount: amount - commission,
      currency: 'EUR',
      stripe_payment_intent_id: paymentIntent.id,
      risk_level: 'low',
    })

    if (error) {
      console.error('Supabase insert error:', error)
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