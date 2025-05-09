import React, { useState } from "react";

// Icons
import { ClockCircleOutlined } from "@ant-design/icons";

const AdminLeaveRequests: React.FC = () => {
  type TabOption = "Pending" | "Approved" | "Rejected";
  const [activeTab, setActiveTab] = useState<TabOption>("Pending");

  const tabOptions: TabOption[] = ["Pending", "Approved", "Rejected"];

  return (
    <div className="max-w-7xl mx-auto m-4">
      <div className="flex items-center gap-2 mb-6">
        <ClockCircleOutlined className="text-3xl text-zinc-900" />
        <h1 className="text-3xl font-bold text-zinc-900">Leave Requests</h1>
      </div>

      {/* Custom tab buttons */}
      <div className="flex gap-2 mb-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn cori-btn ${
              activeTab === tab
                ? "btn-primary bg-zinc-900 text-white"
                : "btn-outline-primary border-zinc-900 text-zinc-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
