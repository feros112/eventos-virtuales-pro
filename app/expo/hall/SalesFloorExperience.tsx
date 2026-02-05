'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, OrbitControls, MeshReflectorMaterial, Float, Html, PerspectiveCamera, ContactShadows, Billboard, Image } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

// --- DATA: ACTUALIZADO CON LOOK PRO ---
const BRAND_PARTNERS = [
    { id: 1, name: "PRO INNOVATION", color: "#00f3ff", pos: [0, 0, -15], tier: 'platinum', logo: '/auditorium-ad-right.png' },
    { id: 2, name: "CYBER CORE", color: "#a855f7", pos: [-15, 0, -5], tier: 'platinum', logo: '/auditorium-ad-left.png' },
    { id: 3, name: "NEXT GEN", color: "#3b82f6", pos: [15, 0, -5], tier: 'gold' },
    { id: 4, name: "TECH FLOW", color: "#10b981", pos: [-10, 0, 10], tier: 'gold' },
    { id: 5, name: "ALPHA DIGI", color: "#f43f5e", pos: [10, 0, 10], tier: 'silver' },
    { id: 6, name: "ZENITH AI", color: "#f59e0b", pos: [-22, 0, 15], tier: 'silver' },
    { id: 7, name: "ORBIT LIVE", color: "#6366f1", pos: [22, 0, 15], tier: 'silver' },
]

// --- COMPONENTS ---

// 1. Futuristic Booth / Stand (Rediseño Luxe)
function PartnerBooth({ partner, onSelect }: { partner: any, onSelect: (p: any) => void }) {
    const [hovered, setHover] = useState(false)
    const isPlatinum = partner.tier === 'platinum'

    return (
        <group
            position={partner.pos}
            onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
            onClick={() => onSelect(partner)}
        >
            {/* Base Platform with Underlight */}
            <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[isPlatinum ? 12 : 8, 0.2, isPlatinum ? 12 : 8]} />
                <meshStandardMaterial color="#020617" roughness={0.1} metalness={1} />
            </mesh>

            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[isPlatinum ? 13 : 9, isPlatinum ? 13 : 9]} />
                <meshBasicMaterial color={partner.color} transparent opacity={hovered ? 0.6 : 0.2} />
            </mesh>

            {/* Main Totem / Backwall with Glass Look */}
            <group position={[0, 4.5, -4]}>
                <mesh>
                    <boxGeometry args={[isPlatinum ? 9 : 6, 9, 0.4]} />
                    <meshPhysicalMaterial
                        color="#0f172a"
                        transmission={0.4}
                        thickness={1}
                        roughness={0.2}
                        metalness={0.8}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Glowing Lateral Pillars */}
                {[[-1, 1], [1, 1]].map(([side, i]) => (
                    <mesh key={side} position={[side * (isPlatinum ? 4.7 : 3.2), 0, 0.1]}>
                        <boxGeometry args={[0.15, 9, 0.15]} />
                        <meshBasicMaterial color={partner.color} />
                    </mesh>
                ))}

                {/* Large Presentation Screen */}
                <group position={[0, 0.5, 0.3]}>
                    <mesh onClick={(e) => { e.stopPropagation(); onSelect(partner) }}>
                        <planeGeometry args={[isPlatinum ? 8 : 5, isPlatinum ? 4.5 : 3.5]} />
                        <meshStandardMaterial
                            color="#000"
                            emissive={partner.color}
                            emissiveIntensity={hovered ? 1.2 : 0.4}
                        />
                        {partner.logo && (
                            <Image
                                url={partner.logo}
                                position={[0, 0, 0.01]}
                                scale={[isPlatinum ? 8 : 5, isPlatinum ? 4.5 : 3.5]}
                                transparent
                            />
                        )}
                    </mesh>
                    {/* Screen Bezel Glow */}
                    <mesh position={[0, 0, -0.05]}>
                        <planeGeometry args={[isPlatinum ? 8.2 : 5.2, isPlatinum ? 4.7 : 3.7]} />
                        <meshBasicMaterial color={partner.color} transparent opacity={0.3} />
                    </mesh>
                </group>

                {/* Floating Brand Name (Holographic) */}
                <Text
                    position={[0, 4, 0.5]}
                    fontSize={isPlatinum ? 0.8 : 0.6}
                    color="white"
                    fontWeight="black"
                    maxWidth={isPlatinum ? 8 : 5}
                    textAlign="center"
                    font="/fonts/Inter-Bold.ttf"
                >
                    {partner.name.toUpperCase()}
                </Text>
            </group>

            {/* Ambient Spot Targeting the Center */}
            <spotLight
                position={[0, 15, 5]}
                target-position={[0, 0, 0]}
                intensity={isPlatinum ? 8 : 3}
                color={partner.color}
                angle={0.3}
                penumbra={1}
                castShadow
            />
        </group>
    )
}

// 2. Tech Truss Ceiling (Beyond Style)
function HallCeiling() {
    return (
        <group position={[0, 25, 0]}>
            {/* Floating Tech Rings */}
            {[50, 80, 120].map((radius, i) => (
                <mesh key={radius} rotation={[Math.PI / 2, 0, 0]} position={[0, -i * 5, 0]}>
                    <torusGeometry args={[radius, 0.15, 16, 128]} />
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
                </mesh>
            ))}

            {/* Atmospheric Fog Light */}
            <pointLight position={[0, 0, 0]} intensity={2} color="#1d4ed8" distance={100} />
        </group>
    )
}

