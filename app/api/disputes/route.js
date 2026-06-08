import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST — Ouvrir un litige
// Body: { transactionId?, collaborationId?, openedBy, openedByRole, reason, description }
// transactionId / collaborationId sont OPTIONNELS : un litige peut être général (non lié à une campagne).
export async function POST(req) {
  try {
    const { transactionId, collaborationId, brandId, attachments, openedBy, openedByRole, reason, description } = await req.json()

    if (!openedBy || !openedByRole || !reason) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Envoie email notification litige
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://partnexx-three.vercel.app'
      await fetch(`${appUrl}/api/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dispute_opened',
          to: 'perquindylan.fr@gmail.com', // remplacer par l'email réel
          data: {
            name: 'Utilisateur',
            reason,
            collaborationTitle: 'Collaboration Partnexx',
            openedByRole,
          }
        })
      })
    } catch (emailErr) {
      console.error('❌ Erreur envoi email litige:', emailErr.message)
    }

    // Vérifie qu'il n'y a pas déjà un litige ouvert pour cette transaction
    if (transactionId) {
      const { data: existing } = await supabaseAdmin
        .from('disputes')
        .select('id')
        .eq('transaction_id', transactionId)
        .in('status', ['open', 'under_review'])
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Un litige est déjà ouvert pour cette transaction' }, { status: 409 })
      }
    }

    // Crée le litige
    const { data: dispute, error } = await supabaseAdmin
      .from('disputes')
      .insert({
        transaction_id: transactionId || null,
        collaboration_id: collaborationId || null,
        brand_id: brandId || null,
        attachments: Array.isArray(attachments) ? attachments : [],
        opened_by: openedBy,
        opened_by_role: openedByRole,
        reason,
        description: description || null,
        status: 'open',
        auto_resolve_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Met la transaction en statut disputed si applicable
    if (transactionId) {
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'disputed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId)
        .in('status', ['in_escrow', 'pending'])
    }

    console.log(`✅ Litige ouvert: ${dispute.id} par ${openedByRole}`)

    // Message auto (bannière système) visible par tous dès l'ouverture
    await supabaseAdmin.from('dispute_messages').insert({
      dispute_id: dispute.id,
      sender_id: null,
      sender_role: 'system',
      content: "🔒 Litige ouvert. Tout paiement lié est gelé et la collaboration est suspendue le temps de la résolution. L'équipe Partnexx peut intervenir à tout moment.",
    })

    return NextResponse.json({ success: true, dispute })

  } catch (err) {
    console.error('❌ Erreur ouverture litige:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH — Résoudre un litige (admin)
// Body: { disputeId, resolution, adminNote, resolvedBy }
// resolution: 'resolved_brand' | 'resolved_influencer' | 'auto_resolved'
export async function PATCH(req) {
  try {
    const { disputeId, resolution, adminNote, resolvedBy } = await req.json()

    if (!disputeId || !resolution) {
      return NextResponse.json({ error: 'disputeId et resolution requis' }, { status: 400 })
    }

    const validResolutions = ['resolved_brand', 'resolved_influencer', 'auto_resolved']
    if (!validResolutions.includes(resolution)) {
      return NextResponse.json({ error: 'Resolution invalide' }, { status: 400 })
    }

    // Récupère le litige
    const { data: dispute, error: fetchError } = await supabaseAdmin
      .from('disputes')
      .select('*')
      .eq('id', disputeId)
      .single()

    if (fetchError || !dispute) {
      return NextResponse.json({ error: 'Litige introuvable' }, { status: 404 })
    }

    // Met à jour le litige
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('disputes')
      .update({
        status: resolution,
        admin_note: adminNote || null,
        resolved_by: resolvedBy || null,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', disputeId)
      .select()
      .single()

    if (updateError) throw new Error(updateError.message)

    // Libère ou rembourse selon la résolution
    if (dispute.transaction_id) {
      if (resolution === 'resolved_brand') {
        // Remboursement vers la marque
        await supabaseAdmin
          .from('transactions')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', dispute.transaction_id)
      } else if (resolution === 'resolved_influencer') {
        // Libération vers l'influenceur
        await supabaseAdmin
          .from('transactions')
          .update({
            status: 'released',
            released_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', dispute.transaction_id)
      }
    }

    console.log(`✅ Litige ${disputeId} résolu: ${resolution}`)

    return NextResponse.json({ success: true, dispute: updated })

  } catch (err) {
    console.error('❌ Erreur résolution litige:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET — Récupère les litiges (avec filtres optionnels)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    let query = supabaseAdmin
      .from('disputes')
      .select(`
        *,
        transactions (id, amount, stripe_payment_intent_id),
        collaborations (id, agreed_rate),
        profiles!disputes_opened_by_fkey (id, full_name, role)
      `)
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (userId) query = query.eq('opened_by', userId)

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return NextResponse.json({ disputes: data })

  } catch (err) {
    console.error('❌ Erreur récupération litiges:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
