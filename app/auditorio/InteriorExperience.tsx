'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Grid, Image, Environment, ContactShadows, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// --- CONSTANTS ---
const CAMERA_HEIGHT = 1.7
const MOVEMENT_SPEED = 0.05

// --- COMPONENTS ---

// 1. Interior Navigation Waypoint
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
                <circleGeometry args={[0.6, 32]} />
                <meshStandardMaterial
                    color={hovered ? "#fff" : "#ddd"}
                    emissive={hovered ? "#fff" : "#aaa"}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            {/* Ring Pulse */}
            {hovered && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.7, 0.8, 32]} />
                    <meshBasicMaterial color="#fff" />
                </mesh>
            )}
        </group>
    )
}

// 2. Door / Portal Component
function RoomPortal({ position, label, slug, color = "#4f46e5", width = 4, height = 3, rotation = [0, 0, 0] }: { position: [number, number, number], label: string, slug: string, color?: string, width?: number, height?: number, rotation?: [number, number, number] }) {
    const router = useRouter()
    const [hovered, setHover] = useState(false)

    return (
        <group position={position} rotation={rotation}>
            {/* Door Frame */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[width + 0.4, height + 0.4, 0.2]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Door Glow/Interior */}
            <mesh
                position={[0, height / 2, 0.1]}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                onClick={() => router.push(slug)}
            >
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 3 : 1}
                    transparent
                    opacity={hovered ? 0.9 : 0.6}
                />
            </mesh>

            {/* Label */}
            <Text position={[0, height + 0.8, 0.2]} fontSize={0.5} color={hovered ? "white" : "#ccc"} anchorX="center" anchorY="bottom" font="/fonts/Inter-Bold.ttf">
                {label.toUpperCase()}
            </Text>
        </group>
    )
}

// 3. Reception Desk (Center)
function Reception() {
    return (
        <group position={[0, 0, -5]}>
            {/* Desk Body */}
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[4, 4, 1, 64, 1, true, 0, Math.PI]} />
                <meshStandardMaterial color="white" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[3.8, 3.8, 1, 64, 1, true, 0, Math.PI]} />
                <meshStandardMaterial color="#333" side={THREE.DoubleSide} />
            </mesh>

            {/* Top Counter */}
            <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3.5, 4.2, 64, 1, 0, Math.PI]} />
                <meshStandardMaterial color="#111" roughness={0.2} />
            </mesh>

            {/* Sign */}
            <Text position={[0, 2.5, 0]} fontSize={0.4} color="#000" anchorX="center" anchorY="bottom">
                INFORMATION
            </Text>

            {/* NPC / Avatar Placeholder */}
            <mesh position={[0, 1.6, -1]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#4ade80" />
            </mesh>
        </group>
    )
}

// 4. Boutique (Left Immediate)
function Boutique() {
    return (
        <group position={[-8, 0, 5]} rotation={[0, Math.PI / 4, 0]}>
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[5, 0.1, 2]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[4.5, 1.5, 1.5]} />
                <meshStandardMaterial color="orange" visible={false} /> {/* Placeholder volume */}
            </mesh>

            {/* Shelves */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[4, 0.05, 1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0, 2, 0]}>
                <boxGeometry args={[4, 0.05, 1]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Title */}
            <Text position={[0, 3, 0]} fontSize={0.6} color="#f59e0b" anchorX="center" anchorY="bottom">
                BOUTIQUE
            </Text>

            {/* Products (Simple Boxes) */}
            <mesh position={[-1, 1.2, 0]}>
                <boxGeometry args={[0.5, 0.3, 0.5]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <mesh position={[1, 1.2, 0]}>
                <boxGeometry args={[0.5, 0.3, 0.5]} />
                <meshStandardMaterial color="blue" />
            </mesh>
        </group>
    )
}

