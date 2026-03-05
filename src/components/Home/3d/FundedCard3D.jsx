import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CreditCard, Shield } from 'lucide-react';

const FundedCard3D = () => {
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
                    width: '300px', // Wider like a credit card
                    height: '190px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #1f1f1f 0%, #000 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.3)', // Gold border
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px'
                }}
            >
                {/* 1. Card Glow */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    background: 'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.15), transparent 60%)',
                    transform: "translateZ(1px)"
                }} />

                {/* 2. Top Section */}
                <div style={{ transform: "translateZ(30px)", display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ color: '#FFD700', fontWeight: 'bold' }}>HAIDAR EDU</div>
                    <CreditCard color="#FFD700" size={24} />
                </div>

                {/* 3. Chip and Info */}
                <div style={{ transform: "translateZ(40px)", display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '30px', background: 'linear-gradient(135deg, #FFD700, #B8860B)', borderRadius: '4px' }} />
                    <Shield size={16} color="rgba(255,255,255,0.5)" />
                </div>

                {/* 4. Bottom Section */}
                <div style={{ transform: "translateZ(50px)" }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', marginBottom: '4px' }}>FUNDED TRADER</div>
                    <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        $200,000
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default FundedCard3D;
