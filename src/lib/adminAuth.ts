// Shared JWT helpers for the admin portal.
// All admin API calls must include the Bearer token returned at login.

const TOKEN_KEY = "admin_token";

/** Retrieve the stored admin JWT, or null if not logged in. */
export const getAdminToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

/** Save the JWT returned by /api/login. */
export const saveAdminToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

/** Remove both token and user data on logout. */
export const clearAdminSession = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("admin_user");
};

/**
 * Returns headers with the Authorization Bearer token included.
 * Use this for every admin API fetch call, e.g.:
 *
 *   fetch(`${API_URL}/api/users`, { headers: adminAuthHeaders() })
 */
export const adminAuthHeaders = (): Record<string, string> => {
    const token = getAdminToken();
    return token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
};

/**
 * Checks whether a JWT string is expired by inspecting its payload.
 * Returns true if the token is missing, malformed, or expired.
 */
export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};
