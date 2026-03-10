"use client";

import React, { useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function ChallengesAdmin() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: "", title: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const ITEMS_PER_PAGE = 6;
    const [availableCategories, setAvailableCategories] = useState<string[]>(["Linux", "Docker", "Kubernetes", "Security", "DevOps"]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        image: "ubuntu:22.04",
        score: 10,
        timeLimit: 300,
        difficulty: "Easy",
        tags: [] as string[],
        startupScript: "",
        endScript: ""
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

    const toggleChallenge = async (id: string, currentLocked: boolean) => {
        // Optimistic UI update
        setChallenges(prev =>
            prev.map(c => c.id === id ? { ...c, locked: !currentLocked } : c)
        );
        try {
            const res = await fetch(`${API_URL}/api/challenges/toggle?id=${encodeURIComponent(id)}`, {
                method: "PATCH",
                headers: adminAuthHeaders(),
            });
            if (!res.ok) {
                // Revert on failure
                setChallenges(prev =>
                    prev.map(c => c.id === id ? { ...c, locked: currentLocked } : c)
                );
                console.error("Toggle failed:", await res.text());
            }
        } catch (e) {
            // Revert on network error
            setChallenges(prev =>
                prev.map(c => c.id === id ? { ...c, locked: currentLocked } : c)
            );
            console.error(e);
        }
    };

    const confirmDeleteChallenge = async () => {
        if (!deleteModal.id) return;
        try {
            const res = await fetch(`${API_URL}/api/challenges/delete?id=${encodeURIComponent(deleteModal.id)}`, {
                method: "DELETE",
                headers: adminAuthHeaders(),
            });
            if (res.ok) {
                setChallenges(prev => prev.filter(c => c.id !== deleteModal.id));
                setDeleteModal({ show: false, id: "", title: "" });
            } else {
                console.error("Delete failed:", await res.text());
                alert("Failed to delete challenge.");
            }
        } catch (e) {
            console.error("Delete error:", e);
            alert("Network error. Could not delete challenge.");
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
                id: formData.id || `${slug}-${Math.random().toString(36).substring(2, 7)}`,
                tags: formData.tags,
                score: Number(formData.score),
                timeLimit: Number(formData.timeLimit)
            };

            const res = await fetch(`${API_URL}/api/challenges/add`, {
                method: "POST",
                headers: adminAuthHeaders(), // JWT required — admin-only route
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
                    timeLimit: 300,
                    difficulty: "Easy",
                    tags: [],
                    startupScript: "",
                    endScript: ""
                });
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <header className="mobile-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Challenge <span className="text-gradient">Registry</span></h1>
                    <p style={{ color: "#64748b" }}>Manage and deploy new technical labs to the ecosystem.</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({
                            id: "", title: "", description: "", image: "ubuntu:22.04", score: 10, timeLimit: 300, difficulty: "Easy",
                            tags: [], startupScript: "", endScript: ""
                        });
                        setShowModal(true);
                    }}
                    style={addButtonStyle}
                >
                    + Create New Challenge
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", padding: "5rem", color: "#94a3b8" }}>Allocating resources...</div>
            ) : (
                <>
                    <div className="mobile-controls" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", gap: "1rem" }}>
                        <div style={{ flex: 1, maxWidth: "400px" }}>
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{
                                    width: "100%",
                                    background: "rgba(0, 0, 0, 0.3)",
                                    border: "1px solid var(--panel-border)",
                                    borderRadius: "6px",
                                    padding: "0.6rem 1rem",
                                    color: "white",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Category:</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                style={{
                                    background: "rgba(0, 0, 0, 0.3)",
                                    border: "1px solid var(--panel-border)",
                                    borderRadius: "6px",
                                    padding: "0.4rem 0.8rem",
                                    color: "white",
                                    fontSize: "0.85rem",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="All">All Categories</option>
                                {Array.from(new Set([...availableCategories, ...challenges.flatMap(c => c.tags || [])])).filter(cat => cat !== "Bash").sort().map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={gridStyle}>
                        {(() => {
                            const searchLower = searchTerm.toLowerCase();
                            const searchedChallenges = challenges.filter((c: any) => 
                                !searchTerm || 
                                c.title?.toLowerCase().includes(searchLower) || 
                                c.description?.toLowerCase().includes(searchLower)
                            );

                            const filteredChallenges = filterCategory === "All" 
                                ? searchedChallenges 
                                : searchedChallenges.filter((c: any) => c.tags && c.tags.includes(filterCategory));

                            const sortedChallenges = [...filteredChallenges];
                            
                            const totalPages = Math.ceil(sortedChallenges.length / ITEMS_PER_PAGE);
                            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                            const paginatedChallenges = sortedChallenges.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                            return (
                                <>
                                    {paginatedChallenges.map((c: any) => (
                                        <div key={c.id} className="glass-panel" style={{
                            ...cardStyle,
                            opacity: c.locked ? 0.55 : 1,
                            transition: "opacity 0.3s ease"
                        }}>
                            <div style={cardHeaderStyle}>
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <span style={{
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "20px",
                                        fontSize: "0.65rem",
                                        fontWeight: 800,
                                        background: c.difficulty === "Easy" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                                        color: c.difficulty === "Easy" ? "#10b981" : "#f59e0b",
                                        textTransform: "uppercase"
                                    }}>{c.difficulty}</span>
                                    {c.locked && (
                                        <span style={{
                                            padding: "0.25rem 0.6rem",
                                            borderRadius: "20px",
                                            fontSize: "0.6rem",
                                            fontWeight: 800,
                                            background: "rgba(239, 68, 68, 0.15)",
                                            color: "#ef4444",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em"
                                        }}>DISABLED</span>
                                    )}
                                </div>
                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>{c.score} PTS</span>
                            </div>
                            <h3 style={{ margin: "1rem 0 0.5rem 0", fontSize: "1.1rem" }}>{c.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: "#94a3b8", flex: 1 }}>{c.description}</p>
                            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {(c.tags || []).map((t: string) => (
                                    <span key={t} style={tagStyle}>#{t}</span>
                                ))}
                            </div>

                            {/* Enable / Disable toggle */}

                            <div style={{
                                marginTop: "1.25rem",
                                paddingTop: "1rem",
                                borderTop: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem"
                            }}>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            id: c.id,
                                            title: c.title,
                                            description: c.description,
                                            image: c.image || "ubuntu:22.04",
                                            score: c.score || 10,
                                            timeLimit: c.timeLimit || 300,
                                            difficulty: c.difficulty || "Easy",
                                            tags: c.tags || [],
                                            startupScript: c.startupScript || "",
                                            endScript: c.endScript || ""
                                        });
                                        setIsEditing(true);
                                        setShowModal(true);
                                    }}
                                    style={{
                                        background: "transparent",
                                        color: "var(--primary)",
                                        border: "1px solid var(--primary)",
                                        padding: "0.4rem 1rem",
                                        borderRadius: "6px",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ show: true, id: c.id, title: c.title })}
                                    title="Delete Challenge"
                                    style={{
                                        background: "transparent",
                                        color: "#ef4444",
                                        border: "1px solid #ef4444",
                                        padding: "0.4rem 0.6rem",
                                        borderRadius: "6px",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: c.locked ? "#ef4444" : "#10b981", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                        {c.locked ? "Disabled" : "Active"}
                                    </span>
                                    <button
                                        onClick={() => toggleChallenge(c.id, !!c.locked)}
                                        title={c.locked ? "Enable this challenge" : "Disable this challenge"}
                                        style={{
                                            position: "relative",
                                            width: "44px",
                                            height: "24px",
                                            borderRadius: "12px",
                                            border: "none",
                                            cursor: "pointer",
                                            background: c.locked ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.4)",
                                            transition: "background 0.25s ease",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{
                                            position: "absolute",
                                            top: "3px",
                                            left: c.locked ? "3px" : "22px",
                                            width: "18px",
                                            height: "18px",
                                            borderRadius: "50%",
                                            background: c.locked ? "#ef4444" : "#10b981",
                                            transition: "left 0.25s ease",
                                            display: "block",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.4)"
                                        }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {totalPages > 1 && (
                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{
                                    ...tagButtonStyle,
                                    background: currentPage === 1 ? "rgba(255,255,255,0.05)" : "var(--primary)",
                                    color: currentPage === 1 ? "#64748b" : "#000",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    opacity: currentPage === 1 ? 0.5 : 1
                                }}
                            >
                                Previous
                            </button>
                            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{
                                    ...tagButtonStyle,
                                    background: currentPage === totalPages ? "rgba(255,255,255,0.05)" : "var(--primary)",
                                    color: currentPage === totalPages ? "#64748b" : "#000",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    opacity: currentPage === totalPages ? 0.5 : 1
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                                </>
                            );
                        })()}
                    </div>
                </>
            )}

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div className="glass-panel" style={modalContentStyle}>
                        <h2 style={{ marginBottom: "1.5rem" }}>{isEditing ? "Edit Challenge" : "Deploy New Challenge"}</h2>
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
                            <div className="form-row" style={formRowStyle}>
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
                                    <label style={labelStyle}>Time Limit (Seconds)</label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        value={formData.timeLimit}
                                        onChange={e => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
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
                                    value={formData.startupScript}
                                    onChange={e => setFormData({ ...formData, startupScript: e.target.value })}
                                    placeholder="#!/bin/bash\necho 'Hello World' > /tmp/hello"
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Evaluation Script (Shell)</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: "120px", fontFamily: "monospace", fontSize: "0.8rem" }}
                                    value={formData.endScript}
                                    onChange={e => setFormData({ ...formData, endScript: e.target.value })}
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

            {deleteModal.show && (
                <div style={modalOverlayStyle}>
                    <div className="glass-panel" style={{ ...modalContentStyle, maxWidth: "400px", textAlign: "center", padding: "2.5rem" }}>
                        <div style={{ 
                            width: "60px", height: "60px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", 
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto",
                            color: "#ef4444"
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </div>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem", color: "white" }}>Delete Challenge?</h2>
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem" }}>
                            Are you sure you want to permanently delete <strong>{deleteModal.title}</strong>? This action cannot be reversed.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                            <button 
                                onClick={confirmDeleteChallenge} 
                                style={{
                                    ...saveButtonStyle, 
                                    background: "#ef4444", 
                                    color: "white", 
                                    flex: 1
                                }}
                            >
                                Delete
                            </button>
                            <button 
                                onClick={() => setDeleteModal({ show: false, id: "", title: "" })} 
                                style={{
                                    ...cancelButtonStyle,
                                    flex: 1
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
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

