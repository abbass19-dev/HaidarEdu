import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "HAIDAREDU - The Future of Trading",
    description: "Master professional trading strategies and get funded.",
};

import { AuthProvider } from "@/lib/context/AuthContext";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} grain`}>
                <AuthProvider>
                    <main>
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}


