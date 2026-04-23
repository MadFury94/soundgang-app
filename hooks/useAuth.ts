'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiLogin } from '@/lib/admin-api';

const TOKEN_KEY = 'sg_auth_token';

export interface AuthUser {
    id: number;
    email: string;
    role: 'admin' | 'artist';
    artist_id: number | null;
}

interface UseAuthReturn {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isArtist: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

function decodeJWTPayload(token: string): AuthUser | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: Number(payload.sub),
            email: payload.email,
            role: payload.role,
            artist_id: payload.artist_id ?? null,
        };
    } catch {
        return null;
    }
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = sessionStorage.getItem(TOKEN_KEY);
        if (stored) {
            const decoded = decodeJWTPayload(stored);
            if (decoded) {
                setToken(stored);
                setUser(decoded);
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { token: jwt } = await apiLogin(email, password);
            const decoded = decodeJWTPayload(jwt);
            if (!decoded) {
                return { success: false, error: 'Invalid token received from server.' };
            }
            sessionStorage.setItem(TOKEN_KEY, jwt);
            setToken(jwt);
            setUser(decoded);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
            return { success: false, error: message };
        }
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
        }
    }, []);

    return {
        user,
        token,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin',
        isArtist: user?.role === 'artist',
        isLoading,
        login,
        logout,
    };
}
