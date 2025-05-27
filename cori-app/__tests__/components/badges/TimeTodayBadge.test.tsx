import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TimeTodayBadge from "../../../src/components/badges/TimeTodayBadge";
import * as dateUtils from "../../../src/utils/dateUtils";
import dayjs from "dayjs";

// Mock the dateUtils module
jest.mock("../../../src/utils/dateUtils", () => ({
  isDateInPast: jest.fn(),
}));

// Mock dayjs
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  const mockDayjs = jest.fn((date) => originalDayjs(date));
  Object.assign(mockDayjs, originalDayjs);
  return mockDayjs;
});

const mockIsDateInPast = dateUtils.isDateInPast as jest.MockedFunction<
  typeof dateUtils.isDateInPast
>;
const mockDayjs = dayjs as jest.MockedFunction<typeof dayjs>;

describe("TimeTodayBadge Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default dayjs mock behavior
    mockDayjs.mockImplementation(
      (date) =>
        ({
          fromNow: () => "2 hours ago",
        } as any)
    );
  });

  test("renders with past date (red color)", () => {
    mockIsDateInPast.mockReturnValue(true);
    mockDayjs.mockImplementation(
      (date) =>
        ({
          fromNow: () => "2 hours ago",
        } as any)
    );

    render(<TimeTodayBadge date="2024-01-01T10:00:00Z" />);

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  test("renders with future date (green color)", () => {
    mockIsDateInPast.mockReturnValue(false);
    mockDayjs.mockImplementation(
      (date) =>
        ({
          fromNow: () => "in 2 hours",
        } as any)
    );

    render(<TimeTodayBadge date="2024-12-31T10:00:00Z" />);

    expect(screen.getByText("in 2 hours")).toBeInTheDocument();
  });

  test("calls isDateInPast with correct date", () => {
    mockIsDateInPast.mockReturnValue(false);
    const testDate = "2024-06-15T14:30:00Z";

    render(<TimeTodayBadge date={testDate} />);

    expect(mockIsDateInPast).toHaveBeenCalledWith(testDate);
  });

  test("calls dayjs with correct date", () => {
    mockIsDateInPast.mockReturnValue(false);
    const testDate = "2024-06-15T14:30:00Z";

    render(<TimeTodayBadge date={testDate} />);

    expect(mockDayjs).toHaveBeenCalledWith(testDate);
  });

  test("applies correct classes", () => {
    mockIsDateInPast.mockReturnValue(false);
    const { container } = render(<TimeTodayBadge date="2024-12-31T10:00:00Z" />);

    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("w-fit");
  });

  test("uses x-small size for CoriBadge", () => {
    mockIsDateInPast.mockReturnValue(false);
    const { container } = render(<TimeTodayBadge date="2024-12-31T10:00:00Z" />);

    // Check that the badge has x-small size styling
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("py-1", "px-2");
  });

  test("renders different time formats correctly", () => {
    const timeFormats = [
      "a few seconds ago",
      "2 minutes ago",
      "an hour ago",
      "in 5 minutes",
      "in 2 hours",
      "tomorrow",
    ];

    timeFormats.forEach((timeFormat) => {
      mockIsDateInPast.mockReturnValue(timeFormat.includes("ago"));
      mockDayjs.mockImplementation(
        () =>
          ({
            fromNow: () => timeFormat,
          } as any)
      );

      const { unmount } = render(<TimeTodayBadge date="2024-01-01T10:00:00Z" />);
      expect(screen.getByText(timeFormat)).toBeInTheDocument();
      unmount();
    });
  });

  test("handles edge case dates", () => {
    const edgeCases = [
      "1970-01-01T00:00:00Z", // Unix epoch
      "2038-01-19T03:14:07Z", // Year 2038 problem
      "2024-02-29T12:00:00Z", // Leap year
    ];

    edgeCases.forEach((date) => {
      mockIsDateInPast.mockReturnValue(true);
      mockDayjs.mockImplementation(
        () =>
          ({
            fromNow: () => "some time ago",
          } as any)
      );

      expect(() => render(<TimeTodayBadge date={date} />)).not.toThrow();
    });
  });
});
