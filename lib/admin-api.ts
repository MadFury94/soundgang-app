'use client';
// =============================================================================
// Admin API Client
// Reads token from sessionStorage. Sends Authorization: Bearer <token>.
// On 401, redirects to /admin/login.
// =============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://soundgang-api.onochieazukaeme.workers.dev';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sg_auth_token');
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
        }
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const body = await res.json() as { error?: string };
            if (body.error) msg = body.error;
        } catch { /* ignore */ }
        throw new Error(msg);
    }
    return res.json() as Promise<T>;
}

// ─── Artists ──────────────────────────────────────────────────────────────────

export async function adminGetArtists() {
    const res = await fetch(`${API_URL}/api/artists`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminGetArtistById(id: number): Promise<unknown> {
    const artists = await adminGetArtists();
    const found = (artists as Record<string, unknown>[]).find((a) => Number(a.id) === id);
    if (!found) throw new Error('404');
    return found;
}

export async function adminCreateArtist(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/artists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminUpdateArtist(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/artists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminDeleteArtist(id: number) {
    const res = await fetch(`${API_URL}/api/artists/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

// ─── Releases ─────────────────────────────────────────────────────────────────

export async function adminGetReleases() {
    const res = await fetch(`${API_URL}/api/releases`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminGetRelease(id: number): Promise<unknown> {
    const res = await fetch(`${API_URL}/api/releases/${id}`, { headers: authHeaders() });
    return handleResponse<unknown>(res);
}

export async function adminCreateRelease(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/releases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminUpdateRelease(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/releases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminDeleteRelease(id: number) {
    const res = await fetch(`${API_URL}/api/releases/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export async function adminCreateTrack(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminUpdateTrack(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/tracks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminDeleteTrack(id: number) {
    const res = await fetch(`${API_URL}/api/tracks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function adminGetEvents() {
    const res = await fetch(`${API_URL}/api/events`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminCreateEvent(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminUpdateEvent(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminDeleteEvent(id: number) {
    const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function adminGetBlogPosts() {
    const res = await fetch(`${API_URL}/api/blog`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminCreateBlogPost(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminUpdateBlogPost(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminDeleteBlogPost(id: number) {
    const res = await fetch(`${API_URL}/api/blog/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function adminGetVideos() {
    const res = await fetch(`${API_URL}/api/videos`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminCreateVideo(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminUpdateVideo(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<unknown>(res);
}

export async function adminDeleteVideo(id: number) {
    const res = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaObject {
    key: string;
    url: string;
    size: number;
    contentType: string;
    lastModified: string;
}

export async function adminGetMedia(type?: 'image' | 'audio' | 'all'): Promise<MediaObject[]> {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.set('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}/api/media${query}`, { headers: authHeaders() });
    return handleResponse<MediaObject[]>(res);
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export async function adminUploadImage(file: File, key: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    const res = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    return handleResponse<{ url: string }>(res);
}

export async function adminUploadAudio(file: File, key: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    const res = await fetch(`${API_URL}/api/upload/audio`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    return handleResponse<{ url: string }>(res);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
    id: number;
    email: string;
    role: 'admin' | 'artist';
    artist_id: number | null;
}

export interface CreateUserPayload {
    email: string;
    password: string;
    role?: 'admin' | 'artist';
    artist_id?: number | null;
}

export interface UpdateUserPayload {
    email?: string;
    role?: 'admin' | 'artist';
    artist_id?: number | null;
}

export async function apiLogin(email: string, password: string): Promise<{ token: string }> {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string }>(res);
}

export async function apiGetMe(): Promise<AuthUser> {
    const res = await fetch(`${API_URL}/api/auth/me`, { headers: authHeaders() });
    return handleResponse<AuthUser>(res);
}

export async function apiCreateUser(data: CreateUserPayload): Promise<AuthUser> {
    const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<AuthUser>(res);
}

export async function apiUpdateUser(id: number, data: UpdateUserPayload): Promise<AuthUser> {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return handleResponse<AuthUser>(res);
}

export async function adminGetReleasesByArtist(artistId: number): Promise<unknown[]> {
    const res = await fetch(`${API_URL}/api/releases?artist_id=${artistId}`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminGetEventsByArtist(artistId: number): Promise<unknown[]> {
    const res = await fetch(`${API_URL}/api/events?artist_id=${artistId}`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminGetBlogPostsByArtist(artistId: number): Promise<unknown[]> {
    const res = await fetch(`${API_URL}/api/blog?artist_id=${artistId}`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

export async function adminGetVideosByArtist(artistId: number): Promise<unknown[]> {
    const res = await fetch(`${API_URL}/api/videos?artist_id=${artistId}`, { headers: authHeaders() });
    return handleResponse<unknown[]>(res);
}

// ─── Health / Auth ────────────────────────────────────────────────────────────

export async function adminVerifyToken(token: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/api/health`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return false;
        const data = await res.json() as { admin?: boolean };
        return data.admin === true;
    } catch {
        return false;
    }
}

// ─── Playlist ─────────────────────────────────────────────────────────────────

export interface PlaylistTrack {
    id: number;
    title: string;
    duration: string;
    audioUrl: string;
    featuring: string;
    releaseTitle: string;
    coverImage: string;
    artist: string;
}

export async function adminGetPlaylist(): Promise<PlaylistTrack[]> {
    const res = await fetch(`${API_URL}/api/playlist`);
    return handleResponse<PlaylistTrack[]>(res);
}

export async function adminSavePlaylist(trackIds: number[]): Promise<PlaylistTrack[]> {
    const res = await fetch(`${API_URL}/api/playlist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ trackIds }),
    });
    return handleResponse<PlaylistTrack[]>(res);
}
