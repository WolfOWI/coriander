import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Custom React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import EquipmentListItem from "../../components/equipment/EquipmentListItem";
import EmpEditEmpDetailsModal from "../../components/modals/EmpEditEmpDetailsModal";

// 3rd Party Components
import { Avatar, message } from "antd";

// Import Google Icons
import EditIcon from "@mui/icons-material/Edit";
import WorkIcon from "@mui/icons-material/Work";
import CakeIcon from "@mui/icons-material/Cake";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import StarIcon from "@mui/icons-material/StarRounded";
import AddIcon from "@mui/icons-material/Add";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BadgeIcon from "@mui/icons-material/Badge";
import GoogleIcon from "@mui/icons-material/Google";

// Functionality
import { empUserAPI } from "../../services/api.service";
import dayjs from "dayjs";

// Types
import { EmployType, Gender, PayCycle } from "../../types/common";

// Utility Functions
import { formatPhone } from "../../utils/formatUtils";
import { formatEmploymentDuration } from "../../utils/dateUtils";

// EmpUser Data Interface
interface EmpUser {
  userId: number;
  fullName: string;
  email: string;
  googleId: string | null;
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

const EmployeeProfile: React.FC = () => {
  const [empUser, setEmpUser] = useState<EmpUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const { employeeId } = useParams();
  // TODO Temporary set employee ID (TODO: Fetch from URL)
  const employeeId = "2";
  const navigate = useNavigate();

  // Modal States
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);

  // Message System
  const [messageApi, contextHolder] = message.useMessage();

  // Function to fetch employee data
  const fetchEmployee = async () => {
    try {
      if (employeeId) {
        // Fetch the specific employee by ID
        const response = await empUserAPI.getEmpUserById(employeeId);
        setEmpUser(response.data);
      } else {
        // Show an error message if no ID provided
        messageApi.error("No ID provided - can't display employee details");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      // Show an error message if something went wrong
      messageApi.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // On page load, fetch the employee data
  useEffect(() => {
    fetchEmployee();
  }, [employeeId, navigate]);

  // useEffect(() => {
  //   console.log(empUser);
  // }, [empUser]);

  if (loading) return <div>Loading...</div>;

  if (!empUser) return <div>No employee found</div>;
  return (
    <>
      {contextHolder}
      <div className="max-w-7xl mx-auto">
        {/* Top buttons */}
        <div className="flex justify-end items-center ">
          <div className="flex gap-2 z-10">
            <CoriBtn secondary style="black" onClick={() => setShowEditDetailsModal(true)}>
              <EditIcon />
              Edit Details
            </CoriBtn>
            <CoriBtn style="black">Export Payroll Info</CoriBtn>
          </div>
        </div>
        {/* Page Content */}
        <div className="flex flex-col items-center gap-3 z-0">
          <div className="flex flex-col gap-7 items-center w-2/3">
            {/* Profile Picture & Name */}
            {/* {empUser.googleId === null ? <p>Google</p> : <p>Email</p>} */}
            <div className="flex flex-col gap-3 items-center">
              {/* If user has a profile picture */}
              {empUser.profilePicture ? (
                <div className="relative">
                  <Avatar
                    src={empUser.profilePicture}
                    size={128}
                    className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                  />
                  {/* If user is not a google user */}
                  {empUser.googleId === null ? (
                    <CoriCircleBtn icon={<EditIcon />} className="absolute bottom-0 right-0" />
                  ) : (
                    <CoriCircleBtn
                      icon={<GoogleIcon />}
                      style="black"
                      className="absolute bottom-0 right-0"
                    />
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${empUser.fullName}`}
                    size={128}
                    className="bg-warmstone-600 h-24 w-24 rounded-full object-cover border-2 border-zinc-700"
                  />
                  {/* If user is not a google user */}
                  {empUser.googleId === null ? (
                    <CoriCircleBtn
                      icon={<AddIcon />}
                      style="black"
                      className="absolute bottom-0 right-0"
                    />
                  ) : (
                    <CoriCircleBtn
                      icon={<GoogleIcon />}
                      style="black"
                      className="absolute bottom-0 right-0"
                    />
                  )}
                </div>
              )}
              <div className="flex gap-3 items-center">
                <h2 className="text-zinc-900 font-bold text-3xl">{empUser.fullName}</h2>
                <div className="flex items-center gap-1">
                  <StarIcon className="text-yellow-500" />
                  <p className="text-zinc-500 text-xl">X.XX</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col w-full">
              <div className="flex">
                {/* Left Side */}
                <div className="flex flex-grow flex-col gap-4 w-1/2">
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
                      {dayjs(empUser.dateOfBirth).format("DD MMM YYYY")}
                      <span className="text-zinc-400 text-sm ml-2">
                        ({dayjs(empUser.dateOfBirth).fromNow(true)} old)
                      </span>
                    </p>
                  </div>
                </div>
                {/* Right Side */}
                <div className="flex flex-grow flex-col gap-4 w-1/2">
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
            </div>

            {/* Employment & Payroll Info */}
            <div className="flex flex-col gap-2 items-center w-full">
              <div className="flex gap-2 items-center">
                <h2 className="text-zinc-500 font-semibold">Employment & Payroll</h2>
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col w-full">
                <div className="flex flex-col gap-4">
                  <div className="flex">
                    {/* Left Side */}
                    <div className="flex flex-grow flex-col gap-4 w-1/2">
                      <div className="flex gap-2 items-center">
                        <WorkIcon />
                        <p className="text-zinc-500">{empUser.jobTitle}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <CorporateFareIcon />
                        <p className="text-zinc-500">{empUser.department} Department</p>
                      </div>
                    </div>
                    {/* Right Side */}
                    <div className="flex flex-grow flex-col gap-4 w-1/2">
                      <div className="flex gap-2 items-center">
                        <ScheduleIcon />
                        <p className="text-zinc-500">
                          {empUser.employType === EmployType.FullTime
                            ? "Full-Time"
                            : empUser.employType === EmployType.PartTime
                            ? "Part-Time"
                            : empUser.employType === EmployType.Contract
                            ? "Contract"
                            : "Intern"}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <BadgeIcon />
                        <p className="text-zinc-500">Employee ID {empUser.employeeId}</p>
                      </div>
                    </div>
                  </div>
                  {/* Bottom Employed for */}
                  <div className="flex gap-2 items-center">
                    <AssistantPhotoIcon />
                    <p className="text-zinc-500">
                      Employed for {formatEmploymentDuration(empUser.employDate)}
                      <span className="text-zinc-400 text-sm ml-2">
                        (Since {dayjs(empUser.employDate).format("DD MMM YYYY")})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div className="w-full flex flex-col gap-2 items-center">
              <div className="flex gap-2 items-center">
                <h2 className="text-zinc-500 font-semibold">Equipment</h2>
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-4">
                {/* TODO: Add dynamic equipment list items */}
                <EquipmentListItem item={null} />
                <EquipmentListItem item={null} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmpEditEmpDetailsModal
        showModal={showEditDetailsModal}
        setShowModal={setShowEditDetailsModal}
        employee={empUser}
        onUpdate={fetchEmployee}
      />
    </>
  );
};

export default EmployeeProfile;
