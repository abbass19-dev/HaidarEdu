"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import styles from "./programs.module.css";

const ProgramCard = ({
  title,
  price,
  features,
  delay,
  highlight,
  onSelect,
  buttonText,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={`glass ${styles.card} ${highlight ? styles.cardHighlight : ""}`}
  >
    {highlight && <div className={styles.popularBadge}>MOST POPULAR</div>}
    <h3 className={styles.cardTitle}>{title}</h3>
    <div
      className={`${styles.price} ${highlight ? styles.priceHighlight : ""}`}
    >
      {price}
    </div>

    <div className={styles.featureList}>
      {features.map((f: string, i: number) => (
        <div key={i} className={styles.feature}>
          <Check size={16} className={styles.featureIcon} /> {f}
        </div>
      ))}
    </div>

    <button
      className={highlight ? "btn-primary" : "btn-secondary"}
      style={{
        width: "100%",
        justifyContent: "center",
        marginTop: "auto",
        padding: "14px",
      }}
      onClick={onSelect}
    >
      {buttonText || "Select Plan"} <ArrowRight size={18} />
    </button>
  </motion.div>
);

const ProgramsPage = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Choose Your <span className={styles.titleHighlight}>Funding</span>{" "}
              Path
            </h1>
            <p className={styles.subtitle}>
              Start your professional journey today. Pass the evaluation and
              trade up to $200k of institutional capital.
            </p>
          </header>

          <div className={styles.grid}>
            <ProgramCard
              title="Free Community Group"
              price="Free"
              features={[
                "Daily Market Updates",
                "Community Chat Access",
                "Basic Trading Education",
                "Weekly Analysis",
                "Network with Traders",
              ]}
              delay={0.1}
              buttonText="Join Group"
              onSelect={() =>
                window.open("https://t.me/+eKf0Kl6m0N00ZGE0", "_blank")
              }
            />
            <ProgramCard
              title="Professional"
              price="$299"
              features={[
                "$50,000 Starting Capital",
                "85% Profit Split",
                "1-Step Evaluation",
                "Daily Profit Targets",
                "Professional Tools Included",
              ]}
              delay={0.2}
              highlight={true}
              buttonText="Contact Support"
              onSelect={() =>
                window.open(
                  "https://t.me/abbasshij?text=Hello%20Haidar%2C%20I%20am%20interested%20in%20joining%20the%20VIP%20Program.",
                  "_blank",
                )
              }
            />
            <ProgramCard
              title="Elite Mentorship"
              price="$99 / month"
              features={[
                "Live Trading Sessions",
                "Private VIP Group Access",
                "Weekly Strategy Breakdown",
                "Direct Q&A with Mentor",
                "Priority Support",
              ]}
              delay={0.3}
              buttonText="Join Elite"
              onSelect={() =>
                window.open(
                  "https://t.me/abbasshij?text=Hello%20Haidar%2C%20I%20am%20interested%20in%20joining%20the%20Elite%20Mentorship%20Program.",
                  "_blank",
                )
              }
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default ProgramsPage;
