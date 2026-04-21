'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Play, Pause, ListMusic, Music, CheckCircle, GripVertical, Trash2 } from 'lucide-react';
import { adminGetReleases } from '@/lib/admin-api';

interface Track {
    id: number;
    title: string;
    duration: string;
    audioUrl: string;
    featuring?: string;
    releaseTitle?: string;
    coverImage?: string;
    artist?: string;
}

interface Release {
    id: number;
    title: string;
    artist: string;
    coverImage?: string;
    gradient: string;
    tracks: Track[];
}

export default function PlayerPlaylistPage() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [loading, setLoading] = useState(true);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        adminGetReleases()
            .then((data) => setReleases(data as Release[]))
            .catch(() => { })
            .finally(() => setLoading(false));

        // Load saved playlist from localStorage
        try {
            const saved = localStorage.getItem('sg_admin_playlist');
            if (saved) setPlaylist(JSON.parse(saved) as Track[]);
        } catch { /* ignore */ }
    }, []);

    function addToPlaylist(track: Track, release: Release) {
        const enriched: Track = {
            ...track,
            releaseTitle: release.title,
            coverImage: release.coverImage,
            artist: release.artist,
        };
        if (playlist.find((t) => t.id === track.id)) return; // already in playlist
        setPlaylist((prev) => [...prev, enriched]);
    }

    function removeFromPlaylist(trackId: number) {
        setPlaylist((prev) => prev.filter((t) => t.id !== trackId));
    }

    function setAsNowPlaying(track: Track) {
        setActiveTrack(track);
    }

    function savePlaylist() {
        localStorage.setItem('sg_admin_playlist', JSON.stringify(playlist));
        // Also store the active track
        if (activeTrack) {
            localStorage.setItem('sg_admin_now_playing', JSON.stringify(activeTrack));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    function isInPlaylist(trackId: number) {
        return playlist.some((t) => t.id === trackId);
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">Player & Playlist</h1>
                <p className="text-gray-400 text-sm">Choose which track plays on site load and build the site playlist</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Track browser */}
                <div className="space-y-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <Music className="w-4 h-4" style={{ color: '#8B9D7F' }} />
                        All Tracks
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="w-6 h-6 border-2 border-[#8B9D7F] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : releases.length === 0 ? (
                        <p className="text-gray-500 text-sm">No releases found. Add releases first.</p>
                    ) : (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            {releases.map((release) => (
                                <div key={release.id} className="bg-gray-800 rounded-xl overflow-hidden">
                                    {/* Release header */}
                                    <div className="flex items-center gap-3 p-3 border-b border-gray-700">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700">
                                            {release.coverImage ? (
                                                <img src={release.coverImage} alt={release.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${release.gradient}`} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{release.title}</p>
                                            <p className="text-gray-400 text-xs">{release.artist}</p>
                                        </div>
                                    </div>

                                    {/* Tracks */}
                                    {release.tracks?.length > 0 ? (
                                        <div className="divide-y divide-gray-700/50">
                                            {release.tracks.map((track) => {
                                                const inPlaylist = isInPlaylist(track.id);
                                                const isNowPlaying = activeTrack?.id === track.id;
                                                return (
                                                    <div key={track.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700/50 transition-colors">
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm truncate ${isNowPlaying ? 'font-semibold' : ''}`} style={{ color: isNowPlaying ? '#8B9D7F' : 'white' }}>
                                                                {track.title}
                                                                {track.featuring && <span className="text-gray-400 text-xs ml-1">ft. {track.featuring}</span>}
                                                            </p>
                                                            <p className="text-gray-500 text-xs">{track.duration}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            {/* Set as now playing */}
                                                            <button
                                                                onClick={() => setAsNowPlaying({ ...track, releaseTitle: release.title, coverImage: release.coverImage, artist: release.artist })}
                                                                title="Set as now playing"
                                                                className={`p-1.5 rounded-lg transition-colors ${isNowPlaying ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                                                                style={isNowPlaying ? { backgroundColor: '#8B9D7F' } : {}}
                                                            >
                                                                {isNowPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                                            </button>
                                                            {/* Add to playlist */}
                                                            <button
                                                                onClick={() => addToPlaylist(track, release)}
                                                                disabled={inPlaylist}
                                                                title={inPlaylist ? 'Already in playlist' : 'Add to playlist'}
                                                                className={`p-1.5 rounded-lg transition-colors text-xs ${inPlaylist ? 'opacity-40 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                                                            >
                                                                {inPlaylist ? <CheckCircle className="w-3.5 h-3.5 text-[#8B9D7F]" /> : <ListMusic className="w-3.5 h-3.5" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-xs px-3 py-2">No tracks</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Current playlist */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white font-semibold flex items-center gap-2">
                            <ListMusic className="w-4 h-4" style={{ color: '#8B9D7F' }} />
                            Site Playlist ({playlist.length} tracks)
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

                    {/* Now playing indicator */}
                    {activeTrack && (
                        <div className="bg-gray-800 rounded-xl p-4 border border-[#8B9D7F]/30">
                            <p className="text-xs text-[#8B9D7F] font-semibold uppercase tracking-wider mb-2">Now Playing on Site Load</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700">
                                    {activeTrack.coverImage ? (
                                        <img src={activeTrack.coverImage} alt={activeTrack.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Music className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-semibold truncate">{activeTrack.title}</p>
                                    <p className="text-gray-400 text-xs">{activeTrack.artist} · {activeTrack.releaseTitle}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Playlist */}
                    {playlist.length === 0 ? (
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                            <ListMusic className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No tracks in playlist yet.</p>
                            <p className="text-gray-500 text-xs mt-1">Click the playlist icon next to any track to add it.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto">
                            <div className="divide-y divide-gray-700/50">
                                {playlist.map((track, idx) => (
                                    <div key={track.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors group">
                                        <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                        <span className="text-gray-500 text-xs w-5 text-center">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{track.title}</p>
                                            <p className="text-gray-400 text-xs truncate">{track.artist} · {track.releaseTitle}</p>
                                        </div>
                                        <span className="text-gray-500 text-xs flex-shrink-0">{track.duration}</span>
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
                        Playlist is saved to browser storage. When the site loads, the player will use this playlist and start with the "Now Playing" track.
                    </p>
                </div>
            </div>
        </div>
    );
}
