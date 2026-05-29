import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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
        await handlePaymentSucceeded(pi, req)
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

async function handlePaymentSucceeded(pi, req) {
  console.log(`💰 PaymentIntent réussi: ${pi.id} — ${pi.amount / 100}€`)

  // Envoie email de notification escrow
try {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://partnexx-three.vercel.app'
  
  // Récupère les emails de la marque et de l'influenceur
  const [brandUser, influencerUser] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', row.brand_id).single(),
    supabase.from('profiles').select('full_name').eq('id', row.influencer_id).single(),
  ])

  // Email à la marque
  if (brandUser.data) {
    await fetch(`${appUrl}/api/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'payment_escrow',
        to: 'perquindylan.fr@gmail.com', // remplacer par l'email réel de la marque
        data: {
          name: brandUser.data.full_name || 'Marque',
          amount: pi.amount / 100,
          campaignTitle: row.description || 'Campagne Partnexx',
        }
      })
    })
  }
} catch (emailErr) {
  console.error('❌ Erreur envoi email escrow:', emailErr.message)
  // Non bloquant
}

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

  // Passe la collaboration en in_progress
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

  // Génère les factures PDF automatiquement
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
// HANDLERS ABONNEMENTS (Stripe Subscriptions + Invoicing)
// ============================================================

async function handleSubscriptionCheckoutCompleted(session) {
  console.log(`🎉 Abonnement créé via Checkout: ${session.id}`)
  const brandId = session.metadata?.brand_id || session.subscription_data?.metadata?.brand_id
  if (!session.subscription) {
    console.warn('⚠️ Pas de subscription dans la session Checkout')
    return
  }
  // Récupérer le détail de l'abonnement pour avoir les infos complètes
  const subscription = await stripe.subscriptions.retrieve(session.subscription)
  const plan = subscription.metadata?.plan || null
  const period = subscription.metadata?.period || null
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

  // Trouver la brand : via metadata, sinon via stripe_customer_id
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
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

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
  // Stripe Invoicing a déjà généré et envoyé la facture par email à la marque.
  // Ici on met juste à jour l'état d'abonnement (utile pour les renouvellements mensuels/annuels).
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    const periodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null
    await supabase
      .from('brands')
      .update({
        subscription_status: subscription.status,
        subscription_current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }
}