import React from 'react';

  interface LeaveRequest {
    leaveRequestId: number;
    employeeId: number;
    employeeName: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    createdAt: string;
  }

  interface LeaveCardAdminDashProps {
    leave: LeaveRequest;
  }

const LeaveCardAdminDash: React.FC<LeaveCardAdminDashProps> = ({ leave }) => {
  const start = new Date(leave.startDate);
  const end = new Date(leave.endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return (
    <div className="hover:bg-sakura-500 p-3 rounded-xl flex flex-col border-2 border-sakura-500 group transition-colors duration-200">
      <h4 className="font-semibold text-md">{leave.employeeName}</h4>
      <p className="text-xs">Submitted on {new Date(leave.createdAt).toLocaleDateString()} </p>

      <div className="hidden-0 max-h-0 overflow-hidden group-hover:hidden-1 group-hover:max-h-44 group-hover:mt-2 transition-all duration-300 ease-in-out">
        <h4 className="text-zinc-900 font-medium text-sm">Leave Type: {leave.leaveType}</h4>
        <div className="flex justify-between font-light text-sm">
          <p>
            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
          </p>
          <p>
            {days} {days === 1 ? 'Day' : 'Days'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaveCardAdminDash;
