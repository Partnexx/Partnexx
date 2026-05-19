"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Html, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { RANK_DETAILS, type RankDetail } from "@/components/ranks-data";

type Rank = RankDetail;
const RANKS: Rank[] = RANK_DETAILS;

function MedalBadge({
  rank,
  index,
  total,
  active,
  isNext,
  onSelect,
}: {
  rank: Rank;
  index: number;
  total: number;
  active: boolean;
  isNext: boolean;
  onSelect: (i: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const auraRef2 = useRef<THREE.Mesh>(null);
  const orbitRingRef = useRef<THREE.Group>(null);
  const raysRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Group>(null);

  const tier = index >= 7 ? "legendary" : index === 6 ? "epic" : index === 5 ? "rare" : "common";
  const isPremium = tier !== "common";
  const sizeMul = tier === "legendary" ? 1.45 : tier === "epic" ? 1.3 : tier === "rare" ? 1.18 : 1;
  const tierLabel = tier === "legendary" ? "LÉGENDAIRE" : tier === "epic" ? "ÉPIQUE" : tier === "rare" ? "RARE" : "";

  const radius = 4;
  const angle = -(index / total) * Math.PI * 2 + Math.PI / 2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      const bob = isPremium ? 0.22 : 0.12;
      groupRef.current.position.y = Math.sin(t * 0.6 + index) * bob + (isPremium ? 0.25 : 0);
      groupRef.current.lookAt(0, groupRef.current.position.y, 0);
      groupRef.current.rotateY(Math.PI);
    }
    if (meshRef.current) {
      const target = (active ? 1.4 : 1) * sizeMul;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
      if (isPremium) {
        meshRef.current.rotation.z += tier === "legendary" ? 0.012 : tier === "epic" ? 0.008 : 0.005;
      }
    }
    if (auraRef.current) {
      const pulse = 1 + Math.sin(t * 1.6 + index) * 0.06;
      auraRef.current.scale.set(pulse, pulse, 1);
      const mat = auraRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.22 + Math.sin(t * 1.6 + index) * 0.05;
    }
    if (auraRef2.current) {
      const pulse = 1 + Math.sin(t * 1.2 + index + 1) * 0.1;
      auraRef2.current.scale.set(pulse, pulse, 1);
      const mat = auraRef2.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(t * 1.2 + index) * 0.04;
    }
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = t * (tier === "legendary" ? 0.6 : tier === "epic" ? 0.45 : 0.3);
    }
    if (raysRef.current) {
      raysRef.current.rotation.z = -t * 0.15;
    }
    if (crownRef.current) {
      crownRef.current.position.y = 1.05 + Math.sin(t * 1.5 + index) * 0.05;
      crownRef.current.rotation.y = Math.sin(t * 0.8) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <group
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onSelect(index); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
          {isPremium && (
            <mesh ref={auraRef2} position={[0, 0, -0.18]}>
              <circleGeometry args={[1.55, 64]} />
              <meshBasicMaterial color={rank.accent} transparent opacity={0.14} depthWrite={false} />
            </mesh>
          )}
          {isPremium && (
            <mesh ref={auraRef} position={[0, 0, -0.12]}>
              <circleGeometry args={[1.15, 64]} />
              <meshBasicMaterial color={rank.color} transparent opacity={0.22} depthWrite={false} />
            </mesh>
          )}
          {isPremium && (
            <group ref={raysRef} position={[0, 0, -0.16]}>
              {Array.from({ length: tier === "legendary" ? 12 : tier === "epic" ? 10 : 8 }).map((_, i, arr) => {
                const a = (i / arr.length) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0]} rotation={[0, 0, a + Math.PI / 2]}>
                    <planeGeometry args={[0.08, 1.4]} />
                    <meshBasicMaterial color={rank.accent} transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
                  </mesh>
                );
              })}
            </group>
          )}
          <mesh position={[0, 0, 0.07]}>
            <torusGeometry args={[0.7, isPremium ? 0.1 : 0.08, 16, 64]} />
            <meshPhysicalMaterial color={rank.ring} metalness={1} roughness={isPremium ? 0.08 : 0.2} emissive={rank.accent} emissiveIntensity={active ? 0.8 : isPremium ? 0.45 : 0.2} />
          </mesh>
          {isPremium && (
            <mesh position={[0, 0, 0.05]}>
              <torusGeometry args={[0.85, 0.02, 12, 64]} />
              <meshPhysicalMaterial color={rank.accent} metalness={1} roughness={0.1} emissive={rank.accent} emissiveIntensity={0.6} />
            </mesh>
          )}
          {isPremium && (
            <group ref={orbitRingRef} position={[0, 0, 0.02]}>
              <mesh>
                <torusGeometry args={[1.0, 0.012, 8, 96]} />
                <meshBasicMaterial color={rank.accent} transparent opacity={0.55} />
              </mesh>
              {Array.from({ length: tier === "legendary" ? 4 : 3 }).map((_, i, arr) => {
                const a = (i / arr.length) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshPhysicalMaterial color={rank.accent} metalness={1} roughness={0.05} emissive={rank.accent} emissiveIntensity={1.2} />
                  </mesh>
                );
              })}
            </group>
          )}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.12, 64]} />
            <meshPhysicalMaterial color={rank.color} metalness={0.95} roughness={isPremium ? 0.1 : 0.25} clearcoat={1} clearcoatRoughness={0.1} emissive={rank.accent} emissiveIntensity={active ? 0.5 : isPremium ? 0.25 : 0.12} />
          </mesh>
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.02, 64]} />
            <meshPhysicalMaterial color={rank.accent} metalness={0.6} roughness={0.3} emissive={rank.accent} emissiveIntensity={active ? 0.6 : isPremium ? 0.4 : 0.2} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <circleGeometry args={[0.22, isPremium ? 6 : 5]} />
            <meshBasicMaterial color={rank.color} />
          </mesh>
          {tier === "legendary" && (
            <group ref={crownRef} position={[0, 1.05, 0]}>
              <mesh>
                <coneGeometry args={[0.18, 0.3, 5]} />
                <meshPhysicalMaterial color={rank.accent} metalness={1} roughness={0.1} emissive={rank.accent} emissiveIntensity={0.8} />
              </mesh>
            </group>
          )}
          <pointLight color={rank.accent} intensity={active ? 1.8 : isPremium ? (tier === "legendary" ? 1.6 : 1.1) : 0.5} distance={isPremium ? 3.5 : 2.5} />
          <Html center distanceFactor={9} position={[0, -1.05, 0]} style={{ pointerEvents: "none" }}>
            <div className="flex flex-col items-center select-none whitespace-nowrap">
              <div className={`text-[11px] font-bold tracking-[0.2em] uppercase ${active ? "text-slate-900" : "text-slate-700"}`}>
                {rank.name}
              </div>
              <div className="text-[8px] font-semibold tracking-[0.3em] mt-0.5" style={{ color: rank.color }}>
                III · II · I
              </div>
              {isPremium && (
                <div className="mt-1 text-[7px] font-black tracking-[0.25em] px-1.5 py-0.5 rounded-sm text-white" style={{ background: `linear-gradient(90deg, ${rank.color}, ${rank.accent})`, boxShadow: `0 0 10px ${rank.accent}aa` }}>
                  ✦ {tierLabel} ✦
                </div>
              )}
            </div>
          </Html>
          {isNext && (
            <Html center distanceFactor={10} position={[0, 1.35, 0]} style={{ pointerEvents: "none" }}>
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full text-white whitespace-nowrap" style={{ background: rank.color, boxShadow: `0 4px 14px ${rank.color}55` }}>
                Prochain →
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}
function ArrowsBetween() {
  const arrows = useMemo(() => {
    const total = RANKS.length;
    const radius = 4;
    return Array.from({ length: total - 1 }, (_, i) => {
      const a2 = -((i + 0.5) / total) * Math.PI * 2 + Math.PI / 2;
      return {
        pos: [Math.cos(a2) * radius, 0, Math.sin(a2) * radius] as [number, number, number],
        rotY: -a2 + Math.PI / 2,
      };
    });
  }, []);

  return (
    <>
      {arrows.map((a, i) => (
        <group key={i} position={a.pos} rotation={[0, a.rotY, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.13, 0.28, 12]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={0.5} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function CenterLogo() {
  const ref = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/logo.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.3;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[1.4, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, 0, -0.15]}>
        <circleGeometry args={[1.1, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#22d3ee" intensity={2} distance={4} />
      <pointLight color="#ec4899" intensity={1.2} distance={4} position={[0, 0, 1]} />
    </group>
  );
}

function OrbitRing() {
  const points = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      arr.push(new THREE.Vector3(Math.cos(a) * 4, 0, Math.sin(a) * 4));
    }
    return arr;
  }, []);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const material = useMemo(
    () => new THREE.LineDashedMaterial({ color: "#0ea5e9", dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.35 }),
    [],
  );
  const line = useMemo(() => {
    const l = new THREE.Line(geom, material);
    l.computeLineDistances();
    return l;
  }, [geom, material]);
  return <primitive object={line} />;
}

function Scene({ activeIndex, setActive }: { activeIndex: number; setActive: (i: number) => void }) {
  const nextIndex = activeIndex < RANKS.length - 1 ? activeIndex + 1 : -1;
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#a78bfa" />
      <Environment preset="studio" />
      <CenterLogo />
      <OrbitRing />
      <ArrowsBetween />
      {RANKS.map((r, i) => (
        <MedalBadge key={r.name} rank={r} index={i} total={RANKS.length} active={i === activeIndex} isNext={i === nextIndex} onSelect={setActive} />
      ))}
    </>
  );
}

export default function RanksOrbit3D({ active, onChange }: { active: number; onChange: (i: number) => void }) {
  const setActive = onChange;
  const next = active < RANKS.length - 1 ? RANKS[active + 1] : null;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border shadow-card bg-gradient-to-br from-slate-50 via-white to-cyan-50/40">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-5 sm:p-6 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            Système de progression
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
          Clique sur une médaille
        </span>
      </div>

      <div className="h-[460px] sm:h-[540px] w-full">
        <Canvas camera={{ position: [0, 3.8, 10], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene activeIndex={active} setActive={setActive} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={-0.5} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6 bg-gradient-to-t from-white/90 via-white/60 to-transparent backdrop-blur-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-1">
              Niveau sélectionné
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {RANKS[active].name}
              </span>
              <span className="text-xs font-bold tracking-[0.3em]" style={{ color: RANKS[active].color }}>
                III · II · I
              </span>
              <span className="text-xs text-muted-foreground">
                {next ? (
                  <>→ suivant : <strong style={{ color: next.color }}>{next.name}</strong></>
                ) : (
                  <span className="font-bold text-foreground">🏆 Niveau max atteint</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {RANKS.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8" : "w-1.5 bg-foreground/20 hover:bg-foreground/50"}`}
                style={i === active ? { background: r.color, boxShadow: `0 0 12px ${r.color}` } : {}}
                aria-label={r.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}