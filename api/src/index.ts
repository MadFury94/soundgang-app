/**
 * SoundGang API — Cloudflare Worker
 * Serves all data for the SoundGang Next.js frontend from D1 + R2.
 *
 * Endpoints:
 *   GET  /api/artists              — all artists
 *   GET  /api/artists/:slug        — single artist + tracks + albums
 *   GET  /api/releases             — all releases (with tracks)
 *   GET  /api/releases/:slug       — single release + tracks
 *   GET  /api/tracks               — all tracks (for player queue)
 *   GET  /api/events               — all events
 *   GET  /api/blog                 — all published posts
 *   GET  /api/blog/:slug           — single post
 *   GET  /api/videos               — all videos
 *
 *   POST /api/upload/audio         — upload audio to R2 (admin only)
 *   POST /api/upload/image         — upload image to R2 (admin only)
 */

export interface Env {
    DB: D1Database;
    MEDIA: R2Bucket;
    R2_PUBLIC_URL: string;
    ENVIRONMENT: string;
    ADMIN_SECRET?: string; // Set this in Cloudflare dashboard secrets
}

// ─── CORS headers ─────────────────────────────────────────────────────────────
function corsHeaders(origin: string = '*') {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}

function json(data: unknown, status = 200, origin?: string): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
        },
    });
}

function error(message: string, status = 400, origin?: string): Response {
    return json({ error: message }, status, origin);
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
function isAdmin(request: Request, env: Env): boolean {
    const auth = request.headers.get('Authorization');
    if (!env.ADMIN_SECRET) return false;
    return auth === `Bearer ${env.ADMIN_SECRET}`;
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const origin = request.headers.get('Origin') ?? '*';
        const path = url.pathname;

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        try {
            // ── GET /api/artists ────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/artists') {
                const { results } = await env.DB.prepare(
                    'SELECT * FROM artists ORDER BY featured DESC, name ASC'
                ).all();
                return json(results.map(formatArtist), 200, origin);
            }

            // ── GET /api/artists/:slug ──────────────────────────────────────────────
            const artistMatch = path.match(/^\/api\/artists\/([^/]+)$/);
            if (request.method === 'GET' && artistMatch) {
                const slug = artistMatch[1];
                const artist = await env.DB.prepare(
                    'SELECT * FROM artists WHERE slug = ?'
                ).bind(slug).first();

                if (!artist) return error('Artist not found', 404, origin);

                // Get their tracks via releases
                const { results: releases } = await env.DB.prepare(
                    'SELECT * FROM releases WHERE artist_slug = ? ORDER BY release_date DESC'
                ).bind(slug).all();

                const releasesWithTracks = await Promise.all(
                    releases.map(async (r) => {
                        const { results: tracks } = await env.DB.prepare(
                            'SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC'
                        ).bind(r.id).all();
                        return { ...formatRelease(r), tracks: tracks.map(formatTrack) };
                    })
                );

                return json({
                    ...formatArtist(artist),
                    releases: releasesWithTracks,
                }, 200, origin);
            }

            // ── GET /api/releases ───────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/releases') {
                const limit = url.searchParams.get('limit');
                const featured = url.searchParams.get('featured');

                let query = 'SELECT * FROM releases';
                const params: unknown[] = [];

                if (featured === 'true') {
                    query += ' WHERE featured = 1';
                }
                query += ' ORDER BY release_date DESC';
                if (limit) {
                    query += ' LIMIT ?';
                    params.push(parseInt(limit));
                }

                const { results: releases } = await env.DB.prepare(query).bind(...params).all();

                const releasesWithTracks = await Promise.all(
                    releases.map(async (r) => {
                        const { results: tracks } = await env.DB.prepare(
                            'SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC'
                        ).bind(r.id).all();
                        return { ...formatRelease(r), tracks: tracks.map(formatTrack) };
                    })
                );

                return json(releasesWithTracks, 200, origin);
            }

            // ── GET /api/releases/:slug ─────────────────────────────────────────────
            const releaseMatch = path.match(/^\/api\/releases\/([^/]+)$/);
            if (request.method === 'GET' && releaseMatch) {
                const slug = releaseMatch[1];
                const release = await env.DB.prepare(
                    'SELECT * FROM releases WHERE slug = ?'
                ).bind(slug).first();

                if (!release) return error('Release not found', 404, origin);

                const { results: tracks } = await env.DB.prepare(
                    'SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC'
                ).bind(release.id).all();

                return json({
                    ...formatRelease(release),
                    tracks: tracks.map(formatTrack),
                }, 200, origin);
            }

            // ── GET /api/tracks ─────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/tracks') {
                const { results } = await env.DB.prepare(
                    `SELECT t.*, r.title as release_title, r.cover_url, r.artist
           FROM tracks t
           JOIN releases r ON t.release_id = r.id
           ORDER BY r.release_date DESC, t.track_number ASC`
                ).all();
                return json(results.map(formatTrack), 200, origin);
            }

            // ── GET /api/events ─────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/events') {
                const featured = url.searchParams.get('featured');
                let query = 'SELECT * FROM events';
                if (featured === 'true') query += ' WHERE featured = 1';
                query += ' ORDER BY iso_date ASC';

                const { results } = await env.DB.prepare(query).all();
                return json(results.map(formatEvent), 200, origin);
            }

            // ── GET /api/blog ───────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/blog') {
                const featured = url.searchParams.get('featured');
                const limit = url.searchParams.get('limit');

                let query = 'SELECT * FROM blog_posts WHERE published = 1';
                const params: unknown[] = [];

                if (featured === 'true') query += ' AND featured = 1';
                query += ' ORDER BY published_at DESC';
                if (limit) {
                    query += ' LIMIT ?';
                    params.push(parseInt(limit));
                }

                const { results } = await env.DB.prepare(query).bind(...params).all();
                return json(results.map(formatPost), 200, origin);
            }

            // ── GET /api/blog/:slug ─────────────────────────────────────────────────
            const blogMatch = path.match(/^\/api\/blog\/([^/]+)$/);
            if (request.method === 'GET' && blogMatch) {
                const slug = blogMatch[1];
                const post = await env.DB.prepare(
                    'SELECT * FROM blog_posts WHERE slug = ? AND published = 1'
                ).bind(slug).first();

                if (!post) return error('Post not found', 404, origin);
                return json(formatPost(post), 200, origin);
            }

            // ── GET /api/videos ─────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/videos') {
                const { results } = await env.DB.prepare(
                    'SELECT * FROM videos ORDER BY created_at DESC'
                ).all();
                return json(results.map(formatVideo), 200, origin);
            }

            // ── POST /api/upload/audio ──────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/upload/audio') {
                if (!isAdmin(request, env)) return error('Unauthorized', 401, origin);

                const formData = await request.formData();
                const file = formData.get('file') as File | null;
                const key = formData.get('key') as string | null;

                if (!file || !key) return error('file and key are required', 400, origin);

                const audioKey = `audio/${key}`;
                await env.MEDIA.put(audioKey, file.stream(), {
                    httpMetadata: { contentType: file.type || 'audio/mpeg' },
                });

                const publicUrl = `${env.R2_PUBLIC_URL}/${audioKey}`;
                return json({ url: publicUrl, key: audioKey }, 201, origin);
            }

            // ── POST /api/upload/image ──────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/upload/image') {
                if (!isAdmin(request, env)) return error('Unauthorized', 401, origin);

                const formData = await request.formData();
                const file = formData.get('file') as File | null;
                const key = formData.get('key') as string | null;

                if (!file || !key) return error('file and key are required', 400, origin);

                const imageKey = `images/${key}`;
                await env.MEDIA.put(imageKey, file.stream(), {
                    httpMetadata: { contentType: file.type || 'image/jpeg' },
                });

                const publicUrl = `${env.R2_PUBLIC_URL}/${imageKey}`;
                return json({ url: publicUrl, key: imageKey }, 201, origin);
            }

            // ── Health check ────────────────────────────────────────────────────────
            if (path === '/api/health') {
                return json({ status: 'ok', timestamp: new Date().toISOString() }, 200, origin);
            }

            return error('Not found', 404, origin);

        } catch (err) {
            console.error('Worker error:', err);
            return error('Internal server error', 500, origin);
        }
    },
};

