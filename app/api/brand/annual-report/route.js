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

const fmtInt = (n) => `${Number(n) || 0}`

const PLAN_LABEL = {
  trial: 'Trial (18% commission)',
  growth: 'Growth (11% commission)',
  scale: 'Scale (7% commission)',
  enterprise: 'Enterprise',
}

const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

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
  primaryLight: '#A78BE8',
  primaryUltraLight: '#E0D5F7',
  dark: '#0F0F1A',
  textMain: '#1A1A2E',
  muted: '#6B7280',
  light: '#E5E7EB',
  ultraLight: '#F9FAFB',
  white: '#FFFFFF',
  danger: '#DC2626',
}

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
    marginBottom: 8,
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
  titleBlock: { marginTop: 6, marginBottom: 10 },
  titleMain: { fontSize: 20, fontWeight: 700, color: COLORS.dark, lineHeight: 1.1 },
  titleAccent: { fontSize: 20, fontWeight: 700, color: COLORS.primary, lineHeight: 1.1 },
  titleLine: { width: 28, height: 2.5, backgroundColor: COLORS.primary, marginTop: 6, marginBottom: 6 },
  subtitle: { fontSize: 9.5, color: COLORS.muted, lineHeight: 1.4 },

  // Client + Vérifié (2 cols)
  twoCols: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  clientCard: {
    flex: 2,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  verifyCard: {
    flex: 1,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyLabel: { fontSize: 9, color: COLORS.primary, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 },
  partyName: { fontSize: 11, fontWeight: 700, color: COLORS.dark, marginBottom: 4 },
  partyLine: { fontSize: 9.5, color: '#4A4A5A', lineHeight: 1.5 },
  verifyBubble: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  verifyTitle: { fontSize: 9, fontWeight: 700, color: COLORS.primary, letterSpacing: 0.5, marginBottom: 2 },
  verifySub: { fontSize: 8.5, color: COLORS.muted, textAlign: 'center' },

  // Synthèse
  synthCard: { marginBottom: 7, borderRadius: 8, overflow: 'hidden' },
  synthHeader: {
    backgroundColor: COLORS.dark,
    padding: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  synthHeaderTitle: { fontSize: 11, fontWeight: 700, color: COLORS.white, letterSpacing: 0.5 },
  synthHeaderBadge: {
    fontSize: 8.5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    color: COLORS.white,
    fontWeight: 500,
  },
  synthBody: { borderColor: COLORS.light, borderWidth: 1, borderTopWidth: 0 },
  synthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomColor: COLORS.light,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
  },
  synthRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  synthLabel: { fontSize: 10.5, color: COLORS.textMain },
  synthValue: { fontSize: 10.5, fontWeight: 700, color: COLORS.textMain },
  synthValueDanger: { fontSize: 10.5, fontWeight: 700, color: COLORS.danger },

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

  // 2 cards bas
  bottomCols: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  bottomCard: {
    flex: 1,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  creatorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  creatorName: { fontSize: 9.5, fontWeight: 500, color: COLORS.textMain },
  creatorTotal: { fontSize: 9.5, color: COLORS.muted },

  // Mini chart
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 60, marginBottom: 4 },
  chartBar: { flex: 1, borderRadius: 2 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { fontSize: 7, color: COLORS.muted, flex: 1, textAlign: 'center' },

  // Mentions
  legalCard: {
    borderTopColor: COLORS.light,
    borderTopWidth: 0.5,
    paddingTop: 8,
    marginTop: 4,
  },
  legalTitle: { fontWeight: 700, color: COLORS.dark, fontSize: 9, letterSpacing: 0.5, marginBottom: 4 },
  legalText: { fontSize: 8.5, color: COLORS.muted, lineHeight: 1.45 },

  footer: {
    marginTop: 8,
    paddingTop: 7,
    borderTopColor: COLORS.light,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: COLORS.muted },
  footerEmail: { fontSize: 8, color: COLORS.primary, fontWeight: 600 },
})

const IconCheck = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M5 12l5 5L20 7', fill: 'none', stroke: COLORS.white, strokeWidth: 3 })
)

