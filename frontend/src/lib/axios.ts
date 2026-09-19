import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // kalau backend pakai cookie/session
});

// Request interceptor — pasang token
api.interceptors.request.use((config) => {
  const token = useAuth().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
