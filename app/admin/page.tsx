'use client'

import { useLanguage } from '@/app/context/LanguageContext'
import { Users, Video, HeartHandshake, Activity, Bell, PauseCircle, Terminal, Globe, ArrowUpRight, Clock } from 'lucide-react'

export default function AdminDashboard() {
    const { t } = useLanguage()

    const stats = [
        { label: t.admin.users, value: '1,245', change: '+12%', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: t.admin.video, value: '850', change: t.videoAdmin.mainStageSignal, icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { label: t.admin.interactions, value: '3,402', change: t.auditorium.live, icon: HeartHandshake, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: t.admin.sysLoad, value: '12%', change: `45ms ${t.admin.latency}`, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    ]

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- DASHBOARD HEADER --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-2">
                        {t.admin.dashboard} <span className="text-indigo-500">PRO</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Command_Center_v4.0</span>
                        <div className="h-[1px] w-8 bg-indigo-500/30" />
                        <span className="text-[10px] font-bold text-indigo-500/50 uppercase tracking-widest">{t.admin.welcome}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">{t.admin.onlineSystem}</span>
                </div>
            </header>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative bg-[#0a1224]/80 border border-white/5 p-8 rounded-[32px] backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:border-white/10 hover:-translate-y-1">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity`} />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${stat.bg} border border-white/5`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</span>
                                <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color} bg-white/[0.03] px-2 py-0.5 rounded-md`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- OPERATIONAL CENTER --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Quick Tactics */}
                <div className="lg:col-span-2 bg-[#0a1224]/80 border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        {t.admin.commandActions}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all text-left overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-white uppercase tracking-tight">Notificación Push</span>
                                    <span className="block text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Enviar aviso global</span>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.02] transition-colors" />
                        </button>

                        <button className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-left overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                                    <PauseCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-white uppercase tracking-tight">Pausar Señal</span>
                                    <span className="block text-[9px] text-rose-500/40 font-bold uppercase tracking-widest mt-0.5">Urgencia / Emergencia</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Live Activity Log */}
                <div className="bg-[#0a1224]/80 border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-3xl">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        {t.admin.activeRegistry}
                    </h3>

                    <ul className="space-y-8">
                        {[
                            { msg: 'Registro nuevo: user@example.com', time: 'hace 2 mins', dot: 'bg-emerald-500' },
                            { msg: 'Streaming Iniciado - Main Theater', time: 'hace 1 hora', dot: 'bg-indigo-500' },
                            { msg: 'Actualización de Perfil: Admin_ID', time: 'hace 3 horas', dot: 'bg-white/20' }
                        ].map((log, i) => (
                            <li key={i} className="flex items-start gap-4 group/log">
                                <div className={`h-1.5 w-1.5 rounded-full mt-2 shrink-0 ${log.dot} shadow-[0_0_8px] shadow-current`} />
                                <div>
                                    <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{log.msg}</p>
                                    <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-1 italic">{log.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}
