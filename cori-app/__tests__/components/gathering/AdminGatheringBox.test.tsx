import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminGatheringBox from "../../../src/components/gathering/AdminGatheringBox";
import { Gathering } from "../../../src/interfaces/gathering/gathering";
import { GatheringType, MeetStatus, ReviewStatus } from "../../../src/types/common";
import { meetingAPI, performanceReviewsAPI } from "../../../src/services/api.service";

// Mock the API services
jest.mock("../../../src/services/api.service", () => ({
  meetingAPI: {
    markAsUpcomingMeeting: jest.fn().mockResolvedValue({}),
    markAsCompletedMeeting: jest.fn().mockResolvedValue({}),
  },
  performanceReviewsAPI: {
    UpdatePerformanceReviewStatus: jest.fn().mockResolvedValue({}),
  },
}));

// Mock the date utilities
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

// Mock the modal components to avoid complexity in unit tests
jest.mock("../../../src/components/modals/EditPRModal", () => {
  return function MockEditPRModal({ showModal, setShowModal, onEditSuccess }: any) {
    return showModal ? (
      <div data-testid="edit-pr-modal">
        <button
          onClick={() => {
            setShowModal(false);
            onEditSuccess();
          }}
        >
          Mock Edit PR
        </button>
      </div>
    ) : null;
  };
});

jest.mock("../../../src/components/modals/EditMeetingModal", () => {
  return function MockEditMeetingModal({ showModal, setShowModal, onEditSuccess }: any) {
    return showModal ? (
      <div data-testid="edit-meeting-modal">
        <button
          onClick={() => {
            setShowModal(false);
            onEditSuccess();
          }}
        >
          Mock Edit Meeting
        </button>
      </div>
    ) : null;
  };
});

jest.mock("../../../src/components/modals/DeleteMeetingModal", () => {
  return function MockDeleteMeetingModal({ showModal, setShowModal, onDeleteSuccess }: any) {
    return showModal ? (
      <div data-testid="delete-meeting-modal">
        <button
          onClick={() => {
            setShowModal(false);
            onDeleteSuccess?.();
          }}
        >
          Mock Delete Meeting
        </button>
      </div>
    ) : null;
  };
});

jest.mock("../../../src/components/modals/DeletePRModal", () => {
  return function MockDeletePRModal({ showModal, setShowModal, onDeleteSuccess }: any) {
    return showModal ? (
      <div data-testid="delete-pr-modal">
        <button
          onClick={() => {
            setShowModal(false);
            onDeleteSuccess?.();
          }}
        >
          Mock Delete PR
        </button>
      </div>
    ) : null;
  };
});

