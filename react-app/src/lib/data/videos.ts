// =============================================================================
// VIDEOS DATA STORE
// TODO: Replace this static array with an API/DB call when backend is ready
// e.g. export async function getVideos() { return await db.videos.findMany() }
// =============================================================================

export interface Video {
    id: number;
    title: string;
    artist: string;
    artistSlug: string;
    date: string;
    youtubeId: string;     // YouTube video ID (the part after ?v=)
    thumbnail: string;     // Custom thumbnail path or URL (falls back to YouTube thumbnail)
}

// TODO: Replace with API call — e.g. fetch('/api/videos')
export const videos: Video[] = [
    {
        id: 1,
        title: 'HONEYMOOD',
        artist: 'KIRKO DRILLZ',
        artistSlug: 'kirko-drillz',
        date: 'May 24, 2019',
        youtubeId: 'dQw4w9WgXcQ', // TODO: Replace with actual YouTube video ID
        thumbnail: '/videos/honeymood.jpg',
    },
    {
        id: 2,
        title: 'DANGOTE COVER',
        artist: 'KIRKO DRILLZ',
        artistSlug: 'kirko-drillz',
        date: 'May 24, 2019',
        youtubeId: 'dQw4w9WgXcQ', // TODO: Replace with actual YouTube video ID
        thumbnail: '/videos/dangote.jpg',
    },
    {
        id: 3,
        title: 'BEATBOX FREESTYLE',
        artist: 'MULTILORD',
        artistSlug: 'multilord',
        date: 'May 24, 2019',
        youtubeId: 'dQw4w9WgXcQ', // TODO: Replace with actual YouTube video ID
        thumbnail: '/videos/beatbox.jpg',
    },
    {
        id: 4,
        title: '$150K',
        artist: 'MULTILORD',
        artistSlug: 'multilord',
        date: 'May 24, 2019',
        youtubeId: 'dQw4w9WgXcQ', // TODO: Replace with actual YouTube video ID
        thumbnail: '/videos/150k.jpg',
    },
];

// Helper: get all videos
// TODO: Replace with — await db.videos.findMany()
export function getAllVideos(): Video[] {
    return videos;
}
