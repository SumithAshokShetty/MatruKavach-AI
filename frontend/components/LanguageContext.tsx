"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, translateDynamic } from "@/lib/translations";

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    tDynamic: (val: any) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("preferred_language") as Language;
        if (stored && ["en", "hi", "mr", "kn", "te", "ta", "bn"].includes(stored)) {
            setLanguageState(stored);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("preferred_language", lang);
    };

    const t = (key: string): string => {
        const dict = translations[language] || translations["en"];
        if (dict && dict[key] !== undefined) {
            return dict[key];
        }
        // Fallback to English translation
        const fallbackDict = translations["en"];
        if (fallbackDict && fallbackDict[key] !== undefined) {
            return fallbackDict[key];
        }
        return key;
    };

    const tDynamic = (val: any): string => {
        if (val === undefined || val === null) return "";
        return translateDynamic(String(val), language);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, tDynamic }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
