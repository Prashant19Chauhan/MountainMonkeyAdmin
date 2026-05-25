import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const token = state.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
