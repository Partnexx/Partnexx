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
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#nl4)"/>
          <defs><linearGradient id="nl4" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
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

const PROCESS_STEPS = [
  { step: 'Étape 1', title: 'Création de campagne', desc: 'Définissez vos objectifs, budget et critères. Notre IA analyse votre brief et prépare le terrain.', tags: ['Configuration rapide', 'Templates prêts à l\'emploi'] },
  { step: 'Étape 2', title: 'Traitement des candidatures', desc: 'Recevez et évaluez les candidatures des influenceurs. Score IA automatique pour chaque profil.', tags: ['Score automatique', 'Comparaison intelligente'] },
  { step: 'Étape 3', title: 'Contrats & Accords', desc: 'Signez électroniquement et gérez toutes les conditions contractuelles de collaboration.', tags: ['Signature électronique'] },
  { step: 'Étape 4', title: 'Activation des paiements', desc: 'Système d\'escrow sécurisé avec libération automatique à la validation des livrables.', tags: ['Paiement sécurisé', 'Libération automatique'] },
  { step: 'Étape 5', title: 'Suivi des performances', desc: 'Analytics en temps réel. Suivez l\'engagement, la portée et le ROI de chaque collaboration.', tags: ['Dashboard live', 'Alertes personnalisées'] },
  { step: 'Étape 6', title: 'Clôture & Rapport', desc: 'Rapport détaillé automatique. Évaluations mutuelles et archivage pour les futures collaborations.', tags: ['Rapport PDF', 'Évaluations croisées'] },
]

const FEATURES_SECTIONS = [
  {
    tag: 'DASHBOARD',
    title: 'Dashboard',
    highlight: 'intelligent',
    desc: 'Une interface complète pour gérer vos collaborations, analyser vos performances et découvrir de nouvelles opportunités grâce à l\'IA.',
    features: [
      { icon: '🤖', title: 'Analytics IA avancés', desc: 'Performances réelles • Statistiques détaillées • Insights audience. Analysez vos gains, le taux d\'engagement sur vos plateformes. Analyses données par l\'IA sur les plateformes Instagram, TikTok, YouTube.' },
      { icon: '📊', title: 'Évolution de l\'Engagement', desc: 'Analysez l\'évolution de vos questions d\'audience. Suivez vos statistiques d\'engagement sur votre parcours créateur.' },
    ],
    cta: 'Accéder au Dashboard',
  },
  {
    tag: 'COLLABORATIONS',
    title: 'Gestion des collaborations',
    desc: 'Livrables • Performances • Finances • Messagerie intégrée avec suivi de progression en temps réel.',
    features: [
      { icon: '📋', title: 'Suivi des livrables', desc: 'Gérez vos livrables (Reels, Stories, Posts et Plus avec suivi de la progression en direct).' },
      { icon: '📈', title: 'Performance & Finance', desc: 'Analysez les gains 💵 ROI avec suivi en temps réel du CRM avec engagement et impact financier.' },
    ],
    cta: 'Gérer mes collaborations',
  },
  {
    tag: 'OPPORTUNITÉS',
    title: 'Opportunités IA',
    desc: 'Campagnes ciblées • Collaborations Régulières • Matching Intelligent basé sur votre profil et préférences.',
    features: [
      { icon: '🎯', title: 'Campagnes Pour Vous', desc: 'Campagnes choisies pour vous selon vos critères • Matching • Niche, budget, audience et performances. Parmi les créateurs sélectionnés pour vous.' },
      { icon: '🤝', title: 'Opportunités Premium', desc: 'Accédez aux campagnes d\'affiliation et d\'autres campagnes exclusives. Sélectionnez les marques qui correspondent à vos valeurs et audience.' },
    ],
    cta: 'Découvrir les offres',
  },
]

