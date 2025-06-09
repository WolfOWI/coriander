import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../../src/pages/auth/Login";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

//==============================================================================
// MOCKS
//==============================================================================

// Mock authService: Isolate the component from actual API calls
jest.mock("../../../src/services/authService", () => ({
  fullEmailLogin: jest.fn(),
  handleExistingLoginRedirect: jest.fn(),
  // fullGoogleSignIn is not directly called by a user action in Login.tsx,
  // but by an event listener, so we don't need to mock it for these tests.
}));
import * as authService from "../../../src/services/authService";
const mockedFullEmailLogin = authService.fullEmailLogin as jest.Mock;
const mockedExistingRedirect =
  authService.handleExistingLoginRedirect as jest.Mock;

// Mock Ant Design components and hooks
const mockMessageOpen = jest.fn();
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  // We need a stable mock function for `useMessage` to assert calls against it.
  const useMessage = () => [mockMessageOpen, <div key="message-context" />];
  return {
    ...antd,
    message: { useMessage },
    Spin: ({ tip }: { tip: string }) => <div role="progressbar">{tip}</div>,
  };
});

// Mock child components
jest.mock("../../../src/components/auth/UnlinkedMessage", () => () => (
  <div data-testid="unlinked-message" />
));

// Mock assets
jest.mock("../../../src/assets/images/Auth_Background.png", () => "bg-stub");
jest.mock("../../../src/assets/logos/cori_logo_green.png", () => "logo-stub");

// Mock react-router's navigate function
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the global electronAPI for Google OAuth
const mockStartGoogleOAuth = jest.fn();
beforeAll(() => {
  // @ts-ignore
  window.electronAPI = {
    startGoogleOAuth: mockStartGoogleOAuth,
  };
});

//==============================================================================
// HELPER FUNCTIONS
//==============================================================================

const renderLoginComponent = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

//==============================================================================
// TESTS
//==============================================================================

describe("Login Page Functionality", () => {
  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock behavior: resolve the redirect check so the form appears
    mockedExistingRedirect.mockResolvedValue(undefined);
  });

  // Test 1: Initial Loading State
  test("should show a loading spinner while checking for an existing session", async () => {
    // Delay the resolution of the redirect check to see the spinner
    let resolveRedirectCheck: () => void;
    mockedExistingRedirect.mockImplementation(
      () => new Promise<void>((resolve) => (resolveRedirectCheck = resolve))
    );

    renderLoginComponent();
    expect(screen.getByRole("progressbar")).toHaveTextContent(
      "Fetching user details..."
    );

    // Complete the check
    resolveRedirectCheck!();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  // Test 2: Form Rendering
  test("should render the login form after the session check completes", async () => {
    renderLoginComponent();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /welcome back/i })
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log in$/i })
    ).toBeInTheDocument();
  });

  describe("Email and Password Login", () => {
    // Test 3: Successful Login
    test("should successfully log in with correct credentials", async () => {
      const user = userEvent.setup();
      mockedFullEmailLogin.mockResolvedValue({ errorCode: 200, message: "OK" });
      renderLoginComponent();

      await waitFor(() =>
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      );

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /log in$/i }));

      // Check for loading message
      await waitFor(() => {
        expect(mockMessageOpen).toHaveBeenCalledWith({
          key: "login",
          type: "loading",
          content: "Logging in...",
        });
      });

      // Check that the auth service was called correctly
      expect(mockedFullEmailLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );

      // Check for success message
      await waitFor(() => {
        expect(mockMessageOpen).toHaveBeenCalledWith({
          key: "login",
          type: "success",
          content: "Login successful! Redirecting...",
          duration: 2,
        });
      });
    });

    // Test 4: Failed Login
    test("should show an error message with incorrect credentials", async () => {
      const user = userEvent.setup();
      mockedFullEmailLogin.mockResolvedValue({
        errorCode: 401,
        message: "Invalid credentials",
      });
      renderLoginComponent();

      await waitFor(() =>
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      );

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /log in$/i }));

      // Check for error message
      await waitFor(() => {
        expect(mockMessageOpen).toHaveBeenCalledWith({
          key: "login",
          type: "error",
          content: "Login failed: Invalid credentials",
          duration: 3,
        });
      });
    });

    // Test 5: Form Validation
    test("should not submit the form and show validation errors if fields are empty", async () => {
      const user = userEvent.setup();
      renderLoginComponent();
      await waitFor(() =>
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      );

      await user.click(screen.getByRole("button", { name: /log in$/i }));

      // Ant Design's Form component will show validation messages.
      // We are testing that our component correctly uses these rules.
      expect(
        await screen.findByText("Please enter an email")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Please enter a password")
      ).toBeInTheDocument();

      // Most importantly, ensure the login function was NOT called
      expect(mockedFullEmailLogin).not.toHaveBeenCalled();
    });

    // Test 6: Unlinked Account
    test("should render UnlinkedMessage component for an unlinked account response", async () => {
      const user = userEvent.setup();
      mockedFullEmailLogin.mockResolvedValue({
        errorCode: 300,
        message: "Account not linked",
      });
      renderLoginComponent();
      await waitFor(() =>
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      );

      await user.type(screen.getByLabelText(/email/i), "unlinked@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /log in$/i }));

      await waitFor(() => {
        expect(screen.getByTestId("unlinked-message")).toBeInTheDocument();
      });

      // The form should be hidden when the UnlinkedMessage is shown
      expect(
        screen.queryByRole("heading", { name: /welcome back/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Other Login Methods and Links", () => {
    // Test 7: Google Login
    test("should call electronAPI when the Google login button is clicked", async () => {
      const user = userEvent.setup();
      renderLoginComponent();
      await waitFor(() =>
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      );

      const googleButton = screen.getByRole("button", {
        name: /log in with google/i,
      });
      await user.click(googleButton);

      expect(mockStartGoogleOAuth).toHaveBeenCalledTimes(1);
    });

    // Test 8: Sign Up Link
    test("should have a link to the employee sign-up page", async () => {
      renderLoginComponent();
      await waitFor(() =>
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
      );

      const signUpLink = screen.getByRole("link", { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute("href", "/employee/signup");
    });
  });
});
