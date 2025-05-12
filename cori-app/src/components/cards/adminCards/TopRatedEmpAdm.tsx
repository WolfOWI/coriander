import React from "react";
import Icon from "../../../assets/icons/AdminAddIcon.png"; // Replace with the actual path to your icon
import CoriBadge from "../../../components/badges/CoriBadge";

const TopRatedEmpCard = () => {
    return (
        <div className="p-1">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center p-2 hover:bg-zinc-100 rounded-xl">
                    <img src={Icon} alt="Employee" className="rounded-full w-11 h-11" />
                    <div className="flex flex-col">
                        <span className="text-zinc-900 text-md">Employee Name</span>
                        <span className="text-zinc-500 text-xs">Job Title</span>
                    </div>
                    <CoriBadge size='small' text='Part time'></CoriBadge>
                    <span className="text-zinc-900">⭐ 5.0</span>
                </div>
            </div>
        </div>
    )
};

export default TopRatedEmpCard;