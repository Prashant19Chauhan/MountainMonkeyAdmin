import { api } from "@/lib/api";
import { AxiosError } from "axios";

export interface Enquiry {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  enquiryType: 'stay' | 'package' | 'activity' | 'destination' | 'route';
  itemId: string;
  itemTitle: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  roomType?: string;
  message: string;
  scheduleDetails?: string;
  status: 'Pending' | 'Reviewed' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export const fetchEnquiriesApi = async (filters?: { enquiryType?: string; status?: string }) => {
  try {
    const params = new URLSearchParams();
    if (filters?.enquiryType) params.append('enquiryType', filters.enquiryType);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get(`/enquiry?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch enquiries");
  }
};

export const updateEnquiryStatusApi = async (id: string, status: 'Pending' | 'Reviewed' | 'Completed') => {
  try {
    const response = await api.patch(`/enquiry/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to update enquiry status");
  }
};

export const deleteEnquiryApi = async (id: string) => {
  try {
    const response = await api.delete(`/enquiry/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to delete enquiry");
  }
};
