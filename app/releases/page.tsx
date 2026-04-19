import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Calendar, Play } from 'lucide-react';

export default function ReleasesPage() {
    const releases = [
        {
            id: 1,
            title: 'Solid 4 Life',
            artist: 'SoundGang Compilation',
            releaseDate: 'December 2024',
            type: 'Album',
            trackCount: 12,
            gradient: 'from-cyan-500 via-blue-500 to-purple-500',
            streamUrl: 'https://wildstream.ng/solid-4-life'
        },
        {
            id: 2,
            title: 'M.B.A.F',
            artist: 'Multirod',
            releaseDate: 'November 2024',
            type: 'Single',
            trackCount: 1,
            gradient: 'from-gray-400 via-orange-400 to-red-400',
            streamUrl: 'https://wildstream.ng/mbaf'
        },
        {
            id: 3,
            title: 'Polaris Bro',
            artist: 'Multirod',
            releaseDate: 'October 2024',
            type: 'EP',
            trackCount: 5,
            gradient: 'from-purple-600 via-pink-500 to-red-500',
            streamUrl: 'https://wildstream.ng/polaris-bro'
        },
        {
            id: 4,
            title: 'OBL',
            artist: 'Killa Vybz',
            releaseDate: 'September 2024',
            type: 'Single',
            trackCount: 1,
            gradient: 'from-gray-700 via-gray-600 to-gray-500',
            streamUrl: 'https://wildstream.ng/obl'
        },
        {
            id: 5,
            title: 'Lagos Nights',
            artist: 'Kirko Drillz',
            releaseDate: 'August 2024',
            type: 'Album',
            trackCount: 14,
            gradient: 'from-indigo-600 via-purple-600 to-pink-600',
            streamUrl: 'https://wildstream.ng/lagos-nights'
        },
        {
            id: 6,
            title: 'Afro Fusion',
            artist: 'SupaBrainBeats',
            releaseDate: 'July 2024',
            type: 'EP',
            trackCount: 6,
            gradient: 'from-green-500 via-teal-500 to-blue-500',
            streamUrl: 'https://wildstream.ng/afro-fusion'
        },
        {
            id: 7,
            title: 'Midnight Vibes',
            artist: 'Bella Alubo',
            releaseDate: 'June 2024',
            type: 'Album',
            trackCount: 10,
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            streamUrl: 'https://wildstream.ng/midnight-vibes'
        },
        {
            id: 8,
            title: 'Street Anthem',
            artist: 'DJ Neptune',
            releaseDate: 'May 2024',
            type: 'Single',
            trackCount: 1,
            gradient: 'from-yellow-500 via-orange-500 to-red-500',
            streamUrl: 'https://wildstream.ng/street-anthem'
        },
        {
            id: 9,
            title: 'Rhythm & Soul',
            artist: 'Various Artists',
            releaseDate: 'April 2024',
            type: 'Compilation',
            trackCount: 15,
            gradient: 'from-blue-600 via-indigo-600 to-purple-600',
            streamUrl: 'https://wildstream.ng/rhythm-soul'
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Page Header */}
            <PageHeader
                title="Releases"
                subtitle="Fresh sounds from our roster"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            {/* Releases Grid Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter/Sort Options */}
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
                                <option>Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Releases Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {releases.map((release) => (
                            <Link
                                key={release.id}
                                href={`/releases/${release.id}`}
                                className="group"
                            >
                                {/* Album Cover */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${release.gradient}`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl opacity-20">🎵</span>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-[#8B9D7F] rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Play className="w-8 h-8 text-white" fill="white" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">Play Now</p>
                                        </div>
                                    </div>

                                    {/* Release Type Badge */}
                                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-white">{release.type}</span>
                                    </div>
                                </div>

                                {/* Release Info */}
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-white group-hover:text-[#8B9D7F] transition-colors line-clamp-1">
                                        {release.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">{release.artist}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{release.releaseDate}</span>
                                        </div>
                                        <span>{release.trackCount} {release.trackCount === 1 ? 'Track' : 'Tracks'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Stream All Button */}
                    <div className="text-center mt-16">
                        <a
                            href="https://wildstream.ng"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            <Play className="w-5 h-5" fill="white" />
                            STREAM ALL ON WILDSTREAM
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
