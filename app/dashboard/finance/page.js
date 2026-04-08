'use client'
import { useState } from 'react'

export default function GestionFinanciere() {
  const [tab, setTab] = useState('overview')

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }

  const metrics = [
    { label: "Chiffre d'affaires", value: '€1,247,890', delta: '+23.8%', pos: true, sub: 'Ce mois vs mois dernier', icon: '$' },
    { label: 'Escrow actif', value: '€90,000', delta: '+€12K', pos: true, sub: 'Fonds sécurisés en cours', icon: '🛡' },
    { label: 'Taux de libération', value: '94.2%', delta: '+2.1%', pos: true, sub: 'Paiements validés automatiquement', icon: '✓' },
    { label: 'Temps moyen escrow', value: '3.2 jours', delta: '-0.8j', pos: true, sub: 'De versement à libération', icon: '🕐' },
    { label: 'Économies IA', value: '€18,450', delta: '+€5.2K', pos: true, sub: 'Optimisations automatiques', icon: '💼' },
    { label: 'Score de risque', value: '2.1/10', delta: '-0.3', pos: true, sub: 'Risque financier global', icon: '🎯' },
  ]

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: '📊', activeColor: '#3b82f6' },
    { id: 'flux', label: 'Flux de trésorerie', icon: '↗', activeColor: '#a855f7' },
    { id: 'paiements', label: 'Paiements Influenceurs', icon: '👥', activeColor: '#22c55e' },
    { id: 'predictions', label: 'Prédictions IA', icon: '🔮', activeColor: '#f97316' },
    { id: 'rapports', label: 'Rapports', icon: '📄', activeColor: '#374151' },
  ]

  const months = ['Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul']
  const caData = [78000, 90000, 105000, 108000, 120000, 140000]

  const fluxData = [
    { month: 'Jan', entrees: 12000, sorties: 9000, escrow: 3000 },
    { month: 'Fév', entrees: 16000, sorties: 10000, escrow: 4000 },
    { month: 'Mar', entrees: 18000, sorties: 11000, escrow: 5000 },
    { month: 'Avr', entrees: 22000, sorties: 14000, escrow: 6000 },
    { month: 'Mai', entrees: 20000, sorties: 12000, escrow: 5500 },
    { month: 'Jun', entrees: 26000, sorties: 16000, escrow: 7000 },
    { month: 'Jul', entrees: 30000, sorties: 17000, escrow: 8000 },
  ]

  const campagnes = [
    {
      name: 'Summer Collection 2024', type: 'Influenceur', budget: '€31,190', revenus: '€164,000', ventes: 66,
      influenceurs: [
        { name: '@lifestyle_emma', status: 'active', tags: ['actif', '2% affiliation'], pays: '€1 200 • 12/mois', ref: 'Lien d\'affiliation', montant: '€2 400' },
        { name: '@alex_tech', status: 'active', tags: ['actif', '2% affiliation'], pays: '€1 866 • 12/mois', ref: 'Lien d\'affiliation', montant: '€1 866' },
        { name: '@coach_beauty', status: 'active', tags: ['actif', '2% affiliation'], pays: '€1 200 • 12/mois', ref: 'Lien d\'affiliation', montant: '€1 200' },
        { name: '@emma_fashion', status: 'active', tags: ['actif', 'campagne produit gratuit'], pays: '€1 150 • 12/mois', ref: 'Lien d\'affiliation', montant: '€1 150' },
        { name: '@coach_pierre', status: 'active', tags: ['actif', '2% affiliation'], pays: '€1 658 • 12/mois', ref: 'Lien d\'affiliation', montant: '€1 658' },
      ]
    },
    {
      name: 'Tech Launch Event', type: 'Influenceur', budget: '€11,990', revenus: '€27,500', ventes: 19,
      influenceurs: [
        { name: '@gaming_pro', status: 'active', tags: ['actif', '2% affiliation'], pays: '€1 958 • 12/mois', ref: 'Lien d\'affiliation', montant: '€1 958' },
      ]
    },
    {
      name: 'Beauty Brand Collab', type: 'Influenceur', budget: '€12,990', revenus: '€37,700', ventes: 31,
      influenceurs: [
        { name: '@beauty_guru', status: 'pending', tags: ['en attente', 'campagne produit gratuit'], pays: '€2 958 • 12/mois', ref: 'Lien d\'affiliation', montant: '€2 958' },
      ]
    },
    {
      name: 'Fashion Week Paris', type: 'Influenceur', budget: '€21,000', revenus: '€29,200', ventes: 30,
      influenceurs: [
        { name: '@style_blogger', status: 'active', tags: ['actif'], pays: '€1 650 • 12/mois', ref: 'Lien d\'affiliation', montant: '€1 650' },
        { name: '@fashion_sophie', status: 'active', tags: ['actif'], pays: '€2 200 • 12/mois', ref: 'Lien d\'affiliation', montant: '€2 200' },
      ]
    },
  ]

  const escrowPaiements = [
    { category: 'Placement de produit', items: [
      { name: 'Sophie Laurent', handle: '@sophielaurent', montant: '19020,0 €', prochainPaiement: '25 Juin 2026', freq: 'unique', status: 'actif' },
      { name: 'Thomas Martin', handle: '@thomasmartin', montant: '9800,0 €', prochainPaiement: '25 Juin 2026', freq: 'unique', status: 'actif' },
      { name: 'Sophie Laurent', handle: '@sophielaurent', montant: '9820,0 €', prochainPaiement: '25 Juin 2026', freq: 'unique', status: 'actif' },
      { name: 'Thomas Martin', handle: '@thomasmartin', montant: '9800,0 €', prochainPaiement: '25 Juin 2026', freq: 'unique', status: 'actif' },
      { name: 'Sophie Laurent', handle: '@sophielaurent', montant: '9020,0 €', prochainPaiement: '25 Juin 2026', freq: 'unique', status: 'actif' },
    ]},
    { category: 'Ambassadeur', items: [
      { name: 'Max&Co', handle: '@maxco', montant: '5000,0 €', prochainPaiement: '25 Jan 2026', freq: 'unique', status: 'dépassé' },
    ]},
    { category: 'One-shot', items: [
      { name: 'Emma Dubois', handle: '@emmadubois', montant: '2000,0 €', prochainPaiement: '05 Jan 2024', freq: 'unique', status: 'dépassé' },
      { name: 'Lea Bernard', handle: '@leabernard', montant: '4000,0 €', prochainPaiement: '05 Jan 2024', freq: 'unique', status: 'dépassé' },
      { name: 'Emma Dubois', handle: '@emmadubois', montant: '2000,0 €', prochainPaiement: '05 Jan 2024', freq: 'unique', status: 'dépassé' },
      { name: 'Lea Bernard', handle: '@leabernard', montant: '4000,0 €', prochainPaiement: '05 Jan 2024', freq: 'unique', status: 'actif' },
      { name: 'Emma Dubois', handle: '@emmadubois', montant: '2000,0 €', prochainPaiement: '05 Jan 2024', freq: 'unique', status: 'dépassé' },
    ]},
    { category: 'Notoriété', items: [
      { name: 'Marie Rousseau', handle: '@marierouseau', montant: '15000,0 €', prochainPaiement: '10 Jan 2026', freq: 'mensuel', status: 'actif' },
      { name: 'Julie Petit', handle: '@juliepetit', montant: '8000,0 €', prochainPaiement: '10 Jan 2026', freq: 'mensuel', status: 'actif' },
      { name: 'Julie Petit', handle: '@juliepetit', montant: '15000,0 €', prochainPaiement: '10 Jan 2026', freq: 'mensuel', status: 'dépassé' },
      { name: 'Marie Rousseau', handle: '@marierouseau', montant: '15000,0 €', prochainPaiement: '10 Jan 2026', freq: 'mensuel', status: 'actif' },
      { name: 'Marie Rousseau', handle: '@marierouseau', montant: '15000,0 €', prochainPaiement: '10 Jan 2026', freq: 'mensuel', status: 'actif' },
      { name: 'Julie Petit', handle: '@juliepetit', montant: '10000,0 €', prochainPaiement: '10 Jan 2026', freq: 'mensuel', status: 'actif' },
    ]},
    { category: 'UGC', items: [
      { name: 'Lucas Moreau', handle: '@lucasmoreau', montant: '4000,0 €', prochainPaiement: '29 Jan 2026', freq: 'hebdomadaire', status: 'actif' },
      { name: 'Clara Vincent', handle: '@claravincent', montant: '4000,0 €', prochainPaiement: '29 Jan 2026', freq: 'hebdomadaire', status: 'actif' },
      { name: 'Clara Vincent', handle: '@claravincent', montant: '4000,0 €', prochainPaiement: '29 Jan 2026', freq: 'hebdomadaire', status: 'actif' },
      { name: 'Lucas Moreau', handle: '@lucasmoreau', montant: '4000,0 €', prochainPaiement: '29 Jan 2026', freq: 'hebdomadaire', status: 'actif' },
      { name: 'Lucas Moreau', handle: '@lucasmoreau', montant: '4000,0 €', prochainPaiement: '29 Jan 2026', freq: 'hebdomadaire', status: 'actif' },
      { name: 'Clara Vincent', handle: '@claravincent', montant: '4000,0 €', prochainPaiement: '29 Jan 2026', freq: 'hebdomadaire', status: 'actif' },
    ]},
  ]

  const predPoints = [
    { month: 'Jan', reel: 85000, pred: 83000 },
    { month: 'Fév', reel: 90000, pred: 91000 },
    { month: 'Mar', reel: 95000, pred: 96000 },
    { month: 'Avr', reel: 103000, pred: 102000 },
    { month: 'Mai', reel: 108000, pred: 107000 },
    { month: 'Jun', reel: 122000, pred: 120000 },
    { month: 'Jul', reel: null, pred: 125000 },
  ]

  const rapports = [
    { title: 'Rapport mensuel complet', desc: "Vue d'ensemble financière", status: 'Disponible', statusColor: '#a855f7' },
    { title: 'Analyse Escrow', desc: "Performance du système d'escrow", status: 'En génération', statusColor: '#718096' },
    { title: 'Prédictions trimestrielles', desc: 'Projections IA 3 mois', status: 'Disponible', statusColor: '#a855f7' },
    { title: 'Audit de conformité', desc: 'Vérification réglementaire', status: 'Planifié', statusColor: '#718096' },
  ]

  const StatusBadge = ({ status }) => {
    const c = status === 'actif' ? { bg: '#dcfce7', color: '#16a34a' }
      : status === 'dépassé' ? { bg: '#fee2e2', color: '#ef4444' }
      : status === 'en attente' ? { bg: '#fef3c7', color: '#d97706' }
      : { bg: '#f3f4f6', color: '#6b7280' }
    return <span style={{ background: c.bg, color: c.color, fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '100px' }}>{status}</span>
  }

  const maxCA = Math.max(...caData)
  const maxFlux = Math.max(...fluxData.map(d => d.entrees))
  const maxPred = 140000

  return (
    <div style={{ ...s, padding: '2rem', background: '#f8f9ff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Gestion Financière</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
          <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px', border: '1px solid #bbf7d0' }}>🔒 Escrow Sécurisé</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Gestion financière • Prévisions automatiques • Optimisation des coûts</p>
      </div>

      {/* METRICS 2x3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#718096' }}>{m.label}</div>
              <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.3rem' }}>{m.value}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{m.sub}</span>
              <span style={{ background: m.pos ? '#dcfce7' : '#fee2e2', color: m.pos ? '#16a34a' : '#ef4444', fontSize: '0.68rem', fontWeight: 600, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                {m.pos ? '↗' : '↘'} {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '0.65rem 1rem', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.82rem',
            fontWeight: tab === t.id ? 700 : 400,
            background: tab === t.id ? t.activeColor : 'transparent',
            color: tab === t.id ? '#fff' : '#718096',
            borderRadius: '8px', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            whiteSpace: 'nowrap',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== VUE D'ENSEMBLE ===== */}
      {tab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Bar chart CA */}
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>↗ Chiffre d'affaires (6 derniers mois)</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingRight: '0.5rem' }}>
                  {[140000, 105000, 70000, 35000, 0].map(v => (
                    <span key={v} style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{v === 0 ? '0' : (v/1000)+'000'}</span>
                  ))}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%' }}>
                  {caData.map((v, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '100%', height: `${(v / maxCA) * 180}px`, background: 'linear-gradient(180deg,#a855f7,#6366f1)', borderRadius: '6px 6px 0 0' }} />
                      <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Donut escrow */}
            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>🕐 Répartition Escrow (€90,000)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="13" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="50 50" />
                    <circle cx="18" cy="18" r="13" fill="none" stroke="#3b82f6" strokeWidth="5" strokeDasharray="24 76" strokeDashoffset="-50" />
                    <circle cx="18" cy="18" r="13" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="9 91" strokeDashoffset="-74" />
                    <circle cx="18" cy="18" r="13" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="17 83" strokeDashoffset="-83" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a202c', textAlign: 'center' }}>€90K</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[['#f59e0b', 'En cours', '€45 000'], ['#3b82f6', 'En validation', '€22 000'], ['#ef4444', 'Bloqué', '€8 000'], ['#22c55e', 'Prêt à libérer', '€15 000']].map(([color, label, val]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                        <span style={{ fontSize: '0.78rem', color: '#4a5568' }}>{label}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1a202c' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.25rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600 }}>📄 Générer un rapport complet</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.25rem', background: '#fff', color: '#4a5568', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500 }}>🔮 Optimiser avec l'IA</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.25rem', background: '#fff', color: '#4a5568', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500 }}>⬇ Exporter les données</button>
          </div>
        </div>
      )}

      {/* ===== FLUX DE TRÉSORERIE ===== */}
      {tab === 'flux' && (
        <div>
          <div style={{ ...card, marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>↗ Analyse détaillée des flux de trésorerie</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '220px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingRight: '0.5rem' }}>
                {[32000, 24000, 16000, 8000, 0].map(v => (
                  <span key={v} style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{v === 0 ? '0' : v.toLocaleString()}</span>
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100%' }}>
                {fluxData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1, height: `${(d.entrees / 32000) * 190}px`, background: '#22c55e', borderRadius: '4px 4px 0 0' }} />
                      <div style={{ flex: 1, height: `${(d.sorties / 32000) * 190}px`, background: '#ef4444', borderRadius: '4px 4px 0 0' }} />
                      <div style={{ flex: 1, height: `${(d.escrow / 32000) * 190}px`, background: '#f59e0b', borderRadius: '4px 4px 0 0' }} />
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
              {[['#22c55e', 'Entrées'], ['#ef4444', 'Sorties'], ['#f59e0b', 'Escrow']].map(([color, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#718096' }}>
                  <div style={{ width: '12px', height: '10px', background: color, borderRadius: '2px' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
            {[['#f0fdf4', 'Entrées moyennes', '€20,814', 'Par mois'], ['#fff5f5', 'Sorties moyennes', '€12,714', 'Par mois'], ['#fefce8', 'Escrow moyen', '€5,914', 'En attente'], ['#faf5ff', 'Marge nette', '€8,100', 'Bénéfice mensuel']].map(([bg, label, val, sub]) => (
              <div key={label} style={{ ...card, background: bg }}>
                <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.4rem' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.2rem' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PAIEMENTS INFLUENCEURS ===== */}
      {tab === 'paiements' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>👥 Paiements Influenceurs</div>
            <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '1rem' }}>Gérez les paiements pour vos affiliations et influenceurs en un seul endroit</div>

            {/* Sub tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button style={{ padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600 }}>Paiements d'Affiliation</button>
              <button style={{ padding: '0.55rem 1.25rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem' }}>Paiements par Source ⓘ</button>
            </div>

            {/* Libération auto */}
            <div style={{ ...card, marginBottom: '1.5rem', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#a855f7' }}>🔒 Libération automatique programmée</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.25rem' }}>✓ Prochaine libération</div>
                  <div style={{ fontSize: '0.82rem', color: '#4a5568' }}>1re Mois TTO • Équivalent €5,800</div>
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.25rem' }}>✓ Transparence totale / Contacter Partnexx</div>
                  <div style={{ fontSize: '0.82rem', color: '#4a5568' }}>1098 72% / 328 10%</div>
                </div>
              </div>
            </div>

            {/* Performance du mois */}
            <div style={{ ...card, marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>↗ Performance du mois</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[['Total généré', '€20,700', '#22c55e'], ['Ventes totales', '122', '#1a202c'], ['Commissions totales', '€24,150', '#a855f7'], ['Top performer', '@emma_fashion', '#3b82f6']].map(([label, val, color]) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ fontWeight: 700, color, fontSize: '0.95rem' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campagnes */}
            {campagnes.map((camp, ci) => (
              <div key={ci} style={{ ...card, marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{camp.name}</span>
                      <span style={{ background: '#f3f4f6', color: '#718096', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{camp.type}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginTop: '0.2rem' }}>
                      Contribution: {camp.budget} • Revenus générés: {camp.revenus} • Ventes: {camp.ventes}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: '#4a5568' }}>✓ Tout libérer</button>
                    <button style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: '#4a5568' }}>✓ Très bien</button>
                    <button style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: '#4a5568' }}>✓ Réjeter</button>
                    <button style={{ padding: '0.4rem 0.75rem', background: '#dcfce7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Libérer tout les paiements</button>
                  </div>
                </div>
                {camp.influenceurs.map((inf, ii) => (
                  <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderTop: '1px solid #f5f5f5' }}>
                    <div style={{ flex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{inf.name}</span>
                        {inf.tags.map(tag => (
                          <span key={tag} style={{ background: tag === 'actif' ? '#dcfce7' : tag === 'en attente' ? '#fef3c7' : '#f3f4f6', color: tag === 'actif' ? '#16a34a' : tag === 'en attente' ? '#d97706' : '#6b7280', fontSize: '0.62rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>Depuis {new Date().toLocaleDateString('fr-FR')} • 1 ventes • {inf.pays?.split('•')[1]} générés</div>
                    </div>
                    <div style={{ flex: 1, fontSize: '0.75rem', color: '#4a5568' }}>{inf.ref}</div>
                    <div style={{ flex: 1, display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.875rem' }}>{inf.montant}</span>
                      <button style={{ padding: '0.3rem 0.6rem', background: '#dcfce7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.65rem', color: '#16a34a', fontWeight: 600 }}>Libérer maintenant</button>
                      <button style={{ padding: '0.3rem 0.6rem', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.65rem', color: '#4a5568' }}>Détails</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PAIEMENTS PAR ESCROW (sub-tab of paiements) ===== */}
      {tab === 'escrow' && (
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>🔒 Paiements par Escrow</div>
          <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '1.25rem' }}>Placement de produit ⓘ</div>
          {escrowPaiements.map((section, si) => (
            <div key={si} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a202c', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {section.category} <span style={{ color: '#a0aec0', fontSize: '0.7rem' }}>ⓘ</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 0.8fr', gap: '0.5rem', padding: '0.4rem 0.5rem', background: '#f8f9fa', borderRadius: '6px', marginBottom: '0.4rem', fontSize: '0.68rem', color: '#a0aec0', fontWeight: 600 }}>
                {['Influenceur', 'Montant total', 'Prochain paiement', 'Fréquence', 'Statut', 'Actions'].map(h => <div key={h}>{h}</div>)}
              </div>
              {section.items.map((item, ii) => (
                <div key={ii} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 0.8fr', gap: '0.5rem', padding: '0.55rem 0.5rem', borderBottom: '1px solid #f5f5f5', fontSize: '0.78rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#a0aec0' }}>{item.handle}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{item.montant}</div>
                  <div style={{ color: '#4a5568', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.7rem' }}>📅</span> {item.prochainPaiement}
                  </div>
                  <div style={{ color: '#718096' }}>{item.freq}</div>
                  <StatusBadge status={item.status} />
                  <button style={{ padding: '0.3rem 0.6rem', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.65rem', color: '#4a5568' }}>Détails</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ===== PRÉDICTIONS IA ===== */}
      {tab === 'predictions' && (
        <div>
          <div style={{ ...card, marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>🔮 Prédictions vs Réalité - Performance IA</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', position: 'relative', paddingBottom: '1.5rem' }}>
              {/* Y axis */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingRight: '0.5rem' }}>
                {[140000, 105000, 70000, 35000, 0].map(v => (
                  <span key={v} style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{v === 0 ? '0' : (v/1000*1000).toLocaleString()}</span>
                ))}
              </div>
              {/* SVG line chart */}
              <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 700 190" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                    <line key={i} x1="0" y1={190 - pct * 190} x2="700" y2={190 - pct * 190} stroke="#f0f0f0" strokeWidth="1" />
                  ))}
                  {/* Prediction dashed line */}
                  <polyline
                    fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6,4"
                    points={predPoints.map((p, i) => `${i * (700/6)},${190 - (p.pred / maxPred) * 180}`).join(' ')}
                  />
                  {/* Reel solid line */}
                  <polyline
                    fill="none" stroke="#a855f7" strokeWidth="2.5"
                    points={predPoints.filter(p => p.reel).map((p, i) => `${i * (700/6)},${190 - (p.reel / maxPred) * 180}`).join(' ')}
                  />
                  {/* Dots */}
                  {predPoints.filter(p => p.reel).map((p, i) => (
                    <circle key={i} cx={i * (700/6)} cy={190 - (p.reel / maxPred) * 180} r="5" fill="#a855f7" />
                  ))}
                </svg>
                {/* X labels */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
                  {predPoints.map(p => (
                    <span key={p.month} style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{p.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {[['#f0fdf4', 'Précision IA', '94.2%', 'Derniers 6 mois'], ['#faf5ff', 'Prédiction Juillet', '€125,000', 'Confiance: 89%'], ['#fefce8', 'Écart moyen', '±€2,800', "Marge d'erreur"]].map(([bg, label, val, sub]) => (
              <div key={label} style={{ ...card, background: bg }}>
                <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.4rem' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.2rem' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== RAPPORTS ===== */}
      {tab === 'rapports' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>📄 Rapports automatiques</div>
            {rapports.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: i < rapports.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{r.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{r.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: r.status === 'Disponible' ? '#f3e8ff' : '#f3f4f6', color: r.statusColor, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{r.status}</span>
                  {r.status === 'Disponible' && (
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>⬇</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>⚡ Actions rapides</div>
            <button style={{ width: '100%', padding: '0.75rem 1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📄 Générer rapport personnalisé
            </button>
            {[['🔮', 'Analyse IA approfondie'], ['⬆', 'Importer données externes'], ['📅', 'Programmer rapport automatique'], ['⚙', 'Configurer alertes financières']].map(([icon, label]) => (
              <button key={label} style={{ width: '100%', padding: '0.75rem 1rem', background: '#fff', color: '#4a5568', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}