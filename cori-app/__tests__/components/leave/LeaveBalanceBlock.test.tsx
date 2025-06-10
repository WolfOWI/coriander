import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeaveBalanceBlock from "../../../src/components/leave/LeaveBalanceBlock";

interface LeaveBalanceBlockProps {
  leaveType: string;
  remainingDays: number;
  totalDays: number;
  description: string;
  className?: string;
}

describe("LeaveBalanceBlock Component Tests", () => {
  const defaultProps: LeaveBalanceBlockProps = {
    leaveType: "Annual",
    remainingDays: 10,
    totalDays: 15,
    description: "Test description",
  };

  test("renders basic leave balance information", () => {
    render(<LeaveBalanceBlock {...defaultProps} />);

    // Check if remaining days are displayed
    expect(screen.getByText("10")).toBeInTheDocument();

    // Check if total days are displayed
    expect(screen.getByText(/15/)).toBeInTheDocument();

    // Check if leave type is displayed (with "Days" suffix)
    expect(screen.getByText(/Annual.*Days/)).toBeInTheDocument();
  });

  test('shows "No" when remaining days is 0', () => {
    render(<LeaveBalanceBlock {...defaultProps} remainingDays={0} />);

    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("displays correct icon based on leave type", () => {
    const { rerender } = render(<LeaveBalanceBlock {...defaultProps} leaveType="Annual" />);
    expect(screen.getByTestId("BeachAccessIcon")).toBeInTheDocument();

    rerender(<LeaveBalanceBlock {...defaultProps} leaveType="Sick" />);
    expect(screen.getByTestId("SickIcon")).toBeInTheDocument();

    rerender(<LeaveBalanceBlock {...defaultProps} leaveType="Parental" />);
    expect(screen.getByTestId("ChildFriendlyIcon")).toBeInTheDocument();

    rerender(<LeaveBalanceBlock {...defaultProps} leaveType="Family Responsibility" />);
    expect(screen.getByTestId("FamilyRestroomIcon")).toBeInTheDocument();

    rerender(<LeaveBalanceBlock {...defaultProps} leaveType="Study" />);
    expect(screen.getByTestId("MenuBookIcon")).toBeInTheDocument();

    rerender(<LeaveBalanceBlock {...defaultProps} leaveType="Compassionate" />);
    expect(screen.getByTestId("HeartBrokenIcon")).toBeInTheDocument();
  });

  test("shows additional information on hover", () => {
    render(<LeaveBalanceBlock {...defaultProps} />);
    const block = screen.getByTestId("BeachAccessIcon").closest("div[class*='bg-warmstone-50']");
    expect(block).toBeInTheDocument();

    if (block) {
      fireEvent.mouseEnter(block);
      expect(screen.getByText(/out of.*days/i)).toBeInTheDocument();
    }
  });

  test("handles custom className prop", () => {
    const customClass = "custom-class";
    render(<LeaveBalanceBlock {...defaultProps} className={customClass} />);
    const block = screen.getByTestId("BeachAccessIcon").closest("div[class*='bg-warmstone-50']");
    expect(block).toHaveClass(customClass);
  });

  test("displays correct text for Family Responsibility leave", () => {
    render(<LeaveBalanceBlock {...defaultProps} leaveType="Family Responsibility" />);
    expect(screen.getByText(/Family.*Days/)).toBeInTheDocument();
  });

  test("displays correct text for Compassionate leave", () => {
    render(<LeaveBalanceBlock {...defaultProps} leaveType="Compassionate" />);
    expect(screen.getByText(/Grief.*Days/)).toBeInTheDocument();
  });
});
