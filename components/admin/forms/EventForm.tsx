'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { generateSlug } from '@/lib/admin-utils';

interface EventFormData {
    title: string; slug: string; artist: string; artistSlug: string;
    venue: string; location: string; eventDate: string; isoDate: string;
    eventTime: string; ticketUrl: string; coverUrl: string; gradient: string;
    featured: boolean; description: string;
}

const defaultForm: EventFormData = {
    title: '', slug: '', artist: '', artistSlug: '', venue: '', location: '',
    eventDate: '', isoDate: '', eventTime: '', ticketUrl: '/contact',
    coverUrl: '', gradient: 'from-gray-700 via-gray-800 to-black', featured: false, description: '',
};

interface EventFormProps {
    open: boolean; onOpenChange: (open: boolean) => void;
    initialData?: Record<string, unknown> | null;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isLoading?: boolean;
}

export default function EventForm({ open, onOpenChange, initialData, onSubmit, isLoading }: EventFormProps) {
    const [form, setForm] = useState<EventFormData>(defaultForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: String(initialData.title ?? ''), slug: String(initialData.slug ?? ''),
                artist: String(initialData.artist ?? ''), artistSlug: String(initialData.artistSlug ?? ''),
                venue: String(initialData.venue ?? ''), location: String(initialData.location ?? ''),
                eventDate: String(initialData.date ?? ''), isoDate: String(initialData.isoDate ?? ''),
                eventTime: String(initialData.time ?? ''), ticketUrl: String(initialData.ticketUrl ?? '/contact'),
                coverUrl: String(initialData.coverImage ?? ''),
                gradient: String(initialData.gradient ?? 'from-gray-700 via-gray-800 to-black'),
                featured: Boolean(initialData.featured), description: String(initialData.description ?? ''),
            });
        } else {
            setForm(defaultForm);
        }
    }, [initialData, open]);

    function set(key: keyof EventFormData, value: unknown) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleTitleChange(title: string) {
        set('title', title);
        if (!initialData) set('slug', generateSlug(title));
    }

    function handleIsoDateChange(isoDate: string) {
        set('isoDate', isoDate);
        if (isoDate) {
            const d = new Date(isoDate);
            set('eventDate', d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({
            title: form.title, slug: form.slug, artist: form.artist, artist_slug: form.artistSlug,
            venue: form.venue, location: form.location, event_date: form.eventDate, iso_date: form.isoDate,
            event_time: form.eventTime, ticket_url: form.ticketUrl, cover_url: form.coverUrl,
            gradient: form.gradient, featured: form.featured ? 1 : 0, description: form.description,
        });
    }

    const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">{initialData ? 'Edit Event' : 'Add Event'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Title *</label><input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required /></div>
                        <div><label className={labelClass}>Slug *</label><input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Artist</label><input className={inputClass} value={form.artist} onChange={(e) => set('artist', e.target.value)} /></div>
                        <div><label className={labelClass}>Artist Slug</label><input className={inputClass} value={form.artistSlug} onChange={(e) => set('artistSlug', e.target.value)} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Venue</label><input className={inputClass} value={form.venue} onChange={(e) => set('venue', e.target.value)} /></div>
                        <div><label className={labelClass}>Location</label><input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div><label className={labelClass}>Date (ISO)</label><input type="date" className={inputClass} value={form.isoDate} onChange={(e) => handleIsoDateChange(e.target.value)} /></div>
                        <div><label className={labelClass}>Display Date</label><input className={inputClass} value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} placeholder="Dec 15, 2024" /></div>
                        <div><label className={labelClass}>Time</label><input className={inputClass} value={form.eventTime} onChange={(e) => set('eventTime', e.target.value)} placeholder="8:00 PM" /></div>
                    </div>
                    <div><label className={labelClass}>Ticket URL</label><input className={inputClass} value={form.ticketUrl} onChange={(e) => set('ticketUrl', e.target.value)} /></div>
                    <ImageUploadField label="Cover Image URL" value={form.coverUrl} onChange={(v) => set('coverUrl', v)} />
                    <div><label className={labelClass}>Gradient</label><input className={inputClass} value={form.gradient} onChange={(e) => set('gradient', e.target.value)} /></div>
                    <div><label className={labelClass}>Description</label><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
                    <div className="flex items-center gap-3"><Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} /><label className="text-sm text-gray-300">Featured Event</label></div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50" style={{ backgroundColor: '#8B9D7F' }}>
                            {isLoading ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
