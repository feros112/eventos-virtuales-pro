'use client'

import { Trash2, Plus, Save, Award, Image as ImageIcon, Link as LinkIcon, Info, Briefcase } from 'lucide-react'
import { addSponsor, deleteSponsor } from './actions'
import { useLanguage } from '@/app/context/LanguageContext'

export default function SponsorsManager({ sponsors }: { sponsors: any[] | null }) {
    const { t } = useLanguage()

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <Award className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                            {t.admin.sponsors}
                        </h1>
                        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
                            Partnership Terminal <span className="text-cyan-500/50 mx-2">//</span> ACTIVE_ALLIANCES
                        </p>
                    </div>
                </div>
            </div>

            {/* Add New Sponsor Form */}
            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[32px] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -translate-x-[-30%] -translate-y-[30%] blur-3xl" />

                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
                    <Plus className="w-5 h-5 text-cyan-400" />
                    Registrar Nuevo Patrocinador
                </h3>

                <form action={addSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de la Empresa</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                name="name"
                                placeholder="Ej: TechCorp Global"
                                required
                                className="w-full bg-black/40 border border-slate-800 rounded-xl py-3.5 pl-12 pr-6 text-sm text-white placeholder-slate-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all outline-none backdrop-blur-md"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nivel de Patrocinio (Tier)</label>
                        <div className="relative">
                            <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <select
                                name="tier"
                                className="w-full bg-black/40 border border-slate-800 rounded-xl py-3.5 pl-12 pr-6 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all appearance-none backdrop-blur-md"
                            >
                                <option value="gold" className="bg-slate-900">Nivel Gold (VIP)</option>
                                <option value="silver" className="bg-slate-900">Nivel Silver</option>
                                <option value="bronze" className="bg-slate-900">Nivel Bronze</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">URL del Logo (Alta Resonancia)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                name="image_url"
                                placeholder="https://ejemplo.com/logo.png"
                                required
                                className="w-full bg-black/40 border border-slate-800 rounded-xl py-3.5 pl-12 pr-6 text-sm text-white placeholder-slate-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all outline-none backdrop-blur-md"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción Breve</label>
                        <div className="relative">
                            <Info className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                            <textarea
                                name="description"
                                placeholder="Describa la marca o el servicio..."
                                rows={3}
                                className="w-full bg-black/40 border border-slate-800 rounded-xl py-4 pl-12 pr-6 text-sm text-white placeholder-slate-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all outline-none backdrop-blur-md"
                            />
                        </div>
                    </div>

                    <button type="submit" className="md:col-span-2 group bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95">
                        <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        {t.common.save} Patrocinador
                    </button>
                </form>
            </div>

            {/* Existing Sponsors List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Patrocinadores Activos ({sponsors?.length || 0})</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sponsors?.map((sponsor: any) => (
                        <div key={sponsor.id} className="group bg-slate-900/40 border border-slate-800/50 p-6 rounded-[24px] flex items-center justify-between backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-500 shadow-xl">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={sponsor.image_url}
                                        alt={sponsor.name}
                                        className="w-20 h-20 object-contain rounded-2xl bg-black/40 border border-white/5 p-2 relative z-10"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-lg tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{sponsor.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-current transition-colors ${sponsor.tier === 'gold' ? 'bg-amber-500/10 text-amber-500' :
                                                sponsor.tier === 'silver' ? 'bg-slate-400/10 text-slate-400' :
                                                    'bg-orange-700/10 text-orange-600'
                                            }`}>
                                            {sponsor.tier}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Premium Tier</span>
                                    </div>
                                </div>
                            </div>

                            <form action={deleteSponsor} className="flex flex-col gap-2">
                                <input type="hidden" name="id" value={sponsor.id} />
                                <button type="submit" className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-lg" title={t.common.delete}>
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button type="button" className="p-3 bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300">
                                    <LinkIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ))}

                    {(!sponsors || sponsors.length === 0) && (
                        <div className="lg:col-span-2 text-center py-24 bg-slate-900/20 border border-dashed border-slate-800/50 rounded-[32px] backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-4">
                                <Award className="w-16 h-16 text-slate-800" />
                                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Sin patrocinadores registrados</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
