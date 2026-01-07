'use client'

import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Text, Image, Environment, Html, ContactShadows, useTexture, OrbitControls, MeshReflectorMaterial, SpotLight } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

// --- COMPONENTS ---

// 1. Optimized Seats (InstancedMesh)
function InstancedSeats() {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const count = 200 // Number of seats
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useEffect(() => {
        if (!meshRef.current) return

        let i = 0
        const rows = 10
        const cols = 20

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Curved seating arrangement
                const radius = 15 + r * 1.5
                const angleInfo = (c - cols / 2) * 0.08

                const x = Math.sin(angleInfo) * radius
                const z = Math.cos(angleInfo) * radius

                // Position
                dummy.position.set(x, 0.4, z - 5) // Offset to center

                // Rotation (Look at stage at 0,0,0)
                dummy.lookAt(0, 0.4, -10)

                dummy.updateMatrix()
                meshRef.current.setMatrixAt(i++, dummy.matrix)
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [dummy])

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 200]}>
            <boxGeometry args={[0.6, 0.8, 0.6]} />
            <meshStandardMaterial color="#9f1239" roughness={0.6} />
        </instancedMesh>
    )
}

// 2. The Big Screen (With HTML Embed)
function MainScreen({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {
    return (
        <group position={[0, 4.5, -9]}>
            {/* Screen Border/Frame */}
            <mesh position={[0, 0, -0.1]}>
                <boxGeometry args={[16.5, 9.5, 0.5]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* The Actual Screen Surface */}
            <mesh>
                <planeGeometry args={[16, 9]} />
                <meshBasicMaterial color="black" />
            </mesh>

            {/* Ambilight Glow behind screen */}
            <pointLight position={[0, 0, -2]} intensity={2} color="#3b82f6" distance={10} />

            {/* HTML Content Projected */}
            <Html
                transform
                occlude
                position={[0, 0, 0.05]}
                style={{ width: '1280px', height: '720px', background: 'black' }}
                scale={0.125} // Scale down HTML pixels to fit 3D units (16 / 1280 approx)
            >
                <div className="w-full h-full bg-black flex items-center justify-center select-none cursor-pointer grayscale hover:grayscale-0 transition-all duration-500">
                    {isLive && streamUrl ? (
                        <div className="w-full h-full">
                            {streamUrl.startsWith('<') ? (
                                <div
                                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>div]:w-full [&>div]:h-full"
                                    dangerouslySetInnerHTML={{ __html: streamUrl }}
                                />
                            ) : (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={streamUrl}
                                    title="Live Stream"
                                    className="w-full h-full object-cover pointer-events-auto"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-white h-full bg-slate-900 w-full border border-slate-700">
                            <h1 className="text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">OFFLINE</h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Waiting for broadcast</p>
                        </div>
                    )}
                </div>
            </Html>
        </group>
    )
}

// 3. Stage & Architecture
function StageArchitecture() {
    return (
        <group>
            {/* Stage Floor - Reflective */}
            <mesh position={[0, 0.6, -9]} rotation={[-Math.PI / 2, 0, 0]}>
                <boxGeometry args={[26, 12, 1.2]} />
                {/* @ts-ignore */}
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={60} // Strength of the reflections
                    roughness={0.2}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#1e293b"
                    metalness={0.8}
                    mirror={0.7} // Mirror intensity
                />
            </mesh>

            {/* Main Floor (Auditorium) - Carpet */}
            <mesh position={[0, -0.1, 10]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[60, 60]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>

            {/* Side Walls with Lights */}
            <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[40, 20]} />
                <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[20, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[40, 20]} />
                <meshStandardMaterial color="#020617" />
            </mesh>

            {/* Truss System */}
            <mesh position={[0, 10, -5]}>
                <boxGeometry args={[22, 1, 1]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
            </mesh>
        </group>
    )
}

export default function MainStageExperience({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {

    return (
        <div className="w-full h-full bg-black relative">
            <Canvas camera={{ position: [0, 8, 18], fov: 50 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }} shadows>

                {/* Camera Controls - Cinematic limits */}
                <OrbitControls
                    target={[0, 3, -9]} // Look at stage center
                    maxPolarAngle={Math.PI / 2} // Don't go below floor
                    minPolarAngle={Math.PI / 3} // Don't look too high up
                    minAzimuthAngle={-Math.PI / 4}
                    maxAzimuthAngle={Math.PI / 4}
                    enableZoom={true}
                    minDistance={10}
                    maxDistance={30}
                    enablePan={false}
                />

                {/* Lighting - Volumetric Feel */}
                <ambientLight intensity={0.2} />

                {/* Stage Spotlights */}
                <SpotLight
                    position={[-8, 10, -5]}
                    target-position={[-4, 0, -9]}
                    penumbra={0.5}
                    radiusTop={0.4}
                    radiusBottom={40}
                    distance={40}
                    angle={0.5}
                    attenuation={5}
                    anglePower={5}
                    intensity={2}
                    opacity={0.5}
                    color="#2563eb"
                    castShadow
                />
                <SpotLight
                    position={[8, 10, -5]}
                    target-position={[4, 0, -9]}
                    penumbra={0.5}
                    radiusTop={0.4}
                    radiusBottom={40}
                    distance={40}
                    angle={0.5}
                    attenuation={5}
                    anglePower={5}
                    intensity={2}
                    opacity={0.5}
                    color="#7c3aed"
                    castShadow
                />

                {/* Environment */}
                <color attach="background" args={['#000']} />
                <Environment preset="city" />

                {/* --- SCENE --- */}
                <StageArchitecture />
                <MainScreen streamUrl={streamUrl} isLive={isLive} />
                <InstancedSeats />

                {/* Ground Reflections Helper - Invisible plane associated with reflector if needed, but handled in component */}

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1} radius={0.5} />
                    <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    <Noise opacity={0.02} />
                </EffectComposer>

            </Canvas>
        </div>
    )
}
