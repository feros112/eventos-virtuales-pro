'use client'

import { useLanguage } from '@/app/context/LanguageContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar({ userEmail }: { userEmail: string | undefined }) {
    const { t } = useLanguage()
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {t.admin.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Super Admin</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                    {t.admin.settings}
                </div>

                <Link
                    href="/admin"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium border ${isActive('/admin') ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                >
                    📊 {t.admin.dashboard}
                </Link>

                <Link
                    href="/admin/sponsors"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border ${isActive('/admin/sponsors') ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                >
                    💰 {t.admin.sponsors}
                </Link>

                <Link
                    href="/admin/stream"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border ${isActive('/admin/stream') ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                >
                    🎥 {t.admin.video}
                </Link>

                <Link
                    href="/admin/users"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border ${isActive('/admin/users') ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                >
                    👥 {t.admin.users}
                </Link>

                <Link
                    href="/admin/moderation"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border ${isActive('/admin/moderation') ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'}`}
                >
                    🛡️ {t.admin.moderation}
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                        YO
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{userEmail}</p>
                        <p className="text-xs text-emerald-400">Online</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
