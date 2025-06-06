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
});
