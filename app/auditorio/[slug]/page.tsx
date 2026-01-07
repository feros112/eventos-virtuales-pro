import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AuditoriumLayout from './AuditoriumLayout'


export default async function AuditorioPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Current Room Configuration by Slug
    const { data: config } = await supabase
        .from('stream_config')
        .select('*')
        .eq('slug', slug)
        .single()

    // 2. Fetch All Rooms for Quick Navigation
    const { data: rooms } = await supabase
        .from('stream_config')
        .select('*')
        .order('id', { ascending: true })

    // Handle 404 if room not found
    if (!config) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col">
                <h1 className="text-4xl font-bold mb-4">Sala no encontrada</h1>
                <Link href="/auditorio" className="text-rose-500 hover:underline">Volver al escenario principal</Link>
            </div>
        )
    }

    return (
        <AuditoriumLayout
            streamUrl={config.stream_url}
            isLive={config.is_live}
            userEmail={user.email!}
            userId={user.id}
            streamTitle={config.stream_title}
        />
    )
}
