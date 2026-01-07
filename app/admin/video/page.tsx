import { createClient } from '@/utils/supabase/server'
import { updateStreamConfig } from './actions'
import { Tv, Save, Radio } from 'lucide-react'

export default async function VideoAdminPage() {
    const supabase = await createClient()

    // Fetch current config
    const { data: config } = await supabase
        .from('stream_config')
        .select('*')
        .eq('slug', 'main-theater')
        .single()

    if (!config) {
        return <div className="p-8 text-white">Error: No configuration found for 'main-theater'. Run seed script.</div>
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <header className="mb-10 flex items-center gap-4">
                    <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                        <Tv className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Configuración de Streaming</h1>
                        <p className="text-slate-400">Controla la señal en vivo del Main Theater</p>
                    </div>
                </header>

                {/* Form Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <form action={updateStreamConfig} className="space-y-6">

                        {/* Stream Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Título del Evento</label>
                            <input
                                type="text"
                                name="stream_title"
                                defaultValue={config.stream_title}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Gran Lanzamiento 2024"
                            />
                        </div>

                        {/* Stream URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">URL del Embed (YouTube/Twitch)</label>
                            <div className="flex gap-2">
                                <span className="p-3 bg-slate-800 rounded-l-lg border border-slate-700 border-r-0 text-slate-400 font-mono text-sm">src=</span>
                                <input
                                    type="text"
                                    name="stream_url"
                                    defaultValue={config.stream_url}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-r-lg px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all font-mono text-sm break-all"
                                    placeholder="https://www.youtube.com/embed/..."
                                />
                            </div>
                            <p className="text-xs text-slate-500">Asegúrate de que la URL permite embedding (iframe).</p>
                        </div>

                        {/* Live Toggle */}
                        <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Radio className="w-6 h-6 text-indigo-400" />
                                <div>
                                    <h3 className="font-bold text-indigo-100">Estado de Transmisión</h3>
                                    <p className="text-xs text-indigo-300">Si está apagado, se mostrará el estado "Offline"</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_live"
                                    defaultChecked={config.is_live}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/20"
                            >
                                <Save className="w-4 h-4" />
                                Guardar Configuración
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
