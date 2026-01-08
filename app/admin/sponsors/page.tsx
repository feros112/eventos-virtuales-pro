
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import SponsorsManager from './SponsorsManager'

export default async function AdminSponsorsPage() {
    const supabase = await createClient()

    // Fetch existing sponsors
    const { data: sponsors } = await supabase.from('sponsors').select('*').order('id', { ascending: true })

    return (
        <SponsorsManager sponsors={sponsors} />
    )
}
