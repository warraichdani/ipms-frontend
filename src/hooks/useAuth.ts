import apiClient from "../lib/apiClient";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    email: string;
    role?: string | string[];
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}

export function useAuth() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const saveTokens = (access: string, refresh: string) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
    };

    const clearTokens = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    const getRefreshToken = () => refreshToken;

    const logout = async () => {
        try {
            if (refreshToken) {
                await apiClient.post("/auth/logout", { refreshToken });
            }
        } catch (err) {
            console.error("Logout request failed", err);
        } finally {
            clearTokens();
            window.location.href = "/login"; // redirect
        }
    };

    if (!accessToken) {
        return {
            isAuthenticated: false,
            roles: [] as string[],
            hasRole: (_: string) => false,
            saveTokens,
            clearTokens,
            getRefreshToken,
            logout,
        };
    }

    try {
        const decoded = jwtDecode<JwtPayload>(accessToken);

        const rawRoles =
            decoded.role ??
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        const roles = Array.isArray(rawRoles)
            ? rawRoles
            : rawRoles
                ? [rawRoles]
                : [];


        const hasRole = (role: string) => roles.includes(role);

        return {
            isAuthenticated: true,
            roles,
            hasRole,
            saveTokens,
            clearTokens,
            getRefreshToken,
            logout,
        };
    } catch {
        return {
            isAuthenticated: false,
            roles: [] as string[],
            hasRole: (_: string) => false,
            saveTokens,
            clearTokens,
            getRefreshToken,
            logout,
        };
    }
}