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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
            fetch(`${API_BASE_URL}/auth/me`, {
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
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
                document.cookie = `token=${data.access_token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax;`;
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
            return { success: false, error: `Could not connect to the backend server. Please verify the backend is running at ${API_BASE_URL}.` };
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        document.cookie = "token=; path=/; max-age=0;";
        setToken(null);
        setUser(null);
        router.push("/login");
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
