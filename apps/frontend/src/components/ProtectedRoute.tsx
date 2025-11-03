import { Navigate } from "react-router";
import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "CUSTOMER" | "SELLER" | "ADMIN" | ("CUSTOMER" | "SELLER" | "ADMIN")[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No role requirement specified, just check if authenticated
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has required role
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
