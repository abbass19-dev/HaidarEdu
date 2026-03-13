"use client";

import React from "react";
import { motion } from "framer-motion";
import Challenge3D from "./3d/Challenge3D";
import Analysis3D from "./3d/Analysis3D";
import FundedCard3D from "./3d/FundedCard3D";
import styles from "@/app/funding.module.css";

const Step = ({ component: Component, number, title, desc, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={styles.stepWrapper}
  >
    <div className={styles.animationContainer}>
      <Component />
    </div>

    <div className={styles.contentBox}>
      <div
        className={styles.stepNumber}
        style={{
          background: color,
          boxShadow: `0 0 20px ${color}66`,
        }}
      >
        {number}
      </div>

      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepDesc}>{desc}</p>
    </div>
  </motion.div>
);

const FundingProcess = () => {
  return (
    <section className={styles.fundingSection}>
      <div className={styles.bgDecoration} />

      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            Your Path to{" "}
            <span style={{ color: "var(--primary-lime)" }}>Funding</span>
          </h2>
          <p className={styles.subtitle}>
            Three simple steps to unlock your professional trading career.
          </p>
        </div>

        <div className={styles.grid}>
          <Step
            component={Challenge3D}
            number="1"
            title="The Challenge"
            desc="Prove your skills by hitting a profit target while managing risk effectively."
            color="#06b6d4"
          />

          <Step
            component={Analysis3D}
            number="2"
            title="Verification"
            desc="Validate your consistency and discipline in a simulated environment."
            color="#a855f7"
          />

          <Step
            component={FundedCard3D}
            number="3"
            title="Get Funded"
            desc="Receive your funded account and keep up to 90% of your profits."
            color="#FFD700"
          />
        </div>
      </div>
    </section>
  );
};

export default FundingProcess;
