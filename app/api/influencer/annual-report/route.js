import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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
  })} EUR`

// pdf-lib ne gère pas nativement les caractères accentués avec les polices standards
// Cette fonction sanitise les caractères pour qu'ils soient affichables
const safeText = (s) => {
  if (s === null || s === undefined) return ''
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents combinés
    .replace(/[^\x20-\x7E]/g, '?')   // remplace tout ce qui n'est pas ASCII imprimable
}

export async function GET(req) {
  try {
    // 1. Récupérer l'année demandée
    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear()
    if (!Number.isInteger(year) || year < 2020 || year > 2100) {
      return NextResponse.json({ error: 'Année invalide' }, { status: 400 })
    }

    // 2. Authentifier l'utilisateur via le token Bearer
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }
    const userId = userData.user.id

    // 3. Trouver l'influencer correspondant
    const { data: influencer, error: infErr } = await supabaseAdmin
      .from('influencers')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (infErr || !influencer) {
      return NextResponse.json({ error: 'Profil créateur introuvable' }, { status: 404 })
    }

    // 4. Récupérer le rapport via la fonction SQL
    const { data: report, error: rpcErr } = await supabaseAdmin.rpc(
      'get_creator_annual_report',
      { p_influencer_id: influencer.id, p_year: year }
    )
    if (rpcErr || !report) {
      console.error('Erreur RPC get_creator_annual_report:', rpcErr)
      return NextResponse.json({ error: 'Erreur lors de la génération du rapport' }, { status: 500 })
    }

    // 5. Générer le PDF avec pdf-lib
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4
    const { width, height } = page.getSize()
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const margin = 50
    let y = height - margin
    const colorDark = rgb(0.1, 0.1, 0.1)
    const colorMuted = rgb(0.4, 0.4, 0.4)
    const colorLight = rgb(0.6, 0.6, 0.6)

    // En-tête
    page.drawText('PARTNEXX', { x: margin, y, size: 22, font: fontBold, color: colorDark })
    y -= 22
    page.drawText(safeText('Récapitulatif annuel de revenus'), {
      x: margin, y, size: 11, font: fontRegular, color: colorMuted,
    })
    y -= 16
    page.drawText(safeText(`Émis le ${new Date().toLocaleDateString('fr-FR')}`), {
      x: margin, y, size: 9, font: fontRegular, color: colorLight,
    })
    y -= 40

    // Bloc identité créateur
    page.drawText(safeText(`Récapitulatif ${year}`), {
      x: margin, y, size: 15, font: fontBold, color: colorDark,
    })
    y -= 24

    const idLines = [
      `Nom : ${report.creator_name || '-'}`,
      `Email : ${report.creator_email || '-'}`,
      `Statut : ${BUSINESS_TYPE_LABEL[report.business_type] || 'Non defini'}`,
    ]
    if (report.country) idLines.push(`Pays : ${report.country}`)
    idLines.push(`Periode : du ${report.period_start} au ${report.period_end}`)

    for (const line of idLines) {
      page.drawText(safeText(line), {
        x: margin, y, size: 11, font: fontRegular, color: colorDark,
      })
      y -= 16
    }
    y -= 20

    // Synthèse des revenus
    page.drawText(safeText('Synthese des revenus'), {
      x: margin, y, size: 13, font: fontBold, color: colorDark,
    })
    y -= 22

    const rows = [
      ['Nombre de transactions', String(report.nb_transactions || 0)],
      ['Revenus bruts (avant commission)', fmtEUR(report.total_brut)],
      ['Commission PARTNEXX', fmtEUR(report.total_commission_partnexx)],
      ['Total recu net', fmtEUR(report.total_recu_createur)],
    ]
    const valueX = width - margin - 180
    for (const [label, value] of rows) {
      page.drawText(safeText(label), { x: margin, y, size: 11, font: fontRegular, color: colorMuted })
      // Aligne la valeur à droite
      const valueWidth = fontBold.widthOfTextAtSize(safeText(value), 11)
      page.drawText(safeText(value), {
        x: width - margin - valueWidth, y, size: 11, font: fontBold, color: colorDark,
      })
      y -= 18
    }
    y -= 24

    // Mentions légales
    const legalText1 =
      "Ce recapitulatif est emis conformement a l'article 242 bis du Code general des impots. Il atteste des sommes brutes encaissees par votre intermediaire sur la plateforme PARTNEXX au titre de l'annee indiquee."
    const legalText2 =
      "Vous etes seul responsable de la declaration de ces revenus a l'administration fiscale, conformement aux conditions generales acceptees lors de la configuration de vos paiements. PARTNEXX declare egalement ces revenus a la DGFiP dans le cadre du dispositif DAC7."

    // Wrap text manuel pour pdf-lib (qui ne wrap pas automatiquement)
    const wrapText = (text, font, size, maxWidth) => {
      const words = text.split(' ')
      const lines = []
      let current = ''
      for (const w of words) {
        const test = current ? `${current} ${w}` : w
        if (font.widthOfTextAtSize(test, size) > maxWidth) {
          if (current) lines.push(current)
          current = w
        } else {
          current = test
        }
      }
      if (current) lines.push(current)
      return lines
    }

    const maxLineWidth = width - margin * 2
    for (const txt of [legalText1, legalText2]) {
      const lines = wrapText(safeText(txt), fontRegular, 9, maxLineWidth)
      for (const line of lines) {
        page.drawText(line, { x: margin, y, size: 9, font: fontRegular, color: colorMuted })
        y -= 12
      }
      y -= 8
    }

    // Footer
    y = 40
    const footer = 'PARTNEXX - Document genere automatiquement.'
    const footerWidth = fontRegular.widthOfTextAtSize(footer, 8)
    page.drawText(footer, {
      x: (width - footerWidth) / 2, y, size: 8, font: fontRegular, color: colorLight,
    })

    const pdfBytes = await pdfDoc.save()

    // 6. Renvoyer le PDF
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recap-partnexx-${year}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Erreur génération récap annuel:', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
