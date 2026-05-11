import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Génère un PDF en mémoire et retourne un Buffer
async function generatePDF(content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    content(doc)
    doc.end()
  })
}

// Upload un buffer vers Supabase Storage
async function uploadToStorage(buffer, path) {
  const { data, error } = await supabaseAdmin.storage
    .from('invoices')
    .upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: urlData } = supabaseAdmin.storage
    .from('invoices')
    .getPublicUrl(path)

  return urlData.publicUrl
}

// Facture marque
function generateBrandInvoice(doc, { transaction, brand, campaign }) {
  const invoiceNumber = `FAC-${transaction.id.slice(0, 8).toUpperCase()}`
  const date = new Date(transaction.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const amount = parseFloat(transaction.amount || 0)
  const platformFee = parseFloat(transaction.platform_fee || 0)
  const influencerAmount = parseFloat(transaction.influencer_amount || 0)

  // Header
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a202c')
    .text('PARTNEXX', 50, 50)
  doc.fontSize(10).font('Helvetica').fillColor('#718096')
    .text('Plateforme de marketing d\'influence', 50, 75)
    .text('contact@partnexx.fr', 50, 90)

  // Titre facture
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#a855f7')
    .text('FACTURE', 350, 50, { align: 'right' })
  doc.fontSize(10).font('Helvetica').fillColor('#718096')
    .text(`N° ${invoiceNumber}`, 350, 80, { align: 'right' })
    .text(`Date : ${date}`, 350, 95, { align: 'right' })

  // Ligne séparatrice
  doc.moveTo(50, 120).lineTo(545, 120).strokeColor('#e2e8f0').stroke()

  // Destinataire
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
    .text('FACTURÉ À', 50, 140)
  doc.fontSize(11).font('Helvetica').fillColor('#1a202c')
    .text(brand?.company_name || 'Marque', 50, 158)

  // Campagne
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
    .text('CAMPAGNE', 350, 140, { align: 'right' })
  doc.fontSize(11).font('Helvetica').fillColor('#1a202c')
    .text(campaign?.title || transaction.description || 'Campagne Partnexx', 350, 158, { align: 'right' })

  // Tableau
  doc.moveTo(50, 200).lineTo(545, 200).strokeColor('#e2e8f0').stroke()

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#718096')
    .text('DESCRIPTION', 50, 215)
    .text('MONTANT', 450, 215, { align: 'right' })

  doc.moveTo(50, 235).lineTo(545, 235).strokeColor('#e2e8f0').stroke()

  // Lignes
  const rows = [
    { label: 'Dépôt en escrow (campagne influenceur)', amount: influencerAmount },
    { label: `Commission Partnexx (${Math.round((platformFee / amount) * 100)}%)`, amount: platformFee },
  ]

  let y = 250
  rows.forEach(row => {
    doc.fontSize(10).font('Helvetica').fillColor('#1a202c')
      .text(row.label, 50, y)
      .text(`${row.amount.toFixed(2)} €`, 450, y, { align: 'right' })
    y += 25
  })

  doc.moveTo(50, y + 10).lineTo(545, y + 10).strokeColor('#e2e8f0').stroke()

  // Total
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a202c')
    .text('TOTAL TTC', 50, y + 25)
    .text(`${amount.toFixed(2)} €`, 450, y + 25, { align: 'right' })

  // Statut
  doc.roundedRect(50, y + 60, 150, 30, 5)
    .fillColor('#f0fdf4').fill()
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#16a34a')
    .text('✓ PAIEMENT REÇU', 65, y + 70)

  // Footer
  doc.fontSize(9).font('Helvetica').fillColor('#a0aec0')
    .text('Partnexx — Plateforme de marketing d\'influence', 50, 750, { align: 'center' })
    .text('Ce document constitue une facture officielle.', 50, 765, { align: 'center' })
}

// Reçu influenceur
function generateInfluencerReceipt(doc, { transaction, influencer, campaign }) {
  const receiptNumber = `REC-${transaction.id.slice(0, 8).toUpperCase()}`
  const date = new Date(transaction.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const influencerAmount = parseFloat(transaction.influencer_amount || 0)
  const platformFee = parseFloat(transaction.platform_fee || 0)
  const total = parseFloat(transaction.amount || 0)

  // Header
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a202c')
    .text('PARTNEXX', 50, 50)
  doc.fontSize(10).font('Helvetica').fillColor('#718096')
    .text('Plateforme de marketing d\'influence', 50, 75)
    .text('contact@partnexx.fr', 50, 90)

  // Titre reçu
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#22c55e')
    .text('REÇU DE PAIEMENT', 200, 50, { align: 'right' })
  doc.fontSize(10).font('Helvetica').fillColor('#718096')
    .text(`N° ${receiptNumber}`, 200, 80, { align: 'right' })
    .text(`Date : ${date}`, 200, 95, { align: 'right' })

  doc.moveTo(50, 120).lineTo(545, 120).strokeColor('#e2e8f0').stroke()

  // Destinataire
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
    .text('INFLUENCEUR', 50, 140)
  doc.fontSize(11).font('Helvetica').fillColor('#1a202c')
    .text(influencer?.display_name || 'Influenceur', 50, 158)

  // Campagne
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568')
    .text('CAMPAGNE', 350, 140, { align: 'right' })
  doc.fontSize(11).font('Helvetica').fillColor('#1a202c')
    .text(campaign?.title || transaction.description || 'Campagne Partnexx', 350, 158, { align: 'right' })

  doc.moveTo(50, 200).lineTo(545, 200).strokeColor('#e2e8f0').stroke()

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#718096')
    .text('DESCRIPTION', 50, 215)
    .text('MONTANT', 450, 215, { align: 'right' })

  doc.moveTo(50, 235).lineTo(545, 235).strokeColor('#e2e8f0').stroke()

  const rows = [
    { label: 'Montant brut de la collaboration', amount: total },
    { label: `Commission Partnexx (${Math.round((platformFee / total) * 100)}%)`, amount: -platformFee },
    { label: 'Montant net à recevoir', amount: influencerAmount, bold: true },
  ]

  let y = 250
  rows.forEach(row => {
    doc.fontSize(10)
      .font(row.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(row.amount < 0 ? '#ef4444' : '#1a202c')
      .text(row.label, 50, y)
      .text(`${row.amount > 0 ? '' : '-'}${Math.abs(row.amount).toFixed(2)} €`, 450, y, { align: 'right' })
    y += 25
  })

  doc.moveTo(50, y + 10).lineTo(545, y + 10).strokeColor('#e2e8f0').stroke()

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#22c55e')
    .text('MONTANT EN ESCROW', 50, y + 25)
    .text(`${influencerAmount.toFixed(2)} €`, 450, y + 25, { align: 'right' })

  doc.roundedRect(50, y + 60, 200, 30, 5)
    .fillColor('#f0fdf4').fill()
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#16a34a')
    .text('✓ FONDS SÉCURISÉS EN ESCROW', 65, y + 70)

  doc.fontSize(9).font('Helvetica').fillColor('#a0aec0')
    .text('Partnexx — Plateforme de marketing d\'influence', 50, 750, { align: 'center' })
    .text('Les fonds seront libérés après validation du livrable.', 50, 765, { align: 'center' })
}

// Route principale
export async function POST(req) {
  try {
    const { transactionId } = await req.json()

    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId requis' }, { status: 400 })
    }

    // Récupère la transaction avec les données liées
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select(`
        *,
        brands (id, company_name, user_id),
        influencers (id, display_name, user_id),
        collaborations (id, campaign_id,
          campaigns (id, title)
        )
      `)
      .eq('id', transactionId)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 })
    }

    const brand = transaction.brands
    const influencer = transaction.influencers
    const campaign = transaction.collaborations?.campaigns

    // Génère les deux PDFs
    const [brandPDF, influencerPDF] = await Promise.all([
      generatePDF(doc => generateBrandInvoice(doc, { transaction, brand, campaign })),
      generatePDF(doc => generateInfluencerReceipt(doc, { transaction, influencer, campaign })),
    ])

    // Upload vers Supabase Storage
    const timestamp = Date.now()
    const [brandUrl, influencerUrl] = await Promise.all([
      uploadToStorage(brandPDF, `brand/FAC-${transaction.id.slice(0, 8)}-${timestamp}.pdf`),
      uploadToStorage(influencerPDF, `influencer/REC-${transaction.id.slice(0, 8)}-${timestamp}.pdf`),
    ])

    // Sauvegarde les URLs dans la transaction
    await supabaseAdmin
      .from('transactions')
      .update({
        metadata: {
          ...transaction.metadata,
          invoice_brand_url: brandUrl,
          invoice_influencer_url: influencerUrl,
          invoices_generated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)

    console.log(`✅ Factures générées pour transaction ${transactionId}`)

    return NextResponse.json({
      success: true,
      brandUrl,
      influencerUrl,
    })

  } catch (err) {
    console.error('❌ Erreur génération factures:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}