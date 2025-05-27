import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MeetRequestsBadge from "../../../src/components/badges/MeetRequestsBadge";

describe("MeetRequestsBadge Component Tests", () => {
  test("renders nothing when requests is 0", () => {
    const { container } = render(<MeetRequestsBadge requests={0} />);

    expect(container.firstChild).toBeNull();
  });

  test("renders badge when requests is greater than 0", () => {
    render(<MeetRequestsBadge requests={1} />);

    expect(screen.getByText("1 Request")).toBeInTheDocument();
  });

  test("renders plural form for multiple requests", () => {
    render(<MeetRequestsBadge requests={3} />);

    expect(screen.getByText("3 Requests")).toBeInTheDocument();
  });

  test("renders with employee flag true", () => {
    render(<MeetRequestsBadge requests={2} employee={true} />);

    expect(screen.getByText("2 Requests Pending")).toBeInTheDocument();
  });

  test("renders with employee flag false", () => {
    render(<MeetRequestsBadge requests={2} employee={false} />);

    expect(screen.getByText("2 Requests")).toBeInTheDocument();
  });

  test("renders singular form with employee flag", () => {
    render(<MeetRequestsBadge requests={1} employee={true} />);

    expect(screen.getByText("1 Request Pending")).toBeInTheDocument();
  });

  test("applies correct styling classes", () => {
    const { container } = render(<MeetRequestsBadge requests={1} />);

    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass(
      "bg-sakura-200",
      "text-sakura-900",
      "pl-3",
      "pr-4",
      "py-1",
      "rounded-full",
      "border-sakura-500",
      "border-1",
      "flex",
      "items-center",
      "gap-2"
    );
  });

  test("contains indicator dot", () => {
    const { container } = render(<MeetRequestsBadge requests={1} />);

    const dot = container.querySelector(".rounded-full.bg-sakura-500.w-2.h-2");
    expect(dot).toBeInTheDocument();
  });

  test("text has correct styling", () => {
    const { container } = render(<MeetRequestsBadge requests={1} />);

    const text = container.querySelector("p");
    expect(text).toHaveClass("text-sakura-800", "font-semibold", "text-sm");
  });
});
