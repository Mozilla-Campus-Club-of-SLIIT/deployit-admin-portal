"use client";

import React, { useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function UserBase() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminFormData, setAdminFormData] = useState({ displayName: "", email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admins`, {
                headers: adminAuthHeaders(),
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data || []);
            } else {
                setUsers([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/admins/add`, {
                method: "POST",
                headers: {
                    ...adminAuthHeaders(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminFormData)
            });
            if (res.ok) {
                alert("Admin created successfully!");
                setShowAdminModal(false);
                setAdminFormData({ displayName: "", email: "", password: "" });
            } else {
                const msg = await res.text();
                alert("Failed to create admin: " + msg);
            }
        } catch (error) {
            alert("Network error");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Administrator <span className="text-gradient">Base</span></h1>
                    <p style={{ color: "#64748b" }}>Manage privileged access and platform controllers.</p>
                </div>
                <button 
                    onClick={() => setShowAdminModal(true)}
                    className="btn-primary" 
                    style={{ padding: "0.75rem 1.5rem" }}
                >
                    Add New Admin
                </button>
            </header>

            {showAdminModal && (
                <div style={modalOverlayStyle}>
                    <div className="glass-panel" style={modalStyle}>
                        <h2 style={{ marginBottom: "1.5rem" }}>Add New <span className="text-gradient">Admin</span></h2>
                        <form onSubmit={handleAddAdmin}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Display Name</label>
                                <input 
                                    style={inputStyle} 
                                    value={adminFormData.displayName}
                                    onChange={e => setAdminFormData({...adminFormData, displayName: e.target.value})}
                                    required 
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Email</label>
                                <input 
                                    type="email" 
                                    style={inputStyle} 
                                    value={adminFormData.email}
                                    onChange={e => setAdminFormData({...adminFormData, email: e.target.value})}
                                    required 
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Password</label>
                                <input 
                                    type="password" 
                                    style={inputStyle} 
                                    value={adminFormData.password}
                                    onChange={e => setAdminFormData({...adminFormData, password: e.target.value})}
                                    required 
                                />
                            </div>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1 }}>
                                    {submitting ? "Creating..." : "Create Admin"}
                                </button>
                                <button type="button" onClick={() => setShowAdminModal(false)} style={cancelButtonStyle}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ overflow: "hidden" }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Administrator</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Permissions Created</th>
                            <th style={thStyle}>Role</th>
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
                                    <span style={{
                                        padding: "0.25rem 0.6rem",
                                        borderRadius: "6px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        background: "rgba(245, 158, 11, 0.1)",
                                        color: "var(--primary)"
                                    }}>ADMIN</span>
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

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "500px",
    padding: "2.5rem",
};

const formGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.25rem",
};

const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "white",
    fontSize: "0.95rem",
    width: "100%",
};

const cancelButtonStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
};
