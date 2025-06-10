import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Authentication
import {
  fullGoogleSignIn,
  fullEmailLogin,
  handleExistingLoginRedirect,
} from "../../services/authService";

// Styling and UI Components
import { Form, Input, message, Spin } from "antd";
import GoogleIcon from "@mui/icons-material/Google";
import BackgroundImage from "../../assets/images/Auth_Background.png";
import Logo from "../../assets/logos/cori_logo_green.png";

// Child Components
import UnlinkedMessage from "../../components/auth/UnlinkedMessage";
import CoriBtn from "../../components/buttons/CoriBtn";

// Define the structure of the electronAPI if it's available on the window
declare global {
  interface Window {
    electronAPI?: {
      startGoogleOAuth: () => void;
      onGoogleToken: (callback: (idToken: string) => void) => () => void; // Assume it returns a cleanup function
    };
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "login";

  const [showUnlinkedMessage, setShowUnlinkedMessage] = useState(false);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [showAdminBtn, setShowAdminBtn] = useState(false);

  // Effect for handling keyboard shortcuts
  useEffect(() => {
    const handleKeyCombo = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "a") {
        setShowAdminBtn((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyCombo);
    // Cleanup function to remove the event listener
    return () => document.removeEventListener("keydown", handleKeyCombo);
  }, []);

  // Effect for checking existing login sessions on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        await handleExistingLoginRedirect();
      } catch (error) {
        console.error("Failed to check existing session:", error);
        // Optionally show an error message to the user
      } finally {
        setLoading(false); // Ensure loading is always turned off
      }
    };
    checkSession();
  }, []);

  // Effect for handling Google OAuth token from the main process
  useEffect(() => {
    // Handler for the token received from Google sign-in
    const handleToken = async (idToken: string) => {
      messageApi.open({
        key: messageKey,
        type: "loading",
        content: "Logging in with Google...",
      });

      try {
        const { errorCode, message: msg } = await fullGoogleSignIn(idToken);

        if (errorCode === 200) {
          messageApi.open({
            key: messageKey,
            type: "success",
            content: "Login successful! Redirecting...",
            duration: 2,
          });
        } else if (errorCode === 300) {
          setShowUnlinkedMessage(true);
          messageApi.open({
            key: messageKey,
            type: "error",
            content: "Account not linked yet.",
            duration: 3,
          });
        } else {
          messageApi.open({
            key: messageKey,
            type: "error",
            content: `Login failed: ${msg}`,
            duration: 3,
          });
        }
      } catch (error: any) {
        console.error("Error during Google login:", error);
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `Unexpected error: ${error.message || "Please try again"}`,
          duration: 3,
        });
      }
    };

    // Subscribe to the Google token event from electronAPI
    const unsubscribe = window.electronAPI?.onGoogleToken(handleToken);

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [messageApi]);

  // Handler for email/password form submission
  const handleEmailLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    messageApi.open({
      key: messageKey,
      type: "loading",
      content: "Logging in...",
    });

    try {
      const result = await fullEmailLogin(email, password);

      if (result.errorCode === 200) {
        messageApi.open({
          key: messageKey,
          type: "success",
          content: "Login successful! Redirecting...",
          duration: 2,
        });
      } else if (result.errorCode === 300) {
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `${result.message}`,
          duration: 3,
        });
        setShowUnlinkedMessage(true);
      } else {
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `Login failed: ${result.message}`,
          duration: 3,
        });
      }
    } catch (error: any) {
      messageApi.open({
        key: messageKey,
        type: "error",
        content: `Unexpected error: ${error.message || "Please try again"}`,
        duration: 3,
      });
    }
  };

  // Main render logic
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Fetching user details..." />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="relative">
        <div className="flex w-full h-screen">
          {/* Background Image Section */}
          <div className="w-1/2">
            <img
              src={Logo}
              alt="Cori Logo"
              className="cursor-pointer absolute top-4 left-4 w-[225px] h-[45px] object-contain mt-4 ml-4"
              onDoubleClick={() => setShowAdminBtn(true)}
            />
            <img
              src={BackgroundImage}
              alt="Abstract background"
              className="w-full h-full bg-corigreen-500 object-cover rounded-tr-[25px] rounded-br-[25px]"
            />
          </div>

          {/* Form Section */}
          <div className="w-1/2 flex items-center justify-center mb-16">
            {showUnlinkedMessage ? (
              <UnlinkedMessage onLogOut={() => setShowUnlinkedMessage(false)} />
            ) : (
              <div className="flex flex-col items-center w-[300px]">
                <h1 className="text-3xl font-bold mb-4 text-corigreen-500 ">
                  Welcome <span className="text-zinc-900 font-light">Back</span>
                </h1>
                <Form
                  layout="vertical"
                  variant="filled"
                  className="flex flex-col w-full"
                  onFinish={handleEmailLogin}
                  autoComplete="off"
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    normalize={(value) => value.toLowerCase().trim()}
                    rules={[{ required: true, message: "Please enter an email" }]}
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Please enter a password" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <CoriBtn type="submit" style="black">
                    Log In
                  </CoriBtn>
                </Form>
                <CoriBtn
                  type="button"
                  secondary
                  style="black"
                  onClick={() => window.electronAPI?.startGoogleOAuth()}
                  className="w-full mt-3 flex items-center justify-center gap-2"
                >
                  <GoogleIcon fontSize="small" />
                  Log In with Google
                </CoriBtn>

                <p className="mt-4 text-zinc-500">
                  New employee?{" "}
                  <Link
                    to="/employee/signup"
                    className="text-corigreen-500 hover:text-corigreen-300 transition-colors font-bold"
                  >
                    Sign up
                  </Link>
                </p>
                {showAdminBtn && (
                  <p className="mt-4 text-zinc-500">
                    For admins?{" "}
                    <Link
                      to="/admin/signup"
                      className="text-corigreen-500 hover:text-corigreen-300 transition-colors font-bold"
                    >
                      Sign up
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
