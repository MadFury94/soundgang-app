/**
 * Auth helpers for the SoundGang Cloudflare Worker.
 *
 * - JWT sign/verify via `jose` (HS256, Web Crypto — works on CF Workers)
 * - Password hashing via `bcryptjs` (pure-JS, works on CF Workers)
 * - requireAuth / requireAdmin / requireOwnership middleware helpers
 * - Input validation: isValidEmail, isValidPassword
 */

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JWTPayload {
    sub: string;           // user id as string
    email: string;
    role: 'admin' | 'artist';
    artist_id: number | null;
    iat: number;
    exp: number;
}

export interface Env {
    DB: D1Database;
    MEDIA: R2Bucket;
    R2_PUBLIC_URL: string;
    ENVIRONMENT: string;
    ADMIN_SECRET?: string;
    JWT_SECRET: string;
}

// ─── JWT helpers ──────────────────────────────────────────────────────────────

/**
 * Sign a JWT with HS256, 24-hour expiry.
 */
export async function signJWT(
    payload: Omit<JWTPayload, 'iat' | 'exp'>,
    secret: string
): Promise<string> {
    const key = new TextEncoder().encode(secret);
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

/**
 * Verify a JWT. Returns the decoded payload or null if invalid/expired.
 */
export async function verifyJWT(
    token: string,
    secret: string
): Promise<JWTPayload | null> {
    try {
        const key = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

// ─── Auth middleware helpers ──────────────────────────────────────────────────

/**
 * Extracts the Bearer token from the Authorization header and verifies it.
 * Returns the decoded JWTPayload on success.
 * Throws a Response with HTTP 401 on failure.
 */
export async function requireAuth(request: Request, env: Env): Promise<JWTPayload> {
    const auth = request.headers.get('Authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) {
        throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const payload = await verifyJWT(token, env.JWT_SECRET);
    if (!payload) {
        throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return payload;
}

/**
 * Accepts either:
 *   - A valid admin-role JWT (new path)
 *   - The raw ADMIN_SECRET bearer token (backward compat)
 *
 * Throws a Response with HTTP 401/403 on failure.
 */
export async function requireAdmin(request: Request, env: Env): Promise<void> {
    const auth = request.headers.get('Authorization');

    // Backward compat: raw ADMIN_SECRET bearer token
    if (env.ADMIN_SECRET && auth === `Bearer ${env.ADMIN_SECRET}`) {
        return;
    }

    // JWT path
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) {
        throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const payload = await verifyJWT(token, env.JWT_SECRET);
    if (!payload) {
        throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (payload.role !== 'admin') {
        throw new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

/**
 * Checks ownership of a content item.
 * - Admin users bypass all checks (returns true).
 * - Artist users must have a matching artist_id.
 */
export function requireOwnership(
    user: JWTPayload,
    contentArtistId: number | null
): boolean {
    if (user.role === 'admin') return true;
    if (user.artist_id === null) return false;
    return user.artist_id === contentArtistId;
}

// ─── Password helpers ─────────────────────────────────────────────────────────

const BCRYPT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

// ─── Input validation ─────────────────────────────────────────────────────────

/**
 * Basic email validation: must contain @ with a non-empty local part and domain.
 */
export function isValidEmail(email: string): boolean {
    const idx = email.indexOf('@');
    if (idx < 1) return false;                    // no @ or empty local part
    const domain = email.slice(idx + 1);
    return domain.includes('.') && domain.length >= 3; // domain must have a dot
}

/**
 * Password must be at least 8 characters.
 */
export function isValidPassword(password: string): boolean {
    return password.length >= 8;
}
