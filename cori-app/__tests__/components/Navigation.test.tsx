import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Navigation from "../../src/components/Navigation";
import { navbarUserStatus, logout } from "../../src/services/authService";
import "@testing-library/jest-dom";

// Mock the auth service
jest.mock("../../src/services/authService", () => ({
  navbarUserStatus: jest.fn(),
  logout: jest.fn(),
}));

// Mock the router location
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

// Mock logo import
jest.mock("../../src/assets/logos/cori_logo_green.png", () => "mocked-logo.png");

describe("Navigation Component Tests", () => {
  const mockLocation = (path: string) => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: path });
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockLocation("/");
  });

  describe("Authentication Links", () => {
    beforeEach(() => {
      (navbarUserStatus as jest.Mock).mockResolvedValue(-1);
    });

    test("renders authentication links for unauthenticated users", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Authentication")).toBeInTheDocument();
      });

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Employee Sign Up")).toBeInTheDocument();
      expect(screen.getByText("Admin Sign Up")).toBeInTheDocument();
    });

    test("highlights active authentication link", async () => {
      mockLocation("/employee/signup");
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        const signupLink = screen.getByText("Employee Sign Up");
        expect(signupLink).toHaveClass("text-sakura-500");
      });
    });
  });

  describe("Employee Navigation", () => {
    beforeEach(() => {
      (navbarUserStatus as jest.Mock).mockResolvedValue(1);
    });

    test("renders employee navigation links when user is an employee", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Home")).toBeInTheDocument();
      });

      expect(screen.getByText("My Leave")).toBeInTheDocument();
      expect(screen.getByText("My Meetings")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    test("highlights active employee link", async () => {
      mockLocation("/employee/meetings");
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        const meetingsLink = screen.getByText("My Meetings");
        expect(meetingsLink).toHaveClass("text-sakura-500");
      });
    });
  });

  describe("Admin Navigation", () => {
    beforeEach(() => {
      (navbarUserStatus as jest.Mock).mockResolvedValue(2);
    });

    test("renders admin navigation links when user is an admin", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });

      expect(screen.getByText("Employees")).toBeInTheDocument();
      expect(screen.getByText("Create Employee")).toBeInTheDocument();
      expect(screen.getByText("Equipment")).toBeInTheDocument();
      expect(screen.getByText("Leave Requests")).toBeInTheDocument();
      expect(screen.getByText("Meetings")).toBeInTheDocument();
    });

    test("highlights active admin link", async () => {
      mockLocation("/admin/equipment");
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        const equipmentLink = screen.getByText("Equipment");
        expect(equipmentLink).toHaveClass("text-sakura-500");
      });
    });
  });

  describe("Logo and Logout", () => {
    beforeEach(() => {
      (navbarUserStatus as jest.Mock).mockResolvedValue(1);
    });

    test("renders the Coriander logo", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      const logo = screen.getByAltText("Coriander");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "mocked-logo.png");
    });

    test("calls logout function when logout button is clicked", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      const logoutButton = screen.getByText("Logout");
      await act(async () => {
        fireEvent.click(logoutButton);
      });

      expect(logout).toHaveBeenCalled();
    });
  });

  describe("Dev Mode Links", () => {
    beforeEach(() => {
      (navbarUserStatus as jest.Mock).mockResolvedValue(1);
    });

    test("does not render dev mode links by default", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        );
      });

      await waitFor(() => {
        expect(screen.queryByText("Reference")).not.toBeInTheDocument();
      });

      expect(screen.queryByText("Custom Stuffies")).not.toBeInTheDocument();
      expect(screen.queryByText("API Playground - do not remove")).not.toBeInTheDocument();
    });
  });
});
