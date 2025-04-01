import React from "react";

// Import icons
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import SickIcon from "@mui/icons-material/Sick";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

function LeaveBalanceBlock() {
  return (
    <div className="bg-warmstone-50 p-3 rounded-2xl flex flex-col items-center justify-center text-center h-32 w-[136px]">
      <div className="flex items-center gap-1 mb-2">
        {/* TODO: Change icon depending on the leave type */}
        <BeachAccessIcon />
        {/* <SickIcon />
        <ChildFriendlyIcon />
        <FamilyRestroomIcon />
        <MenuBookIcon />
        <HeartBrokenIcon /> */}
        <p className="text-zinc-900 text-2xl font-bold">15</p>
      </div>
      <p className="text-zinc-500 text-[12px]">15 Annual Days</p>
    </div>
  );
}

export default LeaveBalanceBlock;
