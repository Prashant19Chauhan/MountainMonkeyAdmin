import { api } from "@/lib/api";

export const getThemeMetaData = async () => {
    const response = await api.get(`/theme-meta-data`);
    return response.data.data;
};

export const updateThemeMetaData = async (data: any) => {
    const response = await api.post(`/theme-meta-data`, data);
    return response.data;
};

export const deleteMood = async (name: string) => {
    const response = await api.delete(`/theme-meta-data/mood/${name}`);
    return response.data;
};
