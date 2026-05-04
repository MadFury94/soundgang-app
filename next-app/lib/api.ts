// =============================================================================
// SoundGang API Client
// Fetches data from the Cloudflare Worker API.
// Falls back to static data store if the API is unavailable.
// =============================================================================

import type { Artist } from '@/lib/data/artists';
import type { Release, Track } from '@/lib/data/releases';
import type { Event } from '@/lib/data/events';
import type { BlogPost } from '@/lib/data/blog';
import type { Video } from '@/lib/data/videos';

// Static fallbacks
import { artists as staticArtists, getArtistBySlug as staticGetArtistBySlug } from '@/lib/data/artists';
import { releases as staticReleases, getReleaseBySlug as staticGetReleaseBySlug, getAllTracks as staticGetAllTracks } from '@/lib/data/releases';
import { events as staticEvents } from '@/lib/data/events';
import { blogPosts as staticBlogPosts, getPostById as staticGetPostById } from '@/lib/data/blog';
import { videos as staticVideos } from '@/lib/data/videos';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://soundgang-api.onochieazukaeme.workers.dev';

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        return await res.json() as T;
    } catch (err) {
        console.warn(`[API] Failed to fetch ${path}, using static fallback:`, err);
        return fallback;
    }
}

// ─── Artists ──────────────────────────────────────────────────────────────────

export async function getArtists(): Promise<Artist[]> {
    return apiFetch<Artist[]>('/api/artists', staticArtists);
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
    return apiFetch<Artist | undefined>(`/api/artists/${slug}`, staticGetArtistBySlug(slug));
}

export async function getFeaturedArtists(): Promise<Artist[]> {
    const all = await getArtists();
    return all.filter((a) => a.featured);
}

// ─── Releases ─────────────────────────────────────────────────────────────────

export async function getReleases(limit?: number): Promise<Release[]> {
    const query = limit ? `?limit=${limit}` : '';
    return apiFetch<Release[]>(`/api/releases${query}`, staticReleases.slice(0, limit));
}

export async function getLatestReleases(n = 4): Promise<Release[]> {
    return getReleases(n);
}

export async function getFeaturedReleases(): Promise<Release[]> {
    return apiFetch<Release[]>('/api/releases?featured=true', staticReleases.filter((r) => r.featured));
}

export async function getReleaseBySlug(slug: string): Promise<Release | undefined> {
    return apiFetch<Release | undefined>(`/api/releases/${slug}`, staticGetReleaseBySlug(slug));
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export async function getAllTracks(): Promise<Track[]> {
    return apiFetch<Track[]>('/api/tracks', staticGetAllTracks());
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
    return apiFetch<Event[]>('/api/events', staticEvents);
}

export async function getUpcomingEvents(): Promise<Event[]> {
    return getEvents();
}

export async function getFeaturedEvents(): Promise<Event[]> {
    return apiFetch<Event[]>('/api/events?featured=true', staticEvents.filter((e) => e.featured));
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
    const query = limit ? `?limit=${limit}` : '';
    return apiFetch<BlogPost[]>(`/api/blog${query}`, staticBlogPosts.slice(0, limit));
}

export async function getLatestPosts(n = 3): Promise<BlogPost[]> {
    return getBlogPosts(n);
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
    return apiFetch<BlogPost[]>('/api/blog?featured=true', staticBlogPosts.filter((p) => p.featured));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return apiFetch<BlogPost | undefined>(`/api/blog/${slug}`, staticBlogPosts.find((p) => p.slug === slug));
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<Video[]> {
    return apiFetch<Video[]>('/api/videos', staticVideos);
}
