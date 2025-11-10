import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/authStore";

/**
 * Komponen guard untuk route yang memerlukan autentikasi / peran tertentu.
 *
 * Behavior:
 * - Jika belum login: redirect ke /login dengan state.from untuk kembali setelah login.
 * - Jika `requiredRole` diberikan: hanya izinkan user dengan peran tersebut (bisa array).
 * - Jika peran tidak cocok: redirect ke /login (memaksa re-autentikasi agar session lama tidak dipakai).
 */

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
