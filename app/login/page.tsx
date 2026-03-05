'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle } from '@/lib/auth';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await loginWithEmail(email, password);
            const { getUserRole } = await import('@/lib/db');
            const role = await getUserRole(userCredential.user.uid);

            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/courses');
            }
        } catch (err) {
            setError('Invalid email or password.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            router.push('/admin'); // Or wherever appropriate
        } catch (err) {
            setError('Google sign-in failed.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-dark)'
        }}>
            {/* Background Glows */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(203, 251, 69, 0.05) 0%, transparent 70%)',
                zIndex: -1
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '48px',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center'
                }}
            >
                <div style={{ fontWeight: '800', fontSize: '1.8rem', marginBottom: '32px' }}>
                    <span style={{ color: 'var(--primary-lime)' }}>HAIDAR</span>EDU
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>
                    Log in to continue your trading journey.
                </p>

                {error && <div style={{ color: '#ff4444', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
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
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ margin: '24px 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'var(--border-subtle)', zIndex: 0 }}></div>
                    <span style={{ position: 'relative', background: '#0F0F0F', padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-dim)', zIndex: 1 }}>
                        Or continue with
                    </span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                <p style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link href="/register" style={{ color: 'var(--primary-lime)', textDecoration: 'none', fontWeight: '600' }}>Sign Up</Link>
                </p>
            </motion.div>
        </main>
    );
};

export default LoginPage;
