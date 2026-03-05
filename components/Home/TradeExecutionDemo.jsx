"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Maximize2,
  Settings as SettingsIcon,
  Info,
} from "lucide-react";

/* ================= CONFIG ================= */
const TICK_SPEED = 1200;
const MAX_CANDLES = 24;
const BINANCE_GREEN = "#00b06f";
const BINANCE_RED = "#f6465d";
const BG_DARK = "#0b0e11";
const BORDER_COLOR = "rgba(255,255,255,0.06)";
const TRANSITION = { type: "spring", stiffness: 400, damping: 28 };

// Enhanced fixed sequence with volume data
const FIXED_SEQUENCE = [
  { open: 64200, close: 64250, high: 64300, low: 64150, vol: 120 },
  { open: 64250, close: 64220, high: 64280, low: 64190, vol: 85 },
  { open: 64220, close: 64300, high: 64350, low: 64200, vol: 210 },
  { open: 64300, close: 64280, high: 64320, low: 64250, vol: 95 },
  { open: 64280, close: 64350, high: 64400, low: 64260, vol: 150 },
  { open: 64350, close: 64400, high: 64450, low: 64320, vol: 180 },
  { open: 64400, close: 64380, high: 64420, low: 64350, vol: 70 },
  { open: 64380, close: 64500, high: 64550, low: 64360, vol: 240 },
  { open: 64500, close: 64650, high: 64700, low: 64480, vol: 310 },
  { open: 64650, close: 64600, high: 64680, low: 64580, vol: 190 },
  { open: 64600, close: 64750, high: 64800, low: 64590, vol: 220 },
  { open: 64750, close: 64850, high: 64900, low: 64700, vol: 280 },
  { open: 64850, close: 64800, high: 64880, low: 64750, vol: 140 },
  { open: 64800, close: 64950, high: 65000, low: 64780, vol: 260 },
  { open: 64950, close: 65100, high: 65150, low: 64900, vol: 400 },
];

