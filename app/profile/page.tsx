"use client";

import React, { useState, useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getUserEnrollments } from "@/lib/db";
import { User, Save, Edit2, BookOpen, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import styles from "./profile.module.css";

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        await fetchProfile(u.uid);
        const courses = await getUserEnrollments(u.uid);
        setEnrolledCourses(courses);
      } else {
        setLoading(false);
      }
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      unsubscribe();
    };
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
      });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  if (!user) {
    return (
      <div
        className="container"
        style={{ paddingTop: "120px", textAlign: "center" }}
      >
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <AuthGuard>
        <div
          className="container"
          style={{ paddingTop: "120px", paddingBottom: "60px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass ${styles.container}`}
          >
            <div
              className={`${styles.header} ${isMobile ? styles.headerMobile : ""}`}
            >
              <div
                className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ""}`}
              >
                <div
                  className={`${styles.avatar} ${isMobile ? styles.avatarSmall : styles.avatarLarge}`}
                >
                  {profileData.firstName ? (
                    profileData.firstName[0].toUpperCase()
                  ) : (
                    <User size={isMobile ? 30 : 40} />
                  )}
                </div>
                <div
                  className={`${styles.nameContainer} ${isMobile ? styles.nameContainerMobile : ""}`}
                >
                  <h1 className={styles.name}>
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className={styles.email}>{profileData.email}</p>
                </div>
              </div>
              <button
                onClick={() => (editing ? handleSave() : setEditing(true))}
                className={`btn-primary ${styles.editBtn}`}
                disabled={saving}
              >
                {editing ? <Save size={18} /> : <Edit2 size={18} />}
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Edit Profile"}
              </button>
            </div>

            <div
              className={`${styles.grid} ${isMobile ? styles.gridMobile : ""}`}
            >
              <div className={styles.field}>
                <label className={styles.label}>First Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                ) : (
                  <div className={styles.value}>
                    {profileData.firstName || "-"}
                  </div>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                ) : (
                  <div className={styles.value}>
                    {profileData.lastName || "-"}
                  </div>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className={styles.input}
                  />
                ) : (
                  <div className={styles.value}>{profileData.phone || "-"}</div>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Address</label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                ) : (
                  <div className={styles.value}>
                    {profileData.address || "-"}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enrolled Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`glass ${styles.coursesSection}`}
          >
            <div className={styles.coursesHeader}>
              <h2 className={styles.coursesTitle}>
                <BookOpen size={24} /> My Courses
              </h2>
              <span className={styles.courseCount}>
                {enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""}
              </span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className={styles.noCourses}>
                <BookOpen size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
                <p>You haven&apos;t enrolled in any courses yet.</p>
                <a href="/courses" className={`btn-primary ${styles.browseCourses}`}>
                  Browse Courses
                </a>
              </div>
            ) : (
              <div className={styles.coursesList}>
                {enrolledCourses.map((course: any, index: number) => {
                  const isApproved = course.status === "approved";
                  const Component = isApproved ? motion.a : motion.div;
                  return (
                  <Component
                    key={index}
                    href={isApproved ? `/courses/${course.courseId}` : undefined}
                    className={styles.courseCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    style={!isApproved ? { cursor: "default", opacity: 0.8 } : {}}
                  >
                    <div className={styles.courseInfo}>
                      <h3 className={styles.courseCardTitle}>{course.courseTitle}</h3>
                      <div className={styles.courseDate}>
                        <Calendar size={14} />
                        {course.status === "approved" ? "Enrolled" : "Requested"} {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {isApproved ? (
                      <span className={styles.viewCourse}>View →</span>
                    ) : (
                      <span style={{ 
                        fontSize: "0.8rem", 
                        padding: "4px 8px", 
                        borderRadius: "12px", 
                        background: course.status === "pending" ? "rgba(234, 179, 8, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: course.status === "pending" ? "#eab308" : "#ef4444"
                      }}>
                        {course.status}
                      </span>
                    )}
                  </Component>
                )})}
              </div>
            )}
          </motion.div>
        </div>
      </AuthGuard>
    </>
  );
}
