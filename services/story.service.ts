import { api } from "@/lib/api";

export const getAllStories = async (status?: string) => {
    const response = await api.get(`/traveler-story`, {
        params: { status }
    });
    return response.data.data;
};

export const updateStoryStatus = async (id: string, status: 'approved' | 'rejected' | 'pending', rejectionReason?: string) => {
    const response = await api.patch(`/traveler-story/${id}/status`, {
        status,
        rejectionReason
    });
    return response.data.data;
};

export const deleteStory = async (id: string) => {
    const response = await api.delete(`/traveler-story/${id}`);
    return response.data;
};
