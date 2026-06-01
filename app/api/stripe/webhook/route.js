import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ============================================================
// Helper : récupère la fin de période d'un abonnement.
// Stripe a déplacé current_period_end de l'objet subscription
// vers les items dans ses versions d'API récentes → on lit les 2.
// ============================================================
function getSubscriptionPeriodEnd(subscription) {
  const ts =
    subscription?.current_period_end ??
    subscription?.items?.data?.[0]?.current_period_end ??
    null
  return ts ? new Date(ts * 1000).toISOString() : null
}

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
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.mode === 'subscription') {
          await handleSubscriptionCheckoutCompleted(session)
        }
        break
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object)
        break
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object)
        break
      }
      case 'invoice.paid': {
        await handleInvoicePaid(event.data.object)
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

  // 1. Passer la transaction en escrow
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

  // 2. Passer la collaboration en in_progress
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

  // 3. Email de notification escrow à la marque (non bloquant)
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://partnexx-three.vercel.app'

    const { data: brand } = await supabase
      .from('brands')
      .select('user_id, company_name')
      .eq('id', row.brand_id)
      .single()

    let brandEmail = null
    if (brand?.user_id) {
      const { data: brandAuth } = await supabase.auth.admin.getUserById(brand.user_id)
      brandEmail = brandAuth?.user?.email || null
    }

    if (brandEmail) {
      await fetch(`${appUrl}/api/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_escrow',
          to: brandEmail,
          data: {
            name: brand?.company_name || 'Marque',
            amount: pi.amount / 100,
            campaignTitle: row.description || 'Campagne Partnexx',
          },
        }),
      })
      console.log(`✅ Email escrow envoyé à ${brandEmail}`)
    } else {
      console.warn('⚠️ Email marque introuvable, email escrow non envoyé')
    }
  } catch (emailErr) {
    console.error('❌ Erreur envoi email escrow:', emailErr.message)
    // Non bloquant
  }

  // 4. Générer les factures PDF automatiquement (non bloquant)
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://partnexx-three.vercel.app'
    const invoiceRes = await fetch(`${appUrl}/api/stripe/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: row.id }),
    })

    if (invoiceRes.ok) {
      const { brandUrl, influencerUrl } = await invoiceRes.json()
      console.log(`✅ Factures générées — Brand: ${brandUrl}`)
      console.log(`✅ Reçu influenceur: ${influencerUrl}`)
    } else {
      console.error('❌ Erreur génération factures:', await invoiceRes.text())
    }
  } catch (invoiceErr) {
    console.error('❌ Erreur appel /api/stripe/invoices:', invoiceErr.message)
    // Non bloquant — la transaction est déjà en escrow
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

// ============================================================
// HANDLERS ABONNEMENTS
// On distingue 2 sortes d'abonnements via subscription.metadata.kind :
//   - "contract_payout" → abonnement d'un CONTRAT récurrent (verse le créateur)
//   - (sinon)           → abonnement de PLAN marque (Growth / Scale)
// ============================================================

async function handleSubscriptionCheckoutCompleted(session) {
  console.log(`🎉 Abonnement créé via Checkout: ${session.id}`)
  if (!session.subscription) {
    console.warn('⚠️ Pas de subscription dans la session Checkout')
    return
  }
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  // === BRANCHE 1 : abonnement de CONTRAT récurrent ===
  if (subscription.metadata?.kind === 'contract_payout') {
    const contractId = subscription.metadata.contract_id
    if (contractId) {
      await supabase
        .from('contracts')
        .update({
          stripe_subscription_id: subscription.id,
          payout_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId)
      console.log(`✅ Abonnement contrat ${contractId} activé (${subscription.id})`)
    }
    return
  }

  // === BRANCHE 2 : abonnement de PLAN marque (comportement existant) ===
  const brandId = session.metadata?.brand_id || null
  const plan = subscription.metadata?.plan || null
  const period = subscription.metadata?.period || null
  const periodEnd = getSubscriptionPeriodEnd(subscription)

  let finalBrandId = brandId
  if (!finalBrandId && session.customer) {
    const { data: b } = await supabase
      .from('brands')
      .select('id')
      .eq('stripe_customer_id', session.customer)
      .single()
    finalBrandId = b?.id
  }
  if (!finalBrandId) {
    console.error('❌ Impossible de trouver la brand pour la subscription')
    return
  }

  await supabase
    .from('brands')
    .update({
      subscription_plan: plan,
      subscription_period: period,
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      subscription_current_period_end: periodEnd,
      subscription_cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', finalBrandId)

  console.log(`✅ Brand ${finalBrandId} abonnée au plan ${plan} (${period})`)
}

async function handleSubscriptionUpdated(subscription) {
  console.log(`🔄 Abonnement mis à jour: ${subscription.id} — status ${subscription.status}`)

  // On ne touche que les abonnements de PLAN marque
  if (subscription.metadata?.kind === 'contract_payout') return

  const periodEnd = getSubscriptionPeriodEnd(subscription)

  await supabase
    .from('brands')
    .update({
      subscription_status: subscription.status,
      subscription_current_period_end: periodEnd,
      subscription_cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription) {
  console.log(`🛑 Abonnement annulé: ${subscription.id}`)

  // === BRANCHE : abonnement de CONTRAT → on coupe les versements ===
  if (subscription.metadata?.kind === 'contract_payout') {
    await supabase
      .from('contracts')
      .update({
        payout_active: false,
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
    console.log(`✅ Versements du contrat coupés (abonnement ${subscription.id})`)
    return
  }

  // === BRANCHE : abonnement de PLAN marque (comportement existant) ===
  await supabase
    .from('brands')
    .update({
      subscription_status: 'canceled',
      subscription_plan: 'trial',
      subscription_period: null,
      stripe_subscription_id: null,
      subscription_current_period_end: null,
      subscription_cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleInvoicePaid(invoice) {
  console.log(`🧾 Facture payée: ${invoice.id} — ${(invoice.amount_paid / 100).toFixed(2)}€`)

  // Récupérer l'id de la subscription (compatible anciennes ET nouvelles versions d'API)
  const subId =
    invoice.subscription ??
    invoice.parent?.subscription_details?.subscription ??
    invoice.lines?.data?.[0]?.subscription ??
    null

  if (!subId) return

  const subscription = await stripe.subscriptions.retrieve(subId)

  // === BRANCHE 1 : abonnement de CONTRAT → verser le créateur ===
  if (subscription.metadata?.kind === 'contract_payout') {
    await handleContractPayout(subscription, invoice)
    return
  }

  // === BRANCHE 2 : abonnement de PLAN marque (comportement existant) ===
  const periodEnd = getSubscriptionPeriodEnd(subscription)
  await supabase
    .from('brands')
    .update({
      subscription_status: subscription.status,
      subscription_current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
}

// Verse le créateur à chaque période payée d'un contrat récurrent.
async function handleContractPayout(subscription, invoice) {
  const contractId = subscription.metadata?.contract_id
  const influencerId = subscription.metadata?.influencer_id
  const creatorReceives = Number(subscription.metadata?.creator_receives) || 0

  console.log(`🔁 Versement contrat ${contractId} via facture ${invoice.id} — ${creatorReceives}€`)

  if (!influencerId || creatorReceives <= 0) {
    console.warn('⚠️ Métadonnées contrat incomplètes, versement ignoré')
    return
  }

  // Compte Stripe Connect du créateur
  const { data: influencer } = await supabase
    .from('influencers')
    .select('stripe_account_id')
    .eq('id', influencerId)
    .single()

  if (!influencer?.stripe_account_id) {
    console.warn('⚠️ Créateur pas connecté à Stripe, versement impossible')
    return
  }

  // Transfer IDEMPOTENT : un seul virement par facture (= par période)
  const transfer = await stripe.transfers.create(
    {
      amount: Math.round(creatorReceives * 100),
      currency: 'eur',
      destination: influencer.stripe_account_id,
      description: `Versement récurrent Partnexx — Contrat ${contractId}`,
      metadata: { contract_id: contractId, invoice_id: invoice.id, kind: 'contract_payout' },
    },
    { idempotencyKey: `contract_payout_${invoice.id}` }
  )

  // Tracer la date du dernier versement sur le contrat
  await supabase
    .from('contracts')
    .update({ last_released_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', contractId)

  console.log(`✅ ${creatorReceives}€ versés au créateur (contrat ${contractId}, transfer ${transfer.id})`)
}
