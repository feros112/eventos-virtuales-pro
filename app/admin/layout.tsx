
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// LISTA DE SUPER ADMINS (Añade aquí tu correo)
const ADMIN_EMAILS = ['fernandosorio112@gmail.com']

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Check if logged in
    if (!user) {
        redirect('/login')
    }

    // 2. Security Check (Role Based Access Control)
    // If the email is NOT in our allowlist, kick them out.
    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
        console.error(`Unauthorized access attempt to /admin by: ${user.email}`)
        redirect('/lobby') // Send them back to the user area
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        PRO ADMIN
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Modo Dios Activado</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Gestión</div>
                    <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-medium">
                        📊 Dashboard
                    </a>
                    <a href="/admin/sponsors" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        💰 Sponsors (Expo)
                    </a>
                    <a href="/admin/stream" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        🎥 Stream (Auditorio)
                    </a>
                    <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        👥 Usuarios
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                            YO
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                            <p className="text-xs text-emerald-400">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
