// Home2.jsx - Ultra Enhanced Version with Magnetic UI, Text Reveals, Floating Elements, Custom Cursor & Preloader
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { ArrowRight, BookOpen, Bot, Zap, ShieldCheck } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useTransform as useViewportTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components

import SuccessStories from '../../components/Home/SuccessStories';
import Hero3D from '../../components/Home/3d/Hero3D';
import FundingProcess from '../../components/Home/FundingProcess';
import ScrollReveal3D from '../../components/Home/ScrollReveal3D';
import TradingSignals from '../../components/Home/TradingSignals';
import TradeExecutionDemo from '../../components/Home/TradeExecutionDemo';
import ParticleBackground from '../../components/Home/3d/ParticleBackground';

// New GSAP Components
import TradingCursor from '../../components/UI/TradingCursor';
import ScrollProgressBar from '../../components/UI/ScrollProgressBar';
import SplineScene from '../../components/Home/SplineScene';

gsap.registerPlugin(ScrollTrigger);

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


// --- 2. Magnetic Button Component (Keep Framer Motion for UI Micro-interactions) ---
const MagneticButton = ({ children, className, onClick, style }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.3); // sensitivity
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseX, y: mouseY, ...style }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {children}
        </motion.button>
    );
};

// --- 3. Text Reveal Component ---
const RevealText = ({ text, className, style }) => {
    const words = text.split(" ");
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.04 * i } }),
    };
    const child = {
        visible: { opacity: 1, y: 0, x: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
        hidden: { opacity: 0, y: 20, x: -10, transition: { type: "spring", damping: 12, stiffness: 100 } },
    };
    return (
        <motion.div style={{ display: "flex", flexWrap: "wrap", ...style }} variants={container} initial="hidden" animate="visible" className={className}>
            {words.map((word, index) => (
                <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>{word}</motion.span>
            ))}
        </motion.div>
    );
};

// --- 4. Floating Background Shapes ---
const FloatingShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <motion.div
                animate={{ y: [0, -50, 0], rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px',
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    background: 'linear-gradient(180deg, rgba(203,251,69,0.03) 0%, rgba(0,0,0,0) 100%)',
                    filter: 'blur(60px)',
                }}
            />
            <motion.div
                animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute', top: '40%', right: '0%', width: '400px', height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 255, 255, 0.02) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(80px)',
                }}
            />
        </div>
    );
};

// --- Main Components ---
const Hero = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useViewportTransform(scrollY, [0, 500], [0, 200]);
    const rotate = useViewportTransform(scrollY, [0, 500], [0, 30]);

    return (
        <section style={{
            padding: '160px 0 100px', position: 'relative', overflow: 'hidden',
            // background: 'radial-gradient(circle at center, #1a1f2c 0%, #0a0a0a 100%)' // Removed for global grid
        }}>
            <FloatingShapes />
            <ParticleBackground />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '900px' }}>
                        <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="glass"
                            style={{
                                display: 'inline-flex', padding: '8px 20px', borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem', fontWeight: '600', color: '#00ffcc', marginBottom: '32px',
                                border: '1px solid rgba(0, 255, 204, 0.3)', boxShadow: '0 0 20px rgba(0, 255, 204, 0.1)', cursor: 'default'
                            }}>
                            <Zap size={14} style={{ marginRight: '8px', fill: 'currentColor' }} />
                            ELITE TRADING INTELLIGENCE
                        </motion.div>

                        <div className="glow-text" style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', lineHeight: '1.05', marginBottom: '40px', fontWeight: '800', letterSpacing: '-0.04em', color: '#ededed' }}>
                            <RevealText text="Mastering the" style={{ justifyContent: 'center' }} />
                            <motion.div style={{ display: 'flex', justifyContent: 'center', gap: '0.2em' }}>
                                <motion.span className="text-gradient-cyan"
                                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        backgroundImage: 'linear-gradient(90deg, #00ffcc, #ffffff, #00ffcc)',
                                        backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block'
                                    }}>
                                    Markets
                                </motion.span>
                                <span style={{ color: 'white' }}>with Precision</span>
                            </motion.div>
                        </div>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
                            style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 3vw, 1.25rem)', maxWidth: '640px', marginBottom: '48px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.7' }}>
                            Institutional-grade signals and elite education for the modern trader.
                        </motion.p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexDirection: window.innerWidth < 640 ? 'column' : 'row' }}>
                            <MagneticButton className="btn-primary" onClick={() => navigate('/login')}
                                style={{
                                    padding: '16px 40px', fontSize: '1.1rem', width: window.innerWidth < 640 ? '100%' : 'auto',
                                    background: 'linear-gradient(180deg, #00ffcc 0%, #00e6b8 100%)', color: '#000',
                                    boxShadow: '0 0 0 1px rgba(255,255,255,0.2) inset, 0 0 20px rgba(0, 255, 204, 0.4)'
                                }}>
                                Master Trading <ArrowRight size={20} />
                            </MagneticButton>
                            <MagneticButton className="btn-secondary" onClick={() => navigate('/programs')} style={{ padding: '16px 40px', fontSize: '1.1rem', width: window.innerWidth < 640 ? '100%' : 'auto' }}>
                                Access Elite Signals
                            </MagneticButton>
                        </div>
                    </div>

                    <motion.div style={{ y: y1, rotateX: rotate, marginTop: '40px', height: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px' }} className="desktop-only">
                        <Hero3D />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --- Glare Card ---
const FeatureCard = ({ icon: Icon, title, desc, delay, index }) => {
    const isEven = index % 2 === 0;
    const cardRef = useRef(null);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        cursorX.set(x);
        cursorY.set(y);
    };

    return (
        <GSAPReveal direction={isEven ? "left" : "right"}>
            <motion.div
                ref={cardRef} onMouseMove={handleMouseMove} whileHover={{ y: -10 }}
                style={{
                    padding: '40px', borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.0) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)', height: '100%', position: 'relative', overflow: 'hidden', transformStyle: 'preserve-3d'
                }}
            >
                <motion.div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: useTransform([cursorX, cursorY], ([x, y]) => `radial-gradient(circle at ${x + 200}px ${y + 200}px, rgba(255,255,255,0.1), transparent 50%)`),
                        pointerEvents: 'none', mixBlendMode: 'overlay'
                    }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(26, 31, 44, 0.5)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(203, 251, 69, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <Icon size={30} className="text-[#cbfb45]" style={{ color: '#cbfb45' }} />
                    </div>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '16px', fontWeight: '700' }}>{title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>{desc}</p>
                </div>
            </motion.div>
        </GSAPReveal>
    );
};

