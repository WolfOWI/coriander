import { Modal, Button, Form, Input, Select, DatePicker, message, Tooltip } from "antd";
import CoriBtn from "../../components/buttons/CoriBtn";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import VeriCodeForm from "../../components/auth/VeriCodeForm";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* TODO: Remove this later */}
      <div className="absolute top-0 right-0 flex flex-col gap-2">
        <CoriBtn type="submit" style="black" onClick={() => navigate("/employee/home")}>
          Skip Login
        </CoriBtn>
        <CoriBtn secondary type="submit" style="black" onClick={() => navigate("/employee/signup")}>
          Next Auth Page
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
          {false && (
            <div className="flex flex-col items-center w-4/12">
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
              </Form>
              <CoriBtn secondary type="submit" style="black" className="w-full mt-3">
                <GoogleOutlined />
                Log in with Google
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
          <VeriCodeForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
