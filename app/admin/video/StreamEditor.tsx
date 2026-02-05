'use client'

import React, { useState } from 'react'
import { Video, Save, Radio, Monitor, Zap, ShieldCheck, ChevronLeft, ChevronRight, Presentation } from 'lucide-react'
import { updateStreamConfig } from './actions'
import { useLanguage } from '@/app/context/LanguageContext'

interface StreamEditorProps {
    config: {
        stream_title: string
        stream_url: string
        is_live: boolean
        slides_url?: string
        current_slide?: number
        total_slides?: number
    }
}

export default function StreamEditor({ config }: StreamEditorProps) {
    const { t } = useLanguage()
    const [currentSlide, setCurrentSlide] = useState(config.current_slide || 1)

    const handleNext = () => setCurrentSlide(prev => Math.min(prev + 1, config.total_slides || 999))
    const handlePrev = () => setCurrentSlide(prev => Math.max(prev - 1, 1))

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- BROADCAST HEADER --- */}
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10 relative">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <Video className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
                            {t.videoAdmin.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{t.videoAdmin.broadcastUnit}</span>
                            <div className="h-[1px] w-8 bg-indigo-500/30" />
                            <span className="text-[10px] font-bold text-indigo-500/50 uppercase tracking-widest italic">{t.videoAdmin.mainStageSignal}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/10 px-4 py-2 rounded-xl backdrop-blur-md">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${config.is_live ? 'bg-emerald-500 shadow-emerald-500 animate-pulse' : 'bg-rose-500 shadow-rose-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                        {config.is_live ? t.videoAdmin.signalLive : t.videoAdmin.systemOffline}
                    </span>
                </div>
            </header>

            <form action={updateStreamConfig} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- MAIN CONFIG FORM --- */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a1224]/80 border border-white/5 rounded-[40px] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

                            <div className="space-y-10 relative z-10">
                                {/* Info Section */}
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2 block transition-colors group-focus-within:text-indigo-400">
                                            {t.videoAdmin.streamTitle}
                                        </label>
                                        <input
                                            type="text"
                                            name="stream_title"
                                            defaultValue={config.stream_title}
                                            className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-[24px] text-sm font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-white/5"
                                            placeholder="Ej: GRAN CONFERENCIA ANUAL"
                                        />
                                    </div>

                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2 block transition-colors group-focus-within:text-indigo-400">
                                            {t.videoAdmin.streamUrl}
                                        </label>
                                        <div className="relative">
                                            <Monitor className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="text"
                                                name="stream_url"
                                                defaultValue={config.stream_url}
                                                className="w-full bg-white/[0.03] border border-white/5 p-5 pl-16 rounded-[24px] text-xs font-mono font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-white/5 break-all"
                                                placeholder="https://www.youtube.com/embed/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Slide Sync Section */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                            <Presentation className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <h3 className="font-black text-xs text-white uppercase tracking-widest">{t.videoAdmin.slidesControl}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">{t.videoAdmin.slidesUrl}</label>
                                            <input
                                                type="text"
                                                name="slides_url"
                                                defaultValue={config.slides_url}
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-[10px] font-bold text-white outline-none focus:border-amber-500/30 transition-all"
                                                placeholder="https://assets.com/my-event/slides"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">{t.videoAdmin.totalSlides}</label>
                                            <input
                                                type="number"
                                                name="total_slides"
                                                defaultValue={config.total_slides}
                                                className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-[10px] font-bold text-white outline-none focus:border-amber-500/30 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 text-white transition-all shadow-xl active:scale-95"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <div className="text-center min-w-[120px]">
                                            <input
                                                type="hidden"
                                                name="current_slide"
                                                value={currentSlide}
                                            />
                                            <div className="text-3xl font-black text-white tracking-tighter">{currentSlide}</div>
                                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">/{config.total_slides || 1}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 text-white transition-all shadow-xl active:scale-95"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <p className="text-center text-[9px] text-white/30 font-bold uppercase tracking-widest italic">
                                        * Los cambios solo se aplican al pulsar "{t.videoAdmin.updateBtn}"
                                    </p>
                                </div>

                                {/* Live Switcher */}
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/switch transition-all hover:bg-white/[0.04]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <Radio className={`w-6 h-6 ${config.is_live ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm text-white uppercase tracking-tight">{t.videoAdmin.isLive}</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Activar/Desactivar streaming público</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_live"
                                            defaultChecked={config.is_live}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500/80 peer-checked:after:bg-white"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SIDEBAR INFO --- */}
                    <div className="space-y-6">
                        <button
                            type="submit"
                            className="w-full py-8 bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-[32px] hover:bg-indigo-400 shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_70px_rgba(99,102,241,0.5)] transition-all flex flex-col items-center justify-center gap-4 active:scale-[0.98] group/btn"
                        >
                            <Save className="w-8 h-8 group-hover/btn:scale-110 transition-transform" />
                            {t.videoAdmin.updateBtn}
                        </button>

                        <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[32px] backdrop-blur-xl">
                            <Zap className="w-6 h-6 text-indigo-400 mb-4" />
                            <h4 className="font-black text-xs text-white uppercase tracking-widest mb-3">{t.videoAdmin.quickGuide}</h4>
                            <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                                {t.videoAdmin.guideBody}
                            </p>
                        </div>

                        <div className="p-8 border border-white/5 rounded-[32px] group hover:border-white/10 transition-colors">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 block">{t.videoAdmin.networkSignal}</span>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                        <span className="text-[9px] font-bold text-white/40 uppercase">Broadcast_Node_{i}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}
