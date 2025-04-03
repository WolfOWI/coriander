// Wolf Botha
import React, { useEffect, useState } from "react";
import { empUserAPI } from "../../services/api.service";
import { useNavigate, useParams } from "react-router-dom";

// Import 3rd party components
import GaugeComponent from "react-gauge-component";
import { Avatar, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs"; // For simple date formatting
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with plugins
dayjs.extend(relativeTime);

// Import React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import CoriBadge from "../../components/badges/CoriBadge";
import EquipmentListItem from "../../components/equipment/EquipmentListItem";
import LeaveBalanceBlock from "../../components/leave/LeaveBalanceBlock";
import PerfReviewBox from "../../components/performanceReview/PerfReviewBox";
import EmployTypeBadge from "../../components/badges/EmployTypeBadge";
// Modals
import AdminEditEmpDetailsModal from "../../components/modals/AdminEditEmpDetailsModal";
import AdminAddEquipItemModal from "../../components/modals/AdminAddEquipItemModal";
import AdminManageEquipItemModal from "../../components/modals/AdminManageEquipItemModal";

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
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

// Import Utils
import { calculateNextPayDay, formatEmploymentDuration } from "../../utils/dateUtils";
import TerminateEmployeeModal from "../../components/modals/TerminateEmployeeModal";
import { formatPhone, formatRandAmount } from "../../utils/formatUtils";

// Types
import { EmployType, Gender, PayCycle } from "../../types/common";

// EmpUser Data Interface
interface EmpUser {
  userId: number;
  fullName: string;
  email: string;
  profilePicture: string;
  role: number;
  employeeId: number;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  salaryAmount: number;
  payCycle: PayCycle;
  lastPaidDate: string;
  employType: EmployType;
  employDate: string;
  isSuspended: boolean;
}

const AdminIndividualEmployee: React.FC = () => {
  // State to store the employee data with proper typing
  const [empUser, setEmpUser] = useState<EmpUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextPayDay, setNextPayDay] = useState<string | null>(null);
  const { employeeId } = useParams();

  // Modal States
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [showNewEquipmentModal, setShowNewEquipmentModal] = useState(false);
  const [showManageEquipmentModal, setShowManageEquipmentModal] = useState(false);
  const [showTerminateEmployeeModal, setShowTerminateEmployeeModal] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // On page load, fetch the employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (employeeId) {
          // Fetch the specific employee by ID
          const response = await empUserAPI.getEmpUserById(employeeId);
          setEmpUser(response.data);
        } else {
          // If no ID provided, redirect to employee management page
          navigate("/admin/employees");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        // Handle error case
        return <div>Something went wrong</div>;
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId, navigate]);

  // Calculate the next pay day & store it in state
  useEffect(() => {
    if (empUser) {
      setNextPayDay(calculateNextPayDay(empUser.payCycle, empUser.lastPaidDate));
    }
  }, [empUser]);

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
                {empUser.profilePicture ? (
                  <Avatar
                    src={empUser.profilePicture}
                    size={96}
                    className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                  />
                ) : (
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${empUser.fullName}`}
                    size={96}
                    className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                  />
                )}

                {/* <img
                  // src={empUser.profilePicture}
                  src=""
                  alt={`Pic`}
                  className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                /> */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-zinc-500">Employee ID {empUser.employeeId}</p>
                  <h2 className="text-zinc-900 font-bold text-3xl">{empUser.fullName}</h2>
                  <div className="flex gap-2 items-center">
                    <WorkIcon />
                    <p className="text-zinc-900">{empUser.jobTitle}</p>
                    <p className="text-zinc-900">•</p>
                    <p className="text-zinc-500">{empUser.department}</p>
                    {empUser.isSuspended ? (
                      <EmployTypeBadge status="suspended" />
                    ) : (
                      <EmployTypeBadge status={empUser.employType} />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <div className="flex">
                  <div className="flex flex-grow flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      {empUser.gender === Gender.Female ? (
                        <FemaleIcon className="text-pink-500" />
                      ) : empUser.gender === Gender.Male ? (
                        <MaleIcon className="text-blue-500" />
                      ) : (
                        <TransgenderIcon className="text-purple-500" />
                      )}
                      <p className="text-zinc-500">
                        {empUser.gender === Gender.Female
                          ? "Female"
                          : empUser.gender === Gender.Male
                          ? "Male"
                          : "Other"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <CakeIcon />
                      <p className="text-zinc-500">
                        {empUser.dateOfBirth}
                        <span className="text-zinc-400 text-sm ml-2">
                          {dayjs(empUser.dateOfBirth).fromNow(true)} old
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      <PhoneIcon />
                      <p className="text-zinc-500">{formatPhone(empUser.phoneNumber)}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <EmailIcon />
                      <p className="text-zinc-500">{empUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <AssistantPhotoIcon />
                  <p className="text-zinc-500">
                    Employed for {formatEmploymentDuration(empUser.employDate)}
                    <span className="text-zinc-400 text-sm ml-2">
                      ({dayjs(empUser.employDate).format("DD MMM YYYY")})
                    </span>
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
                  <p className="text-zinc-900 text-xl">{formatRandAmount(empUser.salaryAmount)}</p>
                  <p className="text-zinc-500 text-sm">
                    {empUser.payCycle === PayCycle.Monthly
                      ? "monthly"
                      : empUser.payCycle === PayCycle.BiWeekly
                      ? "bi-weekly"
                      : "weekly"}
                  </p>
                </div>
                <div className="flex w-full mt-2 gap-2 h-fit">
                  <div className="flex flex-col w-1/2 items-center">
                    <p className="text-zinc-500 text-sm mb-1">Last Paid</p>
                    <div className="flex justify-center items-center gap-2 p-4 bg-warmstone-200 w-full rounded-2xl h-full">
                      <DatePicker
                        value={dayjs(empUser.lastPaidDate)}
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
                      <p className="text-zinc-900">{nextPayDay}</p>
                      <CoriBadge text={`${dayjs(nextPayDay).fromNow()}`} size="x-small" />
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
        {/* MODALS */}
        {/* Edit Details Modal */}
        <AdminEditEmpDetailsModal
          showModal={showEditDetailsModal}
          setShowModal={setShowEditDetailsModal}
          employee={empUser}
        />

        {/* New Equipment Modal */}
        <AdminAddEquipItemModal
          showModal={showNewEquipmentModal}
          setShowModal={setShowNewEquipmentModal}
        />

        {/* Manage Equipment Modal */}
        <AdminManageEquipItemModal
          showModal={showManageEquipmentModal}
          setShowModal={setShowManageEquipmentModal}
        />

        {/* Terminate Employee Modal */}
        <TerminateEmployeeModal
          showModal={showTerminateEmployeeModal}
          setShowModal={setShowTerminateEmployeeModal}
        />
      </>
    </>
  );
};

export default AdminIndividualEmployee;
