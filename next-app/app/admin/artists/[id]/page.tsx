'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus, Disc3 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useAuth } from '@/hooks/useAuth';
import { adminGetArtistById, adminUpdateArtist, adminGetReleasesByArtist } from '@/lib/admin-api';
import { generateSlug } from '@/lib/admin-utils';

interface ArtistForm {
    name: string; slug: string; genre: string; bio: string; shortBio: string; location: string;
    imageUrl: string; coverUrl: string; gradient: string; featured: boolean;
    statAlbums: number; statSingles: number; statAwards: number; statFollowers: string;
    socialInstagram: string; socialTwitter: string; socialYoutube: string; socialSpotify: string;
}

interface LinkedRelease { id: number; title: string; type: string; releaseDate: string; coverImage?: string; }

const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

export default function ArtistDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [saving, setSaving] = useState(false);
    const [releases, setReleases] = useState<LinkedRelease[]>([]);
    const [form, setForm] = useState<ArtistForm>({
        name: '', slug: '', genre: '', bio: '', shortBio: '', location: 'Lagos, Nigeria',
        imageUrl: '', coverUrl: '', gradient: 'from-gray-700 via-gray-800 to-black', featured: false,
        statAlbums: 0, statSingles: 0, statAwards: 0, statFollowers: '0',
        socialInstagram: '', socialTwitter: '', socialYoutube: '', socialSpotify: '',
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/admin/login');
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!id) return;
        const numId = Number(id);
        Promise.all([adminGetArtistById(numId), adminGetReleasesByArtist(numId)])
            .then(([artistData, releasesData]) => {
                const a = artistData as Record<string, unknown>;
                const stats = (a.stats as Record<string, unknown>) ?? {};
                const social = (a.social as Record<string, unknown>) ?? {};
                setForm({
                    name: String(a.name ?? ''), slug: String(a.slug ?? ''), genre: String(a.genre ?? ''),
                    bio: String(a.bio ?? ''), shortBio: String(a.shortBio ?? ''), location: String(a.location ?? 'Lagos, Nigeria'),
                    imageUrl: String(a.image ?? ''), coverUrl: String(a.coverImage ?? ''),
                    gradient: String(a.gradient ?? 'from-gray-700 via-gray-800 to-black'), featured: Boolean(a.featured),
                    statAlbums: Number(stats.albums ?? 0), statSingles: Number(stats.singles ?? 0),
                    statAwards: Number(stats.awards ?? 0), statFollowers: String(stats.followers ?? '0'),
                    socialInstagram: String(social.instagram ?? ''), socialTwitter: String(social.twitter ?? ''),
                    socialYoutube: String(social.youtube ?? ''), socialSpotify: String(social.spotify ?? ''),
                });
                setReleases(releasesData as LinkedRelease[]);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    function set<K extends keyof ArtistForm>(key: K, value: ArtistForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await adminUpdateArtist(Number(id), {
                name: form.name, slug: form.slug, genre: form.genre, bio: form.bio,
                short_bio: form.shortBio, location: form.location, image_url: form.imageUrl,
                cover_url: form.coverUrl, gradient: form.gradient, featured: form.featured ? 1 : 0,
                stat_albums: form.statAlbums, stat_singles: form.statSingles,
                stat_awards: form.statAwards, stat_followers: form.statFollowers,
                social_instagram: form.socialInstagram, social_twitter: form.socialTwitter,
                social_youtube: form.socialYoutube, social_spotify: form.socialSpotify,
            });
            toast.success('Artist updated');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update artist');
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
            <p className="text-gray-400 mb-4">Artist not found.</p>
            <Link href="/admin/artists" className="text-[#8B9D7F] hover:underline">Back to artists</Link>
        </div>
    );

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/artists" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-white text-xl font-bold">Edit Artist</h1>
                </div>
                <button onClick={() => router.push(`/admin/releases/new?artist_id=${id}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#8B9D7F' }}>
                    <Plus className="w-4 h-4" /> New Release
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Name *</label>
                        <input className={inputClass} value={form.name}
                            onChange={(e) => { set('name', e.target.value); if (!form.slug) set('slug', generateSlug(e.target.value)); }}
                            required />
                    </div>
                    <div>
                        <label className={labelClass}>Slug *</label>
                        <input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>Genre</label><input className={inputClass} value={form.genre} onChange={(e) => set('genre', e.target.value)} /></div>
                    <div><label className={labelClass}>Location</label><input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
                </div>
                <div><label className={labelClass}>Short Bio</label><textarea className={inputClass} rows={2} value={form.shortBio} onChange={(e) => set('shortBio', e.target.value)} /></div>
                <div><label className={labelClass}>Full Bio</label><textarea className={inputClass} rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} /></div>
                <ImageUploadField label="Artist Image" value={form.imageUrl} onChange={(v) => set('imageUrl', v)} />
                <ImageUploadField label="Cover Image" value={form.coverUrl} onChange={(v) => set('coverUrl', v)} />
                <div><label className={labelClass}>Gradient</label><input className={inputClass} value={form.gradient} onChange={(e) => set('gradient', e.target.value)} /></div>
                <div className="flex items-center gap-3">
                    <Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} />
                    <label className="text-sm text-gray-300">Featured Artist</label>
                </div>
                <div>
                    <p className={labelClass}>Stats</p>
                    <div className="grid grid-cols-4 gap-3">
                        {([['statAlbums', 'Albums'], ['statSingles', 'Singles'], ['statAwards', 'Awards']] as [keyof ArtistForm, string][]).map(([k, l]) => (
                            <div key={k}><label className="block text-xs text-gray-400 mb-1">{l}</label>
                                <input type="number" className={inputClass} value={form[k] as number} onChange={(e) => set(k, Number(e.target.value) as ArtistForm[typeof k])} /></div>
                        ))}
                        <div><label className="block text-xs text-gray-400 mb-1">Followers</label>
                            <input className={inputClass} value={form.statFollowers} onChange={(e) => set('statFollowers', e.target.value)} /></div>
                    </div>
                </div>
                <div>
                    <p className={labelClass}>Social Links</p>
                    <div className="grid grid-cols-2 gap-3">
                        {([['socialInstagram', 'Instagram'], ['socialTwitter', 'Twitter'], ['socialYoutube', 'YouTube'], ['socialSpotify', 'Spotify']] as [keyof ArtistForm, string][]).map(([k, l]) => (
                            <div key={k}><label className="block text-xs text-gray-400 mb-1">{l}</label>
                                <input className={inputClass} value={form[k] as string} onChange={(e) => set(k, e.target.value as ArtistForm[typeof k])} placeholder="https://..." /></div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving}
                        className="px-6 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#8B9D7F' }}>
                        {saving ? 'Saving...' : 'Save Artist'}
                    </button>
                </div>
            </form>
            <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm">Releases ({releases.length})</h3>
                {releases.length === 0 ? (
                    <p className="text-gray-500 text-sm">No releases linked to this artist yet.</p>
                ) : (
                    <div className="space-y-2">
                        {releases.map((r) => (
                            <div key={r.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                                <div className="w-10 h-10 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                                    {r.coverImage ? (
                                        <Image src={r.coverImage} alt={r.title} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Disc3 className="w-4 h-4 text-gray-500" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{r.title}</p>
                                    <p className="text-gray-400 text-xs">{r.type} · {r.releaseDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
