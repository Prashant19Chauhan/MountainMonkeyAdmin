import { ActivityInput } from "@/lib/validation/activity.validation"
import { api } from "@/lib/api"
import { AxiosError } from "axios"

export interface Activity {
    _id: string;
    name: string;
    destinationId?: { _id: string; name: string } | string;
    type?: string;
    category?: string[];
    shortDescription?: string;
    longDescription?: string;
    location?: {
        address?: string;
        coordinates?: { lat: number; lng: number };
        mainCity?: { _id: string; name: string } | string;
    };
    timing?: {
        openingTime?: string;
        closingTime?: string;
        duration?: number;
    };
    bestTimeToVisit?: string;
    pricing?: {
        price?: number;
        currency?: string;
        isFree?: boolean;
    };
    difficultyLevel?: "easy" | "moderate" | "hard";
    ageLimit?: { min: number; max: number };
    requiredItems?: string[];
    safetyInfo?: {
        precautions?: string[];
        riskLevel?: "low" | "medium" | "high";
    };
    ratings?: { average: number; count: number };
    images?: string[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedActivityResponse {
    success: boolean;
    message: string;
    data: {
        activities: Activity[];
        totalPages: number;
        currentPage: number;
        totalActivities: number;
    }
}

export interface SingleActivityResponse {
    success: boolean;
    message: string;
    data: Activity;
}


const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message || "API request failed");
    }
    throw new Error("An unexpected error occurred");
}

export const createActivityApi = async (data: ActivityInput): Promise<SingleActivityResponse> => {
    try {
        const response = await api.post("/activity", data)
        return response.data
    } catch (error) {
        return handleApiError(error);
    }
}

export const updateActivityApi = async (slug: string, data: ActivityInput): Promise<SingleActivityResponse> => {
    try {
        const response = await api.put(`/activity/${slug}`, data)
        return response.data
    } catch (error) {
        return handleApiError(error);
    }
}

export const deleteActivityApi = async (slug: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.delete(`/activity/${slug}`)
        return response.data
    } catch (error) {
        return handleApiError(error);
    }
}

export const getActivityByIdApi = async (slug: string): Promise<SingleActivityResponse> => {
    try {
        const response = await api.get(`/activity/${slug}`)
        return response.data
    } catch (error) {
        return handleApiError(error);
    }
}

export const getAllActivitiesApi = async (page: number, limit: number, search?: string): Promise<PaginatedActivityResponse> => {
    try {
        const response = await api.get("/activity", {
            params: {
                page,
                limit,
                search: search || undefined
            }
        })
        return response.data
    } catch (error) {
        return handleApiError(error);
    }
}

export const updateActivityCurrentPriceApi = async (slug: string, currentPrice: number): Promise<SingleActivityResponse> => {
    try {
        const response = await api.patch(`/activity/${slug}/current-price`, { currentPrice })
        return response.data
    } catch (error) {
        return handleApiError(error);
    }
}