export default function TradeExecutionDemo() {
  const [candles, setCandles] = useState([]);
  const [tickIndex, setTickIndex] = useState(0);
  const [activeTrade, setActiveTrade] = useState(null);
  const [result, setResult] = useState(null);
  const chartRef = useRef(null);

  // 3D Tilt State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), {
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), {
    damping: 20,
  });

  // Crosshair State
  const [showCrosshair, setShowCrosshair] = useState(false);
  const chX = useMotionValue(0);
  const chY = useMotionValue(0);

  useEffect(() => {
    const initialCount = 12;
    const initialData = FIXED_SEQUENCE.slice(0, initialCount).map((d, i) => ({
      ...d,
      id: i,
    }));
    setCandles(initialData);
    setTickIndex(initialCount);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickIndex((prev) => {
        const nextIndex = (prev + 1) % FIXED_SEQUENCE.length;
        const nextData = FIXED_SEQUENCE[nextIndex];
        setCandles((current) => {
          const newCandle = { ...nextData, id: Date.now() };
          const updated = [...current, newCandle];
          return updated.length > MAX_CANDLES
            ? updated.slice(updated.length - MAX_CANDLES)
            : updated;
        });
        return nextIndex;
      });
    }, TICK_SPEED);
    return () => clearInterval(interval);
  }, []);

  /* ================= SCALING ================= */
  const values = candles.flatMap((c) => [c.high, c.low]);
  const minVal = Math.min(...values) || 0;
  const maxVal = Math.max(...values) || 100;
  const padding = (maxVal - minVal) * 0.15;
  const range = maxVal - minVal + padding * 2 || 1;
  const bottom = minVal - padding;
  const getY = (v) => 100 - ((v - bottom) / range) * 100;

  const maxVol = Math.max(...candles.map((c) => c.vol)) || 1;

  /* ================= DERIVED STATE ================= */
  const lastCandle = candles[candles.length - 1];
  const currentPrice = lastCandle ? lastCandle.close : 0;
  const isBullish = lastCandle ? lastCandle.close >= lastCandle.open : true;
  const currentPnl = activeTrade
    ? (activeTrade.type === "buy"
        ? currentPrice - activeTrade.entryPrice
        : activeTrade.entryPrice - currentPrice) * 12.5
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
    setTimeout(() => setResult(null), 2500);
  };

  const handleMouseMove = (event) => {
    const rect = chartRef.current.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    mouseX.set(localX - rect.width / 2);
    mouseY.set(localY - rect.height / 2);
    chX.set(localX);
    chY.set(localY);
    setShowCrosshair(true);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setShowCrosshair(false);
  };

  return (
    <section
      style={{ padding: "100px 0", position: "relative", overflow: "hidden" }}
    >
      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h3
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: "900",
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            Institutional-Grade{" "}
            <span style={{ color: BINANCE_GREEN }}>Execution</span>
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Experience the precision of high-frequency trading with our
            low-latency execution engine and Binance-inspired analytics
            terminal.
          </p>
        </div>

        <motion.div
          ref={chartRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            background: BG_DARK,
            borderRadius: "16px",
            padding: "0",
            height: "600px",
            border: `1px solid ${BORDER_COLOR}`,
            boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
          }}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Top Toolbar */}
          <div
            style={{
              height: "48px",
              borderBottom: `1px solid ${BORDER_COLOR}`,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.02)",
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    color: "white",
                    fontSize: "1rem",
                  }}
                >
                  BTC/USDT
                </span>
                <span
                  style={{
                    background: "#2b2f36",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    color: "#eaecef",
                  }}
                >
                  Perpetual
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ fontSize: "0.75rem" }}>
                  <div style={{ color: "rgba(255,255,255,0.4)" }}>
                    Last Price
                  </div>
                  <div
                    style={{
                      color: isBullish ? BINANCE_GREEN : BINANCE_RED,
                      fontWeight: "700",
                    }}
                  >
                    {currentPrice.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", className: "desktop-only" }}>
                  <div style={{ color: "rgba(255,255,255,0.4)" }}>
                    24h Change
                  </div>
                  <div style={{ color: BINANCE_GREEN, fontWeight: "700" }}>
                    +4.25%
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <SettingsIcon size={16} />
              <Maximize2 size={16} />
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", position: "relative" }}>
            {/* Main Interaction Area */}
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Grid Background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `linear-gradient(${BORDER_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${BORDER_COLOR} 1px, transparent 1px)`,
                  backgroundSize: "60px 60px",
                  pointerEvents: "none",
                }}
              />

              {/* Candle SVG */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  paddingRight: "70px",
                  paddingTop: "20px",
                }}
              >
                <svg width="100%" height="100%" style={{ overflow: "visible" }}>
                  {candles.map((c, i) => {
                    const isGreen = c.close >= c.open;
                    const color = isGreen ? BINANCE_GREEN : BINANCE_RED;
                    const xPos = (i / (MAX_CANDLES - 1)) * 100;
                    const candleWidth = 2.8;

                    return (
                      <motion.g key={c.id}>
                        {/* Wick */}
                        <motion.line
                          animate={{
                            y1: `${getY(c.high)}%`,
                            y2: `${getY(c.low)}%`,
                            x1: `${xPos}%`,
                            x2: `${xPos}%`,
                          }}
                          transition={TRANSITION}
                          stroke={color}
                          strokeWidth={1}
                        />
                        {/* Body */}
                        <motion.rect
                          animate={{
                            y: `${Math.min(getY(c.open), getY(c.close))}%`,
                            height: `${Math.max(0.5, Math.abs(getY(c.open) - getY(c.close)))}%`,
                            x: `${xPos - candleWidth / 2}%`,
                          }}
                          transition={TRANSITION}
                          width={`${candleWidth}%`}
                          fill={color}
                        />
                      </motion.g>
                    );
                  })}

                  {/* Active Positions & Last Price Lines */}
                  {activeTrade && (
                    <motion.g
                      animate={{ y: `${getY(activeTrade.entryPrice)}%` }}
                    >
                      <line
                        x1="0"
                        x2="100%"
                        stroke={
                          activeTrade.type === "buy"
                            ? BINANCE_GREEN
                            : BINANCE_RED
                        }
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <foreignObject x="4" y="-10" width="120" height="20">
                        <div
                          style={{
                            background:
                              activeTrade.type === "buy"
                                ? BINANCE_GREEN
                                : BINANCE_RED,
                            color: "white",
                            fontSize: "0.65rem",
                            padding: "1px 6px",
                            borderRadius: "2px",
                            fontWeight: "700",
                          }}
                        >
                          {activeTrade.type.toUpperCase()} @{" "}
                          {activeTrade.entryPrice}
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}

                  {/* Live Price Horizontal Line */}
                  <motion.g animate={{ y: `${getY(currentPrice)}%` }}>
                    <line
                      x1="0"
                      x2="100%"
                      stroke={isBullish ? BINANCE_GREEN : BINANCE_RED}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      r="3"
                      fill={isBullish ? BINANCE_GREEN : BINANCE_RED}
                    />
                  </motion.g>
                </svg>
              </div>

              {/* Volume sub-chart */}
              <div
                style={{
                  height: "80px",
                  position: "relative",
                  paddingRight: "70px",
                  borderTop: `1px solid ${BORDER_COLOR}`,
                }}
              >
                <svg width="100%" height="100%">
                  {candles.map((c, i) => {
                    const isGreen = c.close >= c.open;
                    const xPos = (i / (MAX_CANDLES - 1)) * 100;
                    const h = (c.vol / maxVol) * 100;
                    return (
                      <motion.rect
                        key={`vol-${c.id}`}
                        animate={{
                          x: `${xPos - 1.4}%`,
                          height: `${h}%`,
                          y: `${100 - h}%`,
                        }}
                        width="2.8%"
                        fill={isGreen ? BINANCE_GREEN : BINANCE_RED}
                        opacity="0.3"
                      />
                    );
                  })}
                </svg>
                <div
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "5px",
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.3)",
                    fontWeight: "600",
                  }}
                >
                  VOL BTC: {lastCandle?.vol}
                </div>
              </div>
            </div>

            {/* Y-Axis Price Panel */}
            <div
              style={{
                width: "70px",
                borderLeft: `1px solid ${BORDER_COLOR}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px 0",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
                fontWeight: "600",
                background: "rgba(0,0,0,0.2)",
                position: "relative",
              }}
            >
              <div>{Math.floor(maxVal)}</div>
              <div>{Math.floor(maxVal - range * 0.25)}</div>
              <div>{Math.floor((maxVal + minVal) / 2)}</div>
              <div>{Math.floor(minVal + range * 0.25)}</div>
              <div>{Math.floor(minVal)}</div>

              {/* Live Price Tag on Axis */}
              <motion.div
                animate={{ top: `calc(${getY(currentPrice)}% - 10px)` }}
                style={{
                  position: "absolute",
                  right: 0,
                  width: "100%",
                  background: isBullish ? BINANCE_GREEN : BINANCE_RED,
                  color: "white",
                  padding: "2px 4px",
                  fontSize: "0.65rem",
                  fontWeight: "800",
                  zIndex: 30,
                  textAlign: "center",
                }}
              >
                {currentPrice}
              </motion.div>
            </div>

            {/* Crosshair Overlay */}
            {showCrosshair && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 100,
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    top: chY,
                    left: 0,
                    right: 0,
                    borderTop: "1px dashed rgba(255,255,255,0.3)",
                  }}
                />
                <motion.div
                  style={{
                    position: "absolute",
                    left: chX,
                    top: 0,
                    bottom: 0,
                    borderLeft: "1px dashed rgba(255,255,255,0.3)",
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer Controls / Terminal Buttons */}
          <div
            style={{
              padding: "20px 32px",
              background: "rgba(255,255,255,0.02)",
              borderTop: `1px solid ${BORDER_COLOR}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "0.8rem" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Margin: </span>
                <span style={{ fontWeight: "700" }}>20x Cross</span>
              </div>
              {activeTrade && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    background: "rgba(255,255,255,0.03)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${currentPnl >= 0 ? BINANCE_GREEN : BINANCE_RED}40`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      color: currentPnl >= 0 ? BINANCE_GREEN : BINANCE_RED,
                    }}
                  >
                    ROE: {currentPnl >= 0 ? "+" : ""}
                    {((currentPnl / 100) * 10).toFixed(2)}%
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      color: "white",
                    }}
                  >
                    PnL: ${currentPnl.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() =>
                  activeTrade ? closeTrade() : handleTrade("buy")
                }
                style={{
                  background:
                    activeTrade && activeTrade.type === "buy"
                      ? BINANCE_RED
                      : BINANCE_GREEN,
                  border: "none",
                  borderRadius: "6px",
                  height: "40px",
                  padding: "0 24px",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow:
                    activeTrade && activeTrade.type === "buy"
                      ? "none"
                      : `0 4px 12px ${BINANCE_GREEN}40`,
                }}
              >
                {activeTrade && activeTrade.type === "buy"
                  ? "CLOSE BUY"
                  : "BUY / LONG"}
              </button>
              <button
                onClick={() =>
                  activeTrade ? closeTrade() : handleTrade("sell")
                }
                style={{
                  background:
                    activeTrade && activeTrade.type === "sell"
                      ? BINANCE_RED
                      : "transparent",
                  border:
                    activeTrade && activeTrade.type === "sell"
                      ? "none"
                      : `1px solid ${BINANCE_RED}`,
                  borderRadius: "6px",
                  height: "40px",
                  padding: "0 24px",
                  color: BINANCE_RED,
                  fontWeight: "800",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  color:
                    activeTrade && activeTrade.type === "sell"
                      ? "white"
                      : BINANCE_RED,
                }}
              >
                {activeTrade && activeTrade.type === "sell"
                  ? "CLOSE SELL"
                  : "SELL / SHORT"}
              </button>
            </div>
          </div>

          {/* Result Overlay */}
          <AnimatePresence>
            {result !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "30px 60px",
                  borderRadius: "24px",
                  background: "rgba(11, 14, 17, 0.9)",
                  border: `2px solid ${result >= 0 ? BINANCE_GREEN : BINANCE_RED}`,
                  backdropFilter: "blur(10px)",
                  zIndex: 1000,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "900",
                    color: result >= 0 ? BINANCE_GREEN : BINANCE_RED,
                  }}
                >
                  {result >= 0 ? "+" : ""}$
                  {Math.abs(Math.floor(result)).toLocaleString()}
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: "600",
                    opacity: 0.6,
                  }}
                >
                  REALIZED PROFIT
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    color: result >= 0 ? BINANCE_GREEN : BINANCE_RED,
                    fontSize: "0.8rem",
                    fontWeight: "700",
                  }}
                >
                  TRADE EXECUTED SUCCESSFULLY
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Visual Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "30px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Info size={14} />
            <span>Interactive Terminal: Hover to explore wicks and depth.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: BINANCE_GREEN,
              }}
            />
            <span>Institutional Accumulation</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: BINANCE_RED,
              }}
            />
            <span>Market Distribution</span>
          </div>
        </div>
      </div>
    </section>
  );
}
