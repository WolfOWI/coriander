import React from "react";
// Replace with the actual path to your icon
import CoriBadge from "../../../components/badges/CoriBadge";
import { Icons } from "../../../constants/icons";
import { getFullImageUrl } from "../../../utils/imageUtils";
import EmployTypeBadge from "../../../components/badges/EmployTypeBadge";
import { EmployType } from "../../../types/common";

interface TopRatedEmployee {
  profilePicture: string; // Optional, if you want to use a different image
  fullName: string;
  jobTitle: string;
  averageRating: number;
  employType: string;
  isSuspended: boolean;
}

const TopRatedEmpCard: React.FC<TopRatedEmployee> = ({
  fullName,
  jobTitle,
  averageRating,
  employType,
  profilePicture,
  isSuspended
}) => {
  return (
    <div className="p-1">
      <div className="flex justify-between items-center p-2 hover:bg-zinc-100 rounded-xl">
        <img
          src={getFullImageUrl(profilePicture) || ""} // Use profilePicture if available, otherwise fallback to Icon
          alt={fullName}
          className="rounded-full w-11 h-11"
        />
        <div className="flex flex-col">
          <span className="text-zinc-900 text-md">{fullName}</span>
          <span className="text-zinc-500 text-xs">{jobTitle}</span>
        </div>
        <div className="w-fit">
          <div className="w-fit">
            <EmployTypeBadge status={isSuspended ? "suspended" : employType as unknown as EmployType} />
          </div>
         </div>
        <span className="text-zinc-900">⭐ {averageRating.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default TopRatedEmpCard;
