"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity, Lock } from "lucide-react";
import styles from "@/app/signals.module.css";

const SignalCard = ({ pair, type, price, time, strength, index }) => {
  const isBuy = type === "BUY" || type === "STRONG BUY";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100px",
          height: "100px",
          background: isBuy
            ? "rgba(0, 255, 148, 0.05)"
            : "rgba(255, 59, 48, 0.05)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: isBuy
                ? "rgba(0, 255, 148, 0.1)"
                : "rgba(255, 59, 48, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isBuy ? "#00FF94" : "#FF3B30",
            }}
          >
            {isBuy ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          </div>
          <div>
            <h4
              style={{ fontSize: "1.1rem", fontWeight: "700", color: "white" }}
            >
              {pair}
            </h4>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              M{time} • {type}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: isBuy ? "#00FF94" : "#FF3B30",
              textShadow: isBuy
                ? "0 0 10px rgba(0,255,148,0.3)"
                : "0 0 10px rgba(255,59,48,0.3)",
            }}
          >
            {price}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "4px",
            }}
          >
            <Activity size={12} /> {strength}%
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "4px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "2px",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${strength}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            height: "100%",
            background: isBuy ? "#00FF94" : "#FF3B30",
            boxShadow: isBuy ? "0 0 10px #00FF94" : "0 0 10px #FF3B30",
          }}
        />
      </div>
    </motion.div>
  );
};

const LockedSignal = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="glass"
    style={{
      padding: "24px",
      borderRadius: "16px",
      background: "rgba(255, 255, 255, 0.01)",
      border: "1px solid rgba(255, 255, 255, 0.03)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "12px",
      minHeight: "100px",
      position: "relative",
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
      }}
    >
      <Lock size={18} />
    </div>
    <span
      style={{
        fontSize: "0.9rem",
        color: "var(--text-muted)",
        fontWeight: "500",
      }}
    >
      Premium Signal
    </span>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
        backgroundSize: "200% 200%",
        animation: "shimmer 3s infinite linear",
      }}
    />
    <style>{`
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `}</style>
  </motion.div>
);

const TradingSignals = () => {
  const [signals, setSignals] = useState([
    {
      pair: "EUR/USD",
      type: "STRONG BUY",
      price: "1.09",
      time: "5",
      strength: 92,
    },
    {
      pair: "BTC/USD",
      type: "SELL",
      price: "64,23",
      time: "15",
      strength: 38,
    },
    {
      pair: "XAU/USD",
      type: "BUY",
      price: "2341.50",
      time: "1",
      strength: 85,
    },
    {
      pair: "GBP/JPY",
      type: "STRONG BUY",
      price: "191.20",
      time: "5",
      strength: 59,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => ({
          ...s,
          strength: parseFloat(
            Math.min(
              99,
              Math.max(50, s.strength + (Math.random() - 0.5) * 5),
            ).toFixed(2),
          ),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.signalsSection}>
      <div className={`container ${styles.signalsContainer}`}>
        <div className={styles.textSide}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.badge}>
              <Activity size={14} /> LIVE SIGNALS
            </div>
            <h2 className={`${styles.title} glow-text`}>
              Spot Profitable <br />
              <span style={{ color: "var(--primary-lime)" }}>
                Trends Instantly
              </span>
            </h2>
            <p className={styles.subtitle}>
              Don't guess the market. Follow institutional-grade signals powered
              by real-time technical analysis. Get entry points, stop-loss
              levels, and confidence scores instantly.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>89%</span>
                <span className={styles.statLabel}>Accuracy Rate</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>24/7</span>
                <span className={styles.statLabel}>Market Coverage</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={styles.signalsSide}>
          <div className={styles.glowBg} />

          <div className={styles.signalsList}>
            {signals.map((signal, idx) => (
              <SignalCard key={idx} index={idx} {...signal} />
            ))}
            <div className={styles.lockedGrid}>
              <LockedSignal index={4} />
              <LockedSignal index={5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingSignals;
