import { api } from "@/lib/api";

export const getFaqPageSections = async () => {
  const response = await api.get(`/content/faq-page/sections`);
  return response.data.data;
};

export const updateFaqPageSections = async (data: any) => {
  const response = await api.post(`/content/faq-page/sections`, data);
  return response.data;
};
