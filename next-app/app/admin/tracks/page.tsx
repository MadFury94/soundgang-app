'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Music } from 'lucide-react';
import { toast } from 'sonner';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TrackForm from '@/components/admin/forms/TrackForm';
import {
    adminGetTracks,
    adminCreateTrack,
    adminUpdateTrack,
    adminDeleteTrack,
} from '@/lib/admin-api';

interface Track {
    id: number;
    title: string;
    artistName?: string;
    releaseTitle?: string;
    duration?: string;
    audioUrl?: string;
    [key: string]: unknown;
}

export default function TracksPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function load() {
        try {
            const data = await adminGetTracks({ standalone: true });
            setTracks(data as Track[]);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to load tracks');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleSubmit(data: Record<string, unknown>) {
        setSaving(true);
        try {
            if (editingTrack) {
                await adminUpdateTrack(editingTrack.id, data);
                toast.success('Track updated');
            } else {
                await adminCreateTrack(data);
                toast.success('Track created');
            }
            setFormOpen(false);
            setEditingTrack(null);
            await load();
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await adminDeleteTrack(deleteId);
            toast.success('Track deleted');
            setDeleteId(null);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete track');
        } finally {
            setDeleting(false);
        }
    }

    const columns = [
        {
            key: 'title',
            label: 'Title',
            render: (row: Track) => (
                <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>{row.title}</span>
                </div>
            ),
        },
        {
            key: 'artistName',
            label: 'Artist',
            render: (row: Track) => <span>{row.artistName ?? '—'}</span>,
        },
        {
            key: 'releaseTitle',
            label: 'Release',
            render: (row: Track) => <span>{row.releaseTitle ?? '—'}</span>,
        },
        {
            key: 'duration',
            label: 'Duration',
            render: (row: Track) => <span>{row.duration ?? '—'}</span>,
        },
        {
            key: 'audioUrl',
            label: 'Audio',
            render: (row: Track) =>
                row.audioUrl ? (
                    <a
                        href={row.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B9D7F] hover:underline text-sm"
                    >
                        Preview
                    </a>
                ) : (
                    <span>—</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Track) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => { setEditingTrack(row); setFormOpen(true); }}
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
                    <h2 className="text-white font-semibold text-xl">Tracks</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{tracks.length} standalone track{tracks.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => { setEditingTrack(null); setFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#8B9D7F' }}
                >
                    <Plus className="w-4 h-4" /> Add Track
                </button>
            </div>

            <ContentTable
                columns={columns}
                data={tracks}
                isLoading={loading}
                emptyMessage="No standalone tracks yet. Click 'Add Track' to create one."
            />

            <TrackForm
                open={formOpen}
                onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingTrack(null); }}
                initialData={editingTrack}
                onSubmit={handleSubmit}
                isLoading={saving}
            />

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
                title="Delete Track"
                description="Are you sure you want to delete this track? This action cannot be undone."
                onConfirm={handleDelete}
                isLoading={deleting}
            />
        </div>
    );
}
