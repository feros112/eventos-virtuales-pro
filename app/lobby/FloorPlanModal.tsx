'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface FloorPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OVERVIEW_ZONES = [
    { id: 'auditorium', label: 'Auditorio Principal', path: '/auditorio', top: '22%', left: '38%', width: '18%', height: '22%' },
    { id: 'expo', label: 'Exhibit Hall', path: '/expo/hall', top: '28%', left: '58%', width: '25%', height: '35%' },
    { id: 'networking', label: 'Networking Lounge', path: '/networking', top: '52%', left: '46%', width: '12%', height: '18%' },
    { id: 'lobby', label: 'Plaza Central', path: '/lobby', top: '50%', left: '22%', width: '18%', height: '18%' },
]

const EXHIBIT_ZONES = [
    { id: 'booth1', label: 'Gold Sponsor 1', path: '/expo/hall?booth=1', top: '15%', left: '45%', width: '10%', height: '15%' },
    { id: 'booth2', label: 'Silver Sponsor 2', path: '/expo/hall?booth=2', top: '40%', left: '15%', width: '10%', height: '15%' },
    { id: 'booth3', label: 'Tech Partner 3', path: '/expo/hall?booth=3', top: '40%', left: '75%', width: '10%', height: '15%' },
]

export default function FloorPlanModal({ isOpen, onClose }: FloorPlanModalProps) {
    const [view, setView] = useState<'overview' | 'exhibit'>('overview');
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);

    if (!isOpen) return null;

    const currentZones = view === 'overview' ? OVERVIEW_ZONES : EXHIBIT_ZONES;
    const currentImage = view === 'overview' ? '/premium/floor-plan.png' : '/expo-exterior.png';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 6000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(12px)',
            padding: '2rem',
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1200px',
                aspectRatio: '16 / 9',
                backgroundColor: '#000',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'rgba(0,0,0,0.6)',
                        border: '2px solid white',
                        color: 'white',
                        padding: '0.4rem',
                        borderRadius: '0.5rem',
                        zIndex: 100,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'white', e.currentTarget.style.color = 'black')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)', e.currentTarget.style.color = 'white')}
                >
                    <X size={24} strokeWidth={3} />
                </button>

                {/* Hyper-real Map Section */}
                <div style={{ position: 'relative', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                    <Image
                        src={currentImage}
                        alt="Floor Plan"
                        fill
                        style={{ objectFit: 'cover', opacity: 0.9 }}
                    />

                    {/* Interactive Zones Overlay */}
                    {currentZones.map((zone) => (
                        <Link
                            key={zone.id}
                            href={zone.path}
                            onClick={onClose}
                            onMouseEnter={() => setHoveredZone(zone.id)}
                            onMouseLeave={() => setHoveredZone(null)}
                            style={{
                                position: 'absolute',
                                top: zone.top,
                                left: zone.left,
                                width: zone.width,
                                height: zone.height,
                                backgroundColor: hoveredZone === zone.id ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                                border: hoveredZone === zone.id ? '2px solid rgba(6, 182, 212, 0.8)' : '1px solid rgba(255,255,255,0.1)',
                                boxShadow: hoveredZone === zone.id ? '0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.2)' : 'none',
                                borderRadius: '1rem',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                backdropFilter: hoveredZone === zone.id ? 'blur(2px)' : 'none'
                            }}
                        >
                            <div style={{
                                color: 'white',
                                fontWeight: 900,
                                backgroundColor: hoveredZone === zone.id ? '#06b6d4' : 'rgba(0,0,0,0.7)',
                                padding: '0.6rem 1.5rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transform: hoveredZone === zone.id ? 'scale(1.05)' : 'scale(1)',
                                opacity: hoveredZone === zone.id ? 1 : 0.7,
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                boxShadow: hoveredZone === zone.id ? '0 10px 20px rgba(0,0,0,0.3)' : 'none'
                            }}>
                                {zone.label}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Navigation Bar Bottom */}
                <div style={{
                    height: '65px',
                    backgroundColor: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '0.5rem',
                        padding: '0.3rem',
                        gap: '0.5rem'
                    }}>
                        <button
                            onClick={() => setView('overview')}
                            style={{
                                background: view === 'overview' ? 'white' : 'transparent',
                                border: 'none',
                                color: view === 'overview' ? '#06b6d4' : 'white',
                                fontSize: '0.95rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                borderRadius: '0.3rem',
                                padding: '0.6rem 2rem',
                                transition: 'all 0.2s',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setView('exhibit')}
                            style={{
                                background: view === 'exhibit' ? 'white' : 'transparent',
                                border: 'none',
                                color: view === 'exhibit' ? '#06b6d4' : 'white',
                                fontSize: '0.95rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                borderRadius: '0.3rem',
                                padding: '0.6rem 2rem',
                                transition: 'all 0.2s',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Exhibit Hall
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
