import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { calculateCommission, getBrandPlanKey } from '@/lib/plans'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const {
      amount,
      brandId,
      creatorId, // user_id du créateur
      campaignId,
      collaborationId,
      contractId,
      description,
    } = await req.json()

    // ===== Validations =====
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Montant invalide (minimum 1€)' }, { status: 400 })
    }
    if (!brandId) {
      return NextResponse.json({ error: 'brandId requis' }, { status: 400 })
    }
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId (user_id) requis' }, { status: 400 })
    }

    // ===== Récupération du plan de la marque (+ pays/TVA pour autoliquidation) =====
    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .select('subscription_plan, subscription_status, subscription_current_period_end')
      .eq('id', brandId)
      .single()

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Marque introuvable' }, { status: 404 })
    }
    // Plan EFFECTIF : si l'abonnement est annulé/impayé/expiré, la marque
    // retombe sur 'trial' (18%) au lieu de garder son taux préférentiel.
    const brandPlan = getBrandPlanKey(brand)

    // Autoliquidation : pour l'instant toujours false (marques FR).
    // Plus tard : true si marque UE hors France avec n° TVA intracommunautaire valide.
    const vatExempt = false

    // ===== Récupération du créateur (id + score) à partir du user_id =====
    const { data: influencer, error: influencerError } = await supabaseAdmin
      .from('influencers')
      .select('id, ai_score')
      .eq('user_id', creatorId)
      .single()

    if (influencerError || !influencer) {
      return NextResponse.json({ error: 'Créateur introuvable' }, { status: 404 })
    }
    const influencerRowId = influencer.id // ← l'id à utiliser pour la FK
    const isLegend = (influencer.ai_score || 0) >= 100000

    // ===== Calcul de la commission avec TVA + bonus Légende éventuel =====
    const breakdown = calculateCommission(brandPlan, isLegend, amount, { vatExempt })

    // ===== Montant total facturé à la marque (créateur + commission TTC) =====
    const brandTotal = breakdown.brandTotal

    // ===== Création du PaymentIntent Stripe (la marque paie le total TTC) =====
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(brandTotal * 100), // total TTC en centimes
      currency: 'eur',
      metadata: {
        campaignId: campaignId || '',
        brandId,
        creatorId,
        influencerRowId,
        brandPlan,
        isLegend: isLegend ? 'true' : 'false',
        commission_ht: String(breakdown.commissionHT),
        vat: String(breakdown.vat),
        commission_ttc: String(breakdown.commissionTTC),
        description: description || 'Paiement collaboration Partnexx',
      },
      description: description || 'Paiement collaboration Partnexx',
    })

    // ===== Création de la transaction en base (statut pending) =====
    const { error: insertError } = await supabaseAdmin.from('transactions').insert({
      brand_id: brandId,
      influencer_id: influencerRowId, // ← FK vers influencers.id
      collaboration_id: collaborationId || null,
      contract_id: contractId || null,
      type: 'payment',
      status: 'pending',
      amount,
      platform_fee: breakdown.partnexxCutHT, // marge HT PARTNEXX
      influencer_amount: breakdown.creatorReceives,
      currency: 'EUR',
      stripe_payment_intent_id: paymentIntent.id,
      description: description || 'Paiement collaboration Partnexx',
      metadata: {
        brand_plan: brandPlan,
        is_legend: isLegend,
        marque_rate: breakdown.marqueRate,
        // Détail commission + TVA
        commission_ht: breakdown.commissionHT,
        vat_rate: breakdown.vatRate,
        vat: breakdown.vat,
        commission_ttc: breakdown.commissionTTC,
        partnexx_cut_ht: breakdown.partnexxCutHT,
        creator_bonus: breakdown.creatorBonus,
        creator_receives: breakdown.creatorReceives,
        brand_total: breakdown.brandTotal,
        vat_exempt: vatExempt,
        creator_user_id: creatorId,
        calculated_at: new Date().toISOString(),
      },
    })

    if (insertError) {
      console.error('Supabase insert error:', JSON.stringify(insertError))
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      breakdown,
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
