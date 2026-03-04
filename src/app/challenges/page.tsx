"use client";

import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function ChallengesAdmin() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<string[]>(["Linux", "Bash", "Docker", "Kubernetes", "Security", "DevOps"]);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        image: "ubuntu:22.04",
        score: 10,
        difficulty: "Easy",
        tags: [] as string[],
        startScript: "",
        evaluationScript: ""
    });
    const [newCategoryInput, setNewCategoryInput] = useState("");

    const fetchChallenges = async () => {
        try {
            const response = await fetch(`${API_URL}/api/challenges`);
            const data = await response.json();
            setChallenges(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleAddChallenge = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const challengeData = {
                ...formData,
                id: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
                tags: formData.tags,
                score: Number(formData.score)
            };

            const res = await fetch(`${API_URL}/api/challenges/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(challengeData)
            });

            if (res.ok) {
                setShowModal(false);
                fetchChallenges();
                setFormData({
                    id: "",
                    title: "",
                    description: "",
                    image: "ubuntu:22.04",
                    score: 10,
                    difficulty: "Easy",
                    tags: [],
                    startScript: "",
                    evaluationScript: ""
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Challenge <span className="text-gradient">Registry</span></h1>
                    <p style={{ color: "#64748b" }}>Manage and deploy new technical labs to the ecosystem.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={addButtonStyle}
                >
                    + Create New Challenge
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", padding: "5rem", color: "#94a3b8" }}>Allocating resources...</div>
            ) : (
                <div style={gridStyle}>
                    {challenges.map((c: any) => (
                        <div key={c.id} className="glass-panel" style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <span style={{
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: "20px",
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    background: c.difficulty === "Easy" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                                    color: c.difficulty === "Easy" ? "#10b981" : "#f59e0b",
                                    textTransform: "uppercase"
                                }}>{c.difficulty}</span>
                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>{c.score} PTS</span>
                            </div>
                            <h3 style={{ margin: "1rem 0 0.5rem 0", fontSize: "1.1rem" }}>{c.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: "#94a3b8", flex: 1 }}>{c.description}</p>
                            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {(c.tags || []).map((t: string) => (
                                    <span key={t} style={tagStyle}>#{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div className="glass-panel" style={modalContentStyle}>
                        <h2 style={{ marginBottom: "1.5rem" }}>Deploy New Challenge</h2>
                        <form onSubmit={handleAddChallenge} style={formStyle}>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Title</label>
                                <input
                                    style={inputStyle}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Master the Linux Terminal"
                                    required
                                />
                            </div>
                            <div style={formRowStyle}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Score</label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        value={formData.score}
                                        onChange={e => setFormData({ ...formData, score: Number(e.target.value) })}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Difficulty</label>
                                    <select
                                        style={inputStyle}
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Assign Categories</label>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                                    {availableCategories.map(cat => {
                                        const isSelected = formData.tags.includes(cat);
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    const newTags = isSelected
                                                        ? formData.tags.filter(t => t !== cat)
                                                        : [...formData.tags, cat];
                                                    setFormData({ ...formData, tags: newTags });
                                                }}
                                                style={{
                                                    ...tagButtonStyle,
                                                    background: isSelected ? "var(--primary)" : "rgba(255, 255, 255, 0.05)",
                                                    color: isSelected ? "#000" : "#94a3b8",
                                                    borderColor: isSelected ? "var(--primary)" : "var(--panel-border)"
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <input
                                        style={{ ...inputStyle, flex: 1, fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                                        placeholder="New Category Definition..."
                                        value={newCategoryInput}
                                        onChange={e => setNewCategoryInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = newCategoryInput.trim();
                                                if (val && !availableCategories.includes(val)) {
                                                    setAvailableCategories([...availableCategories, val]);
                                                    setNewCategoryInput("");
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        style={{ ...addButtonStyle, padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                                        onClick={() => {
                                            const val = newCategoryInput.trim();
                                            if (val && !availableCategories.includes(val)) {
                                                setAvailableCategories([...availableCategories, val]);
                                                setNewCategoryInput("");
                                            }
                                        }}
                                    >+ Add</button>
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: "80px" }}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Start Script (Shell)</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: "80px", fontFamily: "monospace", fontSize: "0.8rem" }}
                                    value={formData.startScript}
                                    onChange={e => setFormData({ ...formData, startScript: e.target.value })}
                                    placeholder="#!/bin/bash\necho 'Hello World' > /tmp/hello"
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Evaluation Script (Shell)</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: "120px", fontFamily: "monospace", fontSize: "0.8rem" }}
                                    value={formData.evaluationScript}
                                    onChange={e => setFormData({ ...formData, evaluationScript: e.target.value })}
                                    placeholder="#!/bin/bash\nif [ -f /tmp/test ]; then exit 0; else exit 1; fi"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                <button type="submit" style={saveButtonStyle}>Publish to Production</button>
                                <button type="button" onClick={() => setShowModal(false)} style={cancelButtonStyle}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
};

const cardStyle: React.CSSProperties = {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const cardHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const tagStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    color: "#64748b",
    fontWeight: 600,
    background: "rgba(255, 255, 255, 0.05)",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
};

const addButtonStyle: React.CSSProperties = {
    background: "var(--primary)",
    color: "#000",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "12px",
    fontWeight: 800,
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 4px 14px 0 var(--glow)",
};

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease",
};

const modalContentStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "600px",
    padding: "2.5rem",
    maxHeight: "90vh",
    overflowY: "auto",
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
};

const formGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
};

const formRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "1rem",
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
    border: "1px solid var(--panel-border)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "white",
    fontSize: "0.95rem",
    width: "100%",
};

const saveButtonStyle: React.CSSProperties = {
    flex: 1,
    background: "var(--primary)",
    color: "#000",
    border: "none",
    padding: "1rem",
    borderRadius: "8px",
    fontWeight: 800,
    cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    border: "1px solid var(--panel-border)",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
};

const tagButtonStyle: React.CSSProperties = {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: 600,
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
};

