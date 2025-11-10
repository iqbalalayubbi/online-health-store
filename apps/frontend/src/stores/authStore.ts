/**
 * Zustand store untuk autentikasi pengguna.
 *
 * Menyimpan token JWT dan informasi user terautentikasi serta menyediakan helper untuk:
 * - setAuth: menyetel token+user saat login berhasil
 * - clearAuth: menghapus state auth (logout lokal)
 * - logoutAndRedirect: logout kemudian navigasi ke /login
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

/** Informasi user yang disimpan setelah login. */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/** Bentuk state dan aksi pada auth store. */
interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (payload: { token: string; user: AuthUser }) => void;
  clearAuth: () => void;
  logoutAndRedirect: (navigate: (to: string, options?: { replace?: boolean }) => void) => void;
}

/** Hook Zustand untuk mengakses/memodifikasi state autentikasi. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      logoutAndRedirect: (navigate) => {
        set({ token: null, user: null });
        navigate("/login", { replace: true });
      },
    }),
    {
      name: "auth-store",
    },
  ),
);
