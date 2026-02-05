
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log('--- Inspecting stream_config ---');
    const { data: streamData, error: streamError } = await supabase
        .from('stream_config')
        .select('*')
        .limit(1);

    if (streamError) console.error('Stream Config Error:', streamError.message);
    else console.log('Stream Config Columns:', Object.keys(streamData[0] || {}));

    console.log('\n--- Inspecting profiles ---');
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profileError) console.error('Profiles Error:', profileError.message);
    else console.log('Profiles Columns:', Object.keys(profileData[0] || {}));
}

inspectSchema();
