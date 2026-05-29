import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renderToBuffer, Document, Page, View, Text, Image, StyleSheet, Font, Svg, Path, Circle, Rect, Line } from '@react-pdf/renderer'
import React from 'react'
import fs from 'fs'
import path from 'path'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUSINESS_TYPE_LABEL = {
  individual: 'Particulier',
  auto_entrepreneur: 'Auto-entrepreneur',
  company: 'Société',
}

const fmtEUR = (n) =>
  `${(Number(n) || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`

// ===== Cache polices et logo =====
let fontsRegistered = false
function registerFonts() {
  if (fontsRegistered) return
  Font.register({
    family: 'Inter',
    fonts: [
      { src: 'https://github.com/rsms/inter/raw/v3.19/docs/font-files/Inter-Regular.otf', fontWeight: 400 },
      { src: 'https://github.com/rsms/inter/raw/v3.19/docs/font-files/Inter-Medium.otf', fontWeight: 500 },
      { src: 'https://github.com/rsms/inter/raw/v3.19/docs/font-files/Inter-SemiBold.otf', fontWeight: 600 },
      { src: 'https://github.com/rsms/inter/raw/v3.19/docs/font-files/Inter-Bold.otf', fontWeight: 700 },
    ],
  })
  fontsRegistered = true
}

let logoDataUriCache = null
function getLogoDataUri() {
  if (logoDataUriCache !== null) return logoDataUriCache
  try {
    const p = path.join(process.cwd(), 'public', 'logo.png')
    const buf = fs.readFileSync(p)
    logoDataUriCache = `data:image/png;base64,${buf.toString('base64')}`
    return logoDataUriCache
  } catch {
    logoDataUriCache = false
    return false
  }
}

// ===== Palette =====
const COLORS = {
  primary: '#7C3AED',
  primarySoft: '#F3EFFF',
  dark: '#0F0F1A',
  textMain: '#1A1A2E',
  muted: '#6B7280',
  light: '#E5E7EB',
  ultraLight: '#F9FAFB',
  white: '#FFFFFF',
  danger: '#DC2626',
}

// ===== Styles =====
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Inter',
    backgroundColor: COLORS.white,
    fontSize: 10,
    color: COLORS.textMain,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImg: { width: 24, height: 24 },
  brandText: { fontSize: 16, fontWeight: 700, color: COLORS.dark, letterSpacing: 1 },
  badgeOfficiel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 8,
  },
  badgeIconBubble: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 9, fontWeight: 700, color: COLORS.primary, letterSpacing: 0.5 },

  // Titre
  titleBlock: { marginTop: 8, marginBottom: 12 },
  titleMain: { fontSize: 20, fontWeight: 700, color: COLORS.dark, lineHeight: 1.1 },
  titleAccent: { fontSize: 20, fontWeight: 700, color: COLORS.primary, lineHeight: 1.1 },
  titleLine: { width: 28, height: 2.5, backgroundColor: COLORS.primary, marginTop: 8, marginBottom: 8 },
  subtitle: { fontSize: 9.5, color: COLORS.muted, lineHeight: 1.4 },

  // Bloc référence 2 colonnes
  refGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  refBox: {
    flex: 1,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  refLabel: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 },
  refValue: { fontSize: 12, fontWeight: 700, color: COLORS.dark },

  // Cards info
  infoCard: {
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  infoTitle: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  infoKey: { width: 80, fontSize: 10, color: COLORS.muted },
  infoVal: { flex: 1, fontSize: 10, fontWeight: 500, color: COLORS.textMain },
  infoMono: { flex: 1, fontSize: 9, fontWeight: 500, color: COLORS.textMain, fontFamily: 'Inter' },

  // Détails paiement
  detailCard: { marginBottom: 10, borderRadius: 8, overflow: 'hidden' },
  detailHeader: {
    backgroundColor: COLORS.dark,
    padding: 10,
    paddingHorizontal: 14,
  },
  detailHeaderTitle: { fontSize: 10, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  detailBody: { borderColor: COLORS.light, borderWidth: 1, borderTopWidth: 0 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomColor: COLORS.light,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  detailLabel: { fontSize: 10.5, color: COLORS.textMain },
  detailValue: { fontSize: 10.5, fontWeight: 700, color: COLORS.textMain },
  detailValueDanger: { fontSize: 10.5, fontWeight: 700, color: COLORS.danger },
  totalRow: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 14,
  },
  totalLabel: { fontSize: 11, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  totalValue: { fontSize: 16, fontWeight: 700, color: COLORS.white },

  // Mentions
  legalCard: {
    borderTopColor: COLORS.light,
    borderTopWidth: 0.5,
    paddingTop: 10,
    marginTop: 4,
  },
  legalTitle: { fontWeight: 700, color: COLORS.dark, fontSize: 9, letterSpacing: 0.5, marginBottom: 4 },
  legalText: { fontSize: 8.5, color: COLORS.muted, lineHeight: 1.45 },

  // Footer
  footer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopColor: COLORS.light,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: COLORS.muted },
  footerEmail: { fontSize: 8, color: COLORS.primary, fontWeight: 600 },
})

