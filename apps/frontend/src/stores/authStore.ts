import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (payload: { token: string; user: AuthUser }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-store",
    },
  ),
);

