import React, { useEffect } from "react";

// Import React Components
import CoriBtn from "../buttons/CoriBtn";

// Import 3rd party components
import { Button, Dropdown } from "antd";

// Import Google Icons
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { formatTimestampToDate, formatTimestampToTime } from "../../utils/dateUtils";

interface PerformanceReview {
  reviewId: number;
  adminId: number;
  adminName: string;
  employeeId: number;
  employeeName: string;
  isOnline: boolean;
  meetLocation: string | null;
  meetLink: string;
  startDate: string;
  endDate: string;
  rating: number;
  comment: string;
  docUrl: string;
  status: number;
}

interface PerfReviewBoxProps {
  review: PerformanceReview;
  showPerson?: boolean; // showPerson property is used to determine if the person's name is shown in the heading (for different screens)
}

function PerfReviewBox({ review, showPerson = true }: PerfReviewBoxProps) {
  return (
    <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-3">
      {/* Heading Section */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          {showPerson ? (
            <h2 className="text-zinc-800 font-bold">Meet with {review.adminName}</h2>
          ) : (
            <div className="w-full flex items-center gap-4 text-zinc-800 font-bold">
              <p>{formatTimestampToDate(review.startDate)}</p>
              <p>•</p>
              <p>
                {formatTimestampToTime(review.startDate)} - {formatTimestampToTime(review.endDate)}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Not Completed Status - Online / In Person */}
            {review.status === 0 || review.status === 1 ? (
              <>
                <p className="text-zinc-500 text-[12px]">
                  {review.isOnline ? "Online" : "In Person"}
                </p>
                <div
                  className={`rounded-full w-4 h-4 ${
                    review.isOnline ? "bg-blue-300" : "bg-purple-400"
                  }`}
                ></div>
              </>
            ) : (
              // Completed Status
              <>
                <p className="text-zinc-500 text-[12px]">Completed</p>
                <div className="rounded-full w-4 h-4 bg-corigreen-400"></div>
              </>
            )}
          </div>
        </div>

        {showPerson && (
          <div className="w-full flex items-center gap-4 text-zinc-500">
            <p>{formatTimestampToDate(review.startDate)}</p>
            <p>•</p>
            <p>
              {formatTimestampToTime(review.startDate)} - {formatTimestampToTime(review.endDate)}
            </p>
          </div>
        )}
      </div>
      {/* Body Section (Comment, Rating, PDF Attachment) */}
      <div className="w-full flex flex-col gap-3">
        {/* Comment */}
        {review.comment && <p className="text-zinc-500 text-[12px]">{review.comment}</p>}
        <div className="flex w-full items-center gap-4">
          {/* Rating */}
          {review.rating > 0 && (
            <div className="flex items-center gap-1">
              <StarRoundedIcon className="text-amber-300" />
              <p className="text-zinc-800 font-bold">{review.rating}</p>
            </div>
          )}
          {/* PDF Attachment */}
          {review.docUrl && (
            <div className="flex items-center gap-1">
              <p className="text-zinc-500 text-[12px]">PDF Attached</p>
              <TextSnippetRoundedIcon className="text-zinc-500" />
            </div>
          )}
        </div>
      </div>
      {/* Footer Section (Location / Action Buttons) */}
      {review.isOnline ? (
        // If meet is online
        <div className="w-full flex items-center justify-between gap-3">
          <div className="w-full h-full flex items-center justify-center bg-corigreen-100 rounded-xl">
            <p className="text-corigreen-500 text-[12px]">{review.meetLink}</p>
          </div>
          <CoriBtn primary style="black">
            Join
          </CoriBtn>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit Meeting",
                  icon: <EditIcon />,
                  onClick: () => {
                    console.log("Edit");
                  },
                },
                {
                  key: "2",
                  label: "Remove",
                  icon: <DeleteIcon />,
                  danger: true,
                  onClick: () => {
                    console.log("Remove");
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
        </div>
      ) : (
        // If meet is in person
        <div className="w-full flex items-center justify-between gap-3">
          <div className="w-full h-full flex items-center justify-center bg-sakura-100 rounded-xl">
            <p className="text-sakura-800 text-[12px]">{review.meetLocation}</p>
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit Meeting",
                  icon: <EditIcon />,
                  onClick: () => {
                    console.log("Edit");
                  },
                },
                {
                  key: "2",
                  label: "Remove",
                  icon: <DeleteIcon />,
                  danger: true,
                  onClick: () => {
                    console.log("Remove");
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
        </div>
      )}
    </div>
  );
}

export default PerfReviewBox;

{
  /* <div className="w-full flex items-center justify-between gap-3">
        <div className="w-full h-full flex items-center justify-center bg-corigreen-100 rounded-2xl">
          <p className="text-corigreen-500 text-[12px]">meet.google.com/pfh-akdk-pyo</p>
        </div>
        <CoriBtn primary style="black">
          Join
        </CoriBtn>
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Edit Meeting",
                icon: <EditIcon />,
                onClick: () => {
                  console.log("Edit");
                },
              },
              {
                key: "2",
                label: "Remove",
                icon: <DeleteIcon />,
                danger: true,
                onClick: () => {
                  console.log("Remove");
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
      </div> */
}
