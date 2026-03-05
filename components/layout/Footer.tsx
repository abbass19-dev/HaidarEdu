'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "Programs",
            links: [
                { name: "Funded Accounts", path: "/programs" },
                { name: "Free Trial", path: "/programs" },
                { name: "Rules & FAQ", path: "/programs" },
            ]
        },
        {
            title: "Education",
            links: [
                { name: "Trading Courses", path: "/courses" },
                { name: "Market Analysis", path: "/articles" },
                { name: "Free Webinars", path: "/courses" },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Risk Disclosure", path: "/risk-disclosure" },
            ]
        }
    ];

    return (
        <footer style={{
            padding: '80px 0 40px',
            background: '#050505',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            position: 'relative'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <Link href="/" style={{ textDecoration: 'none', fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, var(--primary-lime), #00F0FF)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000'
                            }}>
                                H
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                <span style={{ color: 'white', fontSize: '1.2rem' }}>HAIDAR</span>
                                <span style={{ color: 'var(--primary-lime)', fontSize: '0.7rem' }}>EDUCATION</span>
                            </div>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '300px', lineHeight: '1.6', fontSize: '0.9rem' }}>
                            Professional trading education and institutional-grade funding programs. Join thousands of traders worldwide.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                            {[Twitter, Instagram, Youtube, Mail].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    href="#"
                                    whileHover={{ y: -3, color: 'var(--primary-lime)' }}
                                    style={{ color: 'rgba(255,255,255,0.4)', transition: '0.3s' }}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '24px', fontSize: '1rem' }}>{section.title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx} style={{ marginBottom: '12px' }}>
                                        <Link href={link.path} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: '0.3s' }}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{
                    paddingTop: '40px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                        &copy; {currentYear} HAIDAREDU. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
