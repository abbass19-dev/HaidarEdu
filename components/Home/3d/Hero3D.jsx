'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Activity, BarChart2, ShieldCheck, Zap } from 'lucide-react';

const Hero3D = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 400, damping: 40 });
    const mouseY = useSpring(y, { stiffness: 400, damping: 40 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);

    const translateZConfig = {
        back: "translateZ(30px)",
        mid: "translateZ(60px)",
        front: "translateZ(100px)"
    };

    return (
        <motion.div
            style={{
                perspective: 1200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                cursor: 'pointer'
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    width: '320px',
                    height: '440px',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(203, 251, 69, 0.02) 100%)',
                    borderRadius: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                    position: 'relative'
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '30px',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    opacity: 0.5,
                    transform: "translateZ(10px)"
                }}></div>

                <div style={{
                    position: 'absolute',
                    top: '50px',
                    left: '20px',
                    right: '20px',
                    bottom: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: translateZConfig.mid
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Haidar<span style={{ color: 'var(--primary-lime)' }}>Edu</span></div>
                        <Activity color="var(--primary-lime)" size={20} />
                    </div>

                    <div style={{
                        height: '120px',
                        background: 'linear-gradient(180deg, rgba(203, 251, 69, 0.1) 0%, transparent 100%)',
                        borderTop: '2px solid var(--primary-lime)',
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <path d="M0,50 L10,40 L20,45 L30,25 L40,30 L50,15 L60,20 L70,10 L80,15 L90,5 L100,0" fill="none" stroke="var(--primary-lime)" strokeWidth="0.5" />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Win Rate</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>78%</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Profit</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-lime)' }}>+12.5%</div>
                        </div>
                    </div>
                </div>

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: '#1a1a1a',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                        transform: translateZConfig.front
                    }}
                >
                    <Zap size={30} fill="var(--primary-lime)" color="var(--primary-lime)" />
                </motion.div>

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '20px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'rgba(20, 20, 20, 0.8)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                        transform: "translateZ(80px)"
                    }}
                >
                    <ShieldCheck size={24} color="#60a5fa" />
                </motion.div>

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '-40px',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transform: "translateZ(120px) translateY(-50%)"
                    }}
                >
                    <TrendingUp size={16} color="var(--primary-lime)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>+24%</span>
                </motion.div>

                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '-10px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--primary-lime)',
                        filter: 'blur(20px)',
                        opacity: 0.6,
                        transform: "translateZ(40px)"
                    }}
                />

                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        left: '-30px',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        background: 'var(--primary-lime)',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        boxShadow: '0 10px 20px rgba(203, 251, 69, 0.2)',
                        transform: translateZConfig.front
                    }}
                >
                    Pro Trader
                </motion.div>

                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) translateZ(-20px)',
                    width: '100%',
                    height: '100%',
                    borderRadius: '30px',
                    background: 'radial-gradient(circle, rgba(203, 251, 69, 0.15) 0%, transparent 60%)',
                    zIndex: -1
                }}></div>

            </motion.div>
        </motion.div>
    );
};

export default Hero3D;
