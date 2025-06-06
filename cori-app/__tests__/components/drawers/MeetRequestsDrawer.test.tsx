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
});
