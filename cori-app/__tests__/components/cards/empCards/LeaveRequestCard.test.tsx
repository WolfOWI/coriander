import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LeaveRequestCard from "../../../../src/components/cards/empCards/LeaveRequestCard";
import { LeaveStatus } from "../../../../src/types/common";

// Mock dayjs
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  const mockDayjs = jest.fn((date) => ({
    format: jest.fn((format) => {
      if (format === "DD MMM YYYY") {
        if (date === "2024-01-15") return "15 Jan 2024";
        if (date === "2024-01-17") return "17 Jan 2024";
        return "01 Jan 2024";
      }
      return "formatted-date";
    }),
    diff: jest.fn((other, unit) => {
      if (date === "2024-01-17" && unit === "day") return 2; // 3 days total (inclusive)
      return 0;
    }),
  }));
  Object.assign(mockDayjs, originalDayjs);
  return mockDayjs;
});

// Mock the CoriBadge component
jest.mock("../../../../src/components/badges/CoriBadge", () => {
  return function MockCoriBadge({
    text,
    color,
    size,
  }: {
    text: string;
    color: string;
    size: string;
  }) {
    return (
      <div data-testid="cori-badge" data-color={color} data-size={size}>
        {text}
      </div>
    );
  };
});

// Mock the Icons
jest.mock("../../../../src/constants/icons", () => ({
  Icons: {
    BeachAccess: ({ fontSize }: { fontSize?: string }) => (
      <span data-testid="beach-icon" data-fontsize={fontSize}>
        🏖️
      </span>
    ),
    FamilyRestroom: ({ fontSize }: { fontSize?: string }) => (
      <span data-testid="family-icon" data-fontsize={fontSize}>
        👨‍👩‍👧‍👦
      </span>
    ),
    Sick: ({ fontSize }: { fontSize?: string }) => (
      <span data-testid="sick-icon" data-fontsize={fontSize}>
        🤒
      </span>
    ),
    HeartBroken: ({ fontSize }: { fontSize?: string }) => (
      <span data-testid="heart-icon" data-fontsize={fontSize}>
        💔
      </span>
    ),
    MenuBook: ({ fontSize }: { fontSize?: string }) => (
      <span data-testid="book-icon" data-fontsize={fontSize}>
        📚
      </span>
    ),
    ChildFriendly: ({ fontSize }: { fontSize?: string }) => (
      <span data-testid="child-icon" data-fontsize={fontSize}>
        👶
      </span>
    ),
  },
}));

