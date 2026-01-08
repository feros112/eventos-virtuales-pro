
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

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
            {/* Admin Sidebar (Client Component) */}
            <AdminSidebar userEmail={user?.email} />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
