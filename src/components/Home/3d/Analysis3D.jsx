import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Brain, Zap } from 'lucide-react';

const Analysis3D = () => {
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
                    background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)', // Purple tint
                    border: '1px solid rgba(168, 85, 247, 0.2)',
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
                    backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    transform: "translateZ(10px)",
                    opacity: 0.5
                }} />

                {/* 2. Main Icon (Brain/Search) */}
                <div style={{ transform: "translateZ(50px)", marginBottom: '16px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(168, 85, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)'
                    }}>
                        <Brain size={40} color="#a855f7" />
                    </div>
                </div>

                {/* 3. Badge */}
                <div style={{
                    transform: "translateZ(70px)",
                    background: '#1a1a1a',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Search size={14} color="#a855f7" />
                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>Risk Analysis</span>
                </div>

                {/* Floating Element */}
                <motion.div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '20px',
                    transform: "translateZ(90px)"
                }}>
                    <Zap size={20} color="#a855f7" fill="#a855f7" fillOpacity={0.5} />
                </motion.div>

            </motion.div>
        </motion.div>
    );
};

export default Analysis3D;
