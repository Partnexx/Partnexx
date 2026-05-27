import { useEffect, useRef } from 'react'
import supabase from '@/lib/supabase'

/* ============================================================
   useGamificationListeners — VERSION CORRIGÉE
   
   ATTENTION : contracts.influencer_id pointe vers influencers.id
   (pas vers auth.users.id directement). On doit donc d'abord
   récupérer l'influencer_id du user.
   ============================================================ */
export function useGamificationListeners(userId, awardPoints) {
  const initializedRef = useRef(false)
  const processedIdsRef = useRef(new Set())
  const influencerIdRef = useRef(null)

  useEffect(() => {
    if (!userId || !awardPoints) return

    const setup = async () => {
      // 1. Récupère l'influencer_id du user
      const { data: influencer, error: infError } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (infError || !influencer) {
        console.warn('Pas d\'influencer_id trouvé pour ce user, listeners désactivés')
        return
      }
      influencerIdRef.current = influencer.id

      // 2. Charge les IDs déjà awardés pour éviter les doublons
      const { data: history } = await supabase
        .from('partnexx_score_history')
        .select('reason, metadata')
        .eq('user_id', userId)
        .in('reason', ['contract_signed', 'review_received'])

      history?.forEach(row => {
        if (row.reason === 'contract_signed' && row.metadata?.contract_id) {
          processedIdsRef.current.add(`contract:${row.metadata.contract_id}`)
        }
        if (row.reason === 'review_received' && row.metadata?.review_id) {
          processedIdsRef.current.add(`review:${row.metadata.review_id}`)
        }
      })
      initializedRef.current = true
      console.log(`✅ Gamification listeners ready (influencer_id: ${influencer.id}, ${processedIdsRef.current.size} IDs déjà traités)`)
    }

    setup()

    // ===== LISTENER : Contrats signés =====
    const contractsChannel = supabase
      .channel(`gamification-contracts:${userId}:${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'contracts',
      }, async (payload) => {
        if (!initializedRef.current || !influencerIdRef.current) return
        const contract = payload.new
        if (!contract) return

        // Le contrat doit concerner NOTRE influencer
        if (contract.influencer_id !== influencerIdRef.current) return

        // Vient de passer à signed (et avant n'était pas signed)
        const justSigned = contract.status === 'signed' && contract.influencer_signed_at && payload.old?.status !== 'signed'
        if (!justSigned) return

        const idKey = `contract:${contract.id}`
        if (processedIdsRef.current.has(idKey)) {
          console.log('⏭️ Contrat déjà awardé, skip', contract.id)
          return
        }
        processedIdsRef.current.add(idKey)

        console.log('📝 Contrat signé détecté → +200 pts', contract.id)
        await awardPoints(200, 'contract_signed', {
          contract_id: contract.id,
          collaboration_id: contract.collaboration_id,
          amount: contract.amount,
        })
      })
      .subscribe()

    // ===== LISTENER : Avis reçus =====
    const reviewsChannel = supabase
      .channel(`gamification-reviews:${userId}:${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reviews',
        filter: `reviewee_id=eq.${userId}`,
      }, async (payload) => {
        if (!initializedRef.current) return
        const review = payload.new
        if (!review) return

        const idKey = `review:${review.id}`
        if (processedIdsRef.current.has(idKey)) {
          console.log('⏭️ Avis déjà awardé, skip', review.id)
          return
        }
        processedIdsRef.current.add(idKey)

        const rating = review.rating || 0
        let points = 0
        if (rating === 5) points = 100
        else if (rating >= 3) points = 50

        if (points === 0) {
          console.log(`📝 Avis ${rating}⭐ reçu, pas de points`)
          return
        }

        console.log(`📝 Avis ${rating}⭐ reçu → +${points} pts`, review.id)
        await awardPoints(points, 'review_received', {
          review_id: review.id,
          rating: rating,
          collaboration_id: review.collaboration_id,
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(contractsChannel)
      supabase.removeChannel(reviewsChannel)
    }
  }, [userId, awardPoints])
}
