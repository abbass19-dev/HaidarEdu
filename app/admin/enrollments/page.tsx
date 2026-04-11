"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Trash2, Clock } from "lucide-react";
import { getAllEnrollments, updateEnrollmentStatus, deleteEnrollment } from "@/lib/db";

export default function EnrollmentsManagementPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    fetchEnrollments();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getAllEnrollments();
      setEnrollments(data);
    } catch (error: any) {
      console.error("Error fetching enrollments:", error);
      setErrorMsg(error.message || "Unknown Firestore Error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enrollmentId: string, status: "approved" | "rejected" | "pending") => {
    try {
      await updateEnrollmentStatus(enrollmentId, status);
      fetchEnrollments();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (enrollmentId: string) => {
    if (window.confirm("Are you sure you want to completely remove this enrollment? This action cannot be undone.")) {
      try {
        await deleteEnrollment(enrollmentId);
        fetchEnrollments();
      } catch (error) {
        console.error("Error deleting enrollment:", error);
        alert("Failed to delete enrollment.");
      }
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ position: "relative" }}>
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
            Enrollment Requests
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Approve or reject student course enrollments.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", width: isMobile ? "100%" : "auto", flexDirection: isMobile ? "column" : "row" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "50px",
              color: "white",
              outline: "none",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div
            style={{
              position: "relative",
              width: isMobile ? "100%" : "250px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-dim)",
              }}
            />
            <input
              type="text"
              placeholder="Search via email/course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "50px",
                color: "white",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

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
              minWidth: "800px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <th style={{ padding: "20px" }}>Course</th>
                <th style={{ padding: "20px" }}>User</th>
                <th style={{ padding: "20px" }}>Status</th>
                <th style={{ padding: "20px" }}>Date</th>
                <th style={{ padding: "20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "20px" }}>
                    <div style={{ fontWeight: "600" }}>{enrollment.courseTitle}</div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <div style={{ fontWeight: "600" }}>{enrollment.userName || "User"}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                      {enrollment.userEmail}
                    </div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        background:
                          enrollment.status === "approved"
                            ? "rgba(163, 230, 53, 0.15)"
                            : enrollment.status === "pending"
                            ? "rgba(234, 179, 8, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          enrollment.status === "approved"
                            ? "var(--primary-lime)"
                            : enrollment.status === "pending"
                            ? "#eab308"
                            : "#ef4444",
                      }}
                    >
                      {enrollment.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "20px",
                      color: "var(--text-dim)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {enrollment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(enrollment.id, "approved")}
                            style={{
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid var(--primary-lime)",
                              background: "transparent",
                              color: "var(--primary-lime)",
                              cursor: "pointer",
                            }}
                            title="Approve Enrollment"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(enrollment.id, "rejected")}
                            style={{
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #eab308",
                              background: "transparent",
                              color: "#eab308",
                              cursor: "pointer",
                            }}
                            title="Reject Enrollment"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      
                      {enrollment.status === "approved" && (
                        <button
                          onClick={() => handleStatusUpdate(enrollment.id, "pending")}
                          style={{
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #eab308",
                            background: "transparent",
                            color: "#eab308",
                            cursor: "pointer",
                          }}
                          title="Revoke access (mark Pending)"
                        >
                          <Clock size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        style={{
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #FF4444",
                          background: "transparent",
                          color: "#FF4444",
                          cursor: "pointer",
                        }}
                        title="Delete Enrollment Entirely"
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
                    Loading enrollments...
                  </td>
                </tr>
              )}
              {errorMsg && (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 20px", color: "#FF4444", textAlign: "center", background: "rgba(255, 68, 68, 0.05)" }}>
                    <h3 style={{ marginBottom: "8px" }}>Firestore Data Access Error</h3>
                    <p style={{ wordBreak: "break-word", maxWidth: "800px", margin: "0 auto" }}>{errorMsg}</p>
                    <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", maxWidth: "800px", margin: "16px auto 0 auto", textAlign: "left" }}>
                      <p style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                        <strong>How to fix:</strong> You likely need to update your Firestore Security Rules to allow admins access to the new <code style={{ color: "var(--primary-lime)", padding: "2px 4px", background: "rgba(0,0,0,0.5)", borderRadius: "4px" }}>"enrollments"</code> collection. Ensure your rules permit read/write for this collection.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !errorMsg && filteredEnrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "var(--text-muted)",
                    }}
                  >
                    No enrollments found.
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
