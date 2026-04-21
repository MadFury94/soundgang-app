'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://soundgang-api.onochieazukaeme.workers.dev';
const ADMIN_USERNAME = 'soundgang'; // fixed username — change as needed

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        if (username.trim().toLowerCase() !== ADMIN_USERNAME) {
            setError('Invalid username or password.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/health`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${password}` },
            });

            if (res.status === 401) {
                setError('Invalid username or password.');
                return;
            }

            if (!res.ok) {
                setError('Unable to connect to the server. Please try again.');
                return;
            }

            const data = await res.json() as { status?: string; admin?: boolean };

            if (data.admin === true) {
                // Store token and redirect
                sessionStorage.setItem('sg_admin_token', password);
                router.replace('/admin/dashboard');
            } else {
                // Worker not yet redeployed with auth — fallback: accept any non-empty password
                // and store it (will fail on actual API calls if wrong)
                setError('Invalid username or password.');
            }
        } catch {
            setError('Connection failed. Check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B9D7F]/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/soundgang-logo.png"
                        alt="SoundGang"
                        width={160}
                        height={60}
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
                    <div className="text-center mb-6">
                        <h1 className="text-white text-xl font-semibold mb-1">Admin Access</h1>
                        <p className="text-gray-400 text-sm">Sign in to manage SoundGang content</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Admin username"
                                    autoComplete="username"
                                    autoFocus
                                    disabled={loading}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F] transition-colors disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Admin password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F] transition-colors disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            style={{ backgroundColor: '#8B9D7F' }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    SoundGang Record Label CMS
                </p>
            </div>
        </div>
    );
}
