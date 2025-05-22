import React, { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";
import { healthCheckAPI } from "../services/api.service";
import Lottie from "lottie-react";
import plane from "../assets/lottie/plane.json";
import successPop from "../assets/lottie/successPop.json";

interface StartupLoadingScreenProps {
  onServerAwake: () => void;
}

const StartupLoadingScreen: React.FC<StartupLoadingScreenProps> = ({ onServerAwake }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Function to check if server is awake using lightweight health check
  const checkServerStatus = useCallback(async () => {
    // Don't check if we're already in the process of transitioning
    if (fadeOut) return;

    setIsChecking(true);
    setCheckCount((prev) => prev + 1);
    try {
      await healthCheckAPI.checkHealth();
      console.log("✅ Startup: Server is awake");
      setIsServerAwake(true);
      setIsChecking(false);

      // Start fade out after showing success for 1.5 seconds
      setTimeout(() => {
        setFadeOut(true);
      }, 1500);

      // Wait 3 seconds total before calling onServerAwake (1.5s display + 1.5s fade)
      setTimeout(() => {
        onServerAwake();
      }, 3000);
    } catch (error) {
      console.log("💤 Startup: Server is sleeping");
      setIsServerAwake(false);
      setTimeout(() => {
        setIsChecking(false);
      }, 2500);
    }
  }, [fadeOut, onServerAwake]);

  // When component mounts, start checking server status
  useEffect(() => {
    setCheckCount(0);
    checkServerStatus();

    // Check every 10 seconds while waiting for server
    const interval = setInterval(checkServerStatus, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [checkServerStatus]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-white transition-opacity duration-1500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: "1500ms" }}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {!isServerAwake ? (
          <div>
            <div className="flex items-center justify-center h-40 pb-10">
              <Lottie animationData={plane} loop={true} style={{ width: 400, height: 400 }} />
            </div>
            <h1 className="text-4xl font-bold">Please Wait</h1>
            <h3 className="text-2xl font-semi-bold mt-2">We're connecting to the server.</h3>

            {isChecking ? (
              <div className="h-20 flex items-center justify-center gap-2">
                <Spin />
                <p className="text-zinc-500 text-center">
                  {checkCount === 1
                    ? "Checking Server Status..."
                    : `Attempting to connect (#${checkCount})...`}
                </p>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center">
                <p className="text-zinc-500 text-center px-10">This can take up to 50 seconds.</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center h-40">
              <Lottie animationData={successPop} loop={false} style={{ width: 160, height: 160 }} />
            </div>
            <h1 className="text-4xl font-bold">Done!</h1>
            <h3 className="text-2xl font-semi-bold mt-2">The system is ready.</h3>
            <div className="h-20 flex items-center justify-center">
              <p className="text-zinc-500 text-center px-10">Thank you for your patience.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupLoadingScreen;
