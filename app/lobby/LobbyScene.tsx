'use client'
// Force rebuild - Stability Update v3 (Fixing Duplicate Exports)

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Grid, Environment, ContactShadows, Billboard, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// --- CONSTANTS ---
const CAMERA_HEIGHT = 1.7
const MOVEMENT_SPEED = 0.05

// --- COMPONENTS ---

// Crowd Person (Hologram style - Enhanced with Glow)
function HologramPerson({ position, color }: { position: [number, number, number], color: string }) {
    const ref = useRef<THREE.Group>(null)
    // Random idle animation
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
        }
    })

    return (
        <group ref={ref} position={position}>
            {/* Body */}
            <mesh position={[0, 0.9, 0]}>
                <capsuleGeometry args={[0.25, 1.2, 4, 8]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2} // Increased for Bloom
                    transparent
                    opacity={0.6}
                    roughness={0.1}
                />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.65, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>

            {/* Simple Shadow */}
            <ContactShadows opacity={0.5} scale={2} blur={1} far={1} color={color} />
        </group>
    )
}

// 1. Waypoint (Navigation Square)
function Waypoint({ position, target, onClick }: { position: [number, number, number], target: [number, number, number], onClick: (pos: Vector3) => void }) {
    const [hovered, setHover] = useState(false)

    return (
        <group position={position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                onClick={(e) => { e.stopPropagation(); onClick(new Vector3(...target)) }}
            >
                <planeGeometry args={[2.5, 2.5]} /> {/* Bigger click area */}
                <meshStandardMaterial
                    color={hovered ? "#22d3ee" : "#0ea5e9"}
                    emissive={hovered ? "#22d3ee" : "#0284c7"}
                    emissiveIntensity={hovered ? 4 : 1} // Strong Bloom Pop
                    transparent
                    opacity={hovered ? 0.9 : 0.4}
                />
            </mesh>
            {hovered && (
                <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
                    <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI]}>
                        <coneGeometry args={[0.3, 0.6, 4]} />
                        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
                    </mesh>
                </Float>
            )}
        </group>
    )
}

// --- 2. Main Building (Lobby Entrance) ---
function MainBuilding() {
    const router = useRouter()
    const [hovered, setHover] = useState(false)

    return (
        <group position={[0, 0, -25]}>
            {/* --- MASSIVE STRUCTURE (Cyberpunk Monolith) --- */}
            {/* Main Block */}
            <mesh position={[0, 10, 0]}>
                <boxGeometry args={[40, 20, 10]} />
                <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Neon Edges (Wireframe effect) */}
            <mesh position={[0, 10, 0]}>
                <boxGeometry args={[40.2, 20.2, 10.2]} />
                <meshBasicMaterial color="#3b82f6" wireframe />
            </mesh>

            {/* Glowing Entrance Portal */}
            <group position={[0, 0, 5.1]}>
                <mesh
                    position={[0, 6, 0]}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                    onClick={() => router.push('/auditorio/main-theater')}
                >
                    <planeGeometry args={[12, 12]} />
                    <meshStandardMaterial
                        color={hovered ? "#3b82f6" : "#1e40af"}
                        emissive={hovered ? "#60a5fa" : "#1e3a8a"}
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                <Text position={[0, 14, 0]} fontSize={2} color="#60a5fa" anchorX="center" anchorY="bottom" font="/fonts/Inter-Bold.ttf">
                    MAIN THEATER
                </Text>
                <Text position={[0, 12.5, 0]} fontSize={0.8} color="white" anchorX="center" anchorY="bottom">
                    CLICK TO ENTER
                </Text>
            </group>

            {/* Side Towers */}
            <mesh position={[-25, 15, 5]}>
                <boxGeometry args={[8, 30, 8]} />
                <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[-25, 15, 5]}>
                <boxGeometry args={[8.2, 30.2, 8.2]} />
                <meshBasicMaterial color="#ec4899" wireframe />
            </mesh>

            <mesh position={[25, 15, 5]}>
                <boxGeometry args={[8, 30, 8]} />
                <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[25, 15, 5]}>
                <boxGeometry args={[8.2, 30.2, 8.2]} />
                <meshBasicMaterial color="#ec4899" wireframe />
            </mesh>
        </group>
    )
}

