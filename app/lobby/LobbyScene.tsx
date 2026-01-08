'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Grid, Environment, ContactShadows, Billboard, useTexture, CameraControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// --- CONSTANTS ---
const CAMERA_HEIGHT = 1.7
const MOVEMENT_SPEED = 0.05

// --- COMPONENTS ---

// 1. Modern Mannequin (Frosted Glass Style)
function HologramPerson({ position, color }: { position: [number, number, number], color: string }) {
    const ref = useRef<THREE.Group>(null)
    useFrame((state) => {
        if (ref.current) {
            // Subtle breathing
            ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.01
        }
    })

    return (
        <group ref={ref} position={position}>
            {/* Body - Frosted Glass */}
            <mesh position={[0, 0.9, 0]}>
                <capsuleGeometry args={[0.22, 1.3, 4, 8]} />
                <meshPhysicalMaterial
                    color="white"
                    transmission={0.6}
                    opacity={0.8}
                    roughness={0.2}
                    thickness={0.5}
                    transparent
                />
            </mesh>
            {/* Core Glow (Subtle) */}
            <mesh position={[0, 1.4, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>
            <ContactShadows opacity={0.3} scale={2} blur={2} far={1} color="#000" />
        </group>
    )
}

// 2. Navigation Waypoint (Hexagon Marker)
function Waypoint({ position, target, onClick }: { position: [number, number, number], target: [number, number, number], onClick: (pos: Vector3) => void }) {
    const [hovered, setHover] = useState(false)

    return (
        <group position={position}>
            {/* Ground Marker */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                onClick={(e) => { e.stopPropagation(); onClick(new Vector3(...target)) }}
            >
                <circleGeometry args={[0.8, 6]} /> {/* Hexagonish */}
                <meshBasicMaterial
                    color={hovered ? "#4f46e5" : "#cbd5e1"}
                    transparent
                    opacity={hovered ? 0.8 : 0.3}
                />
            </mesh>

            {/* Floating Chevron */}
            <Float speed={3} rotationIntensity={0} floatIntensity={0.5}>
                <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI]}>
                    <coneGeometry args={[0.2, 0.4, 4]} />
                    <meshBasicMaterial color={hovered ? "#4f46e5" : "#94a3b8"} />
                </mesh>
            </Float>
        </group>
    )
}

// 3. Convention Center Architecture (Glass & Steel)
function ConventionCenter() {
    const router = useRouter()
    const [hovered, setHover] = useState(false)

    return (
        <group position={[0, 0, -25]}>
            {/* --- MAIN HALL STRUCTURE --- */}

            {/* Glass Facade (Back Layer) */}
            <mesh position={[0, 10, -2]}>
                <planeGeometry args={[60, 25]} />
                <meshPhysicalMaterial
                    color="#e2e8f0"
                    transmission={0.2}
                    opacity={0.9}
                    roughness={0.1}
                    metalness={0.1}
                    transparent
                />
            </mesh>

            {/* Steel Columns */}
            {[-20, -10, 0, 10, 20].map((x, i) => (
                <mesh key={i} position={[x, 10, 0]}>
                    <boxGeometry args={[1, 25, 1]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
            ))}

            {/* Roof Canopy */}
            <mesh position={[0, 20, 5]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[60, 1, 20]} />
                <meshStandardMaterial color="#f8fafc" />
            </mesh>

            {/* Main Entrance Portal */}
            <group position={[0, 0, 2]}>
                <mesh
                    position={[0, 5, 0]}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                    onClick={() => router.push('/auditorio/main-theater')}
                >
                    <planeGeometry args={[14, 10]} />
                    <meshPhysicalMaterial
                        color={hovered ? "#60a5fa" : "#3b82f6"}
                        transmission={0.5}
                        opacity={0.5}
                        transparent
                        roughness={0}
                    />
                </mesh>

                {/* Signage */}
                <Text position={[0, 9, 1]} fontSize={1.5} color="#1e293b" anchorX="center" anchorY="bottom" fontWeight="bold">
                    MAIN AUDITORIUM
                </Text>
            </group>

            {/* Side Wings (White Concrete) */}
            <mesh position={[-35, 10, 0]}>
                <boxGeometry args={[20, 20, 10]} />
                <meshStandardMaterial color="#f1f5f9" />
            </mesh>
            <mesh position={[35, 10, 0]}>
                <boxGeometry args={[20, 20, 10]} />
                <meshStandardMaterial color="#f1f5f9" />
            </mesh>

            {/* Digital billboard on Left Wing */}
            <mesh position={[-30, 12, 5.1]}>
                <planeGeometry args={[8, 12]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <Text position={[-30, 12, 5.2]} fontSize={0.8} color="white" maxWidth={6} textAlign="center">
                WELCOME TO VIRTUAL EXPERIENCE 2026
            </Text>
        </group>
    )
}

// 4. Controller
function CameraController({ targetPosition }: { targetPosition: Vector3 }) {
    useFrame((state, delta) => {
        state.camera.position.lerp(targetPosition, MOVEMENT_SPEED)
    })
    return null
}

// --- MAIN SCENE ---
export default function LobbyScene({ openVideo }: { openVideo?: () => void }) {
    const [targetPos, setTargetPos] = useState(new Vector3(0, CAMERA_HEIGHT, 15))

    const handleWaypointClick = (newPos: Vector3) => {
        setTargetPos(newPos)
    }

    // Modern Crowd
    const crowd = useMemo(() => {
        return [...Array(25)].map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 40,
                0,
                (Math.random() - 0.5) * 30 - 5
            ] as [number, number, number],
            color: ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b"][Math.floor(Math.random() * 4)]
        }))
    }, [])

    return (
        <div className="w-full h-screen bg-slate-200">
            <Canvas
                camera={{ position: [0, CAMERA_HEIGHT, 15], fov: 55 }}
                gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
                shadows
            >
                <CameraController targetPosition={targetPos} />

                {/* Lighting - Bright / Commercial */}
                <ambientLight intensity={0.8} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                {/* Environment - Clean Sky */}
                <Environment preset="city" />
                <color attach="background" args={['#f8fafc']} /> {/* Sky Color */}
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />

                {/* Ground - Tiled Pavers */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial
                        color="#e2e8f0"
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>

                {/* Subtle Grid Overlay */}
                <Grid
                    position={[0, 0.01, 0]}
                    args={[100, 100]}
                    cellColor="#cbd5e1"
                    sectionColor="#94a3b8"
                    fadeDistance={40}
                    fadeStrength={1}
                    infiniteGrid
                />

                {/* --- ARCHITECTURE --- */}
                <Suspense fallback={null}>
                    <ConventionCenter />
                </Suspense>

                {/* --- CROWD --- */}
                {crowd.map((person, i) => (
                    <HologramPerson key={i} position={person.position} color={person.color} />
                ))}

                {/* --- NAVIGATION GRID (Hexagon Waypoints) --- */}
                {/* Central Path */}
                <Waypoint position={[0, 0.05, 12]} target={[0, CAMERA_HEIGHT, 12]} onClick={handleWaypointClick} />
                <Waypoint position={[0, 0.05, 6]} target={[0, CAMERA_HEIGHT, 6]} onClick={handleWaypointClick} />
                <Waypoint position={[0, 0.05, 0]} target={[0, CAMERA_HEIGHT, 0]} onClick={handleWaypointClick} />

                {/* Entrance */}
                <Waypoint position={[0, 0.05, -10]} target={[0, CAMERA_HEIGHT, -10]} onClick={handleWaypointClick} />

                {/* Sides */}
                <Waypoint position={[-8, 0.05, 4]} target={[-8, CAMERA_HEIGHT, 4]} onClick={handleWaypointClick} />
                <Waypoint position={[8, 0.05, 4]} target={[8, CAMERA_HEIGHT, 4]} onClick={handleWaypointClick} />

                {/* --- POST PROCESSING (Clean Look) --- */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} radius={0.4} />
                    {/* Vignette removed for cleaner look */}
                    <ToneMapping />
                </EffectComposer>

            </Canvas>
        </div>
    )
}
