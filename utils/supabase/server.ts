import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns the current user and their role (from public.profiles).
 * Role is read with the user-scoped client, so RLS still applies.
 */
export async function getUserAndRole() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { supabase, user: null, role: null as string | null }

    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return { supabase, user, role: (data?.role ?? null) as string | null }
}

/**
 * Defense-in-depth guard for server actions that must only run for admins.
 * RLS is the real backstop, but this returns a clean error early.
 * Returns the admin-authenticated supabase client on success, or null if not admin.
 */
export async function getAdminClient(): Promise<SupabaseClient | null> {
    const { supabase, role } = await getUserAndRole()
    return role === 'admin' ? supabase : null
}

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        const rememberMe = cookieStore.get('remember_me')?.value !== 'false';
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const finalOptions = rememberMe 
                                ? options 
                                : { ...options, maxAge: undefined, expires: undefined };
                            cookieStore.set(name, value, finalOptions);
                        });
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
