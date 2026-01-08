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
            <StreamEditor initialRooms={rooms || []} />
        </div>
    )
}
