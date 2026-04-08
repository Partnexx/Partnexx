'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function UpdatePassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = async () => {
    if (!password || !confirm) return setError('Veuillez remplir tous les champs')
    if (password.length < 8) return setError('Minimum 8 caractères')
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas')
    setLoading(true)
    setError('')
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
      setError('Une erreur est survenue. Réessayez.')
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

      <div style={{
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
        borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        {!done ? (
          <>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>🔑</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>Nouveau mot de passe</h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 300, marginBottom: '2rem' }}>Choisissez un nouveau mot de passe sécurisé.</p>

            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  style={{ width: '100%', padding: '0.8rem 3rem 0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: '#1a202c', background: '#fff', boxSizing: 'border-box' }}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#a0aec0' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirmer le mot de passe"
                onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                style={{ width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: '#1a202c', background: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c53030', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'left' }}>{error}</div>
            )}

            <button
              onClick={handleUpdate}
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(168,85,247,0.35)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </>
        ) : (
          <>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✅</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>Mot de passe mis à jour !</h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 300, marginBottom: '2rem' }}>Vous allez être redirigé vers la connexion dans 3 secondes...</p>
            <Link href="/login" style={{ display: 'block', padding: '0.9rem', background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none' }}>
              Se connecter maintenant
            </Link>
          </>
        )}
      </div>
    </div>
  )
}