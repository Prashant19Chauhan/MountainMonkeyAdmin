import { api } from "@/lib/api";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "Pending" | "Reviewed" | "Completed";
  createdAt: string;
  updatedAt: string;
}

export const fetchContactMessagesApi = async (params?: { status?: string }) => {
  const response = await api.get(`/contact/messages`, { params });
  return response.data;
};

export const updateContactMessageStatusApi = async (id: string, status: string) => {
  const response = await api.patch(`/contact/messages/${id}`, { status });
  return response.data;
};

export const deleteContactMessageApi = async (id: string) => {
  const response = await api.delete(`/contact/messages/${id}`);
  return response.data;
};
