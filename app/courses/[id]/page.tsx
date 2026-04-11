"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { subscribeToAuthChanges } from "@/lib/auth";
import { getUserEnrollmentStatus, getCourseContent } from "@/lib/db";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Play, FileText, Image, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import styles from "./courseDetail.module.css";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        const status = await getUserEnrollmentStatus(u.uid, courseId);
        const isApproved = status === "approved";
        setEnrolled(isApproved);
        if (isApproved) {
          const items = await getCourseContent(courseId);
          setContent(items);
        }
      }
      setChecking(false);
      setLoading(false);
    });

    // Fetch course title
    const fetchCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          setCourseTitle(courseDoc.data().title || "Course");
        }
      } catch (e) {
        console.error("Error:", e);
      }
    };
    fetchCourse();

    return () => unsubscribe();
  }, [courseId]);

  if (loading || checking) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>Loading course...</div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className={styles.accessDenied}>
          <Lock size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
          <h2>Please log in to view this course</h2>
          <a href="/login" className="btn-primary" style={{ marginTop: "16px" }}>
            Log In
          </a>
        </div>
      </>
    );
  }

  if (!enrolled) {
    return (
      <>
        <Navbar />
        <div className={styles.accessDenied}>
          <Lock size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
          <h2>You are not enrolled in this course</h2>
          <p style={{ color: "var(--text-muted)", margin: "12px 0" }}>
            Enroll first to access the course content.
          </p>
          <a href="/courses" className="btn-primary" style={{ marginTop: "16px" }}>
            Browse Courses
          </a>
        </div>
      </>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "video": return <Play size={20} />;
      case "pdf": return <FileText size={20} />;
      case "image": return <Image size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <a href="/courses" className={styles.backLink}>
            <ArrowLeft size={18} /> Back to Courses
          </a>

          <header className={styles.header}>
            <h1 className={styles.title}>{courseTitle}</h1>
            <p className={styles.subtitle}>
              {content.length} item{content.length !== 1 ? "s" : ""} available
            </p>
          </header>

          {content.length === 0 ? (
            <div className={styles.empty}>
              <FileText size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
              <p>No content has been added to this course yet.</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Check back later for updates.
              </p>
            </div>
          ) : (
            <div className={styles.contentGrid}>
              {content.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  className={`glass ${styles.contentCard}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <div className={styles.contentIcon} data-type={item.type}>
                    {getIcon(item.type)}
                  </div>
                  <div className={styles.contentInfo}>
                    <h3 className={styles.contentTitle}>{item.title}</h3>
                    <span className={styles.contentType}>{item.type}</span>
                  </div>

                  {item.type === "video" && (
                    <div className={styles.mediaWrapper}>
                      <video
                        controls
                        className={styles.videoPlayer}
                        preload="metadata"
                      >
                        <source src={item.url} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {item.type === "image" && (
                    <div className={styles.mediaWrapper}>
                      <img
                        src={item.url}
                        alt={item.title}
                        className={styles.contentImage}
                      />
                    </div>
                  )}

                  {item.type === "pdf" && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-primary ${styles.downloadBtn}`}
                    >
                      <FileText size={16} /> Download PDF
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
