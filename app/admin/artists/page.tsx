'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import {
    adminGetArtists,
    adminCreateArtist,
    adminDeleteArtist,
} from '@/lib/admin-api';
import ArtistForm from '@/components/admin/forms/ArtistForm';

interface Artist {
    id: number;
    name: string;
    genre: string;
    featured: boolean;
    [key: string]: unknown;
}

export default function ArtistsPage() {
    const router = useRouter();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    async function load() {
        try {
            const data = await adminGetArtists();
            setArtists(data as Artist[]);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to load artists');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleCreate(data: Record<string, unknown>) {
        setSaving(true);
        try {
            await adminCreateArtist(data);
            toast.success('Artist created');
            setFormOpen(false);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to create artist');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await adminDeleteArtist(deleteId);
            toast.success('Artist deleted');
            setDeleteId(null);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete artist');
        } finally {
            setDeleting(false);
        }
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'genre', label: 'Genre' },
        {
            key: 'featured',
            label: 'Featured',
            render: (row: Artist) => (
                <Badge variant={row.featured ? 'default' : 'secondary'} style={row.featured ? { backgroundColor: '#8B9D7F' } : {}}>
                    {row.featured ? 'Yes' : 'No'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Artist) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/admin/artists/${row.id}`)}
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
                    <h2 className="text-white font-semibold text-xl">Artists</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{artists.length} total</p>
                </div>
                <button
                    onClick={() => setFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#8B9D7F' }}
                >
                    <Plus className="w-4 h-4" />
                    Add Artist
                </button>
            </div>

            <ContentTable
                columns={columns}
                data={artists}
                isLoading={loading}
                emptyMessage="No artists yet. Add your first artist."
            />

            <ArtistForm
                open={formOpen}
                onOpenChange={setFormOpen}
                initialData={null}
                onSubmit={handleCreate}
                isLoading={saving}
            />

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
                title="Delete Artist"
                description="Are you sure you want to delete this artist? This action cannot be undone."
                onConfirm={handleDelete}
                isLoading={deleting}
            />
        </div>
    );
}
