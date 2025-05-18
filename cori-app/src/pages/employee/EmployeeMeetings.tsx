import React from "react";
import { Icons } from "../../constants/icons";
import CoriBtn from "../../components/buttons/CoriBtn";

const EmployeeMeetings: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto m-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icons.MeetingRoom fontSize="large" className="text-zinc-900" />
          <h1 className="text-3xl font-bold text-zinc-900">My Meetings</h1>
        </div>
        <div className="flex items-center gap-2">
          <CoriBtn>
            <Icons.Add />
            Request a Meeting
          </CoriBtn>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-warmstone-50 p-4 rounded-2xl">{/* Content will be added later */}</div>
    </div>
  );
};

export default EmployeeMeetings;
