'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Grid, Image, Environment, useTexture, OrbitControls, useCursor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// --- ASSETS & DATA ---
// Placeholder sponsor data - normally passed via props or context
const SPONSORS = [
    { id: 1, name: "TechGiant", tier: "gold", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000", pos: [0, 0, -10] },
    { id: 2, name: "CloudSoft", tier: "gold", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", pos: [-15, 0, -10] },
    { id: 3, name: "InnovateX", tier: "gold", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000", pos: [15, 0, -10] },
    { id: 4, name: "StartupOne", tier: "silver", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000", pos: [-8, 0, 5] },
    { id: 5, name: "DevCorp", tier: "silver", image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000", pos: [8, 0, 5] },
    { id: 6, name: "PixelStudio", tier: "bronze", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000", pos: [-15, 0, 15] },
    { id: 7, name: "GlobalNet", tier: "bronze", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000", pos: [15, 0, 15] },
]

// --- COMPONENTS ---

// 1. Stand Component
function Stand({ data, onClick }: { data: any, onClick: (sponsor: any) => void }) {
    const [hovered, setHover] = useState(false)
    useCursor(hovered)

    // Tier-based Styling
    const isGold = data.tier === 'gold'
    const color = isGold ? '#fbbf24' : data.tier === 'silver' ? '#94a3b8' : '#d97706'
    const scale = isGold ? 1.5 : 1

    return (
        <group
            position={data.pos}
            rotation={[0, 0, 0]}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={(e) => { e.stopPropagation(); onClick(data) }}
            scale={scale}
        >
            {/* --- BASE STRUCTURE --- */}
            {/* Platform */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[3, 3, 0.4, 32]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Glow Ring */}
            {hovered && (
                <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
                    <ringGeometry args={[3.2, 3.4, 32]} />
                    <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* --- BACK WALL / SCREEN --- */}
            <group position={[0, 2.5, -2]}>
                <mesh>
                    <boxGeometry args={[5, 4, 0.2]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
                {/* Image Screen */}
                <Image
                    url={data.image}
                    position={[0, 0, 0.15]}
                    scale={[4.6, 3.6]}
                    toneMapped={false}
                />
            </group>

            {/* --- DESK --- */}
            <group position={[0, 1, 1]}>
                <mesh>
                    <boxGeometry args={[3, 1.2, 1]} />
                    <meshStandardMaterial color={isGold ? "#0f172a" : "#334155"} />
                </mesh>
                <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[3, 1]} />
                    <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* --- SIGNAGE --- */}
            <group position={[0, 5, -2]}>
                {isGold && (
                    <mesh position={[0, 0.5, 0]}>
                        <boxGeometry args={[4, 1, 0.2]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                    </mesh>
                )}
                <Text
                    position={[0, 0.5, 0.15]}
                    fontSize={0.6}
                    color={isGold ? "black" : "white"}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/Inter-Bold.ttf"
                >
                    {data.name.toUpperCase()}
                </Text>
            </group>

            {/* --- DECOR --- */}
            {/* Side Banners for Gold */}
            {isGold && (
                <>
                    <mesh position={[-2.4, 2.5, -1]} rotation={[0, 0.2, 0]}>
                        <boxGeometry args={[0.1, 4, 1.5]} />
                        <meshStandardMaterial color={color} metalness={0.5} />
                    </mesh>
                    <mesh position={[2.4, 2.5, -1]} rotation={[0, -0.2, 0]}>
                        <boxGeometry args={[0.1, 4, 1.5]} />
                        <meshStandardMaterial color={color} metalness={0.5} />
                    </mesh>
                </>
            )}

        </group>
    )
}

// 2. Camera Controller (Dolly)
function Rig() {
    return useFrame((state) => {
        // Subtle movement? For now, we use OrbitControls for free checking, or fixed.
        // Let's stick to standard OrbitControls restricted for now to explore.
    })
}


// --- MAIN SCENE ---
export default function ExpoExperience() {
    const router = useRouter()
    const [selectedSponsor, setSelectedSponsor] = useState<any>(null)

    return (
        <div className="w-full h-screen bg-slate-950 relative">

            {/* --- UI OVERLAY (Back Button) --- */}
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={() => router.push('/auditorio')}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-bold transition-all border border-white/20"
                >
                    ← Back to Lobby
                </button>
            </div>

            {/* --- MODAL --- */}
            {selectedSponsor && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedSponsor(null)}>
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-2xl w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            onClick={() => setSelectedSponsor(null)}
                        >
                            ✕
                        </button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <img src={selectedSponsor.image} alt={selectedSponsor.name} className="w-full md:w-1/2 h-48 object-cover rounded-lg" />
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedSponsor.name}</h2>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${selectedSponsor.tier === 'gold' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                                    {selectedSponsor.tier} SPONSOR
                                </span>
                                <p className="text-slate-400 text-sm mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Visita nuestro stand para conocer las últimas novedades tecnológicas.
                                </p>
                                <div className="flex gap-3">
                                    <button className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-colors">
                                        Descargar Brochure
                                    </button>
                                    <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors">
                                        Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Canvas camera={{ position: [0, 10, 30], fov: 50 }} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.2 }}>

                {/* Controls - Restricted Orbit to feel like a "God View" or "Walk" */}
                <OrbitControls
                    maxPolarAngle={Math.PI / 2 - 0.1}
                    minPolarAngle={Math.PI / 4}
                    minDistance={10}
                    maxDistance={60}
                    enablePan={true}
                />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 20, 0]} intensity={2} color="white" />
                <directionalLight position={[10, 20, 5]} intensity={1} castShadow />

                {/* Environment */}
                <Environment preset="city" />

                {/* --- HALL ARCHITECTURE --- */}
                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
                </mesh>
                <Grid position={[0, 0.01, 0]} args={[100, 100]} cellColor="#334155" sectionColor="#1e293b" infiniteGrid fadeDistance={60} />

                {/* --- STANDS --- */}
                {SPONSORS.map(sponsor => (
                    <Stand key={sponsor.id} data={sponsor} onClick={setSelectedSponsor} />
                ))}

                {/* --- DECOR --- */}
                {/* Entrance Banner */}
                <Text
                    position={[0, 12, -25]}
                    fontSize={4}
                    color="#22d3ee"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/Inter-Bold.ttf"
                >
                    EXPO HALL
                </Text>

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.8} radius={0.5} />
                    <Vignette eskil={false} offset={0.1} darkness={0.6} />
                </EffectComposer>

            </Canvas>
        </div>
    )
}
