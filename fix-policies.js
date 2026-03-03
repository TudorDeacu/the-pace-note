require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
    console.log("Checking buckets...");
    const { data: buckets } = await supabase.storage.listBuckets();
    console.log(buckets?.map(b => b.name));
})();
