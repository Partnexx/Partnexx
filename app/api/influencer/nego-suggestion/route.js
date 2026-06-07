import { NextResponse } from 'next/server'

// Suggestion de tarif pour la négociation, générée par l'IA.
// Si la clé Anthropic n'est pas dispo, on renvoie un conseil calculé simple (secours).
export async function POST(req) {
  try {
    const { title, description, budgetMin, budgetMax } = await req.json()

    const fallback = () => {
      if (budgetMin && budgetMax) {
        const sweet = Math.round((Number(budgetMin) + Number(budgetMax)) / 2 / 50) * 50
        return `Pour cette campagne, viser autour de ${sweet.toLocaleString('fr-FR')}€ (le haut du milieu de fourchette) est un bon point de départ : crédible pour la marque, et ça te laisse de la marge pour négocier.`
      }
      return "Pas de budget indiqué : propose un tarif basé sur ton temps de production + la valeur de ton audience, et justifie-le en une phrase dans ton message."
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ suggestion: fallback() })

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Tu conseilles un créateur de contenu (influenceur) qui négocie son tarif pour une campagne sur une plateforme française.
Campagne : "${title || 'Sans titre'}"
Description : "${(description || '').slice(0, 300)}"
Budget indiqué par la marque : ${budgetMin && budgetMax ? `${budgetMin}€ à ${budgetMax}€` : 'non communiqué'}.
En 2 phrases maximum, en français, tutoiement : conseille un montant précis (ou une petite fourchette) à proposer et UNE astuce de négociation concrète. Pas de préambule, pas de liste.`,
        }],
      }),
    })

    if (!res.ok) return NextResponse.json({ suggestion: fallback() })
    const data = await res.json()
    const text = (data?.content || []).filter(b => b.type === 'text').map(b => b.text).join(' ').trim()
    return NextResponse.json({ suggestion: text || fallback() })
  } catch {
    return NextResponse.json({ suggestion: null }, { status: 500 })
  }
}
