
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Users, Ban, Trash2, Shield } from 'lucide-react'
import UserRow from './UserRow'

export default async function AdminUsersPage() {
    const supabase = await createClient()

    // Fetch all profiles
    const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-500" /> Gestión de Usuarios
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Fecha Registro</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users?.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}

                        {users?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No hay usuarios registrados aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
