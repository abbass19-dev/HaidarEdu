import React from 'react';
import { motion } from 'framer-motion';
import Challenge3D from './3d/Challenge3D';
import Analysis3D from './3d/Analysis3D';
import FundedCard3D from './3d/FundedCard3D';
import { ArrowRight } from 'lucide-react';

const Step = ({ component: Component, number, title, desc, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}
    >
        {/* 3D Animation Container */}
        <div style={{ width: '100%', marginBottom: '20px' }}>
            <Component />
        </div>

        {/* Text Content */}
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            borderRadius: '24px',
            position: 'relative',
            width: '100%',
            maxWidth: '320px'
        }}>
            <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'black',
                boxShadow: `0 0 20px ${color}66`
            }}>
                {number}
            </div>

            <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1.2rem' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{desc}</p>
        </div>
    </motion.div>
);

const FundingProcess = () => {
    return (
        <section style={{ padding: '100px 0', position: 'relative' }}>
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100px',
                background: 'radial-gradient(ellipse at center, rgba(var(--primary-lime-rgb), 0.05), transparent 70%)',
                zIndex: -1
            }} />

            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '16px' }}>
                        Your Path to <span style={{ color: 'var(--primary-lime)' }}>Funding</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Three simple steps to unlock your professional trading career.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    position: 'relative'
                }}>
                    <Step
                        component={Challenge3D}
                        number="1"
                        title="The Challenge"
                        desc="Prove your skills by hitting a profit target while managing risk effectively."
                        color="#06b6d4" // Cyan
                    />

                    <Step
                        component={Analysis3D}
                        number="2"
                        title="Verification"
                        desc="Validate your consistency and discipline in a simulated environment."
                        color="#a855f7" // Purple
                    />

                    <Step
                        component={FundedCard3D}
                        number="3"
                        title="Get Funded"
                        desc="Receive your funded account and keep up to 90% of your profits."
                        color="#FFD700" // Gold
                    />
                </div>
            </div>
        </section>
    );
};

export default FundingProcess;
