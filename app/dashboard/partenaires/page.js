'use client'
import { useState } from 'react'

export default function Partenaires() {
  const [activeTab, setActiveTab] = useState('tous')
  const [viewMode, setViewMode] = useState('tableau')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('Tous')
  const [showAddModal, setShowAddModal] = useState(false)

  const s = { fontFamily: "'Plus Jakarta Sans', sans-serif" }
  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }

  // ---- DATA ----
  const ambassadeurs = [
    { initials: 'MD', color: '#a855f7', name: 'Marie Dubois', handle: '@greenbeauty', reseau: 'Beauté', dateDebut: '2024-01-15', campagnes: 'Campagne Printemps 2024, Lancement Sérum', statut: 'Actif', star: true },
    { initials: 'JL', color: '#ec4899', name: 'Julie Laurent', handle: '@juliebeauty', reseau: 'Beauté', dateDebut: '2023-09-01', campagnes: 'Collection Automne, Makeup Master Class', statut: 'Actif', star: true },
    { initials: 'AP', color: '#6366f1', name: 'Alexandre Petit', handle: '@alexpetit_life', reseau: 'Lifestyle', dateDebut: '2024-03-10', campagnes: 'Style Été 2024, Voyage Méditerranée', statut: 'Actif', star: true },
  ]

  const affilies = [
    { initials: 'TM', color: '#a855f7', name: 'Thomas Martin', handle: '@techflow', reseau: 'Tech', lien: 'TECHFLOW20', ventes: 156, commission: '3420€', statut: 'Actif', star: true },
    { initials: 'ER', color: '#22c55e', name: 'Emma Rodriguez', handle: '@emmafit', reseau: 'Sport', lien: 'EMMAFIT15', ventes: 243, commission: '5860€', statut: 'Actif', star: true },
    { initials: 'LB', color: '#3b82f6', name: 'Lucas Bernard', handle: '@lucasgaming', reseau: 'Gaming', lien: 'LUCAS10', ventes: 412, commission: '8650€', statut: 'Actif', star: true },
  ]

  const oneshots = [
    { initials: 'SC', color: '#f59e0b', name: 'Sarah Chen', handle: '@summervibes', reseau: 'Lifestyle', dateCollab: '2024-08-22', contenu: '3 posts Instagram + 1 Reel', statut: 'Actif', star: false },
    { initials: 'PF', color: '#ef4444', name: 'Pierre Fontaine', handle: '@pierrecuisine', reseau: 'Food', dateCollab: '2024-09-15', contenu: '2 posts + 3 Stories + 1 vidéo YouTube', statut: 'Actif', star: false },
    { initials: 'CM', color: '#a855f7', name: 'Camille Moreau', handle: '@camille_mode', reseau: 'Mode', dateCollab: '2024-10-05', contenu: '1 Reel + 2 posts + Lookbook', statut: 'Actif', star: true },
  ]

  const placements = [
    { initials: 'LG', color: '#22c55e', name: 'Leo Garcia', handle: '@fitmode', reseau: 'Sport', produit: 'Shaker Protéine Premium', valeur: '89€', dateEnvoi: '2024-10-12', statut: 'Prospect', star: true },
    { initials: 'SM', color: '#ec4899', name: 'Sophie Mercier', handle: '@sophiebeauté', reseau: 'Beauté', produit: 'Coffret Skincare Luxe', valeur: '245€', dateEnvoi: '2024-11-02', statut: 'Actif', star: true },
    { initials: 'AD', color: '#6366f1', name: 'Antoine Durand', handle: '@antoinetech', reseau: 'Tech', produit: 'Écouteurs Sans Fil Pro', valeur: '179€', dateEnvoi: '2024-10-28', statut: 'Actif', star: true },
  ]

  const campagnes = [
    { initials: 'RM', color: '#f97316', name: 'Raphaël Morel', handle: '@cityfood', reseau: 'Food', campagne: 'Campagne Gastronomie France', marques: 'ChefPro, VinExcellence', budget: '45000€', resultats: '2.5M impressions, 125K engagements', statut: 'Actif', star: true },
    { initials: 'IR', color: '#3b82f6', name: 'Isabelle Rousseau', handle: '@isabelletravel', reseau: 'Voyage', campagne: 'Destinations Europe 2024', marques: 'AirVoyage, HotelLuxe', budget: '62000€', resultats: '3.8M impressions, 187K engagements, 12K clics', statut: 'Actif', star: true },
  ]

  const ugc = [
    { initials: 'NK', color: '#718096', name: 'Nina Keller', handle: '@eco.home', reseau: 'Maison', livrables: 12, feedback: 'Excellent travail, très créatif', statutLivraison: 'Validé', statut: 'Inactif', star: false },
    { initials: 'MB', color: '#a855f7', name: 'Maxime Blanc', handle: '@maxcontent', reseau: 'Marketing', livrables: 24, feedback: 'Très professionnel, délais respectés', statutLivraison: 'Livré', statut: 'Actif', star: true },
    { initials: 'CD', color: '#ec4899', name: 'Clara Dupont', handle: '@claracreative', reseau: 'Lifestyle', livrables: 18, feedback: 'Contenu de haute qualité', statutLivraison: 'En attente', statut: 'Actif', star: true },
  ]

  const allPartenaires = [
    ...ambassadeurs.map(p => ({ ...p, type: 'Ambassadeur' })),
    ...affilies.map(p => ({ ...p, type: 'Affilié' })),
    ...oneshots.map(p => ({ ...p, type: 'One-Shot' })),
    ...placements.map(p => ({ ...p, type: 'Placement' })),
    ...campagnes.map(p => ({ ...p, type: 'Campagne' })),
    ...ugc.map(p => ({ ...p, type: 'UGC' })),
  ]

  const tabs = [
    { id: 'tous', label: 'Tous', count: 17, icon: '📊' },
    { id: 'ambassadeurs', label: 'Ambassadeurs', count: 3, icon: '👑' },
    { id: 'affilies', label: 'Affiliés', count: 3, icon: '🔥' },
    { id: 'oneshot', label: 'One-Shot', count: 3, icon: '⚡' },
    { id: 'placements', label: 'Placements', count: 3, icon: '📦' },
    { id: 'campagnes', label: 'Campagnes', count: 2, icon: '🎯' },
    { id: 'ugc', label: 'UGC', count: 3, icon: '🎬' },
  ]

  const Avatar = ({ initials, color, size = 36 }) => (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color + '22', border: `2px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.33 + 'px', fontWeight: 700, color, flexShrink: 0 }}>
      {initials}
    </div>
  )

  const StatusBadge = ({ statut }) => {
    const colors = {
      'Actif': { bg: '#dcfce7', color: '#16a34a' },
      'Inactif': { bg: '#f3f4f6', color: '#6b7280' },
      'Prospect': { bg: '#dbeafe', color: '#2563eb' },
    }
    const c = colors[statut] || colors['Actif']
    return <span style={{ background: c.bg, color: c.color, fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '100px' }}>{statut}</span>
  }

  const DeliveryBadge = ({ statut }) => {
    const colors = {
      'Validé': { bg: '#dbeafe', color: '#2563eb' },
      'Livré': { bg: '#dcfce7', color: '#16a34a' },
      'En attente': { bg: '#fef3c7', color: '#d97706' },
    }
    const c = colors[statut] || { bg: '#f3f4f6', color: '#6b7280' }
    return <span style={{ background: c.bg, color: c.color, fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '100px' }}>{statut}</span>
  }

  const NicheTag = ({ label }) => (
    <span style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.72rem', fontWeight: 500, padding: '0.25rem 0.65rem', borderRadius: '6px' }}>{label}</span>
  )

  const ActionBtn = () => (
    <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>💬</button>
  )

  const thStyle = { fontSize: '0.72rem', color: '#a0aec0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0.6rem 0.75rem', background: '#f8f9fa', textAlign: 'left' }
  const tdStyle = { padding: '0.85rem 0.75rem', fontSize: '0.875rem', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' }

  const TableWrapper = ({ headers, children }) => (
    <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )

  const PartnerCell = ({ p }) => (
    <td style={tdStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Avatar initials={p.initials} color={p.color} />
        <div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {p.name} {p.star && <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★</span>}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{p.handle}</div>
        </div>
      </div>
    </td>
  )

  return (
    <div style={{ ...s, background: '#f8f9ff', minHeight: '100vh', padding: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Partenaires</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Matching intelligent • Analytics avancées • Partenariats optimisés</p>
      </div>

      {/* SUGGESTIONS IA */}
      <div style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #faf5ff 100%)', border: '1.5px solid #e9d5ff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1a202c' }}>
          ✦ Suggestions IA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {[
            { initials: 'MD', color: '#a855f7', name: 'Marie Dubois', handle: '@greenbeauty', match: 95, titre: 'Campagne skincare automne +30% ROI estimé', points: ['Audience similaire à vos campagnes beauté', "Taux d'engagement optimal"] },
            { initials: 'RM', color: '#f97316', name: 'Raphaël Morel', handle: '@cityfood', match: 91, titre: 'Collaboration restaurant premium', points: ['Expertise culinaire reconnue', 'Audience locale forte'] },
            { initials: 'TM', color: '#6366f1', name: 'Thomas Martin', handle: '@techflow', match: 88, titre: 'Lancement produit tech Q4', points: ['Leader tech émergent', 'Reviews authentiques'] },
          ].map((sug) => (
            <div key={sug.name} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '1.1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Avatar initials={sug.initials} color={sug.color} size={38} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sug.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sug.handle}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#a855f7', fontSize: '1rem' }}>{sug.match}%</div>
                  <div style={{ fontSize: '0.65rem', color: '#a0aec0' }}>Match</div>
                </div>
              </div>
              <div style={{ color: '#a855f7', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.5rem' }}>{sug.titre}</div>
              {sug.points.map(pt => (
                <div key={pt} style={{ fontSize: '0.78rem', color: '#4a5568', marginBottom: '0.2rem' }}>• {pt}</div>
              ))}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.9rem' }}>
                <button style={{ flex: 1, padding: '0.55rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  💬 Contacter
                </button>
                <button style={{ flex: 1, padding: '0.55rem', background: '#fff', color: '#4a5568', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 500 }}>
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH + ACTIONS BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: '0.875rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher nom, @handle, niche, localisation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', color: '#4a5568', background: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filtre */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#4a5568' }}>
              <span>⚙</span> {filter} <span style={{ fontSize: '0.65rem', color: '#a0aec0' }}>▼</span>
            </button>
            {filterOpen && (
              <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '140px', overflow: 'hidden' }}>
                {['Tous', 'Actif', 'Inactif', 'Prospect'].map(f => (
                  <button key={f} onClick={() => { setFilter(f); setFilterOpen(false) }} style={{ width: '100%', padding: '0.6rem 1rem', background: filter === f ? 'rgba(168,85,247,0.08)' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: filter === f ? '#a855f7' : '#4a5568', fontWeight: filter === f ? 600 : 400, textAlign: 'left', borderBottom: '1px solid #f5f5f5' }}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vue toggle */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '3px' }}>
            {['Cartes', 'Tableau'].map(v => (
              <button key={v} onClick={() => setViewMode(v.toLowerCase())} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: viewMode === v.toLowerCase() ? 700 : 400, background: viewMode === v.toLowerCase() ? '#fff' : 'transparent', color: viewMode === v.toLowerCase() ? '#1a202c' : '#718096', boxShadow: viewMode === v.toLowerCase() ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Ajouter Partenaire */}
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
          👤+ Ajouter Partenaire
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: activeTab === t.id ? 700 : 400, background: activeTab === t.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#fff', color: activeTab === t.id ? '#fff' : '#718096', border: activeTab === t.id ? 'none' : '1px solid #e2e8f0', transition: 'all 0.15s' }}>
            {t.icon} {t.label} <span style={{ background: activeTab === t.id ? 'rgba(255,255,255,0.25)' : '#f3f4f6', color: activeTab === t.id ? '#fff' : '#718096', borderRadius: '100px', padding: '0.05rem 0.4rem', fontSize: '0.68rem', fontWeight: 700 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ===== TOUS ===== */}
      {activeTab === 'tous' && (
        <TableWrapper headers={['Partenaire', 'Type', 'Réseau principal', 'Statut', 'Actions']}>
          {allPartenaires.map((p, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <PartnerCell p={p} />
              <td style={tdStyle}><span style={{ background: '#f3f4f6', color: '#4a5568', fontSize: '0.72rem', fontWeight: 500, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>{p.type}</span></td>
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* ===== AMBASSADEURS ===== */}
      {activeTab === 'ambassadeurs' && (
        <TableWrapper headers={['Partenaire', 'Réseau principal', 'Date début contrat', 'Dernières campagnes', 'Statut', 'Actions']}>
          {ambassadeurs.map((p, i) => (
            <tr key={i}>
              <PartnerCell p={p} />
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={{ ...tdStyle, color: '#4a5568' }}>{p.dateDebut}</td>
              <td style={{ ...tdStyle, color: '#4a5568', fontSize: '0.82rem' }}>{p.campagnes}</td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* ===== AFFILIÉS ===== */}
      {activeTab === 'affilies' && (
        <TableWrapper headers={['Partenaire', 'Réseau principal', 'Lien/Code', 'Ventes', 'Commission', 'Statut', 'Actions']}>
          {affilies.map((p, i) => (
            <tr key={i}>
              <PartnerCell p={p} />
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#4a5568', fontSize: '0.82rem' }}>{p.lien}</td>
              <td style={{ ...tdStyle, fontWeight: 600, color: '#1a202c' }}>{p.ventes}</td>
              <td style={{ ...tdStyle, fontWeight: 700, color: '#22c55e' }}>{p.commission}</td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* ===== ONE-SHOT ===== */}
      {activeTab === 'oneshot' && (
        <TableWrapper headers={['Partenaire', 'Réseau principal', 'Date collab', 'Contenu livré', 'Statut', 'Actions']}>
          {oneshots.map((p, i) => (
            <tr key={i}>
              <PartnerCell p={p} />
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={{ ...tdStyle, color: '#4a5568' }}>{p.dateCollab}</td>
              <td style={{ ...tdStyle, color: '#4a5568', fontSize: '0.82rem' }}>{p.contenu}</td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* ===== PLACEMENTS ===== */}
      {activeTab === 'placements' && (
        <TableWrapper headers={['Partenaire', 'Réseau principal', 'Produit', 'Valeur', "Date d'envoi", 'Statut', 'Actions']}>
          {placements.map((p, i) => (
            <tr key={i}>
              <PartnerCell p={p} />
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={{ ...tdStyle, color: '#4a5568', fontSize: '0.82rem' }}>{p.produit}</td>
              <td style={{ ...tdStyle, fontWeight: 600, color: '#1a202c' }}>{p.valeur}</td>
              <td style={{ ...tdStyle, color: '#4a5568' }}>{p.dateEnvoi}</td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* ===== CAMPAGNES ===== */}
      {activeTab === 'campagnes' && (
        <TableWrapper headers={['Partenaire', 'Réseau principal', 'Campagne', 'Marques', 'Budget', 'Résultats', 'Statut', 'Actions']}>
          {campagnes.map((p, i) => (
            <tr key={i}>
              <PartnerCell p={p} />
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={{ ...tdStyle, fontWeight: 600, fontSize: '0.82rem' }}>{p.campagne}</td>
              <td style={{ ...tdStyle, color: '#4a5568', fontSize: '0.78rem' }}>{p.marques}</td>
              <td style={{ ...tdStyle, fontWeight: 600, color: '#1a202c' }}>{p.budget}</td>
              <td style={{ ...tdStyle, color: '#4a5568', fontSize: '0.78rem' }}>{p.resultats}</td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* ===== UGC ===== */}
      {activeTab === 'ugc' && (
        <TableWrapper headers={['Partenaire', 'Réseau principal', 'Livrables', 'Feedback marque', 'Statut livraison', 'Statut', 'Actions']}>
          {ugc.map((p, i) => (
            <tr key={i}>
              <PartnerCell p={p} />
              <td style={tdStyle}><NicheTag label={p.reseau} /></td>
              <td style={{ ...tdStyle, fontWeight: 600, color: '#1a202c' }}>{p.livrables}</td>
              <td style={{ ...tdStyle, color: '#4a5568', fontSize: '0.82rem' }}>{p.feedback}</td>
              <td style={tdStyle}><DeliveryBadge statut={p.statutLivraison} /></td>
              <td style={tdStyle}><StatusBadge statut={p.statut} /></td>
              <td style={tdStyle}><ActionBtn /></td>
            </tr>
          ))}
        </TableWrapper>
      )}

      {/* MODAL AJOUTER PARTENAIRE */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              👤 Ajouter un Partenaire
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>✕</button>
            </div>
            {[['Nom complet', 'text', 'Ex: Marie Dubois'], ['Handle', 'text', 'Ex: @greenbeauty'], ['Email', 'email', 'contact@...']].map(([label, type, ph]) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
                <input type={type} placeholder={ph} style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.35rem' }}>Type de partenariat</label>
              <select style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', color: '#4a5568', background: '#fff' }}>
                {['Ambassadeur', 'Affilié', 'One-Shot', 'Placement', 'Campagne', 'UGC'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700 }}>
              Ajouter le Partenaire
            </button>
          </div>
        </div>
      )}
    </div>
  )
}