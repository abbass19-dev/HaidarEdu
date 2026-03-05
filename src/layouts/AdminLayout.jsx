import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Bell,
    Bot,
    Menu,
    X
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        end
        onClick={onClick}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            color: isActive ? '#000' : 'var(--text-muted)',
            background: isActive ? 'var(--primary-lime)' : 'transparent',
            fontWeight: isActive ? '700' : '500',
            transition: 'all 0.2s ease',
            marginBottom: '4px'
        })}
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
            {/* Sidebar Overlay (Mobile Only) */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1000
                    }}
                    className="mobile-only"
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                borderRight: '1px solid var(--border-subtle)',
                padding: '32px 16px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                background: '#080808',
                zIndex: 2005, // Higher than everything
                transform: window.innerWidth < 1024 ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                paddingTop: 'calc(32px + env(safe-area-inset-top))'
            }}>
                <div style={{ fontWeight: '800', fontSize: '1.4rem', padding: '0 20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ color: 'var(--primary-lime)' }}>HAIDAR</span><span style={{ fontSize: '0.8rem', opacity: 0.6 }}>ADMIN</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="mobile-only"
                        style={{ background: 'transparent', color: 'var(--text-muted)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/admin/courses" icon={BookOpen} label="Courses" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/admin/articles" icon={FileText} label="Articles" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/admin/chats" icon={MessageSquare} label="Live Chats" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/admin/knowledge-base" icon={Bot} label="AI Knowledge Base" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/admin/users" icon={Users} label="Users" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/admin/settings" icon={Settings} label="Settings" onClick={() => setIsSidebarOpen(false)} />
                </nav>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        width: '100%',
                        color: '#ef4444',
                        background: 'transparent',
                        fontWeight: '600'
                    }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: window.innerWidth < 1024 ? '0' : '280px',
                padding: '20px 24px 100px', // Adjusted for bottom dock clearance on mobile if needed
                transition: 'margin-left 0.3s ease'
            }}>
                <header className="admin-sticky-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="mobile-only glass"
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary-lime)',
                                background: 'rgba(255,255,255,0.05)'
                            }}
                        >
                            <Menu size={22} />
                        </button>
                        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Overview</h2>
                    </div>

                 
                </header>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
