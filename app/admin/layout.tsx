'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAdminAuth();
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated && !isLoginPage) {
            router.replace('/admin/login');
        }
        if (isAuthenticated && isLoginPage) {
            router.replace('/admin/dashboard');
        }
    }, [isAuthenticated, isLoading, isLoginPage, router]);

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
