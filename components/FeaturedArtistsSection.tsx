import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import WaveDivider from './WaveDivider';
import { getFeaturedArtists } from '@/lib/data/artists';

// TODO: When backend is ready, make this async and fetch from API
export default function FeaturedArtistsSection() {
    // TODO: Replace with — const artists = await getFeaturedArtists() (API call)
    const artists = getFeaturedArtists();

    return (
        <section className="bg-black text-white">
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Featured Artists</h2>
                        <p className="text-gray-400 text-lg">Meet the voices shaping contemporary African music</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {artists.map((artist) => (
                            <Link
                                key={artist.id}
                                href={`/artists/${artist.slug}`}
                                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900"
                            >
                                {/* Background — image or gradient fallback */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${artist.gradient}`}
                                    style={
                                        artist.image
                                            ? { backgroundImage: `url(${artist.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                            : undefined
                                    }
                                >
                                    {!artist.image && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl opacity-20">🎤</span>
                                        </div>
                                    )}
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-300 mb-2">{artist.genre}</p>
                                        <p className="text-xl font-semibold">View Profile</p>
                                    </div>
                                </div>

                                {/* Name badge */}
                                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4">
                                    <p className="font-semibold text-lg">{artist.name}</p>
                                    <p className="text-sm text-gray-400">{artist.genre}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link
                            href="/artists"
                            className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            VIEW ALL ARTISTS
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="rotate-180">
                <WaveDivider />
            </div>
        </section>
    );
}
