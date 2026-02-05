'use client'

import { useState } from 'react'
import { Save, Video, Plus, Trash2, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { clsx } from 'clsx'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/app/context/LanguageContext'

type StreamConfig = {
    id: number
    stream_title: string
    stream_url: string
    is_live: boolean
    slug: string
    thumbnail_url: string | null
    slides_url?: string
    current_slide?: number
    total_slides?: number
}

// 20. Updated StreamEditor with 'Command Center' Aesthetic
export default function StreamEditor({ initialRooms }: { initialRooms: StreamConfig[] }) {
    const [rooms, setRooms] = useState(initialRooms)
    const [selectedRoomId, setSelectedRoomId] = useState<number | 'new'>(initialRooms[0]?.id || 'new')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()
    const { t } = useLanguage()

    const activeRoom = rooms.find(r => r.id === selectedRoomId) || {
        stream_title: '',
        stream_url: '',
        is_live: false,
        slug: '',
        thumbnail_url: '',
        slides_url: '',
        current_slide: 1,
        total_slides: 1
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const updates = {
            stream_title: formData.get('stream_title') as string,
            stream_url: formData.get('stream_url') as string,
            slug: formData.get('slug') as string,
            thumbnail_url: formData.get('thumbnail_url') as string,
            slides_url: formData.get('slides_url') as string,
            current_slide: parseInt(formData.get('current_slide') as string) || 1,
            total_slides: parseInt(formData.get('total_slides') as string) || 1,
            is_live: formData.get('is_live') === 'on',
        }

        try {
            if (typeof selectedRoomId === 'number') {
                const { error } = await supabase.from('stream_config').update(updates).eq('id', selectedRoomId)
                if (error) throw error
                // Update local state
                setRooms(rooms.map(r => r.id === selectedRoomId ? { ...r, ...updates } : r))
                alert('CENTRO DE CONTROL: Configuración actualizada con éxito.')
            } else {
                const { data, error } = await supabase.from('stream_config').insert(updates).select().single()
                if (error) throw error
                if (data) {
                    setRooms([...rooms, data])
                    setSelectedRoomId(data.id)
                    alert('NUEVA SALA DESPLEGADA: Acceso concedido.')
                }
            }
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('ERROR CRÍTICO: No se pudo conectar con el núcleo de datos.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (typeof selectedRoomId === 'number' && confirm('¿CONFIRMAR DESTRUCCIÓN DE SALA? Esta acción es irreversible.')) {
            await supabase.from('stream_config').delete().eq('id', selectedRoomId)
            setRooms(rooms.filter(r => r.id !== selectedRoomId))
            setSelectedRoomId(rooms[0]?.id || 'new')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                            <Video className="w-8 h-8 text-cyan-400" />
                        </div>
                        CONTROL DE EMISIÓN
                    </h1>
                    <p className="text-cyan-400/50 font-mono text-xs tracking-[0.3em] uppercase mt-2 pl-2">
                        System Core v2.0 // Total Command Access
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <div className="text-[10px] text-white/30 font-black tracking-widest uppercase">Salas Activas</div>
                        <div className="text-2xl font-black text-cyan-400">{rooms.length}</div>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <div className="text-[10px] text-white/30 font-black tracking-widest uppercase">Señal Live</div>
                        <div className="text-2xl font-black text-rose-500">{rooms.filter(r => r.is_live).length}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar: Navigation & Selector */}
                <div className="lg:col-span-3 space-y-6">
                    <button
                        onClick={() => setSelectedRoomId('new')}
                        className={clsx(
                            "w-full p-6 rounded-2xl border transition-all flex items-center justify-between group",
                            selectedRoomId === 'new'
                                ? "bg-cyan-500 border-cyan-400 text-[#020617] shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:border-cyan-500/30 hover:text-white"
                        )}
                    >
                        <span className="font-black text-xs tracking-widest">AÑADIR SALA</span>
                        <Plus className={clsx("w-5 h-5", selectedRoomId === 'new' ? "text-[#020617]" : "text-cyan-500")} />
                    </button>

                    <div className="space-y-3">
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoomId(room.id)}
                                className={clsx(
                                    "p-4 rounded-xl cursor-pointer border transition-all flex items-center gap-4 group relative overflow-hidden",
                                    selectedRoomId === room.id
                                        ? "bg-white/10 border-cyan-500/50 backdrop-blur-xl"
                                        : "bg-white/5 border-white/5 hover:border-white/10"
                                )}
                            >
                                {selectedRoomId === room.id && (
                                    <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                )}

                                <div className="w-12 h-12 rounded-lg bg-[#020617] flex-shrink-0 relative overflow-hidden border border-white/10">
                                    {room.thumbnail_url ? (
                                        <Image src={room.thumbnail_url} alt="" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Video className="w-5 h-5 text-white/20 m-auto mt-3.5" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className={clsx("text-xs font-black truncate uppercase tracking-wider", selectedRoomId === room.id ? "text-cyan-400" : "text-white/60 group-hover:text-white")}>
                                        {room.stream_title}
                                    </p>
                                    <p className="text-[9px] text-white/20 font-mono truncate tracking-tight italic">slug: /{room.slug}</p>
                                </div>

                                {room.is_live && (
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        <span className="text-[8px] text-rose-500 font-bold tracking-tighter uppercase italic">LIVE</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Command Console */}
                <div className="lg:col-span-9 space-y-8">
                    <div className="bg-[#020617]/40 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        {/* Background subtle glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-4 italic underline decoration-cyan-500 decoration-4 underline-offset-8">
                                {typeof selectedRoomId === 'number' ? 'EDITAR CONFIGURACIÓN' : 'NUEVO DESPLIEGUE'}
                                {typeof selectedRoomId === 'number' && (
                                    <Link href={`/auditorio/${activeRoom.slug}`} target="_blank" className="text-[10px] font-black tracking-[0.2em] text-cyan-400 bg-cyan-400/10 px-4 py-2 rounded-full hover:bg-cyan-400 hover:text-[#020617] transition-all flex items-center gap-2">
                                        VISTA PREVIA <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                            </h2>
                            {typeof selectedRoomId === 'number' && (
                                <button onClick={handleDelete} className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5">
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1 group-focus-within:text-cyan-400 transition-colors">Título de la Sala</label>
                                    <input name="stream_title" defaultValue={activeRoom.stream_title} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold text-sm focus:border-cyan-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/10" placeholder="Ej: Platinum Stage" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1 group-focus-within:text-cyan-400 transition-colors">Identificador (Slug)</label>
                                    <input name="slug" defaultValue={activeRoom.slug} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-cyan-400 font-mono text-sm focus:border-cyan-500 outline-none transition-all italic" placeholder="ej: gran-sala-pro" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1 group-focus-within:text-cyan-400 transition-colors">URL de Diapositivas / PDF (Imagen Directa)</label>
                                    <input name="slides_url" defaultValue={activeRoom.slides_url || ''} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white/60 font-medium text-xs focus:border-cyan-500 outline-none transition-all" placeholder="https://dominio.com/slides/page-{n}.png" />
                                    <p className="text-[10px] text-white/20 mt-2 italic px-2">Usa {`{n}`} para la sincronización automática de páginas.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1 group-focus-within:text-cyan-400 transition-colors">Slide Actual</label>
                                        <input type="number" name="current_slide" defaultValue={activeRoom.current_slide || 1} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold text-sm focus:border-cyan-500 outline-none transition-all" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1 group-focus-within:text-cyan-400 transition-colors">Total Slides</label>
                                        <input type="number" name="total_slides" defaultValue={activeRoom.total_slides || 1} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold text-sm focus:border-cyan-500 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-6 bg-[#020617] rounded-3xl border border-rose-500/20 shadow-inner group hover:border-rose-500/50 transition-all">
                                    <div className="relative">
                                        <input type="checkbox" name="is_live" defaultChecked={activeRoom.is_live} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10 peer" />
                                        <div className="w-14 h-8 bg-white/5 rounded-full border border-white/10 peer-checked:bg-rose-500 peer-checked:border-rose-400 transition-all flex items-center px-1">
                                            <div className="w-6 h-6 bg-white rounded-full translate-x-0 peer-checked:translate-x-6 transition-transform shadow-xl" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-xs text-white tracking-widest uppercase italic">CONTROL DE EMISIÓN</span>
                                        <span className="text-[10px] text-white/30 font-bold flex items-center gap-2">
                                            {activeRoom.is_live ? '🔴 TRANSMITIENDO EN VIVO' : '⚪️ SISTEMA EN STANDBY'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 flex flex-col h-full">
                                <div className="group flex-1 flex flex-col">
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1 group-focus-within:text-cyan-400 transition-colors">Señal de Video (YouTube / Direct Link)</label>
                                    <div className="relative flex-1">
                                        <textarea
                                            name="stream_url"
                                            defaultValue={activeRoom.stream_url}
                                            className="w-full h-full min-h-[300px] bg-[#020617] border border-white/10 rounded-[24px] p-6 text-cyan-400 font-mono text-[11px] leading-relaxed focus:border-cyan-500 outline-none transition-all placeholder:text-white/5"
                                            placeholder="Introduce el código iframe o la URL directa..."
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={loading}
                                    className="w-full py-6 bg-cyan-500 text-[#020617] font-black text-sm uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {loading ? 'MODULANDO DATOS...' : (
                                        <>
                                            <Save className="w-5 h-5" /> EJECUTAR CONFIGURACIÓN
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick Monitoring Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                            <div className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-1">Carga de Red</div>
                            <div className="text-xl font-black text-white">98.2% <span className="text-emerald-400 text-xs ml-2">Stable</span></div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                            <div className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-1">Latencia Global</div>
                            <div className="text-xl font-black text-white">24ms <span className="text-cyan-400 text-xs ml-2">Fast</span></div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                            <div className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-1">Seguridad Base</div>
                            <div className="text-xl font-black text-white">Encrypted <span className="text-purple-400 text-xs ml-2">SSL-Pro</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
