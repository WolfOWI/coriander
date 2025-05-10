import React from 'react';

type LeaveRequest = {
  leaveRequestId: number;
  employeeId: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  leaveType: string;
};

type LeaveCardAdminDashProps = {
  leave: LeaveRequest;
};

const LeaveCardAdminDash: React.FC<LeaveCardAdminDashProps> = ({ leave }) => {
  const start = new Date(leave.startDate);
  const end = new Date(leave.endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  return (
    <div className='hover:bg-sakura-500 p-3 rounded-xl flex flex-col border-2 border-sakura-500'>
      <h4 className='font-semibold text-md'>{leave.employeeName}</h4>
      <p className='text-xs'>ID: {leave.employeeId}</p>

      <h4 className="mt-2 font-medium text-sm">{leave.leaveType}</h4>
      <div className='flex justify-between font-light text-sm'>
        <p>{formatDate(start)} - {formatDate(end)}</p>
        <p>{days} {days === 1 ? 'Day' : 'Days'}</p>
      </div>
    </div>
  );
};

export default LeaveCardAdminDash;
