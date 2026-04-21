'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminVerifyToken } from '@/lib/admin-api';

const TOKEN_KEY = 'sg_admin_token';

export function useAdminAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = sessionStorage.getItem(TOKEN_KEY);
        if (stored) {
            setToken(stored);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const valid = await adminVerifyToken(password);
            if (valid) {
                sessionStorage.setItem(TOKEN_KEY, password);
                setToken(password);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: 'Invalid password. Please try again.' };
            }
        } catch {
            return { success: false, error: 'Invalid password. Please try again.' };
        }
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
        }
    }, []);

    return { token, isAuthenticated, isLoading, login, logout };
}
