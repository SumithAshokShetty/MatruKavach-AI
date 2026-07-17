"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/LanguageContext";
import { KeyRound, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testUsers = [
        { label: "Admin Account", username: "admin", password: "adminpassword", role: "admin" },
        { label: "ASHA Worker (Anita Joshi)", username: "asha1", password: "ashapassword", role: "asha" },
        { label: "Doctor (Dr. Arjun Rao)", username: "doctor1", password: "doctorpassword", role: "doctor" }
    ];

    const selectTestUser = (user: typeof testUsers[0]) => {
        setUsername(user.username);
        setPassword(user.password);
        setError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await login(username, password);
        if (res.success) {
            // Fetch profile me to route correctly
            const storedToken = localStorage.getItem("auth_token");
            try {
                const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/me`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                if (meRes.ok) {
                    const profile = await meRes.json();
                    if (profile.role === "admin") {
                        router.push("/admin");
                    } else if (profile.role === "doctor") {
                        router.push("/doctor");
                    } else if (profile.role === "asha") {
                        router.push("/asha");
                    } else {
                        router.push("/");
                    }
                } else {
                    router.push("/");
                }
            } catch (err) {
                router.push("/");
            }
        } else {
            setError(res.error || "Invalid credentials. Please verify your username and password.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-body flex flex-col pb-20">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 pt-10">
                <div className="w-full max-w-md space-y-6">
                    <Card className="p-8 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-amber-500" />
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
                                <Sparkles className="w-6 h-6 text-orange-500" />
                                {t("nav.signIn")}
                            </h2>
                            <p className="text-gray-500 text-sm mt-2">Access your localized care portal</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 text-sm">
                                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white hover:bg-gray-900 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-6"
                            >
                                <KeyRound className="w-5 h-5" />
                                {loading ? "Authenticating..." : t("nav.signIn")}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Seeded Demo Accounts</p>
                            <div className="grid grid-cols-1 gap-2">
                                {testUsers.map((user) => (
                                    <button
                                        key={user.username}
                                        type="button"
                                        onClick={() => selectTestUser(user)}
                                        className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-xl border border-gray-200/50 transition-colors flex items-center justify-between text-left group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                                            <span>{user.label}</span>
                                        </span>
                                        <span className="text-[10px] bg-gray-200/80 px-2 py-0.5 rounded text-gray-500 uppercase font-semibold">{user.role}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
