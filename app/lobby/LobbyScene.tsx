'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Stars, Environment, CameraControls, Float, Sparkles, Billboard, useTexture, Image, MeshReflectorMaterial, VideoTexture, useVideoTexture } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, ChromaticAberration } from '@react-three/postprocessing'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// --- CONSTANTS ---
const CAMERA_HEIGHT = 1.7

// --- SAFETY BOUNDARY ---
class SponsorErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

// --- COMPONENTS ---

// Helper for Safe Image Loading in 3D
function SponsorImage({ url }: { url: string | undefined }) {
    const fallback = (
        <Text position={[0, 0, 0.15]} fontSize={0.5} color="#06b6d4" fontWeight="black" letterSpacing={0.1} textAlign="center">
            ESPACIO{"\n"}DISPONIBLE
        </Text>
    );

    if (!url || url.toLowerCase().endsWith('.svg')) return fallback;

    return (
        <SponsorErrorBoundary fallback={fallback}>
            <Suspense fallback={<Text position={[0, 0, 0.1]} fontSize={0.3} color="#444">CARGANDO...</Text>}>
                <Image url={url} position={[0, 0, 0.1]} scale={[7.5, 13.5]} transparent />
            </Suspense>
        </SponsorErrorBoundary>
    )
}

// 1. Manhattan Skyline (Distant City)
function ManhattanSkyline() {
    const buildings = useMemo(() => {
        return [...Array(120)].map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 600,
                Math.random() * 60 + 5,
                250 // Far in the distance
            ] as [number, number, number],
            scale: [5 + Math.random() * 20, 30 + Math.random() * 120, 5 + Math.random() * 20] as [number, number, number],
            color: ["#020617", "#0f172a", "#1e1b4b"][Math.floor(Math.random() * 3)],
            glowColor: ["#fbbf24", "#06b6d4", "#6366f1", "#ffffff"][Math.floor(Math.random() * 4)],
            flickerSpeed: 0.5 + Math.random() * 1.5
        }))
    }, [])

    return (
        <group>
            {buildings.map((b, i) => (
                <mesh key={i} position={b.position}>
                    <boxGeometry args={b.scale} />
                    <meshStandardMaterial color={b.color} roughness={0.1} metalness={0.9} />
                    {/* Living Windows */}
                    <mesh position={[0, 0, b.scale[2] / 2 + 0.1]}>
                        <planeGeometry args={[b.scale[0] * 0.7, b.scale[1] * 0.8]} />
                        <BuildingWindows color={b.glowColor} speed={b.flickerSpeed} />
                    </mesh>
                </mesh>
            ))}
            <pointLight position={[0, 40, 240]} intensity={15} color="#06b6d4" distance={600} />
            <Sparkles count={300} scale={[600, 100, 30]} position={[0, 80, 260]} size={10} speed={0.4} color="#fff" />
        </group>
    )
}

function BuildingWindows({ color, speed }: { color: string, speed: number }) {
    const meshRef = useRef<THREE.Mesh>(null)
    useFrame((state) => {
        if (meshRef.current) {
            const intensity = 0.4 + Math.sin(state.clock.elapsedTime * speed) * 0.4
            const mat = meshRef.current.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = intensity
        }
    })
    return (
        <mesh ref={meshRef}>
            <planeGeometry />
            <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} />
        </mesh>
    )
}

// 2. Crystalline Tech Tree
function TechTree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.08, 0.4, 4, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={1} />
            </mesh>
            {/* Crystalline Head */}
            <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
                <mesh position={[0, 5, 0]}>
                    <icosahedronGeometry args={[2.5, 0]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        transmission={1}
                        thickness={2}
                        roughness={0.05}
                        metalness={0}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
                <mesh position={[0, 5, 0]}>
                    <icosahedronGeometry args={[2.7, 1]} />
                    <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.05} />
                </mesh>
            </Float>
            <pointLight position={[0, 5, 0]} intensity={8} color="#06b6d4" distance={20} />
        </group>
    )
}

