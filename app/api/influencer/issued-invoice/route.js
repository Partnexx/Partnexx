import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renderToBuffer, Document, Page, View, Text, Image, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer'
import React from 'react'
import fs from 'fs'
import path from 'path'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const fmtEUR = (n) =>
  `${(Number(n) || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`

const BUSINESS_TYPE_LABEL = {
  individual: 'Particulier',
  auto_entrepreneur: 'Auto-entrepreneur',
  company: 'Société',
}

// ===== Polices et logo =====
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

const COLORS = {
  primary: '#7C3AED',
  primarySoft: '#F3EFFF',
  dark: '#0F0F1A',
  textMain: '#1A1A2E',
  muted: '#6B7280',
  light: '#E5E7EB',
  ultraLight: '#F9FAFB',
  white: '#FFFFFF',
  successBg: '#DCFCE7',
  successBorder: '#86EFAC',
  successText: '#166534',
  successDark: '#16A34A',
  warnBg: '#FFF7ED',
  warnBorder: '#FB923C',
  warnText: '#9A3412',
}

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: 'Inter', backgroundColor: COLORS.white, fontSize: 10, color: COLORS.textMain },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 24, height: 24 },
  brandText: { fontSize: 16, fontWeight: 700, color: COLORS.dark, letterSpacing: 1 },
  badgeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primarySoft, borderRadius: 30, paddingVertical: 5, paddingHorizontal: 10, gap: 8 },
  badgeIconBubble: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 9, fontWeight: 700, color: COLORS.primary, letterSpacing: 0.5 },

  // Titre
  titleBlock: { marginTop: 6, marginBottom: 8 },
  titleMain: { fontSize: 20, fontWeight: 700, color: COLORS.dark, lineHeight: 1.1 },
  titleAccent: { fontSize: 20, fontWeight: 700, color: COLORS.primary, lineHeight: 1.1 },
  titleLine: { width: 28, height: 2.5, backgroundColor: COLORS.primary, marginTop: 6, marginBottom: 6 },
  subtitle: { fontSize: 9.5, color: COLORS.muted, lineHeight: 1.4 },

  // Mention mandat (encadré)
  mandatBox: {
    backgroundColor: COLORS.primarySoft,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 3,
    padding: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  mandatText: { fontSize: 8.5, color: COLORS.primary, lineHeight: 1.45, fontWeight: 500 },

  // Référence
  refGrid: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  refBox: { flex: 1, backgroundColor: COLORS.ultraLight, borderColor: COLORS.light, borderWidth: 1, borderRadius: 8, padding: 10 },
  refBoxSuccess: { flex: 1, backgroundColor: COLORS.successBg, borderColor: COLORS.successBorder, borderWidth: 1, borderRadius: 8, padding: 10 },
  refLabel: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 },
  refLabelSuccess: { fontSize: 9, color: COLORS.successDark, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 },
  refValue: { fontSize: 12, fontWeight: 700, color: COLORS.dark },
  refValueSuccess: { fontSize: 12, fontWeight: 700, color: COLORS.successText },

  // Émetteur/Client
  twoCols: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  partyCard: { flex: 1, backgroundColor: COLORS.ultraLight, borderColor: COLORS.light, borderWidth: 1, borderRadius: 8, padding: 10 },
  partyLabel: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 },
  partyName: { fontSize: 11, fontWeight: 700, color: COLORS.dark, marginBottom: 4 },
  partyLine: { fontSize: 9.5, color: '#4A4A5A', lineHeight: 1.5 },

  // Désignation
  detailCard: { marginBottom: 7, borderRadius: 8, overflow: 'hidden' },
  detailHeader: { backgroundColor: COLORS.dark, padding: 10, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between' },
  detailHeaderText: { fontSize: 10, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  detailBody: { borderColor: COLORS.light, borderWidth: 1, borderTopWidth: 0 },
  detailMainRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, paddingHorizontal: 14, borderBottomColor: COLORS.light, borderBottomWidth: 0.5, borderStyle: 'dashed' },
  detailLabelMain: { fontSize: 10.5, fontWeight: 500, color: COLORS.dark },
  detailLabelSub: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  detailValue: { fontSize: 10.5, fontWeight: 700, color: COLORS.textMain },
  detailSubRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, paddingHorizontal: 14, borderBottomColor: COLORS.light, borderBottomWidth: 0.5 },
  detailSubRowLast: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, paddingHorizontal: 14 },
  detailSubLabel: { fontSize: 10.5, color: COLORS.muted },

  totalRow: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingHorizontal: 14 },
  totalLabel: { fontSize: 11, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  totalValue: { fontSize: 16, fontWeight: 700, color: COLORS.white },

  // Bandeau franchise TVA
  vatNoticeBox: { backgroundColor: COLORS.warnBg, borderColor: COLORS.warnBorder, borderWidth: 1, borderRadius: 8, padding: 8, paddingHorizontal: 12, marginBottom: 8 },
  vatNoticeTitle: { fontSize: 9.5, fontWeight: 700, color: COLORS.warnText, marginBottom: 2 },
  vatNoticeText: { fontSize: 8.5, color: COLORS.warnText, lineHeight: 1.4 },

  // Bandeau payée
  paidBanner: { backgroundColor: COLORS.successBg, borderColor: COLORS.successBorder, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  paidIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.successDark, alignItems: 'center', justifyContent: 'center' },
  paidTitle: { fontSize: 10, fontWeight: 700, color: COLORS.successText },
  paidSub: { fontSize: 8.5, color: '#15803D' },

  // Mentions légales
  legalCard: { borderTopColor: COLORS.light, borderTopWidth: 0.5, paddingTop: 8, marginTop: 4 },
  legalTitle: { fontWeight: 700, color: COLORS.dark, fontSize: 9, letterSpacing: 0.5, marginBottom: 4 },
  legalText: { fontSize: 8.5, color: COLORS.muted, lineHeight: 1.45 },

  footer: { marginTop: 7, paddingTop: 7, borderTopColor: COLORS.light, borderTopWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: 8, color: COLORS.muted },
  footerEmail: { fontSize: 8, color: COLORS.primary, fontWeight: 600 },
})

