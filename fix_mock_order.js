const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
    // 1. Get profile ID for thepacenote.crew@gmail.com
    const { data: profiles, error: profileErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'thepacenote.crew@gmail.com')
        .limit(1);

    if (profileErr || !profiles || profiles.length === 0) {
        console.error('Could not find profile. Error:', profileErr);
        return;
    }

    const userId = profiles[0].id;
    console.log(`Found user ID for thepacenote.crew: ${userId}`);

    // 2. Update all mockup orders with the wrong email or null user_id
    const { data, error } = await supabase
        .from('orders')
        .update({
            user_id: userId,
            customer_email: 'thepacenote.crew@gmail.com'
        })
        .in('customer_email', ['thapacenote.crew@gmail.com', 'thepacenote.crew@gmail.com']); // catch the typo too

    if (error) {
        console.error('Error assigning orders:', error);
    } else {
        console.log('Successfully assigned the mockup orders. You should see them on the frontend now.');
    }
})();
