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
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 3rem', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#nl)"/>
          <defs><linearGradient id="nl" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
        </svg>
        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>Partnexx</span>
      </Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color .2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link href="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Se connecter</Link>
        <Link href="/onboarding" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.3rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 15px rgba(236,72,153,0.4)' }}>
          Essai gratuit →
        </Link>
      </div>
    </nav>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  return (
    <footer style={{ background: '#0f0a1a', color: '#fff', padding: '4rem 6rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#fl)"/>
              <defs><linearGradient id="fl" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>Partnexx</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '280px' }}>
            La plateforme de mise en relation qui révolutionne les partenariats entre influenceurs, Créateurs de contenus, Collaborations et marques grâce à l'intelligence artificielle.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
            <span>📍 46 Rue de la Paix, 75002 Paris</span>
            <span>📞 +33 1 23 45 67 89</span>
            <span>✉️ contact@partnexx.com</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {['📘','🐦','💼','📸'].map((icon, i) => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>{icon}</div>
            ))}
          </div>
        </div>
        {[
          { title: 'Produit', links: ['Fonctionnalités','Tarifs','Intégrations','API','Sécurité','Mises à jour'] },
          { title: 'Ressources', links: ['Documentation','Guide d\'utilisation','Blog','Cas d\'usage','API Docs','Webinaires'] },
          { title: 'Entreprise', links: ['À propos','Careers','Presse','Partenariats','Certifications'] },
          { title: 'Support', links: ['Centre d\'aide','Contact','Status Page','Bugs','Communauté','Formations','Partenaires'] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>{col.title}</div>
            {col.links.map(link => (
              <div key={link} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                {link}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Rester informé</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Recevez nos dernières actualités et conseils sur les partenariats</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email" style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.82rem', outline: 'none', width: '220px' }} />
          <button onClick={() => { if(email) { alert('Merci pour votre inscription !'); setEmail('') } }} style={{ padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>S'abonner</button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span>© 2024 Partnexx. Tous droits réservés.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/confidentialite" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Politique de confidentialité</Link>
          <Link href="/conditions" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Conditions d'utilisation</Link>
          <Link href="/cookies" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Cookies</Link>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .btn-hover { transition: transform .2s, box-shadow .2s !important; }
        .btn-hover:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.3) !important; }
        .feature-card { transition: all .25s; }
      `}</style>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#6b21a8 0%,#a855f7 25%,#ec4899 55%,#3b82f6 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '25%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        {/* Logo icon */}
        <div style={{ marginBottom: '2rem' }}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#hero-g)"/>
            <defs><linearGradient id="hero-g" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#0891b2"/></linearGradient></defs>
          </svg>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '0.5rem', maxWidth: '900px' }}>
          Partnexx — L'IA qui transforme votre
        </h1>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.5rem' }}>
          <span style={{ color: '#06b6d4' }}>marketing</span>{' '}
          <span style={{ color: '#f9a8d4' }}>d'influence</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Centralisez vos campagnes, trouvez les bons influenceurs et boostez vos résultats en un seul endroit.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <Link href="/onboarding" className="btn-hover" style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)', color: '#fff', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '100px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 20px rgba(6,182,212,0.5)' }}>
            Rejoindre la liste d'attente →
          </Link>
          <Link href="/plateforme" className="btn-hover" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '100px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            ▶ Découvrir la démo
          </Link>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>
          ✨ Déjà plus de <span style={{ color: '#06b6d4', fontWeight: 700 }}>5 600 influenceurs</span> inscrits en bêta privée
        </p>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#fff', padding: '4rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { val: '10K+', label: 'Influenceurs actifs', color: '#a855f7' },
            { val: '500+', label: 'Marques partenaires', color: '#ec4899' },
            { val: '2M€', label: 'Revenus générés', color: '#06b6d4' },
            { val: '98%', label: 'Satisfaction client', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: s.color, marginBottom: '0.25rem' }}>{s.val}</div>
              <div style={{ fontSize: '0.9rem', color: '#718096' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POURQUOI PARTNEXX ── */}
      <section style={{ background: '#fafafa', padding: '5rem 6rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '1rem' }}>POURQUOI PARTNEXX</div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          La plateforme qui <span style={{ color: '#ec4899' }}>révolutionne</span> vos partenariats
        </h2>
        <p style={{ color: '#718096', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
          Découvrez comment Partnexx transforme la collaboration entre marques et influenceurs grâce à l'intelligence artificielle et des outils intuitifs.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
          {[
            { icon: '⚡', color: '#ec4899', title: 'Gagner du temps', desc: 'Automatisez vos processus de collaboration et consacrez-vous à ce qui compte vraiment : créer du contenu exceptionnel.' },
            { icon: '🚀', color: '#a855f7', title: 'Booster vos résultats', desc: 'Campaigns optimisées par l\'IA pour 4X plus de ROI. Analysez en temps réel et ajustez vos stratégies.' },
            { icon: '🎯', color: '#06b6d4', title: 'Un seul outil', desc: 'Gérez tout depuis une seule plateforme : recrutement, contrats, paiements, analytics et reporting.' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a202c', marginBottom: '0.5rem' }}>{f.title}</div>
              <p style={{ fontSize: '0.875rem', color: '#718096', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: '#fff', padding: '5rem 6rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          Tout ce dont vous avez besoin
        </h2>
        <p style={{ color: '#718096', marginBottom: '3rem' }}>Une plateforme complète pour gérer vos campagnes d'influence de A à Z</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {[
            { icon: '🤖', title: 'IA & Matching', desc: 'Algorithme intelligent pour trouver les influenceurs parfaits selon vos critères' },
            { icon: '📊', title: 'Analytics avancés', desc: 'Tableaux de bord en temps réel avec insights prédictifs et ROI automatique' },
            { icon: '📝', title: 'Contrats & Paiements', desc: 'Signature électronique, escrow sécurisé et paiements automatiques' },
            { icon: '💬', title: 'Messagerie intégrée', desc: 'Communiquez directement avec vos partenaires depuis la plateforme' },
            { icon: '🎯', title: 'Gestion de campagnes', desc: 'Planifiez, suivez et optimisez toutes vos campagnes en un seul endroit' },
            { icon: '🏆', title: 'Partnexx Score', desc: 'Système de réputation unique pour évaluer et récompenser les meilleurs créateurs' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '0.4rem' }}>{f.title}</div>
              <p style={{ fontSize: '0.83rem', color: '#718096', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: 'linear-gradient(135deg,#6b21a8,#a855f7,#ec4899)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>
          Prêt à révolutionner votre marketing d'influence ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '2rem' }}>
          Rejoignez la révolution du marketing d'influence powered by IA
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Link href="/onboarding" className="btn-hover" style={{ background: '#fff', color: '#a855f7', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.95rem' }}>
            Démarrer maintenant →
          </Link>
          <Link href="/contact" className="btn-hover" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.3)' }}>
            Nous contacter
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
          <span>✓ Gratuit</span><span>✓ Sans CB</span><span>✓ 99.9% uptime</span>
        </div>
      </section>

      <Footer />
    </div>
  )
}