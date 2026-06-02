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
  successBg: '#DCFCE7',
  successBorder: '#86EFAC',
  successText: '#166534',
  successDark: '#16A34A',
}

// ===== Styles =====
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Inter',
    backgroundColor: COLORS.white,
    fontSize: 10,
    color: COLORS.textMain,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 24, height: 24 },
  brandText: { fontSize: 16, fontWeight: 700, color: COLORS.dark, letterSpacing: 1 },
  badgeBox: {
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
  titleBlock: { marginTop: 6, marginBottom: 8 },
  titleMain: { fontSize: 20, fontWeight: 700, color: COLORS.dark, lineHeight: 1.1 },
  titleAccent: { fontSize: 20, fontWeight: 700, color: COLORS.primary, lineHeight: 1.1 },
  titleLine: { width: 28, height: 2.5, backgroundColor: COLORS.primary, marginTop: 6, marginBottom: 6 },
  subtitle: { fontSize: 9.5, color: COLORS.muted, lineHeight: 1.4 },

  // Référence (3 boxes)
  refGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  refBox: {
    flex: 1,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  refBoxSuccess: {
    flex: 1,
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  refLabel: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 },
  refLabelSuccess: { fontSize: 9, color: COLORS.successDark, fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 },
  refValue: { fontSize: 12, fontWeight: 700, color: COLORS.dark },
  refValueSuccess: { fontSize: 12, fontWeight: 700, color: COLORS.successText },

  // Émetteur/Client (2 colonnes)
  twoCols: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  partyCard: {
    flex: 1,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  partyLabel: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 },
  partyName: { fontSize: 11, fontWeight: 700, color: COLORS.dark, marginBottom: 4 },
  partyLine: { fontSize: 9.5, color: '#4A4A5A', lineHeight: 1.5 },

  // Transaction référencée
  txCard: {
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  infoKey: { width: 100, fontSize: 10, color: COLORS.muted },
  infoVal: { flex: 1, fontSize: 10, fontWeight: 500, color: COLORS.textMain },
  infoMono: { flex: 1, fontSize: 9, fontWeight: 500, color: COLORS.textMain },

  // Détail montants
  detailCard: { marginBottom: 10, borderRadius: 8, overflow: 'hidden' },
  detailHeader: {
    backgroundColor: COLORS.dark,
    padding: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailHeaderText: { fontSize: 10, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  detailBody: { borderColor: COLORS.light, borderWidth: 1, borderTopWidth: 0 },
  detailMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomColor: COLORS.light,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  detailLabelMain: { fontSize: 10.5, fontWeight: 500, color: COLORS.dark },
  detailLabelSub: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  detailValue: { fontSize: 10.5, fontWeight: 700, color: COLORS.textMain },
  detailSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomColor: COLORS.light,
    borderBottomWidth: 0.5,
  },
  detailSubRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  detailSubLabel: { fontSize: 10.5, color: COLORS.muted },

  totalRow: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 14,
  },
  totalLabel: { fontSize: 11, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  totalValue: { fontSize: 16, fontWeight: 700, color: COLORS.white },

  // Bandeau paiement
  paidBanner: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paidIcon: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.successDark,
    alignItems: 'center', justifyContent: 'center',
  },
  paidTitle: { fontSize: 10, fontWeight: 700, color: COLORS.successText },
  paidSub: { fontSize: 8.5, color: '#15803D' },

  // Mentions
  legalCard: {
    borderTopColor: COLORS.light,
    borderTopWidth: 0.5,
    paddingTop: 7,
    marginTop: 4,
  },
  legalTitle: { fontWeight: 700, color: COLORS.dark, fontSize: 9, letterSpacing: 0.5, marginBottom: 4 },
  legalText: { fontSize: 8.5, color: COLORS.muted, lineHeight: 1.45 },

  // Footer
  footer: {
    marginTop: 7,
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

const IconCheck = () => React.createElement(Svg, { width: 10, height: 10, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M5 12l5 5L20 7', fill: 'none', stroke: COLORS.white, strokeWidth: 3 })
)

// ===== Composant Document =====
function InvoiceDocument({ data, partnexxLegal, logoUri }) {
  const { commission_ht, vat, vat_rate, commission_ttc, is_paid, vat_exempt } = data

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
          React.createElement(Text, { style: styles.badgeText }, 'FACTURE')
        )
      ),

      // TITRE
      React.createElement(View, { style: styles.titleBlock },
        React.createElement(Text, { style: styles.titleMain }, 'Facture de'),
        React.createElement(Text, { style: styles.titleAccent }, 'commission de service'),
        React.createElement(View, { style: styles.titleLine }),
        React.createElement(Text, { style: styles.subtitle },
          "Facturation des frais de mise en relation et de gestion de la transaction sur la plateforme PARTNEXX."
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

      // ÉMETTEUR / CLIENT
      React.createElement(View, { style: styles.twoCols },
        React.createElement(View, { style: styles.partyCard },
          React.createElement(Text, { style: styles.partyLabel }, 'ÉMETTEUR'),
          React.createElement(Text, { style: styles.partyName }, partnexxLegal.name),
          React.createElement(Text, { style: styles.partyLine }, partnexxLegal.address),
          React.createElement(Text, { style: styles.partyLine }, `${partnexxLegal.zip} ${partnexxLegal.city}, ${partnexxLegal.country}`),
          React.createElement(Text, { style: styles.partyLine }, `SIRET : ${partnexxLegal.siret}`),
          React.createElement(Text, { style: styles.partyLine }, `${partnexxLegal.rcs}`),
          React.createElement(Text, { style: styles.partyLine }, `TVA : ${partnexxLegal.vat}`)
        ),
        React.createElement(View, { style: styles.partyCard },
          React.createElement(Text, { style: styles.partyLabel }, 'FACTURÉ À'),
          React.createElement(Text, { style: styles.partyName }, data.brand_name || '—'),
          data.brand_address && React.createElement(Text, { style: styles.partyLine }, data.brand_address),
          data.brand_zip_city && React.createElement(Text, { style: styles.partyLine }, data.brand_zip_city),
          data.brand_country && React.createElement(Text, { style: styles.partyLine }, data.brand_country),
          data.brand_siret && React.createElement(Text, { style: styles.partyLine }, `SIRET : ${data.brand_siret}`),
          data.brand_vat && React.createElement(Text, { style: styles.partyLine }, `TVA : ${data.brand_vat}`)
        )
      ),

      // TRANSACTION RÉFÉRENCÉE
      React.createElement(View, { style: styles.txCard },
        React.createElement(Text, { style: styles.partyLabel }, 'TRANSACTION RÉFÉRENCÉE'),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Campagne'),
          React.createElement(Text, { style: styles.infoVal }, data.campaign_title || '—')
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Créateur'),
          React.createElement(Text, { style: styles.infoVal }, data.creator_handle || data.creator_name || '—')
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'Montant collab.'),
          React.createElement(Text, { style: styles.infoVal }, `${fmtEUR(data.amount_gross)} (facturé séparément par le créateur)`)
        ),
        data.stripe_payment_intent_id && React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoKey }, 'N° transaction'),
          React.createElement(Text, { style: styles.infoMono }, data.stripe_payment_intent_id)
        )
      ),

      // DÉTAIL DES MONTANTS
      React.createElement(View, { style: styles.detailCard },
        React.createElement(View, { style: styles.detailHeader },
          React.createElement(Text, { style: styles.detailHeaderText }, 'DÉSIGNATION'),
          React.createElement(Text, { style: styles.detailHeaderText }, 'MONTANT HT')
        ),
        React.createElement(View, { style: styles.detailBody },
          React.createElement(View, { style: styles.detailMainRow },
            React.createElement(View, null,
              React.createElement(Text, { style: styles.detailLabelMain }, 'Commission de service PARTNEXX'),
              React.createElement(Text, { style: styles.detailLabelSub }, `${data.commission_pct}% du montant de la collaboration (${fmtEUR(data.amount_gross)})`)
            ),
            React.createElement(Text, { style: styles.detailValue }, fmtEUR(commission_ht))
          ),
          React.createElement(View, { style: styles.detailSubRow },
            React.createElement(Text, { style: styles.detailSubLabel }, 'Sous-total HT'),
            React.createElement(Text, { style: styles.detailValue }, fmtEUR(commission_ht))
          ),
          React.createElement(View, { style: styles.detailSubRowLast },
            React.createElement(Text, { style: styles.detailSubLabel },
              vat_exempt ? 'TVA (autoliquidation art. 196 directive 2006/112/CE)' : `TVA (${vat_rate}%)`
            ),
            React.createElement(Text, { style: styles.detailValue }, fmtEUR(vat))
          )
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'TOTAL TTC'),
          React.createElement(Text, { style: styles.totalValue }, fmtEUR(commission_ttc))
        )
      ),

      // BANDEAU PAIEMENT
      is_paid && React.createElement(View, { style: styles.paidBanner },
        React.createElement(View, { style: styles.paidIcon }, React.createElement(IconCheck)),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.paidTitle }, `PAYÉE LE ${data.paid_date_display}`),
          React.createElement(Text, { style: styles.paidSub }, 'Prélevée directement sur la transaction (escrow Stripe)')
        )
      ),

      // MENTIONS LÉGALES
      React.createElement(View, { style: styles.legalCard },
        React.createElement(Text, { style: styles.legalTitle }, 'MENTIONS LÉGALES'),
        React.createElement(Text, { style: styles.legalText },
          "PARTNEXX agit en qualité d'intermédiaire de mise en relation et de gestion de paiement entre les marques et les créateurs. Cette facture concerne uniquement les frais de service. La prestation du créateur fait l'objet d'une facturation séparée. Pénalités de retard : 3 fois le taux d'intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 € (art. L. 441-10 du Code de commerce). TVA acquittée sur les encaissements."
        )
      ),

      // FOOTER
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, { style: styles.footerText },
          `${partnexxLegal.name} • SIRET ${partnexxLegal.siret} • ${partnexxLegal.rcs} • Capital ${partnexxLegal.capital}`
        ),
        React.createElement(Text, { style: styles.footerEmail }, partnexxLegal.email)
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

    // 3. Trouver la marque associée à l'user
    const { data: brand, error: brandErr } = await supabaseAdmin
      .from('brands')
      .select('id, company_name, address, zip, city, country, siret, vat_number')
      .eq('user_id', userId)
      .single()
    if (brandErr || !brand) {
      return NextResponse.json({ error: 'Profil marque introuvable' }, { status: 404 })
    }

    // 4. Récupérer la transaction (et vérifier qu'elle appartient à cette marque)
    const { data: tx, error: txErr } = await supabaseAdmin
      .from('transactions')
      .select(`
        id, amount, platform_fee, status, type, metadata,
        created_at, released_at, stripe_payment_intent_id,
        influencers (id, display_name),
        collaborations (id, campaigns (id, title))
      `)
      .eq('id', transactionId)
      .eq('brand_id', brand.id)
      .single()
    if (txErr || !tx) return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })

    // 5. Extraire les infos de commission depuis les metadata
    const meta = tx.metadata || {}
    const commissionHT = Number(meta.commission_ht) || Number(tx.platform_fee) || 0
    const vat = Number(meta.vat) || 0
    const commissionTTC = Number(meta.commission_ttc) || commissionHT + vat
    const vatRate = Number(meta.vat_rate) || 20
    const vatExempt = meta.vat_exempt === true || meta.vat_exempt === 'true'
    const amountGross = Number(tx.amount) || 0
    const commissionPct = Number(meta.marque_rate) || (amountGross > 0 ? Math.round((commissionHT / amountGross) * 100) : 0)

    // 6. Préparer les dates
    const issueDate = new Date(tx.created_at)
    const paidDate = tx.released_at ? new Date(tx.released_at) : null
    const isPaid = tx.status === 'released' || tx.status === 'in_escrow'

    // 7. N° de facture séquentiel (table invoices)
    const year = issueDate.getFullYear()
    const { data: invoiceNumber, error: invoiceNumberError } = await supabaseAdmin
      .rpc('get_or_create_invoice_number', {
        p_invoice_type: 'partnexx_commission',
        p_transaction_id: tx.id,
        p_brand_id: tx.brand_id,
        p_influencer_id: tx.influencer_id,
        p_amount_ht: commissionHT,
        p_amount_vat: vat,
        p_amount_ttc: commissionTTC,
      })
    if (invoiceNumberError) {
      console.error('Erreur génération N° facture:', invoiceNumberError)
      return NextResponse.json({ error: 'Erreur de numérotation' }, { status: 500 })
    }

    // 8. Préparer les infos légales PARTNEXX (depuis env)
    const partnexxLegal = {
      name: process.env.PARTNEXX_LEGAL_NAME || 'PARTNEXX SAS',
      address: process.env.PARTNEXX_LEGAL_ADDRESS || 'Adresse à compléter',
      zip: process.env.PARTNEXX_LEGAL_ZIP || '',
      city: process.env.PARTNEXX_LEGAL_CITY || 'Paris',
      country: process.env.PARTNEXX_LEGAL_COUNTRY || 'France',
      siret: process.env.PARTNEXX_LEGAL_SIRET || 'À compléter',
      rcs: process.env.PARTNEXX_LEGAL_RCS || '',
      vat: process.env.PARTNEXX_LEGAL_VAT || 'À compléter',
      email: process.env.PARTNEXX_LEGAL_EMAIL || 'facturation@partnexx.com',
      capital: process.env.PARTNEXX_LEGAL_CAPITAL || '—',
    }

    // 9. Données pour le PDF
    const data = {
      invoice_number: invoiceNumber,
      issue_date_display: issueDate.toLocaleDateString('fr-FR'),
      paid_date_display: paidDate ? paidDate.toLocaleDateString('fr-FR') : '',
      is_paid: isPaid,
      brand_name: brand.company_name || 'Marque',
      brand_address: brand.address || null,
      brand_zip_city: (brand.zip || brand.city) ? `${brand.zip || ''} ${brand.city || ''}`.trim() : null,
      brand_country: brand.country || null,
      brand_siret: brand.siret || null,
      brand_vat: brand.vat_number || null,
      campaign_title: tx.collaborations?.campaigns?.title || '—',
      creator_handle: tx.influencers?.display_name ? `@${tx.influencers.display_name}` : null,
      creator_name: tx.influencers?.display_name,
      stripe_payment_intent_id: tx.stripe_payment_intent_id,
      amount_gross: amountGross,
      commission_ht: commissionHT,
      vat,
      vat_rate: vatRate,
      commission_ttc: commissionTTC,
      commission_pct: commissionPct,
      vat_exempt: vatExempt,
    }

    // 10. Rendu PDF
    registerFonts()
    const logoUri = getLogoDataUri()
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoiceDocument, { data, partnexxLegal, logoUri: logoUri || null })
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
    console.error('Erreur génération facture marque:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
