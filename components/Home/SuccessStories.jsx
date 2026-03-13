"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Success3D from "./3d/Success3D";
import styles from "@/app/home.module.css";

const testimonials = [
    { name: "Sarah K.", role: "Professional Trader", text: "HaidarEdu's evaluation process is the most transparent I've encountered. The education provided gave me the edge I needed.", rating: 5 },
    { name: "Michael T.", role: "Market Analyst", text: "The capital access changed my life. Scaling from a small personal account to $200k was seamless.", rating: 5, },
    { name: "James L.", role: "Day Trader", text: "Finally, a platform that understands what traders actually need. The tools and community are top-notch.", rating: 5 },
    { name: "Elena R.", role: "Swing Trader", text: "The AI assistant is like having a pro mentor available 24/7. My risk management has improved drastically.", rating: 5 },
    { name: "David W.", role: "Elite Trader", text: "Outstanding support and fast payouts. HaidarEdu is the gold standard for funded accounts.", rating: 5, },
    { name: "Aria M.", role: "Junior Trader", text: "I started as a student and now it's my full-time job. The step-by-step guidance is incredible.", rating: 5 },
];

const TestimonialCard = ({ item }) => (
  <div
    className={`glass ${item.special ? "gradient-border-card" : ""}`}
    style={{
      padding: "32px",
      borderRadius: "var(--radius-lg)",
      minHeight: "240px" /* Increased for better content handling */,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div className="testimonial-card-content">
      <div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
          {[...Array(item.rating)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill="var(--primary-lime)"
              color="var(--primary-lime)"
            />
          ))}
        </div>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "var(--text-main)",
            marginBottom: "24px",
          }}
        >
          "{item.text}"
        </p>
      </div>

      <div
        className="testimonial-meta"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "auto",
        }}
      >
        <div className="testimonial-avatar">
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
            {item.name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {item.role}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SuccessStories = () => {
  // Triple the items for a truly seamless loop over long distances
  const tripled = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section style={{ padding: "100px 0", overflow: "hidden" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                marginBottom: "16px",
              }}
            >
              Success Stories from <br />
              <span style={{ color: "var(--primary-lime)" }}>Our Traders</span>
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.1rem",
                maxWidth: "500px",
              }}
            >
              Join thousands of traders who achieved financial freedom with
              HaidarEdu.
            </p>
          </div>

          <div
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Success3D />
          </div>
        </div>

        <div className={styles.marqueeContainer}>
          {/* Column 1: Upwards */}
          <div
            className={`${styles.marqueeColumn} ${styles.up} ${styles.slow}`}
          >
            {tripled.map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>

          {/* Column 2: Downwards */}
          <div
            className={`${styles.marqueeColumn} ${styles.down} ${styles.fast}`}
          >
            {tripled
              .slice()
              .reverse()
              .map((item, i) => (
                <TestimonialCard key={i} item={item} />
              ))}
          </div>

          {/* Column 3: Upwards */}
          <div className={`${styles.marqueeColumn} ${styles.up}`}>
            {[...tripled].reverse().map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
