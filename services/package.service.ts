import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { CreatePackageFormValues } from "@/lib/validation/package.validation";

export interface GetPackagesParams {
    page?: number;
    limit?: number;
    destinationId?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
}

export const getPackagesApi = async (params: GetPackagesParams = { page: 1, limit: 10 }) => {
    try {
        const response = await api.get('/packages', { params });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const createPackageApi = async (formData: CreatePackageFormValues) => {
    try {
        const response = await api.post('/packages', formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const getPackageApi = async (slug: string) => {
    try {
        const response = await api.get(`/packages/${slug}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const updatePackageApi = async (slug: string, formData: Partial<CreatePackageFormValues>) => {
    try {
        const response = await api.put(`/packages/${slug}`, formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const deletePackageApi = async (slug: string) => {
    try {
        const response = await api.delete(`/packages/${slug}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const updatePackageCurrentPriceApi = async (slug: string, currentPrice: number) => {
    try {
        const response = await api.patch(`/packages/${slug}/current-price`, { currentPrice });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const getPackagesPageSections = async () => {
    const response = await api.get(`/content/packages-page/sections`);
    return response.data.data;
};

export const updatePackagesPageSections = async (data: { customSections: any[] }) => {
    const response = await api.post(`/content/packages-page/sections`, data);
    return response.data;
};