const IconCheck = () => React.createElement(Svg, { width: 10, height: 10, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M5 12l5 5L20 7', fill: 'none', stroke: COLORS.white, strokeWidth: 3 })
)

function IssuedInvoiceDocument({ data, partnexxLegal, logoUri }) {
  const { tva_applicable, amount_ht, amount_vat, amount_ttc, is_paid } = data

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },

      // HEADER
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.headerLeft },
          logoUri && React.createElement(Image, { src: logoUri, style: styles.logoImg }),
          React.createElement(Text, { style: styles.brandText }, 'PARTNEXX')
        ),
        React.createElement(View, { style: styles.badgeBox },
          React.createElement(View, { style: styles.badgeIconBubble }, React.createElement(IconCheck)),
          React.createElement(Text, { style: styles.badgeText }, 'FACTURE CRÉATEUR')
        )
      ),

      // TITRE
      React.createElement(View, { style: styles.titleBlock },
        React.createElement(Text, { style: styles.titleMain }, 'Facture de'),
        React.createElement(Text, { style: styles.titleAccent }, 'prestation de service'),
        React.createElement(View, { style: styles.titleLine }),
        React.createElement(Text, { style: styles.subtitle },
          "Facture émise par le créateur via la plateforme PARTNEXX pour les prestations réalisées au profit de la marque cliente."
        )
      ),

      // BOX MANDAT (mention obligatoire)
      React.createElement(View, { style: styles.mandatBox },
        React.createElement(Text, { style: styles.mandatText },
          `Facture établie par PARTNEXX SAS au nom et pour le compte de ${data.creator_name} en vertu d'un mandat de facturation signé le ${data.mandat_date_display}.`
        )
      ),

      // RÉFÉRENCE
      React.createElement(View, { style: styles.refGrid },
        React.createElement(View, { style: styles.refBox },
          React.createElement(Text, { style: styles.refLabel }, 'N° FACTURE'),
          React.createElement(Text, { style: styles.refValue }, data.invoice_number)
        ),
        React.createElement(View, { style: styles.refBox },
          React.createElement(Text, { style: styles.refLabel }, "DATE D'ÉMISSION"),
          React.createElement(Text, { style: styles.refValue }, data.issue_date_display)
        ),
        React.createElement(View, { style: is_paid ? styles.refBoxSuccess : styles.refBox },
          React.createElement(Text, { style: is_paid ? styles.refLabelSuccess : styles.refLabel }, 'STATUT'),
          React.createElement(Text, { style: is_paid ? styles.refValueSuccess : styles.refValue }, is_paid ? '✓ Payée' : 'En attente')
        )
      ),

      // ÉMETTEUR (créateur) / CLIENT (marque)
      React.createElement(View, { style: styles.twoCols },
        React.createElement(View, { style: styles.partyCard },
          React.createElement(Text, { style: styles.partyLabel }, 'ÉMETTEUR (vendeur)'),
          React.createElement(Text, { style: styles.partyName }, data.creator_name || '—'),
          React.createElement(Text, { style: styles.partyLine }, BUSINESS_TYPE_LABEL[data.creator_business_type] || 'Statut non défini'),
          data.creator_address && React.createElement(Text, { style: styles.partyLine }, data.creator_address),
          (data.creator_zip || data.creator_city) && React.createElement(Text, { style: styles.partyLine }, `${data.creator_zip || ''} ${data.creator_city || ''}`.trim()),
          data.creator_country && React.createElement(Text, { style: styles.partyLine }, data.creator_country),
          data.creator_siret && React.createElement(Text, { style: styles.partyLine }, `SIRET : ${data.creator_siret}`),
          data.creator_email && React.createElement(Text, { style: styles.partyLine }, data.creator_email)
        ),
        React.createElement(View, { style: styles.partyCard },
          React.createElement(Text, { style: styles.partyLabel }, 'CLIENT (acheteur)'),
          React.createElement(Text, { style: styles.partyName }, data.brand_name || '—'),
          data.brand_address && React.createElement(Text, { style: styles.partyLine }, data.brand_address),
          (data.brand_zip || data.brand_city) && React.createElement(Text, { style: styles.partyLine }, `${data.brand_zip || ''} ${data.brand_city || ''}`.trim()),
          data.brand_country && React.createElement(Text, { style: styles.partyLine }, data.brand_country),
          data.brand_siret && React.createElement(Text, { style: styles.partyLine }, `SIRET : ${data.brand_siret}`),
          data.brand_vat && React.createElement(Text, { style: styles.partyLine }, `TVA : ${data.brand_vat}`),
          !data.brand_address && data.brand_industry && React.createElement(Text, { style: styles.partyLine }, data.brand_industry)
        )
      ),

      // DÉTAIL DE LA PRESTATION
      React.createElement(View, { style: styles.detailCard },
        React.createElement(View, { style: styles.detailHeader },
          React.createElement(Text, { style: styles.detailHeaderText }, 'DÉSIGNATION'),
          React.createElement(Text, { style: styles.detailHeaderText }, 'MONTANT HT')
        ),
        React.createElement(View, { style: styles.detailBody },
          React.createElement(View, { style: styles.detailMainRow },
            React.createElement(View, null,
              React.createElement(Text, { style: styles.detailLabelMain }, 'Prestation de collaboration influenceur'),
              React.createElement(Text, { style: styles.detailLabelSub }, data.campaign_title || 'Campagne PARTNEXX')
            ),
            React.createElement(Text, { style: styles.detailValue }, fmtEUR(amount_ht))
          ),
          React.createElement(View, { style: styles.detailSubRow },
            React.createElement(Text, { style: styles.detailSubLabel }, 'Sous-total HT'),
            React.createElement(Text, { style: styles.detailValue }, fmtEUR(amount_ht))
          ),
          React.createElement(View, { style: styles.detailSubRowLast },
            React.createElement(Text, { style: styles.detailSubLabel }, tva_applicable ? 'TVA (20%)' : 'TVA non applicable'),
            React.createElement(Text, { style: styles.detailValue }, tva_applicable ? fmtEUR(amount_vat) : '—')
          )
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'TOTAL TTC'),
          React.createElement(Text, { style: styles.totalValue }, fmtEUR(amount_ttc))
        )
      ),

      // BANDEAU FRANCHISE TVA (si applicable)
      !tva_applicable && React.createElement(View, { style: styles.vatNoticeBox },
        React.createElement(Text, { style: styles.vatNoticeTitle }, 'TVA non applicable'),
        React.createElement(Text, { style: styles.vatNoticeText },
          "TVA non applicable, art. 293 B du Code Général des Impôts. Le créateur bénéficie du régime de franchise en base de TVA."
        )
      ),

      // BANDEAU PAYÉE
      is_paid && React.createElement(View, { style: styles.paidBanner },
        React.createElement(View, { style: styles.paidIcon }, React.createElement(IconCheck)),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.paidTitle }, `PAYÉE LE ${data.paid_date_display}`),
          React.createElement(Text, { style: styles.paidSub }, 'Versement effectué via la plateforme PARTNEXX (escrow)')
        )
      ),

      // MENTIONS LÉGALES
      React.createElement(View, { style: styles.legalCard },
        React.createElement(Text, { style: styles.legalTitle }, 'MENTIONS LÉGALES'),
        React.createElement(Text, { style: styles.legalText },
          "Cette facture est émise par PARTNEXX SAS dans le cadre d'un mandat de facturation conformément à l'article 289-I-2 du Code Général des Impôts. Pénalités de retard : 3 fois le taux d'intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 € (art. L. 441-10 du Code de commerce). Conditions de règlement : à réception de facture."
        )
      ),

      // FOOTER
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, { style: styles.footerText },
          `Émis par PARTNEXX SAS pour le compte de ${data.creator_name} • SIRET PARTNEXX ${partnexxLegal.siret}`
        ),
        React.createElement(Text, { style: styles.footerEmail }, partnexxLegal.email)
      )
    )
  )
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const transactionId = searchParams.get('transactionId')
    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId requis' }, { status: 400 })
    }

    // Auth
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // Vérifier le profil utilisateur (peut être créateur ou marque)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, role')
      .eq('id', userId)
      .single()

    // Récupérer la transaction
    const { data: tx, error: txErr } = await supabaseAdmin
      .from('transactions')
      .select(`
        id, amount, status, type, created_at, released_at, stripe_payment_intent_id,
        brand_id, influencer_id,
        brands (id, company_name, industry, user_id, address, zip, city, country, siret, vat_number),
        influencers (
          id, user_id, display_name, country, business_type, siret,
          tva_applicable, mandat_facturation_date,
          facturation_address, facturation_zip, facturation_city, facturation_country
        ),
        collaborations (id, campaigns (id, title))
      `)
      .eq('id', transactionId)
      .single()
    if (txErr || !tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })

    // Sécurité : seul le créateur OU la marque concernée peut voir la facture
    const isCreator = tx.influencers?.user_id === userId
    const isBrand = tx.brands?.user_id === userId
    if (!isCreator && !isBrand) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Vérifier que le mandat a bien été accepté
    if (!tx.influencers?.mandat_facturation_date) {
      return NextResponse.json({
        error: 'Le créateur n\'a pas accepté le mandat de facturation, impossible d\'émettre la facture'
      }, { status: 400 })
    }

    // Récupérer l'email du créateur
    let creatorEmail = null
    if (tx.influencers?.user_id) {
      const { data: creatorAuth } = await supabaseAdmin.auth.admin.getUserById(tx.influencers.user_id)
      creatorEmail = creatorAuth?.user?.email || null
    }

    // Récupérer le full_name créateur via profiles
    let creatorFullName = tx.influencers?.display_name || 'Créateur'
    if (tx.influencers?.user_id) {
      const { data: creatorProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name')
        .eq('id', tx.influencers.user_id)
        .single()
      creatorFullName = creatorProfile?.full_name || creatorFullName
    }

    // Calculs TVA selon le statut du créateur
    const tvaApplicable = tx.influencers?.tva_applicable === true
    const amountHT = Number(tx.amount) || 0
    const amountVAT = tvaApplicable ? amountHT * 0.20 : 0
    const amountTTC = amountHT + amountVAT

    // Date et N° facture
    const issueDate = new Date(tx.created_at)
    const paidDate = tx.released_at ? new Date(tx.released_at) : null
    const isPaid = tx.status === 'released' || tx.status === 'in_escrow'
    const year = issueDate.getFullYear()
    const { data: invoiceNumber, error: invoiceNumberError } = await supabaseAdmin
      .rpc('get_or_create_invoice_number', {
        p_invoice_type: 'creator_to_brand',
        p_transaction_id: tx.id,
        p_brand_id: tx.brand_id,
        p_influencer_id: tx.influencer_id,
        p_amount_ht: amountHT,
        p_amount_vat: amountVAT,
        p_amount_ttc: amountTTC,
      })
    if (invoiceNumberError) {
      console.error('Erreur génération N° facture créateur:', invoiceNumberError)
      return NextResponse.json({ error: 'Erreur de numérotation' }, { status: 500 })
    }

    const mandatDate = tx.influencers.mandat_facturation_date
      ? new Date(tx.influencers.mandat_facturation_date).toLocaleDateString('fr-FR')
      : '—'

    const data = {
      invoice_number: invoiceNumber,
      issue_date_display: issueDate.toLocaleDateString('fr-FR'),
      paid_date_display: paidDate ? paidDate.toLocaleDateString('fr-FR') : '',
      mandat_date_display: mandatDate,
      is_paid: isPaid,
      // Émetteur (créateur)
      creator_name: creatorFullName,
      creator_email: creatorEmail,
      creator_business_type: tx.influencers?.business_type,
      creator_siret: tx.influencers?.siret,
      creator_address: tx.influencers?.facturation_address,
      creator_zip: tx.influencers?.facturation_zip,
      creator_city: tx.influencers?.facturation_city,
      creator_country: tx.influencers?.facturation_country || tx.influencers?.country,
      // Client (marque)
      brand_name: tx.brands?.company_name,
      brand_industry: tx.brands?.industry,
      brand_address: tx.brands?.address,
      brand_zip: tx.brands?.zip,
      brand_city: tx.brands?.city,
      brand_country: tx.brands?.country,
      brand_siret: tx.brands?.siret,
      brand_vat: tx.brands?.vat_number,
      // Prestation
      campaign_title: tx.collaborations?.campaigns?.title,
      tva_applicable: tvaApplicable,
      amount_ht: amountHT,
      amount_vat: amountVAT,
      amount_ttc: amountTTC,
    }

    const partnexxLegal = {
      name: process.env.PARTNEXX_LEGAL_NAME || 'PARTNEXX SAS',
      siret: process.env.PARTNEXX_LEGAL_SIRET || 'À compléter',
      email: process.env.PARTNEXX_LEGAL_EMAIL || 'support@partnexx.com',
    }

    registerFonts()
    const logoUri = getLogoDataUri()
    const pdfBuffer = await renderToBuffer(
      React.createElement(IssuedInvoiceDocument, { data, partnexxLegal, logoUri: logoUri || null })
    )

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Erreur génération facture créateur:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
