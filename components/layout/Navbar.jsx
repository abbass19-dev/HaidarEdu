"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  User,
  ChevronDown,
  BookOpen,
  MessageSquare,
  Home,
  Notebook,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { subscribeToAuthChanges, logout } from "@/lib/auth";
import { getUserRole, getSystemSettings } from "@/lib/db";

const MotionLink = motion.create(Link);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const unsubscribe = subscribeToAuthChanges(async (u) => {
      setUser(u);
      if (u) {
        const r = await getUserRole(u.uid);
        setRole(r);
      } else {
        setRole(null);
      }
    });

    getSystemSettings().then((settings) => {
      if (settings?.logoUrl) setLogoUrl(settings.logoUrl);
    });

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Programs", path: "/programs", icon: "Box" },
    { name: "Courses", path: "/courses", icon: "Book" },
    { name: "Analysis", path: "/articles", icon: "BarChart" },
    { name: "Support", path: "/live-chat", icon: "MessageCircle" },
  ];

  const mobileBottomLinks = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Programs", path: "/programs", icon: <Notebook size={20} /> },
    { name: "Courses", path: "/courses", icon: <BookOpen size={20} /> },
    { name: "Support", path: "/live-chat", icon: <MessageSquare size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  const showBackground = scrolled;
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingTop: scrolled
            ? "calc(12px + env(safe-area-inset-top))"
            : "calc(20px + env(safe-area-inset-top))",
          paddingBottom: scrolled ? "12px" : "20px",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background: scrolled ? "rgba(5, 5, 5, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.05)"
            : "none",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              fontWeight: "800",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              style={{
                width: "36px",
                height: "36px",
                background:
                  "linear-gradient(135deg, var(--primary-lime), #00F0FF)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                boxShadow: "0 4px 15px rgba(203, 251, 69, 0.3)",
              }}
            >
              H
            </motion.div>
            {!isAdmin && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  HAIDAR
                </span>
                <span
                  style={{
                    color: "var(--primary-lime)",
                    fontSize: "0.7rem",
                    fontWeight: "400",
                    letterSpacing: "0.3em",
                  }}
                >
                  EDUCATION
                </span>
              </div>
            )}
          </Link>

          <div
            className="desktop-only"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "6px",
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  style={{
                    position: "relative",
                    color: isActive ? "#000" : "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    padding: "10px 22px",
                    borderRadius: "50px",
                    transition: "all 0.3s ease",
                    zIndex: 1,
                  }}
                >
                  <span style={{ position: "relative", zIndex: 2 }}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.6,
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--primary-lime)",
                        borderRadius: "50px",
                        zIndex: 1,
                        boxShadow: "0 0 15px rgba(203, 251, 69, 0.4)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user ? (
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-subtle)",
                    padding: "6px 14px 6px 6px",
                    borderRadius: "50px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--primary-lime), #82A914)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "black",
                      fontWeight: "800",
                      fontSize: "0.85rem",
                    }}
                  >
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <span
                    className="desktop-only"
                    style={{
                      color: "white",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    Account
                  </span>
                  <ChevronDown
                    size={14}
                    color="white"
                    style={{
                      transform: isProfileOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "0.3s",
                    }}
                  />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      style={{
                        position: "absolute",
                        top: "130%",
                        right: 0,
                        width: "280px",
                        background: "#0F0F0F",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "24px",
                        padding: "12px",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
                        zIndex: 1001,
                      }}
                    >
                      <div
                        style={{
                          padding: "16px",
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.03)",
                          marginBottom: "12px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-dim)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "4px",
                          }}
                        >
                          Welcome back
                        </p>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            color: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.email}
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            style={{ textDecoration: "none" }}
                          >
                            <div className="dropdown-item-special">
                              <LayoutDashboard size={18} /> Admin Dashboard
                            </div>
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="dropdown-item-special">
                            <User size={18} /> Profile Overview
                          </div>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="dropdown-item-special">
                            <Settings size={18} /> Enrollments
                          </div>
                        </Link>
                        <div
                          onClick={handleLogout}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "14px 16px",
                            borderRadius: "16px",
                            color: "#FF4D4D",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            marginTop: "4px",
                          }}
                        >
                          <LogOut size={18} /> Sign Out
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="desktop-only text-decoration-none">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  style={{
                    padding: "8px 24px",
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                  }}
                >
                  Join Now
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: "calc(24px + env(safe-area-inset-bottom))",
          left: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(15, 15, 15, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "8px",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            width: "100%",
            maxWidth: "440px",
            justifyContent: "space-around",
            pointerEvents: "auto",
          }}
        >
          {mobileBottomLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  color: isActive
                    ? "var(--primary-lime)"
                    : "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "16px",
                  transition: "0.3s",
                }}
              >
                {link.icon}
                <span style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
                .dropdown-item-special {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 16px;
                    color: rgba(255,255,255,0.8);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .dropdown-item-special:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--primary-lime);
                    transform: translateX(6px);
                }
                .mobile-only { display: none !important; }
                .desktop-only { display: flex !important; }
                @media (max-width: 992px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: flex !important; }
                }
            `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#050505",
              zIndex: 2000,
              padding: "100px 32px",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "32px",
                right: "32px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                color: "white",
              }}
            >
              <X size={24} />
            </button>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "white",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {link.name} <ChevronRight color="var(--primary-lime)" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
