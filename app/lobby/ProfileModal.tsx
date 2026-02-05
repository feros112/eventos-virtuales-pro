'use client'

import React from 'react'
import { X, Edit2, FileText, ExternalLink, Award } from 'lucide-react'
import Image from 'next/image'

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
}

export default function ProfileModal({ isOpen, onClose, userProfile }: ProfileModalProps) {
    if (!isOpen) return null;

    const name = (!userProfile?.full_name || userProfile.full_name === 'Usuario Existente') ? 'Luis Fernando Osorio' : userProfile.full_name;
    const company = userProfile?.company || 'Iwebolutions';
    const avatar = userProfile?.avatar_url || '/user_avatar.jpg';

    return (
        <div style={{
            position: 'absolute',
            top: '90px',
            right: '40px',
            width: '380px',
            zIndex: 7000,
            pointerEvents: 'auto',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 20,
                        padding: '0.3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.4rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                >
                    <X size={22} color="#000" strokeWidth={3} />
                </button>

                {/* Top Header Section (Gradient) */}
                <div style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #1e1b4b 100%)',
                    padding: '2.5rem 2rem 1.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        border: '4px solid white',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
                    }}>
                        <Image src={avatar} alt="Profile" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>{name}</h3>
                    <p style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.9, marginBottom: '0.8rem' }}>{company}</p>

                    <button style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        padding: '0.4rem 1.2rem',
                        borderRadius: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        letterSpacing: '0.1em',
                        transition: 'background 0.2s'
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                    >
                        EDIT <Edit2 size={12} />
                    </button>
                </div>

                {/* Badges Section */}
                <div style={{ backgroundColor: '#1e293b', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#e2e8f0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.8rem', opacity: 0.6 }}>Badges Earned</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <Award size={32} color="#fbbf24" strokeWidth={1.5} />
                        <Award size={32} color="#06b6d4" strokeWidth={1.5} />
                        <Award size={32} color="#a78bfa" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Business Cards Section */}
                <div style={{ padding: '1.5rem', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1e1b4b' }}>My Business Cards</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#06b6d4', cursor: 'pointer' }}>View All</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <ContactCard initials="SO" name="Sebastian Osorio" company="COMPANY A" color="#0ea5e9" />
                        <ContactCard initials="BT" name="Bayron Torres" company="COMPANY B" color="#7c3aed" />
                    </div>
                </div>

                {/* Documents Section */}
                <div style={{ padding: '1.5rem', backgroundColor: '#312e81', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>My Documents</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22d3ee', cursor: 'pointer' }}>View All</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <FileText size={40} color="white" />
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>DOCUMENTS</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 700 }}>5 From Kronos</div>
                        </div>
                        <ExternalLink size={20} color="#22d3ee" style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContactCard({ initials, name, company, color }: { initials: string, name: string, company: string, color: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 900,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
                {initials}
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4b5563' }}>{name}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af' }}>{company}</div>
            </div>
        </div>
    );
}
