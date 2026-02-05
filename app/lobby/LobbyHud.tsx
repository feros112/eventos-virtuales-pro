'use client'

import { useState, useEffect } from 'react'
import { Map, Compass, MessageCircle, LogOut } from 'lucide-react'
import Link from 'next/link'

interface LobbyHudProps {
    onOpenFloorPlan?: () => void;
    onOpenQuickNav?: () => void;
    onOpenAgenda?: () => void;
    onOpenProfile?: () => void;
    onOpenChat?: () => void;
    onSignOut?: () => void;
}

export default function LobbyHud({ onOpenFloorPlan, onOpenQuickNav, onOpenAgenda, onOpenProfile, onOpenChat, onSignOut }: LobbyHudProps) {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const navButtonStyle = {
        background: 'none',
        border: 'none',
        padding: '0.5rem 1.2rem',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 900,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        textTransform: 'uppercase' as const,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        letterSpacing: '0.1em',
    };

    const bottomNavStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '0.6rem 1.5rem',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderRadius: '2rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
    }

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', fontFamily: 'Inter, sans-serif', zIndex: 1000 }}>

            {/* --- TOP BAR --- */}
            <div style={{
                height: '80px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 3rem',
                pointerEvents: 'auto',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                {/* Event Logo & Back Link */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 1000, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        EXPO EVENTOS <span style={{ color: '#06b6d4', textShadow: '0 0 10px rgba(6,182,212,0.5)' }}>360 PRO</span>
                    </div>
                </Link>

                {/* Top Nav Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onOpenAgenda} style={navButtonStyle} className="hud-nav-btn">
                        Agenda
                    </button>
                    <button onClick={onOpenProfile} style={navButtonStyle} className="hud-nav-btn">
                        Profile
                    </button>
                    <button
                        onClick={onSignOut}
                        style={{ ...navButtonStyle, color: 'rgba(255,255,255,0.6)' }}
                        className="hud-nav-btn"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* --- BOTTOM BAR --- */}
            <div style={{
                height: '85px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 3rem',
                pointerEvents: 'auto',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
            }}>
                {/* Left: Quick Nav & Floor Plan */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={onOpenQuickNav} style={bottomNavStyle} className="hud-bottom-btn">
                        <Compass size={18} color="#06b6d4" />
                        Quick Nav
                    </button>
                    <button onClick={onOpenFloorPlan} style={bottomNavStyle} className="hud-bottom-btn">
                        <Map size={18} color="#06b6d4" />
                        Floor Plan
                    </button>
                </div>

                {/* Center: Platform Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.1rem', opacity: 0.8 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        IWEBOLUTIONS <span style={{ color: '#06b6d4' }}>PLATFORM</span>
                    </span>
                </Link>

                {/* Right: Chat */}
                <button
                    onClick={onOpenChat}
                    style={{
                        ...bottomNavStyle,
                        backgroundColor: '#06b6d4',
                        color: 'black',
                        border: 'none',
                        boxShadow: '0 0 20px rgba(6,182,212,0.3)'
                    }}
                    className="hud-chat-btn"
                >
                    Chat
                    <MessageCircle size={22} color="black" fill="black" />
                </button>
            </div>

            <style jsx>{`
                button {
                    transition: all 0.2s ease;
                }
                button:hover {
                    opacity: 0.7;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    )
}
