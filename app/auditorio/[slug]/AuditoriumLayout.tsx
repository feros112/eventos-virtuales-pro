'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MessageSquare, Send, Users, Hand, MessageSquareOff, ChevronRight, ChevronLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ChatBox from '../ChatBox'
import ReactionOverlay from '../ReactionOverlay'
import PollsWidget from '../PollsWidget'
import MainStageExperience from './MainStageExperience'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '../../context/LanguageContext'

interface AuditoriumLayoutProps {
    streamUrl: string
    isLive: boolean
    userEmail: string
    userId: string
    streamTitle: string
    slidesUrl?: string
    currentSlide?: number
    totalSlides?: number
}

export default function AuditoriumLayout({
    streamUrl: initialStreamUrl,
    isLive: initialIsLive,
    userEmail,
    userId,
    streamTitle,
    slidesUrl: initialSlidesUrl = '',
    currentSlide: initialCurrentSlide = 1,
    totalSlides: initialTotalSlides = 1
}: AuditoriumLayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [handRaised, setHandRaised] = useState(false)
    const [streamUrl, setStreamUrl] = useState(initialStreamUrl)
    const [isLive, setIsLive] = useState(initialIsLive)
    const [viewerCount, setViewerCount] = useState(124) // Simulated for now

    // Slide State
    const [slidesUrl, setSlidesUrl] = useState(initialSlidesUrl)
    const [currentSlide, setCurrentSlide] = useState(initialCurrentSlide)
    const [totalSlides, setTotalSlides] = useState(initialTotalSlides)

    const { t } = useLanguage()
    const supabase = createClient()

    // 1. Real-time Subscription for Stream Config & Hand Raising
    useEffect(() => {
        // --- HAND RAISING LOGIC ---
        const checkHand = async () => {
            const { data } = await supabase
                .from('interaction_events')
                .select('*')
                .eq('user_id', userId)
                .eq('type', 'raise_hand')
                .eq('status', 'pending')
                .single()

            if (data) setHandRaised(true)
        }
        checkHand()

        const interactionChannel = supabase
            .channel('interaction_events_user')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'interaction_events', filter: `user_id=eq.${userId}` }, (payload) => {
                if (payload.new && 'status' in payload.new) {
                    if ((payload.new as any).status !== 'pending') setHandRaised(false)
                } else if (payload.eventType === 'DELETE') {
                    setHandRaised(false)
                }
            })
            .subscribe()

        // --- STREAM CONFIG REALTIME ---
        const streamChannel = supabase
            .channel('stream_updates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stream_config', filter: `stream_title=eq.${streamTitle}` }, (payload) => {
                const updated = payload.new as any
                if (updated.stream_url !== undefined) setStreamUrl(updated.stream_url)
                if (updated.is_live !== undefined) setIsLive(updated.is_live)

                // SLIDES SYNC
                if (updated.slides_url !== undefined) setSlidesUrl(updated.slides_url)
                if (updated.current_slide !== undefined) setCurrentSlide(updated.current_slide)
                if (updated.total_slides !== undefined) setTotalSlides(updated.total_slides)
            })
            .subscribe()

        // --- SIMULATED VIEWER COUNT ---
        const interval = setInterval(() => {
            setViewerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1))
        }, 5000)

        return () => {
            supabase.removeChannel(interactionChannel)
            supabase.removeChannel(streamChannel)
            clearInterval(interval)
        }
    }, [userId, supabase, streamTitle])


    // 2. Toggle Hand
    const toggleHand = async () => {
        if (handRaised) {
            setHandRaised(false)
            await supabase.from('interaction_events').delete().match({ user_id: userId, type: 'raise_hand', status: 'pending' })
        } else {
            setHandRaised(true)
            await supabase.from('interaction_events').insert({
                user_id: userId,
                type: 'raise_hand',
                status: 'pending',
                payload: { email: userEmail, timestamp: new Date().toISOString() }
            })
        }
    }

    // 3. Moderator Slide Sync
    const updateSlide = async (newSlide: number) => {
        if (newSlide < 1 || newSlide > totalSlides) return
        setCurrentSlide(newSlide)
        await supabase
            .from('stream_config')
            .update({ current_slide: newSlide })
            .eq('stream_title', streamTitle)
    }

    const isAdmin = userEmail.includes('@') // Simplified for now

    return (
        <div className="relative h-screen bg-[#020617] text-white overflow-hidden font-sans">

            {/* --- ATMOSPHERIC BACKGROUND (Behind 3D) --- */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <Image
                    src="/premium/auditorium.png"
                    alt="Atmosphere"
                    fill
                    style={{ objectFit: 'cover', opacity: 0.15 }}
                />
            </div>

            {/* --- 3D STAGE (Background) --- */}
            <div className={`absolute inset-0 z-0 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isChatOpen ? 'mr-[380px]' : 'mr-0'}`}>
                <MainStageExperience
                    streamUrl={streamUrl}
                    isLive={isLive}
                    slidesUrl={slidesUrl}
                    currentSlide={currentSlide}
                    totalSlides={totalSlides}
                />
            </div>

            {/* --- TOP NAVBAR (BeyondLive Design) --- */}
            <nav className="absolute top-0 left-0 right-0 h-24 z-20 flex justify-between items-center px-10 bg-slate-950/40 backdrop-blur-xl border-bottom border-white/5 shadow-2xl pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-8">
                    <Link
                        href="/lobby"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: 'white',
                            textDecoration: 'none',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            padding: '0.6rem 1.4rem',
                            borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        <ArrowLeft size={16} /> Lobby
                    </Link>

                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-white font-black text-2xl tracking-tighter uppercase italic drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
                            {streamTitle}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span style={{
                                backgroundColor: isLive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                border: `1px solid ${isLive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(100, 116, 139, 0.4)'}`,
                                color: isLive ? '#ef4444' : '#94a3b8',
                                padding: '0.15rem 0.6rem',
                                borderRadius: '0.4rem',
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}>
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: isLive ? '#ef4444' : '#94a3b8',
                                    animation: isLive ? 'pulse 2s infinite' : 'none'
                                }} />
                                {isLive ? 'LIVE' : 'WAITING'}
                            </span>
                            <span className="flex items-center gap-1.5 text-[0.65rem] font-black text-white/40 uppercase tracking-widest">
                                <Eye className="w-4 h-4" />
                                {viewerCount.toLocaleString()} ASISTIENDO
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-auto flex items-center gap-6">
                    {/* Hand Raise */}
                    <button
                        onClick={toggleHand}
                        style={{
                            backgroundColor: handRaised ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                            color: handRaised ? 'black' : 'white',
                            border: `1px solid ${handRaised ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                            padding: '0.75rem 1.8rem',
                            borderRadius: '2rem',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.3s',
                            boxShadow: handRaised ? '0 0 30px rgba(245,158,11,0.4)' : 'none'
                        }}
                    >
                        <Hand size={18} className={handRaised ? 'animate-bounce' : ''} />
                        {handRaised ? 'Petición Enviada' : 'Pedir Palabra'}
                    </button>

                    {/* Chat Toggle */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        style={{
                            backgroundColor: isChatOpen ? '#06b6d4' : 'rgba(255,255,255,0.05)',
                            color: isChatOpen ? 'black' : 'white',
                            border: `1px solid ${isChatOpen ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`,
                            padding: '0.75rem',
                            borderRadius: '1rem',
                            transition: 'all 0.3s',
                            boxShadow: isChatOpen ? '0 0 20px rgba(6,182,212,0.4)' : 'none'
                        }}
                    >
                        {isChatOpen ? <MessageSquareOff size={22} /> : <MessageSquare size={22} />}
                    </button>
                </div>
            </nav>

            {/* --- MODERATOR SLIDE CONTROLS --- */}
            {isAdmin && (
                <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-4">
                    <div className="bg-slate-950/80 backdrop-blur-2xl border border-cyan-500/30 p-4 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Control de Diapositivas</span>
                            <span className="text-white font-bold">{currentSlide} / {totalSlides}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateSlide(currentSlide - 1)}
                                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => updateSlide(currentSlide + 1)}
                                className="p-3 bg-cyan-500 text-black hover:bg-white transition-all rounded-xl"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- INTERACTION LAYERS --- */}
            <div className="pointer-events-none absolute inset-0 z-10">
                <ReactionOverlay roomId="main-auditorium" />
                <div className="absolute top-32 left-10 w-80 pointer-events-auto">
                    <PollsWidget userId={userId} roomId="main-auditorium" isAdmin={userEmail.includes('@')} />
                </div>
            </div>

            {/* --- CHAT DRAWER (Right Side) --- */}
            <div
                className={`
                    absolute top-0 right-0 bottom-0 
                    w-[380px] 
                    bg-slate-950/60 backdrop-blur-[40px] 
                    shadow-[-30px_0_60px_rgba(0,0,0,0.6)] 
                    z-30 
                    transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                    border-l border-white/5
                    ${isChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
                `}
            >
                <div className="h-full flex flex-col">
                    <ChatBox userEmail={userEmail} />
                </div>
            </div>

            {/* Mini Toggle when Chat is closed */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-4 bg-cyan-500 text-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-cyan-400 group"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>
            )}
        </div>
    )
}
