"use client";

import React, { useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function UserBase() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users`, {
                headers: adminAuthHeaders(),
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data || []);
            } else {
                // Fallback mock data if endpoint doesn't exist yet
                setUsers([
                    { id: "sadeesha-sadeesha", displayName: "Sadeesha Perera", email: "sadeesha@example.com", totalScore: 450, createdAt: "2024-03-01" },
                    { id: "john-doe", displayName: "John Doe", email: "john@example.com", totalScore: 120, createdAt: "2024-03-02" },
                    { id: "dev-ops", displayName: "Dev Ops", email: "dev@ops.com", totalScore: 890, createdAt: "2024-02-28" },
                ]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <header style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>User <span className="text-gradient">Base</span></h1>
                <p style={{ color: "#64748b" }}>Monitor user growth, scores, and technical progress.</p>
            </header>

            <div className="glass-panel" style={{ overflow: "hidden" }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>User</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Joined</th>
                            <th style={thStyle}>Experience Points</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={user.id} style={{
                                ...rowStyle,
                                borderBottom: idx === users.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)"
                            }}>
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={avatarStyle}>{user.displayName[0]}</div>
                                        <div style={{ fontWeight: 600 }}>{user.displayName}</div>
                                    </div>
                                </td>
                                <td style={{ ...tdStyle, color: "#94a3b8" }}>{user.email}</td>
                                <td style={{ ...tdStyle, color: "#64748b", fontSize: "0.85rem" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ color: "var(--primary)", fontWeight: 800 }}>{user.totalScore || 0}</span>
                                        <span style={{ fontSize: "0.7rem", color: "#64748b" }}>XP</span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: "0.25rem 0.6rem",
                                        borderRadius: "6px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        background: "rgba(16, 185, 129, 0.1)",
                                        color: "#10b981"
                                    }}>ACTIVE</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
};

const headerRowStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.02)",
};

const thStyle: React.CSSProperties = {
    padding: "1.25rem 1.5rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const rowStyle: React.CSSProperties = {
    transition: "background 0.2s ease",
};

const tdStyle: React.CSSProperties = {
    padding: "1.25rem 1.5rem",
    fontSize: "0.9rem",
};

const avatarStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--primary)",
};
