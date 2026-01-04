
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect routes validation
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        request.nextUrl.pathname !== '/' // Allow Landing Page
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Ban Check Logic
    if (user) {
        // We need to check if the user is banned. 
        // We fetch the profile securely using the supabase client.
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const isBanned = profile?.role === 'banned'
        const isOnBannedPage = request.nextUrl.pathname === '/banned'

        // Case 1: Banned user trying to access app -> Redirect to /banned
        if (isBanned && !isOnBannedPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/banned'
            return NextResponse.redirect(url)
        }

        // Case 2: Normal user trying to access /banned -> Redirect to /lobby
        if (!isBanned && isOnBannedPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/lobby'
            return NextResponse.redirect(url)
        }
    }

    return response
}
