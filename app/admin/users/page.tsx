"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  User,
  Search,
  Trash2,
  Eye,
  X,
  BookOpen,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { getUsers, updateUserRole, deleteUser, getAllEnrollments } from "@/lib/db";

export default function UserManagerPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    fetchUsers();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      const enrollments = await getAllEnrollments();

      const usersWithEnrollments = data.map((u) => ({
        ...u,
        enrolledCourses: enrollments.filter((e) => e.userId === u.id),
      }));

      setUsers(usersWithEnrollments);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (window.confirm(`Change role from ${currentRole} to ${newRole}?`)) {
      try {
        await updateUserRole(uid, newRole);
        fetchUsers();
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role.");
      }
    }
  };

  const handleDelete = async (uid: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await deleteUser(uid);
        fetchUsers();
        if (selectedUser?.id === uid) setSelectedUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            User Management
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Manage user access, roles, and profiles.
          </p>
        </div>
        <div
          style={{ position: "relative", width: isMobile ? "100%" : "300px" }}
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
            placeholder="Search users..."
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-subtle)" }}>
          <p>No users found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
          gap: "24px" 
        }}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="glass"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, background 0.2s",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.background = "rgba(10,10,10,0.6)";
              }}
            >
              {/* Role Badge */}
              <span style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                fontSize: "0.7rem",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: user.role === "admin" ? "rgba(203, 251, 69, 0.15)" : "rgba(255, 255, 255, 0.05)",
                color: user.role === "admin" ? "var(--primary-lime)" : "var(--text-muted)",
                border: user.role === "admin" ? "1px solid rgba(203, 251, 69, 0.3)" : "1px solid var(--border-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "600"
              }}>
                {user.role || "user"}
              </span>

              {/* Header Profile */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: user.role === "admin" ? "var(--primary-lime)" : "rgba(255,255,255,0.1)",
                  color: user.role === "admin" ? "black" : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  flexShrink: 0
                }}>
                  {user.firstName ? user.firstName[0].toUpperCase() : <User size={24} />}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Unnamed User"}
                  </h3>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* User Stats */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "4px" }}>Joined</div>
                  <div style={{ fontSize: "0.9rem" }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</div>
                </div>
                <div style={{ width: "1px", background: "var(--border-subtle)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "4px" }}>Enrollments</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--primary-lime)", fontWeight: "600" }}>{user.enrolledCourses?.length || 0} active</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: "flex", gap: "8px", marginTop: "auto", flexWrap: "wrap" }}>
                <a
                  href={`/admin/chats?userId=${user.id}`}
                  style={{
                    flex: "1 1 calc(50% - 4px)",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--primary-lime)",
                    background: "rgba(163, 230, 53, 0.05)",
                    color: "var(--primary-lime)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "0.85rem",
                    transition: "background 0.2s",
                    textDecoration: "none"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(163, 230, 53, 0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(163, 230, 53, 0.05)"}
                >
                  <MessageSquare size={16} /> Msg
                </a>
                <button
                  onClick={() => setSelectedUser(user)}
                  style={{
                    flex: "1 1 calc(50% - 4px)",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--text-main)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  <Eye size={16} /> Details
                </button>
                <button
                  onClick={() => handleRoleUpdate(user.id, user.role || "user")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(255,255,255,0.05)",
                    color: user.role === "admin" ? "var(--primary-lime)" : "var(--text-dim)",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  title={user.role === "admin" ? "Demote Admin" : "Promote to Admin"}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  {user.role === "admin" ? <ShieldAlert size={16} /> : <Shield size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 68, 68, 0.3)",
                    background: "rgba(255, 68, 68, 0.1)",
                    color: "#FF4444",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  title="Delete User"
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(5px)",
            zIndex: 2100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="glass"
            style={{
              width: "90%",
              maxWidth: "500px",
              padding: "32px",
              borderRadius: "24px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--primary-lime)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {selectedUser.firstName ? (
                  selectedUser.firstName[0].toUpperCase()
                ) : (
                  <User size={32} />
                )}
              </div>
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p style={{ color: "var(--text-dim)" }}>{selectedUser.email}</p>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                }}
              >
                <Phone size={18} color="var(--primary-lime)" />
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    Phone
                  </div>
                  <div>{selectedUser.phone || "Not provided"}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                }}
              >
                <MapPin size={18} color="var(--primary-lime)" />
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    Address
                  </div>
                  <div>{selectedUser.address || "Not provided"}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                }}
              >
                <Shield size={18} color="var(--primary-lime)" />
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    Role
                  </div>
                  <div style={{ textTransform: "capitalize" }}>
                    {selectedUser.role || "user"}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "8px" }}>
                <h4
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <BookOpen size={18} /> Enrolled Courses
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedUser.enrolledCourses &&
                  selectedUser.enrolledCourses.length > 0 ? (
                    selectedUser.enrolledCourses.map((c: any, i: number) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 10px",
                          background:
                            c.status === "approved"
                              ? "rgba(163, 230, 53, 0.15)"
                              : "rgba(234, 179, 8, 0.15)",
                          color:
                            c.status === "approved"
                              ? "var(--primary-lime)"
                              : "#eab308",
                          border:
                            c.status === "approved"
                              ? "1px solid rgba(163, 230, 53, 0.3)"
                              : "1px solid rgba(234, 179, 8, 0.3)",
                          borderRadius: "50px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {c.courseTitle} ({c.status})
                      </span>
                    ))
                  ) : (
                    <span
                      style={{ color: "var(--text-dim)", fontStyle: "italic" }}
                    >
                      No active enrollments
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
