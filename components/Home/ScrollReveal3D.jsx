'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Battery, ArrowUp, ChevronDown, Bitcoin, DollarSign, Activity, GraduationCap, Users, Target, PlayCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal3D = () => {
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);
    const laptopRef = useRef(null);
    const phoneRef = useRef(null);
    const titleRef = useRef(null);

    // Feature Refs
    const featuresRef = useRef([]);

    // --- PHONE UI STATE ---
    const [tradeStatus, setTradeStatus] = useState('idle'); // idle, trade, result
    const [pnl, setPnl] = useState(0);

    useEffect(() => {
        let interval;
        if (tradeStatus === 'idle') {
            const timeout = setTimeout(() => {
                setTradeStatus('trade');
                setPnl(0);
            }, 2000);
            return () => clearTimeout(timeout);
        } else if (tradeStatus === 'trade') {
            // Simulate PnL change
            let progress = 0;
            interval = setInterval(() => {
                progress += 1;
                // Randomish movement ending in positive
                const randomMove = (Math.random() * 5) - 1;
                setPnl(prev => prev + randomMove);

                if (progress > 30) {
                    setTradeStatus('result');
                }
            }, 100);
        } else if (tradeStatus === 'result') {
            const timeout = setTimeout(() => {
                setTradeStatus('idle');
                setPnl(0);
            }, 3000);
            return () => clearTimeout(timeout);
        }
        return () => clearInterval(interval);
    }, [tradeStatus]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // MAIN TIMELINE
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%", // Pin for 3 screen heights
                    pin: true,
                    scrub: 1, // Smooth interaction
                    anticipatePin: 1
                }
            });

            // 0. Initial States
            // Laptop/Phone starts hidden/tilted
            // Features start hidden

            // 1. Laptop Emerges
            // 1. Laptop Emerges
            tl.fromTo(laptopRef.current,
                { rotateX: 70, y: 150, scale: 0.8, autoAlpha: 0 },
                { rotateX: 0, y: 0, scale: 1, autoAlpha: 1, duration: 2, ease: "power2.out" }
            )
                // 2. Phone Flies In
                .fromTo(phoneRef.current,
                    { x: 400, y: 100, z: -100, rotateY: 30, autoAlpha: 0 },
                    { x: 300, y: 60, z: 50, rotateY: -15, autoAlpha: 1, duration: 2, ease: "power2.out" },
                    "-=1.5"
                )
                // 3. Final Polish / Parallax
                .to([laptopRef.current, phoneRef.current], {
                    y: -30,
                    duration: 1
                }, "-=1");

            // 4. Staggered Feature Reveal
            // We want them to pop in as the devices settle
            if (featuresRef.current.length) {
                tl.fromTo(featuresRef.current,
                    { autoAlpha: 0, y: 20, scale: 0.8 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.2,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    },
                    "-=1.0" // Start while devices are finishing their move
                );
            }

            // Parallax Title - STABILIZED
            gsap.to(titleRef.current, {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=100%",
                    scrub: true
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // --- MOCK DATA ---
    const candles = [
        { h: 40, y: 40, color: '#0ECB81' }, // Green
        { h: 25, y: 60, color: '#F6465D' }, // Red (dip)
        { h: 60, y: 50, color: '#0ECB81' }, // Green (recovery)
        { h: 30, y: 90, color: '#0ECB81' }, // Green (push)
        { h: 45, y: 110, color: '#F6465D' }, // Red (correction)
        { h: 80, y: 80, color: '#0ECB81' }, // Green (rally)
        { h: 110, y: 140, color: '#0ECB81' }, // God Candle
    ];
    const fullCandles = [...candles, ...candles].slice(0, 12);

    // Feature Data
    const features = [
        { icon: Target, text: "High-Prob Strategies", x: -450, y: -160 },
        { icon: GraduationCap, text: "A-Z Trading Courses", x: -440, y: 140 },
        { icon: PlayCircle, text: "Live Trading Sessions", x: 440, y: -120 },
        { icon: Users, text: "Elite Student Community", x: 410, y: 160 },
    ];

    return (
        <section
            ref={sectionRef}
            style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1200px',
                overflow: 'hidden',
                background: 'transparent'
            }}
        >
            {/* Sticky Title */}
            <div ref={titleRef} style={{
                position: 'absolute',
                top: '5%', // Moved up slightly
                textAlign: 'center',
                zIndex: 10,
                pointerEvents: 'none',
                width: '100%'
            }}>
                <h2 className="glow-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                    Professional <span style={{ color: 'var(--primary-lime)' }}>Execution</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '16px' }}>
                    Institutional-grade tools at your fingertips.
                </p>
            </div>

            {/* 3D Wrapper */}
            <div
                ref={wrapperRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* 1. LAPTOP */}
                <div
                    ref={laptopRef}
                    style={{
                        width: '700px',
                        height: '450px',
                        position: 'absolute',
                        transformStyle: 'preserve-3d',
                        background: '#121212',
                        borderRadius: '24px',
                        border: '1px solid #333',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.6)',
                        zIndex: 1
                    }}
                >
                    {/* Screen Content */}
                    <div style={{ position: 'absolute', inset: '12px', background: '#0b0e11', borderRadius: '16px', overflow: 'hidden', border: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ height: '40px', background: '#1e2329', borderBottom: '1px solid #2b3139', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>BTC/USDT</span>
                            <span style={{ color: '#0ECB81', fontSize: '0.9rem' }}>+2.45%</span>
                        </div>

                        {/* Chart Area */}
                        <div style={{ flex: 1, padding: '20px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '30px' }}>
                            {/* Grid */}
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                            {/* Candles */}
                            {fullCandles.map((c, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: c.y + 'px' }}>
                                    <div style={{ width: '1px', height: '12px', background: c.color, opacity: 0.6 }} />
                                    <div style={{ width: '10px', height: c.h, background: c.color, borderRadius: '2px' }} />
                                    <div style={{ width: '1px', height: '12px', background: c.color, opacity: 0.6 }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. PHONE */}
                <div
                    ref={phoneRef}
                    style={{
                        width: '160px',
                        height: '320px',
                        position: 'absolute',
                        transformStyle: 'preserve-3d',
                        background: '#0a0a0a',
                        borderRadius: '28px',
                        border: '4px solid #333',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                        zIndex: 2
                    }}
                >
                    {/* Phone Screen */}
                    <div style={{ position: 'absolute', inset: '4px', background: '#0b0e11', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '15px', borderBottom: '1px solid #2b3139', display: 'flex', justifyContent: 'space-between', color: '#848e9c' }}>
                            <span style={{ fontWeight: 'bold', color: 'white' }}>Trade</span>
                            <Battery size={14} />
                        </div>
                        <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: pnl >= 0 ? '#0ECB81' : '#F6465D', transition: 'color 0.3s' }}>
                                {tradeStatus === 'idle' ? 'Ready' : tradeStatus === 'trade' ? 'Open P&L' : 'Closed'}
                                <span style={{ fontSize: '0.9rem', marginLeft: '8px' }}>
                                    {tradeStatus === 'idle' ? '0.00%' : `${pnl > 0 ? '+' : ''}${pnl.toFixed(2)}%`}
                                </span>
                            </div>

                            {/* Chart Placeholder on Phone */}
                            <div style={{ flex: 1, background: '#1e2329', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(14, 203, 129, 0.2), transparent)' }} />
                                <div style={{ position: 'absolute', bottom: '20px', left: '10px', right: '10px', height: '2px', background: '#0ECB81', boxShadow: '0 0 10px #0ECB81' }} />
                            </div>

                            <motion.div
                                animate={tradeStatus === 'idle' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    height: '40px',
                                    background: tradeStatus === 'idle' ? '#0ECB81' : tradeStatus === 'trade' ? '#F6465D' : '#2b3139',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    transition: 'background 0.3s'
                                }}>
                                {tradeStatus === 'idle' ? 'Buy Long' : tradeStatus === 'trade' ? 'Close Position' : 'Trade Executed'}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* 3. FEATURES (New) */}
                {features.map((feat, i) => (
                    <div
                        key={i}
                        ref={el => featuresRef.current[i] = el}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            marginLeft: feat.x,
                            marginTop: feat.y,
                            background: 'rgba(20, 20, 20, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            zIndex: 5
                        }}
                    >
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#cbfb45' }}>
                            <feat.icon size={20} />
                        </div>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', whiteSpace: 'nowrap' }}>{feat.text}</span>
                    </div>
                ))}

                {/* 4. Floating Coins (Decoration) */}
                <FloatingCoin icon={Bitcoin} x={-450} y={-250} size={50} delay={0} />
                <FloatingCoin icon={DollarSign} x={500} y={200} size={40} delay={0.5} />
                <FloatingCoin icon={Bitcoin} x={-350} y={300} size={30} delay={1} />

            </div>
        </section>
    );
};

// Simple helper for floating background elements
const FloatingCoin = ({ icon: Icon, x, y, size, delay }) => (
    <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        marginLeft: x, marginTop: y,
        color: 'rgba(255,255,255,0.05)', // Even more subtle
        zIndex: 0,
        pointerEvents: 'none'
    }}>
        <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: delay, ease: "easeInOut" }}
        >
            <Icon size={size} />
        </motion.div>
    </div>
);

export default ScrollReveal3D;
