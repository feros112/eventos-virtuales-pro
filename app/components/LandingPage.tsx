'use client'

import { ArrowRight, Sparkles, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signup } from '@/app/login/actions'

export default function LandingPage() {
    return (
        <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', position: 'relative', overflowX: 'hidden', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>

            {/* --- CAPA DE FONDO --- */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <Image
                    src="/luxury-hall.png"
                    alt="Fondo Elite"
                    fill
                    style={{ objectFit: 'cover', opacity: 0.25 }}
                    priority
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #020617, transparent, #020617)' }} />
            </div>

            {/* --- CAPA DE CONTENIDO --- */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* Navegación Super-Premium */}
                <header style={{ width: '100%', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '0.6rem', height: '2.5rem', backgroundColor: '#06b6d4', borderRadius: '1rem', boxShadow: '0 0 30px #06b6d4' }} />
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
                            EVENTOS VIRTUALES <span style={{ color: '#22d3ee' }}>PRO</span>
                        </h1>
                    </div>
                    <Link
                        href="/login"
                        style={{ padding: '0.8rem 2.5rem', backgroundColor: '#06b6d4', color: 'black', borderRadius: '3rem', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 10px 30px rgba(6,182,212,0.3)' }}
                    >
                        ENTRAR <LogIn size={18} />
                    </Link>
                </header>

                {/* Sección Hero con Registro Grid */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '5rem', padding: '5rem 2rem', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

                    {/* IZQUIERDA: Marca e Impacto */}
                    <div style={{ flex: 1, textAlign: 'left', minWidth: '0' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1.8rem', backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.4)', color: '#22d3ee', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.45em', borderRadius: '3rem', marginBottom: '3rem' }}>
                            <Sparkles size={16} /> DISEÑO INMERSIVO ELITE
                        </div>

                        <h1 style={{ fontSize: 'clamp(4rem, 10vw, 10rem)', fontWeight: 1000, lineHeight: 0.8, letterSpacing: '-0.07em', textTransform: 'uppercase', margin: '0 0 3.5rem 0', color: 'white', textShadow: '0 0 40px rgba(255,255,255,0.05)' }}>
                            EL FUTURO <br />
                            <span style={{ color: '#22d3ee', textShadow: '0 0 60px rgba(6,182,212,0.5)' }}>ES HOY.</span>
                        </h1>

                        <div style={{ padding: '3rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(40px)', borderLeft: '10px solid #06b6d4', borderRadius: '0 3rem 3rem 0', maxWidth: '650px', boxShadow: '20px 20px 60px rgba(0,0,0,0.5)' }}>
                            <p style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem', margin: 0 }}>
                                REINVENTA TÚ REALIDAD.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.7, margin: 0 }}>
                                Crea experiencias que nadie olvidará. Nuestra plataforma 3D redefine la conexión humana en el mundo digital para empresas de alta gama.
                            </p>
                        </div>
                    </div>

                    {/* DERECHA: Tarjeta de Registro (Corregida) */}
                    <div style={{ width: '100%', maxWidth: '540px', flexShrink: 0 }}>
                        <div style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(60px)', border: '1.5px solid rgba(255,255,255,0.1)', padding: '4rem 3.5rem', borderRadius: '4.5rem', boxShadow: '0 80px 160px rgba(0,0,0,1)', boxSizing: 'border-box' }}>

                            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                                <h2 style={{ fontSize: '3.2rem', fontWeight: 1000, textTransform: 'uppercase', letterSpacing: '-0.05em', fontStyle: 'italic', margin: '0 0 0.7rem 0', color: 'white' }}>REGISTRO GRATIS</h2>
                                <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.45em', margin: 0 }}>PASAPORTE DIGITAL ACTIVO</p>
                            </div>

                            <form style={{ display: 'grid', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>

                                {/* FILA DE NOMBRE Y APELLIDO - GRID REFORZADO */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', width: '100%', boxSizing: 'border-box' }}>
                                    <input
                                        name="first_name"
                                        required
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', padding: '1.6rem', borderRadius: '1.8rem', fontSize: '1rem', fontWeight: 800, color: 'white', boxSizing: 'border-box', outline: 'none' }}
                                        placeholder="NOMBRE"
                                    />
                                    <input
                                        name="last_name"
                                        required
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', padding: '1.6rem', borderRadius: '1.8rem', fontSize: '1rem', fontWeight: 800, color: 'white', boxSizing: 'border-box', outline: 'none' }}
                                        placeholder="APELLIDO"
                                    />
                                </div>

                                <input
                                    name="email"
                                    type="email"
                                    required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', padding: '1.6rem', borderRadius: '1.8rem', fontSize: '1rem', fontWeight: 800, color: 'white', boxSizing: 'border-box', outline: 'none' }}
                                    placeholder="CORREO ELECTRÓNICO ELECTRÓNICO"
                                />

                                <input
                                    name="password"
                                    type="password"
                                    required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)', padding: '1.6rem', borderRadius: '1.8rem', fontSize: '1rem', fontWeight: 800, color: 'white', boxSizing: 'border-box', outline: 'none' }}
                                    placeholder="CLAVE DE SEGURIDAD"
                                />

                                <button
                                    formAction={signup}
                                    style={{ width: '100%', padding: '1.8rem', marginTop: '1.5rem', backgroundColor: '#06b6d4', color: 'black', fontWeight: 1000, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.5em', borderRadius: '2.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 25px 50px rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxSizing: 'border-box', transition: 'all 0.3s' }}
                                >
                                    INGRESAR <UserPlus size={24} />
                                </button>
                            </form>

                            <div style={{ marginTop: '3.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem' }}>
                                <Link href="/login" style={{ fontSize: '0.8rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.2em' }}>
                                    ¿Ya tienes cuenta? <span style={{ color: 'white', textDecoration: 'underline', textUnderlineOffset: '8px' }}>Login aquí</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            <style jsx>{`
                input:focus {
                    border-color: #06b6d4 !important;
                    background-color: rgba(6,182,212,0.1) !important;
                }
                button:hover {
                    background-color: white !important;
                    box-shadow: 0 30px 60px rgba(255,255,255,0.2) !important;
                    transform: translateY(-3px);
                }
                button:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    )
}
