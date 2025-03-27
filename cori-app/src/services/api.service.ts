import axios, { AxiosInstance, AxiosResponse } from "axios";
import API_CONFIG from "../config/api.config";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    ...API_CONFIG.HEADERS,
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization",
  },
  withCredentials: true,
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const empUserAPI = {
  getAllEmpUsers: (): Promise<AxiosResponse> => apiClient.get("/empUser"),
};

export default apiClient;
