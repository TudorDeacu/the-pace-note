require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkLocks() {
    console.log("Checking DB connection...");
    const { data, error } = await supabase.rpc('hello_world'); // Just test if RPC hangs
    console.log("RPC Error:", error);
    
    // Test simple select on articles
    const t0 = Date.now();
    const { data: d2, error: e2 } = await supabase.from('articles').select('id').limit(1);
    console.log("Select returned in", Date.now() - t0, "ms. Error:", e2);
}
checkLocks();
