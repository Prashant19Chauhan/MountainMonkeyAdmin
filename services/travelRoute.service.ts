import { api } from "@/lib/api";
import { TravelRouteInput } from "@/lib/validation/travelRoute.validation";
import { AxiosError } from "axios";

export const createTravelRouteApi = async (formData: TravelRouteInput) => {
    try {
        console.log(formData)
        const response = await api.post("/travel-routes/", formData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message || "Failed to create travel route";
        }
        throw "Something went wrong";
    }
}

export const getTravelRoutesApi = async () => {
    try {
        const response = await api.get("/travel-routes/allRoutes/list");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message || "Failed to fetch travel routes";
        }
        throw "Something went wrong";
    }
}

export const getTravelRouteByIdApi = async (routeId: string) => {
    try {
        const response = await api.get(`/travel-routes/${routeId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message || "Failed to fetch travel route details";
        }
        throw "Something went wrong";
    }
}

export const updateTravelRouteApi = async (formData: TravelRouteInput) => {
    try {
        const { _id, from, to, ...updateData } = formData;
        console.log(updateData)
        const response = await api.put(`/travel-routes/${_id}`, updateData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message || "Failed to update travel route";
        }
        throw "Something went wrong";
    }
}

export const deleteTravelRouteApi = async (routeId: string) => {
    try {
        const response = await api.delete(`/travel-routes/${routeId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message || "Failed to delete travel route";
        }
        throw "Something went wrong";
    }
}

export const getRoutesByDestinationApi = async (destinationId: string, fromId?: string) => {
    try {
        const url = fromId 
            ? `/travel-routes/?destinationId=${destinationId}&fromId=${fromId}`
            : `/travel-routes/?destinationId=${destinationId}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data.message || "Failed to fetch routes for destination";
        }
        throw "Something went wrong";
    }
}