"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-accent/30">
      <Header />

      <main className="flex-1 flex flex-col relative overflow-hidden z-10 px-4 pb-32">

        <section className="container mx-auto flex flex-col items-center justify-start text-center space-y-10 max-w-5xl min-h-[calc(100vh-80px)] pb-10 pt-32 md:pt-40">

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-[5rem] font-serif text-[#111827] font-normal tracking-tight leading-[1.1] mx-auto max-w-5xl"
          >
            Guarding Maternal Vitals<br className="hidden md:block" /> with Planetary Intelligence.
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl font-light leading-relaxed"
          >
            Advanced maternal health monitoring that combines clinical vitals with real-time pollution, heat, and weather data to predict invisible risks.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="pt-8"
          >
            <Link href="/asha">
              <button className="bg-black/90 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full text-lg font-medium shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:shadow-[0_0_60px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto">
                Launch ASHA Portal <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </section>

        <section className="container mx-auto mt-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-medium text-gray-900 tracking-tight mb-4">
              Comprehensive Risk Orchestration
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <MotionCard delay={0.1} title="Clinical + Environmental">
              We merge BP & weight data with real-time AQI and Heat Index to generate a truly holistic risk score.
            </MotionCard>

            <MotionCard delay={0.2} title="AI Risk Orchestration">
              Our multi-agent system continuously monitors invisible threats and alerts ASHA workers instantly.
            </MotionCard>

            <MotionCard delay={0.3} title="Seamless Coordination">
              Unified portals for ASHA workers, Doctors, and Admins to ensure no mother is left behind.
            </MotionCard>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function MotionCard({ children, title, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: delay }}
      className="card-3d-container h-full"
    >
      <div className="glass-card card-3d-hover group flex flex-col p-10 h-full border border-gray-100 cursor-pointer items-center justify-center text-center relative overflow-hidden bg-[#999]/5">

        <div className="shine-overlay" />

        <div className="relative z-20 pointer-events-none">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 leading-relaxed font-light text-lg">
            {children}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
