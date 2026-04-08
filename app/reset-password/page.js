'use client'
import { useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabase'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async () => {
    if (!email) return setError('Veuillez entrer votre email')
    setLoading(true)
    setError('')
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (resetError) throw resetError
      setSent(true)
    } catch (err) {
      setError('Une erreur est survenue. Vérifiez votre email.')
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

      <Link href="/login" style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', color: '#555', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
        ← Retour à la connexion
      </Link>

      <div style={{
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
        borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        {!sent ? (
          <>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
              🔒
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>
              Mot de passe oublié ?
            </h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.6 }}>
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  border: '1.5px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                  color: '#1a202c', background: '#fff', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c53030', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'left' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(168,85,247,0.35)',
                opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
              }}
            >
              {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </>
        ) : (
          <>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
              ✅
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>
              Email envoyé !
            </h2>
            <p style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.6 }}>
              Un lien de réinitialisation a été envoyé à <strong style={{ color: '#1a202c' }}>{email}</strong>. Vérifiez votre boîte mail.
            </p>
            <Link href="/login" style={{
              display: 'block', padding: '0.9rem',
              background: 'linear-gradient(135deg,#a855f7,#ec4899)',
              color: '#fff', borderRadius: '10px',
              fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
            }}>
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  )
}