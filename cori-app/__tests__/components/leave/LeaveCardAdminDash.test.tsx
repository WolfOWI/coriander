import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeaveCardAdminDash from "../../../src/components/leave/LeaveCardAdminDash";

interface PendingLeaveRequest {
  leaveRequestId: number;
  employeeId: number;
  fullName: string;
  startDate: string;
  endDate: string;
  leaveTypeName: string;
  createdAt: string;
}

const mockLeaveRequest: PendingLeaveRequest = {
  leaveRequestId: 1,
  employeeId: 123,
  fullName: "John Doe",
  startDate: "2024-03-20",
  endDate: "2024-03-22",
  leaveTypeName: "Annual",
  createdAt: "2024-03-15",
};

describe("LeaveCardAdminDash Component Tests", () => {
  test("renders basic leave request information", () => {
    render(<LeaveCardAdminDash leave={mockLeaveRequest} />);

    // Check if employee name is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check if submission date is displayed
    expect(screen.getByText(/Submitted on/)).toBeInTheDocument();
    expect(screen.getByText(/3\/15\/2024/)).toBeInTheDocument();
  });

  test("shows additional information on hover", async () => {
    const user = userEvent.setup();
    render(<LeaveCardAdminDash leave={mockLeaveRequest} />);

    const card = screen.getByText("John Doe").closest("div");
    expect(card).toBeInTheDocument();

    if (card) {
      // Hover over the card
      await user.hover(card);

      // Check if leave type is displayed
      expect(screen.getByText("Leave Type: Annual")).toBeInTheDocument();

      // Check if dates are displayed
      expect(screen.getByText(/3\/20\/2024 - 3\/22\/2024/)).toBeInTheDocument();

      // Check if duration is displayed (3 days)
      expect(screen.getByText("3 Days")).toBeInTheDocument();
    }
  });

  test("displays single day correctly", () => {
    const singleDayLeave = {
      ...mockLeaveRequest,
      startDate: "2024-03-20",
      endDate: "2024-03-20",
    };

    render(<LeaveCardAdminDash leave={singleDayLeave} />);
    const card = screen.getByText("John Doe").closest("div");
    expect(card).toBeInTheDocument();

    if (card) {
      // Check if duration shows "Day" instead of "Days"
      expect(screen.getByText("1 Day")).toBeInTheDocument();
    }
  });
});
