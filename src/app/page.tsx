"use client";

import React, { useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeUsers: 0,
  });
  const [clusterStatus, setClusterStatus] = useState({ name: "", status: "LOADING" });
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/api/challenges`),
          fetch(`${API_URL}/api/users`, { headers: adminAuthHeaders() })
        ]);

        let challenges = [];
        if (challengesRes.ok) {
          const contentType = challengesRes.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            challenges = await challengesRes.json();
          }
        }

        let users = [];
        if (usersRes.ok) {
          const contentType = usersRes.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            users = await usersRes.json();
          }
        }

        setStats({
          totalChallenges: Array.isArray(challenges) ? challenges.length : 0,
          activeUsers: Array.isArray(users) ? users.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let ws: WebSocket;
    const connectWS = () => {
      const wsUrl = API_URL.replace(/^http/, "ws") + "/api/cluster/status/ws";
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setClusterStatus(data);
        } catch (e) {
          console.error("WS Parse Error", e);
        }
      };

      ws.onerror = () => {
        setClusterStatus({ name: "", status: "OFFLINE" });
      };

      ws.onclose = () => {
        setTimeout(connectWS, 10000); // Reconnect loop if closed
      };
    };

    connectWS();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleCreateCluster = async () => {
    if (!confirm("Are you sure you want to create a new GKE cluster? This will incur costs and take 3-5 mins.")) return;
    try {
      const res = await fetch(`${API_URL}/api/cluster/create`, { 
        method: "POST", 
        headers: adminAuthHeaders() 
      });
      if (res.ok) {
        setClusterStatus({ name: "Initializing...", status: "PROVISIONING" });
        alert("Cluster creation initiated successfully!");
      } else {
        const msg = await res.text();
        alert("Failed to create cluster: " + msg);
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const handleDeleteCluster = async () => {
    if (!confirm("Are you sure you want to delete the cluster? All active lab sessions will be lost.")) return;
    try {
      const res = await fetch(`${API_URL}/api/cluster/delete`, { 
        method: "POST", 
        headers: adminAuthHeaders() 
      });
      if (res.ok) {
        setClusterStatus({ name: "", status: "DELETING" });
        alert("Cluster deletion initiated.");
      } else {
        alert("Failed to delete cluster.");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div style={{ animation: "slideIn 0.5s ease" }}>
          <h1 className="dashboard-title">Admin <span className="text-gradient">Console</span></h1>
          <p style={subtitleStyle}>Centralized management for the DeployIt.</p>
        </div>
        <div style={dateStyle}>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </header>

      <section className="status-grid">
        <StatCard title="Active Challenges" value={stats.totalChallenges} icon="🏆" delay="0.1s" />
        <StatCard title="Registered Users" value={stats.activeUsers} icon="👥" delay="0.2s" />
        <StatCard 
          title="Cluster Status" 
          value={clusterStatus.status} 
          icon="☁️" 
          delay="0.3s" 
          color={
            clusterStatus.status === "RUNNING" ? "#10b981" : 
            clusterStatus.status === "OFFLINE" ? "#ef4444" : "#f59e0b"
          } 
        />
      </section>

      <section className="glass-panel infra-section">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🛠️</span> Infrastructure Management
        </h2>
        
        <div className="infra-flex">
          <div className="infra-info">
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Control the GKE cluster lifecycle. Creating a cluster takes approximately 3-5 minutes. 
              The cluster will automatically be deleted after 45 minutes of inactivity to save costs.
            </p>
            {clusterStatus.name && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--panel-border)', marginBottom: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Active Cluster Name</div>
                <div style={{ color: 'white', fontFamily: 'monospace', fontWeight: 600 }}>{clusterStatus.name}</div>
              </div>
            )}
          </div>

          <div className="infra-actions">
            <button 
              onClick={handleCreateCluster}
              disabled={clusterStatus.status !== "OFFLINE"}
              className="button-primary"
              style={{ padding: '1rem', opacity: clusterStatus.status !== "OFFLINE" ? 0.5 : 1 }}
            >
              🚀 Create Cluster
            </button>
            <button 
              onClick={handleDeleteCluster}
              disabled={clusterStatus.status === "OFFLINE" || clusterStatus.status === "DELETING"}
              className="button-danger"
              style={{ padding: '1rem', opacity: (clusterStatus.status === "OFFLINE" || clusterStatus.status === "DELETING") ? 0.5 : 1 }}
            >
              🗑️ Delete Cluster
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ title, value, icon, delay, color }: any) => {
  const isProvisioning = value === "PROVISIONING";
  const fontSize = value && value.length > 10 ? "2rem" : "3.5rem";
  
  return (
    <div className="glass-panel" style={{
      padding: "2.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      animation: isProvisioning ? `pulse 2s infinite ease-in-out, fadeIn 0.5s ease ${delay} backwards` : `fadeIn 0.5s ease ${delay} backwards`,
      position: "relative",
      overflow: "hidden",
      flex: 1,
      minWidth: "250px",
      maxWidth: "400px"
    }}>
      <div style={{ fontSize: "2.5rem" }}>{icon}</div>
      <div style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</div>
      <div style={{ 
        fontSize: fontSize, 
        fontWeight: 900, 
        color: color || "white",
        textAlign: "center",
        wordBreak: "break-all",
        transition: "font-size 0.3s ease"
      }}>
        {value}
      </div>
    </div>
  );
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
