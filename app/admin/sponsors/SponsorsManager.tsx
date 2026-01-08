'use client'

import { Trash2, Plus, Save } from 'lucide-react'
import { addSponsor, deleteSponsor } from './actions'
import { useLanguage } from '@/app/context/LanguageContext'

export default function SponsorsManager({ sponsors }: { sponsors: any[] | null }) {
    const { t } = useLanguage()

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">{t.admin.sponsors}</h1>

            {/* Add New Sponsor Form */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" /> {t.common.edit} / New
                </h3>
                <form action={addSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder={t.admin.sponsors + " Name"} required className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <select name="tier" className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none">
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                    </select>
                    <input name="image_url" placeholder="URL Logo/Image (https://...)" required className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none md:col-span-2" />
                    <textarea name="description" placeholder="Description..." rows={2} className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none md:col-span-2" />

                    <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> {t.common.save}
                    </button>
                </form>
            </div>

            {/* Existing Sponsors List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-400">{t.admin.sponsors} ({sponsors?.length || 0})</h3>

                <div className="grid grid-cols-1 gap-4">
                    {sponsors?.map((sponsor: any) => (
                        <div key={sponsor.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={sponsor.image_url} alt={sponsor.name} className="w-16 h-16 object-cover rounded-lg bg-slate-800" />
                                <div>
                                    <h4 className="font-bold text-lg">{sponsor.name}</h4>
                                    <div className="flex gap-2 text-xs">
                                        <span className={`px-2 py-0.5 rounded uppercase font-bold ${sponsor.tier === 'gold' ? 'bg-amber-500/20 text-amber-400' :
                                            sponsor.tier === 'silver' ? 'bg-slate-400/20 text-slate-300' :
                                                'bg-orange-700/20 text-orange-400'
                                            }`}>
                                            {sponsor.tier}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <form action={deleteSponsor}>
                                <input type="hidden" name="id" value={sponsor.id} />
                                <button type="submit" className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title={t.common.delete}>
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ))}

                    {(!sponsors || sponsors.length === 0) && (
                        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            No sponsors yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
