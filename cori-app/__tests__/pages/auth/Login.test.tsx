import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as LoginModule from "../../../src/pages/auth/Login"; // fix incorrect default import issue
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const Login = LoginModule.default || LoginModule;

// --------- mocks -----------------------------------------------------------

// 1️⃣ Mock auth service functions
import * as authService from "../../../src/services/authService";

jest.mock("../../../src/services/authService", () => ({
  __esModule: true,
  fullEmailLogin: jest.fn(),
  handleExistingLoginRedirect: jest.fn(),
}));

const mockedFullEmailLogin = authService.fullEmailLogin as jest.Mock;
const mockedExistingRedirect =
  authService.handleExistingLoginRedirect as jest.Mock;

// 2️⃣ Mock Ant Design message API – captures calls for assertion
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
    notification: { open: jest.fn() },
    Spin: () => <div role="progressbar" />,
    Input: (props: any) => <input {...props} />, // mock Input without styles
    Form: Object.assign(
      (props: any) => <form {...props}>{props.children}</form>,
      {
        Item: (props: any) => <div>{props.children}</div>,
        useForm: () => [{}],
      }
    ),
  };
});

// 3️⃣ Stub components used in Login
jest.mock("../../../src/components/auth/UnlinkedMessage", () => () => (
  <div data-testid="unlinked-message" />
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

// Stub image imports so Login.tsx doesn’t crash under Jest
jest.mock("../../../src/assets/images/Auth_Background.png", () => "bg-stub");
jest.mock("../../../src/assets/logos/cori_logo_green.png", () => "logo-stub");

// 4️⃣ Mock react-router useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ---------------- helper to render with router -----------------------------
function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

// ------------------ tests --------------------------------------------------

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedExistingRedirect.mockResolvedValue(undefined);
  });

  it("shows spinner while checking existing login", async () => {
    let resolveRedirect: () => void;
    mockedExistingRedirect.mockImplementation(
      () => new Promise<void>((res) => (resolveRedirect = res))
    );

    renderWithRouter(<Login />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    resolveRedirect!();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
  });

  it("logs in successfully with correct credentials", async () => {
    mockedFullEmailLogin.mockResolvedValue({ errorCode: 200, message: "OK" });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

    await waitFor(() =>
      expect(mockedFullEmailLogin).toHaveBeenCalledWith(
        "user@example.com",
        "pass123"
      )
    );

    const messageOpen = (require("antd") as any).message.useMessage()[0];
    expect(messageOpen).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" })
    );
  });

  it("shows error when credentials are wrong", async () => {
    mockedFullEmailLogin.mockResolvedValue({
      errorCode: 401,
      message: "Invalid password",
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

    await waitFor(() => expect(mockedFullEmailLogin).toHaveBeenCalled());
    const messageOpen = (require("antd") as any).message.useMessage()[0];
    expect(messageOpen).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" })
    );
  });

  it("renders UnlinkedMessage when service returns code 300", async () => {
    mockedFullEmailLogin.mockResolvedValue({
      errorCode: 300,
      message: "Not linked",
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in$/i }));

    await waitFor(() =>
      expect(screen.getByTestId("unlinked-message")).toBeInTheDocument()
    );
  });
});
