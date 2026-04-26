'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { ListMusic, Music, CheckCircle, GripVertical, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { adminGetReleases, adminGetPlaylist, adminSavePlaylist, adminGetTracks } from '@/lib/admin-api';
import type { PlaylistTrack } from '@/lib/admin-api';

type Track = PlaylistTrack & { artistName?: string; isStandalone?: boolean };

interface Release {
    id: number;
    title: string;
    artist: string;
    coverImage?: string;
    gradient: string;
    tracks: Track[];
}

export default function PlayerPlaylistPage() {
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [saved, setSaved] = useState(false);
    const dragIndex = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            adminGetReleases().catch(() => [] as unknown[]),
            adminGetTracks({ standalone: true }).catch(() => [] as unknown[]),
        ]).then(([releasesData, standaloneData]) => {
            const releases = releasesData as Release[];
            const standalone = standaloneData as Track[];

            const releaseTracks: Track[] = releases.flatMap((r) =>
                (r.tracks ?? []).map((t) => ({
                    ...t,
                    releaseTitle: r.title,
                    coverImage: r.coverImage ?? '',
                    artist: r.artist,
                    featuring: t.featuring ?? '',
                    isStandalone: false,
                }))
            );

            const enrichedStandalone: Track[] = standalone.map((t) => ({
                ...t,
                releaseTitle: t.artistName ?? 'Standalone',
                coverImage: '',
                artist: t.artistName ?? '',
                featuring: t.featuring ?? '',
                isStandalone: true,
            }));

            setAllTracks([...releaseTracks, ...enrichedStandalone]);
        }).finally(() => setLoading(false));

        adminGetPlaylist()
            .then((tracks) => { if (tracks.length > 0) setPlaylist(tracks as Track[]); })
            .catch(() => { });
    }, []);

    function isInPlaylist(trackId: number) {
        return playlist.some((t) => t.id === trackId);
    }

    function toggleTrack(track: Track) {
        if (isInPlaylist(track.id)) {
            setPlaylist((prev) => prev.filter((t) => t.id !== track.id));
        } else {
            setPlaylist((prev) => [...prev, track]);
        }
    }

    function removeFromPlaylist(trackId: number) {
        setPlaylist((prev) => prev.filter((t) => t.id !== trackId));
    }

    async function savePlaylist() {
        try {
            await adminSavePlaylist(playlist.map((t) => t.id));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            toast.error('Failed to save playlist. Please try again.');
        }
    }

    function handleDragStart(idx: number) {
        dragIndex.current = idx;
    }

    function handleDragOver(e: React.DragEvent, idx: number) {
        e.preventDefault();
        setDragOverIndex(idx);
    }

    function handleDrop(idx: number) {
        const from = dragIndex.current;
        if (from === null || from === idx) {
            dragIndex.current = null;
            setDragOverIndex(null);
            return;
        }
        const reordered = [...playlist];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(idx, 0, moved);
        setPlaylist(reordered);
        dragIndex.current = null;
        setDragOverIndex(null);
    }

    function handleDragEnd() {
        dragIndex.current = null;
        setDragOverIndex(null);
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">Player & Playlist</h1>
                <p className="text-gray-400 text-sm">Select tracks for the site autoplay playlist, then drag to reorder</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: All tracks checklist */}
                <div className="space-y-3">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <Music className="w-4 h-4" style={{ color: '#8B9D7F' }} />
                        All Tracks
                        <span className="text-gray-500 text-xs font-normal ml-1">— click to add/remove</span>
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="w-6 h-6 border-2 border-[#8B9D7F] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : allTracks.length === 0 ? (
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                            <Music className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No tracks uploaded yet.</p>
                            <p className="text-gray-500 text-xs mt-1">Upload tracks via the Tracks or Releases sections.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden max-h-[65vh] overflow-y-auto">
                            <div className="divide-y divide-gray-700/50">
                                {allTracks.map((track) => {
                                    const inPlaylist = isInPlaylist(track.id);
                                    return (
                                        <button
                                            key={track.id}
                                            type="button"
                                            onClick={() => toggleTrack(track)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-700/50 ${inPlaylist ? 'bg-[#8B9D7F]/10' : ''}`}
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${inPlaylist ? 'border-[#8B9D7F] bg-[#8B9D7F]' : 'border-gray-600'}`}>
                                                {inPlaylist && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">
                                                    {track.title}
                                                    {track.featuring && <span className="text-gray-400 text-xs ml-1">ft. {track.featuring}</span>}
                                                </p>
                                                <p className="text-gray-500 text-xs truncate">
                                                    {track.isStandalone
                                                        ? <span className="text-[#8B9D7F]/70">Standalone</span>
                                                        : track.releaseTitle
                                                    }
                                                    {track.artist ? ` · ${track.artist}` : ''}
                                                </p>
                                            </div>
                                            {inPlaylist
                                                ? <span className="text-[#8B9D7F] text-xs flex-shrink-0">In playlist</span>
                                                : <Plus className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                                            }
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Autoplay playlist */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white font-semibold flex items-center gap-2">
                            <ListMusic className="w-4 h-4" style={{ color: '#8B9D7F' }} />
                            Autoplay Playlist ({playlist.length} tracks)
                        </h2>
                        <button
                            onClick={savePlaylist}
                            disabled={playlist.length === 0}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
                            style={{ backgroundColor: saved ? '#22c55e' : '#8B9D7F' }}
                        >
                            {saved ? <CheckCircle className="w-4 h-4" /> : null}
                            {saved ? 'Saved!' : 'Save Playlist'}
                        </button>
                    </div>

                    {playlist.length === 0 ? (
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                            <ListMusic className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No tracks selected yet.</p>
                            <p className="text-gray-500 text-xs mt-1">Click tracks on the left to add them.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden max-h-[65vh] overflow-y-auto">
                            <div className="divide-y divide-gray-700/50">
                                {playlist.map((track, idx) => (
                                    <div
                                        key={track.id}
                                        draggable
                                        onDragStart={() => handleDragStart(idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDrop={() => handleDrop(idx)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors group cursor-grab active:cursor-grabbing ${dragOverIndex === idx ? 'border-t-2 border-[#8B9D7F]' : ''}`}
                                    >
                                        <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                        <span className="text-gray-500 text-xs w-5 text-center flex-shrink-0">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{track.title}</p>
                                            <p className="text-gray-400 text-xs truncate">{track.artist || track.releaseTitle}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromPlaylist(track.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                            aria-label="Remove from playlist"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-gray-500 text-xs">
                        Drag to reorder. Save to publish the playlist to the site.
                    </p>
                </div>
            </div>
        </div>
    );
}
