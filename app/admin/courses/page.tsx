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
              </div>
              {uploading && (
                <span
                  style={{ color: "var(--primary-lime)", fontSize: "0.8rem", marginTop: "4px" }}
                >
                  Uploading in progress... please wait.
                </span>
              )}
              {formData.imageUrl && !uploading && (
                <div style={{ marginTop: "8px", padding: "8px", background: "rgba(163, 230, 53, 0.1)", border: "1px solid var(--primary-lime)", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
                   <img src={formData.imageUrl} alt="preview" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                   <span style={{ color: "var(--primary-lime)", fontSize: "0.85rem" }}>Banner image uploaded and ready!</span>
                </div>
              )}
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-subtle)" }}>
          <p style={{ marginBottom: "16px" }}>No courses found.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} style={{ marginRight: '6px' }} /> Create Your First Course</button>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "24px" 
        }}>
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass"
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ 
                height: "160px", 
                width: "100%", 
                background: course.imageUrl ? `url(${course.imageUrl}) center/cover` : "#1a1a1a",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                }} />
                <span style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(4px)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {course.level}
                </span>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", lineHeight: "1.3" }}>{course.title}</h3>
                
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "0.85rem", color: "var(--text-dim)" }}>
                  <span>{course.lessons || 0} Lessons</span>
                  <span>{course.hours || 0} Hours</span>
                  <span>{course.students || 0} Students</span>
                </div>

                <div style={{ fontWeight: "700", color: "var(--primary-lime)", fontSize: "1.25rem", marginBottom: "24px" }}>
                  {course.price}
                </div>

                <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
                  <a
                    href={`/admin/courses/${course.id}/content`}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      padding: "10px"
                    }}
                  >
                    Manage Content
                  </a>
                  <button
                    onClick={() => handleEdit(course)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                      background: "rgba(255, 68, 68, 0.1)",
                      color: "#FF4444",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
