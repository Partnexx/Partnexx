import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renderToBuffer, Document, Page, View, Text, Image, StyleSheet, Font, Svg, Path, Circle, Rect, Line, G } from '@react-pdf/renderer'
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

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

const fmtEUR = (n) =>
  `${(Number(n) || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`

// ===== Polices : Inter + Caveat pour la signature =====
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
  Font.register({
    family: 'Caveat',
    src: 'https://fonts.gstatic.com/s/caveat/v17/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpYTU.ttf',
  })
  fontsRegistered = true
}

// ===== Logo en base64 (chargé 1 fois) =====
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
  primaryDark: '#5B21B6',
  dark: '#0F0F1A',
  textMain: '#1A1A2E',
  muted: '#6B7280',
  light: '#E5E7EB',
  ultraLight: '#F9FAFB',
  white: '#FFFFFF',
  danger: '#DC2626',
  success: '#10B981',
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
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImg: { width: 26, height: 26 },
  brandText: { fontSize: 16, fontWeight: 700, color: COLORS.dark, letterSpacing: 1 },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  emisLabel: { fontSize: 8, color: COLORS.muted, letterSpacing: 1, fontWeight: 600 },
  emisDate: { fontSize: 11, color: COLORS.primary, fontWeight: 700, marginTop: 2 },

  badgeOfficiel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 10,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  badgeTitle: { fontSize: 9, fontWeight: 700, color: COLORS.dark, letterSpacing: 0.5 },
  badgeSub: { fontSize: 7, color: COLORS.muted, marginTop: 1 },

  // Titre
  titleBlock: { marginTop: 6, marginBottom: 4 },
  titleMain: { fontSize: 20, fontWeight: 700, color: COLORS.dark, lineHeight: 1.1 },
  titleAccent: { fontSize: 20, fontWeight: 700, color: COLORS.primary },
  titleLine: { width: 28, height: 2.5, backgroundColor: COLORS.primary, marginTop: 8, marginBottom: 8 },
  subtitle: { fontSize: 9.5, color: COLORS.muted, lineHeight: 1.4, maxWidth: 380 },

  // Carte bénéficiaire
  beneCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  beneLeft: { flex: 1.6, paddingRight: 16 },
  beneHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  beneIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  beneTitle: { fontSize: 11, fontWeight: 700, color: COLORS.primary, letterSpacing: 1 },
  beneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 10 },
  beneRowIcon: { width: 16, alignItems: 'center' },
  beneLabel: { fontSize: 9.5, color: COLORS.muted, width: 60 },
  beneValue: { fontSize: 10, color: COLORS.textMain, fontWeight: 500, flex: 1 },

  beneRight: {
    flex: 1,
    borderLeftColor: COLORS.light,
    borderLeftWidth: 1,
    paddingLeft: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifBig: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  verifBigOuter: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  verifTitle: { fontSize: 10, fontWeight: 700, color: COLORS.primary, marginBottom: 4 },
  verifText: { fontSize: 8.5, color: COLORS.muted, textAlign: 'center', lineHeight: 1.4 },

  // Synthèse
  syntheseCard: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  syntheseHeader: {
    backgroundColor: COLORS.dark,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syntheseHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  syntheseIcon: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  syntheseTitle: { fontSize: 12, fontWeight: 700, color: COLORS.white, letterSpacing: 1 },
  periodeBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20,
  },
  periodeText: { fontSize: 9, fontWeight: 700, color: COLORS.primary, letterSpacing: 0.5 },

  tableBody: { backgroundColor: COLORS.white, borderLeftWidth: 1, borderRightWidth: 1, borderLeftColor: COLORS.light, borderRightColor: COLORS.light },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderBottomColor: COLORS.light,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  tableLabel: { fontSize: 10.5, color: COLORS.textMain },
  tableValue: { fontSize: 11, fontWeight: 700, color: COLORS.textMain },
  tableValueDanger: { fontSize: 11, fontWeight: 700, color: COLORS.danger },

  totalRow: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  totalLabel: { fontSize: 12, fontWeight: 700, color: COLORS.white, letterSpacing: 1 },
  totalValue: { fontSize: 20, fontWeight: 700, color: COLORS.white },

  // Bas (2 colonnes)
  bottomGrid: { flexDirection: 'row', marginTop: 10, gap: 10 },
  bottomCard: {
    flex: 1,
    backgroundColor: COLORS.ultraLight,
    borderColor: COLORS.light,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  bottomHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  bottomIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  bottomTitle: { fontSize: 11, fontWeight: 700, color: COLORS.dark, letterSpacing: 1 },
  legalPara: { fontSize: 8, color: COLORS.muted, lineHeight: 1.35, marginBottom: 4 },

  signatureBlock: { alignItems: 'flex-end', marginTop: 6 },
  signatureScript: { fontFamily: 'Caveat', fontSize: 22, color: COLORS.primary },
  signatureName: { fontSize: 9.5, fontWeight: 700, color: COLORS.dark, marginTop: 4 },
  signatureTitle: { fontSize: 8, color: COLORS.muted, marginTop: 1 },

  confItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 3,
  },
  confItemIcon: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  confItemTitle: { fontSize: 9.5, fontWeight: 700, color: COLORS.dark },
  confItemSub: { fontSize: 7.5, color: COLORS.muted, marginTop: 1 },

  // Footer
  footer: {
    marginTop: 8,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: COLORS.light,
    borderTopWidth: 1,
  },
  footerCell: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  footerCellCenter: { flex: 1, alignItems: 'center' },
  footerCellRight: { flex: 1, alignItems: 'flex-end' },
  footerText: { fontSize: 8.5, color: COLORS.muted },
  footerTextBold: { fontSize: 9, fontWeight: 700, color: COLORS.dark },
  footerEmail: { fontSize: 8.5, color: COLORS.primary, fontWeight: 600 },
  footerBottom: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 7.5,
    color: COLORS.light,
  },
})

