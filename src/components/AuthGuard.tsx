"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminToken, clearAdminSession, isTokenExpired } from "@/lib/adminAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/login") {
            setAuthorized(true);
            return;
        }

        const checkAuth = () => {
            const userStr = localStorage.getItem("admin_user");
            const token = getAdminToken();

            if (!userStr || !token) {
                clearAdminSession();
                router.push("/login");
                return;
            }

            // Check JWT expiry client-side (backend will also reject expired tokens)
            if (isTokenExpired(token)) {
                clearAdminSession();
                router.push("/login");
                return;
            }

            try {
                const user = JSON.parse(userStr);
                if (user.role !== "admin") {
                    clearAdminSession();
                    router.push("/login");
                } else {
                    setAuthorized(true);
                }
            } catch {
                clearAdminSession();
                router.push("/login");
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (!authorized && pathname !== "/login") {
        return (
            <div style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#020617",
                color: "var(--primary)"
            }}>
                Authenticating...
            </div>
        );
    }

    return <>{children}</>;
}
