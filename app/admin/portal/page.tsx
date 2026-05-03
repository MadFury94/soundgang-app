'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/portal/releases');
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#8B9D7F] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
