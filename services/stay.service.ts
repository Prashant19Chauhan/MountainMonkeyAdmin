import { api } from "@/lib/api"
import { StayInputType } from "@/lib/validation/stay.validation"
import { AxiosError } from "axios"

export interface Stay {
    _id: string;
    name: string;
    shortDescription?: string;
    longDescription?: string;
    type?: "hotel" | "hostel" | "homestay" | "resort" | "villa";
    starRating?: number;
    destinationId?: { _id: string; name: string } | string;
    location?: {
        address?: string;
        coordinates?: { lat: number; lng: number };
        altitude?: number;
    };
    mainCity?: { _id: string; name: string } | string;
    priceRange?: { min: number; max: number };
    rooms?: any[];
    amenities?: string[];
    ratings?: { average: number; count: number };
    images?: string[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedStayResponse {
    success: boolean;
    data: Stay[];
    total: number;
    page: number;
    totalPages: number;
    count: number;
}

export const createStayApi = async(data: StayInputType) => {
    try{
        console.log(data)
        const response = await api.post("/stay", data)
        return response.data
    } catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("An unexpected error occurred while creating stay.");
    }
}

export const updateStayApi = async(slug: string, data: StayInputType) => {
    try{
        const response = await api.put(`/stay/${slug}`, data)
        return response.data
    } catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("An unexpected error occurred while updating stay.");
    }
}

export const getAllStaysApi = async (page: number, limit: number, search?: string) => {
  try {
    const res = await api.get(`/stay?page=${page}&limit=${limit}&search=${search || ""}`)
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error("An unexpected error occurred while fetching stays.")
  }
}

export const getStayByIdApi = async (slug: string) => {
  try {
    const res = await api.get(`/stay/${slug}`)
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error
    }
    throw new Error("An unexpected error occurred while fetching stay.")
  }
}

export const deleteStayApi = async (slug: string) => {
    try {
        const res = await api.delete(`/stay/${slug}`)
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error
        }
        throw new Error("An unexpected error occurred while deleting stay.")
    }
}

export const updateStayCurrentPriceApi = async (slug: string, roomPrices: { typeOfRoom: string; currentPrice: number }[]) => {
    try {
        const response = await api.patch(`/stay/${slug}/current-price`, { roomPrices });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error;
        }
        throw new Error("An unexpected error occurred while updating current price.");
    }
};

export const getStaysPageSections = async () => {
    const response = await api.get(`/content/stays-page/sections`);
    return response.data.data;
};

export const updateStaysPageSections = async (data: { customSections: any[] }) => {
    const response = await api.post(`/content/stays-page/sections`, data);
    return response.data;
};