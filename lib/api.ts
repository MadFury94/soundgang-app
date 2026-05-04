// =============================================================================
// SoundGang API Client
// Uses static data store only (API disabled for now)
// =============================================================================

import type { Artist } from '@/lib/data/artists';
import type { Release, Track } from '@/lib/data/releases';
import type { Event } from '@/lib/data/events';
import type { BlogPost } from '@/lib/data/blog';
import type { Video } from '@/lib/data/videos';

// Static data imports
import { artists as staticArtists, getArtistBySlug as staticGetArtistBySlug } from '@/lib/data/artists';
import { releases as staticReleases, getReleaseBySlug as staticGetReleaseBySlug, getAllTracks as staticGetAllTracks } from '@/lib/data/releases';
import { events as staticEvents } from '@/lib/data/events';
import { blogPosts as staticBlogPosts } from '@/lib/data/blog';
import { videos as staticVideos } from '@/lib/data/videos';

// ─── Artists ──────────────────────────────────────────────────────────────────

export async function getArtists(): Promise<Artist[]> {
    return staticArtists;
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
    return staticGetArtistBySlug(slug);
}

export async function getFeaturedArtists(): Promise<Artist[]> {
    return staticArtists.filter((a) => a.featured);
}

// ─── Releases ─────────────────────────────────────────────────────────────────

export async function getReleases(limit?: number): Promise<Release[]> {
    return limit ? staticReleases.slice(0, limit) : staticReleases;
}

export async function getLatestReleases(n = 4): Promise<Release[]> {
    return staticReleases.slice(0, n);
}

export async function getFeaturedReleases(): Promise<Release[]> {
    return staticReleases.filter((r) => r.featured);
}

export async function getReleaseBySlug(slug: string): Promise<Release | undefined> {
    return staticGetReleaseBySlug(slug);
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export async function getAllTracks(): Promise<Track[]> {
    return staticGetAllTracks();
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
    return staticEvents;
}

export async function getUpcomingEvents(): Promise<Event[]> {
    return staticEvents;
}

export async function getFeaturedEvents(): Promise<Event[]> {
    return staticEvents.filter((e) => e.featured);
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
    return limit ? staticBlogPosts.slice(0, limit) : staticBlogPosts;
}

export async function getLatestPosts(n = 3): Promise<BlogPost[]> {
    return staticBlogPosts.slice(0, n);
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
    return staticBlogPosts.filter((p) => p.featured);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return staticBlogPosts.find((p) => p.slug === slug);
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<Video[]> {
    return staticVideos;
}
