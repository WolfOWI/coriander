import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "../../constants/icons";
import CoriBtn from "../../components/buttons/CoriBtn";
import MeetRequestsBadge from "../../components/badges/MeetRequestsBadge";
import MeetRequestsDrawer from "../../components/drawers/MeetRequestsDrawer";
import { gatheringAPI, meetingAPI } from "../../services/api.service";
import { MeetingRequestCard } from "../../interfaces/meetings/meetingRequestCard";
import { Gathering } from "../../interfaces/gathering/gathering";
import AdminGatheringBox from "../../components/gathering/AdminGatheringBox";
import { GatheringType } from "../../types/common";
import CreatePRModal from "../../components/modals/CreatePRModal";
import { Spin } from "antd";

// Authentication
import { getFullCurrentUser } from "../../services/authService";

type TabOption = "All Upcoming" | "General Meetings" | "Performance Reviews" | "Completed";

const AdminMeetings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>("All Upcoming");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allUpcomingGatherings, setAllUpcomingGatherings] = useState<Gathering[]>([]);
  const [completedGatherings, setCompletedGatherings] = useState<Gathering[]>([]);
  const [displayedGatherings, setDisplayedGatherings] = useState<Gathering[]>([]);
  const [meetRequests, setMeetRequests] = useState<MeetingRequestCard[]>([]);
  const [showCreatePRModal, setShowCreatePRModal] = useState(false);

  // State to track if any actions have been performed that require data refresh
  const [hasDataChanged, setHasDataChanged] = useState(false);

  const tabOptions: TabOption[] = [
    "All Upcoming",
    "General Meetings",
    "Performance Reviews",
    "Completed",
  ];

  // TODO: Get the actual admin ID from auth context

  const [adminId, setAdminId] = useState<number | 0>(0);
  useEffect(() => {
    const fetchUserAndSetId = async () => {
      setLoading(true);
      const user = await getFullCurrentUser();
      if (user?.adminId) {
        setAdminId(user.adminId);
        setLoading(false);
      }
    };
    fetchUserAndSetId();
  }, []);

  useEffect(() => {
    console.log("adminId", adminId);
  }, [adminId]);

  // Fetch meeting requests (in drawer)
  const fetchMeetRequests = useCallback(async () => {
    if (!adminId || adminId === 0) {
      console.log("No adminId available, skipping fetchMeetRequests");
      return;
    }
    try {
      const response = await meetingAPI.getAllPendingRequestsByAdminId(adminId);
      setMeetRequests(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching meet requests:", error);
      setMeetRequests([]);
    }
  }, [adminId]);

  // Fetch all upcoming gatherings
  const fetchUpcomingGatherings = useCallback(async () => {
    if (!adminId || adminId === 0) {
      console.log("No adminId available, skipping fetchUpcomingGatherings");
      return;
    }
    try {
      setLoading(true);
      const response = await gatheringAPI.getAllUpcomingGatheringsByAdminId(adminId);
      setAllUpcomingGatherings(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching upcoming gatherings:", error);
      setAllUpcomingGatherings([]);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  // Fetch completed gatherings
  const fetchCompletedGatherings = useCallback(async () => {
    if (!adminId || adminId === 0) {
      console.log("No adminId available, skipping fetchCompletedGatherings");
      return;
    }
    try {
      setLoading(true);
      const response = await gatheringAPI.getAllCompletedGatheringsByAdminId(adminId);
      setCompletedGatherings(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching completed gatherings:", error);
      setCompletedGatherings([]);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  // Filter gatherings based on active tab
  const filterGatheringsByTab = (tab: TabOption): Gathering[] => {
    switch (tab) {
      case "All Upcoming":
        return allUpcomingGatherings;
      case "General Meetings":
        return allUpcomingGatherings.filter(
          (gathering) => gathering.type === GatheringType.Meeting
        );
      case "Performance Reviews":
        return allUpcomingGatherings.filter(
          (gathering) => gathering.type === GatheringType.PerformanceReview
        );
      case "Completed":
        return completedGatherings;
      default:
        return [];
    }
  };

  // Update displayed gatherings when tab changes or data updates
  useEffect(() => {
    const filtered = filterGatheringsByTab(activeTab);
    setDisplayedGatherings(filtered);
  }, [activeTab, allUpcomingGatherings, completedGatherings]);

  // Initial data fetch
  useEffect(() => {
    if (adminId && adminId !== 0) {
      fetchMeetRequests();
      fetchUpcomingGatherings();
    }
  }, [adminId, fetchMeetRequests, fetchUpcomingGatherings]);

  // Fetch completed gatherings when Completed tab is first accessed
  useEffect(() => {
    if (activeTab === "Completed" && completedGatherings.length === 0 && adminId && adminId !== 0) {
      fetchCompletedGatherings();
    }
  }, [activeTab, completedGatherings.length, adminId, fetchCompletedGatherings]);

  // Handle tab change
  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);

    // If data has changed due to actions, refresh the data for the new tab
    if (hasDataChanged) {
      if (tab === "Completed") {
        fetchCompletedGatherings();
      } else {
        fetchUpcomingGatherings();
      }
      setHasDataChanged(false);
    }
  };

  // Handle data refresh after operations
  const handleDataRefresh = useCallback(() => {
    if (!adminId || adminId === 0) {
      console.log("No adminId available, skipping data refresh");
      return;
    }
    fetchMeetRequests();
    if (activeTab === "Completed") {
      fetchCompletedGatherings();
    } else {
      fetchUpcomingGatherings();
    }
    // Mark that data has changed so other tabs will refresh when opened
    setHasDataChanged(true);
  }, [adminId, activeTab, fetchMeetRequests, fetchCompletedGatherings, fetchUpcomingGatherings]);

  // Handle actions that affect gatherings (edit, delete, create)
  const handleGatheringAction = useCallback(() => {
    // Refresh current tab data immediately
    handleDataRefresh();
  }, [handleDataRefresh]);

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
          <CoriBtn onClick={() => setShowCreatePRModal(true)}>New Review Meet</CoriBtn>
          <CoriBtn secondary onClick={() => setDrawerOpen(true)}>
            View Requests
            <Icons.MarkChatUnread />
          </CoriBtn>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4">
        {tabOptions.map((tab) => (
          <CoriBtn
            key={tab}
            onClick={() => handleTabChange(tab)}
            secondary
            className={`btn cori-btn ${
              activeTab === tab
                ? "bg-zinc-900 text-white border-none"
                : "border-zinc-900 text-zinc-900"
            }`}
          >
            {tab}
          </CoriBtn>
        ))}
      </div>

      {/* Page Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {displayedGatherings.map((gathering) => (
            <AdminGatheringBox
              key={gathering.$id}
              gathering={gathering}
              loggedInAdminId={adminId.toString()}
              onEditSuccess={handleGatheringAction}
              onDeleteSuccess={handleGatheringAction}
            />
          ))}
          {displayedGatherings.length === 0 && (
            <div className="col-span-3 text-center text-zinc-500 py-8">No meetings found.</div>
          )}
        </div>
      )}

      {/* Meeting Requests Drawer */}
      <MeetRequestsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        adminId={adminId}
        onApprove={handleDataRefresh}
      />

      {/* Create Performance Review Modal */}
      <CreatePRModal
        showModal={showCreatePRModal}
        setShowModal={setShowCreatePRModal}
        onCreateSuccess={handleGatheringAction}
        adminId={adminId}
      />
    </div>
  );
};

export default AdminMeetings;
