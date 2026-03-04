"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user.role === "admin") {
                    // Store user record in localStorage (Basic Auth)
                    localStorage.setItem("admin_user", JSON.stringify(data.user));
                    router.push("/");
                } else {
                    setError("Access denied. Admin privileges required.");
                }
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("Connection to security service failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div className="glass-panel" style={loginBoxStyle}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={logoIconStyle}>
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1 style={titleStyle}>Admin <span className="text-gradient">Access</span></h1>
                    <p style={subtitleStyle}>Please authenticate to enter the control center.</p>
                </div>

                <form onSubmit={handleLogin} style={formStyle}>
                    {error && (
                        <div style={errorStyle}>
                            <span style={{ marginRight: "0.5rem" }}>⚠️</span> {error}
                        </div>
                    )}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            required
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@deployit.com"
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Secure Token / Password</label>
                        <input
                            type="password"
                            required
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...loginButtonStyle,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Verifying Credentials..." : "Access Control Center"}
                    </button>
                </form>

                <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.8rem", color: "#64748b" }}>
                    &copy; 2026 Deploy(it)
                </div>
            </div>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at center, #0f172a 0%, #020617 100%)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
};

const loginBoxStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    padding: "3rem",
    animation: "fadeIn 0.5s ease-out",
};

const logoIconStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    background: "rgba(245, 158, 11, 0.1)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem auto",
    color: "var(--primary)",
    boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
};

const titleStyle: React.CSSProperties = {
    fontSize: "1.75rem",
    fontWeight: 900,
    margin: "0 0 0.5rem 0",
};

const subtitleStyle: React.CSSProperties = {
    color: "#94a3b8",
    fontSize: "0.9rem",
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
};

const formGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
};

const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    color: "white",
    fontSize: "1rem",
    transition: "all 0.2s ease",
};

const loginButtonStyle: React.CSSProperties = {
    background: "var(--primary)",
    color: "#000",
    border: "none",
    padding: "1rem",
    borderRadius: "10px",
    fontWeight: 800,
    fontSize: "1rem",
    marginTop: "0.5rem",
    boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.3)",
};

const errorStyle: React.CSSProperties = {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    padding: "1rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
};
