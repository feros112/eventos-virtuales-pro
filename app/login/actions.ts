'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    console.log("Login action started...")
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    console.log("Attempting login for:", data.email)

    // Sign in with password
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error("Login error:", error.message)
        // Send error back to login page
        redirect('/login?error=Could not authenticate user: ' + error.message)
    }

    console.log("Login successful, redirecting to /lobby...")
    revalidatePath('/', 'layout')
    redirect('/lobby') // Redirect to Lobby instead of Home
}

export async function signup(formData: FormData) {
    console.log("Signup action started...")
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    console.log("Attempting signup for:", data.email)

    // Sign up
    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error("Signup error:", error.message)
        redirect('/login?error=Could not create user: ' + error.message)
    }

    console.log("Signup successful. Check email if confirmation is enabled.")

    // If email confirmation is disabled in Supabase, this will log them in immediately.
    // If enabled, they can't login until they click the link.
    revalidatePath('/', 'layout')
    redirect('/lobby')
}
