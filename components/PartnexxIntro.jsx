'use client'
import { useState, useEffect, useLayoutEffect } from 'react'

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Intro "PARTNEXX" — champ de petits cubes 3D qui foncent du fond, s'étalent,
 * puis CONVERGENT vers le centre pour faire surgir le nom : impact (explosion de
 * lumière colorée + ondes de choc + tout l'écran tremble).
 * Respecte prefers-reduced-motion (version douce). Moins de cubes sur mobile.
 * Jouée à chaque entrée. Reste jusqu'à `ready` -> pas de page blanche.
 *
 * IMPORTANT (anti-flash) : le VOILE violet (le <div> de fond) est rendu DÈS LE SERVEUR
 * pour recouvrir l'écran immédiatement (plus de dashboard visible ~1s pendant
 * l'hydratation). Seuls les éléments animés (cubes, logo, impact) sont rendus
 * côté navigateur après montage -> on garde la protection anti-mismatch d'hydratation.
 */
export default function PartnexxIntro({ ready = true }) {
  const [mounted, setMounted] = useState(false) // false côté serveur ET au 1er rendu client -> markup identique, pas de mismatch
  const [done, setDone] = useState(false)        // true quand l'intro est finie -> on démonte
  const [minDone, setMinDone] = useState(false)
  const [fading, setFading] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useIso(() => {
    setMounted(true)
    try {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setIsMobile(window.innerWidth < 640)
    } catch {}
    const tMin = setTimeout(() => setMinDone(true), 3200)
    const tMax = setTimeout(() => { setFading(true); setTimeout(() => setDone(true), 800) }, 9000)
    return () => { clearTimeout(tMin); clearTimeout(tMax) }
  }, [])

  useEffect(() => {
    if (mounted && minDone && ready && !fading) {
      const buffer = setTimeout(() => { setFading(true); setTimeout(() => setDone(true), 800) }, 650)
      return () => clearTimeout(buffer)
    }
  }, [mounted, minDone, ready, fading])

  useEffect(() => {
    if (done) return
    const pB = document.body.style.overflow, pH = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden'
    return () => { document.body.style.overflow = pB; document.documentElement.style.overflow = pH }
  }, [done])

  if (done) return null

  const COLORS = ['#a855f7', '#d946ef', '#ec4899', '#8b5cf6', '#f472b6', '#c084fc']
  const N = isMobile ? 28 : 50
  const cubes = Array.from({ length: N }).map((_, i) => ({
    x: (Math.sin(i * 12.9898) * 45).toFixed(1) + 'vw',
    y: (Math.cos(i * 78.233) * 37).toFixed(1) + 'vh',
    rz: Math.round(((i * 47) % 120) - 60),
    size: 8 + (i % 6) * 6,
    delay: ((i % 14) * 0.025).toFixed(3),
    col: COLORS[i % COLORS.length],
  }))

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 45%, #2a1245 0%, #140a24 55%, #08040f 100%)', transition: 'opacity .8s ease', opacity: fading ? 0 : 1 }}
    >
      {/* Contenu animé : rendu uniquement côté navigateur après montage.
          Le voile violet ci-dessus, lui, est déjà là dès le serveur -> aucun flash. */}
      {mounted && (
        <>
          <style>{`
            @keyframes pnxCube {
              0%{opacity:0; transform:translate(-50%,-50%) translate3d(0,0,-1600px) rotate(0deg)}
              12%{opacity:1}
              42%{opacity:.95; transform:translate(-50%,-50%) translate3d(var(--x),var(--y),0) rotate(var(--rz))}
              60%{opacity:.9; transform:translate(-50%,-50%) translate3d(var(--x),var(--y),0) rotate(var(--rz))}
              100%{opacity:0; transform:translate(-50%,-50%) translate3d(0,0,160px) scale(.1) rotate(calc(var(--rz) * 2))}
            }
            @keyframes pnxGlowPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.85;transform:scale(1.12)} }
            @keyframes pnxFocusIn { 0%{filter:blur(18px);opacity:0;letter-spacing:.5em;transform:scale(1.1)} 100%{filter:blur(0);opacity:1;letter-spacing:.01em;transform:scale(1)} }
            @keyframes pnxShimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
            @keyframes pnxLogoPop { 0%{opacity:0;transform:scale(0) rotate(-14deg)} 62%{opacity:1;transform:scale(1.3) rotate(6deg)} 80%{transform:scale(.92)} 100%{transform:scale(1) rotate(0)} }
            @keyframes pnxBloom { 0%{transform:translate(-50%,-50%) scale(0);opacity:0} 18%{opacity:1} 100%{transform:translate(-50%,-50%) scale(5.5);opacity:0} }
            @keyframes pnxShock { 0%{transform:translate(-50%,-50%) scale(.2);opacity:.8} 100%{transform:translate(-50%,-50%) scale(4.4);opacity:0} }
            @keyframes pnxImpact { 0%,100%{transform:translate(0,0)} 16%{transform:translate(-9px,5px)} 32%{transform:translate(9px,-6px)} 48%{transform:translate(-7px,-3px)} 64%{transform:translate(6px,4px)} 82%{transform:translate(-3px,2px)} }
            @keyframes pnxLine { 0%{transform:scaleX(0);opacity:0} 100%{transform:scaleX(1);opacity:.9} }
            @keyframes pnxBy { 0%{opacity:0;transform:translateY(8px);letter-spacing:.15em} 100%{opacity:.65;transform:translateY(0);letter-spacing:.45em} }
            @keyframes pnxFadeIn { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
          `}</style>

          {/* wrapper plus grand que l'écran : tremble en entier sans révéler les bords */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ animation: reduced ? 'none' : 'pnxImpact .55s ease 1.5s 1 both' }}>
            {/* halo ambiant */}
            <div className="absolute rounded-full pointer-events-none" style={{ width: 560, height: 560, background: 'radial-gradient(circle, rgba(236,72,153,.28), rgba(124,58,237,.14) 50%, transparent 72%)', animation: 'pnxGlowPulse 3.4s ease-in-out infinite' }} />

            {/* champ de cubes 3D (masqué si mouvement réduit) */}
            {!reduced && (
              <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                  {cubes.map((c, i) => (
                    <span key={i} className="absolute top-1/2 left-1/2 pointer-events-none" style={{
                      width: c.size, height: c.size, borderRadius: 4, willChange: 'transform, opacity',
                      background: c.col, boxShadow: `0 0 14px ${c.col}, inset 0 0 6px rgba(255,255,255,.35)`,
                      ['--x']: c.x, ['--y']: c.y, ['--rz']: `${c.rz}deg`,
                      animation: `pnxCube 1.7s cubic-bezier(.18,.7,.25,1) ${c.delay}s both`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* IMPACT : explosion de lumière colorée (sans blanc cru) + ondes de choc */}
            {!reduced && (
              <>
                <div className="absolute top-1/2 left-1/2 rounded-full pointer-events-none" style={{ width: 340, height: 340, background: 'radial-gradient(circle, rgba(236,72,153,.95), rgba(168,85,247,.7) 38%, rgba(99,102,241,.35) 62%, transparent 75%)', animation: 'pnxBloom 1.1s ease-out 1.5s both' }} />
                <span className="absolute top-1/2 left-1/2 rounded-full border-4 border-fuchsia-300/70 pointer-events-none" style={{ width: 200, height: 200, animation: 'pnxShock 1s ease-out 1.55s both' }} />
                <span className="absolute top-1/2 left-1/2 rounded-full border-2 border-violet-300/60 pointer-events-none" style={{ width: 200, height: 200, animation: 'pnxShock 1.2s ease-out 1.7s both' }} />
              </>
            )}

            {/* contenu */}
            <div className="relative flex flex-col items-center">
              <img src="/logo.png" alt="Partnexx" className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                style={{ filter: 'drop-shadow(0 0 28px rgba(236,72,153,.7))', animation: reduced ? 'pnxFadeIn .8s ease both' : 'pnxLogoPop .8s cubic-bezier(.2,.9,.3,1) 1.5s both' }} />
              <h1 className="mt-5 text-6xl sm:text-8xl font-black tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#ffffff,#f5d0fe,#a5f3fc,#ffffff)', backgroundSize: '220% 100%', WebkitBackgroundClip: 'text', animation: reduced ? 'pnxFadeIn .8s ease .15s both' : 'pnxFocusIn 1s cubic-bezier(.2,.8,.2,1) 1.5s both, pnxShimmer 3s linear 2.5s infinite' }}>
                PARTNEXX
              </h1>
              <span className="mt-3 h-px w-44 sm:w-56 bg-gradient-to-r from-transparent via-white/80 to-transparent" style={{ transformOrigin: 'center', animation: reduced ? 'pnxFadeIn .6s ease .3s both' : 'pnxLine .8s ease 2.0s both' }} />
              <p className="mt-3 text-white/65 text-xs sm:text-sm font-semibold uppercase" style={{ animation: reduced ? 'pnxFadeIn .6s ease .45s both' : 'pnxBy .9s ease 2.2s both' }}>by BDN Group</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
