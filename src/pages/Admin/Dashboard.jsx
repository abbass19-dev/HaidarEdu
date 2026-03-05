import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getUsers, getCourses, getArticles } from '../../firebase/db';
import { getChats } from '../../firebase/chat';

const StatCard = ({ title, stat, icon: Icon }) => (
    <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{title}</div>
            <div style={{ color: 'var(--primary-lime)' }}><Icon size={20} /></div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>{stat.value}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: stat.trend === 'up' ? '#4ade80' : (stat.trend === 'down' ? '#f87171' : 'var(--text-dim)') }}>
            {stat.trend === 'up' && <TrendingUp size={14} />}
            {stat.trend === 'down' && <TrendingDown size={14} />}
            {stat.trend === 'neutral' && <Minus size={14} />}
            {stat.change} <span style={{ color: 'var(--text-dim)' }}>vs last month</span>
        </div>
    </div>
);

const calculateGrowth = (data) => {
    if (!data || data.length === 0) return { value: 0, change: '0%', trend: 'neutral' };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Items created BEFORE this month (Previous Total)
    const previousTotal = data.filter(item => {
        if (!item.createdAt) return false;
        return new Date(item.createdAt) < startOfMonth;
    }).length;

    const currentTotal = data.length;

    // Net New items this month
    const netNew = currentTotal - previousTotal;

    if (previousTotal === 0) {
        return {
            value: currentTotal,
            change: netNew > 0 ? '+100%' : '0%',
            trend: netNew > 0 ? 'up' : 'neutral'
        };
    }

    const percentChange = ((netNew / previousTotal) * 100).toFixed(1);
    const isPositive = netNew >= 0;

    return {
        value: currentTotal,
        change: `${isPositive ? '+' : ''}${percentChange}%`,
        trend: parseFloat(percentChange) === 0 ? 'neutral' : (isPositive ? 'up' : 'down')
    };
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: { value: 0, change: '0%', trend: 'neutral' },
        courses: { value: 0, change: '0%', trend: 'neutral' },
        articles: { value: 0, change: '0%', trend: 'neutral' },
        chats: { value: 0, change: '0%', trend: 'neutral' }
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, coursesData, articlesData, chatsData] = await Promise.all([
                    getUsers(),
                    getCourses(),
                    getArticles(),
                    getChats()
                ]);

                setStats({
                    users: calculateGrowth(usersData),
                    courses: calculateGrowth(coursesData),
                    articles: calculateGrowth(articlesData),
                    // Chats doesn't have reliable createdAt for growth, just showing total for now
                    chats: { value: chatsData.length, change: '0%', trend: 'neutral' }
                });

                // Generate Recent Activity
                const recentUsers = usersData
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 5)
                    .map(u => ({
                        id: u.id,
                        user: u.email ? u.email.split('@')[0] : 'Unknown User',
                        action: 'just signed up',
                        time: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently',
                        icon: Users
                    }));

                setRecentActivity(recentUsers);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard title="Total Users" stat={stats.users} icon={Users} />
                <StatCard title="Active Courses" stat={stats.courses} icon={BookOpen} />
                <StatCard title="Articles Published" stat={stats.articles} icon={FileText} />
                <StatCard title="Open Chats" stat={stats.chats} icon={MessageSquare} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '2fr 1fr',
                gap: '20px'
            }}>
                <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Recent Activity</h3>
                    {loading ? (
                        <div style={{ color: 'var(--text-muted)' }}>Loading activity...</div>
                    ) : (
                        recentActivity.map((activity, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: i === recentActivity.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <activity.icon size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: '600' }}>{activity.user}</span> {activity.action}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>{activity.time}</div>
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && recentActivity.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No recent activity.</div>}
                </div>

                <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Quick Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>Storage Usage</span>
                                <span>75%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: '75%', height: '100%', background: 'var(--primary-lime)' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>Server Health</span>
                                <span>99.9%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: '99.9%', height: '100%', background: '#4ade80' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
