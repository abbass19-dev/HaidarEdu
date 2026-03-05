"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, BookOpen, MessageCircle } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import SnowEffect from "@/components/effects/SnowEffect";
import SuccessStories from "@/components/Home/SuccessStories";
import Hero3D from "@/components/Home/3d/Hero3D";
import FundingProcess from "@/components/Home/FundingProcess";
import ScrollReveal3D from "@/components/Home/ScrollReveal3D";
import TradingSignals from "@/components/Home/TradingSignals";
import TradeExecutionDemo from "@/components/Home/TradeExecutionDemo";
import Navbar from "@/components/layout/Navbar";
import styles from "./home.module.css";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className={styles.preloader}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.preloaderLogo}
      >
        HAIDAR<span>EDU</span>
      </motion.div>
      <div className={styles.preloaderBar}>
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: 0 }}
          onAnimationComplete={onComplete}
          className={styles.preloaderProgress}
        />
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  return (
    <section className={styles.hero}>
      <SnowEffect />

      <div className={`${styles.lightRay} ${styles.ray1}`} />
      <div className={`${styles.lightRay} ${styles.ray2}`} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextWrapper}>
            <div className={`glass ${styles.heroBadge}`}>
              NEW: INSTITUTIONAL FUNDING PROGRAMS ⚡
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`${styles.heroTitle} glow-text`}
            >
              The Future of <br />
              <span>Trading</span>
              is Funded
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className={styles.heroSubtitle}
            >
              Master professional trading strategies, access institutional-grade
              tools, and get funded with HaidarEdu. Your journey to professional
              trading starts here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className={`${styles.heroButtons} ${isMobile ? styles.heroButtonsMobile : ""}`}
            >
              <button
                className={`btn-primary ${styles.heroButton} ${isMobile ? styles.heroButtonFull : ""}`}
                onClick={() => router.push("/login")}
              >
                Start Trading <ArrowRight size={20} />
              </button>
              <button
                className={`btn-secondary ${styles.heroButton} ${isMobile ? styles.heroButtonFull : ""}`}
                onClick={() => router.push("/programs")}
              >
                View Programs
              </button>
            </motion.div>
          </div>

          <div className={`${styles.hero3DWrapper} desktop-only`}>
            <Hero3D />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 40 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: any) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={styles.featureCardWrapper}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
        }}
        className={`glass ${styles.featureCard}`}
      >
        <div style={{ transform: "translateZ(30px)" }}>
          <div className={styles.featureIconBox}>
            <Icon size={24} />
          </div>
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDesc}>{desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresGrid}>
          <FeatureCard
            icon={TrendingUp}
            title="Expert Courses"
            desc="Comprehensive trading education from professional market analysts and successful traders."
            delay={0.1}
          />
          <FeatureCard
            icon={BookOpen}
            title="Market Insights"
            desc="Daily articles and deep-dives into market psychology, technical analysis, and risk management."
            delay={0.2}
          />
          <FeatureCard
            icon={TrendingUp}
            title="Elite Strategies"
            desc="Access high-probability trading setups and institutional-grade market analysis."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <React.Fragment>
            <Navbar />
            <Hero />
            <Features />
            <TradingSignals />
            <TradeExecutionDemo />
            <FundingProcess />
            <ScrollReveal3D />
            <SuccessStories />
          </React.Fragment>
        )}
      </AnimatePresence>
    </main>
  );
};

export default HomePage;
