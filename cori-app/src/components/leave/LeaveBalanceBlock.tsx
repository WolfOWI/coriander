import React from "react";

// Import icons
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import SickIcon from "@mui/icons-material/Sick";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { Tooltip } from "antd";

interface LeaveBalanceBlockProps {
  leaveType: string;
  remainingDays: number;
  totalDays: number;
  description: string;
  width?: string | number;
  shadow?: boolean;
}

function LeaveBalanceBlock({
  leaveType,
  remainingDays,
  totalDays,
  description,
  width,
  shadow
}: LeaveBalanceBlockProps) {
  const getLeaveIcon = () => {
    switch (leaveType) {
      case "Annual":
        return <BeachAccessIcon />;
      case "Sick":
        return <SickIcon />;
      case "Parental":
        return <ChildFriendlyIcon />;
      case "Family Responsibility":
        return <FamilyRestroomIcon />;
      case "Study":
        return <MenuBookIcon />;
      case "Compassionate":
        return <HeartBrokenIcon />;
      default:
        return <BeachAccessIcon />;
    }
  };

  return (
    <Tooltip placement="right" title={description}>
      <div 
        className={`bg-warmstone-50 p-3 rounded-2xl flex flex-col items-center justify-center text-center h-32 shadow-sm`}
        
      >
        <div className="flex items-center gap-1 mb-2">
          {getLeaveIcon()}
          <p className="text-zinc-900 text-2xl font-bold">{remainingDays}</p>
        </div>
        <p className="text-zinc-500 text-[12px]">
          {totalDays} {leaveType} Days
        </p>
      </div>
    </Tooltip>
  );
}

export default LeaveBalanceBlock;
