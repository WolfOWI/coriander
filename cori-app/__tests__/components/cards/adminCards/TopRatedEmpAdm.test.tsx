import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TopRatedEmpCard from "../../../../src/components/cards/adminCards/TopRatedEmpAdm";
import { EmployType } from "../../../../src/types/common";

// Mock the imageUtils module
jest.mock("../../../../src/utils/imageUtils", () => ({
  getFullImageUrl: jest.fn((url) => (url ? `full-${url}` : null)),
}));

// Mock the EmployTypeBadge component
jest.mock("../../../../src/components/badges/EmployTypeBadge", () => {
  return function MockEmployTypeBadge({ status }: { status: string }) {
    return <div data-testid="employ-type-badge">{status}</div>;
  };
});

// Mock MUI icon
jest.mock("@mui/icons-material/StarRounded", () => {
  return function MockStarIcon({ className }: { className?: string }) {
    return (
      <span data-testid="star-icon" className={className}>
        ★
      </span>
    );
  };
});

describe("TopRatedEmpCard Component Tests", () => {
  const mockEmployee = {
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    averageRating: 4.5,
    employType: "FullTime",
    profilePicture: "profile.jpg",
    isSuspended: false,
  };

  test("renders with basic employee data", () => {
    render(<TopRatedEmpCard {...mockEmployee} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  test("displays profile picture with correct src", () => {
    render(<TopRatedEmpCard {...mockEmployee} />);

    const image = screen.getByAltText("John Doe");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "full-profile.jpg");
  });

  test("handles missing profile picture", () => {
    const employeeWithoutPicture = { ...mockEmployee, profilePicture: "" };
    render(<TopRatedEmpCard {...employeeWithoutPicture} />);

    // When profilePicture is empty, should show PersonRounded icon instead of image
    const icon = screen.getByTestId("PersonRoundedIcon");
    expect(icon).toBeInTheDocument();
  });

  test("displays star rating with correct formatting", () => {
    render(<TopRatedEmpCard {...mockEmployee} />);

    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  test("shows suspended status when employee is suspended", () => {
    const suspendedEmployee = { ...mockEmployee, isSuspended: true };
    render(<TopRatedEmpCard {...suspendedEmployee} />);

    const badge = screen.getByTestId("employ-type-badge");
    expect(badge).toHaveTextContent("suspended");
  });

  test("shows employment type when not suspended", () => {
    render(<TopRatedEmpCard {...mockEmployee} />);

    const badge = screen.getByTestId("employ-type-badge");
    expect(badge).toHaveTextContent("FullTime");
  });

  test("applies correct CSS classes", () => {
    const { container } = render(<TopRatedEmpCard {...mockEmployee} />);

    const cardContainer = container.querySelector(".p-1");
    expect(cardContainer).toBeInTheDocument();

    const cardContent = container.querySelector(".flex.items-center.gap-3");
    expect(cardContent).toBeInTheDocument();
    expect(cardContent).toHaveClass("hover:bg-zinc-100", "rounded-xl", "min-h-[56px]");
  });

  test("truncates long names and job titles", () => {
    const longNameEmployee = {
      ...mockEmployee,
      fullName: "Very Long Employee Name That Should Be Truncated",
      jobTitle: "Very Long Job Title That Should Also Be Truncated",
    };

    render(<TopRatedEmpCard {...longNameEmployee} />);

    const nameElement = screen.getByText(longNameEmployee.fullName);
    const titleElement = screen.getByText(longNameEmployee.jobTitle);

    expect(nameElement).toHaveClass("truncate");
    expect(titleElement).toHaveClass("truncate");
  });

  test("formats rating to one decimal place", () => {
    const employeeWithPreciseRating = { ...mockEmployee, averageRating: 4.567 };
    render(<TopRatedEmpCard {...employeeWithPreciseRating} />);

    expect(screen.getByText("4.6")).toBeInTheDocument();
  });

  test("handles zero rating", () => {
    const employeeWithZeroRating = { ...mockEmployee, averageRating: 0 };
    render(<TopRatedEmpCard {...employeeWithZeroRating} />);

    expect(screen.getByText("0.0")).toBeInTheDocument();
  });

  test("renders all required elements", () => {
    render(<TopRatedEmpCard {...mockEmployee} />);

    // Check all main elements are present
    expect(screen.getByAltText("John Doe")).toBeInTheDocument(); // Profile picture
    expect(screen.getByText("John Doe")).toBeInTheDocument(); // Name
    expect(screen.getByText("Software Engineer")).toBeInTheDocument(); // Job title
    expect(screen.getByTestId("employ-type-badge")).toBeInTheDocument(); // Employment badge
    expect(screen.getByTestId("star-icon")).toBeInTheDocument(); // Star icon
    expect(screen.getByText("4.5")).toBeInTheDocument(); // Rating
  });
});
