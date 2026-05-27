'use client'
import { createContext, useContext } from 'react'
import { useUserLevel } from '@/lib/hook/useUserLevel'
import { useGamificationListeners } from '@/lib/hook/useGamificationListeners'

const LevelContext = createContext(null)

export function LevelProvider({ user, children }) {
  const levelState = useUserLevel(user?.id)
  
  // ⭐ Active les listeners Realtime pour contrats signés + avis reçus
  useGamificationListeners(user?.id, levelState.awardPoints)
  
  return (
    <LevelContext.Provider value={levelState}>
      {children}
    </LevelContext.Provider>
  )
}

export function useLevel() {
  const ctx = useContext(LevelContext)
  if (!ctx) {
    throw new Error('useLevel must be used within a LevelProvider')
  }
  return ctx
}
