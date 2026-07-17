"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-accent/30">
      <Header />

      <main className="flex-1 flex flex-col relative overflow-hidden z-10 px-4 pb-32">

        <section className="container mx-auto flex flex-col items-center justify-start text-center space-y-8 max-w-5xl pb-10 pt-16 md:pt-24">

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-[5rem] font-serif text-[#111827] font-normal tracking-tight mx-auto max-w-5xl"
            style={{ lineHeight: 1.6 }}
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
            <Link href="/asha">
              <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-gray-900 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 w-full sm:w-auto">
                {t("home.launchAsha")} <ArrowRight className="w-5 h-5" />
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
              {t("home.sectionTitle")}
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <MotionCard delay={0.1} title={t("home.card1Title")}>
              {t("home.card1Desc")}
            </MotionCard>

            <MotionCard delay={0.2} title={t("home.card2Title")}>
              {t("home.card2Desc")}
            </MotionCard>

            <MotionCard delay={0.3} title={t("home.card3Title")}>
              {t("home.card3Desc")}
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

