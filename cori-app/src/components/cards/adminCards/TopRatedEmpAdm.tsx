import React from "react";
 // Replace with the actual path to your icon
import CoriBadge from "../../../components/badges/CoriBadge";
import { Icons } from "../../../constants/icons";

interface TopRatedEmployee {
  profilePicture: string; // Optional, if you want to use a different image
  fullName: string;
  jobTitle: string;
  averageRating: number;
  employType: string; // Example: "Full Time", "Part Time", etc.
}

const TopRatedEmpCard: React.FC<TopRatedEmployee> = ({ fullName, jobTitle, averageRating, employType, profilePicture }) => {
  return (
    <div className="p-1">
        <div className="flex justify-between items-center p-2 hover:bg-zinc-100 rounded-xl">
        <img
            src={profilePicture} // Use profilePicture if available, otherwise fallback to Icon
            alt={fullName}
            className="rounded-full w-11 h-11"
          />
          <div className="flex flex-col">
            <span className="text-zinc-900 text-md">{fullName}</span>
            <span className="text-zinc-500 text-xs">{jobTitle}</span>
          </div>
          <CoriBadge size="small" text="Part Time"></CoriBadge>
          <span className="text-zinc-900">⭐ {averageRating.toFixed(1)}</span>
        </div>
    </div>
  );
};

export default TopRatedEmpCard;