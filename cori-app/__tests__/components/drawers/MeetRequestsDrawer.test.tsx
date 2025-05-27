import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MeetRequestsDrawer from "../../../src/components/drawers/MeetRequestsDrawer";
import { MeetStatus } from "../../../src/types/common";

// Mock the API service
jest.mock("../../../src/services/api.service", () => ({
  meetingAPI: {
    getAllPendingRequestsByAdminId: jest.fn(),
    rejectMeetingRequest: jest.fn(),
  },
}));

import { meetingAPI } from "../../../src/services/api.service";

const mockGetAllPendingRequestsByAdminId =
  meetingAPI.getAllPendingRequestsByAdminId as jest.MockedFunction<
    typeof meetingAPI.getAllPendingRequestsByAdminId
  >;
const mockRejectMeetingRequest = meetingAPI.rejectMeetingRequest as jest.MockedFunction<
  typeof meetingAPI.rejectMeetingRequest
>;

// Mock Antd components
jest.mock("antd", () => ({
  Drawer: ({ title, open, onClose, children, width, placement }: any) =>
    open ? (
      <div data-testid="drawer" data-title={title} data-width={width} data-placement={placement}>
        <button data-testid="close-drawer" onClick={onClose}>
          Close
        </button>
        <div data-testid="drawer-content">{children}</div>
      </div>
    ) : null,
  message: {
    useMessage: () => [
      {
        success: jest.fn(),
        error: jest.fn(),
      },
      <div data-testid="message-context" key="message-context" />,
    ],
  },
}));

// Mock MeetRequestCard component
jest.mock("../../../src/components/cards/meetingCards/MeetRequestCard", () => {
  return function MockMeetRequestCard({
    meetRequest,
    onApprove,
    onReject,
  }: {
    meetRequest: any;
    onApprove: () => void;
    onReject: () => void;
  }) {
    return (
      <div data-testid="meet-request-card" data-meeting-id={meetRequest.meetingId}>
        <span>{meetRequest.employeeName}</span>
        <button data-testid="approve-btn" onClick={onApprove}>
          Approve
        </button>
        <button data-testid="reject-btn" onClick={onReject}>
          Reject
        </button>
      </div>
    );
  };
});

// Mock AcceptScheduleMeetingModal component
jest.mock("../../../src/components/modals/AcceptScheduleMeetingModal", () => {
  return function MockAcceptScheduleMeetingModal({
    showModal,
    setShowModal,
    onSubmitSuccess,
    meetingRequest,
  }: any) {
    return showModal ? (
      <div data-testid="accept-meeting-modal" data-meeting-id={meetingRequest?.meetingId}>
        <button data-testid="close-modal" onClick={() => setShowModal(false)}>
          Close Modal
        </button>
        <button data-testid="submit-modal" onClick={onSubmitSuccess}>
          Submit
        </button>
      </div>
    ) : null;
  };
});

