'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, OrbitControls, MeshReflectorMaterial, Float, Html, PerspectiveCamera, ContactShadows, Billboard } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Scanline } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

// --- COMPONENTS ---

// 1. Interactive Gaming Pod (Rediseño Cyber-Luxe)
function GamingPod({ position, color, label }: { position: [number, number, number], color: string, label: string }) {
    const [active, setActive] = useState(false)
    return (
        <group position={position}>
            {/* Main Pod Shell - Hexagonal Column */}
            <mesh
                onPointerOver={() => { setActive(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setActive(false); document.body.style.cursor = 'auto' }}
            >
                <cylinderGeometry args={[2.2, 2.5, 6, 6]} />
                <meshStandardMaterial color="#020617" roughness={0.1} metalness={1} />
            </mesh>

            {/* Glowing Vertical Lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]} position={[0, 0, 0]}>
                    <mesh position={[0, 0, 2.3]}>
                        <boxGeometry args={[0.05, 6, 0.05]} />
                        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.3} />
                    </mesh>
                </mesh>
            ))}

            {/* Floating UI Panel */}
            <Float speed={5} rotationIntensity={0.5} floatIntensity={1}>
                <group position={[0, 1, 3.2]}>
                    <mesh>
                        <planeGeometry args={[2.5, 1.8]} />
                        <meshPhysicalMaterial
                            color={color}
                            transmission={0.8}
                            thickness={0.5}
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                    <Text position={[0, 0, 0.1]} fontSize={0.2} color="white" fontWeight="black" textAlign="center" font="/fonts/Inter-Bold.ttf">
                        {label.toUpperCase()}<br />
                        <span className="text-[0.1px] opacity-50">INITIALIZING SYSTEM...</span>
                    </Text>
                </group>
            </Float>

            {/* Intense Underglow */}
            <pointLight position={[0, -2.5, 0]} intensity={active ? 10 : 2} color={color} distance={15} />
        </group>
    )
}

// 2. Central Artificial Intelligence Core
function AICore() {
    return (
        <group position={[0, 10, 0]}>
            <Float speed={4} rotationIntensity={3} floatIntensity={2}>
                {/* Tech Orbitals */}
                {[8, 12, 16].map((radius, i) => (
                    <mesh key={radius} rotation={[Math.PI / (i + 1.5), Math.PI / (i + 2), 0]}>
                        <torusGeometry args={[radius, 0.05, 16, 128]} />
                        <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
                    </mesh>
                ))}

                {/* The Core Entity */}
                <mesh>
                    <octahedronGeometry args={[2.5, 0]} />
                    <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} wireframe />
                </mesh>
                <pointLight intensity={5} color="#00f3ff" distance={40} />
            </Float>
        </group>
    )
}

// 3. Immersive Geometric Walls
function TechWalls() {
    return (
        <group>
            {/* Front Feature Wall */}
            <mesh position={[0, 12, -25]}>
                <planeGeometry args={[100, 30]} />
                <meshStandardMaterial color="#020617" metalness={1} roughness={0.1} />
            </mesh>
            {/* Glowing Hex Patterns */}
            {[...Array(30)].map((_, i) => (
                <mesh key={i} position={[Math.random() * 80 - 40, Math.random() * 20 + 2, -24.8]} rotation={[0, 0, Math.PI / 6]}>
                    <circleGeometry args={[Math.random() * 1.5, 6]} />
                    <meshBasicMaterial color="#00f3ff" transparent opacity={Math.random() * 0.2} />
                </mesh>
            ))}
        </group>
    )
}

// --- MAIN EXPERIENCE ---
export default function EscapeRoomExperience() {
    const router = useRouter()

    return (
        <div className="w-full h-screen bg-[#010409] relative overflow-hidden font-sans">

            {/* UI: NAVIGATION & BRANDING */}
            <div className="absolute top-10 left-10 z-50 flex flex-col gap-6">
                <button
                    onClick={() => router.push('/expo')}
                    className="group flex items-center gap-4 px-8 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-3xl border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    VOLVER AL COMPLEJO EXPO
                </button>

                <div className="flex flex-col">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase italic leading-none">
                        ESCAPE ROOM
                    </h1>
                    <div className="h-1 w-24 bg-cyan-400 mt-2" />
                    <p className="text-cyan-400/50 text-[9px] font-black tracking-[0.4em] uppercase mt-2">
                        ZONE_01 // NEON_CHALLENGE
                    </p>
                </div>
            </div>

            {/* STATUS OVERLAY */}
            <div className="absolute bottom-10 right-10 z-50 text-right">
                <div className="text-white/20 text-[10px] font-black tracking-widest uppercase mb-1">System Status</div>
                <div className="text-cyan-400 text-xs font-black tracking-widest uppercase flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    Operational // Evento Pro Active
                </div>
            </div>

            <Canvas shadows camera={{ position: [0, 12, 40], fov: 35 }}>
                <Suspense fallback={null}>
                    <OrbitControls
                        maxPolarAngle={Math.PI / 2.1}
                        minDistance={20}
                        maxDistance={60}
                        target={[0, 6, 0]}
                    />

                    <Environment preset="night" />

                    {/* --- LIGHTING: NEON NOIR --- */}
                    <ambientLight intensity={0.1} />
                    <pointLight position={[20, 20, 20]} intensity={1.5} color="#3b82f6" />
                    <spotLight position={[0, 30, 0]} angle={0.5} penumbra={1} intensity={5} color="#00f3ff" castShadow />

                    {/* --- WORLD GEOMETRY --- */}
                    <TechWalls />

                    {/* Reflective Dark Floor (Electronic Pavement) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[200, 200]} />
                        {/* @ts-ignore */}
                        <MeshReflectorMaterial
                            blur={[300, 100]}
                            resolution={1024}
                            mixBlur={1}
                            mixStrength={60}
                            roughness={0.1}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#020617"
                            metalness={0.9}
                        />
                    </mesh>

                    {/* Laser Path Grid */}
                    {[...Array(41)].map((_, i) => (
                        <group key={i}>
                            <mesh position={[i * 5 - 100, 0.01, 0]}>
                                <planeGeometry args={[0.02, 200]} />
                                <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
                            </mesh>
                            <mesh position={[0, 0.01, i * 5 - 100]} rotation={[0, Math.PI / 2, 0]}>
                                <planeGeometry args={[0.02, 200]} />
                                <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
                            </mesh>
                        </group>
                    ))}

                    {/* Interative Gaming Units */}
                    <GamingPod position={[-18, 3, -8]} color="#00f3ff" label="Logic Gate" />
                    <GamingPod position={[-6, 3, -12]} color="#a855f7" label="Cipher Key" />
                    <GamingPod position={[6, 3, -12]} color="#ec4899" label="Memory Link" />
                    <GamingPod position={[18, 3, -8]} color="#10b981" label="Final Step" />

                    {/* Central Elements */}
                    <AICore />

                    {/* High-End Post Processing */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.8} radius={0.6} />
                        <Vignette eskil={false} offset={0.1} darkness={0.9} />
                        <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
                        <Scanline opacity={0.03} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    )
}
