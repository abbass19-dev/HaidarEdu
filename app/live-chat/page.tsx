'use client';

import React, { useState, useEffect, useRef } from 'react';
import { subscribeToChat, sendMessage, markUserChatRead } from '@/lib/firebase/chat';
import { subscribeToAuthChanges } from '@/lib/auth';
import { getUserRole } from '@/lib/db';
import { Send, Bot, MessageCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';

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
        
        markUserChatRead(user.uid);
        
        const unsubscribe = subscribeToChat(user.uid, (msgs: any[]) => {
            if (msgs.length > messages.length) {
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg.sender === 'admin') {
                    const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                    chime.volume = 0.4;
                    chime.play().catch(() => {});
                }
            }
            setMessages(msgs);
            markUserChatRead(user.uid);
        });
        return () => unsubscribe();
    }, [user, messages.length]);

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
            await sendMessage(user.uid, text, 'user', user.displayName || user.email?.split('@')[0] || '', user.email || '');
        } catch (error) {
            console.error("Error sending:", error);
        }
    };

    if (loading) return <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    if (user && role === 'admin') {
        return (
            <div className="admin-chat-wrapper">
                <Navbar />
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
            </div>
        );
    }

    return (
        <AuthGuard>
            <Navbar />
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
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'var(--primary-lime)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000',
                            boxShadow: '0 4px 10px rgba(203, 251, 69, 0.3)'
                        }}>
                            <Bot size={20} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>HaidarEdu Support</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary-lime)' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 8px currentColor' }}></span>
                                We reply instantly
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
                            <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <MessageCircle size={32} />
                                <p>No messages yet. Send us a message!</p>
                            </div>
                        )}

                        {messages.map(msg => (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                key={msg.id}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    padding: '12px 18px',
                                    borderRadius: '18px',
                                    background: msg.sender === 'user' ? 'var(--primary-lime)' : '#2A2A2A',
                                    color: msg.sender === 'user' ? '#000' : '#FFF',
                                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                                    borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', padding: '0 4px' }}>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
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
                                placeholder="Message support..."
                                style={{
                                    flex: 1,
                                    background: '#1A1A1A',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    padding: '16px 24px',
                                    borderRadius: '30px',
                                    color: '#FFF',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    background: input.trim() ? 'var(--primary-lime)' : 'rgba(255,255,255,0.1)',
                                    color: input.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: input.trim() ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                    boxShadow: input.trim() ? '0 4px 12px rgba(203, 251, 69, 0.4)' : 'none',
                                    transform: input.trim() ? 'scale(1)' : 'scale(0.95)'
                                }}
                            >
                                <Send size={20} style={{ marginLeft: '2px' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
