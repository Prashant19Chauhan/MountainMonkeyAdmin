import { api } from "@/lib/api";
import { AxiosError } from "axios";
import {
  HubInput,
  OperatorInput,
  VehicleInput,
  RouteInput,
  TransferInput,
  ScheduleInput
} from "@/lib/validation/travelRoute.validation";

// Helper to standardise error handling
const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    throw error.response?.data.message || "Server error";
  }
  throw "Something went wrong";
};

// ── HUBS SERVICE ─────────────────────────────────────────────────────────────

export const createHubApi = async (formData: HubInput) => {
  try {
    const response = await api.post("/travel-route/hubs", formData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getHubsApi = async () => {
  try {
    const response = await api.get("/travel-route/hubs");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteHubApi = async (id: string) => {
  try {
    const response = await api.delete(`/travel-route/hubs/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ── OPERATORS SERVICE ──────────────────────────────────────────────────────────

export const createOperatorApi = async (formData: OperatorInput) => {
  try {
    const response = await api.post("/travel-route/operators", formData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOperatorsApi = async () => {
  try {
    const response = await api.get("/travel-route/operators");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteOperatorApi = async (id: string) => {
  try {
    const response = await api.delete(`/travel-route/operators/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ── VEHICLES SERVICE ───────────────────────────────────────────────────────────

export const createVehicleApi = async (formData: VehicleInput) => {
  try {
    const response = await api.post("/travel-route/vehicles", formData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getVehiclesApi = async () => {
  try {
    const response = await api.get("/travel-route/vehicles");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteVehicleApi = async (id: string) => {
  try {
    const response = await api.delete(`/travel-route/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ── ROUTES SERVICE ─────────────────────────────────────────────────────────────

export const createRouteApi = async (formData: RouteInput) => {
  try {
    const response = await api.post("/travel-route/routes", formData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getRoutesApi = async () => {
  try {
    const response = await api.get("/travel-route/routes");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteRouteApi = async (id: string) => {
  try {
    const response = await api.delete(`/travel-route/routes/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ── TRANSFERS SERVICE ──────────────────────────────────────────────────────────

export const createTransferApi = async (formData: TransferInput) => {
  try {
    const response = await api.post("/travel-route/transfers", formData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getTransfersApi = async () => {
  try {
    const response = await api.get("/travel-route/transfers");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteTransferApi = async (id: string) => {
  try {
    const response = await api.delete(`/travel-route/transfers/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ── SCHEDULES SERVICE ─────────────────────────────────────────────────────────

export const createScheduleApi = async (formData: ScheduleInput) => {
  try {
    const response = await api.post("/travel-route/schedules", formData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getSchedulesApi = async () => {
  try {
    const response = await api.get("/travel-route/schedules");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteScheduleApi = async (id: string) => {
  try {
    const response = await api.delete(`/travel-route/schedules/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
