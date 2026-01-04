
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, MessageSquare, UserPlus, Filter } from 'lucide-react'

export default async function NetworkingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Dummy Attendees Data (In a real app, fetch from 'profiles' table)
    const attendees = [
        { id: 1, name: "Carlos Ruiz", role: "CEO @ TechS", tags: ["Inversor", "AI"], image: null },
        { id: 2, name: "Maria Garcia", role: "Marketing Director", tags: ["Marketing", "Branding"], image: null },
        { id: 3, name: "John Smith", role: "Developer", tags: ["React", "Node.js"], image: null },
        { id: 4, name: "Ana Torres", role: "Product Owner", tags: ["Agile", "Scrum"], image: null },
        { id: 5, name: "Luisa Fernanda", role: "Periodista", tags: ["Media", "Press"], image: null },
        { id: 6, name: "Roberto Gomez", role: "Sales Manager", tags: ["Ventas", "B2B"], image: null },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">

            {/* Navbar */}
            <nav className="fixed top-0 w-full border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <Link href="/lobby" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Lobby
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <span className="font-bold text-lg text-purple-400">Social Networking</span>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 pb-12">

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Conecta con Asistentes</h1>
                        <p className="text-slate-400">Encuentra socios, clientes o amigos con tus mismos intereses.</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                placeholder="Buscar por nombre o cargo..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendees.map((person) => (
                        <div key={person.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4 hover:border-purple-500/30 transition-colors group">

                            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                                {person.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate text-white group-hover:text-purple-300 transition-colors">{person.name}</h3>
                                <p className="text-slate-400 text-sm mb-3 truncate">{person.role}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {person.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Chat
                                    </button>
                                    <button className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    )
}
