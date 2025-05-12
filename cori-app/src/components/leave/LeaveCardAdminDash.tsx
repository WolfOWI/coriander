import React from 'react';

interface LeaveRequest {
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  defaultDays: number;
  createdAt: string;
}

const LeaveCardAdminDash: React.FC<LeaveRequest> = ({ employeeName, leaveType, startDate, endDate, createdAt }) => {
  return (
    <div className='hover:bg-sakura-500 p-3 rounded-xl flex flex-col border-2 border-sakura-500'>
      <h4 className='font-semibold text-md'>{employeeName}</h4>
      <p className='text-xs'>Submitted on {new Date(createdAt).toLocaleDateString()}</p>

      <h4 className="mt-2 font-medium text-sm">Leave Type: {leaveType}</h4>
      <div className='flex justify-between font-light text-sm'>
        <p>{new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
        <p>** Days</p>
      </div>
    </div>
  );
};

export default LeaveCardAdminDash;