
'use client'

import { Ban, Trash2, CheckCircle } from 'lucide-react'
import { toggleBanUser, deleteUser } from './actions'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function UserRow({ user }: { user: any }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleBan = async () => {
        if (confirm(`¿Estás seguro de cambiar el estado de ${user.email}?`)) {
            await toggleBanUser(user.id, user.role)
            // Trigger refresh logic handled by action revalidate, but router refresh helps sometimes
        }
    }

    const handleDelete = async () => {
        if (confirm(`¿Eliminar a ${user.email}? Esto no se puede deshacer.`)) {
            await deleteUser(user.id)
        }
    }

    const isBanned = user.role === 'banned'

    return (
        <tr className={`hover:bg-slate-800/50 transition-colors ${isBanned ? 'opacity-50 grayscale' : ''}`}>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 relative">
                        {user.email?.substring(0, 2).toUpperCase()}
                        {isBanned && (
                            <div className="absolute inset-0 bg-red-500/50 rounded-full flex items-center justify-center">
                                <Ban className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-2">
                            {user.full_name || 'Sin Nombre'}
                            {isBanned && <span className="text-xs bg-red-600 px-2 rounded text-white">BANEADO</span>}
                        </div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'admin' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' :
                        user.role === 'banned' ? 'bg-slate-500/10 border-slate-500/50 text-slate-400' :
                            'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    }`}>
                    {user.role}
                </span>
            </td>
            <td className="p-4 text-sm text-slate-400">
                {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleBan}
                        disabled={isPending || user.role === 'admin'}
                        className={`p-2 rounded-lg transition-colors ${isBanned ? 'text-emerald-500 hover:bg-emerald-900/50' : 'text-slate-400 hover:text-red-400 hover:bg-red-900/20'}`}
                        title={isBanned ? "Desbanear" : "Banear Usuario"}
                    >
                        {isBanned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isPending || user.role === 'admin'}
                        className="p-2 hover:bg-rose-900/50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}
