import { apiClient } from "../../services/apiClient";
import { type AuthResponse } from "../../types/api";

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: "SELLER" | "CUSTOMER";
  phoneNumber?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (payload: RegisterPayload) => {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
};
