import { AxiosError } from 'axios';

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

