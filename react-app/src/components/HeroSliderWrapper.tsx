// Client component — fetches slide data from API and passes to slider
import { useEffect, useState } from 'react';
import { getFeaturedArtists, getFeaturedReleases, getFeaturedEvents, getFeaturedPosts } from '@/lib/api';
import HeroSlider from './HeroSlider';

export default function HeroSliderWrapper() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSlides() {
            try {
                const [artists, releases, events, posts] = await Promise.all([
                    getFeaturedArtists(),
                    getFeaturedReleases(),
                    getFeaturedEvents(),
                    getFeaturedPosts(),
                ]);

                const newSlides = [
                    ...artists.map((a) => ({
                        id: `artist-${a.slug}`,
                        category: 'ARTIST' as const,
                        heading: a.name,
                        description: a.bio,
                        buttonLabel: 'View Profile',
                        buttonHref: `/artists/${a.slug}`,
                        backgroundImage: a.coverImage,
                        gradient: a.gradient,
                    })),
                    ...releases.map((r) => ({
                        id: `release-${r.slug}`,
                        category: 'RELEASE' as const,
                        heading: r.title,
                        description: r.description ?? `${r.type} by ${r.artist} — ${r.releaseDate}`,
                        buttonLabel: 'Stream Now',
                        buttonHref: `/releases/${r.slug}`,
                        backgroundImage: r.coverImage,
                        gradient: r.gradient,
                    })),
                    ...events.filter((e) => e.featured).map((e) => ({
                        id: `event-${e.slug}`,
                        category: 'EVENT' as const,
                        heading: e.title,
                        description: `${e.date} • ${e.time} at ${e.venue}, ${e.location}`,
                        buttonLabel: 'Get Tickets',
                        buttonHref: e.ticketUrl,
                        backgroundImage: e.coverImage,
                        gradient: e.gradient,
                    })),
                    ...posts.map((p) => ({
                        id: `blog-${p.slug}`,
                        category: 'BLOG' as const,
                        heading: p.title,
                        description: p.excerpt,
                        buttonLabel: 'Read Article',
                        buttonHref: `/blog/${p.id}`,
                        backgroundImage: p.coverImage,
                        gradient: p.gradient,
                    })),
                ];

                setSlides(newSlides);
            } catch (error) {
                console.error('Failed to load hero slides:', error);
            } finally {
                setLoading(false);
            }
        }

        loadSlides();
    }, []);

    if (loading || slides.length === 0) {
        return <div className="h-screen bg-gray-900" />; // Loading placeholder
    }

    return <HeroSlider slides={slides} />;
}
