import { api } from "@/lib/api";

export const getAllStories = async (status?: string) => {
    const response = await api.get(`/traveler-story`, {
        params: { status }
    });
    return response.data.data;
};

export const updateStoryStatus = async (
    id: string, 
    status: 'approved' | 'rejected' | 'pending', 
    rejectionReason?: string,
    slug?: string,
    metaData?: { title?: string; description?: string; keywords?: string }
) => {
    const response = await api.put(`/traveler-story/${id}/status`, {
        status,
        rejectionReason,
        slug,
        metaData
    });
    return response.data.data;
};

export const checkSlugAvailability = async (slug: string, excludeId?: string) => {
    const response = await api.get(`/traveler-story/check-slug`, {
        params: { slug, excludeId }
    });
    return response.data.data;
};

export const deleteStory = async (id: string) => {
    const response = await api.delete(`/traveler-story/${id}`);
    return response.data;
};
