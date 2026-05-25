import { api } from "@/lib/api";

export const getHomeHeroSection = async () => {
    const response = await api.get(`/content/home/hero`);
    return response.data.data;
};

export const updateHomeHeroSection = async (data: any) => {
    const response = await api.post(`/content/home/hero`, data);
    return response.data;
};

// Advertisement APIs
export const getAllAdvertisements = async () => {
    const response = await api.get(`/advertisement`);
    return response.data.data;
};

export const createAdvertisement = async (data: any) => {
    const response = await api.post(`/advertisement`, data);
    return response.data;
};

export const updateAdvertisement = async (id: string, data: any) => {
    const response = await api.patch(`/advertisement/${id}`, data);
    return response.data;
};

export const deleteAdvertisement = async (id: string) => {
    const response = await api.delete(`/advertisement/${id}`);
    return response.data;
};
