"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="admin-layout">
            <div className="mobile-top-bar">
                <img src="/deployit-logo.png" alt="Deploy(it) Logo" style={{ height: "32px", width: "auto" }} />
                <span style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: "#64748b",
                    marginTop: "4px",
                    marginLeft: "0.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                }}>ADMIN</span>
            </div>
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
