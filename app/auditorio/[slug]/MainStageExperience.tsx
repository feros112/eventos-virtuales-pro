'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Html, ContactShadows, useTexture, OrbitControls, MeshReflectorMaterial, SpotLight, Environment, Image } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise } from '@react-three/postprocessing'
import React, { useState, useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

// --- COMPONENTS ---

// 1. Realistic Seating Array (Inspired by Reference Image 4)
function SeatingArea() {
    const seats = useMemo(() => {
        const items = []
        const rows = 12
        for (let r = 0; r < rows; r++) {
            const rowRadius = 18 + r * 1.5
            const rowCount = 24 + r * 3
            const angleSpan = Math.PI * 0.85
            for (let c = 0; c < rowCount; c++) {
                const angle = (c / (rowCount - 1) - 0.5) * angleSpan
                const x = Math.sin(angle) * rowRadius
                const z = Math.cos(angle) * rowRadius + 8
                items.push({ pos: [x, r * 0.4, z] as [number, number, number], rot: [0, angle, 0] })
            }
        }
        return items
    }, [])

    return (
        <group>
            {seats.map((seat, i) => (
                <group key={i} position={seat.pos} rotation={seat.rot as [number, number, number]}>
                    {/* Chair Base */}
                    <mesh position={[0, 0.2, 0]}>
                        <boxGeometry args={[0.7, 0.5, 0.7]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.3} />
                    </mesh>
                    {/* Chair Backrest with Accent Light */}
                    <mesh position={[0, 0.8, -0.3]}>
                        <boxGeometry args={[0.7, 1.2, 0.1]} />
                        <meshStandardMaterial color="#1e293b" emissive="#00f3ff" emissiveIntensity={0.05} />
                    </mesh>
                    {/* Seat Light Glow (Image Reference) */}
                    <pointLight position={[0, 0.5, 0.5]} intensity={0.1} color="#3b82f6" distance={2} />
                </group>
            ))}
        </group>
    )
}

// 2. IMAX Curved Screen (Massive Scale)
function CurvedScreen({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {
    const screenRef = useRef<THREE.Group>(null)

    return (
        <group position={[0, 8, -15]} ref={screenRef}>
            {/* Screen Geometry (Curved) */}
            <mesh rotation={[0, Math.PI, 0]}>
                <cylinderGeometry args={[25, 25, 12, 64, 1, true, -Math.PI / 4, Math.PI / 2]} />
                <meshStandardMaterial color="#000" side={THREE.BackSide} metalness={1} roughness={0} />
            </mesh>

            {/* Content Slot */}
            <Html
                transform
                distanceFactor={12}
                position={[0, 0, 0.1]}
                className="bg-black/90 overflow-hidden rounded-xl border-4 border-white/5 shadow-[0_0_150px_rgba(0,243,255,0.2)]"
            >
                <div style={{ width: '1920px', height: '1080px', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {isLive ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={streamUrl.includes('youtube') ? `${streamUrl}?autoplay=1&mute=0` : streamUrl}
                            title="Auditorium Stream"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <h2 className="text-[120px] font-black text-white tracking-widest uppercase mb-4 opacity-20">EVENTOS PRO</h2>
                            <p className="text-[40px] font-bold text-cyan-400 tracking-[1em] uppercase">SISTEMA EN ESPERA</p>
                        </div>
                    )}
                </div>
            </Html>

            {/* Neon Border Glow */}
            <mesh position={[0, 0, -0.2]}>
                <cylinderGeometry args={[25.1, 25.1, 12.1, 64, 1, true, -Math.PI / 4, Math.PI / 2]} />
                <meshBasicMaterial color="#00f3ff" side={THREE.BackSide} transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

// 3. Stage & Architecture (The BeyondLive Look)
function AuditoriumArchitecture() {
    return (
        <group>
            {/* Reflective Ground (Polished Pavement from Image 4) */}
            <mesh position={[0, -0.1, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
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

            {/* Stage Deck */}
            <mesh position={[0, 0.4, -12]}>
                <boxGeometry args={[40, 1, 15]} />
                <meshStandardMaterial color="#1e293b" metalness={1} roughness={0} />
            </mesh>

            {/* Floating Neon Rings (Reference Image 5 Influence) */}
            <group position={[0, 18, -10]}>
                {[15, 25, 40].map((radius, i) => (
                    <mesh key={radius} rotation={[Math.PI / 2, 0, 0]} position={[0, -i * 2, 0]}>
                        <torusGeometry args={[radius, 0.08, 16, 128]} />
                        <meshBasicMaterial color="#00f3ff" transparent opacity={0.4 - i * 0.1} />
                    </mesh>
                ))}
            </group>

            {/* Monetization Terminals (Vertical Ad Banners) */}
            {[-22, 22].map((x) => (
                <group key={x} position={[x, 10, -8]} rotation={[0, x > 0 ? 0.6 : -0.6, 0]}>
                    <mesh>
                        <boxGeometry args={[6.2, 15.2, 0.6]} />
                        <meshStandardMaterial color="#020617" metalness={1} roughness={0} />
                    </mesh>

                    {/* The Ad Content */}
                    <Image
                        url={x < 0 ? "/auditorium-ad-left.png" : "/auditorium-ad-right.png"}
                        scale={[6, 15]}
                        position={[0, 0, 0.35]}
                        transparent
                    />

                    {/* Glowing Accent */}
                    <mesh position={[0, 0, 0.31]}>
                        <planeGeometry args={[6.1, 15.1]} />
                        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
                    </mesh>

                    <Text
                        position={[0, -8.2, 0.5]}
                        fontSize={0.4}
                        color="#06b6d4"
                        fontWeight="black"
                        font="/fonts/Inter-Black.ttf"
                    >
                        MONETIZATION TERMINAL
                    </Text>
                </group>
            ))}
        </group>
    )
}

import PresentationScreen from './PresentationScreen'

export default function MainStageExperience({
    streamUrl,
    isLive,
    slidesUrl = '',
    currentSlide = 1,
    totalSlides = 1
}: {
    streamUrl: string,
    isLive: boolean,
    slidesUrl?: string,
    currentSlide?: number,
    totalSlides?: number
}) {
    return (
        <div className="w-full h-full bg-[#020617]">
            <Canvas
                camera={{ position: [0, 8, 30], fov: 40 }}
                gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8 }}
                shadows
            >
                {/* Controls - Restricted for Premium feel */}
                <OrbitControls
                    target={[0, 5, -5]}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={false}
                    minDistance={15}
                    maxDistance={45}
                />

                {/* Lighting: High Contrast / Noir Style */}
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 20, 0]} intensity={2.5} color="#3b82f6" distance={50} />
                <SpotLight position={[0, 25, -5]} target-position={[0, 2, -12]} intensity={10} color="#fff" angle={0.4} />

                {/* Atmosphere */}
                <color attach="background" args={['#010409']} />
                <fog attach="fog" args={['#010409', 20, 80]} />

                {/* Geometry */}
                <AuditoriumArchitecture />
                <CurvedScreen streamUrl={streamUrl} isLive={isLive} />
                <PresentationScreen
                    slidesUrl={slidesUrl}
                    currentSlide={currentSlide}
                    totalSlides={totalSlides}
                    position={[18, 10, -10]}
                    rotation={[0, -0.6, 0]}
                    scale={[10, 5.6, 1]}
                />
                <SeatingArea />

                {/* Post Processing for that Glow */}
                <EffectComposer>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
                    <Vignette darkness={0.7} />
                    <ToneMapping />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
