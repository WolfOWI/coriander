import React, { useState } from "react";

// Import React Components
import CoriBtn from "../buttons/CoriBtn";
import EditPRModal from "../modals/EditPRModal";
import { PerformanceReviewDTO } from "../modals/EditPRModal";
import EditMeetingModal from "../modals/EditMeetingModal";
import { MeetingDTO } from "../../interfaces/meetings/meetingDTO";
import DeleteMeetingModal from "../modals/DeleteMeetingModal";
import DeletePRModal from "../modals/DeletePRModal";

// Import 3rd party components
import { Button, Dropdown, Tooltip } from "antd";

// Import Google Icons
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Functionality
import { meetingAPI } from "../../services/api.service";

// Utils
import { formatTimestampToDate, formatTimestampToTime } from "../../utils/dateUtils";

// Constants
import { Icons } from "../../constants/icons";

// Interfaces
import { Gathering } from "../../interfaces/gathering/gathering";
import { GatheringType, MeetStatus, ReviewStatus } from "../../types/common";

interface GatheringBoxProps {
  gathering: Gathering;
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
  withAdminNamesTitle?: boolean;
  loggedInAdminId?: string;
}

// !!!!!!!!!!!!!!!!!!
// ! The Admin Gathering Box ONLY takes Upcoming & Completed Meetings / Performance Reviews
// !!!!!!!!!!!!!!!!!!

