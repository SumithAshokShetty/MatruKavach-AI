"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Brain, Mic, Navigation, ShieldCheck, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";

export default function Home() {
  const { t, language, tDynamic } = useLanguage();
  const { user } = useAuth();

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
      te: "డ్యాష్‌బోర్ด์ వెళ్ళండి",
      ta: "டாஷ்போர்டுக்குச் செல்லவும்",
      bn: "ড্যাশবোর্ডে যান"
    };
    return translations[language] || "Go to Dashboard";
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-accent/30 bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 flex flex-col relative overflow-hidden z-10 px-4 pb-32">

        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-start text-center space-y-8 max-w-5xl pb-10 pt-16 md:pt-24">
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-[5rem] font-serif text-[#111827] font-normal tracking-tight mx-auto max-w-5xl"
            style={{ lineHeight: 1.4 }}
          >
            {t("home.heroTitle")}
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl font-light leading-relaxed"
          >
            {t("home.heroSub")}
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="pt-6"
          >
            <Link href={getDashboardPath()}>
              <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-gray-900 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                {getDashboardLabel()} <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="container mx-auto max-w-5xl mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6 text-center md:text-left"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900">{tDynamic("About MatruKavach AI")}</h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              {tDynamic("MatruKavach AI is an intelligent clinical and planetary health monitoring platform. Designed to safeguard maternal wellness in vulnerable areas, it reverse-geocodes patient coordinates and integrates live environmental exposure metrics—such as the apparent heat index, air quality (AQI PM2.5), and local toxin alerts—with clinical vitals. Operating as a secure, role-based network, it empowers ASHA workers, Doctors, and Admins to provide proactive, standard-based care through dynamic routing, voice-driven guided intakes, FHIR EHR syncs, and dedicated SMS/Telegram support channels.")}
            </p>
          </motion.div>
        </section>

        {/* Key Features Inventory Section */}
        <section className="container mx-auto max-w-7xl mt-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-medium text-gray-900 tracking-tight mb-4">
              {tDynamic("MatruKavach Core Features")}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              {tDynamic("Our feature stack implements standardized integration systems to provide comprehensive healthcare intelligence.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MotionCard 
              delay={0.05} 
              title={tDynamic("Planetary AI Risk Engine")}
              icon={<Brain className="w-8 h-8 text-pink-500 mb-4" />}
            >
              {tDynamic("LangGraph workflow compounding clinical parameters with geo-environmental variables (Air Quality, Heat Index, Toxins) to estimate risk thresholds.")}
            </MotionCard>

            <MotionCard 
              delay={0.1} 
              title={tDynamic("Vocal Guided Intake")}
              icon={<Mic className="w-8 h-8 text-indigo-500 mb-4" />}
            >
              {tDynamic("Frontline form intakes using Sarvam AI's speech-to-text pipeline to capture clinical profiles securely with spoken local dialects.")}
            </MotionCard>

            <MotionCard 
              delay={0.15} 
              title={tDynamic("Google OR-Tools Routing")}
              icon={<Navigation className="w-8 h-8 text-emerald-500 mb-4" />}
            >
              {tDynamic("Vehicle Routing Problem (VRP) optimization matching ASHA worker locations to patient lists, organizing sequence steps and travel modes.")}
            </MotionCard>

            <MotionCard 
              delay={0.2} 
              title={tDynamic("FHIR EHR Integration")}
              icon={<ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />}
            >
              {tDynamic("Standardized HL7 FHIR Observations tracking Blood Pressure and Hemoglobin baselines to evaluate critical deterioration trends.")}
            </MotionCard>

            <MotionCard 
              delay={0.25} 
              title={tDynamic("Patients Telegram Agent")}
              icon={<MessageCircle className="w-8 h-8 text-cyan-500 mb-4" />}
            >
              {tDynamic("Dual-channel text and audio assistant with Rate-Limit recovery, auto-translation for local languages, and critical symptom warnings.")}
            </MotionCard>

            <MotionCard 
              delay={0.3} 
              title={tDynamic("Care-Team Collaboration")}
              icon={<Users className="w-8 h-8 text-purple-500 mb-4" />}
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

function MotionCard({ children, title, icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: delay }}
      className="card-3d-container h-full"
    >
      <div className="glass-card card-3d-hover group flex flex-col p-10 h-full border border-gray-100 cursor-pointer items-start justify-start text-left relative overflow-hidden bg-white shadow-sm">
        <div className="shine-overlay" />
        <div className="relative z-20 pointer-events-none w-full">
          {icon}
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-gray-500 leading-relaxed font-light text-sm">
            {children}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
