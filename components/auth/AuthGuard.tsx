'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (requireAdmin && role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, role, loading, router, requireAdmin]);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050505',
                color: 'var(--primary-lime)'
            }}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (!user || (requireAdmin && role !== 'admin')) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
};
