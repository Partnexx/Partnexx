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
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#nc)"/>
          <defs><linearGradient id="nc" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#06b6d4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
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

const FAQS = [
  { q: "Comment fonctionne l'algorithme de matching ?", a: "Notre IA analyse plus de 50 critères : audience, engagement, niche, valeurs et historique de collaboration pour vous proposer les influenceurs les plus pertinents." },
  { q: "Quels sont les frais de la plateforme ?",       a: "Nos plans commencent à 0€ pour les influenceurs et 59€/mois pour les marques. Consultez notre page Tarifs pour une vue complète des offres." },
  { q: "Combien de temps pour trouver des créateurs ?", a: "Notre algorithme vous propose une liste de créateurs qualifiés en moins de 30 secondes. Les premières collaborations démarrent généralement sous 72h." },
  { q: "La plateforme est-elle sécurisée ?",            a: "Toutes les données sont chiffrées (SSL/TLS), conformes au RGPD. Les paiements sont sécurisés par notre système d'escrow intégré." },
]

export default function ContactPage() {
  const [form, setForm]     = useState({ prenom: '', nom: '', email: '', entreprise: '', sujet: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [openFaq, setOpen]  = useState(null)

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = () => {
    if (!form.prenom || !form.email || !form.message) return alert('Veuillez remplir les champs obligatoires.')
    setSent(true)
    setForm({ prenom: '', nom: '', email: '', entreprise: '', sujet: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1a202c', background: '#fff' }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#fce7f3,#ede9fe,#e0f2fe)', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '1rem' }}>CONTACT</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.75rem' }}>
          Parlons de votre <span style={{ color: '#ec4899' }}>projet</span>
        </h1>
        <p style={{ color: '#718096', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
          Notre équipe est là pour répondre à vos questions et vous accompagner dans votre stratégie de marketing d'influence.
        </p>
      </section>

      {/* Formulaire + Infos */}
      <section style={{ padding: '5rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

          {/* Formulaire */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Envoyez-nous un message</h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Remplissez le formulaire et nous vous répondrons dans les plus brefs délais</p>

            {sent && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.75rem 1rem', color: '#15803d', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>
                ✅ Message envoyé ! Nous vous répondons sous 2h.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Prénom *</label>
                <input value={form.prenom} onChange={set('prenom')} placeholder="Jean" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Nom</label>
                <input value={form.nom} onChange={set('nom')} placeholder="Dupont" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Email *</label>
              <input value={form.email} onChange={set('email')} placeholder="jean@entreprise.com" type="email" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Entreprise</label>
              <input value={form.entreprise} onChange={set('entreprise')} placeholder="Nom de votre entreprise" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Sujet</label>
              <select value={form.sujet} onChange={set('sujet')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Sélectionner un sujet</option>
                <option>Démonstration</option>
                <option>Support technique</option>
                <option>Partenariat</option>
                <option>Facturation</option>
                <option>Autre</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }}>Message *</label>
              <textarea value={form.message} onChange={set('message')} rows={5} placeholder="Comment pouvons-nous vous aider ?" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button onClick={handleSubmit}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(236,72,153,0.4)', transition: 'transform .2s' }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'none'}>
              Envoyer le message →
            </button>
          </div>

          {/* Infos */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Retrouvez-nous</h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Plusieurs façons de prendre contact selon vos préférences</p>

            {[
              { icon: '✉️', val: 'contact@partnexx.com',            sub: 'Réponse sous 2h' },
              { icon: '📞', val: '+33 1 23 45 67 89',               sub: 'Lun-Ven, 9h-18h' },
              { icon: '📍', val: '46 Rue de la Paix, 75002 Paris',  sub: 'France' },
            ].map(info => (
              <div key={info.val} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #f0f0f0', borderRadius: '12px', marginBottom: '0.75rem', background: '#fafafa' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{info.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a202c' }}>{info.val}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>{info.sub}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c', marginBottom: '0.75rem' }}>Actions rapides</div>
              {[
                { icon: '💬', label: 'Support Technique',      sub: 'Démarrer un chat en direct' },
                { icon: '📅', label: 'Démonstration',          sub: 'Réserver un créneau' },
                { icon: '🤝', label: 'Partenariat commercial', sub: 'Discuter de nos offres' },
              ].map(action => (
                <div key={action.label} onClick={() => alert(`${action.label}`)} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid #f0f0f0', borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', background: '#fff', transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <span style={{ fontSize: '1rem' }}>{action.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c' }}>{action.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#718096' }}>{action.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fafafa', padding: '4rem 6rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem' }}>Questions fréquentes</h2>
        <p style={{ color: '#718096', marginBottom: '2.5rem' }}>Trouvez rapidement des réponses aux questions les plus courantes</p>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', marginBottom: '0.75rem', overflow: 'hidden' }}>
              <button onClick={() => setOpen(openFaq === i ? null : i)} style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, color: '#1a202c', textAlign: 'left' }}>
                {faq.q}
                <span style={{ color: '#a855f7', fontSize: '1.2rem', flexShrink: 0, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq === i && <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: '#718096', lineHeight: 1.7, textAlign: 'left' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#6b21a8,#a855f7,#3b82f6)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Prêt à booster vos campagnes ?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Rejoignez la révolution du marketing d'influence powered by IA</p>
        <Link href="/onboarding" style={{ display: 'inline-block', background: '#fff', color: '#a855f7', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.95rem' }}>
          Démarrer maintenant →
        </Link>
      </section>
    </div>
  )
}