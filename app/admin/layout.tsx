'use client';
export const runtime = 'edge';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const isLoginPage = pathname === '/admin/login';
    const isPortalPath = pathname.startsWith('/admin/portal');

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated && !isLoginPage) {
            router.replace('/admin/login');
            return;
        }
        if (isAuthenticated && isLoginPage) {
            router.replace(user?.role === 'artist' ? '/admin/portal' : '/admin/dashboard');
            return;
        }
        if (isAuthenticated && user?.role === 'artist' && !isPortalPath) {
            router.replace('/admin/portal');
            return;
        }
        if (isAuthenticated && user?.role === 'admin' && isPortalPath) {
            router.replace('/admin/dashboard');
        }
    }, [isAuthenticated, isLoading, isLoginPage, isPortalPath, user, router]);

    // Login page — no sidebar/header
    if (isLoginPage) {
        return (
            <>
                {children}
                <Toaster />
            </>
        );
    }

    // Loading state
    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#8B9D7F] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Artist users — minimal pass-through (portal has its own layout)
    if (user?.role === 'artist') {
        return (
            <>
                {children}
                <Toaster />
            </>
        );
    }

    // Admin users — full layout with sidebar + header
    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}
