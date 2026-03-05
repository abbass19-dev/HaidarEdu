import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- CONFIG ---
        const COUNT = 60;
        const COLORS = [0x00FF94, 0xFF3B30]; // Neon Green, Neon Red

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.04);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Initial Camera Pos
        camera.position.z = 12;

        // --- RAYCASTER ---
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();

        // --- HELPERS ---
        const createCandle = () => {
            const group = new THREE.Group();

            const isGreen = Math.random() > 0.5;
            const color = isGreen ? COLORS[0] : COLORS[1];

            const bodyHeight = 0.5 + Math.random() * 2.0;
            const wickHeight = bodyHeight + 0.5 + Math.random();

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6
            });

            const bodyGeo = new THREE.BoxGeometry(0.5, bodyHeight, 0.5);
            const body = new THREE.Mesh(bodyGeo, material);
            body.userData = { isBody: true };
            group.add(body);

            const wickGeo = new THREE.BoxGeometry(0.08, wickHeight, 0.08);
            const wick = new THREE.Mesh(wickGeo, material);
            group.add(wick);

            group.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 60, // Taller spread for fly-through
                -10 - Math.random() * 20    // Deeper spread
            );

            group.userData = {
                baseSpeed: 0.02 + Math.random() * 0.04,
                speed: 0.02 + Math.random() * 0.04,
                rotSpeed: (Math.random() - 0.5) * 0.03,
                baseScale: 1,
                targetScale: 1,
                initialZ: group.position.z, // Remember start Z
                initialX: group.position.x
            };

            return group;
        };

        const candles = [];
        for (let i = 0; i < COUNT; i++) {
            const candle = createCandle();
            scene.add(candle);
            candles.push(candle);
        }

        // --- INTERACTION STATE ---
        let mouseX = 0;
        let mouseY = 0;
        let targetZ = 12;
        let targetY = 0;
        let scrollVelocity = 0;
        let lastScrollY = 0;

        const handleMouseMove = (event) => {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // --- ANIMATION LOOP ---
        const animate = () => {
            // 1. SCROLL PHYSICS
            const currentScrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(Math.max(currentScrollY / (maxScroll || 1), 0), 1);

            // Calc Velocity (Warp Speed)
            const deltaY = currentScrollY - lastScrollY;
            scrollVelocity = Math.abs(deltaY) * 0.001;
            lastScrollY = currentScrollY;

            // Target Camera Position (Fly Through)
            // Move Z from 12 (start) to -5 (end) -> Diving into the charts
            const targetCamZ = 12 - (scrollPercent * 17);

            // Smooth Camera Move
            camera.position.z += (targetCamZ - camera.position.z) * 0.05;

            // Scene Rotation (Barrel Roll influence)
            // Rotate camera on Z axis slightly based on scroll
            const targetRotZ = scrollPercent * -0.2; // Tilt left
            camera.rotation.z += (targetRotZ - camera.rotation.z) * 0.05;

            // 2. RAYCASTING
            raycaster.setFromCamera(mouseVector, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            candles.forEach(c => {
                c.userData.targetScale = 1;
                // Base speed + Scroll Warp
                const targetSpeed = c.userData.baseSpeed + (scrollVelocity * 2); // Boost speed on scroll
                c.userData.speed += (targetSpeed - c.userData.speed) * 0.1; // Smooth accel
                // Friction to return to base
                if (scrollVelocity < 0.001) {
                    c.userData.speed = c.userData.speed * 0.95 + c.userData.baseSpeed * 0.05;
                }
            });

            if (intersects.length > 0) {
                const object = intersects[0].object;
                const group = object.parent;
                if (group) {
                    group.userData.targetScale = 1.8;
                    group.rotation.y += 0.1;
                    document.body.style.cursor = 'pointer';
                }
            } else {
                document.body.style.cursor = 'none';
            }

            // 3. UPDATE CANDLES
            candles.forEach(candle => {
                // Scale
                const currentScale = candle.scale.x;
                const target = candle.userData.targetScale;
                candle.scale.set(
                    currentScale + (target - currentScale) * 0.1,
                    currentScale + (target - currentScale) * 0.1,
                    currentScale + (target - currentScale) * 0.1
                );

                // Movement (Y axis flow)
                candle.position.y += candle.userData.speed;
                candle.rotation.y += candle.userData.rotSpeed;

                // Loop Logic (Infinite Scroll)
                // If it goes too high relative to camera, reset to bottom
                // Since camera moves Z, we keep Y loop logic absolute world space
                if (candle.position.y > 30) {
                    candle.position.y = -30;
                    candle.position.x = (Math.random() - 0.5) * 40;
                }
            });

            // 4. MOUSE PARALLAX (Subtle Camera Sway)
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;

            // Look slightly ahead
            // camera.lookAt(0, 0, -20); // Keep focused forward

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };

    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 0,
                // pointerEvents handled by parent structure in Home2
            }}
            className="interactive-bg"
        />
    );
};

export default ParticleBackground;
