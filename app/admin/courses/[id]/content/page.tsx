"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Video,
  FileText,
  Image,
  Upload,
} from "lucide-react";
import {
  getCourseContent,
  addCourseContent,
  deleteCourseContent,
} from "@/lib/db";
import { uploadImage, uploadVideo, uploadFile } from "@/lib/utils/cloudinary";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function CourseContentPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [courseTitle, setCourseTitle] = useState("");
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "video" as string,
    url: "",
    desc: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    fetchCourseInfo();
    fetchContent();
    return () => window.removeEventListener("resize", checkMobile);
  }, [courseId]);

  const fetchCourseInfo = async () => {
    try {
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (courseDoc.exists()) {
        setCourseTitle(courseDoc.data().title || "Course");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const items = await getCourseContent(courseId);
      setContentItems(items);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-detect type from file
    let detectedType = "image";
    if (file.type.startsWith("video/")) detectedType = "video";
    else if (file.type === "application/pdf") detectedType = "pdf";
    else if (file.type.startsWith("image/")) detectedType = "image";

    setFormData((prev) => ({ ...prev, type: detectedType }));
    setUploading(true);

    try {
      let url = "";
      if (detectedType === "video") {
        url = await uploadVideo(file);
      } else if (detectedType === "pdf") {
        url = await uploadFile(file);
      } else {
        url = await uploadImage(file);
      }
      setFormData((prev) => ({ ...prev, url, type: detectedType }));
    } catch (error) {
      alert("Upload failed. Check console.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) {
      alert("Please upload a file first.");
      return;
    }
    try {
      await addCourseContent(courseId, {
        title: formData.title,
        type: formData.type,
        url: formData.url,
        desc: formData.desc,
      });
      setShowForm(false);
      setFormData({ title: "", type: "video", url: "", desc: "" });
      try {
        await fetchContent();
      } catch (_) {
        // Index might not be ready yet, just reload
        window.location.reload();
      }
    } catch (e: any) {
      console.error("Save content error:", e);
      alert("Failed to save content: " + (e?.message || e));
    }
  };

  const handleDelete = async (contentId: string) => {
    if (window.confirm("Delete this content item?")) {
      await deleteCourseContent(courseId, contentId);
      fetchContent();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={16} />;
      case "pdf":
        return <FileText size={16} />;
      case "image":
        return <Image size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "#ef4444";
      case "pdf":
        return "#3b82f6";
      case "image":
        return "#a3e635";
      default:
        return "#888";
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <a
          href="/admin/courses"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.9rem",
            marginBottom: "16px",
          }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </a>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "16px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "4px" }}>
              Content — {courseTitle}
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Upload videos, PDFs, and images for enrolled students.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ title: "", type: "video", url: "", desc: "" });
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
            <Plus size={18} /> {showForm ? "Cancel" : "Add Content"}
          </button>
        </div>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div
          className="glass"
          style={{
            padding: "24px",
            borderRadius: "var(--radius-lg)",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>New Content Item</h3>
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
              placeholder="Content Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                color: "white",
                outline: "none",
                borderRadius: "8px",
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>
                Upload File (Video, PDF, or Image)
              </label>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="file"
                  accept="video/*,application/pdf,image/*"
                  onChange={handleFileUpload}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "white",
                    outline: "none",
                    borderRadius: "8px",
                  }}
                />
                
                {uploading && (
                  <span
                    style={{
                      color: "var(--primary-lime)",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Upload size={14} /> Uploading...
                  </span>
                )}
                <input
                  type="text"
                  placeholder="Description"
                  required
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "white",
                    outline: "none",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
            {formData.url && (
              <div
                style={{
                  gridColumn: "1/-1",
                  padding: "12px",
                  background: "rgba(163,230,53,0.1)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "var(--primary-lime)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {getIcon(formData.type)}
                File uploaded successfully — Type: {formData.type}
              </div>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={uploading || !formData.url}
              style={{ gridColumn: "1/-1" }}
            >
              Save Content
            </button>
          </form>
        </div>
      )}

      {/* Content List */}
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
              minWidth: "500px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <th style={{ padding: "20px" }}>Title</th>
                <th style={{ padding: "20px" }}>Type</th>
                <th style={{ padding: "20px" }}>Date</th>
                <th style={{ padding: "20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "20px" }}>
                    <div style={{ fontWeight: "600" }}>{item.title}</div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        background: `${getTypeColor(item.type)}22`,
                        color: getTypeColor(item.type),
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {getIcon(item.type)} {item.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "20px",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid var(--border-subtle)",
                          background: "transparent",
                          color: "var(--text-main)",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          textDecoration: "none",
                        }}
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => handleDelete(item.id)}
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
                    colSpan={4}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Loading content...
                  </td>
                </tr>
              )}
              {!loading && contentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "var(--text-muted)",
                    }}
                  >
                    No content yet. Click "Add Content" to upload your first
                    item.
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
