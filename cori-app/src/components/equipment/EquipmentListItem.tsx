import React, { JSX } from "react";

// Import Components
import CoriBadge from "../badges/CoriBadge";
import CoriCircleBtn from "../buttons/CoriCircleBtn";

// Functions
import dayjs from "dayjs";

// Import Icons
import PhoneIcon from "@mui/icons-material/PhoneAndroid";
import TabletIcon from "@mui/icons-material/TabletAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import MonitorIcon from "@mui/icons-material/Monitor";
import HeadsetIcon from "@mui/icons-material/Headset";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EditIcon from "@mui/icons-material/Edit";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";

// Types
import { EquipmentCondition, EquipmentCategory } from "../../types/common";
import EquipCondiBadge from "../badges/EquipCondiBadge";

interface Equipment {
  equipmentId: number;
  employeeId: number;
  equipmentCatId: EquipmentCategory;
  equipmentCategoryName: string;
  equipmentName: string;
  assignedDate: string;
  condition: EquipmentCondition;
}

interface EquipmentListItemProps {
  item: Equipment | null;
  onEdit?: () => void;
  adminView?: boolean;
}

function EquipmentListItem({ item, onEdit, adminView }: EquipmentListItemProps) {
  let deviceIcon: JSX.Element;

  if (!item) {
    return null;
  }

  switch (item.equipmentCatId) {
    case EquipmentCategory.Cellphone:
      deviceIcon = <PhoneIcon fontSize="large" />;
      break;
    case EquipmentCategory.Tablet:
      deviceIcon = <TabletIcon fontSize="large" />;
      break;
    case EquipmentCategory.Laptop:
      deviceIcon = <LaptopIcon fontSize="large" />;
      break;
    case EquipmentCategory.Monitor:
      deviceIcon = <MonitorIcon fontSize="large" />;
      break;
    case EquipmentCategory.Headset:
      deviceIcon = <HeadsetIcon fontSize="large" />;
      break;
    case EquipmentCategory.Keyboard:
      deviceIcon = <KeyboardIcon fontSize="large" />;
      break;
    default:
      deviceIcon = <DeviceUnknownIcon fontSize="large" />;
      break;
  }

  return (
    <div className="flex items-center gap-2 w-full justify-between group">
      <div className="flex items-center gap-2">
        {deviceIcon}
        <div className="flex flex-col">
          <p className="text-zinc-900">{item.equipmentName}</p>
          <p className="text-zinc-500 text-sm">{item.equipmentCategoryName}</p>
        </div>
      </div>
      <p className="text-zinc-500 text-sm">{dayjs(item.assignedDate).format("DD MMM YYYY")}</p>
      <div className="flex items-center gap-2">
        <EquipCondiBadge condition={item.condition} />
        {/* Edit button only for admins */}
        {adminView && (
          <CoriCircleBtn
            style="black"
            icon={<EditIcon />}
            onClick={onEdit}
            className="hidden group-hover:flex transition-all duration-300"
          />
        )}
      </div>
    </div>
  );
}

export default EquipmentListItem;
