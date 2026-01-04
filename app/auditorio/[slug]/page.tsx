import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquare, Send, Users, ThumbsUp, Clock } from 'lucide-react'
import Link from 'next/link'
import ChatBox from '../ChatBox'


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
            {/* Navbar Simplified */}
            <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <Link href="/lobby" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Lobby
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <span className="font-bold text-lg text-indigo-400">{config.stream_title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm">
                    {config.is_live ? (
                        <div className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            EN VIVO
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Clock className="w-4 h-4" />
                            ESPERANDO TRANSMISIÓN
                        </div>
                    )}

                    <span className="text-slate-500">|</span>
                    <div className="flex items-center gap-1 text-slate-400">
                        <Users className="w-4 h-4" />
                        1,245 Espectadores
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px-160px)] overflow-hidden">
                {/* Main Stage (Video) */}
                <div className="flex-1 bg-black flex flex-col relative group">
                    <div className="flex-1 relative w-full h-full flex items-center justify-center bg-black/90">
                        {config.is_live && config.stream_url ? (
                            config.stream_url.startsWith('<') ? (
                                <div
                                    className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>div]:w-full [&>div]:h-full"
                                    dangerouslySetInnerHTML={{ __html: config.stream_url }}
                                />
                            ) : (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={config.stream_url}
                                    title="Live Stream"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )
                        ) : (
                            // Offline State
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 animate-pulse">
                                    <Clock className="w-10 h-10 text-slate-500" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-white">Próximamente: {config.stream_title}</h2>
                                <p className="text-slate-400 max-w-md">
                                    La transmisión comenzará automáticamente en esta sala.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Chat & Engagement) */}
                <div className="w-full md:w-96 flex flex-col h-full bg-slate-900 border-l border-white/10 z-20">
                    <ChatBox userEmail={user.email!} />
                </div>
            </main>


        </div>
    )
}


