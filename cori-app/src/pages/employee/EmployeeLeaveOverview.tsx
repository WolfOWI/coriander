import React, { useState, useEffect } from "react";
import { LeaveStatus } from "../../types/common";
import { pageAPI } from "../../services/api.service";

// Icons
import { ClockCircleOutlined } from "@ant-design/icons";
import { Icons } from "../../constants/icons";

// Graphs & Tooltip
import { Progress, Tooltip } from "antd";

// Badge
import CoriBadge from "../../components/badges/CoriBadge";
import LeaveRequestCard from "../../components/cards/empCards/LeaveRequestCard";

// Apply-for-leave modal
import ApplyForLeaveModal from "../../components/modals/ApplyForLeaveModal";
import { getFullCurrentUser } from "../../services/authService";

// CoriBtn component
import CoriBtn from "../../components/buttons/CoriBtn";

const getLeaveIcon = (type: string) => {
  if (type.toLowerCase().includes("annual"))
    return <Icons.BeachAccess fontSize="large" />;
  if (type.toLowerCase().includes("family"))
    return <Icons.FamilyRestroom fontSize="large" />;
  if (type.toLowerCase().includes("sick"))
    return <Icons.Sick fontSize="large" />;
  if (type.toLowerCase().includes("compassion"))
    return <Icons.HeartBroken fontSize="large" />;
  if (type.toLowerCase().includes("study"))
    return <Icons.MenuBook fontSize="large" />;
  if (type.toLowerCase().includes("parental"))
    return <Icons.ChildFriendly fontSize="large" />;
  return null;
};

type TabOption = "All" | "Approved" | "Pending" | "Rejected";

const EmployeeLeaveOverview: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [summary, setSummary] = useState<{
    totalTaken: number;
    totalAllowed: number;
  }>({
    totalTaken: 0,
    totalAllowed: 0,
  });
  const [activeTab, setActiveTab] = useState<TabOption>("All");
  const [showModal, setShowModal] = useState(false);
  const tabOptions: TabOption[] = ["All", "Approved", "Pending", "Rejected"];

  // Define a palette of Tailwind color classes for balance bars
  const barColors = [
    "bg-corigreen-500", // Annual Leave
    "bg-red-500", // Family Responsibility Leave
    "bg-yellow-300", // Sick Leave
    "bg-sakura-500", // Parental Leave
    "bg-blue-400", // Study Leave
    "bg-orange-400", // Compassionate Leave
  ];

  // Fetch data from backend
  const fetchEmployeeData = async () => {
    try {
      const user = await getFullCurrentUser();
      const resp = await pageAPI.getEmployeeLeaveData(
        user?.employeeId?.toString() || ""
      );
      const leaveRequests = resp.data.leaveRequests?.$values || [];
      const leaveBalances = resp.data.leaveBalances?.$values || [];

      setBalances(
        leaveBalances.map((b: any) => ({
          leaveTypeId: b.leaveBalanceId,
          leaveTypeName: b.leaveTypeName,
          remainingDays: b.remainingDays,
          defaultDays: b.defaultDays,
        }))
      );

      const totalAllowed = leaveBalances.reduce(
        (sum: number, b: any) => sum + b.defaultDays,
        0
      );
      const totalRemaining = leaveBalances.reduce(
        (sum: number, b: any) => sum + b.remainingDays,
        0
      );
      setSummary({ totalTaken: totalAllowed - totalRemaining, totalAllowed });

      let filtered = leaveRequests;
      if (activeTab === "Approved") {
        filtered = leaveRequests.filter(
          (r: any) => r.status === LeaveStatus.Approved
        );
      } else if (activeTab === "Pending") {
        filtered = leaveRequests.filter(
          (r: any) => r.status === LeaveStatus.Pending
        );
      } else if (activeTab === "Rejected") {
        filtered = leaveRequests.filter(
          (r: any) => r.status === LeaveStatus.Rejected
        );
      }
      setRequests(filtered);
    } catch (err) {
      console.error("Error fetching employee leave data:", err);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [activeTab]);

  // Read editable policy or fallback
  const policy =
    localStorage.getItem("leavePolicy") ||
    `Employees must submit leave requests in advance for approval. Leave is subject to company policies and availability.
Unauthorized absences may impact benefits. Check your balance before applying.`;

  return (
    <>
      <div className="max-w-7xl mx-auto m-4 h-[calc(100vh-32px)]">
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-3xl text-zinc-900" />
                <h1 className="text-3xl font-bold text-zinc-900">
                  Leave Overview
                </h1>
              </div>
              <button
                className="btn cori-btn btn-primary bg-corigreen-500 text-white border-none hover:bg-corigreen-600"
                onClick={() => setShowModal(true)}
              >
                Apply For Leave
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {tabOptions.map((tab) => (
                <CoriBtn
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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

            {/* Main Content */}
            <div className="grid gap-4 grid-cols-3">
              <div
                className={`grid gap-3 h-fit ${
                  activeTab === "All"
                    ? "grid-cols-2 col-span-2"
                    : "grid-cols-3 col-span-3"
                }`}
              >
                {requests.map((req) => (
                  <LeaveRequestCard key={req.leaveRequestId} req={req} />
                ))}
              </div>

              {activeTab === "All" && (
                <div className="flex flex-col gap-2">
                  <div className="text-zinc-500 font-semibold text-center">
                    Leave Summary
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
                    <Progress
                      type="circle"
                      percent={Math.round(
                        (summary.totalTaken / summary.totalAllowed) * 100
                      )}
                      format={() =>
                        `${summary.totalTaken}/${summary.totalAllowed}`
                      }
                      strokeColor={{ "0%": "#3CB4E7", "100%": "#E0F4FD" }}
                      trailColor="#F4F4F5"
                      strokeWidth={10}
                      size={150}
                    />
                  </div>

                  <div className="text-zinc-500 font-semibold text-center">
                    Leave Balances
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="space-y-4 -mt-1">
                      {balances.map((b, idx) => {
                        const pct = Math.round(
                          (b.remainingDays / b.defaultDays) * 100
                        );
                        const barColor = barColors[idx % barColors.length];
                        return (
                          <Tooltip
                            key={b.leaveTypeId}
                            title={`${b.leaveTypeName}: ${b.remainingDays} of ${b.defaultDays} days remaining`}
                            placement="top"
                          >
                            <div>
                              <p className="text-xs text-zinc-700 mb-1">
                                {b.leaveTypeName}
                              </p>
                              <div className="h-5 w-full bg-zinc-300 rounded-full relative">
                                <div
                                  className={`h-5 ${barColor} rounded-full relative`}
                                  style={{ width: `${pct}%` }}
                                >
                                  <div className="absolute right-0 top-0 bottom-0 w-2 h-5 rounded-r-full" />
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editable policy text */}
          <div className="text-center text-sm text-zinc-400 p-4 hover:text-zinc-500">
            {policy.split("\n").map((line, i) => (
              <p key={i} className="max-w-4xl mx-auto">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ApplyForLeaveModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmitSuccess={fetchEmployeeData}
      />
    </>
  );
};

export default EmployeeLeaveOverview;
