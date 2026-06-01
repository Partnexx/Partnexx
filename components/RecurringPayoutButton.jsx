'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Bouton qui démarre les versements récurrents d'un contrat.
 * Usage : <RecurringPayoutButton contractId={contract.id} />
 */
export default function RecurringPayoutButton({ contractId, label = 'Activer les versements récurrents' }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!contractId) {
      alert('Aucun contrat sélectionné.')
      return
    }
    setLoading(true)
    try {
      // Récupérer le token de session (pour l'auth de la route)
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        alert('Tu dois être connecté.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/stripe/subscribe-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contractId }),
      })

      const data = await res.json()

      if (data.url) {
        // Redirige vers le Checkout Stripe (la marque enregistre sa carte + démarre l'abonnement)
        window.location.href = data.url
      } else {
        alert(data.error || "Erreur lors de la création de l'abonnement")
        setLoading(false)
      }
    } catch (e) {
      alert('Erreur : ' + e.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Redirection…' : label}
    </button>
  )
}
