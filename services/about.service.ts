import { api } from "@/lib/api";

export const getAboutPageSections = async () => {
  const response = await api.get(`/content/about-page/sections`);
  return response.data.data;
};

export const updateAboutPageSections = async (data: any) => {
  const response = await api.post(`/content/about-page/sections`, data);
  return response.data;
};
