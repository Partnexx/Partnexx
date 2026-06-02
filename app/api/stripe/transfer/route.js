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
    // 0. AUTH SYSTÈME : seul le process planifié (cron) qui connaît le secret peut appeler.
    //    Empêche n'importe qui sur internet de déclencher un virement.
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { transactionId } = await req.json()
    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId requis' }, { status: 400 })
    }

    // 1. Récupérer la transaction
    const { data: tx } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (!tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })

    // 2. GARDE-FOU : on ne libère QUE ce qui est réellement en escrow.
    //    Bloque les doubles paiements (released) et les paiements avant encaissement (pending).
    if (tx.status !== 'in_escrow') {
      return NextResponse.json(
        { error: `Transaction non libérable (statut actuel: ${tx.status})` },
        { status: 400 }
      )
    }

    // 3. Récupérer le compte Stripe Connect du créateur
    const { data: influencer } = await supabaseAdmin
      .from('influencers')
      .select('stripe_account_id, user_id')
      .eq('id', tx.influencer_id)
      .single()

    if (!influencer?.stripe_account_id) {
      return NextResponse.json({ error: 'Influenceur pas encore connecté à Stripe' }, { status: 400 })
    }

    // 4. Montant à verser = montant COMPLET du créateur.
    //    Modèle Option 3 (Malt/Comet) : la commission est payée EN PLUS par la marque,
    //    donc le créateur touche 100% de son montant. (Avant : * 0.85, ce qui était l'ancien modèle.)
    const transferAmount = Math.round((tx.influencer_amount ?? tx.amount) * 100)
    if (!transferAmount || transferAmount <= 0) {
      return NextResponse.json({ error: 'Montant de virement invalide' }, { status: 400 })
    }

    // 5. Créer le transfer — IDEMPOTENT : même appelé plusieurs fois pour la même
    //    transaction, Stripe ne crée qu'un seul virement.
    const transfer = await stripe.transfers.create(
      {
        amount: transferAmount,
        currency: 'eur',
        destination: influencer.stripe_account_id,
        description: `Virement Partnexx — Transaction ${tx.id}`,
        metadata: { transaction_id: tx.id },
      },
      { idempotencyKey: `transfer_${tx.id}` }
    )

    // 6. Mettre à jour la transaction
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'released',
        stripe_transfer_id: transfer.id,
        released_at: new Date().toISOString(),
      })
      .eq('id', transactionId)

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      amount: transferAmount / 100,
    })

  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}