const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkUsers() {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.table(users.users.map(u => ({ id: u.id, email: u.email })));
    }
}
checkUsers();
