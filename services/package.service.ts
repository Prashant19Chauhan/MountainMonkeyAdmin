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

export const getPackageApi = async (id: string) => {
    try {
        const response = await api.get(`/packages/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const updatePackageApi = async (id: string, formData: Partial<CreatePackageFormValues>) => {
    try {
        const response = await api.put(`/packages/${id}`, formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};

export const deletePackageApi = async (id: string) => {
    try {
        const response = await api.delete(`/packages/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data?.message || "Something went wrong";
        }
        throw "Something went wrong";
    }
};
