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
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    signup: (email: string, password: string, firstName: string, lastName: string, username: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

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
            setUser(user);
            if (user) {
                await fetchRole(user.id);
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchRole(session.user.id);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    };

    const signup = async (email: string, password: string, firstName: string, lastName: string, username: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    // role will be default 'user' via database default or trigger if set up, 
                    // generally Supabase Auth meta data is separate from profiles table, 
                    // but we rely on a trigger to create the profile usually.
                }
            }
        });

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setRole(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, isAdmin: role === 'admin', loading, login, signup, logout }}>
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
