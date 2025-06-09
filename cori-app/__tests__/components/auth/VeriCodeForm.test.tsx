import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import VeriCodeForm from "../../../src/components/auth/VeriCodeForm";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

// Mock api service
jest.mock("../../../src/services/api.service", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

// Mock auth service
jest.mock("../../../src/services/authService", () => ({
  adminSignup2FA: jest.fn(),
  employeeSignup2FA: jest.fn(),
  fullEmailLogin: jest.fn(),
}));

// Mock antd components
jest.mock("antd", () => {
  const Form = ({ children, ...props }: any) => <form {...props}>{children}</form>;
  Form.Item = ({ children }: any) => children;
  Form.useForm = () => [{ validateFields: jest.fn(), resetFields: jest.fn() }];

  return {
    Form,
    Input: {
      OTP: ({ onChange }: any) => (
        <input
          data-testid="code-input"
          onChange={onChange}
          aria-label="Verification code"
          placeholder="Enter verification code"
        />
      ),
    },
    ConfigProvider: ({ children }: any) => children,
    message: {
      useMessage: () => [{ loading: jest.fn(), success: jest.fn(), error: jest.fn() }, null],
    },
  };
});

// Mock CoriBtn component
jest.mock("../../../src/components/buttons/CoriBtn", () => {
  return function MockCoriBtn({ children, onClick }: any) {
    return <button onClick={onClick}>{children}</button>;
  };
});

describe("VeriCodeForm", () => {
  const defaultProps = {
    showLoginScreen: jest.fn(),
    userData: {
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      profileImage: null,
    },
    userType: 2,
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders core form elements", () => {
    const { getByTestId, getByText } = renderWithRouter(<VeriCodeForm {...defaultProps} />);

    expect(getByTestId("code-input")).toBeInTheDocument();
    expect(getByText(/Submit/i)).toBeInTheDocument();
    expect(getByText(/Resend Code/i)).toBeInTheDocument();
  });
});
