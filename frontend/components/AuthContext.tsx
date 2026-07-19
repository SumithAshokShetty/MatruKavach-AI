"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

interface User {
    username: string;
    role: "admin" | "doctor" | "asha";
    associated_id?: string;
}
interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to automatically retry network requests during database wakeups (Neon DB autosuspension)
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 2, delay = 1500): Promise<Response> => {
    try {
        const response = await fetch(url, options);
        // If server returns a bad gateway or service unavailable (common during render restarts), retry
        if ([502, 503, 504].includes(response.status) && retries > 0) {
            throw new Error(`Server temporarily unavailable (${response.status})`);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Connection failed. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay);
        }
        throw error;
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fire a background warm-up ping to wake up the Render container and Neon Database immediately on mount
        fetch(API_BASE_URL).catch(() => {});

        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
            fetchWithRetry(`${API_BASE_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error("Invalid token");
                    }
                })
                .then(data => {
                    setUser(data);
                })
                .catch(() => {
                    localStorage.removeItem("auth_token");
                    document.cookie = "token=; path=/; max-age=0;";
                    setToken(null);
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const res = await fetchWithRetry(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("auth_token", data.access_token);
                // Also set document cookie for middleware validation
                document.cookie = `token=${data.access_token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax; Secure;`;
                setToken(data.access_token);
                setUser(data.user);
                return { success: true, user: data.user };
            }
            if (res.status === 401) {
                return { success: false, error: "Invalid credentials. Please verify your username and password." };
            }
            return { success: false, error: `Server error: HTTP ${res.status}` };
        } catch (e) {
            console.error("Login failed", e);
            return { success: false, error: "Could not connect to the backend server. The database is taking a few seconds to spin up from sleep mode. Please try again in 5 seconds." };
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax; Secure;";
        setToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
