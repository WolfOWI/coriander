import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { healthCheckAPI } from "../../services/api.service";
import Lottie from "lottie-react";
import sleepingCat from "../../assets/lottie/sleepingCat.json";
import successPop from "../../assets/lottie/successPop.json";

interface ServerStatusModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ServerStatusModal: React.FC<ServerStatusModalProps> = ({ isVisible, onClose }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Function to check if server is awake using lightweight health check
  const checkServerStatus = async () => {
    setIsChecking(true);
    setCheckCount((prev) => prev + 1);
    try {
      await healthCheckAPI.checkHealth();
      console.log("✅ Modal: Server is awake");
      setIsServerAwake(true);
      setIsChecking(false);
    } catch (error) {
      console.log("💤 Modal: Server is sleeping");
      setIsServerAwake(false);
      setTimeout(() => {
        setIsChecking(false);
      }, 2500);
    }
  };

  // When modal becomes visible, start checking server status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVisible) {
      setCheckCount(0); // Reset check count when modal becomes visible
      checkServerStatus();
      // Check every 10 seconds while modal is visible
      interval = setInterval(checkServerStatus, 10000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVisible]);

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
        ) : (
          <div>
            <h1 className="text-4xl font-bold">Connected!</h1>
            <div className="flex items-center justify-center h-40">
              <Lottie animationData={successPop} loop={false} style={{ width: 160, height: 160 }} />
            </div>
            <h3 className="text-2xl font-semi-bold mt-2">
              The system is back online & has connected.
            </h3>
            <div className="h-20 flex items-center justify-center">
              <p className="text-gray-600 text-center px-10">Thank you for your patience.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ServerStatusModal;
