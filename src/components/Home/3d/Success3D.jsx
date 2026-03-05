import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy, CheckCircle, Star, Award } from 'lucide-react';

const Success3D = () => {
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

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

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
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    width: '320px',
                    height: '400px',
                    background: 'linear-gradient(145deg, rgba(255, 215, 0, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)', // Gold tint
                    borderRadius: '30px',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 25px 50px -12px rgba(255, 215, 0, 0.15)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px'
                }}
            >
                {/* 1. Background Particles */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '30px',
                    overflow: 'hidden',
                    transform: "translateZ(10px)"
                }}>
                    <div className="light-ray" style={{
                        top: '50%',
                        left: '50%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%)'
                    }} />
                </div>

                {/* 2. Main Content (Trophy) */}
                <motion.div
                    style={{
                        transform: translateZConfig.mid,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)'
                    }}>
                        <Trophy size={64} color="#FFD700" strokeWidth={1.5} />
                    </div>

                    <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '8px', textAlign: 'center' }}>
                        $200,000
                    </h3>
                    <p style={{ color: '#FFD700', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Funded Account
                    </p>
                </motion.div>

                {/* 3. Floating Elements */}

                {/* Certified Badge */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        background: '#1a1a1a',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                        transform: translateZConfig.front
                    }}
                >
                    <CheckCircle size={16} color="#FFD700" fill="#FFD700" fillOpacity={0.2} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>Certified Trader</span>
                </motion.div>

                {/* Floating Star 1 */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '30px',
                        transform: "translateZ(80px) rotate(15deg)"
                    }}
                >
                    <Star size={24} fill="#FFD700" color="#FFD700" />
                </motion.div>

                {/* Floating Award Icon */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: '30px',
                        transform: "translateZ(70px) rotate(-15deg)"
                    }}
                >
                    <Award size={24} color="#FFD700" />
                </motion.div>

            </motion.div>
        </motion.div>
    );
};

export default Success3D;
