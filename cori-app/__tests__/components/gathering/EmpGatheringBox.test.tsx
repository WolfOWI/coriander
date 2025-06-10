import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmpGatheringBox from "../../../src/components/gathering/EmpGatheringBox";
import { Gathering } from "../../../src/interfaces/gathering/gathering";
import { GatheringType, MeetStatus, ReviewStatus } from "../../../src/types/common";

// Mock the formatTimestampToDate and formatTimestampToTime functions
jest.mock("../../../src/utils/dateUtils", () => ({
  formatTimestampToDate: jest.fn((timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-GB");
  }),
  formatTimestampToTime: jest.fn((timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }),
}));

// Mock window.open
Object.defineProperty(window, "open", {
  writable: true,
  value: jest.fn(),
});

describe("EmpGatheringBox Component Tests", () => {
  const mockMeetingGathering: Gathering = {
    $id: "test-id-1",
    id: 1,
    type: GatheringType.Meeting,
    adminId: 1,
    adminName: "John Smith",
    employeeId: 2,
    employeeName: "Jane Doe",
    isOnline: true,
    meetLink: "https://meet.google.com/test-link",
    meetLocation: "Conference Room A",
    startDate: new Date("2024-12-01T10:00:00Z"),
    endDate: new Date("2024-12-01T11:00:00Z"),
    purpose: "Weekly team sync to discuss project progress",
    meetingStatus: MeetStatus.Upcoming,
  };

  const mockPerformanceReviewGathering: Gathering = {
    $id: "test-id-2",
    id: 2,
    type: GatheringType.PerformanceReview,
    adminId: 1,
    adminName: "Sarah Wilson",
    employeeId: 2,
    employeeName: "Jane Doe",
    isOnline: false,
    meetLocation: "HR Office",
    startDate: new Date("2024-12-05T14:00:00Z"),
    endDate: new Date("2024-12-05T15:00:00Z"),
    rating: 4,
    comment: "Excellent performance this quarter, well done!",
    docUrl: "https://example.com/performance-review.pdf",
    reviewStatus: ReviewStatus.Completed,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Meeting Component Behaviour", () => {
    test("renders meeting gathering box with correct heading and admin name", () => {
      render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      expect(screen.getByText("Meet with John Smith")).toBeInTheDocument();
      expect(screen.getByText("Weekly team sync to discuss project progress")).toBeInTheDocument();
    });

    test("displays online meeting status icon correctly", () => {
      render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      const onlineIcon = screen.getByTestId("LanguageRoundedIcon");
      expect(onlineIcon).toBeInTheDocument();
      expect(onlineIcon).toHaveClass("text-blue-300");
    });

    test("displays in-person meeting status icon correctly", () => {
      const inPersonMeeting = {
        ...mockMeetingGathering,
        isOnline: false,
        meetLink: undefined,
      };

      render(<EmpGatheringBox gathering={inPersonMeeting} />);

      const inPersonIcon = screen.getByTestId("EmojiPeopleRoundedIcon");
      expect(inPersonIcon).toBeInTheDocument();
      expect(inPersonIcon).toHaveClass("text-purple-400");
    });

    test("displays completed meeting status icon correctly", () => {
      const completedMeeting = {
        ...mockMeetingGathering,
        meetingStatus: MeetStatus.Completed,
      };

      render(<EmpGatheringBox gathering={completedMeeting} />);

      const completedIcon = screen.getByTestId("CheckCircleRoundedIcon");
      expect(completedIcon).toBeInTheDocument();
      expect(completedIcon).toHaveClass("text-corigreen-400");
    });

    test("displays meeting link correctly for online meetings", () => {
      render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      expect(screen.getByText("https://meet.google.com/test-link")).toBeInTheDocument();
    });

    test("displays meeting location correctly for in-person meetings", () => {
      const inPersonMeeting = {
        ...mockMeetingGathering,
        isOnline: false,
        meetLink: undefined,
      };

      render(<EmpGatheringBox gathering={inPersonMeeting} />);

      expect(screen.getByText("Conference Room A")).toBeInTheDocument();
    });

    test("shows join button only for upcoming online meetings", () => {
      render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      const joinButton = screen.getByRole("button", { name: "Join" });
      expect(joinButton).toBeInTheDocument();
    });

    test("does not show join button for completed meetings", () => {
      const completedMeeting = {
        ...mockMeetingGathering,
        meetingStatus: MeetStatus.Completed,
      };

      render(<EmpGatheringBox gathering={completedMeeting} />);

      expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
    });

    test("does not show join button for in-person meetings", () => {
      const inPersonMeeting = {
        ...mockMeetingGathering,
        isOnline: false,
        meetLink: undefined,
      };

      render(<EmpGatheringBox gathering={inPersonMeeting} />);

      expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
    });

    test("opens meeting link in new window when join button is clicked", () => {
      render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      const joinButton = screen.getByRole("button", { name: "Join" });
      fireEvent.click(joinButton);

      expect(window.open).toHaveBeenCalledWith("https://meet.google.com/test-link", "_blank");
    });

    test("prepends https:// to meeting link when missing protocol", () => {
      const meetingWithoutProtocol = {
        ...mockMeetingGathering,
        meetLink: "meet.google.com/test-link",
      };

      render(<EmpGatheringBox gathering={meetingWithoutProtocol} />);

      const joinButton = screen.getByRole("button", { name: "Join" });
      fireEvent.click(joinButton);

      expect(window.open).toHaveBeenCalledWith("https://meet.google.com/test-link", "_blank");
    });
  });

  describe("Performance Review Component Behaviour", () => {
    test("renders performance review gathering box with correct heading and admin name", () => {
      render(<EmpGatheringBox gathering={mockPerformanceReviewGathering} />);

      expect(screen.getByText("Review with Sarah Wilson")).toBeInTheDocument();
    });

    test("displays performance review icon correctly", () => {
      render(<EmpGatheringBox gathering={mockPerformanceReviewGathering} />);

      const starIcons = screen.getAllByTestId("StarRoundedIcon");
      expect(starIcons[0]).toBeInTheDocument(); // Get the first star icon (performance review icon)
      expect(starIcons[0]).toHaveClass("text-corigreen-400");
    });

    test("displays performance review comment when present", () => {
      render(<EmpGatheringBox gathering={mockPerformanceReviewGathering} />);

      expect(
        screen.getByText("Excellent performance this quarter, well done!")
      ).toBeInTheDocument();
    });

    test("displays performance review rating when present", () => {
      render(<EmpGatheringBox gathering={mockPerformanceReviewGathering} />);

      expect(screen.getByText("4")).toBeInTheDocument();
      const starIcons = screen.getAllByTestId("StarRoundedIcon");
      expect(starIcons.length).toBeGreaterThanOrEqual(2); // Should have both performance review icon and rating star
    });

    test("displays PDF attachment indicator when document URL is present", () => {
      render(<EmpGatheringBox gathering={mockPerformanceReviewGathering} />);

      expect(screen.getByText("PDF Attached")).toBeInTheDocument();
      expect(screen.getByTestId("TextSnippetRoundedIcon")).toBeInTheDocument();
    });

    test("does not display rating section when rating is zero or undefined", () => {
      const reviewWithoutRating = {
        ...mockPerformanceReviewGathering,
        rating: 0,
      };

      render(<EmpGatheringBox gathering={reviewWithoutRating} />);

      // Should only have one star icon (the performance review icon, not the rating star)
      const starIcons = screen.getAllByTestId("StarRoundedIcon");
      expect(starIcons.length).toBe(1);
    });

    test("does not display comment when not present", () => {
      const reviewWithoutComment = {
        ...mockPerformanceReviewGathering,
        comment: undefined,
      };

      render(<EmpGatheringBox gathering={reviewWithoutComment} />);

      expect(
        screen.queryByText("Excellent performance this quarter, well done!")
      ).not.toBeInTheDocument();
    });

    test("does not display PDF attachment indicator when document URL is not present", () => {
      const reviewWithoutDoc = {
        ...mockPerformanceReviewGathering,
        docUrl: undefined,
      };

      render(<EmpGatheringBox gathering={reviewWithoutDoc} />);

      expect(screen.queryByText("PDF Attached")).not.toBeInTheDocument();
    });
  });

  describe("Date and Time Display", () => {
    test("displays formatted date and time correctly", () => {
      render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      // Check that date and time formatting functions are called
      expect(screen.getByText(/01\/12\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/12:00 - 13:00/)).toBeInTheDocument();
    });

    test("displays 'No date' when start date is not provided", () => {
      const gatheringWithoutDate = {
        ...mockMeetingGathering,
        startDate: undefined,
      };

      render(<EmpGatheringBox gathering={gatheringWithoutDate} />);

      expect(screen.getByText("No date")).toBeInTheDocument();
    });

    test("displays 'No time' when dates are not provided", () => {
      const gatheringWithoutTime = {
        ...mockMeetingGathering,
        startDate: undefined,
        endDate: undefined,
      };

      render(<EmpGatheringBox gathering={gatheringWithoutTime} />);

      expect(screen.getByText("No time")).toBeInTheDocument();
    });
  });

  describe("Component Structure and Styling", () => {
    test("applies correct CSS classes to main container", () => {
      const { container } = render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(
        "bg-warmstone-50",
        "p-4",
        "rounded-2xl",
        "w-full",
        "flex",
        "flex-col",
        "justify-between",
        "gap-3",
        "shadow-sm"
      );
    });

    test("renders all required sections", () => {
      const { container } = render(<EmpGatheringBox gathering={mockMeetingGathering} />);

      // Check for main structural elements
      expect(container.querySelector(".bg-warmstone-50")).toBeInTheDocument();
      expect(container.querySelector(".bg-warmstone-100")).toBeInTheDocument();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    test("handles gathering with minimal data gracefully", () => {
      const minimalGathering: Gathering = {
        $id: "minimal-id",
        id: 999,
        type: GatheringType.Meeting,
        adminId: 1,
        adminName: "Test Admin",
        employeeId: 2,
        employeeName: "Test Employee",
        meetingStatus: MeetStatus.Upcoming,
      };

      render(<EmpGatheringBox gathering={minimalGathering} />);

      expect(screen.getByText("Meet with Test Admin")).toBeInTheDocument();
      expect(screen.getByText("No date")).toBeInTheDocument();
      expect(screen.getByText("No time")).toBeInTheDocument();
    });

    test("handles join button click when meet link is undefined", () => {
      const gatheringWithoutLink = {
        ...mockMeetingGathering,
        meetLink: undefined,
      };

      render(<EmpGatheringBox gathering={gatheringWithoutLink} />);

      const joinButton = screen.getByRole("button", { name: "Join" });
      fireEvent.click(joinButton);

      // Should not call window.open when meetLink is undefined
      expect(window.open).not.toHaveBeenCalled();
    });
  });
});
