"use client";

import React, { useState, useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { User, Save, Edit2, BookOpen } from "lucide-react";
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
        </div>
      </AuthGuard>
    </>
  );
}
