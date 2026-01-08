'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSponsor(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const tier = formData.get('tier') as string
    const desc = formData.get('description') as string
    const image = formData.get('image_url') as string

    await supabase.from('sponsors').insert({
        name,
        tier,
        description: desc,
        image_url: image,
        website_url: '#'
    })
    revalidatePath('/admin/sponsors')
    revalidatePath('/expo')
}

export async function deleteSponsor(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id')
    await supabase.from('sponsors').delete().eq('id', id)
    revalidatePath('/admin/sponsors')
    revalidatePath('/expo')
}
