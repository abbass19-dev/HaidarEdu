'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export const Card = ({ children, className, title, description }: CardProps) => {
    return (
        <div className={cn(
            "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
            className
        )}>
            {(title || description) && (
                <div className="px-6 py-4 border-bottom border-gray-50">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
