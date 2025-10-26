import axios from "axios";
import { useGlobalStore } from "../../core/zustand/global_state";

export const ApiIntance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API endpoint
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for cross-site requests
});

// Add a request interceptor to inject the token
ApiIntance.interceptors.request.use(
  (config) => {
    const token = useGlobalStore.getState().auth.token; // 🔥 Gets current token from Zustand
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
