import axios, { AxiosInstance, AxiosResponse } from "axios";

// Create a new 'axios instance' (with some customised settings)
// This instance will be used for all API calls
const apiClient: AxiosInstance = axios.create({
  // Set the base URL for all API requests (from .env file)
  baseURL: process.env.VITE_API_URL,

  // Timeout of 10 seconds - if a request takes longer than this, it will be cancelled
  timeout: 10000,

  // Default headers for all requests
  headers: {
    // Telling the server we're sending / receiving JSON data
    "Content-Type": "application/json",

    // CORS (Cross-Origin Resource Sharing) headers
    // These are needed when your frontend and backend are on different domains

    "Access-Control-Allow-Origin": "*", // TODO: For now, allowing all origins

    // Define which HTTP methods are allowed
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",

    // Define which headers are allowed in requests
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization",
  },

  // Enable sending cookies and authentication headers with cross-origin requests
  // This is important for maintaining user sessions
  withCredentials: true,
});

// TODO: This section might change if Ruan implements different user session management
/**
 * Request Interceptor
 * Automatically adds the authentication token to all outgoing requests
 * if a token exists in localStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get the authentication token from localStorage
    // localStorage is a browser storage that persists even after page refresh
    const token = localStorage.getItem("authToken");

    // If we have a token, add it to the request headers
    if (token) {
      // Add the token in the Authorization header using Bearer scheme
      // This is a common way to send authentication tokens
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified config
    return config;
  },
  (error) => {
    // Reject the promise with the error
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios:
 * - 401 Unauthorized: Redirects to login page and clears token
 * - Other errors: Passes through for component-level handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response?.status === 401) {
      // If user is unauthorized, remove their token
      localStorage.removeItem("authToken");

      // Redirect to the login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

/**
 * API Service Methods
 * Organized by resource type for better maintainability
 */
export const empUserAPI = {
  /**
   * Fetches all employee users from the backend
   * @returns Promise containing the API response
   */
  getAllEmpUsers: (): Promise<AxiosResponse> => apiClient.get("/EmpUser"),

  /**
   * Fetches a specific employee by their ID
   * @param id - The employee's ID (must be a number)
   * @returns Promise containing the API response
   */
  getEmpUserById: (id: string): Promise<AxiosResponse> => apiClient.get(`/EmpUser/${id}`),
};

// Export the configured axios instance for direct use if needed
export default apiClient;
