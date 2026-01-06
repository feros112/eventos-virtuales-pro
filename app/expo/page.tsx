import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ExpoExperience from './ExpoExperience'

export default async function ExpoPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <main className="w-full h-screen">
            <ExpoExperience />
        </main>
    )
}
