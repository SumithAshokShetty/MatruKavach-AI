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
                    <Link href="/asha" className="hover:text-gray-500 transition-colors">{t("nav.ashaPortal")}</Link>
                    <Link href="/doctor" className="hover:text-gray-500 transition-colors">{t("nav.doctorPortal")}</Link>
                    <Link href="/admin" className="hover:text-gray-500 transition-colors">{t("nav.admin")}</Link>

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

                <div className="md:hidden flex items-center gap-3">
                    {/* Mobile Language Selector */}
                    <div className="flex items-center gap-1.5 bg-gray-100/80 px-2 py-1 rounded-full border border-gray-200/60">
                        <Globe className="w-3.5 h-3.5 text-gray-500" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.code.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isSignedIn && (
                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded border capitalize">{user?.username} ({user?.role})</span>
                    )}
                    <button
                        className="p-2 text-gray-800"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-200"
                    >
                        <nav className="flex flex-col px-4 py-4 gap-4 font-medium text-black shadow-lg">
                            <Link href="/asha" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100 hover:text-gray-500 transition-colors">{t("nav.ashaPortal")}</Link>
                            <Link href="/doctor" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100 hover:text-gray-500 transition-colors">{t("nav.doctorPortal")}</Link>
                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-gray-500 transition-colors">{t("nav.admin")}</Link>

                            {!isSignedIn && (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="py-2 mt-2 w-full bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all text-center">
                                        {t("nav.signIn")}
                                    </button>
                                </Link>
                            )}
                            {isSignedIn && (
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="py-2 mt-2 w-full bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
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

