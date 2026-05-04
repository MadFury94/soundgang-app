'use client';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AudioUploadField from '@/components/admin/AudioUploadField';
import { ChevronDown } from 'lucide-react';
import { adminGetArtists, adminGetReleasesByArtist } from '@/lib/admin-api';
import { toast } from 'sonner';

interface ArtistOption {
    id: number;
    name: string;
}

interface ReleaseOption {
    id: number;
    title: string;
}

interface TrackFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Record<string, unknown> | null;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isLoading?: boolean;
}

const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

export default function TrackForm({ open, onOpenChange, initialData, onSubmit, isLoading }: TrackFormProps) {
    const [title, setTitle] = useState('');
    const [featuring, setFeaturing] = useState('');
    const [artistId, setArtistId] = useState<number | null>(null);
    const [releaseId, setReleaseId] = useState<number | null>(null);
    const [audioUrl, setAudioUrl] = useState('');

    const [artists, setArtists] = useState<ArtistOption[]>([]);
    const [releases, setReleases] = useState<ReleaseOption[]>([]);
    const [loadingArtists, setLoadingArtists] = useState(false);
    const [loadingReleases, setLoadingReleases] = useState(false);

    const [titleError, setTitleError] = useState('');
    const [audioError, setAudioError] = useState('');

    // Load artists when modal opens
    useEffect(() => {
        if (!open) return;
        setLoadingArtists(true);
        adminGetArtists()
            .then((data) => setArtists((data as ArtistOption[]).map((a) => ({ id: Number(a.id), name: String(a.name) }))))
            .catch(() => { })
            .finally(() => setLoadingArtists(false));
    }, [open]);

    // Pre-populate fields from initialData
    useEffect(() => {
        if (initialData) {
            setTitle(String(initialData.title ?? ''));
            setFeaturing(String(initialData.featuring ?? ''));
            setArtistId(initialData.artistId != null ? Number(initialData.artistId) : null);
            setReleaseId(initialData.releaseId != null ? Number(initialData.releaseId) : null);
            setAudioUrl(String(initialData.audioUrl ?? ''));
        } else {
            setTitle('');
            setFeaturing('');
            setArtistId(null);
            setReleaseId(null);
            setAudioUrl('');
        }
        setTitleError('');
        setAudioError('');
    }, [initialData, open]);

    // Load releases when artistId changes
    useEffect(() => {
        if (artistId == null) {
            setReleases([]);
            return;
        }
        setLoadingReleases(true);
        adminGetReleasesByArtist(artistId)
            .then((data) => setReleases((data as ReleaseOption[]).map((r) => ({ id: Number(r.id), title: String(r.title) }))))
            .catch(() => { })
            .finally(() => setLoadingReleases(false));
    }, [artistId]);

    function handleArtistChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        setArtistId(val ? Number(val) : null);
        setReleaseId(null); // reset release when artist changes
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        let valid = true;
        if (!title.trim()) {
            setTitleError('Title is required');
            valid = false;
        } else {
            setTitleError('');
        }
        if (!audioUrl.trim()) {
            setAudioError('Audio file is required');
            valid = false;
        } else {
            setAudioError('');
        }
        if (!valid) return;

        try {
            await onSubmit({
                title: title.trim(),
                featuring: featuring.trim() || null,
                artist_id: artistId,
                release_id: releaseId,
                audio_url: audioUrl.trim(),
            });
            onOpenChange(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong');
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">{initialData ? 'Edit Track' : 'Add Track'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Title */}
                    <div>
                        <label className={labelClass}>Title *</label>
                        <input
                            className={inputClass}
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(''); }}
                            placeholder="Track title"
                        />
                        {titleError && <p className="text-red-400 text-xs mt-1">{titleError}</p>}
                    </div>

                    {/* Featuring */}
                    <div>
                        <label className={labelClass}>Featuring</label>
                        <input
                            className={inputClass}
                            value={featuring}
                            onChange={(e) => setFeaturing(e.target.value)}
                            placeholder="Featured artists"
                        />
                    </div>

                    {/* Artist dropdown */}
                    <div>
                        <label className={labelClass}>Artist</label>
                        <div className="relative">
                            <select
                                className={`${inputClass} appearance-none pr-8`}
                                value={artistId ?? ''}
                                onChange={handleArtistChange}
                                disabled={loadingArtists}
                            >
                                <option value="">{loadingArtists ? 'Loading artists...' : '— No artist —'}</option>
                                {artists.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Release dropdown */}
                    <div>
                        <label className={labelClass}>Release <span className="text-gray-500 font-normal">(optional)</span></label>
                        <div className="relative">
                            <select
                                className={`${inputClass} appearance-none pr-8`}
                                value={releaseId ?? ''}
                                onChange={(e) => setReleaseId(e.target.value ? Number(e.target.value) : null)}
                                disabled={artistId == null || loadingReleases}
                            >
                                <option value="">
                                    {artistId == null
                                        ? '— Select an artist first —'
                                        : loadingReleases
                                            ? 'Loading releases...'
                                            : '— No release —'}
                                </option>
                                {releases.map((r) => (
                                    <option key={r.id} value={r.id}>{r.title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Audio upload */}
                    <div>
                        <AudioUploadField
                            label="Audio File *"
                            value={audioUrl}
                            onChange={(url) => { setAudioUrl(url); if (url.trim()) setAudioError(''); }}
                        />
                        {audioError && <p className="text-red-400 text-xs mt-1">{audioError}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#8B9D7F' }}
                        >
                            {isLoading ? 'Saving...' : initialData ? 'Update Track' : 'Create Track'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
