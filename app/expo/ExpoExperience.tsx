'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, useTexture, CameraControls, Html, Billboard, Float, MeshReflectorMaterial, Image } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// --- CONSTANTS ---
const CAMERA_HEIGHT = 1.7

// --- COMPONENTS ---

// 1. Futuristic Floating Welcome Desk (Re-envisioned for BeyondLive)
function WelcomeDesk() {
    return (
        <group position={[0, 0, -3]}>
            {/* Main Glowing Core - Hexagonal/Cyber Style */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[3.2, 3.4, 1.2, 6]} />
                <meshStandardMaterial
                    color="#020617"
                    emissive="#00f3ff"
                    emissiveIntensity={0.5}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>

            {/* Pulsing Neon Ring */}
            <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3.6, 3.8, 6]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
            </mesh>

            {/* VIRTUAL HOSTESSES (Premium Billboard) */}
            <Billboard position={[0, 3, -0.5]}>
                <Image
                    url="/hostesses.png"
                    scale={[5, 4]}
                    transparent
                    opacity={0.9}
                />
                {/* Underlight for Hostess */}
                <pointLight position={[0, -1, 1]} intensity={0.5} color="#00f3ff" distance={4} />
            </Billboard>

            {/* Branding Shield */}
            <group position={[0, 4.5, 0]}>
                <Text
                    fontSize={0.4}
                    color="#00f3ff"
                    fontWeight="black"
                    anchorY="bottom"
                    font="/fonts/Inter-Bold.ttf"
                >
                    INFO POINT PRO
                </Text>
            </group>
        </group>
    )
}

// 2. Navigation Portals (Luxe Redesign)
function ContentPortals() {
    const router = useRouter()
    return (
        <group>
            {/* --- EXPO HALL ENTRANCE (Main Target) --- */}
            <group position={[0, 0, -15]} onClick={() => router.push('/expo/hall')}>
                {/* Large Archway */}
                <mesh position={[0, 5, 0]}>
                    <boxGeometry args={[14, 10, 1]} />
                    <meshStandardMaterial color="#020617" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[0, 5, 0.6]}>
                    <planeGeometry args={[12, 8]} />
                    <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.3} transparent opacity={0.2} />
                </mesh>
                <Text position={[0, 11, 1]} fontSize={1.2} color="white" fontWeight="black" font="/fonts/Inter-Bold.ttf">
                    EXPO PABELLONES
                </Text>
                {/* Neon Border */}
                <mesh position={[0, 5, 0.55]}>
                    <ringGeometry args={[6.5, 6.7, 4, 1, Math.PI / 4, Math.PI / 2]} />
                    <meshBasicMaterial color="#00f3ff" />
                </mesh>
            </group>

            {/* --- LOUNGE / NETWORKING --- */}
            <group position={[18, 0, -8]} rotation={[0, -Math.PI / 6, 0]}>
                <mesh position={[0, 3, 0]}>
                    <boxGeometry args={[8, 6, 0.5]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <Text position={[0, 2.5, 0.3]} fontSize={0.6} color="white" fontWeight="black" font="/fonts/Inter-Bold.ttf">
                    NETWORKING<br />LOUNGE
                </Text>
                <mesh position={[0, 6.5, 0]}>
                    <torusGeometry args={[3, 0.05, 16, 100]} />
                    <meshBasicMaterial color="#00f3ff" />
                </mesh>
            </group>

            {/* --- SWAG / STORE --- */}
            <group position={[-18, 0, -8]} rotation={[0, Math.PI / 6, 0]}>
                <mesh position={[0, 3, 0]}>
                    <boxGeometry args={[8, 6, 0.5]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <Text position={[0, 2.5, 0.3]} fontSize={0.8} color="white" fontWeight="black" font="/fonts/Inter-Bold.ttf">
                    PRO STORE
                </Text>
                <mesh position={[0, 6.5, 0]}>
                    <torusGeometry args={[3, 0.05, 16, 100]} />
                    <meshBasicMaterial color="#a855f7" opacity={0.8} transparent />
                </mesh>
            </group>
        </group>
    )
}

