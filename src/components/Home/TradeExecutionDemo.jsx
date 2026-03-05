import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

/* ================= CONFIG ================= */
const TICK_SPEED = 1000;
const MAX_CANDLES = 20;
const BUY_COLOR = "#00FF94"; // Neon Green
const SELL_COLOR = "#FF3B30"; // Neon Red
const TRANSITION = { type: "spring", stiffness: 400, damping: 28 };

// Fixed, deterministic data pattern
const FIXED_SEQUENCE = [
    { open: 64200, close: 64250, high: 64300, low: 64150 },
    { open: 64250, close: 64220, high: 64280, low: 64190 },
    { open: 64220, close: 64300, high: 64350, low: 64200 },
    { open: 64300, close: 64280, high: 64320, low: 64250 },
    { open: 64280, close: 64350, high: 64400, low: 64260 },
    { open: 64350, close: 64400, high: 64450, low: 64320 },
    { open: 64400, close: 64380, high: 64420, low: 64350 },
    { open: 64380, close: 64500, high: 64550, low: 64360 },
    { open: 64500, close: 64650, high: 64700, low: 64480 },
    { open: 64650, close: 64600, high: 64680, low: 64580 },
    { open: 64600, close: 64750, high: 64800, low: 64590 },
    { open: 64750, close: 64850, high: 64900, low: 64700 }, // Peak
    { open: 64850, close: 64800, high: 64880, low: 64750 },
    { open: 64800, close: 64950, high: 65000, low: 64780 },
    { open: 64950, close: 65100, high: 65150, low: 64900 },
];

