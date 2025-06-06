import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GatheringStatusBadge from "../../../src/components/badges/GatheringStatusBadge";
import { MeetStatus } from "../../../src/types/common";

describe("GatheringStatusBadge Component Tests", () => {
  test("renders with MeetStatus.Requested", () => {
    render(<GatheringStatusBadge status={MeetStatus.Requested} />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("renders with MeetStatus.Upcoming", () => {
    render(<GatheringStatusBadge status={MeetStatus.Upcoming} />);

    expect(screen.getByText("In Person")).toBeInTheDocument();
  });

  test("renders with MeetStatus.Rejected", () => {
    render(<GatheringStatusBadge status={MeetStatus.Rejected} />);

    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  test("renders with MeetStatus.Completed", () => {
    render(<GatheringStatusBadge status={MeetStatus.Completed} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("renders with Online string status", () => {
    render(<GatheringStatusBadge status="Online" />);

    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  test("renders with unknown status", () => {
    render(<GatheringStatusBadge status="unknown" />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
