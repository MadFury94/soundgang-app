'use client';
// =============================================================================
// Admin API Client - Static Data Mode
// Uses local JSON data stores only (no API calls)
// =============================================================================

import { artists } from '@/lib/data/artists';
import { releases, getAllTracks } from '@/lib/data/releases';
import { events } from '@/lib/data/events';
import { blogPosts } from '@/lib/data/blog';
import { videos } from '@/lib/data/videos';

// Mock authentication
const MOCK_ADMIN_EMAIL = 'admin@soundgang.com';
const MOCK_ADMIN_PASSWORD = 'admin123';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sg_auth_token');
}

// ─── Artists ──────────────────────────────────────────────────────────────────

export async function adminGetArtists() {
    return Promise.resolve(artists);
}

export async function adminGetArtistById(id: number): Promise<unknown> {
    const found = artists.find((a) => a.id === id);
    if (!found) throw new Error('404');
    return Promise.resolve(found);
}

export async function adminCreateArtist(data: Record<string, unknown>) {
    console.log('[Mock] Create artist:', data);
    return Promise.resolve({ ...data, id: Date.now() });
}

export async function adminUpdateArtist(id: number, data: Record<string, unknown>) {
    console.log('[Mock] Update artist:', id, data);
    return Promise.resolve({ ...data, id });
}

export async function adminDeleteArtist(id: number) {
    console.log('[Mock] Delete artist:', id);
    return Promise.resolve({ success: true });
}

// ─── Releases ─────────────────────────────────────────────────────────────────

export async function adminGetReleases() {
    return Promise.resolve(releases);
}

export async function adminGetRelease(id: number): Promise<unknown> {
    const found = releases.find((r) => r.id === id);
    if (!found) throw new Error('404');
    return Promise.resolve(found);
}

export async function adminCreateRelease(data: Record<string, unknown>) {
    console.log('[Mock] Create release:', data);
    return Promise.resolve({ ...data, id: Date.now() });
}

export async function adminUpdateRelease(id: number, data: Record<string, unknown>) {
    console.log('[Mock] Update release:', id, data);
    return Promise.resolve({ ...data, id });
}

