'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function Campaigns() {
  const router = useRouter()
  const [mainTab, setMainTab] = useState('create')
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [recruitTab, setRecruitTab] = useState('candidatures')
  const [ugcTab, setUgcTab] = useState('feed')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnalyzed, setIaAnalyzed] = useState(false)

  const [form, setForm] = useState({
    audience: '', categories: [], name: '', type: '', objectives: [],
    details: '', startDate: '', endDate: '', deadline: '', indefinite: false,
    accessType: 'open', commission: '15', salesTarget: '10000', bonus: '',
    contentTypes: [], quantity: '', constraints: '',
    iaAudience: '', iaContentType: '', iaValues: '', iaAnalysisType: 'matching',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    getUser()
  }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const toggleArr = (key, val) => setForm(f => ({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }))

  const stepLabels = ['Audience', 'Catégories', 'Détails', 'Dates', 'Budget', 'Contenus', 'Récapitulatif']
  const progress = ((step - 1) / 6) * 100

  const handleCreate = async () => {
    setLoading(true)
    try {
      const { data: brand } = await supabase.from('brands').select('id').eq('user_id', profile?.id).single()
      if (brand) {
        await supabase.from('campaigns').insert({
          brand_id: brand.id,
          title: form.name || 'Ma campagne',
          target_niches: form.categories,
          goals: form.objectives,
          description: form.details,
          start_date: form.startDate || null,
          end_date: form.endDate || null,
          commission_rate: parseFloat(form.commission) || 0,
          budget_total: parseFloat(form.salesTarget) || 0,
          payment_mode: 'commission',
          status: 'active',
          is_public: form.accessType === 'open',
        })
      }
      setSuccess(true)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleIaAnalysis = () => {
    setIaLoading(true)
    setTimeout(() => { setIaLoading(false); setIaAnalyzed(true) }, 2000)
  }

  const candidates = [
    { id: 1, name: 'skincare_addict', avatar: 'SA', followers: '45K', platform: 'Beauty', date: '12 jan. 2025', status: 'Accepté' },
    { id: 2, name: 'makeup_queen', avatar: 'MQ', followers: '38K', platform: 'Beauty', date: '12 jan. 2025', status: 'Accepté' },
    { id: 3, name: 'natural_glow', avatar: 'NG', followers: '22K', platform: 'Beauty', date: '19 jan. 2025', status: 'En attente' },
    { id: 4, name: 'glam_guru', avatar: 'GG', followers: '67K', platform: 'Fashion', date: '14 jan. 2025', status: 'En attente' },
  ]

  const ugcCreators = [
    { name: 'anna_content', followers: '12.4K', engagement: '6.2%', niche: 'Beauté', tags: ['Skincare', 'Wellness'], gradient: 'linear-gradient(135deg,#f9a8d4,#e879f9)', img: '👩' },
    { name: 'alex_chen', followers: '8.9K', engagement: '7.1%', niche: 'Mode', tags: ['Fashion', 'Makeup'], gradient: 'linear-gradient(135deg,#fed7aa,#fbbf24)', img: '🧑' },
    { name: 'olivia_studio', followers: '15.2K', engagement: '5.8%', niche: 'Lifestyle', tags: ['Lifestyle', 'Beauty'], gradient: 'linear-gradient(135deg,#bfdbfe,#93c5fd)', img: '👩‍🦰' },
    { name: 'leo_sports', followers: '9.3K', engagement: '8.4%', niche: 'Sport', tags: ['Sport', 'Wellness'], gradient: 'linear-gradient(135deg,#bbf7d0,#4ade80)', img: '🏋️' },
    { name: 'mia_beauty', followers: '22.1K', engagement: '4.9%', niche: 'Beauté', tags: ['Beauté', 'Makeup'], gradient: 'linear-gradient(135deg,#fde68a,#fb923c)', img: '💄' },
    { name: 'tech_creator', followers: '18.7K', engagement: '6.7%', niche: 'Tech', tags: ['Gaming', 'Tech'], gradient: 'linear-gradient(135deg,#c7d2fe,#818cf8)', img: '💻' },
  ]

  const campaigns = ['Programme Affiliation Beauty 2024', 'Collection Printemps 2024', 'Programme Ambassadeurs Tech 2024']

  const inp = { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  const lbl = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' }
  const card = { background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '2rem' }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9ff', minHeight: '100vh', padding: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', margin: 0 }}>Gestion des campagnes</h1>
          <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' }}>⓪ IA Activée</span>
        </div>
        <p style={{ color: '#718096', margin: 0, fontSize: '0.875rem' }}>Créez et gérez vos campagnes marketing avec intelligence</p>
      </div>

      {/* MAIN TABS */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', background: '#fff', borderRadius: '12px', padding: '0.4rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', width: 'fit-content' }}>
        {[
          { id: 'create', icon: '✨', label: 'Créer une campagne', activeColor: '#22c55e' },
          { id: 'recruit', icon: '⏱', label: 'Recrutement', activeColor: '#f97316' },
          { id: 'suivi', icon: '📊', label: 'Suivi des opérations', activeColor: '#3b82f6' },
          { id: 'ugc', icon: '👥', label: 'Créateurs UGC', activeColor: '#a855f7' },
        ].map(tab => (
          <button key={tab.id} onClick={() => { setMainTab(tab.id); setStep(1); setSuccess(false) }} style={{
            padding: '0.65rem 1.4rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '0.85rem', fontWeight: mainTab === tab.id ? 700 : 400,
            background: mainTab === tab.id ? tab.activeColor : 'transparent',
            color: mainTab === tab.id ? '#fff' : '#718096',
            borderRadius: '8px', transition: 'all 0.2s',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* =================== CREATE CAMPAIGN =================== */}
      {mainTab === 'create' && !success && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a202c', margin: 0 }}>Créer une nouvelle campagne</h2>
            <span style={{ fontSize: '0.82rem', color: '#718096', background: '#f0f0f0', padding: '0.3rem 0.8rem', borderRadius: '100px' }}>Étape {step} sur 7</span>
          </div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '0.5rem' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 600, marginBottom: '1.5rem' }}>{stepLabels[step - 1]}</div>

          {/* ÉTAPE 1 */}
          {step === 1 && (
            <div style={card}>
              <h3 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Quelle taille d'audience recherchez-vous ?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {['0 à 10 000 abonnés', '10 000 à 50 000', '50 000 à 200 000', '200 000 à 1 M', '1 M+'].map((opt, i) => (
                  <div key={opt} onClick={() => set('audience', opt)} style={{ padding: '1.25rem 1.5rem', border: `2px solid ${form.audience === opt ? '#a855f7' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', background: form.audience === opt ? 'rgba(168,85,247,0.04)' : '#fff', gridColumn: i === 4 ? '1' : 'auto' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.audience === opt ? '#a855f7' : '#cbd5e0'}`, background: form.audience === opt ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {form.audience === opt && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{ fontWeight: 500, color: '#1a202c' }}>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {step === 2 && (
            <div style={card}>
              <h3 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Dans quelles catégories opérez-vous ?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {['Mode', 'Beauté', 'Sport', 'Gaming', 'Tech', 'Lifestyle', 'Food', 'Finance', 'Développement personnel', 'Automobile', 'Autres'].map(cat => (
                  <div key={cat} onClick={() => toggleArr('categories', cat)} style={{ padding: '1rem 1.25rem', border: `2px solid ${form.categories.includes(cat) ? '#a855f7' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', background: form.categories.includes(cat) ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.categories.includes(cat) ? '#a855f7' : '#cbd5e0'}`, background: form.categories.includes(cat) ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {form.categories.includes(cat) && <span style={{ color: '#fff', fontSize: '0.65rem' }}>✓</span>}
                    </div>
                    <span style={{ fontWeight: 500, color: '#1a202c', fontSize: '0.875rem' }}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 */}
          {step === 3 && (
            <div style={card}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' }}>Détails de votre campagne</h3>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Nom de la campagne *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Lancement collection automne 2024" style={inp} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Type de campagne *</label>
                {[{ id: 'affiliation', icon: '⭐', label: 'Affiliation', desc: 'basée sur la performance, rémunération à la vente ou au clic' }, { id: 'placement', icon: '🎁', label: 'Placement de produit', desc: 'visibilité et contenu sponsorisé' }, { id: 'ambassadeur', icon: '🤝', label: 'Ambassadeur de marque', desc: 'collaboration longue durée' }, { id: 'notoriete', icon: '📢', label: 'Campagne de notoriété', desc: 'lancement, buzz ou visibilité massive' }].map(t => (
                  <div key={t.id} onClick={() => set('type', t.id)} style={{ padding: '0.9rem 1.25rem', border: `1.5px solid ${form.type === t.id ? '#a855f7' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: form.type === t.id ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form.type === t.id ? '#a855f7' : '#cbd5e0'}`, background: form.type === t.id ? '#a855f7' : '#fff', flexShrink: 0 }} />
                    <div><span style={{ fontWeight: 600 }}>{t.icon} {t.label}</span><span style={{ color: '#718096', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{t.desc}</span></div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Objectifs principaux *</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['Notoriété', 'Engagement', 'Ventes / Conversions'].map(obj => (
                    <div key={obj} onClick={() => toggleArr('objectives', obj)} style={{ flex: 1, padding: '0.75rem', border: `1.5px solid ${form.objectives.includes(obj) ? '#a855f7' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: form.objectives.includes(obj) ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${form.objectives.includes(obj) ? '#a855f7' : '#cbd5e0'}`, background: form.objectives.includes(obj) ? '#a855f7' : '#fff', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>Détails de la collaboration</label>
                <textarea value={form.details} onChange={e => set('details', e.target.value)} placeholder="Décrivez les détails de votre collaboration..." rows={4} style={{ ...inp, resize: 'vertical' }} />
              </div>
            </div>
          )}

          {/* ÉTAPE 4 */}
          {step === 4 && (
            <div style={{ ...card, maxWidth: '800px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' }}>Planification temporelle</h3>
              <div onClick={() => set('indefinite', !form.indefinite)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form.indefinite ? '#a855f7' : '#cbd5e0'}`, background: form.indefinite ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {form.indefinite && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                </div>
                <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>Durée indéterminée</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {[['Date de début *', 'startDate'], ['Date de fin *', 'endDate'], ['Deadline des contenus *', 'deadline']].map(([label, key]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>📅</span>
                      <input type="date" value={form[key]} onChange={e => set(key, e.target.value)} disabled={form.indefinite} style={{ ...inp, paddingLeft: '2.25rem', opacity: form.indefinite ? 0.5 : 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 5 */}
          {step === 5 && (
            <div style={card}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' }}>Budget et rémunération</h3>
              <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#7c3aed', fontWeight: 500 }}>⭐ Affiliation – Rémunération à la performance</div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>Type d'accès à la campagne *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  {[{ id: 'open', icon: '🌍', label: 'Ouverte à tous', desc: 'Tous les créateurs peuvent rejoindre cette campagne' }, { id: 'invite', icon: '🔗', label: 'Sur invitation', desc: "Accès uniquement via lien d'invitation" }, { id: 'targeted', icon: '🎯', label: 'Ciblée', desc: 'Visible si le profil matche avec les critères IA' }].map(t => (
                    <div key={t.id} onClick={() => set('accessType', t.id)} style={{ padding: '1rem', border: `2px solid ${form.accessType === t.id ? '#a855f7' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', background: form.accessType === t.id ? 'rgba(168,85,247,0.04)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${form.accessType === t.id ? '#a855f7' : '#cbd5e0'}`, background: form.accessType === t.id ? '#a855f7' : '#fff', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.icon} {t.label}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#718096', margin: 0 }}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={lbl}>Taux de commission (%) *</label>
                  <input value={form.commission} onChange={e => set('commission', e.target.value)} placeholder="15" style={inp} />
                  <p style={{ fontSize: '0.72rem', color: '#a0aec0', margin: '0.3rem 0 0' }}>Ex: 15% de commission sur les ventes</p>
                </div>
                <div>
                  <label style={lbl}>Objectif de vente (€) *</label>
                  <input value={form.salesTarget} onChange={e => set('salesTarget', e.target.value)} placeholder="10000" style={inp} />
                  <p style={{ fontSize: '0.72rem', color: '#a0aec0', margin: '0.3rem 0 0' }}>Montant total de ventes visé</p>
                </div>
              </div>
              <div>
                <label style={lbl}>Bonus palier (optionnel)</label>
                <input value={form.bonus} onChange={e => set('bonus', e.target.value)} placeholder="Ex: +5% au-delà de 10 000€" style={inp} />
                <p style={{ fontSize: '0.72rem', color: '#a0aec0', margin: '0.3rem 0 0' }}>Bonus si objectif dépassé</p>
              </div>
            </div>
          )}

          {/* ÉTAPE 6 */}
          {step === 6 && (
            <div style={card}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Contenus attendus</h3>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Types de contenu souhaités *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {['Post Instagram', 'Story Instagram', 'Reel Instagram', 'TikTok', 'Vidéo YouTube', 'Post LinkedIn', 'Tweet'].map(ct => (
                    <div key={ct} onClick={() => toggleArr('contentTypes', ct)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form.contentTypes.includes(ct) ? '#a855f7' : '#cbd5e0'}`, background: form.contentTypes.includes(ct) ? '#a855f7' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {form.contentTypes.includes(ct) && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>{ct}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Quantité de contenu par influenceur *</label>
                <select value={form.quantity} onChange={e => set('quantity', e.target.value)} style={{ ...inp, background: '#fff' }}>
                  <option value="">Choisir une quantité</option>
                  {['1', '2-3', '4-5', '6-10', '10+'].map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Contraintes et exigences</label>
                <textarea value={form.constraints} onChange={e => set('constraints', e.target.value)} placeholder="Hashtags obligatoires, mentions, éviter certains sujets..." rows={4} style={{ ...inp, resize: 'vertical' }} />
              </div>
            </div>
          )}

          {/* ÉTAPE 7 */}
          {step === 7 && (
            <div style={card}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: '1.5rem' }}>Récapitulatif de votre campagne</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.75rem' }}>Informations générales</div>
                  {[['Nom', form.name || '—'], ['Type', form.type || '—'], ['Objectifs', form.objectives.join(', ') || '—'], ['Catégories', form.categories.join(', ') || '—'], ['Audience', form.audience || '—']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, color: '#4a5568' }}>{k}:</span><span style={{ color: '#718096' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.75rem' }}>Budget & Rémunération</div>
                  {[['Commission', `${form.commission}%`], ['Objectif ventes', `${form.salesTarget}€`], ['Bonus', form.bonus || '—'], ['Accès', form.accessType]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, color: '#4a5568' }}>{k}:</span><span style={{ color: '#718096' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.5rem' }}>Contenus attendus</div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}><div>Types: {form.contentTypes.join(', ') || '—'}</div><div>Quantité: {form.quantity || '—'}</div></div>
              </div>
              <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#a855f7' }}>💡</span><span style={{ fontWeight: 600, color: '#a855f7', fontSize: '0.875rem' }}>Recommandations IA</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#718096', margin: 0 }}>Basé sur vos critères, nous estimons un retour sur investissement de 340% avec un taux d'engagement moyen de 4.2%. Nous recommandons de cibler 12-15 influenceurs.</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button onClick={() => step > 1 ? setStep(s => s - 1) : null} style={{ padding: '0.7rem 1.5rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', color: '#718096', fontWeight: 500 }}>← Précédent</button>
            {step < 7
              ? <button onClick={() => setStep(s => s + 1)} style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700 }}>Suivant →</button>
              : <button onClick={handleCreate} disabled={loading} style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>{loading ? 'Création...' : '✨ Créer la campagne'}</button>
            }
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {mainTab === 'create' && success && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ ...card, maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✅</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginBottom: '1.5rem' }}>🚀 Campagne créée avec succès !</h2>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
              <p style={{ color: '#4a5568', margin: '0 0 0.5rem' }}>Votre campagne <strong>"{form.name}"</strong> a été envoyée à</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a202c' }}>1 626 influenceurs</div>
              <p style={{ color: '#718096', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>correspondant à vos critères</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => { setSuccess(false); setStep(1) }} style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700 }}>Créer une nouvelle campagne</button>
              <button onClick={() => setMainTab('recruit')} style={{ padding: '0.8rem 1.5rem', background: '#fff', color: '#718096', border: '1.5px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>Voir mes campagnes</button>
            </div>
          </div>
        </div>
      )}

      {/* =================== RECRUTEMENT =================== */}
      {mainTab === 'recruit' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <select style={{ ...inp, width: 'auto', minWidth: '220px' }}>
              <option>Toutes les campagnes</option>
              {campaigns.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#fff', padding: '0.4rem', borderRadius: '12px', width: 'fit-content', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {[{ id: 'candidatures', label: 'Candidatures', count: 7, countColor: '#f59e0b' }, { id: 'juridique', label: 'Juridique', count: 2, countColor: '#3b82f6' }, { id: 'paiements', label: 'Paiements & Sécurisation', count: 2, countColor: '#f59e0b' }, { id: 'invitations', label: 'Invitations' }].map(tab => (
              <button key={tab.id} onClick={() => setRecruitTab(tab.id)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: recruitTab === tab.id ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'transparent', color: recruitTab === tab.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: recruitTab === tab.id ? 600 : 400, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {tab.label}
                {tab.count && <span style={{ background: tab.countColor, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{tab.count}</span>}
              </button>
            ))}
          </div>

          {recruitTab === 'candidatures' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700 }}>Programme Affiliation Beauty 2024</span>
                  <span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>✨ Affiliation</span>
                </div>
                <span style={{ fontWeight: 600, color: '#718096', fontSize: '0.875rem' }}>Budget: <strong style={{ color: '#1a202c' }}>50 000€</strong></span>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[['Total', '4', '#1a202c'], ['En attente', '2', '#f59e0b'], ['Acceptés', '2', '#22c55e'], ['Refusés', '0', '#ef4444']].map(([label, count, color]) => (
                  <div key={label} style={{ textAlign: 'center' }}><div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{count}</div><div style={{ fontSize: '0.75rem', color: '#718096' }}>{label}</div></div>
                ))}
              </div>
              {candidates.map((c, i) => (
                <div key={c.id} style={{ padding: '1rem 1.5rem', borderBottom: i < candidates.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1a202c' }}>@{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{c.followers} abonnés · {c.platform} · Postulé le {c.date}</div>
                  </div>
                  <span style={{ background: c.status === 'Accepté' ? '#dcfce7' : '#fef9c3', color: c.status === 'Accepté' ? '#16a34a' : '#854d0e', fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>{c.status}</span>
                  {c.status === 'En attente' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.4rem 0.9rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Accepter la candidature</button>
                      <button style={{ padding: '0.4rem 0.9rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✕ Refuser</button>
                      <button style={{ padding: '0.4rem 0.9rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' }}>👁 Voir le profil complet</button>
                    </div>
                  )}
                  {c.status === 'Accepté' && <button style={{ padding: '0.4rem 0.9rem', background: '#fff', color: '#718096', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' }}>👁 Voir le profil complet</button>}
                </div>
              ))}
            </div>
          )}

          {recruitTab === 'juridique' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontWeight: 700 }}>Programme Affiliation Beauty 2024</span><span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>✨ Affiliation</span></div>
                <span style={{ fontWeight: 600, color: '#718096', fontSize: '0.875rem' }}>Budget: <strong>50 000€</strong></span>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[['En attente', '0', '#f59e0b'], ['Signés influenceur', '0', '#3b82f6'], ['Complets', '2', '#22c55e'], ['Refusés', '0', '#ef4444']].map(([label, count, color]) => (
                  <div key={label} style={{ textAlign: 'center', padding: '0.75rem', border: '1px solid #f0f0f0', borderRadius: '10px' }}><div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{count}</div><div style={{ fontSize: '0.75rem', color: '#718096' }}>{label}</div></div>
                ))}
              </div>
              <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', fontSize: '0.78rem', color: '#a0aec0', fontWeight: 600 }}>
                {['Créateur', 'Montant', 'Livrables', 'Date', 'Statut', 'Actions'].map(h => <div key={h}>{h}</div>)}
              </div>
              {[{ name: '@skincare_addict', amount: '5 000€', deliverables: '2 livrables', date: '29 mars 2026' }, { name: '@makeup_queen', amount: '5 000€', deliverables: '2 livrables', date: '29 mars 2026' }].map((row, i) => (
                <div key={i} style={{ padding: '0.85rem 1.5rem', borderBottom: i === 0 ? '1px solid #f0f0f0' : 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 500 }}>{row.name}</span><span style={{ color: '#718096' }}>{row.amount}</span><span style={{ color: '#718096' }}>{row.deliverables}</span><span style={{ color: '#718096' }}>{row.date}</span>
                  <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', width: 'fit-content' }}>✅ Complet</span>
                  <button style={{ padding: '0.4rem 0.8rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', color: '#718096' }}>👁 Voir le contrat</button>
                </div>
              ))}
            </div>
          )}

          {recruitTab === 'paiements' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontWeight: 700 }}>Programme Affiliation Beauty 2024</span><span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>✨ Affiliation</span></div>
                <span style={{ fontWeight: 600, color: '#718096', fontSize: '0.875rem' }}>Budget: <strong>50 000€</strong></span>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', background: 'rgba(249,115,22,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 600 }}>Activer les commissions</div><div style={{ fontSize: '0.78rem', color: '#718096' }}>2 affiliés en attente d'activation</div></div>
                <button style={{ padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>🔒 Activer les commissions</button>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[['Non activés', '2'], ['Commissions activées', '0 affilié'], ['Commissions versées', '0 affilié'], ['Affiliés actifs', '0']].map(([label, count]) => (
                  <div key={label} style={{ padding: '0.75rem', border: '1px solid #f0f0f0', borderRadius: '10px', textAlign: 'center' }}><div style={{ fontSize: '0.72rem', color: '#a0aec0', marginBottom: '0.3rem' }}>{label}</div><div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a202c' }}>{count}</div></div>
                ))}
              </div>
              {[{ name: '@skincare_addict', commission: '15%' }, { name: '@makeup_queen', commission: '12%' }].map((row, i) => (
                <div key={i} style={{ padding: '0.85rem 1.5rem', borderBottom: i === 0 ? '1px solid #f0f0f0' : 'none', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 500 }}>{row.name}</span>
                  <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', width: 'fit-content' }}>✨ Affiliation</span>
                  <span style={{ color: '#718096' }}>% {row.commission}</span>
                  <span style={{ color: '#a0aec0' }}>—</span>
                  <span style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', width: 'fit-content' }}>🔒 Non activé</span>
                  <button style={{ padding: '0.4rem 0.8rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', color: '#718096' }}>👁 Voir dans Gestion Financière</button>
                </div>
              ))}
            </div>
          )}

          {recruitTab === 'invitations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[{ name: 'Programme Affiliation Beauty 2024', budget: '50 000€', visits: 247, candidates: 12, rate: '4.9%', link: 'https://partnexx.com/campagne/join/beauty810634' }, { name: 'Programme Ambassadeurs Tech 2024', budget: '45 000€', visits: 0, candidates: 0, rate: '0%', link: 'https://partnexx.com/campagne/join/tech8e0dac8e' }].map((camp, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                  <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontWeight: 700 }}>{camp.name}</span><span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>✨ Affiliation</span></div>
                    <span style={{ fontSize: '0.82rem', color: '#718096' }}>Budget: {camp.budget}</span>
                  </div>
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>🔗 Lien d'invitation</div>
                    <p style={{ fontSize: '0.78rem', color: '#718096', margin: '0 0 0.75rem' }}>Partagez ce lien pour inviter des créateurs à postuler à votre campagne</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.9rem', marginBottom: '0.75rem' }}>
                      <span style={{ flex: 1, fontSize: '0.78rem', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{camp.link}</span>
                      <button onClick={() => navigator.clipboard.writeText(camp.link)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem', color: '#718096' }}>📋</button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                      <button style={{ flex: 1, padding: '0.6rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#718096' }}>📱 Afficher le QR Code</button>
                      <button style={{ flex: 1, padding: '0.6rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', color: '#718096' }}>🔄 Régénérer le lien</button>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a202c', marginBottom: '0.5rem' }}>📊 Statistiques du lien</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {[['→ Vues', camp.visits], ['→ Candidatures', camp.candidates], ['→ Taux de conversion', camp.rate]].map(([label, val]) => (
                          <div key={label}><div style={{ fontSize: '0.7rem', color: '#a0aec0' }}>{label}</div><div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a202c' }}>{val}</div></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================== SUIVI DES OPÉRATIONS =================== */}
      {mainTab === 'suivi' && (
        <div>
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a202c', marginBottom: '0.2rem' }}>Cockpit de pilotage</div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>Sélectionnez une campagne pour accéder au tableau de bord complet</div>
            </div>
          </div>

          <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} style={{ ...inp, width: '100%', marginBottom: '1.5rem', border: '2px solid rgba(168,85,247,0.4)', borderRadius: '12px', fontSize: '1rem', padding: '0.9rem 1rem' }}>
            <option value="">Sélectionner une campagne...</option>
            {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {!selectedCampaign ? (
            <div style={{ ...card, textAlign: 'center', padding: '4rem', border: '2px dashed #e2e8f0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📊</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a0aec0', marginBottom: '0.5rem' }}>Sélectionnez une campagne</h3>
              <p style={{ color: '#cbd5e0', margin: 0 }}>Choisissez une campagne ci-dessus pour accéder au cockpit de pilotage complet</p>
            </div>
          ) : (
            <div>
              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[['Influenceurs actifs', '12', '↑ +2', '#a855f7'], ['Portée totale', '2.4M', '↑ +18%', '#22c55e'], ['Taux d\'engagement', '6.8%', '↑ +1.2%', '#3b82f6'], ['ROI estimé', '287%', '↑ +45%', '#f59e0b']].map(([label, val, delta, color]) => (
                  <div key={label} style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #f0f0f0', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginBottom: '0.4rem' }}>{label}</div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.3rem' }}>{val}</div>
                    <span style={{ background: `${color}18`, color, fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{delta}</span>
                  </div>
                ))}
              </div>

              {/* Influenceurs */}
              <div style={{ ...card }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a202c', marginBottom: '1rem' }}>👥 Influenceurs de la campagne</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.78rem', color: '#a0aec0', fontWeight: 600 }}>
                  {['Créateur', 'Statut', 'Livrables', 'Portée', 'Engagement', 'Actions'].map(h => <div key={h}>{h}</div>)}
                </div>
                {[{ name: '@skincare_addict', status: 'Actif', livrables: '2/3', reach: '45K', engagement: '6.2%' }, { name: '@makeup_queen', status: 'En cours', livrables: '1/2', reach: '38K', engagement: '7.1%' }, { name: '@natural_glow', status: 'Terminé', livrables: '3/3', reach: '22K', engagement: '8.4%' }].map((inf, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.85rem 0', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>{inf.name}</span>
                    <span style={{ background: inf.status === 'Actif' ? '#dcfce7' : inf.status === 'Terminé' ? '#f0fdf4' : '#fef9c3', color: inf.status === 'Actif' ? '#16a34a' : inf.status === 'Terminé' ? '#15803d' : '#854d0e', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', width: 'fit-content' }}>{inf.status}</span>
                    <span style={{ color: '#718096' }}>{inf.livrables}</span>
                    <span style={{ color: '#718096' }}>{inf.reach}</span>
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>{inf.engagement}</span>
                    <button style={{ padding: '0.35rem 0.7rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', color: '#718096' }}>Voir détails</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================== CRÉATEURS UGC =================== */}
      {mainTab === 'ugc' && (
        <div>
          {/* Métriques UGC */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[['Créateurs Actifs', '1,247', '👥', '#ede9fe'], ['Contenus ce mois', '12,341', '▶', '#dbeafe'], ['Engagement Moyen', '7.2%', '❤️', '#dcfce7'], ['ROI Moyen', '342%', '📈', '#fef9c3']].map(([label, val, icon, bg]) => (
              <div key={label} style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #f0f0f0', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: '0.78rem', color: '#a0aec0', marginBottom: '0.3rem' }}>{label}</div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a202c' }}>{val}</div></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{icon}</div>
              </div>
            ))}
          </div>

          {/* Sous-onglets UGC */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#fff', padding: '0.4rem', borderRadius: '12px', width: 'fit-content', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {[{ id: 'feed', label: '⊞ Feed UGC' }, { id: 'analyse', label: '⓪ Analyse IA' }, { id: 'preselection', label: '🔖 Présélection' }].map(tab => (
              <button key={tab.id} onClick={() => setUgcTab(tab.id)} style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: ugcTab === tab.id ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'transparent', color: ugcTab === tab.id ? '#fff' : '#718096', fontSize: '0.82rem', fontWeight: ugcTab === tab.id ? 600 : 400, fontFamily: 'inherit' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* FEED UGC */}
          {ugcTab === 'feed' && (
            <div>
              {/* Filtres */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {['Contenu', 'Sélection des critères', 'Toutes catégories', 'Tous formats', 'Trier'].map((f, i) => (
                  <button key={f} style={{ padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#718096', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>{f}</button>
                ))}
              </div>
              {/* Grille masonry */}
              <div style={{ columns: '3', columnGap: '1rem' }}>
                {ugcCreators.map((creator, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', marginBottom: '1rem', breakInside: 'avoid', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: i % 3 === 0 ? '200px' : i % 3 === 1 ? '260px' : '180px', background: creator.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', position: 'relative' }}>
                      {creator.img}
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {i % 2 === 0 ? '▶ Vidéo' : i % 3 === 0 ? '⭐ Vedette' : '📸 Photo'}
                      </div>
                    </div>
                    <div style={{ padding: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: creator.gradient }} />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a202c' }}>@{creator.name} ✓</div>
                          <div style={{ fontSize: '0.68rem', color: '#a0aec0' }}>{creator.niche} · {creator.engagement} engagement</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                        {creator.tags.map(tag => (
                          <span key={tag} style={{ background: '#f4f4f5', color: '#71717a', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a0aec0' }}>🤍</button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#a0aec0' }}>💬</button>
                        </div>
                        <button style={{ padding: '0.3rem 0.7rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Inviter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button style={{ padding: '0.75rem 2rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', color: '#718096', fontWeight: 500 }}>Charger plus de contenu</button>
              </div>
            </div>
          )}

          {/* ANALYSE IA */}
          {ugcTab === 'analyse' && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#a855f7', fontSize: '1.2rem' }}>💡</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', margin: 0 }}>Analyse IA</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '2rem' }}>Décrivez ce que vous recherchez et laissez notre IA trouver les créateurs UGC parfaits</p>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 600, color: '#1a202c', marginBottom: '1rem' }}>Décrivez vos besoins</div>
                <label style={lbl}>Audience cible</label>
                <input value={form.iaAudience} onChange={e => set('iaAudience', e.target.value)} placeholder="Ex: Femmes 25-35 ans, passionnées de mode, urbaines..." style={inp} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Type de contenu souhaité</label>
                <select value={form.iaContentType} onChange={e => set('iaContentType', e.target.value)} style={{ ...inp, background: '#fff' }}>
                  <option value="">Choisir un type</option>
                  <option>Vidéo lifestyle</option>
                  <option>Photo produit</option>
                  <option>Tutoriel</option>
                  <option>Unboxing</option>
                  <option>Review</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={lbl}>Valeurs de votre marque</label>
                <textarea value={form.iaValues} onChange={e => set('iaValues', e.target.value)} placeholder="Décrivez les valeurs importantes pour votre marque..." rows={4} style={{ ...inp, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>Type d'analyse</label>
                <select value={form.iaAnalysisType} onChange={e => set('iaAnalysisType', e.target.value)} style={{ ...inp, background: '#fff' }}>
                  <option value="matching">Matching Parfait...</option>
                  <option value="predictive">Analyse Prédictive</option>
                  <option value="roi">Optimisation ROI</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {[{ icon: '👁', title: 'Analyse Prédictive', desc: 'ROI et performance estimés' }, { icon: '🎯', title: 'Matching Intelligent', desc: 'Créateurs alignés avec vos besoins' }].map(item => (
                  <div key={item.title} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#a855f7' }}>{item.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a202c' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {iaAnalyzed && (
                <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '0.75rem' }}>✨ Résultats de l'analyse IA</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {[['Créateurs matchés', '47', '#a855f7'], ['ROI estimé', '340%', '#22c55e'], ['Engagement moyen', '6.8%', '#3b82f6']].map(([label, val, color]) => (
                      <div key={label} style={{ textAlign: 'center', padding: '0.75rem', background: '#fff', borderRadius: '10px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{val}</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleIaAnalysis} disabled={iaLoading} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: iaLoading ? 0.7 : 1 }}>
                {iaLoading ? '⏳ Analyse en cours...' : '✨ Lancer l\'Analyse IA'}
              </button>
            </div>
          )}

          {/* PRÉSÉLECTION */}
          {ugcTab === 'preselection' && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span>🔖</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', margin: 0 }}>Créateurs Présélectionnés</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '2rem' }}>0 créateur(s) dans votre présélection</p>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🔖</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a0aec0', marginBottom: '0.5rem' }}>Aucun créateur présélectionné</h3>
                <p style={{ color: '#cbd5e0', marginBottom: '1.5rem' }}>Explorez les créateurs et ajoutez vos favoris à votre présélection</p>
                <button onClick={() => setUgcTab('feed')} style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600 }}>Découvrir des créateurs</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}