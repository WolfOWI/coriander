import { Form, Input, ConfigProvider, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import CoriBtn from "../buttons/CoriBtn";
import { Link } from "react-router-dom";

// API calls:
import { adminSignup2FA, employeeSignup2FA } from "../../services/authService"; // Add this

function VeriCodeForm({
  showLoginScreen,
  userData,
  userType,
}: {
  showLoginScreen: () => void;
  userData: {
    fullName: string;
    email: string;
    password: string;
    profileImage: File | null;
  };
  userType: number; // 1 for employee, 2 for admin
}) {
  const [form] = Form.useForm();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // RESEND BUTTON LOGIC
  // ----------------------------------------------------------------
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendDisabledTime, setResendDisabledTime] = useState(60);

  const [messageApi, contextHolder] = message.useMessage();
  const messageKey = "signup";

  // Disable resend button for specified seconds
  const disableResendButtonForSeconds = (seconds: number) => {
    // Clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsResendDisabled(true);
    setResendDisabledTime(seconds);

    timerRef.current = setInterval(() => {
      setResendDisabledTime((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // On page mount
  useEffect(() => {
    disableResendButtonForSeconds(60);
  }, []);

  // On resend code button click
  const handleResendCode = () => {
    disableResendButtonForSeconds(60);
  };
  // ----------------------------------------------------------------

  // Handle form submission
  const handleSubmit = async () => {
    try {
      messageApi.open({
        key: messageKey,
        type: "loading",
        content: "Loading...",
      });
      const values = await form.validateFields();

      console.log("🧾 VeriCodeForm → handleSubmit → form values:", values);
      console.log("📦 VeriCodeForm → handleSubmit → userData:", userData);

      const response =
        userType === 2
          ? await adminSignup2FA({
              email: userData.email,
              fullName: userData.fullName,
              password: userData.password,
              code: values.vericode,
              profileImage: userData.profileImage || undefined,
            })
          : await employeeSignup2FA({
              email: userData.email,
              fullName: userData.fullName,
              password: userData.password,
              code: values.vericode,
              profileImage: userData.profileImage || undefined,
            });

      console.log("✅ VeriCodeForm → handleSubmit → response:", response);

      if (response.errorCode === 200) {
        messageApi.open({
          key: messageKey,
          type: "success",
          content: "Account created successfully!",
        });
        showLoginScreen();
      } else {
        message.error(response.message);
        messageApi.open({
          key: messageKey,
          type: "error",
          content: `${response.message}`,
        });
      }
    } catch (err) {
      console.error("❌ VeriCodeForm → handleSubmit → Signup failed:", err);
      message.error("Something went wrong");
      messageApi.open({
        key: messageKey,
        type: "error",
        content: `Something went wrong, ${err}`,
      });
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            borderRadiusLG: 12, // Override default input border radius (for code OTP input)
          },
        },
      }}
    >
      {contextHolder}
      <div className="flex flex-col items-center w-[300px]">
        <div className="flex flex-col items-center mb-4">
          <p>We've sent a code to</p>
          <h1 className="text-corigreen-500 font-semibold text-2xl">{userData.email}</h1>
        </div>
        <Form form={form} layout="vertical" variant="filled" className="flex flex-col w-full">
          <Form.Item
            name="vericode"
            label="Verification Code"
            className="w-full"
            rules={[
              { pattern: /^[0-9]+$/, message: "Please enter numbers only" },
              { required: true, message: "Please enter all 6 digits" },
            ]}
          >
            <Input.OTP size="large" length={6} style={{ width: "100%" }} />
          </Form.Item>
          <CoriBtn type="submit" style="black" className="mt-2" onClick={handleSubmit}>
            Submit
          </CoriBtn>

          {/* Disable button for 60 seconds */}
          <CoriBtn
            secondary
            className="mt-2"
            disabled={isResendDisabled}
            onClick={handleResendCode}
          >
            {isResendDisabled ? `Resend Code (${resendDisabledTime}s)` : "Resend Code"}
          </CoriBtn>
        </Form>
        <p className="mt-4 text-zinc-500">
          Have another account?{" "}
          <Link
            to="/"
            onClick={() => {
              showLoginScreen();
            }}
            className="text-corigreen-500 hover:text-corigreen-300 transition-colors font-bold"
          >
            Log in
          </Link>
        </p>
      </div>
    </ConfigProvider>
  );
}

export default VeriCodeForm;
