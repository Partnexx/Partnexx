import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUSINESS_TYPE_MAP = {
  individual: 'individual',
  auto_entrepreneur: 'individual',
  company: 'company',
}

export async function POST(req) {
  try {
    const { influencerId, businessType } = await req.json()

    if (!influencerId) {
      return NextResponse.json({ error: 'influencerId requis' }, { status: 400 })
    }
    if (!businessType || !BUSINESS_TYPE_MAP[businessType]) {
      return NextResponse.json(
        { error: 'businessType invalide. Valeurs autorisees : individual, auto_entrepreneur, company' },
        { status: 400 }
      )
    }

    const { data: influencer, error: fetchError } = await supabaseAdmin
      .from('influencers')
      .select('id, stripe_account_id')
      .eq('id', influencerId)
      .single()

    if (fetchError || !influencer) {
      return NextResponse.json({ error: 'Createur introuvable' }, { status: 404 })
    }

    let accountId = influencer.stripe_account_id

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        business_type: BUSINESS_TYPE_MAP[businessType],
        capabilities: {
          transfers: { requested: true },
        },
      })
      accountId = account.id

      const { error: updateError } = await supabaseAdmin
        .from('influencers')
        .update({
          stripe_account_id: accountId,
          business_type: businessType,
        })
        .eq('id', influencerId)

      if (updateError) {
        console.error('Update influencer error:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('influencers')
        .update({ business_type: businessType })
        .eq('id', influencerId)

      if (updateError) {
        console.error('Update business_type error:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://partnexx-three.vercel.app'
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: baseUrl + '/dashboard/influencer?stripe=refresh',
      return_url: baseUrl + '/dashboard/influencer?stripe=success',
      type: 'account_onboarding',
    })

    return NextResponse.json({
      url: accountLink.url,
      accountId,
      businessType,
    })
  } catch (error) {
    console.error('Connect onboard error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}