// 3. Navigation Path (The Electric Path)
function FloorWaypoint({ position, onClick }: { position: [number, number, number], onClick: (p: Vector3) => void }) {
    const [hovered, setHover] = useState(false)
    return (
        <group position={position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
                onClick={() => onClick(new Vector3(position[0], CAMERA_HEIGHT, position[2]))}
            >
                <circleGeometry args={[0.6, 32]} />
                <meshBasicMaterial color={hovered ? "#00f3ff" : "#3b82f6"} transparent opacity={hovered ? 0.9 : 0.4} />
            </mesh>
            {/* Glowing Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[0.7, 0.8, 32]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={hovered ? 1 : 0.2} />
            </mesh>
        </group>
    )
}

// --- MAIN EXPERIENCE ---
export default function ExpoExperience() {
    const router = useRouter()
    const [targetPos, setTargetPos] = useState(new Vector3(0, CAMERA_HEIGHT, 15))
    const controls = useRef<any>(null)

    useFrame(() => {
        if (controls.current) {
            controls.current.setLookAt(
                targetPos.x, targetPos.y, targetPos.z,
                targetPos.x, targetPos.y, targetPos.z - 8,
                true
            )
        }
    })

    return (
        <div className="w-full h-screen bg-[#020617] relative">
            {/* UI: TOP NAV */}
            <div className="absolute top-24 left-10 z-50 flex items-center gap-4">
                <button
                    onClick={() => router.push('/lobby')}
                    className="flex items-center gap-3 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    ← LOBBY PRINCIPAL
                </button>
            </div>

            <Canvas shadows camera={{ position: [0, CAMERA_HEIGHT, 15], fov: 50 }}>
                <CameraControls ref={controls} />
                <Suspense fallback={null}>
                    <Environment preset="night" />

                    {/* --- LIGHTING: HIGH TECH --- */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[0, 15, -10]} intensity={2} color="#00f3ff" distance={50} />
                    <pointLight position={[20, 10, 5]} intensity={1.5} color="#3b82f6" distance={40} />
                    <pointLight position={[-20, 10, 5]} intensity={1.5} color="#ec4899" distance={40} />

                    {/* Sky Lights */}
                    <rectAreaLight position={[0, 20, 0]} width={60} height={20} intensity={1} color="#3b82f6" rotation={[-Math.PI / 2, 0, 0]} />

                    {/* --- ARCHITECTURE --- */}
                    {/* Polished Black Floor with Grid (The 'Beyond' Look) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                        <planeGeometry args={[100, 100]} />
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

                    {/* Electric Floor Grid */}
                    {[...Array(21)].map((_, i) => (
                        <group key={i}>
                            <mesh position={[i * 5 - 50, 0.01, 0]}>
                                <planeGeometry args={[0.02, 100]} />
                                <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
                            </mesh>
                            <mesh position={[0, 0.01, i * 5 - 50]} rotation={[0, Math.PI / 2, 0]}>
                                <planeGeometry args={[0.02, 100]} />
                                <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
                            </mesh>
                        </group>
                    ))}

                    {/* Tech Ceiling Rings */}
                    <group position={[0, 25, 0]}>
                        {[40, 60, 80].map((radius, i) => (
                            <mesh key={radius} rotation={[Math.PI / 2, 0, 0]} position={[0, -i * 5, 0]}>
                                <torusGeometry args={[radius, 0.1, 16, 128]} />
                                <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
                            </mesh>
                        ))}
                    </group>

                    {/* Central Elements */}
                    <WelcomeDesk />
                    <ContentPortals />

                    {/* --- NAVIGATION PATH --- */}
                    {[12, 6, 0, -6, -12].map(z => (
                        <FloorWaypoint key={`p-${z}`} position={[0, 0.05, z]} onClick={setTargetPos} />
                    ))}
                    {/* Path to Sides */}
                    {[6, 12].map(x => (
                        <FloorWaypoint key={`lx-${x}`} position={[x, 0.05, -3]} onClick={setTargetPos} />
                    ))}
                    {[-6, -12].map(x => (
                        <FloorWaypoint key={`rx-${x}`} position={[x, 0.05, -3]} onClick={setTargetPos} />
                    ))}

                    {/* Post Processing */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} radius={0.7} />
                        <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    )
}