describe("LeaveRequestCard Component Tests", () => {
  const mockLeaveRequest = {
    $id: "1",
    leaveRequestId: 1,
    employeeId: 123,
    leaveTypeId: 1,
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    comment: "Going on vacation with family",
    status: LeaveStatus.Pending,
    createdAt: "2024-01-10",
    leaveTypeName: "Annual",
    description: "Annual leave",
    defaultDays: 21,
  };

  test("renders with basic leave request data", () => {
    render(<LeaveRequestCard req={mockLeaveRequest} />);

    expect(screen.getByText("Annual Leave")).toBeInTheDocument();
    expect(screen.getByText("3 days")).toBeInTheDocument();
    expect(screen.getByText("Going on vacation with family")).toBeInTheDocument();
  });

  test("displays correct date range", () => {
    render(<LeaveRequestCard req={mockLeaveRequest} />);

    expect(screen.getByText("15 Jan 2024 • 17 Jan 2024")).toBeInTheDocument();
  });

  test("shows correct status badge for pending request", () => {
    render(<LeaveRequestCard req={mockLeaveRequest} />);

    const badge = screen.getByTestId("cori-badge");
    expect(badge).toHaveTextContent("Pending");
    expect(badge).toHaveAttribute("data-color", "yellow");
    expect(badge).toHaveAttribute("data-size", "x-small");
  });

  test("shows correct status badge for approved request", () => {
    const approvedRequest = { ...mockLeaveRequest, status: LeaveStatus.Approved };
    render(<LeaveRequestCard req={approvedRequest} />);

    const badge = screen.getByTestId("cori-badge");
    expect(badge).toHaveTextContent("Approved");
    expect(badge).toHaveAttribute("data-color", "green");
  });

  test("shows correct status badge for rejected request", () => {
    const rejectedRequest = { ...mockLeaveRequest, status: LeaveStatus.Rejected };
    render(<LeaveRequestCard req={rejectedRequest} />);

    const badge = screen.getByTestId("cori-badge");
    expect(badge).toHaveTextContent("Rejected");
    expect(badge).toHaveAttribute("data-color", "red");
  });

  test("displays correct icon for annual leave", () => {
    render(<LeaveRequestCard req={mockLeaveRequest} />);

    expect(screen.getByTestId("beach-icon")).toBeInTheDocument();
    expect(screen.getByTestId("beach-icon")).toHaveAttribute("data-fontsize", "large");
  });

  test("displays correct icon for family leave", () => {
    const familyRequest = { ...mockLeaveRequest, leaveTypeName: "Family" };
    render(<LeaveRequestCard req={familyRequest} />);

    expect(screen.getByTestId("family-icon")).toBeInTheDocument();
  });

  test("displays correct icon for sick leave", () => {
    const sickRequest = { ...mockLeaveRequest, leaveTypeName: "Sick" };
    render(<LeaveRequestCard req={sickRequest} />);

    expect(screen.getByTestId("sick-icon")).toBeInTheDocument();
  });

  test("displays correct icon for compassion leave", () => {
    const compassionRequest = { ...mockLeaveRequest, leaveTypeName: "Compassion" };
    render(<LeaveRequestCard req={compassionRequest} />);

    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
  });

  test("displays correct icon for study leave", () => {
    const studyRequest = { ...mockLeaveRequest, leaveTypeName: "Study" };
    render(<LeaveRequestCard req={studyRequest} />);

    expect(screen.getByTestId("book-icon")).toBeInTheDocument();
  });

  test("displays correct icon for parental leave", () => {
    const parentalRequest = { ...mockLeaveRequest, leaveTypeName: "Parental" };
    render(<LeaveRequestCard req={parentalRequest} />);

    expect(screen.getByTestId("child-icon")).toBeInTheDocument();
  });

  test("handles unknown leave type without icon", () => {
    const unknownRequest = { ...mockLeaveRequest, leaveTypeName: "Unknown" };
    render(<LeaveRequestCard req={unknownRequest} />);

    expect(screen.getByText("Unknown Leave")).toBeInTheDocument();
    // Should not have any of the known icons
    expect(screen.queryByTestId("beach-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("family-icon")).not.toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    const { container } = render(<LeaveRequestCard req={mockLeaveRequest} />);

    const cardContainer = container.firstChild as HTMLElement;
    expect(cardContainer).toHaveClass(
      "bg-white",
      "rounded-2xl",
      "p-4",
      "shadow-sm",
      "h-48",
      "flex",
      "flex-col",
      "overflow-hidden"
    );
  });

  test("calculates duration correctly for single day", () => {
    const singleDayRequest = {
      ...mockLeaveRequest,
      startDate: "2024-01-15",
      endDate: "2024-01-15",
    };

    render(<LeaveRequestCard req={singleDayRequest} />);

    // For single day, duration should be 1 (0 diff + 1 for inclusive)
    expect(screen.getByText("1 days")).toBeInTheDocument();
  });

  test("handles empty comment", () => {
    const requestWithoutComment = { ...mockLeaveRequest, comment: "" };
    render(<LeaveRequestCard req={requestWithoutComment} />);

    // Should still render the comment section, just empty
    const commentElements = screen.getAllByText("");
    expect(commentElements.length).toBeGreaterThan(0);
  });

  test("renders all required sections", () => {
    render(<LeaveRequestCard req={mockLeaveRequest} />);

    // Check main sections are present
    expect(screen.getByText("Annual Leave")).toBeInTheDocument(); // Leave type
    expect(screen.getByText("3 days")).toBeInTheDocument(); // Duration
    expect(screen.getByTestId("cori-badge")).toBeInTheDocument(); // Status badge
    expect(screen.getByText("15 Jan 2024 • 17 Jan 2024")).toBeInTheDocument(); // Date range
    expect(screen.getByText("Going on vacation with family")).toBeInTheDocument(); // Comment
  });
});
