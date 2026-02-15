"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup, signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        const result = await signup(email, password, firstName, lastName, username);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            alert("Registration successful! Please check your email to confirm your account.");
            router.push("/login");
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
        setLoading(true);
        setError("");
        let result;
        if (provider === 'google') result = await signInWithGoogle();
        else if (provider === 'apple') result = await signInWithApple();
        else result = await signInWithFacebook();

        if (result.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-6 py-20">
                <div className="w-full max-w-5xl bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 mt-20">
                    <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center">Create Account</h1>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Side: Register Form */}
                        <div className="flex-[2]">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-500 transition-colors disabled:opacity-50 mt-2"
                                >
                                    {loading ? "Creating Account..." : "Register"}
                                </button>
                            </form>
                        </div>

                        {/* Separator */}
                        <div className="flex flex-row md:flex-col items-center justify-center">
                            <div className="flex-grow border-t md:border-t-0 md:border-l border-zinc-800 h-0 md:h-full w-full md:w-0"></div>
                            <span className="flex-shrink-0 mx-4 md:mx-0 md:my-4 text-zinc-500 text-sm">OR</span>
                            <div className="flex-grow border-t md:border-t-0 md:border-l border-zinc-800 h-0 md:h-full w-full md:w-0"></div>
                        </div>

                        {/* Right Side: Social Login */}
                        <div className="flex-1 flex flex-col justify-center space-y-3">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                disabled={loading}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {/* Google Icon SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('apple')}
                                disabled={loading}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {/* Apple Icon SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.62 1.03.06 2.04.5 2.87 1.25-1.98 1.16-2.09 4.3.36 5.51.13.06.28.11.44.17-.46 2.47-1.57 5.17-3.12 6.92zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Apple
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('facebook')}
                                disabled={loading}
                                className="w-full bg-[#1877F2] text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-[#166fe5] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {/* Facebook Icon SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-zinc-500 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:text-red-500 transition-colors font-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
