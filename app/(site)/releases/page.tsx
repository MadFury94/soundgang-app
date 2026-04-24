'use client';

import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Calendar, Play } from 'lucide-react';
import { releases } from '@/lib/data/releases';
import { usePlayer } from '@/lib/player-context';

// TODO: When backend is ready, fetch releases from API
export default function ReleasesPage() {
    const { play } = usePlayer();

    return (
        <div className="min-h-screen bg-black">
            <PageHeader
                title="Releases"
                subtitle="Fresh sounds from our roster"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-white">All Releases</h2>
                            <p className="text-gray-400 mt-1">{releases.length} releases available</p>
                        </div>
                        <div className="flex gap-3">
                            <select className="bg-[#1a1a1a] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8B9D7F] transition-colors text-sm">
                                <option>All Types</option>
                                <option>Albums</option>
                                <option>EPs</option>
                                <option>Singles</option>
                                <option>Compilations</option>
                            </select>
                            <select className="bg-[#1a1a1a] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8B9D7F] transition-colors text-sm">
                                <option>Latest First</option>
                                <option>Oldest First</option>
                                <option>A-Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {releases.map((release) => (
                            <div key={release.id} className="group">
                                {/* Album cover */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${release.gradient}`}
                                        style={
                                            release.coverImage
                                                ? { backgroundImage: `url(${release.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                                : undefined
                                        }
                                    >
                                        {!release.coverImage && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-6xl opacity-20">🎵</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button
                                            onClick={() => release.tracks[0] && play(release.tracks[0], release.tracks)}
                                            className="w-16 h-16 bg-[#8B9D7F] rounded-full flex items-center justify-center hover:bg-[#7a8c6f] transition-colors"
                                            aria-label={`Play ${release.title}`}
                                        >
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </button>
                                    </div>

                                    {/* Type badge */}
                                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-white">{release.type}</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <Link href={`/releases/${release.slug}`}>
                                    <h3 className="font-bold text-lg mb-1 text-white hover:text-[#8B9D7F] transition-colors line-clamp-1">
                                        {release.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-400 text-sm mb-2 line-clamp-1">{release.artist}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{release.releaseDate}</span>
                                    </div>
                                    <span>{release.trackCount} {release.trackCount === 1 ? 'Track' : 'Tracks'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <a
                            href="https://wildstream.ng"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            <Play className="w-5 h-5" fill="white" />
                            STREAM ALL ON MUSIC ON WILDSTREAM
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
