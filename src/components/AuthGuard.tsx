"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip check for login page itself
        if (pathname === "/login") {
            setAuthorized(true);
            return;
        }

        const checkAuth = () => {
            const userStr = localStorage.getItem("admin_user");
            if (!userStr) {
                router.push("/login");
                return;
            }

            try {
                const user = JSON.parse(userStr);
                if (user.role !== "admin") {
                    localStorage.removeItem("admin_user");
                    router.push("/login");
                } else {
                    setAuthorized(true);
                }
            } catch (err) {
                localStorage.removeItem("admin_user");
                router.push("/login");
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Show nothing while checking (or a loader)
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
