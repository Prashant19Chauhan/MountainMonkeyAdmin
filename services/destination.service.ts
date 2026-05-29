import { api } from "@/lib/api";
import { destinationInput } from "@/lib/validation/destination.validation";
import { AxiosError } from "axios";

export const getDestinationsApi = async (page: number, limit: number, search?: string) => {
    try{
        const response = await api.get(`/destinations/?page=${page}&limit=${limit}&search=${search || ""}`);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
};


export const createDestinationApi = async (formData: destinationInput) => {
    try{
        console.log("Form Data:", formData);
        const response = await api.post('/destinations/create', formData);
        console.log(response.data)
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const getDestinationApi = async (slug: string) => {
    try{
        const response = await api.get(`/destinations/${slug}`);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const updateDestinationApi = async (slug: string, formData: destinationInput) => {
    try{
        const response = await api.put(`/destinations/${slug}`, formData);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const deleteDestinationApi = async (slug: string) => {
    try{
        const response = await api.delete(`/destinations/${slug}`);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const getDestinationsPageSections = async () => {
    const response = await api.get(`/content/destinations-page/sections`);
    return response.data.data;
};

export const updateDestinationsPageSections = async (data: { customSections: any[] }) => {
    const response = await api.post(`/content/destinations-page/sections`, data);
    return response.data;
};

export const getDestinationDetailSectionsApi = async (slug: string) => {
    const response = await api.get(`/destinations/${slug}/detail-sections`);
    return response.data.data;
};

export const updateDestinationDetailSectionsApi = async (slug: string, data: { customSections: any[] }) => {
    const response = await api.post(`/destinations/${slug}/detail-sections`, data);
    return response.data;
};