// 3. Central Walkway & Park Section
function CentralPark() {
    return (
        <group position={[0, 0, 80]}>
            {/* Mirror Lake/Canal Effect */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <planeGeometry args={[18, 160]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={80}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#020617"
                    metalness={0.5}
                    mirror={1}
                />
            </mesh>

            {/* Path Borders */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <planeGeometry args={[26, 160]} />
                <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Tech Trees along the path */}
            {[-22, 22].map(x => (
                <group key={x}>
                    {[0, 40, 80, 120].map(z => (
                        <TechTree key={z} position={[x, 0, z]} />
                    ))}
                </group>
            ))}

            {/* Atmospheric Lighting Sequences */}
            {[20, 60, 100, 140].map(z => (
                <group key={z} position={[0, 0.1, z]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[14, 1]} />
                        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
                    </mesh>
                    <pointLight intensity={6} color="#06b6d4" distance={15} />
                </group>
            ))}
        </group>
    )
}

// 4. Main Building (Architectural Overhaul)
function EliteBuilding() {
    const router = useRouter()
    return (
        <group position={[0, 0, -60]}>
            {/* Main Structure */}
            <mesh position={[0, 20, -15]}>
                <boxGeometry args={[100, 50, 20]} />
                <meshStandardMaterial color="#020617" roughness={0} metalness={1} />
            </mesh>

            {/* Glass Facade */}
            <mesh position={[0, 20, -4.5]}>
                <planeGeometry args={[90, 45]} />
                <meshPhysicalMaterial
                    color="#4f46e5"
                    transmission={0.9}
                    transparent
                    opacity={0.1}
                    roughness={0}
                    metalness={0.8}
                />
            </mesh>

            {/* Architectural Vertical Fins */}
            {[...Array(14)].map((_, i) => (
                <mesh key={i} position={[(i - 6.5) * 7, 20, -4.2]}>
                    <boxGeometry args={[0.4, 48, 1.5]} />
                    <meshStandardMaterial color="#1e1b4b" metalness={1} roughness={0.1} />
                </mesh>
            ))}

            {/* Massive Hero Branding */}
            <group position={[0, 30, -4.1]}>
                <Billboard>
                    <Text position={[0, 2, 0]} fontSize={5} color="white" fontWeight="black" letterSpacing={-0.05} textAlign="center">
                        EXPO EVENTOS{"\n"}360 PRO
                    </Text>
                    <Text position={[0, -4, 0]} fontSize={1.2} color="#06b6d4" fontWeight="bold" letterSpacing={0.8}>
                        Líderes en Inmersión Digital
                    </Text>
                </Billboard>
                <pointLight intensity={20} color="#06b6d4" distance={40} />
            </group>

            {/* Entrance Experience */}
            <group
                position={[0, 4, -4]}
                onClick={() => router.push('/lobby')}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <mesh>
                    <boxGeometry args={[22, 9, 1]} />
                    <meshPhysicalMaterial
                        color="#00f3ff"
                        emissive="#00f3ff"
                        emissiveIntensity={2}
                        transparent
                        opacity={0.2}
                        roughness={0}
                    />
                </mesh>
                <mesh position={[0, 0, -0.1]}>
                    <planeGeometry args={[21.8, 8.8]} />
                    <meshBasicMaterial color="#00f3ff" />
                </mesh>
                <Text position={[0, 1.5, 0.6]} fontSize={0.9} color="#06b6d4" fontWeight="black">BIENVENIDOS AL</Text>
                <Text position={[0, -0.5, 0.6]} fontSize={1.5} color="white" fontWeight="black" letterSpacing={0.1}>LOBBY PRINCIPAL</Text>
                <Text position={[0, -2.5, 0.6]} fontSize={0.6} color="white" fontWeight="bold" fillOpacity={0.6}>CLIC PARA ACCEDER</Text>

                {/* Volumetric Portal Glow */}
                <pointLight position={[0, 0, 5]} intensity={12} color="#06b6d4" distance={30} />
            </group>
        </group>
    )
}

// 5. Entertainment Zones
function EntertainmentZones({ sponsors }: { sponsors: any[] }) {
    const leftSponsor = sponsors && sponsors.length > 0 ? sponsors[0] : null
    const rightSponsor = sponsors && sponsors.length > 1 ? sponsors[1] : null

    return (
        <>
            {/* Live Arena (Left Side) - Moved to be more panoramic */}
            <group position={[-80, 0, 0]} rotation={[0, 0.5, 0]}>
                {/* Platform */}
                <mesh position={[0, 0.4, 0]}><boxGeometry args={[50, 0.8, 40]} /><meshStandardMaterial color="#020617" metalness={1} roughness={0} /></mesh>

                {/* Video Stage Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.45, 0]}>
                    <planeGeometry args={[45, 35]} />
                    <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
                </mesh>

                {/* Main Video Screen with YouTube Loop (via proxy or direct MP4 if available) */}
                <group position={[0, 15, -12]}>
                    <VideoScreen />
                    <Text position={[0, 12, 1]} fontSize={1.2} color="#06b6d4" fontWeight="black" letterSpacing={0.2}>LIVE STAGE</Text>
                    <pointLight position={[0, 0, 10]} intensity={15} color="#6366f1" distance={50} />
                </group>

                {/* Lateral Sponsor Pylons - MOVED WIDER AND BACK */}
                <group position={[-32, 12, -8]} rotation={[0, 0.6, 0]}>
                    <SponsorStand sponsor={leftSponsor} />
                </group>
                <group position={[32, 12, -8]} rotation={[0, -0.6, 0]}>
                    <SponsorStand sponsor={rightSponsor} />
                </group>
            </group>

            {/* Luxe Bar (Right Side) */}
            <group position={[85, 0, 0]} rotation={[0, -0.6, 0]}>
                {/* Circular Base */}
                <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[20, 22, 0.4, 64]} /><meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} /></mesh>

                {/* Infinity Ring Bar */}
                <mesh position={[0, 1.8, 0]}><torusGeometry args={[10, 0.8, 32, 100]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} /></mesh>

                {/* Atmospheric Bar Columns */}
                {[...Array(12)].map((_, i) => (
                    <group key={i} rotation={[0, (i * Math.PI * 2) / 12, 0]}>
                        <mesh position={[0, 15, 12]}>
                            <cylinderGeometry args={[0.05, 0.05, 30]} />
                            <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
                        </mesh>
                        <pointLight position={[0, 8, 12]} intensity={10} color="#fbbf24" distance={20} />
                    </group>
                ))}

                <Text position={[0, 8, 0]} fontSize={2.5} color="white" fontWeight="black" textAlign="center">AURORA{"\n"}SKY BAR</Text>
            </group>
        </>
    )
}

