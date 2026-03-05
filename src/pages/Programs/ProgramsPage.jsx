import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Target, Award } from 'lucide-react';

const ProgramCard = ({ title, price, features, delay, highlight, onSelect, buttonText }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="glass"
        style={{
            padding: 'clamp(24px, 5vw, 40px)',
            borderRadius: 'var(--radius-lg)',
            border: highlight ? '1px solid var(--primary-lime)' : '1px solid var(--border-subtle)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left'
        }}
    >
        {highlight && (
            <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary-lime)',
                color: '#000',
                padding: '4px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '700'
            }}>
                MOST POPULAR
            </div>
        )}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{title}</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px', color: highlight ? 'var(--primary-lime)' : 'white' }}>
            {price}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Check size={16} style={{ color: 'var(--primary-lime)' }} /> {f}
                </div>
            ))}
        </div>

        <button
            className={highlight ? "btn-primary" : "btn-secondary"}
            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', padding: '14px' }}
            onClick={onSelect}
        >
            {buttonText || "Select Plan"} <ArrowRight size={18} />
        </button>
    </motion.div>
);

const ProgramsPage = () => {
    return (
        <main style={{ paddingTop: '160px', paddingBottom: '100px' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <header style={{ marginBottom: '60px' }}>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', marginBottom: '20px', lineHeight: '1.2' }}>Choose Your <span style={{ color: 'var(--primary-lime)' }}>Funding</span> Path</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '700px', margin: '0 auto' }}>
                        Start your professional journey today. Pass the evaluation and trade up to $200k of institutional capital.
                    </p>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    <ProgramCard
                        title="Free Community Group"
                        price="Free"
                        features={[
                            "Daily Market Updates",
                            "Community Chat Access",
                            "Basic Trading Education",
                            "Weekly Analysis",
                            "Network with Traders"
                        ]}
                        delay={0.1}
                        buttonText="Join Group"
                        onSelect={() => window.open('https://t.me/+eKf0Kl6m0N00ZGE0', '_blank')}
                    />
                    <ProgramCard
                        title="Professional"
                        price="$299"
                        features={[
                            "$50,000 Starting Capital",
                            "85% Profit Split",
                            "1-Step Evaluation",
                            "Daily Profit Targets",
                            "Professional Tools Included"
                        ]}
                        delay={0.2}
                        highlight={true}
                        buttonText="Contact Support"
                        onSelect={() => window.open('https://t.me/abbasshij?text=Hello%20Haidar%2C%20I%20am%20interested%20in%20joining%20the%20VIP%20Program.', '_blank')}
                    />
                    <ProgramCard
                        title="Elite Mentorship"
                        price="$99 / month"
                        features={[
                            "Live Trading Sessions",
                            "Private VIP Group Access",
                            "Weekly Strategy Breakdown",
                            "Direct Q&A with Mentor",
                            "Priority Support"
                        ]}
                        delay={0.3}
                        buttonText="Join Elite"
                        onSelect={() => window.open('https://t.me/abbasshij?text=Hello%20Haidar%2C%20I%20am%20interested%20in%20joining%20the%20    Elite%20Mentorship%20Program.', '_blank')}
                    />
                </div>
            </div>
        </main>
    );
};

export default ProgramsPage;
