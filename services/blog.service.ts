import { api } from "@/lib/api";
import { AxiosError } from "axios";

export const createBlogApi = async (formData: any) => {
    try {
        const response = await api.post("/blogs/", formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const getBlogsApi = async (page: number, limit: number, search?: string) => {
    try {
        const response = await api.get(`/blogs/?page=${page}&limit=${limit}&search=${search || ""}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const deleteBlogApi = async (blogId: string) => {
    try {
        const response = await api.delete(`/blogs/${blogId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const updateBlogApi = async (blogId: string, formData: any) => {
    try {
        const response = await api.put(`/blogs/${blogId}`, formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const getBlogApi = async (blogId: string) => {
    try {
        const response = await api.get(`/blogs/${blogId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const getBlogDetailSectionsApi = async (blogId: string) => {
    try {
        const response = await api.get(`/blogs/${blogId}/detail-sections`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const updateBlogDetailSectionsApi = async (blogId: string, customSections: any[]) => {
    try {
        const response = await api.post(`/blogs/${blogId}/detail-sections`, { customSections });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}
