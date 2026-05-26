'use client'
import { useUserLevel } from '@/lib/hook/useUserLevel'
import LevelUpModal from '@/components/LevelUpModal'

/* ============================================================
   LevelUpProvider
   
   Composant à placer dans le layout du dashboard pour gérer
   l'affichage du modal "Level Up !" de manière centralisée.
   ============================================================ */
export default function LevelUpProvider({ user, children }) {
  const { levelUpModalOpen, levelUpNewLevel, levelUpPreviousLevel, closeLevelUpModal } = useUserLevel(user?.id)

  return (
    <>
      {children}
      <LevelUpModal
        open={levelUpModalOpen}
        onClose={closeLevelUpModal}
        newLevel={levelUpNewLevel}
        previousLevel={levelUpPreviousLevel}
      />
    </>
  )
}
