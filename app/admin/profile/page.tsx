'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';

const PROFILE_KEY = 'sg_admin_profile';

interface Profile {
    username: string;
    email: string;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<Profile>({ username: 'soundgang', email: 'admin@soundgang.ng' });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem(PROFILE_KEY);
            if (stored) setProfile(JSON.parse(stored) as Profile);
        } catch { /* ignore */ }
    }, []);

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password && password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

        if (password) {
            // Store new password hint (actual auth uses Worker ADMIN_SECRET)
            localStorage.setItem('sg_admin_pw_hint', 'updated');
        }

        setSaved(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">Profile</h1>
                <p className="text-gray-400 text-sm">Update your admin account details</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
                {/* Avatar placeholder */}
                <div className="flex items-center gap-4 bg-gray-800 rounded-xl p-5">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8B9D7F22' }}>
                        <User className="w-8 h-8" style={{ color: '#8B9D7F' }} />
                    </div>
                    <div>
                        <p className="text-white font-semibold">{profile.username}</p>
                        <p className="text-gray-400 text-sm">{profile.email}</p>
                        <p className="text-gray-500 text-xs mt-0.5">Administrator</p>
                    </div>
                </div>

                {/* Account info */}
                <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <h2 className="text-white font-semibold text-sm">Account Information</h2>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={profile.username}
                                onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B9D7F] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B9D7F] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Change password */}
                <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <h2 className="text-white font-semibold text-sm">Change Password</h2>
                    <p className="text-gray-500 text-xs">
                        Note: The actual login password is set via <code className="text-[#8B9D7F]">wrangler secret put ADMIN_SECRET</code> on the Worker. This field is for reference only.
                    </p>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B9D7F] transition-colors placeholder-gray-600"
                            />
                            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B9D7F] transition-colors placeholder-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all"
                    style={{ backgroundColor: saved ? '#22c55e' : '#8B9D7F' }}
                >
                    {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