// 3. Streaming Stage (Left)
function StreamingStage({ onOpenVideo }: { onOpenVideo: () => void }) {
    const [hovered, setHover] = useState(false)

    return (
        <group position={[-20, 0, -5]} rotation={[0, Math.PI / 3.5, 0]}>
            {/* Stage Floor */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[18, 2, 12]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* TRUSS STRUCTURE (Black Frames) */}
            {/* Top Beam */}
            <mesh position={[0, 9, -5]}>
                <boxGeometry args={[16, 1, 1]} />
                <meshStandardMaterial color="#000" metalness={0.8} />
            </mesh>
            {/* Side Pillars */}
            <mesh position={[-7.5, 5, -5]}>
                <boxGeometry args={[1, 10, 1]} />
                <meshStandardMaterial color="#000" metalness={0.8} />
            </mesh>
            <mesh position={[7.5, 5, -5]}>
                <boxGeometry args={[1, 10, 1]} />
                <meshStandardMaterial color="#000" metalness={0.8} />
            </mesh>

            {/* Clickable Streaming Main Screen */}
            <group
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                onClick={(e) => { e.stopPropagation(); onOpenVideo() }} // OPEN POPUP
            >
                {/* Screen Frame */}
                <mesh position={[0, 6, -4.8]}>
                    <boxGeometry args={[12.2, 6.2, 0.2]} />
                    <meshStandardMaterial color="#222" />
                </mesh>

                {/* Screen Content - Glowing Panel */}
                <mesh position={[0, 6, -4.6]}>
                    <planeGeometry args={[12, 6]} />
                    <meshStandardMaterial
                        color={hovered ? "#db2777" : "#be185d"}
                        emissive={hovered ? "#f472b6" : "#db2777"}
                        emissiveIntensity={hovered ? 1 : 0.5}
                        toneMapped={false}
                    />
                </mesh>

                {/* Play Button Overlay (Visual Cue) */}
                {hovered && (
                    <Float speed={5} floatIntensity={0.2}>
                        <mesh position={[0, 6, -4.5]}>
                            <circleGeometry args={[1, 32]} />
                            <meshBasicMaterial color="white" transparent opacity={0.3} />
                        </mesh>
                        <mesh position={[0.1, 6, -4.4]} rotation={[0, 0, -Math.PI / 2]}>
                            <coneGeometry args={[0.4, 0.8, 3]} />
                            <meshBasicMaterial color="white" />
                        </mesh>
                    </Float>
                )}

                <Text position={[0, 9.5, -4.6]} fontSize={0.8} color="#f472b6" anchorX="center" anchorY="bottom" font="/fonts/Inter-Bold.ttf">
                    CLICK TO WATCH
                </Text>
            </group>

            {/* Vertical Banners (Ads) */}
            <group position={[-9, 5, -4]}>
                <mesh>
                    <boxGeometry args={[3, 8, 0.1]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
                {/* Banner 1 */}
                <mesh position={[0, 0, 0.1]}>
                    <planeGeometry args={[2.8, 7.8]} />
                    <meshStandardMaterial color="#0f172a" emissive="#3b82f6" emissiveIntensity={0.2} />
                </mesh>
            </group>

            <group position={[9, 5, -4]}>
                <mesh>
                    <boxGeometry args={[3, 8, 0.1]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
                {/* Banner 2 */}
                <mesh position={[0, 0, 0.1]}>
                    <planeGeometry args={[2.8, 7.8]} />
                    <meshStandardMaterial color="#0f172a" emissive="#8b5cf6" emissiveIntensity={0.2} />
                </mesh>
            </group>
        </group>
    )
}

// --- CONTROLLER ---
function CameraController({ targetPosition }: { targetPosition: Vector3 }) {
    useFrame((state, delta) => {
        state.camera.position.lerp(targetPosition, MOVEMENT_SPEED)
    })
    return null
}

// --- MAIN SCENE ---
export default function LobbyScene({ openVideo }: { openVideo?: () => void }) {
    // ... (State logic)
    const [targetPos, setTargetPos] = useState(new Vector3(0, CAMERA_HEIGHT, 15))

    const handleWaypointClick = (newPos: Vector3) => {
        setTargetPos(newPos)
    }

    const crowd = useMemo(() => {
        return [...Array(40)].map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 50,
                0,
                (Math.random() - 0.5) * 40 - 5
            ] as [number, number, number],
            color: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 6)]
        }))
    }, [])

    return (
        <div className="w-full h-screen bg-slate-950">
            <Canvas camera={{ position: [0, CAMERA_HEIGHT, 15], fov: 60 }} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>

                <CameraController targetPosition={targetPos} />

                {/* Lighting - Moody Night + Neon */}
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 10, 10]} intensity={1} color="#22d3ee" distance={30} />
                <pointLight position={[-20, 10, -10]} intensity={2} color="#ec4899" distance={30} />
                <spotLight position={[0, 20, 20]} angle={0.5} penumbra={1} intensity={1} castShadow />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="night" />

                {/* Ground - Wet Pavement Look */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial
                        color="#050505"
                        roughness={0.1} // Very smooth -> Wet
                        metalness={0.5}
                    />
                </mesh>
                <Grid
                    position={[0, 0.01, 0]}
                    args={[100, 100]}
                    cellColor="#334155"
                    sectionColor="#4ade80"
                    fadeDistance={40}
                    fadeStrength={1}
                    infiniteGrid
                />

                {/* Controls - FREEDOM UNLOCKED */}
                {/* Controls - FREEDOM LOCKED (Cinematic Mode) */}
                {/* OrbitControls Removed to fix navigation conflict */}

                {/* --- STRUCTURES (Wrapped in Suspense to prevent texture crash) --- */}
                <Suspense fallback={null}>
                    <MainBuilding />
                    <StreamingStage onOpenVideo={openVideo || (() => { })} />
                </Suspense>

                {/* --- CROWD --- */}
                {crowd.map((person, i) => (
                    <HologramPerson key={i} position={person.position} color={person.color} />
                ))}

                {/* --- WAYPOINTS (Navigation Grid) --- */}
                {/* Main Path to Door (Align with x=5 which is new door center) */}
                <Waypoint position={[5, 0.05, 12]} target={[5, CAMERA_HEIGHT, 12]} onClick={handleWaypointClick} />
                <Waypoint position={[5, 0.05, 7]} target={[5, CAMERA_HEIGHT, 7]} onClick={handleWaypointClick} />
                <Waypoint position={[5, 0.05, 2]} target={[5, CAMERA_HEIGHT, 2]} onClick={handleWaypointClick} />

                {/* Central Plaza Area */}
                <Waypoint position={[0, 0.05, 0]} target={[0, CAMERA_HEIGHT, 0]} onClick={handleWaypointClick} />
                <Waypoint position={[0, 0.05, -7]} target={[0, CAMERA_HEIGHT, -7]} onClick={handleWaypointClick} />
                <Waypoint position={[0, 0.05, -14]} target={[0, CAMERA_HEIGHT, -14]} onClick={handleWaypointClick} />

                {/* Path to Stage (Left) */}
                <Waypoint position={[-8, 0.05, 2]} target={[-8, CAMERA_HEIGHT, 2]} onClick={handleWaypointClick} />
                <Waypoint position={[-14, 0.05, -3]} target={[-14, CAMERA_HEIGHT, -3]} onClick={handleWaypointClick} />

                {/* Path to Right (Networking) */}
                <Waypoint position={[5, 0.05, 5]} target={[5, CAMERA_HEIGHT, 5]} onClick={handleWaypointClick} />
                <Waypoint position={[10, 0.05, 0]} target={[10, CAMERA_HEIGHT, 0]} onClick={handleWaypointClick} />

                {/* --- POST PROCESSING --- */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.8} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>

            </Canvas>
        </div>
    )
}