function AdminGatheringBox({
  gathering,
  onEditSuccess,
  onDeleteSuccess,
  withAdminNamesTitle = false,
  loggedInAdminId = "",
}: GatheringBoxProps) {
  const [showEditPRModal, setShowEditPRModal] = useState(false);
  const [showEditMeetingModal, setShowEditMeetingModal] = useState(false);
  const [showDeleteMeetingModal, setShowDeleteMeetingModal] = useState(false);
  const [showDeletePRModal, setShowDeletePRModal] = useState(false);

  const gatheringType = {
    isPerformanceReview: gathering.type === GatheringType.PerformanceReview,
    isMeeting: gathering.type === GatheringType.Meeting,
  };

  const gatheringStatus = {
    isUpcoming: gatheringType.isPerformanceReview
      ? gathering.reviewStatus === ReviewStatus.Upcoming
      : gathering.meetingStatus === MeetStatus.Upcoming,
    isCompleted: gatheringType.isPerformanceReview
      ? gathering.reviewStatus === ReviewStatus.Completed
      : gathering.meetingStatus === MeetStatus.Completed,
  };

  const adminPermissions = {
    isOwner: loggedInAdminId === gathering.adminId.toString(),
  };

  const handleEditClick = () => {
    if (gatheringType.isPerformanceReview) {
      setShowEditPRModal(true);
    } else if (gatheringType.isMeeting) {
      setShowEditMeetingModal(true);
    }
  };

  const handleDeleteClick = () => {
    if (gatheringType.isPerformanceReview) {
      setShowDeletePRModal(true);
    } else if (gatheringType.isMeeting) {
      setShowDeleteMeetingModal(true);
    }
  };

  const handleEditSuccess = () => {
    if (gatheringType.isPerformanceReview) {
      console.log("Performance review edited successfully");
    } else if (gatheringType.isMeeting) {
      console.log("Meeting edited successfully");
    }

    // Call the parent component's onEditSuccess callback if provided
    if (onEditSuccess) {
      onEditSuccess();
    }
  };

  // Convert Gathering to PerformanceReviewDTO
  const convertToPerformanceReviewDTO = (): PerformanceReviewDTO => {
    const result = {
      reviewId: gathering.id,
      adminId: gathering.adminId,
      adminName: gathering.adminName,
      employeeId: gathering.employeeId,
      employeeName: gathering.employeeName,
      isOnline: gathering.isOnline || false,
      meetLocation: gathering.meetLocation || "",
      meetLink: gathering.meetLink || "",
      startDate: gathering.startDate?.toString() || "",
      endDate: gathering.endDate?.toString() || "",
      rating: gathering.rating || 0,
      comment: gathering.comment || "",
      docUrl: gathering.docUrl || "",
      status: gathering.reviewStatus || 0,
    };
    return result;
  };

  // Convert Gathering to MeetingDTO
  const convertToMeetingDTO = (): MeetingDTO => {
    const result = {
      meetingId: gathering.id,
      adminId: gathering.adminId,
      adminName: gathering.adminName,
      employeeId: gathering.employeeId,
      employeeName: gathering.employeeName,
      isOnline: gathering.isOnline || false,
      meetLocation: gathering.meetLocation || "",
      meetLink: gathering.meetLink || "",
      startDate: gathering.startDate?.toString() || "",
      endDate: gathering.endDate?.toString() || "",
      purpose: gathering.purpose || "",
      status: gathering.meetingStatus || MeetStatus.Upcoming,
    };
    return result;
  };

  // Gathering icon (Pink Performance Review, Green Standard Meeting)
  const GatheringIcon = () => {
    if (gatheringType.isPerformanceReview) {
      return (
        <Tooltip title="Performance Review">
          <div className="bg-sakura-100 rounded-full h-12 w-12 flex items-center justify-center">
            <Icons.StarRounded className="text-sakura-400" fontSize="large" />
          </div>
        </Tooltip>
      );
    } else if (gatheringType.isMeeting) {
      return (
        <Tooltip title="Standard Meeting">
          <div className="bg-corigreen-100 rounded-full h-12 w-12 flex items-center justify-center">
            <Icons.Chat className="text-corigreen-400" />
          </div>
        </Tooltip>
      );
    }
  };

  // Gathering title (Review by You, Review by Admin, Meet with Employee)
  const GatheringTitle = () => {
    const titlePrefix = gatheringType.isPerformanceReview ? "Review" : "Meet with";

    if (withAdminNamesTitle) {
      const adminName = adminPermissions.isOwner ? "You" : gathering.adminName;
      const actionPrefix = gatheringType.isPerformanceReview ? "Review by" : "Meet with";
      return (
        <h2 className="text-zinc-800 font-bold w-full">
          {actionPrefix} {adminName}
        </h2>
      );
    }

    return (
      <h2 className="text-zinc-800 font-bold w-full">
        {titlePrefix} {gathering.employeeName}
      </h2>
    );
  };

  // Status indicator (Completed, Online, In Person)
  const StatusIndicator = () => {
    if (gatheringStatus.isCompleted) {
      return (
        <Tooltip title="Completed">
          <Icons.CheckCircle className="text-corigreen-400" />
        </Tooltip>
      );
    }

    // Upcoming status
    if (gathering.isOnline) {
      return (
        <Tooltip title="Online">
          <Icons.Language className="text-blue-300" />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="In Person">
        <Icons.EmojiPeople className="text-purple-400" />
      </Tooltip>
    );
  };

  // Review Body (Comment, Rating, PDF Attachment)
  const PerformanceReviewBody = () => {
    if (!gatheringType.isPerformanceReview) return null;

    return (
      <div className="w-full flex flex-col gap-3">
        {/* Comment */}
        {gathering.comment && <p className="text-zinc-500 text-[12px]">{gathering.comment}</p>}
        <div className="flex w-full items-center gap-4">
          {/* Rating */}
          {gathering.rating && gathering.rating > 0 && (
            <div className="flex items-center gap-1">
              <StarRoundedIcon className="text-amber-300" />
              <p className="text-zinc-800 font-bold">{gathering.rating}</p>
            </div>
          )}
          {/* PDF Attachment */}
          {gathering.docUrl && (
            <div className="flex items-center gap-1">
              <p className="text-zinc-500 text-[12px]">PDF Attached</p>
              <TextSnippetRoundedIcon className="text-zinc-500" />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Meet Body (Purpose)
  const MeetingBody = () => {
    if (!gatheringType.isMeeting || !gathering.purpose) return null;

    return (
      <div className="w-full">
        <p className="text-zinc-500 text-[12px]">{gathering.purpose}</p>
      </div>
    );
  };

  // Dropdown Menu Items (Mark as Upcoming, Edit, Remove)
  const getDropdownMenuItems = () => [
    {
      key: "1",
      label: gatheringStatus.isCompleted ? "Mark as Upcoming" : "Mark as Completed",
      icon: gatheringStatus.isCompleted ? <Icons.Schedule /> : <Icons.CheckCircle />,
      onClick: () => {
        console.log("Mark as Completed");
      },
    },
    {
      key: "2",
      label: gatheringType.isPerformanceReview ? "Edit Review" : "Edit Meeting",
      icon: <EditIcon />,
      onClick: handleEditClick,
    },
    {
      key: "3",
      label: "Remove",
      icon: <DeleteIcon />,
      danger: true,
      onClick: handleDeleteClick,
    },
  ];

  // Handle Join button click
  const handleJoinClick = () => {
    if (gathering.meetLink) {
      if (gathering.meetLink.includes("https://")) {
        window.open(`${gathering.meetLink}`, "_blank");
      } else {
        window.open(`https://${gathering.meetLink}`, "_blank");
      }
    }
  };

  // Admin Action Buttons (Join, Edit, Remove)
  const AdminActionButtons = () => {
    if (!adminPermissions.isOwner) return null;

    return (
      <>
        {gatheringStatus.isUpcoming && gathering.isOnline && (
          <CoriBtn primary style="black" onClick={handleJoinClick}>
            Join
          </CoriBtn>
        )}
        <Dropdown
          menu={{ items: getDropdownMenuItems() }}
          placement="bottomRight"
          trigger={["click"]}
          dropdownRender={(menu) => (
            <div className="border-2 border-zinc-100 rounded-2xl">{menu}</div>
          )}
        >
          <Button className="p-0 border-none bg-transparent">
            <MoreVertRoundedIcon className="text-zinc-500" />
          </Button>
        </Dropdown>
      </>
    );
  };

  // Location/Link Display (Online or In Person)
  const LocationDisplay = () => {
    const displayText = gathering.isOnline ? gathering.meetLink : gathering.meetLocation;

    return (
      <div className="w-full h-10 flex items-center justify-center bg-warmstone-100 rounded-xl">
        <p className="text-zinc-500 text-[12px]">{displayText}</p>
      </div>
    );
  };

  return (
    <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col justify-between gap-3">
      {/* Heading & Body */}
      <div className="w-full flex flex-col gap-3">
        {/* Heading Section */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2 w-full">
            <GatheringIcon />
            <div className="flex flex-col gap-1">
              <GatheringTitle />
              {/* Date and Time */}
              <div className="w-full flex items-center gap-3 text-zinc-800 text-[12px]">
                <p>
                  {gathering.startDate ? formatTimestampToDate(gathering.startDate.toString()) : ""}
                </p>
                <p>•</p>
                <p>
                  {gathering.startDate ? formatTimestampToTime(gathering.startDate.toString()) : ""}{" "}
                  -{gathering.endDate ? formatTimestampToTime(gathering.endDate.toString()) : ""}
                </p>
              </div>
            </div>
          </div>
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <StatusIndicator />
          </div>
        </div>

        {/* Body Content */}
        <PerformanceReviewBody />
        <MeetingBody />
      </div>

      {/* Footer Section (Location / Action Buttons) */}
      <div className="w-full flex items-center justify-between gap-3">
        <LocationDisplay />
        <AdminActionButtons />
      </div>

      {/* Modals */}
      {gatheringType.isPerformanceReview && (
        <>
          <EditPRModal
            showModal={showEditPRModal}
            setShowModal={setShowEditPRModal}
            onEditSuccess={handleEditSuccess}
            performanceReview={convertToPerformanceReviewDTO()}
          />
          <DeletePRModal
            showModal={showDeletePRModal}
            setShowModal={setShowDeletePRModal}
            onDeleteSuccess={onDeleteSuccess}
            performanceReview={convertToPerformanceReviewDTO()}
          />
        </>
      )}

      {gatheringType.isMeeting && (
        <>
          <EditMeetingModal
            showModal={showEditMeetingModal}
            setShowModal={setShowEditMeetingModal}
            onEditSuccess={handleEditSuccess}
            meeting={convertToMeetingDTO()}
          />
          <DeleteMeetingModal
            showModal={showDeleteMeetingModal}
            setShowModal={setShowDeleteMeetingModal}
            onDeleteSuccess={onDeleteSuccess}
            meeting={convertToMeetingDTO()}
          />
        </>
      )}
    </div>
  );
}

export default AdminGatheringBox;