const PLATFORM_FEATURES = [
  {
    title: 'Gestion de campagnes complète',
    desc: 'Gérez vos campagnes, gérez vos candidatures, contenus et partenaires, ayez une vue complète et contrôlez les résultats ROI.',
    features: ['Création & Recrutement', 'Contrats, Paiements & Tarifs'],
    cta: 'Tester la plateforme',
  },
  {
    title: 'Matching intelligent de partenaires',
    desc: 'Trouvez l\'influenceur parfait grâce à notre algorithme de matching basé sur l\'IA.',
    features: ['Algorithme intelligent', 'Matching précis'],
    cta: 'Tester la plateforme',
  },
  {
    title: 'Analytics et ROI avancés',
    desc: 'Mesurez l\'impact réel de vos campagnes d\'influence, analysez vos collaborations, optimisez l\'efficacité et trouvez les influenceurs qui ont le plus d\'impact et de valeur.',
    features: ['Revenus détaillés', 'Insights IA & Prédictions'],
    cta: 'Explorer les analytics',
  },
]

const ADVANCED = [
  { icon: '🤖', title: 'IA Prédictive', desc: 'Prédisez le succès de vos campagnes avant le lancement' },
  { icon: '✨', title: 'Insights Temps Réel', desc: 'Analysez les performances en temps réel instantanément' },
  { icon: '📊', title: 'ROI Tracking', desc: 'Suivez votre retour sur investissement campagne après campagne' },
  { icon: '🚀', title: 'Analytics Growth', desc: 'Maîtrisez vos données pour une croissance accélérée' },
]

