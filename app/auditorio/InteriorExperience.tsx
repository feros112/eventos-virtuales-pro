'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Text, Float, Stars, Grid, Environment, MeshReflectorMaterial, Sparkles, CameraControls, useTexture, OrbitControls, Center, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, ChromaticAberration } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

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
    return (
        <div className="w-full h-screen bg-black">
            <Canvas
                shadows
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}
            >
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, CAMERA_HEIGHT, 0.1]} fov={70} />
                    <CameraControls
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.8}
                        azimuthRotateSpeed={-0.3}
                        polarRotateSpeed={-0.3}
                        dollySpeed={0}
                        truckSpeed={0}
                        mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }}
                    />

                    {/* High-End Surroundings */}
                    <CinematicEnvironment />

                    {/* Lighting for the Interactive Elements */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[0, 10, 0]} intensity={10} color="#00f3ff" />

                    {/* The "Floor" (Reflective Onyx) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                        <planeGeometry args={[100, 100]} />
                        <MeshReflectorMaterial
                            blur={[400, 100]}
                            resolution={1024}
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
                    </mesh>

                    {/* Interactive Portals in 360 space */}
                    <RoomPortal position={[0, 0, -15]} label="Auditorio" subLabel="Main Stage" slug="/auditorio/main-stage" color="#00f3ff" />
                    <RoomPortal position={[-12, 0, -10]} label="Talleres" subLabel="Workshop Area" slug="/auditorio/workshop" color="#f43f5e" rotation={[0, Math.PI / 4, 0]} />
                    <RoomPortal position={[12, 0, -10]} label="Expo Hall" subLabel="Product Showcase" slug="/expo" color="#10b981" rotation={[0, -Math.PI / 4, 0]} />
                    <RoomPortal position={[-15, 0, 5]} label="Networking" subLabel="Lounge VIP" slug="/networking" color="#6366f1" rotation={[0, Math.PI / 2, 0]} />
                    <RoomPortal position={[15, 0, 5]} label="Escape Room" subLabel="Gamified Exp" slug="/escape-room" color="#f59e0b" rotation={[0, -Math.PI / 2, 0]} />

                    <Sparkles count={200} scale={20} size={3} speed={1} color="#00f3ff" />

                    <EffectComposer multisampling={8}>
                        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.5} radius={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        <ToneMapping />
                        <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute top-10 left-10 z-[100] pointer-events-none">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-8 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,1)]" />
                    <h1 className="text-3xl font-[1000] text-white uppercase tracking-tighter italic">LOBBY PRINCIPAL</h1>
                </div>
                <p className="text-cyan-400/60 text-xs font-black uppercase tracking-[0.4em] ml-6">Mover el mouse para explorar en 360°</p>
            </div>
        </div>
    )
}
