'use client'

import { usePlan } from '../lib/hook/usePlan'

export function PlanGate({ feature, requiredPlan, children }) {
  const { canAccess, loading } = usePlan()

  if (loading) return null

  if (!canAccess(feature)) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none blur-sm opacity-50">
          {children}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm z-10">
          <div className="text-center p-6">
            <div className="text-3xl mb-3">🔒</div>
            <p className="text-white font-semibold text-lg mb-1">
              Feature réservée au plan {requiredPlan}
            </p>
            <p className="text-white/70 text-sm mb-4">
              Passez à un plan supérieur pour débloquer cette fonctionnalité
            </p>
            <a href="/pricing" className="bg-gradient-brand text-white px-6 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition">
              Voir les plans
            </a>
          </div>
        </div>
      </div>
    )
  }

  return children
}