'use client';

import React, { useEffect, useState } from 'react';
import { subscribeToAuthChanges } from '@/lib/auth';
import { User } from 'firebase/auth';
import Navbar from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/UI/Card';
import { Loading } from '@/components/UI/Loading';
import { BarChart, BookOpen, Users, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <Loading fullScreen />;

    const stats = [
        { label: 'Active Courses', value: '12', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Students', value: '1,284', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Revenue', value: '$12,450', icon: BarChart, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.email?.split('@')[0] || 'Trader'}!</h1>
                        <p className="text-gray-500">Here is what is happening with your courses today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="p-0 overflow-hidden">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="px-6 py-3 bg-gray-50 flex items-center text-xs font-medium text-green-600">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span>12% increase from last month</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Recent Activity" description="Your latest platform updates">
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {i}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">New student enrolled in "Advanced Forex"</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card title="Quick Actions" description="Common tasks you might want to do">
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 rounded-xl border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                                    <p className="text-sm font-bold">Create Course</p>
                                    <p className="text-xs text-gray-500">Add new content</p>
                                </button>
                                <button className="p-4 rounded-xl border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                                    <p className="text-sm font-bold">View Reports</p>
                                    <p className="text-xs text-gray-500">See detailed analysis</p>
                                </button>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
