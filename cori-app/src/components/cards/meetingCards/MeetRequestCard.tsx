import React from "react";
import { MeetingRequestCard } from "../../../interfaces/meetings/meetingRequestCard";
import CoriBtn from "../../buttons/CoriBtn";
import dayjs from "dayjs";
import { Avatar } from "antd";
import { Icons } from "../../../constants/icons";

interface MeetRequestCardProps {
  meetRequest: MeetingRequestCard;
}

function MeetRequestCard({ meetRequest }: MeetRequestCardProps) {
  return (
    <div className="flex flex-col w-full bg-warmstone-50 p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer group mt-3">
      <div className="flex items-center gap-2">
        {meetRequest.profilePicture ? (
          <Avatar src={meetRequest.profilePicture} />
        ) : (
          <Avatar icon={<Icons.Person />} />
        )}
        <div>
          <p>{meetRequest.employeeName}</p>
          <p className="text-zinc-500 text-[12px]">
            at {dayjs(meetRequest.requestedAt).format("h:mm A, D MMM YYYY")}
          </p>
        </div>
      </div>
      <p className="text-zinc-500 text-sm mt-3">{meetRequest.purpose}</p>
      <div className="flex gap-2 w-full max-h-0 overflow-hidden group-hover:max-h-20 group-hover:mt-3 transition-all duration-300">
        <CoriBtn secondary style="red" className="w-full">
          Reject
        </CoriBtn>
        <CoriBtn className="w-full">Accept</CoriBtn>
      </div>
    </div>
  );
}

export default MeetRequestCard;
