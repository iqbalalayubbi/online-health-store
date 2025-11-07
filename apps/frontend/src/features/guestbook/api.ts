import { apiClient } from "../../services/apiClient";
import { useAuthStore } from "../../stores/authStore";

export interface GuestbookEntry {
  id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
}

export interface CreateGuestbookPayload {
  name: string;
  email?: string;
  message: string;
}

export const submitGuestbookEntry = async (
  payload: CreateGuestbookPayload,
): Promise<GuestbookEntry> => {
  const user = useAuthStore.getState().user;
  const endpoint = user ? "/guestbook" : "/guestbook/public";
  const { data } = await apiClient.post(endpoint, payload);
  return data;
};
