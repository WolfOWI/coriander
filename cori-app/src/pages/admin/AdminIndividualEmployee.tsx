// Wolf Botha
import React, { useEffect, useState } from "react";
import { empUserAPI } from "../../services/api.service";

// Import Components
import CoriBtn from "../../components/buttons/CoriBtn";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import CoriBadge from "../../components/CoriBadge";

// Import Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import FemaleIcon from "@mui/icons-material/Female";
import CakeIcon from "@mui/icons-material/Cake";
import PhoneIcon from "@mui/icons-material/PhoneAndroid";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import PayIcon from "@mui/icons-material/Payments";
import UndoIcon from "@mui/icons-material/Undo";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const AdminIndividualEmployee: React.FC = () => {
  // State to store the employee data
  const [empUser, setEmpUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // Call the API endpoint
        const response = await empUserAPI.getAllEmpUsers();

        // Update the state with the employee data
        setEmpUser(response.data.$values[0]);
      } finally {
        // Set loading to false when done
        setLoading(false);
      }
    };

    // Call the fetch function when component mounts
    fetchEmployee();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!empUser)
    return (
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <h2 className="text-zinc-900 font-bold text-3xl text-center">Backend Not Connected</h2>
        <h3 className="text-zinc-900 font-bold text-xl text-center">Hey Ruan / Ine / Kayla</h3>
        <p className="text-zinc-500 text-center">
          This page is very basically connected to the backend. If you are seeing this message, it
          means your front-end is not connecting to the backend.
          <br />
          <br />
          First, you'll need to create a ".env" file in the root of this project (in cori-app).
          Inside it, add this line: VITE_API_URL=http://localhost:5121/api
          <br />
          <br />
          Secondly, you'll actually need to run the backend on your computer. (Open our coriander
          backend project in your VSCode, cd into CoriCore, and then 'dotnet run' so that swagger is
          open and running.)
        </p>
      </div>
    );

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
          {/* Employee Details */}
          <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col">
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Employee"
                className="bg-green-50 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-zinc-500">Employee ID {empUser.employeeId}</p>
                <h2 className="text-zinc-900 font-bold text-3xl">{empUser.fullName}</h2>
                <div className="flex gap-2 items-center">
                  <WorkIcon />
                  <p className="text-zinc-900">{empUser.jobTitle}</p>
                  <p className="text-zinc-900">•</p>
                  <p className="text-zinc-500">{empUser.department}</p>
                  {/* TODO: Add dynamic work-type badge */}
                  <CoriBadge text="Full-Time" size="small" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <div className="flex">
                <div className="flex flex-grow flex-col gap-4">
                  <div className="flex gap-2 items-center">
                    <FemaleIcon className="text-pink-500" />
                    <p className="text-zinc-500">Female</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <CakeIcon />
                    <p className="text-zinc-500">
                      01 Jan 2025 <span className="text-zinc-400 text-sm">(32 years old)</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-grow flex-col gap-4">
                  <div className="flex gap-2 items-center">
                    <PhoneIcon />
                    <p className="text-zinc-500">+27 (12) 345 6789</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <EmailIcon />
                    <p className="text-zinc-500">email@email.com</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <AssistantPhotoIcon />
                <p className="text-zinc-500">
                  Employed for 2 Years, 3 Months, 10 Days{" "}
                  <span className="text-zinc-400 text-sm">(1 Jan 2025)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payroll Information */}
          <div className="w-full flex flex-col gap-2 items-center">
            <h2 className="text-zinc-500 font-semibold">Payroll</h2>
            <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
              <p className="text-zinc-500 text-sm mb-1">Salary</p>
              <div className="flex flex-col items-center p-4 bg-warmstone-200 w-full rounded-2xl">
                <p className="text-zinc-900 text-xl">R12,345.00</p>
                <p className="text-zinc-500 text-sm">monthly</p>
              </div>
              <div className="flex w-full mt-2 gap-2">
                <div className="flex flex-col flex-grow items-center">
                  <p className="text-zinc-500 text-sm mb-1">Last Paid</p>
                  <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl">
                    <p className="text-zinc-900">01 Jan 2025</p>
                    <CoriCircleBtn style="black" icon={<EditIcon />} />
                  </div>
                </div>
                <div className="flex flex-col flex-grow items-center">
                  <p className="text-zinc-500 text-sm mb-1">Last Paid</p>
                  <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl">
                    <p className="text-zinc-900">01 Jan 2025</p>
                    <CoriBadge color="white" text="4 days to go" size="medium" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full mt-4">
                <CoriBtn secondary style="black">
                  <UndoIcon />
                  Undo Payment
                </CoriBtn>
                <CoriBtn secondary style="black">
                  Pay Now
                  <PayIcon />
                </CoriBtn>
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div className="w-full flex flex-col gap-2 items-center">
            <div className="flex gap-2 items-center">
              <h2 className="text-zinc-500 font-semibold">Equipment</h2>
              <CoriCircleBtn icon={<AddIcon />} />
            </div>
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
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center">
                Leave 6
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
