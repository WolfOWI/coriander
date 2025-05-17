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

// Global variable to store the server status check function
let serverStatusCheck: (() => Promise<void>) | null = null;
// Flag to prevent recursive health checks
let isCheckingHealth = false;

// Function to set the server status check function
export const setServerStatusCheck = (checkFn: () => Promise<void>) => {
  console.log("🔧 Setting up server status check function");
  serverStatusCheck = checkFn;
};

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get the authentication token from localStorage
    // localStorage is a browser storage that persists even after page refresh
    const token = localStorage.getItem("authToken");

    // If we have a token, add it to the request headers
    if (token) {
      // Add the token in the Authorization header using Bearer scheme
      // This is a common way to send authentication tokens
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check server status before making the request, but don't block the request
    // and prevent recursive health checks
    if (serverStatusCheck && !isCheckingHealth) {
      console.log("🔄 Initiating server status check");
      isCheckingHealth = true;
      serverStatusCheck()
        .catch((error) => {
          // Ignore errors from health check
          console.log("⚠️ Server status check error:", error.message);
        })
        .finally(() => {
          console.log("🏁 Server status check completed");
          isCheckingHealth = false;
        });
    } else if (isCheckingHealth) {
      console.log("⏳ Skipping health check - one already in progress");
    }

    // Return the modified config
    return config;
  },
  (error) => {
    // Reject the promise with the error
    console.log("❌ Request interceptor error:", error.message);
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

// API SERVICE METHODS
// ############################################################
// EMPUSER API (EMPLOYEE + USER)
// ------------------------------------------------------------
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

  /**
   * Edit an emp user by their ID
   * @param id - The employee's ID (must be a number)
   * @param data - The data object to update the employee with (can be partial)
   * @returns Promise containing the API response
   */
  updateEmpUserById: (id: string, data: object): Promise<AxiosResponse> =>
    apiClient.put(`/EmpUser/edit-by-id/${id}`, data),

  /**
   * Get all emp users with equipment stats (compared to a specific equipment - for "hasItemOfSameEquipCat")
   * @param comparedEquipId - The equipment's ID to compare against
   * @returns Promise containing the API response
   */
  getAllEmpUsersAndEquipStats: (comparedEquipId: number): Promise<AxiosResponse> =>
    apiClient.get(`/EmpUser/equip-stats/${comparedEquipId}`),
};
// ------------------------------------------------------------

// EMPLOYEE API (ONLY EMPLOYEE, EXCL. USER)
// ------------------------------------------------------------
export const employeeAPI = {
  /**
   * Toggle suspension status of an employee
   * @param id - The employee's ID
   * @returns Promise containing the API response
   */
  toggleEmpSuspension: (id: string): Promise<AxiosResponse> =>
    apiClient.post(`/Employee/suspension-toggle/${id}`),

  /**
   * Delete an employee by their ID
   * @param id - The employee's ID
   * @returns Promise containing the API response
   */
  terminateEmpById: (id: string): Promise<AxiosResponse> => apiClient.delete(`/Employee/${id}`),
};
// ------------------------------------------------------------

// PAGE SPECIFIC GET DATA API
// ------------------------------------------------------------
export const pageAPI = {
  /**
   * Fetches all details for an employee including equipment, leave balances, ratings, and performance reviews
   * @param id - The employee's ID
   * @returns Promise containing the API response
   */
  getAdminEmpDetails: (id: string): Promise<AxiosResponse> =>
    apiClient.get(`/Page/admin-emp-details/${id}`),

  /**
   * Fetches the list of all employees for the admin employee management page
   * @returns Promise containing the API response
   */
  getAdminEmpManagement: (): Promise<AxiosResponse> => apiClient.get("/Page/admin-emp-management"),

  /**
   * Fetches the list of all employees for the employee profile page
   * @returns Promise containing the API response
   */
  getEmployeeProfile: (id: string): Promise<AxiosResponse> =>
    apiClient.get(`/Page/employee-profile/${id}`),

  /**
   * getAdminDashboardData - Fetches data for the admin dashboard
   * @returns Promise containing the API response
   */
  getAdminDashboardData: (): Promise<AxiosResponse> => apiClient.get("/Page/admin-dashboard"),
};

