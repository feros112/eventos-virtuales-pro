
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Grid, PresentationControls, ContactShadows, Environment, Image } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function Portal({ position, color, label, path, rotation, imageUrl }: { position: [number, number, number], color: string, label: string, path: string, rotation: [number, number, number], imageUrl: string }) {
    const router = useRouter()
    const meshRef = useRef<THREE.Group>(null)
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Gentle hovering animation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
        }
    })

    return (
        <group
            ref={meshRef}
            position={position}
            rotation={rotation}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
            onClick={() => router.push(path)}
        >
            {/* Glowing Border */}
            <mesh>
                <boxGeometry args={[3.2, 2.2, 0.1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 0.5} toneMapped={false} />
            </mesh>

            {/* Screen Content (Image) */}
            <Image
                url={imageUrl}
                position={[0, 0, 0.06]}
                scale={[3, 2]}
                transparent
                opacity={hovered ? 1 : 0.8}
            />

            {/* Label (Floating Text) */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text

                    fontSize={0.4}
                    position={[0, 1.5, 0]}
                    color={hovered ? "#ffffff" : color}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {label.toUpperCase()}
                </Text>
            </Float>

            {/* Label Description */}
            {hovered && (
                <Text
                    fontSize={0.15}
                    position={[0, -1.4, 0]}
                    color="#aaaaaa"
                    anchorX="center"
                    anchorY="middle"
                >
                    Click para entrar
                </Text>
            )}
        </group>
    )
}

export default function Experience() {
    return (
        <div className="w-full h-screen bg-slate-950">
            <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />

                {/* Controls - Limited rotation to simulate looking around a room */}
                <PresentationControls
                    global
                    zoom={0.8}
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]}
                    azimuth={[-Math.PI / 4, Math.PI / 4]}

                    snap={true}
                >
                    <group position={[0, -1, 0]}>

                        {/* FLOOR */}
                        <Grid
                            position={[0, -0.5, 0]}
                            args={[20, 20]}
                            cellColor="#4f46e5"
                            sectionColor="#ec4899"
                            fadeDistance={15}
                            fadeStrength={1}
                        />
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
                            <planeGeometry args={[50, 50]} />
                            <meshBasicMaterial color="#020617" />
                        </mesh>

                        {/* PORTALS (The Rooms) */}

                        {/* Center: Auditorium */}
                        <Portal
                            position={[0, 1, -2]}
                            rotation={[0, 0, 0]}
                            color="#ec4899" // Pink/Rose
                            label="Auditorio"
                            path="/auditorio"
                            imageUrl="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80" // Concert/Auditorium
                        />

                        {/* Left: Expo */}
                        <Portal
                            position={[-4, 1, 0]}
                            rotation={[0, 0.5, 0]}
                            color="#06b6d4" // Cyan
                            label="Expo Hall"
                            path="/expo"
                            imageUrl="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&w=800&q=80" // Exhibition
                        />

                        {/* Right: Networking */}
                        <Portal
                            position={[4, 1, 0]}
                            rotation={[0, -0.5, 0]}
                            color="#a855f7" // Purple
                            label="Networking"
                            path="/networking"
                            imageUrl="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80" // People meeting
                        />

                        {/* Floating Title */}
                        <Float speed={1} floatIntensity={0.5}>
                            <Text
                                position={[0, 3.5, -4]}
                                fontSize={0.8}
                                color="white"
                                anchorX="center"
                                anchorY="middle"
                            >
                                PRO GLOBAL EVENTS
                            </Text>
                        </Float>

                        <ContactShadows position={[0, -0.4, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />

                    </group>
                </PresentationControls>
            </Canvas>
        </div>
    )
}
