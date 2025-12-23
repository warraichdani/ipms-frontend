import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

type CanProps = {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export const Can = ({ role, children, fallback = null }: CanProps) => {
  const { hasRole } = useAuth(); // implement hasRole in your hook

  return hasRole(role) ? <>{children}</> : <>{fallback}</>;
};