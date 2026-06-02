'use client'

export default function CguMandatFacturation() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#a8c8f8 0%,#c4a8f8 30%,#f8a8d8 70%,#f8c8e8 100%)', padding: '2rem 1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Back */}
      <div style={{ maxWidth: '900px', margin: '0 auto 1rem' }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>← Retour à l'accueil</a>
      </div>

      {/* Card */}
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '2.5rem 3rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>

        {/* En-tête */}
        <div style={{ borderBottom: '2px solid #f0f0f5', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#a855f7,#ec4899)', borderRadius: '8px' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a202c', letterSpacing: '1px' }}>PARTNEXX</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', marginTop: '0.5rem' }}>
            Mandat de facturation
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.3rem' }}>
            Version 1.0 — En vigueur à compter du 1er juin 2026
          </p>
        </div>

        {/* Bandeau avertissement */}
        <div style={{ background: '#FFF7ED', border: '1.5px solid #FB923C', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '2rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1rem' }}>⚠️</span>
          <div style={{ fontSize: '0.78rem', color: '#9A3412', lineHeight: 1.5 }}>
            <strong>Document en cours de finalisation.</strong> Les clauses ci-dessous sont des placeholders à faire valider par un avocat avant la mise en production de PARTNEXX.
          </div>
        </div>

        <div style={{ fontSize: '0.92rem', color: '#2d3748', lineHeight: 1.7 }}>

          <p style={{ marginBottom: '1.5rem' }}>
            Le présent mandat est conclu entre <strong>PARTNEXX SAS</strong>, société par actions simplifiée au capital de 500 €, immatriculée au RCS de Paris sous le numéro 999 731 417, dont le siège social est situé 60 rue François 1er, 75008 Paris (ci-après « PARTNEXX » ou le « Mandataire ») et l'utilisateur créateur enregistré sur la plateforme PARTNEXX (ci-après le « Créateur » ou le « Mandant »).
          </p>

          {/* Article 1 */}
          <h2 style={sectionTitle}>Article 1 — Objet du mandat</h2>
          <p style={p}>
            Conformément à l'<strong>article 289-I-2 du Code Général des Impôts</strong> et à l'arrêté du 22 mars 2017, le Créateur donne mandat à PARTNEXX pour émettre, en son nom et pour son compte, les factures à destination des marques et entreprises avec lesquelles il collabore via la plateforme PARTNEXX.
          </p>
          <p style={p}>
            Ce mandat couvre :
          </p>
          <ul style={ul}>
            <li>L'émission des factures pour chaque collaboration réalisée</li>
            <li>L'archivage légal des factures pendant 10 ans</li>
            <li>La transmission des factures aux marques clientes</li>
            <li>La numérotation séquentielle des factures conformément à la réglementation française</li>
          </ul>

          {/* Article 2 */}
          <h2 style={sectionTitle}>Article 2 — Durée et résiliation</h2>
          <p style={p}>
            Le présent mandat prend effet à compter de l'acceptation des Conditions Générales d'Utilisation par le Créateur lors de son inscription sur PARTNEXX, et reste valable tant que le Créateur conserve un compte actif sur la plateforme.
          </p>
          <p style={p}>
            Le Créateur peut <strong>révoquer le mandat à tout moment</strong> depuis ses paramètres de compte ou en envoyant un email à contact@partnexx.com. La révocation prend effet sous 30 jours. Les factures déjà émises restent valables.
          </p>

          {/* Article 3 */}
          <h2 style={sectionTitle}>Article 3 — Procédure d'acceptation des factures par le Mandant</h2>
          <p style={p}>
            À chaque émission de facture par PARTNEXX au nom du Créateur, ce dernier est notifié par email et dans son tableau de bord PARTNEXX.
          </p>
          <p style={p}>
            Le Créateur dispose d'un délai de <strong>15 jours calendaires</strong> pour contester la facture émise. <strong>L'absence de contestation dans ce délai vaut acceptation tacite</strong> de la facture, conformément à l'arrêté du 22 mars 2017.
          </p>
          <p style={p}>
            En cas de contestation, le Créateur peut signaler l'erreur via la plateforme. PARTNEXX émettra alors une facture rectificative dans les meilleurs délais.
          </p>

          {/* Article 4 */}
          <h2 style={sectionTitle}>Article 4 — Mentions obligatoires sur les factures</h2>
          <p style={p}>
            Toutes les factures émises par PARTNEXX au nom du Créateur comporteront, conformément à la réglementation :
          </p>
          <ul style={ul}>
            <li>L'identification complète du Créateur (nom, statut juridique, SIRET si applicable, adresse)</li>
            <li>L'identification complète de la marque cliente</li>
            <li>Le numéro et la date de la facture</li>
            <li>Le détail de la prestation et son montant</li>
            <li>Le taux et le montant de TVA applicable (ou la mention "TVA non applicable, art. 293 B du CGI" en cas de franchise en base)</li>
            <li>La mention obligatoire : <em>« Facture établie par PARTNEXX SAS au nom et pour le compte de [Nom du Créateur] en vertu d'un mandat de facturation »</em></li>
          </ul>

          {/* Article 5 */}
          <h2 style={sectionTitle}>Article 5 — Responsabilités</h2>
          <p style={p}>
            <strong>Le Créateur reste seul responsable</strong> du contenu de ses prestations facturées, du paiement de ses charges fiscales et sociales, ainsi que de la véracité des informations fournies à PARTNEXX (statut juridique, SIRET, etc.).
          </p>
          <p style={p}>
            PARTNEXX est responsable de la bonne exécution technique du mandat : émission correcte des factures, numérotation séquentielle, archivage, transmission aux marques.
          </p>
          <p style={p}>
            En cas d'erreur de PARTNEXX dans l'émission d'une facture, le Créateur ne pourra réclamer aucune indemnité au-delà des montants effectivement perçus par PARTNEXX au titre de la transaction concernée.
          </p>

          {/* Article 6 */}
          <h2 style={sectionTitle}>Article 6 — TVA et obligations fiscales</h2>
          <p style={p}>
            PARTNEXX applique le régime de TVA correspondant au statut juridique déclaré par le Créateur dans son profil. Il appartient au Créateur de <strong>maintenir à jour ces informations</strong>, notamment en cas de franchissement des seuils de franchise en base de TVA (94 300 € de CA pour les prestations de services en 2026).
          </p>
          <p style={p}>
            PARTNEXX procède également à la déclaration automatique des revenus du Créateur à la Direction Générale des Finances Publiques (DGFiP) dans le cadre du dispositif <strong>DAC7</strong> (Directive européenne de coopération administrative).
          </p>

          {/* Article 7 */}
          <h2 style={sectionTitle}>Article 7 — Modifications</h2>
          <p style={p}>
            PARTNEXX se réserve le droit de modifier le présent mandat. Toute modification substantielle sera notifiée au Créateur par email avec un préavis de 30 jours. Le maintien du compte vaut acceptation des nouvelles conditions.
          </p>

          {/* Article 8 */}
          <h2 style={sectionTitle}>Article 8 — Loi applicable et juridiction</h2>
          <p style={p}>
            Le présent mandat est soumis au droit français. En cas de litige, et après une tentative de résolution amiable, les tribunaux du ressort de la Cour d'appel de Paris seront seuls compétents.
          </p>

          {/* Footer */}
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#718096', textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              PARTNEXX SAS • SIRET 999 731 417 00013 • RCS Paris • Capital social : 500 €
            </p>
            <p>
              Pour toute question : <a href="mailto:contact@partnexx.com" style={{ color: '#a855f7', fontWeight: 600 }}>contact@partnexx.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Styles locaux
const sectionTitle = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: '#1a202c',
  marginTop: '2rem',
  marginBottom: '0.75rem',
  paddingBottom: '0.4rem',
  borderBottom: '2px solid #a855f7',
  display: 'inline-block',
}

const p = {
  marginBottom: '1rem',
  lineHeight: 1.7,
}

const ul = {
  paddingLeft: '1.5rem',
  marginBottom: '1rem',
  lineHeight: 1.7,
}