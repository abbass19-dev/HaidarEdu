"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Notebook,
} from "lucide-react";
import { getUsers, getCourses, getArticles, getChats } from "@/lib/db";
import styles from "./admin.module.css";

const StatCard = ({ title, stat, icon: Icon }: any) => (
  <div className={`glass ${styles.statCard}`}>
    <div className={styles.statHeader}>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statIcon}>
        <Icon size={20} />
      </div>
    </div>
    <div className={styles.statValue}>{stat.value}</div>
    <div
      className={`
            ${styles.statTrend} 
            ${stat.trend === "up" ? styles.trendUp : stat.trend === "down" ? styles.trendDown : styles.trendNeutral}
        `}
    >
      {stat.trend === "up" && <TrendingUp size={14} />}
      {stat.trend === "down" && <TrendingDown size={14} />}
      {stat.trend === "neutral" && <Minus size={14} />}
      {stat.change} <span className={styles.trendSub}>vs last month</span>
    </div>
  </div>
);

const calculateGrowth = (data: any[]) => {
  if (!data || data.length === 0)
    return { value: 0, change: "0%", trend: "neutral" };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const previousTotal = data.filter((item) => {
    if (!item.createdAt) return false;
    return new Date(item.createdAt) < startOfMonth;
  }).length;

  const currentTotal = data.length;
  const netNew = currentTotal - previousTotal;

  if (previousTotal === 0) {
    return {
      value: currentTotal,
      change: netNew > 0 ? "+100%" : "0%",
      trend: netNew > 0 ? "up" : "neutral",
    };
  }

  const percentChange = ((netNew / previousTotal) * 100).toFixed(1);
  const isPositive = netNew >= 0;

  return {
    value: currentTotal,
    change: `${isPositive ? "+" : ""}${percentChange}%`,
    trend:
      parseFloat(percentChange) === 0 ? "neutral" : isPositive ? "up" : "down",
  };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: { value: 0, change: "0%", trend: "neutral" },
    courses: { value: 0, change: "0%", trend: "neutral" },
    articles: { value: 0, change: "0%", trend: "neutral" },
    chats: { value: 0, change: "0%", trend: "neutral" },
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const fetchData = async () => {
      try {
        const [usersData, coursesData, articlesData, chatsData] =
          await Promise.all([
            getUsers(),
            getCourses(),
            getArticles(),
            getChats(),
          ]);

        setStats({
          users: calculateGrowth(usersData),
          courses: calculateGrowth(coursesData),
          articles: calculateGrowth(articlesData),
          chats: {
            value: chatsData?.length || 0,
            change: "0%",
            trend: "neutral",
          },
        });

        const recentUsers = (usersData as any)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime(),
          )
          .slice(0, 5)
          .map((u: any) => ({
            id: u.id,
            user: u.email ? u.email.split("@")[0] : "Unknown User",
            action: "just signed up",
            time: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "Recently",
            icon: Users,
          }));

        setRecentActivity(recentUsers);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div>
      <div className={styles.statsGrid}>
        <StatCard title="Total Users" stat={stats.users} icon={Users} />
        <StatCard title="Active Courses" stat={stats.courses} icon={BookOpen} />
        <StatCard
          title="Articles Published"
          stat={stats.articles}
          icon={FileText}
        />
        <StatCard title="Open Chats" stat={stats.chats} icon={MessageSquare} />
      </div>

      <div
        className={styles.dashboardGrid}
        style={{ gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr" }}
      >
        <div className={`glass ${styles.activityCard}`}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          {loading ? (
            <div className={styles.loadingText}>Loading activity...</div>
          ) : (
            recentActivity.map((activity, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIconBox}>
                  <activity.icon size={18} />
                </div>
                <div className={styles.activityInfo}>
                  <div className={styles.activityAction}>
                    <span className={styles.activityUser}>{activity.user}</span>{" "}
                    {activity.action}
                  </div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))
          )}
          {!loading && recentActivity.length === 0 && (
            <div className={styles.loadingText}>No recent activity.</div>
          )}
        </div>

        <div className={`glass ${styles.quickStatsCard}`}>
          <h3 className={styles.cardTitle}>Quick Stats</h3>
          <div className={styles.nav}>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatLabel}>
                <span>Storage Usage</span>
                <span>75%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "75%", background: "var(--primary-lime)" }}
                ></div>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatLabel}>
                <span>Server Health</span>
                <span>99.9%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "99.9%", background: "#4ade80" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
