'use client';

import React from 'react';

interface LoadingProps {
    fullScreen?: boolean;
}

export const Loading = ({ fullScreen }: LoadingProps) => {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-lime rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};