export default function PlateformePage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(236,72,153,0.12); border-color: rgba(236,72,153,0.25) !important; }
        .feat-card { transition: all .25s; }
        .step-hover:hover { transform: translateX(4px); }
        .step-hover { transition: transform .2s; }
      `}</style>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#fce7f3 0%,#ede9fe 50%,#e0f2fe 100%)', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '1rem' }}>PLATEFORME</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          La <span style={{ color: '#ec4899' }}>plateforme</span> qui révolutionne
        </h1>
        <p style={{ color: '#718096', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
          Découvrez comment Partnexx transforme la collaboration entre marques et influenceurs grâce à l'intelligence artificielle et des outils intuitifs.
        </p>
      </section>

      {/* Pourquoi Partnexx */}
      <section style={{ padding: '5rem 6rem', background: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>
          Pourquoi choisir <span style={{ color: '#ec4899' }}>Partnexx</span> ?
        </h2>
        <p style={{ color: '#718096', marginBottom: '3rem' }}>Découvrez les avantages concrets qui font de Partnexx la solution de référence</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
          {[
            { icon: '⚡', color: '#ec4899', title: 'Gagner du temps', desc: 'Automatisez vos processus de collaboration et de sélection d\'influenceurs en quelques clics.' },
            { icon: '🚀', color: '#a855f7', title: 'Booster vos résultats', desc: 'Campagnes optimisées par l\'IA pour un maximum de ROI. Analysez et ajustez en temps réel.' },
            { icon: '🎯', color: '#06b6d4', title: 'Un seul outil', desc: 'Gérez tout depuis une plateforme : recrutement, contrats, paiements et analytics intégrés.' },
          ].map(f => (
            <div key={f.title} className="feat-card" style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a202c', marginBottom: '0.5rem' }}>{f.title}</div>
              <p style={{ fontSize: '0.83rem', color: '#718096', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Processus complet */}
      <section style={{ padding: '5rem 6rem', background: '#fafafa', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>
          Le <span style={{ color: '#ec4899' }}>processus</span> complet
        </h2>
        <p style={{ color: '#718096', marginBottom: '2rem' }}>De la création de campagne à la clôture, un workflow simplifié et efficace</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
          <Link href="/onboarding" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.75rem 1.75rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.875rem' }}>Marque Début</Link>
          <Link href="/onboarding" style={{ background: '#fff', color: '#4a5568', textDecoration: 'none', padding: '0.75rem 1.75rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.875rem', border: '1.5px solid #e2e8f0' }}>Début Créateurs</Link>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '28px', top: '20px', bottom: '20px', width: '2px', background: 'linear-gradient(180deg,#ec4899,#a855f7,#06b6d4)', borderRadius: '2px' }} />
          {PROCESS_STEPS.map((s, i) => (
            <div key={i} className="step-hover" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg,#ec4899,#a855f7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(236,72,153,0.3)' }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', marginBottom: '0.25rem' }}>{s.step}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a202c', marginBottom: '0.3rem' }}>{s.title}</div>
                <p style={{ fontSize: '0.82rem', color: '#718096', lineHeight: 1.6, marginBottom: '0.5rem' }}>{s.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{ background: '#ede9fe', color: '#7c3aed', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features sections */}
      {FEATURES_SECTIONS.map((sec, si) => (
        <section key={si} style={{ padding: '5rem 6rem', background: si % 2 === 0 ? '#fff' : '#fafafa' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.5rem' }}>{sec.tag}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>{sec.title} <span style={{ color: '#ec4899' }}>{sec.highlight}</span></h2>
          <p style={{ color: '#718096', marginBottom: '2rem', maxWidth: '600px', fontSize: '0.875rem' }}>{sec.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div>
              {sec.features.map(f => (
                <div key={f.title} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c' }}>{f.title}</div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#718096', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
              <Link href="/onboarding" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.82rem' }}>
                {sec.cta} →
              </Link>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe)', borderRadius: '16px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              {['📊','🤝','🎯'][si]}
            </div>
          </div>
        </section>
      ))}

      {/* Plateforme gestion complète */}
      <section style={{ padding: '5rem 6rem', background: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.75rem' }}>FONCTIONNALITÉS</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>
          Plateforme de gestion <span style={{ color: '#06b6d4' }}>complète</span>
        </h2>
        <p style={{ color: '#718096', marginBottom: '3rem' }}>Une suite d'outils puissants pour créer, gérer et analyser vos campagnes d'influence avec des analytics avancés et l'intelligence artificielle.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {PLATFORM_FEATURES.map((pf, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '3rem', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a202c', marginBottom: '0.5rem' }}>{pf.title}</h3>
                <p style={{ color: '#718096', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.875rem' }}>{pf.desc}</p>
                {pf.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#4a5568', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#ec4899' }}>✓</span>{f}
                  </div>
                ))}
                <Link href="/onboarding" style={{ display: 'inline-block', marginTop: '1rem', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.65rem 1.4rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.82rem' }}>
                  {pf.cta} →
                </Link>
              </div>
              <div style={{ order: i % 2 === 0 ? 2 : 1, background: i === 0 ? 'linear-gradient(135deg,#fce7f3,#ede9fe)' : i === 1 ? 'linear-gradient(135deg,#ede9fe,#e0f2fe)' : 'linear-gradient(135deg,#e0f2fe,#dcfce7)', borderRadius: '16px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                {['📋','🔗','📈'][i]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités avancées */}
      <section style={{ padding: '4rem 6rem', background: '#fafafa', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Fonctionnalités avancées</h2>
        <p style={{ color: '#718096', marginBottom: '2.5rem' }}>Des outils puissants pour maîtriser parfaitement vos performances d'influence.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
          {ADVANCED.map(a => (
            <div key={a.title} className="feat-card" style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{a.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c', marginBottom: '0.4rem' }}>{a.title}</div>
              <p style={{ fontSize: '0.78rem', color: '#718096', lineHeight: 1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Mini CTA */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '20px', padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a202c', marginBottom: '0.5rem' }}>Prêt à optimiser vos collaborations ?</h3>
          <p style={{ color: '#718096', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Plongez dans nos outils d'influence qui vous aident à affiner votre profil pour performer efficacement</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/onboarding" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', textDecoration: 'none', padding: '0.7rem 1.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.82rem' }}>Démarrer gratuitement</Link>
            <Link href="/contact" style={{ background: '#fff', color: '#4a5568', textDecoration: 'none', padding: '0.7rem 1.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.82rem', border: '1.5px solid #e2e8f0' }}>Nous parler</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#6b21a8,#a855f7,#3b82f6)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Prêt à révolutionner vos campagnes ?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Plongez dans les outils de Partnexx qui vous offrent une vue complète de vos campagnes stratégiques d'influence</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/onboarding" style={{ background: '#fff', color: '#a855f7', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.95rem' }}>Démarrer gratuitement</Link>
          <Link href="/contact" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.3)' }}>Nous contacter</Link>
        </div>
      </section>
    </div>
  )
}