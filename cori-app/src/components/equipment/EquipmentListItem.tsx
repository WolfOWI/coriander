import React, { JSX } from "react";

// Import Components
import CoriBadge from "../CoriBadge";
import CoriCircleBtn from "../buttons/CoriCircleBtn";

// Import Icons
import PhoneIcon from "@mui/icons-material/PhoneAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import MonitorIcon from "@mui/icons-material/Monitor";
import HeadsetIcon from "@mui/icons-material/Headset";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EditIcon from "@mui/icons-material/Edit";

function EquipmentListItem(device: object) {
  let deviceIcon: JSX.Element;

  return (
    // TODO: Change deviceIcon depending on the device type (when adding dynamic data)
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
      <CoriCircleBtn style="black" icon={<EditIcon />} />
    </div>
  );
}

export default EquipmentListItem;
