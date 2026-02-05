'use client'

import React, { useState } from 'react'
import { X, Image as ImageIcon, Cloud, Send } from 'lucide-react'
import Image from 'next/image'

interface Participant {
    id: string;
    name: string;
    company: string;
    avatar: string;
}

const MOCK_PARTICIPANTS: Participant[] = [
    { id: '1', name: 'Sandra Smith', company: 'GE Plastics', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
    { id: '2', name: 'Sherry Murphy', company: 'Acme Corporation', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop' },
    { id: '3', name: 'Scott Sottile', company: 'Initech', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop' },
    { id: '4', name: 'James J. Williamson', company: 'Massive Dynamic', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
    { id: '5', name: 'Julia P. Dunagan', company: 'Hooli', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop' },
    { id: '6', name: 'Pat Laroche', company: 'Soylent Corp', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972&auto=format&fit=crop' },
    { id: '7', name: 'Olive Wood', company: 'Globex', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1978&auto=format&fit=crop' },
    { id: '8', name: 'John Doe', company: 'GE Plastics', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2080&auto=format&fit=crop' },
]

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
    const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('participants');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '90px',
            right: '40px',
            width: '400px',
            height: '650px',
            zIndex: 8000,
            pointerEvents: 'auto',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #1e1b4b 100%)',
                    padding: '1.5rem 1rem 0.5rem 1rem',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={28} strokeWidth={3} />
                    </button>

                    {/* Decorative Horizontal handle */}
                    <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '2px', marginBottom: '1.2rem' }} />

                    {/* Tabs */}
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: '2rem' }}>
                        <button
                            onClick={() => setActiveTab('chat')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                opacity: activeTab === 'chat' ? 1 : 0.6,
                                paddingBottom: '0.5rem',
                                borderBottom: activeTab === 'chat' ? '3px solid white' : '3px solid transparent'
                            }}
                        >
                            EXPO CHAT
                        </button>
                        <button
                            onClick={() => setActiveTab('participants')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                opacity: activeTab === 'participants' ? 1 : 0.6,
                                paddingBottom: '0.5rem',
                                borderBottom: activeTab === 'participants' ? '3px solid white' : '3px solid transparent'
                            }}
                        >
                            PARTICIPANTS
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div style={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'white', padding: '1rem' }}>
                    {activeTab === 'participants' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {MOCK_PARTICIPANTS.map((person) => (
                                <div key={person.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        <Image src={person.avatar} alt={person.name} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#4b5563' }}>{person.name}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#111827' }}>{person.company}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: 700 }}>
                            Conversaciones del chat...
                        </div>
                    )}
                </div>

                {/* Bottom Input Section */}
                <div style={{ padding: '1.2rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flexGrow: 1, position: 'relative' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '2rem',
                                    border: '1px solid #d1d5db',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem', color: '#6b7280' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><ImageIcon size={22} /></button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><Cloud size={22} /></button>
                            <button style={{
                                background: '#06b6d4',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                            }}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
