import { createClient } from '@/utils/supabase/server'
import { ShieldCheck } from 'lucide-react'
import StreamEditor from './StreamEditor'

export default async function VideoAdminPage() {
    const supabase = await createClient()

    // Fetch current config
    const { data: config } = await supabase
        .from('stream_config')
        .select('*')
        .eq('slug', 'main-theater')
        .single()

    if (!config) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8">
                <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex flex-col items-center gap-4">
                    <ShieldCheck className="w-12 h-12 text-rose-500" />
                    <p className="text-white font-black uppercase tracking-widest text-sm">Error: Configuración no encontrada</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            <StreamEditor config={config} />
        </div>
    )
}
