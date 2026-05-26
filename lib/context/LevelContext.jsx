'use client'
import { createContext, useContext } from 'react'
import { useUserLevel } from '@/lib/hook/useUserLevel'

const LevelContext = createContext(null)

export function LevelProvider({ user, children }) {
  const levelState = useUserLevel(user?.id)
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
