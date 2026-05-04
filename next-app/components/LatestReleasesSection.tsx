'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Pause, Music } from 'lucide-react';
import WaveDivider from './WaveDivider';
import { getLatestReleases } from '@/lib/api';
import type { Release, Track } from '@/lib/data/releases';
import { usePlayer } from '@/lib/player-context';

// =============================================================================
// LATEST RELEASES SECTION
// Two-panel layout: album art on the left, track list on the right.
// Clicking a track updates the cover art on the left.
// =============================================================================

export default function LatestReleasesSection() {
    const { play, currentTrack, isPlaying } = usePlayer();

    const [releases, setReleases] = useState<Release[]>([]);
    const [activeRelease, setActiveRelease] = useState<Release | null>(null);
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);

    useEffect(() => {
        getLatestReleases(4).then((data) => {
            setReleases(data);
            if (data.length > 0) {
                setActiveRelease(data[0]);
                setActiveTrack(data[0].tracks[0] ?? null);
            }
        });
    }, []);

    if (!activeRelease) return null;

    const handleTrackClick = (release: Release, track: Track) => {
        setActiveRelease(release);
        setActiveTrack(track);
        play(track, release.tracks);
    };

    const isTrackPlaying = (track: Track) =>
        currentTrack?.id === track.id && isPlaying;

    return (
        <section className="bg-black text-white">
            <WaveDivider />

            <div className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section header */}
                    <div className="mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-3">Latest Releases</h2>
                        <p className="text-gray-400 text-lg">Fresh sounds from our roster</p>
                    </div>

                    {/* Two-panel layout */}
                    <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">

                        {/* ── Left panel: Album art ─────────────────────────── */}
                        <div className="lg:sticky lg:top-32">
                            {/* Cover art */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 shadow-2xl mb-6">
                                {activeRelease.coverImage ? (
                                    <img
                                        key={activeRelease.id}
                                        src={activeRelease.coverImage}
                                        alt={activeRelease.title}
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${activeRelease.gradient} flex items-center justify-center`}>
                                        <Music className="w-24 h-24 text-white/20" />
                                    </div>
                                )}
                                {/* Vinyl disc peek */}
                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gray-900 border-4 border-gray-800 opacity-60 pointer-events-none" />
                            </div>

                            {/* Release info */}
                            <div>
                                <span className="text-xs font-bold tracking-widest uppercase text-[#8B9D7F] mb-1 block">
                                    {activeRelease.type}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-1">{activeRelease.title}</h3>
                                <p className="text-gray-400 mb-1">{activeRelease.artist}</p>
                                <p className="text-gray-500 text-sm mb-4">{activeRelease.releaseDate}</p>
                                {activeRelease.description && (
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                        {activeRelease.description}
                                    </p>
                                )}

                                {/* Stream button */}
                                <a
                                    href={activeRelease.streamUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                                >
                                    <Play className="w-4 h-4 fill-white" />
                                    Stream Now
                                </a>
                            </div>
                        </div>

                        {/* ── Right panel: Track lists ──────────────────────── */}
                        <div className="space-y-8">
                            {releases.map((release) => (
                                <div key={release.id}>
                                    {/* Release header row */}
                                    <div
                                        className="flex items-center gap-4 mb-3 cursor-pointer group"
                                        onClick={() => {
                                            setActiveRelease(release);
                                            setActiveTrack(release.tracks[0] ?? null);
                                        }}
                                    >
                                        {/* Mini cover */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                            {release.coverImage ? (
                                                <img src={release.coverImage} alt={release.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${release.gradient}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold truncate transition-colors ${activeRelease.id === release.id ? 'text-[#8B9D7F]' : 'text-white group-hover:text-[#8B9D7F]'}`}>
                                                {release.title}
                                            </p>
                                            <p className="text-gray-500 text-xs">{release.artist} · {release.type} · {release.releaseDate}</p>
                                        </div>
                                    </div>

                                    {/* Track rows */}
                                    <div className="space-y-0.5">
                                        {release.tracks.map((track, idx) => {
                                            const playing = isTrackPlaying(track);
                                            const active = activeTrack?.id === track.id && activeRelease.id === release.id;

                                            return (
                                                <button
                                                    key={track.id}
                                                    onClick={() => handleTrackClick(release, track)}
                                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-left group/track ${active
                                                        ? 'bg-[#8B9D7F]/15 border border-[#8B9D7F]/30'
                                                        : 'hover:bg-gray-800/60 border border-transparent'
                                                        }`}
                                                >
                                                    {/* Track number / play icon */}
                                                    <div className="w-6 text-center flex-shrink-0">
                                                        {playing ? (
                                                            <Pause className="w-4 h-4 text-[#8B9D7F] mx-auto" />
                                                        ) : active ? (
                                                            <Play className="w-4 h-4 text-[#8B9D7F] fill-[#8B9D7F] mx-auto" />
                                                        ) : (
                                                            <span className="text-gray-500 text-sm group-hover/track:hidden">{idx + 1}</span>
                                                        )}
                                                        {!playing && !active && (
                                                            <Play className="w-4 h-4 text-white fill-white mx-auto hidden group-hover/track:block" />
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${active ? 'text-[#8B9D7F]' : 'text-gray-200'}`}>
                                                            {track.title}
                                                        </p>
                                                        {track.featuring && (
                                                            <p className="text-xs text-gray-500 truncate">ft. {track.featuring}</p>
                                                        )}
                                                    </div>

                                                    {/* Duration */}
                                                    <span className="text-gray-500 text-xs flex-shrink-0 tabular-nums">
                                                        {track.duration}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Divider between releases */}
                                    <div className="mt-4 border-b border-gray-800/60" />
                                </div>
                            ))}

                            {/* View all link */}
                            <div className="pt-2">
                                <Link
                                    href="/releases"
                                    className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3.5 rounded-lg font-semibold transition-colors text-sm"
                                >
                                    VIEW ALL RELEASES
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
