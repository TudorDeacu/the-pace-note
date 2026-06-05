require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testFetch() {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .not('slug', 'like', 'page-%')
        .order('created_at', { ascending: false });
    
    console.log("Error:", error);
    console.log("Total articles:", data?.length);
    if(data) console.log("List:", data.map(a => a.slug));
}
testFetch();
