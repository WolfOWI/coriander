import React, { useState, useEffect } from "react";
import { empLeaveRequestsAPI } from "../../services/api.service";
import dayjs from "dayjs";
import { calculateDurationInDays } from "../../utils/dateUtils";

// Import Components
import { Tooltip } from "antd";

// Icons
import {
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Icons } from "../../constants/icons";

// Badges & Buttons
import CoriBadge from "../../components/badges/CoriBadge";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import CoriBtn from "../../components/buttons/CoriBtn";

// Table
import { Table } from "antd";

// Edit Policy Modal
import EditPolicyModal from "../../components/modals/EditPolicyModal";

const AdminLeaveRequests: React.FC = () => {
  const [displayingLeaveRequests, setDisplayingLeaveRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Fetch handlers
  const fetchPending = async () => {
    const res = await empLeaveRequestsAPI.getPendingLeaveRequests();
    setDisplayingLeaveRequests(res.data.$values);
  };
  const fetchApproved = async () => {
    const res = await empLeaveRequestsAPI.getApprovedLeaveRequests();
    setDisplayingLeaveRequests(res.data.$values);
  };
  const fetchRejected = async () => {
    const res = await empLeaveRequestsAPI.getRejectedLeaveRequests();
    setDisplayingLeaveRequests(res.data.$values);
  };

  useEffect(() => {
    if (activeTab === "Pending") fetchPending();
    else if (activeTab === "Approved") fetchApproved();
    else fetchRejected();
  }, [activeTab]);

  useEffect(() => {
    console.log("Displaying Leave Requests:", displayingLeaveRequests);
  }, [displayingLeaveRequests]);

  // Action handlers
  const handleApprove = async (id: number) => {
    try {
      await empLeaveRequestsAPI.approveLeaveRequestById(id);
    setActiveTab("Approved");
    } catch (error) {
      console.error(`Error approving leave request ${id}:`, error);
    }
  };
  
  const handleReject = async (id: number) => {
   try {
     await empLeaveRequestsAPI.rejectLeaveRequestById(id);
    setActiveTab("Rejected");
   } catch (error) {
    console.error(`Error rejecting leave request ${id}:`, error);
   }
  };

  // Table columns (unchanged)
  const getLeaveIcon = (type: string) => {
    if (type.toLowerCase().includes("annual")) return <Icons.BeachAccess fontSize="large" />;
    if (type.toLowerCase().includes("family")) return <Icons.FamilyRestroom fontSize="large" />;
    if (type.toLowerCase().includes("sick")) return <Icons.Sick fontSize="large" />;
    if (type.toLowerCase().includes("compassion")) return <Icons.HeartBroken fontSize="large" />;
    if (type.toLowerCase().includes("study")) return <Icons.MenuBook fontSize="large" />;
    if (type.toLowerCase().includes("parental")) return <Icons.ChildFriendly fontSize="large" />;
    return null;
  };

  const columns = [
    {
      title: "Leave Type & Duration",
      dataIndex: "startDate",
      key: "startDate",
      render: (_: any, r: any) => (
        <div className="flex items-center gap-4 h-full">
          {getLeaveIcon(r.leaveTypeName)}
          <div className="flex flex-col">
            <p className="font-medium">
              {calculateDurationInDays(r.startDate, r.endDate)} Days {r.leaveTypeName} Leave
            </p>
            <p className="text-xs text-zinc-500">
              {dayjs(r.startDate).format("DD MMM YYYY")} –{" "}
              {dayjs(r.endDate).format("DD MMM YYYY")}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Employee",
      dataIndex: "fullName",
      key: "fullName",
      className: "text-center",
      render: (_: any, r: any) => (
        <div className="flex flex-col items-center">
          <p className="font-normal text-xs">{r.fullName}</p>
          <p className="text-xs text-zinc-500">ID-00{r.employeeId}</p>
        </div>
      ),
    },
    {
      title: "Leave Balance",
      dataIndex: "remainingDays",
      key: "remainingDays",
      className: "text-center",
      render: (_: any, r: any) => (
        <div className="flex justify-center">
          <CoriBadge
            text={`${r.remainingDays} days`}
            size="x-small"
            color={
              r.remainingDays < calculateDurationInDays(r.startDate, r.endDate)
                ? "red"
                : "green"
            }
          />
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      className: "text-center",
      render: (_: any, r: any) =>
        r.comment ? (
          <p className="text-xs text-zinc-500">{r.comment}</p>
        ) : (
          <p className="italic text-xs text-zinc-400">No comment</p>
        ),
    },
    {
      key: "actions",
      render: (_: any, r: any) => (
        <div className="flex justify-end gap-2 pe-4">
          {r.status === 0 && (
            <>
              <CoriBtn iconOnly onClick={() => handleApprove(r.leaveRequestId)}>
                <CheckOutlined />
              </CoriBtn>
              <CoriBtn secondary style="red" iconOnly onClick={() => handleReject(r.leaveRequestId)}>
                <CloseOutlined />
              </CoriBtn>
            </>
          )}
          {r.status === 1 && (
            <Tooltip title="Approved">
              <CoriCircleBtn style="default" icon={<CheckOutlined />} disabled />
            </Tooltip>
          )}
          {r.status === 2 && (
            <Tooltip title="Rejected">
              <CoriCircleBtn style="red" icon={<CloseOutlined />} disabled />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto m-4">
        {/* Title & Edit Policy */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-3xl text-zinc-900" />
            <h1 className="text-3xl font-bold text-zinc-900">Leave Requests</h1>
          </div>
          <CoriBtn style="black" onClick={() => setShowPolicyModal(true)}>
            Edit Policy
          </CoriBtn>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["Pending", "Approved", "Rejected"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn cori-btn ${
                activeTab === tab
                  ? "btn-primary bg-zinc-900 text-white"
                  : "btn-outline-primary border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl">
          <Table
            columns={columns}
            dataSource={displayingLeaveRequests}
            rowKey="LeaveRequestId"
            pagination={false}
          />
        </div>
      </div>

      {/* Edit Policy Modal */}
      <EditPolicyModal
        showModal={showPolicyModal}
        setShowModal={setShowPolicyModal}
      />
    </>
  );
};

export default AdminLeaveRequests;
