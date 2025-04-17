import React from "react";

// Import Icons
import { Icons } from "../../constants/icons";

const AdminEquipmentManagement: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto m-4">
      <div className="flex items-center gap-2">
        <Icons.Construction fontSize="large" className="text-zinc-900" />
        <h1 className="text-3xl font-bold text-zinc-900">Equipment</h1>
      </div>
    </div>
  );
};

export default AdminEquipmentManagement;
