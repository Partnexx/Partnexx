'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return setError('Veuillez remplir tous les champs')
    setLoading(true)
    setError('')

    try {
      // 1. Connexion Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError
      if (!data?.user) throw new Error('Utilisateur introuvable')

      // 2. Récupérer le rôle dans profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Erreur profil:', profileError)
        router.push('/dashboard/influencer')
        return
      }

      // 3. Normaliser le rôle (minuscules, sans espaces)
      const role = (profile?.role || 'influencer').toLowerCase().trim()
      console.log('✅ Role détecté:', role)

      // 4. Redirection selon le rôle
      if (role === 'admin') {
        router.push('/dashboard/admin')
      } else if (role === 'brand') {
        router.push('/dashboard/creator')
      } else {
        router.push('/dashboard/influencer')
      }

    } catch (err) {
      console.error('Erreur login:', err)
      if (err.message === 'Invalid login credentials') {
        setError('Email ou mot de passe incorrect')
      } else {
        setError(err.message || 'Une erreur est survenue')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a8c8f8 0%, #c4a8f8 30%, #f8a8d8 70%, #f8c8e8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(180,140,255,0.3)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,140,200,0.3)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Link href="/" style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', color: '#555', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
        ← Retour à l'accueil
      </Link>

      <div style={{
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
        borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#lg)" />
              <defs><linearGradient id="lg" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1a202c' }}>Partnexx</span>
          </div>
          <p style={{ color: '#718096', fontSize: '0.9rem', fontWeight: 300 }}>
            Accédez à votre compte pour continuer
          </p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '0.8rem 1rem',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
              color: '#1a202c', background: '#fff', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>
            Mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.8rem 3rem 0.8rem 1rem',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                color: '#1a202c', background: '#fff', boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#a0aec0' }}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {/* Mot de passe oublié */}
        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <Link href="/reset-password" style={{ fontSize: '0.82rem', color: '#a855f7', fontWeight: 600, textDecoration: 'none' }}>
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c53030', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Bouton connexion */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '0.9rem',
            background: 'linear-gradient(135deg,#a855f7,#ec4899)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(168,85,247,0.35)',
            opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {/* Séparateur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>OU</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Créer un compte */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.75rem' }}>
            Vous n'avez pas encore de compte ?
          </p>
          <Link href="/onboarding" style={{
            display: 'block', width: '100%', padding: '0.8rem',
            background: '#fff', color: '#1a202c',
            border: '1.5px solid #e2e8f0', borderRadius: '10px',
            fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none',
            textAlign: 'center', boxSizing: 'border-box',
          }}>
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  )
}