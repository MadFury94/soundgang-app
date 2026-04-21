'use client';
// =============================================================================
// Admin API Client
// Reads token from sessionStorage. Sends Authorization: Bearer <token>.
// On 401, redirects to /admin/login.
// =============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://soundgang-api.onochieazukaeme.workers.dev';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('sg_admin_token');
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
