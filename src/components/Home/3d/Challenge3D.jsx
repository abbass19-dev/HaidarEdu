import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Target, TrendingUp, ArrowUpRight } from 'lucide-react';

const Challenge3D = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 400, damping: 40 });
    const mouseY = useSpring(y, { stiffness: 400, damping: 40 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

    return (
        <motion.div
            style={{
                perspective: 1000,
                width: '100%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    width: '240px',
                    height: '240px',
                    borderRadius: '24px',
                    background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)', // Cyan tint
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* 1. Background Grid */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    backgroundImage: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    transform: "translateZ(10px)",
                    opacity: 0.5
                }} />

                {/* 2. Main Icon (Target) */}
                <div style={{ transform: "translateZ(50px)", marginBottom: '16px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                    }}>
                        <Target size={40} color="#06b6d4" />
                    </div>
                </div>

                {/* 3. Stats Badge */}
                <div style={{
                    transform: "translateZ(70px)",
                    background: '#1a1a1a',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <TrendingUp size={14} color="#06b6d4" />
                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>Profit Target</span>
                </div>

                {/* Floating Element: Arrow */}
                <motion.div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    transform: "translateZ(90px)"
                }}>
                    <ArrowUpRight size={24} color="#06b6d4" />
                </motion.div>

            </motion.div>
        </motion.div>
    );
};

export default Challenge3D;
