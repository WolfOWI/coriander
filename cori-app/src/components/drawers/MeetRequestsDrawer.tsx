import React, { useState, useEffect, useCallback } from "react";
import { Drawer, message } from "antd";
import MeetRequestCard from "../cards/meetingCards/MeetRequestCard";
import { MeetingRequestCard } from "../../interfaces/meetings/meetingRequestCard";
import { meetingAPI } from "../../services/api.service";
import AcceptScheduleMeetingModal from "../modals/AcceptScheduleMeetingModal";

interface MeetRequestsDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  adminId: number;
  onApprove: () => void;
}

function MeetRequestsDrawer({
  drawerOpen,
  setDrawerOpen,
  adminId,
  onApprove,
}: MeetRequestsDrawerProps) {
  const [meetRequests, setMeetRequests] = useState<MeetingRequestCard[]>([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
  const [selectedMeetingRequest, setSelectedMeetingRequest] = useState<MeetingRequestCard | null>(
    null
  );

  const fetchMeetRequests = useCallback(async () => {
    if (!adminId || adminId === 0) {
      console.log("No adminId available, skipping fetchMeetRequests in drawer");
      return;
    }
    try {
      const response = await meetingAPI.getAllPendingRequestsByAdminId(adminId);
      setMeetRequests(response.data.$values || []);
      // console.log(response.data.$values);
    } catch (error) {
      console.error("Error fetching meet requests:", error);
      setMeetRequests([]);
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId && adminId !== 0) {
      fetchMeetRequests();
    }
  }, [adminId, fetchMeetRequests]);

  const handleReject = useCallback(
    async (meetingId: number) => {
      try {
        await meetingAPI.rejectMeetingRequest(meetingId);
        messageApi.success("Meeting request rejected successfully");
        await fetchMeetRequests(); // Refresh the meeting requests
        onApprove(); // Notify parent to refresh data
      } catch (error) {
        messageApi.error("Failed to reject meeting request");
        console.error("Error rejecting meeting request:", error);
      }
    },
    [fetchMeetRequests, messageApi, onApprove]
  );

  const handleApprove = useCallback(async (meetingRequest: MeetingRequestCard) => {
    setSelectedMeetingRequest(meetingRequest);
    setShowScheduleMeetingModal(true);
  }, []);

  return (
    <>
      {messageContextHolder}
      <Drawer
        title={`${meetRequests.length} Meeting Request${meetRequests.length === 1 ? "" : "s"}`}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        {meetRequests.length > 0 ? (
          <div>
            {meetRequests.map((meetRequest) => (
              <MeetRequestCard
                key={meetRequest.meetingId}
                meetRequest={meetRequest}
                onApprove={() => handleApprove(meetRequest)}
                onReject={() => handleReject(meetRequest.meetingId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center h-full">
            <p className="text-zinc-500 mt-4">No pending meeting requests</p>
          </div>
        )}
      </Drawer>

      <AcceptScheduleMeetingModal
        showModal={showScheduleMeetingModal}
        setShowModal={setShowScheduleMeetingModal}
        onSubmitSuccess={() => {
          fetchMeetRequests();
          onApprove();
        }}
        meetingRequest={selectedMeetingRequest}
      />
    </>
  );
}

export default MeetRequestsDrawer;
