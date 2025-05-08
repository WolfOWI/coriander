import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { healthCheckAPI } from "../../services/api.service";

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
    console.log("🔍 Modal: Checking server status...");
    setIsChecking(true);
    setCheckCount((prev) => prev + 1);
    try {
      await healthCheckAPI.checkHealth();
      console.log("✅ Modal: Server is awake");
      setIsServerAwake(true);
      // Add a small delay to show the "Server is back online" state
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("⏰ Showing 'Server is back online' state");
      // Then wait another 2 seconds before closing
      setTimeout(() => {
        console.log("⏰ Delay complete, closing modal");
        setIsChecking(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.log("💤 Modal: Server is sleeping");
      // Add a small delay before showing sleeping state
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsServerAwake(false);
      setIsChecking(false);
    }
  };

  // When modal becomes visible, start checking server status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVisible) {
      console.log("👁️ Modal became visible, starting checks");
      setCheckCount(0); // Reset check count when modal becomes visible
      checkServerStatus();
      // Check every 10 seconds while modal is visible
      interval = setInterval(checkServerStatus, 10000);
    }
    return () => {
      if (interval) {
        console.log("👋 Modal cleanup - clearing interval");
        clearInterval(interval);
      }
    };
  }, [isVisible]);

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      closable={!isChecking}
      maskClosable={!isChecking}
    >
      <div className="flex flex-col items-center justify-center p-6 gap-4 text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <h3 className="text-lg">The server is not responding. It is either offline or sleeping.</h3>
        <Spin size="large" spinning={isChecking} />
        <h3 className="text-lg font-semibold">
          {isChecking
            ? checkCount === 1
              ? "Checking Server Status..."
              : `Let's Try Again (Attempt ${checkCount})...`
            : isServerAwake
            ? "Server is back online!"
            : "Server is currently sleeping"}
        </h3>
        <p className="text-gray-600 text-center">
          {!isServerAwake &&
            !isChecking &&
            "The server is waking up. This may take up to 50 seconds..."}
        </p>
      </div>
    </Modal>
  );
};

export default ServerStatusModal;
