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

export const getDestinationApi = async (id: string) => {
    try{
        const response = await api.get(`/destinations/${id}`);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const updateDestinationApi = async (formData: destinationInput) => {
    try{
        const response = await api.put(`/destinations/${formData._id}`, formData);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const deleteDestinationApi = async (id: string) => {
    try{
        const response = await api.delete(`/destinations/${id}`);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}