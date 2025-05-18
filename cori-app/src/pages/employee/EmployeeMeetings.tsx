import React, { useState } from "react";
import { Icons } from "../../constants/icons";
import CoriBtn from "../../components/buttons/CoriBtn";

const EmployeeMeetings: React.FC = () => {
  type TabOption = "All" | "Upcoming" | "Completed" | "Requests";
  const [activeTab, setActiveTab] = useState<TabOption>("All");
  const tabOptions: TabOption[] = ["All", "Upcoming", "Completed", "Requests"];

  return (
    <div className="max-w-7xl mx-auto m-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icons.MeetingRoom fontSize="large" className="text-zinc-900" />
          <h1 className="text-3xl font-bold text-zinc-900">My Meetings</h1>
        </div>
        <div className="flex items-center gap-2">
          <CoriBtn>
            <Icons.Add />
            Request a Meeting
          </CoriBtn>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn cori-btn ${
              activeTab === tab
                ? "btn-primary bg-zinc-900 text-white border-none"
                : "btn-outline-primary border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white hover:border-none"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <div className="bg-warmstone-50 p-4 rounded-2xl">
        {/* Content will be added later based on activeTab */}
      </div>
    </div>
  );
};

export default EmployeeMeetings;
