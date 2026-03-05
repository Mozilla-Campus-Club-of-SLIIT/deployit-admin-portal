"use client";

import React, { useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/api/challenges`),
          fetch(`${API_URL}/api/users`, { headers: adminAuthHeaders() })
        ]);

        const challenges = await challengesRes.json();
        const usersResText = await usersRes.text();
        const users = usersResText ? JSON.parse(usersResText) : [];

        setStats({
          totalChallenges: challenges?.length || 0,
          activeUsers: users?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ animation: "slideIn 0.5s ease" }}>
          <h1 style={titleStyle}>Admin <span className="text-gradient">Console</span></h1>
          <p style={subtitleStyle}>Centralized management for the DeployIt.</p>
        </div>
        <div style={dateStyle}>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </header>

      <section style={statsGridStyle}>
        <StatCard title="Active Challenges" value={stats.totalChallenges} icon="🏆" delay="0.1s" />
        <StatCard title="Registered Users" value={stats.activeUsers} icon="👥" delay="0.2s" />
      </section>

    </div>
  );
}

const StatCard = ({ title, value, icon, delay, color }: any) => (
  <div className="glass-panel" style={{
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    animation: `fadeIn 0.5s ease ${delay} backwards`,
    position: "relative",
    overflow: "hidden",
    flex: 1,
    minWidth: "250px",
    maxWidth: "400px"
  }}>
    <div style={{ fontSize: "2.5rem" }}>{icon}</div>
    <div style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</div>
    <div style={{ fontSize: "3.5rem", fontWeight: 900, color: color || "white" }}>{value}</div>
  </div>
);

const containerStyle: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "3rem",
};

const titleStyle: React.CSSProperties = {
  fontSize: "3rem",
  fontWeight: 900,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  color: "#64748b",
  marginTop: "0.5rem",
  fontSize: "1.1rem"
};

const dateStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#94a3b8",
  background: "rgba(255, 255, 255, 0.05)",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  border: "1px solid var(--panel-border)",
};

const statsGridStyle: React.CSSProperties = {
  display: "flex",
  gap: "2rem",
  justifyContent: "center",
  marginBottom: "3rem",
  flexWrap: "wrap"
};
