
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Trash2, Plus, Save } from 'lucide-react'

export default async function AdminSponsorsPage() {
    const supabase = await createClient()

    // Fetch existing sponsors
    const { data: sponsors } = await supabase.from('sponsors').select('*').order('id', { ascending: true })

    // Server Action to Add Sponsor
    async function addSponsor(formData: FormData) {
        'use server'
        const supabase = await createClient()
        const name = formData.get('name') as string
        const tier = formData.get('tier') as string
        const desc = formData.get('description') as string
        const image = formData.get('image_url') as string

        await supabase.from('sponsors').insert({
            name,
            tier,
            description: desc,
            image_url: image,
            website_url: '#'
        })
        revalidatePath('/admin/sponsors')
        revalidatePath('/expo')
    }

    // Server Action to Delete Sponsor
    async function deleteSponsor(formData: FormData) {
        'use server'
        const supabase = await createClient()
        const id = formData.get('id')
        await supabase.from('sponsors').delete().eq('id', id)
        revalidatePath('/admin/sponsors')
        revalidatePath('/expo')
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Gestión de Sponsors</h1>

            {/* Add New Sponsor Form */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" /> Añadir Nuevo Sponsor
                </h3>
                <form action={addSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Nombre de la Empresa" required className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <select name="tier" className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none">
                        <option value="gold">Gold (Oro)</option>
                        <option value="silver">Silver (Plata)</option>
                        <option value="bronze">Bronze (Bronce)</option>
                    </select>
                    <input name="image_url" placeholder="URL del Logo/Imagen (https://...)" required className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none md:col-span-2" />
                    <textarea name="description" placeholder="Descripción breve..." rows={2} className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none md:col-span-2" />

                    <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Guardar Sponsor
                    </button>
                </form>
            </div>

            {/* Existing Sponsors List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-400">Sponsors Activos ({sponsors?.length || 0})</h3>

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
                                <button type="submit" className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ))}

                    {(!sponsors || sponsors.length === 0) && (
                        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            No hay sponsors creados aún. ¡Añade el primero arriba!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
