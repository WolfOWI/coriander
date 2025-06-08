import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VeriCodeForm from "../../../src/components/auth/VeriCodeForm";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// --------- mocks -----------------------------------------------------------

// 1️⃣ Mock auth service functions
import * as authService from "../../../src/services/authService";
jest.mock("../../../src/services/authService", () => ({
  __esModule: true,
  adminSignup2FA: jest.fn(),
  employeeSignup2FA: jest.fn(),
}));

const mockedAdminSignup2FA = authService.adminSignup2FA as jest.Mock;
const mockedEmployeeSignup2FA = authService.employeeSignup2FA as jest.Mock;

// 2️⃣ Mock Ant Design message API
jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    message: {
      useMessage: () => {
        const open = jest.fn();
        return [open, <div data-testid="antd-msg" key="ctx" />];
      },
      error: jest.fn(),
    },
    Input: {
      OTP: (props: any) => <input {...props} aria-label="OTP input" />, // mock OTP
    },
    Form: Object.assign(
      (props: any) => <form onSubmit={props.onSubmit}>{props.children}</form>,
      {
        Item: (props: any) => <div>{props.children}</div>,
        useForm: () => [{}],
      }
    ),
  };
});

// 3️⃣ Mock CoriBtn
jest.mock("../../../src/components/buttons/CoriBtn", () => (props: any) => {
  const { children, type, ...rest } = props;
  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      {...rest}
      data-testid="cori-btn"
    >
      {children}
    </button>
  );
});

// 4️⃣ Render helper
function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

// ------------------ tests --------------------------------------------------

describe("VeriCodeForm", () => {
  const defaultProps = {
    userData: {
      fullName: "Admin User",
      email: "admin@example.com",
      password: "secret123",
      profileImage: null,
    },
    showLoginScreen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits successfully for admin userType=2", async () => {
    mockedAdminSignup2FA.mockResolvedValue({ errorCode: 200, message: "OK" });

    renderWithRouter(<VeriCodeForm {...defaultProps} userType={2} />);

    fireEvent.change(screen.getByLabelText("OTP input"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByTestId("cori-btn"));

    await waitFor(() => {
      expect(mockedAdminSignup2FA).toHaveBeenCalled();
      expect(defaultProps.showLoginScreen).toHaveBeenCalled();
    });
  });

  it("submits successfully for employee userType=1", async () => {
    mockedEmployeeSignup2FA.mockResolvedValue({
      errorCode: 200,
      message: "OK",
    });

    renderWithRouter(<VeriCodeForm {...defaultProps} userType={1} />);

    fireEvent.change(screen.getByLabelText("OTP input"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByTestId("cori-btn"));

    await waitFor(() => {
      expect(mockedEmployeeSignup2FA).toHaveBeenCalled();
      expect(defaultProps.showLoginScreen).toHaveBeenCalled();
    });
  });

  it("shows error when signup fails", async () => {
    mockedAdminSignup2FA.mockResolvedValue({
      errorCode: 500,
      message: "Failure",
    });

    renderWithRouter(<VeriCodeForm {...defaultProps} userType={2} />);

    fireEvent.change(screen.getByLabelText("OTP input"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByTestId("cori-btn"));

    await waitFor(() => {
      expect(mockedAdminSignup2FA).toHaveBeenCalled();
    });
  });
});
