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
import TrackRow, { TrackData } from './TrackRow';
import { generateSlug } from '@/lib/admin-utils';
import { Plus, UserPlus, ChevronDown } from 'lucide-react';
import { adminGetArtists, adminCreateArtist } from '@/lib/admin-api';

interface ArtistOption {
    id: number;
    name: string;
    slug: string;
}

interface ReleaseFormData {
    title: string;
    slug: string;
    artist: string;
    artistSlug: string;
    releaseDate: string;
    type: string;
    coverUrl: string;
    gradient: string;
    streamUrl: string;
    spotifyUrl: string;
    appleUrl: string;
    featured: boolean;
    description: string;
    tracks: TrackData[];
}

const defaultForm: ReleaseFormData = {
    title: '', slug: '', artist: '', artistSlug: '', releaseDate: '',
    type: 'Single', coverUrl: '', gradient: 'from-gray-700 via-gray-800 to-black',
    streamUrl: '', spotifyUrl: '', appleUrl: '', featured: false, description: '', tracks: [],
};

interface ReleaseFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Record<string, unknown> | null;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isLoading?: boolean;
}

export default function ReleaseForm({ open, onOpenChange, initialData, onSubmit, isLoading }: ReleaseFormProps) {
    const [form, setForm] = useState<ReleaseFormData>(defaultForm);
    const [artists, setArtists] = useState<ArtistOption[]>([]);
    const [loadingArtists, setLoadingArtists] = useState(false);
    const [showNewArtist, setShowNewArtist] = useState(false);
    const [newArtistName, setNewArtistName] = useState('');
    const [creatingArtist, setCreatingArtist] = useState(false);

    // Load artists when form opens
    useEffect(() => {
        if (!open) return;
        setLoadingArtists(true);
        adminGetArtists()
            .then((data) => setArtists((data as ArtistOption[]).map((a) => ({ id: a.id, name: a.name, slug: a.slug }))))
            .catch(() => { })
            .finally(() => setLoadingArtists(false));
    }, [open]);

    useEffect(() => {
        if (initialData) {
            const tracks = ((initialData.tracks as Record<string, unknown>[]) ?? []).map((t, i) => ({
                id: Number(t.id),
                title: String(t.title ?? ''),
                duration: String(t.duration ?? '0:00'),
                featuring: String(t.featuring ?? ''),
                trackNumber: Number(t.trackNumber ?? i + 1),
                audioUrl: String(t.audioUrl ?? ''),
            }));
            setForm({
                title: String(initialData.title ?? ''),
                slug: String(initialData.slug ?? ''),
                artist: String(initialData.artist ?? ''),
                artistSlug: String(initialData.artistSlug ?? ''),
                releaseDate: String(initialData.releaseDate ?? ''),
                type: String(initialData.type ?? 'Single'),
                coverUrl: String(initialData.coverImage ?? ''),
                gradient: String(initialData.gradient ?? 'from-gray-700 via-gray-800 to-black'),
                streamUrl: String(initialData.streamUrl ?? ''),
                spotifyUrl: String(initialData.spotifyUrl ?? ''),
                appleUrl: String(initialData.appleMusicUrl ?? ''),
                featured: Boolean(initialData.featured),
                description: String(initialData.description ?? ''),
                tracks,
            });
        } else {
            setForm(defaultForm);
        }
        setShowNewArtist(false);
        setNewArtistName('');
    }, [initialData, open]);

    function set(key: keyof ReleaseFormData, value: unknown) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleTitleChange(title: string) {
        set('title', title);
        if (!initialData) set('slug', generateSlug(title));
        // For singles, keep the track title in sync with the release title
        setForm((prev) => {
            if (prev.type === 'Single' && prev.tracks.length === 1) {
                const tracks = [{ ...prev.tracks[0], title }];
                return { ...prev, title, tracks };
            }
            return { ...prev, title };
        });
    }

    function handleTypeChange(type: string) {
        set('type', type);
        // Auto-add one track for Singles if none exist
        if (type === 'Single') {
            setForm((prev) => ({
                ...prev,
                type,
                tracks: prev.tracks.length === 0
                    ? [{ title: prev.title, duration: '0:00', featuring: '', trackNumber: 1, audioUrl: '' }]
                    : prev.tracks.slice(0, 1), // Singles only have 1 track
            }));
        }
    }

    function handleArtistSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        if (val === '__new__') {
            setShowNewArtist(true);
            return;
        }
        setShowNewArtist(false);
        const found = artists.find((a) => a.slug === val);
        if (found) {
            set('artist', found.name);
            set('artistSlug', found.slug);
        } else {
            set('artist', '');
            set('artistSlug', '');
        }
    }

    async function handleCreateArtist() {
        if (!newArtistName.trim()) return;
        setCreatingArtist(true);
        try {
            const slug = generateSlug(newArtistName);
            const created = await adminCreateArtist({
                name: newArtistName.trim(),
                slug,
                genre: '',
                bio: '',
                short_bio: '',
                location: 'Lagos, Nigeria',
                image_url: '',
                cover_url: '',
                gradient: 'from-gray-700 via-gray-800 to-black',
                featured: 0,
                stat_albums: 0, stat_singles: 0, stat_awards: 0, stat_followers: '0',
                social_instagram: '', social_twitter: '', social_youtube: '', social_spotify: '',
            }) as ArtistOption;
            const newArtist = { id: created.id, name: newArtistName.trim(), slug };
            setArtists((prev) => [...prev, newArtist]);
            set('artist', newArtist.name);
            set('artistSlug', newArtist.slug);
            setShowNewArtist(false);
            setNewArtistName('');
        } catch { /* ignore */ } finally {
            setCreatingArtist(false);
        }
    }

    function addTrack() {
        setForm((prev) => ({
            ...prev,
            tracks: [...prev.tracks, { title: '', duration: '0:00', featuring: '', trackNumber: prev.tracks.length + 1, audioUrl: '' }],
        }));
    }

    function updateTrack(index: number, data: Partial<TrackData>) {
        setForm((prev) => {
            const tracks = [...prev.tracks];
            tracks[index] = { ...tracks[index], ...data };
            return { ...prev, tracks };
        });
    }

    function removeTrack(index: number) {
        setForm((prev) => ({
            ...prev,
            tracks: prev.tracks.filter((_, i) => i !== index).map((t, i) => ({ ...t, trackNumber: i + 1 })),
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({
            title: form.title, slug: form.slug, artist: form.artist, artist_slug: form.artistSlug,
            release_date: form.releaseDate, type: form.type, cover_url: form.coverUrl,
            gradient: form.gradient, stream_url: form.streamUrl, spotify_url: form.spotifyUrl,
            apple_url: form.appleUrl, featured: form.featured ? 1 : 0, description: form.description,
            tracks: form.tracks.map((t, i) => ({
                id: t.id, title: t.title, duration: t.duration, featuring: t.featuring,
                track_number: i + 1, audio_url: t.audioUrl,
            })),
        });
    }

    const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">{initialData ? 'Edit Release' : 'Add Release'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Title *</label>
                            <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                        </div>
                        <div>
                            <label className={labelClass}>Slug *</label>
                            <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
                        </div>
                    </div>

                    {/* Artist selector */}
                    <div>
                        <label className={labelClass}>Artist</label>
                        <div className="relative">
                            <select
                                className={`${inputClass} appearance-none pr-8`}
                                value={form.artistSlug || ''}
                                onChange={handleArtistSelect}
                                disabled={loadingArtists}
                            >
                                <option value="">{loadingArtists ? 'Loading artists...' : '— Select artist —'}</option>
                                {artists.map((a) => (
                                    <option key={a.slug} value={a.slug}>{a.name}</option>
                                ))}
                                <option value="__new__">＋ Create new artist...</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Show selected artist name (read-only confirmation) */}
                        {form.artist && !showNewArtist && (
                            <p className="text-xs text-[#8B9D7F] mt-1">Selected: {form.artist} ({form.artistSlug})</p>
                        )}

                        {/* Create new artist inline */}
                        {showNewArtist && (
                            <div className="mt-2 flex gap-2 items-center bg-gray-800 rounded-lg p-3 border border-gray-600">
                                <UserPlus className="w-4 h-4 text-[#8B9D7F] flex-shrink-0" />
                                <input
                                    type="text"
                                    value={newArtistName}
                                    onChange={(e) => setNewArtistName(e.target.value)}
                                    placeholder="New artist name"
                                    className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateArtist())}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateArtist}
                                    disabled={creatingArtist || !newArtistName.trim()}
                                    className="px-3 py-1 rounded text-white text-xs font-medium transition-colors disabled:opacity-50"
                                    style={{ backgroundColor: '#8B9D7F' }}
                                >
                                    {creatingArtist ? 'Creating...' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowNewArtist(false); setNewArtistName(''); }}
                                    className="text-gray-400 hover:text-white text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Release Date</label>
                            <input type="date" className={inputClass} value={form.releaseDate} onChange={(e) => set('releaseDate', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Type</label>
                            <select className={inputClass} value={form.type} onChange={(e) => handleTypeChange(e.target.value)}>
                                {['Album', 'EP', 'Single', 'Compilation'].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <ImageUploadField label="Cover Image URL" value={form.coverUrl} onChange={(v) => set('coverUrl', v)} />
                    <div>
                        <label className={labelClass}>Gradient</label>
                        <input className={inputClass} value={form.gradient} onChange={(e) => set('gradient', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {(['streamUrl', 'spotifyUrl', 'appleUrl'] as const).map((k) => (
                            <div key={k}>
                                <label className={labelClass}>{k.replace('Url', '').replace(/([A-Z])/g, ' $1').trim()}</label>
                                <input className={inputClass} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder="https://..." />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} />
                        <label className="text-sm text-gray-300">Featured Release</label>
                    </div>

                    {/* Tracks */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-300">
                                {form.type === 'Single' ? 'Song' : `Tracks (${form.tracks.length})`}
                            </label>
                            {form.type !== 'Single' && (
                                <button type="button" onClick={addTrack} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors" style={{ backgroundColor: '#8B9D7F22', color: '#8B9D7F' }}>
                                    <Plus className="w-3.5 h-3.5" /> Add Track
                                </button>
                            )}
                        </div>
                        {form.type === 'Single' && form.tracks.length === 0 && (
                            <button
                                type="button"
                                onClick={addTrack}
                                className="w-full py-3 border border-dashed border-gray-600 rounded-lg text-gray-400 text-sm hover:border-[#8B9D7F] hover:text-[#8B9D7F] transition-colors"
                            >
                                + Add song details
                            </button>
                        )}
                        <div className="space-y-3">
                            {form.tracks.map((track, i) => (
                                <TrackRow key={i} track={track} index={i} onChange={updateTrack} onRemove={removeTrack} />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: '#8B9D7F' }}>
                            {isLoading ? 'Saving...' : initialData ? 'Update Release' : 'Create Release'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

