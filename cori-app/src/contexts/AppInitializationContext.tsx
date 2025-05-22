import React, { createContext, useContext, useState } from "react";

interface AppInitializationContextType {
  hasCompletedInitialCheck: boolean;
  setHasCompletedInitialCheck: (value: boolean) => void;
}

const AppInitializationContext = createContext<AppInitializationContextType | undefined>(undefined);

export const AppInitializationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasCompletedInitialCheck, setHasCompletedInitialCheck] = useState(false);

  return (
    <AppInitializationContext.Provider
      value={{ hasCompletedInitialCheck, setHasCompletedInitialCheck }}
    >
      {children}
    </AppInitializationContext.Provider>
  );
};

export const useAppInitialization = () => {
  const context = useContext(AppInitializationContext);
  if (context === undefined) {
    throw new Error("useAppInitialization must be used within an AppInitializationProvider");
  }
  return context;
};
