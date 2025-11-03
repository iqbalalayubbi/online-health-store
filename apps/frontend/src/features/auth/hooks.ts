import { useMutation } from "@tanstack/react-query";
import { login, register } from "./api";
import { useAuthStore } from "../../stores/authStore";

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
    },
  });
};

