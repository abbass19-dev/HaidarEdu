import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgressBar = () => {
    const barRef = useRef(null);

    useEffect(() => {
        if (!barRef.current) return;

        gsap.to(barRef.current, {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3 // Smooth scrubbing
            }
        });

        // Optional: Ticks animation or glow pulse based on scroll velocity?
        // Keeping it clean for now as requested: "subtle vertical bar"

    }, []);

    return (
        <div style={{
            position: 'fixed',
            right: '2px', // Very close to edge
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 9998,
            overflow: 'hidden'
        }}>
            {/* Filling Bar */}
            <div
                ref={barRef}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, #00FF94 0%, #00bcff 100%)', // Trading colors gradient
                    transform: 'scaleY(0)', // Start empty
                    boxShadow: '0 0 10px rgba(0, 255, 148, 0.5)'
                }}
            />
        </div>
    );
};

export default ScrollProgressBar;
