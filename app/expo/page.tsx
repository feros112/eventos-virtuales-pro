
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Download, MessageCircle, Star } from 'lucide-react'

export default async function ExpoPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Real Sponsors from DB
    const { data: sponsors } = await supabase
        .from('sponsors')
        .select('*')
        .order('id', { ascending: true }) // You can change this to order by tier later

    // Helper for Tier Colors
    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'gold': return "from-amber-400 to-yellow-600"
            case 'silver': return "from-slate-300 to-slate-500"
            default: return "from-orange-400 to-red-600" // bronze/other
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center">

            {/* Navbar Simplified */}
            <nav className="fixed top-0 w-full border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <Link href="/lobby" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Lobby
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <span className="font-bold text-lg text-cyan-400">Sala de Expo</span>
                </div>
                <div className="text-xs text-slate-500 hidden md:block">
                    Explora y conecta con nuestros patrocinadores
                </div>
            </nav>

            <main className="w-full max-w-7xl mx-auto px-6 py-28 flex flex-col gap-12">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Nuestros Patrocinadores
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Conoce a las empresas líderes que hacen posible este evento. Visita sus stands virtuales para ofertas exclusivas.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Render Real Sponsors */}
                    {sponsors && sponsors.length > 0 ? (
                        sponsors.map((sponsor) => (
                            <div key={sponsor.id} className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">

                                {/* Image Header */}
                                <div className="h-48 relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10`} />
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getTierColor(sponsor.tier)}`} />
                                    <img
                                        src={sponsor.image_url || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                                        alt={sponsor.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        {sponsor.tier === 'gold' && (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase flex items-center gap-1 backdrop-blur-md">
                                                <Star className="w-3 h-3 fill-current" /> Gold
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative z-20">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{sponsor.name}</h3>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                        {sponsor.description || "Sin descripción disponible."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors border border-slate-700">
                                            <Download className="w-3 h-3" /> Folleto
                                        </button>
                                        <button className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-white text-xs font-bold transition-all shadow-lg bg-gradient-to-r ${getTierColor(sponsor.tier)} opacity-90 hover:opacity-100 hover:scale-105`}>
                                            <MessageCircle className="w-3 h-3" /> Contactar
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        /* Empty State */
                        <div className="col-span-full text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                            <p className="text-slate-500 text-lg">No hay patrocinadores confirmados aún.</p>
                            <p className="text-slate-600 text-sm mt-2">Pronto anunciaremos a nuestros partners.</p>
                        </div>
                    )}
                </div>

                {/* CTA Footer */}
                <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">¿Quieres ser patrocinador?</h3>
                        <p className="text-slate-400 mb-6">Únete al próximo evento y muestra tu marca a miles de asistentes.</p>
                        <button className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors">
                            Obtener Kit de Medios
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}
