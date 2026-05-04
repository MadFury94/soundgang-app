'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Mic2,
    Disc3,
    Music,
    Calendar,
    FileText,
    Video,
    LogOut,
    Menu,
    X,
    Upload,
    ListMusic,
    ChevronDown,
    ChevronRight,
    PlusCircle,
    List,
    Tag,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    children?: { href: string; label: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/artists', label: 'Artists', icon: Mic2 },
    { href: '/admin/releases', label: 'Releases', icon: Disc3 },
    { href: '/admin/tracks', label: 'Tracks', icon: Music },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    {
        href: '/admin/blog',
        label: 'Blog',
        icon: FileText,
        children: [
            { href: '/admin/blog', label: 'View All Posts', icon: List },
            { href: '/admin/blog/new', label: 'Add New', icon: PlusCircle },
            { href: '/admin/blog/categories', label: 'Categories', icon: Tag },
        ],
    },
    { href: '/admin/videos', label: 'Videos', icon: Video },
    { href: '/admin/media', label: 'Media Library', icon: Upload },
    { href: '/admin/player', label: 'Player & Playlist', icon: ListMusic },
    { href: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>(['/admin/blog']);

    const isActive = (href: string) => pathname === href;
    const isParentActive = (item: NavItem) =>
        pathname === item.href || pathname.startsWith(item.href + '/') ||
        item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'));

    function toggleExpand(href: string) {
        setExpandedItems((prev) =>
            prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
        );
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Logo */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-center flex-shrink-0">
                <Image
                    src="/soundgang-logo.png"
                    alt="SoundGang"
                    width={120}
                    height={48}
                    className="object-contain h-10 w-auto"
                    priority
                />
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const parentActive = isParentActive(item);
                    const isExpanded = expandedItems.includes(item.href);
                    const hasChildren = item.children && item.children.length > 0;

                    return (
                        <div key={item.href}>
                            {hasChildren ? (
                                // Parent with submenu
                                <button
                                    onClick={() => toggleExpand(item.href)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${parentActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    style={parentActive ? { backgroundColor: '#8B9D7F22', color: '#8B9D7F' } : {}}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" style={parentActive ? { color: '#8B9D7F' } : {}} />
                                    <span className="text-sm font-medium flex-1 text-left truncate">{item.label}</span>
                                    {isExpanded
                                        ? <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                        : <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                    }
                                </button>
                            ) : (
                                // Regular link
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive(item.href) ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    style={isActive(item.href) ? { backgroundColor: '#8B9D7F22', color: '#8B9D7F' } : {}}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" style={isActive(item.href) ? { color: '#8B9D7F' } : {}} />
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                </Link>
                            )}

                            {/* Submenu */}
                            {hasChildren && isExpanded && (
                                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-800 pl-3">
                                    {item.children!.map((child) => {
                                        const childActive = isActive(child.href);
                                        return (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${childActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                                style={childActive ? { backgroundColor: '#8B9D7F22', color: '#8B9D7F' } : {}}
                                            >
                                                <child.icon className="w-4 h-4 flex-shrink-0" style={childActive ? { color: '#8B9D7F' } : {}} />
                                                <span className="truncate">{child.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
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
        <>
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
        </>
    );
}