export async function adminDeleteRelease(id: number) {
    console.log('[Mock] Delete release:', id);
    return Promise.resolve({ success: true });
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export async function adminCreateTrack(data: Record<string, unknown>) {
    console.log('[Mock] Create track:', data);
    return Promise.resolve({ ...data, id: Date.now() });
}

export async function adminUpdateTrack(id: number, data: Record<string, unknown>) {
    console.log('[Mock] Update track:', id, data);
    return Promise.resolve({ ...data, id });
}

export async function adminDeleteTrack(id: number) {
    console.log('[Mock] Delete track:', id);
    return Promise.resolve({ success: true });
}

export async function adminGetTracks(params?: { standalone?: boolean; artist_id?: number }): Promise<unknown[]> {
    let tracks = getAllTracks();
    if (params?.standalone) {
        tracks = tracks.filter((t) => t.isStandalone);
    }
    if (params?.artist_id != null) {
        tracks = tracks.filter((t) => t.artistId === params.artist_id);
    }
    return Promise.resolve(tracks);
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function adminGetEvents() {
    return Promise.resolve(events);
}

export async function adminCreateEvent(data: Record<string, unknown>) {
    console.log('[Mock] Create event:', data);
    return Promise.resolve({ ...data, id: Date.now() });
}

export async function adminUpdateEvent(id: number, data: Record<string, unknown>) {
    console.log('[Mock] Update event:', id, data);
    return Promise.resolve({ ...data, id });
}

export async function adminDeleteEvent(id: number) {
    console.log('[Mock] Delete event:', id);
    return Promise.resolve({ success: true });
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function adminGetBlogPosts() {
    return Promise.resolve(blogPosts);
}

export async function adminCreateBlogPost(data: Record<string, unknown>) {
    console.log('[Mock] Create blog post:', data);
    return Promise.resolve({ ...data, id: Date.now() });
}

export async function adminUpdateBlogPost(id: number, data: Record<string, unknown>) {
    console.log('[Mock] Update blog post:', id, data);
    return Promise.resolve({ ...data, id });
}

export async function adminDeleteBlogPost(id: number) {
    console.log('[Mock] Delete blog post:', id);
    return Promise.resolve({ success: true });
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function adminGetVideos() {
    return Promise.resolve(videos);
}

export async function adminCreateVideo(data: Record<string, unknown>) {
    console.log('[Mock] Create video:', data);
    return Promise.resolve({ ...data, id: Date.now() });
}

export async function adminUpdateVideo(id: number, data: Record<string, unknown>) {
    console.log('[Mock] Update video:', id, data);
    return Promise.resolve({ ...data, id });
}

export async function adminDeleteVideo(id: number) {
    console.log('[Mock] Delete video:', id);
    return Promise.resolve({ success: true });
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
    console.log('[Mock] Get media:', type);
    return Promise.resolve([]);
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export async function adminUploadImage(file: File, key: string): Promise<{ url: string }> {
    console.log('[Mock] Upload image:', file.name, key);
    // Return a placeholder URL
    return Promise.resolve({ url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.name)}` });
}

export async function adminUploadAudio(file: File, key: string): Promise<{ url: string }> {
    console.log('[Mock] Upload audio:', file.name, key);
    // Return a placeholder URL
    return Promise.resolve({ url: `https://example.com/audio/${key}` });
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
    // Mock authentication
    if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
        const mockToken = btoa(JSON.stringify({ sub: '1', email, role: 'admin', artist_id: null }));
        return Promise.resolve({ token: mockToken });
    }
    throw new Error('Invalid email or password');
}

export async function apiGetMe(): Promise<AuthUser> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    try {
        const payload = JSON.parse(atob(token.split('.')[1] || token));
        return Promise.resolve({
            id: parseInt(payload.sub || '1'),
            email: payload.email || MOCK_ADMIN_EMAIL,
            role: payload.role || 'admin',
            artist_id: payload.artist_id || null,
        });
    } catch {
        throw new Error('Invalid token');
    }
}

export async function apiCreateUser(data: CreateUserPayload): Promise<AuthUser> {
    console.log('[Mock] Create user:', data);
    return Promise.resolve({
        id: Date.now(),
        email: data.email,
        role: data.role || 'artist',
        artist_id: data.artist_id || null,
    });
}

export async function apiUpdateUser(id: number, data: UpdateUserPayload): Promise<AuthUser> {
    console.log('[Mock] Update user:', id, data);
    return Promise.resolve({
        id,
        email: data.email || MOCK_ADMIN_EMAIL,
        role: data.role || 'admin',
        artist_id: data.artist_id || null,
    });
}

export async function adminGetReleasesByArtist(artistId: number): Promise<unknown[]> {
    return Promise.resolve(releases.filter((r) => r.artistId === artistId));
}

export async function adminGetEventsByArtist(artistId: number): Promise<unknown[]> {
    return Promise.resolve(events.filter((e) => e.artistId === artistId));
}

export async function adminGetBlogPostsByArtist(artistId: number): Promise<unknown[]> {
    return Promise.resolve(blogPosts.filter((p) => p.artistId === artistId));
}

export async function adminGetVideosByArtist(artistId: number): Promise<unknown[]> {
    return Promise.resolve(videos.filter((v) => v.artistId === artistId));
}

// ─── Health / Auth ────────────────────────────────────────────────────────────

export async function adminVerifyToken(token: string): Promise<boolean> {
    try {
        const payload = JSON.parse(atob(token.split('.')[1] || token));
        return payload.role === 'admin';
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
    const tracks = getAllTracks();
    return Promise.resolve(tracks.slice(0, 10).map(t => ({
        id: t.id,
        title: t.title,
        duration: t.duration,
        audioUrl: t.audioUrl,
        featuring: t.featuring || '',
        releaseTitle: t.releaseTitle || '',
        coverImage: t.coverImage || '',
        artist: t.artist || '',
    })));
}

export async function adminSavePlaylist(trackIds: number[]): Promise<PlaylistTrack[]> {
    console.log('[Mock] Save playlist:', trackIds);
    const tracks = getAllTracks();
    const playlistTracks = trackIds
        .map(id => tracks.find(t => t.id === id))
        .filter(Boolean)
        .map(t => ({
            id: t!.id,
            title: t!.title,
            duration: t!.duration,
            audioUrl: t!.audioUrl,
            featuring: t!.featuring || '',
            releaseTitle: t!.releaseTitle || '',
            coverImage: t!.coverImage || '',
            artist: t!.artist || '',
        }));
    return Promise.resolve(playlistTracks);
}
