'use client';

import React, { useState, useEffect, useRef } from 'react';
import { subscribeToAllChats, subscribeToChat, sendMessage, markChatRead, getChatUserDetails } from '@/lib/firebase/chat';

import { User, Send, Search, ChevronLeft, ShieldCheck } from 'lucide-react';


export default function ChatManagerPage() {
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [userDetails, setUserDetails] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const unsubscribe = subscribeToAllChats((updatedChats: any[]) => {
            setChats(updatedChats);
        });

        return () => {
            window.removeEventListener('resize', checkMobile);
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!selectedChatId) return;

        markChatRead(selectedChatId);
        getChatUserDetails(selectedChatId).then(details => setUserDetails(details));
        isNearBottomRef.current = true;

        const unsubscribe = subscribeToChat(selectedChatId, (msgs: any[]) => {
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [selectedChatId]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
        isNearBottomRef.current = distanceToBottom < 100;
    };

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        const amISender = lastMsg?.sender === 'admin';

        if (isNearBottomRef.current || amISender) {
            const container = scrollContainerRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !selectedChatId) return;
        const text = input;
        setInput('');

        try {
            await sendMessage(selectedChatId, text, 'admin');
        } catch (error) {
            console.error("Failed to send:", error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 120px)',
            gap: isMobile ? '0' : '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Sidebar: Chat List */}
            <div className="glass" style={{
                width: isMobile ? '100%' : '350px',
                display: (isMobile && selectedChatId) ? 'none' : 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: isMobile ? 'none' : '1px solid var(--glass-border)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Inbox</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {chats.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No conversations yet</div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                style={{
                                    padding: '16px 20px',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    cursor: 'pointer',
                                    background: selectedChatId === chat.id ? 'rgba(203, 251, 69, 0.05)' : 'transparent',
                                    transition: 'background 0.2s',
                                    borderLeft: selectedChatId === chat.id ? '3px solid var(--primary-lime)' : '3px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', color: chat.unreadCount > 0 ? 'var(--primary-lime)' : 'var(--text-main)' }}>
                                        User {chat.id.slice(0, 5)}...
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString() : ''}

                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-dim)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '220px'
                                    }}>
                                        {chat.lastSender === 'admin' ? 'You: ' : ''}{chat.lastMessage}
                                    </p>
                                    {chat.unreadCount > 0 && (
                                        <span style={{
                                            background: 'var(--primary-lime)',
                                            color: '#000',
                                            fontSize: '0.7rem',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            fontWeight: 'bold'
                                        }}>
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Area: Chat Window */}
            <div className="glass" style={{
                flex: 1,
                display: (isMobile && !selectedChatId) ? 'none' : 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: isMobile ? 'none' : '1px solid var(--glass-border)'
            }}>
                {selectedChatId ? (
                    <>
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            {isMobile && (
                                <button
                                    onClick={() => setSelectedChatId(null)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '4px', marginLeft: '-8px', cursor: 'pointer' }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {userDetails?.firstName ? `${userDetails.firstName} ${userDetails.lastName}` : `User ${selectedChatId.slice(0, 8)}`}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {userDetails?.email || 'Customer'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                            <div style={{
                                padding: '10px 16px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '10px',
                                color: 'var(--text-dim)',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '8px'
                            }}>
                                <ShieldCheck size={16} style={{ color: 'var(--primary-lime)', flexShrink: 0 }} />
                                <span>Note: Messages older than 14 days are automatically cleared for user privacy.</span>
                            </div>
                            {messages.map(msg => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{
                                        padding: '12px 18px',
                                        borderRadius: '12px',
                                        background: msg.sender === 'admin' ? 'var(--primary-lime)' : 'rgba(255,255,255,0.05)',
                                        color: msg.sender === 'admin' ? '#000' : 'var(--text-main)',
                                        borderTopRightRadius: msg.sender === 'admin' ? '2px' : '12px',
                                        borderTopLeftRadius: msg.sender === 'admin' ? '12px' : '2px',
                                    }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Sending...'}

                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your reply..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: '12px 24px',
                                        color: 'var(--text-main)',
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
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--glow-lime)'
                                    }}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <User size={32} />
                        </div>
                        <h3>Select a conversation</h3>
                        <p>Choose a user from the list to view and reply to messages</p>
                    </div>
                )}
            </div>
        </div>
    );
}
