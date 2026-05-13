import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST — Créer une notification
export async function POST(req) {
  try {
    const { userId, type, title, body, data, link } = await req.json()

    if (!userId || !type || !title) {
      return NextResponse.json({ error: 'userId, type et title requis' }, { status: 400 })
    }

    const { data: notif, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        body: body || null,
        data: data || {},
        link: link || null,
        is_read: false,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    console.log(`✅ Notification créée pour ${userId}: ${title}`)
    return NextResponse.json({ success: true, notification: notif })

  } catch (err) {
    console.error('❌ Erreur création notification:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}