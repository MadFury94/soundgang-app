import {
    signJWT,
    verifyJWT,
    requireAuth,
    requireAdmin,
    requireOwnership,
    hashPassword,
    verifyPassword,
    isValidEmail,
    isValidPassword,
    type JWTPayload,
} from './auth';

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
    JWT_SECRET: string;    // Set this in Cloudflare dashboard secrets
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

                // Get their tracks via releases (join on artist_id with artist_slug fallback)
                const { results: releases } = await env.DB.prepare(
                    'SELECT * FROM releases WHERE artist_id = (SELECT id FROM artists WHERE slug = ?) OR artist_slug = ? ORDER BY release_date DESC'
                ).bind(slug, slug).all();

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
                const standaloneParam = url.searchParams.get('standalone');
                const artistIdParam = url.searchParams.get('artist_id');

                const conditions: string[] = [];
                const params: unknown[] = [];

                if (standaloneParam === 'true') {
                    conditions.push('t.is_standalone = 1');
                }
                if (artistIdParam) {
                    conditions.push('t.artist_id = ?');
                    params.push(parseInt(artistIdParam));
                }

                let query = `SELECT t.*,
                       a.name as artist_name,
                       r.title as release_title,
                       r.cover_url,
                       r.artist as release_artist
                FROM tracks t
                LEFT JOIN artists a ON t.artist_id = a.id
                LEFT JOIN releases r ON t.release_id = r.id`;

                if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
                query += ' ORDER BY t.created_at DESC';

                const { results } = await env.DB.prepare(query).bind(...params).all();
                return json(results.map(formatTrack), 200, origin);
            }

            // ── GET /api/events ─────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/events') {
                const featured = url.searchParams.get('featured');
                const artistIdParam = url.searchParams.get('artist_id');
                const conditions: string[] = [];
                const params: unknown[] = [];

                if (featured === 'true') conditions.push('featured = 1');
                if (artistIdParam) {
                    conditions.push('artist_id = ?');
                    params.push(parseInt(artistIdParam));
                }

                let query = 'SELECT * FROM events';
                if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
                query += ' ORDER BY iso_date ASC';

                const { results } = await env.DB.prepare(query).bind(...params).all();
                return json(results.map(formatEvent), 200, origin);
            }

            // ── GET /api/blog ───────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/blog') {
                const featured = url.searchParams.get('featured');
                const limit = url.searchParams.get('limit');
                const artistIdParam = url.searchParams.get('artist_id');

                let query = 'SELECT * FROM blog_posts WHERE published = 1';
                const params: unknown[] = [];

                if (featured === 'true') query += ' AND featured = 1';
                if (artistIdParam) {
                    query += ' AND artist_id = ? AND artist_id IS NOT NULL';
                    params.push(parseInt(artistIdParam));
                }
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
                const artistIdParam = url.searchParams.get('artist_id');
                let query = 'SELECT * FROM videos';
                const params: unknown[] = [];

                if (artistIdParam) {
                    query += ' WHERE artist_id = ?';
                    params.push(parseInt(artistIdParam));
                }
                query += ' ORDER BY created_at DESC';

                const { results } = await env.DB.prepare(query).bind(...params).all();
                return json(results.map(formatVideo), 200, origin);
            }

            // ── POST /api/upload/audio ──────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/upload/audio') {
                await requireAuth(request, env);

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
                await requireAuth(request, env);

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

            // ── POST /api/auth/login ─────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/auth/login') {
                const body = await request.json() as Record<string, unknown>;
                const email = body.email as string | undefined;
                const password = body.password as string | undefined;

                if (!email || !password) {
                    return error('Invalid email or password', 401, origin);
                }

                const user = await env.DB.prepare(
                    'SELECT id, email, password_hash, role, artist_id FROM users WHERE email = ?'
                ).bind(email).first() as { id: number; email: string; password_hash: string; role: 'admin' | 'artist'; artist_id: number | null } | null;

                if (!user) {
                    return error('Invalid email or password', 401, origin);
                }

                const valid = await verifyPassword(password, user.password_hash);
                if (!valid) {
                    return error('Invalid email or password', 401, origin);
                }

                const token = await signJWT(
                    { sub: String(user.id), email: user.email, role: user.role, artist_id: user.artist_id },
                    env.JWT_SECRET
                );
                return json({ token }, 200, origin);
            }

            // ── GET /api/auth/me ─────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/auth/me') {
                const payload = await requireAuth(request, env);
                const user = await env.DB.prepare(
                    'SELECT id, email, role, artist_id FROM users WHERE id = ?'
                ).bind(payload.sub).first() as { id: number; email: string; role: string; artist_id: number | null } | null;

                if (!user) return error('Not found', 404, origin);
                return json({ id: user.id, email: user.email, role: user.role, artist_id: user.artist_id }, 200, origin);
            }

            // ── POST /api/users ──────────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/users') {
                await requireAdmin(request, env);
                const body = await request.json() as Record<string, unknown>;
                const email = body.email as string | undefined;
                const password = body.password as string | undefined;
                const role = (body.role as string | undefined) ?? 'artist';
                const artist_id = body.artist_id as number | null | undefined;

                if (!email || !isValidEmail(email)) {
                    return error('Invalid email address', 400, origin);
                }
                if (!password || !isValidPassword(password)) {
                    return error('Password must be at least 8 characters', 400, origin);
                }

                const existing = await env.DB.prepare(
                    'SELECT id FROM users WHERE email = ?'
                ).bind(email).first();
                if (existing) return error('Email already taken', 409, origin);

                if (artist_id != null) {
                    const artist = await env.DB.prepare(
                        'SELECT id FROM artists WHERE id = ?'
                    ).bind(artist_id).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                const password_hash = await hashPassword(password);
                const result = await env.DB.prepare(
                    `INSERT INTO users (email, password_hash, role, artist_id) VALUES (?, ?, ?, ?)`
                ).bind(email, password_hash, role, artist_id ?? null).run();

                const created = await env.DB.prepare(
                    'SELECT id, email, role, artist_id FROM users WHERE id = ?'
                ).bind(result.meta.last_row_id).first() as { id: number; email: string; role: string; artist_id: number | null } | null;

                return json({ id: created!.id, email: created!.email, role: created!.role, artist_id: created!.artist_id }, 201, origin);
            }

            // ── PUT /api/users/:id ───────────────────────────────────────────────────
            const userIdMatch = path.match(/^\/api\/users\/(\d+)$/);
            if (request.method === 'PUT' && userIdMatch) {
                await requireAdmin(request, env);
                const id = userIdMatch[1];
                const body = await request.json() as Record<string, unknown>;

                const existing = await env.DB.prepare(
                    'SELECT id, email, role, artist_id FROM users WHERE id = ?'
                ).bind(id).first() as { id: number; email: string; role: string; artist_id: number | null } | null;
                if (!existing) return error('User not found', 404, origin);

                const email = (body.email as string | undefined) ?? existing.email;
                const role = (body.role as string | undefined) ?? existing.role;
                const artist_id = 'artist_id' in body ? (body.artist_id as number | null) : existing.artist_id;

                // Check one-to-one constraint: if setting artist_id, ensure no other user has it
                if (artist_id != null) {
                    const conflict = await env.DB.prepare(
                        'SELECT id FROM users WHERE artist_id = ? AND id != ?'
                    ).bind(artist_id, id).first();
                    if (conflict) return error('Artist already linked to another account', 409, origin);
                }

                await env.DB.prepare(
                    `UPDATE users SET email=?, role=?, artist_id=?, updated_at=datetime('now') WHERE id=?`
                ).bind(email, role, artist_id, id).run();

                const updated = await env.DB.prepare(
                    'SELECT id, email, role, artist_id FROM users WHERE id = ?'
                ).bind(id).first() as { id: number; email: string; role: string; artist_id: number | null } | null;

                return json({ id: updated!.id, email: updated!.email, role: updated!.role, artist_id: updated!.artist_id }, 200, origin);
            }

            // ── GET /api/health ─────────────────────────────────────────────────────
            if (path === '/api/health') {
                const auth = request.headers.get('Authorization');
                if (!auth) {
                    return json({ status: 'ok', admin: false }, 200, origin);
                }
                if (!env.ADMIN_SECRET || auth !== `Bearer ${env.ADMIN_SECRET}`) {
                    return error('Unauthorized', 401, origin);
                }
                return json({ status: 'ok', admin: true }, 200, origin);
            }

            // ── POST /api/artists ────────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/artists') {
                await requireAdmin(request, env);
                const body = await request.json() as Record<string, unknown>;
                if (!body.name || !body.slug) return error('name and slug are required', 400, origin);
                try {
                    const result = await env.DB.prepare(
                        `INSERT INTO artists (slug, name, genre, bio, short_bio, location, image_url, cover_url, gradient, featured,
                         stat_albums, stat_singles, stat_awards, stat_followers,
                         social_instagram, social_twitter, social_youtube, social_spotify)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        body.slug, body.name, body.genre ?? '', body.bio ?? '', body.short_bio ?? '',
                        body.location ?? 'Lagos, Nigeria', body.image_url ?? '', body.cover_url ?? '',
                        body.gradient ?? 'from-gray-700 via-gray-800 to-black', body.featured ? 1 : 0,
                        body.stat_albums ?? 0, body.stat_singles ?? 0, body.stat_awards ?? 0, body.stat_followers ?? '0',
                        body.social_instagram ?? '', body.social_twitter ?? '', body.social_youtube ?? '', body.social_spotify ?? ''
                    ).run();
                    const created = await env.DB.prepare('SELECT * FROM artists WHERE id = ?').bind(result.meta.last_row_id).first();
                    return json(formatArtist(created as Record<string, unknown>), 201, origin);
                } catch (e: unknown) {
                    if (e instanceof Error && e.message.includes('UNIQUE')) return error('Slug already exists', 409, origin);
                    throw e;
                }
            }

            // ── PUT /api/artists/:id ─────────────────────────────────────────────────
            const artistIdMatch = path.match(/^\/api\/artists\/(\d+)$/);
            if (request.method === 'PUT' && artistIdMatch) {
                await requireAdmin(request, env);
                const id = artistIdMatch[1];
                const body = await request.json() as Record<string, unknown>;
                await env.DB.prepare(
                    `UPDATE artists SET slug=?, name=?, genre=?, bio=?, short_bio=?, location=?, image_url=?, cover_url=?,
                     gradient=?, featured=?, stat_albums=?, stat_singles=?, stat_awards=?, stat_followers=?,
                     social_instagram=?, social_twitter=?, social_youtube=?, social_spotify=?, updated_at=datetime('now')
                     WHERE id=?`
                ).bind(
                    body.slug, body.name, body.genre ?? '', body.bio ?? '', body.short_bio ?? '',
                    body.location ?? 'Lagos, Nigeria', body.image_url ?? '', body.cover_url ?? '',
                    body.gradient ?? 'from-gray-700 via-gray-800 to-black', body.featured ? 1 : 0,
                    body.stat_albums ?? 0, body.stat_singles ?? 0, body.stat_awards ?? 0, body.stat_followers ?? '0',
                    body.social_instagram ?? '', body.social_twitter ?? '', body.social_youtube ?? '', body.social_spotify ?? '',
                    id
                ).run();

                // Cascade name + slug update to all linked content rows
                if (body.name || body.slug) {
                    const cascadeName = body.name as string;
                    const cascadeSlug = body.slug as string;
                    await env.DB.prepare(`UPDATE releases SET artist=?, artist_slug=? WHERE artist_id=?`).bind(cascadeName, cascadeSlug, id).run();
                    await env.DB.prepare(`UPDATE events   SET artist=?, artist_slug=? WHERE artist_id=?`).bind(cascadeName, cascadeSlug, id).run();
                    await env.DB.prepare(`UPDATE videos   SET artist=?, artist_slug=? WHERE artist_id=?`).bind(cascadeName, cascadeSlug, id).run();
                }

                const updated = await env.DB.prepare('SELECT * FROM artists WHERE id = ?').bind(id).first();
                if (!updated) return error('Artist not found', 404, origin);
                return json(formatArtist(updated as Record<string, unknown>), 200, origin);
            }

            // ── DELETE /api/artists/:id ──────────────────────────────────────────────
            if (request.method === 'DELETE' && artistIdMatch) {
                await requireAdmin(request, env);
                const id = artistIdMatch[1];
                await env.DB.prepare('DELETE FROM artists WHERE id = ?').bind(id).run();
                return json({ success: true }, 200, origin);
            }

            // ── POST /api/releases ───────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/releases') {
                const user = await requireAuth(request, env);
                const body = await request.json() as Record<string, unknown>;
                if (!body.title || !body.slug) return error('title and slug are required', 400, origin);

                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : null;

                // Artist users can only create content for themselves
                if (user.role === 'artist' && bodyArtistId !== user.artist_id) {
                    return error('Forbidden', 403, origin);
                }

                // Validate artist_id FK if provided
                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                const tracks = (body.tracks as Record<string, unknown>[]) ?? [];
                try {
                    const result = await env.DB.prepare(
                        `INSERT INTO releases (slug, title, artist, artist_slug, artist_id, release_date, type, cover_url, gradient,
                         track_count, stream_url, spotify_url, apple_url, featured, description)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        body.slug, body.title, body.artist ?? '', body.artist_slug ?? '', bodyArtistId,
                        body.release_date ?? '', body.type ?? 'Single', body.cover_url ?? '',
                        body.gradient ?? 'from-gray-700 via-gray-800 to-black',
                        tracks.length || 1, body.stream_url ?? '', body.spotify_url ?? '',
                        body.apple_url ?? '', body.featured ? 1 : 0, body.description ?? ''
                    ).run();
                    const releaseId = result.meta.last_row_id;
                    for (let i = 0; i < tracks.length; i++) {
                        const t = tracks[i];
                        await env.DB.prepare(
                            `INSERT INTO tracks (release_id, title, duration, audio_url, featuring, track_number)
                             VALUES (?, ?, ?, ?, ?, ?)`
                        ).bind(releaseId, t.title ?? '', t.duration ?? '0:00', t.audio_url ?? '', t.featuring ?? '', t.track_number ?? i + 1).run();
                    }
                    const created = await env.DB.prepare('SELECT * FROM releases WHERE id = ?').bind(releaseId).first();
                    const { results: createdTracks } = await env.DB.prepare('SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC').bind(releaseId).all();
                    return json({ ...formatRelease(created as Record<string, unknown>), tracks: createdTracks.map(formatTrack) }, 201, origin);
                } catch (e: unknown) {
                    if (e instanceof Error && e.message.includes('UNIQUE')) return error('Slug already exists', 409, origin);
                    throw e;
                }
            }

            // ── PUT /api/releases/:id ────────────────────────────────────────────────
            const releaseIdMatch = path.match(/^\/api\/releases\/(\d+)$/);
            if (request.method === 'PUT' && releaseIdMatch) {
                const user = await requireAuth(request, env);
                const id = releaseIdMatch[1];
                const existingRelease = await env.DB.prepare('SELECT * FROM releases WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingRelease) return error('Release not found', 404, origin);
                if (!requireOwnership(user, existingRelease.artist_id as number | null)) return error('Forbidden', 403, origin);

                const body = await request.json() as Record<string, unknown>;
                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : (existingRelease.artist_id as number | null);
                const tracks = (body.tracks as Record<string, unknown>[]) ?? [];
                await env.DB.prepare(
                    `UPDATE releases SET slug=?, title=?, artist=?, artist_slug=?, artist_id=?, release_date=?, type=?, cover_url=?,
                     gradient=?, track_count=?, stream_url=?, spotify_url=?, apple_url=?, featured=?, description=?, updated_at=datetime('now')
                     WHERE id=?`
                ).bind(
                    body.slug, body.title, body.artist ?? '', body.artist_slug ?? '', bodyArtistId,
                    body.release_date ?? '', body.type ?? 'Single', body.cover_url ?? '',
                    body.gradient ?? 'from-gray-700 via-gray-800 to-black',
                    tracks.length || 1, body.stream_url ?? '', body.spotify_url ?? '',
                    body.apple_url ?? '', body.featured ? 1 : 0, body.description ?? '', id
                ).run();
                // Upsert tracks: delete existing, re-insert
                await env.DB.prepare('DELETE FROM tracks WHERE release_id = ?').bind(id).run();
                for (let i = 0; i < tracks.length; i++) {
                    const t = tracks[i];
                    await env.DB.prepare(
                        `INSERT INTO tracks (release_id, title, duration, audio_url, featuring, track_number)
                         VALUES (?, ?, ?, ?, ?, ?)`
                    ).bind(id, t.title ?? '', t.duration ?? '0:00', t.audio_url ?? '', t.featuring ?? '', t.track_number ?? i + 1).run();
                }
                const updated = await env.DB.prepare('SELECT * FROM releases WHERE id = ?').bind(id).first();
                if (!updated) return error('Release not found', 404, origin);
                const { results: updatedTracks } = await env.DB.prepare('SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC').bind(id).all();
                return json({ ...formatRelease(updated as Record<string, unknown>), tracks: updatedTracks.map(formatTrack) }, 200, origin);
            }

            // ── DELETE /api/releases/:id ─────────────────────────────────────────────
            if (request.method === 'DELETE' && releaseIdMatch) {
                const user = await requireAuth(request, env);
                const id = releaseIdMatch[1];
                const existingRelease = await env.DB.prepare('SELECT * FROM releases WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingRelease) return error('Release not found', 404, origin);
                if (!requireOwnership(user, existingRelease.artist_id as number | null)) return error('Forbidden', 403, origin);
                await env.DB.prepare('DELETE FROM releases WHERE id = ?').bind(id).run();
                return json({ success: true }, 200, origin);
            }

            // ── POST /api/tracks ─────────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/tracks') {
                const user = await requireAuth(request, env);
                const body = await request.json() as Record<string, unknown>;

                if (!body.title || !body.audio_url) return error('title and audio_url are required', 400, origin);

                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : null;
                const bodyReleaseId = body.release_id != null ? (body.release_id as number) : null;

                // Artist users can only create tracks for themselves
                if (user.role === 'artist' && bodyArtistId !== user.artist_id) {
                    return error('Forbidden', 403, origin);
                }

                // Validate artist_id FK if provided
                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                // Validate release_id FK if provided
                if (bodyReleaseId != null) {
                    const release = await env.DB.prepare('SELECT id FROM releases WHERE id = ?').bind(bodyReleaseId).first();
                    if (!release) return error('Release not found', 404, origin);
                }

                const result = await env.DB.prepare(
                    `INSERT INTO tracks (title, duration, audio_url, featuring, track_number, artist_id, is_standalone)
                     VALUES (?, ?, ?, ?, ?, ?, 1)`
                ).bind(body.title, body.duration ?? '0:00', body.audio_url, body.featuring ?? '', body.track_number ?? 1, bodyArtistId).run();
                const created = await env.DB.prepare('SELECT * FROM tracks WHERE id = ?').bind(result.meta.last_row_id).first();
                return json(formatTrack(created as Record<string, unknown>), 201, origin);
            }

            // ── PUT /api/tracks/:id ──────────────────────────────────────────────────
            const trackIdMatch = path.match(/^\/api\/tracks\/(\d+)$/);
            if (request.method === 'PUT' && trackIdMatch) {
                const user = await requireAuth(request, env);
                const id = trackIdMatch[1];
                const existingTrack = await env.DB.prepare('SELECT * FROM tracks WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingTrack) return error('Track not found', 404, origin);
                if (!requireOwnership(user, existingTrack.artist_id as number | null)) return error('Forbidden', 403, origin);
                const body = await request.json() as Record<string, unknown>;
                const title = (body.title as string | undefined) ?? (existingTrack.title as string);
                const duration = (body.duration as string | undefined) ?? (existingTrack.duration as string) ?? '0:00';
                const audio_url = (body.audio_url as string | undefined) ?? (existingTrack.audio_url as string) ?? '';
                const featuring = (body.featuring as string | undefined) ?? (existingTrack.featuring as string) ?? '';
                const artist_id = 'artist_id' in body ? (body.artist_id as number | null) : (existingTrack.artist_id as number | null);
                const release_id = 'release_id' in body ? (body.release_id as number | null) : (existingTrack.release_id as number | null);
                await env.DB.prepare(
                    `UPDATE tracks SET title=?, duration=?, audio_url=?, featuring=?, artist_id=?, release_id=? WHERE id=?`
                ).bind(title, duration, audio_url, featuring, artist_id, release_id, id).run();
                const updated = await env.DB.prepare('SELECT * FROM tracks WHERE id = ?').bind(id).first();
                return json(formatTrack(updated as Record<string, unknown>), 200, origin);
            }

            // ── DELETE /api/tracks/:id ───────────────────────────────────────────────
            if (request.method === 'DELETE' && trackIdMatch) {
                const user = await requireAuth(request, env);
                const id = trackIdMatch[1];
                const existingTrack = await env.DB.prepare('SELECT * FROM tracks WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingTrack) return error('Track not found', 404, origin);
                if (!requireOwnership(user, existingTrack.artist_id as number | null)) return error('Forbidden', 403, origin);
                await env.DB.prepare('DELETE FROM tracks WHERE id = ?').bind(id).run();
                return json({ success: true }, 200, origin);
            }

            // ── POST /api/events ─────────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/events') {
                const user = await requireAuth(request, env);
                const body = await request.json() as Record<string, unknown>;
                if (!body.title || !body.slug) return error('title and slug are required', 400, origin);

                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : null;

                if (user.role === 'artist' && bodyArtistId !== user.artist_id) {
                    return error('Forbidden', 403, origin);
                }

                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                try {
                    const result = await env.DB.prepare(
                        `INSERT INTO events (slug, title, artist, artist_slug, artist_id, venue, location, event_date, iso_date, event_time, ticket_url, cover_url, gradient, featured, description)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        body.slug, body.title, body.artist ?? '', body.artist_slug ?? '', bodyArtistId,
                        body.venue ?? '', body.location ?? '', body.event_date ?? '', body.iso_date ?? '',
                        body.event_time ?? '', body.ticket_url ?? '/contact', body.cover_url ?? '',
                        body.gradient ?? 'from-gray-700 via-gray-800 to-black', body.featured ? 1 : 0, body.description ?? ''
                    ).run();
                    const created = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(result.meta.last_row_id).first();
                    return json(formatEvent(created as Record<string, unknown>), 201, origin);
                } catch (e: unknown) {
                    if (e instanceof Error && e.message.includes('UNIQUE')) return error('Slug already exists', 409, origin);
                    throw e;
                }
            }

            // ── PUT /api/events/:id ──────────────────────────────────────────────────
            const eventIdMatch = path.match(/^\/api\/events\/(\d+)$/);
            if (request.method === 'PUT' && eventIdMatch) {
                const user = await requireAuth(request, env);
                const id = eventIdMatch[1];
                const existingEvent = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingEvent) return error('Event not found', 404, origin);
                if (!requireOwnership(user, existingEvent.artist_id as number | null)) return error('Forbidden', 403, origin);

                const body = await request.json() as Record<string, unknown>;
                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : (existingEvent.artist_id as number | null);

                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                await env.DB.prepare(
                    `UPDATE events SET slug=?, title=?, artist=?, artist_slug=?, artist_id=?, venue=?, location=?, event_date=?, iso_date=?,
                     event_time=?, ticket_url=?, cover_url=?, gradient=?, featured=?, description=?, updated_at=datetime('now')
                     WHERE id=?`
                ).bind(
                    body.slug, body.title, body.artist ?? '', body.artist_slug ?? '', bodyArtistId,
                    body.venue ?? '', body.location ?? '', body.event_date ?? '', body.iso_date ?? '',
                    body.event_time ?? '', body.ticket_url ?? '/contact', body.cover_url ?? '',
                    body.gradient ?? 'from-gray-700 via-gray-800 to-black', body.featured ? 1 : 0, body.description ?? '', id
                ).run();
                const updated = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first();
                if (!updated) return error('Event not found', 404, origin);
                return json(formatEvent(updated as Record<string, unknown>), 200, origin);
            }

            // ── DELETE /api/events/:id ───────────────────────────────────────────────
            if (request.method === 'DELETE' && eventIdMatch) {
                const user = await requireAuth(request, env);
                const id = eventIdMatch[1];
                const existingEvent = await env.DB.prepare('SELECT * FROM events WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingEvent) return error('Event not found', 404, origin);
                if (!requireOwnership(user, existingEvent.artist_id as number | null)) return error('Forbidden', 403, origin);
                await env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
                return json({ success: true }, 200, origin);
            }

            // ── POST /api/blog ───────────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/blog') {
                const user = await requireAuth(request, env);
                const body = await request.json() as Record<string, unknown>;
                if (!body.title || !body.slug) return error('title and slug are required', 400, origin);

                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : null;

                if (user.role === 'artist' && bodyArtistId !== user.artist_id) {
                    return error('Forbidden', 403, origin);
                }

                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                try {
                    const result = await env.DB.prepare(
                        `INSERT INTO blog_posts (slug, title, excerpt, content, author, category, cover_url, gradient, featured, published, published_at, artist_id)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        body.slug, body.title, body.excerpt ?? '', body.content ?? '',
                        body.author ?? 'SoundGang', body.category ?? 'News', body.cover_url ?? '',
                        body.gradient ?? 'from-gray-700 via-gray-800 to-black',
                        body.featured ? 1 : 0, body.published !== false ? 1 : 0,
                        body.published_at ?? new Date().toISOString(), bodyArtistId
                    ).run();
                    const created = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(result.meta.last_row_id).first();
                    return json(formatPost(created as Record<string, unknown>), 201, origin);
                } catch (e: unknown) {
                    if (e instanceof Error && e.message.includes('UNIQUE')) return error('Slug already exists', 409, origin);
                    throw e;
                }
            }

            // ── PUT /api/blog/:id ────────────────────────────────────────────────────
            const blogIdMatch = path.match(/^\/api\/blog\/(\d+)$/);
            if (request.method === 'PUT' && blogIdMatch) {
                const user = await requireAuth(request, env);
                const id = blogIdMatch[1];
                const existingPost = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingPost) return error('Post not found', 404, origin);
                if (!requireOwnership(user, existingPost.artist_id as number | null)) return error('Forbidden', 403, origin);

                const body = await request.json() as Record<string, unknown>;
                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : (existingPost.artist_id as number | null);

                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                await env.DB.prepare(
                    `UPDATE blog_posts SET slug=?, title=?, excerpt=?, content=?, author=?, category=?, cover_url=?,
                     gradient=?, featured=?, published=?, artist_id=?, updated_at=datetime('now') WHERE id=?`
                ).bind(
                    body.slug, body.title, body.excerpt ?? '', body.content ?? '',
                    body.author ?? 'SoundGang', body.category ?? 'News', body.cover_url ?? '',
                    body.gradient ?? 'from-gray-700 via-gray-800 to-black',
                    body.featured ? 1 : 0, body.published !== false ? 1 : 0, bodyArtistId, id
                ).run();
                const updated = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first();
                if (!updated) return error('Post not found', 404, origin);
                return json(formatPost(updated as Record<string, unknown>), 200, origin);
            }

            // ── DELETE /api/blog/:id ─────────────────────────────────────────────────
            if (request.method === 'DELETE' && blogIdMatch) {
                const user = await requireAuth(request, env);
                const id = blogIdMatch[1];
                const existingPost = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingPost) return error('Post not found', 404, origin);
                if (!requireOwnership(user, existingPost.artist_id as number | null)) return error('Forbidden', 403, origin);
                await env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
                return json({ success: true }, 200, origin);
            }

            // ── POST /api/videos ─────────────────────────────────────────────────────
            if (request.method === 'POST' && path === '/api/videos') {
                const user = await requireAuth(request, env);
                const body = await request.json() as Record<string, unknown>;
                if (!body.title) return error('title is required', 400, origin);

                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : null;

                if (user.role === 'artist' && bodyArtistId !== user.artist_id) {
                    return error('Forbidden', 403, origin);
                }

                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                const result = await env.DB.prepare(
                    `INSERT INTO videos (title, artist, artist_slug, artist_id, youtube_id, thumbnail, video_date)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`
                ).bind(body.title, body.artist ?? '', body.artist_slug ?? '', bodyArtistId, body.youtube_id ?? '', body.thumbnail ?? '', body.video_date ?? '').run();
                const created = await env.DB.prepare('SELECT * FROM videos WHERE id = ?').bind(result.meta.last_row_id).first();
                return json(formatVideo(created as Record<string, unknown>), 201, origin);
            }

            // ── PUT /api/videos/:id ──────────────────────────────────────────────────
            const videoIdMatch = path.match(/^\/api\/videos\/(\d+)$/);
            if (request.method === 'PUT' && videoIdMatch) {
                const user = await requireAuth(request, env);
                const id = videoIdMatch[1];
                const existingVideo = await env.DB.prepare('SELECT * FROM videos WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingVideo) return error('Video not found', 404, origin);
                if (!requireOwnership(user, existingVideo.artist_id as number | null)) return error('Forbidden', 403, origin);

                const body = await request.json() as Record<string, unknown>;
                const bodyArtistId = body.artist_id != null ? (body.artist_id as number) : (existingVideo.artist_id as number | null);

                if (bodyArtistId != null) {
                    const artist = await env.DB.prepare('SELECT id FROM artists WHERE id = ?').bind(bodyArtistId).first();
                    if (!artist) return error('Artist not found', 404, origin);
                }

                await env.DB.prepare(
                    `UPDATE videos SET title=?, artist=?, artist_slug=?, artist_id=?, youtube_id=?, thumbnail=?, video_date=? WHERE id=?`
                ).bind(body.title, body.artist ?? '', body.artist_slug ?? '', bodyArtistId, body.youtube_id ?? '', body.thumbnail ?? '', body.video_date ?? '', id).run();
                const updated = await env.DB.prepare('SELECT * FROM videos WHERE id = ?').bind(id).first();
                if (!updated) return error('Video not found', 404, origin);
                return json(formatVideo(updated as Record<string, unknown>), 200, origin);
            }

            // ── DELETE /api/videos/:id ───────────────────────────────────────────────
            if (request.method === 'DELETE' && videoIdMatch) {
                const user = await requireAuth(request, env);
                const id = videoIdMatch[1];
                const existingVideo = await env.DB.prepare('SELECT * FROM videos WHERE id = ?').bind(id).first() as Record<string, unknown> | null;
                if (!existingVideo) return error('Video not found', 404, origin);
                if (!requireOwnership(user, existingVideo.artist_id as number | null)) return error('Forbidden', 403, origin);
                await env.DB.prepare('DELETE FROM videos WHERE id = ?').bind(id).run();
                return json({ success: true }, 200, origin);
            }

            // ── GET /api/playlist ────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/playlist') {
                const rows = await env.DB.prepare(`
                    SELECT t.id, t.title, t.duration, t.audio_url, t.featuring,
                           r.title AS release_title, r.cover_url, r.artist
                    FROM playlist_tracks pt
                    JOIN tracks t ON pt.track_id = t.id
                    JOIN releases r ON t.release_id = r.id
                    WHERE pt.playlist_id = 1
                    ORDER BY pt.position ASC
                `).all<Record<string, unknown>>();
                const tracks = (rows.results ?? []).map(row => ({
                    id: row.id,
                    title: row.title,
                    duration: row.duration,
                    audioUrl: row.audio_url,
                    featuring: row.featuring || '',
                    releaseTitle: row.release_title,
                    coverImage: row.cover_url,
                    artist: row.artist,
                }));
                return json(tracks, 200, origin);
            }

            // ── PUT /api/playlist ────────────────────────────────────────────────────
            if (request.method === 'PUT' && path === '/api/playlist') {
                try {
                    await requireAdmin(request, env);
                } catch (e) {
                    if (e instanceof Response) return e;
                    return error('Forbidden', 403, origin);
                }
                const body = await request.json() as { trackIds?: number[] };
                const trackIds = body.trackIds ?? [];
                const statements: D1PreparedStatement[] = [
                    env.DB.prepare('DELETE FROM playlist_tracks WHERE playlist_id = 1'),
                    ...trackIds.map((trackId, i) =>
                        env.DB.prepare('INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (1, ?, ?)').bind(trackId, i + 1)
                    ),
                    env.DB.prepare("UPDATE playlists SET updated_at = datetime('now') WHERE id = 1"),
                ];
                await env.DB.batch(statements);
                const rows = await env.DB.prepare(`
                    SELECT t.id, t.title, t.duration, t.audio_url, t.featuring,
                           r.title AS release_title, r.cover_url, r.artist
                    FROM playlist_tracks pt
                    JOIN tracks t ON pt.track_id = t.id
                    JOIN releases r ON t.release_id = r.id
                    WHERE pt.playlist_id = 1
                    ORDER BY pt.position ASC
                `).all<Record<string, unknown>>();
                const tracks = (rows.results ?? []).map(row => ({
                    id: row.id,
                    title: row.title,
                    duration: row.duration,
                    audioUrl: row.audio_url,
                    featuring: row.featuring || '',
                    releaseTitle: row.release_title,
                    coverImage: row.cover_url,
                    artist: row.artist,
                }));
                return json(tracks, 200, origin);
            }

            // ── GET /api/media ───────────────────────────────────────────────────────
            if (request.method === 'GET' && path === '/api/media') {
                await requireAdmin(request, env);
                const typeParam = url.searchParams.get('type') as 'image' | 'audio' | null;
                const listed = await env.MEDIA.list();
                let objects = listed.objects;
                if (typeParam === 'image') {
                    objects = objects.filter(obj => (obj.httpMetadata?.contentType ?? '').startsWith('image/'));
                } else if (typeParam === 'audio') {
                    objects = objects.filter(obj => (obj.httpMetadata?.contentType ?? '').startsWith('audio/'));
                }
                const media = objects.map(obj => ({
                    key: obj.key,
                    url: `${env.R2_PUBLIC_URL}/${obj.key}`,
                    size: obj.size,
                    contentType: obj.httpMetadata?.contentType ?? '',
                    lastModified: obj.uploaded?.toISOString() ?? '',
                }));
                return json(media, 200, origin);
            }

            return error('Not found', 404, origin);

        } catch (err) {
            // requireAuth / requireAdmin throw Response objects directly
            if (err instanceof Response) return err;
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
        artistId: r.artist_id ?? null,
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
        releaseId: r.release_id ?? null,
        isStandalone: r.is_standalone === 1,
        artistId: r.artist_id ?? null,
        // Joined fields (present when fetched via /api/tracks)
        artistName: r.artist_name || undefined,
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
        artistId: r.artist_id ?? null,
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
        artistId: r.artist_id ?? null,
    };
}

function formatVideo(r: Record<string, unknown>) {
    return {
        id: r.id,
        title: r.title,
        artist: r.artist,
        artistSlug: r.artist_slug,
        artistId: r.artist_id ?? null,
        youtubeId: r.youtube_id,
        thumbnail: r.thumbnail,
        date: r.video_date,
    };
}
