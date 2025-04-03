import React, { JSX } from "react";

// Import Components
import CoriBadge from "../badges/CoriBadge";
import CoriCircleBtn from "../buttons/CoriCircleBtn";

// Import Icons
import PhoneIcon from "@mui/icons-material/PhoneAndroid";
import TabletIcon from "@mui/icons-material/TabletAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import MonitorIcon from "@mui/icons-material/Monitor";
import HeadsetIcon from "@mui/icons-material/Headset";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EditIcon from "@mui/icons-material/Edit";

interface EquipmentListItemProps {
  device: object | null;
  onEdit: () => void;
}

function EquipmentListItem({ device, onEdit }: EquipmentListItemProps) {
  let deviceIcon: JSX.Element;

  return (
    // TODO: Change deviceIcon depending on the device type (when adding dynamic data)
    // <PhoneIcon fontSize="large" />
    // <TabletIcon fontSize="large" />
    // <LaptopIcon fontSize="large" />
    // <MonitorIcon fontSize="large" />
    // <HeadsetIcon fontSize="large" />
    // <KeyboardIcon fontSize="large" />

    <div className="flex items-center gap-2 w-full justify-between">
      <div className="flex items-center gap-2">
        <PhoneIcon fontSize="large" />
        <div className="flex flex-col">
          <p className="text-zinc-900">Samsung Galaxy S24</p>
          <p className="text-zinc-500 text-sm">Cellphone</p>
        </div>
      </div>
      <p className="text-zinc-500 text-sm">1 Jan 2025</p>
      <CoriBadge text="Good" size="small" color="blue" />
      <CoriCircleBtn style="black" icon={<EditIcon />} onClick={onEdit} />
    </div>
  );
}

export default EquipmentListItem;
