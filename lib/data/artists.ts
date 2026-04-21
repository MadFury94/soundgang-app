// =============================================================================
// ARTISTS DATA STORE
// TODO: Replace this static array with an API/DB call when backend is ready
// e.g. export async function getArtists() { return await db.artists.findMany() }
// =============================================================================

export interface Artist {
    id: number;
    slug: string;
    name: string;
    genre: string;
    bio: string;
    shortBio: string;
    image: string;         // Profile image path or URL
    coverImage: string;    // Hero/banner image path or URL
    gradient: string;      // Tailwind gradient classes (fallback when no image)
    featured: boolean;     // Show on homepage featured section
    stats: {
        albums: number;
        singles: number;
        awards: number;
        followers: string;
    };
    social: {
        instagram: string;
        twitter: string;
        youtube: string;
        spotify: string;
    };
    topTracks: {
        id: number;
        title: string;
        album: string;
        year: number;
        audioUrl?: string;   // URL to audio file for the player
        coverImage?: string;
    }[];
    albums: {
        id: number;
        title: string;
        year: number;
        cover: string;
    }[];
}

// TODO: Replace with API call — e.g. fetch('/api/artists')
export const artists: Artist[] = [
    {
        id: 1,
        slug: 'multilord',
        name: 'Multilord',
        genre: 'Afrobeats',
        bio: 'Multilord is a rising star in the Nigerian music scene, known for his unique blend of Afrobeats and contemporary sounds. His music resonates with a generation that appreciates both tradition and innovation.',
        shortBio: 'Rising star in the Nigerian music scene',
        image: '/artists/multilord.jpg',
        coverImage: '/artists/multilord-cover.jpg',
        gradient: 'from-orange-600 via-red-500 to-pink-600',
        featured: true,
        stats: { albums: 3, singles: 12, awards: 4, followers: '250K' },
        social: {
            instagram: 'https://instagram.com/multilord',
            twitter: 'https://twitter.com/multilord',
            youtube: 'https://youtube.com/@multilord',
            spotify: 'https://open.spotify.com/artist/multilord',
        },
        topTracks: [
            { id: 1, title: 'M.B.A.F', album: 'Singles', year: 2024, audioUrl: '/audio/mbaf.mp3' },
            { id: 2, title: 'Polaris Bro', album: 'Polaris Bro EP', year: 2024, audioUrl: '/audio/polaris-bro.mp3' },
        ],
        albums: [
            { id: 1, title: 'Polaris Bro', year: 2024, cover: '/albums/polaris-bro.jpg' },
        ],
    },
    {
        id: 2,
        slug: 'killa-vybz',
        name: 'Killa Vybz',
        genre: 'Hip Hop',
        bio: 'Killa Vybz brings authentic Nigerian hip hop to the world, with hard-hitting bars and street-level storytelling that connects with fans across the continent.',
        shortBio: 'Bringing authentic Nigerian hip hop to the world',
        image: '/artists/killavybz.jpg',
        coverImage: '/artists/killavybz-cover.jpg',
        gradient: 'from-gray-700 via-gray-600 to-gray-500',
        featured: true,
        stats: { albums: 2, singles: 8, awards: 2, followers: '180K' },
        social: {
            instagram: 'https://instagram.com/killavybz',
            twitter: 'https://twitter.com/killavybz',
            youtube: 'https://youtube.com/@killavybz',
            spotify: 'https://open.spotify.com/artist/killavybz',
        },
        topTracks: [
            { id: 1, title: 'OBL', album: 'Singles', year: 2024, audioUrl: '/audio/obl.mp3' },
        ],
        albums: [],
    },
    {
        id: 3,
        slug: 'kirko-drillz',
        name: 'Kirko Drillz',
        genre: 'Drill',
        bio: 'Pioneer of Nigerian drill music, Kirko Drillz has been at the forefront of bringing the drill sound to West Africa, creating a unique fusion that is entirely his own.',
        shortBio: 'Pioneer of Nigerian drill music',
        image: '/artists/kirkodrillz.jpg',
        coverImage: '/artists/kirkodrillz-cover.jpg',
        gradient: 'from-indigo-600 via-purple-600 to-pink-600',
        featured: true,
        stats: { albums: 4, singles: 20, awards: 6, followers: '320K' },
        social: {
            instagram: 'https://instagram.com/kirkodrillz',
            twitter: 'https://twitter.com/kirkodrillz',
            youtube: 'https://youtube.com/@kirkodrillz',
            spotify: 'https://open.spotify.com/artist/kirkodrillz',
        },
        topTracks: [
            { id: 1, title: 'Honeymood', album: 'Lagos Nights', year: 2024, audioUrl: '/audio/honeymood.mp3' },
            { id: 2, title: 'Dangote Cover', album: 'Lagos Nights', year: 2024, audioUrl: '/audio/dangote-cover.mp3' },
        ],
        albums: [
            { id: 1, title: 'Lagos Nights', year: 2024, cover: '/albums/lagos-nights.jpg' },
        ],
    },
];

// Helper: get a single artist by slug
// TODO: Replace with — await db.artists.findUnique({ where: { slug } })
export function getArtistBySlug(slug: string): Artist | undefined {
    return artists.find((a) => a.slug === slug);
}

// Helper: get featured artists for homepage
// TODO: Replace with — await db.artists.findMany({ where: { featured: true } })
export function getFeaturedArtists(): Artist[] {
    return artists.filter((a) => a.featured);
}
