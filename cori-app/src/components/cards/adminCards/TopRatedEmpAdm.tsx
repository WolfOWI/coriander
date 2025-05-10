import React from "react";
import Icon from "../../../assets/icons/AdminAddIcon.png"; // You can later customize this per employee
import CoriBadge from "../../../components/badges/CoriBadge";

type TopRatedEmployee = {
  employeeId: number;
  fullName: string;
  averageRating: number;
  numberOfRatings: number;
  mostRecentRating: number;
  jobTitle?: string; // Optional if available
  employmentType?: string; // Optional if you want to use this in the badge
};

type TopRatedEmpCardProps = {
  employees: TopRatedEmployee[];
};

const TopRatedEmpCard: React.FC<TopRatedEmpCardProps> = ({ employees }) => {
  return (
    <div className="p-1">
      <div className="flex flex-col gap-2">
        {employees.map((emp) => (
          <div
            key={emp.employeeId}
            className="flex justify-between items-center p-2 hover:bg-zinc-100 rounded-xl"
          >
            <img
              src={Icon}
              alt={`${emp.fullName}`}
              className="rounded-full w-11 h-11"
            />
            <div className="flex flex-col">
              <span className="text-zinc-900 text-md">{emp.fullName}</span>
              <span className="text-zinc-500 text-xs">
                {emp.jobTitle ?? "Employee"}
              </span>
            </div>
            <CoriBadge size="small" text={emp.employmentType ?? "Rating"} />
            <span className="text-zinc-900">⭐ {emp.averageRating.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedEmpCard;
