import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renderToBuffer, Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer'
import React from 'react'
import fs from 'fs'
import path from 'path'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const fmtEUR = (n) => `${(Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace(/[\u202f\u00a0]/g, ' ')} €`
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : null)

// ===== Polices & logo =====
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
  Font.registerHyphenationCallback((word) => [word])
  fontsRegistered = true
}

let logoCache = null
function getLogoDataUri() {
  if (logoCache !== null) return logoCache
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
    logoCache = `data:image/png;base64,${buf.toString('base64')}`
  } catch { logoCache = false }
  return logoCache
}

const C = {
  primary: '#7C3AED', primarySoft: '#F3EFFF', primaryBorder: '#E9D8FD', primaryDark: '#5B21B6',
  dark: '#0F0F1A', text: '#2A2A3A', soft: '#4A4A5A', muted: '#6B7280', faint: '#9CA3AF',
  line: '#E5E7EB', bg: '#F9FAFB', white: '#FFFFFF',
}

const styles = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 58, paddingHorizontal: 46, fontFamily: 'Inter', fontSize: 9.5, color: C.text, lineHeight: 1.5 },

  headerFixed: { position: 'absolute', top: 18, left: 46, right: 46, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: C.line },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoImg: { width: 16, height: 16 },
  brandText: { fontSize: 11, fontWeight: 700, color: C.dark, letterSpacing: 1.5 },
  headerBadge: { fontSize: 7, fontWeight: 700, color: C.primary, letterSpacing: 0.8 },

  footer: { position: 'absolute', bottom: 24, left: 46, right: 46, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: C.line, paddingTop: 6 },
  footerText: { fontSize: 7, color: C.faint },

  hero: { marginBottom: 12 },
  kicker: { fontSize: 8, fontWeight: 700, color: C.primary, letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: 700, color: C.dark, lineHeight: 1.1 },
  titleAccent: { color: C.primary },
  ref: { fontSize: 8.5, color: C.muted, marginTop: 5 },
  rule: { height: 3, width: 34, backgroundColor: C.primary, borderRadius: 2, marginTop: 8 },

  pillRow: { flexDirection: 'row', gap: 6, marginTop: 11 },
  pill: { backgroundColor: C.primarySoft, borderWidth: 1, borderColor: C.primaryBorder, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 9 },
  pillText: { fontSize: 7.5, fontWeight: 700, color: C.primaryDark, letterSpacing: 0.3 },

  sectionLabel: { fontSize: 8, fontWeight: 700, color: C.muted, letterSpacing: 1, marginTop: 6, marginBottom: 6 },

  parties: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  partyCard: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 11, backgroundColor: C.bg },
  partyTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  partyDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  partyDotText: { fontSize: 8, fontWeight: 700, color: C.white },
  partyLabel: { fontSize: 7.5, fontWeight: 700, color: C.primary, letterSpacing: 0.5 },
  partyName: { fontSize: 11, fontWeight: 700, color: C.dark, marginBottom: 2 },
  partyLine: { fontSize: 8.5, color: C.soft, lineHeight: 1.5 },

  recap: { borderRadius: 8, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: C.line },
  recapHead: { backgroundColor: C.dark, paddingVertical: 8, paddingHorizontal: 12 },
  recapHeadText: { fontSize: 9, fontWeight: 700, color: C.white, letterSpacing: 0.8 },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: C.line, backgroundColor: C.white },
  recapLabel: { fontSize: 9, color: C.muted },
  recapValue: { fontSize: 9.5, fontWeight: 600, color: C.dark },
  recapTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: C.primary },
  recapTotalLabel: { fontSize: 10, fontWeight: 700, color: '#EDE9FE', letterSpacing: 0.3 },
  recapTotalValue: { fontSize: 16, fontWeight: 700, color: C.white },

  article: { marginBottom: 9 },
  artHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  artChip: { backgroundColor: C.primary, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 5 },
  artChipText: { fontSize: 7.5, fontWeight: 700, color: C.white, letterSpacing: 0.5 },
  artTitle: { fontSize: 10.5, fontWeight: 700, color: C.dark, flex: 1 },

  para: { fontSize: 9, color: C.text, lineHeight: 1.55, marginBottom: 3, textAlign: 'justify' },
  bullet: { flexDirection: 'row', marginBottom: 2.5, paddingLeft: 4 },
  bulletDot: { width: 10, fontSize: 9, color: C.primary, fontWeight: 700 },
  bulletText: { flex: 1, fontSize: 9, color: C.text, lineHeight: 1.5 },

  highlight: { backgroundColor: C.primarySoft, borderRadius: 8, padding: 10, marginTop: 4, marginBottom: 4, borderWidth: 1, borderColor: C.primaryBorder },
  highlightLabelRow: { flexDirection: 'row', marginBottom: 4 },
  highlightBadge: { backgroundColor: C.primary, borderRadius: 3, paddingVertical: 1.5, paddingHorizontal: 5 },
  highlightBadgeText: { fontSize: 6.5, fontWeight: 700, color: C.white, letterSpacing: 0.6 },
  highlightText: { fontSize: 8.6, color: C.primaryDark, lineHeight: 1.55 },

  specialBox: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.line, borderLeftWidth: 3, borderLeftColor: C.primary, borderRadius: 6, padding: 9, marginTop: 2, marginBottom: 3 },
  specialText: { fontSize: 8.8, color: C.soft, lineHeight: 1.5 },

  signTitle: { fontSize: 11, fontWeight: 700, color: C.dark, marginTop: 14, marginBottom: 8 },
  signWrap: { flexDirection: 'row', gap: 14 },
  signBox: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 12, minHeight: 96 },
  signLabel: { fontSize: 8, fontWeight: 700, color: C.primary, letterSpacing: 0.5, marginBottom: 5 },
  signName: { fontSize: 10, fontWeight: 700, color: C.dark },
  signMeta: { fontSize: 8, color: C.muted, marginTop: 2 },
  signStamp: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#DCFCE7', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6 },
  signStampText: { fontSize: 7, fontWeight: 700, color: '#166534' },
  signLine: { marginTop: 22, borderTopWidth: 0.5, borderTopColor: C.faint, paddingTop: 3, fontSize: 7.5, color: C.faint },

  disclaimer: { marginTop: 16, fontSize: 7.5, color: C.faint, lineHeight: 1.45, borderTopWidth: 0.5, borderTopColor: C.line, paddingTop: 8 },
})

