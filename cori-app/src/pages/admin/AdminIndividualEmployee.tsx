// Wolf Botha
import React, { useEffect, useState, useRef } from "react";
import { empUserAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

// Import 3rd party components
import GaugeComponent from "react-gauge-component";
import { Modal } from "react-bootstrap";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs"; // For simple date formatting
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with plugins
dayjs.extend(relativeTime);

// Import React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import CoriBadge from "../../components/CoriBadge";
import EquipmentListItem from "../../components/equipment/EquipmentListItem";
import LeaveBalanceBlock from "../../components/leave/LeaveBalanceBlock";
import PerfReviewBox from "../../components/performanceReview/PerfReviewBox";
// Modals
import AdminEditEmpDetailsModal from "../../components/modals/AdminEditEmpDetailsModal";
import AdminAddEquipItemModal from "../../components/modals/AdminAddEquipItemModal";

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
import StarRoundedIcon from "@mui/icons-material/StarRounded";

// Import Utils
import { formatEmploymentDuration } from "../../utils/dateUtils";

const AdminIndividualEmployee: React.FC = () => {
  // State to store the employee data (just a placeholder for now)
  const [empUser, setEmpUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [showNewEquipmentModal, setShowNewEquipmentModal] = useState(false);
  const [showManageEquipmentModal, setShowManageEquipmentModal] = useState(false);
  const [showTerminateEmployeeModal, setShowTerminateEmployeeModal] = useState(false);

  // Navigation
  const navigate = useNavigate();

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
    <>
      <div className="max-w-7xl mx-auto">
        {/* Top Heading with buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <CoriBtn style="black" iconOnly onClick={() => navigate("/admin/employees")}>
              <ArrowBackIcon />
            </CoriBtn>
            <h1 className="text-3xl font-bold text-zinc-900">Employee Details</h1>
          </div>
          <div className="flex gap-2">
            <CoriBtn secondary style="black" onClick={() => setShowEditDetailsModal(true)}>
              <EditIcon />
              Edit Details
            </CoriBtn>
            <CoriBtn style="black">Suspend</CoriBtn>
            <CoriBtn style="red" onClick={() => setShowTerminateEmployeeModal(true)}>
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
                        01 Jan 1998{" "}
                        <span className="text-zinc-400 text-sm ml-2">
                          {dayjs("01-01-1998").fromNow(true)} old
                        </span>
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
                    Employed for {formatEmploymentDuration("2024-01-01")}
                    <span className="text-zinc-400 text-sm ml-2">(1 Jan 2024)</span>
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
                <div className="flex w-full mt-2 gap-2 h-fit">
                  <div className="flex flex-col w-1/2 items-center">
                    <p className="text-zinc-500 text-sm mb-1">Last Paid</p>
                    <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                      <DatePicker
                        defaultValue={dayjs("2025-01-01")}
                        format="DD MMM YYYY"
                        suffixIcon={<CoriCircleBtn style="black" icon={<EditIcon />} />}
                        allowClear={false}
                        variant="borderless"
                        className="hover:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2 items-center">
                    <p className="text-zinc-500 text-sm mb-1">Next Pay Day</p>
                    <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                      <p className="text-zinc-900">01 Feb 2025</p>
                      <CoriBadge text="4 days to go" size="x-small" />
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
                <CoriCircleBtn icon={<AddIcon />} onClick={() => setShowNewEquipmentModal(true)} />
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-4">
                {/* TODO: Add dynamic equipment list items */}
                <EquipmentListItem device={null} onEdit={() => setShowManageEquipmentModal(true)} />
                <EquipmentListItem device={null} onEdit={() => setShowManageEquipmentModal(true)} />
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex gap-4">
              {/* Leave Balances */}
              <div className="w-3/12 flex flex-col items-center gap-2">
                <h2 className="text-zinc-500 font-semibold">Leave</h2>
                {/* TODO: Add dynamic leave balance blocks */}
                <div className="flex flex-col gap-3">
                  <LeaveBalanceBlock />
                  <LeaveBalanceBlock />
                  <LeaveBalanceBlock />
                  <LeaveBalanceBlock />
                  <LeaveBalanceBlock />
                  <LeaveBalanceBlock />
                </div>
              </div>
              {/* Rating & Performance Reviews */}
              <div className="w-9/12 flex flex-col gap-4 max-w-9/12">
                <div className="w-full flex flex-col gap-2 items-center">
                  <h2 className="text-zinc-500 font-semibold">Average Rating</h2>
                  {/* TODO: Decide on graph design */}
                  {/* <div className="flex gap-2 items-center">
                  <StarRoundedIcon />
                  <p className="text-zinc-900 text-2xl font-bold">3.23</p>
                </div> */}
                  <div className="w-full p-4 bg-warmstone-50 rounded-2xl">
                    <GaugeComponent
                      minValue={0}
                      maxValue={500}
                      value={425}
                      type="semicircle"
                      labels={{
                        valueLabel: {
                          formatTextValue: (value) => `${value / 100}`,
                          style: { fontSize: "32px", fill: "#18181b" },
                        },
                        tickLabels: {
                          hideMinMax: false,
                          defaultTickValueConfig: {
                            formatTextValue: (value) => `${value / 100}`,
                            style: { fontSize: "16px", fill: "#18181b" },
                          },
                        },
                      }}
                      arc={{
                        nbSubArcs: 5,
                        colorArray: ["#d32f2f", "#f57c00", "#fbc02d", "#388e3c", "#1976d2"],
                        padding: 0.02,
                        width: 0.2,
                      }}
                      pointer={{
                        // animationDelay: 1000,
                        type: "arrow",
                        animationDuration: 1000,
                      }}
                    />
                  </div>
                  {/* <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center"></div> */}
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                  <h2 className="text-zinc-500 font-semibold">Performance Reviews</h2>
                  <div className="w-full h-[580px] overflow-y-auto gap-4 flex flex-col rounded-2xl relative scrollbar-hide [&::-webkit-scrollbar]:hidden">
                    {/* TODO: Add dynamic performance review boxes */}
                    <PerfReviewBox />
                    <PerfReviewBox />
                    <PerfReviewBox />
                    <PerfReviewBox />
                    {/* Empty Spacer Overlay (for fade out effect) */}
                    <div className="py-10 w-full bg-gradient-to-b from-transparent to-stone-200 sticky bottom-0 left-0 right-0 text-transparent">
                      _
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {/* Edit Details Modal */}
        <AdminEditEmpDetailsModal
          showModal={showEditDetailsModal}
          setShowModal={setShowEditDetailsModal}
        />

        {/* New Equipment Modal */}
        <AdminAddEquipItemModal
          showModal={showNewEquipmentModal}
          setShowModal={setShowNewEquipmentModal}
        />

        {/* Manage Equipment Modal */}
        <Modal show={showManageEquipmentModal} onHide={() => setShowManageEquipmentModal(false)}>
          <Modal.Header closeButton className="border-0 p-8 bg-warmstone-100">
            <Modal.Title>
              <h2 className="text-zinc-900 font-bold text-3xl">Manage Equipment</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-8">Text fields here</Modal.Body>
          <Modal.Footer className="border-0 p-8">
            <div className="flex gap-2 w-full">
              <CoriBtn
                secondary
                style="black"
                onClick={() => setShowManageEquipmentModal(false)}
                className="w-full"
              >
                Cancel
              </CoriBtn>
              <CoriBtn style="red" className="w-full">
                Delete
              </CoriBtn>
              <CoriBtn className="w-full" onClick={() => setShowManageEquipmentModal(false)}>
                Save
              </CoriBtn>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Terminate Employee Modal */}
        <Modal
          show={showTerminateEmployeeModal}
          onHide={() => setShowTerminateEmployeeModal(false)}
        >
          <Modal.Header closeButton className="border-0 p-8 bg-warmstone-100 flex">
            <Modal.Title>
              <h2 className="text-zinc-900 font-bold text-3xl">Warning!</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-8">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-red-600 font-bold text-2xl">
                You're about to delete Lettie Dlamini.
              </h2>
              <p className="text-zinc-500 text-sm">
                All associated records (equipment, performance reviews, leave requests, and
                balances) will also be deleted. The user's account will remain, but access to this
                management system will be revoked.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 p-8">
            <div className="flex gap-2 w-full">
              <CoriBtn
                secondary
                onClick={() => setShowTerminateEmployeeModal(false)}
                className="w-full"
              >
                Cancel
              </CoriBtn>
              <CoriBtn style="red" className="w-full">
                Delete
              </CoriBtn>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default AdminIndividualEmployee;
