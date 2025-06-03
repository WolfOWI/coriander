import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Authentication
import {
  fullGoogleSignIn,
  fullEmailLogin,
  handleExistingLoginRedirect,
} from "../../services/authService";

// Styling
import { Form, Input, message, notification, Spin } from "antd";
import GoogleIcon from "@mui/icons-material/Google";
import BackgroundImage from "../../assets/images/Auth_Background.png";
import Logo from "../../assets/logos/cori_logo_green.png";

// Modals and Components
import VeriCodeForm from "../../components/auth/VeriCodeForm";
import UnlinkedMessage from "../../components/auth/UnlinkedMessage";
import CoriBtn from "../../components/buttons/CoriBtn";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "login";

  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showUnlinkedMessage, setShowUnlinkedMessage] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showAdminBtn, setShowAdminBtn] = useState(false);

  useEffect(() => {
    const handleKeyCombo = (e: KeyboardEvent) => {
      // Avoid triggering when typing in input or textarea
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      // Check for key combo
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "a") {
        setShowAdminBtn((prev) => !prev);
        console.log("✅ Admin sign-up toggle triggered");
      }
    };

    document.addEventListener("keydown", handleKeyCombo);
    return () => document.removeEventListener("keydown", handleKeyCombo);
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      await handleExistingLoginRedirect();
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (window.location.hash === "#notlinked") {
      setShowUnlinkedMessage(true);
      messageApi.open({
        key: messageKey,
        type: "error",
        content: "User not linked to any account",
        duration: 3,
      });
    } else {
      setShowUnlinkedMessage(false);
    }
  }, []);

  // Email login handler
  const handleEmailLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
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

  useEffect(() => {
    const handleToken = async (idToken: string) => {
      messageApi.open({
        key: messageKey,
        type: "loading",
        content: "Logging in with Google...",
      });

      try {
        const { errorCode, message } = await fullGoogleSignIn(idToken);

        if (errorCode === 200) {
          messageApi.open({
            key: messageKey,
            type: "success",
            content: "Login successful! Redirecting...",
            duration: 2,
          });
          // Redirection is handled internally in fullGoogleSignIn
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
            content: `Login failed: ${message}`,
            duration: 3,
          });
        }
      } catch (error: any) {
        console.error("❌ Error during Google login:", error);
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `Unexpected error during Google login: ${
            error.message || "Please try again"
          }`,
          duration: 3,
        });
      }
    };

    window.electronAPI?.onGoogleToken(handleToken);
  }, []);

  return (
    <>
      {contextHolder}
      {loading && (
        <div className="flex items-center justify-center h-screen bg-white z-50 fixed top-0 left-0 w-full">
          <Spin size="large" tip="Fetching user details..." />
        </div>
      )}
      <div className="relative">
        <div className="flex w-full h-screen">
          <div className="w-1/2">
            <img
              src={Logo}
              alt="Logo"
              onDoubleClick={() => navigate("/admin/signup")}
              className="cursor-pointer absolute top-4 left-4 w-[225px] h-[45px] object-contain mt-4 ml-4"
            />
            <img
              src={BackgroundImage}
              alt="Login Background"
              className="w-full h-full bg-corigreen-500 object-cover rounded-tr-[25px] rounded-br-[25px]"
            />
          </div>
          <div className="w-1/2 flex items-center justify-center mb-16">
            {/* Standard Login Screen Section */}
            {!showOTPForm && !showUnlinkedMessage && (
              <div className="flex flex-col items-center w-[300px]">
                <h1 className="text-3xl font-bold mb-4 text-corigreen-500 ">
                  Welcome <span className="text-zinc-900 font-light">Back</span>
                </h1>
                <Form
                  form={undefined}
                  layout="vertical"
                  variant="filled"
                  className="flex flex-col w-full"
                  onFinish={handleEmailLogin} // Trigger email login on form submission
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    normalize={(value: string) => value.toLowerCase().trim()}
                    rules={[
                      { required: true, message: "Please enter an email" },
                    ]}
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter a password" },
                    ]}
                  >
                    <Input type="password" />
                  </Form.Item>
                  <CoriBtn type="submit" style="black">
                    Log In
                  </CoriBtn>
                </Form>
                <CoriBtn
                  type="button"
                  secondary
                  style="black"
                  onClick={() => window.electronAPI?.startGoogleOAuth?.()}
                  className="w-[300px] mt-3 flex items-center justify-center gap-2"
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
                  <>
                    <p className="mt-4 text-zinc-500">
                      For admins?{" "}
                      <Link
                        to="/admin/signup"
                        className="text-corigreen-500 hover:text-corigreen-300 transition-colors font-bold"
                      >
                        Sign up
                      </Link>
                    </p>
                  </>
                )}
              </div>
            )}
            {showUnlinkedMessage && (
              <UnlinkedMessage onLogOut={() => setShowUnlinkedMessage(false)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
