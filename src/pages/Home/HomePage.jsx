
import React, { useState } from 'react';
import { ArrowRight, TrendingUp, BookOpen, MessageCircle, Bot } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SnowEffect from '../../components/effects/SnowEffect';
import SuccessStories from '../../components/Home/SuccessStories';
import Hero3D from '../../components/Home/3d/Hero3D';
import FundingProcess from '../../components/Home/FundingProcess';
import ScrollReveal3D from '../../components/Home/ScrollReveal3D';
import TradingSignals from '../../components/Home/TradingSignals';
import TradeExecutionDemo from '../../components/Home/TradeExecutionDemo';

// --- 0. Preloader Component ---
const Preloader = ({ onComplete }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
                position: 'fixed',
                top: 0, left: 0, width: '100%', height: '100vh',
                background: '#0a0a0a',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold"
                style={{ color: 'var(--primary-lime)', marginBottom: '20px' }}
            >
                HAIDAR<span style={{ color: 'white' }}>EDU</span>
            </motion.div>
            <div style={{ width: '200px', height: '2px', background: '#333', overflow: 'hidden' }}>
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: 0 }}
                    onAnimationComplete={onComplete}
                    style={{ width: '100%', height: '100%', background: 'var(--primary-lime)' }}
                />
            </div>
        </motion.div>
    );
};


const Hero = () => {
    const navigate = useNavigate();
    return (
        <section style={{
            padding: '160px 0 100px',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at center, #1a1f2c 0%, #0a0a0a 100%)' // Radial for seamless blend
        }}>
            <SnowEffect />

            {/* Background Animated Light Rays */}
            <div className="light-ray" style={{
                top: '0',
                left: '20%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(203, 251, 69, 0.08) 0%, transparent 70%)',
            }} />
            <div className="light-ray" style={{
                top: '30%',
                right: '10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, transparent 70%)',
                animationDelay: '-5s'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    {/* Text Content */}
                    <div style={{ width: '100%', maxWidth: '800px' }}>
                        <div className="glass" style={{
                            display: 'inline-flex',
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--primary-lime)',
                            marginBottom: '24px',
                            border: '1px solid rgba(var(--primary-lime-rgb), 0.2)'
                        }}>
                            NEW: AI TRADING ASSISTANT NOW LIVE ⚡
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                                lineHeight: '1.1',
                                marginBottom: '24px',
                                letterSpacing: '-0.02em',
                                fontWeight: '900'
                            }}
                            className="glow-text"
                        >
                            The Future of <br />
                            <span style={{ color: 'var(--primary-lime)' }}>Trading</span> is Funded
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                                maxWidth: '600px',
                                marginBottom: '40px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                lineHeight: '1.6'
                            }}
                        >
                            Master professional trading strategies, access institutional-grade tools, and get funded with HaidarEdu. Your journey to professional trading starts here.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                justifyContent: 'center',
                                flexDirection: window.innerWidth < 640 ? 'column' : 'row'
                            }}
                        >
                            <button
                                className="btn-primary"
                                onClick={() => navigate('/login')}
                                style={{ padding: '14px 32px', fontSize: '1rem', width: window.innerWidth < 640 ? '100%' : 'auto' }}
                            >
                                Start Trading <ArrowRight size={20} />
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => navigate('/programs')}
                                style={{ padding: '14px 32px', fontSize: '1rem', width: window.innerWidth < 640 ? '100%' : 'auto' }}
                            >
                                View Programs
                            </button>
                        </motion.div>
                    </div>

                    {/* 3D Interactive Element */}
                    <div className="desktop-only" style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
                        <Hero3D />
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 400, damping: 40 });
    const mouseY = useSpring(y, { stiffness: 400, damping: 40 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
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
            style={{ perspective: 1000 }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    padding: '40px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    textAlign: 'left',
                    cursor: 'default',
                    minHeight: '280px' // Ensure consistent height
                }}
                className="glass"
            >
                <div style={{ transform: "translateZ(30px)" }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'rgba(var(--primary-lime-rgb), 0.1)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                        color: 'var(--primary-lime)'
                    }}>
                        <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{desc}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Features = () => {
    return (
        <section style={{ padding: '100px 0' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
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
                        icon={Bot}
                        title="AI Assistant"
                        desc="Get 24/7 help with your trading questions using our advanced AI-powered chatbot assistant."
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

