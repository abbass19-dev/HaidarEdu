import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/Home/HomePage';
import Home2 from './pages/Home/Home2';
import CoursesPage from './pages/Courses/CoursesPage';
import ArticlesPage from './pages/Articles/ArticlesPage';
import ProgramsPage from './pages/Programs/ProgramsPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import CourseManager from './pages/Admin/CourseManager';
import ArticleManager from './pages/Admin/ArticleManager';
import ChatManager from './pages/Admin/ChatManager';
import UserManager from './pages/Admin/UserManager';
import SettingsManager from './pages/Admin/SettingsManager';
import KnowledgeBase from './pages/Admin/KnowledgeBase';
import ChatAssistant from './components/Chat/ChatAssistant';
import { subscribeToAuthChanges } from './firebase/auth';
import { getUserRole, getSystemSettings } from './firebase/db';
import LiveChatPage from './pages/Support/LiveChatPage'; // Import LiveChatPage
import UserProfile from './pages/UserProfile';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const [user, setUser] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        return subscribeToAuthChanges(async (u) => {
            if (u) {
                const r = await getUserRole(u.uid);
                setUser(u);
                setRole(r);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading session...</div>;

    if (!user) return <LoginPage />;
    if (requireAdmin && role !== 'admin') return <div style={{ textAlign: 'center', padding: '100px' }}>Access Denied. Admins Only.</div>;

    return children;
};

const Footer = () => (
    <footer style={{ padding: '60px 0', borderTop: '1px solid var(--border-subtle)', marginTop: '80px' }}>
        <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: '800', fontSize: '1.5rem', marginBottom: '24px' }}>
                <span style={{ color: 'var(--primary-lime)' }}>HAIDAR</span>EDU
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
                Trading involves significant risk. Our education platform is designed to provide information and tools, but should not be considered financial advice.
            </p>
            <div style={{ marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                &copy; 2026 HaidarEdu. All rights reserved.
            </div>
        </div>
    </footer>
);

const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);



function App() {
    React.useEffect(() => {
        const updateFavicon = async () => {
            try {
                const settings = await getSystemSettings();
                if (settings?.logoUrl) {
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = settings.logoUrl;
                }
            } catch (e) {
                console.error("Failed to update favicon", e);
            }
        };
        updateFavicon();
    }, []);

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="grain">
                <Navbar />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                        <Route path="/courses" element={<PageWrapper><CoursesPage /></PageWrapper>} />
                        <Route path="/articles" element={<PageWrapper><ArticlesPage /></PageWrapper>} />
                        <Route path="/programs" element={<PageWrapper><ProgramsPage /></PageWrapper>} />
                        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
                        <Route path="/home2" element={<PageWrapper><Home2 /></PageWrapper>} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="courses" element={<CourseManager />} />
                            <Route path="articles" element={<ArticleManager />} />
                            <Route path="chats" element={<ChatManager />} />
                            <Route path="users" element={<UserManager />} />
                            <Route path="knowledge-base" element={<KnowledgeBase />} />
                            <Route path="settings" element={<SettingsManager />} />
                        </Route>

                        {/* User Dashboard */}
                        <Route path="/dashboard" element={<ProtectedRoute><div style={{ padding: '160px 0' }} className="container">User Dashboard (Manage Enrollments Here)</div></ProtectedRoute>} />
                        <Route path="/live-chat" element={<ProtectedRoute><PageWrapper><LiveChatPage /></PageWrapper></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><PageWrapper><UserProfile /></PageWrapper></ProtectedRoute>} />
                    </Routes>
                </AnimatePresence>
                <ChatAssistant />
                <Footer />
            </div>
        </Router>
    );
}

export default App;
