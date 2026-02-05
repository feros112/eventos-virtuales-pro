
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env parser
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log('--- Inspecting stream_config ---');
    const { data: streamData, error: streamError } = await supabase
        .from('stream_config')
        .select('*')
        .limit(1);

    if (streamError) console.error('Stream Config Error:', streamError.message);
    else {
        console.log('Stream Config Entry found:', !!streamData[0]);
        if (streamData[0]) console.log('Columns:', Object.keys(streamData[0]));
    }

    console.log('\n--- Inspecting profiles ---');
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profileError) console.error('Profiles Error:', profileError.message);
    else {
        console.log('Profiles Entry found:', !!profileData[0]);
        if (profileData[0]) console.log('Columns:', Object.keys(profileData[0]));
    }
}

inspectSchema();
