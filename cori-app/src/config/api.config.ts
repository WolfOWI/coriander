const API_CONFIG = {
  // TODO: Just temporary to check if .ENV file is working
  BASE_URL: process.env.VITE_API_URL,
  //   BASE_URL: process.env.VITE_API_URL || "http://localhost:5121/api",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