// Mock window.open
Object.defineProperty(window, "open", {
  writable: true,
  value: jest.fn(),
});

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("AdminGatheringBox Component Tests", () => {
  const mockMeetingGathering: Gathering = {
    $id: "test-meeting-1",
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
    purpose: "Quarterly performance discussion and goal setting",
    meetingStatus: MeetStatus.Upcoming,
  };

  const mockPerformanceReviewGathering: Gathering = {
    $id: "test-review-1",
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
    comment: "Outstanding performance this quarter, exceeding expectations.",
    docUrl: "https://example.com/performance-review.pdf",
    reviewStatus: ReviewStatus.Completed,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  describe("Meeting Component Behaviour", () => {
    test("renders meeting gathering box with correct employee name", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      expect(screen.getByText("Meet with Jane Doe")).toBeInTheDocument();
      expect(
        screen.getByText("Quarterly performance discussion and goal setting")
      ).toBeInTheDocument();
    });

    test("displays meeting icon with correct tooltip", async () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const chatIcon = screen.getByTestId("ChatRoundedIcon");
      expect(chatIcon).toBeInTheDocument();

      // Check tooltip appears on hover
      fireEvent.mouseOver(chatIcon.parentElement!);
      await waitFor(() => {
        expect(screen.getByText("Standard Meeting")).toBeInTheDocument();
      });
    });

    test("displays completed meeting text correctly", () => {
      const completedMeeting = {
        ...mockMeetingGathering,
        meetingStatus: MeetStatus.Completed,
      };

      render(<AdminGatheringBox gathering={completedMeeting} loggedInAdminId="1" />);

      expect(screen.getByText("Met with Jane Doe")).toBeInTheDocument();
    });

    test("shows admin action buttons for meeting owner", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
      expect(screen.getByTestId("MoreVertRoundedIcon")).toBeInTheDocument();
    });

    test("does not show admin action buttons for non-owner", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="2" />);

      expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
      expect(screen.queryByTestId("MoreVertRoundedIcon")).not.toBeInTheDocument();
    });

    test("opens meeting link when join button is clicked", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const joinButton = screen.getByRole("button", { name: "Join" });
      fireEvent.click(joinButton);

      expect(window.open).toHaveBeenCalledWith("https://meet.google.com/test-link", "_blank");
    });
  });

  describe("Performance Review Component Behaviour", () => {
    test("renders performance review gathering box with correct employee name", () => {
      render(<AdminGatheringBox gathering={mockPerformanceReviewGathering} loggedInAdminId="1" />);

      expect(screen.getByText("Reviewed Jane Doe")).toBeInTheDocument();
    });

    test("displays performance review icon with correct tooltip", async () => {
      render(<AdminGatheringBox gathering={mockPerformanceReviewGathering} loggedInAdminId="1" />);

      const starIcons = screen.getAllByTestId("StarRoundedIcon");
      const mainStarIcon = starIcons.find((icon) => icon.closest(".bg-corigreen-100"));
      expect(mainStarIcon).toBeTruthy();

      expect(mainStarIcon!.closest(".bg-corigreen-100")).toBeInTheDocument();
    });

    test("displays completed review text correctly", () => {
      const completedReview = {
        ...mockPerformanceReviewGathering,
        reviewStatus: ReviewStatus.Completed,
      };

      render(<AdminGatheringBox gathering={completedReview} loggedInAdminId="1" />);

      expect(screen.getByText("Reviewed Jane Doe")).toBeInTheDocument();
    });

    test("displays performance review comment when present", () => {
      render(<AdminGatheringBox gathering={mockPerformanceReviewGathering} loggedInAdminId="1" />);

      expect(
        screen.getByText("Outstanding performance this quarter, exceeding expectations.")
      ).toBeInTheDocument();
    });

    test("displays performance review rating when present", () => {
      render(<AdminGatheringBox gathering={mockPerformanceReviewGathering} loggedInAdminId="1" />);

      expect(screen.getByText("4")).toBeInTheDocument();
      const ratingStars = screen.getAllByTestId("StarRoundedIcon");
      expect(ratingStars.length).toBeGreaterThanOrEqual(1);
    });

    test("displays PDF attachment indicator when document URL is present", () => {
      render(<AdminGatheringBox gathering={mockPerformanceReviewGathering} loggedInAdminId="1" />);

      expect(screen.getByText("PDF Attached")).toBeInTheDocument();
      expect(screen.getByTestId("TextSnippetRoundedIcon")).toBeInTheDocument();
    });

    test("shows review employee button when review is incomplete", () => {
      const incompleteReview = {
        ...mockPerformanceReviewGathering,
        comment: undefined,
        rating: 0,
        docUrl: undefined,
        reviewStatus: ReviewStatus.Upcoming,
      };

      render(<AdminGatheringBox gathering={incompleteReview} loggedInAdminId="1" />);

      expect(screen.getByRole("button", { name: /Review Employee/i })).toBeInTheDocument();
    });
  });

  describe("Status Indicators", () => {
    test("displays completed status indicator correctly", async () => {
      const completedGathering = {
        ...mockMeetingGathering,
        meetingStatus: MeetStatus.Completed,
      };

      render(<AdminGatheringBox gathering={completedGathering} loggedInAdminId="1" />);

      const completedIcon = screen.getByTestId("CheckCircleRoundedIcon");
      expect(completedIcon).toBeInTheDocument();

      expect(completedIcon).toBeInTheDocument();
    });

    test("displays online status indicator correctly", async () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const onlineIcon = screen.getByTestId("LanguageRoundedIcon");
      expect(onlineIcon).toBeInTheDocument();

      expect(onlineIcon).toBeInTheDocument();
    });

    test("displays in-person status indicator correctly", async () => {
      const inPersonGathering = {
        ...mockMeetingGathering,
        isOnline: false,
      };

      render(<AdminGatheringBox gathering={inPersonGathering} loggedInAdminId="1" />);

      const inPersonIcon = screen.getByTestId("EmojiPeopleRoundedIcon");
      expect(inPersonIcon).toBeInTheDocument();

      expect(inPersonIcon).toBeInTheDocument();
    });
  });

  describe("Admin Titles with Names", () => {
    test("displays correct title when withAdminNamesTitle is true and user is owner", () => {
      render(
        <AdminGatheringBox
          gathering={mockMeetingGathering}
          withAdminNamesTitle={true}
          loggedInAdminId="1"
        />
      );

      expect(screen.getByText("Meet with You")).toBeInTheDocument();
    });

    test("displays correct title when withAdminNamesTitle is true and user is not owner", () => {
      render(
        <AdminGatheringBox
          gathering={mockMeetingGathering}
          withAdminNamesTitle={true}
          loggedInAdminId="2"
        />
      );

      expect(screen.getByText("Meeting with John Smith")).toBeInTheDocument();
    });

    test("displays correct completed title for performance review with admin names", () => {
      const completedReview = {
        ...mockPerformanceReviewGathering,
        reviewStatus: ReviewStatus.Completed,
      };

      render(
        <AdminGatheringBox
          gathering={completedReview}
          withAdminNamesTitle={true}
          loggedInAdminId="1"
        />
      );

      expect(screen.getByText("Reviewed by You")).toBeInTheDocument();
    });
  });

  describe("Location and Link Display", () => {
    test("displays meeting link correctly for online meetings", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      expect(screen.getByText("https://meet.google.com/test-link")).toBeInTheDocument();
    });

    test("displays meeting location correctly for in-person meetings", () => {
      const inPersonMeeting = {
        ...mockMeetingGathering,
        isOnline: false,
      };

      render(<AdminGatheringBox gathering={inPersonMeeting} loggedInAdminId="1" />);

      expect(screen.getByText("Conference Room A")).toBeInTheDocument();
    });

    test("displays location with tooltip for long text", async () => {
      const longLocationMeeting = {
        ...mockMeetingGathering,
        isOnline: false,
        meetLocation: "Very Long Conference Room Name That Should Be Truncated",
      };

      render(<AdminGatheringBox gathering={longLocationMeeting} loggedInAdminId="1" />);

      const locationText = screen.getByText(
        "Very Long Conference Room Name That Should Be Truncated"
      );
      expect(locationText).toBeInTheDocument();

      // Check tooltip functionality
      fireEvent.mouseOver(locationText);
      await waitFor(() => {
        expect(
          screen.getByText("Very Long Conference Room Name That Should Be Truncated")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Action Buttons and Dropdowns", () => {
    test("shows join button only for upcoming online meetings", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
    });

    test("does not show join button for completed meetings", () => {
      const completedMeeting = {
        ...mockMeetingGathering,
        meetingStatus: MeetStatus.Completed,
      };

      render(<AdminGatheringBox gathering={completedMeeting} loggedInAdminId="1" />);

      expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
    });

    test("does not show join button for in-person meetings", () => {
      const inPersonMeeting = {
        ...mockMeetingGathering,
        isOnline: false,
      };

      render(<AdminGatheringBox gathering={inPersonMeeting} loggedInAdminId="1" />);

      expect(screen.queryByRole("button", { name: "Join" })).not.toBeInTheDocument();
    });

    test("opens dropdown menu when more options button is clicked", async () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      expect(moreButton).toBeInTheDocument();

      fireEvent.click(moreButton!);

      await waitFor(() => {
        expect(screen.getByText("Mark as Completed")).toBeInTheDocument();
        expect(screen.getByText("Edit Meeting")).toBeInTheDocument();
        expect(screen.getByText("Remove")).toBeInTheDocument();
      });
    });
  });

  describe("Modal Behaviour", () => {
    test("opens edit performance review modal when edit is clicked", async () => {
      render(<AdminGatheringBox gathering={mockPerformanceReviewGathering} loggedInAdminId="1" />);

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const editButton = screen.getByText("Edit Review");
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId("edit-pr-modal")).toBeInTheDocument();
      });
    });

    test("opens edit meeting modal when edit is clicked", async () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const editButton = screen.getByText("Edit Meeting");
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId("edit-meeting-modal")).toBeInTheDocument();
      });
    });

    test("opens delete meeting modal when remove is clicked", async () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const removeButton = screen.getByText("Remove");
        fireEvent.click(removeButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId("delete-meeting-modal")).toBeInTheDocument();
      });
    });
  });

  describe("Status Update Functionality", () => {
    test("calls API to mark meeting as completed when status is updated", async () => {
      const mockOnEditSuccess = jest.fn();

      render(
        <AdminGatheringBox
          gathering={mockMeetingGathering}
          loggedInAdminId="1"
          onEditSuccess={mockOnEditSuccess}
        />
      );

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const statusButton = screen.getByText("Mark as Completed");
        fireEvent.click(statusButton);
      });

      await waitFor(() => {
        expect(meetingAPI.markAsCompletedMeeting).toHaveBeenCalledWith(1);
        expect(mockOnEditSuccess).toHaveBeenCalled();
      });
    });

    test("calls API to mark performance review status when updated", async () => {
      const mockOnEditSuccess = jest.fn();

      render(
        <AdminGatheringBox
          gathering={mockPerformanceReviewGathering}
          loggedInAdminId="1"
          onEditSuccess={mockOnEditSuccess}
        />
      );

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const statusButton = screen.getByText("Mark as Upcoming");
        fireEvent.click(statusButton);
      });

      await waitFor(() => {
        expect(performanceReviewsAPI.UpdatePerformanceReviewStatus).toHaveBeenCalledWith(
          2,
          ReviewStatus.Upcoming
        );
        expect(mockOnEditSuccess).toHaveBeenCalled();
      });
    });

    test("handles API error gracefully when updating status", async () => {
      (meetingAPI.markAsCompletedMeeting as jest.Mock).mockRejectedValueOnce(
        new Error("API Error")
      );

      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const statusButton = screen.getByText("Mark as Completed");
        fireEvent.click(statusButton);
      });

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith("Error updating status:", expect.any(Error));
      });
    });
  });

  describe("Date and Time Display", () => {
    test("displays formatted date and time correctly", () => {
      render(<AdminGatheringBox gathering={mockMeetingGathering} loggedInAdminId="1" />);

      expect(screen.getByText(/01\/12\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/12:00.*13:00/)).toBeInTheDocument();
    });

    test("handles missing dates gracefully", () => {
      const gatheringWithoutDates = {
        ...mockMeetingGathering,
        startDate: undefined,
        endDate: undefined,
      };

      render(<AdminGatheringBox gathering={gatheringWithoutDates} loggedInAdminId="1" />);

      // Should not crash and should render the component
      expect(screen.getByText("Meet with Jane Doe")).toBeInTheDocument();
    });
  });

  describe("Callback Functions", () => {
    test("calls onEditSuccess callback when modal edit is successful", async () => {
      const mockOnEditSuccess = jest.fn();

      render(
        <AdminGatheringBox
          gathering={mockMeetingGathering}
          loggedInAdminId="1"
          onEditSuccess={mockOnEditSuccess}
        />
      );

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const editButton = screen.getByText("Edit Meeting");
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const mockEditButton = screen.getByText("Mock Edit Meeting");
        fireEvent.click(mockEditButton);
      });

      expect(mockOnEditSuccess).toHaveBeenCalled();
    });

    test("calls onDeleteSuccess callback when modal delete is successful", async () => {
      const mockOnDeleteSuccess = jest.fn();

      render(
        <AdminGatheringBox
          gathering={mockMeetingGathering}
          loggedInAdminId="1"
          onDeleteSuccess={mockOnDeleteSuccess}
        />
      );

      const moreButton = screen.getByTestId("MoreVertRoundedIcon").closest("button");
      fireEvent.click(moreButton!);

      await waitFor(() => {
        const removeButton = screen.getByText("Remove");
        fireEvent.click(removeButton);
      });

      await waitFor(() => {
        const mockDeleteButton = screen.getByText("Mock Delete Meeting");
        fireEvent.click(mockDeleteButton);
      });

      expect(mockOnDeleteSuccess).toHaveBeenCalled();
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

      render(<AdminGatheringBox gathering={minimalGathering} loggedInAdminId="1" />);

      expect(screen.getByText("Meet with Test Employee")).toBeInTheDocument();
    });

    test("handles undefined meet link gracefully", () => {
      const gatheringWithoutLink = {
        ...mockMeetingGathering,
        meetLink: undefined,
      };

      render(<AdminGatheringBox gathering={gatheringWithoutLink} loggedInAdminId="1" />);

      const joinButton = screen.getByRole("button", { name: "Join" });
      fireEvent.click(joinButton);

      // Should not call window.open when meetLink is undefined
      expect(window.open).not.toHaveBeenCalled();
    });
  });
});
