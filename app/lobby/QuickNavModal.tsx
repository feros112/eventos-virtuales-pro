'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface QuickNavModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_ITEMS = [
    { id: 'entrance', label: 'Grand Entrance', image: '/premium/entrance.png', path: '/lobby' },
    { id: 'theater', label: 'Breakout Theater', image: '/premium/theater.png', path: '/auditorio' },
    { id: 'networking', label: 'Networking Lounge', image: '/premium/networking.png', path: '/networking' },
    { id: 'exhibit', label: 'Exhibit Hall', image: '/premium/floor-plan.png', path: '/expo/hall' },
    { id: 'workshop', label: 'Design Workshop', image: '/monetization.png', path: '/networking' },
    { id: 'general', label: 'Main Plenum', image: '/beyond-live-hero.png', path: '/auditorio/general' },
    { id: 'welcome', label: 'VIP Welcome', image: '/hostesses.png', path: '/lobby' },
    { id: 'escape', label: 'X-Room Experience', image: '/streaming-4k.png', path: '/escape-room' },
]

export default function QuickNavModal({ isOpen, onClose }: QuickNavModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '2rem',
        }}>
            <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                width: '100%',
                maxWidth: '1100px',
                borderRadius: '2rem',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                {/* Header Section */}
                <div style={{
                    padding: '3rem 4rem 2rem 4rem',
                    background: 'linear-gradient(to bottom, rgba(6, 182, 212, 0.05), transparent)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{ width: '80px', height: '4px', backgroundColor: '#06b6d4', marginBottom: '1.5rem', borderRadius: '2px', boxShadow: '0 0 10px #06b6d4' }} />
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: 'white',
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '-0.02em',
                        fontFamily: 'Inter, sans-serif',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        Explore the <span style={{ color: '#06b6d4' }}>Campus</span> Phase
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem' }}>
                        Quick Navigation Terminal
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '2rem',
                        right: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '1rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 100
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                    }}
                >
                    <X size={28} strokeWidth={2.5} />
                </button>

                {/* Content Section (Grid) */}
                <div style={{
                    padding: '2rem 4rem 4rem 4rem',
                    flexGrow: 1,
                    overflowY: 'auto'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2.5rem',
                    }}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.id}
                                href={item.path}
                                onClick={onClose}
                                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                            >
                                <div style={{
                                    position: 'relative',
                                    aspectRatio: '16 / 9',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    backgroundColor: '#000'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-12px) scale(1.06)';
                                        e.currentTarget.style.boxShadow = '0 25px 40px -10px rgba(6, 182, 212, 0.4)';
                                        e.currentTarget.style.borderColor = '#06b6d4';
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                                        const img = e.currentTarget.querySelector('img');
                                        if (img) img.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        fill
                                        style={{ objectFit: 'cover', transition: 'transform 0.8s' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                                        pointerEvents: 'none'
                                    }} />

                                    {/* Subtle overlay accent */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        backgroundColor: '#06b6d4',
                                        opacity: 0,
                                        transition: 'opacity 0.3s'
                                    }} className="card-accent" />
                                </div>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 900,
                                    color: 'rgba(255,255,255,0.7)',
                                    textAlign: 'center',
                                    fontFamily: 'Inter, sans-serif',
                                    letterSpacing: '0.02em',
                                    transition: 'all 0.3s'
                                }}>
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                a:hover span {
                    color: white !important;
                    text-shadow: 0 0 10px rgba(255,255,255,0.3);
                }
                a:hover .card-accent {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    )
}