// --- MAIN EXPERIENCE ---
export default function SalesFloorExperience() {
    const router = useRouter()
    const [selectedPartner, setSelectedPartner] = useState<any>(null)

    return (
        <div className="w-full h-full bg-[#020617] relative">

            {/* UI: TOP NAVIGATION */}
            <div className="absolute top-10 left-10 z-50 flex items-center gap-4">
                <button
                    onClick={() => router.push('/expo')}
                    className="group flex items-center gap-4 px-8 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    VOLVER AL LOBBY EXPO
                </button>
                <div className="px-6 py-2 bg-cyan-500 text-[#020617] font-black text-[10px] uppercase tracking-widest rounded-full">
                    PABELLÓN INTERACTIVO PRO
                </div>
            </div>

            {/* MODAL: PREMIUM BOOTH INFO */}
            {selectedPartner && (
                <div className="absolute inset-0 z-[100] flex items-center justify-end p-6 md:p-12 pointer-events-none">
                    <div className="w-full max-w-lg bg-[#020617]/95 backdrop-blur-3xl border border-white/10 rounded-[30px] p-10 md:p-14 pointer-events-auto shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 overflow-hidden relative">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full opacity-20 -z-10" style={{ backgroundColor: selectedPartner.color }} />

                        <button
                            onClick={() => setSelectedPartner(null)}
                            className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors p-2"
                        >
                            ✕
                        </button>

                        <div className="w-16 h-1 bg-cyan-400 rounded-full mb-10" style={{ backgroundColor: selectedPartner.color }} />

                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            {selectedPartner.name}
                        </h2>
                        <div className="flex items-center gap-3 mb-10">
                            <span className="px-3 py-1 bg-white/10 text-[10px] font-black text-white uppercase tracking-widest rounded-md border border-white/10">
                                {selectedPartner.tier} PARTNER
                            </span>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: selectedPartner.color }} />
                        </div>

                        <div className="space-y-8 mb-12">
                            <p className="text-white/60 text-sm leading-relaxed font-medium">
                                Descubre el ecosistema de soluciones de {selectedPartner.name}. Líderes en la transformación digital de eventos y experiencias inmersivas de alto impacto.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-colors">
                                    <div className="text-white font-black text-2xl mb-1 tracking-tighter">PORTFOLIO</div>
                                    <div className="text-white/30 text-[9px] uppercase font-bold tracking-[0.2em]">Acceder Catálogo</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-colors">
                                    <div className="text-white font-black text-2xl mb-1 tracking-tighter">LIVE CHAT</div>
                                    <div className="text-white/30 text-[9px] uppercase font-bold tracking-[0.2em]">Conectar Ahora</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button className="w-full py-5 bg-white text-[#020617] font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-cyan-400 transition-all active:scale-95">
                                AGENDAR REUNIÓN VIP
                            </button>
                            <button className="w-full py-5 bg-white/5 text-white/40 font-black text-xs uppercase tracking-[0.2em] rounded-xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all">
                                📁 DESCARGAR DOSSIER PRO
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Canvas shadows camera={{ position: [0, 10, 35], fov: 42 }}>
                <Suspense fallback={null}>
                    <OrbitControls
                        maxPolarAngle={Math.PI / 2.1}
                        minDistance={12}
                        maxDistance={70}
                        enablePan={true}
                        target={[0, 4, 0]}
                    />

                    <Environment preset="night" />

                    {/* --- LIGHTING: DRAMATIC --- */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[0, 35, 0]} intensity={3} color="#3b82f6" />

                    {/* Sky Accents */}
                    <rectAreaLight position={[0, 40, 0]} width={100} height={100} intensity={0.5} rotation={[-Math.PI / 2, 0, 0]} />

                    {/* --- ARCHITECTURE --- */}
                    <HallCeiling />

                    {/* Reflective Dark Floor (The Signature Look) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[200, 200]} />
                        {/* @ts-ignore */}
                        <MeshReflectorMaterial
                            blur={[300, 100]}
                            resolution={1024}
                            mixBlur={1}
                            mixStrength={50}
                            roughness={0.15}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#020617"
                            metalness={0.8}
                        />
                    </mesh>

                    {/* Subtle Neon Grid Support */}
                    {[...Array(41)].map((_, i) => (
                        <group key={i}>
                            <mesh position={[i * 5 - 100, 0.01, 0]}>
                                <planeGeometry args={[0.01, 200]} />
                                <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
                            </mesh>
                            <mesh position={[0, 0.01, i * 5 - 100]} rotation={[0, Math.PI / 2, 0]}>
                                <planeGeometry args={[0.01, 200]} />
                                <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
                            </mesh>
                        </group>
                    ))}

                    {/* --- BOOTHS / STANDS --- */}
                    {BRAND_PARTNERS.map(partner => (
                        <PartnerBooth
                            key={partner.id}
                            partner={partner}
                            onSelect={setSelectedPartner}
                        />
                    ))}

                    {/* Atmosphere post-pro */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.6} mipmapBlur intensity={1.5} radius={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    )
}
