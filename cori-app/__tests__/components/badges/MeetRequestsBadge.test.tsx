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

    expect(screen.getByText("1 New Request")).toBeInTheDocument();
  });

  test("renders plural form for multiple requests", () => {
    render(<MeetRequestsBadge requests={3} />);

    expect(screen.getByText("3 New Requests")).toBeInTheDocument();
  });

  test("renders singular form with employee flag", () => {
    render(<MeetRequestsBadge requests={1} employee={true} />);

    expect(screen.getByText("1 Request Pending")).toBeInTheDocument();
  });
});
