import React, { useState } from "react";

// Icons
import { ClockCircleOutlined } from "@ant-design/icons";
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

// Graphs
import { Progress } from "antd";

// Badge
import CoriBadge from "../../components/badges/CoriBadge";

// Icon rendering function
const getLeaveIcon = (type: string) => {
  const base = "material-symbols-outlined text-2xl me-2";
  if (type.toLowerCase().includes("Annual Leave")) return <span className={base}>beach_access</span>;
  if (type.toLowerCase().includes("Family Responsibility Leave")) return <span className={base}>family_restroom</span>;
  if (type.toLowerCase().includes("Sick Leave")) return <span className={base}>sick</span>;
  if (type.toLowerCase().includes("Compassionate Leave")) return <span className={base}>heart_broken</span>;
  if (type.toLowerCase().includes("Study Leave")) return <span className={base}>menu_book</span>;
  if (type.toLowerCase().includes("Parental Leave")) return <span className={base}>child_friendly</span>;
  if (type.toLowerCase().includes("Unpaid Leave")) return <span className={base}>money_off</span>;
  return null;
};

const EmployeeLeaveOverview: React.FC = () => {
  type TabOption = "All" | "Approved" | "Pending" | "Rejected";
  const [activeTab, setActiveTab] = useState<TabOption>("All");

  const tabOptions: TabOption[] = ["All", "Approved", "Pending", "Rejected"];

  const allRequests = [
    {
      id: 1,
      type: "Compassion Leave",
      days: "2 Days",
      dates: "1 April 2025 • 3 April 2025",
      comment:
        "I'm taking some time off to recharge and focus on my well-being. It's important for me to step back and refresh my mind.",
      status: "Pending",
    },
    {
      id: 2,
      type: "Study Leave",
      days: "15 Days",
      dates: "18 Sept 2025 • 2 Oct 2025",
      comment:
        "I'm taking some time off to recharge and focus on my well-being. It's important for me to step back and refresh my mind.",
      status: "Rejected",
    },
    {
      id: 3,
      type: "Annual Leave",
      days: "3 Days",
      dates: "15 Sept 2025 • 18 Sept 2025",
      comment:
        "I'm taking some time off to recharge and focus on my well-being. It's important for me to step back and refresh my mind.",
      status: "Approved",
    },
    {
      id: 4,
      type: "Family Responsibility Leave",
      days: "2 Days",
      dates: "18 Sept 2025 • 20 Sept 2025",
      comment: "No comment",
      status: "Pending",
    },
  ];

  const filteredRequests =
    activeTab === "All"
      ? allRequests
      : allRequests.filter((req) => req.status === activeTab);

  const getStatusBadgeColor = (status: string) => {
    if (status === "Pending") return "yellow";
    if (status === "Rejected") return "red";
    return "green";
  };

  return (
    <div className="max-w-7xl mx-auto m-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: Leave Requests in 2x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-2">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-4 shadow-sm h-48 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">{req.type}</p>
                    <p className="text-sm text-zinc-600">{req.days}</p>
                  </div>
                </div>
                <CoriBadge
                  text={req.status}
                  size="x-small"
                  color={getStatusBadgeColor(req.status)}
                />
              </div>
              <div>
                <p className="text-sm text-zinc-800 mt-3">{req.dates}</p>
                <p className="text-sm text-zinc-500 mt-2">{req.comment}</p>
              </div>
            </div>
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
                      <div
                        className={`h-5 ${item.color} ${item.width} rounded-full relative`}
                      >
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
      {/* Leave Policies Notice Section */}
      <div className="mt-12 bg-transparent text-center text-sm text-zinc-500">
        <p className="max-w-4xl mx-auto">
        Employees must submit leave requests in advance for approval. Leave is subject to company policies and availability. <br />
        Unauthorized absences may impact benefits. Check your balance before applying.
        </p>
      </div>
    </div>
  );
};

export default EmployeeLeaveOverview;
