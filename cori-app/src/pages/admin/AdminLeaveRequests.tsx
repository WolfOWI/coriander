import React, { useState } from "react";

// Import Components
import { Tooltip } from "antd";

// Icons
import {ClockCircleOutlined, ArrowDownOutlined, CheckOutlined, CloseOutlined,} from "@ant-design/icons";

// Badges
import CoriBadge from "../../components/badges/CoriBadge";

// Table
import { Table } from "antd";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";

const AdminLeaveRequests: React.FC = () => {
  type TabOption = "Pending" | "Approved" | "Rejected";
  const [activeTab, setActiveTab] = useState<TabOption>("Pending");

  const tabOptions: TabOption[] = ["Pending", "Approved", "Rejected"];
  

  const mockData = [
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
      comment: "",
      status: "Rejected",
    },
  ];

  const filteredData = mockData.filter((item) => item.status === activeTab); // Filter data based on the active tab

  const columns = [
    {
      dataIndex: "type",
      key: "type",
      render: (text: string, record: any) => (
        <div>
          <p className="font-medium">{text}</p>
          <p className="text-xs text-zinc-500">
            {record.StartDate} - {record.EndDate}
          </p>
        </div>
      ),
    },
    {
      dataIndex: "employee",
      key: "employee",
      render: (text: string, record: any) => (
        <div>
          <p className="font-medium">{text}</p>
          <p className="text-xs text-zinc-500">{record.employeeId}</p>
        </div>
      ),
    },
    {
      dataIndex: "balance",
      key: "balance",
      render: (balance: number) => (
        <CoriBadge
          text={`${balance} days`}
          size="x-small"
          color={balance < 2 ? "red" : "green"}
        />
      ),
    },
    {
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) =>
        comment ? (
          <span>{comment}</span>
        ) : (
          <span className="italic text-zinc-400">No comment</span>
        ),
    },
    {
      key: "Actions",
      render: () => (
        <div className="flex justify-end gap-2 pe-4">
          <Tooltip title="Approve">
            <CoriCircleBtn style="default" icon={<CheckOutlined className="text-xs" />} />
          </Tooltip>
          <Tooltip title="Reject">
            <CoriCircleBtn style="red" icon={<CloseOutlined className="text-xs" />} />
          </Tooltip>
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
      <div className="grid grid-cols-5 gap-4 px-4 py-2 text-sm font-medium text-zinc-700">
        <div className="flex items-center gap-1 rounded-tl-xl">
          Leave Type & Duration
          <ArrowDownOutlined className="text-s text-zinc-800" />
        </div>
        <div className="ps-12">Employee</div>
        <div className="ps-6">Leave Balance</div>
        <div className="ps-10">Comment</div>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
        showHeader={false}
      />

      {/* Spacer to push policy section to bottom if content is short */}
<div className="flex-grow"></div>

      {/* Leave Policies Notice Section at Bottom */}
      <div className="bg-white fixed bottom-4 rounded-xl p-4 flex justify-between items-center text-sm shadow-sm mt-8">
        <p className="text-red-500 max-w-3xl">
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
