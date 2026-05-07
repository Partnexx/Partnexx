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
    const { influencerId } = await req.json()

    // 1. Créer un compte Connect Stripe pour l'influenceur
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      capabilities: {
        transfers: { requested: true },
      },
    })

    // 2. Sauvegarder le stripe_account_id dans Supabase
    await supabaseAdmin
      .from('influencers')
      .update({ stripe_account_id: account.id })
      .eq('id', influencerId)

    // 3. Créer le lien d'onboarding Stripe
    const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `https://partnexx-three.vercel.app/dashboard/influencer?stripe=refresh`,
  return_url: `https://partnexx-three.vercel.app/dashboard/influencer?stripe=success`,
  type: 'account_onboarding',
})

    return NextResponse.json({ url: accountLink.url })

  } catch (error) {
    console.error('Connect onboard error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}