import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Custom React Components
import CoriBtn from "../../components/buttons/CoriBtn";
import CoriCircleBtn from "../../components/buttons/CoriCircleBtn";
import EquipmentListItem from "../../components/equipment/EquipmentListItem";
import EmpEditEmpDetailsModal from "../../components/modals/EmpEditEmpDetailsModal";
import ProfilePicUploadBtn from "../../components/uploading/ProfilePicUploadBtn";

// 3rd Party Components
import { Avatar, message, Spin } from "antd";

// Import Icons
import { Icons } from "../../constants/icons";

// Functionality
import { empUserAPI, pageAPI } from "../../services/api.service";
import dayjs from "dayjs";

// Types & Interfaces
import { EmployType, Gender, PayCycle } from "../../types/common";
import { EmpUser } from "../../interfaces/people/empUser";
import { EmpUserRatingMetrics } from "../../interfaces/people/empUserRatingMetrics";

// Utility Functions
import { formatPhone } from "../../utils/formatUtils";
import { formatEmploymentDuration } from "../../utils/dateUtils";
import { generatePayrollPDF } from "../../utils/pdfUtils";
import { getFullCurrentUser } from "../../services/authService";

interface Equipment {
  equipmentId: number;
  employeeId: number;
  equipmentCatId: number;
  equipmentCategoryName: string;
  equipmentName: string;
  assignedDate: string;
  condition: number;
}

interface EmployeeProfileResponse {
  empUser: EmpUser;
  empUserRatingMetrics: EmpUserRatingMetrics;
  equipment: {
    $values: Equipment[];
  };
}

const EmployeeProfile: React.FC = () => {
  const [profileData, setProfileData] =
    useState<EmployeeProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // const { employeeId } = useParams();
  // TODO Temporary set employee ID (TODO: Fetch from logged in user)
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  useEffect(() => {
    const fetchUserAndSetId = async () => {
      const user = await getFullCurrentUser();
      if (user?.employeeId) {
        setEmployeeId(user.employeeId);
      }
    };
    fetchUserAndSetId();
  }, []);

  // Fetch employee data
  const fetchEmployee = async () => {
    try {
      if (employeeId) {
        const response = await pageAPI.getEmployeeProfile(
          employeeId.toString()
        );
        setProfileData(response.data);
      } else {
        messageApi.error("No ID found - can't display employee details");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      messageApi.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // On page load, fetch the employee data
  useEffect(() => {
    fetchEmployee();
  }, [employeeId, navigate]);

  const handleProfilePicUploadSuccess = async (url: string) => {
    // console.log("Profile picture URL:", url);
    if (employeeId !== null) {
      const response = await empUserAPI.updateEmpUserById(
        employeeId.toString(),
        {
          profilePicture: url,
        }
      );
    } else {
      messageApi.error("Employee ID is not available.");
    }

    // wait for response before fetching employee data
    await response.data;
    fetchEmployee();
  };

  // useEffect(() => {
  //   console.log(profileData);
  // }, [profileData]);

  if (loading)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Spin size="large" />
      </div>
    );

  if (!profileData)
    return (
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <h2 className="text-zinc-900 font-bold text-3xl text-center">
          Your Profile Couldn't Be Loaded
        </h2>
      </div>
    );

  const { empUser, empUserRatingMetrics, equipment } = profileData;

  return (
    <>
      {contextHolder}
      <div className="max-w-7xl mx-auto m-4">
        {/* Top buttons */}
        <div className="flex justify-end items-center">
          <div className="flex gap-2 z-10">
            <CoriBtn
              secondary
              style="black"
              onClick={() => setShowEditDetailsModal(true)}
            >
              <Icons.Edit />
              Edit Details
            </CoriBtn>
            <CoriBtn style="black" onClick={() => generatePayrollPDF(empUser)}>
              <Icons.Download />
              Payroll PDF
            </CoriBtn>
          </div>
        </div>
        {/* Page Content */}
        <div className="flex flex-col items-center gap-3 z-0">
          <div className="flex flex-col gap-7 items-center w-2/3">
            {/* Profile Picture & Name */}
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
                    <ProfilePicUploadBtn
                      onUploadSuccess={handleProfilePicUploadSuccess}
                      className="absolute bottom-0 right-0"
                    />
                  ) : (
                    <CoriCircleBtn
                      icon={<Icons.Google />}
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
                    <ProfilePicUploadBtn
                      onUploadSuccess={handleProfilePicUploadSuccess}
                      className="absolute bottom-0 right-0"
                    />
                  ) : (
                    <CoriCircleBtn
                      icon={<Icons.Google />}
                      style="black"
                      className="absolute bottom-0 right-0"
                    />
                  )}
                </div>
              )}
              <div className="flex gap-3 items-center">
                <h2 className="text-zinc-900 font-bold text-3xl">
                  {empUser.fullName}
                </h2>
                {empUserRatingMetrics && (
                  <div className="flex items-center gap-1">
                    <Icons.StarRounded className="text-yellow-500" />
                    <p className="text-zinc-500 text-xl">
                      {empUserRatingMetrics.averageRating.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col w-full">
              <div className="flex">
                {/* Left Side */}
                <div className="flex flex-grow flex-col gap-4 w-1/2">
                  <div className="flex gap-2 items-center">
                    {empUser.gender === Gender.Female ? (
                      <Icons.Female className="text-pink-500" />
                    ) : empUser.gender === Gender.Male ? (
                      <Icons.Male className="text-blue-500" />
                    ) : (
                      <Icons.Transgender className="text-purple-500" />
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
                    <Icons.Cake />
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
                    <Icons.Phone />
                    <p className="text-zinc-500">
                      {formatPhone(empUser.phoneNumber)}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Icons.Email />
                    <p className="text-zinc-500">{empUser.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment & Payroll Info */}
            <div className="flex flex-col gap-2 items-center w-full">
              <div className="flex gap-2 items-center">
                <h2 className="text-zinc-500 font-semibold">
                  Employment & Payroll
                </h2>
              </div>
              <div className="bg-warmstone-50 p-4 rounded-2xl flex flex-col w-full">
                <div className="flex flex-col gap-4">
                  <div className="flex">
                    {/* Left Side */}
                    <div className="flex flex-grow flex-col gap-4 w-1/2">
                      <div className="flex gap-2 items-center">
                        <Icons.Work />
                        <p className="text-zinc-500">{empUser.jobTitle}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Icons.CorporateFare />
                        <p className="text-zinc-500">
                          {empUser.department} Department
                        </p>
                      </div>
                    </div>
                    {/* Right Side */}
                    <div className="flex flex-grow flex-col gap-4 w-1/2">
                      <div className="flex gap-2 items-center">
                        <Icons.Schedule />
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
                        <Icons.Badge />
                        <p className="text-zinc-500">
                          Employee ID {empUser.employeeId}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Bottom Employed for */}
                  <div className="flex gap-2 items-center">
                    <Icons.AssistantPhoto />
                    <p className="text-zinc-500">
                      Employed for{" "}
                      {formatEmploymentDuration(empUser.employDate)}
                      <span className="text-zinc-400 text-sm ml-2">
                        (Since {dayjs(empUser.employDate).format("DD MMM YYYY")}
                        )
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
                {equipment.$values.map((item) => (
                  <EquipmentListItem key={item.equipmentId} item={item} />
                ))}
                {/* Empty Message */}
                {equipment.$values.length === 0 && (
                  <p className="text-zinc-500 py-4">No Equipment Assigned</p>
                )}
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
