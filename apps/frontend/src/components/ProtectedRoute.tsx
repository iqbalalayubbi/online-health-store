import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "CUSTOMER" | "SELLER" | "ADMIN" | ("CUSTOMER" | "SELLER" | "ADMIN")[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // No role requirement specified, just check if authenticated
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has required role
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!allowedRoles.includes(user.role)) {
    // Force redirect to login so user re-auths with correct role rather than landing homepage with stale assumptions
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
