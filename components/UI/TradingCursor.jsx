import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TradingCursor = () => {
    const cursorRef = useRef(null);
    const innerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Force hide default cursor globally - REMOVED per user request to see original mouse
        // document.body.style.cursor = 'none';

        // GSAP Setters
        const xSet = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
        const ySet = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });
        const rotateXSet = gsap.quickTo(innerRef.current, "rotateX", { duration: 0.5, ease: "power2" });
        const rotateYSet = gsap.quickTo(innerRef.current, "rotateY", { duration: 0.5, ease: "power2" });

        let rotationTimeout;

        const handleMouseMove = (e) => {
            const { clientX, clientY, movementX, movementY } = e;

            // Follow
            xSet(clientX);
            ySet(clientY);

            // Tilt
            const rotX = Math.max(-45, Math.min(45, movementY * -1.5));
            const rotY = Math.max(-45, Math.min(45, movementX * 1.5));
            rotateXSet(rotX);
            rotateYSet(rotY);

            // Reset tilt
            clearTimeout(rotationTimeout);
            rotationTimeout = setTimeout(() => {
                rotateXSet(0);
                rotateYSet(0);
            }, 100);

            // Hover Check
            const target = e.target;
            if (target && target.style) {
                const computed = window.getComputedStyle(target);
                const clickable =
                    target.tagName === 'BUTTON' ||
                    target.tagName === 'A' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    computed.cursor === 'pointer';
                setIsHovering(!!clickable);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Hide system cursor
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(rotationTimeout);
            document.body.style.cursor = 'auto'; // Restore on unmount
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                pointerEvents: 'none',
                zIndex: 99999,
                xPercent: -50,
                yPercent: -50,
                perspective: '800px' // Key for 3D effect
            }}
        >
            <div
                ref={innerRef}
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'opacity 0.2s',
                    opacity: 1
                }}
            >
                {/* Arrow / Pointer Shape */}
                <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: `20px solid #00FF94`, // Always green
                    filter: `drop-shadow(0 0 8px #00FF94)`,
                    transform: 'rotate(-30deg)', // Fixed rotation
                    // Removed transition for shape change since it's now static
                }} />

                {/* Decorative "Candle Wick" look for extra tail - Always visible now */}
                <div style={{
                    width: '2px',
                    height: '15px',
                    background: 'rgba(255,255,255,0.6)',
                    margin: '0 auto',
                    transform: 'translateY(-5px) rotate(-30deg)',
                    boxShadow: '0 0 5px rgba(255,255,255,0.5)'
                }} />
            </div>
        </div>
    );
};

export default TradingCursor;
