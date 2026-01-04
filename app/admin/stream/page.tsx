import { createClient } from '@/utils/supabase/server'
import { Video } from 'lucide-react'
import StreamEditor from './StreamEditor'

export default async function AdminStreamPage() {
    const supabase = await createClient()

    // Fetch All Rooms
    const { data: rooms } = await supabase
        .from('stream_config')
        .select('*')
        .order('id', { ascending: true })

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Video className="w-8 h-8 text-rose-500" /> Control de Streaming (Multiplex)
            </h1>

            <StreamEditor initialRooms={rooms || []} />
        </div>
    )
}
