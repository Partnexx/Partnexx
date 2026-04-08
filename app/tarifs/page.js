'use client'
import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/plateforme', label: 'Plateforme' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

function Navbar() {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 3rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 20px rgba(0,0,0,0.05)' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#nl2)"/>
          <defs><linearGradient id="nl2" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
        </svg>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a202c' }}>Partnexx</span>
      </Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{ color: '#718096', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{l.label}</Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link href="/login" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Se connecter</Link>
        <Link href="/onboarding" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.55rem 1.2rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700 }}>
          Essai gratuit →
        </Link>
      </div>
    </nav>
  )
}

const INFLUENCEUR_PLANS = [
  {
    name: 'Gratuit', price: '0€', sub: 'Parfait pour démarrer', color: '#718096', featured: false,
    features: ['Profil basique', '3 candidatures/mois', 'Messagerie limitée', 'Analytics basiques', 'Support communautaire'],
    cta: 'Commencer gratuitement', ctaStyle: 'outline',
  },
  {
    name: 'Créateur', price: '39€', sub: 'Pour les créateurs actifs', color: '#a855f7', featured: true,
    features: ['Profil premium', 'Candidatures illimitées', 'Statistiques avancées', 'Analytics détaillées', 'Messagerie avancée', 'Badge vérifié', 'Support prioritaire'],
    cta: 'Essai gratuit', ctaStyle: 'primary',
  },
  {
    name: 'Pro', price: '99€', sub: 'Pour les créateurs pro', color: '#ec4899', featured: false,
    features: ['Tout du plan Créateur', 'Studio UGC avancé', 'Négociation automatique', 'Partnexx Score Elite', 'Manager dédié', 'API access'],
    cta: 'Essai gratuit', ctaStyle: 'pink',
  },
]

const ENTERPRISE_PLANS = [
  {
    name: 'Starter', price: '59€', sub: 'Pour les petites équipes', color: '#718096', featured: false,
    features: ['Jusqu\'à 5 campagnes/mois', 'Accès 50 influenceurs', 'Base de données limitée', 'Dashboard basique', 'Rapports mensuels'],
    cta: 'Démarrer', ctaStyle: 'outline',
  },
  {
    name: 'Growth', price: '199€', sub: 'Pour les équipes en croissance', color: '#a855f7', featured: true,
    features: ['Campagnes illimitées', 'Accès 500 influenceurs', 'Matching IA', 'Analytics ROI', 'Analytics RFE', 'Intégrations CRM'],
    cta: 'Télécharger', ctaStyle: 'primary',
  },
  {
    name: 'Scale', price: '799€', sub: 'Pour les grandes équipes', color: '#ec4899', featured: false,
    features: ['Tout du Growth', 'Accès influenceurs illimité', 'Account manager dédié', 'White-label content', 'API complète'],
    cta: 'Nous contacter', ctaStyle: 'pink',
  },
  {
    name: 'Enterprise', price: '1389€', sub: 'Solution sur-mesure', color: '#06b6d4', featured: false,
    features: ['Solution personnalisée', 'SLA garanti', 'Rapport 24/7', 'Support 24/7', 'IA personnalisée', 'Consulting stratégique'],
    cta: 'Contacter Sales', ctaStyle: 'teal',
  },
]

