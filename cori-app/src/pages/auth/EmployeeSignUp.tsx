import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Upload,
} from "antd";
import CoriBtn from "../../components/buttons/CoriBtn";
import { GoogleOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

import VeriCodeForm from "../../components/auth/VeriCodeForm";
import { useEffect, useState } from "react";
import BackgroundImage from "../../assets/images/Auth_Background.png";
import Logo from "../../assets/logos/cori_logo_green.png";

// API calls:
import {
  requestEmailVerification,
  fullGoogleSignIn,
  employeeGoogleSignUp,
} from "../../services/authService";

const EmployeeSignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    profileImage: null as File | null,
  });
  const [showOTPForm, setShowOTPForm] = useState(false); // Set false initially
  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "signup";

  const handleSignUp = async () => {
    try {
      messageApi.open({
        key: messageKey,
        type: "loading",
        content: "Signing you up...",
      });
      const values = await form.validateFields();
      const profileFile = values.profilepic?.[0]?.originFileObj;

      const verificationRes = await requestEmailVerification({
        fullName: values.fullName,
        email: values.email,
      });

      if (verificationRes.errorCode === 200) {
        setUserData({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          profileImage: profileFile || null,
        });
        setShowOTPForm(true);
      } else {
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `${verificationRes.message}`,
        });
      }
    } catch (err) {
      console.error("Validation or request failed:", err);
      messageApi.open({
        key: messageKey,
        type: "error",
        content: `Validation failded, please check if you can sign in, ${err}`,
      });
    }
  };

  useEffect(() => {
    const handleToken = async (idToken: string) => {
      messageApi.open({
        key: messageKey,
        type: "loading",
        content: "Signing up with Google...",
      });

      try {
        const result = await employeeGoogleSignUp(idToken);

        if (result.errorCode === 200) {
          messageApi.open({
            key: messageKey,
            type: "success",
            content: result.message,
            duration: 3,
          });
        } else {
          messageApi.open({
            key: messageKey,
            type: "error",
            content: `Sign-up failed: ${result.message}`,
            duration: 3,
          });
        }
      } catch (error: any) {
        console.error("❌ Google signup failed:", error);
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `Google signup failed: ${
            error?.message || "Unexpected error"
          }`,
          duration: 3,
        });
      }
    };

    // Electron preload hook
    window.electronAPI?.onGoogleToken(handleToken);
  }, []);

  return (
    <>
      {contextHolder}
      <div className="relative">
        <div className="flex w-full h-screen">
          <div className="w-1/2">
            <img
              src={Logo}
              alt="Logo"
              className="absolute top-4 left-4 w-[225px] h-[45px] object-contain mt-4 ml-4"
            />
            <img
              src={BackgroundImage}
              alt="Login Background"
              className="w-full h-full bg-corigreen-500 object-cover rounded-tr-[25px] rounded-br-[25px]"
            />
          </div>
          <div className="w-1/2 flex items-center justify-center mb-16">
            {!showOTPForm && (
              <div className="flex flex-col items-center w-[300px]">
                <h1 className="text-3xl font-bold mb-4 text-corigreen-500 ">
                  Employee{" "}
                  <span className="text-zinc-900 font-light">Signup</span>
                </h1>
                <Form
                  form={form}
                  layout="vertical"
                  variant="filled"
                  className="flex flex-col w-full"
                >
                  {/* <Form.Item name="profilepic" valuePropName="fileList">
                    <Upload.Dragger name="profilepic" action="/">
                      <p className="ant-upload-drag-icon">
                        <UserOutlined />
                      </p>
                      <p className="text-zinc-500 text-[12px] mb-2">
                        Upload your profile picture
                      </p>
                    </Upload.Dragger>
                  </Form.Item> */}
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    // Ensure first letter uppercase and rest lowercase
                    normalize={(value: string) =>
                      value
                        .trimStart()
                        .split(" ")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                      {
                        pattern: /^[a-zA-Z\s]+$/,
                        message: "Please enter a valid name",
                      },
                      {
                        pattern: /^[a-zA-Z]+\s[a-zA-Z]+/,
                        message: "Please enter atleast a first & last name.",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    normalize={(value: string) => value.toLowerCase().trim()}
                    rules={[
                      { required: true, message: "Please enter an email." },
                    ]}
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter a password." },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters long.",
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
                      },
                    ]}
                  >
                    <Input type="password" />
                  </Form.Item>
                  <CoriBtn
                    type="submit"
                    style="black"
                    className="mt-2"
                    onClick={handleSignUp}
                  >
                    Sign Up
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
                  Sign up with Google
                </CoriBtn>
                <p className="mt-4 text-zinc-500">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-corigreen-500 hover:text-corigreen-300 transition-colors font-bold"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            )}
            {showOTPForm && (
              <VeriCodeForm
                showLoginScreen={() => setShowOTPForm(false)}
                userData={userData}
                userType={1}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeSignUp;
