'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    MessageSquare,
    FileText,
    Library
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Articles', href: '/admin/articles', icon: FileText },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Chats', href: '/admin/chats', icon: MessageSquare },
    { label: 'Knowledge Base', href: '/admin/knowledge-base', icon: Library },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-[calc(100vh-80px)] bg-white border-r border-gray-100 flex flex-col">
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary-lime/10 text-gray-900 font-semibold"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5",
                                isActive ? "text-primary-lime" : "text-gray-400"
                            )} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};
