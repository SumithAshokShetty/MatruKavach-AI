"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { 
  ArrowRight, Brain, Mic, Navigation, ShieldCheck, 
  MessageCircle, Users, Globe, User as UserIcon, LogOut,
  Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";
import { LANGUAGES, Language } from "@/lib/translations";

export default function Home() {
  const { t, language, setLanguage, tDynamic } = useLanguage();
  const { user, logout } = useAuth();
  const isSignedIn = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "doctor") return "/doctor";
    if (user.role === "asha") return "/asha";
    return "/";
  };

  const getDashboardLabel = () => {
    if (!user) return t("home.launchAsha");
    const translations: Record<string, string> = {
      en: "Go to Dashboard",
      hi: "डैशबोर्ड पर जाएं",
      mr: "डॅशबोर्डवर जा",
      kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ",
      te: "డ్యాష్‌బోర్డ్ వెళ్ళండి",
      ta: "டாஷ்போர்டுக்குச் செல்லவும்",
      bn: "ড্যাশবোর্डे যান"
    };
    return translations[language] || "Go to Dashboard";
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/30 bg-background text-[#111111] overflow-x-hidden">
      
      {/* Floating Pill Navbar Wrapper */}
      <div className="w-full flex justify-center pt-6 px-4 md:px-12 lg:px-[120px] fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="w-full max-w-[1280px] bg-white/95 backdrop-blur-md h-[70px] rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-[#E8E8E8] flex items-center justify-between px-6 md:px-8 pointer-events-auto">
          <Link href="/" className="text-xl font-heading font-extrabold text-[#111111] tracking-tight hover:text-accent transition-colors">
            {t("nav.logo")}
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-bold text-[#5F5F5F]">
            {(!user || user.role === "asha") && (
              <Link href="/asha" className="hover:text-accent transition-colors">{t("nav.ashaPortal")}</Link>
            )}
            {(!user || user.role === "doctor") && (
              <Link href="/doctor" className="hover:text-accent transition-colors">{t("nav.doctorPortal")}</Link>
            )}
            {(!user || user.role === "admin") && (
              <Link href="/admin" className="hover:text-accent transition-colors">{t("nav.admin")}</Link>
            )}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher Selector */}
            <div className="flex items-center gap-1.5 bg-gray-100/80 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/60 transition-colors">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-black bg-white">
                    {lang.nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            {!isSignedIn ? (
              <Link href="/login">
                <span className="text-[13px] font-bold text-white bg-black hover:bg-gray-800 px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-sm">
                  {t("nav.signIn")}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 text-xs">
                  <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-bold text-gray-800">{user?.username}</span>
                </div>
                <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors" title={t("nav.signOut")}>
                  <LogOut className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#111111] focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="w-full flex justify-center px-4 fixed top-[96px] left-0 right-0 z-50 pointer-events-none md:hidden">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full bg-white/95 backdrop-blur-md rounded-[24px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#E8E8E8] p-6 pointer-events-auto"
            >
              <nav className="flex flex-col gap-4 font-bold text-[#5F5F5F]">
                {(!user || user.role === "asha") && (
                  <Link href="/asha" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border-b border-gray-100 hover:text-accent transition-colors">{t("nav.ashaPortal")}</Link>
                )}
                {(!user || user.role === "doctor") && (
                  <Link href="/doctor" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border-b border-gray-100 hover:text-accent transition-colors">{t("nav.doctorPortal")}</Link>
                )}
                {(!user || user.role === "admin") && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 border-b border-gray-100 hover:text-accent transition-colors">{t("nav.admin")}</Link>
                )}

                {/* Mobile Language selector */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-sm mt-1">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 font-semibold">Language</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-transparent text-sm font-bold text-gray-850 outline-none cursor-pointer ml-auto pr-2"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeLabel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile User Credentials */}
                {isSignedIn && (
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-sm mt-1">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-850 truncate leading-none mb-1">{user?.username}</span>
                      <span className="text-xs text-gray-400 capitalize leading-none">{user?.role} Portal</span>
                    </div>
                  </div>
                )}

                {!isSignedIn ? (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="py-2.5 mt-2 w-full bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-center">
                      {t("nav.signIn")}
                    </button>
                  </Link>
                ) : (
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="py-2.5 mt-2 w-full bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> {t("nav.signOut")}
                  </button>
                )}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col max-w-[1280px] w-full mx-auto px-4 md:px-12 lg:px-[120px] pt-16 md:pt-24 pb-32 space-y-[160px]">

        {/* Hero Section */}
        <section className="relative flex flex-col items-center text-center space-y-8 pt-2 md:pt-12 z-10 w-full overflow-hidden">
          
          {/* Animated Waving Stripes on left/right edges */}
          <WavingBars align="left" />
          <WavingBars align="right" />

          <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[42px] sm:text-[56px] md:text-[72px] font-serif text-[#111111] font-normal tracking-tight leading-[1.1] mx-auto max-w-4xl"
            >
              {tDynamic("Empowering Frontline Care with AI-Driven Maternal Health Intelligence")}
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-lg md:text-[22px] text-[#5F5F5F] max-w-[800px] mx-auto font-light leading-relaxed tracking-[0.03em]"
            >
              {tDynamic("A comprehensive public health platform integrating clinical vitals, real-time planetary exposures, voice intake, FHIR EHR syncs, and OR-Tools route optimizations to connect mothers, doctors, and ASHA workers.")}
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="pt-6"
            >
              <Link href={getDashboardPath()}>
                <span className="inline-flex items-center gap-3 bg-[#F97316] text-white px-8 py-4 rounded-[12px] text-lg font-bold shadow-[0_12px_32px_rgba(249,115,22,0.35)] hover:bg-[#EA580C] hover:scale-[1.02] hover:-translate-y-0.5 transition-all cursor-pointer">
                  {getDashboardLabel()} <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-3xl bg-white border border-gray-100 shadow-sm grid md:grid-cols-5 gap-8 items-center"
          >
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-heading font-bold text-gray-900">{tDynamic("About MatruKavach AI")}</h2>
              <p className="text-gray-600 leading-relaxed text-base font-light">
                {tDynamic("MatruKavach AI is an intelligent multi-agent maternal health system designed to reduce complications and maternal mortality in remote areas. Powered by autonomous agents that continuously monitor patient metrics in the background, the system automatically maps coordinates to local weather, air pollution (AQI), heat indices, and water indexes to compound clinical parameters with planetary factors. This builds a proactive care network where data is parsed using local speech dialects, synchronized with FHIR standards, and optimized for daily medical visits.")}
              </p>
            </div>
            
            <div className="md:col-span-2 space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{tDynamic("The Ecosystem Connect")}</h4>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="p-1.5 rounded bg-purple-50 text-purple-700 text-xs font-bold mt-0.5">ASHA</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tDynamic("ASHA Frontline Workers")}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tDynamic("Vitals capture via voice inputs and optimized route navigation guides.")}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="p-1.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold mt-0.5">DOC</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tDynamic("Medical Practitioners")}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tDynamic("Historical EHR baselines, risk assessments, and clinical prescription tools.")}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="p-1.5 rounded bg-cyan-50 text-cyan-700 text-xs font-bold mt-0.5">MOM</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tDynamic("Mothers & Patients")}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tDynamic("Real-time localized support, translation, and prescription deliveries on Telegram.")}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Key Features Bento Grid Section */}
        <section id="architecture" className="space-y-16 w-full text-center">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-block bg-[#FDBA74]/20 border border-[#FDBA74]/30 text-[#EA580C] text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
              {tDynamic("CORE SERVICES")}
            </span>
            <h2 className="text-3xl md:text-[48px] font-heading font-extrabold tracking-tight text-[#111111]">
              {tDynamic("MatruKavach Core Features")}
            </h2>
            <p className="text-lg text-[#5F5F5F] font-light">
              {tDynamic("Standardized healthcare intelligence systems connecting frontline workers and clinical providers.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MotionCard 
              delay={0.05} 
              title={tDynamic("Planetary AI Risk Engine")}
              icon={<Brain className="w-8 h-8 text-[#F97316] mb-4" />}
            >
              {tDynamic("LangGraph workflow compounding clinical parameters with geo-environmental variables (Air Quality, Heat Index, Toxins) to estimate risk thresholds.")}
            </MotionCard>

            <MotionCard 
              delay={0.1} 
              title={tDynamic("Vocal Guided Intake")}
              icon={<Mic className="w-8 h-8 text-[#F97316] mb-4" />}
            >
              {tDynamic("Frontline form intakes using Sarvam AI's speech-to-text pipeline to capture clinical profiles securely with spoken local dialects.")}
            </MotionCard>

            <MotionCard 
              delay={0.15} 
              title={tDynamic("Google OR-Tools Routing")}
              icon={<Navigation className="w-8 h-8 text-[#F97316] mb-4" />}
            >
              {tDynamic("Vehicle Routing Problem (VRP) optimization matching ASHA worker locations to patient lists, organizing sequence steps and travel modes.")}
            </MotionCard>

            <MotionCard 
              delay={0.2} 
              title={tDynamic("FHIR EHR Integration")}
              icon={<ShieldCheck className="w-8 h-8 text-[#F97316] mb-4" />}
            >
              {tDynamic("Standardized HL7 FHIR Observations tracking Blood Pressure and Hemoglobin baselines to evaluate critical deterioration trends.")}
            </MotionCard>

            <MotionCard 
              delay={0.25} 
              title={tDynamic("Patients Telegram Agent")}
              icon={<MessageCircle className="w-8 h-8 text-[#F97316] mb-4" />}
            >
              {tDynamic("Dual-channel text and audio assistant with Rate-Limit recovery, auto-translation for local languages, and critical symptom warnings.")}
            </MotionCard>

            <MotionCard 
              delay={0.3} 
              title={tDynamic("Care-Team Collaboration")}
              icon={<Users className="w-8 h-8 text-[#F97316] mb-4" />}
            >
              {tDynamic("Secure portals for ASHA workers, Doctors, and Admins offering real-time Socket.IO text chats, live alerts, and QR-based record sharing.")}
            </MotionCard>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function WavingBars({ align }: { align: "left" | "right" }) {
  const barsCount = 12;
  return (
    <div className={`absolute top-0 bottom-0 ${align === "left" ? "left-0 pl-4 md:pl-8" : "right-0 pr-4 md:pr-8"} w-[160px] flex items-center gap-[6px] md:gap-[8px] pointer-events-none z-0`}>
      {[...Array(barsCount)].map((_, idx) => {
        // Form a parabolic wave shape (taller on the outer edge, shorter towards the inside)
        const position = align === "left" ? idx : barsCount - 1 - idx;
        const baseHeightPercent = Math.max(10, Math.pow((barsCount - 1 - position) / (barsCount - 1), 2) * 100);
        
        return (
          <motion.div
            key={idx}
            animate={{ 
              scaleY: [1, 1.25, 1],
              opacity: [0.15, 0.45, 0.15]
            }}
            transition={{
              duration: 4 + (idx * 0.25),
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.15
            }}
            className="w-1.5 md:w-2 bg-gradient-to-b from-transparent via-[#F97316] to-transparent rounded-full origin-center"
            style={{ 
              height: `${baseHeightPercent * 3.5}px`,
              maxHeight: "360px"
            }}
          />
        );
      })}
    </div>
  );
}

function MotionCard({ children, title, icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: delay }}
      className="card-3d-container h-full"
    >
      <div className="glass-card card-3d-hover group flex flex-col p-8 h-full border border-gray-100 cursor-pointer items-start justify-start text-left relative overflow-hidden bg-white shadow-sm hover:border-[#FDBA74] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)]">
        <div className="shine-overlay" />
        <div className="relative z-20 pointer-events-none w-full">
          {icon}
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#F97316] transition-colors">{title}</h3>
          <p className="text-gray-500 leading-relaxed font-light text-sm">
            {children}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
