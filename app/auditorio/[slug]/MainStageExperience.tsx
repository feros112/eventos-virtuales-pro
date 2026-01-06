'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Grid, Image, Environment, Html, ContactShadows, useTexture, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import { useState, useRef, Suspense } from 'react'
import * as THREE from 'three'

// --- COMPONENTS ---

// 1. Theater Seats (Simple Rows)
function Seats() {
    const seats = []
    const rows = 8
    const cols = 12
    const curve = 10

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = (c - cols / 2) * 1.5
            const z = r * 2 + 5
            // Slight curve
            const zOffset = Math.abs(x) * 0.2

            seats.push(
                <group key={`${r}-${c}`} position={[x, 0, z + zOffset]}>
                    {/* Seat Back */}
                    <mesh position={[0, 0.6, -0.3]} rotation={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.8, 1, 0.1]} />
                        <meshStandardMaterial color="#ef4444" roughness={0.8} />
                    </mesh>
                    {/* Seat Base */}
                    <mesh position={[0, 0.3, 0]}>
                        <boxGeometry args={[0.8, 0.1, 0.8]} />
                        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
                    </mesh>
                    {/* Armrests */}
                    <mesh position={[-0.45, 0.4, 0]}>
                        <boxGeometry args={[0.1, 0.4, 0.8]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0.45, 0.4, 0]}>
                        <boxGeometry args={[0.1, 0.4, 0.8]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                </group>
            )
        }
    }
    return <group>{seats}</group>
}

// 2. The Big Screen (With HTML Embed)
function MainScreen({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {
    return (
        <group position={[0, 4, -8]}>
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

            {/* HTML Content Projected */}
            <Html
                transform
                occlude
                position={[0, 0, 0.05]}
                style={{ width: '1280px', height: '720px', background: 'black' }}
                scale={0.125} // Scale down HTML pixels to fit 3D units (16 / 1280 approx)
            >
                <div className="w-full h-full bg-black flex items-center justify-center">
                    {isLive && streamUrl ? (
                        streamUrl.startsWith('<') ? (
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
                                className="w-full h-full object-cover"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center text-white h-full">
                            <h1 className="text-6xl font-bold mb-4">WAITING FOR SIGNAL</h1>
                            <div className="w-24 h-24 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
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
            {/* Stage Floor */}
            <mesh position={[0, 1, -8]} rotation={[-Math.PI / 2, 0, 0]}>
                <boxGeometry args={[24, 8, 2]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Main Floor (Auditorium) */}
            <mesh position={[0, -0.1, 10]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>

            {/* Walls */}
            <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[40, 20]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[40, 20]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Ceiling Lights (Truss) */}
            <mesh position={[0, 9, 5]}>
                <boxGeometry args={[20, 0.5, 0.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0, 9, 0]}>
                <boxGeometry args={[20, 0.5, 0.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>

        </group>
    )
}

export default function MainStageExperience({ streamUrl, isLive }: { streamUrl: string, isLive: boolean }) {

    return (
        <div className="w-full h-full bg-black relative">
            <Canvas camera={{ position: [0, 4, 12], fov: 60 }} gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1 }}>

                {/* Controls - Limited look around */}
                <OrbitControls
                    target={[0, 4, -8]} // Look at screen
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2.5}
                    minAzimuthAngle={-Math.PI / 8}
                    maxAzimuthAngle={Math.PI / 8}
                    enableZoom={true}
                    minDistance={8}
                    maxDistance={20}
                    enablePan={false}
                />

                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 10, -5]} intensity={1} color="white" />
                {/* Screen Glow */}
                <pointLight position={[0, 4, -7]} intensity={2} color="#60a5fa" distance={15} decay={2} />

                {/* Environment */}
                <color attach="background" args={['#000']} />

                {/* --- SCENE --- */}
                <StageArchitecture />
                <MainScreen streamUrl={streamUrl} isLive={isLive} />
                <Seats />

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.6} radius={0.8} />
                    <Vignette eskil={false} offset={0.1} darkness={0.7} />
                    <Noise opacity={0.05} />
                </EffectComposer>

            </Canvas>
        </div>
    )
}
