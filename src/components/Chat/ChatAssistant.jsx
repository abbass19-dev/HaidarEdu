import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bot, X, Send, User, ShieldCheck, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { subscribeToKnowledgeBase } from '../../firebase/knowledgeBase';
import { getCourses, getArticles } from '../../firebase/db';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const initialGreeting = { id: 1, text: "Hello! I'm your AI assistant. Ask me anything about our trading courses, services, or market updates!", sender: 'bot' };
    const [messages, setMessages] = useState([initialGreeting]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [kbEntries, setKbEntries] = useState([]);
    const [courses, setCourses] = useState([]);
    const [articles, setArticles] = useState([]);
    const messagesEndRef = useRef(null);

    // Initialize Gemini Client
    const client = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE"
    });

    // Load All Context Data
    useEffect(() => {
        const unsubscribeKB = subscribeToKnowledgeBase(setKbEntries);

        const fetchData = async () => {
            try {
                const [c, a] = await Promise.all([getCourses(), getArticles()]);
                setCourses(c);
                setArticles(a);
            } catch (e) {
                console.error("Error fetching chat context data:", e);
            }
        };
        fetchData();

        return () => unsubscribeKB();
    }, []);

    // Clear History on Close
    useEffect(() => {
        if (!isOpen) {
            setMessages([initialGreeting]);
        }
    }, [isOpen]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const formatContext = () => {
        let context = `You are an AI chatbot assistant for our official website, Haidar Edu.

Your main role is to:
- Answer users’ questions clearly and professionally
- Explain what our website is
- Explain our services, products, and features
- Guide users on how to use the platform
- Direct users to contact admin when needed

You must ONLY rely on the information stored in the KNOWLEDGE BASE, COURSES, and ARTICLES provided below.
If a question is not available in the stored data:
- Politely say you don’t have that information yet
- Offer to forward the question to the admin
- NEVER invent answers. Use this specific fallback: "Thanks for your question! I don’t have this information yet, but I can forward it to our admin for clarification."

--- WEBSITE DESCRIPTION ---
Our website is a professional platform that provides:
- Clear information about our services
- User interaction and support
- Educational and/or business-related solutions
- Secure communication between users and admins

--- KNOWLEDGE BASE (ADMIN ADDED) ---`;

        // KB Entries
        const qa = kbEntries.filter(e => e.type === 'qa');
        const servicesAndProducts = kbEntries.filter(e => e.type === 'service');
        const updates = kbEntries.filter(e => e.type === 'announcement');

        if (servicesAndProducts.length > 0) {
            context += "\n\n[GENERAL SERVICES]\n";
            servicesAndProducts.forEach(s => context += `- ${s.title}: ${s.content}\n`);
        }

        if (updates.length > 0) {
            context += "\n[ANNOUNCEMENTS]\n";
            updates.forEach(u => context += `- ${u.title}: ${u.content}\n`);
        }

        if (qa.length > 0) {
            context += "\n[Q&A]\n";
            qa.forEach(q => context += `Q: ${q.question}\nA: ${q.answer}\n`);
        }

        // Live Courses
        if (courses.length > 0) {
            context += "\n\n--- OUR TRADING COURSES (LIVE) ---\n";
            courses.forEach(c => {
                context += `- ${c.title} (${c.price}, Level: ${c.level}): ${c.desc}\n`;
            });
        }

        // Live Articles
        if (articles.length > 0) {
            context += "\n\n--- LATEST ARTICLES & INSIGHTS ---\n";
            articles.forEach(a => {
                context += `- ${a.title}: ${a.desc || 'No description available.'}\n`;
            });
        }

        context += "\n--- BEHAVIOR RULES ---";
        context += "\n- Be friendly, professional, and concise.";
        context += "\n- Use simple language; avoid technical jargon unless necessary.";
        context += "\n- Never provide legal, financial, or medical advice.";
        context += "\n- Never collect personal data (passwords, payment info, IDs).";
        context += "\n- Tone: Helpful, Trustworthy, Calm, Business-professional.";
        context += "\n- End conversations by offering help: 'Would you like to know more about our services?'";

        return context;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const promptContext = formatContext();
            const fullPrompt = `${promptContext}\n\nUser Question: ${userMsg.text}`;

            const result = await client.models.generateContent({
                model: "gemini-1.5-pro",
                contents: fullPrompt
            });

            const text = result.text || "I couldn't generate a response.";

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: text,
                sender: 'bot'
            }]);
        } catch (error) {
            console.error("AI Error:", error);
            let errorMessage = "I'm having trouble connecting to my brain right now. Please try again in a few seconds.";

            if (error.message?.includes('429') || error.message?.includes('RESOURCES_EXHAUSTED')) {
                errorMessage = "I've reached my temporary limit (Quota Exceeded). Please wait 30-60 seconds and try again, or check your API key limits in Google AI Studio.";
            } else if (error.message?.includes('404')) {
                errorMessage = "The AI model version I'm using seems to be outdated or unavailable. Please contact the developer to update my configuration.";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: errorMessage,
                sender: 'bot'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const isMobile = window.innerWidth <= 768;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="floating-bot"
                style={{
                    backgroundColor: 'var(--primary-lime)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--glow-lime-intense)',
                    borderRadius: '50%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {isOpen ? <X size={28} /> : <Bot size={28} />}
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass chat-window"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 20px 80px rgba(0,0,0,0.6)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '20px', background: 'rgba(203, 251, 69, 0.1)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#000' }}>
                                <Bot size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>Haidar AI (Beta)</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--primary-lime)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', background: 'var(--primary-lime)', borderRadius: '50%' }}></span> {kbEntries.length > 0 ? 'Online & Trained' : 'Online'}
                                </div>
                            </div>
                            <button
                                onClick={() => setMessages([initialGreeting])}
                                style={{ marginLeft: 'auto', background: 'transparent', color: 'rgba(255,255,255,0.4)', padding: '8px' }}
                                title="Clear Chat History"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    background: msg.sender === 'user' ? 'var(--primary-lime)' : 'rgba(255,255,255,0.05)',
                                    color: msg.sender === 'user' ? '#000' : 'var(--text-main)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                                    <Loader2 size={16} className="spin" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about trading..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-full)',
                                    padding: '10px 20px',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isTyping}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: isTyping ? '#333' : 'var(--primary-lime)',
                                    color: isTyping ? '#666' : '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isTyping ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatAssistant;