function PlanCard({ plan, big }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg,#a855f7,#7c3aed)', color: '#fff' },
    pink:    { background: 'linear-gradient(135deg,#ec4899,#db2777)', color: '#fff' },
    teal:    { background: 'linear-gradient(135deg,#06b6d4,#0891b2)', color: '#fff' },
    outline: { background: '#fff', color: '#4a5568', border: '1.5px solid #e2e8f0' },
  }
  const s = styles[plan.ctaStyle] || styles.outline
  return (
    <div style={{ background: '#fff', border: plan.featured ? `2px solid ${plan.color}` : '1.5px solid #f0f0f0', borderRadius: '20px', padding: '1.5rem', position: 'relative', boxShadow: plan.featured ? `0 8px 30px ${plan.color}25` : '0 2px 10px rgba(0,0,0,0.04)', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${plan.color}30` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = plan.featured ? `0 8px 30px ${plan.color}25` : '0 2px 10px rgba(0,0,0,0.04)' }}>
      {plan.featured && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`, color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.8rem', borderRadius: '100px' }}>Populaire</div>}
      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a202c', marginBottom: '0.25rem' }}>{plan.name}</div>
      <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.75rem' }}>{plan.sub}</div>
      <div style={{ fontWeight: 900, fontSize: '1.8rem', color: plan.color, marginBottom: '1rem' }}>
        {plan.price}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a0aec0' }}>/mois</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#4a5568' }}>
            <span style={{ color: plan.color, fontSize: '0.8rem' }}>✓</span>{f}
          </div>
        ))}
      </div>
      <Link href="/onboarding" style={{ display: 'block', padding: '0.7rem', borderRadius: '10px', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', ...s, cursor: 'pointer' }}>
        {plan.cta}
      </Link>
    </div>
  )
}

export default function TarifsPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const faqs = [
    { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.' },
    { q: 'Y a-t-il une période d\'essai gratuite ?', a: 'Oui, tous nos plans payants incluent 14 jours d\'essai gratuit. Aucune carte bancaire requise.' },
    { q: 'Comment fonctionne la facturation ?', a: 'La facturation est mensuelle ou annuelle (avec 20% de réduction). Vous recevez une facture par email chaque mois.' },
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#fce7f3 0%,#ede9fe 50%,#e0f2fe 100%)', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '1rem' }}>TARIFS</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          Tarifs <span style={{ color: '#ec4899' }}>transparents</span>
        </h1>
        <p style={{ color: '#718096', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Choisissez la formule qui correspond à vos besoins. Commencez gratuitement et évoluez selon votre croissance.
        </p>
      </section>

      {/* Plans */}
      <section style={{ padding: '5rem 6rem', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>
            Tarifs <span style={{ color: '#a855f7' }}>adaptés</span> à vos besoins
          </h2>
          <p style={{ color: '#718096' }}>Que vous soyez influenceur ou entreprise, trouvez le plan qui vous correspond</p>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ textAlign: 'center', fontWeight: 800, color: '#1a202c', marginBottom: '2rem', fontSize: '1.2rem' }}>Pour les Influenceurs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {INFLUENCEUR_PLANS.map(p => <PlanCard key={p.name} plan={p} />)}
          </div>
        </div>

        <div>
          <h3 style={{ textAlign: 'center', fontWeight: 800, color: '#1a202c', marginBottom: '2rem', fontSize: '1.2rem' }}>Pour les Entreprises</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {ENTERPRISE_PLANS.map(p => <PlanCard key={p.name} plan={p} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fafafa', padding: '4rem 6rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Questions fréquentes ?</h2>
        <p style={{ color: '#718096', marginBottom: '2rem' }}>Nous répondons aux questions les plus posées. Pour tout le reste, contactez-nous.</p>
        <div style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', marginBottom: '0.75rem', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, color: '#1a202c', textAlign: 'left' }}>
                {faq.q}<span style={{ color: '#a855f7', transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq === i && <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: '#718096', lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
        <Link href="/contact" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem' }}>
          Contacter notre équipe
        </Link>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#6b21a8,#a855f7,#3b82f6)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Prêt à booster vos campagnes ?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Rejoignez la révolution du marketing d'influence powered by IA</p>
        <Link href="/onboarding" style={{ display: 'inline-block', background: '#fff', color: '#a855f7', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.95rem' }}>
          Démarrer maintenant →
        </Link>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
          <span>✓ Gratuit</span><span>✓ Sans CB</span><span>✓ 99.9% uptime</span>
        </div>
      </section>
    </div>
  )
}