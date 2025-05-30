import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fullGoogleSignIn, fullEmailLogin } from "../../services/authService";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Form, Input, message, notification } from "antd";
import GoogleIcon from "@mui/icons-material/Google";

import VeriCodeForm from "../../components/auth/VeriCodeForm";
import UnlinkedMessage from "../../components/auth/UnlinkedMessage";
import CoriBtn from "../../components/buttons/CoriBtn";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "login";

  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showUnlinkedMessage, setShowUnlinkedMessage] = useState(false);

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
      <div className="relative">
        {/* TODO: Remove this later */}
        <div className="absolute top-0 right-0 flex flex-col gap-2">
          <CoriBtn
            type="submit"
            style="black"
            onClick={() => navigate("/employee/home")}
          >
            Go to Home
          </CoriBtn>
          <CoriBtn
            type="submit"
            style="black"
            onClick={() => navigate("/employee/profile")}
          >
            Skip Login To Emp Profile
          </CoriBtn>
          <CoriBtn
            secondary
            type="submit"
            style="black"
            onClick={() => navigate("/employee/signup")}
          >
            emp sign up
          </CoriBtn>
          <CoriBtn
            secondary
            type="submit"
            style="black"
            onClick={() => navigate("/admin/signup")}
          >
            admin sign up
          </CoriBtn>
          <CoriBtn
            secondary
            type="submit"
            style="black"
            className="mt-4"
            onClick={() => {
              setShowOTPForm(false);
              setShowUnlinkedMessage(false);
            }}
          >
            Show Login
          </CoriBtn>
          <CoriBtn
            secondary
            type="submit"
            style="black"
            onClick={() => {
              setShowOTPForm(true);
              setShowUnlinkedMessage(false);
            }}
          >
            Show OTP Form
          </CoriBtn>
          <CoriBtn
            secondary
            type="submit"
            style="black"
            onClick={() => {
              setShowOTPForm(false);
              setShowUnlinkedMessage(true);
            }}
          >
            Show Unlinked
          </CoriBtn>
        </div>
        <div className="flex w-full h-screen">
          <div className="w-1/2">
            <img
              src="/images/login-bg.png"
              alt="Login Background"
              className="w-full h-full bg-corigreen-500"
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
                  Not with us?{" "}
                  <Link
                    to="/employee/signup"
                    className="text-corigreen-500 hover:text-corigreen-300 transition-colors font-bold"
                  >
                    Sign up
                  </Link>
                </p>
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
