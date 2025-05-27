import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MeetRequestCard from "../../../../src/components/cards/meetingCards/MeetRequestCard";
import { MeetStatus } from "../../../../src/types/common";

// Mock dayjs
jest.mock("dayjs", () => {
  const mockDayjs = jest.fn((date) => ({
    format: jest.fn((format) => {
      if (format === "h:mm A, D MMM YYYY") {
        return "2:30 PM, 15 Jan 2024";
      }
      return "formatted-date";
    }),
  }));
  Object.assign(mockDayjs, jest.requireActual("dayjs"));
  return mockDayjs;
});

// Mock CoriBtn component
jest.mock("../../../../src/components/buttons/CoriBtn", () => {
  return function MockCoriBtn({
    children,
    onClick,
    secondary,
    style,
    className,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    secondary?: boolean;
    style?: string;
    className?: string;
  }) {
    return (
      <button
        onClick={onClick}
        data-testid="cori-btn"
        data-secondary={secondary}
        data-style={style}
        className={className}
      >
        {children}
      </button>
    );
  };
});

// Mock Antd Avatar
jest.mock("antd", () => ({
  Avatar: ({ src, icon }: { src?: string; icon?: React.ReactNode }) => (
    <div data-testid="avatar" data-src={src}>
      {src ? "Avatar with image" : icon}
    </div>
  ),
}));

// Mock Icons
jest.mock("../../../../src/constants/icons", () => ({
  Icons: {
    Person: () => <span data-testid="person-icon">👤</span>,
  },
}));

describe("MeetRequestCard Component Tests", () => {
  const mockMeetRequest = {
    meetingId: 1,
    employeeId: 123,
    employeeName: "John Doe",
    profilePicture: "profile.jpg",
    purpose: "Discuss project requirements and timeline",
    requestedAt: "2024-01-15T14:30:00Z",
    status: MeetStatus.Requested,
  };

  const mockOnApprove = jest.fn();
  const mockOnReject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with basic meeting request data", () => {
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("at 2:30 PM, 15 Jan 2024")).toBeInTheDocument();
    expect(screen.getByText("Discuss project requirements and timeline")).toBeInTheDocument();
  });

  test("displays avatar with profile picture", () => {
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("data-src", "profile.jpg");
  });

  test("displays default avatar when no profile picture", () => {
    const requestWithoutPicture = { ...mockMeetRequest, profilePicture: "" };
    render(
      <MeetRequestCard
        meetRequest={requestWithoutPicture}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).not.toHaveAttribute("data-src");
    expect(screen.getByTestId("person-icon")).toBeInTheDocument();
  });

  test("calls onApprove when Accept button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const acceptButton = screen.getByText("Accept");
    await user.click(acceptButton);

    expect(mockOnApprove).toHaveBeenCalledTimes(1);
  });

  test("calls onReject when Reject button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const rejectButton = screen.getByText("Reject");
    await user.click(rejectButton);

    expect(mockOnReject).toHaveBeenCalledTimes(1);
  });

  test("renders Accept and Reject buttons with correct styles", () => {
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const buttons = screen.getAllByTestId("cori-btn");
    expect(buttons).toHaveLength(2);

    const rejectButton = screen.getByText("Reject").closest("[data-testid='cori-btn']");
    const acceptButton = screen.getByText("Accept").closest("[data-testid='cori-btn']");

    expect(rejectButton).toHaveAttribute("data-secondary", "true");
    expect(rejectButton).toHaveAttribute("data-style", "red");
    expect(acceptButton).not.toHaveAttribute("data-secondary");
  });

  test("applies correct CSS classes for card container", () => {
    const { container } = render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const cardContainer = container.querySelector(".flex.flex-col.w-full");
    expect(cardContainer).toBeInTheDocument();
    expect(cardContainer).toHaveClass(
      "bg-warmstone-50",
      "p-4",
      "rounded-2xl",
      "hover:shadow-md",
      "transition-all",
      "cursor-pointer",
      "group",
      "mt-3"
    );
  });

  test("applies correct CSS classes for button container", () => {
    const { container } = render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const buttonContainer = container.querySelector(".flex.gap-2.w-full");
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer).toHaveClass(
      "max-h-0",
      "overflow-hidden",
      "group-hover:max-h-20",
      "group-hover:mt-3",
      "transition-all",
      "duration-300"
    );
  });

  test("handles missing purpose gracefully", () => {
    const requestWithoutPurpose = { ...mockMeetRequest, purpose: undefined };
    render(
      <MeetRequestCard
        meetRequest={requestWithoutPurpose}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Should still render without crashing
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("handles empty purpose", () => {
    const requestWithEmptyPurpose = { ...mockMeetRequest, purpose: "" };
    render(
      <MeetRequestCard
        meetRequest={requestWithEmptyPurpose}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Should render empty purpose text
    const emptyElements = screen.getAllByText("");
    expect(emptyElements.length).toBeGreaterThan(0);
  });

  test("formats requested date correctly", () => {
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("at 2:30 PM, 15 Jan 2024")).toBeInTheDocument();
  });

  test("renders all required elements", () => {
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Check all main elements are present
    expect(screen.getByTestId("avatar")).toBeInTheDocument(); // Avatar
    expect(screen.getByText("John Doe")).toBeInTheDocument(); // Employee name
    expect(screen.getByText("at 2:30 PM, 15 Jan 2024")).toBeInTheDocument(); // Requested time
    expect(screen.getByText("Discuss project requirements and timeline")).toBeInTheDocument(); // Purpose
    expect(screen.getByText("Reject")).toBeInTheDocument(); // Reject button
    expect(screen.getByText("Accept")).toBeInTheDocument(); // Accept button
  });

  test("handles click events with fireEvent", () => {
    render(
      <MeetRequestCard
        meetRequest={mockMeetRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const acceptButton = screen.getByText("Accept");
    const rejectButton = screen.getByText("Reject");

    fireEvent.click(acceptButton);
    expect(mockOnApprove).toHaveBeenCalledTimes(1);

    fireEvent.click(rejectButton);
    expect(mockOnReject).toHaveBeenCalledTimes(1);
  });
});
