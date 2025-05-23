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
  const isPerformanceReview = gathering.type === GatheringType.PerformanceReview;
  const isMeeting = gathering.type === GatheringType.Meeting;

  const isUpcoming = isPerformanceReview
    ? gathering.reviewStatus === ReviewStatus.Upcoming
    : gathering.meetingStatus === MeetStatus.Upcoming;

  const isCompleted = isPerformanceReview
    ? gathering.reviewStatus === ReviewStatus.Completed
    : gathering.meetingStatus === MeetStatus.Completed;

  const handleEditClick = () => {
    if (isPerformanceReview) {
      setShowEditPRModal(true);
    } else if (isMeeting) {
      setShowEditMeetingModal(true);
    }
  };

  const handleEditSuccess = () => {
    if (isPerformanceReview) {
      console.log("Performance review edited successfully");
    } else if (isMeeting) {
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

  return (
    <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col justify-between gap-3">
      {/* Heading & Body */}
      <div className="w-full flex flex-col gap-3">
        {/* Heading Section */}
        <div className="w-full flex justify-between items-center">
          <div className=" flex items-center gap-2 w-full">
            {isPerformanceReview ? (
              <Tooltip title="Performance Review">
                <div className="bg-sakura-100 rounded-full h-12 w-12 flex items-center justify-center">
                  <Icons.StarRounded className="text-sakura-400" fontSize="large" />
                </div>
              </Tooltip>
            ) : (
              <Tooltip title="Standard Meeting">
                <div className="bg-corigreen-100 rounded-full h-12 w-12 flex items-center justify-center">
                  <Icons.Chat className="text-corigreen-400" />
                </div>
              </Tooltip>
            )}
            <div className="flex flex-col gap-1">
              {withAdminNamesTitle ? (
                <h2 className="text-zinc-800 font-bold w-full">
                  {isPerformanceReview ? "Review by " : "Meet with "}{" "}
                  {loggedInAdminId === gathering.adminId.toString() ? "You" : gathering.adminName}
                </h2>
              ) : (
                <h2 className="text-zinc-800 font-bold w-full">
                  {isPerformanceReview ? "Review " : "Meet with "} {gathering.employeeName}
                </h2>
              )}

              {/* Date and Time */}
              <div className="w-full flex items-center gap-3 text-zinc-800 text-[12px]">
                <p>{formatTimestampToDate(gathering.startDate!.toString())}</p>
                <p>•</p>
                <p>
                  {formatTimestampToTime(gathering.startDate!.toString())} -
                  {formatTimestampToTime(gathering.endDate!.toString())}
                </p>
              </div>
            </div>
          </div>
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isUpcoming ? (
              // Upcoming Status (Online / In Person)
              <>
                {gathering.isOnline ? (
                  <Tooltip title="Online">
                    <Icons.Language className="text-blue-300" />
                  </Tooltip> // Online
                ) : (
                  <Tooltip title="In Person">
                    <Icons.EmojiPeople className="text-purple-400" />
                  </Tooltip> // In Person
                )}
              </>
            ) : (
              // Completed Status
              <>
                <Tooltip title="Completed">
                  <Icons.CheckCircle className="text-corigreen-400" />
                </Tooltip>
              </>
            )}
          </div>
        </div>
        {/* Body Section (For Performance Review) */}
        {isPerformanceReview && (
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
        )}
        {/* Body Section (For Meeting) */}
        {isMeeting && gathering.purpose && (
          <div className="w-full">
            <p className="text-zinc-500 text-[12px]">{gathering.purpose}</p>
          </div>
        )}
      </div>
      {/* Footer Section (Location / Action Buttons) */}
      {gathering.isOnline ? (
        // If meet is online
        <div className="w-full flex items-center justify-between gap-3">
          <div className="w-full h-10 flex items-center justify-center bg-warmstone-100 rounded-xl">
            <p className="text-zinc-500 text-[12px]">{gathering.meetLink}</p>
          </div>
          {loggedInAdminId === gathering.adminId.toString() && (
            <>
              <CoriBtn primary style="black">
                Join
              </CoriBtn>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: isCompleted ? "Mark as Upcoming" : "Mark as Completed",
                      icon: isCompleted ? <Icons.Schedule /> : <Icons.CheckCircle />,
                      onClick: () => {
                        console.log("Mark as Completed");
                      },
                    },
                    {
                      key: "2",
                      label: isPerformanceReview ? "Edit Review" : "Edit Meeting",
                      icon: <EditIcon />,
                      onClick: handleEditClick,
                    },
                    {
                      key: "3",
                      label: "Remove",
                      icon: <DeleteIcon />,
                      danger: true,
                      onClick: () => {
                        if (isPerformanceReview) {
                          setShowDeletePRModal(true);
                        } else if (isMeeting) {
                          setShowDeleteMeetingModal(true);
                        }
                      },
                    },
                  ],
                }}
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
          )}
        </div>
      ) : (
        // If meet is in person
        <div className="w-full flex items-center justify-between gap-3">
          <div className="w-full h-10 flex items-center justify-center bg-warmstone-100 rounded-xl">
            <p className="text-zinc-500 text-[12px]">{gathering.meetLocation}</p>
          </div>
          {loggedInAdminId === gathering.adminId.toString() && (
            <>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: isCompleted ? "Mark as Upcoming" : "Mark as Completed",
                      icon: isCompleted ? <Icons.Schedule /> : <Icons.CheckCircle />,
                      onClick: () => {
                        console.log("Mark as Completed");
                      },
                    },
                    {
                      key: "2",
                      label: isPerformanceReview ? "Edit Performance Review" : "Edit Meeting",
                      icon: <EditIcon />,
                      onClick: handleEditClick,
                    },
                    {
                      key: "3",
                      label: "Remove",
                      icon: <DeleteIcon />,
                      danger: true,
                      onClick: () => {
                        if (isPerformanceReview) {
                          setShowDeletePRModal(true);
                        } else if (isMeeting) {
                          setShowDeleteMeetingModal(true);
                        }
                      },
                    },
                  ],
                }}
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
          )}
        </div>
      )}

      {/* Add the EditPRModal */}
      {isPerformanceReview && (
        <EditPRModal
          showModal={showEditPRModal}
          setShowModal={setShowEditPRModal}
          onEditSuccess={handleEditSuccess}
          performanceReview={convertToPerformanceReviewDTO()}
        />
      )}

      {/* Add the EditMeetingModal */}
      {isMeeting && (
        <EditMeetingModal
          showModal={showEditMeetingModal}
          setShowModal={setShowEditMeetingModal}
          onEditSuccess={handleEditSuccess}
          meeting={convertToMeetingDTO()}
        />
      )}

      {/* Add the DeleteMeetingModal */}
      {isMeeting && (
        <DeleteMeetingModal
          showModal={showDeleteMeetingModal}
          setShowModal={setShowDeleteMeetingModal}
          onDeleteSuccess={onDeleteSuccess}
          meeting={convertToMeetingDTO()}
        />
      )}

      {/* Add the DeletePRModal */}
      {isPerformanceReview && (
        <DeletePRModal
          showModal={showDeletePRModal}
          setShowModal={setShowDeletePRModal}
          onDeleteSuccess={onDeleteSuccess}
          performanceReview={convertToPerformanceReviewDTO()}
        />
      )}
    </div>
  );
}

export default AdminGatheringBox;
