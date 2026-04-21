import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Music2 } from 'lucide-react';
import { getArtists } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Our Artists',
    description: 'Meet the voices shaping contemporary African music. Discover Multilord, Kirko Drillz, Killa Vybz and more SoundGang artists.',
    url: 'https://soundgang.ng/artists',
});

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ArtistsPage() {
    const artists = await getArtists();

    return (
        <div className="min-h-screen bg-black">
            <PageHeader
                title="Our Artists"
                subtitle="Meet the voices shaping contemporary African music"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artists.map((artist) => (
                            <div
                                key={artist.id}
                                className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#8B9D7F] transition-all duration-300"
                            >
                                {/* Artist image */}
                                <div className="relative aspect-square overflow-hidden">
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
                                                <span className="text-8xl opacity-20">🎤</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View profile overlay — always visible on mobile, hover on desktop */}
                                    <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link
                                            href={`/artists/${artist.slug}`}
                                            className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#8B9D7F] transition-colors">
                                        {artist.name}
                                    </h3>
                                    <p className="text-[#8B9D7F] font-medium mb-2">{artist.genre}</p>
                                    <p className="text-gray-400 text-sm">{artist.shortBio}</p>

                                    <div className="flex items-center gap-2 mb-4 mt-3 text-gray-400">
                                        <Music2 className="w-4 h-4" />
                                        <span className="text-sm">{artist.stats.albums} Albums</span>
                                    </div>

                                    {/* Social links */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                                        <a href={artist.social.instagram} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors" aria-label="Instagram">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </a>
                                        <a href={artist.social.twitter} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors" aria-label="Twitter">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                        <a href={artist.social.spotify} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors" aria-label="Spotify">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
