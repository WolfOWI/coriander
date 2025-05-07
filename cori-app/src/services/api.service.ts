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
    "Access-Control-Allow-Headers":
      "Origin, Content-Type, Accept, Authorization",
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
  getEmpUserById: (id: string): Promise<AxiosResponse> =>
    apiClient.get(`/EmpUser/${id}`),

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
  getAllEmpUsersAndEquipStats: (
    comparedEquipId: number
  ): Promise<AxiosResponse> =>
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
  terminateEmpById: (id: string): Promise<AxiosResponse> =>
    apiClient.delete(`/Employee/${id}`),
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
  getAdminEmpManagement: (): Promise<AxiosResponse> =>
    apiClient.get("/Page/admin-emp-management"),

  /**
   * Fetches the list of all employees for the employee profile page
   * @returns Promise containing the API response
   */
  getEmployeeProfile: (id: string): Promise<AxiosResponse> =>
    apiClient.get(`/Page/employee-profile/${id}`),
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
  getAllUnassignedEquipItems: (): Promise<AxiosResponse> =>
    apiClient.get("/Equipment/unassigned"),

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
  assignEquipItemOrItemsToEmp: (
    empId: number,
    equipIds: number[]
  ): Promise<AxiosResponse> =>
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
  deleteEquipItemById: (id: number): Promise<AxiosResponse> =>
    apiClient.delete(`/Equipment/${id}`),
};

// ------------------------------------------------------------

// ############################################################
// Export the configured axios instance
export default apiClient;
