
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { clsx } from 'clsx'
import { Play, Radio } from 'lucide-react'

type StreamRoom = {
    id: number
    stream_title: string
    is_live: boolean
    slug: string
    thumbnail_url: string | null
}

export default function QuickNavigation({ rooms, currentSlug }: { rooms: StreamRoom[], currentSlug?: string }) {
    const router = useRouter()

    return (
        <div className="w-full bg-slate-900 border-t border-slate-800 p-6">
            <div className="max-w-[1920px] mx-auto">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                    En Vivo Ahora / Salas Disponibles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {rooms.map((room) => {
                        const isActive = currentSlug === room.slug

                        return (
                            <div
                                key={room.id}
                                onClick={() => router.push(`/auditorio/${room.slug}`)}
                                className={clsx(
                                    "group relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300",
                                    isActive
                                        ? "border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)] scale-[1.02]"
                                        : "border-transparent hover:border-slate-600 hover:scale-[1.02]"
                                )}
                            >
                                {/* Thumbnail Image */}
                                <div className="absolute inset-0 bg-slate-800">
                                    {room.thumbnail_url ? (
                                        <Image
                                            src={room.thumbnail_url}
                                            alt={room.stream_title}
                                            fill
                                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                            <Play className="w-12 h-12 text-slate-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    {room.is_live ? (
                                        <span className="flex items-center gap-1 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            LIVE
                                        </span>
                                    ) : (
                                        <span className="bg-slate-900/80 backdrop-blur-sm text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                                            OFFLINE
                                        </span>
                                    )}
                                </div>

                                {/* Title with Active Indicator */}
                                <div className="absolute bottom-0 left-0 w-full p-3">
                                    <p className={clsx(
                                        "font-bold text-sm leading-tight line-clamp-2",
                                        isActive ? "text-rose-400" : "text-white group-hover:text-rose-200"
                                    )}>
                                        {room.stream_title}
                                    </p>
                                    {isActive && (
                                        <p className="text-[10px] text-rose-500 font-bold mt-1 tracking-wide">
                                            VIENDO AHORA
                                        </p>
                                    )}
                                </div>

                                {/* Play Overlay on Hover */}
                                <div className={clsx(
                                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                                    isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                                )}>
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                                        <Play className="w-5 h-5 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
