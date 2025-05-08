import React from 'react';

const LeaveCardAdminDash: React.FC = () => {
  return (
    <div className='hover:bg-sakura-500 p-3 rounded-xl flex flex-col border-2 border-sakura-500'>
      <h4 className='font-semibold text-md'>Name & Surname</h4>
      <p className='text-xs'>00099877</p>

      <h4 className="mt-2 font-medium text-sm">Leave Type Here</h4>
      <div className='flex justify-between font-light text-sm'>
        <p>00/00/00 - 00/00/0000</p>
        <p>5 Days</p>
      </div>
    </div>
  );
}

export default LeaveCardAdminDash;