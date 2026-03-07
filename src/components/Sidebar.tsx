"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [adminName, setAdminName] = useState("Admin User");

    useEffect(() => {
        const userStr = localStorage.getItem("admin_user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setAdminName(user.displayName || "Admin User");
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_user");
        router.push("/login");
    };

    const menuItems = [
        { name: "Dashboard", path: "/", icon: "📊" },
        { name: "Challenges", path: "/challenges", icon: "🏆" },
    ];

    return (
        <aside style={sidebarStyle} className="mobile-sidebar">
            <div style={logoContainerStyle} className="mobile-logo-container">
                <img src="/deployit-logo.png" alt="Deploy(it) Logo" style={{ height: "32px", width: "auto" }} />
                <span style={{
                    ...adminBadgeStyle,
                    marginLeft: "0.5rem",
                    marginTop: "0",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.55rem"
                }}>ADMIN</span>
            </div>

            <nav style={navStyle} className="mobile-nav">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path}>
                            <div className="mobile-nav-item" data-active={isActive} style={{
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

            <div style={footerStyle} className="mobile-footer">
                <div style={userCardStyle}>
                    <div style={avatarStyle}>{adminName[0].toUpperCase()}</div>
                    <div style={userDocStyle}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{adminName}</div>
                        <div
                            onClick={handleLogout}
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--danger, #ef4444)",
                                cursor: "pointer",
                                fontWeight: 700,
                                marginTop: "2px"
                            }}
                        >
                            Log Out ↩
                        </div>
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