// ─── Formatters (snake_case DB → camelCase API) ────────────────────────────────
function formatArtist(r: Record<string, unknown>) {
    return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        genre: r.genre,
        bio: r.bio,
        shortBio: r.short_bio,
        location: r.location,
        image: r.image_url,
        coverImage: r.cover_url,
        gradient: r.gradient,
        featured: r.featured === 1,
        stats: {
            albums: r.stat_albums,
            singles: r.stat_singles,
            awards: r.stat_awards,
            followers: r.stat_followers,
        },
        social: {
            instagram: r.social_instagram,
            twitter: r.social_twitter,
            youtube: r.social_youtube,
            spotify: r.social_spotify,
        },
    };
}

function formatRelease(r: Record<string, unknown>) {
    return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        artist: r.artist,
        artistSlug: r.artist_slug,
        releaseDate: r.release_date,
        type: r.type,
        coverImage: r.cover_url,
        gradient: r.gradient,
        trackCount: r.track_count,
        streamUrl: r.stream_url,
        spotifyUrl: r.spotify_url,
        appleMusicUrl: r.apple_url,
        featured: r.featured === 1,
        description: r.description,
    };
}

function formatTrack(r: Record<string, unknown>) {
    return {
        id: r.id,
        title: r.title,
        duration: r.duration,
        audioUrl: r.audio_url,
        featuring: r.featuring || undefined,
        trackNumber: r.track_number,
        releaseId: r.release_id,
        // Joined fields (present when fetched via /api/tracks)
        releaseTitle: r.release_title || undefined,
        coverImage: r.cover_url || undefined,
        artist: r.artist || undefined,
    };
}

function formatEvent(r: Record<string, unknown>) {
    return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        artist: r.artist,
        artistSlug: r.artist_slug,
        venue: r.venue,
        location: r.location,
        date: r.event_date,
        isoDate: r.iso_date,
        time: r.event_time,
        ticketUrl: r.ticket_url,
        coverImage: r.cover_url,
        gradient: r.gradient,
        featured: r.featured === 1,
        description: r.description,
    };
}

function formatPost(r: Record<string, unknown>) {
    return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        author: r.author,
        category: r.category,
        coverImage: r.cover_url,
        gradient: r.gradient,
        featured: r.featured === 1,
        publishedAt: r.published_at,
    };
}

function formatVideo(r: Record<string, unknown>) {
    return {
        id: r.id,
        title: r.title,
        artist: r.artist,
        artistSlug: r.artist_slug,
        youtubeId: r.youtube_id,
        thumbnail: r.thumbnail,
        date: r.video_date,
    };
}
