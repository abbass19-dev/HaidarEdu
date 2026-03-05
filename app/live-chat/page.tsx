'use client';

import React, { useState, useEffect, useRef } from 'react';
import { subscribeToChat, sendMessage } from '@/lib/firebase/chat';
import { subscribeToAuthChanges } from '@/lib/auth';
import { getUserRole } from '@/lib/db';
import { Send, Bot, MessageCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function LiveChatPage() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const unsubscribe = subscribeToAuthChanges(async (u) => {
            setUser(u);
            if (u) {
                const userRole = await getUserRole(u.uid);
                setRole(userRole);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => {
            window.removeEventListener('resize', checkMobile);
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToChat(user.uid, (msgs: any[]) => {
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [user]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
        isNearBottomRef.current = distanceToBottom < 100;
    };

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        const amISender = lastMsg?.sender === 'user';

        if (isNearBottomRef.current || amISender) {
            const container = scrollContainerRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;
        const text = input;
        setInput('');

        try {
            await sendMessage(user.uid, text, 'user');
        } catch (error) {
            console.error("Error sending:", error);
        }
    };

    if (loading) return <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    if (user && role === 'admin') {
        return (
            <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
                <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '48px', borderRadius: '24px' }}>
                    <ShieldAlert size={64} style={{ color: 'var(--primary-lime)', marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 'bold' }}>Admin Access Restricted</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        You are logged in as an Administrator. Please use the Admin Dashboard to manage support requests and reply to users.
                    </p>
                    <Link href="/admin/chats">
                        <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            Go to Admin Dashboard <Bot size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>

                <div className="glass" style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    height: isMobile ? 'calc(100vh - 200px)' : '75vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: isMobile ? '0' : '24px',
                    overflow: 'hidden',
                    border: isMobile ? 'none' : '1px solid var(--glass-border)'
                }}>
                    <div style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'var(--primary-lime)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000'
                        }}>
                            <Bot size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>HaidarEdu Support</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary-lime)' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
                                Typically replies within minutes
                            </div>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: isMobile ? '16px' : '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? '16px' : '24px',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                        <div style={{
                            padding: '12px 20px',
                            background: 'rgba(203, 251, 69, 0.05)',
                            border: '1px solid rgba(203, 251, 69, 0.1)',
                            borderRadius: '12px',
                            color: 'var(--text-dim)',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px'
                        }}>
                            <ShieldCheck size={18} style={{ color: 'var(--primary-lime)', flexShrink: 0 }} />
                            <span>For privacy reasons, chat messages are automatically deleted after a period of time.</span>
                        </div>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.5 }}>
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        )}

                        {messages.map(msg => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    padding: '16px 24px',
                                    borderRadius: '16px',
                                    background: msg.sender === 'user' ? 'var(--primary-lime)' : 'rgba(255,255,255,0.1)',
                                    color: msg.sender === 'user' ? '#000' : 'var(--text-main)',
                                    borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                                    borderTopLeftRadius: msg.sender === 'user' ? '16px' : '4px',
                                    fontSize: '1rem',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px', marginLeft: '4px' }}>
                                    {msg.sender === 'user' ? 'You' : 'Support Team'} • {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Sending...'}

                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid var(--border-subtle)'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '8px',
                            borderRadius: '50px',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message here..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px 24px',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-lime)',
                                    color: '#000',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    boxShadow: 'var(--glow-lime)'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
