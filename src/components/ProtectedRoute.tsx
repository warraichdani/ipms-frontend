// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  roles?: string[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, roles: userRoles } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.some((r) => userRoles.includes(r))) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}
