'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Disc3 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import {
    adminGetReleases,
    adminDeleteRelease,
} from '@/lib/admin-api';

interface Release {
    id: number;
    title: string;
    artist: string;
    type: string;
    releaseDate: string;
    featured: boolean;
    coverImage?: string;
    [key: string]: unknown;
}

export default function ReleasesPage() {
    const router = useRouter();
    const [releases, setReleases] = useState<Release[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    async function load() {
        try {
            const data = await adminGetReleases();
            setReleases(data as Release[]);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to load releases');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await adminDeleteRelease(deleteId);
            toast.success('Release deleted');
            setDeleteId(null);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete release');
        } finally {
            setDeleting(false);
        }
    }

    const columns = [
        {
            key: 'cover',
            label: 'Cover',
            render: (row: Release) => (
                <div className="w-10 h-10 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    {row.coverImage ? (
                        <Image src={row.coverImage} alt={row.title} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Disc3 className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                </div>
            ),
        },
        { key: 'title', label: 'Title' },
        { key: 'artist', label: 'Artist' },
        {
            key: 'type',
            label: 'Type',
            render: (row: Release) => (
                <Badge variant="outline" className="border-gray-600 text-gray-300">{row.type}</Badge>
            ),
        },
        { key: 'releaseDate', label: 'Date' },
        {
            key: 'featured',
            label: 'Featured',
            render: (row: Release) => (
                <Badge variant={row.featured ? 'default' : 'secondary'} style={row.featured ? { backgroundColor: '#8B9D7F' } : {}}>
                    {row.featured ? 'Yes' : 'No'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Release) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/admin/releases/${row.id}`)}
                        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeleteId(row.id)}
                        className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-white font-semibold text-xl">Releases</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{releases.length} total</p>
                </div>
                <button
                    onClick={() => router.push('/admin/releases/new')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#8B9D7F' }}
                >
                    <Plus className="w-4 h-4" /> Add Release
                </button>
            </div>

            <ContentTable columns={columns} data={releases} isLoading={loading} emptyMessage="No releases yet." />

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
                title="Delete Release"
                description="Are you sure you want to delete this release? All tracks will also be deleted."
                onConfirm={handleDelete}
                isLoading={deleting}
            />
        </div>
    );
}
