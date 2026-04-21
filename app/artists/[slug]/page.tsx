import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Music, Calendar, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react';

// Mock artist data - in production, fetch from database
const artistsData = {
    'burna-boy': {
        id: 1,
        name: 'Burna Boy',
        slug: 'burna-boy',
        genre: 'Afrobeats, Reggae',
        location: 'Lagos, Nigeria',
        bio: 'Damini Ebunoluwa Ogulu, known professionally as Burna Boy, is a Nigerian singer, songwriter and record producer. He rose to prominence in 2012 after releasing "Like to Party", the lead single from his debut studio album L.I.F.E. Burna Boy is one of the biggest and most successful African artists, known for his unique blend of Afrobeats, dancehall, reggae, and pop.',
        image: '/artists/burna-boy.jpg',
        coverImage: '/artists/burna-boy-cover.jpg',
        gradient: 'from-orange-600 via-red-500 to-pink-600',
        stats: {
            albums: 7,
            singles: 45,
            awards: 12,
            followers: '8.5M'
        },
        socialMedia: {
            instagram: 'https://instagram.com/burnaboygram',
            twitter: 'https://twitter.com/burnaboy',
            spotify: 'https://open.spotify.com/artist/3wcj11K77LjEY1PkEazffa'
        },
        topTracks: [
            { id: 1, title: 'Last Last', album: 'Love, Damini', year: 2022 },
            { id: 2, title: 'Ye', album: 'Outside', year: 2018 },
            { id: 3, title: 'On The Low', album: 'African Giant', year: 2019 },
            { id: 4, title: 'Anybody', album: 'African Giant', year: 2019 }
        ],
        albums: [
            { id: 1, title: 'Love, Damini', year: 2022, cover: '/albums/love-damini.jpg' },
            { id: 2, title: 'Twice as Tall', year: 2020, cover: '/albums/twice-as-tall.jpg' },
            { id: 3, title: 'African Giant', year: 2019, cover: '/albums/african-giant.jpg' }
        ]
    },
    'wizkid': {
        id: 2,
        name: 'Wizkid',
        slug: 'wizkid',
        genre: 'Afrobeats, R&B',
        location: 'Lagos, Nigeria',
        bio: 'Ayodeji Ibrahim Balogun, known professionally as Wizkid, is a Nigerian singer and songwriter. He began recording music at the age of 11 and managed to release a collaborative album with the Glorious Five, a group he and a couple of his church friends formed. Wizkid is one of the most decorated and successful African artists of all time.',
        image: '/artists/wizkid.jpg',
        coverImage: '/artists/wizkid-cover.jpg',
        gradient: 'from-purple-600 via-blue-500 to-cyan-600',
        stats: {
            albums: 5,
            singles: 52,
            awards: 15,
            followers: '12.3M'
        },
        socialMedia: {
            instagram: 'https://instagram.com/wizkidayo',
            twitter: 'https://twitter.com/wizkidayo',
            spotify: 'https://open.spotify.com/artist/3tVQdUvClmAT7URs9V3rsp'
        },
        topTracks: [
            { id: 1, title: 'Essence (feat. Tems)', album: 'Made in Lagos', year: 2020 },
            { id: 2, title: 'Ojuelegba', album: 'Ayo', year: 2014 },
            { id: 3, title: 'Come Closer', album: 'Sounds From The Other Side', year: 2017 },
            { id: 4, title: 'Joro', album: 'Made in Lagos', year: 2019 }
        ],
        albums: [
            { id: 1, title: 'Made in Lagos', year: 2020, cover: '/albums/made-in-lagos.jpg' },
            { id: 2, title: 'Sounds From The Other Side', year: 2017, cover: '/albums/sftos.jpg' },
            { id: 3, title: 'Ayo', year: 2014, cover: '/albums/ayo.jpg' }
        ]
    },
    'davido': {
        id: 3,
        name: 'Davido',
        slug: 'davido',
        genre: 'Afrobeats, Pop',
        location: 'Lagos, Nigeria',
        bio: 'David Adedeji Adeleke, popularly known as Davido, is a Nigerian-American singer, songwriter and record producer. He is one of the most influential artists in Africa and is credited with pioneering the Afrobeats sound globally. Known for his energetic performances and hit songs, Davido has won numerous awards and collaborated with international superstars.',
        image: '/artists/davido.jpg',
        coverImage: '/artists/davido-cover.jpg',
        gradient: 'from-yellow-600 via-orange-500 to-red-600',
        stats: {
            albums: 4,
            singles: 48,
            awards: 18,
            followers: '10.2M'
        },
        socialMedia: {
            instagram: 'https://instagram.com/davido',
            twitter: 'https://twitter.com/davido',
            spotify: 'https://open.spotify.com/artist/0Y3agQaa6g2r0YmHPOO9rh'
        },
        topTracks: [
            { id: 1, title: 'Fall', album: 'A Good Time', year: 2017 },
            { id: 2, title: 'If', album: 'A Good Time', year: 2017 },
            { id: 3, title: 'FEM', album: 'A Better Time', year: 2020 },
            { id: 4, title: 'Unavailable', album: 'Timeless', year: 2023 }
        ],
        albums: [
            { id: 1, title: 'Timeless', year: 2023, cover: '/albums/timeless.jpg' },
            { id: 2, title: 'A Better Time', year: 2020, cover: '/albums/a-better-time.jpg' },
            { id: 3, title: 'A Good Time', year: 2019, cover: '/albums/a-good-time.jpg' }
        ]
    }
};

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const artist = artistsData[slug as keyof typeof artistsData];

    if (!artist) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
                {/* Background with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${artist.gradient}`}>
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 pt-28">
                    {/* Back Button */}
                    <Link
                        href="/artists"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Artists
                    </Link>

                    {/* Artist Info */}
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                        {/* Artist Image */}
                        <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gray-900 border-4 border-white/20 shadow-2xl">
                            <div className={`w-full h-full bg-gradient-to-br ${artist.gradient} flex items-center justify-center`}>
                                <Music className="w-20 h-20 text-white/30" />
                            </div>
                        </div>

                        {/* Artist Details */}
                        <div className="flex-1">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                                {artist.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6">
                                <div className="flex items-center gap-2">
                                    <Music className="w-5 h-5" />
                                    <span>{artist.genre}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{artist.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span>{artist.stats.followers} Followers</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                <a
                                    href={artist.socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold transition-colors"
                                >
                                    Instagram
                                </a>
                                <a
                                    href={artist.socialMedia.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Listen on Spotify
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="py-12 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#8B9D7F] mb-2">{artist.stats.albums}</div>
                            <div className="text-gray-400">Albums</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#8B9D7F] mb-2">{artist.stats.singles}</div>
                            <div className="text-gray-400">Singles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#8B9D7F] mb-2">{artist.stats.awards}</div>
                            <div className="text-gray-400">Awards</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-[#8B9D7F] mb-2">{artist.stats.followers}</div>
                            <div className="text-gray-400">Followers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Biography Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">Biography</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">{artist.bio}</p>
                </div>
            </section>

            {/* Top Tracks Section */}
            <section className="py-20 bg-gray-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">Top Tracks</h2>
                    <div className="space-y-4">
                        {artist.topTracks.map((track, index) => (
                            <div
                                key={track.id}
                                className="flex items-center gap-6 p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#8B9D7F] transition-colors group"
                            >
                                <div className="text-2xl font-bold text-gray-600 w-8">{index + 1}</div>
                                <button className="p-3 rounded-full bg-[#8B9D7F] hover:bg-[#7a8c6f] transition-colors">
                                    <Play className="w-5 h-5 text-white fill-white" />
                                </button>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-1">{track.title}</h3>
                                    <p className="text-gray-400 text-sm">{track.album}</p>
                                </div>
                                <div className="text-gray-500 text-sm">{track.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Albums Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">Albums</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artist.albums.map((album) => (
                            <div
                                key={album.id}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${artist.gradient}`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Music className="w-24 h-24 text-white/20" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-xl mb-1">{album.title}</h3>
                                <p className="text-gray-400">{album.year}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
