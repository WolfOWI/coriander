import React, { useEffect, useState, useCallback, useRef } from "react";
import { Modal, Spin } from "antd";
import { healthCheckAPI, empUserAPI } from "../../services/api.service";
import Lottie from "lottie-react";
import sleepingCat from "../../assets/lottie/sleepingCat.json";
import datasearch from "../../assets/lottie/datasearch.json";
import successPop from "../../assets/lottie/successPop.json";

interface ServerStatusModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ServerStatusModal: React.FC<ServerStatusModalProps> = ({ isVisible, onClose }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [dataCheckCount, setDataCheckCount] = useState(0);

  // Refs to access current state values in interval
  const isServerAwakeRef = useRef(isServerAwake);
  const isDataReadyRef = useRef(isDataReady);
  const isVisibleRef = useRef(isVisible);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update refs when state changes
  useEffect(() => {
    isServerAwakeRef.current = isServerAwake;
  }, [isServerAwake]);

  useEffect(() => {
    isDataReadyRef.current = isDataReady;
  }, [isDataReady]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Function to check if server is awake using lightweight health check
  const checkServerStatus = useCallback(async () => {
    if (!isVisibleRef.current || isServerAwakeRef.current) return;

    setIsChecking(true);
    setCheckCount((prev) => prev + 1);
    try {
      await healthCheckAPI.checkHealth();
      setIsServerAwake(true);
      setIsChecking(false);

      // Once server is awake, start checking data connection
      setTimeout(async () => {
        if (!isVisibleRef.current) return;

        setIsChecking(true);
        setDataCheckCount((prev) => prev + 1);
        try {
          await empUserAPI.getAllEmpUsers();
          setIsDataReady(true);
          setIsChecking(false);

          // Clear the interval to prevent any interference
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Show success for 3 seconds, then close modal
          setTimeout(() => {
            onClose();
          }, 3000);
        } catch (error) {
          setIsDataReady(false);
          setTimeout(() => {
            setIsChecking(false);
          }, 2500);
        }
      }, 1000);
    } catch (error) {
      setIsServerAwake(false);
      setTimeout(() => {
        setIsChecking(false);
      }, 2500);
    }
  }, [onClose]);

  // When modal becomes visible, start checking server status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVisible) {
      // Reset all states when modal becomes visible
      setCheckCount(0);
      setDataCheckCount(0);
      setIsServerAwake(false);
      setIsDataReady(false);

      checkServerStatus();

      // Check every 10 seconds while modal is visible
      interval = setInterval(() => {
        if (!isServerAwakeRef.current) {
          checkServerStatus();
        } else if (!isDataReadyRef.current) {
          // Retry data connection if server is awake but data isn't ready
          if (isVisibleRef.current) {
            setIsChecking(true);
            setDataCheckCount((prev) => prev + 1);
            empUserAPI
              .getAllEmpUsers()
              .then(() => {
                setIsDataReady(true);
                setIsChecking(false);

                // Clear the interval to prevent any interference
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }

                // Show success for 3 seconds, then close modal
                setTimeout(() => {
                  onClose();
                }, 3000);
              })
              .catch(() => {
                setIsDataReady(false);
                setTimeout(() => {
                  setIsChecking(false);
                }, 2500);
              });
          }
        }
      }, 10000);

      intervalRef.current = interval;
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVisible]); // Only depend on isVisible to prevent infinite re-renders

  return (
    <Modal open={isVisible} onCancel={onClose} footer={null} closable={false}>
      <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-2xl">
        {!isServerAwake ? (
          <div>
            <h1 className="text-4xl font-bold">Oh no!</h1>
            <div className="flex items-center justify-center overflow-hidden h-40 pb-10">
              <Lottie animationData={sleepingCat} loop={true} style={{ width: 400, height: 400 }} />
            </div>
            <h3 className="text-2xl font-semi-bold mt-2">The server is offline or sleeping.</h3>

            {isChecking ? (
              <div className="h-20 flex items-center justify-center gap-2">
                <Spin />
                <p className="text-gray-600 text-center">
                  {checkCount === 1
                    ? "Checking Server Status..."
                    : `Trying Again (Attempt ${checkCount})...`}
                </p>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center">
                <p className="text-gray-600 text-center px-10">
                  Don't worry, we're waking it up. This can take up to 50 seconds.
                </p>
              </div>
            )}
          </div>
        ) : !isDataReady ? (
          <div>
            <h1 className="text-4xl font-bold">Server Connected</h1>
            <div className="flex items-center justify-center overflow-hidden h-32 mt-4">
              <Lottie animationData={datasearch} loop={true} style={{ width: 400, height: 200 }} />
            </div>
            <h3 className="text-2xl font-semi-bold mt-2">Preparing data services...</h3>

            {isChecking ? (
              <div className="h-20 flex items-center justify-center gap-2">
                <Spin />
                <p className="text-gray-600 text-center">
                  {dataCheckCount === 1
                    ? "Testing data connection..."
                    : `Verifying data services...`}
                </p>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center">
                <p className="text-gray-600 text-center px-10">
                  Ensuring all services are ready...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold">All Systems Ready!</h1>
            <div className="flex items-center justify-center h-40">
              <Lottie animationData={successPop} loop={false} style={{ width: 160, height: 160 }} />
            </div>
            <h3 className="text-2xl font-semi-bold mt-2">The system is fully operational.</h3>
            <div className="h-20 flex items-center justify-center">
              <p className="text-gray-600 text-center px-10">
                Thank you for your patience. The modal will close automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ServerStatusModal;
