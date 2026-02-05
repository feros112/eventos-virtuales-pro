'use client'

import React, { useState, useEffect } from 'react'
import { X, MousePointer2, Move, ZoomIn, Hand, Mouse, Scan, Target, MousePointerSquareDashed } from 'lucide-react'

export default function NavigationInstructions() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const hasSeenInstructions = sessionStorage.getItem('hasSeenNavInstructions')
        if (!hasSeenInstructions) {
            setIsVisible(true)
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('hasSeenNavInstructions', 'true')
    }

    if (!isVisible) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 6, 23, 0.95)',
            backdropFilter: 'blur(25px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem'
        }}>
            {/* Background Decorative Glows */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', zIndex: -1 }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', zIndex: -1 }} />

            {/* Header Area */}
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '-0.05em', margin: 0, fontStyle: 'italic', textShadow: '0 0 40px rgba(6,182,212,0.4)' }}>
                    GUÍA DE <span style={{ color: '#06b6d4' }}>INTERACCIÓN</span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ width: '3rem', height: '2px', background: 'linear-gradient(90deg, transparent, #06b6d4)' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', color: 'rgba(255,255,255,0.4)' }}>SISTEMA_DE_NAVEGACIÓN_3D</span>
                    <div style={{ width: '3rem', height: '2px', background: 'linear-gradient(90deg, #06b6d4, transparent)' }} />
                </div>
            </div>

            {/* Close Button UI */}
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '3rem',
                    right: '4rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                }}
            >
                <X size={32} strokeWidth={1.5} />
            </button>

            <div style={{ maxWidth: '1400px', width: '100%', display: 'flex', gap: '4rem' }}>

                {/* Mobile Section */}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4rem', padding: '4rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem' }}>INTERFAZ MÓVIL</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', textAlign: 'left' }}>
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(6,182,212,0.1)' }}>
                                <Hand size={40} color="#06b6d4" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>DESLIZAR</h4>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Toca y arrastra para <br />explorar el entorno 360°.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', textAlign: 'left' }}>
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Target size={40} color="#06b6d4" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>TRASLADARSE</h4>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Toca los nodos del suelo <br />para teletransportarte.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', textAlign: 'left' }}>
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ZoomIn size={40} color="#06b6d4" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>INCREMENTAR</h4>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Usa dos dedos para <br />acercar o alejar la vista.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PC Section */}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4rem', padding: '4rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5em', marginBottom: '4rem' }}>TERMINAL PC</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', textAlign: 'left' }}>
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(99,102,241,0.1)' }}>
                                <Mouse size={40} color="#6366f1" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>ROTACIÓN</h4>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Click izquierdo y arrastrar <br />para rotar la cámara.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', textAlign: 'left' }}>
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MousePointerSquareDashed size={40} color="#6366f1" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>INTERACCIÓN</h4>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Click en elementos y suelo <br />para navegar el espacio.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', textAlign: 'left' }}>
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Scan size={40} color="#6366f1" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>FOCO EXTERNO</h4>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Usa la rueda central para <br />hacer zoom dinámico.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Tip */}
            <div style={{ marginTop: '5rem', backgroundColor: '#06b6d4', color: 'black', padding: '1rem 3rem', borderRadius: '3rem', fontSize: '0.7rem', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                EXPERIENCIA OPTIMIZADA POR EVENTOS VIRTUALES PRO
            </div>

            <style jsx>{`
                button:hover {
                    background: rgba(255,255,255,0.1) !important;
                    transform: rotate(90deg);
                }
            `}</style>
        </div>
    )
}