// EQUIPMENT API
// ------------------------------------------------------------
export const equipmentAPI = {
  /**
   * Fetches all equipment items (assigned to employees and unassigned)
   * @returns Promise containing the API response
   */
  getAllEquipItems: (): Promise<AxiosResponse> => apiClient.get("/Equipment"),

  /**
   * Fetches all unassigned equipment items
   * @returns Promise containing the API response
   */
  getAllUnassignedEquipItems: (): Promise<AxiosResponse> => apiClient.get("/Equipment/unassigned"),

  /**
   * Create a single or multiple equipment items (based on the request body)
   * @param data - An array of objects containing the equipment data (can be just one object)
   * @returns The created equipment items
   */
  createEquipItemOrItems: (data: object): Promise<AxiosResponse> =>
    apiClient.post("/Equipment/CreateEquipmentItems", data),

  /**
   * Edit / update an equipment item by its ID with one or more fields
   * @param id - The equipment's ID
   * @param data - An object containing the fields to update
   * @returns The updated equipment item
   */
  editEquipItemById: (id: number, data: object): Promise<AxiosResponse> =>
    apiClient.put(`/Equipment/${id}`, data),

  /**
   * Assign a single or multiple equipment items to an employee
   * @param empId - The employee's ID
   * @param equipIds - An array of equipment IDs
   * @returns A message confirming the assignment
   */
  assignEquipItemOrItemsToEmp: (empId: number, equipIds: number[]): Promise<AxiosResponse> =>
    apiClient.post(`/Equipment/assign-equipment/${empId}`, equipIds),

  /**
   * Unlink an equipment item from an employee
   * @param id - The equipment's ID
   * @returns Promise containing the API response
   */
  unlinkEquipItemFromEmp: (id: number): Promise<AxiosResponse> =>
    apiClient.delete(`/Equipment/unlink/${id}`),
  // Note: Although this is a DELETE request, it is not actually deleting the equipment item
  // It is only unlinking it from the employee
  // We are "Deleting" the link between the equipment and the employee (following good conventions)

  /**
   * Mass unlink all equipment items from an employee by their id.
   * @param id - The employee's ID
   * @returns Promise containing the API response
   */
  massUnlinkEquipItemsFromEmp: (id: number): Promise<AxiosResponse> =>
    apiClient.delete(`/Equipment/mass-unlink/${id}`),

  /**
   * Deletes an equipment item by its ID
   * @param id - The equipment's ID
   * @returns Promise containing the API response
   */
  deleteEquipItemById: (id: number): Promise<AxiosResponse> => apiClient.delete(`/Equipment/${id}`),
};

// ------------------------------------------------------------

// Add a lightweight health check endpoint
export const healthCheckAPI = {
  /**
   * Simple health check that makes a GET request to the health endpoint
   * @returns Promise containing the API response
   */
  checkHealth: (): Promise<AxiosResponse> => {
    console.log("🏥 Starting health check request");
    return apiClient
      .get("/health", {
        timeout: 5000, // 5 second timeout for health checks
        headers: {
          // Skip auth token for health checks
          Authorization: undefined,
        },
      })
      .then((response) => {
        console.log("✅ Health check successful");
        return response;
      })
      .catch((error) => {
        console.log("❌ Health check failed:", error.message);
        throw error;
      });
  },
};

// IMAGE API
// ------------------------------------------------------------
export const imageAPI = {
  /**
   * Uploads a general image file to the server
   * @param file - The file to upload
   * @returns Promise containing the API response with the image URL
   */
  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post("/Image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!data.imageUrl) {
      throw new Error("No image URL returned from server");
    }

    // Remove any leading slash and 'uploads' if present
    const fileName = data.imageUrl.replace(/^\//, "").replace(/^uploads\//, "");
    // Return just the relative path
    return `/uploads/${fileName}`;
  },

  /**
   * Updates a user's profile picture by uploading a new file and updating the user's profilePicture field
   * @param userId - The ID of the user
   * @param file - The new profile picture file
   * @returns Promise containing the API response with the image URL
   */
  updateProfilePicture: async (userId: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post(`/Image/profile-picture/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!data.imageUrl) {
      throw new Error("No image URL returned from server");
    }

    return data.imageUrl;
  },

  /**
   * Removes a user's profile picture by deleting the file and setting the user's profilePicture field to null
   * @param userId - The ID of the user
   * @returns Promise containing the API response
   */
  removeProfilePicture: async (userId: number): Promise<void> => {
    await apiClient.delete(`/Image/profile-picture/${userId}`);
  },
};
// ------------------------------------------------------------
/* EmpLeaveRequests API */
export const empLeaveRequestsAPI = {
  /**
   * Fetches all pending leave requests
   * @returns Promise containing the API response
   */
  getPendingLeaveRequests: (): Promise<AxiosResponse> =>
    apiClient.get('/EmpLeaveRequest/GetAllPending'),

    /**
   * Fetches all approved leave requests
   * @returns Promise containing the API response
   */
    getApprovedLeaveRequests: (): Promise<AxiosResponse> =>
      apiClient.get('/EmpLeaveRequest/GetAllApproved'),

      /**
   * Fetches all rejected leave requests
   * @returns Promise containing the API response
   */
  getRejectedLeaveRequests: (): Promise<AxiosResponse> =>
    apiClient.get('/EmpLeaveRequest/GetAllRejected'),
}

// Performance Review API
// ------------------------------------------------------------
export const performanceReviewsAPI = {
  /**
   * Fetches all performance reviews for a specific employee
   * @param empId - The employee's ID
   * @returns Promise containing the API response
   */

  /**
   * Creates a new performance review for an employee
   * @param empId - The employee's ID
   * @param data - The performance review data
   * @returns Promise containing the API response
   */
  CreatePerformanceReview: (data: object): Promise<AxiosResponse> =>
    apiClient.post(`/PerformanceReview/CreatePerformanceReview`, data),

  /**
   * Gets all upcoming performance reviews
   */
  GetAllUpcomingPrm: (): Promise<AxiosResponse> =>
    apiClient.get('/PerformanceReview/GetAllUpcomingPrm'),
  
  /**
   * Updates an existing performance review by its ID
   * @param id - The performance review's ID
   * @param data - The updated performance review data
   * @returns Promise containing the API response
   */
  UpdatePerformanceReview: (id: number, data: object): Promise<AxiosResponse> =>
    apiClient.put(`/PerformanceReview/UpdatePerformanceReview/${id}`, data),

  

}


// ############################################################
// Export the configured axios instance
export default apiClient;
