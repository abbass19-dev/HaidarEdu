"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle } from "lucide-react";
import { getCourses } from "@/lib/db";
import { subscribeToAuthChanges } from "@/lib/auth";
import { optimizeImage } from "@/lib/utils/cloudinary";
import Navbar from "@/components/layout/Navbar";
import styles from "./courses.module.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<Record<string, string>>({});
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        // use getEnrolledCourses which was deleted, we use getUserEnrollments instead
        import("@/lib/db").then(async ({ getUserEnrollments }) => {
          const userEnrollments = await getUserEnrollments(u.uid);
          const enrollmentsMap: Record<string, string> = {};
          userEnrollments.forEach((e: any) => {
            enrollmentsMap[e.courseId] = e.status;
          });
          setEnrollments(enrollmentsMap);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (course: any) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const currentStatus = enrollments[course.id];
    
    if (currentStatus === "approved") {
      // Already approved — navigate to course content
      window.location.href = `/courses/${course.id}`;
      return;
    }

    if (currentStatus === "pending") {
      return; // Do nothing if already pending
    }

    try {
      setEnrollingId(course.id);
      const { requestEnrollment } = await import("@/lib/db");
      await requestEnrollment(user.uid, user.email || "", user.displayName || user.firstName || "User", course.id, course.title);
      
      setEnrollments((prev) => ({ ...prev, [course.id]: "pending" }));

      // Open Telegram with enrollment message
      const message = encodeURIComponent(
        `Hello Haidar, I have requested enrollment in the "${course.title}" course. My email is ${user.email}. Please approve my request.`,
      );
      window.open(`https://t.me/Ehaidar21?text=${message}`, "_blank");
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to request enrollment. Please try again.");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className={styles.title}>
              Trading <span className={styles.titleHighlight}>Programs</span>
            </h1>
            <p className={styles.subtitle}>
              Structured education designed to take you from beginner to
              professional.
            </p>
          </header>

          <div className={styles.grid}>
            {loading ? (
              <div className={styles.loading}>
                Loading professional courses...
              </div>
            ) : (
              courses.map((course) => {
                const status = enrollments[course.id];
                const isApproved = status === "approved";
                const isPending = status === "pending";
                
                return (
                  <div key={course.id} className={`glass ${styles.card}`}>
                    {course.imageUrl && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={optimizeImage(course.imageUrl)}
                          alt={course.title}
                          className={styles.image}
                        />
                      </div>
                    )}

                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <span className={styles.price}>{course.price}</span>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {isApproved && (
                            <span className={styles.enrolledBadge} style={{ background: "rgba(163, 230, 53, 0.15)", color: "var(--primary-lime)" }}>
                              <CheckCircle size={14} /> Enrolled
                            </span>
                          )}
                          {isPending && (
                            <span className={styles.enrolledBadge} style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>
                              Pending
                            </span>
                          )}
                          <span className={`glass ${styles.levelBadge}`}>
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className={styles.textWrapper}>
                        <h3 className={styles.cardTitle}>{course.title}</h3>
                        <p className={styles.cardDescription}>{course.desc}</p>
                      </div>
                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={enrollingId === course.id || isPending}
                        className={`btn-primary ${styles.enrollBtn} ${isApproved || isPending ? styles.enrolledBtn : ""}`}
                        style={isPending ? { opacity: 0.7, cursor: "not-allowed", border: "1px solid #eab308", color: "#eab308" } : {}}
                      >
                        {enrollingId === course.id
                          ? "Requesting..."
                          : isApproved
                            ? <>View Course <BookOpen size={18} /></>
                            : isPending 
                              ? "Pending Approval"
                              : <>Enroll Now <BookOpen size={18} /></>}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CoursesPage;
