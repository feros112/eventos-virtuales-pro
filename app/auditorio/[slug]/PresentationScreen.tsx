'use client'

import React, { useMemo } from 'react'
import { Image, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

interface PresentationScreenProps {
    slidesUrl: string
    currentSlide: number
    totalSlides: number
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
}

export default function PresentationScreen({
    slidesUrl,
    currentSlide,
    totalSlides,
    position = [15, 8, -12],
    rotation = [0, -0.4, 0],
    scale = [12, 6.75, 1]
}: PresentationScreenProps) {

    // Construct the actual image URL. 
    // If slidesUrl is something like "/slides/presentation1", 
    // we expect /slides/presentation1/slide_1.jpg
    const imageUrl = useMemo(() => {
        if (!slidesUrl) return '/premium/placeholder-slide.png'
        // Handle both full URLs and local paths
        const base = slidesUrl.endsWith('/') ? slidesUrl : `${slidesUrl}/`
        return `${base}slide_${currentSlide}.jpg`
    }, [slidesUrl, currentSlide])

    return (
        <group position={position} rotation={rotation}>
            {/* Screen Frame */}
            <mesh>
                <boxGeometry args={[1.05, 1.05, 0.05]} />
                <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.2} />
            </mesh>

            {/* Glowing Border */}
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[1.1, 1.1]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
            </mesh>

            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <Image
                    url={imageUrl}
                    scale={[1, 1]}
                    transparent
                    opacity={1}
                />
            </Float>

            {/* Slide Counter HUD */}
            <group position={[0, -0.6, 0.1]}>
                <mesh>
                    <planeGeometry args={[0.3, 0.08]} />
                    <meshBasicMaterial color="#000" transparent opacity={0.8} />
                </mesh>
                <Text
                    fontSize={0.04}
                    color="#00f3ff"
                    fontWeight="black"
                    position={[0, 0, 0.01]}
                >
                    {`SLIDE ${currentSlide} / ${totalSlides}`}
                </Text>
            </group>
        </group>
    )
}
