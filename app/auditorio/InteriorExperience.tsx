'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, MeshReflectorMaterial, Sparkles, CameraControls, useTexture, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import React, { useState, useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'

// --- CONSTANTS ---
const CAMERA_HEIGHT = 1.6

// --- COMPONENTS ---

// 1. Interactive Portal 3.0 (Cinema Pro)
function RoomPortal({ position, label, subLabel, slug, color, rotation = [0, 0, 0] }: { position: [number, number, number], label: string, subLabel: string, slug: string, color: string, rotation?: [number, number, number] }) {
    const router = useRouter()
    const [hovered, setHover] = useState(false)
    const ringRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.01
            ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
        }
    })

    return (
        <group
            position={position}
            rotation={rotation as [number, number, number]}
            onClick={() => router.push(slug)}
            onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
        >
            {/* Holographic Body */}
            <mesh position={[0, 2.5, 0]}>
                <planeGeometry args={[4, 5]} />
                <meshBasicMaterial color={color} transparent opacity={hovered ? 0.2 : 0.05} side={THREE.DoubleSide} />
            </mesh>

            {/* Neon Frame */}
            <mesh ref={ringRef} position={[0, 2.5, 0.1]}>
                <ringGeometry args={[2.2, 2.3, 4, 1]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>

            {/* Typography */}
            <Text position={[0, 5.5, 0.2]} fontSize={0.2} color={color} fontWeight="black" letterSpacing={0.5}>
                {subLabel.toUpperCase()}
            </Text>
            <Text position={[0, 2.5, 0.3]} fontSize={0.6} color="white" fontWeight="black" letterSpacing={0.1}>
                {label.toUpperCase()}
            </Text>

            <pointLight position={[0, 2.5, 2]} intensity={hovered ? 30 : 10} color={color} distance={10} />
        </group>
    )
}

// 2. The 360 Atmospheric Backdrop
function CinematicEnvironment() {
    const texture = useTexture('/luxury-hall.png')

    return (
        <mesh scale={[-100, 100, 100]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
        </mesh>
    )
}

export default function InteriorExperience() {
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 1500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full h-screen bg-black relative">
            {!loaded && (
                <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                    <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Iniciando Experiencia Virtual...</p>
                </div>
            )}

            <Canvas
                shadows={!isMobile}
                gl={{
                    antialias: !isMobile,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                    powerPreference: "high-performance"
                }}
            >
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, CAMERA_HEIGHT, 0.1]} fov={isMobile ? 85 : 70} />
                    <CameraControls
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.8}
                        azimuthRotateSpeed={isMobile ? -0.5 : -0.3}
                        polarRotateSpeed={isMobile ? -0.5 : -0.3}
                        dollySpeed={0}
                        truckSpeed={0}
                        mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }}
                        touches={{ one: 32, two: 0, three: 0 }} // Enable rotation with one finger
                    />

                    <CinematicEnvironment />

                    <ambientLight intensity={isMobile ? 1 : 0.5} />
                    <pointLight position={[0, 10, 0]} intensity={isMobile ? 5 : 10} color="#00f3ff" />

                    {/* The "Floor" (Optimized for Mobile) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                        <planeGeometry args={[100, 100]} />
                        {!isMobile ? (
                            <MeshReflectorMaterial
                                blur={[400, 100]}
                                resolution={512}
                                mixBlur={1}
                                mixStrength={60}
                                roughness={1}
                                depthScale={1.2}
                                minDepthThreshold={0.4}
                                maxDepthThreshold={1.4}
                                color="#050505"
                                metalness={0.9}
                                mirror={0.5}
                            />
                        ) : (
                            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
                        )}
                    </mesh>

                    {/* Interactive Portals */}
                    <RoomPortal position={[0, 0, -15]} label="Auditorio" subLabel="Main Stage" slug="/auditorio/main-stage" color="#00f3ff" />
                    <RoomPortal position={[-12, 0, -10]} label="Talleres" subLabel="Workshop Area" slug="/auditorio/workshop" color="#f43f5e" rotation={[0, Math.PI / 4, 0]} />
                    <RoomPortal position={[12, 0, -10]} label="Expo Hall" subLabel="Product Showcase" slug="/expo" color="#10b981" rotation={[0, -Math.PI / 4, 0]} />
                    <RoomPortal position={[-15, 0, 5]} label="Networking" subLabel="Lounge VIP" slug="/networking" color="#6366f1" rotation={[0, Math.PI / 2, 0]} />
                    <RoomPortal position={[15, 0, 5]} label="Escape Room" subLabel="Gamified Exp" slug="/escape-room" color="#f59e0b" rotation={[0, -Math.PI / 2, 0]} />

                    {!isMobile && <Sparkles count={200} scale={20} size={3} speed={1} color="#00f3ff" />}

                    <EffectComposer multisampling={isMobile ? 0 : 8}>
                        <Bloom luminanceThreshold={1} mipmapBlur intensity={isMobile ? 0.5 : 1.5} radius={0.4} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        {!isMobile ? <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} /> : <></>}
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute top-10 left-10 z-[100] pointer-events-none">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-8 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,1)]" />
                    <h1 className="text-2xl md:text-3xl font-[1000] text-white uppercase tracking-tighter italic">LOBBY PRINCIPAL</h1>
                </div>
                <p className="text-cyan-400/60 text-[8px] md:text-xs font-black uppercase tracking-[0.4em] ml-6">
                    {isMobile ? "Desliza para explorar en 360°" : "Mover el mouse para explorar en 360°"}
                </p>
            </div>
        </div>
    )
}
