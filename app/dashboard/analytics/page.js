'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function Analytics() {
  const router = useRouter()
  const [tab, setTab] = useState('revenus')
  const [activationTab, setActivationTab] = useState('ambassadeur')
  const [period, setPeriod] = useState('6 Mois')
  const [showPeriod, setShowPeriod] = useState(false)
  const [profile, setProfile] = useState(null)
  const [searchInfluenceur, setSearchInfluenceur] = useState('')
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
  }, [])

  const handleExport = () => {
    const data = `Analytics Partnexx - ${period}\nRevenus Totaux: €245,680\nROI Moyen: 420%\nConversions: 1,847\nTaux d'Engagement: 6.8%`
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_partnexx_${period.replace(' ', '_')}.txt`
    a.click()
  }

  const metrics = [
    { label: 'Revenus Totaux', value: '€245,680', sub: 'Ce mois', delta: '+15.2%', deltaPos: true, icon: '$', bg: '#fef9c3' },
    { label: 'ROI Moyen', value: '420%', sub: 'Toutes campagnes', delta: '+8.7%', deltaPos: true, icon: '↗', bg: '#dcfce7' },
    { label: 'Conversions', value: '1,847', sub: '30 derniers jours', delta: '-2.1%', deltaPos: false, icon: '⊙', bg: '#ede9fe' },
    { label: "Taux d'Engagement", value: '6.8%', sub: 'Moyenne secteur: 4.2%', delta: '+12.4%', deltaPos: true, icon: '♡', bg: '#fef9c3' },
  ]

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  const revenusData = [150, 160, 170, 240, 270, 320]
  const coutData = [20, 22, 18, 25, 30, 28]

  const allInfluenceurs = [
    { name: 'Sarah Fashion', platform: 'Instagram', platformColor: '#a855f7', followers: '2.8M', engagement: '8.4%', revenus: '45 600,00 €', roi: '456%', specialite: 'Mode', top: 1 },
    { name: 'Max Lifestyle', platform: 'TikTok', platformColor: '#1a202c', followers: '1.2M', engagement: '9.1%', revenus: '38 900,00 €', roi: '389%', specialite: 'Lifestyle', top: 2 },
    { name: 'Tech Nina', platform: 'YouTube', platformColor: '#ef4444', followers: '890K', engagement: '6.7%', revenus: '32 400,00 €', roi: '324%', specialite: 'Tech', top: 3 },
    { name: 'Emma Travel', platform: 'Instagram', platformColor: '#a855f7', followers: '1.5M', engagement: '7.8%', revenus: '28 500,00 €', roi: '285%', specialite: 'Voyage', top: null },
    { name: 'Julie Makeup', platform: 'TikTok', platformColor: '#1a202c', followers: '950K', engagement: '8.2%', revenus: '25 300,00 €', roi: '253%', specialite: 'Beauté', top: null },
    { name: 'Lea Fitness', platform: 'Instagram', platformColor: '#a855f7', followers: '780K', engagement: '6.9%', revenus: '22 100,00 €', roi: '221%', specialite: 'Sport', top: null },
    { name: 'Marie Skincare', platform: 'YouTube', platformColor: '#ef4444', followers: '650K', engagement: '7.5%', revenus: '21 800,00 €', roi: '218%', specialite: 'Beauté', top: null },
    { name: 'Thomas Tech', platform: 'TikTok', platformColor: '#1a202c', followers: '1.1M', engagement: '8.7%', revenus: '31 200,00 €', roi: '312%', specialite: 'Tech', top: null },
    { name: 'Sophie Lifestyle', platform: 'Instagram', platformColor: '#a855f7', followers: '1.8M', engagement: '7.2%', revenus: '35 400,00 €', roi: '354%', specialite: 'Lifestyle', top: null },
    { name: 'Antoine Food', platform: 'TikTok', platformColor: '#1a202c', followers: '820K', engagement: '9.3%', revenus: '19 500,00 €', roi: '195%', specialite: 'Food', top: null },
  ]

  const affiliationPrograms = [
    { name: 'Beauty Boost', commission: '20%', revenusTotaux: '142 500,00 €', commissionsAPayer: '28 500,00 €', nombreVentes: 456, tauxConversion: '12.8%', profitNet: '114 000,00 €', progress: 45 },
    { name: 'Fashion Forward', commission: '15%', revenusTotaux: '228 000,00 €', commissionsAPayer: '34 200,00 €', nombreVentes: 578, tauxConversion: '15.2%', profitNet: '193 800,00 €', progress: 72 },
    { name: 'Tech Trends', commission: '10%', revenusTotaux: '198 000,00 €', commissionsAPayer: '19 800,00 €', nombreVentes: 298, tauxConversion: '8.9%', profitNet: '178 200,00 €', progress: 55 },
    { name: 'Lifestyle Plus', commission: '20%', revenusTotaux: '210 500,00 €', commissionsAPayer: '42 100,00 €', nombreVentes: 687, tauxConversion: '18.4%', profitNet: '168 400,00 €', progress: 65 },
  ]

  const campagnes = [
    { name: 'Lancement Q4', revenus: 295000, budget: 48000, roi: 380 },
    { name: 'Black Friday', revenus: 450000, budget: 82000, roi: 390 },
    { name: 'Summer Vibes', revenus: 305000, budget: 55000, roi: 370 },
    { name: 'Printemps Mode', revenus: 280000, budget: 38000, roi: 368 },
    { name: 'Soldes Hiver', revenus: 325000, budget: 58000, roi: 400 },
    { name: 'Rentrée 2024', revenus: 285000, budget: 45000, roi: 375 },
    { name: 'Cyber Monday', revenus: 435000, budget: 72000, roi: 395 },
    { name: 'Saint-Valentin', revenus: 170000, budget: 30000, roi: 385 },
    { name: 'Pâques 2024', revenus: 162000, budget: 28000, roi: 395 },
    { name: 'Fête des Mères', revenus: 278000, budget: 42000, roi: 390 },
  ]

  const card = { background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }

  const filteredInfluenceurs = allInfluenceurs.filter(inf =>
    inf.name.toLowerCase().includes(searchInfluenceur.toLowerCase()) ||
    inf.platform.toLowerCase().includes(searchInfluenceur.toLowerCase()) ||
    inf.specialite.toLowerCase().includes(searchInfluenceur.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9ff', minHeight: '100vh', padding: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.3rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Analytics</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Analytics avancées • Insights intelligents • Rapports automatisés</p>
      </div>

      {/* ANALYTICS BUSINESS HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>Analytics Business</div>
          <div style={{ fontSize: '0.82rem', color: '#718096' }}>ROI, performances et revenus en temps réel</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowPeriod(!showPeriod)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', color: '#1a202c', fontWeight: 500 }}>
              {period} <span style={{ fontSize: '0.7rem', color: '#a0aec0' }}>▼</span>
            </button>
            {showPeriod && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '140px', overflow: 'hidden' }}>
                {['1 Mois', '3 Mois', '6 Mois', '1 An'].map(p => (
                  <button key={p} onClick={() => { setPeriod(p); setShowPeriod(false) }} style={{ width: '100%', padding: '0.65rem 1rem', background: period === p ? 'rgba(168,85,247,0.08)' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', color: period === p ? '#a855f7' : '#4a5568', fontWeight: period === p ? 600 : 400, textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>{p}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>
            ⬇ Export
          </button>
        </div>
      </div>

      {/* MÉTRIQUES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ ...card, background: m.bg, transition: 'transform .15s, box-shadow .15s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#718096' }}>{m.label}</div>
              <span style={{ color: '#a0aec0', fontSize: '1rem' }}>{m.icon}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.4rem' }}>{m.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem' }}>
              <span style={{ color: '#718096' }}>{m.sub}</span>
              <span style={{ background: m.deltaPos ? '#dcfce7' : '#fff5f5', color: m.deltaPos ? '#16a34a' : '#ef4444', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>{m.deltaPos ? '↗' : '↘'} {m.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TABS */}
      <div style={{ display: 'flex', background: '#f8f9fa', borderRadius: '10px', padding: '0.3rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        {[
          { id: 'revenus', icon: '$', label: 'Revenus', activeColor: '#3b82f6' },
          { id: 'activations', icon: '🌐', label: 'Activations', activeColor: '#22c55e' },
          { id: 'top', icon: '👥', label: 'Top Performers', activeColor: '#a855f7' },
          { id: 'affiliation', icon: '🔗', label: 'Affiliation', activeColor: '#f59e0b' },
          { id: 'comparaison', icon: '📊', label: 'Comparaison', activeColor: '#ec4899' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '0.65rem 1rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? t.activeColor : 'transparent', color: tab === t.id ? '#fff' : '#718096', borderRadius: '8px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== REVENUS ===== */}
      {tab === 'revenus' && (
        <div>
          <div style={{ ...card, marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>💡 Innovation - Insights Revenus</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>↗ Croissance Exceptionnelle</div>
                <p style={{ fontSize: '0.82rem', color: '#4a5568', margin: '0 0 0.75rem', lineHeight: 1.5 }}>+43% de revenus vs trimestre précédent. Instagram drive 51% des conversions.</p>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 500 }}>Instagram +18% • TikTok +12% • YouTube +8%</div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>⊙ Optimisation Suggérée</div>
                <p style={{ fontSize: '0.82rem', color: '#4a5568', margin: 0, lineHeight: 1.5 }}>Augmenter le budget TikTok de 25% pourrait générer +€48K de revenus supplémentaires.</p>
              </div>
              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>✦ Prédiction IA</div>
                <p style={{ fontSize: '0.82rem', color: '#4a5568', margin: '0 0 0.5rem', lineHeight: 1.5 }}>Objectif +€125K atteignable d'ici fin de trimestre avec les tendances actuelles.</p>
                <div style={{ fontSize: '0.72rem', color: '#a855f7' }}>✦ Confiance: 87%</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>📊 Performance Revenus & ROI</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', paddingBottom: '1.5rem', position: 'relative' }}>
                {['0K', '80K', '160K', '240K', '320K'].reverse().map((label, i) => (
                  <div key={i} style={{ position: 'absolute', left: 0, fontSize: '0.65rem', color: '#a0aec0', top: `${i * 22}%` }}>{label}</div>
                ))}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', marginLeft: '30px' }}>
                  {months.map((m, i) => (
                    <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, height: `${revenusData[i] * 0.5}px`, background: 'linear-gradient(180deg,#a855f7,#6366f1)', borderRadius: '4px 4px 0 0', cursor: 'pointer', transition: 'opacity .15s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'} />
                        <div style={{ flex: 1, height: `${coutData[i] * 0.5}px`, background: '#fca5a5', borderRadius: '4px 4px 0 0', cursor: 'pointer', transition: 'opacity .15s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'} />
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{m}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#718096' }}><div style={{ width: '12px', height: '12px', background: '#a855f7', borderRadius: '2px' }} /> Revenus</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#718096' }}><div style={{ width: '12px', height: '12px', background: '#fca5a5', borderRadius: '2px' }} /> Coûts</div>
              </div>
            </div>

            <div style={card}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>👥 Répartition par Plateforme</div>
              {[
                { name: 'Instagram', creators: 142, pct: 41, color: '#ec4899' },
                { name: 'TikTok', creators: 98, pct: 29, color: '#1a202c' },
                { name: 'YouTube', creators: 67, pct: 20, color: '#ef4444' },
                { name: 'X', creators: 34, pct: 10, color: '#3b82f6' },
              ].map(p => (
                <div key={p.name} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                        {p.name === 'Instagram' ? '📸' : p.name === 'TikTok' ? '🎵' : p.name === 'YouTube' ? '▶️' : '𝕏'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a0aec0' }}>{p.creators} créateurs</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: p.color, fontSize: '0.9rem' }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ACTIVATIONS ===== */}
      {tab === 'activations' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f8f9fa', padding: '0.3rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
            {[
              { id: 'ambassadeur', label: 'Ambassadeur de marque', activeColor: '#f97316' },
              { id: 'notoriete', label: 'Campagnes de notoriété', activeColor: '#3b82f6' },
              { id: 'placements', label: 'Placements de produits', activeColor: '#a855f7' },
            ].map(t => (
              <button key={t.id} onClick={() => setActivationTab(t.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activationTab === t.id ? t.activeColor : 'transparent', color: activationTab === t.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: activationTab === t.id ? 600 : 400, fontFamily: 'inherit' }}>
                {t.label}
              </button>
            ))}
          </div>

          {activationTab === 'ambassadeur' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[['Ambassadeurs actifs', '47', 'Sur 58 inscrits', null], ['Revenus générés', '€184,500', '+23% ce mois', '#22c55e'], ['Moyenne ventes/ambassadeur', '€3,926', 'Par mois', null], ["Taux d'activité", '81%', '47/58 actifs', null]].map(([label, val, sub, valColor], i) => (
                  <div key={i} style={card}>
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.4rem' }}>{label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: valColor || '#1a202c', marginBottom: '0.2rem' }}>{val}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Statistiques détaillées</div>
                  {[['Durée moyenne de collaboration', '8.4 mois', null], ["Taux d'engagement moyen", '7.2%', null], ['ROI moyen campagnes', '385%', '#22c55e'], ['Posts publiés (30j)', '234', null]].map(([label, val, valColor]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>
                      <span style={{ color: '#4a5568' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: valColor || '#1a202c' }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Top 5 Ambassadeurs</div>
                  {[['Sophie Martin', '18 posts', '€12,400'], ['Emma Dubois', '15 posts', '€10,800'], ['Julie Laurent', '14 posts', '€9,600'], ['Léa Bernard', '12 posts', '€8,900'], ['Marie Petit', '11 posts', '€8,200']].map(([name, posts, rev], i) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{posts}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.875rem' }}>{rev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activationTab === 'notoriete' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[['Impressions totales', '12.4M', 'Ce mois'], ['Clics totaux', '487K', 'CTR: 3.9%'], ['Engagement moyen', '6.8%', '+1.2% vs secteur'], ['CPM moyen', '€4.20', 'Coût par 1000 vues']].map(([label, val, sub], i) => (
                  <div key={i} style={card}>
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.4rem' }}>{label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.2rem' }}>{val}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Performance par plateforme</div>
                  {[['Instagram', '#ec4899', '5.2M', '4.2%', '7.8%'], ['TikTok', '#1a202c', '4.8M', '5.1%', '9.2%'], ['YouTube', '#ef4444', '2.4M', '2.8%', '4.5%']].map(([name, color, imp, ctr, eng]) => (
                    <div key={name} style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{imp}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#718096' }}>
                        <span>CTR: {ctr}</span><span>Engagement: {eng}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Évolution de la notoriété</div>
                  {[['Avant campagne', '18%', '#dcfce7', '#16a34a', '↗'], ['Après campagne', '34%', '#dbeafe', '#3b82f6', '↗'], ['Croissance', '+89%', '#faf5ff', '#a855f7', '✦']].map(([label, val, bg, color, icon]) => (
                    <div key={label} style={{ background: bg, borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ color, fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem' }}>{icon} {label}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activationTab === 'placements' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[['Placements réalisés', '156', 'Ce trimestre', null], ['Produits vendus', '2,847', '+34% vs trim. préc.', null], ['Taux de conversion', '4.2%', 'Placement → Achat', null], ['Revenu total', '€327,680', 'Via placements', '#22c55e']].map(([label, val, sub, valColor], i) => (
                  <div key={i} style={card}>
                    <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '0.4rem' }}>{label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: valColor || '#1a202c', marginBottom: '0.2rem' }}>{val}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>ROI par produit</div>
                  {[['Crème visage bio', '847 ventes', '€84,700', 512], ['Sérum anti-âge', '623 ventes', '€62,300', 445], ['Huile corps naturelle', '512 ventes', '€51,200', 398], ['Masque purifiant', '445 ventes', '€44,500', 367], ['Eau micellaire', '420 ventes', '€42,000', 334]].map(([name, sales, rev, roi]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{sales}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', marginBottom: '0.2rem' }}>ROI {roi}%</div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rev}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Performance par plateforme</div>
                  {[['Instagram', '#ec4899', 67, 1284, '€147,200'], ['TikTok', '#1a202c', 52, 986, '€112,300'], ['YouTube', '#ef4444', 37, 577, '€68,180']].map(([name, color, placements, ventes, rev]) => (
                    <div key={name} style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                          <span style={{ fontWeight: 600 }}>{name}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: '#22c55e' }}>{rev}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#718096' }}>
                        <span>Placements: {placements}</span><span>Ventes: {ventes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== TOP PERFORMERS ===== */}
      {tab === 'top' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>🏆 Tous les Influenceurs ({allInfluenceurs.length})</div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>🔍</span>
              <input type="text" placeholder="Rechercher..." value={searchInfluenceur} onChange={e => setSearchInfluenceur(e.target.value)}
                style={{ paddingLeft: '2rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none', width: '240px', color: '#4a5568' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.2fr 0.8fr 1fr', gap: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.5rem' }}>
            {['Influenceur', 'Plateforme', 'Followers', 'Engagement', 'Revenus', 'ROI', 'Spécialité'].map(h => (
              <div key={h} style={{ fontSize: '0.72rem', color: '#a0aec0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{h}</div>
            ))}
          </div>
          {filteredInfluenceurs.map((inf, i) => (
            <div key={inf.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.2fr 0.8fr 1fr', gap: '0.5rem', padding: '0.75rem', borderBottom: i < filteredInfluenceurs.length - 1 ? '1px solid #f0f0f0' : 'none', alignItems: 'center', borderRadius: '8px', transition: 'background .15s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {inf.top === 1 && <span>🥇</span>}{inf.top === 2 && <span>⭐</span>}{inf.top === 3 && <span>⭐</span>}{!inf.top && <div style={{ width: '18px' }} />}
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a202c' }}>{inf.name}</span>
              </div>
              <div><span style={{ background: inf.platformColor + '18', color: inf.platformColor, padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600 }}>{inf.platform}</span></div>
              <div style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>{inf.followers}</div>
              <div style={{ fontSize: '0.875rem', color: '#4a5568' }}><span style={{ color: '#ec4899' }}>♡</span> {inf.engagement}</div>
              <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.875rem' }}>{inf.revenus}</div>
              <div><span style={{ background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>{inf.roi}</span></div>
              <div style={{ background: '#f3f4f6', color: '#4a5568', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 500, width: 'fit-content' }}>{inf.specialite}</div>
            </div>
          ))}
        </div>
      )}

      {/* ===== AFFILIATION ===== */}
      {tab === 'affiliation' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {affiliationPrograms.map(prog => (
            <div key={prog.name} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span>🔗</span><span style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c' }}>{prog.name}</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ background: '#f3f4f6', color: '#718096', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Commission {prog.commission}</span>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#4a5568' }}>Revenus totaux</span>
                <span style={{ fontWeight: 700, color: '#22c55e' }}>{prog.revenusTotaux}</span>
              </div>
              <div style={{ background: '#fff7ed', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#4a5568' }}>Commissions à payer</span>
                <span style={{ fontWeight: 700, color: '#f97316' }}>{prog.commissionsAPayer}</span>
              </div>
              {[['Nombre de ventes', prog.nombreVentes], ['Taux de conversion', prog.tauxConversion], ['Profit net', prog.profitNet]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>
                  <span style={{ color: '#718096' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
              <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', marginTop: '1rem' }}>
                <div style={{ height: '100%', width: `${prog.progress}%`, background: 'linear-gradient(90deg,#a855f7,#6366f1)', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== COMPARAISON ===== */}
      {tab === 'comparaison' && (
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>📊 Comparaison des Campagnes</div>

          <div style={{ position: 'relative', paddingBottom: '3rem' }}>
            {/* Y axis left */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '0.5rem' }}>
              {['600000', '450000', '300000', '150000', '0'].map(l => (
                <span key={l} style={{ fontSize: '0.62rem', color: '#a0aec0', textAlign: 'right' }}>{l}</span>
              ))}
            </div>
            {/* Y axis right */}
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '0.5rem' }}>
              {['400', '300', '200', '100', '0'].map(l => (
                <span key={l} style={{ fontSize: '0.62rem', color: '#a0aec0' }}>{l}</span>
              ))}
            </div>

            {/* Chart */}
            <div style={{ marginLeft: '50px', marginRight: '40px', height: '280px', display: 'flex', alignItems: 'flex-end', gap: '6px', borderBottom: '1px solid #e2e8f0', borderLeft: '1px solid #e2e8f0', position: 'relative' }}>
              {[0, 25, 50, 75, 100].map(pct => (
                <div key={pct} style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct}%`, borderTop: '1px dashed #f0f0f0', zIndex: 0 }} />
              ))}

              {campagnes.map((c, i) => {
                const revH = (c.revenus / 600000) * 260
                const budgH = (c.budget / 600000) * 260
                const roiH = (c.roi / 400) * 260
                const hovered = tooltip?.index === i

                return (
                  <div key={c.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '260px' }}>

                      {/* Barre Revenus */}
                      <div
                        onMouseEnter={() => setTooltip({ name: c.name, revenus: c.revenus, budget: c.budget, roi: c.roi, index: i })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ width: '18px', height: `${revH}px`, background: hovered ? '#16a34a' : '#22c55e', borderRadius: '3px 3px 0 0', cursor: 'pointer', transition: 'all .15s', transform: hovered ? 'scaleY(1.04)' : 'none', transformOrigin: 'bottom' }}
                      />
                      {/* Barre Budget */}
                      <div
                        onMouseEnter={() => setTooltip({ name: c.name, revenus: c.revenus, budget: c.budget, roi: c.roi, index: i })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ width: '18px', height: `${budgH}px`, background: hovered ? '#dc2626' : '#ef4444', borderRadius: '3px 3px 0 0', cursor: 'pointer', transition: 'all .15s', transform: hovered ? 'scaleY(1.04)' : 'none', transformOrigin: 'bottom' }}
                      />
                      {/* Barre ROI */}
                      <div
                        onMouseEnter={() => setTooltip({ name: c.name, revenus: c.revenus, budget: c.budget, roi: c.roi, index: i })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ width: '18px', height: `${roiH}px`, background: hovered ? '#d97706' : '#f59e0b', borderRadius: '3px 3px 0 0', cursor: 'pointer', transition: 'all .15s', transform: hovered ? 'scaleY(1.04)' : 'none', transformOrigin: 'bottom' }}
                      />
                    </div>

                    {/* Tooltip */}
                    {hovered && (
                      <div style={{ position: 'absolute', bottom: '270px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, width: '185px', pointerEvents: 'none' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1a202c', marginBottom: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>{c.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                          <span style={{ color: '#718096' }}>Revenus :</span>
                          <span style={{ fontWeight: 700, color: '#22c55e' }}>{c.revenus.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                          <span style={{ color: '#718096' }}>Budget :</span>
                          <span style={{ fontWeight: 700, color: '#ef4444' }}>{c.budget.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: '#718096' }}>ROI % :</span>
                          <span style={{ fontWeight: 700, color: '#f59e0b' }}>{c.roi}%</span>
                        </div>
                        {/* Flèche */}
                        <div style={{ position: 'absolute', bottom: '-7px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '12px', height: '12px', background: '#fff', border: '1px solid #e2e8f0', borderTop: 'none', borderLeft: 'none' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* X axis labels */}
            <div style={{ marginLeft: '50px', marginRight: '40px', display: 'flex', gap: '6px', marginTop: '0.4rem' }}>
              {campagnes.map(c => (
                <div key={c.name} style={{ flex: 1, textAlign: 'center', fontSize: '0.58rem', color: '#718096', wordBreak: 'break-word', lineHeight: 1.2 }}>{c.name}</div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {[['#22c55e', 'Revenus'], ['#ef4444', 'Budget'], ['#f59e0b', 'ROI %']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#718096' }}>
                <div style={{ width: '14px', height: '10px', background: color, borderRadius: '2px' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}