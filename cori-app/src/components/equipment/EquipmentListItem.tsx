import React, { JSX } from "react";

// Import Components
import CoriBadge from "../badges/CoriBadge";
import CoriCircleBtn from "../buttons/CoriCircleBtn";

// Functions
import dayjs from "dayjs";

// Import Icons
import { Icons } from "../../constants/icons";

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
      deviceIcon = <Icons.Phone fontSize="large" />;
      break;
    case EquipmentCategory.Tablet:
      deviceIcon = <Icons.Tablet fontSize="large" />;
      break;
    case EquipmentCategory.Laptop:
      deviceIcon = <Icons.Laptop fontSize="large" />;
      break;
    case EquipmentCategory.Monitor:
      deviceIcon = <Icons.Monitor fontSize="large" />;
      break;
    case EquipmentCategory.Headset:
      deviceIcon = <Icons.Headset fontSize="large" />;
      break;
    case EquipmentCategory.Keyboard:
      deviceIcon = <Icons.Keyboard fontSize="large" />;
      break;
    default:
      deviceIcon = <Icons.DeviceUnknown fontSize="large" />;
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
          <>
            <CoriCircleBtn
              style="black"
              icon={<Icons.Edit />}
              onClick={onEdit}
              className="hidden group-hover:flex transition-all duration-300"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default EquipmentListItem;