const IconChart = () => React.createElement(Svg, { width: 10, height: 10, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M3 3v18h18M7 14l3-3 4 4 6-6', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 })
)

// Couleur barre selon hauteur (effet dégradé)
function barColor(ratio) {
  if (ratio >= 0.85) return COLORS.primary
  if (ratio >= 0.65) return '#9171E0'
  if (ratio >= 0.45) return COLORS.primaryLight
  if (ratio >= 0.25) return '#C7B5F0'
  return COLORS.primaryUltraLight
}

function BrandReportDocument({ data, partnexxLegal, logoUri }) {
  // Calcul du graphique mensuel
  const monthlyMap = new Map()
  ;(data.monthly_breakdown || []).forEach(m => {
    monthlyMap.set(Number(m.month), Number(m.total) || 0)
  })
  const monthlyData = []
  let maxMonth = 0
  for (let i = 1; i <= 12; i++) {
    const val = monthlyMap.get(i) || 0
    if (val > maxMonth) maxMonth = val
    monthlyData.push(val)
  }

  // Top créateurs (max 4 pour tenir sur 1 page)
  const topCreators = (data.top_creators || []).slice(0, 4)

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },

      // HEADER
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.headerLeft },
          logoUri && React.createElement(Image, { src: logoUri, style: styles.logoImg }),
          React.createElement(Text, { style: styles.brandText }, 'PARTNEXX')
        ),
        React.createElement(View, { style: styles.badgeBox },
          React.createElement(View, { style: styles.badgeIconBubble }, React.createElement(IconChart)),
          React.createElement(Text, { style: styles.badgeText }, 'BILAN ANNUEL')
        )
      ),

      // TITRE
      React.createElement(View, { style: styles.titleBlock },
        React.createElement(Text, { style: styles.titleMain }, "Bilan d'investissement"),
        React.createElement(Text, { style: styles.titleAccent }, `en influence ${data.year}`),
        React.createElement(View, { style: styles.titleLine }),
        React.createElement(Text, { style: styles.subtitle },
          "Récapitulatif annuel de vos investissements en collaborations créateurs via PARTNEXX."
        )
      ),

      // CLIENT + VÉRIFIÉ
      React.createElement(View, { style: styles.twoCols },
        React.createElement(View, { style: styles.clientCard },
          React.createElement(Text, { style: styles.partyLabel }, 'CLIENT'),
          React.createElement(Text, { style: styles.partyName }, data.brand_name || 'Marque'),
          data.industry && React.createElement(Text, { style: styles.partyLine }, `Secteur : ${data.industry}`),
          data.brand_email && React.createElement(Text, { style: styles.partyLine }, `Email : ${data.brand_email}`),
          React.createElement(Text, { style: styles.partyLine }, `Plan : ${PLAN_LABEL[data.plan] || data.plan || '—'}`),
          React.createElement(Text, { style: styles.partyLine },
            `Période : du ${data.period_start} au ${data.period_end}`
          )
        ),
        React.createElement(View, { style: styles.verifyCard },
          React.createElement(View, { style: styles.verifyBubble }, React.createElement(IconCheck)),
          React.createElement(Text, { style: styles.verifyTitle }, 'VÉRIFIÉ PAR PARTNEXX'),
          React.createElement(Text, { style: styles.verifySub }, 'Document certifié automatiquement')
        )
      ),

      // SYNTHÈSE
      React.createElement(View, { style: styles.synthCard },
        React.createElement(View, { style: styles.synthHeader },
          React.createElement(Text, { style: styles.synthHeaderTitle }, 'SYNTHÈSE DES DÉPENSES'),
          React.createElement(Text, { style: styles.synthHeaderBadge }, `PÉRIODE ${data.year}`)
        ),
        React.createElement(View, { style: styles.synthBody },
          React.createElement(View, { style: styles.synthRow },
            React.createElement(Text, { style: styles.synthLabel }, 'Nombre de transactions'),
            React.createElement(Text, { style: styles.synthValue }, fmtInt(data.nb_transactions))
          ),
          React.createElement(View, { style: styles.synthRow },
            React.createElement(Text, { style: styles.synthLabel }, 'Créateurs activés'),
            React.createElement(Text, { style: styles.synthValue }, fmtInt(data.nb_creators))
          ),
          React.createElement(View, { style: styles.synthRow },
            React.createElement(Text, { style: styles.synthLabel }, 'Total versé aux créateurs (HT)'),
            React.createElement(Text, { style: styles.synthValue }, fmtEUR(data.total_brut))
          ),
          React.createElement(View, { style: styles.synthRow },
            React.createElement(Text, { style: styles.synthLabel }, 'Commissions PARTNEXX (HT)'),
            React.createElement(Text, { style: styles.synthValueDanger }, fmtEUR(data.total_commission_ht))
          ),
          React.createElement(View, { style: styles.synthRowLast },
            React.createElement(Text, { style: styles.synthLabel }, 'TVA payée à PARTNEXX (20%)'),
            React.createElement(Text, { style: styles.synthValue }, fmtEUR(data.total_vat))
          )
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'INVESTISSEMENT TOTAL'),
          React.createElement(Text, { style: styles.totalValue }, fmtEUR(data.total_ttc))
        )
      ),

      // 2 CARDS BAS
      React.createElement(View, { style: styles.bottomCols },
        // Top créateurs
        React.createElement(View, { style: styles.bottomCard },
          React.createElement(Text, { style: styles.partyLabel }, 'TOP CRÉATEURS'),
          topCreators.length === 0
            ? React.createElement(Text, { style: { fontSize: 9, color: COLORS.muted } }, 'Aucun créateur cette année')
            : topCreators.map((c, i) => React.createElement(View, { key: i, style: styles.creatorRow },
                React.createElement(Text, { style: styles.creatorName }, `@${c.display_name}`),
                React.createElement(Text, { style: styles.creatorTotal }, fmtEUR(c.total))
              ))
        ),
        // Répartition mensuelle
        React.createElement(View, { style: styles.bottomCard },
          React.createElement(Text, { style: styles.partyLabel }, 'RÉPARTITION MENSUELLE'),
          React.createElement(View, { style: styles.chartContainer },
            monthlyData.map((val, i) => {
              const ratio = maxMonth > 0 ? val / maxMonth : 0
              const height = Math.max(2, ratio * 60)
              return React.createElement(View, {
                key: i,
                style: [styles.chartBar, { height, backgroundColor: barColor(ratio) }]
              })
            })
          ),
          React.createElement(View, { style: styles.chartLabels },
            MONTHS_SHORT.map((m, i) => React.createElement(Text, { key: i, style: styles.chartLabel }, m))
          )
        )
      ),

      // MENTIONS
      React.createElement(View, { style: styles.legalCard },
        React.createElement(Text, { style: styles.legalTitle }, 'INFORMATIONS'),
        React.createElement(Text, { style: styles.legalText },
          "Ce bilan est un document récapitulatif fourni à titre informatif pour faciliter votre comptabilité analytique. Les factures individuelles de chaque transaction sont disponibles dans votre tableau de bord. Pour toute question, contactez " + partnexxLegal.email + "."
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
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear(), 10)

    // 1. Auth
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // 2. Récupérer la brand
    const { data: brand, error: brandErr } = await supabaseAdmin
      .from('brands')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (brandErr || !brand) {
      return NextResponse.json({ error: 'Profil marque introuvable' }, { status: 404 })
    }

    // 3. Appeler la fonction SQL
    const { data: report, error: rpcErr } = await supabaseAdmin
      .rpc('get_brand_annual_report', { p_brand_id: brand.id, p_year: year })
    if (rpcErr) {
      console.error('Erreur RPC:', rpcErr)
      return NextResponse.json({ error: 'Erreur de génération du bilan' }, { status: 500 })
    }

    // 4. Infos légales PARTNEXX
    const partnexxLegal = {
      name: process.env.PARTNEXX_LEGAL_NAME || 'PARTNEXX SAS',
      siret: process.env.PARTNEXX_LEGAL_SIRET || 'À compléter',
      rcs: process.env.PARTNEXX_LEGAL_RCS || '',
      email: process.env.PARTNEXX_LEGAL_EMAIL || 'support@partnexx.com',
      capital: process.env.PARTNEXX_LEGAL_CAPITAL || '—',
    }

    // 5. Rendu PDF
    registerFonts()
    const logoUri = getLogoDataUri()
    const pdfBuffer = await renderToBuffer(
      React.createElement(BrandReportDocument, { data: report, partnexxLegal, logoUri: logoUri || null })
    )

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bilan-marque-partnexx-${year}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Erreur génération bilan marque:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}