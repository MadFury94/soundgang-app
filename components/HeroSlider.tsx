'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedArtists } from '@/lib/data/artists';
import { getFeaturedReleases } from '@/lib/data/releases';
import { getFeaturedEvents } from '@/lib/data/events';
import { getFeaturedPosts } from '@/lib/data/blog';

// =============================================================================
// HERO SLIDER
// Builds slides from the data store — artists, releases, events, blog posts.
// TODO: When backend is ready, pass slides as a prop fetched server-side.
// =============================================================================

type SlideCategory = 'ARTIST' | 'RELEASE' | 'EVENT' | 'BLOG';

interface Slide {
    id: string;
    category: SlideCategory;
    heading: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    backgroundImage: string;  // Image URL or path
    gradient: string;         // Tailwind gradient (shown when no image)
}

function buildSlides(): Slide[] {
    const slides: Slide[] = [];

    // Artist slides
    getFeaturedArtists().forEach((artist) => {
        slides.push({
            id: `artist-${artist.slug}`,
            category: 'ARTIST',
            heading: artist.name,
            description: artist.bio,
            buttonLabel: 'View Profile',
            buttonHref: `/artists/${artist.slug}`,
            backgroundImage: artist.coverImage,
            gradient: artist.gradient,
        });
    });

    // Release slides
    getFeaturedReleases().forEach((release) => {
        slides.push({
            id: `release-${release.slug}`,
            category: 'RELEASE',
            heading: release.title,
            description: release.description ?? `${release.type} by ${release.artist} — ${release.releaseDate}`,
            buttonLabel: 'Stream Now',
            buttonHref: `/releases/${release.slug}`,
            backgroundImage: release.coverImage,
            gradient: release.gradient,
        });
    });

    // Event slides
    getFeaturedEvents().forEach((event) => {
        slides.push({
            id: `event-${event.slug}`,
            category: 'EVENT',
            heading: event.title,
            description: `${event.date} • ${event.time} at ${event.venue}, ${event.location}`,
            buttonLabel: 'Get Tickets',
            buttonHref: event.ticketUrl,
            backgroundImage: event.coverImage,
            gradient: event.gradient,
        });
    });

    // Blog slides
    getFeaturedPosts().forEach((post) => {
        slides.push({
            id: `blog-${post.slug}`,
            category: 'BLOG',
            heading: post.title,
            description: post.excerpt,
            buttonLabel: 'Read Article',
            buttonHref: `/blog/${post.id}`,
            backgroundImage: post.coverImage,
            gradient: post.gradient,
        });
    });

    return slides;
}

const CATEGORY_COLORS: Record<SlideCategory, string> = {
    ARTIST: 'bg-[#8B9D7F]',
    RELEASE: 'bg-blue-600',
    EVENT: 'bg-orange-500',
    BLOG: 'bg-purple-600',
};

const AUTO_ADVANCE_MS = 6000;

export default function HeroSlider() {
    const slides = buildSlides();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goTo = useCallback((index: number) => {
        setCurrent((index + slides.length) % slides.length);
    }, [slides.length]);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Auto-advance
    useEffect(() => {
        if (isPaused || slides.length <= 1) return;
        const timer = setInterval(next, AUTO_ADVANCE_MS);
        return () => clearInterval(timer);
    }, [isPaused, next, slides.length]);

    if (slides.length === 0) return null;

    const slide = slides[current];

    return (
        <section
            className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {slides.map((s, i) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Background image */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`}
                        style={
                            s.backgroundImage
                                ? {
                                    backgroundImage: `url(${s.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }
                                : undefined
                        }
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/55" />
                    {/* Gradient overlay — bottom fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* Gradient overlay — top fade for header legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-20 h-full flex items-end pb-20 lg:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        {/* Category badge */}
                        <span
                            className={`inline-block ${CATEGORY_COLORS[slide.category]} text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5`}
                        >
                            {slide.category}
                        </span>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-tight">
                            {slide.heading}
                        </h1>

                        {/* Description */}
                        <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-8 max-w-xl leading-relaxed line-clamp-3">
                            {slide.description}
                        </p>

                        {/* CTA Button */}
                        <Link
                            href={slide.buttonHref}
                            className="inline-flex items-center gap-2 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base"
                        >
                            {slide.buttonLabel}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Prev / Next arrows */}
            <button
                onClick={prev}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/40 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/40 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`transition-all rounded-full ${i === current
                            ? 'w-8 h-2 bg-[#8B9D7F]'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Slide counter */}
            <div className="absolute top-6 right-6 z-30 text-white/60 text-sm tabular-nums">
                {current + 1} / {slides.length}
            </div>
        </section>
    );
}
