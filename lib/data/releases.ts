// =============================================================================
// RELEASES DATA STORE
// TODO: Replace this static array with an API/DB call when backend is ready
// e.g. export async function getReleases() { return await db.releases.findMany() }
// =============================================================================

export type ReleaseType = 'Album' | 'EP' | 'Single' | 'Compilation';

export interface Track {
    id: number;
    title: string;
    duration: string;   // e.g. "3:45"
    audioUrl: string;   // URL to audio file for the player
    featuring?: string;
}

export interface Release {
    id: number;
    slug: string;
    title: string;
    artist: string;
    artistSlug: string;
    releaseDate: string;
    type: ReleaseType;
    coverImage: string;    // Album art path or URL
    gradient: string;      // Tailwind gradient (fallback when no image)
    trackCount: number;
    tracks: Track[];
    streamUrl: string;     // Primary streaming link (e.g. Wildstream)
    spotifyUrl?: string;
    appleMusicUrl?: string;
    featured: boolean;     // Show on homepage / hero slider
    description?: string;
}

// TODO: Replace with API call — e.g. fetch('/api/releases')
export const releases: Release[] = [
    {
        id: 1,
        slug: 'solid-4-life',
        title: 'Solid 4 Life',
        artist: 'SoundGang Compilation',
        artistSlug: 'soundgang',
        releaseDate: 'December 2024',
        type: 'Album',
        coverImage: 'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776779214/2150639068_nikmvw.jpg',
        gradient: 'from-cyan-500 via-blue-500 to-purple-500',
        trackCount: 12,
        tracks: [
            { id: 1, title: 'Solid 4 Life (Intro)', duration: '1:30', audioUrl: '/audio/solid-4-life-intro.mp3' },
            { id: 2, title: 'Gang Gang', duration: '3:45', audioUrl: '/audio/gang-gang.mp3' },
        ],
        streamUrl: 'https://wildstream.ng/solid-4-life',
        featured: true,
        description: 'The definitive SoundGang compilation featuring all roster artists.',
    },
    {
        id: 2,
        slug: 'mbaf',
        title: 'M.B.A.F',
        artist: 'Multilord',
        artistSlug: 'multilord',
        releaseDate: 'November 2024',
        type: 'Single',
        coverImage: '/releases/mbaf.jpg',
        gradient: 'from-gray-400 via-orange-400 to-red-400',
        trackCount: 1,
        tracks: [
            { id: 1, title: 'M.B.A.F', duration: '3:12', audioUrl: '/audio/mbaf.mp3' },
        ],
        streamUrl: 'https://wildstream.ng/mbaf',
        featured: true,
        description: 'Multilord\'s latest single showcasing his signature Afrobeats sound.',
    },
    {
        id: 3,
        slug: 'polaris-bro',
        title: 'Polaris Bro',
        artist: 'Multilord',
        artistSlug: 'multilord',
        releaseDate: 'October 2024',
        type: 'EP',
        coverImage: '/releases/polaris-bro.jpg',
        gradient: 'from-purple-600 via-pink-500 to-red-500',
        trackCount: 5,
        tracks: [
            { id: 1, title: 'Polaris Bro', duration: '3:55', audioUrl: '/audio/polaris-bro.mp3' },
            { id: 2, title: 'Night Drive', duration: '4:10', audioUrl: '/audio/night-drive.mp3' },
        ],
        streamUrl: 'https://wildstream.ng/polaris-bro',
        featured: false,
        description: 'A 5-track EP exploring themes of ambition and street life.',
    },
    {
        id: 4,
        slug: 'obl',
        title: 'OBL',
        artist: 'Killa Vybz',
        artistSlug: 'killa-vybz',
        releaseDate: 'September 2024',
        type: 'Single',
        coverImage: '/releases/obl.jpg',
        gradient: 'from-gray-700 via-gray-600 to-gray-500',
        trackCount: 1,
        tracks: [
            { id: 1, title: 'OBL', duration: '2:58', audioUrl: '/audio/obl.mp3' },
        ],
        streamUrl: 'https://wildstream.ng/obl',
        featured: false,
        description: 'Hard-hitting single from Killa Vybz.',
    },
    {
        id: 5,
        slug: 'lagos-nights',
        title: 'Lagos Nights',
        artist: 'Kirko Drillz',
        artistSlug: 'kirko-drillz',
        releaseDate: 'August 2024',
        type: 'Album',
        coverImage: '/releases/lagos-nights.jpg',
        gradient: 'from-indigo-600 via-purple-600 to-pink-600',
        trackCount: 14,
        tracks: [
            { id: 1, title: 'Honeymood', duration: '3:30', audioUrl: '/audio/honeymood.mp3' },
            { id: 2, title: 'Dangote Cover', duration: '3:15', audioUrl: '/audio/dangote-cover.mp3' },
        ],
        streamUrl: 'https://wildstream.ng/lagos-nights',
        featured: true,
        description: 'Kirko Drillz\'s debut album — 14 tracks of pure Nigerian drill.',
    },
];

// Helper: get latest N releases
// TODO: Replace with — await db.releases.findMany({ orderBy: { releaseDate: 'desc' }, take: n })
export function getLatestReleases(n = 4): Release[] {
    return releases.slice(0, n);
}

// Helper: get featured releases for hero slider
// TODO: Replace with — await db.releases.findMany({ where: { featured: true } })
export function getFeaturedReleases(): Release[] {
    return releases.filter((r) => r.featured);
}

// Helper: get a single release by slug
// TODO: Replace with — await db.releases.findUnique({ where: { slug } })
export function getReleaseBySlug(slug: string): Release | undefined {
    return releases.find((r) => r.slug === slug);
}

// Helper: get all tracks across all releases (for the player queue)
// TODO: Replace with — await db.tracks.findMany()
export function getAllTracks(): Track[] {
    return releases.flatMap((r) => r.tracks);
}
