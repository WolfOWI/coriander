import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import * as authService from "../../../src/services/authService";
import AdminSignUp from "../../../src/pages/auth/AdminSignUp";

jest.mock("../../../src/services/authService", () => ({
  __esModule: true,
  requestEmailVerification: jest.fn(),
  adminGoogleSignUp: jest.fn(),
}));

jest.mock("../../../src/components/auth/VeriCodeForm", () => (props: any) => (
  <div data-testid="otp-form">OTP Form Loaded</div>
));

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

jest.mock("../../../src/assets/images/Auth_Background.png", () => "bg-stub");
jest.mock("../../../src/assets/logos/cori_logo_green.png", () => "logo-stub");

const mockedRequestEmailVerification =
  authService.requestEmailVerification as jest.Mock;

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("AdminSignUp page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows OTP form after successful verification", async () => {
    mockedRequestEmailVerification.mockResolvedValue({
      errorCode: 200,
      message: "Verification sent",
    });

    renderWithRouter(<AdminSignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

    await waitFor(() => {
      expect(screen.getByTestId("otp-form")).toBeInTheDocument();
    });
  });

  it("shows error if verification fails", async () => {
    mockedRequestEmailVerification.mockResolvedValue({
      errorCode: 500,
      message: "Server error",
    });

    renderWithRouter(<AdminSignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up$/i }));

    await waitFor(() => {
      expect(screen.queryByTestId("otp-form")).not.toBeInTheDocument();
    });
  });
});
