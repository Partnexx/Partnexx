import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET — messages d'un litige
// /api/disputes/messages?disputeId=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const disputeId = searchParams.get('disputeId')
    if (!disputeId) return NextResponse.json({ error: 'disputeId requis' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('dispute_messages')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return NextResponse.json({ messages: data })
  } catch (err) {
    console.error('❌ Erreur récupération messages litige:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — envoyer un message dans un litige
// Body: { disputeId, senderId, senderRole, content, setStatus? }
// setStatus (optionnel) : ex. 'under_review' pour demander l'intervention de Partnexx
export async function POST(req) {
  try {
    const { disputeId, senderId, senderRole, content, setStatus } = await req.json()
    if (!disputeId || !content) {
      return NextResponse.json({ error: 'disputeId et content requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        sender_id: senderId || null,
        sender_role: senderRole || 'influencer',
        content,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    if (setStatus) {
      await supabaseAdmin
        .from('disputes')
        .update({ status: setStatus, updated_at: new Date().toISOString() })
        .eq('id', disputeId)

      // Partnexx "rejoint" la conversation automatiquement
      if (setStatus === 'under_review') {
        await supabaseAdmin.from('dispute_messages').insert([
          { dispute_id: disputeId, sender_id: null, sender_role: 'system', content: '⚡ PARTNEXX a rejoint la conversation' },
          { dispute_id: disputeId, sender_id: null, sender_role: 'partnexx', content: "Bonjour, l'équipe Partnexx prend en charge ce litige. Le paiement concerné reste gelé et la collaboration est suspendue le temps de notre analyse. Nous revenons vers vous au plus vite — merci de garder tous les échanges ici." },
        ])
      }
    }

    return NextResponse.json({ success: true, message: data })
  } catch (err) {
    console.error('❌ Erreur envoi message litige:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