const P = (txt, key) => React.createElement(Text, { style: styles.para, key }, txt)

const Bullet = (txt, key) => React.createElement(View, { style: styles.bullet, key },
  React.createElement(Text, { style: styles.bulletDot }, '•'),
  React.createElement(Text, { style: styles.bulletText }, txt)
)

const Protection = (txt, key) => React.createElement(View, { style: styles.highlight, key },
  React.createElement(View, { style: styles.highlightLabelRow },
    React.createElement(View, { style: styles.highlightBadge },
      React.createElement(Text, { style: styles.highlightBadgeText }, 'PROTECTION PARTNEXX')
    )
  ),
  React.createElement(Text, { style: styles.highlightText }, txt)
)

const Article = (num, title, body, opts) => React.createElement(View, { style: styles.article, wrap: (opts && opts.wrap) || false, key: 'art' + num },
  React.createElement(View, { style: styles.artHead },
    React.createElement(View, { style: styles.artChip }, React.createElement(Text, { style: styles.artChipText }, `ART. ${num}`)),
    React.createElement(Text, { style: styles.artTitle }, title)
  ),
  ...body
)

function ContractDocument({ d, logoUri }) {
  // Les livrables peuvent être des textes ("1 Post Instagram") OU des objets ({ name: "1 Post Instagram", status: ... }).
  // On normalise tout en texte pour le PDF, sinon @react-pdf plante.
  const deliverables = (Array.isArray(d.deliverables) ? d.deliverables : [])
    .filter(Boolean)
    .map((x, i) => (typeof x === 'string' ? x : (x?.name || x?.label || x?.title || `Livrable ${i + 1}`)))
    .filter((s) => typeof s === 'string' && s.trim().length > 0)

  const header = React.createElement(View, { style: styles.headerFixed, fixed: true },
    React.createElement(View, { style: styles.headerLeft },
      logoUri && React.createElement(Image, { src: logoUri, style: styles.logoImg }),
      React.createElement(Text, { style: styles.brandText }, 'PARTNEXX')
    ),
    React.createElement(Text, { style: styles.headerBadge }, `CONTRAT DE PARTENARIAT • N°${d.ref}`)
  )

  const footer = React.createElement(View, { style: styles.footer, fixed: true },
    React.createElement(Text, { style: styles.footerText }, 'PARTNEXX • Paiement sécurisé sous séquestre • Document confidentiel'),
    React.createElement(Text, { style: styles.footerText, render: ({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}` })
  )

  const special2 = d.special ? [
    React.createElement(Text, { style: styles.sectionLabel, key: 'spl' }, 'CLAUSES PARTICULIÈRES DE LA MARQUE'),
    React.createElement(View, { style: styles.specialBox, key: 'spb' },
      React.createElement(Text, { style: styles.specialText }, d.special)
    ),
  ] : []

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page, wrap: true },
      header,
      footer,

      // HERO
      React.createElement(View, { style: styles.hero },
        React.createElement(Text, { style: styles.kicker }, 'PARTENARIAT CRÉATEUR × MARQUE'),
        React.createElement(Text, { style: styles.title },
          'Contrat de ', React.createElement(Text, { style: styles.titleAccent }, 'partenariat')
        ),
        React.createElement(View, { style: styles.rule }),
        React.createElement(Text, { style: styles.ref }, `Référence n°${d.ref} — établi le ${d.createdDisplay} via la plateforme PARTNEXX`),
        React.createElement(View, { style: styles.pillRow },
          React.createElement(View, { style: styles.pill }, React.createElement(Text, { style: styles.pillText }, 'Paiement sous séquestre')),
          React.createElement(View, { style: styles.pill }, React.createElement(Text, { style: styles.pillText }, 'Médiation incluse')),
          React.createElement(View, { style: styles.pill }, React.createElement(Text, { style: styles.pillText }, 'Signature électronique'))
        )
      ),

      // PARTIES
      React.createElement(Text, { style: styles.sectionLabel }, 'ENTRE LES SOUSSIGNÉS'),
      React.createElement(View, { style: styles.parties },
        React.createElement(View, { style: styles.partyCard },
          React.createElement(View, { style: styles.partyTop },
            React.createElement(View, { style: styles.partyDot }, React.createElement(Text, { style: styles.partyDotText }, 'M')),
            React.createElement(Text, { style: styles.partyLabel }, "L'ANNONCEUR (LA MARQUE)")
          ),
          React.createElement(Text, { style: styles.partyName }, d.brandName),
          d.brandIndustry && React.createElement(Text, { style: styles.partyLine }, d.brandIndustry),
          d.brandAddr && React.createElement(Text, { style: styles.partyLine }, d.brandAddr),
          d.brandSiret && React.createElement(Text, { style: styles.partyLine }, `SIRET : ${d.brandSiret}`)
        ),
        React.createElement(View, { style: styles.partyCard },
          React.createElement(View, { style: styles.partyTop },
            React.createElement(View, { style: styles.partyDot }, React.createElement(Text, { style: styles.partyDotText }, 'C')),
            React.createElement(Text, { style: styles.partyLabel }, 'LE CRÉATEUR')
          ),
          React.createElement(Text, { style: styles.partyName }, d.creatorName),
          d.creatorBusiness && React.createElement(Text, { style: styles.partyLine }, d.creatorBusiness),
          d.creatorAddr && React.createElement(Text, { style: styles.partyLine }, d.creatorAddr),
          d.creatorSiret && React.createElement(Text, { style: styles.partyLine }, `SIRET : ${d.creatorSiret}`)
        )
      ),

      // RECAP TABLE
      React.createElement(View, { style: styles.recap, wrap: false },
        React.createElement(View, { style: styles.recapHead },
          React.createElement(Text, { style: styles.recapHeadText }, "RÉCAPITULATIF DE L'ACCORD")
        ),
        React.createElement(View, { style: styles.recapRow },
          React.createElement(Text, { style: styles.recapLabel }, "Date d'établissement"),
          React.createElement(Text, { style: styles.recapValue }, d.createdDisplay)
        ),
        React.createElement(View, { style: styles.recapRow },
          React.createElement(Text, { style: styles.recapLabel }, 'Date limite des livrables'),
          React.createElement(Text, { style: styles.recapValue }, d.deadlineDisplay || 'À convenir')
        ),
        React.createElement(View, { style: styles.recapRow },
          React.createElement(Text, { style: styles.recapLabel }, 'Nombre de livrables'),
          React.createElement(Text, { style: styles.recapValue }, `${deliverables.length || '—'}`)
        ),
        React.createElement(View, { style: styles.recapTotal },
          React.createElement(Text, { style: styles.recapTotalLabel }, 'RÉMUNÉRATION DU CRÉATEUR'),
          React.createElement(Text, { style: styles.recapTotalValue }, fmtEUR(d.amount))
        )
      ),

      // PRÉAMBULE + ARTICLES
      React.createElement(Text, { style: styles.sectionLabel }, 'PRÉAMBULE'),
      React.createElement(View, { style: styles.specialBox },
        React.createElement(Text, { style: styles.specialText },
          "Le présent contrat (le « Contrat ») est conclu via la plateforme PARTNEXX, qui met à disposition des parties des outils de mise en relation, de contractualisation et de paiement sécurisé, sans garantie de résultat. PARTNEXX n'est partie ni au Contrat, ni aux livrables : son rôle, ses limites de responsabilité et sa commission de service sont régis par ses Conditions Générales d'Utilisation (les « CGU »), acceptées par les deux parties et qui prévalent pour tout ce qui concerne le fonctionnement de la plateforme."
        )
      ),

      Article('1', 'Objet du Contrat', [
        P("La Marque confie au Créateur la réalisation et la diffusion de contenus dans le cadre de l'opération décrite ci-après. Le Créateur s'engage à exécuter les livrables définis à l'Article 2, dans le respect du Brief, des délais, des présentes stipulations et des CGU de la plateforme PARTNEXX.", 'a1a'),
        d.mission && P(`Description de l'opération : ${d.mission}`, 'a1b'),
      ]),

      Article('2', 'Livrables et spécifications', [
        P("Le Créateur s'engage à produire les livrables suivants, conformément aux indications transmises par la Marque via la plateforme :", 'a2a'),
        ...(deliverables.length > 0
          ? deliverables.map((dl, i) => Bullet(dl, 'dl' + i))
          : [P('Livrables définis selon le Brief transmis par la Marque sur la plateforme.', 'a2nd')]),
        P('Le Brief et toute spécification complémentaire transmise par la Marque via PARTNEXX font partie intégrante du présent Contrat.', 'a2b'),
        ...special2,
      ], { wrap: true }),

      Article('3', 'Durée, délais et retards', [
        P(`Les livrables devront être réalisés puis soumis à la Marque au plus tard le ${d.deadlineDisplay || '(date à convenir)'}, selon le Brief. Tout retard imputable au Créateur peut entraîner une réduction de la rémunération et affecter son Partnexx Score. Tout retard imputable à la Marque (validation tardive, fourniture d'éléments) proroge d'autant les délais et ne peut être reproché au Créateur.`, 'a3'),
      ]),

      Article('4', 'Rémunération et commission PARTNEXX', [
        P(`En contrepartie de la prestation, la Marque verse au Créateur une rémunération brute de ${fmtEUR(d.amount)}, réglée exclusivement via la plateforme PARTNEXX selon le mécanisme sécurisé décrit à l'Article 5.`, 'a4a'),
        P("PARTNEXX prélève une commission de service comprise entre 7 % et 15 % du montant brut, selon la formule d'abonnement souscrite par la Marque, conformément aux CGU. Le Créateur perçoit la rémunération brute diminuée de cette commission.", 'a4b'),
      ]),

      Article('5', 'Paiement sécurisé sous séquestre', [
        P("Le paiement est sécurisé via le prestataire de paiement agréé de la plateforme (Stripe). Dès l'engagement de la Marque, les fonds sont bloqués selon un mécanisme de séquestre, sans transiter par les comptes propres de PARTNEXX et sans qu'aucune coordonnée bancaire ne soit conservée par PARTNEXX. Le Créateur a la garantie que les fonds existent avant de produire ; la Marque, qu'ils ne sont libérés qu'après exécution.", 'a5'),
        Protection("Les fonds sont libérés au profit du Créateur après validation des livrables par la Marque (ou acceptation tacite à défaut de retour dans le délai du Brief), puis versés par virement SEPA dans un délai maximum de sept (7) jours ouvrés. En cas de litige déclaré sur la plateforme, les fonds restent bloqués jusqu'à résolution.", 'a5p'),
      ]),

      Article('6', 'Validation des livrables', [
        P("La Marque valide les livrables ou demande des ajustements raisonnables, dans la stricte limite du Brief et de deux (2) itérations maximum. À défaut de retour motivé de la Marque dans le délai prévu au Brief, les livrables sont réputés acceptés et la rémunération est libérée.", 'a6'),
      ]),

      Article('7', 'Annulation', [
        P("Toute annulation de la prestation par la Marque après acceptation par le Créateur donne lieu, sauf accord contraire des parties, au versement au Créateur d'une indemnité forfaitaire égale à 30 % du budget initial, conformément aux CGU.", 'a7'),
      ]),

      Article('8', 'Indépendance des parties', [
        P("Le Créateur intervient en qualité de prestataire indépendant. Le présent Contrat n'établit aucun lien de subordination, contrat de travail, mandat, société de fait ou agence, ni entre les parties, ni avec PARTNEXX. Le Créateur conserve la liberté de son organisation et demeure seul responsable de ses obligations fiscales et sociales.", 'a8'),
      ]),

      Article('9', "Propriété intellectuelle et droit à l'image", [
        P("Les droits cédés par le Créateur à la Marque (type d'usage : organique, paid, OOH ; supports ; territoires ; durée ; exclusivité éventuelle) sont définis dans le Brief. À défaut de précision, la cession est limitée à un usage organique sur les réseaux sociaux, pour une durée de douze (12) mois, sur le territoire mondial.", 'a9a'),
        P("Toute exploitation hors de ce périmètre (publicité payante, prolongation, nouveaux supports, modification substantielle) fait l'objet d'un accord écrit distinct et, le cas échéant, d'une rémunération complémentaire. Le Créateur conserve la paternité de ses œuvres.", 'a9b'),
      ]),

      Article('10', 'Garanties du Créateur', [
        P("Le Créateur garantit que les contenus sont originaux, qu'il est titulaire ou a obtenu l'ensemble des droits nécessaires sur les éléments les composant (musiques, images, marques et droit à l'image des personnes filmées) et que leur diffusion ne porte atteinte à aucun droit d'un tiers. Il garantit la Marque et PARTNEXX contre toute action en contrefaçon ou en parasitisme à ce titre.", 'a10'),
      ]),

      Article('11', 'Obligations du Créateur', [
        Bullet('Réaliser les contenus avec soin et professionnalisme, conformément au Brief ;', 'o1'),
        Bullet("Indiquer clairement le caractère commercial du partenariat (mentions « #ad », « #sponsorisé », « #partenariat ») conformément à la loi et aux recommandations de l'ARPP ;", 'o2'),
        Bullet("Respecter la réglementation applicable et s'abstenir de tout contenu illicite, trompeur, dénigrant ou portant atteinte aux droits de tiers.", 'o3'),
      ]),

      Article('12', 'Obligations de la Marque', [
        Bullet('Fournir un Brief clair et les éléments nécessaires à la prestation ;', 'b1'),
        Bullet('Régler la rémunération via la plateforme et valider les livrables de bonne foi ;', 'b2'),
        Bullet('Ne pas exiger de modifications excédant le périmètre du Brief sans accord du Créateur.', 'b3'),
      ]),

      Article('13', 'Non-désintermédiation', [
        Protection("Pendant toute la durée du Contrat et pendant douze (12) mois après son terme, les parties s'interdisent de contourner la plateforme PARTNEXX pour traiter directement, sur le même objet, avec une contrepartie rencontrée via PARTNEXX, conformément aux CGU. Tout manquement pourra donner lieu à des dommages-intérêts.", 'a13'),
      ]),

      Article('14', 'Confidentialité', [
        P("Chaque partie préserve la confidentialité des informations non publiques échangées (Brief, stratégies marketing, données d'audience, tarifs, négociations). Cette obligation perdure trois (3) ans après la fin des relations.", 'a14'),
      ]),

      Article('15', 'Données personnelles (RGPD)', [
        P("Les parties traitent les données personnelles conformément au Règlement (UE) 2016/679 (RGPD). PARTNEXX assure l'hébergement technique des échanges et des données relatives au Contrat dans le respect de sa politique de confidentialité.", 'a15'),
      ]),

      Article('16', 'Litiges et médiation PARTNEXX', [
        P("En cas de désaccord, les parties s'engagent à privilégier une résolution amiable via l'espace « Litiges » de la plateforme PARTNEXX avant toute action.", 'a16'),
        Protection("PARTNEXX peut proposer une médiation : son équipe examine les échanges et les pièces fournies, puis suggère une issue (libération ou remboursement des fonds bloqués). Cette médiation est facultative et non contraignante ; PARTNEXX n'agit pas comme arbitre et ne tranche pas le fond du litige. Les modalités sont régies par les CGU et, à défaut de résolution, les parties conservent leurs droits d'agir en justice.", 'a16p'),
      ]),

      Article('17', 'Rôle et responsabilité de PARTNEXX', [
        P("PARTNEXX agit en qualité d'intermédiaire technique et n'est partie ni au présent Contrat, ni aux livrables. La plateforme est fournie « en l'état », dans le cadre d'une obligation de moyens, sans garantie d'absence d'erreurs ou d'interruption.", 'a17a'),
        Protection("Sauf faute lourde ou intentionnelle, la responsabilité de PARTNEXX est limitée dans les conditions de ses CGU (plafond égal aux sommes versées à PARTNEXX au titre des douze (12) derniers mois). Les parties garantissent PARTNEXX contre tout recours de tiers lié à leur prestation, à leurs contenus ou à leur litige, et renoncent à rechercher sa responsabilité à ce titre.", 'a17p'),
      ]),

      Article('18', 'Résiliation', [
        P("En cas de manquement grave d'une partie, l'autre partie peut résilier le Contrat après mise en demeure restée sans effet pendant un délai raisonnable. Les fonds éventuellement bloqués sont alors répartis via la procédure de litige PARTNEXX. La résiliation n'affecte pas les clauses destinées à survivre (propriété intellectuelle, confidentialité, non-désintermédiation, responsabilité).", 'a18'),
      ]),

      Article('19', 'Force majeure', [
        P("Aucune partie ne saurait être tenue responsable d'un manquement résultant d'un cas de force majeure au sens de l'article 1218 du Code civil.", 'a19'),
      ]),

      Article('20', 'Modifications et intégralité', [
        P("Le Contrat, complété par le Brief et les CGU de PARTNEXX, exprime l'intégralité de l'accord des parties et annule tout échange antérieur de même objet. En cas de contradiction, les CGU prévalent pour ce qui concerne le fonctionnement de la plateforme. Toute modification fait l'objet d'un avenant écrit accepté par les deux parties via la plateforme PARTNEXX.", 'a20'),
      ]),

      Article('21', 'Droit applicable et juridiction', [
        P("Le présent Contrat est régi par le droit français. À défaut de résolution amiable ou via la médiation PARTNEXX, tout litige relève des tribunaux de Paris, sous réserve des règles impératives protégeant la partie ayant la qualité de consommateur.", 'a21'),
      ]),

      // SIGNATURES
      React.createElement(View, { wrap: false },
        React.createElement(Text, { style: styles.signTitle }, 'Signatures'),
        React.createElement(View, { style: styles.signWrap },
          React.createElement(View, { style: styles.signBox },
            React.createElement(Text, { style: styles.signLabel }, 'POUR LA MARQUE'),
            React.createElement(Text, { style: styles.signName }, d.brandName),
            React.createElement(Text, { style: styles.signMeta }, d.brandSignedDisplay ? `Signé le ${d.brandSignedDisplay}` : 'Date : ____ / ____ / ________'),
            d.brandSignedDisplay
              ? React.createElement(View, { style: styles.signStamp }, React.createElement(Text, { style: styles.signStampText }, 'SIGNÉ VIA PARTNEXX'))
              : React.createElement(Text, { style: styles.signLine }, 'Signature précédée de « Lu et approuvé »')
          ),
          React.createElement(View, { style: styles.signBox },
            React.createElement(Text, { style: styles.signLabel }, 'POUR LE CRÉATEUR'),
            React.createElement(Text, { style: styles.signName }, d.creatorName),
            React.createElement(Text, { style: styles.signMeta }, d.creatorSignedDisplay ? `Signé le ${d.creatorSignedDisplay}` : 'Date : ____ / ____ / ________'),
            d.creatorSignedDisplay
              ? React.createElement(View, { style: styles.signStamp }, React.createElement(Text, { style: styles.signStampText }, 'SIGNÉ VIA PARTNEXX'))
              : React.createElement(Text, { style: styles.signLine }, 'Signature précédée de « Lu et approuvé »')
          )
        ),
        React.createElement(Text, { style: styles.disclaimer },
          "Document généré automatiquement par PARTNEXX à partir des informations renseignées par les parties. Ce modèle est fourni à titre indicatif et ne constitue pas un conseil juridique : nous recommandons de le faire valider par un professionnel du droit avant signature."
        )
      )
    )
  )
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const contractId = searchParams.get('contractId')
    if (!contractId) return NextResponse.json({ error: 'contractId requis' }, { status: 400 })

    // Auth
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '').trim()
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userData?.user) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    const userId = userData.user.id

    // Contrat + marque
    const { data: contract, error: cErr } = await supabaseAdmin
      .from('contracts')
      .select('*, brands (company_name, industry, address, zip, city, country, siret, vat_number, user_id)')
      .eq('id', contractId)
      .single()
    if (cErr || !contract) return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })

    // Créateur (influenceur)
    let influencer = null
    if (contract.influencer_id) {
      const { data } = await supabaseAdmin
        .from('influencers')
        .select('id, user_id, display_name, business_type, siret, country, facturation_address, facturation_zip, facturation_city, facturation_country')
        .eq('id', contract.influencer_id)
        .single()
      influencer = data || null
    }

    // Sécurité : seul le créateur OU la marque du contrat peut télécharger
    const isCreator = influencer?.user_id === userId
    const isBrand = contract.brands?.user_id === userId
    if (!isCreator && !isBrand) {
      // Si on n'a pas pu relier un créateur au contrat, on autorise un utilisateur authentifié disposant d'un profil créateur
      if (!('influencer_id' in contract) || !contract.influencer_id) {
        const { data: myInf } = await supabaseAdmin.from('influencers').select('id').eq('user_id', userId).maybeSingle()
        if (!myInf) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      } else {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    // Nom complet créateur
    let creatorName = influencer?.display_name || 'Le Créateur'
    if (influencer?.user_id) {
      const { data: prof } = await supabaseAdmin.from('profiles').select('full_name').eq('id', influencer.user_id).single()
      if (prof?.full_name) creatorName = prof.full_name
    }

    const BIZ = { individual: 'Particulier', auto_entrepreneur: 'Auto-entrepreneur', company: 'Société' }
    const join = (...parts) => parts.filter(Boolean).join(', ') || null

    // Numéro de contrat réel et séquentiel (PNX-2026-0001), persistant
    let ref = String(contract.id).slice(0, 8).toUpperCase() // secours si la fonction n'existe pas encore
    try {
      const { data: num, error: numErr } = await supabaseAdmin.rpc('get_or_create_contract_number', { p_contract_id: contractId })
      if (!numErr && num) ref = num
    } catch { /* on garde le secours */ }

    const d = {
      ref,
      createdDisplay: fmtDate(contract.created_at) || fmtDate(new Date()),
      brandName: contract.brands?.company_name || 'La Marque',
      brandIndustry: contract.brands?.industry || null,
      brandAddr: join(contract.brands?.address, join(contract.brands?.zip, contract.brands?.city), contract.brands?.country),
      brandSiret: contract.brands?.siret || null,
      creatorName,
      creatorBusiness: influencer?.business_type ? (BIZ[influencer.business_type] || influencer.business_type) : null,
      creatorAddr: join(influencer?.facturation_address, join(influencer?.facturation_zip, influencer?.facturation_city), influencer?.facturation_country || influencer?.country),
      creatorSiret: influencer?.siret || null,
      amount: contract.amount,
      deadlineDisplay: fmtDate(contract.deadline),
      deliverables: contract.deliverables,
      mission: contract.title || contract.description || contract.brief || null,
      special: contract.special_clauses || null,
      brandSignedDisplay: fmtDate(contract.brand_signed_at),
      creatorSignedDisplay: fmtDate(contract.influencer_signed_at),
    }

    registerFonts()
    const logoUri = getLogoDataUri()
    const buffer = await renderToBuffer(React.createElement(ContractDocument, { d, logoUri: logoUri || null }))

    const safeBrand = (d.brandName || 'partnexx').replace(/[^a-z0-9]/gi, '-').toLowerCase()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrat-${safeBrand}-${d.ref}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Erreur génération contrat PDF:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
