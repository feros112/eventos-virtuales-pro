'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateStreamConfig(formData: FormData) {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    // 2. Role Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Forbidden: Admins only')
    }

    // 3. Extract Data
    const streamUrl = formData.get('stream_url') as string
    const streamTitle = formData.get('stream_title') as string
    const isLive = formData.get('is_live') === 'on'
    // Checkbox: "on" if checked, null if unchecked. 
    // Note: ensure the form sends something or handle null correctly.

    // 4. Update DB
    const { error } = await supabase
        .from('stream_config')
        .update({
            stream_url: streamUrl,
            stream_title: streamTitle,
            is_live: isLive
        })
        .eq('slug', 'main-theater')

    if (error) {
        console.error('Update failed:', error)
        throw new Error('Update failed')
    }

    // 5. Revalidate Cache
    revalidatePath('/auditorio/main-theater')
    revalidatePath('/admin/video')

    // Optional: could redirect or just stay
}
