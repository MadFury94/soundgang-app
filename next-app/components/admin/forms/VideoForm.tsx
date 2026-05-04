'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

interface VideoFormData {
    title: string; artist: string; artistSlug: string;
    youtubeId: string; thumbnail: string; videoDate: string;
}

const defaultForm: VideoFormData = {
    title: '', artist: '', artistSlug: '', youtubeId: '', thumbnail: '', videoDate: '',
};

interface VideoFormProps {
    open: boolean; onOpenChange: (open: boolean) => void;
    initialData?: Record<string, unknown> | null;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isLoading?: boolean;
}

export default function VideoForm({ open, onOpenChange, initialData, onSubmit, isLoading }: VideoFormProps) {
    const [form, setForm] = useState<VideoFormData>(defaultForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: String(initialData.title ?? ''), artist: String(initialData.artist ?? ''),
                artistSlug: String(initialData.artistSlug ?? ''), youtubeId: String(initialData.youtubeId ?? ''),
                thumbnail: String(initialData.thumbnail ?? ''), videoDate: String(initialData.date ?? ''),
            });
        } else {
            setForm(defaultForm);
        }
    }, [initialData, open]);

    function set(key: keyof VideoFormData, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleYoutubeIdChange(id: string) {
        set('youtubeId', id);
        if (id && !form.thumbnail) {
            set('thumbnail', `https://img.youtube.com/vi/${id}/hqdefault.jpg`);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({
            title: form.title, artist: form.artist, artist_slug: form.artistSlug,
            youtube_id: form.youtubeId, thumbnail: form.thumbnail, video_date: form.videoDate,
        });
    }

    const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-1';
    const ytThumb = form.youtubeId ? `https://img.youtube.com/vi/${form.youtubeId}/hqdefault.jpg` : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white">{initialData ? 'Edit Video' : 'Add Video'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div><label className={labelClass}>Title *</label><input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Artist</label><input className={inputClass} value={form.artist} onChange={(e) => set('artist', e.target.value)} /></div>
                        <div><label className={labelClass}>Artist Slug</label><input className={inputClass} value={form.artistSlug} onChange={(e) => set('artistSlug', e.target.value)} /></div>
                    </div>
                    <div>
                        <label className={labelClass}>YouTube ID</label>
                        <input className={inputClass} value={form.youtubeId} onChange={(e) => handleYoutubeIdChange(e.target.value)} placeholder="dQw4w9WgXcQ" />
                    </div>
                    {ytThumb && (
                        <div className="rounded-lg overflow-hidden border border-gray-700">
                            <Image src={ytThumb} alt="YouTube thumbnail" width={480} height={270} className="w-full" unoptimized />
                        </div>
                    )}
                    <div><label className={labelClass}>Thumbnail URL</label><input className={inputClass} value={form.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} placeholder="https://..." /></div>
                    <div><label className={labelClass}>Video Date</label><input type="date" className={inputClass} value={form.videoDate} onChange={(e) => set('videoDate', e.target.value)} /></div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50" style={{ backgroundColor: '#8B9D7F' }}>
                            {isLoading ? 'Saving...' : initialData ? 'Update Video' : 'Create Video'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
