import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as AuthService from "../../../src/services/authService";
import * as EmployeeSignUpModule from "../../../src/pages/auth/EmployeeSignUp";
import "@testing-library/jest-dom";

const EmployeeSignUp = EmployeeSignUpModule.default || EmployeeSignUpModule;

jest.mock("../../../src/services/authService", () => ({
  __esModule: true,
  requestEmailVerification: jest.fn(),
  employeeGoogleSignUp: jest.fn(),
}));

const mockedRequestEmailVerification =
  AuthService.requestEmailVerification as jest.Mock;

jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    message: {
      useMessage: () => {
        const open = jest.fn();
        return [open, <div data-testid="antd-msg" key="ctx" />];
      },
    },
    Form: Object.assign(
      (props: any) => <form {...props}>{props.children}</form>,
      {
        Item: (props: any) => <div>{props.children}</div>,
        useForm: () => [{}, {}],
      }
    ),
    Input: (props: any) => <input {...props} />,
  };
});

jest.mock("../../../src/assets/images/Auth_Background.png", () => "bg-stub");
jest.mock("../../../src/assets/logos/cori_logo_green.png", () => "logo-stub");
jest.mock("../../../src/components/buttons/CoriBtn", () => (props: any) => {
  return (
    <button {...props} data-testid="cori-btn">
      {props.children}
    </button>
  );
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("EmployeeSignUp page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows OTP form after successful verification", async () => {
    mockedRequestEmailVerification.mockResolvedValue({
      errorCode: 200,
      message: "Verification sent",
    });

    renderWithRouter(<EmployeeSignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "StrongPass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

    await waitFor(() =>
      expect(mockedRequestEmailVerification).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "john@example.com",
      })
    );
  });

  it("shows error if verification fails", async () => {
    mockedRequestEmailVerification.mockResolvedValue({
      errorCode: 400,
      message: "Already registered",
    });

    renderWithRouter(<EmployeeSignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

    await waitFor(() =>
      expect(mockedRequestEmailVerification).toHaveBeenCalled()
    );
  });
});
