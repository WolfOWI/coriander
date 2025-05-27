import React, { useEffect, useState, useCallback, useRef } from "react";
import { Spin } from "antd";
import { healthCheckAPI, empUserAPI } from "../services/api.service";
import Lottie from "lottie-react";
import plane from "../assets/lottie/plane.json";
import datasearch from "../assets/lottie/datasearch.json";
import confetti from "../assets/lottie/confetti.json";
import logo from "../assets/logos/cori_logo_green.png";

interface StartupLoadingScreenProps {
  onServerAwake: () => void;
}

const StartupLoadingScreen: React.FC<StartupLoadingScreenProps> = ({ onServerAwake }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [dataCheckCount, setDataCheckCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Refs to access current state values in interval
  const isServerAwakeRef = useRef(isServerAwake);
  const isDataReadyRef = useRef(isDataReady);
  const fadeOutRef = useRef(fadeOut);

  // Update refs when state changes
  useEffect(() => {
    isServerAwakeRef.current = isServerAwake;
  }, [isServerAwake]);

  useEffect(() => {
    isDataReadyRef.current = isDataReady;
  }, [isDataReady]);

  useEffect(() => {
    fadeOutRef.current = fadeOut;
  }, [fadeOut]);

  // Function to check if server can handle data operations
  const checkDataConnection = useCallback(async () => {
    // Don't check if we're already in the process of transitioning
    if (fadeOutRef.current) return;

    setIsChecking(true);
    setDataCheckCount((prev) => prev + 1);
    try {
      await empUserAPI.getAllEmpUsers();
      setIsDataReady(true);
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
      setIsDataReady(false);
      setTimeout(() => {
        setIsChecking(false);
      }, 2500);
    }
  }, [onServerAwake]);

  // Function to check if server is awake using lightweight health check
  const checkServerStatus = useCallback(async () => {
    // Don't check if we're already in the process of transitioning or if server is already awake
    if (fadeOutRef.current || isServerAwakeRef.current) return;

    setIsChecking(true);
    setCheckCount((prev) => prev + 1);
    try {
      await healthCheckAPI.checkHealth();
      setIsServerAwake(true);
      setIsChecking(false);

      // Once server is awake, start checking data connection
      setTimeout(() => {
        checkDataConnection();
      }, 1000);
    } catch (error) {
      setIsServerAwake(false);
      setTimeout(() => {
        setIsChecking(false);
      }, 2500);
    }
  }, [checkDataConnection]);

  // When component mounts, start checking server status
  useEffect(() => {
    setCheckCount(0);
    setDataCheckCount(0);
    checkServerStatus();

    // Check every 10 seconds while waiting for server
    const interval = setInterval(() => {
      if (!isServerAwakeRef.current) {
        checkServerStatus();
      } else if (!isDataReadyRef.current) {
        checkDataConnection();
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array to run only on mount

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
        ) : !isDataReady ? (
          <div>
            <div className="flex items-center justify-center h-40 pb-10">
              <Lottie animationData={datasearch} loop={true} style={{ width: 800, height: 400 }} />
            </div>
            <h1 className="text-4xl font-bold">Connected</h1>
            <h3 className="text-2xl font-semi-bold mt-2">Preparing data services...</h3>

            {isChecking ? (
              <div className="h-20 flex items-center justify-center gap-2">
                <Spin />
                <p className="text-zinc-500 text-center">
                  {dataCheckCount === 1
                    ? "Testing data connection..."
                    : `Verifying data services...`}
                </p>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center">
                <p className="text-zinc-500 text-center px-10">
                  Ensuring all services are ready...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center relative h-40">
              <h1 className="text-4xl font-bold">Welcome to</h1>
              <Lottie
                animationData={confetti}
                loop={false}
                style={{
                  width: 500,
                  height: 500,
                  position: "absolute",
                  top: "-20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
              <img src={logo} alt="Coriander Logo" className="w-80 mt-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupLoadingScreen;