// 5. Lounge Area (Right Immediate)
function Lounge() {
    return (
        <group position={[8, 0, 5]} rotation={[0, -Math.PI / 4, 0]}>
            {/* Rug */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[3, 32]} />
                <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Seats */}
            <mesh position={[-1.5, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[1.5, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>

            {/* Coffee Table */}
            <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[1, 1, 0.4, 32]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>

            <Text position={[0, 2.5, 0]} fontSize={0.6} color="#64748b" anchorX="center" anchorY="bottom">
                LOUNGE
            </Text>
        </group>
    )
}


// --- CONTROLLER ---
function CameraController({ targetPosition }: { targetPosition: Vector3 }) {
    useFrame((state, delta) => {
        state.camera.position.lerp(targetPosition, 0.08)
    })
    return null
}

export default function InteriorExperience() {
    const [targetPos, setTargetPos] = useState(new Vector3(0, CAMERA_HEIGHT, 12)) // Start at entrance

    const handleMove = (newPos: Vector3) => {
        setTargetPos(newPos)
    }

    return (
        <div className="w-full h-screen bg-slate-900">
            <Canvas camera={{ position: [0, CAMERA_HEIGHT, 12], fov: 75 }} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.2 }}>
                <CameraController targetPosition={targetPos} />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <pointLight position={[0, 5, 0]} intensity={3} color="white" />
                <pointLight position={[-10, 5, 5]} intensity={2} color="#f59e0b" /> {/* Boutique Warmth */}

                {/* Environment - Interior HDRI or simple Color */}
                <color attach="background" args={['#e2e8f0']} />
                <Environment preset="apartment" />

                {/* --- ROOM ARCHITECTURE --- */}
                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial color="#f1f5f9" roughness={0.1} metalness={0.1} />
                </mesh>
                <Grid position={[0, 0.01, 0]} args={[40, 40]} cellColor="#cbd5e1" sectionColor="#94a3b8" fadeDistance={20} />

                {/* Ceiling */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>

                {/* Walls */}
                <mesh position={[0, 4, -15]}>
                    <boxGeometry args={[40, 8, 1]} />
                    <meshStandardMaterial color="#f8fafc" />
                </mesh>
                <mesh position={[-20, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[40, 8, 1]} />
                    <meshStandardMaterial color="#f8fafc" />
                </mesh>
                <mesh position={[20, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <boxGeometry args={[40, 8, 1]} />
                    <meshStandardMaterial color="#f8fafc" />
                </mesh>


                {/* --- ZONES --- */}
                <Reception />
                <Boutique />
                <Lounge />

                {/* --- ROOM PORTALS --- */}
                {/* Main Theater (Back Center) */}
                <RoomPortal position={[0, 0, -14]} label="Main Theater" slug="/auditorio/main-stage" color="#ec4899" width={6} height={4} />

                {/* Workshop (Left Wall) */}
                <RoomPortal position={[-19, 0, -5]} label="Workshop" slug="/auditorio/workshop" color="#3b82f6" rotation={[0, Math.PI / 2, 0]} />

                {/* Breakout (Left Wall Near) */}
                <RoomPortal position={[-19, 0, 5]} label="Breakout" slug="/auditorio/breakout" color="#8b5cf6" rotation={[0, Math.PI / 2, 0]} />

                {/* Escape Room (Right Wall Back) */}
                <RoomPortal position={[19, 0, -5]} label="Escape Room" slug="/auditorio/escape-room" color="#ef4444" rotation={[0, -Math.PI / 2, 0]} />

                {/* Expo Hall (Right Wall Near) */}
                <RoomPortal position={[19, 0, 5]} label="Expo Hall" slug="/expo" color="#06b6d4" rotation={[0, -Math.PI / 2, 0]} />


                {/* --- NAVIGATION WAYPOINTS --- */}
                <Waypoint position={[0, 0.05, 8]} target={[0, CAMERA_HEIGHT, 8]} onClick={handleMove} />
                <Waypoint position={[0, 0.05, 0]} target={[0, CAMERA_HEIGHT, 0]} onClick={handleMove} />
                <Waypoint position={[0, 0.05, -8]} target={[0, CAMERA_HEIGHT, -8]} onClick={handleMove} />

                {/* To Boutique */}
                <Waypoint position={[-6, 0.05, 5]} target={[-6, CAMERA_HEIGHT, 5]} onClick={handleMove} />

                {/* To Lounge */}
                <Waypoint position={[6, 0.05, 5]} target={[6, CAMERA_HEIGHT, 5]} onClick={handleMove} />


                {/* Post Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>

            </Canvas>
        </div>
    )
}
