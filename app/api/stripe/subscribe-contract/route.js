import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { calculateCommission } from '@/lib/plans'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Convertit la fréquence du contrat en intervalle Stripe
function frequencyToInterval(frequency) {
  switch (frequency) {
    case 'weekly':   return { interval: 'week',  interval_count: 1 }
    case 'biweekly': return { interval: 'week',  interval_count: 2 }
    case 'monthly':  return { interval: 'month', interval_count: 1 }
    default:         return null
  }
}

export async function POST(req) {
  try {
    const { contractId } = await req.json()
    if (!contractId) {
      return NextResponse.json({ error: 'contractId requis' }, { status: 400 })
    }

    // 1. Authentifier la marque
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // 2. Trouver la marque
    const { data: brand, error: brandErr } = await supabaseAdmin
      .from('brands')
      .select('id, company_name, stripe_customer_id, subscription_plan')
      .eq('user_id', userId)
      .single()
    if (brandErr || !brand) return NextResponse.json({ error: 'Profil marque introuvable' }, { status: 404 })

    // 3. Récupérer le contrat (et vérifier qu'il appartient à cette marque)
    const { data: contract, error: contractErr } = await supabaseAdmin
      .from('contracts')
      .select('id, brand_id, influencer_id, contract_type, payout_frequency, payout_amount, stripe_subscription_id')
      .eq('id', contractId)
      .eq('brand_id', brand.id)
      .single()
    if (contractErr || !contract) return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })

    // 4. Vérifs récurrence
    const interval = frequencyToInterval(contract.payout_frequency)
    if (!interval) {
      return NextResponse.json({ error: "Ce contrat n'a pas de fréquence récurrente valide" }, { status: 400 })
    }
    if (!contract.payout_amount || contract.payout_amount <= 0) {
      return NextResponse.json({ error: 'Montant par période manquant (payout_amount)' }, { status: 400 })
    }
    if (contract.stripe_subscription_id) {
      return NextResponse.json({ error: 'Un abonnement existe déjà pour ce contrat' }, { status: 400 })
    }

    // 5. Commission : la marque paie le montant créateur + la commission (modèle Option 3)
    const brandPlan = (brand.subscription_plan || 'trial').toLowerCase()
    const { data: influencer } = await supabaseAdmin
      .from('influencers')
      .select('ai_score')
      .eq('id', contract.influencer_id)
      .single()
    const isLegend = (influencer?.ai_score || 0) >= 100000
    const breakdown = calculateCommission(brandPlan, isLegend, contract.payout_amount, { vatExempt: false })
    const brandTotalCents = Math.round(breakdown.brandTotal * 100)

    // 6. Récupérer ou créer le Customer Stripe
    let customerId = brand.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.user.email,
        name: brand.company_name || undefined,
        metadata: { brand_id: brand.id, user_id: userId },
      })
      customerId = customer.id
      await supabaseAdmin.from('brands').update({ stripe_customer_id: customerId }).eq('id', brand.id)
    }

    // 7. Créer la session Checkout abonnement, avec un prix à la volée
    //    (montant TTC marque + fréquence du contrat)
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          product_data: { name: `Contrat récurrent Partnexx — ${contract.contract_type}` },
          unit_amount: brandTotalCents,
          recurring: interval,
        },
      }],
      subscription_data: {
        metadata: {
          // ⚠️ "kind" permet au webhook de distinguer un abonnement CONTRAT
          // d'un abonnement de PLAN marque. Ne pas retirer.
          kind: 'contract_payout',
          contract_id: contract.id,
          influencer_id: contract.influencer_id,
          // Montants figés, lus par le webhook pour verser au créateur
          creator_receives: String(breakdown.creatorReceives),
          commission_ht: String(breakdown.commissionHT),
          vat: String(breakdown.vat),
          commission_ttc: String(breakdown.commissionTTC),
        },
      },
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      payment_method_collection: 'always',
      success_url: `${origin}/dashboard/brand?contract=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/brand?contract=cancelled`,
      locale: 'fr',
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Erreur abonnement contrat:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
