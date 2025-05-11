import React, { useState } from "react";
import { LeaveStatus } from "../../types/common";

// Icons
import { ClockCircleOutlined } from "@ant-design/icons";
import { Icons } from "../../constants/icons";

// Graphs
import { Progress } from "antd";

// Badge
import CoriBadge from "../../components/badges/CoriBadge";
import LeaveRequestCard from "../../components/cards/empCards/LeaveRequestCard";

// Icon rendering function
const getLeaveIcon = (type: string) => {
  if (type.toLowerCase().includes("annual ")) return <Icons.BeachAccess fontSize="large" />;
  if (type.toLowerCase().includes("family")) return <Icons.FamilyRestroom fontSize="large" />;
  if (type.toLowerCase().includes("sick")) return <Icons.Sick fontSize="large" />;
  if (type.toLowerCase().includes("compassion")) return <Icons.HeartBroken fontSize="large" />;
  if (type.toLowerCase().includes("study")) return <Icons.MenuBook fontSize="large" />;
  if (type.toLowerCase().includes("parental")) return <Icons.ChildFriendly fontSize="large" />;
  return null;
};

const EmployeeLeaveOverview: React.FC = () => {
  type TabOption = "All" | "Approved" | "Pending" | "Rejected";
  const [activeTab, setActiveTab] = useState<TabOption>("All");

  const tabOptions: TabOption[] = ["All", "Approved", "Pending", "Rejected"];

  const allRequests = {
    $id: "1",
    $values: [
      {
        $id: "2",
        leaveRequestId: 2,
        employeeId: 8,
        leaveTypeId: 2,
        startDate: "2025-04-01",
        endDate: "2025-04-17",
        comment: "Here is my comment ya'll",
        status: 1,
        createdAt: "2025-04-01T10:02:07.417Z",
        leaveTypeName: "Sick",
        description:
          "Leave taken when an employee is unable to perform work duties due to illness, injury, or medical treatment.",
        defaultDays: 10,
      },
      {
        $id: "3",
        leaveRequestId: 7,
        employeeId: 8,
        leaveTypeId: 1,
        startDate: "2025-04-15",
        endDate: "2025-04-18",
        comment: "Comment goes here",
        status: 0,
        createdAt: "2025-04-15T10:27:54.734Z",
        leaveTypeName: "Annual",
        description:
          "Paid leave provided annually to employees for rest and personal activities, typically scheduled in agreement with management.",
        defaultDays: 15,
      },
      {
        $id: "4",
        leaveRequestId: 8,
        employeeId: 8,
        leaveTypeId: 2,
        startDate: "2025-02-15",
        endDate: "2025-02-18",
        comment: "Comment will be here",
        status: 0,
        createdAt: "2025-04-15T10:27:54.734Z",
        leaveTypeName: "Sick",
        description:
          "Leave taken when an employee is unable to perform work duties due to illness, injury, or medical treatment.",
        defaultDays: 10,
      },
      {
        $id: "5",
        leaveRequestId: 9,
        employeeId: 8,
        leaveTypeId: 2,
        startDate: "2025-02-15",
        endDate: "2025-02-18",
        comment: "Comment comment comment comments",
        status: 2,
        createdAt: "2025-04-15T10:27:54.734Z",
        leaveTypeName: "Sick",
        description:
          "Leave taken when an employee is unable to perform work duties due to illness, injury, or medical treatment.",
        defaultDays: 10,
      },
      {
        $id: "5",
        leaveRequestId: 329,
        employeeId: 8,
        leaveTypeId: 2,
        startDate: "2025-02-15",
        endDate: "2025-02-18",
        comment: "Comment comment comment comments",
        status: 0,
        createdAt: "2025-04-15T10:27:54.734Z",
        leaveTypeName: "Sick",
        description:
          "Leave taken when an employee is unable to perform work duties due to illness, injury, or medical treatment.",
        defaultDays: 10,
      },
    ],
  };

  const filteredRequests =
    activeTab === "All"
      ? allRequests.$values
      : allRequests.$values.filter((req) => req.status === LeaveStatus[activeTab]);

  const getStatusBadgeColor = (status: string) => {
    if (status === "Pending") return "yellow";
    if (status === "Rejected") return "red";
    return "green";
  };

  return (
    <div className="max-w-7xl mx-auto m-4 h-[calc(100vh-32px)]">
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-3xl text-zinc-900" />
              <h1 className="text-3xl font-bold text-zinc-900">Leave Overview</h1>
            </div>
            <button className="btn cori-btn btn-primary bg-corigreen-500 text-white border-none hover:bg-corigreen-600">
              Apply For Leave
            </button>
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
          {/* className="grid gap-4 grid-cols-3" */}
          {/* LEFT: Leave Requests in 2x2 layout */}
          <div className="grid gap-4 grid-cols-3">
            <div
              className={`grid gap-3 h-fit ${
                activeTab === "All" ? "grid-cols-2 col-span-2" : "grid-cols-3 col-span-3"
              }`}
            >
              {filteredRequests.map((req) => (
                <LeaveRequestCard req={req} />
              ))}
            </div>
            {/* RIGHT: Leave Balances and Summary (only for "All" tab) */}
            {activeTab === "All" && (
              <div className="flex flex-col gap-4">
                {/* Leave Summary Title */}
                <p className="text-sm font-medium text-zinc-700 px-2 -mb-2 text-center -mt-9">
                  Leave Summary
                </p>
                {/* Leave Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
                  <Progress
                    type="circle"
                    percent={67}
                    format={() => "10/15"}
                    strokeColor={{ "0%": "#3CB4E7", "100%": "#E0F4FD" }}
                    trailColor="#F4F4F5"
                    strokeWidth={10}
                    size={150}
                  />
                </div>

                {/* Leave Balances Title */}
                <p className="text-sm font-medium text-zinc-700 px-2 -mb-2 text-center">
                  Leave Balances
                </p>
                {/* Leave Balances */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="space-y-4 -mt-1">
                    {[
                      {
                        label: "Annual Leave",
                        color: "bg-corigreen-500",
                        width: "w-4/5",
                      },
                      {
                        label: "Family Responsibility Leave",
                        color: "bg-red-500",
                        width: "w-3/5",
                      },
                      {
                        label: "Sick Leave",
                        color: "bg-yellow-300",
                        width: "w-2/5",
                      },
                      {
                        label: "Parental Leave",
                        color: "bg-sakura-500",
                        width: "w-1/2",
                      },
                      {
                        label: "Study Leave",
                        color: "bg-blue-400",
                        width: "w-2/5",
                      },
                      {
                        label: "Compassionate Leave",
                        color: "bg-orange-400",
                        width: "w-3/4",
                      },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-zinc-700 mb-1">{item.label}</p>
                        <div className="h-5 w-full bg-zinc-300 rounded-full relative">
                          <div className={`h-5 ${item.color} ${item.width} rounded-full relative`}>
                            <div className="absolute right-0 top-0 bottom-0 w-2 h-5 bg-black rounded-r-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Leave Policies Notice Section */}
        <div className="text-center text-sm text-zinc-400 p-4 hover:text-zinc-500">
          <p className="max-w-4xl mx-auto">
            Employees must submit leave requests in advance for approval. Leave is subject to
            company policies and availability. <br />
            Unauthorized absences may impact benefits. Check your balance before applying.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveOverview;
