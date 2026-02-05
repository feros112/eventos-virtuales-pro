'use client'

import React from 'react'
import { X, Mouse, Move, ZoomIn, Hand, GripHorizontal, Maximize } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function InstructionsOverlay({ onClose }: { onClose: () => void }) {
    const { t } = useLanguage()

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm p-4 animate-in fade-in duration-500">
            {/* Close Button Top Right */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white hover:text-indigo-400 p-2 transition-colors z-[110]"
            >
                <X className="w-10 h-10 stroke-[3px]" />
            </button>

            <div className="max-w-7xl w-full flex flex-col gap-12">

                {/* --- MOBILE NAVIGATION (TOP ROW) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-start">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">{t.lobby.instructions.lookTouch}</div>
                        <div className="relative w-32 h-20 border-2 border-white/20 rounded-xl flex items-center justify-center bg-white/5">
                            <Hand className="w-12 h-12 stroke-[1.5px] animate-bounce-horizontal" />
                            <div className="absolute inset-0 flex items-center justify-between px-2">
                                <div className="w-1 h-8 bg-white/20 rounded-full" />
                                <div className="w-1 h-8 bg-white/20 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">{t.lobby.instructions.moveTouch}</div>
                        <div className="relative w-32 h-20 border-2 border-white/20 rounded-xl flex items-center justify-center bg-white/5">
                            <GripHorizontal className="w-12 h-12 stroke-[1.5px]" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">{t.lobby.instructions.zoomTouch}</div>
                        <div className="relative w-32 h-20 border-2 border-white/20 rounded-xl flex items-center justify-center bg-white/5">
                            <Maximize className="w-12 h-12 stroke-[1.5px] animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* --- CENTER DIVIDER LABEL --- */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-full h-px bg-white/10" />
                    <span className="relative z-10 bg-black/80 px-6 py-2 rounded-full text-xs font-black tracking-[0.5em] uppercase border border-white/10">{t.lobby.instructions.mobileTitle}</span>
                </div>

                {/* --- MOUSE NAVIGATION (BOTTOM ROW) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-start">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">{t.lobby.instructions.lookClick}</div>
                        <div className="relative w-32 h-20 flex items-center justify-center">
                            <div className="relative">
                                <Mouse className="w-14 h-14 stroke-[1.5px]" />
                                <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 px-2">
                                    <div className="w-4 h-0.5 bg-white/40" />
                                </div>
                                <div className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 px-2">
                                    <div className="w-4 h-0.5 bg-white/40" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">{t.lobby.instructions.moveClick}</div>
                        <div className="relative w-32 h-20 flex items-center justify-center">
                            <div className="relative">
                                <Mouse className="w-14 h-14 stroke-[1.5px]" />
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-2">
                                    <div className="w-3 h-3 border-t-2 border-r-2 border-white/40 rotate-[135deg]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">{t.lobby.instructions.zoomScroll}</div>
                        <div className="relative w-32 h-20 flex items-center justify-center">
                            <div className="relative">
                                <Mouse className="w-14 h-14 stroke-[1.5px]" />
                                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 p-1">
                                    <div className="w-4 h-4 rounded-full border-2 border-indigo-400 animate-ping" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="absolute w-full h-px bg-white/10" />
                    <span className="relative z-10 bg-black/80 px-6 py-2 rounded-full text-xs font-black tracking-[0.5em] uppercase border border-white/10">{t.lobby.instructions.mouseTitle}</span>
                </div>

                {/* --- FOOTER BUTTON --- */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-12 py-3 bg-white hover:bg-indigo-50 text-slate-900 font-black text-sm uppercase tracking-widest rounded-full transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
                    >
                        {t.lobby.instructions.gotIt}
                    </button>
                </div>

            </div>
        </div>
    )
}

