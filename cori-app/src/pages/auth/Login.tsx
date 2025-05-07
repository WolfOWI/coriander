import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  fullGoogleSignIn,
  userGoogleLogin,
  getCurrentUser,
} from "../../services/authService";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

// Icons
import { GoogleOutlined } from "@ant-design/icons";

// Components
import VeriCodeForm from "../../components/auth/VeriCodeForm";
import UnlinkedMessage from "../../components/auth/UnlinkedMessage";
import CoriBtn from "../../components/buttons/CoriBtn";
import { Form, Input } from "antd";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showUnlinkedMessage, setShowUnlinkedMessage] = useState(false);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
            secondary
            type="submit"
            style="black"
            onClick={() => navigate("/employee/signup")}
          >
            Next Auth Page
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
                <GoogleLogin
                  width="300"
                  onSuccess={async (resp) => {
                    const idToken = resp.credential;
                    const user = await fullGoogleSignIn(idToken);

                    const { errorCode, message } = await fullGoogleSignIn(
                      idToken
                    );
                    if (errorCode === 200) {
                      navigate("/employee/home");
                    } else if (errorCode === 403) {
                      setShowUnlinkedMessage(true);
                    } else {
                      alert(`Login failed (${errorCode}): ${message}`);
                    }
                  }}
                />
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
            {showOTPForm && (
              <VeriCodeForm showLoginScreen={() => setShowOTPForm(false)} />
            )}
            {showUnlinkedMessage && (
              <UnlinkedMessage onLogOut={() => setShowUnlinkedMessage(false)} />
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