function VideoScreen() {
    // Note: In a real production app, we would use a proper HLS stream or a direct MP4 link.
    // For this demo, we'll use a placeholder video that looks like an event stream.
    const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-glitchy-screen-21443-large.mp4";
    const texture = useVideoTexture(videoUrl, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
    });

    return (
        <mesh>
            <planeGeometry args={[38, 22]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    );
}

function SponsorStand({ sponsor }: { sponsor: any }) {
    return (
        <group>
            <mesh>
                <planeGeometry args={[12, 22]} />
                <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
            </mesh>
            <SponsorImage url={sponsor?.image_url} />
            <mesh position={[0, 0, -0.2]}>
                <boxGeometry args={[12.5, 22.5, 0.3]} />
                <meshStandardMaterial color="#000" emissive="#06b6d4" emissiveIntensity={1} />
            </mesh>
            <pointLight position={[0, 0, 2]} intensity={5} color="#06b6d4" distance={15} />
        </group>
    )
}

// 6. Refined HUD-style Waypoints
function Waypoint({ position, target, label, onClick }: { position: [number, number, number], target: [number, number, number], label?: string, onClick: (pos: Vector3) => void }) {
    const [hovered, setHover] = useState(false)
    const ringRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += hovered ? 0.05 : 0.02
            const pulse = 1 + Math.sin(state.clock.elapsedTime * (hovered ? 10 : 4)) * 0.1
            ringRef.current.scale.set(pulse, pulse, pulse)
        }
    })

    return (
        <group position={position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
                onClick={(e) => { e.stopPropagation(); onClick(new Vector3(...target)) }}
            >
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* HUD Animation Ring */}
            <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.0, 1.2, 64]} />
                <meshBasicMaterial color={hovered ? "#fff" : "#06b6d4"} transparent opacity={0.9} />

                {/* Tech Crosshair lines */}
                {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
                    <mesh key={i} rotation={[0, 0, rot]} position={[1.4, 0, 0]}>
                        <planeGeometry args={[0.5, 0.08]} />
                        <meshBasicMaterial color="#fff" />
                    </mesh>
                ))}
            </group>

            {label && (
                <Billboard position={[0, 3.5, 0]}>
                    <Text
                        fontSize={0.8}
                        color="white"
                        fontWeight="black"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.08}
                        outlineColor="#020617"
                    >
                        {label.toUpperCase()}
                    </Text>
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[label.length * 0.55, 1.4]} />
                        <meshBasicMaterial color="#06b6d4" transparent opacity={hovered ? 0.8 : 0.3} />
                    </mesh>
                </Billboard>
            )}

            {/* Emissive Floor Glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                <circleGeometry args={[2.5, 32]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={hovered ? 0.4 : 0.15} />
            </mesh>
        </group>
    )
}

// --- MAIN SCENE ---
export default function LobbyScene({ sponsors = [] }: { sponsors?: any[] }) {
    const [targetPos, setTargetPos] = useState(new Vector3(0, CAMERA_HEIGHT, 50))

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#020617' }}>
            <Canvas
                camera={{ position: [0, CAMERA_HEIGHT, 50], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}
                shadows
            >
                <Suspense fallback={null}>
                    <CameraController targetPosition={targetPos} />

                    <ambientLight intensity={0.8} />
                    <pointLight position={[0, 100, 100]} intensity={20} color="#4f46e5" />
                    <Environment preset="night" />

                    {/* Ultimate Mirror Reflective Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                        <planeGeometry args={[3000, 3000]} />
                        <MeshReflectorMaterial
                            mirror={1}
                            blur={[300, 100]}
                            resolution={2048}
                            mixBlur={1}
                            mixStrength={80}
                            roughness={1}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#020617"
                            metalness={0.9}
                        />
                    </mesh>

                    <EliteBuilding />
                    <EntertainmentZones sponsors={sponsors} />
                    <CentralPark />
                    <ManhattanSkyline />

                    {/* Highly Visible Waypoints */}
                    {[
                        { pos: [0, 50], label: "Plaza Central" },
                        { pos: [0, 110], label: "Parque Lineal" },
                        { pos: [0, 170], label: "Mirador Manhattan" },
                        { pos: [0, -45], label: "Hacia el Lobby" },
                        { pos: [-45, 0], label: "Arena Escenario" },
                        { pos: [75, 0], label: "Aurora Sky Bar" }
                    ].map((wp, i) => (
                        <Waypoint
                            key={i}
                            position={[wp.pos[0], 0.2, wp.pos[1]] as [number, number, number]}
                            target={[wp.pos[0], CAMERA_HEIGHT, wp.pos[1]] as [number, number, number]}
                            label={wp.label}
                            onClick={(pos) => setTargetPos(pos)}
                        />
                    ))}

                    <Stars radius={400} depth={80} count={12000} factor={10} saturation={0} fade speed={1} />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
                        <Vignette darkness={1.2} offset={0.1} />
                        <ToneMapping />
                        <ChromaticAberration offset={new THREE.Vector2(0.0004, 0.0004)} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    )
}

function CameraController({ targetPosition }: { targetPosition: Vector3 }) {
    const controls = useRef<any>(null)
    const [isInitial, setIsInitial] = useState(true)

    useEffect(() => {
        if (controls.current) {
            // Adjust look direction based on position for a more cinematic feel
            const lookZ = targetPosition.z < 0 ? targetPosition.z - 60 : targetPosition.z + 100
            controls.current.setLookAt(
                targetPosition.x, targetPosition.y, targetPosition.z + 15, // Camera position (slightly back for better perspective)
                targetPosition.x, targetPosition.y, lookZ,                   // Look target
                !isInitial
            )
            if (isInitial) setIsInitial(false)
        }
    }, [targetPosition])

    return (
        <CameraControls
            ref={controls}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.85}
            azimuthRotateSpeed={-0.3}
            polarRotateSpeed={-0.3}
            // DOLLY ENABLED: This allows mouse scroll to zoom in/out
            dollySpeed={0.8}
            minDistance={0.5}
            maxDistance={80}
            mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 16 }} // wheel 16 = ACTION.DOLLY
            touches={{ one: 32, two: 512, three: 0 }}
            truckSpeed={0}
            dampingFactor={0.05}
        />
    )
}