const Features = () => {
    return (
        <section style={{ padding: '120px 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(203, 251, 69, 0.2), transparent)' }} />
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    <FeatureCard index={0} icon={BookOpen} title="Institutional Education" desc="Trade like the banks, not the retail crowd." delay={0.1} />
                    <FeatureCard index={1} icon={Bot} title="AI-Driven Signals" desc="90%+ accuracy powered by proprietary algorithms." delay={0.2} />
                    <FeatureCard index={2} icon={ShieldCheck} title="Risk Management" desc="Advanced capital preservation strategies." delay={0.3} />
                </div>
            </div>
        </section>
    );
};

// --- NEW GSAP Section Wrapper ---
const GSAPReveal = ({ children, direction = "up" }) => {
    const el = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const xVal = direction === "left" ? -100 : direction === "right" ? 100 : 0;
            const yVal = direction === "up" ? 100 : direction === "down" ? -100 : 0;

            gsap.fromTo(el.current,
                { x: xVal, y: yVal, autoAlpha: 0, scale: 0.95 },
                {
                    x: 0, y: 0, autoAlpha: 1, scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, el);

        return () => ctx.revert();
    }, [direction]);

    return <div ref={el} style={{ opacity: 0, pointerEvents: 'auto' }}>{children}</div>; // Start invisible to avoid flash
};

const Home2 = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
            ) : (
                <motion.main
                    key="main-content"
                    className="overflow-hidden" // Removed cursor-none
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'relative', minHeight: '100vh', background: '#050505', color: 'white' }}
                >
                    <TradingCursor />
                    <ScrollProgressBar />

                    {/* --- Professional Fixed Grid Background --- */}
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)'
                    }} />

                    {/* Ambient Glows */}
                    <div style={{
                        position: 'fixed', top: '-20%', left: '20%', width: '600px', height: '600px',
                        background: 'radial-gradient(circle, rgba(0, 255, 204, 0.04) 0%, transparent 70%)',
                        filter: 'blur(80px)', zIndex: 0
                    }} />

                    {/* SPLINE SCENE (Hero Background) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }}>
                        <SplineScene />
                    </div>

                    {/* Content Wrapper - Pointer events none to let clicks pass to 3D bg, but auto for children */}
                    <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
                        <div style={{ pointerEvents: 'auto' }}>
                            <Hero />
                        </div>
                        <div style={{ pointerEvents: 'auto' }}>
                            <Features />
                        </div>

                        <GSAPReveal direction="left">
                            <TradingSignals />
                        </GSAPReveal>

                        <GSAPReveal direction="right">
                            <TradeExecutionDemo />
                        </GSAPReveal>

                        <GSAPReveal direction="up">
                            <FundingProcess />
                        </GSAPReveal>

                        <GSAPReveal direction="up">
                            <ScrollReveal3D />
                        </GSAPReveal>

                        <GSAPReveal direction="up">
                            <SuccessStories />
                        </GSAPReveal>

                        <GSAPReveal direction="up">
                            <section style={{ padding: '100px 0', textAlign: 'center' }}>
                                <div className="container">
                                    <h2 className="glow-text" style={{ fontSize: '3rem', marginBottom: '32px' }}>Join the Elite.</h2>
                                    <MagneticButton className="btn-primary" onClick={() => window.location.href = '/login'}
                                        style={{
                                            padding: '16px 40px', fontSize: '1.1rem',
                                            background: 'linear-gradient(180deg, #00ffcc 0%, #00e6b8 100%)', color: '#000',
                                            boxShadow: '0 0 0 1px rgba(255,255,255,0.2) inset, 0 0 20px rgba(0, 255, 204, 0.4)'
                                        }}>
                                        Get Started Now <ArrowRight size={20} />
                                    </MagneticButton>
                                </div>
                            </section>
                        </GSAPReveal>
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    );
};

export default Home2;
