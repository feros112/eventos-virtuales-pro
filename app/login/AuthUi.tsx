'use client'

import { login } from './actions'
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthUi({ message }: { message?: string }) {
    const { t } = useLanguage()

    return (
        <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' }}>

            {/* Background - Fixed */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Image
                    src="/luxury-hall.png"
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover', opacity: 0.25 }}
                    priority
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #020617 0%, transparent 50%, #020617 100%)' }} />
            </div>

            {/* Left Section (Visual) - Redesigned for better symmetry and form */}
            <div style={{ position: 'relative', flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10% 8%', zIndex: 10 }} className="hidden lg:flex">
                <div style={{ maxWidth: '700px' }}>

                    {/* Top Label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
                        <div style={{ width: '5rem', height: '2px', backgroundColor: '#06b6d4' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShieldCheck size={18} style={{ color: '#06b6d4' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.5em' }}>
                                SEGURIDAD_DE_ACCESO
                            </span>
                        </div>
                    </div>

                    {/* Main Title - Better spacing and alignment */}
                    <h2 style={{ fontSize: '10rem', fontWeight: 1000, lineHeight: 0.8, letterSpacing: '-0.07em', textTransform: 'uppercase', margin: 0 }}>
                        ACCESO <br />
                        <span style={{ color: '#22d3ee', textShadow: '0 0 40px rgba(6,182,212,0.3)' }}>PRO.</span>
                    </h2>

                    {/* Decorative description to give "form" */}
                    <div style={{ marginTop: '4rem', padding: '2.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', borderRadius: '0 2rem 2rem 0' }}>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', lineHeight: 1.6, margin: 0 }}>
                            Bienvenido a la terminal de control. <br />
                            Tu experiencia 3D comienza aquí.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section (Form) */}
            <div style={{ position: 'relative', flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', zIndex: 20, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(50px)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '100%', maxWidth: '460px' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                            <div style={{ width: '0.6rem', height: '3rem', backgroundColor: '#06b6d4', borderRadius: '1rem', boxShadow: '0 0 20px #06b6d4' }} />
                            <h1 style={{ fontSize: '3rem', fontWeight: 1000, textTransform: 'uppercase', margin: 0, letterSpacing: '-0.03em' }}>ENTRAR</h1>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em' }}>TERMINAL DE IDENTIFICACIÓN</p>
                    </div>

                    {/* Alert */}
                    {message && (
                        <div style={{ marginBottom: '3.5rem', padding: '2rem', backgroundColor: 'rgba(244,63,94,0.1)', border: '2px solid rgba(244,63,94,0.3)', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Zap style={{ color: '#f43f5e' }} />
                            <div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#f43f5e', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>FALLO DE ACCESO</span>
                                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{message}</span>
                            </div>
                        </div>
                    )}

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.5)' }}>CORREO ELECTRÓNICO</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', padding: '1.6rem', borderRadius: '1.8rem', color: 'white', fontSize: '1.2rem', fontWeight: 800, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                                    placeholder="USUARIO@EMPRESA.COM"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.5)' }}>CLAVE SECRETA</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', padding: '1.6rem', borderRadius: '1.8rem', color: 'white', fontSize: '1.2rem', fontWeight: 800, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            formAction={login}
                            style={{ padding: '2rem', backgroundColor: '#06b6d4', color: 'black', fontWeight: 1000, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.6em', borderRadius: '2.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', boxShadow: '0 20px 50px rgba(6,182,212,0.4)', transition: 'all 0.3s' }}
                        >
                            INGRESAR <ArrowRight />
                        </button>

                        <Link
                            href="/"
                            style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.2em', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}
                        >
                            ¿No tienes cuenta? <span style={{ color: 'white', textDecoration: 'underline', textUnderlineOffset: '8px' }}>Regístrate gratis</span>
                        </Link>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .hidden { display: none; }
                input:focus { border-color: #06b6d4 !important; background: rgba(6,182,212,0.05) !important; }
                button:hover { background-color: white !important; transform: translateY(-3px); box-shadow: 0 30px 60px rgba(255,255,255,0.2) !important; }
                @media (min-width: 1024px) { .lg\\:flex { display: flex; } }
            `}</style>
        </div>
    )
}
