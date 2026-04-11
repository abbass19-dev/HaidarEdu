"use client";

import React, { useState, useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getUserEnrollments } from "@/lib/db";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { optimizeImage } from "@/lib/utils/cloudinary";
import { BookOpen, PlayCircle, Clock, Calendar, ArrowRight, Lock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function MyLearningDashboard() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        try {
          const courses = await getUserEnrollments(u.uid);
          // Sort so newest are first
          courses.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          // Fetch the imageUrl for each course
          const enrichedCourses = await Promise.all(courses.map(async (course: any) => {
            try {
              const courseDoc = await getDoc(doc(db, "courses", course.courseId));
              if (courseDoc.exists() && courseDoc.data().imageUrl) {
                return { ...course, imageUrl: courseDoc.data().imageUrl };
              }
            } catch (e) {
              console.error("Failed to fetch image for", course.courseId);
            }
            return course;
          }));

          setEnrollments(enrichedCourses);
        } catch (err) {
          console.error("Failed to load enrollments", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading your learning dashboard...
        </div>
      </>
    );
  }

  const activeCourses = enrollments.filter(e => e.status === "approved");
  const pendingCourses = enrollments.filter(e => e.status === "pending" || e.status === "rejected");

  return (
    <>
      <Navbar />
      <AuthGuard>
        <main style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "60px" }}>
          <div className="container">
            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "8px" }}
              >
                My <span style={{ color: "var(--primary-lime)" }}>Learning</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}
              >
                Continue your journey. Master the markets.
              </motion.p>
            </div>

            {/* Dashboard Stats Overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass" 
                style={{ padding: "24px", borderRadius: "24px", display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: "rgba(163, 230, 53, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-lime)" }}>
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: 1, marginBottom: "4px" }}>{activeCourses.length}</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>Active Courses</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass" 
                style={{ padding: "24px", borderRadius: "24px", display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: "rgba(234, 179, 8, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#eab308" }}>
                  <Clock size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: 1, marginBottom: "4px" }}>{pendingCourses.length}</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>Pending Approvals</p>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "16px" }}>
              <button 
                onClick={() => setActiveTab("active")}
                style={{ 
                  padding: "8px 24px", 
                  borderRadius: "50px", 
                  fontWeight: "600", 
                  background: activeTab === "active" ? "var(--primary-lime)" : "transparent",
                  color: activeTab === "active" ? "black" : "var(--text-dim)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                Active Courses
              </button>
              <button 
                onClick={() => setActiveTab("pending")}
                style={{ 
                  padding: "8px 24px", 
                  borderRadius: "50px", 
                  fontWeight: "600", 
                  background: activeTab === "pending" ? "rgba(234, 179, 8, 0.2)" : "transparent",
                  color: activeTab === "pending" ? "#eab308" : "var(--text-dim)",
                  border: activeTab === "pending" ? "1px solid rgba(234, 179, 8, 0.5)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                Pending Requests {pendingCourses.length > 0 && <span style={{ marginLeft: "6px", background: "#eab308", color: "black", padding: "2px 8px", borderRadius: "20px", fontSize: "0.75rem" }}>{pendingCourses.length}</span>}
              </button>
            </div>

            {/* Course Grid */}
            <AnimatePresence mode="wait">
              {activeTab === "active" ? (
                <motion.div 
                  key="active"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}
                >
                  {activeCourses.length === 0 ? (
                    <div className="glass" style={{ gridColumn: "1 / -1", padding: "60px 20px", textAlign: "center", borderRadius: "24px" }}>
                      <BookOpen size={48} style={{ opacity: 0.2, margin: "0 auto 16px auto", display: "block" }} />
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>No active courses yet</h3>
                      <p style={{ color: "var(--text-dim)", marginBottom: "24px" }}>Enroll in a program to unlock your learning journey.</p>
                      <Link href="/courses">
                        <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: "50px" }}>Browse Courses</button>
                      </Link>
                    </div>
                  ) : (
                    activeCourses.map((course, idx) => (
                      <Link href={`/courses/${course.courseId}`} key={course.id} style={{ textDecoration: "none" }}>
                        <motion.div 
                          className="glass" 
                          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                          style={{ borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", border: "1px solid rgba(163, 230, 53, 0.2)" }}
                        >
                          <div style={{ 
                            height: "160px", 
                            background: course.imageUrl ? `url(${optimizeImage(course.imageUrl)}) center/cover` : "linear-gradient(135deg, rgba(163, 230, 53, 0.2), rgba(0, 240, 255, 0.1))", 
                            padding: "24px", 
                            position: "relative",
                            borderBottom: "1px solid rgba(255,255,255,0.05)"
                          }}>
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }}></div>
                            <div style={{ position: "absolute", top: "16px", right: "16px", background: "var(--primary-lime)", color: "black", padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", zIndex: 2 }}>
                              <CheckCircle size={14} /> Approved
                            </div>
                            <PlayCircle size={48} color="rgba(255,255,255,0.9)" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }} />
                          </div>
                          <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px", color: "white" }}>{course.courseTitle}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-dim)", fontSize: "0.85rem", marginTop: "auto", marginBottom: "20px" }}>
                              <Calendar size={14} /> Enrolled on {new Date(course.updatedAt).toLocaleDateString()}
                            </div>
                            <div style={{ 
                              display: "flex", alignItems: "center", justifyContent: "space-between", 
                              color: "black", background: "var(--primary-lime)", padding: "12px 20px", borderRadius: "12px", fontWeight: "600", fontSize: "0.9rem"
                            }}>
                              Go to Course <ArrowRight size={16} />
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="pending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}
                >
                  {pendingCourses.length === 0 ? (
                    <div className="glass" style={{ gridColumn: "1 / -1", padding: "60px 20px", textAlign: "center", borderRadius: "24px" }}>
                      <Clock size={48} style={{ opacity: 0.2, margin: "0 auto 16px auto", display: "block" }} />
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>No pending requests</h3>
                      <p style={{ color: "var(--text-dim)", marginBottom: "24px" }}>You do not have any courses awaiting approval.</p>
                      <Link href="/courses">
                        <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: "50px" }}>Browse Courses</button>
                      </Link>
                    </div>
                  ) : (
                    pendingCourses.map((course, idx) => (
                      <div key={course.id} className="glass" style={{ borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", height: "100%", border: "1px solid rgba(234, 179, 8, 0.2)", opacity: 0.8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Lock size={24} color="var(--text-dim)" />
                          </div>
                          <div style={{ background: course.status === "rejected" ? "rgba(239, 68, 68, 0.15)" : "rgba(234, 179, 8, 0.15)", color: course.status === "rejected" ? "#ef4444" : "#eab308", padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
                            {course.status}
                          </div>
                        </div>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px", color: "white" }}>{course.courseTitle}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-dim)", fontSize: "0.85rem", marginTop: "auto", marginBottom: "16px" }}>
                          <Calendar size={14} /> Requested on {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", fontSize: "0.85rem", color: "var(--text-dim)" }}>
                          {course.status === "rejected" 
                            ? "Your enrollment request was not approved at this time." 
                            : "Waiting for an administrator to approve your request. We will notify you once you have access."}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </AuthGuard>
    </>
  );
}
