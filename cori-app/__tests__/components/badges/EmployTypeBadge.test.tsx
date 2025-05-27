import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EmployTypeBadge from "../../../src/components/badges/EmployTypeBadge";
import { EmployType } from "../../../src/types/common";

describe("EmployTypeBadge Component Tests", () => {
  test("renders with EmployType.FullTime", () => {
    render(<EmployTypeBadge status={EmployType.FullTime} />);

    expect(screen.getByText("Full Time")).toBeInTheDocument();
  });

  test("renders with EmployType.PartTime", () => {
    render(<EmployTypeBadge status={EmployType.PartTime} />);

    expect(screen.getByText("Part Time")).toBeInTheDocument();
  });

  test("renders with EmployType.Contract", () => {
    render(<EmployTypeBadge status={EmployType.Contract} />);

    expect(screen.getByText("Contract")).toBeInTheDocument();
  });

  test("renders with EmployType.Intern", () => {
    render(<EmployTypeBadge status={EmployType.Intern} />);

    expect(screen.getByText("Intern")).toBeInTheDocument();
  });

  test("renders with suspended status", () => {
    render(<EmployTypeBadge status="suspended" />);

    expect(screen.getByText("Suspended")).toBeInTheDocument();
  });

  test("renders with unknown status", () => {
    // Cast to bypass TypeScript checking for testing purposes
    render(<EmployTypeBadge status={999 as EmployType} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  test("applies default classes", () => {
    const { container } = render(<EmployTypeBadge status={EmployType.FullTime} />);

    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("w-fit", "min-w-fit", "text-nowrap");
  });

  test("renders all employment types correctly", () => {
    const employmentTests = [
      { status: EmployType.FullTime, expectedText: "Full Time" },
      { status: EmployType.PartTime, expectedText: "Part Time" },
      { status: EmployType.Contract, expectedText: "Contract" },
      { status: EmployType.Intern, expectedText: "Intern" },
      { status: "suspended" as const, expectedText: "Suspended" },
    ];

    employmentTests.forEach(({ status, expectedText }) => {
      const { unmount } = render(<EmployTypeBadge status={status} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
      unmount();
    });
  });

  test("uses small size for CoriBadge", () => {
    const { container } = render(<EmployTypeBadge status={EmployType.FullTime} />);

    // Check that the badge has small size styling
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("py-1", "px-3");
  });

  test("renders component without crashing for all valid statuses", () => {
    const validStatuses = [
      EmployType.FullTime,
      EmployType.PartTime,
      EmployType.Contract,
      EmployType.Intern,
      "suspended" as const,
    ];

    validStatuses.forEach((status) => {
      expect(() => render(<EmployTypeBadge status={status} />)).not.toThrow();
    });
  });
});
