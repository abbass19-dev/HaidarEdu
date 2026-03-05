'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupWithEmail } from '@/lib/auth';

const SignupPage = () => {
    const router = useRouter();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signupWithEmail(email, password);
            router.push('/courses');
        } catch (err: any) {
            setError(err.message || 'Signup failed.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-dark)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ width: '100%', maxWidth: '440px', padding: '48px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.8rem', marginBottom: '32px' }}>
                    <span style={{ color: 'var(--primary-lime)' }}>HAIDAR</span>EDU
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Create Account</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Join the elite trading community.</p>

                {error && <div style={{ color: '#ff4444', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', outline: 'none' }}
                        />
                    </div>

                    <button disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={18} />
                    </button>
                </form>

                <p style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary-lime)', textDecoration: 'none', fontWeight: '600' }}>Log In</Link>
                </p>
            </motion.div>
        </main>
    );
};

export default SignupPage;
