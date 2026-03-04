"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", path: "/", icon: "📊" },
        { name: "Challenges", path: "/challenges", icon: "🏆" },
    ];

    return (
        <aside style={sidebarStyle}>
            <div style={logoContainerStyle}>
                <div style={logoIconStyle}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
                <h1 style={logoTextStyle}>
                    Deploy<span style={{ color: "var(--primary)" }}>It</span>
                    <span style={adminBadgeStyle}>ADMIN</span>
                </h1>
            </div>

            <nav style={navStyle}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path}>
                            <div style={{
                                ...navItemStyle,
                                background: isActive ? "rgba(245, 158, 11, 0.1)" : "transparent",
                                color: isActive ? "var(--primary)" : "#94a3b8",
                                borderLeft: isActive ? "4px solid var(--primary)" : "4px solid transparent",
                            }}>
                                <span style={iconStyle}>{item.icon}</span>
                                <span style={{ fontWeight: isActive ? 700 : 500 }}>{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div style={footerStyle}>
                <div style={userCardStyle}>
                    <div style={avatarStyle}>A</div>
                    <div style={userDocStyle}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Admin User</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>System Manager</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const sidebarStyle: React.CSSProperties = {
    width: "var(--sidebar-width)",
    height: "100vh",
    backgroundColor: "var(--sidebar-bg)",
    borderRight: "1px solid var(--panel-border)",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
};

const logoContainerStyle: React.CSSProperties = {
    padding: "2rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
};

const logoIconStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, var(--primary), #d97706)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
};

const logoTextStyle: React.CSSProperties = {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "white",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
};

const adminBadgeStyle: React.CSSProperties = {
    fontSize: "0.6rem",
    letterSpacing: "0.2em",
    color: "#64748b",
    marginTop: "4px",
};

const navStyle: React.CSSProperties = {
    padding: "1rem 0",
    flex: 1,
};

const navItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.85rem 1.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const iconStyle: React.CSSProperties = {
    fontSize: "1.2rem",
};

const footerStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderTop: "1px solid var(--panel-border)",
};

const userCardStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
};

const avatarStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.8rem",
    color: "#000",
};

const userDocStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
};

export default Sidebar;
