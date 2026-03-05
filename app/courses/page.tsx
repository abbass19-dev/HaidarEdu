"use client";

import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getCourses } from "@/lib/db";
import { optimizeImage } from "@/lib/utils/cloudinary";
import Navbar from "@/components/layout/Navbar";
import styles from "./courses.module.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
              courses.map((course) => (
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
                      <span className={`glass ${styles.levelBadge}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className={styles.textWrapper}>
                      <h3 className={styles.cardTitle}>{course.title}</h3>
                      <p className={styles.cardDescription}>{course.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        const message = encodeURIComponent(
                          `Hello Haidar, I am interested in enrolling in the "${course.title}" course.`,
                        );
                        window.open(
                          `https://t.me/abbasshij?text=${message}`,
                          "_blank",
                        );
                      }}
                      className={`btn-primary ${styles.enrollBtn}`}
                    >
                      Enroll Now <BookOpen size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CoursesPage;
