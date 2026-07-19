"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { LANGUAGES, Language } from "@/lib/translations";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const isSignedIn = !!user;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/60 backdrop-blur-xl"
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-heading font-medium tracking-tight text-black">
                        {t("nav.logo")}
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-medium text-black">
                    {(!user || user.role === "asha") && (
                        <Link href="/asha" className="hover:text-gray-500 transition-colors">{t("nav.ashaPortal")}</Link>
                    )}
                    {(!user || user.role === "doctor") && (
                        <Link href="/doctor" className="hover:text-gray-500 transition-colors">{t("nav.doctorPortal")}</Link>
                    )}
                    {(!user || user.role === "admin") && (
                        <Link href="/admin" className="hover:text-gray-500 transition-colors">{t("nav.admin")}</Link>
                    )}

                    {/* Language Dropdown */}
                    <div className="flex items-center gap-2 bg-gray-100/80 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/60 transition-colors">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer pr-1"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code} className="text-black bg-white">
                                    {lang.nativeLabel}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!isSignedIn && (
                        <Link href="/login">
                            <button className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-sm">
                                {t("nav.signIn")}
                            </button>
                        </Link>
                    )}
                    {isSignedIn && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 text-sm">
                                <UserIcon className="w-4 h-4 text-gray-500" />
                                <span className="font-bold text-gray-800">{user?.username}</span>
                                <span className="text-xs text-gray-400 capitalize">({user?.role})</span>
                            </div>
                            <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title={t("nav.signOut")}>
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </nav>

                <div className="md:hidden flex items-center">
                    <button
                        className="p-2 text-gray-800 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="md:hidden bg-white border-b border-gray-200 overflow-hidden shadow-2xl relative z-40"
                    >
                        <nav className="flex flex-col px-6 py-6 gap-4 font-medium text-black">
                            {(!user || user.role === "asha") && (
                                <Link href="/asha" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border-b border-gray-100 hover:text-gray-500 transition-colors">{t("nav.ashaPortal")}</Link>
                            )}
                            {(!user || user.role === "doctor") && (
                                <Link href="/doctor" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border-b border-gray-100 hover:text-gray-500 transition-colors">{t("nav.doctorPortal")}</Link>
                            )}
                            {(!user || user.role === "admin") && (
                                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border-b border-gray-100 hover:text-gray-500 transition-colors">{t("nav.admin")}</Link>
                            )}

                            {/* Mobile Language Selector */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-sm mt-1">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-500 font-semibold">Language</span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                    className="bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer ml-auto pr-2"
                                >
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.nativeLabel}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile User Credentials Badge */}
                            {isSignedIn && (
                                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-sm mt-1">
                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-gray-800 truncate leading-none mb-1">{user?.username}</span>
                                        <span className="text-xs text-gray-400 capitalize leading-none">{user?.role} Portal</span>
                                    </div>
                                </div>
                            )}

                            {!isSignedIn && (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="py-2.5 mt-2 w-full bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-center">
                                        {t("nav.signIn")}
                                    </button>
                                </Link>
                            )}
                            {isSignedIn && (
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="py-2.5 mt-2 w-full bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                    <LogOut className="w-4 h-4" /> {t("nav.signOut")}
                                </button>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

