'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserLevel } from '@/lib/hook/useUserLevel'

/* ============================================================================
   LevelGate — Wrapper réutilisable pour les sections gamifiées

   Gère automatiquement 3 états :
   1. loading        → affiche un spinner (évite le flash de contenu non vérifié)
   2. profil < 100%  → affiche l'écran "Complète ton profil" (sauf si skipProfileCheck)
   3. tout OK        → affiche le contenu (children)

   USAGE :
     <LevelGate user={user} sectionTitle="Statistiques" sectionDescription="Vos analytics">
       <MonContenuGamifie />
     </LevelGate>
   ============================================================================ */
export default function LevelGate({
  user,
  children,
  sectionTitle = "Section",
  sectionDescription = "",
  skipProfileCheck = false,
}) {
  const router = useRouter()
  const { loading, isProfileComplete, profileCompletion } = useUserLevel(user?.id)

  // ====== ÉTAT 1 : Loading (évite le flash) ======
  if (loading) {
    return (
      <div className="space-y-6">
        {sectionTitle && (
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{sectionTitle}</h1>
            {sectionDescription && <p className="text-muted-foreground">{sectionDescription}</p>}
          </div>
        )}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  // ====== ÉTAT 2 : Profil incomplet → écran de blocage ======
  if (!skipProfileCheck && !isProfileComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{sectionTitle}</h1>
          {sectionDescription && <p className="text-muted-foreground">{sectionDescription}</p>}
        </div>

        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-orange-700 mb-2">Section verrouillée</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complète ton profil à 100% pour débloquer cette section et accéder à ton niveau Bronze.
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>Profil complété</span>
                <span className="text-orange-600">{profileCompletion}%</span>
              </div>
              <div className="relative h-3 bg-orange-500/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <Button
                onClick={() => router.push('/dashboard/influencer?section=profil')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold"
              >
                <Target className="h-4 w-4 mr-2" />Compléter mon profil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ====== ÉTAT 3 : Tout OK → on affiche le contenu ======
  return children
}