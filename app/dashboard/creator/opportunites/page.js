'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Opportunites() {
  const router = useRouter()
  const [mainTab, setMainTab] = useState('pourvous')
  const [publicTab, setPublicTab] = useState('toutes')
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('Toutes catégories')

  const campagnesPourVous = [
    {
      initials: 'PP', color: '#a855f7', name: 'Campagne Exclusive Luxe', brand: 'Prestige Parfums', verified: true,
      desc: 'Campagne exclusive pour notre nouvelle ligne de parfums de luxe. Vous avez été sélectionné(e) en fonction de votre profil et de votre audience.',
      budget: '5 000 - 8 000 €', duree: '1 mois', lieu: 'Paris, France', candidats: '12 candidats',
      plateformes: ['Instagram'], tags: ['Luxe', 'Beauté', 'Exclusif'], compatibilite: 96,
    },
    {
      initials: 'GH', color: '#22c55e', name: 'Ambassadeur Tech - Gaming', brand: 'GamersHub', verified: true,
      desc: 'Nous vous avons identifié comme ambassadeur potentiel pour notre marque gaming. Partenariat long terme avec avantages exclusifs.',
      budget: '4 000 - 7 000 €', duree: '6 mois', lieu: 'À distance', candidats: '8 candidats',
      plateformes: ['YouTube', 'Instagram', 'Twitter'], tags: ['Gaming', 'Tech', 'Long terme'], compatibilite: 92,
    },
    {
      initials: 'LL', color: '#3b82f6', name: 'Campagne Lifestyle Premium', brand: 'LifeLux', verified: true,
      desc: 'Votre profil correspond parfaitement à notre recherche d\'influenceur lifestyle premium. Campagne multi-plateforme avec voyages inclus.',
      budget: '3 500 - 6 000 €', duree: '2 mois', lieu: 'Multiple', candidats: '15 candidats',
      plateformes: ['Instagram', 'YouTube'], tags: ['Lifestyle', 'Premium', 'Voyage'], compatibilite: 89,
    },
  ]

  const campagnesAffiliation = [
    {
      initials: 'FL', color: '#22c55e', name: 'Programme Affiliation - Fitness', brand: 'FitLife Pro', verified: true,
      desc: 'Rejoignez notre programme d\'affiliation et gagnez 15% de commission sur chaque vente générée via votre code promo unique.',
      commission: '15% commission', duree: 'Programme continu', lieu: 'En ligne', candidats: '156 candidats',
      plateformes: ['Instagram', 'TikTok', 'YouTube'], tags: ['Affiliation', 'Fitness', 'Commission'],
    },
    {
      initials: 'BB', color: '#ec4899', name: 'Affiliation Beauté - Cosmétiques', brand: 'BeautyBox', verified: true,
      desc: 'Programme d\'affiliation beauté avec 20% de commission. Recevez des produits gratuits et générez des revenus passifs.',
      commission: '20% commission', duree: 'Programme continu', lieu: 'En ligne', candidats: '203 candidats',
      plateformes: ['Instagram', 'TikTok'], tags: ['Affiliation', 'Beauté', 'Cosmétiques'],
    },
    {
      initials: 'TW', color: '#a855f7', name: 'Affiliation Mode - E-commerce', brand: 'TrendyWear', verified: true,
      desc: 'Gagnez 12% sur chaque vente + bonus mensuels selon vos performances. Code promo exclusif inclus.',
      commission: '12% commission', duree: 'Programme continu', lieu: 'En ligne', candidats: '178 candidats',
      plateformes: ['Instagram', 'TikTok'], tags: ['Affiliation', 'Mode', 'E-commerce'],
    },
  ]

  const campagnesPublic = {
    toutes: [
      { initials: 'GG', color: '#22c55e', name: 'Placement Produit - Skincare Bio', brand: 'GreenGlow Beauty', verified: true, desc: 'Placement de nos produits skincare bio dans vos contenus quotidiens. Nous recherchons des influenceurs beauté pour intégrer naturellement nos produits.', budget: '2 500 - 4 000 €', duree: '2 semaines', lieu: 'Paris, France', candidats: '47 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Bio', 'Skincare', 'Naturel'], type: 'placement' },
      { initials: 'SH', color: '#a855f7', name: 'Ambassadeur de Marque - Mode', brand: 'StyleHub', verified: true, desc: 'Nous recherchons un ambassadeur de marque pour représenter StyleHub sur le long terme. Contrat de 6 mois renouvelable avec avantages exclusifs.', budget: '3 500 - 6 000 €', duree: '6 mois', lieu: 'Lyon, France', candidats: '32 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Mode', 'Ambassadeur', 'Long terme'], type: 'ambassadeur' },
      { initials: 'TN', color: '#3b82f6', name: 'Campagne de Notoriété - Lancement App', brand: 'TechNova', verified: true, desc: 'Campagne de notoriété pour le lancement de notre nouvelle application mobile. Objectif : générer du buzz et accroître la visibilité de la marque.', budget: '4 000 - 7 000 €', duree: '1 mois', lieu: 'À distance', candidats: '28 candidats', plateformes: ['YouTube', 'Instagram', 'TikTok'], tags: ['Tech', 'Lancement', 'Notoriété'], type: 'notoriete' },
      { initials: 'UK', color: '#f97316', name: 'Collaboration One-Shot - Sneakers', brand: 'UrbanKicks', verified: true, desc: 'Collaboration ponctuelle pour promouvoir notre nouvelle collection de sneakers limitée. Contrat one-shot avec livraison rapide.', budget: '1 500 - 2 500 €', duree: '1 semaine', lieu: 'Paris, France', candidats: '65 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Sneakers', 'Streetwear', 'Limité'], type: 'oneshot' },
      { initials: 'VB', color: '#22c55e', name: 'Placement Produit - Compléments Alimentaires', brand: 'VitalBoost', verified: true, desc: 'Intégration naturelle de nos compléments alimentaires dans vos routines fitness et nutrition.', budget: '2 000 - 3 500 €', duree: '3 semaines', lieu: 'À distance', candidats: '41 candidats', plateformes: ['Instagram', 'YouTube'], tags: ['Sport', 'Nutrition', 'Wellness'], type: 'placement' },
      { initials: 'PSW', color: '#ec4899', name: 'One-Shot Événement - Festival Mode', brand: 'ParisStyleWeek', verified: true, desc: 'Couverture one-shot de notre festival de mode. Présence sur place requise pour créer du contenu en temps réel.', budget: '3 000 - 4 500 €', duree: '3 jours', lieu: 'Paris, France', candidats: '22 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Événement', 'Mode', 'Festival'], type: 'oneshot' },
    ],
  }

  const getFilteredPublic = () => {
    const all = campagnesPublic.toutes
    if (publicTab === 'toutes') return all
    if (publicTab === 'placement') return all.filter(c => c.type === 'placement')
    if (publicTab === 'ambassadeur') return all.filter(c => c.type === 'ambassadeur')
    if (publicTab === 'notoriete') return all.filter(c => c.type === 'notoriete')
    if (publicTab === 'oneshot') return all.filter(c => c.type === 'oneshot')
    return all
  }

  const CampagneCard = ({ c, showCompatibilite = false, showCommission = false }) => (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
            {c.initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a202c' }}>{c.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>{c.brand}</div>
          </div>
        </div>
        {c.verified && (
          <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            ✓ Vérifié
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.82rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '1rem' }}>{c.desc}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#4a5568' }}>
          <span style={{ color: showCommission ? '#22c55e' : '#a855f7', fontWeight: 600 }}>💰 {showCommission ? c.commission : c.budget}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#4a5568' }}>
          <span>📅 {c.duree}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#4a5568' }}>
          <span>📍 {c.lieu}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#4a5568' }}>
          <span>👥 {c.candidats}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {c.plateformes.map(p => (
          <span key={p} style={{ background: '#f8f9fa', border: '1px solid #e2e8f0', color: '#4a5568', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {p === 'Instagram' ? '📸' : p === 'TikTok' ? '🎵' : p === 'YouTube' ? '▶️' : p === 'Twitter' ? '🐦' : '🌐'} {p}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {c.tags.map(t => (
          <span key={t} style={{ background: '#f0f0f0', color: '#718096', fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{t}</span>
        ))}
      </div>

      {showCompatibilite && (
        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#a855f7', fontWeight: 600 }}>
              <span>⓪</span> Compatibilité IA
            </div>
            <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '100px' }}>{c.compatibilite}%</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#7c3aed', marginBottom: '0.4rem' }}>{c.compatibilite}% de match</div>
          <div style={{ height: '4px', background: '#e9d5ff', borderRadius: '2px' }}>
            <div style={{ height: '100%', width: c.compatibilite + '%', background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '2px' }} />
          </div>
        </div>
      )}

      <button style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
        ✈ Postuler à cette campagne
      </button>
    </div>
  )

  return (
    <div style={{ padding: '2rem', background: '#f8f9ff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Opportunités</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA actif</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Campagnes Ciblées • Candidatures Rapides • Matching Intelligent</p>
      </div>

      {/* SEARCH + FILTRE */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher une campagne..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: '#1a202c', background: '#fff', boxSizing: 'border-box' }}
          />
        </div>
        <select value={categorie} onChange={e => setCategorie(e.target.value)} style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: '#1a202c', background: '#fff', cursor: 'pointer' }}>
          {['Toutes catégories', 'Beauté', 'Mode', 'Tech', 'Gaming', 'Fitness', 'Lifestyle', 'Food'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* TABS PRINCIPAUX */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'pourvous', icon: '⓪', label: 'Pour vous', count: 3, activeColor: 'linear-gradient(135deg,#f97316,#ef4444)' },
          { id: 'affiliation', icon: '%', label: 'Affiliation', count: 3, activeColor: 'linear-gradient(135deg,#22c55e,#16a34a)' },
          { id: 'public', icon: '🌐', label: 'Public', count: 6, activeColor: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setMainTab(t.id)}
            style={{
              padding: '1.1rem 1.5rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              background: mainTab === t.id ? t.activeColor : '#fff',
              color: mainTab === t.id ? '#fff' : '#718096',
              border: mainTab === t.id ? 'none' : '1px solid #f0f0f0',
              boxShadow: mainTab === t.id ? '0 4px 15px rgba(0,0,0,0.15)' : '0 1px 6px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* POUR VOUS */}
      {mainTab === 'pourvous' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(236,72,153,0.05))', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7', marginBottom: '0.25rem' }}>⓪ Campagnes Pour Vous</div>
            <div style={{ fontSize: '0.78rem', color: '#718096' }}>Campagnes ciblées par les entreprises selon vos critères - Matching IA basé sur votre profil, audience et performances</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {campagnesPourVous.map((c, i) => <CampagneCard key={i} c={c} showCompatibilite />)}
          </div>
        </div>
      )}

      {/* AFFILIATION */}
      {mainTab === 'affiliation' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.05))', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#22c55e', marginBottom: '0.25rem' }}>% Programmes d'Affiliation</div>
            <div style={{ fontSize: '0.78rem', color: '#718096' }}>Programmes d'affiliation ouverts à tous les influenceurs - Postulez librement et générez des revenus passifs via vos codes promo</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {campagnesAffiliation.map((c, i) => <CampagneCard key={i} c={c} showCommission />)}
          </div>
        </div>
      )}

      {/* PUBLIC */}
      {mainTab === 'public' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(6,182,212,0.05))', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#3b82f6', marginBottom: '0.25rem' }}>🌐 Campagnes Public</div>
            <div style={{ fontSize: '0.78rem', color: '#718096' }}>Placements produits, ambassadeurs de marque, campagnes de notoriété et contrats one-shot ouverts à tous les influenceurs</div>
          </div>

          {/* Sous-onglets */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', gap: '0.25rem' }}>
            {[
              { id: 'toutes', label: 'Toutes' },
              { id: 'placement', label: 'Placement produit' },
              { id: 'ambassadeur', label: 'Ambassadeur' },
              { id: 'notoriete', label: 'Notoriété' },
              { id: 'oneshot', label: 'One-shot' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setPublicTab(t.id)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.75rem',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.78rem',
                  fontWeight: publicTab === t.id ? 700 : 400,
                  background: publicTab === t.id ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : 'transparent',
                  color: publicTab === t.id ? '#fff' : '#718096',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {getFilteredPublic().map((c, i) => <CampagneCard key={i} c={c} />)}
          </div>
        </div>
      )}
    </div>
  )
}