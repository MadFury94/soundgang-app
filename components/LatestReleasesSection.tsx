'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import WaveDivider from './WaveDivider';
import { getLatestReleases } from '@/lib/data/releases';
import { usePlayer } from '@/lib/player-context';

// TODO: When backend is ready, fetch releases from API
export default function LatestReleasesSection() {
    const { play } = usePlayer();
    // TODO: Replace with — const releases = await getLatestReleases(4) (API call)
    const releases = getLatestReleases(4);

    return (
        <section className="bg-black text-white">
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Latest Releases</h2>
                        <p className="text-gray-400 text-lg">Fresh sounds from our roster</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

                                    {/* Hover overlay with play button */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button
                                            onClick={() => release.tracks[0] && play(release.tracks[0], release.tracks)}
                                            className="w-16 h-16 bg-[#8B9D7F] rounded-full flex items-center justify-center hover:bg-[#7a8c6f] transition-colors"
                                            aria-label={`Play ${release.title}`}
                                        >
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <Link href={`/releases/${release.slug}`}>
                                    <h3 className="font-semibold text-lg mb-1 hover:text-[#8B9D7F] transition-colors">
                                        {release.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-400 text-sm">{release.artist}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link
                            href="/releases"
                            className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            VIEW ALL RELEASES
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