// ===== Icônes SVG =====
const IconUser = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Circle, { cx: 12, cy: 8, r: 4, fill: COLORS.primary }),
  React.createElement(Path, { d: 'M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8', fill: COLORS.primary })
)
const IconMail = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Rect, { x: 2, y: 5, width: 20, height: 14, rx: 2, fill: 'none', stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Path, { d: 'M2 7l10 7 10-7', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 })
)
const IconBriefcase = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Rect, { x: 3, y: 7, width: 18, height: 13, rx: 2, fill: 'none', stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Path, { d: 'M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 })
)
const IconGlobe = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Circle, { cx: 12, cy: 12, r: 10, fill: 'none', stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Path, { d: 'M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20', fill: 'none', stroke: COLORS.primary, strokeWidth: 1.5 })
)
const IconCalendar = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Rect, { x: 3, y: 5, width: 18, height: 16, rx: 2, fill: 'none', stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Line, { x1: 3, y1: 10, x2: 21, y2: 10, stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Line, { x1: 8, y1: 3, x2: 8, y2: 7, stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Line, { x1: 16, y1: 3, x2: 16, y2: 7, stroke: COLORS.primary, strokeWidth: 2 })
)
const IconCalendarBig = () => React.createElement(Svg, { width: 18, height: 18, viewBox: '0 0 24 24' },
  React.createElement(Rect, { x: 3, y: 5, width: 18, height: 16, rx: 2, fill: 'none', stroke: COLORS.muted, strokeWidth: 2 }),
  React.createElement(Line, { x1: 3, y1: 10, x2: 21, y2: 10, stroke: COLORS.muted, strokeWidth: 2 }),
  React.createElement(Line, { x1: 8, y1: 3, x2: 8, y2: 7, stroke: COLORS.muted, strokeWidth: 2 }),
  React.createElement(Line, { x1: 16, y1: 3, x2: 16, y2: 7, stroke: COLORS.muted, strokeWidth: 2 })
)
const IconShield = ({ size = 16, color = COLORS.white }) => React.createElement(Svg, { width: size, height: size, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z', fill: color })
)
const IconCheck = ({ color = COLORS.primary }) => React.createElement(Svg, { width: 12, height: 12, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M5 12l5 5L20 7', fill: 'none', stroke: color, strokeWidth: 3 })
)
const IconChart = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Rect, { x: 3, y: 14, width: 4, height: 7, rx: 1, fill: COLORS.white }),
  React.createElement(Rect, { x: 10, y: 9, width: 4, height: 12, rx: 1, fill: COLORS.white }),
  React.createElement(Rect, { x: 17, y: 4, width: 4, height: 17, rx: 1, fill: COLORS.white })
)
const IconBalance = () => React.createElement(Svg, { width: 16, height: 16, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M12 3v18M5 21h14M8 7l-4 7c0 2 2 3 4 3s4-1 4-3l-4-7zM16 7l-4 7c0 2 2 3 4 3s4-1 4-3l-4-7z', fill: 'none', stroke: COLORS.primary, strokeWidth: 1.5 })
)
const IconLock = () => React.createElement(Svg, { width: 12, height: 12, viewBox: '0 0 24 24' },
  React.createElement(Rect, { x: 5, y: 11, width: 14, height: 10, rx: 2, fill: COLORS.primary }),
  React.createElement(Path, { d: 'M8 11V7a4 4 0 018 0v4', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 })
)
const IconDoc = () => React.createElement(Svg, { width: 12, height: 12, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Path, { d: 'M14 2v6h6', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 })
)
const IconList = () => React.createElement(Svg, { width: 12, height: 12, viewBox: '0 0 24 24' },
  React.createElement(Line, { x1: 8, y1: 6, x2: 21, y2: 6, stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Line, { x1: 8, y1: 12, x2: 21, y2: 12, stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Line, { x1: 8, y1: 18, x2: 21, y2: 18, stroke: COLORS.primary, strokeWidth: 2 }),
  React.createElement(Circle, { cx: 4, cy: 6, r: 1, fill: COLORS.primary }),
  React.createElement(Circle, { cx: 4, cy: 12, r: 1, fill: COLORS.primary }),
  React.createElement(Circle, { cx: 4, cy: 18, r: 1, fill: COLORS.primary })
)
const IconChat = () => React.createElement(Svg, { width: 14, height: 14, viewBox: '0 0 24 24' },
  React.createElement(Path, { d: 'M21 11.5c0 4.7-4 8.5-9 8.5-1.5 0-3-.3-4.3-.9L3 21l1.9-4.7C4.3 15 4 13.3 4 11.5 4 6.8 8 3 13 3s9 3.8 9 8.5z', fill: 'none', stroke: COLORS.primary, strokeWidth: 2 })
)

// ===== Composant Document =====
function ReportDocument({ report, periodLabel, logoUri }) {
  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },

      // ===== HEADER =====
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.headerLeft },
          logoUri && React.createElement(Image, { src: logoUri, style: styles.logoImg }),
          React.createElement(Text, { style: styles.brandText }, 'PARTNEXX')
        ),
        React.createElement(View, { style: styles.headerRight },
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 10 } },
            React.createElement(View, { style: { alignItems: 'flex-end' } },
              React.createElement(Text, { style: styles.emisLabel }, 'DOCUMENT ÉMIS LE'),
              React.createElement(Text, { style: styles.emisDate }, new Date().toLocaleDateString('fr-FR'))
            ),
            React.createElement(IconCalendarBig)
          ),
          // Badge officiel
          React.createElement(View, { style: styles.badgeOfficiel },
            React.createElement(View, { style: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' } },
              React.createElement(IconCheck, { color: COLORS.white })
            ),
            React.createElement(View, null,
              React.createElement(Text, { style: styles.badgeTitle }, 'DOCUMENT OFFICIEL'),
              React.createElement(Text, { style: styles.badgeSub }, "Conforme à l'article 242 bis du CGI")
            )
          )
        )
      ),

      // ===== TITRE =====
      React.createElement(View, { style: styles.titleBlock },
        React.createElement(Text, { style: styles.titleMain }, 'Récapitulatif mensuel'),
        React.createElement(Text, null,
          React.createElement(Text, { style: styles.titleMain }, 'de '),
          React.createElement(Text, { style: styles.titleAccent }, `revenus ${periodLabel}`)
        ),
        React.createElement(View, { style: styles.titleLine }),
        React.createElement(Text, { style: styles.subtitle },
          "Document officiel récapitulant l'ensemble des revenus encaissés via la plateforme PARTNEXX sur la période indiquée."
        )
      ),

      // ===== CARTE BÉNÉFICIAIRE =====
      React.createElement(View, { style: styles.beneCard },
        React.createElement(View, { style: styles.beneLeft },
          React.createElement(View, { style: styles.beneHeader },
            React.createElement(View, { style: styles.beneIcon },
              React.createElement(IconUser)
            ),
            React.createElement(Text, { style: styles.beneTitle }, 'BÉNÉFICIAIRE')
          ),
          React.createElement(View, { style: styles.beneRow },
            React.createElement(View, { style: styles.beneRowIcon }, React.createElement(IconUser)),
            React.createElement(Text, { style: styles.beneLabel }, 'Nom'),
            React.createElement(Text, { style: styles.beneValue }, report.creator_name || '—')
          ),
          React.createElement(View, { style: styles.beneRow },
            React.createElement(View, { style: styles.beneRowIcon }, React.createElement(IconMail)),
            React.createElement(Text, { style: styles.beneLabel }, 'Email'),
            React.createElement(Text, { style: styles.beneValue }, report.creator_email || '—')
          ),
          React.createElement(View, { style: styles.beneRow },
            React.createElement(View, { style: styles.beneRowIcon }, React.createElement(IconBriefcase)),
            React.createElement(Text, { style: styles.beneLabel }, 'Statut'),
            React.createElement(Text, { style: styles.beneValue }, BUSINESS_TYPE_LABEL[report.business_type] || 'Non défini')
          ),
          report.country && React.createElement(View, { style: styles.beneRow },
            React.createElement(View, { style: styles.beneRowIcon }, React.createElement(IconGlobe)),
            React.createElement(Text, { style: styles.beneLabel }, 'Pays'),
            React.createElement(Text, { style: styles.beneValue }, report.country)
          ),
          React.createElement(View, { style: styles.beneRow },
            React.createElement(View, { style: styles.beneRowIcon }, React.createElement(IconCalendar)),
            React.createElement(Text, { style: styles.beneLabel }, 'Période'),
            React.createElement(Text, { style: styles.beneValue }, `du ${report.period_start} au ${report.period_end}`)
          )
        ),
        React.createElement(View, { style: styles.beneRight },
          React.createElement(View, { style: styles.verifBigOuter },
            React.createElement(View, { style: styles.verifBig },
              React.createElement(IconShield, { size: 26, color: COLORS.white })
            )
          ),
          React.createElement(Text, { style: styles.verifTitle }, 'VÉRIFIÉ PAR PARTNEXX'),
          React.createElement(Text, { style: styles.verifText }, 'Ce document a été généré et certifié automatiquement par notre système.')
        )
      ),

      // ===== SYNTHÈSE =====
      React.createElement(View, { style: styles.syntheseCard },
        React.createElement(View, { style: styles.syntheseHeader },
          React.createElement(View, { style: styles.syntheseHeaderLeft },
            React.createElement(View, { style: styles.syntheseIcon },
              React.createElement(IconChart)
            ),
            React.createElement(Text, { style: styles.syntheseTitle }, 'SYNTHÈSE DES REVENUS')
          ),
          React.createElement(View, { style: styles.periodeBadge },
            React.createElement(Text, { style: styles.periodeText }, periodLabel.toUpperCase())
          )
        ),
        React.createElement(View, { style: styles.tableBody },
          React.createElement(View, { style: styles.tableRow },
            React.createElement(Text, { style: styles.tableLabel }, 'Nombre de transactions'),
            React.createElement(Text, { style: styles.tableValue }, String(report.nb_transactions || 0))
          ),
          React.createElement(View, { style: styles.tableRow },
            React.createElement(Text, { style: styles.tableLabel }, 'Revenus bruts (avant commission)'),
            React.createElement(Text, { style: styles.tableValue }, fmtEUR(report.total_brut))
          ),
          React.createElement(View, { style: [styles.tableRow, { borderBottomWidth: 0 }] },
            React.createElement(Text, { style: styles.tableLabel }, 'Commission PARTNEXX'),
            React.createElement(Text, { style: styles.tableValueDanger }, `- ${fmtEUR(report.total_commission_partnexx)}`)
          )
        ),
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'TOTAL REÇU NET'),
          React.createElement(Text, { style: styles.totalValue }, fmtEUR(report.total_recu_createur))
        )
      ),

      // ===== BLOCS BAS =====
      React.createElement(View, { style: styles.bottomGrid },
        // Infos légales + signature
        React.createElement(View, { style: styles.bottomCard },
          React.createElement(View, { style: styles.bottomHeader },
            React.createElement(View, { style: styles.bottomIcon },
              React.createElement(IconBalance)
            ),
            React.createElement(Text, { style: styles.bottomTitle }, 'INFORMATIONS LÉGALES')
          ),
          React.createElement(Text, { style: styles.legalPara },
            "Ce récapitulatif est émis conformément à l'article 242 bis du Code général des impôts. Il atteste des sommes brutes encaissées par votre intermédiaire sur la plateforme PARTNEXX au titre de la période indiquée."
          ),
          React.createElement(Text, { style: styles.legalPara },
            "Vous êtes seul responsable de la déclaration de ces revenus à l'administration fiscale, conformément aux conditions générales acceptées lors de la configuration de vos paiements. PARTNEXX déclare également ces revenus à la DGFiP dans le cadre du dispositif DAC7."
          ),
          React.createElement(View, { style: styles.signatureBlock },
            React.createElement(Text, { style: styles.signatureName }, 'Mathias Baudoin'),
            React.createElement(Text, { style: styles.signatureTitle }, 'PDG, PARTNEXX')
          )
        ),
        // Conformité & sécurité
        React.createElement(View, { style: styles.bottomCard },
          React.createElement(View, { style: styles.bottomHeader },
            React.createElement(View, { style: styles.bottomIcon },
              React.createElement(IconShield, { size: 14, color: COLORS.primary })
            ),
            React.createElement(Text, { style: styles.bottomTitle }, 'CONFORMITÉ & SÉCURITÉ')
          ),
          React.createElement(View, { style: styles.confItem },
            React.createElement(View, { style: styles.confItemIcon }, React.createElement(IconLock)),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: styles.confItemTitle }, 'Infrastructure sécurisée'),
              React.createElement(Text, { style: styles.confItemSub }, 'Données chiffrées et protégées')
            )
          ),
          React.createElement(View, { style: styles.confItem },
            React.createElement(View, { style: styles.confItemIcon }, React.createElement(IconDoc)),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: styles.confItemTitle }, 'Conforme DAC7'),
              React.createElement(Text, { style: styles.confItemSub }, 'Déclaration automatique à la DGFiP')
            )
          ),
          React.createElement(View, { style: styles.confItem },
            React.createElement(View, { style: styles.confItemIcon }, React.createElement(IconList)),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(Text, { style: styles.confItemTitle }, 'Généré automatiquement'),
              React.createElement(Text, { style: styles.confItemSub }, 'Aucune modification manuelle')
            )
          )
        )
      ),

      // ===== FOOTER =====
      React.createElement(View, { style: styles.footer },
        React.createElement(View, { style: styles.footerCell },
          logoUri && React.createElement(Image, { src: logoUri, style: { width: 18, height: 18 } }),
          React.createElement(Text, { style: styles.footerTextBold }, 'PARTNEXX')
        ),
        React.createElement(View, { style: styles.footerCellCenter },
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 6 } },
            React.createElement(IconShield, { size: 12, color: COLORS.muted }),
            React.createElement(Text, { style: styles.footerText }, 'Plateforme de partenariats sûre & transparente')
          )
        ),
        React.createElement(View, { style: styles.footerCellRight },
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 6 } },
            React.createElement(IconChat),
            React.createElement(View, null,
              React.createElement(Text, { style: { fontSize: 8, color: COLORS.muted } }, 'Une question ?'),
              React.createElement(Text, { style: styles.footerEmail }, 'support@partnexx.com')
            )
          )
        )
      ),
      React.createElement(Text, { style: styles.footerBottom },
        'PARTNEXX SAS  •  Document généré automatiquement  •  Ne pas modifier'
      )
    )
  )
}

