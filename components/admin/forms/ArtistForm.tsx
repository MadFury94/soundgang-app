'use client';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { generateSlug } from '@/lib/admin-utils';

interface ArtistFormData {
    name: string;
    slug: string;
    genre: string;
    shortBio: string;
    bio: string;
    location: string;
    imageUrl: string;
    coverUrl: string;
    gradient: string;
    featured: boolean;
    statAlbums: number;
    statSingles: number;
    statAwards: number;
    statFollowers: string;
    socialInstagram: string;
    socialTwitter: string;
    socialYoutube: string;
    socialSpotify: string;
}

const defaultForm: ArtistFormData = {
    name: '', slug: '', genre: '', shortBio: '', bio: '',
    location: 'Lagos, Nigeria', imageUrl: '', coverUrl: '',
    gradient: 'from-gray-700 via-gray-800 to-black', featured: false,
    statAlbums: 0, statSingles: 0, statAwards: 0, statFollowers: '0',
    socialInstagram: '', socialTwitter: '', socialYoutube: '', socialSpotify: '',
};

interface ArtistFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Record<string, unknown> | null;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isLoading?: boolean;
}

export default function ArtistForm({ open, onOpenChange, initialData, onSubmit, isLoading }: ArtistFormProps) {
    const [form, setForm] = useState<ArtistFormData>(defaultForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: String(initialData.name ?? ''),
                slug: String(initialData.slug ?? ''),
                genre: String(initialData.genre ?? ''),
                shortBio: String(initialData.shortBio ?? ''),
                bio: String(initialData.bio ?? ''),
                location: String(initialData.location ?? 'Lagos, Nigeria'),
                imageUrl: String(initialData.image ?? ''),
                coverUrl: String(initialData.coverImage ?? ''),
                gradient: String(initialData.gradient ?? 'from-gray-700 via-gray-800 to-black'),
                featured: Boolean(initialData.featured),
                statAlbums: Number((initialData.stats as Record<string, unknown>)?.albums ?? 0),
                statSingles: Number((initialData.stats as Record<string, unknown>)?.singles ?? 0),
                statAwards: Number((initialData.stats as Record<string, unknown>)?.awards ?? 0),
                statFollowers: String((initialData.stats as Record<string, unknown>)?.followers ?? '0'),
                socialInstagram: String((initialData.social as Record<string, unknown>)?.instagram ?? ''),
                socialTwitter: String((initialData.social as Record<string, unknown>)?.twitter ?? ''),
                socialYoutube: String((initialData.social as Record<string, unknown>)?.youtube ?? ''),
                socialSpotify: String((initialData.social as Record<string, unknown>)?.spotify ?? ''),
            });
        } else {
            setForm(defaultForm);
        }
    }, [initialData, open]);

    function set(key: keyof ArtistFormData, value: unknown) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleNameChange(name: string) {
        set('name', name);
        if (!initialData) set('slug', generateSlug(name));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({
            name: form.name, slug: form.slug, genre: form.genre,
            short_bio: form.shortBio, bio: form.bio, location: form.location,
            image_url: form.imageUrl, cover_url: form.coverUrl, gradient: form.gradient,
            featured: form.featured ? 1 : 0,
            stat_albums: form.statAlbums, stat_singles: form.statSingles,
            stat_awards: form.statAwards, stat_followers: form.statFollowers,
            social_instagram: form.socialInstagram, social_twitter: form.socialTwitter,
            social_youtube: form.socialYoutube, social_spotify: form.socialSpotify,
        });
    }

    const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">{initialData ? 'Edit Artist' : 'Add Artist'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Name *</label>
                            <input className={inputClass} value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
                        </div>
                        <div>
                            <label className={labelClass}>Slug *</label>
                            <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Genre</label>
                            <input className={inputClass} value={form.genre} onChange={(e) => set('genre', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Location</label>
                            <input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Short Bio</label>
                        <textarea className={inputClass} rows={2} value={form.shortBio} onChange={(e) => set('shortBio', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Full Bio</label>
                        <textarea className={inputClass} rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
                    </div>
                    <ImageUploadField label="Artist Image URL" value={form.imageUrl} onChange={(v) => set('imageUrl', v)} />
                    <ImageUploadField label="Cover Image URL" value={form.coverUrl} onChange={(v) => set('coverUrl', v)} />
                    <div>
                        <label className={labelClass}>Gradient (Tailwind classes)</label>
                        <input className={inputClass} value={form.gradient} onChange={(e) => set('gradient', e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} />
                        <label className="text-sm text-gray-300">Featured Artist</label>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {(['statAlbums', 'statSingles', 'statAwards'] as const).map((k) => (
                            <div key={k}>
                                <label className={labelClass}>{k.replace('stat', '')}</label>
                                <input type="number" className={inputClass} value={form[k]} onChange={(e) => set(k, Number(e.target.value))} />
                            </div>
                        ))}
                        <div>
                            <label className={labelClass}>Followers</label>
                            <input className={inputClass} value={form.statFollowers} onChange={(e) => set('statFollowers', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {(['socialInstagram', 'socialTwitter', 'socialYoutube', 'socialSpotify'] as const).map((k) => (
                            <div key={k}>
                                <label className={labelClass}>{k.replace('social', '')}</label>
                                <input className={inputClass} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder="https://..." />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: '#8B9D7F' }}>
                            {isLoading ? 'Saving...' : initialData ? 'Update Artist' : 'Create Artist'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
