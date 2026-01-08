'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Html, ContactShadows, useTexture, OrbitControls, MeshReflectorMaterial, SpotLight, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise } from '@react-three/postprocessing'
import React, { useState, useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

// --- COMPONENTS ---

// 1. Modern Conference Mannequin (Frosted Glass)
function AudienceMember({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.45, 0]}>
                <capsuleGeometry args={[0.2, 0.9, 4]} />
                <meshPhysicalMaterial
                    color="#e2e8f0"
                    transmission={0.5}
                    opacity={0.7}
                    roughness={0.3}
                    transparent
                />
            </mesh>
            <mesh position={[0, 1, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshPhysicalMaterial
                    color="#cbd5e1"
                    transmission={0.5}
                    opacity={0.8}
                    roughness={0.3}
                    transparent
                />
            </mesh>
        </group>
    )
}

function InstancedAudience() {
    // Generate crowd positions in a curve
    const crowd = useMemo(() => {
        const items = []
        for (let r = 0; r < 8; r++) {
            for (let c = -15; c <= 15; c++) {
                if (Math.random() > 0.3) { // 70% occupancy
                    const radius = 12 + r * 1.8
                    const angle = c * 0.08
                    const x = Math.sin(angle) * radius
                    const z = Math.cos(angle) * radius - 2 // Offset
                    items.push([x, 0, z] as [number, number, number])
                }
            }
        }
        return items
    }, [])

    return (
        <group>
            {crowd.map((pos, i) => (
                <AudienceMember key={i} position={pos} />
            ))}
        </group>
    )
}

// 2. The Main Screen (Bezel-less)
function MainScreen({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {
    return (
        <group position={[0, 4, -8]}>
            {/* Screen Surface */}
            <mesh>
                <planeGeometry args={[16, 9]} />
                <meshBasicMaterial color="#000" />
            </mesh>

            {/* Back Glow */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[16.5, 9.5]} />
                <meshBasicMaterial color="#1d4ed8" transparent opacity={0.5} />
            </mesh>
            <pointLight position={[0, 0, -2]} intensity={2} color="#3b82f6" distance={15} />

            {/* HTML Embed */}
            <Html
                transform
                occlude="blending"
                position={[0, 0, 0.05]}
                style={{ width: '1280px', height: '720px', background: 'black' }}
                scale={0.125}
            >
                <div className="w-full h-full bg-black flex items-center justify-center">
                    {isLive && streamUrl ? (
                        streamUrl.startsWith('<') ? (
                            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: streamUrl }} />
                        ) : (
                            <iframe
                                width="100%"
                                height="100%"
                                src={streamUrl}
                                title="Live Stream"
                                className="w-full h-full object-cover"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center text-white h-full bg-slate-900 w-full">
                            <h1 className="text-4xl font-black text-slate-700 tracking-widest uppercase">No Signal</h1>
                        </div>
                    )}
                </div>
            </Html>
        </group>
    )
}

// 3. Stage Architecture (Wood & Steel)
function StageArchitecture() {
    return (
        <group>
            {/* Main Podium Floor (Glossy White) */}
            <mesh position={[0, 0.6, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <cylinderGeometry args={[12, 11, 1, 64]} />
                {/* @ts-ignore */}
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={30}
                    roughness={0.2}
                    color="#f1f5f9" // White floor
                    metalness={0.1}
                />
            </mesh>

            {/* Backdrop / Acoustic Panels */}
            {[-1, 1].map((side, i) => (
                <group key={i} position={[side * 14, 5, -8]} rotation={[0, -side * 0.3, 0]}>
                    <mesh>
                        <boxGeometry args={[8, 12, 0.5]} />
                        <meshStandardMaterial color="#334155" roughness={0.8} /> {/* Dark gray slate */}
                    </mesh>
                    {/* Wood slats */}
                    {[...Array(10)].map((_, j) => (
                        <mesh key={j} position={[0, 0, 0.3 + j * 0.01]} rotation={[0, 0, 0]} renderOrder={1}>
                            <boxGeometry args={[0.4, 12, 0.1]} />
                            <meshStandardMaterial color="#d97706" /> {/* Wood color */}
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Ceiling Truss */}
            <group position={[0, 12, 0]}>
                {[...Array(5)].map((_, i) => (
                    <mesh key={i} position={[0, 0, i * 4 - 10]}>
                        <boxGeometry args={[30, 0.5, 0.5]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.8} />
                    </mesh>
                ))}
            </group>
        </group>
    )
}

export default function MainStageExperience({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {
    return (
        <div className="w-full h-full bg-white relative">
            <Canvas
                camera={{ position: [0, 5, 18], fov: 45 }}
                gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
                shadows
            >
                {/* Controls */}
                <OrbitControls
                    target={[0, 3, -8]}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={false}
                    minDistance={10}
                    maxDistance={25}
                />

                {/* Lighting: Studio Style */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[-10, 10, 5]} intensity={1} color="#fff" castShadow />
                {/* Stage Spots */}
                <SpotLight position={[-8, 15, 5]} target-position={[0, 2, -8]} color="#fff" intensity={5} angle={0.3} penumbra={0.4} castShadow />
                <SpotLight position={[8, 15, 5]} target-position={[0, 2, -8]} color="#fff" intensity={5} angle={0.3} penumbra={0.4} castShadow />

                {/* Backlights for color */}
                <pointLight position={[-10, 2, -12]} color="#3b82f6" intensity={2} distance={10} />
                <pointLight position={[10, 2, -12]} color="#ec4899" intensity={2} distance={10} />

                {/* Environment */}
                <color attach="background" args={['#0f172a']} />
                <fog attach="fog" args={['#0f172a', 15, 40]} />

                {/* Geometry */}
                <StageArchitecture />
                <MainScreen streamUrl={streamUrl} isLive={isLive} />
                <InstancedAudience />

                {/* Floor Reflections (Carpet Area) */}
                <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
                    <ToneMapping />
                    <Noise opacity={0.02} />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
