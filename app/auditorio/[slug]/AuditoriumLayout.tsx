'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MessageSquare, Send, Users, Hand, MessageSquareOff, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
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
}

export default function AuditoriumLayout({ streamUrl, isLive, userEmail, userId, streamTitle }: AuditoriumLayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [handRaised, setHandRaised] = useState(false)
    const { t } = useLanguage()
    const supabase = createClient()

    // 1. Check Initial State & Realtime Subscription
    useEffect(() => {
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

        const channel = supabase
            .channel('interaction_events_user')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'interaction_events', filter: `user_id=eq.${userId}` }, (payload) => {
                if (payload.new && 'status' in payload.new) {
                    if ((payload.new as any).status !== 'pending') setHandRaised(false)
                } else if (payload.eventType === 'DELETE') {
                    setHandRaised(false)
                }
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId, supabase])


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



    return (
        <div className="relative h-screen bg-slate-900 text-slate-900 overflow-hidden font-sans">
            {/* --- 3D STAGE (Background) --- */}
            <div className={`absolute inset-0 z-0 transition-all duration-500 ease-in-out ${isChatOpen ? 'mr-[350px]' : 'mr-0'}`}>
                <MainStageExperience streamUrl={streamUrl} isLive={isLive} />
            </div>

            {/* --- TOP NAVBAR (Glassmorphism) --- */}
            <nav className="absolute top-0 left-0 right-0 h-16 z-20 flex justify-between items-center px-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-4">
                    <Link
                        href="/lobby"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Lobby</span>
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg leading-none shadow-black drop-shadow-md">{streamTitle}</span>
                        <span className="text-red-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            En Vivo
                        </span>
                    </div>
                </div>

                <div className="pointer-events-auto flex items-center gap-3">
                    {/* Hand Raise */}
                    <button
                        onClick={toggleHand}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all backdrop-blur-md border ${handRaised ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
                    >
                        <Hand className="w-4 h-4" />
                        {handRaised ? 'Mano Levantada' : 'Levantar Mano'}
                    </button>

                    {/* Chat Toggle */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-2.5 rounded-full transition-all backdrop-blur-md border ${isChatOpen ? 'bg-white text-indigo-900 border-white shadow-lg' : 'bg-black/30 text-white border-white/10 hover:bg-black/50'}`}
                    >
                        {isChatOpen ? <MessageSquareOff className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* --- INTERACTION LAYERS --- */}
            <div className="pointer-events-none absolute inset-0 z-10">
                <ReactionOverlay roomId="main-auditorium" />
                <div className="absolute top-20 left-6 w-80 pointer-events-auto">
                    <PollsWidget userId={userId} roomId="main-auditorium" isAdmin={userEmail.includes('@')} />
                </div>
            </div>

            {/* --- CHAT DRAWER (Right Side) --- */}
            <div
                className={`
                    absolute top-0 right-0 bottom-0
                    w-[350px]
                    bg-white
                    shadow-[-10px_0_30px_rgba(0,0,0,0.1)]
                    z-30
                    transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                    border-l border-slate-100
                    ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <ChatBox userEmail={userEmail} />
            </div>
        </div>
    )
}
