'use client'
import { useState } from 'react'
import { useTheme } from '../../ThemeContext'

export default function MesCollaborations() {
  const { isDark, colors } = useTheme()
  const [mainTab, setMainTab] = useState('encours')
  const [expanded, setExpanded] = useState({})
  const [search, setSearch] = useState('')

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const metrics = [
    { label: 'Revenus totaux', value: '8145€', delta: '+12%', icon: '💰', bg: isDark ? '#0d2e1a' : '#f0fdf4', color: '#22c55e' },
    { label: 'Engagement moyen', value: '6.9%', delta: 'Moyen', icon: '❤️', bg: isDark ? '#1a0a2e' : '#faf5ff', color: '#a855f7' },
    { label: 'Vue totales', value: '563K', delta: '+8%', icon: '👁', bg: isDark ? '#0d1a2e' : '#eff6ff', color: '#3b82f6' },
    { label: 'Collaborations', value: '8', delta: 'Total', icon: '🤝', bg: isDark ? '#2a1a00' : '#fff7ed', color: '#f97316' },
  ]

  const collabsEnCours = [
    {
      id: 'cm1',
      initials: 'CM', color: '#ec4899',
      name: 'Collection Mode Été', stars: 5,
      brand: 'FashionBrand', tags: ['Terminé', 'Validé'],
      dateDebut: '30 Novembre 2023',
      montant: '850€', butsActuels: '42K', progression: '85%',
      ia: 'Collaboration exceptionnelle · Très professionnel en créant !',
      details: {
        titre: 'Voir les détails complets',
        statut: 'Terminé', score: '8/3',
        desc: 'Rapport complet de collaboration avec FashionBrand en fonctionnant Disponible',
        budget: '850€',
        vues: '42K',
        progression: '85%',
        livrables: ['📸 Photos', '📅 Rappelé le 30 Novembre 2023', '📝 Notes et revue', '📊 Rapport complet'],
      },
      performances: { posts: 3, vues: '42K', progression: '85%', partages: '0.7%' },
      statusColor: '#22c55e', status: 'Terminé',
    },
    {
      id: 'lp1',
      initials: 'LP', color: '#f59e0b',
      name: 'Lancement Produit Fitness', stars: 4,
      brand: 'FitnessPro', tags: ['Actif'],
      dateDebut: '9 Octobre 2023',
      montant: '650€', butsActuels: '38K', progression: '2.4%',
      ia: "Bonne collaboration quelques retouds de payment",
      details: {
        titre: 'Voir les détails complets',
        statut: 'Actif', score: '9/5',
        desc: 'Rapport complet de collaboration avec FitnessPro en fonctionnant Disponible',
        budget: '650€',
        vues: '38K',
        progression: '2.4%',
        livrables: ['📸 Photos', '📅 Rappelé le 9 Octobre 2023', '📝 Notes et revue', '📊 Rapport complet'],
      },
      performances: { posts: 2, vues: '38K', progression: '2.4%', partages: '1.2%' },
      statusColor: '#a855f7', status: 'Actif',
    },
    {
      id: 'cr1',
      initials: 'CR', color: '#22c55e',
      name: 'Campagne Restaurant Gastronomique', stars: 5,
      brand: 'Le Gourmet', tags: ['Terminé'],
      dateDebut: '30 Septembre 2023',
      montant: '720€', butsActuels: '19K', progression: '7.6%',
      ia: "Expérience complète · un détail au petit soin",
      details: {
        titre: 'Voir les détails complets',
        statut: 'Terminé', score: '5/7',
        desc: 'Rapport complet de collaboration avec Le Gourmet en fonctionnant Disponible',
        budget: '720€',
        vues: '19K',
        progression: '7.6%',
        livrables: ['📸 Photos', '📅 Rappelé le 30 Septembre 2023', '📝 Notes et revue', '📊 Rapport complet'],
      },
      performances: { posts: 1, vues: '19K', progression: '7.6%', partages: '3.0%' },
      statusColor: '#22c55e', status: 'Terminé',
    },
    {
      id: 'sd1',
      initials: 'SD', color: '#6366f1',
      name: 'Série Décoration Intérieure', stars: 3,
      brand: 'HomeDesk', tags: ['Pause'],
      dateDebut: '9 Août 2023',
      montant: 'Produit (+380€)', butsActuels: '48K', progression: '4.2%',
      ia: "Collaboration correct mais communication difficile",
      details: {
        titre: 'Voir les détails complets',
        statut: 'Pause', score: '6/0',
        desc: 'Rapport complet de collaboration avec HomeDesk en fonctionnant Disponible',
        budget: 'Produit (+380€)',
        vues: '48K',
        progression: '4.2%',
        livrables: ['📸 Photos', '📅 Rappelé le 9 Août 2023', '📝 Notes et revue', '📊 Rapport complet'],
      },
      performances: { posts: 4, vues: '48K', progression: '4.2%', partages: '0.8%' },
      statusColor: '#f59e0b', status: 'Pause',
    },
  ]

  const collabsTerminees = [
    {
      id: 'csf1',
      initials: 'CS', color: '#22c55e',
      name: 'Campagne Skincare Naturelle', stars: 5,
      brand: 'GreenBeauty', tags: ['Terminé', 'Actif'],
      dateDebut: '5 Mars 2024',
      montant: '400€', butsActuels: '28K', progression: '98%',
      ia: null,
      details: {
        titre: 'Voir tous les détails',
        statut: 'Terminé', score: '91',
        desc: 'Rapport complet de collaboration avec GreenBeauty en fonctionnant Disponible',
        budget: '400€',
        vues: '28K',
        progression: '98%',
        livrables: ['📸 Tirés', '🎬 Vidéoductions', '📊 TechMarketing'],
      },
      performances: { posts: '204%', vues: '2.3K', taux: '5.1K', partages: '3.06' },
      statusColor: '#22c55e', status: 'Terminé',
      livrables: [
        { icon: '📸', label: 'Photos', count: 3, status: 'Terminé' },
        { icon: '📝', label: 'Reel Instagram', status: 'Terminé' },
        { icon: '🎬', label: 'Story', status: 'Terminé' },
        { icon: '📊', label: 'Rapport résultat', status: 'Terminé' },
        { icon: '📝', label: 'Témoignage', status: 'Terminé' },
      ],
    },
    {
      id: 'rts1',
      initials: 'RT', color: '#3b82f6',
      name: 'Review Tech Smartwatch', stars: 4,
      brand: 'TechPulse', tags: ['Terminé', 'Actif'],
      dateDebut: '5 Février 2024',
      montant: '550€', butsActuels: '67,000 vues', progression: '82%',
      ia: null,
      details: {
        titre: 'Voir tous les détails',
        statut: 'Terminé', score: '87',
        desc: 'Rapport complet de collaboration avec TechPulse en fonctionnant Disponible',
        budget: '550€',
        vues: '67K',
        progression: '82%',
        livrables: ['📸 Tirés', '🎬 Vidéoductions', '📊 TechMarketing'],
      },
      performances: { posts: '182%', vues: '2.8K', taux: '8.4K', partages: '2.91' },
      statusColor: '#22c55e', status: 'Terminé',
      livrables: [
        { icon: '🎬', label: 'Vidéo YouTube', status: 'Terminé' },
        { icon: '📝', label: 'Reel Instagram', status: 'Terminé' },
        { icon: '📸', label: 'Unboxing TikTok', status: 'Terminé' },
        { icon: '📊', label: 'Témoignage', status: 'Terminé' },
      ],
    },
    {
      id: 'pfp1',
      initials: 'PF', color: '#a855f7',
      name: 'Partenariat Fitness Premium', stars: 5,
      brand: 'SportElite', tags: ['Terminé', 'Actif'],
      dateDebut: '15 Janvier 2024',
      montant: '+1200€', butsActuels: '89K', progression: '95%',
      ia: null,
      details: {
        titre: 'Voir tous les détails',
        statut: 'Terminé', score: '94',
        desc: 'Rapport complet de collaboration avec SportElite Disponible',
        budget: '+1200€',
        vues: '89K',
        progression: '95%',
        livrables: ['📸 Tirés', '🎬 Vidéoductions', '📊 TechMarketing'],
      },
      performances: { posts: '245%', vues: '4.2K', taux: '12.1K', partages: '4.85' },
      statusColor: '#22c55e', status: 'Terminé',
      livrables: [
        { icon: '📸', label: "Programme d'entraînement", status: 'Terminé' },
        { icon: '🎬', label: 'Série de vidéos (x4)', status: 'Terminé' },
        { icon: '📝', label: 'Live Q&A', status: 'Terminé' },
        { icon: '📊', label: 'Témoignage vidéo', status: 'Terminé' },
      ],
    },
  ]

  const card = { background: colors.cardBg, borderRadius: '14px', border: '1px solid ' + colors.cardBorder, boxShadow: colors.shadow, transition: 'background 0.3s' }

  const StatusBadge = ({ status, color }) => (
    <span style={{ background: color + '20', color, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '100px' }}>{status}</span>
  )

  const Stars = ({ count }) => (
    <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>
  )

  const CollabEnCours = ({ c }) => {
    const open = expanded[c.id]
    return (
      <div style={{ ...card, marginBottom: '1rem', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => toggleExpand(c.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{c.initials}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>{c.name}</span>
                  <Stars count={c.stars} />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.15rem' }}>
                  <span style={{ fontSize: '0.72rem', color: colors.textSecondary }}>{c.brand}</span>
                  {c.tags.map(t => (
                    <span key={t} style={{ background: t === 'Terminé' ? '#dcfce7' : t === 'Actif' ? '#dbeafe' : '#fef3c7', color: t === 'Terminé' ? '#16a34a' : t === 'Actif' ? '#1d4ed8' : '#d97706', fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <StatusBadge status={c.status} color={c.statusColor} />
              <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>{open ? '▲' : '▼'}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '0.85rem' }}>
            {[['📅 Date de fin', c.dateDebut], ['💰 Montant', c.montant], ['👁 Buts actuels', c.butsActuels], ['📈 Progression', c.progression]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: '0.68rem', color: colors.textMuted, marginBottom: '0.15rem' }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: colors.text }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* IA Banner */}
        {c.ia && (
          <div style={{ background: isDark ? 'rgba(236,72,153,0.12)' : '#fdf2f8', borderTop: '1px solid ' + (isDark ? 'rgba(236,72,153,0.2)' : '#fbcfe8'), padding: '0.5rem 1.25rem', fontSize: '0.75rem', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            ✦ {c.ia}
          </div>
        )}

        {/* Détails dépliables */}
        {open && (
          <div style={{ borderTop: '1px solid ' + colors.border, padding: '1rem 1.25rem', background: isDark ? 'rgba(168,85,247,0.05)' : '#faf5ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff' }}>⓪</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: colors.text }}>{c.details.titre}</div>
                  <div style={{ fontSize: '0.68rem', color: colors.textSecondary }}>{c.details.desc}</div>
                </div>
                <span style={{ background: c.statusColor + '20', color: c.statusColor, fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{c.details.statut}</span>
                <span style={{ background: '#a855f720', color: '#a855f7', fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>IA {c.details.score}</span>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: '0.9rem' }}>↗</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {[['💰', c.details.budget], ['👁', c.details.vues], ['📈', c.details.progression]].map(([icon, val], i) => (
                <div key={i} style={{ background: colors.inputBg, borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span>{icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem', color: colors.text }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {c.details.livrables.map((l, i) => (
                <button key={i} style={{ padding: '0.3rem 0.65rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>{l}</button>
              ))}
              <button style={{ padding: '0.3rem 0.65rem', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 600 }}>Rapport complet</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const CollabTerminee = ({ c }) => {
    const open = expanded[c.id]
    return (
      <div style={{ ...card, marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => toggleExpand(c.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{c.initials}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>{c.name}</span>
                  <Stars count={c.stars} />
                  {c.tags.map(t => (
                    <span key={t} style={{ background: t === 'Terminé' ? '#dcfce7' : '#dbeafe', color: t === 'Terminé' ? '#16a34a' : '#1d4ed8', fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', color: colors.textSecondary, marginTop: '0.15rem' }}>{c.brand}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#22c55e' }}>Score: {c.details.score}</span>
              <button style={{ padding: '0.3rem 0.65rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>Renew</button>
              <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>{open ? '▲' : '▼'}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '0.75rem' }}>
            {[['📅 Période', c.dateDebut], ['💰 Total Payé', c.montant], ['📈 Progression', c.details.progression + ' ' + c.butsActuels]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: '0.68rem', color: colors.textMuted }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: colors.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Livrables */}
          {c.livrables && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: colors.textSecondary, marginBottom: '0.4rem' }}>Livrables ✓</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {c.livrables.map((l, i) => (
                  <div key={i} style={{ display: 'flex', align: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', background: '#dcfce7', borderRadius: '6px', fontSize: '0.68rem', color: '#16a34a' }}>
                    {l.icon} {l.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performances */}
          <div style={{ background: isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4', border: '1px solid ' + (isDark ? 'rgba(34,197,94,0.2)' : '#bbf7d0'), borderRadius: '8px', padding: '0.6rem 1rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.3rem' }}>Performances</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[['📈 Posts', c.performances.posts], ['👁 Vues', c.performances.vues], ['💬 Taux', c.performances.taux], ['↗ Partages', c.performances.partages]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: '0.62rem', color: colors.textMuted }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#22c55e' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {open && (
          <div style={{ borderTop: '1px solid ' + colors.border, padding: '1rem 1.25rem', background: isDark ? 'rgba(168,85,247,0.05)' : '#faf5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff' }}>⓪</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: colors.text }}>{c.details.titre}</div>
                <div style={{ fontSize: '0.68rem', color: colors.textSecondary }}>{c.details.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['📸 Tirés', '🎬 Vidéoductions', '📊 TechMarketing'].map((l, i) => (
                <button key={i} style={{ padding: '0.3rem 0.65rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>{l}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: colors.textMuted }}>⓪ {c.details.score}</span>
              <button style={{ padding: '0.3rem 0.65rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>Contrat</button>
              <button style={{ padding: '0.3rem 0.65rem', background: colors.surface, border: '1px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', color: colors.textSecondary }}>Message</button>
              <button onClick={() => alert('Renouvelement en cours...')} style={{ padding: '0.3rem 0.65rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 600 }}>Renew</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', background: colors.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.3s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: colors.text, margin: 0 }}>Mes collaborations</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA actif</span>
        </div>
        <p style={{ color: colors.textSecondary, margin: 0, fontSize: '0.82rem' }}>Historique de vos Missions • Résultats Globaux • Performance Détaillée</p>
      </div>

      {/* MÉTRIQUES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: m.bg, borderRadius: '12px', border: '1px solid ' + m.color + '30', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>{m.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
              <span style={{ background: m.color + '20', color: m.color, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '100px' }}>{m.delta}</span>
              <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }}>🔍</span>
        <input type="text" placeholder="Rechercher une campagne..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', border: '1px solid ' + colors.border, borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: colors.text, background: colors.inputBg, boxSizing: 'border-box' }} />
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'encours', label: 'En cours', count: collabsEnCours.length, activeColor: '#ec4899' },
          { id: 'terminees', label: 'Terminées', count: collabsTerminees.length, activeColor: '#22c55e' },
        ].map(t => (
          <button key={t.id} onClick={() => setMainTab(t.id)} style={{
            padding: '0.65rem 1.5rem', border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600,
            background: mainTab === t.id ? t.activeColor : colors.cardBg,
            color: mainTab === t.id ? '#fff' : colors.textSecondary,
            border: mainTab === t.id ? 'none' : '1px solid ' + colors.border,
            boxShadow: mainTab === t.id ? '0 4px 12px ' + t.activeColor + '40' : colors.shadow,
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            {t.label}
            <span style={{ background: mainTab === t.id ? 'rgba(255,255,255,0.25)' : colors.border, color: mainTab === t.id ? '#fff' : colors.textMuted, fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '100px' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* LISTE EN COURS */}
      {mainTab === 'encours' && (
        <div>
          {collabsEnCours
            .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
            .map(c => <CollabEnCours key={c.id} c={c} />)}
        </div>
      )}

      {/* LISTE TERMINÉES */}
      {mainTab === 'terminees' && (
        <div>
          {collabsTerminees
            .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
            .map(c => <CollabTerminee key={c.id} c={c} />)}
        </div>
      )}
    </div>
  )
}