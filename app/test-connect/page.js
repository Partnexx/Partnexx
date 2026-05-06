'use client'
import { useState } from 'react'

export default function TestConnect() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleOnboard = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencerId: 'db9f7a27-6e37-43c4-91bd-4467ebd14611' // Mathias
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage('❌ ' + data.error)
      }
    } catch (err) {
      setMessage('❌ ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f8f9fc',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        padding: 40, width: '100%', maxWidth: 480,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Test Stripe Connect
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
          Connecter le compte bancaire de Mathias (influenceur test)
        </p>

        <button
          onClick={handleOnboard}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            borderRadius: 8, background: loading ? '#9ca3af' : '#3b6ef6',
            color: '#fff', border: 'none', fontSize: 14,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Chargement...' : 'Connecter compte Stripe →'}
        </button>

        {message && (
          <div style={{
            marginTop: 16, padding: '12px 16px',
            borderRadius: 8, background: '#fff1f2',
            color: '#dc2626', fontSize: 13
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}