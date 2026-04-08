'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  // Data
  const [role, setRole] = useState('') // 'influencer' | 'brand'
  const [form, setForm] = useState({
    // Étape 1
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    // Étape 2 influenceur
    avatar: null, avatarPreview: '', username: '', category: '', language: 'Français', country: 'France', bio: '',
    // Étape 2 marque
    logo: null, logoPreview: '', companyName: '', industry: '', companySize: '', targetAudience: '', description: '',
    // Étape 3
    website: '',
    instagram: false, tiktok: false, youtube: false, linkedin: false,
    // Étape 4
    legalStatus: '', siret: '', portfolio: '', address: '', city: '', country2: '',
    // Étape 5
    plan: '',
    // Étape 6
    cgv: false, newsletter: false,
  })

  const steps = [
    'Informations de base', 'Profil', 'Réseaux sociaux',
    'Infos professionnelles', 'Paiement', 'Conditions', 'Finalisation'
  ]

  const influencerPlans = [
    { id: 'free', name: 'Gratuit', price: '0€', sub: 'Toujours gratuit', features: ['Profil basique', '5 demandes de partenariat/mois', 'Messagerie limitée', 'Support communautaire'], popular: false },
    { id: 'creator', name: 'Créateur', price: '39€', sub: 'par mois', features: ['Profil premium', 'Demandes illimitées', 'Analytics avancées', 'Support prioritaire', 'Badges de vérification'], popular: true },
    { id: 'pro', name: 'Pro', price: '99€', sub: 'par mois', features: ['Tout du plan Créateur', 'Gestionnaire de compte dédié', 'Négociation automatisée', 'Rapports détaillés', 'API access'], popular: false },
  ]

  const brandPlans = [
    { id: 'starter', name: 'Starter', price: '59€', sub: 'par mois', features: ["Jusqu'à 3 campagnes/mois", "Base d'influenceurs", 'Dashboard basique', 'Support email'], popular: false },
    { id: 'growth', name: 'Growth', price: '199€', sub: 'par mois', features: ['Campagnes illimitées', 'Recherche avancée', 'Analytics ROI', 'Support téléphonique', 'Intégrations tierces'], popular: true },
    { id: 'scale', name: 'Scale', price: '799€', sub: 'par mois', features: ['Tout du plan Growth', 'Account manager dédié', 'White-label options', 'API complète', 'Formation équipe'], popular: false },
  ]

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleFile = (e, key, previewKey) => {
    const file = e.target.files[0]
    if (!file) return
    set(key, file)
    set(previewKey, URL.createObjectURL(file))
  }

  const validateStep = () => {
    setError('')
    if (step === 1) {
      if (!role) return setError('Veuillez choisir votre profil') || false
      if (!form.firstName || !form.lastName) return setError('Prénom et nom requis') || false
      if (!form.email) return setError('Email requis') || false
      if (!form.password || form.password.length < 8) return setError('Mot de passe minimum 8 caractères') || false
      if (form.password !== form.confirmPassword) return setError('Les mots de passe ne correspondent pas') || false
    }
    if (step === 2 && role === 'influencer') {
      if (!form.username) return setError('Pseudo requis') || false
      if (!form.category) return setError('Catégorie requise') || false
    }
    if (step === 2 && role === 'brand') {
      if (!form.companyName) return setError('Nom de l\'entreprise requis') || false
      if (!form.industry) return setError('Secteur d\'activité requis') || false
    }
    if (step === 3 && role === 'influencer') {
      if (!form.instagram && !form.tiktok && !form.youtube) return setError('Connectez au moins un réseau social') || false
    }
    if (step === 5) {
      if (!form.plan) return setError('Veuillez choisir un plan') || false
    }
    if (step === 6) {
      if (!form.cgv) return setError('Vous devez accepter les CGU') || false
    }
    return true
  }

  const nextStep = () => {
    if (!validateStep()) return
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    setError('')
    try {
      // 1. Créer le compte Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: `${form.firstName} ${form.lastName}`,
            role: role === 'influencer' ? 'influencer' : 'brand',
          }
        }
      })
      if (authError) throw authError

      const userId = authData.user?.id
      if (!userId) throw new Error('Erreur lors de la création du compte')

      // 2. Upload avatar/logo si présent
      let avatarUrl = null
      if (role === 'influencer' && form.avatar) {
        const { data: uploadData } = await supabase.storage
          .from('avatars')
          .upload(`${userId}/avatar`, form.avatar, { upsert: true })
        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar`)
          avatarUrl = publicUrl
        }
      }
      let logoUrl = null
      if (role === 'brand' && form.logo) {
        const { data: uploadData } = await supabase.storage
          .from('logos')
          .upload(`${userId}/logo`, form.logo, { upsert: true })
        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(`${userId}/logo`)
          logoUrl = publicUrl
        }
      }

      // 3. Mettre à jour le profil
      await supabase.from('profiles').update({
        full_name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        avatar_url: avatarUrl,
        onboarding_done: true,
      }).eq('id', userId)

      // 4. Mettre à jour brand ou influencer
      if (role === 'influencer') {
        await supabase.from('influencers').update({
          display_name: form.username,
          niche: [form.category],
          languages: [form.language],
          country: form.country,
          subscription_plan: form.plan,
        }).eq('user_id', userId)

        // Réseaux sociaux
        const socials = [
          { platform: 'instagram', connected: form.instagram },
          { platform: 'tiktok', connected: form.tiktok },
          { platform: 'youtube', connected: form.youtube },
        ].filter(s => s.connected)

        for (const social of socials) {
          const infId = (await supabase.from('influencers').select('id').eq('user_id', userId).single()).data?.id
          if (infId) {
            await supabase.from('social_accounts').upsert({
              influencer_id: infId,
              platform: social.platform,
              handle: `@${form.username}`,
            })
          }
        }
      } else {
        await supabase.from('brands').update({
          company_name: form.companyName,
          industry: form.industry,
          company_size: form.companySize,
          logo_url: logoUrl,
          description: form.description,
          target_audience: form.targetAudience,
          subscription_plan: form.plan,
        }).eq('user_id', userId)
      }

      // 5. Redirection
      router.push(role === 'influencer' ? '/dashboard/influencer' : '/dashboard/brand')

    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  // ===================== RENDER =====================

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a8c8f8 0%, #c4a8f8 30%, #f8a8d8 70%, #f8c8e8 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
    }}>
      {/* Blobs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(180,140,255,0.3)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,140,200,0.3)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Back */}
      <div style={{ position: 'fixed', top: '1rem', left: '1.5rem', zIndex: 10 }}>
        <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>← Retour à l'accueil</a>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '0.2rem' }}>Connexion réussie</div>
          <div style={{ color: '#718096' }}>{toast}</div>
        </div>
      )}

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem', marginTop: '3rem', position: 'relative', zIndex: 1 }}>
        {steps.map((s, i) => {
          const num = i + 1
          const done = step > num
          const active = step === num
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: done ? 'linear-gradient(135deg,#a855f7,#ec4899)' : active ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#fff',
                  border: active ? 'none' : done ? 'none' : '2px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: done || active ? '#fff' : '#a0aec0',
                  fontSize: '0.8rem', fontWeight: 700,
                  boxShadow: active ? '0 0 0 4px rgba(168,85,247,0.15)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize: '0.65rem', color: active ? '#7c3aed' : '#a0aec0', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', maxWidth: '70px', textAlign: 'center', lineHeight: 1.2 }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: '50px', height: '2px', background: step > num ? 'linear-gradient(90deg,#a855f7,#ec4899)' : '#e2e8f0', margin: '0 4px', marginBottom: '20px', transition: 'background 0.3s' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Card */}
      <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#a0aec0', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Étape {step} sur 7</p>
          {step === 1 && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Quel est votre profil ?</h2>}
          {step === 2 && role === 'influencer' && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Votre profil créateur</h2>}
          {step === 2 && role === 'brand' && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Votre entreprise</h2>}
          {step === 3 && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>{role === 'influencer' ? 'Connectez vos réseaux sociaux' : 'Vos réseaux professionnels'}</h2>}
          {step === 3 && <p style={{ color: '#718096', fontSize: '0.85rem' }}>{role === 'influencer' ? 'Connectez au moins un réseau pour continuer' : 'Ajoutez vos réseaux pour renforcer votre présence'}</p>}
          {step === 4 && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Informations professionnelles</h2>}
          {step === 5 && <><h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Choisissez votre plan</h2><p style={{ color: '#718096', fontSize: '0.82rem' }}>Essai gratuit de 14 jours sur les plans payants</p></>}
          {step === 6 && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Conditions</h2>}
          {step === 7 && <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a202c' }}>Prêt à commencer !</h2>}
        </div>

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { key: 'influencer', icon: '🎨', title: 'Créateur de contenu', sub: 'Influenceur, créateur, artiste', features: ['Gérez vos partenariats', 'Analytics détaillées', 'Paiements sécurisés'] },
                { key: 'brand', icon: '🚀', title: 'Marque / Agence', sub: 'Entreprise, marque, agence', features: ['Trouvez des influenceurs', 'Gérez vos campagnes', 'ROI transparent'] },
              ].map(opt => (
                <div key={opt.key} onClick={() => setRole(opt.key)} style={{
                  border: `2px solid ${role === opt.key ? '#a855f7' : '#e2e8f0'}`,
                  borderRadius: '14px', padding: '1.25rem', cursor: 'pointer',
                  background: role === opt.key ? 'rgba(168,85,247,0.04)' : '#fff',
                  transition: 'all 0.2s', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c', marginBottom: '0.2rem' }}>{opt.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.75rem' }}>{opt.sub}</div>
                  {opt.features.map((f, i) => <div key={i} style={{ fontSize: '0.72rem', color: '#718096' }}>✓ {f}</div>)}
                </div>
              ))}
            </div>
            {[
              [{ key: 'firstName', placeholder: 'Votre prénom', label: 'Prénom *' }, { key: 'lastName', placeholder: 'Votre nom', label: 'Nom *' }],
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {row.map(field => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <input value={form[field.key]} onChange={e => set(field.key, e.target.value)} placeholder={field.placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>
            ))}
            {[
              { key: 'email', placeholder: 'votre@email.com', label: 'Email professionnel *', type: 'email' },
              { key: 'phone', placeholder: '+33 6 12 34 56 78', label: 'Numéro de téléphone', type: 'tel' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '0.75rem' }}>
                <label style={labelStyle}>{field.label}</label>
                <input type={field.type} value={form[field.key]} onChange={e => set(field.key, e.target.value)} placeholder={field.placeholder} style={inputStyle} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Mot de passe *</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 caractères" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirmer le mot de passe *</label>
                <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Confirmer le mot de passe" style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 INFLUENCEUR */}
        {step === 2 && role === 'influencer' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Photo de profil</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: form.avatarPreview ? `url(${form.avatarPreview}) center/cover` : '#f7f8fa', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
                  {!form.avatarPreview && '⬆'}
                </div>
                <label style={{ ...btnOutlineStyle, cursor: 'pointer' }}>
                  Choisir une photo
                  <input type="file" accept="image/*" onChange={e => handleFile(e, 'avatar', 'avatarPreview')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Nom d'utilisateur / Pseudo *</label>
              <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="@votre_pseudo" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Catégorie principale *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
                <option value="">Sélectionnez une catégorie</option>
                {['Mode', 'Beauté', 'Tech', 'Food', 'Sport', 'Voyage', 'Gaming', 'Lifestyle', 'Business', 'Art'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Langue principale</label>
                <select value={form.language} onChange={e => set('language', e.target.value)} style={inputStyle}>
                  {['Français', 'Anglais', 'Espagnol', 'Arabe', 'Portugais'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Pays de résidence</label>
                <select value={form.country} onChange={e => set('country', e.target.value)} style={inputStyle}>
                  {['France', 'Belgique', 'Suisse', 'Canada', 'Maroc', 'Tunisie', 'Autre'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Description courte (Bio publique)</label>
              <textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Décrivez-vous en quelques mots..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* ÉTAPE 2 MARQUE */}
        {step === 2 && role === 'brand' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Logo de l'entreprise</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: form.logoPreview ? `url(${form.logoPreview}) center/cover` : '#f7f8fa', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
                  {!form.logoPreview && '⬆'}
                </div>
                <label style={{ ...btnOutlineStyle, cursor: 'pointer' }}>
                  Choisir un logo
                  <input type="file" accept="image/*" onChange={e => handleFile(e, 'logo', 'logoPreview')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Nom de l'entreprise / Marque *</label>
              <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Nom de votre entreprise" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Secteur d'activité *</label>
              <select value={form.industry} onChange={e => set('industry', e.target.value)} style={inputStyle}>
                <option value="">Sélectionnez un secteur</option>
                {['Mode & Luxe', 'Beauté & Cosmétiques', 'Tech & Digital', 'Food & Beverage', 'Sport & Fitness', 'Voyage & Tourisme', 'E-commerce', 'Finance', 'Santé & Bien-être', 'Autre'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Taille de l'entreprise</label>
              <select value={form.companySize} onChange={e => set('companySize', e.target.value)} style={inputStyle}>
                <option value="">Nombre d'employés</option>
                {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Audience cible</label>
              <input value={form.targetAudience} onChange={e => set('targetAudience', e.target.value)} placeholder="Ex: Femmes 18-35 ans, passionnées de mode" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Description de l'entreprise</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Présentez votre entreprise, vos valeurs, vos produits..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {step === 3 && (
          <div>
            {role === 'brand' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Site web</label>
                <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://votre-entreprise.com" style={inputStyle} />
              </div>
            )}
            {(role === 'influencer'
              ? [{ key: 'instagram', icon: '📸', name: 'Instagram', color: '#E1306C' }, { key: 'tiktok', icon: '🎵', name: 'TikTok', color: '#000' }, { key: 'youtube', icon: '▶️', name: 'YouTube', color: '#FF0000' }]
              : [{ key: 'instagram', icon: '📸', name: 'Instagram', color: '#E1306C' }, { key: 'tiktok', icon: '🎵', name: 'TikTok', color: '#000' }, { key: 'linkedin', icon: '💼', name: 'LinkedIn', color: '#0A66C2' }]
            ).map(social => (
              <div key={social.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f7f8fa', borderRadius: '12px', marginBottom: '0.75rem', border: form[social.key] ? '1.5px solid #a855f7' : '1.5px solid transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: social.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#fff' }}>{social.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{social.name}</div>
                    <div style={{ fontSize: '0.75rem', color: form[social.key] ? '#a855f7' : '#a0aec0' }}>{form[social.key] ? 'Connecté ✓' : 'Non connecté'}</div>
                  </div>
                </div>
                {form[social.key]
                  ? <div style={{ color: '#a855f7', fontSize: '1.2rem' }}>✓</div>
                  : <button onClick={() => { set(social.key, true); showToast(`Votre compte ${social.name} a été connecté avec succès.`) }} style={btnOutlineStyle}>Connecter</button>
                }
              </div>
            ))}
          </div>
        )}

        {/* ÉTAPE 4 */}
        {step === 4 && (
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Statut juridique</label>
              <select value={form.legalStatus} onChange={e => set('legalStatus', e.target.value)} style={inputStyle}>
                <option value="">Sélectionnez votre statut</option>
                {['Auto-entrepreneur', 'SASU', 'SARL', 'SAS', 'Particulier', 'Association', 'Autre'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>SIRET (facultatif)</label>
              <input value={form.siret} onChange={e => set('siret', e.target.value)} placeholder="123 456 789 00012" style={inputStyle} />
              <p style={{ fontSize: '0.72rem', color: '#a0aec0', marginTop: '0.25rem' }}>Requis avant le premier paiement</p>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Lien portfolio (facultatif)</label>
              <input value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://votre-portfolio.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Adresse</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Votre adresse" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Ville</label>
                <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Votre ville" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Pays</label>
                <input value={form.country2} onChange={e => set('country2', e.target.value)} placeholder="Votre pays" style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 */}
        {step === 5 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {(role === 'influencer' ? influencerPlans : brandPlans).map(plan => (
              <div key={plan.id} onClick={() => set('plan', plan.id)} style={{
                border: `2px solid ${form.plan === plan.id ? '#a855f7' : '#e2e8f0'}`,
                borderRadius: '14px', padding: '1.25rem', cursor: 'pointer',
                background: form.plan === plan.id ? 'rgba(168,85,247,0.04)' : '#fff',
                position: 'relative', transition: 'all 0.2s',
              }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg,#a855f7,#ec4899)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px', whiteSpace: 'nowrap' }}>⭐ Populaire</div>}
                <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c', marginBottom: '0.25rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{plan.price}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{plan.sub}</div>
                </div>
                {plan.features.map((f, i) => <div key={i} style={{ fontSize: '0.72rem', color: '#718096', marginBottom: '0.3rem' }}>✓ {f}</div>)}
              </div>
            ))}
          </div>
        )}

        {/* ÉTAPE 6 */}
        {step === 6 && (
          <div>
            {[
              { key: 'cgv', label: <span>J'accepte les <a href="#" style={{ color: '#a855f7' }}>Conditions Générales d'Utilisation</a> et la <a href="#" style={{ color: '#a855f7' }}>Politique de confidentialité</a> de Partnexx *</span> },
              { key: 'newsletter', label: "J'accepte de recevoir les actualités et offres de Partnexx (optionnel)" },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => set(item.key, !form[item.key])}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${form[item.key] ? '#a855f7' : '#e2e8f0'}`, background: form[item.key] ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#fff', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem' }}>
                  {form[item.key] && '✓'}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5 }}>{item.label}</span>
              </div>
            ))}
            <div style={{ background: '#f7f8fa', borderRadius: '12px', padding: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c', marginBottom: '0.5rem' }}>🔒 Vos données sont en sécurité</div>
              <div style={{ fontSize: '0.82rem', color: '#718096', lineHeight: 1.6 }}>Nous utilisons les dernières technologies de sécurité pour protéger vos informations personnelles. Vos données ne seront jamais partagées sans votre consentement.</div>
            </div>
          </div>
        )}

        {/* ÉTAPE 7 */}
        {step === 7 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', color: '#fff' }}>✓</div>
            <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '2rem' }}>Votre compte est prêt à être créé. Cliquez sur "Créer mon compte" pour finaliser votre inscription.</p>
            <div style={{ background: '#f7f8fa', borderRadius: '12px', padding: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a202c', marginBottom: '1rem' }}>Récapitulatif</div>
              {[
                { label: 'Type de compte', value: role === 'influencer' ? 'Créateur de contenu' : 'Marque / Agence' },
                { label: 'Email', value: form.email },
                { label: 'Plan', value: `${(role === 'influencer' ? influencerPlans : brandPlans).find(p => p.id === form.plan)?.name || '-'} (14 jours d'essai)` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#718096' }}>{item.label}:</span>
                  <span style={{ color: '#1a202c', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c53030', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</div>}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {step > 1 && <button onClick={prevStep} style={btnOutlineStyle}>← Retour</button>}
          {step < 7
            ? <button onClick={nextStep} style={{ ...btnPrimaryStyle, flex: step === 1 ? 1 : 'auto' }}>Suivant →</button>
            : <button onClick={handleSubmit} disabled={loading} style={{ ...btnPrimaryStyle, flex: 1, opacity: loading ? 0.7 : 1 }}>{loading ? 'Création en cours...' : 'Créer mon compte'}</button>
          }
        </div>

        {step === 1 && (
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#718096', marginTop: '1rem' }}>
            Vous avez déjà un compte ? <a href="/login" style={{ color: '#a855f7', fontWeight: 600 }}>Se connecter</a>
          </p>
        )}
      </div>
    </div>
  )
}

// Styles
const inputStyle = {
  width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0',
  borderRadius: '10px', fontSize: '0.875rem', outline: 'none',
  fontFamily: 'inherit', color: '#1a202c', background: '#fff',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
}
const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: '#4a5568', marginBottom: '0.35rem',
}
const btnPrimaryStyle = {
  padding: '0.8rem 1.75rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)',
  color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem',
  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s',
}
const btnOutlineStyle = {
  padding: '0.8rem 1.75rem', background: '#fff', color: '#4a5568',
  border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem',
  fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', flex: 1,
}