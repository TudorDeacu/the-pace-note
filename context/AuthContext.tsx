"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    role: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
    signup: (email: string, password: string, firstName: string, lastName: string, username: string, title?: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error: string | null }>;
    resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
    updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [supabase] = useState(() => createClient());

    const fetchRole = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (data && !error) {
            setRole(data.role);
        } else {
            setRole(null);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await fetchRole(user.id);
            } else {
                setRole(null);
            }
            setUser(user);
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await fetchRole(session.user.id);
            } else {
                setRole(null);
            }
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const getFriendlyErrorMessage = (error: any): string => {
        if (!error) return "A apărut o eroare neașteptată.";

        let message = "";
        if (typeof error === 'string') {
            message = error;
        } else if (error) {
            message = error.message || error.error_description || error.error || "";
            if (!message && Object.keys(error).length > 0) {
                message = JSON.stringify(error);
            }
        }

        // Handle empty/JSON-like error messages (e.g. AuthRetryableFetchError timeout/network issue)
        if (!message || message === "{}" || message.trim() === "") {
            return "Eroare de conexiune la server. Te rugăm să verifici conexiunea la internet sau să încerci mai târziu.";
        }

        const msgLower = message.toLowerCase();

        // Map common Supabase errors to Romanian
        if (msgLower.includes("invalid login credentials") || msgLower.includes("invalid credentials")) {
            return "Adresa de email sau parola este incorectă.";
        }
        if (msgLower.includes("email not confirmed")) {
            return "Adresa de email nu a fost confirmată. Te rugăm să verifici căsuța poștală.";
        }
        if (msgLower.includes("user already registered") || msgLower.includes("already exists")) {
            return "Există deja un cont înregistrat cu această adresă de email.";
        }
        if (msgLower.includes("password should be at least")) {
            return "Parola este prea scurtă. Trebuie să aibă cel puțin 6 caractere.";
        }
        if (msgLower.includes("once every 60 seconds") || msgLower.includes("rate limit")) {
            return "Din motive de securitate, poți solicita resetarea parolei o singură dată pe minut. Te rugăm să aștepți.";
        }
        if (msgLower.includes("failed to fetch") || msgLower.includes("network error") || msgLower.includes("networkerror")) {
            return "Eroare de rețea. Te rugăm să îți verifici conexiunea la internet.";
        }
        if (msgLower.includes("signup requires a valid email") || msgLower.includes("email address is invalid")) {
            return "Te rugăm să introduci o adresă de email validă.";
        }

        return message;
    };

    const login = async (email: string, password: string, rememberMe: boolean = true) => {
        if (typeof window !== 'undefined') {
            if (rememberMe) {
                document.cookie = "remember_me=true; path=/; max-age=31536000; SameSite=Lax; Secure";
            } else {
                document.cookie = "remember_me=false; path=/; SameSite=Lax; Secure";
            }
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: getFriendlyErrorMessage(error) };
        }

        return { error: null };
    };

    const signup = async (email: string, password: string, firstName: string, lastName: string, username: string, title?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    title: title || null,
                }
            }
        });

        if (error) {
            return { error: getFriendlyErrorMessage(error) };
        }

        return { error: null };
    };

    const logout = async () => {
        if (typeof window !== 'undefined') {
            document.cookie = "remember_me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
        }
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.error("Eroare la deconectare:", e);
        } finally {
            setRole(null);
            setUser(null);
            router.push("/login");
            router.refresh(); // Force server components to re-render without session
        }
    };

    const signInWithGoogle = async () => {
        if (typeof window !== 'undefined') {
            document.cookie = "remember_me=true; path=/; max-age=31536000; SameSite=Lax; Secure";
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/account`
            }
        });
        if (error) return { error: getFriendlyErrorMessage(error) };
        return { error: null };
    };

    const resetPasswordForEmail = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            });
            if (error) return { error: getFriendlyErrorMessage(error) };
            return { error: null };
        } catch (err: any) {
            console.error("Supabase resetPasswordForEmail exception:", err);
            return { error: getFriendlyErrorMessage(err) };
        }
    };

    const updatePassword = async (password: string) => {
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        if (error) return { error: getFriendlyErrorMessage(error) };
        return { error: null };
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            isAuthenticated: !!user,
            isAdmin: role === 'admin',
            loading,
            login,
            signup,
            logout,
            signInWithGoogle,
            resetPasswordForEmail,
            updatePassword
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
