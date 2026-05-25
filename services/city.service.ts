import { api } from "@/lib/api";
import { CityInput } from "@/lib/validation/city.validation";
import { AxiosError } from "axios";


export const createCityApi = async (formData: CityInput) => {
    try {
        const response = await api.post("/locations/", formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const getCitiesApi = async (page: number, limit: number, search?: string) => {
    try {
        const response = await api.get(`/locations/?page=${page}&limit=${limit}&search=${search || ""}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}


export const deleteCityApi = async (cityId: string) => {
    try {
        const response = await api.delete(`/locations/${cityId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}

export const updateCityApi = async (formData: CityInput) => {
    try {
        const { _id, ...updateData } = formData;
        const response = await api.put(`/locations/${_id}`, updateData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}


export const getCityApi = async (cityId: string) => {

    try {
        const response = await api.get(`/locations/${cityId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}


