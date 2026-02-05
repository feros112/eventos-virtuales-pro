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
        // Send message back to login page
        redirect('/login?message=Error de autenticación: ' + error.message)
    }

    console.log("Login successful, redirecting to /lobby...")
    revalidatePath('/', 'layout')
    redirect('/lobby') // Redirect to Lobby instead of Home
}

export async function signup(formData: FormData) {
    console.log("Signup action started...")
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const company = formData.get('company') as string

    console.log("Attempting signup for:", email)

    // Sign up with metadata
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: `${first_name} ${last_name}`.trim() || email.split('@')[0],
                company: company || ''
            }
        }
    })

    if (error) {
        console.error("Signup error:", error.message)
        redirect('/login?message=Error al crear cuenta: ' + error.message)
    }

    console.log("Signup successful. Check email if confirmation is enabled.")

    // If email confirmation is disabled in Supabase, this will log them in immediately.
    // If enabled, they can't login until they click the link.
    revalidatePath('/', 'layout')
    redirect('/lobby')
}
