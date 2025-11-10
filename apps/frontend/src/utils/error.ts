import { AxiosError } from "axios";

/**
 * Mengambil pesan error yang ramah pengguna dari berbagai bentuk error:
 * - AxiosError dengan response.data.message
 * - Instance Error biasa
 * - Nilai unknown lain -> fallback
 */
export const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;

  if ((error as AxiosError)?.isAxiosError) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? axiosError.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};
