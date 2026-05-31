import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    let storage;
    if (typeof window !== 'undefined') {
        const rememberMeCookie = document.cookie.split('; ').find(row => row.startsWith('remember_me='));
        const rememberMe = rememberMeCookie ? rememberMeCookie.split('=')[1] !== 'false' : true;
        storage = rememberMe ? window.localStorage : window.sessionStorage;
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                storage,
                persistSession: true,
                detectSessionInUrl: true
            }
        }
    )
}
