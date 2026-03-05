"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import styles from "./admin.module.css";

const SidebarItem = ({ href, icon: Icon, label, onClick }: any) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : styles.sidebarLinkInactive}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className={styles.wrapper}>
        {/* Sidebar Overlay (Mobile Only) */}
        {isSidebarOpen && isMobile && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={styles.overlay}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
                    ${styles.sidebar} 
                    ${isMobile ? (isSidebarOpen ? styles.sidebarMobileActive : styles.sidebarMobileHidden) : ""}
                `}
        >
          <div className={styles.sidebarHeader}>
            <div>
              <span className={styles.brandName}>HAIDAR</span>
              <span className={styles.brandSub}>ADMIN</span>
            </div>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            )}
          </div>

          <nav className={styles.nav}>
            <SidebarItem
              href="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              href="/admin/courses"
              icon={BookOpen}
              label="Courses"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              href="/admin/articles"
              icon={FileText}
              label="Articles"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              href="/admin/chats"
              icon={MessageSquare}
              label="Live Chats"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              href="/admin/users"
              icon={Users}
              label="Users"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              href="/admin/settings"
              icon={Settings}
              label="Settings"
              onClick={() => setIsSidebarOpen(false)}
            />
          </nav>

          <div className={styles.footer}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={styles.main}
          style={{ marginLeft: isMobile ? "0" : "280px" }}
        >
          <header className={styles.contentHeader}>
            <div className={styles.headerLeft}>
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={`${styles.menuBtn} glass`}
                >
                  <Menu size={22} />
                </button>
              )}
              <h2 style={{ fontSize: "clamp(1.2rem, 4vw, 1.5rem)" }}>
                Overview
              </h2>
            </div>
          </header>

          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
