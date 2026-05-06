'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState(100)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // 1. Créer le PaymentIntent
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          campaignId: 'test-campaign',
          brandId: '46f965ec-479f-4777-af26-c8f23aca149e',
          description: 'Test paiement Partnexx',
        }),
      })

      const { clientSecret, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      // 2. Confirmer le paiement
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (error) {
        setMessage('❌ ' + error.message)
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('✅ Paiement réussi ! Transaction créée dans Supabase.')
      }

    } catch (err) {
      setMessage('❌ ' + err.message)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
          Montant (€)
        </label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          min={1}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, width: '100%' }}
        />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
          Carte de test
        </label>
        <div style={{ padding: '12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Carte test : 4242 4242 4242 4242 — exp: 12/28 — CVC: 424
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        style={{
          padding: '12px', borderRadius: 8,
          background: loading ? '#9ca3af' : '#3b6ef6',
          color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Traitement...' : `Payer ${amount}€`}
      </button>

      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: 8,
          background: message.includes('✅') ? '#f0fdf4' : '#fff1f2',
          color: message.includes('✅') ? '#15803d' : '#dc2626',
          fontSize: 13, fontWeight: 500
        }}>
          {message}
        </div>
      )}
    </form>
  )
}

export default function TestPayment() {
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
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Test paiement Partnexx</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
          Mode test Stripe — aucun vrai débit
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  )
}