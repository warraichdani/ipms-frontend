// src/hooks/useAuth.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  email: string;
  role?: string | string[];
}

export function useAuth() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return {
      isAuthenticated: false,
      roles: [] as string[],
      hasRole: (_: string) => false,
    };
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const roles = Array.isArray(decoded.role)
      ? decoded.role
      : decoded.role
      ? [decoded.role]
      : [];

    const hasRole = (role: string) => roles.includes(role);

    return {
      isAuthenticated: true,
      roles,
      hasRole,
    };
  } catch {
    return {
      isAuthenticated: false,
      roles: [] as string[],
      hasRole: (_: string) => false,
    };
  }
}