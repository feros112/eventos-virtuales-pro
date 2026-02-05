'use client'

import { Users, Search, UserPlus, Filter, ShieldCheck, Mail, Calendar, Activity } from 'lucide-react'
import UserRow from './UserRow'
import { useLanguage } from '@/app/context/LanguageContext'
import { useState, useMemo } from 'react'

export default function UsersTable({ users }: { users: any[] | null }) {
    const { t } = useLanguage()
    const [searchTerm, setSearchTerm] = useState('')

    // Stats
    const stats = useMemo(() => {
        if (!users) return { total: 0, admins: 0, active: 0 }
        return {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            active: users.filter(u => u.role !== 'banned').length
        }
    }, [users])

    const filteredUsers = useMemo(() => {
        if (!users) return []
        if (!searchTerm) return users
        return users.filter(u =>
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [users, searchTerm])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <Users className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                            {t.admin.users}
                        </h1>
                        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
                            Management Terminal <span className="text-indigo-500/50 mx-2">//</span> SECURE_ACCESS
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (!users) return;
                            const headers = ['Nombre Completo', 'Email', 'Rol', 'Fecha de Registro'];
                            const csvContent = [
                                headers.join(','),
                                ...users.map(u => [
                                    `"${u.full_name || ''}"`,
                                    u.email,
                                    u.role,
                                    new Date(u.created_at).toLocaleDateString()
                                ].join(','))
                            ].join('\n');

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `usuarios_eventos_virtuales_${new Date().toISOString().split('T')[0]}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" /> Exportar CSV
                    </button>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-6 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all outline-none w-full md:w-64 backdrop-blur-md"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Usuarios', value: stats.total, icon: Users, color: 'indigo' },
                    { label: 'Administradores', value: stats.admins, icon: ShieldCheck, color: 'rose' },
                    { label: 'Usuarios Activos', value: stats.active, icon: Activity, color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full -translate-x-[-20%] -translate-y-[20%] blur-3xl`} />
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase mb-1">{stat.label}</p>
                                <p className="text-4xl font-black text-white leading-none">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-500/50`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Container */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-[32px] overflow-hidden backdrop-blur-2xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {t.moderation.user}</div>
                                </th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Rango</div>
                                </th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Registro</div>
                                </th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredUsers.map((user) => (
                                <UserRow key={user.id} user={user} />
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-6 bg-slate-800/50 rounded-full">
                                                <Search className="w-12 h-12 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No se encontraron usuarios</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
