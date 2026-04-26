'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import VideoForm from '@/components/admin/forms/VideoForm';
import { adminGetVideos, adminCreateVideo, adminUpdateVideo, adminDeleteVideo } from '@/lib/admin-api';

interface Video {
    id: number; title: string; artist: string; date: string; thumbnail?: string; youtubeId?: string;
    [key: string]: unknown;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<Video | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function load() {
        try { setVideos((await adminGetVideos()) as Video[]); }
        catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to load videos'); }
        finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    async function handleSubmit(data: Record<string, unknown>) {
        setSaving(true);
        try {
            if (editItem) { await adminUpdateVideo(editItem.id, data); toast.success('Video updated'); }
            else { await adminCreateVideo(data); toast.success('Video created'); }
            setFormOpen(false); setEditItem(null); await load();
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to save video'); }
        finally { setSaving(false); }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try { await adminDeleteVideo(deleteId); toast.success('Video deleted'); setDeleteId(null); await load(); }
        catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to delete video'); }
        finally { setDeleting(false); }
    }

    const columns = [
        {
            key: 'thumbnail', label: 'Thumbnail', render: (row: Video) => {
                const thumb = row.thumbnail || (row.youtubeId ? `https://img.youtube.com/vi/${row.youtubeId}/default.jpg` : null);
                return thumb ? (
                    <Image src={thumb} alt={row.title} width={80} height={45} className="rounded object-cover" unoptimized />
                ) : <div className="w-20 h-11 bg-gray-700 rounded" />;
            }
        },
        { key: 'title', label: 'Title' },
        { key: 'artist', label: 'Artist' },
        { key: 'date', label: 'Date' },
        {
            key: 'actions', label: 'Actions', render: (row: Video) => (
                <div className="flex gap-2">
                    <button onClick={() => { setEditItem(row); setFormOpen(true); }} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div><h2 className="text-white font-semibold text-xl">Videos</h2><p className="text-gray-400 text-sm mt-0.5">{videos.length} total</p></div>
                <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#8B9D7F' }}>
                    <Plus className="w-4 h-4" /> Add Video
                </button>
            </div>
            <ContentTable columns={columns} data={videos} isLoading={loading} emptyMessage="No videos yet." />
            <VideoForm open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditItem(null); }} initialData={editItem} onSubmit={handleSubmit} isLoading={saving} />
            <ConfirmDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }} title="Delete Video" description="Are you sure you want to delete this video?" onConfirm={handleDelete} isLoading={deleting} />
        </div>
    );
}
