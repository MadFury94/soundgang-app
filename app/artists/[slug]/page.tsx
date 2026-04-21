import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Music, MapPin, Users, ArrowLeft } from 'lucide-react';
import { getArtistBySlug } from '@/lib/data/artists';
import type { Artist } from '@/lib/data/artists';

export const runtime = 'edge';

// =============================================================================
// ARTIST PAGE — Dynamic template used for every artist.
// Content is pulled from the data store (lib/data/artists.ts).
// Add a new artist there and this page renders it automatically.
// Fallback demo data is used when a slug isn't in the store yet.
// =============================================================================

// Demo fallback — used when an artist slug exists in a URL but isn't in the store
const DEMO_ARTIST: Omit<Artist, 'id' | 'slug'> = {
    name: 'Artist Name',
    genre: 'Afrobeats',
    bio: 'This artist is part of the SoundGang family. Full biography coming soon.',
    shortBio: 'SoundGang artist',
    image: '',
    coverImage: '',
    gradient: 'from-gray-700 via-gray-800 to-black',
    featured: false,
    stats: { albums: 0, singles: 0, awards: 0, followers: 'TBA' },
    social: {
        instagram: 'https://instagram.com/soundgang',
        twitter: 'https://twitter.com/soundgang',
        youtube: 'https://youtube.com/@soundgang',
        spotify: 'https://open.spotify.com/artist/soundgang',
    },
    topTracks: [
        { id: 1, title: 'Coming Soon', album: 'Upcoming Release', year: new Date().getFullYear() },
    ],
    albums: [],
};

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Try the data store first
    const storeArtist = getArtistBySlug(slug);

    // If not in store at all, 404
    if (!storeArtist) {
        notFound();
    }

    // Merge store data with demo fallback for any missing fields
    const artist: Artist = {
        ...{ ...DEMO_ARTIST, id: 0, slug },
        ...storeArtist,
    };

    const location = 'Lagos, Nigeria'; // TODO: add location field to Artist type when needed

    return (
        <div className="min-h-screen bg-black text-white">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="relative min-h-[70vh] overflow-hidden">
                {/* Background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${artist.gradient}`}
                    style={
                        artist.coverImage
                            ? { backgroundImage: `url(${artist.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
                            : undefined
                    }
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 flex flex-col justify-end min-h-[70vh]">
                    <Link
                        href="/artists"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-10 transition-colors w-fit text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Artists
                    </Link>

                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 lg:gap-10">
                        {/* Avatar */}
                        <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 bg-gray-900">
                            {artist.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${artist.gradient} flex items-center justify-center`}>
                                    <Music className="w-16 h-16 text-white/30" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[#8B9D7F] text-sm font-semibold uppercase tracking-widest mb-2">Artist</p>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                                {artist.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Music className="w-4 h-4 text-[#8B9D7F]" />
                                    <span>{artist.genre}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#8B9D7F]" />
                                    <span>{location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-[#8B9D7F]" />
                                    <span>{artist.stats.followers} Followers</span>
                                </div>
                            </div>

                            {/* Social buttons */}
                            <div className="flex flex-wrap gap-3">
                                {artist.social.instagram && (
                                    <a
                                        href={artist.social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold transition-colors"
                                    >
                                        Instagram
                                    </a>
                                )}
                                {artist.social.twitter && (
                                    <a
                                        href={artist.social.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold transition-colors"
                                    >
                                        Twitter / X
                                    </a>
                                )}
                                {artist.social.youtube && (
                                    <a
                                        href={artist.social.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold transition-colors"
                                    >
                                        YouTube
                                    </a>
                                )}
                                {artist.social.spotify && (
                                    <a
                                        href={artist.social.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-lg bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white text-sm font-semibold transition-colors flex items-center gap-2"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-white" />
                                        Spotify
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats ────────────────────────────────────────────────────── */}
            <section className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {[
                            { value: artist.stats.albums, label: 'Albums' },
                            { value: artist.stats.singles, label: 'Singles' },
                            { value: artist.stats.awards, label: 'Awards' },
                            { value: artist.stats.followers, label: 'Followers' },
                        ].map(({ value, label }) => (
                            <div key={label}>
                                <div className="text-3xl sm:text-4xl font-bold text-[#8B9D7F] mb-1">{value}</div>
                                <div className="text-gray-400 text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Biography ────────────────────────────────────────────────── */}
            <section className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">Biography</h2>
                    <p className="text-gray-300 text-base lg:text-lg leading-relaxed">{artist.bio}</p>
                </div>
            </section>

            {/* ── Top Tracks ───────────────────────────────────────────────── */}
            {artist.topTracks.length > 0 && (
                <section className="py-16 bg-gray-900/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">Top Tracks</h2>
                        <div className="space-y-3">
                            {artist.topTracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#8B9D7F] transition-colors group"
                                >
                                    <span className="text-lg font-bold text-gray-600 w-6 text-center flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <button
                                        className="p-2.5 rounded-full bg-[#8B9D7F] hover:bg-[#7a8c6f] transition-colors flex-shrink-0"
                                        aria-label={`Play ${track.title}`}
                                    >
                                        <Play className="w-4 h-4 text-white fill-white" />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate">{track.title}</p>
                                        <p className="text-gray-400 text-sm truncate">{track.album}</p>
                                    </div>
                                    <span className="text-gray-500 text-sm flex-shrink-0">{track.year}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Albums ───────────────────────────────────────────────────── */}
            {artist.albums.length > 0 && (
                <section className="py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">Albums</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {artist.albums.map((album) => (
                                <div key={album.id} className="group cursor-pointer">
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-900">
                                        {album.cover ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={album.cover}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className={`absolute inset-0 bg-gradient-to-br ${artist.gradient} flex items-center justify-center`}>
                                                <Music className="w-16 h-16 text-white/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <p className="text-white font-semibold truncate">{album.title}</p>
                                    <p className="text-gray-400 text-sm">{album.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ──────────────────────────────────────────────────────── */}
            <section className="py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Want to work with {artist.name}?</h3>
                        <p className="text-gray-400 text-sm">Get in touch with the SoundGang team.</p>
                    </div>
                    <Link
                        href="/contact"
                        className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
}
