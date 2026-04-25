'use client'
import { useState } from 'react'
import { useTheme } from './../../ThemeContext'

export default function Opportunites() {
  const { isDark, colors } = useTheme()
  const [mainTab, setMainTab] = useState('pourvous')
  const [publicTab, setPublicTab] = useState('toutes')
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('Toutes catégories')
  const [selectedCampagne, setSelectedCampagne] = useState(null)
  const [motivation, setMotivation] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const campagnesPourVous = [
    {
      initials: 'PP', color: '#a855f7', name: 'Campagne Exclusive Luxe', brand: 'Prestige Parfums', verified: true,
      desc: 'Campagne exclusive pour notre nouvelle ligne de parfums de luxe. Vous avez été sélectionné(e) en fonction de votre profil et de votre audience.',
      budget: '5 000 - 8 000 €', duree: '1 mois', lieu: 'Paris, France', candidats: '12 candidats',
      plateformes: ['Instagram'], tags: ['Luxe', 'Beauté', 'Exclusif'], compatibilite: 96,
      criteres: ['50K+ followers', 'Contenu beauté/luxe', 'Audience 25-40 ans', 'Engagement 4%+'],
      livrables: '8 contenus', deadline: '2024-04-15', types: ['Post', 'Story', 'Reel'],
    },
    {
      initials: 'GH', color: '#22c55e', name: 'Ambassadeur Tech - Gaming', brand: 'GamersHub', verified: true,
      desc: 'Nous vous avons identifié comme ambassadeur potentiel pour notre marque gaming. Partenariat long terme avec avantages exclusifs.',
      budget: '4 000 - 7 000 €', duree: '6 mois', lieu: 'À distance', candidats: '8 candidats',
      plateformes: ['YouTube', 'Instagram', 'Twitter'], tags: ['Gaming', 'Tech', 'Long terme'], compatibilite: 92,
      criteres: ['30K+ followers', 'Contenu gaming régulier', 'Audience 16-30 ans', 'Streaming actif'],
      livrables: '15 contenus', deadline: '2024-03-10', types: ['Vidéo', 'Post', 'Story'],
    },
    {
      initials: 'LL', color: '#3b82f6', name: 'Campagne Lifestyle Premium', brand: 'LifeLux', verified: true,
      desc: 'Votre profil correspond parfaitement à notre recherche d\'influenceur lifestyle premium. Campagne multi-plateforme avec voyages inclus.',
      budget: '3 500 - 6 000 €', duree: '2 mois', lieu: 'Multiple', candidats: '15 candidats',
      plateformes: ['Instagram', 'YouTube'], tags: ['Lifestyle', 'Premium', 'Voyage'], compatibilite: 89,
      criteres: ['40K+ followers', 'Contenu lifestyle', 'Audience internationale', 'Photos HD'],
      livrables: '10 contenus', deadline: '2024-05-01', types: ['Post', 'Story', 'Vidéo'],
    },
  ]

  const campagnesAffiliation = [
    {
      initials: 'FL', color: '#22c55e', name: 'Programme Affiliation - Fitness', brand: 'FitLife Pro', verified: true,
      desc: 'Rejoignez notre programme d\'affiliation et gagnez 15% de commission sur chaque vente générée via votre code promo unique.',
      commission: '15% commission', duree: 'Programme continu', lieu: 'En ligne', candidats: '156 candidats',
      plateformes: ['Instagram', 'TikTok', 'YouTube'], tags: ['Affiliation', 'Fitness', 'Commission'],
      criteres: ['Compte actif', 'Niche fitness/sport', 'Minimum 5K followers', 'Contenu régulier'],
      livrables: 'Au moins 2 mentions/mois', deadline: 'Continu', types: ['Post', 'Story'],
    },
    {
      initials: 'BB', color: '#ec4899', name: 'Affiliation Beauté - Cosmétiques', brand: 'BeautyBox', verified: true,
      desc: 'Programme d\'affiliation beauté avec 20% de commission. Recevez des produits gratuits et générez des revenus passifs.',
      commission: '20% commission', duree: 'Programme continu', lieu: 'En ligne', candidats: '203 candidats',
      plateformes: ['Instagram', 'TikTok'], tags: ['Affiliation', 'Beauté', 'Cosmétiques'],
      criteres: ['Niche beauté', '10K+ followers', 'Engagement 3%+', 'Audience féminine 18-35'],
      livrables: '3 mentions/mois minimum', deadline: 'Continu', types: ['Post', 'Story', 'Reel'],
    },
    {
      initials: 'TW', color: '#a855f7', name: 'Affiliation Mode - E-commerce', brand: 'TrendyWear', verified: true,
      desc: 'Gagnez 12% sur chaque vente + bonus mensuels selon vos performances. Code promo exclusif inclus.',
      commission: '12% commission', duree: 'Programme continu', lieu: 'En ligne', candidats: '178 candidats',
      plateformes: ['Instagram', 'TikTok'], tags: ['Affiliation', 'Mode', 'E-commerce'],
      criteres: ['Niche mode/lifestyle', '8K+ followers', 'Contenu régulier', 'Storytelling authentique'],
      livrables: '2 posts/mois minimum', deadline: 'Continu', types: ['Post', 'Story'],
    },
  ]

  const campagnesPublic = [
    { initials: 'GG', color: '#22c55e', name: 'Placement Produit - Skincare Bio', brand: 'GreenGlow Beauty', verified: true, desc: 'Placement de nos produits skincare bio dans vos contenus quotidiens. Nous recherchons des influenceurs beauté pour intégrer naturellement nos produits.', budget: '2 500 - 4 000 €', duree: '2 semaines', lieu: 'Paris, France', candidats: '47 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Bio', 'Skincare', 'Naturel'], type: 'placement', criteres: ['Niche beauté/bien-être', '15K+ followers', 'Contenu authentique', 'Photos de qualité'], livrables: '6 contenus', deadline: '2024-04-20', types: ['Post', 'Story'] },
    { initials: 'SH', color: '#a855f7', name: 'Ambassadeur de Marque - Mode', brand: 'StyleHub', verified: true, desc: 'Nous recherchons un ambassadeur de marque pour représenter StyleHub sur le long terme. Contrat de 6 mois renouvelable avec avantages exclusifs.', budget: '3 500 - 6 000 €', duree: '6 mois', lieu: 'Lyon, France', candidats: '32 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Mode', 'Ambassadeur', 'Long terme'], type: 'ambassadeur', criteres: ['25K+ followers', 'Niche mode/lifestyle', 'Présence Lyon possible', 'Engagement 5%+'], livrables: '12 contenus/mois', deadline: '2024-04-01', types: ['Post', 'Story', 'Reel'] },
    { initials: 'TN', color: '#3b82f6', name: 'Campagne de Notoriété - Lancement App', brand: 'TechNova', verified: true, desc: 'Campagne de notoriété pour le lancement de notre nouvelle application mobile. Objectif : générer du buzz et accroître la visibilité de la marque.', budget: '4 000 - 7 000 €', duree: '1 mois', lieu: 'À distance', candidats: '28 candidats', plateformes: ['YouTube', 'Instagram', 'TikTok'], tags: ['Tech', 'Lancement', 'Notoriété'], type: 'notoriete', criteres: ['20K+ followers', 'Audience tech/digital', 'Vidéo de qualité', 'Storytelling engageant'], livrables: '4 vidéos + stories', deadline: '2024-03-30', types: ['Vidéo', 'Story'] },
    { initials: 'UK', color: '#f97316', name: 'Collaboration One-Shot - Sneakers', brand: 'UrbanKicks', verified: true, desc: 'Collaboration ponctuelle pour promouvoir notre nouvelle collection de sneakers limitée. Contrat one-shot avec livraison rapide.', budget: '1 500 - 2 500 €', duree: '1 semaine', lieu: 'Paris, France', candidats: '65 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Sneakers', 'Streetwear', 'Limité'], type: 'oneshot', criteres: ['Niche streetwear/mode', '10K+ followers', 'Style urbain', 'Photos lifestyle'], livrables: '3 posts + 5 stories', deadline: '2024-03-25', types: ['Post', 'Story'] },
    { initials: 'VB', color: '#22c55e', name: 'Placement Produit - Compléments', brand: 'VitalBoost', verified: true, desc: 'Intégration naturelle de nos compléments alimentaires dans vos routines fitness et nutrition.', budget: '2 000 - 3 500 €', duree: '3 semaines', lieu: 'À distance', candidats: '41 candidats', plateformes: ['Instagram', 'YouTube'], tags: ['Sport', 'Nutrition', 'Wellness'], type: 'placement', criteres: ['Niche fitness/nutrition', '12K+ followers', 'Routine sport régulière', 'Contenu éducatif'], livrables: '5 contenus', deadline: '2024-04-10', types: ['Post', 'Story', 'Vidéo'] },
    { initials: 'PS', color: '#ec4899', name: 'One-Shot Événement - Festival Mode', brand: 'ParisStyleWeek', verified: true, desc: 'Couverture one-shot de notre festival de mode. Présence sur place requise pour créer du contenu en temps réel.', budget: '3 000 - 4 500 €', duree: '3 jours', lieu: 'Paris, France', candidats: '22 candidats', plateformes: ['Instagram', 'TikTok'], tags: ['Événement', 'Mode', 'Festival'], type: 'oneshot', criteres: ['20K+ followers', 'Niche mode/style', 'Disponible à Paris', 'Stories en direct'], livrables: '10 stories + 3 posts', deadline: '2024-05-15', types: ['Story', 'Post', 'Reel'] },
  ]

  const getFilteredPublic = () => {
    if (publicTab === 'toutes') return campagnesPublic
    return campagnesPublic.filter(c => c.type === publicTab)
  }

  const handlePostuler = (c) => {
    setSelectedCampagne(c)
    setMotivation('')
    setSubmitted(false)
  }

  const handleSubmit = () => {
    if (motivation.length < 50) return
    setSubmitted(true)
    setTimeout(() => {
      setSelectedCampagne(null)
      setSubmitted(false)
    }, 2500)
  }

  const platIcon = (p) => p === 'Instagram' ? '📸' : p === 'TikTok' ? '🎵' : p === 'YouTube' ? '▶️' : p === 'Twitter' ? '🐦' : '🌐'

  const card = {
    background: colors.cardBg,
    borderRadius: '16px',
    border: `1px solid ${colors.border}`,
    padding: '1.5rem',
    boxShadow: colors.shadow,
    transition: 'transform .18s, box-shadow .18s',
  }

  const CampagneCard = ({ c, showCompatibilite = false, showCommission = false }) => (
    <div style={{ ...card, cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(168,85,247,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = colors.shadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{c.initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>{c.name}</div>
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>{c.brand}</div>
          </div>
        </div>
        {c.verified && <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px', flexShrink: 0 }}>✓ Vérifié</span>}
      </div>

      <p style={{ fontSize: '0.82rem', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '1rem' }}>{c.desc}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.78rem', color: showCommission ? '#22c55e' : '#a855f7', fontWeight: 600 }}>💰 {showCommission ? c.commission : c.budget}</span>
        <span style={{ fontSize: '0.78rem', color: colors.textSecondary }}>📅 {c.duree}</span>
        <span style={{ fontSize: '0.78rem', color: colors.textSecondary }}>📍 {c.lieu}</span>
        <span style={{ fontSize: '0.78rem', color: colors.textSecondary }}>👥 {c.candidats}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        {c.plateformes.map(p => (
          <span key={p} style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f8f9fa', border: `1px solid ${colors.border}`, color: colors.textSecondary, fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
            {platIcon(p)} {p}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {c.tags.map(t => <span key={t} style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', color: colors.textMuted, fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{t}</span>)}
      </div>

      {showCompatibilite && (
        <div style={{ background: isDark ? 'rgba(168,85,247,0.1)' : '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 600 }}>⓪ Compatibilité IA</span>
            <span style={{ background: '#a855f7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '100px' }}>{c.compatibilite}%</span>
          </div>
          <div style={{ height: '4px', background: '#e9d5ff', borderRadius: '2px' }}>
            <div style={{ height: '100%', width: c.compatibilite + '%', background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '2px' }} />
          </div>
        </div>
      )}

      <button onClick={() => handlePostuler(c)} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#6366f1)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, transition: 'opacity .2s' }}
        onMouseEnter={e => e.target.style.opacity = '0.9'}
        onMouseLeave={e => e.target.style.opacity = '1'}>
        ✈ Postuler à cette campagne
      </button>
    </div>
  )

  return (
    <div style={{ padding: '2rem', background: colors.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: colors.text, margin: 0 }}>Opportunités</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA actif</span>
        </div>
        <p style={{ color: colors.textSecondary, margin: 0, fontSize: '0.875rem' }}>Campagnes Ciblées • Candidatures Rapides • Matching Intelligent</p>
      </div>

      {/* SEARCH */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>🔍</span>
          <input type="text" placeholder="Rechercher une campagne..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: colors.text, background: colors.cardBg, boxSizing: 'border-box' }} />
        </div>
        <select value={categorie} onChange={e => setCategorie(e.target.value)}
          style={{ padding: '0.75rem 1rem', border: `1px solid ${colors.border}`, borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: colors.text, background: colors.cardBg, cursor: 'pointer' }}>
          {['Toutes catégories', 'Beauté', 'Mode', 'Tech', 'Gaming', 'Fitness', 'Lifestyle', 'Food'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* TABS PRINCIPAUX */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'pourvous',    icon: '⓪', label: 'Pour vous',  count: 3, grad: 'linear-gradient(135deg,#f97316,#ef4444)' },
          { id: 'affiliation', icon: '%',  label: 'Affiliation', count: 3, grad: 'linear-gradient(135deg,#22c55e,#16a34a)' },
          { id: 'public',      icon: '🌐', label: 'Public',     count: 6, grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
        ].map(t => (
          <button key={t.id} onClick={() => setMainTab(t.id)} style={{ padding: '1.1rem 1.5rem', border: mainTab === t.id ? 'none' : `1px solid ${colors.border}`, borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', background: mainTab === t.id ? t.grad : colors.cardBg, color: mainTab === t.id ? '#fff' : colors.textSecondary, boxShadow: mainTab === t.id ? '0 4px 15px rgba(0,0,0,0.15)' : colors.shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* POUR VOUS */}
      {mainTab === 'pourvous' && (
        <div>
          <div style={{ background: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7', marginBottom: '0.25rem' }}>⓪ Campagnes Pour Vous</div>
            <div style={{ fontSize: '0.78rem', color: colors.textSecondary }}>Campagnes ciblées par les entreprises selon vos critères - Matching IA basé sur votre profil, audience et performances</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {campagnesPourVous.map((c, i) => <CampagneCard key={i} c={c} showCompatibilite />)}
          </div>
        </div>
      )}

      {/* AFFILIATION */}
      {mainTab === 'affiliation' && (
        <div>
          <div style={{ background: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#22c55e', marginBottom: '0.25rem' }}>% Programmes d'Affiliation</div>
            <div style={{ fontSize: '0.78rem', color: colors.textSecondary }}>Programmes d'affiliation ouverts à tous les influenceurs - Postulez librement et générez des revenus passifs via vos codes promo</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {campagnesAffiliation.map((c, i) => <CampagneCard key={i} c={c} showCommission />)}
          </div>
        </div>
      )}

      {/* PUBLIC */}
      {mainTab === 'public' && (
        <div>
          <div style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#3b82f6', marginBottom: '0.25rem' }}>🌐 Campagnes Public</div>
            <div style={{ fontSize: '0.78rem', color: colors.textSecondary }}>Placements produits, ambassadeurs de marque, campagnes de notoriété et contrats one-shot</div>
          </div>
          <div style={{ display: 'flex', background: colors.cardBg, borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: `1px solid ${colors.border}`, gap: '0.25rem' }}>
            {[{id:'toutes',label:'Toutes'},{id:'placement',label:'Placement'},{id:'ambassadeur',label:'Ambassadeur'},{id:'notoriete',label:'Notoriété'},{id:'oneshot',label:'One-shot'}].map(t => (
              <button key={t.id} onClick={() => setPublicTab(t.id)} style={{ flex: 1, padding: '0.55rem 0.75rem', border: 'none', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: publicTab === t.id ? 700 : 400, background: publicTab === t.id ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : 'transparent', color: publicTab === t.id ? '#fff' : colors.textSecondary, transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {getFilteredPublic().map((c, i) => <CampagneCard key={i} c={c} />)}
          </div>
        </div>
      )}

      {/* ── PANNEAU CANDIDATURE ── */}
      {selectedCampagne && (
        <>
          {/* Overlay */}
          <div onClick={() => setSelectedCampagne(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }} />

          {/* Panel */}
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px', background: colors.cardBg, zIndex: 201, overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>

            {/* Header panel */}
            <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, background: colors.cardBg, zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: colors.text, marginBottom: '0.2rem' }}>
                    Candidature - {selectedCampagne.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>{selectedCampagne.brand}</div>
                </div>
                <button onClick={() => setSelectedCampagne(null)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0', border: 'none', cursor: 'pointer', fontSize: '1rem', color: colors.textSecondary, flexShrink: 0 }}>✕</button>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', flex: 1 }}>

              {submitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: colors.text, marginBottom: '0.5rem' }}>Candidature envoyée !</div>
                  <div style={{ fontSize: '0.85rem', color: colors.textSecondary }}>Vous recevrez une réponse de {selectedCampagne.brand} dans les prochains jours.</div>
                </div>
              ) : (
                <>
                  {/* Description */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text, marginBottom: '0.5rem' }}>Description de la campagne</div>
                    <p style={{ fontSize: '0.82rem', color: colors.textSecondary, lineHeight: 1.6 }}>{selectedCampagne.desc}</p>
                  </div>

                  {/* Critères */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text, marginBottom: '0.5rem' }}>Critères requis</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedCampagne.criteres.map((cr, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: colors.textSecondary }}>
                          <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>✓</span> {cr}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Détails */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text, marginBottom: '0.75rem' }}>Détails</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {[
                        { label: 'Budget', val: selectedCampagne.budget || selectedCampagne.commission },
                        { label: 'Livrables', val: selectedCampagne.livrables },
                        { label: 'Deadline', val: selectedCampagne.deadline },
                        { label: 'Localisation', val: selectedCampagne.lieu },
                      ].map(d => (
                        <div key={d.label} style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontSize: '0.68rem', color: colors.textMuted, marginBottom: '0.2rem' }}>{d.label}</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: colors.text }}>{d.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plateformes */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text, marginBottom: '0.5rem' }}>Plateformes</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selectedCampagne.plateformes.map(p => (
                        <span key={p} style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', border: `1px solid ${colors.border}`, color: colors.textSecondary, fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: '8px' }}>
                          {platIcon(p)} {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Types de contenu */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text, marginBottom: '0.5rem' }}>Types de contenu</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {selectedCampagne.types.map(t => (
                        <span key={t} style={{ background: isDark ? 'rgba(168,85,247,0.15)' : '#ede9fe', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.7rem', borderRadius: '8px' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Message de motivation */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text, marginBottom: '0.5rem' }}>
                      Message de motivation <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <textarea
                      value={motivation}
                      onChange={e => setMotivation(e.target.value)}
                      placeholder="Expliquez pourquoi vous êtes le/la meilleur(e) candidat(e) pour cette campagne (minimum 50 caractères)..."
                      rows={6}
                      style={{ width: '100%', padding: '0.85rem 1rem', border: `1.5px solid ${motivation.length >= 50 ? '#a855f7' : colors.border}`, borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', color: colors.text, background: colors.inputBg || colors.bg, boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6, transition: 'border-color .2s' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', color: motivation.length >= 50 ? '#22c55e' : colors.textMuted }}>
                        {motivation.length >= 50 ? '✓ Longueur suffisante' : `Encore ${50 - motivation.length} caractères minimum`}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: colors.textMuted }}>{motivation.length} / 1000</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!submitted && (
              <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${colors.border}`, background: colors.cardBg, position: 'sticky', bottom: 0 }}>
                <button
                  onClick={handleSubmit}
                  disabled={motivation.length < 50}
                  style={{ width: '100%', padding: '0.9rem', background: motivation.length >= 50 ? 'linear-gradient(135deg,#a855f7,#ec4899)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'), color: motivation.length >= 50 ? '#fff' : colors.textMuted, border: 'none', borderRadius: '12px', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 700, cursor: motivation.length >= 50 ? 'pointer' : 'not-allowed', transition: 'all .2s', boxShadow: motivation.length >= 50 ? '0 4px 15px rgba(168,85,247,0.4)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onMouseEnter={e => { if (motivation.length >= 50) e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  ✈ Postuler
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}