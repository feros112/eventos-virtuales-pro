
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking stream_config columns...');
    const { data, error } = await supabase
        .from('stream_config')
        .select('slug, thumbnail_url')
        .limit(1);

    if (error) {
        console.error('Error fetching new columns:', error.message);
        if (error.message.includes('column') || error.message.includes('does not exist')) {
            console.log('SCHEMA_MISSING');
        }
    } else {
        console.log('SCHEMA_OK');
    }
}

checkSchema();
