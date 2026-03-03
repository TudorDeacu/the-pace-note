const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
    // List buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    console.log("Buckets:", buckets?.map(b => ({ id: b.id, public: b.public })) || bucketError);

    // List files in 'products' bucket
    const { data: files, error: fileError } = await supabase.storage.from('products').list();
    console.log("Files:", files?.map(f => f.name) || fileError);
})();
