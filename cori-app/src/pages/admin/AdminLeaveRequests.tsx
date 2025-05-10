import React, { useState } from "react";

// Import Components
import { Tooltip } from "antd";

// Icons
import {ClockCircleOutlined, ArrowDownOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />


// Badges
import CoriBadge from "../../components/badges/CoriBadge";

// Table
import { Table } from "antd";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";

const AdminLeaveRequests: React.FC = () => {
  type TabOption = "Pending" | "Approved" | "Rejected";
  const [activeTab, setActiveTab] = useState<TabOption>("Pending");

  const tabOptions: TabOption[] = ["Pending", "Approved", "Rejected"];

  // Icon rendering function
  const getLeaveIcon = (type: string) => {
    const base = "material-symbols-outlined text-2xl me-2";
    if (type.toLowerCase().includes("annual")) return <span className={base}>beach_access</span>;
    if (type.toLowerCase().includes("family")) return <span className={base}>family_restroom</span>;
    if (type.toLowerCase().includes("sick")) return <span className={base}>sick</span>;
    if (type.toLowerCase().includes("compassionate")) return <span className={base}>heart_broken</span>;
    if (type.toLowerCase().includes("study")) return <span className={base}>menu_book</span>;
    return null;
  };
  

  const [requests, setRequests] = useState([
    {
      id: 1,
      type: "3 Days Annual Leave",
      StartDate: "12 Sep",
      EndDate: "14 Sep",
      employee: "Jennifer Aniston",
      employeeId: "EMP-0093",
      balance: 4,
      comment: "Taking time off to recharge",
      status: "Pending",
    },
    {
      id: 4,
      type: "3 Days Family Leave",
      StartDate: "15 Sep",
      EndDate: "17 Sep",
      employee: "Lebo Mokoena",
      employeeId: "EMP-0104",
      balance: 2,
      comment: "Attending family emergency",
      status: "Pending",
    },
    {
      id: 2,
      type: "2 Days Sick Leave",
      StartDate: "5 Sep",
      EndDate: "6 Sep",
      employee: "Chad Smith",
      employeeId: "EMP-0021",
      balance: 6,
      comment: "Medical appointment",
      status: "Approved",
    },
    {
      id: 3,
      type: "1 Day Unpaid Leave",
      StartDate: "28 Aug",
      EndDate: "28 Aug",
      employee: "Rita Moore",
      employeeId: "EMP-0074",
      balance: 0,
      comment: "I'm taking some time off to recharge and focus on my well-being.",
      status: "Rejected",
    },
    {
      id: 5,
      type: "2 Days Maternity Leave",
      StartDate: "1 Sep",
      EndDate: "2 Sep",
      employee: "Sarah Johnson",
      employeeId: "EMP-0056",
      balance: 5,
      comment: "Preparing for the arrival of my baby",
      status: "Approved",
    },
    {
      id: 6,
      type: "1 Day Paternity Leave",
      StartDate: "10 Sep",
      EndDate: "10 Sep",
      employee: "Michael Brown",
      employeeId: "EMP-0067",
      balance: 3,
      comment: "",
      status: "Rejected",
    },
    {
      id: 7,
      type: "5 Days Bereavement Leave",
      StartDate: "20 Sep",
      EndDate: "24 Sep",
      employee: "Emily Davis",
      employeeId: "EMP-0088",
      balance: 1,
      comment: "In memory of my grandmother",
      status: "Pending",
    },
    {
      id: 8,
      type: "4 Days Vacation Leave",
      StartDate: "1 Oct",
      EndDate: "4 Oct",
      employee: "David Wilson",
      employeeId: "EMP-0099",
      balance: 2,
      comment: "Taking a break to travel",
      status: "Approved",
    },
    {
      id: 9,
      type: "2 Days Personal Leave",
      StartDate: "15 Oct",
      EndDate: "16 Oct",
      employee: "Sophia Martinez",
      employeeId: "EMP-0100",
      balance: 3,
      comment: "Need time for personal matters",
      status: "Rejected",
    },
  ]);

  const filteredData = requests.filter((item) => item.status === activeTab); // Filter data based on the active tab

  const columns = [
    {
      dataIndex: "type",
      key: "type",
      render: (text: string, record: any) => (
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center">
            {getLeaveIcon(text)}
            <p className="font-medium">{text}</p>
        </div>
          <p className="text-xs text-zinc-500">
            {record.StartDate} - {record.EndDate}
          </p>
        </div>
      ),
    },
    {
      dataIndex: "employee",
      key: "employee",
      className: "text-center",
      render: (text: string, record: any) => (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="font-medium">{text}</p>
          <p className="text-xs text-zinc-500">{record.employeeId}</p>
        </div>
      ),
    },
    {
      dataIndex: "balance",
      key: "balance",
      className: "text-center",
      render: (balance: number) => (
        <div className="flex justify-center items-center h-full">
          <CoriBadge
            text={`${balance} days`}
            size="x-small"
            color={balance < 2 ? "red" : "green"}
          />
        </div>
      ),
    },
    {
      dataIndex: "comment",
      key: "comment",
      className: "text-center",
      render: (comment: string) =>
        comment ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-zinc-500">{comment}</p>
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
          {record.status === "Pending" && (
            <>
              <Tooltip title="Approve">
                <CoriCircleBtn
                  style="default"
                  icon={<CheckOutlined className="text-s" />}
                  onClick={() =>
                    setRequests((prev) =>
                      prev.map((req) =>
                        req.id === record.id ? { ...req, status: "Approved" } : req // Update status to Approved
                      )
                    )
                  }
                />
              </Tooltip>
              <Tooltip title="Reject">
                <CoriCircleBtn
                  style="red"
                  icon={<CloseOutlined className="text-s" />}
                  onClick={() =>
                    setRequests((prev) =>
                      prev.map((req) =>
                        req.id === record.id ? { ...req, status: "Rejected" } : req // Update status to Rejected
                      )
                    )
                  }
                />
              </Tooltip>
            </>
          )}
          {record.status === "Approved" && (
            <Tooltip title="Approved">
              <CoriCircleBtn
                style="default"
                icon={<CheckOutlined className="text-s" />} 
              />
            </Tooltip>
          )}
          {record.status === "Rejected" && (
            <Tooltip title="Rejected">
              <CoriCircleBtn
                style="red"
                icon={<CloseOutlined className="text-s" />}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto m-4">
      {/* Page Title */}
      <div className="flex items-center gap-2 mb-6">
        <ClockCircleOutlined className="text-3xl text-zinc-900" />
        <h1 className="text-3xl font-bold text-zinc-900">Leave Requests</h1>
      </div>

      {/* Tab Buttons */}
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

      {/* Custom Header Row */}
      <div className="grid grid-cols-5 px-8 py-2 gap-4 text-sm font-medium text-zinc-700">
        <div className="flex items-center gap-1">
          Leave Type & Duration
          <ArrowDownOutlined className="text-s text-zinc-800" />
        </div>
        <div className="text-center">Employee</div>
        <div className="text-center">Leave Balance</div>
        <div className="text-center">Comment</div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={false}
          showHeader={false}
        />
      </div>

      {/* Spacer to push policy section to bottom if content is short */}
      <div className="flex-grow"></div>

      {/* Leave Policies Notice Section at Bottom */}
      <div className="bg-white rounded-xl p-4 flex justify-between items-center text-sm shadow-sm mt-8">
        <p className="text-red-400 max-w-3xl">
          Employees must submit leave requests in advance for approval. Leave is subject to company policies and availability.
          Unauthorized absences may impact benefits. Check your balance before applying.
        </p>
        <button className="btn cori-btn btn-outline-primary border-zinc-900 text-zinc-900">
          Edit Policies
        </button>
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