export async function GET(req) {
  try {
    // 1. Année + mois
    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear()
    const month = monthParam ? parseInt(monthParam, 10) : (new Date().getMonth() + 1)
    if (!Number.isInteger(year) || year < 2020 || year > 2100) {
      return NextResponse.json({ error: 'Année invalide' }, { status: 400 })
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Mois invalide' }, { status: 400 })
    }

    // 2. Auth
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // 3. Influencer
    const { data: influencer, error: infErr } = await supabaseAdmin
      .from('influencers')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (infErr || !influencer) return NextResponse.json({ error: 'Profil créateur introuvable' }, { status: 404 })

    // 4. Données
    const { data: report, error: rpcErr } = await supabaseAdmin.rpc('get_creator_monthly_report', {
      p_influencer_id: influencer.id,
      p_year: year,
      p_month: month,
    })
    if (rpcErr || !report) {
      console.error('Erreur RPC:', rpcErr)
      return NextResponse.json({ error: 'Erreur lors de la génération du rapport' }, { status: 500 })
    }

    // 5. Render PDF
    const periodLabel = `${MONTHS_FR[month - 1]} ${year}`
    registerFonts()
    const logoUri = getLogoDataUri()
    const pdfBuffer = await renderToBuffer(
      React.createElement(ReportDocument, { report, periodLabel, logoUri: logoUri || null })
    )

    const mm = String(month).padStart(2, '0')
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recap-partnexx-${year}-${mm}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Erreur génération récap mensuel:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
