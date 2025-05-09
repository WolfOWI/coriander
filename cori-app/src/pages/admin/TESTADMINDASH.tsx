//Kayla Posthumus

import React from "react";
import "../../styles/adminDash.css"
import BarChartCard from "../../components/charts/BarChart";
import DoughnutChartCard from "../../components/charts/DoughnutChart";

const AdminDashboard: React.FC = () => {

  
  return (
    <div className="mx-auto m-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-zinc-900">Welcome, (Admin Name)</h1>
      <h4 className="text-zinc-900 mb-3">Stay updated on key HR activities and pending tasks.</h4>
      <div className="line-horisontal mb-4"></div>

      {/* Page Body */}
      <div className="flex gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

        {/* Column 1 */}
        <div className="flex-1 space-y-4">
          {/* Employee Ratings Chart */}
          <div className="items-center">
            <div className="text-zinc-500 font-semibold text-center mb-2">Employee Ratings</div>
              <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
                <BarChartCard />
              </div>
          </div>

          {/* Leave Requests */}
          <div className="items-center">
            <div className="text-zinc-500 font-semibold text-center mb-2">Leave Requests</div>
              <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
                <h2 className="text-xl text-zinc-900">leave columns</h2>
              </div>
          </div>
          {/* View More Button */}
          <button className="block mx-auto text-sm underline">View More</button>
        </div>
          
        {/* Column 2 */}
        <div className=" flex-[0.7] space-y-4">
          {/* Employment Donut Chart */}
          <div className="items-center">
            <div className="text-zinc-500 font-semibold text-center mb-2">Employment Overview</div>
              <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
                
              </div>
          </div>

          {/* New Review + Rate Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-corigreen-500 text-warmstone-200 p-4 rounded-2xl font-semibold shadow flex">
              New Performance Review +
            </button>
            <button className="bg-corigreen-500 text-warmstone-200 p-4 rounded-2xl font-semibold shadow flex">
              Rate an Employee +
            </button>
          </div>

          {/* Payments Overview */}
          <div className="items-center">
            <div className="text-zinc-500 font-semibold text-center mb-2">Employment Overview</div>
              <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col shadow">
                <h2 className="text-xl text-zinc-900">Chart</h2>
              </div>
          </div>

        </div>

        {/* Column 3 */}
        <div className="flex-1 space-y-4">
          {/* Calendar */}
          <div className="bg-warmstone-50 p-4 rounded-2xl shadow">Performance Reviews Calendar</div>

          {/* Meetings List */}
          <div className="bg-warmstone-50 p-4 rounded-2xl shadow">Meeting Card</div>
          <div className="bg-warmstone-50 p-4 rounded-2xl shadow">Meeting Card</div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;