// SVG check
const IconCheck = () => React.createElement(Svg, { width: 10, height: 10, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M5 12l5 5L20 7', fill: 'none', stroke: COLORS.white, strokeWidth: 3 })
)

// ===== Composant Document =====
function ReceiptDocument({ data, logoUri }) {
  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },

      // HEADER
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.headerLeft },
          logoUri && React.createElement(Image, { src: logoUri, style: styles.logoImg }),
          React.createElement(Text, { style: styles.brandText }, 'PARTNEXX')
        ),
        React.createElement(View, { style: styles.badgeOfficiel },
          React.createElement(View, { style: styles.badgeIconBubble }, React.createElement(IconCheck)),
          React.createElement(Text, { style: styles.badgeText }, 'REÇU OFFICIEL')
        )
      ),

      // TITRE
      React.createElement(View, { style: styles.titleBlock },
        React.createElement(Text, { style: styles.titleMain }, 'Reçu de paiement'),
        React.createElement(Text, { style: styles.titleAccent }, 'collaboration créateur'),
        React.createElement(View, { style: styles.titleLine }),
        React.createElement(Text, { style: styles.subtitle },
          "Justificatif officiel d'encaissement émis par PARTNEXX pour le compte du créateur."
        )
      ),

      // BLOC RÉFÉRENCE
      React.createElement(View, { style: styles.refGrid },
        React.createElement(View, { style: styles.refBox },
          React.createElement(Text, { style: styles.refLabel }, 'N° REÇU'),
          React.createElement(Text, { style: styles.refValue }, data.receipt_number)
        ),
        React.createElement(View, { style: styles.refBox },
          React.createElement(Text, { style: styles.refLabel }, 'PAIEMENT EFFECTUÉ LE'),
          React.createElement(Text, { style: styles.refValue }, data.paid_at_display)
        )
      ),

      // BÉNÉFICIAIRE
      React.createElement(View, { style: styles.infoCard },
        React.createElement(Text, { style: styles.infoTitle }, 'BÉNÉFICIAIRE'),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Nom'),
          React.createElement(Text, { style: styles.infoVal }, data.creator_name || '—')
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Email'),
          React.createElement(Text, { style: styles.infoVal }, data.creator_email || '—')
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Statut'),
          React.createElement(Text, { style: styles.infoVal }, BUSINESS_TYPE_LABEL[data.business_type] || 'Non défini')
        ),
        data.country && React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Pays'),
          React.createElement(Text, { style: styles.infoVal }, data.country)
        )
      ),

      // COLLABORATION
      React.createElement(View, { style: styles.infoCard },
        React.createElement(Text, { style: styles.infoTitle }, 'COLLABORATION'),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Marque'),
          React.createElement(Text, { style: styles.infoVal }, data.brand_name || '—')
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Campagne'),
          React.createElement(Text, { style: styles.infoVal }, data.campaign_title || '—')
        ),
        data.stripe_payment_intent_id && React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'N° transaction'),
          React.createElement(Text, { style: styles.infoMono }, data.stripe_payment_intent_id)
        )
      ),

      // DÉTAIL DU PAIEMENT
      React.createElement(View, { style: styles.detailCard },
        React.createElement(View, { style: styles.detailHeader },
          React.createElement(Text, { style: styles.detailHeaderTitle }, 'DÉTAIL DU PAIEMENT')
        ),
        React.createElement(View, { style: styles.detailBody },
          React.createElement(View, { style: styles.detailRow },
            React.createElement(Text, { style: styles.detailLabel }, 'Montant brut de la collaboration'),
            React.createElement(Text, { style: styles.detailValue }, fmtEUR(data.amount_gross))
          ),
          React.createElement(View, { style: [styles.detailRow, { borderBottomWidth: 0 }] },
            React.createElement(Text, { style: styles.detailLabel }, `Commission PARTNEXX${data.commission_pct ? ` (${data.commission_pct}%)` : ''}`),
            React.createElement(Text, { style: styles.detailValueDanger }, `- ${fmtEUR(data.platform_fee)}`)
          )
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'MONTANT NET REÇU'),
          React.createElement(Text, { style: styles.totalValue }, fmtEUR(data.influencer_amount))
        )
      ),

      // MENTIONS
      React.createElement(View, { style: styles.legalCard },
        React.createElement(Text, { style: styles.legalTitle }, 'À CONSERVER POUR VOTRE COMPTABILITÉ'),
        React.createElement(Text, { style: styles.legalText },
          "Ce reçu atteste de l'encaissement par votre intermédiaire (PARTNEXX) du montant indiqué pour le compte du bénéficiaire. Vous êtes seul responsable de la déclaration de ces revenus à l'administration fiscale (art. 242 bis du CGI). PARTNEXX déclare ces revenus à la DGFiP dans le cadre du dispositif DAC7."
        )
      ),

      // FOOTER
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, 'PARTNEXX SAS • Document généré automatiquement'),
        React.createElement(Text, { style: styles.footerEmail }, 'support@partnexx.com')
      )
    )
  )
}

