import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "../../../src/pages/admin/AdminDashboard";
import * as apiService from "../../../src/services/api.service";
import * as authService from "../../../src/services/authService";
import { BrowserRouter } from "react-router-dom";
import { AxiosHeaders } from "axios";

import '@testing-library/jest-dom';

// Mock child components and icons to avoid rendering complexity
jest.mock("../../../src/components/charts/BarChart", () => () => <div data-testid="bar-chart" />);
jest.mock("../../../src/components/charts/DoughnutChart", () => () => <div data-testid="doughnut-chart" />);
jest.mock("../../../src/components/leave/LeaveCardAdminDash", () => (props: unknown) => {
  const p = props as { leave?: { fullName?: string } };
  return <div data-testid="leave-card">{p.leave?.fullName}</div>;
});
jest.mock("../../../src/components/cards/adminCards/TopRatedEmpAdm", () => (props: unknown) => {
  const p = props as { fullName?: string };
  return <div data-testid="top-emp-card">{p.fullName}</div>;
});
jest.mock("../../../src/components/calender", () => (props: unknown) => {
  const p = props as { onChange?: (date: Date) => void };
  return <div data-testid="admin-calendar" onClick={() => p.onChange && p.onChange(new Date("2024-06-01"))} />;
});
jest.mock("../../../src/components/gathering/AdminGatheringBox", () => (props: unknown) => {
  const p = props as { gathering?: { id?: string | number } };
  return <div data-testid="gathering-box">{p.gathering?.id}</div>;
});
jest.mock("../../../src/components/modals/CreatePRModal", () => (props: unknown) => {
  const p = props as { showModal?: boolean };
  return p.showModal ? <div data-testid="create-pr-modal" /> : null;
});
jest.mock("../../../src/constants/icons", () => ({
  Icons: {
    MeetingRoom: () => <span data-testid="meeting-room-icon" />,
    Add: () => <span data-testid="add-icon" />,
  },
}));

// Mock import.meta.env for Vite variables in tests
Object.defineProperty(globalThis, "import", {
  value: { meta: { env: { VITE_API_URL: "http://localhost:3000" } } },
  writable: true,
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock API and Auth
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(authService, "getFullCurrentUser").mockResolvedValue({
    adminId: 1,
    userId: 1,
    fullName: "Test Admin",
    email: "admin@example.com",
    role: 1,
    isLinked: true,
    isVerified: true,
  });
  jest.spyOn(apiService.pageAPI, "getAdminDashboardData").mockResolvedValue({
    data: {
      adminUser: { adminId: 1, fullName: "Test Admin" },
      empUserRatingMetrics: { $values: [{ fullName: "Alice", averageRating: 4.5, mostRecentRating: 5 }] },
      employeeStatusTotals: { totalEmployees: 2, totalFullTimeEmployees: 1, totalPartTimeEmployees: 1 },
      leaveRequests: { $values: [{ leaveRequestId: 1, fullName: "Bob", employeeId: 2 }] },
      topRatedEmployees: { $values: [{ employees: { $values: [{ employeeId: 2, fullName: "Bob", jobTitle: "Dev", employType: "Full-Time", isSuspended: false, profilePicture: "" }] }, ratings: { $values: [{ averageRating: 4.5 }] } }] },
    },
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  });
  jest.spyOn(apiService.empLeaveRequestsAPI, "getPendingLeaveRequests").mockResolvedValue({
    data: [{ leaveRequestId: 1, fullName: "Bob", employeeId: 2 }],
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  });
  jest.spyOn(apiService.gatheringAPI, "getUpcomingAndCompletedGatheringsByAdminIdAndMonth").mockResolvedValue({
    data: { $values: [{ id: 1, startDate: new Date().toISOString() }] },
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  });
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("AdminDashboard", () => {
  it("renders loading spinner initially", async () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());
  });

  it("renders dashboard data after loading", async () => {
    renderWithRouter(<AdminDashboard />);
    await screen.findByText(/Welcome, Test Admin/i);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
    expect(screen.getByText("Top 3 Employees")).toBeInTheDocument();
    expect(screen.getByTestId("top-emp-card")).toHaveTextContent("Bob");
    expect(screen.getByTestId("leave-card")).toHaveTextContent("Bob");
  });

  it("opens the CreatePRModal when clicking New Performance Review", async () => {
    renderWithRouter(<AdminDashboard />);
    await screen.findByText(/Welcome, Test Admin/i);
    const newPRBtn = screen.getByText(/New Performance Review/i);
    fireEvent.click(newPRBtn);
    expect(screen.getByTestId("create-pr-modal")).toBeInTheDocument();
  });

  it("navigates to meetings page when clicking View All Meetings", async () => {
    renderWithRouter(<AdminDashboard />);
    await screen.findByText(/Welcome, Test Admin/i);
    const meetingsBtn = screen.getByText(/View All Meetings/i);
    fireEvent.click(meetingsBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/meetings");
  });

  it("navigates to leave requests page when clicking View All in Leave Requests", async () => {
    renderWithRouter(<AdminDashboard />);
    await screen.findByText(/Welcome, Test Admin/i);
    const leaveBtn = screen.getByText(/View All/i);
    fireEvent.click(leaveBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/leave-requests");
  });

  it("shows gathering boxes for today's meetings", async () => {
    renderWithRouter(<AdminDashboard />);
    await screen.findByText(/Welcome, Test Admin/i);
    expect(screen.getByTestId("gathering-box")).toBeInTheDocument();
  });

  it("shows empty state if there are no meetings today", async () => {
    // Mock gatherings to be empty
    (apiService.gatheringAPI.getUpcomingAndCompletedGatheringsByAdminIdAndMonth as jest.Mock).mockResolvedValueOnce({
      data: { $values: [] },
    });
    renderWithRouter(<AdminDashboard />);
    await screen.findByText(/Welcome, Test Admin/i);
    expect(screen.getByText(/You have no meetings today!/i)).toBeInTheDocument();
  });

  it("shows error message if dashboard data fails to load", async () => {
    (apiService.pageAPI.getAdminDashboardData as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    renderWithRouter(<AdminDashboard />);
    await waitFor(() => expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument());
  });
});