import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Music2 } from 'lucide-react';

export default function ArtistsPage() {
    const artists = [
        {
            id: 1,
            slug: 'burna-boy',
            name: 'Burna Boy',
            genre: 'Afrobeats, Reggae',
            bio: 'Grammy-winning artist taking African music to the world',
            image: '/artists/burna-boy.jpg',
            albumCount: 7,
            social: {
                instagram: 'https://instagram.com/burnaboygram',
                twitter: 'https://twitter.com/burnaboy',
                youtube: 'https://youtube.com/@burnaboy',
                spotify: 'https://open.spotify.com/artist/3wcj11K77LjEY1PkEazffa'
            }
        },
        {
            id: 2,
            slug: 'wizkid',
            name: 'Wizkid',
            genre: 'Afrobeats, R&B',
            bio: 'International superstar and Afrobeats pioneer',
            image: '/artists/wizkid.jpg',
            albumCount: 5,
            social: {
                instagram: 'https://instagram.com/wizkidayo',
                twitter: 'https://twitter.com/wizkidayo',
                youtube: 'https://youtube.com/@wizkid',
                spotify: 'https://open.spotify.com/artist/3tVQdUvClmAT7URs9V3rsp'
            }
        },
        {
            id: 3,
            slug: 'davido',
            name: 'Davido',
            genre: 'Afrobeats, Pop',
            bio: 'Award-winning artist with global hit records',
            image: '/artists/davido.jpg',
            albumCount: 4,
            social: {
                instagram: 'https://instagram.com/davido',
                twitter: 'https://twitter.com/davido',
                youtube: 'https://youtube.com/@davido',
                spotify: 'https://open.spotify.com/artist/0Y3agQaa6g2r0YmHPOO9rh'
            }
        },
        {
            id: 4,
            slug: 'multirod',
            name: 'Multirod',
            genre: 'Afrobeats',
            bio: 'Rising star in the Nigerian music scene',
            image: '/artists/multirod.jpg',
            albumCount: 3,
            social: {
                instagram: 'https://instagram.com/multirod',
                twitter: 'https://twitter.com/multirod',
                youtube: 'https://youtube.com/@multirod',
                spotify: 'https://open.spotify.com/artist/multirod'
            }
        },
        {
            id: 5,
            slug: 'killa-vybz',
            name: 'Killa Vybz',
            genre: 'Hip Hop',
            bio: 'Bringing authentic Nigerian hip hop to the world',
            image: '/artists/killavybz.jpg',
            albumCount: 2,
            social: {
                instagram: 'https://instagram.com/killavybz',
                twitter: 'https://twitter.com/killavybz',
                youtube: 'https://youtube.com/@killavybz',
                spotify: 'https://open.spotify.com/artist/killavybz'
            }
        },
        {
            id: 6,
            slug: 'kirko-drillz',
            name: 'Kirko Drillz',
            genre: 'Drill',
            bio: 'Pioneer of Nigerian drill music',
            image: '/artists/kirkodrillz.jpg',
            albumCount: 4,
            social: {
                instagram: 'https://instagram.com/kirkodrillz',
                twitter: 'https://twitter.com/kirkodrillz',
                youtube: 'https://youtube.com/@kirkodrillz',
                spotify: 'https://open.spotify.com/artist/kirkodrillz'
            }
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Page Header */}
            <PageHeader
                title="Our Artists"
                subtitle="Meet the voices shaping contemporary African music"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            {/* Artists Grid Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artists.map((artist) => (
                            <div
                                key={artist.id}
                                className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#8B9D7F] transition-all duration-300"
                            >
                                {/* Artist Image */}
                                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-blue-600/30">
                                    {/* Placeholder for artist image */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-8xl opacity-20">🎤</span>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link
                                            href={`/artists/${artist.slug}`}
                                            className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>

                                {/* Artist Info */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#8B9D7F] transition-colors">
                                            {artist.name}
                                        </h3>
                                        <p className="text-[#8B9D7F] font-medium mb-2">{artist.genre}</p>
                                        <p className="text-gray-400 text-sm">{artist.bio}</p>
                                    </div>

                                    {/* Album Count */}
                                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                                        <Music2 className="w-4 h-4" />
                                        <span className="text-sm">{artist.albumCount} Albums</span>
                                    </div>

                                    {/* Social Media Links */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                                        <a
                                            href={artist.social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors"
                                            aria-label="Instagram"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={artist.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors"
                                            aria-label="Twitter"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={artist.social.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors"
                                            aria-label="YouTube"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={artist.social.spotify}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#8B9D7F] flex items-center justify-center transition-colors"
                                            aria-label="Spotify"
                                        >
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
