"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/components/LanguageContext";
import { KeyRound, ShieldAlert, Sparkles, UserCheck, UserPlus } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    // Sign Up specific state
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("asha");
    const [location, setLocation] = useState("");
    const [specialization, setSpecialization] = useState("General Physician");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testUsers = [
        { label: "Admin Account", username: "admin", password: "adminpassword", role: "admin" },
        { label: "ASHA Worker (Anita Joshi)", username: "anitajoshi", password: "ashapassword", role: "asha" },
        { label: "Doctor (Dr. Arjun Rao)", username: "arjunrao", password: "doctorpassword", role: "doctor" }
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
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get("redirect");
            
            const role = res.user?.role;
            if (redirectUrl) {
                router.push(redirectUrl);
            } else if (role === "admin") {
                router.push("/admin");
            } else if (role === "doctor") {
                router.push("/doctor");
            } else if (role === "asha") {
                router.push("/asha");
            } else {
                router.push("/");
            }
        } else {
            setError(res.error || "Invalid credentials. Please verify your username and password.");
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const payload = {
                username,
                password,
                role,
                name: fullName || undefined,
                location: role === "asha" ? location : undefined,
                specialization: role === "doctor" ? specialization : undefined
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("Account created successfully! Please sign in using your new credentials.");
                setIsSignUp(false);
                setError(null);
                setPassword("");
            } else {
                setError(data.detail || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Failed to connect to authentication server.");
        } finally {
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
                        
                        <div className="flex border-b border-gray-100 mb-6">
                            <button
                                onClick={() => { setIsSignUp(false); setError(null); setSuccessMessage(null); }}
                                className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${!isSignUp ? "border-orange-500 text-gray-900" : "border-transparent text-gray-400"}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setIsSignUp(true); setError(null); setSuccessMessage(null); }}
                                className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${isSignUp ? "border-orange-500 text-gray-900" : "border-transparent text-gray-400"}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
                                {isSignUp ? <UserPlus className="w-6 h-6 text-orange-500" /> : <Sparkles className="w-6 h-6 text-orange-500" />}
                                {isSignUp ? "Create Account" : t("nav.signIn")}
                            </h2>
                            <p className="text-gray-500 text-xs mt-1">
                                {isSignUp ? "Join the care network today" : "Access your localized care portal"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 text-sm">
                                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 text-sm">
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {!isSignUp ? (
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
                        ) : (
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                                        placeholder="arjunrao"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Dr. Arjun Rao / Anita Joshi"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 cursor-pointer"
                                    >
                                        <option value="asha">ASHA Worker</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {role === "asha" && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Location</label>
                                        <input
                                            type="text"
                                            required
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g., Dombivli"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                        />
                                    </div>
                                )}

                                {role === "doctor" && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Specialization</label>
                                        <input
                                            type="text"
                                            required
                                            value={specialization}
                                            onChange={(e) => setSpecialization(e.target.value)}
                                            placeholder="e.g., Obstetrician"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white hover:bg-gray-900 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-6"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    {loading ? "Creating..." : "Sign Up"}
                                </button>
                            </form>
                        )}

                        {!isSignUp && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Demo Accounts</p>
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
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
