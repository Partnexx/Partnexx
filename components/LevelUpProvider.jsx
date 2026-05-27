'use client'
import { LevelProvider, useLevel } from '@/lib/context/LevelContext'
import LevelUpModal from '@/components/LevelUpModal'

function LevelUpModalManager() {
  const { levelUpModalOpen, levelUpNewLevel, levelUpPreviousLevel, closeLevelUpModal } = useLevel()
  return (
    <LevelUpModal
      open={levelUpModalOpen}
      onClose={closeLevelUpModal}
      newLevel={levelUpNewLevel}
      previousLevel={levelUpPreviousLevel}
    />
  )
}

export default function LevelUpProvider({ user, children }) {
  return (
    <LevelProvider user={user}>
      {children}
      <LevelUpModalManager />
    </LevelProvider>
  )
}
