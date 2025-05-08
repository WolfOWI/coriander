import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { healthCheckAPI } from "../services/api.service";
import { setServerStatusCheck } from "../services/api.service";

// Define the shape of our context
interface ServerStatusContextType {
  isServerSleeping: boolean;
  checkServerStatus: () => Promise<void>;
  setServerSleeping: (status: boolean) => void;
}

// Create the context
const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined);

// Provider component that wraps the app
export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isServerSleeping, setServerSleeping] = useState(false);

  // Function to check if server is awake using lightweight health check
  const checkServerStatus = useCallback(async () => {
    console.log("🔍 Checking server status...");
    try {
      await healthCheckAPI.checkHealth();
      console.log("✅ Server is awake");
      setServerSleeping(false);
    } catch (error) {
      console.log("💤 Server is sleeping");
      setServerSleeping(true);
    }
  }, []);

  // Register the check function with the API service
  useEffect(() => {
    console.log("📝 Registering server status check with API service");
    setServerStatusCheck(checkServerStatus);
  }, [checkServerStatus]);

  return (
    <ServerStatusContext.Provider
      value={{ isServerSleeping, checkServerStatus, setServerSleeping }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

// Custom hook to use the server status context
export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error("useServerStatus must be used within a ServerStatusProvider");
  }
  return context;
};
