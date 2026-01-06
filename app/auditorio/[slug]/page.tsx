import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquare, Send, Users, ThumbsUp, Clock } from 'lucide-react'
import Link from 'next/link'
import ChatBox from '../ChatBox'
import MainStageExperience from './MainStageExperience'


export default async function AuditorioPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Current Room Configuration by Slug
    const { data: config } = await supabase
        .from('stream_config')
        .select('*')
        .eq('slug', slug)
        .single()

    // 2. Fetch All Rooms for Quick Navigation
    const { data: rooms } = await supabase
        .from('stream_config')
        .select('*')
        .order('id', { ascending: true })

    // Handle 404 if room not found
    if (!config) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col">
                <h1 className="text-4xl font-bold mb-4">Sala no encontrada</h1>
                <Link href="/auditorio" className="text-rose-500 hover:underline">Volver al escenario principal</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Navbar Simplified (Responsive) */}
            <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <Link href="/lobby" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Volver al Lobby</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10 hidden sm:block" />
                    <span className="font-bold text-sm md:text-lg text-indigo-400 truncate max-w-[150px] md:max-w-none">{config.stream_title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm">
                    {config.is_live ? (
                        <div className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="hidden sm:inline">EN VIVO</span>
                            <span className="sm:hidden">LIVE</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Clock className="w-4 h-4" />
                            <span className="hidden sm:inline">ESPERANDO</span>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-1 flex flex-col md:flex-row h-[0px] min-h-[calc(100vh-60px)]">
                {/* Main Stage (3D Experience) */}
                <div className="w-full h-[40vh] md:h-auto md:flex-1 bg-black flex flex-col relative group overflow-hidden">
                    <MainStageExperience streamUrl={config.stream_url} isLive={config.is_live} />
                </div>

                {/* Sidebar (Chat & Engagement) */}
                <div className="flex-1 md:flex-none w-full md:w-96 flex flex-col bg-slate-900 border-l border-white/10 z-20 min-h-[400px]">
                    <ChatBox userEmail={user.email!} />
                </div>
            </main>


        </div>
    )
}


