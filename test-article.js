require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testInsert() {
    console.log("Starting insert...");
    try {
        const { error, data } = await supabase.from('articles').insert([{
            title: 'Test Article',
            slug: 'test-article-' + Date.now(),
            content: { blocks: [] },
            published: true
        }]).select();
        console.log("Error:", error);
        console.log("Data:", data);
    } catch (e) {
        console.error("Exception:", e);
    }
}
testInsert();
