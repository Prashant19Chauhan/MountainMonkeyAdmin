import { api } from "@/lib/api";

export const getAllTestimonials = async (status?: string) => {
    const response = await api.get(`/testimonial`, {
        params: { status }
    });
    return response.data.data;
};

export const updateTestimonialStatus = async (id: string, data: { status: 'approved' | 'rejected' | 'pending', featured?: boolean, rejectionReason?: string }) => {
    const response = await api.patch(`/testimonial/${id}/status`, data);
    return response.data.data;
};

export const deleteTestimonial = async (id: string) => {
    const response = await api.delete(`/testimonial/${id}`);
    return response.data;
};
