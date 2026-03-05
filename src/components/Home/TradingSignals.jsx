
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, Activity, TrendingUp, BarChart3, Lock } from 'lucide-react';

const SignalCard = ({ pair, type, price, time, strength, index }) => {
    const isBuy = type === 'BUY' || type === 'STRONG BUY';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass"
            style={{
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Blurry glow background */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                background: isBuy ? 'rgba(0, 255, 148, 0.05)' : 'rgba(255, 59, 48, 0.05)',
                filter: 'blur(40px)',
                zIndex: 0
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: isBuy ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isBuy ? '#00FF94' : '#FF3B30'
                    }}>
                        {isBuy ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>{pair}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>M{time} • {type}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: isBuy ? '#00FF94' : '#FF3B30',
                        textShadow: isBuy ? '0 0 10px rgba(0,255,148,0.3)' : '0 0 10px rgba(255,59,48,0.3)'
                    }}>
                        {price}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        <Activity size={12} /> {strength}%
                    </div>
                </div>
            </div>

            {/* Progress Bar for Strength */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', zIndex: 1 }}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${strength}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{
                        height: '100%',
                        background: isBuy ? '#00FF94' : '#FF3B30',
                        boxShadow: isBuy ? '0 0 10px #00FF94' : '0 0 10px #FF3B30'
                    }}
                />
            </div>
        </motion.div>
    );
};

const LockedSignal = ({ index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass"
        style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '100px',
            position: 'relative',
            backdropFilter: 'blur(4px)'
        }}
    >
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
        }}>
            <Lock size={18} />
        </div>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Premium Signal</span>
        <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s infinite linear'
        }} />
        <style>{`
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `}</style>
    </motion.div>
);

const TradingSignals = () => {
    // Mock Data mimicking a live feed
    const [signals, setSignals] = useState([
        { pair: 'EUR/USD', type: 'STRONG BUY', price: '1.0924', time: '5', strength: 92 },
        { pair: 'BTC/USD', type: 'SELL', price: '64,230', time: '15', strength: 78 },
        { pair: 'XAU/USD', type: 'BUY', price: '2,341.50', time: '1', strength: 85 },
        { pair: 'GBP/JPY', type: 'STRONG BUY', price: '191.20', time: '5', strength: 89 },
    ]);

    // Simulate "Live" updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSignals(prev => prev.map(s => ({
                ...s,
                strength: Math.min(99, Math.max(50, s.strength + (Math.random() - 0.5) * 5))
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section style={{ padding: '100px 0', position: 'relative' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

                {/* Left: Text Content */}
                <div style={{ maxWidth: '500px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="glass" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--primary-lime)',
                            marginBottom: '24px',
                            border: '1px solid rgba(var(--primary-lime-rgb), 0.2)'
                        }}>
                            <Activity size={14} /> LIVE SIGNALS
                        </div>
                        <h2 className="glow-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px', lineHeight: 1.1 }}>
                            Spot Profitable <br />
                            <span style={{ color: 'var(--primary-lime)' }}>Trends Instantly</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
                            Don't guess the market. Follow institutional-grade signals powered by real-time technical analysis. Get entry points, stop-loss levels, and confidence scores instantly.
                        </p>

                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>89%</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accuracy Rate</span>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>24/7</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Market Coverage</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Signal Cards (The "Widget") */}
                <div style={{ position: 'relative' }}>

                    {/* Background Decorative Grid */}
                    <div style={{
                        position: 'absolute',
                        inset: '-20px',
                        background: 'radial-gradient(circle at 50% 50%, rgba(var(--primary-lime-rgb), 0.05), transparent 70%)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                        {signals.map((signal, idx) => (
                            <SignalCard key={idx} index={idx} {...signal} />
                        ))}
                        {/* Teaser Locked cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <LockedSignal index={4} />
                            <LockedSignal index={5} />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TradingSignals;
