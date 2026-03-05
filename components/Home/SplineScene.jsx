'use client';

import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';

const SplineScene = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            {isLoading && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#00FF94', fontFamily: 'monospace'
                }}>
                    Loading 3D Scene...
                </div>
            )}
            {/* Scene Container with Watermark Hiding */}
            <div style={{
                width: '100%',
                height: '100%',
                transform: 'scale(1.05)', // Slightly zoom in to push watermark out if needed, or just cover it
                transformOrigin: 'center center'
            }}>
                <Spline
                    scene="https://prod.spline.design/kTnkIy5wufSkS2eX/scene.splinecode"
                    onLoad={() => setIsLoading(false)}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Professional Overlay to Mask Watermark & Blend Scene */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '150px',
                height: '60px',
                background: '#050505', // Match page background
                zIndex: 10,
                display: 'block' // Explicitly covers the bottom right corner
            }} />

            {/* Gradient Overlay for Depth */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 0%, #050505 90%)',
                pointerEvents: 'none',
                zIndex: 5
            }} />
        </div>
    );
};

export default SplineScene;
