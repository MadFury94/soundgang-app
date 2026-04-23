'use client';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminHeader() {
    const { logout } = useAuth();

    return (
        <header className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
            {/* Logo only — no page title text */}
            <Image
                src="/soundgang-logo.png"
                alt="SoundGang"
                width={80}
                height={32}
                className="object-contain h-8 w-auto"
                priority
            />
            <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800"
                aria-label="Sign out"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
            </button>
        </header>
    );
}
