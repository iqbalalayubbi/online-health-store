import { type ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { apiClient } from "../services/apiClient";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common.Authorization;
    }
  }, [token]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
