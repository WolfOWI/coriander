import React, { useState, useEffect, use } from "react";
import { empLeaveRequestsAPI } from "../../services/api.service";
import dayjs from "dayjs";
import { calculateDurationInDays } from "../../utils/dateUtils";

// Import Components
import { Tooltip } from "antd";

// Icons
import {
  ClockCircleOutlined,
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Icons } from "../../constants/icons";

// Badges
import CoriBadge from "../../components/badges/CoriBadge";

// Table
import { Table } from "antd";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import CoriBtn from "../../components/buttons/CoriBtn";

const AdminLeaveRequests: React.FC = () => {

  const [displayingLeaveRequests, setDisplayingLeaveRequests] = useState<any[]>([]);

  const fetchPendingLeaveRequests = async () => {
    try {
      const response = await empLeaveRequestsAPI.getPendingLeaveRequests();
      setDisplayingLeaveRequests(response.data.$values);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };
  useEffect(() => {
    fetchPendingLeaveRequests();
  }, []);

  const fetchApprovedLeaveRequests = async () => { 
    try { 
      const response = await empLeaveRequestsAPI.getApprovedLeaveRequests();
      setDisplayingLeaveRequests(response.data.$values);
    }
    
   catch (error) {
   console.error("Error fetching approved requests:", error);

  }}

  const fetchRejectedLeaveRequests = async () => { 
    try { 
      const response = await empLeaveRequestsAPI.getRejectedLeaveRequests();
      setDisplayingLeaveRequests(response.data.$values);
    }
    
   catch (error) {
   console.error("Error fetching rejected requests:", error);

  }}

  type TabOption = "Pending" | "Approved" | "Rejected";
  const [activeTab, setActiveTab] = useState<TabOption>("Pending");

  const tabOptions: TabOption[] = ["Pending", "Approved", "Rejected"];

  useEffect(() => {
    if (activeTab === "Pending") {
      fetchPendingLeaveRequests();
    }
    else if (activeTab === "Approved") {
      fetchApprovedLeaveRequests();
    }
    else if (activeTab === "Rejected") {
      fetchRejectedLeaveRequests();
    }
  
  }, [activeTab]); 


  // Icon rendering function
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
      key: "$id",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-4 h-full">
          {getLeaveIcon(record.leaveTypeName)}
          <div className="flex flex-col">
            <p className="font-medium">{calculateDurationInDays(record.startDate, record.endDate)} Days {record.leaveTypeName} Leave</p>
            <p className="text-xs text-zinc-500">
              {dayjs(record.startDate).format("DD MMM YYYY")} - {dayjs(record.endDate).format("DD MMM YYYY")}
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
      render: (text: string, record: any) => (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="font-normal text-xs">{record.fullName}</p>
          <p className="text-xs text-zinc-500">ID-00{record.employeeId}</p>
        </div>
      ),
    },
    {
      title: "Leave Balance",
      dataIndex: "remainingDays",
      key: "remainingDays",
      className: "text-center",
      render: (balance: number, record: any) => (
        <div className="flex justify-center items-center h-full">
          <CoriBadge
            text={`${record.remainingDays} days`}
            size="x-small"
            color={record.remainingDays < calculateDurationInDays(record.startDate, record.endDate) ? "red" : "green"}
          />
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      className: "text-center",
      render: (comment: string, record: any) =>
        comment ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-zinc-500">{record.comment}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="italic text-xs text-zinc-400">No comment</p>
          </div>
        ),
    },
    {
      key: "Actions",
      render: (_: any, record: any) => (
        <div className="flex justify-end items-center gap-2 pe-4 h-full">
          {record.status === 0 && (
            <>
                <CoriCircleBtn
                  style="default"
                  icon={<CheckOutlined className="text-s" />}
                  // onClick={() =>
                  //   setRequests((prev) =>
                  //     prev.map(
                  //       (req) => (req.id === record.id ? { ...req, status: "Approved" } : req) // Update status to Approved
                  //     )
                  //   )
                  // }
                />
                <CoriCircleBtn
                  style="red"
                  icon={<CloseOutlined className="text-s" />}
                  // onClick={() =>
                  //   setRequests((prev) =>
                  //     prev.map(
                  //       (req) => (req.id === record.id ? { ...req, status: "Rejected" } : req) // Update status to Rejected
                  //     )
                  //   )
                  // }
                />
            </>
          )}
          {record.status === 1 && (
            <Tooltip title="Approved">
              <CoriCircleBtn style="default" icon={<CheckOutlined className="text-s" />} disabled />
            </Tooltip>
          )}
          {record.status === 2 && (
            <Tooltip title="Rejected">
              <CoriCircleBtn style="red" icon={<CloseOutlined className="text-s" />} disabled />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto m-4">
      {/* Page Title & Edit Policy  */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-3xl text-zinc-900" />
          <h1 className="text-3xl font-bold text-zinc-900">Leave Requests</h1>
        </div>
        <CoriBtn style="black">Edit Policy</CoriBtn>
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

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl">
        <Table columns={columns} dataSource={displayingLeaveRequests} rowKey="id" pagination={false} />
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
