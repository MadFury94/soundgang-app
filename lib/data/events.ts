// =============================================================================
// EVENTS DATA STORE
// TODO: Replace this static array with an API/DB call when backend is ready
// e.g. export async function getEvents() { return await db.events.findMany() }
// =============================================================================

export interface Event {
    id: number;
    slug: string;
    title: string;
    artist: string;
    artistSlug: string;
    venue: string;
    location: string;
    date: string;          // Display date string e.g. "Dec 15, 2024"
    isoDate: string;       // ISO date for sorting e.g. "2024-12-15"
    time: string;
    ticketUrl: string;
    coverImage: string;    // Event poster/image path or URL
    gradient: string;      // Tailwind gradient (fallback when no image)
    featured: boolean;     // Show on hero slider
    description?: string;
}

// TODO: Replace with API call — e.g. fetch('/api/events')
export const events: Event[] = [
    {
        id: 1,
        slug: 'multilord-eko-hotel-dec-2024',
        title: 'Multilord Live at Eko Hotel',
        artist: 'Multilord',
        artistSlug: 'multilord',
        venue: 'Eko Hotel & Suites',
        location: 'Lagos, Nigeria',
        date: 'Dec 15, 2024',
        isoDate: '2024-12-15',
        time: '8:00 PM',
        ticketUrl: '/contact',
        coverImage: '/events/multilord-eko-hotel.jpg',
        gradient: 'from-orange-600 via-red-500 to-pink-600',
        featured: true,
        description: 'An unforgettable night with Multilord performing his biggest hits live.',
    },
    {
        id: 2,
        slug: 'killa-vybz-terra-kulture-dec-2024',
        title: 'Killa Vybz at Terra Kulture',
        artist: 'Killa Vybz',
        artistSlug: 'killa-vybz',
        venue: 'Terra Kulture',
        location: 'Lagos, Nigeria',
        date: 'Dec 22, 2024',
        isoDate: '2024-12-22',
        time: '7:00 PM',
        ticketUrl: '/contact',
        coverImage: '/events/killa-vybz-terra.jpg',
        gradient: 'from-gray-700 via-gray-600 to-gray-500',
        featured: false,
        description: 'Killa Vybz brings the heat to Terra Kulture for a night of pure hip hop.',
    },
    {
        id: 3,
        slug: 'soundgang-allstars-freedom-park-dec-2024',
        title: 'SoundGang All Stars NYE',
        artist: 'SoundGang All Stars',
        artistSlug: 'soundgang',
        venue: 'Freedom Park',
        location: 'Lagos, Nigeria',
        date: 'Dec 31, 2024',
        isoDate: '2024-12-31',
        time: '9:00 PM',
        ticketUrl: '/contact',
        coverImage: '/events/soundgang-nye.jpg',
        gradient: 'from-yellow-500 via-orange-500 to-red-500',
        featured: true,
        description: 'Ring in the New Year with the entire SoundGang roster at Freedom Park.',
    },
];

// Helper: get upcoming events (sorted by date)
// TODO: Replace with — await db.events.findMany({ where: { isoDate: { gte: today } }, orderBy: { isoDate: 'asc' } })
export function getUpcomingEvents(): Event[] {
    return [...events].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

// Helper: get featured events for hero slider
// TODO: Replace with — await db.events.findMany({ where: { featured: true } })
export function getFeaturedEvents(): Event[] {
    return events.filter((e) => e.featured);
}
