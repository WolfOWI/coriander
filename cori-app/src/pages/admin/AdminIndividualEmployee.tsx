// Wolf Botha
import React from "react";

// Import Components
import CoriBtn from "../../components/buttons/CoriBtn";

// Import Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkIcon from "@mui/icons-material/Work";

const AdminIndividualEmployee: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Heading with buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <CoriBtn style="black" iconOnly>
            <ArrowBackIcon />
          </CoriBtn>
          <h1 className="text-3xl font-bold text-zinc-900">Employee Details</h1>
        </div>
        <div className="flex gap-2">
          <CoriBtn secondary style="black">
            Edit Details
          </CoriBtn>
          <CoriBtn primary style="black">
            Suspend
          </CoriBtn>
          <CoriBtn primary style="red">
            Terminate
          </CoriBtn>
        </div>
      </div>
      {/* Page Body */}
      <div className="flex gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col">
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Employee"
                className="bg-green-50 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-zinc-500">Employee ID 002123</p>
                <h2 className="text-zinc-900 font-bold text-3xl">Lettie Dlamnini</h2>
                <div className="flex gap-2 items-center">
                  <WorkIcon />
                  <p className="text-zinc-900">Accountant</p>
                  <p className="text-zinc-900">•</p>
                  <p className="text-zinc-500">Finance Department</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 items-center">
            <h2 className="text-zinc-500 font-semibold">Payroll</h2>
            <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
              Payroll Details
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 items-center">
            <h2 className="text-zinc-500 font-semibold">Equipment</h2>
            <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
              Equipment List
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex gap-4">
            <div className="w-3/12 flex flex-col items-center gap-2">
              <h2 className="text-zinc-500 font-semibold">Leave</h2>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                Leave 1
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                Leave 2
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                Leave 3
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                Leave 4
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                Leave 5
              </div>
            </div>
            <div className="w-9/12 flex flex-col gap-4 ">
              <div className="w-full flex flex-col gap-2 items-center">
                <h2 className="text-zinc-500 font-semibold">Rating</h2>
                <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                  Rating Chart
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 items-center">
                <h2 className="text-zinc-500 font-semibold">Performance Reviews</h2>
                <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                  Performance Review 1
                </div>
                <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                  Performance Review 2
                </div>
                <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                  Performance Review 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIndividualEmployee;
