import { Form, Input, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import CoriBtn from "../buttons/CoriBtn";
import { Link } from "react-router-dom";

function VeriCodeForm() {
  const [form] = Form.useForm();

  // RESEND BUTTON LOGIC
  // ----------------------------------------------------------------
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendDisabledTime, setResendDisabledTime] = useState(60);

  // Disable resend button for specified seconds
  const disableResendButtonForSeconds = (seconds: number) => {
    setIsResendDisabled(true);
    setResendDisabledTime(seconds);

    const timer = setInterval(() => {
      setResendDisabledTime((prevTime) => {
        // If time is 1 or less, clear the timer and set the button to not disabled
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0; // Reset the time to 0
        }
        return prevTime - 1; // Minus 1 second every second
      });
    }, 1000); // Every second

    // Clear the timer on page unmount
    return () => clearInterval(timer);
  };

  // On page mount
  useEffect(() => {
    disableResendButtonForSeconds(60);
  }, []);

  // On resend code button click
  const handleResendCode = () => {
    disableResendButtonForSeconds(60);
  };
  // ----------------------------------------------------------------

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
      <div className="flex flex-col items-center w-4/12">
        <div className="flex flex-col items-center mb-4">
          <p>We've sent a code to</p>
          <h1 className="text-corigreen-500 font-semibold text-2xl">example@gmail.com</h1>
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
          <CoriBtn type="submit" style="black" className="mt-2">
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
