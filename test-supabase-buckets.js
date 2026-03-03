require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
    const checkBucket = async (bucketName) => {
        const { data, error } = await supabase.storage.from(bucketName).list();
        if (error) console.error(`Error reading ${bucketName}:`, error.message);
        else console.log(`Files in ${bucketName}:`, data.length > 0 ? data.map(f => f.name) : "Empty");
    };

    await checkBucket('products');
    await checkBucket('blogs');
    await checkBucket('projects');
    await checkBucket('other');
})();
