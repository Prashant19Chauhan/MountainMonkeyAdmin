import { api } from "@/lib/api";

export const getTermsPageSections = async () => {
  const response = await api.get(`/content/terms-page/sections`);
  return response.data.data;
};

export const updateTermsPageSections = async (data: any) => {
  const response = await api.post(`/content/terms-page/sections`, data);
  return response.data;
};
