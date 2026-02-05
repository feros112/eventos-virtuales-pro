
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NetworkingClient from './NetworkingClient'

export default async function NetworkingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch real attendees from profiles table
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    return (
        <NetworkingClient initialAttendees={profiles || []} />
    )
}
