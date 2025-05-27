import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  healthCheckAPI,
  setServerStatusCheck,
  empUserAPI,
  equipmentAPI,
} from "../services/api.service";
import { AxiosResponse } from "axios";

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
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [hasShownOfflineModal, setHasShownOfflineModal] = useState(false);

  // Function to check if server is awake using lightweight health check
  const checkServerStatus = useCallback(async () => {
    if (isSuccessState) return; // Don't check if we're in success state

    // Don't interfere if the modal is already showing (server is sleeping)
    // Let the modal handle its own timing
    if (isServerSleeping) {
      return;
    }

    try {
      await healthCheckAPI.checkHealth();
      // Don't do anything here - let other components handle their own logic
    } catch (error) {
      setServerSleeping(true);
      setHasShownOfflineModal(true); // Set the flag when we show the offline modal
    }
  }, [isSuccessState, hasShownOfflineModal, isServerSleeping]);

  // Register the check function with the API service
  useEffect(() => {
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
