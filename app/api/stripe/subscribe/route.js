import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Mapping plan + période → Price ID
const PRICE_IDS = {
  growth_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_MONTHLY,
  growth_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_YEARLY,
  scale_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_MONTHLY,
  scale_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_YEARLY,
}

export async function POST(req) {
  try {
    const { plan, period } = await req.json()

    // 1. Validations
    if (!['growth', 'scale'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide (growth ou scale)' }, { status: 400 })
    }
    if (!['monthly', 'yearly'].includes(period)) {
      return NextResponse.json({ error: 'Période invalide (monthly ou yearly)' }, { status: 400 })
    }
    const priceId = PRICE_IDS[`${plan}_${period}`]
    if (!priceId) {
      return NextResponse.json({ error: 'Prix Stripe non configuré' }, { status: 500 })
    }

    // 2. Authentifier la marque (token Bearer)
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }
    const userId = userData.user.id

    // 3. Trouver la marque
    const { data: brand, error: brandErr } = await supabaseAdmin
      .from('brands')
      .select('id, company_name, stripe_customer_id')
      .eq('user_id', userId)
      .single()
    if (brandErr || !brand) {
      return NextResponse.json({ error: 'Profil marque introuvable' }, { status: 404 })
    }

    // 4. Récupérer ou créer le Customer Stripe
    let customerId = brand.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.user.email,
        name: brand.company_name || undefined,
        metadata: { brand_id: brand.id, user_id: userId },
      })
      customerId = customer.id
      await supabaseAdmin
        .from('brands')
        .update({ stripe_customer_id: customerId })
        .eq('id', brand.id)
    }

    // 5. Créer la session Checkout en mode subscription
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      // Stripe Invoicing : génère et envoie automatiquement les factures par email
      subscription_data: {
        metadata: {
          brand_id: brand.id,
          plan,
          period,
        },
      },
      // Collecte du numéro de TVA intracommunautaire (utile pour autoliquidation UE)
      tax_id_collection: { enabled: true },
      // Adresse de facturation obligatoire en B2B
      billing_address_collection: 'required',
      // Sauvegarde la méthode de paiement pour les renouvellements
      payment_method_collection: 'always',
      // Pages de retour après paiement
      success_url: `${origin}/dashboard/brand?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/brand?subscription=cancelled`,
      // Locale
      locale: 'fr',
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Erreur création abonnement:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}