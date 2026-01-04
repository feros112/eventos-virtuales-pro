
'use client'

import dynamic from 'next/dynamic'

// Dynamically import Experience with SSR disabled to prevent window/webgl errors
const Experience = dynamic(() => import('./Experience'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="text-indigo-500 font-bold animate-pulse">Cargando Metaverso...</div>
        </div>
    )
})

import QuickNavigation from '../auditorio/QuickNavigation'

export default function LobbyClientWrapper({ userEmail, profile, signOutAction, rooms }: any) {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* 3D Scene */}
            <Experience />

            {/* UI Overlay: Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-lg">
                        EVENTOS VIRTUALES <span className="text-rose-500">PRO</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">
                        ● Vista 3D Inmersiva // Beta
                    </p>
                </div>

                <div className="pointer-events-auto flex flex-col items-end gap-2">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                            {userEmail?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-white leading-tight">{profile?.full_name || 'Participante'}</p>
                            <p className="text-[10px] text-rose-300 font-mono">ID: {profile?.id?.substring(0, 4)}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOutAction()}
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors bg-black/40 px-3 py-1 rounded-full border border-white/10 hover:bg-red-500/20 hover:border-red-500/50"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* UI Overlay: Quick Navigation (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-auto">
                <div className="bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-6 px-6">
                    <QuickNavigation rooms={rooms} />
                </div>
            </div>

            {/* Instruction Hint */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono pointer-events-none animate-pulse">
                Arrastra para mirar alrededor • Click para entrar
            </div>
        </div>
    )
}
