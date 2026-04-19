import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import WaveDivider from './WaveDivider';

export default function LatestReleasesSection() {
    const releases = [
        {
            id: 1,
            title: 'Solid 4 Life',
            artist: 'SoundGang',
            image: '/releases/solid-4-life.jpg',
            gradient: 'from-cyan-500 via-blue-500 to-purple-500'
        },
        {
            id: 2,
            title: 'M.B.A.F',
            artist: 'Multirod',
            image: '/releases/mbaf.jpg',
            gradient: 'from-gray-400 via-orange-400 to-red-400'
        },
        {
            id: 3,
            title: 'Polaris Bro',
            artist: 'Multirod',
            image: '/releases/polaris-bro.jpg',
            gradient: 'from-purple-600 via-pink-500 to-red-500'
        },
        {
            id: 4,
            title: 'OBL',
            artist: 'Killa Vybz',
            image: '/releases/obl.jpg',
            gradient: 'from-gray-700 via-gray-600 to-gray-500'
        }
    ];

    return (
        <section className="bg-black text-white">
            {/* Top Wave Divider */}
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Latest Releases</h2>
                        <p className="text-gray-400 text-lg">Fresh sounds from our roster</p>
                    </div>

                    {/* Releases Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {releases.map((release) => (
                            <Link
                                key={release.id}
                                href={`/releases/${release.id}`}
                                className="group"
                            >
                                {/* Album Cover */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                    {/* Placeholder gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${release.gradient}`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl opacity-20">🎵</span>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-[#8B9D7F] rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-semibold">Play Now</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Release Info */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-[#8B9D7F] transition-colors">
                                        {release.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{release.artist}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View All Button */}
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
