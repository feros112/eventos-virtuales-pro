
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const promote = searchParams.get('promote')

    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2. Get Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 3. Promote if requested
    if (promote === 'true') {
        const { data: updated, error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id)
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        return NextResponse.json({
            message: 'User promoted to ADMIN successfully! 👑',
            user: user.email,
            previous_role: profile?.role,
            new_role: updated.role
        })
    }

    return NextResponse.json({
        message: 'Current status',
        user: user.email,
        profile: profile
    })
}
