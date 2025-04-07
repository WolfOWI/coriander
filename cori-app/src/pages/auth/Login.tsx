import { Modal, Button, Form, Input, Select, DatePicker, message, Tooltip } from "antd";
import CoriBtn from "../../components/buttons/CoriBtn";
import Link from "antd/es/typography/Link";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-corigreen-50">
      <CoriBtn
        type="submit"
        style="black"
        className="absolute top-0 right-0"
        onClick={() => navigate("/employee/home")}
      >
        Skip Login
      </CoriBtn>
      <div className="flex w-full h-screen">
        <div className="w-1/2">
          <img src="/images/login-bg.png" alt="Login Background" />
        </div>
        <div className="w-1/2 flex items-center justify-center mb-16">
          <div className="flex flex-col items-center w-1/2">
            <h1 className="text-3xl font-bold mb-6 text-zinc-900">Login</h1>

            <p className="text-zinc-500 mb-6">Welcome back! Please enter your details to login.</p>
            <Form form={undefined} layout="vertical" variant="filled" className="flex gap-4 w-full">
              {/* Personal Details */}
              <div className="flex flex-col w-full">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Please enter an email" }]}
                >
                  <Input type="email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter a password" }]}
                >
                  <Input type="password" />
                </Form.Item>
                <CoriBtn type="submit" style="black">
                  Log In
                </CoriBtn>
              </div>
            </Form>
            <p className="my-2">or</p>
            <CoriBtn secondary type="submit" style="black" className="w-full">
              <GoogleOutlined />
              Log in with Google
            </CoriBtn>
            <p className="mt-4 text-zinc-500">
              Not with us?{" "}
              <Link href="/employee/signup" className="text-corigreen-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
