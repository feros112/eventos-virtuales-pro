'use client'

import { useLanguage } from '@/app/context/LanguageContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, HeartHandshake, Video, ShieldAlert, Settings, Activity, ShieldCheck } from 'lucide-react'

export default function AdminSidebar({ userEmail }: { userEmail: string | undefined }) {
    const { language, setLanguage, t } = useLanguage()
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    const navItems = [
        { href: '/admin', label: t.admin.dashboard, icon: LayoutDashboard },
        { href: '/admin/sponsors', label: t.admin.sponsors, icon: HeartHandshake },
        { href: '/admin/video', label: t.admin.video, icon: Video },
        { href: '/admin/users', label: t.admin.users, icon: Users },
        { href: '/admin/moderation', label: t.admin.moderation, icon: ShieldAlert },
    ]

    return (
        <aside className="w-72 bg-[#020617] border-r border-white/5 hidden md:flex flex-col relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 -left-20 w-40 h-40 bg-indigo-500/10 blur-[100px] pointer-events-none" />

            <div className="p-8 border-b border-white/5 relative z-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">
                            {t.admin.title}
                        </h2>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase ml-4">{t.admin.superAdmin}</p>
                </div>

                <button
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    className="p-1 px-2 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase"
                >
                    {language === 'es' ? 'EN' : 'ES'}
                </button>
            </div>

            <nav className="flex-1 p-6 space-y-3 relative z-10">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 px-3 flex items-center gap-3">
                    <Settings className="w-3 h-3" />
                    {t.admin.settings}
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-4 rounded-[18px] transition-all duration-300 group/item relative overflow-hidden ${isActive(item.href)
                            ? 'bg-indigo-500/10 text-white border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                            : 'text-slate-500 hover:text-slate-200 border border-transparent hover:bg-white/[0.02]'
                            }`}
                    >
                        {isActive(item.href) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-full" />
                        )}
                        <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover/item:scale-110 ${isActive(item.href) ? 'text-indigo-400' : 'text-slate-600'}`} strokeWidth={1.5} />
                        <span className="text-xs font-black uppercase tracking-[0.15em]">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] backdrop-blur-md relative z-10">
                <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs text-white shadow-lg overflow-hidden relative">
                        {userEmail?.substring(0, 2).toUpperCase()}
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">{userEmail?.split('@')[0]}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[9px] text-emerald-500/80 font-black uppercase tracking-widest italic">{t.admin.online}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
