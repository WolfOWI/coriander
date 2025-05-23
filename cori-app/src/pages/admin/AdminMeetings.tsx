import React, { useState, useEffect } from "react";
import { Icons } from "../../constants/icons";
import CoriBtn from "../../components/buttons/CoriBtn";
import MeetRequestsBadge from "../../components/badges/MeetRequestsBadge";
import { Drawer } from "antd";
import MeetRequestsDrawer from "../../components/drawers/MeetRequestsDrawer";
import { meetingAPI } from "../../services/api.service";
import { MeetingRequestCard } from "../../interfaces/meetings/meetingRequestCard";

const AdminMeetings: React.FC = () => {
  type TabOption = "All" | "General Meetings" | "Performance Reviews" | "Completed";
  const [activeTab, setActiveTab] = useState<TabOption>("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [meetRequests, setMeetRequests] = useState<MeetingRequestCard[]>([]);
  const tabOptions: TabOption[] = ["All", "General Meetings", "Performance Reviews", "Completed"];

  // TODO: Get the actual admin ID from auth context
  const adminId = 1;

  const fetchMeetRequests = async () => {
    try {
      const response = await meetingAPI.getAllPendingRequestsByAdminId(adminId);
      setMeetRequests(response.data.$values);
    } catch (error) {
      console.error("Error fetching meet requests:", error);
    }
  };

  useEffect(() => {
    fetchMeetRequests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto m-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icons.MeetingRoom fontSize="large" className="text-zinc-900" />
            <h1 className="text-3xl font-bold text-zinc-900">Meetings</h1>
          </div>
          <MeetRequestsBadge requests={meetRequests.length} />
        </div>
        <div className="flex items-center gap-2">
          <CoriBtn>New Review Meet</CoriBtn>
          <CoriBtn secondary onClick={() => setDrawerOpen(true)}>
            View Requests
            <Icons.MarkChatUnread />
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

      {/* Meeting Requests Drawer */}
      <MeetRequestsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        adminId={adminId}
        onApprove={fetchMeetRequests}
      />
    </div>
  );
};

export default AdminMeetings;
