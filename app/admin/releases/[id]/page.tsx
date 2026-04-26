'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from '@/components/admin/ImageUploadField';
import TrackEditor from '@/components/admin/TrackEditor';
import { TrackData } from '@/components/admin/forms/TrackRow';
import { useAuth } from '@/hooks/useAuth';
import { adminGetRelease, adminUpdateRelease, adminGetArtists } from '@/lib/admin-api';
import { generateSlug } from '@/lib/admin-utils';

interface ArtistOption { id: number; name: string; slug: string; }

interface ReleaseForm {
    title: string; slug: string; artist: string; artistSlug: string;
    releaseDate: string; type: string; coverUrl: string; gradient: string;
    streamUrl: string; spotifyUrl: string; appleUrl: string;
    featured: boolean; description: string; tracks: TrackData[];
}

const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

export default function ReleaseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [saving, setSaving] = useState(false);
    const [artists, setArtists] = useState<ArtistOption[]>([]);
    const [form, setForm] = useState<ReleaseForm>({
        title: '', slug: '', artist: '', artistSlug: '', releaseDate: '',
        type: 'Single', coverUrl: '', gradient: 'from-gray-700 via-gray-800 to-black',
        streamUrl: '', spotifyUrl: '', appleUrl: '', featured: false, description: '', tracks: [],
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/admin/login');
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        adminGetArtists()
            .then((data) => setArtists((data as ArtistOption[]).map((a) => ({ id: a.id, name: a.name, slug: a.slug }))))
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!id) return;
        adminGetRelease(Number(id))
            .then((data) => {
                const r = data as Record<string, unknown>;
                const tracks = ((r.tracks as Record<string, unknown>[]) ?? []).map((t, i) => ({
                    id: Number(t.id), title: String(t.title ?? ''), duration: String(t.duration ?? '0:00'),
                    featuring: String(t.featuring ?? ''), trackNumber: Number(t.trackNumber ?? i + 1), audioUrl: String(t.audioUrl ?? ''),
                }));
                setForm({
                    title: String(r.title ?? ''), slug: String(r.slug ?? ''), artist: String(r.artist ?? ''),
                    artistSlug: String(r.artistSlug ?? ''), releaseDate: String(r.releaseDate ?? ''),
                    type: String(r.type ?? 'Single'), coverUrl: String(r.coverImage ?? ''),
                    gradient: String(r.gradient ?? 'from-gray-700 via-gray-800 to-black'),
                    streamUrl: String(r.streamUrl ?? ''), spotifyUrl: String(r.spotifyUrl ?? ''),
                    appleUrl: String(r.appleMusicUrl ?? ''), featured: Boolean(r.featured),
                    description: String(r.description ?? ''), tracks,
                });
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    function set<K extends keyof ReleaseForm>(key: K, value: ReleaseForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleArtistSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const found = artists.find((a) => a.slug === e.target.value);
        if (found) setForm((prev) => ({ ...prev, artist: found.name, artistSlug: found.slug }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await adminUpdateRelease(Number(id), {
                title: form.title, slug: form.slug, artist: form.artist, artist_slug: form.artistSlug,
                release_date: form.releaseDate, type: form.type, cover_url: form.coverUrl,
                gradient: form.gradient, stream_url: form.streamUrl, spotify_url: form.spotifyUrl,
                apple_url: form.appleUrl, featured: form.featured ? 1 : 0, description: form.description,
                tracks: form.tracks.map((t, i) => ({
                    id: t.id, title: t.title, duration: t.duration,
                    featuring: t.featuring, track_number: i + 1, audio_url: t.audioUrl,
                })),
            });
            toast.success('Release updated');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update release');
        } finally {
            setSaving(false);
        }
    }

    if (authLoading || loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B9D7F' }} />
        </div>
    );

    if (notFound) return (
        <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Release not found.</p>
            <Link href="/admin/releases" className="text-[#8B9D7F] hover:underline">Back to releases</Link>
        </div>
    );

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/admin/releases" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-white text-xl font-bold">Edit Release</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Title *</label>
                        <input className={inputClass} value={form.title}
                            onChange={(e) => { set('title', e.target.value); if (!form.slug) set('slug', generateSlug(e.target.value)); }}
                            required />
                    </div>
                    <div>
                        <label className={labelClass}>Slug *</label>
                        <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Artist</label>
                    <div className="relative">
                        <select className={`${inputClass} appearance-none pr-8`} value={form.artistSlug} onChange={handleArtistSelect}>
                            <option value="">— Select artist —</option>
                            {artists.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {form.artist && <p className="text-xs text-[#8B9D7F] mt-1">Selected: {form.artist}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Release Date</label>
                        <input type="date" className={inputClass} value={form.releaseDate} onChange={(e) => set('releaseDate', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Type</label>
                        <select className={inputClass} value={form.type} onChange={(e) => set('type', e.target.value)}>
                            {['Album', 'EP', 'Single', 'Compilation'].map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <ImageUploadField label="Cover Image" value={form.coverUrl} onChange={(v) => set('coverUrl', v)} />
                <div>
                    <label className={labelClass}>Gradient</label>
                    <input className={inputClass} value={form.gradient} onChange={(e) => set('gradient', e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(['streamUrl', 'spotifyUrl', 'appleUrl'] as const).map((k) => (
                        <div key={k}>
                            <label className={labelClass}>{k === 'streamUrl' ? 'Stream URL' : k === 'spotifyUrl' ? 'Spotify URL' : 'Apple Music URL'}</label>
                            <input className={inputClass} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder="https://..." />
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} />
                    <label className="text-sm text-gray-300">Featured Release</label>
                </div>
                <div>
                    <label className={labelClass}>Description</label>
                    <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
                </div>
                <div>
                    <h3 className="text-white font-semibold text-sm mb-3">Tracks ({form.tracks.length})</h3>
                    <TrackEditor tracks={form.tracks} onChange={(tracks) => set('tracks', tracks)} />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving}
                        className="px-6 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#8B9D7F' }}>
                        {saving ? 'Saving...' : 'Save Release'}
                    </button>
                </div>
            </form>
        </div>
    );
}
