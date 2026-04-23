/**
 * Property-based tests for Task 3 auth API routes.
 *
 * Sub-task 3.1 — Property 3: One-to-one artist-user constraint
 * Sub-task 3.2 — Property 5: /me endpoint round-trip
 * Sub-task 3.3 — Property 7: artist_id included in all content responses
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { signJWT, verifyJWT } from './auth';

// ─── Inline format helpers (mirrors api/src/index.ts) ────────────────────────
// We duplicate the minimal logic here so tests don't depend on the Worker runtime.

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

// ─── In-memory mock of the users table for constraint testing ─────────────────

interface UserRow {
    id: number;
    email: string;
    role: 'admin' | 'artist';
    artist_id: number | null;
}

/**
 * Simulates the PUT /api/users/:id artist_id uniqueness check.
 * Returns 409 if another user already has the given artist_id.
 */
function checkArtistIdConflict(
    users: UserRow[],
    targetUserId: number,
    newArtistId: number | null
): 409 | 200 {
    if (newArtistId == null) return 200;
    const conflict = users.find(u => u.artist_id === newArtistId && u.id !== targetUserId);
    return conflict ? 409 : 200;
}

// ─── Sub-task 3.1 — Property 3: One-to-one artist-user constraint ─────────────
// Feature: artist-user-linking, Property 3: one-to-one artist-user constraint
// Validates: Requirements 2.1, 2.3

describe('Property 3: one-to-one artist-user constraint', () => {
    it('returns 409 when a second user tries to claim an already-linked artist_id', () => {
        /**
         * Validates: Requirements 2.1, 2.3
         */
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 10000 }),  // artistId
                fc.integer({ min: 1, max: 10000 }),  // user1 id
                fc.integer({ min: 1, max: 10000 }),  // user2 id
                (artistId, user1Id, user2Id) => {
                    fc.pre(user1Id !== user2Id);

                    // user1 already owns artistId
                    const users: UserRow[] = [
                        { id: user1Id, email: 'u1@test.com', role: 'artist', artist_id: artistId },
                        { id: user2Id, email: 'u2@test.com', role: 'artist', artist_id: null },
                    ];

                    // user2 tries to claim the same artistId
                    const status = checkArtistIdConflict(users, user2Id, artistId);
                    expect(status).toBe(409);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('returns 200 when the artist_id is not yet linked to any other user', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 10000 }),  // artistId
                fc.integer({ min: 1, max: 10000 }),  // userId
                (artistId, userId) => {
                    const users: UserRow[] = [
                        { id: userId, email: 'u@test.com', role: 'artist', artist_id: null },
                    ];

                    const status = checkArtistIdConflict(users, userId, artistId);
                    expect(status).toBe(200);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('returns 200 when the same user re-sets their own artist_id', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 10000 }),  // artistId
                fc.integer({ min: 1, max: 10000 }),  // userId
                (artistId, userId) => {
                    const users: UserRow[] = [
                        { id: userId, email: 'u@test.com', role: 'artist', artist_id: artistId },
                    ];

                    // Same user updating their own artist_id — not a conflict
                    const status = checkArtistIdConflict(users, userId, artistId);
                    expect(status).toBe(200);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// ─── Sub-task 3.2 — Property 5: /me endpoint round-trip ──────────────────────
// Feature: artist-user-linking, Property 5: /me endpoint round-trip
// Validates: Requirements 3.6

describe('Property 5: /me endpoint round-trip', () => {
    it('JWT payload sub/role/artist_id match the stored user record after sign+verify', async () => {
        /**
         * Validates: Requirements 3.6
         */
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    id: fc.integer({ min: 1, max: 100000 }),
                    email: fc.emailAddress(),
                    role: fc.constantFrom('admin' as const, 'artist' as const),
                    artist_id: fc.option(fc.integer({ min: 1, max: 10000 }), { nil: null }),
                }),
                async (user) => {
                    const secret = 'test-secret-for-me-roundtrip';
                    const token = await signJWT(
                        { sub: String(user.id), email: user.email, role: user.role, artist_id: user.artist_id },
                        secret
                    );
                    const payload = await verifyJWT(token, secret);

                    expect(payload).not.toBeNull();
                    // sub matches user id
                    expect(payload!.sub).toBe(String(user.id));
                    // role matches
                    expect(payload!.role).toBe(user.role);
                    // artist_id matches
                    expect(payload!.artist_id).toBe(user.artist_id);
                    // email matches
                    expect(payload!.email).toBe(user.email);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// ─── Sub-task 3.3 — Property 7: artist_id in all content responses ────────────
// Feature: artist-user-linking, Property 7: artist_id included in all content responses
// Validates: Requirements 4.4, 5.5, 6.4, 7.5

describe('Property 7: artist_id included in all content responses', () => {
    const minimalRow = fc.record({
        id: fc.integer({ min: 1 }),
        artist_id: fc.option(fc.integer({ min: 1 }), { nil: null }),
    });

    it('formatRelease always includes artistId field', () => {
        /**
         * Validates: Requirements 4.4, 5.5, 6.4, 7.5
         */
        fc.assert(
            fc.property(minimalRow, (row) => {
                const result = formatRelease(row as Record<string, unknown>);
                expect('artistId' in result).toBe(true);
                expect(result.artistId).toBe(row.artist_id ?? null);
            }),
            { numRuns: 100 }
        );
    });

    it('formatEvent always includes artistId field', () => {
        fc.assert(
            fc.property(minimalRow, (row) => {
                const result = formatEvent(row as Record<string, unknown>);
                expect('artistId' in result).toBe(true);
                expect(result.artistId).toBe(row.artist_id ?? null);
            }),
            { numRuns: 100 }
        );
    });

    it('formatPost always includes artistId field', () => {
        fc.assert(
            fc.property(minimalRow, (row) => {
                const result = formatPost(row as Record<string, unknown>);
                expect('artistId' in result).toBe(true);
                expect(result.artistId).toBe(row.artist_id ?? null);
            }),
            { numRuns: 100 }
        );
    });

    it('formatVideo always includes artistId field', () => {
        fc.assert(
            fc.property(minimalRow, (row) => {
                const result = formatVideo(row as Record<string, unknown>);
                expect('artistId' in result).toBe(true);
                expect(result.artistId).toBe(row.artist_id ?? null);
            }),
            { numRuns: 100 }
        );
    });

    it('artistId is null when artist_id is null/undefined in the row', () => {
        fc.assert(
            fc.property(
                fc.record({ id: fc.integer({ min: 1 }) }),
                (row) => {
                    // No artist_id field at all
                    expect(formatRelease(row as Record<string, unknown>).artistId).toBeNull();
                    expect(formatEvent(row as Record<string, unknown>).artistId).toBeNull();
                    expect(formatPost(row as Record<string, unknown>).artistId).toBeNull();
                    expect(formatVideo(row as Record<string, unknown>).artistId).toBeNull();
                }
            ),
            { numRuns: 100 }
        );
    });
});
