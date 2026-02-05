
'use client'

import { Ban, Trash2, CheckCircle, Shield, User, MoreVertical, ExternalLink } from 'lucide-react'
import { toggleBanUser, deleteUser } from './actions'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'

export default function UserRow({ user }: { user: any }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { t } = useLanguage()

    const handleBan = async () => {
        if (confirm(`${t.common.edit} permissions for ${user.email}?`)) {
            await toggleBanUser(user.id, user.role)
        }
    }

    const handleDelete = async () => {
        if (confirm(`${t.common.delete} ${user.email}?`)) {
            await deleteUser(user.id)
        }
    }

    const isBanned = user.role === 'banned'
    const isAdmin = user.role === 'admin'

    return (
        <tr className={`group transition-all duration-300 ${isBanned ? 'bg-red-500/[0.02] opacity-60' : 'hover:bg-white/[0.02]'}`}>
            <td className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black relative overflow-hidden shadow-2xl transition-transform group-hover:scale-110 duration-500 ${isAdmin ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white' :
                            isBanned ? 'bg-slate-800 text-slate-500' :
                                'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
                        }`}>
                        {user.email?.substring(0, 2).toUpperCase()}
                        {isBanned && (
                            <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center backdrop-blur-sm">
                                <Ban className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-black text-white flex items-center gap-2 tracking-tight">
                            {user.full_name || 'Anonymous User'}
                            {isAdmin && <Shield className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />}
                        </div>
                        <div className="text-xs text-slate-500 font-bold font-mono tracking-tighter opacity-80">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-6">
                <span className={`px-3 py-1.2 rounded-lg text-[10px] font-black tracking-[0.15em] uppercase border shadow-sm ${isAdmin ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                        user.role === 'banned' ? 'bg-slate-800/50 border-white/5 text-slate-500' :
                            'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}>
                    {user.role}
                </span>
            </td>
            <td className="p-6">
                <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-300 tracking-wide">
                        {new Date(user.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                        {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </td>
            <td className="p-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleBan}
                        disabled={isPending || isAdmin}
                        className={`p-2.5 rounded-xl border transition-all duration-300 ${isBanned
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10'
                            } disabled:opacity-20 disabled:grayscale`}
                        title={isBanned ? "Restaurar" : "Restringir"}
                    >
                        {isBanned ? <CheckCircle className="w-4.5 h-4.5" /> : <Ban className="w-4.5 h-4.5" />}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isPending || isAdmin}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all duration-300 disabled:opacity-20 disabled:grayscale shadow-sm"
                        title="Eliminar registro"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <button className="p-2.5 text-slate-600 hover:text-white transition-colors">
                        <MoreVertical className="w-4.5 h-4.5" />
                    </button>
                </div>
            </td>
        </tr>
    )
}
