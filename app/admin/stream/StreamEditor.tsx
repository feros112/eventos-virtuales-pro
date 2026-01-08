'use client'

import { useState } from 'react'
import { Save, Video, Plus, Trash2, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { clsx } from 'clsx'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/app/context/LanguageContext'

type StreamConfig = {
    id: number
    stream_title: string
    stream_url: string
    is_live: boolean
    slug: string
    thumbnail_url: string | null
}

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
        thumbnail_url: ''
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
            is_live: formData.get('is_live') === 'on',
        }

        try {
            if (typeof selectedRoomId === 'number') {
                await supabase.from('stream_config').update(updates).eq('id', selectedRoomId)
                alert(t.videoAdmin.successUpdate)
            } else {
                const { data, error } = await supabase.from('stream_config').insert(updates).select().single()
                if (error) throw error
                if (data) {
                    setRooms([...rooms, data])
                    setSelectedRoomId(data.id)
                    alert(t.common.success || 'Success')
                }
            }
            router.refresh()
        } catch (error) {
            console.error(error)
            alert(t.common.error || 'Error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (typeof selectedRoomId === 'number' && confirm(t.common.delete + '?')) {
            await supabase.from('stream_config').delete().eq('id', selectedRoomId)
            setRooms(rooms.filter(r => r.id !== selectedRoomId))
            setSelectedRoomId(rooms[0]?.id || 'new')
            router.refresh()
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                    <Video className="w-8 h-8 text-rose-500" /> {t.videoAdmin.title}
                </h1>
            </div>

            {/* Sidebar List */}
            <div className="lg:col-span-3 space-y-4">
                <button
                    onClick={() => setSelectedRoomId('new')}
                    className={clsx(
                        "w-full p-4 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all",
                        selectedRoomId === 'new'
                            ? "border-rose-500 bg-rose-500/10 text-rose-500 font-bold shadow-[0_0_15px_rgba(225,29,72,0.2)]"
                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-white"
                    )}
                >
                    <Plus className="w-5 h-5" /> {t.common.edit} / New
                </button>

                <div className="space-y-2">
                    {rooms.map(room => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={clsx(
                                "p-3 rounded-lg cursor-pointer border transition-all flex items-center gap-3",
                                selectedRoomId === room.id
                                    ? "bg-slate-800 border-rose-500 shadow-md"
                                    : "bg-slate-900 border-slate-800 hover:border-slate-600"
                            )}
                        >
                            <div className="w-10 h-10 rounded bg-slate-950 flex-shrink-0 relative overflow-hidden">
                                {room.thumbnail_url ? (
                                    <Image src={room.thumbnail_url} alt="" fill className="object-cover" />
                                ) : (
                                    <Video className="w-5 h-5 text-slate-600 m-auto mt-2.5" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className={clsx("text-sm font-bold truncate", selectedRoomId === room.id ? "text-white" : "text-slate-300")}>
                                    {room.stream_title}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono truncate">/{room.slug}</p>
                            </div>
                            {room.is_live && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor */}
            <div className="lg:col-span-9 space-y-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {typeof selectedRoomId === 'number' ? t.common.edit : t.common.save}
                            {typeof selectedRoomId === 'number' && (
                                <a href={`/auditorio/${activeRoom.slug}`} target="_blank" className="text-xs font-normal text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-full">
                                    Link <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </h2>
                        {typeof selectedRoomId === 'number' && (
                            <button onClick={handleDelete} className="text-slate-500 hover:text-red-500 transition-colors p-2">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{t.videoAdmin.streamTitle}</label>
                                <input name="stream_title" defaultValue={activeRoom.stream_title} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none" placeholder="e.g. Main Stage" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Slug (URL)</label>
                                <input name="slug" defaultValue={activeRoom.slug} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none font-mono text-sm" placeholder="e.g. main-stage" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Thumbnail (URL)</label>
                                <input name="thumbnail_url" defaultValue={activeRoom.thumbnail_url || ''} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none text-sm" placeholder="https://..." />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                                <input type="checkbox" name="is_live" defaultChecked={activeRoom.is_live} className="w-5 h-5 accent-rose-500" />
                                <span className="font-bold text-sm">🔴 {t.videoAdmin.isLive}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{t.videoAdmin.streamUrl}</label>
                                <textarea name="stream_url" defaultValue={activeRoom.stream_url} className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-rose-500 outline-none font-mono text-xs" placeholder="<iframe...>" />
                            </div>
                            <button disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-colors">
                                {loading ? t.common.loading : t.common.save}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
