import { api } from "@/lib/api";

export const getPrivacyPageSections = async () => {
  const response = await api.get(`/content/privacy-page/sections`);
  return response.data.data;
};

export const updatePrivacyPageSections = async (data: any) => {
  const response = await api.post(`/content/privacy-page/sections`, data);
  return response.data;
};
