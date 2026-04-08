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
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 3rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f0f0f0' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#nt)"/>
          <defs><linearGradient id="nt" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
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

const TEMOIGNAGES = [
  { name: 'Marie Dupont',       role: 'Directrice Marketing, FashionBrand',    stars: 5, tag: 'Marque',     text: "Partnexx a complètement transformé notre approche du marketing d'influence. En 3 mois, notre ROI a augmenté de 340% et nous collaborons avec des créateurs parfaitement alignés avec notre marque." },
  { name: 'Thomas Martin',      role: 'CEO, TechStartup',                       stars: 5, tag: 'Entreprise', text: "La plateforme est intuitive et l'IA de matching est bluffante. Elle nous a trouvé des influenceurs que nous n'aurions jamais découverts seuls. Taux d'engagement de 8%, bien au-delà de nos attentes." },
  { name: 'Sophie Chen',        role: 'Influenceuse Lifestyle, 450K abonnés',   stars: 5, tag: 'Créateur',   text: "La qualité des partenariats proposés est exceptionnelle. Les collaborations correspondent toujours à mes valeurs et à mon audience. Le paiement est rapide et sécurisé. Je ne pourrais plus m'en passer." },
  { name: 'Camille Rodriguez',  role: 'Responsable Influence, L\'Oréal France', stars: 5, tag: 'Entreprise', text: "Nous avons réduit notre temps de gestion des campagnes de 70%. Les analytics en temps réel nous permettent d'ajuster nos stratégies instantanément." },
  { name: 'Lucas Dubois',       role: 'Créateur Tech, 320K abonnés',            stars: 5, tag: 'Créateur',   text: "Interface intuitive, fonctionnalités extraordinaires. Les analytics détaillées me permettent de comprendre mon audience et de collaborer avec des marques stratégiques." },
  { name: 'Emma Williams',      role: 'Head of Partnerships, Beauty Store',     stars: 5, tag: 'Marque',     text: "La qualité des relations est incomparable. Partnexx nous a mis en contact avec des créateurs authentiques qui partagent vraiment nos valeurs. Les résultats parlent d'eux-mêmes." },
]

export default function TemoignagesPage() {
  const [activeFilter, setActiveFilter] = useState('Tous')
  const filters = ['Tous', 'Marque', 'Créateur', 'Entreprise']
  const filtered = activeFilter === 'Tous' ? TEMOIGNAGES : TEMOIGNAGES.filter(t => t.tag === activeFilter)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe,#e0f2fe)', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          Ils nous font <span style={{ color: '#ec4899' }}>confiance</span>
        </h1>
        <p style={{ color: '#718096', maxWidth: '500px', margin: '0 auto' }}>
          Découvrez comment Partnexx a transformé les collaborations de nos clients influenceurs et marques partenaires
        </p>
      </section>

      {/* Filtres + Cards */}
      <section style={{ padding: '5rem 6rem', background: '#fff' }}>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '0.5rem 1.2rem', borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'inherit', background: activeFilter === f ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#f0f0f0', color: activeFilter === f ? '#fff' : '#718096', transition: 'all .2s' }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {filtered.map((t, i) => (
            <div key={i} style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '1.5rem', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(168,85,247,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.75rem' }}>
                {Array(t.stars).fill(0).map((_, j) => <span key={j} style={{ fontSize: '0.85rem' }}>⭐</span>)}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: 1.7, marginBottom: '1rem', fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>{t.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a202c' }}>{t.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#718096' }}>{t.role}</div>
                </div>
                <span style={{ fontSize: '0.7rem', background: '#ede9fe', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 700 }}>{t.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#6b21a8,#a855f7,#3b82f6)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Rejoignez nos clients satisfaits</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Commencez gratuitement et rejoignez plus de 10 000 professionnels</p>
        <Link href="/onboarding" style={{ display: 'inline-block', background: '#fff', color: '#a855f7', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.95rem' }}>
          Démarrer maintenant →
        </Link>
      </section>
    </div>
  )
}