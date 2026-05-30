import { api } from "@/lib/api";

export const getCitiesPageSections = async () => {
  const response = await api.get(`/content/cities-page/sections`);
  return response.data.data;
};

export const updateCitiesPageSections = async (data: any) => {
  const response = await api.post(`/content/cities-page/sections`, data);
  return response.data;
};