export default function TradeExecutionDemo() {
    const [candles, setCandles] = useState([]);
    const [tickIndex, setTickIndex] = useState(0);
    const [activeTrade, setActiveTrade] = useState(null);
    const [result, setResult] = useState(null);

    // 3D Tilt State
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [5, -5]); // Inverted tilt
    const rotateY = useTransform(x, [-300, 300], [-5, 5]);

    useEffect(() => {
        const initialCount = 10;
        const initialData = FIXED_SEQUENCE.slice(0, initialCount).map((d, i) => ({ ...d, id: i }));
        setCandles(initialData);
        setTickIndex(initialCount);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTickIndex(prev => {
                const nextIndex = (prev + 1) % FIXED_SEQUENCE.length;
                const nextData = FIXED_SEQUENCE[nextIndex];
                setCandles(current => {
                    const newCandle = { ...nextData, id: Date.now() };
                    const updated = [...current, newCandle];
                    return updated.length > MAX_CANDLES ? updated.slice(updated.length - MAX_CANDLES) : updated;
                });
                return nextIndex;
            });
        }, TICK_SPEED);
        return () => clearInterval(interval);
    }, []);

    /* ================= SCALING ================= */
    const values = candles.flatMap(c => [c.high, c.low]);
    const minVal = Math.min(...values) || 0;
    const maxVal = Math.max(...values) || 100;
    const padding = (maxVal - minVal) * 0.2;
    const range = (maxVal - minVal) + (padding * 2) || 1;
    const bottom = minVal - padding;
    const getY = v => 100 - ((v - bottom) / range) * 100;

    /* ================= DERIVED STATE ================= */
    const currentPrice = candles.length > 0 ? candles[candles.length - 1].close : 0;
    const currentPnl = activeTrade
        ? (activeTrade.type === 'buy' ? currentPrice - activeTrade.entryPrice : activeTrade.entryPrice - currentPrice) * 10
        : 0;

    /* ================= INTERACTIVITY ================= */
    const handleTrade = (type) => {
        if (activeTrade) return;
        setActiveTrade({ type, entryPrice: currentPrice, entryTime: Date.now() });
    };

    const closeTrade = () => {
        if (!activeTrade) return;
        setResult(currentPnl);
        setActiveTrade(null);
        setTimeout(() => setResult(null), 2000);
    };

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section style={{ padding: '80px 0', position: 'relative', overflow: 'hidden', perspective: '1000px' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>
                        Institutional-Grade Execution
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Precision market data visualization with instant order execution.
                    </p>
                </div>

                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        background: "#0B0E11",
                        borderRadius: '24px',
                        padding: '32px',
                        height: '500px',
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', position: 'relative',
                        transformStyle: 'preserve-3d',
                        rotateX, rotateY
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                >
                    {/* Background Grid */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none',
                        transform: 'translateZ(-10px)'
                    }} />

                    {/* Result Popup */}
                    <AnimatePresence>
                        {result !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.8, z: 50 }}
                                animate={{ opacity: 1, y: 0, scale: 1, z: 100 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    padding: '20px 40px', borderRadius: '16px',
                                    background: result >= 0 ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                    border: `1px solid ${result >= 0 ? BUY_COLOR : SELL_COLOR}`,
                                    backdropFilter: 'blur(20px)', zIndex: 50,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'
                                }}
                            >
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: result >= 0 ? BUY_COLOR : SELL_COLOR }}>
                                    {result >= 0 ? '+' : ''}${Math.floor(result).toLocaleString()}
                                </div>
                                <div style={{ color: 'white', fontSize: '0.9rem', opacity: 0.8 }}>Realized P&L</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', zIndex: 10, transform: 'translateZ(20px)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>BTC/USD</div>
                            <div style={{ color: candles.length > 0 && candles[candles.length - 1].close >= candles[candles.length - 1].open ? BUY_COLOR : SELL_COLOR, fontWeight: '600' }}>
                                ${candles.length > 0 ? candles[candles.length - 1].close.toLocaleString() : '---'}
                            </div>
                        </div>
                        {activeTrade && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    padding: '6px 16px', borderRadius: '8px',
                                    background: currentPnl >= 0 ? 'rgba(0, 255, 148, 0.15)' : 'rgba(255, 59, 48, 0.15)',
                                    border: `1px solid ${currentPnl >= 0 ? BUY_COLOR : SELL_COLOR}`,
                                    display: 'flex', gap: '10px', alignItems: 'center'
                                }}
                            >
                                <span style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                    {activeTrade.type.toUpperCase()} ENTRY: ${activeTrade.entryPrice.toLocaleString()}
                                </span>
                                <span style={{ fontWeight: '800', color: currentPnl >= 0 ? BUY_COLOR : SELL_COLOR }}>
                                    {currentPnl >= 0 ? '+' : ''}${Math.floor(currentPnl)}
                                </span>
                            </motion.div>
                        )}
                    </div>

                    {/* Chart Area */}
                    <div style={{ flex: 1, position: 'relative', zIndex: 5, transform: 'translateZ(10px)' }}>
                        {/* Y-AXIS LABELS (Moved to LEFT) */}
                        <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0, width: '50px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            padding: '10px 10px 10px 0', fontSize: '0.75rem', fontWeight: '500',
                            color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
                            textAlign: 'right', borderRight: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div>${Math.floor(maxVal).toLocaleString()}</div>
                            <div>${Math.floor((maxVal + minVal) / 2).toLocaleString()}</div>
                            <div>${Math.floor(minVal).toLocaleString()}</div>
                        </div>

                        {/* SVG Chart */}
                        <svg width="100%" height="100%" style={{ overflow: 'visible', paddingLeft: '60px' }}>
                            <AnimatePresence>
                                {candles.map((c, i) => {
                                    const isGreen = c.close >= c.open;
                                    const color = isGreen ? BUY_COLOR : SELL_COLOR;
                                    const x = (i / (MAX_CANDLES - 1)) * 100;
                                    const w = 2.5;

                                    return (
                                        <motion.g
                                            key={c.id}
                                            initial={{ opacity: 0, scaleY: 0 }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <motion.line
                                                animate={{ y1: `${getY(c.high)}%`, y2: `${getY(c.low)}%`, x1: `${x}%`, x2: `${x}%` }}
                                                transition={TRANSITION}
                                                stroke={color} strokeWidth={1.5}
                                            />
                                            <motion.rect
                                                animate={{
                                                    y: `${Math.min(getY(c.open), getY(c.close))}%`,
                                                    height: `${Math.max(1, Math.abs(getY(c.open) - getY(c.close)))}%`, // Min height 1%
                                                    x: `${x - w / 2}%`
                                                }}
                                                transition={TRANSITION}
                                                width={`${w}%`} fill={color} rx="1"
                                                style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
                                            />
                                        </motion.g>
                                    );
                                })}
                            </AnimatePresence>

                            {activeTrade && (
                                <line x1="0" x2="100%" y1={`${getY(activeTrade.entryPrice)}%`} y2={`${getY(activeTrade.entryPrice)}%`} stroke={activeTrade.type === 'buy' ? BUY_COLOR : SELL_COLOR} strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
                            )}
                            {candles.length > 0 && (
                                <line x1="0" x2="100%" y1={`${getY(candles[candles.length - 1].close)}%`} y2={`${getY(candles[candles.length - 1].close)}%`} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
                            )}
                        </svg>
                    </div>

                    {/* Embedded Controls */}
                    <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', zIndex: 10, transform: 'translateZ(30px)' }}>
                        <button
                            onClick={() => activeTrade ? closeTrade() : handleTrade('buy')}
                            style={{
                                background: activeTrade && activeTrade.type === 'buy' ? "#1a1a1a" : BUY_COLOR,
                                border: activeTrade && activeTrade.type === 'buy' ? `1px solid ${BUY_COLOR}` : 'none',
                                borderRadius: '12px', padding: '16px', color: activeTrade && activeTrade.type === 'buy' ? BUY_COLOR : 'black',
                                fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: `0 4px 20px ${BUY_COLOR}20`, transition: 'all 0.2s'
                            }}
                        >
                            {activeTrade && activeTrade.type === 'buy' ? 'CLOSE POSITION' : <><TrendingUp size={20} /> BUY</>}
                        </button>
                        <button
                            onClick={() => activeTrade ? closeTrade() : handleTrade('sell')}
                            style={{
                                background: activeTrade && activeTrade.type === 'sell' ? "#1a1a1a" : SELL_COLOR,
                                border: activeTrade && activeTrade.type === 'sell' ? `1px solid ${SELL_COLOR}` : 'none',
                                borderRadius: '12px', padding: '16px', color: activeTrade && activeTrade.type === 'sell' ? SELL_COLOR : 'white',
                                fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: `0 4px 20px ${SELL_COLOR}20`, transition: 'all 0.2s'
                            }}
                        >
                            {activeTrade && activeTrade.type === 'sell' ? 'CLOSE POSITION' : <><TrendingDown size={20} /> SELL</>}
                        </button>
                    </div>
                </motion.div>
            </div>
            {/* Badges removed for cleaner UI */}
        </section>
    );
}
