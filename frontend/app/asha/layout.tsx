"use client";

import { Header } from "@/components/layout/Header";
import { LiveAlerts } from "@/components/LiveAlerts";

export default function AshaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative font-body selection:bg-accent/30">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
            <LiveAlerts />
        </div>
    );
}