export async function GET(req) {
  try {
    // 1. Récupérer le transactionId
    const { searchParams } = new URL(req.url)
    const transactionId = searchParams.get('transactionId')
    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId requis' }, { status: 400 })
    }

    // 2. Auth
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // 3. Trouver l'influencer associé à l'user
    const { data: influencer, error: infErr } = await supabaseAdmin
      .from('influencers')
      .select('id, display_name, country, business_type')
      .eq('user_id', userId)
      .single()
    if (infErr || !influencer) return NextResponse.json({ error: 'Profil créateur introuvable' }, { status: 404 })

    // 4. Récupérer la transaction et vérifier qu'elle appartient bien à ce créateur
    const { data: tx, error: txErr } = await supabaseAdmin
      .from('transactions')
      .select(`
        id, amount, platform_fee, influencer_amount, status, type,
        created_at, released_at, stripe_payment_intent_id,
        brands (id, company_name),
        collaborations (id, campaigns (id, title))
      `)
      .eq('id', transactionId)
      .eq('influencer_id', influencer.id)
      .single()
    if (txErr || !tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })
    if (tx.status !== 'released') {
      return NextResponse.json({ error: 'Le reçu n\'est disponible que pour les paiements libérés' }, { status: 400 })
    }

    // 5. Récupérer le nom complet du créateur depuis profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()

    // 6. Préparer les données
    const paidDate = tx.released_at ? new Date(tx.released_at) : new Date(tx.created_at)
    const year = paidDate.getFullYear()
    const shortId = tx.id.slice(0, 4).toUpperCase()
    const amountGross = Number(tx.amount) || 0
    const platformFee = Number(tx.platform_fee) || 0
    const commissionPct = amountGross > 0 ? Math.round((platformFee / amountGross) * 100) : null

    const data = {
      receipt_number: `REC-${year}-${shortId}`,
      paid_at_display: paidDate.toLocaleDateString('fr-FR'),
      creator_name: profile?.full_name || influencer.display_name || '—',
      creator_email: userData.user.email,
      business_type: influencer.business_type,
      country: influencer.country,
      brand_name: tx.brands?.company_name || 'Marque',
      campaign_title: tx.collaborations?.campaigns?.title || '—',
      stripe_payment_intent_id: tx.stripe_payment_intent_id,
      amount_gross: amountGross,
      platform_fee: platformFee,
      influencer_amount: Number(tx.influencer_amount) || 0,
      commission_pct: commissionPct,
    }

    // 7. Render PDF
    registerFonts()
    const logoUri = getLogoDataUri()
    const pdfBuffer = await renderToBuffer(
      React.createElement(ReceiptDocument, { data, logoUri: logoUri || null })
    )

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.receipt_number}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Erreur génération reçu créateur:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}