describe("MeetRequestsDrawer Component Tests", () => {
  const mockMeetRequests = [
    {
      meetingId: 1,
      employeeId: 123,
      employeeName: "John Doe",
      profilePicture: "profile1.jpg",
      purpose: "Project discussion",
      requestedAt: "2024-01-15T14:30:00Z",
      status: MeetStatus.Requested,
    },
    {
      meetingId: 2,
      employeeId: 124,
      employeeName: "Jane Smith",
      profilePicture: "profile2.jpg",
      purpose: "Team meeting",
      requestedAt: "2024-01-16T10:00:00Z",
      status: MeetStatus.Requested,
    },
  ];

  const defaultProps = {
    drawerOpen: true,
    setDrawerOpen: jest.fn(),
    adminId: 1,
    onApprove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllPendingRequestsByAdminId.mockResolvedValue({
      data: { $values: mockMeetRequests },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    });
  });

  test("renders drawer when open", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });

  test("does not render drawer when closed", () => {
    render(<MeetRequestsDrawer {...defaultProps} drawerOpen={false} />);

    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  test("displays correct title with meeting request count", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const drawer = screen.getByTestId("drawer");
      expect(drawer).toHaveAttribute("data-title", "2 Meeting Requests");
    });
  });

  test("displays singular title for single meeting request", async () => {
    mockGetAllPendingRequestsByAdminId.mockResolvedValue({
      data: { $values: [mockMeetRequests[0]] },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    });

    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const drawer = screen.getByTestId("drawer");
      expect(drawer).toHaveAttribute("data-title", "1 Meeting Request");
    });
  });

  test("fetches meeting requests on mount", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      expect(mockGetAllPendingRequestsByAdminId).toHaveBeenCalledWith(1);
    });
  });

  test("renders meeting request cards", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getAllByTestId("meet-request-card")).toHaveLength(2);
    });
  });

  test("displays no requests message when empty", async () => {
    mockGetAllPendingRequestsByAdminId.mockResolvedValue({
      data: { $values: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    });

    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("No pending meeting requests")).toBeInTheDocument();
    });
  });

  test("calls setDrawerOpen when close button is clicked", async () => {
    const mockSetDrawerOpen = jest.fn();
    render(<MeetRequestsDrawer {...defaultProps} setDrawerOpen={mockSetDrawerOpen} />);

    await waitFor(() => {
      const closeButton = screen.getByTestId("close-drawer");
      fireEvent.click(closeButton);
      expect(mockSetDrawerOpen).toHaveBeenCalledWith(false);
    });
  });

  test("handles approve button click", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const approveButtons = screen.getAllByTestId("approve-btn");
      fireEvent.click(approveButtons[0]);

      expect(screen.getByTestId("accept-meeting-modal")).toBeInTheDocument();
    });
  });

  test("handles reject button click", async () => {
    mockRejectMeetingRequest.mockResolvedValue({
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    });

    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const rejectButtons = screen.getAllByTestId("reject-btn");
      fireEvent.click(rejectButtons[0]);
    });

    await waitFor(() => {
      expect(mockRejectMeetingRequest).toHaveBeenCalledWith(1);
    });
  });

  test("handles reject API error", async () => {
    mockRejectMeetingRequest.mockRejectedValue(new Error("API Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const rejectButtons = screen.getAllByTestId("reject-btn");
      fireEvent.click(rejectButtons[0]);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error rejecting meeting request:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test("handles fetch requests API error", async () => {
    mockGetAllPendingRequestsByAdminId.mockRejectedValue(new Error("Fetch Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching meet requests:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test("closes modal when close modal button is clicked", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const approveButtons = screen.getAllByTestId("approve-btn");
      fireEvent.click(approveButtons[0]);
    });

    const closeModalButton = screen.getByTestId("close-modal");
    fireEvent.click(closeModalButton);

    expect(screen.queryByTestId("accept-meeting-modal")).not.toBeInTheDocument();
  });

  test("refetches data when modal is submitted", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const approveButtons = screen.getAllByTestId("approve-btn");
      fireEvent.click(approveButtons[0]);
    });

    const submitButton = screen.getByTestId("submit-modal");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGetAllPendingRequestsByAdminId).toHaveBeenCalledTimes(2);
    });
  });

  test("applies correct drawer properties", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const drawer = screen.getByTestId("drawer");
      expect(drawer).toHaveAttribute("data-width", "400");
      expect(drawer).toHaveAttribute("data-placement", "right");
    });
  });

  test("renders message context holder", () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    expect(screen.getByTestId("message-context")).toBeInTheDocument();
  });

  test("handles user interactions with userEvent", async () => {
    const user = userEvent.setup();
    const mockSetDrawerOpen = jest.fn();

    render(<MeetRequestsDrawer {...defaultProps} setDrawerOpen={mockSetDrawerOpen} />);

    await waitFor(() => {
      const closeButton = screen.getByTestId("close-drawer");
      return user.click(closeButton);
    });

    expect(mockSetDrawerOpen).toHaveBeenCalledWith(false);
  });

  test("passes correct meeting request to modal", async () => {
    render(<MeetRequestsDrawer {...defaultProps} />);

    await waitFor(() => {
      const approveButtons = screen.getAllByTestId("approve-btn");
      fireEvent.click(approveButtons[1]); // Click second approve button
    });

    const modal = screen.getByTestId("accept-meeting-modal");
    expect(modal).toHaveAttribute("data-meeting-id", "2");
  });
});
