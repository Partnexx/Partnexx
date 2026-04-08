'use client'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/plateforme', label: 'Plateforme' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

function Navbar() {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 3rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f0f0f0' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#nap)"/>
          <defs><linearGradient id="nap" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
        </svg>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a202c' }}>Partnexx</span>
      </Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {NAV_LINKS.map(l => <Link key={l.href} href={l.href} style={{ color: '#718096', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{l.label}</Link>)}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link href="/login" style={{ color: '#4a5568', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Se connecter</Link>
        <Link href="/onboarding" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.55rem 1.2rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700 }}>Essai gratuit →</Link>
      </div>
    </nav>
  )
}

const TEAM = [
  { name: 'Marie Dubois',   role: 'CEO & Co-Fondatrice',  emoji: '👩‍💼', bio: "Ancienne directrice marketing chez L'Oréal. Passionnée par les nouvelles technologies et l'influence marketing depuis 2010." },
  { name: 'Thomas Martin',  role: 'CTO & Co-Fondateur',   emoji: '👨‍💻', bio: "Ex-ingénieur senior chez Google. Spécialiste de l'intelligence artificielle et du Machine Learning." },
  { name: 'Sophie Laurent', role: 'Head of Product',       emoji: '👩‍🎨', bio: "Product manager expérimentée. Ancienne responsable produit chez Salesforce, spécialiste UX." },
]

const VALEURS = [
  { icon: '❤️', title: 'Authenticité',  desc: "Nous croyons aux partenariats authentiques qui créent de vraies connexions entre marques et créateurs." },
  { icon: '📊', title: 'Performance',   desc: "Nous mesurons chaque collaboration pour garantir les meilleurs résultats possibles à nos clients." },
  { icon: '🤖', title: 'Innovation',    desc: "Nous innovons constamment pour vous offrir les meilleures technologies de marketing d'influence." },
  { icon: '🌐', title: 'Communauté',   desc: "Nous construisons une communauté forte qui développe et partage les meilleures pratiques de l'industrie." },
]

export default function AProposPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe,#e0f2fe)', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '1rem' }}>À PROPOS</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          Notre <span style={{ color: '#ec4899' }}>mission</span>
        </h1>
        <p style={{ color: '#718096', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
          Révolutionner le marketing d'influence en créant des connexions authentiques et des performances remarquables.
        </p>
      </section>

      {/* Mission + Stats */}
      <section style={{ padding: '5rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.75rem' }}>NOTRE HISTOIRE</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '1rem', lineHeight: 1.3 }}>Créer l'avenir du marketing d'influence</h2>
            <p style={{ color: '#718096', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>Chez Partnexx, nous croyons que l'intelligence artificielle peut transformer le marketing d'influence en créant des connexions authentiques entre marques et influenceurs.</p>
            <p style={{ color: '#718096', lineHeight: 1.8, fontSize: '0.9rem' }}>Notre mission est de rendre le marketing d'influence accessible, mesurable et performant pour toutes les entreprises, quelle que soit leur taille.</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg,#ede9fe,#fce7f3)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', marginBottom: '1.5rem' }}>2023</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[['10K+','Influenceurs'],['500+','Marques'],['2M€','Revenus créateurs'],['98%','Satisfaction']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#a855f7' }}>{val}</div>
                  <div style={{ fontSize: '0.78rem', color: '#718096', marginTop: '0.25rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.75rem' }}>VALEURS</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Ce qui nous guide</h2>
          <p style={{ color: '#718096', marginBottom: '2.5rem' }}>Nos valeurs fondamentales définissent notre approche et notre engagement envers notre communauté</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
            {VALEURS.map(v => (
              <div key={v.title} style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a202c', marginBottom: '0.5rem' }}>{v.title}</div>
                <p style={{ fontSize: '0.78rem', color: '#718096', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Équipe */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.75rem' }}>ÉQUIPE</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Les visionnaires derrière Partnexx</h2>
          <p style={{ color: '#718096', marginBottom: '2.5rem' }}>Une équipe passionnée et expérimentée, décidée à révolutionner le monde du marketing d'influence</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {TEAM.map(m => (
              <div key={m.name} style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '20px', padding: '2rem', textAlign: 'center', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>{m.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a202c', marginBottom: '0.25rem' }}>{m.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 600, marginBottom: '0.75rem' }}>{m.role}</div>
                <p style={{ fontSize: '0.78rem', color: '#718096', lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rejoindre */}
        <div style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg,#ede9fe,#fce7f3)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Rejoignez l'aventure Partnexx</h2>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>Nous recrutons des talents passionnés pour changer l'avenir du marketing d'influence</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/onboarding" style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem' }}>Nous rejoindre</Link>
            <Link href="/contact" style={{ background: '#fff', color: '#4a5568', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', border: '1.5px solid #e2e8f0' }}>Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#6b21a8,#a855f7,#3b82f6)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Prêt à rejoindre l'aventure ?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Rejoignez la révolution du marketing d'influence powered by IA</p>
        <Link href="/onboarding" style={{ display: 'inline-block', background: '#fff', color: '#a855f7', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.95rem' }}>Démarrer maintenant →</Link>
      </section>
    </div>
  )
}