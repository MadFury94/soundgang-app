'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Disc3, Calendar, FileText, Video, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';

const navItems = [
    { href: '/admin/portal/releases', label: 'Releases', icon: Disc3 },
    { href: '/admin/portal/events', label: 'Events', icon: Calendar },
    { href: '/admin/portal/blog', label: 'Blog', icon: FileText },
    { href: '/admin/portal/videos', label: 'Videos', icon: Video },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Logo + artist name */}
            <div className="p-4 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center justify-center mb-3">
                    <Image
                        src="/soundgang-logo.png"
                        alt="SoundGang"
                        width={120}
                        height={48}
                        className="object-contain h-10 w-auto"
                        priority
                    />
                </div>
                {user && (
                    <p className="text-center text-xs text-[#8B9D7F] font-medium truncate">
                        {user.email}
                    </p>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            style={active ? { backgroundColor: '#8B9D7F22', color: '#8B9D7F' } : {}}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" style={active ? { color: '#8B9D7F' } : {}} />
                            <span className="text-sm font-medium truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className="p-3 border-t border-gray-800 flex-shrink-0">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 w-full"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-56 bg-gray-950 border-r border-gray-800 h-screen sticky top-0 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile hamburger */}
            <div className="md:hidden fixed top-0 left-0 z-50 p-3">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg bg-gray-900 text-gray-400 hover:text-white"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
            )}

            <aside className={`md:hidden fixed top-0 left-0 z-50 h-full w-56 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6 pt-14 md:pt-6">
                    {children}
                </main>
            </div>

            <Toaster />
        </div>
    );
}
