'use client'

import { Users } from 'lucide-react'
import UserRow from './UserRow'
import { useLanguage } from '@/app/context/LanguageContext'

export default function UsersTable({ users }: { users: any[] | null }) {
    const { t } = useLanguage()

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-500" /> {t.admin.users}
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4">{t.moderation.user}</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">{t.moderation.time} (Reg)</th>
                            <th className="p-4 text-right">{t.moderation.action}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users?.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}

                        {users?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    {t.admin.users} empty.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
