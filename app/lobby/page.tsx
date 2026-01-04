
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LobbyClientWrapper from './LobbyClientWrapper'

export default async function LobbyPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch User Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    // Fetch All Rooms for Quick Nav
    const { data: rooms } = await supabase
        .from('stream_config')
        .select('*')
        .order('id', { ascending: true })

    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <LobbyClientWrapper
            userEmail={user.email}
            profile={profile}
            signOutAction={signOut}
            rooms={rooms || []}
        />
    )
}

