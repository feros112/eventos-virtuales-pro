'use client'

import { useState } from 'react'
import { ArrowLeft, MessageSquare, Send, Users, Hand, MessageSquareOff, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import ChatBox from '../ChatBox'
import MainStageExperience from './MainStageExperience'

interface AuditoriumLayoutProps {
    streamUrl: string
    isLive: boolean
    userEmail: string
    streamTitle: string
}

export default function AuditoriumLayout({ streamUrl, isLive, userEmail, streamTitle }: AuditoriumLayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [handRaised, setHandRaised] = useState(false)

    // Toggle Hand (Mock function for now, connect to DB later)
    const toggleHand = () => {
        setHandRaised(!handRaised)
        // TODO: Send signal to Supabase 'interaction_events'
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
            {/* Navbar (Client Header) */}
            <nav className="h-[60px] border-b border-white/10 bg-black/40 backdrop-blur-md px-4 flex justify-between items-center z-50 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/lobby" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Lobby</span>
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <span className="font-bold text-indigo-400 text-sm md:text-base truncate max-w-[200px]">{streamTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Raise Hand Button */}
                    <button
                        onClick={toggleHand}
                        className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${handRaised ? 'bg-amber-500 text-black animate-pulse' : 'bg-white/10 hover:bg-white/20 text-slate-300'}`}
                    >
                        <Hand className="w-3 h-3" />
                        {handRaised ? 'TU MANO LEVANTADA' : 'PEDIR LA PALABRA'}
                    </button>

                    {/* Toggle Chat Button */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-2 rounded-lg transition-colors ${isChatOpen ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        title={isChatOpen ? "Ocultar Chat" : "Mostrar Chat"}
                    >
                        {isChatOpen ? <MessageSquareOff className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </button>
                </div>
            </nav>

            <main className="flex-1 flex relative overflow-hidden">
                {/* Main Stage (3D) - Auto resizes with flex */}
                <div className={`transition-all duration-300 relative ${isChatOpen ? 'w-full md:w-[calc(100%-350px)]' : 'w-full'} h-full bg-black`}>
                    <MainStageExperience streamUrl={streamUrl} isLive={isLive} />

                    {/* Mobile Floating Controls */}
                    {!isChatOpen && (
                        <div className="absolute top-4 right-4 z-40 md:hidden">
                            <div className="bg-black/50 backdrop-blur text-xs px-2 py-1 rounded border border-white/10">
                                Stage Only Mode
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Chat) - Collapsible */}
                <div
                    className={`
                        fixed md:relative top-[60px] md:top-0 right-0 bottom-0 
                        w-[85vw] md:w-[350px] 
                        bg-slate-900 border-l border-white/10 z-30
                        transform transition-transform duration-300 ease-in-out
                        ${isChatOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
                    `}
                >
                    <ChatBox userEmail={userEmail} />
                </div>
            </main>
        </div>
    )
}
