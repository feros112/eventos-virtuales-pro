
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Check if event exists
    const { data: existing } = await supabase
        .from('stream_config')
        .select('*')
        .eq('slug', 'main-theater')
        .single()

    if (existing) {
        return NextResponse.json({ message: 'Event already exists!', event: existing })
    }

    // 2. Insert Test Event
    const { data, error } = await supabase
        .from('stream_config')
        .insert({
            slug: 'main-theater',
            stream_title: 'Gran Lanzamiento 2024 🚀',
            stream_url: 'https://www.youtube.com/embed/jfKfPfyJRdk', // Lofi Girl (Always Live) or similar safe test
            is_live: true,
            chat_enabled: true
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Success! Event created.', event: data })
}
