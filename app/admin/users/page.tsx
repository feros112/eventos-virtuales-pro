
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Users, Ban, Trash2, Shield } from 'lucide-react'
import UsersTable from './UsersTable'

export default async function AdminUsersPage() {
    const supabase = await createClient()

    // Fetch all profiles
    const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

    return (
        <UsersTable users={users} />
    )
}
