import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Partnexx <onboarding@resend.dev>' // Remplace par ton domaine vérifié plus tard

// Templates emails
const templates = {

  // Paiement reçu → escrow
  payment_escrow: ({ name, amount, campaignTitle }) => ({
    subject: '🔒 Votre paiement est sécurisé en escrow — Partnexx',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9ff; padding: 40px 20px;">
        <div style="background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #a855f7, #ec4899); width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px;">🔒</div>
            <h1 style="color: #1a202c; font-size: 24px; font-weight: 800; margin: 0;">Paiement sécurisé</h1>
          </div>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Bonjour ${name},</p>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
            Un paiement de <strong style="color: #1a202c;">${amount}€</strong> a été placé en escrow pour la campagne <strong style="color: #1a202c;">${campaignTitle}</strong>.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #15803d; font-weight: 600; margin: 0 0 8px;">✅ Que signifie l'escrow ?</p>
            <p style="color: #16a34a; font-size: 14px; margin: 0; line-height: 1.6;">
              Les fonds sont bloqués de manière sécurisée et seront libérés une fois le livrable validé. Votre argent est protégé.
            </p>
          </div>
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
            Connectez-vous à votre dashboard pour suivre l'avancement de la collaboration.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://partnexx-three.vercel.app/dashboard" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              Voir mon dashboard
            </a>
          </div>
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2026 Partnexx · <a href="https://partnexx-three.vercel.app" style="color: #a855f7;">partnexx.fr</a>
          </p>
        </div>
      </div>
    `
  }),

  // Litige ouvert
  dispute_opened: ({ name, reason, collaborationTitle, openedByRole }) => ({
    subject: '⚠️ Un litige a été ouvert — Partnexx',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9ff; padding: 40px 20px;">
        <div style="background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: #fff1f2; width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px;">⚠️</div>
            <h1 style="color: #1a202c; font-size: 24px; font-weight: 800; margin: 0;">Litige ouvert</h1>
          </div>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Bonjour ${name},</p>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
            Un litige a été ouvert par <strong>${openedByRole === 'brand' ? 'la marque' : 'l\'influenceur'}</strong> concernant la collaboration <strong style="color: #1a202c;">${collaborationTitle}</strong>.
          </p>
          <div style="background: #fff1f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px;">Raison du litige</p>
            <p style="color: #b91c1c; font-size: 14px; margin: 0;">${reason}</p>
          </div>
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
            Notre équipe va examiner le litige et vous contactera dans les plus brefs délais. Les fonds restent bloqués en escrow pendant la procédure.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://partnexx-three.vercel.app/dashboard" style="background: #ef4444; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              Voir le litige
            </a>
          </div>
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2026 Partnexx · <a href="https://partnexx-three.vercel.app" style="color: #a855f7;">partnexx.fr</a>
          </p>
        </div>
      </div>
    `
  }),

  // Livrable validé → fonds libérés
  livrable_valide: ({ name, amount, campaignTitle }) => ({
    subject: '✅ Livrable validé — Vos fonds sont libérés !',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9ff; padding: 40px 20px;">
        <div style="background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: #f0fdf4; width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px;">✅</div>
            <h1 style="color: #1a202c; font-size: 24px; font-weight: 800; margin: 0;">Livrable validé !</h1>
          </div>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Bonjour ${name},</p>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
            Excellente nouvelle ! Votre livrable pour la campagne <strong style="color: #1a202c;">${campaignTitle}</strong> a été validé.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="color: #15803d; font-size: 14px; margin: 0 0 8px;">Montant libéré</p>
            <p style="color: #16a34a; font-size: 32px; font-weight: 800; margin: 0;">${amount}€</p>
          </div>
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
            Les fonds ont été libérés depuis l'escrow. Retrouvez le détail dans votre dashboard.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://partnexx-three.vercel.app/dashboard" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              Voir mes gains
            </a>
          </div>
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2026 Partnexx · <a href="https://partnexx-three.vercel.app" style="color: #a855f7;">partnexx.fr</a>
          </p>
        </div>
      </div>
    `
  }),

  // Bienvenue nouvel utilisateur
  welcome: ({ name, role }) => ({
    subject: '🎉 Bienvenue sur Partnexx !',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9ff; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #667eea, #a855f7, #ec4899); border-radius: 16px; padding: 40px; color: #fff; text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 12px;">Bienvenue sur Partnexx 👋</h1>
          <p style="font-size: 16px; opacity: 0.9; margin: 0;">La plateforme qui connecte marques et influenceurs</p>
        </div>
        <div style="background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Bonjour ${name},</p>
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
            Bienvenue sur Partnexx ! Votre compte ${role === 'brand' ? 'marque' : role === 'influencer' ? 'influenceur' : ''} est prêt.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px; margin: 24px 0;">
            ${role === 'brand' ? `
              <div style="background: #f8f9ff; border-radius: 10px; padding: 16px;">
                <p style="color: #1a202c; font-weight: 700; margin: 0 0 4px;">🚀 Créez votre première campagne</p>
                <p style="color: #718096; font-size: 14px; margin: 0;">Définissez vos objectifs et trouvez les meilleurs influenceurs.</p>
              </div>
              <div style="background: #f8f9ff; border-radius: 10px; padding: 16px;">
                <p style="color: #1a202c; font-weight: 700; margin: 0 0 4px;">🔒 Paiements sécurisés</p>
                <p style="color: #718096; font-size: 14px; margin: 0;">Vos fonds sont protégés par notre système d'escrow.</p>
              </div>
            ` : `
              <div style="background: #f8f9ff; border-radius: 10px; padding: 16px;">
                <p style="color: #1a202c; font-weight: 700; margin: 0 0 4px;">💰 Recevez des collaborations</p>
                <p style="color: #718096; font-size: 14px; margin: 0;">Les marques peuvent vous contacter directement.</p>
              </div>
              <div style="background: #f8f9ff; border-radius: 10px; padding: 16px;">
                <p style="color: #1a202c; font-weight: 700; margin: 0 0 4px;">🔒 Paiements garantis</p>
                <p style="color: #718096; font-size: 14px; margin: 0;">Vos gains sont sécurisés avant même de commencer.</p>
              </div>
            `}
          </div>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://partnexx-three.vercel.app/dashboard" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              Accéder à mon dashboard
            </a>
          </div>
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 32px;">
            © 2026 Partnexx · <a href="https://partnexx-three.vercel.app" style="color: #a855f7;">partnexx.fr</a>
          </p>
        </div>
      </div>
    `
  }),
}

export async function POST(req) {
  try {
    const { type, to, data } = await req.json()

    if (!type || !to) {
      return NextResponse.json({ error: 'type et to requis' }, { status: 400 })
    }

    const template = templates[type]
    if (!template) {
      return NextResponse.json({ error: `Template "${type}" inconnu` }, { status: 400 })
    }

    const { subject, html } = template(data || {})

    const { data: result, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('❌ Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Email "${type}" envoyé à ${to}`)
    return NextResponse.json({ success: true, id: result.id })

  } catch (err) {
    console.error('❌ Email route error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}