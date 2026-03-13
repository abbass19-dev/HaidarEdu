"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { getCourses, addCourse, updateCourse, deleteCourse } from "@/lib/db";
import { uploadImage } from "@/lib/utils/cloudinary";

export default function CourseManagerPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    level: "Beginner",
    lessons: "",
    hours: "",
    desc: "",
    imageUrl: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    fetchCourses();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      title: course.title,
      price: course.price,
      level: course.level,
      lessons: course.lessons,
      hours: course.hours,
      desc: course.desc,
      imageUrl: course.imageUrl || "",
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        lessons: parseInt(formData.lessons),
        hours: parseFloat(formData.hours),
      };

      if (editingId) {
        await updateCourse(editingId, courseData);
      } else {
        await addCourse({
          ...courseData,
          students: 0,
        });
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        price: "",
        level: "Beginner",
        lessons: "",
        hours: "",
        desc: "",
        imageUrl: "",
      });
      fetchCourses();
    } catch (err) {
      setError("Failed to save course.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete course?")) {
      await deleteCourse(id);
      fetchCourses();
    }
  };

  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
        Error: {error}
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: "32px",
          gap: "24px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
            Course Management
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Create and manage your educational programs.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: "",
              price: "",
              level: "Beginner",
              lessons: "",
              hours: "",
              desc: "",
              imageUrl: "",
            });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            width: isMobile ? "100%" : "auto",
            justifyContent: "center",
          }}
        >
          <Plus size={18} /> {showForm ? "Cancel" : "Add Course"}
        </button>
      </div>

      {showForm && (
        <div
          className="glass"
          style={{
            padding: "24px",
            borderRadius: "var(--radius-lg)",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Edit Course" : "New Course"}
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="glass-input"
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                color: "white",
                outline: "none",
              }}
            />
            <input
              type="number"
              placeholder="Price (e.g. $199)"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="glass-input"
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                color: "white",
                outline: "none",
              }}
            />
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                color: "white",
                outline: "none",
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>
                Course Image
              </label>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setUploading(true);
                        const url = await uploadImage(file);
                        setFormData({ ...formData, imageUrl: url });
                      } catch (error) {
                        alert("Upload failed. Check console.");
                      } finally {
                        setUploading(false);
                      }
                    }
                  }}
                  className="glass-input"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "white",
                    outline: "none",
                  }}
                />
                {uploading && (
                  <span
                    style={{ color: "var(--primary-lime)", fontSize: "0.8rem" }}
                  >
                    Uploading...
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="number"
                placeholder="Lessons"
                required
                value={formData.lessons}
                onChange={(e) =>
                  setFormData({ ...formData, lessons: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "white",
                  outline: "none",
                }}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Hours"
                required
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>
            <textarea
              placeholder="Description"
              required
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              style={{
                gridColumn: "1/-1",
                width: "100%",
                padding: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                color: "white",
                outline: "none",
                minHeight: "80px",
              }}
            ></textarea>
            <button
              type="submit"
              className="btn-primary"
              style={{ gridColumn: "1/-1" }}
            >
              {editingId ? "Update Course" : "Save Course"}
            </button>
          </form>
        </div>
      )}

      <div
        className="glass"
        style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              minWidth: "700px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <th style={{ padding: "20px" }}>Course Title</th>
                <th style={{ padding: "20px" }}>Level</th>
                <th style={{ padding: "20px" }}>Price</th>
                <th style={{ padding: "20px" }}>Students</th>
                <th style={{ padding: "20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "20px" }}>
                    <div style={{ fontWeight: "600" }}>{course.title}</div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-dim)",
                        marginTop: "4px",
                      }}
                    >
                      {course.lessons || 0} Lessons â€¢ {course.hours || 0}{" "}
                      Hours
                    </div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <span
                      className="glass"
                      style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {course.level}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "20px",
                      fontWeight: "700",
                      color: "var(--primary-lime)",
                    }}
                  >
                    {course.price}
                  </td>
                  <td style={{ padding: "20px" }}>{course.students}</td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEdit(course)}
                        style={{
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                          background: "transparent",
                          color: "var(--text-main)",
                          cursor: "pointer",
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        style={{
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #FF4444",
                          background: "transparent",
                          color: "#FF4444",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Loading courses...
                  </td>
                </tr>
              )}
              {!loading && courses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No courses found. Add your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
