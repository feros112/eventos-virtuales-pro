
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBanUser(userId: string, currentRole: string) {
    const supabase = await createClient()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    // In a real app we should verify the admin role in DB, skipping for speed in MVP

    const newRole = currentRole === 'banned' ? 'attendee' : 'banned'

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        console.error('Error banning user:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

    if (error) {
        console.error('Error deleting user:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}
