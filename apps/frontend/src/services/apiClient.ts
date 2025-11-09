import axios from "axios";
import { useAuthStore } from "../stores/authStore";

// Normalize VITE_API_URL so production mistakes like missing protocol
// (e.g. "backend.up.railway.app/api") won't produce path like
// https://frontend.up.railway.app/backend.up.railway.app/api/... which leads to 404/405.
const rawBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000/api";
const baseURL = (() => {
  const v = (rawBase || "").trim();
  if (!v) return "http://localhost:4000/api";
  // If protocol is missing, assume https in production
  if (!/^https?:\/\//i.test(v)) {
    return `https://${v}`;
  }
  return v;
})();

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    // headers may be AxiosHeaders; use set when available
    const h = config.headers as any;
    if (typeof h?.set === "function") {
      h.set("Authorization", `Bearer ${token}`);
    } else {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export { apiClient };

// Global 401 handler: if backend says Unauthorized, clear auth and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        useAuthStore.getState().clearAuth();
      } catch {}
      // Use hard redirect to ensure app state resets fully
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);
